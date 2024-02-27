<?php

namespace Woodev\Russian_Post\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AJAX {

	public function __construct() {

		add_action( 'wp_ajax_nopriv_get_post_office', array( $this, 'get_post_office' ) );
		add_action( 'wp_ajax_get_post_office', array( $this, 'get_post_office' ) );

		add_action( 'wp_ajax_nopriv_set_russian_post_point', array( $this, 'set_point' ) );
		add_action( 'wp_ajax_set_russian_post_point', array( $this, 'set_point' ) );

		add_action( 'wp_ajax_russian_post_order_action', array( $this, 'order_actions' ) );
	}

	public function get_post_office() {

		try {

			if ( ! isset( $_POST, $_POST['post_code'] ) || empty( $_POST['post_code'] ) ) {
				throw new \Woodev_Plugin_Exception( 'Не указан обязательный параметр "Почтовый индекс".' );
			}

			$post_office = wc_russian_post_shipping()->get_api()->get_post_office( wc_clean( $_POST['post_code'] ) );

			if ( ! $post_office ) {
				throw new \Woodev_Plugin_Exception( sprintf( 'Не удалось получить информацию по почтовому индексу %s', $_POST['post_code'] ) );
			}

			wp_send_json_success( $post_office );

		} catch ( \Woodev_Plugin_Exception $exception ) {
			wp_send_json_error( $exception->getMessage() );
		}
	}

	public function set_point() {

		try {

			if ( ! wp_verify_nonce( \Woodev_Helper::get_post( 'nonce' ), 'wc_russian_post_point_notice' ) ) {
				throw new \Woodev_Plugin_Exception( 'Проверка секретного ключа не прошла.' );
			}

			$data = $_POST['data'];

			if ( empty( $data ) ) {
				throw new \Woodev_Plugin_Exception( 'Данные об отделении почты РФ пустые.' );
			}

			$clean_address = wc_russian_post_shipping()->get_api()->get_clean_address( 1, implode( ', ', array_filter( array(
				$data['regionTo'],
				$data['areaTo'],
				$data['cityTo'],
				$data['location'],
				$data['addressTo']
			) ) ) );

			$normalize_address  = new Address_Normalize( $clean_address );
			$edostavka_instance = wc_russian_post_shipping()->get_integrations_instance()->get_edostavka_instance();
			$result_data        = array();

			if ( $edostavka_instance && version_compare( $edostavka_instance->get_edostavka_plugin()->get_version(), 2.2, '>=' ) ) {

				$location = wc_edostavka_get_location_cities( array(
					'postal_code' => $normalize_address->get_index(),
					'lang'        => wc_edostavka_get_locale(),
					'size'        => 1
				) );

				if ( ! $location && $normalize_address->get_place_guid() ) {
					$location = wc_edostavka_get_location_cities( array(
						'fias_guid' => $normalize_address->get_place_guid(),
						'lang'      => wc_edostavka_get_locale(),
						'size'      => 1
					) );
				}

				$customer_location = $edostavka_instance->get_edostavka_plugin()->get_customer_handler();

				if ( $location && isset( $location[0] ) && $customer_location->get_city_code() !== $location[0]->code ) {

					$location_props = array(
						'country_code' => $location[0]->country_code,
						'region_code'  => $location[0]->region_code,
						'region'       => $location[0]->region,
						'city_code'    => $location[0]->code,
						'city'         => $location[0]->city,
						'longitude'    => $location[0]->longitude,
						'latitude'     => $location[0]->latitude
					);

					$customer_location->set_location( $location_props );

					$result_data['state'] = $location_props['region'];
					$result_data['city']  = $location_props['city'];
				}

			} else {

				if ( ( $place = wc_russian_post_clear_address_part( $normalize_address->get_place() ) ) && $place !== WC()->customer->get_billing_city( 'edit' ) ) {
					WC()->customer->set_billing_city( $place );
					WC()->customer->set_shipping_city( $place );
					$result_data['city'] = $place;
				}

				if ( ( $region = wc_russian_post_clear_address_part( $normalize_address->get_region(), 'region' ) ) && $region !== WC()->customer->get_billing_state( 'edit' ) ) {
					WC()->customer->set_billing_state( $region );
					WC()->customer->set_shipping_state( $region );
					$result_data['state'] = $region;
				}
			}

			if ( $short_address = $normalize_address->get_short_formatted_address() ) {
				WC()->customer->set_billing_address( $short_address );
				WC()->customer->set_shipping_address( $short_address );
				$result_data['address_1'] = $short_address;
			}

			if ( $normalize_address->get_index() ) {
				WC()->customer->set_billing_postcode( $normalize_address->get_index() );
				WC()->customer->set_shipping_postcode( $normalize_address->get_index() );
				$result_data['postcode'] = $normalize_address->get_index();
			}

			if ( WC()->customer->get_changes() ) {
				WC()->customer->save();
			}

			try {

				if( 'postamat' == $data['pvzType'] && ! in_array( wc_strtoupper( $data['mailType'] ), array( 'ONLINE_PARCEL', 'ECOM_MARKETPLACE' ), true ) ) {

					$found_to_change = false;

					foreach ( array_keys( wc_russian_post_get_allowed_shipment_types() ) as $mail_type ) {
						if( in_array( $mail_type, array( 'ONLINE_PARCEL', 'ECOM_MARKETPLACE' ), true ) ) {
							$data['mailType'] = $mail_type;
							$found_to_change = true;
							break;
						}
					}

					if( ! $found_to_change ) {
						throw new \Exception( __( 'Delivery to Postamat is not available for this type of shipment. Please choose a postal office or another shipping method.', 'woocommerce-russian-post' ) );
					}
				}

				$customer_delivery_point = new Customer_Delivery_Point_Data( get_current_user_id() );

				$point_data = array(
					'point_id'          => $data['id'],
					'type'              => $data['pvzType'],
					'mail_type'         => $data['mailType'],
					'code'              => $data['indexTo'],
					'postal_code'       => $normalize_address->get_index(),
					'fias'              => $normalize_address->get_place_guid(),
					'city'              => isset( $result_data['city'] ) ? $result_data['city'] : $normalize_address->get_place(),
					'region'            => isset( $result_data['state'] ) ? $result_data['state'] : $normalize_address->get_region(),
					'original_address'  => $clean_address,
					'normalize_address' => $normalize_address
				);

				if ( 'postamat' == $data['pvzType'] && isset( $data['boxSize'] ) ) {
					$point_data['box_size'] = $data['boxSize'];
				}

				$customer_delivery_point->set_point_data( $point_data );

				$customer_delivery_point->save();

				wp_send_json_success( $result_data );

			} catch ( \Exception $exception ) {
				wp_send_json_error( $exception->getMessage() );
			}

		} catch ( \Woodev_Plugin_Exception $exception ) {
			wp_send_json_error( $exception->getMessage() );
		}
	}

