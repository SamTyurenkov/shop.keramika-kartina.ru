<?php

namespace Woodev\Russian_Post\Classes;

use Woodev\Russian_Post\Classes\Export_Order\Otpravka;
use Woodev\Russian_Post\Classes\Export_Order\Widget;
use Woodev\Russian_Post\Classes\Soap\Tracking;

if( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Order extends \WC_Order {

	private $is_russian_post;

	const WIDGET_EXPORT_TYPE = 'widget';

	const OTPRAVKA_EXPORT_TYPE = 'otpravka';

	public function __construct( $order ) {
		parent::__construct( $order );
	}

	public function is_russian_post() {
		if( ! $this->is_russian_post ) {
			if( $this->get_order_meta( 'is_russian_post' ) || $this->is_legacy_russian_post() ) {
				$this->is_russian_post = true;
			}
		}

		return $this->is_russian_post;
	}

	public function is_legacy_russian_post() {
		return ! is_null( $this->get_shipping_item() );
	}

	public function is_postamat() {
		if( 'postal' == $this->get_shipping_rate_meta( 'method_type' ) ) {
			$delivery_point = $this->get_shipping_rate_meta( 'delivery_point' );
			if( $delivery_point && isset( $delivery_point['type'] ) && wc_strtolower( $delivery_point['type'] ) === 'postamat' ) {
				return true;
			}
		}

		return false;
	}

	public function get_delivery_point_data() {

		if( 'postal' == $this->get_shipping_rate_meta( 'method_type' ) ) {

			$delivery_point = $this->get_shipping_rate_meta( 'delivery_point' );
			$point_id       = $delivery_point['point_id'];

			$transient_name      = sprintf( 'wc_russian_post_delivery_point_data_%s', $point_id );
			$delivery_point_data = get_transient( $transient_name );

			if( false === $delivery_point_data ) {

				try {

					$delivery_point_data = wc_russian_post_shipping()->get_api()->get_pvz_by_id( $point_id );

					set_transient( $transient_name, $delivery_point_data, WEEK_IN_SECONDS );

				} catch ( \Exception $e ) {
					wc_russian_post_shipping()->log( sprintf( __( 'Cannot get delivery point data by ID %d', 'woocommerce-russian-post' ), $point_id ) );

					return false;
				}
			}

			return $delivery_point_data;

		}

		return false;
	}

	/**
	 * @return \WC_Order_Item_Shipping|null
	 */
	public function get_shipping_item() {
		$shipping_item = null;
		/** @var \WC_Order_Item_Shipping $shipping_method */
		foreach ( $this->get_items( 'shipping' ) as $shipping_method ) {
			if( \Woodev_Helper::str_starts_with( $shipping_method->get_method_id(), wc_russian_post_shipping()->get_method_id() ) ) {
				$shipping_item = $shipping_method;
				break;
			}
		}

		return $shipping_item;
	}

	public function get_shipping_rate_meta( $name, $default = null ) {
		$meta = $this->get_shipping_item()->get_meta( 'wc_russian_post_rate' );
		if( isset( $meta[ $name ] ) ) {
			return $meta[ $name ];
		}

		return $default;
	}

	/**
	 * @return bool|Shipping_Method_Courier|Shipping_Method_Postal
	 */
	public function get_shipping_method_instance() {
		return $this->get_shipping_item() ? \WC_Shipping_Zones::get_shipping_method( $this->get_shipping_item()->get_instance_id() ) : false;
	}

	/**
	 * @return string|null
	 */
	public function get_tracking_number() {
		return $this->get_order_meta( 'tracking_number' );
	}

	public function get_tracking_link() {
		$tracking_number = $this->get_tracking_number();

		if( $tracking_number ) {
			return apply_filters( 'wc_russian_post_tracking_url', sprintf( '<a href="%s" target="_blank">%s</a>', esc_url( add_query_arg( array( 'barcode' => $tracking_number ), 'https://www.pochta.ru/tracking' ) ), $tracking_number ), $tracking_number );
		}

		return false;
	}

	public function set_tracking_number( $tracking_number = '' ) {
		if( $tracking_number !== $this->get_tracking_number() ) {

			$this->update_order_meta( 'tracking_number', trim( $tracking_number ) );

			if( $tracking_number ) {

				$this->add_order_note( sprintf( '%s: %s', __( 'The order has been assigned a tracking number', 'woocommerce-russian-post' ), $tracking_number ) );

				/** @var Tracking_Email $tracking_email */
				$tracking_email = WC()->mailer()->emails[ 'wc_russian_post_tracking_email' ];
				$tracking_email->trigger( $this->get_id(), $this, $tracking_number );

				if( ! $this->is_exported() ) {
					$this->set_order_status( 'exported' );
				}
			}

			do_action( 'wc_russian_post_order_tracking_number_changed', trim( $tracking_number ), $this->get_id() );
		}
	}

	public function get_order_total() {
		return $this->get_cart_total_for_order();
	}

	public function get_order_subtotal() {
		return $this->get_cart_subtotal_for_order();
	}

	public function get_order_status() {
		return $this->get_order_meta( 'status' );
	}

	public function get_export_type() {
		return $this->get_order_meta( 'export_type' );
	}

	public function set_export_type( $type = '' ) {
		if( in_array( wc_strtolower( $type ), array( self::WIDGET_EXPORT_TYPE, self::OTPRAVKA_EXPORT_TYPE ), true ) ) {
			$this->update_order_meta( 'export_type', $type );
		}
	}

	public function set_order_status( $status ) {

		$status         = strtolower( $status );
		$old_status     = strtolower( $this->get_order_status() );
		$order_statuses = wc_russian_post_get_order_statuses();

		if( in_array( $status, array_keys( $order_statuses ), true ) && $old_status !== $status ) {

			$this->update_order_meta( 'status', $status );

			if( $old_status ) {
				$this->add_order_note( sprintf( __( 'The order status of Russian Post was changed from %s to %s', 'woocommerce-russian-post' ), wc_russian_post_get_order_status( $old_status ), wc_russian_post_get_order_status( $status ) ) );
				do_action( 'wc_russian_post_order_status_changed_from_' . strtolower( $old_status ) . '_to' . strtolower( $status ), $this->get_id() );
			} else {
				$this->add_order_note( sprintf( __( 'The order status of Russian Post was changed to %s', 'woocommerce-russian-post' ), wc_russian_post_get_order_status( $status ) ) );
				do_action( 'wc_russian_post_order_status_changed_to_' . strtolower( $status ), $this->get_id() );
			}

			do_action( 'wc_russian_post_order_status_changed', strtolower( $old_status ), strtolower( $status ), $this->get_id() );
		}
	}

	public function get_order_status_name( $status = null ) {

		if( is_null( $status ) ) {
			$status = $this->get_order_status();
		}

		$status = wc_strtolower( $status );

		if( ! empty( $status ) ) {
			$name_status = wc_russian_post_get_order_status( $status );
			if( $name_status ) {
				return $name_status;
			}
		}

		return __( 'N/A', 'woocommerce-russian-post' );
	}

	public function is_exported() {
		return in_array( wc_strtolower( $this->get_order_status() ), array(
			'exported',
			'accepted',
			'delivered',
			'dispatched'
		), true );
	}

	public function export_action() {

		if( ! $this->is_exported() ) {

			try {

				$export_type = wc_russian_post_shipping()->get_settings_instance()->get_option( 'export_type', self::OTPRAVKA_EXPORT_TYPE );
				$api         = wc_russian_post_shipping()->get_api();

				switch ( $export_type ) {
					case self::OTPRAVKA_EXPORT_TYPE :
						$request_data = new Otpravka( $this );
						$request      = $api->get_new_order( array( $request_data->get_export_data() ) );
						break;
					case self::WIDGET_EXPORT_TYPE :
						$request_data = new Widget( $this );
						$request      = $api->get_orders_public( $request_data->get_export_data() );
						break;
					default :
						throw new \Exception( __( 'Undefined export order type', 'woocommerce-russian-post' ) );
				}

				if( $request->errors && is_array( $request->errors ) ) {

					$errors = array();

					foreach ( $request->errors as $error ) {
						if( $error->{'error-codes'} && is_array( $error->{'error-codes'} ) ) {
							foreach ( $error->{'error-codes'} as $error_details ) {
								if( $error_details->description ) {
									$errors[] = $error_details->description;
								}
							}
						}
					}

					if( ! empty( $errors ) ) {
						throw new \Exception( \Woodev_Helper::list_array_items( $errors, __( 'and', 'woocommerce-russian-post' ), ', ' ) );
					} else {
						throw new \Exception( __( 'An error occurred during the order has been exported.', 'woocommerce-russian-post' ) );
					}
				}

				if( $request ) {

					$this->set_order_status( 'exported' );
					$this->update_order_meta( 'latest_order_update_time', time(), false );
					$this->set_export_type( $export_type );

					if( self::OTPRAVKA_EXPORT_TYPE === $export_type && isset( $request->orders ) ) {
						$this->set_tracking_number( $request->orders[0]->barcode );
						$this->update_order_meta( 'russian_post_id', $request->orders[0]->{'result-id'} );
					}

					$this->save_meta_data();

					do_action( 'wc_russian_post_success_exported_order', $request, $export_type, $this );

					return true;

				} else {
					throw new \Exception( __( 'Cannot export order to Russian Post' ) );
				}

			} catch ( \Exception $e ) {

				$this->add_order_note( sprintf( __( 'Error occurred in process export the order: %s', 'woocommerce-russian-post' ), $e->getMessage() ) );

				$this->set_order_status( 'failed' );

				wc_russian_post_shipping()->log( sprintf( __( 'Failed to export the order %s. Error: %s', 'woocommerce-russian-post' ), $this->get_order_number(), $e->getMessage() ) );

				return false;
			}
		}

		return false;
	}

	public function update_order() {

		if( $this->is_exported() ) {

			try {

				$export_type = $this->get_export_type();

				if( ! in_array( $export_type, array( self::OTPRAVKA_EXPORT_TYPE, self::WIDGET_EXPORT_TYPE ), true ) ) {
					throw new \Woodev_API_Exception( __( 'Invalid export type parameter.', 'woocommerce-russian-post' ) );
				}

				$russian_post_id = $this->get_order_meta( 'russian_post_id' );

				if( self::OTPRAVKA_EXPORT_TYPE === $export_type && ! $russian_post_id ) {
					throw new \Woodev_API_Exception( __( 'Invalid external ID parameter.', 'woocommerce-russian-post' ) );
				}

				$api = wc_russian_post_shipping()->get_api();

				if( self::OTPRAVKA_EXPORT_TYPE === $export_type ) {
					$request = $api->get_update_order( $russian_post_id, ( new Otpravka( $this ) )->get_export_data() );
				} else {
					$request = $api->get_orders_public( ( new Widget( $this ) )->get_export_data() );
				}

				if( $request && ! ( $request->errors && is_array( $request->errors ) ) ) {

					if( wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_tracking', 'no' ) ) ) {
						$tracking_history = $this->update_tracking_history();
						$this->update_order_meta( 'tracking_history', $tracking_history );
					}

					$this->update_order_meta( 'latest_order_update_time', time() );

					do_action( 'wc_russian_post_after_order_update', $this );

					return true;

				} else {
					throw new \Woodev_API_Exception( __( 'Cannot update the order to Russian Post' ) );
				}

			} catch ( \Woodev_API_Exception $e ) {

				wc_russian_post_shipping()->log( sprintf( __( 'Failed to get remote order data. Error: %s', 'woocommerce-russian-post' ), $e->getMessage() ) );

				return false;

			}
		}

		return false;
	}

	public function cancel_action() {

		if( $this->is_exported() ) {

			try {

				$export_type = $this->get_export_type();

				if( self::OTPRAVKA_EXPORT_TYPE !== $export_type ) {
					throw new \Woodev_API_Exception( __( 'Unsupported export type parameter.', 'woocommerce-russian-post' ) );
				}

				$russian_post_id = $this->get_order_meta( 'russian_post_id' );

				if( ! $russian_post_id ) {
					throw new \Woodev_API_Exception( __( 'Invalid external ID parameter.', 'woocommerce-russian-post' ) );
				}

				$request = wc_russian_post_shipping()->get_api()->delete_order( array( $russian_post_id ) );

				if( $request ) {
					$this->set_tracking_number( null );
					$this->set_order_status( 'canceled' );
					$this->add_order_note( sprintf( __( 'The order #%s was cancel by manager.', 'woocommerce-russian-post' ), $this->get_id() ) );
				}

				return true;

			} catch ( \Woodev_API_Exception $e ) {

				wc_russian_post_shipping()->log( sprintf( __( 'Failed to remove the order %s from Russian Post. Error: %s', 'woocommerce-russian-post' ), $this->get_order_number(), $e->getMessage() ) );

				return false;
			}
		}

		return false;
	}

	public function update_tracking_history( $force = false ) {

		$tracking_number = $this->get_tracking_number();

		if( $tracking_number && class_exists( Tracking::class ) ) {

			$transient_name   = sprintf( 'wc_russian_post_tracking_history_%s', $tracking_number );
			$tracking_history = get_transient( $transient_name );

			if( false === $tracking_history || $force ) {

				try {

					//Run order status update process here
					$tracking = new Tracking();
					$tracking->set_barcode( $tracking_number );

					$tracking_history = $tracking->get_items();

					if( $tracking->is_completed() ) {

						$this->set_order_status( 'delivered' );

						$tracking_complete_status = wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_complete', 'none' );

						if( 'none' !== $tracking_complete_status ) {
							$note = \Woodev_Helper::str_ends_with( $tracking_complete_status, 'completed' ) ? __( 'The order has been automatically completed because it was delivered to receipt.', 'woocommerce-russian-post' ) : '';
							$this->set_status( $tracking_complete_status, $note );
						}

					} elseif( 'exported' === $this->get_order_status() && $tracking->is_accepted() ) {

						$this->set_order_status( 'accepted' );

					} elseif( 'accepted' === $this->get_order_status() && $tracking->is_delivering() ) {

						$this->set_order_status( 'dispatched' );

						$tracking_delivering_status = wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_delivering', 'none' );

						if( 'none' !== $tracking_delivering_status ) {
							$this->set_status( $tracking_delivering_status, __( 'The order now is in delivering process.', 'woocommerce-russian-post' ) );
						}

					} elseif( $tracking->is_canceled() ) {

						$tracking_canceled_status = wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_canceled', 'none' );

						if( 'none' !== $tracking_canceled_status && $tracking->is_finally() ) {
							$last_track    = $tracking->get_last();
							$cancel_reason = $last_track && isset( $last_track['status'], $last_track['status']['attr_name'] ) && ! empty( $last_track['status']['attr_name'] ) ? sprintf( __( 'The order was canceled. Reason: %s', 'woocommerce-russian-post' ), wp_kses_post( $last_track['status']['attr_name'] ) ) : '';
							$this->set_status( $tracking_canceled_status, $cancel_reason );
						}
					}

					set_transient( $transient_name, $tracking_history, DAY_IN_SECONDS );

				} catch ( \Exception $e ) {
					wc_russian_post_shipping()->log( sprintf( 'Exception error: %s', $e->getMessage() ) );
				}
			}

			return $tracking_history;
		}

		return false;
	}

	/**
	 * Update meta data by key, if provided.
	 *
	 * @param string $meta_key Meta key.
	 * @param string|array $meta_value Meta value.
	 * @param bool $save Whether to delete keys from DB right away. Could be useful to pass `false` if you are building a bulk request.
	 */
	public function update_order_meta( $meta_key, $meta_value, $save = true ) {

		if( ! $meta_key || ! $meta_value ) {
			return;
		}

		$this->update_meta_data( "_wc_russian_post_{$meta_key}", $meta_value );

		if( $save ) {
			$this->save_meta_data();
		}
	}

	/**
	 * Get Metadata by Key.
	 *
	 * @param string $meta_key Meta Key.
	 * @param bool $single return first found meta with key, or all with $key.
	 *
	 * @return mixed
	 */
	public function get_order_meta( $meta_key, $single = true ) {
		return $this->get_meta( "_wc_russian_post_{$meta_key}", $single );
	}
}