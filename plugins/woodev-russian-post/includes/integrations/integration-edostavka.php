<?php

namespace Woodev\Russian_Post\Integrations;

defined( 'ABSPATH' ) or exit;

/**
 * Integration class for WooCommerce Edostavka plugin
 */
class Integration_Edostavka {


	/** Add actions and filters */
	public function __construct() {
		$this->add_hooks();
	}

	private function add_hooks() {
		//Apply hooks for Edostavka version more than 2.2
		if ( $this->get_edostavka_plugin() && version_compare( $this->get_edostavka_plugin()->get_version(), 2.2, '>=' ) ) {
			add_filter( 'wc_russian_post_integration_form_fields', array( $this, 'integration_form_fields' ) );
			add_filter( 'woocommerce_cart_shipping_packages', array( $this, 'cart_shipping_packages' ), 25 );
			add_filter( 'wc_edostavka_checkout_hidden_or_remove_state_field', '__return_true' );
			add_filter( 'wc_edostavka_checkout_hidden_or_remove_postcode_field', '__return_true' );

			add_action( 'wp_ajax_nopriv_russian_post_set_customer_location', array( $this, 'set_customer_location' ) );
			add_action( 'wp_ajax_russian_post_set_customer_location', array( $this, 'set_customer_location' ) );
		}

	}

	public function integration_form_fields( $fields ) {

		if ( wc_russian_post_is_allow_edostavka_address_suggestions() ) {

			$fields_attr = array(
				'desc_tip' => esc_html__( 'This option unavailable because you are using suggestions options by CDEK plugin.', 'woocommerce-russian-post' ),
				'custom_attributes' => array(
					'disabled' => true
				)
			);

			foreach (
				array(
					'enable_state_suggestions',
					'enable_city_suggestions',
					'enable_address_suggestions',
					'fill_postcode_by_address'
				) as $field
			) {
				$fields[ $field ] = array_replace( $fields[ $field ], $fields_attr );
			}
		}

		return $fields;
	}

	public function get_settings( $name, $default = null ) {
		$settings = get_option( sprintf( 'woocommerce_%s_settings', $this->get_edostavka_plugin()->get_method_id() ), array() );

		if ( isset( $settings[ $name ] ) ) {
			return $settings[ $name ];
		}

		return $default;
	}

	public function cart_shipping_packages( $packages ) {

		if ( function_exists( 'wc_edostavka_get_location_postcodes' ) ) {

			$new_packages = array();

			foreach ( $packages as $index => $package ) {
				$new_packages[ $index ] = $package;

				if ( empty( $new_packages[ $index ]['destination']['postcode'] ) && isset( $new_packages[ $index ]['edostavka_customer_location'], $new_packages[ $index ]['edostavka_customer_location']['city_code'] ) ) {

					$postal_codes = wc_edostavka_get_location_postcodes( $new_packages[ $index ]['edostavka_customer_location']['city_code'] );

					if ( is_array( $postal_codes ) && ! empty( $postal_codes ) && $postal_code = wc_russian_post_get_best_match_postal_code( $postal_codes ) ) {
						$new_packages[ $index ]['destination']['postcode'] = $postal_code;
					}
				}
			}

			return $new_packages;

		}

		return $packages;
	}

	public function set_customer_location() {
		if( ! empty( $_POST ) && ! empty( $_POST['data'] ) ) {

			if( isset( $data['action'] ) ) {
				unset( $data['action'] );
			}

			$data = wc_clean( $_POST['data'] );
			$params = array(
				'size'  => 1
			);

			if( ! empty( $data['fias_id'] ) ) {
				$params['fias_guid'] = $data['fias_id'];
			} else {
				$params['city'] = $data['city'] || $data['settlement'];
				$params['postal_code'] = $data['postal_code'];
			}

			try {

				$location = $this->get_edostavka_plugin()->get_api()->get_location_cities( $params )->get_response_data();

				if( ! empty( $location[0] ) ) {

					/** @var array[] $location_props */
					$location_props = array(
						'country_code'  => isset( $location[0]->country_code ) ? wc_clean( wp_unslash( $location[0]->country_code ) ) : null,
						'region_code'   => isset( $location[0]->region_code ) ? intval( $location[0]->region_code ) : null,
						'region'        => isset( $location[0]->region ) ? wc_clean( wp_unslash( $location[0]->region ) ) : null,
						'city_code'     => isset( $location[0]->code ) ? intval( $location[0]->code ) : null,
						'city'          => isset( $location[0]->city ) ? $location[0]->city : null,
						'longitude'     => isset( $location[0]->longitude ) ? $location[0]->longitude : null,
						'latitude'      => isset( $location[0]->latitude ) ? $location[0]->latitude : null
					);

					$customer_location = $this->get_edostavka_plugin()->get_customer_handler();
					$customer_location->set_location( $location_props );

					wp_send_json_success( $customer_location->get_location() );

				} else {
					throw new \Exception( __( 'Unfortunately, we were unable to update the information about the settlement. Please try reloading the page and try again.', 'woocommerce-russian-post' ) );
				}

			} catch( \Exception $error ) {
				wp_send_json_error( $error->getMessage() );
			}
		}

		wp_send_json_error( 'Во время запроса произошла неизвестная ошибка.' );
	}

	/**
	 * @return \WC_Edostavka_Shipping|null
	 */
	public function get_edostavka_plugin() {
		return function_exists( 'wc_edostavka_shipping' ) ? wc_edostavka_shipping() : null;
	}
}