	public function order_actions() {

		if ( current_user_can( 'edit_shop_orders' ) && check_admin_referer( 'russian-post-order-action' ) && isset( $_GET['make'], $_GET['item_id'] ) ) {
			$make  = sanitize_text_field( wp_unslash( $_GET['make'] ) );
			$order = new Order( absint( wp_unslash( $_GET['item_id'] ) ) );

			$message_handler = wc_russian_post_shipping()->get_message_handler();

			switch ( $make ) {
				case 'export' :
					if ( $order->export_action() ) {
						$message_handler->add_message( sprintf( __( 'The order %d was successfully exported to Russian', 'woocommerce-russian-post' ), $order->get_order_number() ) );
					} else {
						$message_handler->add_error( sprintf( __( 'Failed to export orders to Russian Post. You can see the reason in the <a href="%s" target="_blank">notes to the order</a>.', 'woocommerce-russian-post' ), esc_url( $order->get_edit_order_url() ) ) );
					}

					break;
				case 'cancel' :
					if ( $order->cancel_action() ) {
						$message_handler->add_message( sprintf( __( 'The order %d was successfully canceled', 'woocommerce-russian-post' ), $order->get_order_number() ) );
					} else {
						$message_handler->add_error( __( 'Failed to cancel orders from Russian Post.', 'woocommerce-russian-post' ) );
					}

					break;
				case 'update' :
					if ( $order->update_order() ) {
						$message_handler->add_message( sprintf( __( 'Information of order %d was updated', 'woocommerce-russian-post' ), $order->get_order_number() ) );
					} else {
						$message_handler->add_message( sprintf( __( 'Order %s could not be updated.', 'woocommerce-russian-post' ), $order->get_order_number() ) );
					}

					break;
			}
		}

		wp_safe_redirect( wp_get_referer() ? wp_get_referer() : add_query_arg( 'page', 'wc_russian_post_orders', admin_url( 'admin.php' ) ) );
		exit;
	}

}

return new AJAX;