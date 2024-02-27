<?php

namespace Woodev\Russian_Post\Classes;

defined( 'ABSPATH' ) or exit;

class Checkout {

	public function __construct() {

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_filter( 'woocommerce_default_address_fields', array( $this, 'default_address_fields' ), PHP_INT_MAX );
		add_filter( 'woocommerce_update_order_review_fragments', array( $this, 'update_order_review_fragments' ) );

		add_action( 'woocommerce_review_order_after_shipping', array( $this, 'add_delivery_points_button' ) );
		add_action( 'woocommerce_after_shipping_rate', array( $this, 'shipping_rate_additional_information' ) );
		add_action( 'wp_footer', array( $this, 'add_map_template' ) );

		add_filter( 'woocommerce_available_payment_gateways', array( $this, 'get_available_payment_gateways' ) );
		add_filter( 'woocommerce_cart_shipping_packages', array( $this, 'cart_shipping_packages' ), 20 );

		add_action( 'woocommerce_after_checkout_validation', array( $this, 'validate_checkout' ), 10, 2 );
		add_action( 'woocommerce_checkout_create_order', array( $this, 'checkout_create_order' ), 10, 2 );
		add_action( 'woocommerce_checkout_order_created', array( $this, 'order_created' ) );

		add_action( 'woocommerce_order_details_after_order_table', array( $this, 'add_details_after_order_table' ) );
	}

	public function enqueue_scripts() {

		if ( is_admin() ) {
			return;
		}

		wp_register_style( 'wc-russian-post-backbone-modal', wc_russian_post_shipping()->get_plugin_url() . '/assets/css/frontend/backbone-modal.css', array(), WC_RUSSIAN_POST_SHIPPING_VERSION );
		wp_register_style( 'jquery-suggestions', '//cdn.jsdelivr.net/npm/suggestions-jquery@22.6.0/dist/css/suggestions.min.css', array(), '22.6.0' );
		wp_enqueue_style( 'wc-russian-post-checkout-style', wc_russian_post_shipping()->get_plugin_url() . '/assets/css/frontend/checkout.css', array(), WC_RUSSIAN_POST_SHIPPING_VERSION );

		if ( ! wp_script_is( 'wc-backbone-modal', 'registered' ) ) {
			wp_register_script( 'wc-backbone-modal', plugins_url( 'assets/js/admin/backbone-modal.js', WC_PLUGIN_FILE ), array(
				'underscore',
				'backbone',
				'wp-util'
			), WC_VERSION, true );
		}

		wp_register_script( 'wc_russian_post_widget_map', 'https://widget.pochta.ru/map/widget/widget.js', array(), null, true );
		wp_register_script( 'wc_russian_post_map', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/frontend/map.js', array(
			'jquery',
			'wc-backbone-modal',
			'wc_russian_post_widget_map',
			'jquery-blockui'
		), WC_RUSSIAN_POST_SHIPPING_VERSION, true );
		wp_register_script( 'jquery-suggestions', '//cdn.jsdelivr.net/npm/suggestions-jquery@22.6.0/dist/js/jquery.suggestions.min.js', array( 'jquery' ), '22.6.0', true );
		wp_register_script( 'woodev-suggestions-plugin', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/frontend/suggestions-plugin.js', array( 'jquery-suggestions' ), WC_RUSSIAN_POST_SHIPPING_VERSION, true );
		wp_register_script( 'wc-russian-post-address-suggestions', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/frontend/address-suggestions.js', array(
			'woodev-suggestions-plugin'
		), WC_RUSSIAN_POST_SHIPPING_VERSION, true );

		wp_register_script( 'wc-russian-post-jquery-confirm', wc_russian_post_shipping()->get_framework_assets_url() . '/js/admin/jquery.jquery-confirm.min.js', array( 'jquery' ), null, true );
		wp_register_script( 'wc-russian-post-checkout', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/frontend/checkout.js', array(
			'jquery',
			'wc-russian-post-jquery-confirm'
		), WC_RUSSIAN_POST_SHIPPING_VERSION, true );
		wp_localize_script( 'wc-russian-post-checkout', 'wc_russian_post_checkout_params', array(
			'need_reload_shipping' => ( ! function_exists( 'wc_edostavka_has_fee_payments' ) || false === wc_edostavka_has_fee_payments() ) || in_array( 'cod', WC()->payment_gateways()->get_payment_gateway_ids() )
		) );

		if ( is_checkout() ) {

			wp_enqueue_style( 'wc-russian-post-method-jquery-confirm', wc_russian_post_shipping()->get_framework_assets_url() . '/css/admin/jquery-confirm.min.css' );

			if ( ! wc_russian_post_shipping()->get_integrations_instance()->get_edostavka_instance() ) {
				wp_enqueue_style( 'wc-russian-post-backbone-modal' );
			} else {
				wp_add_inline_style( 'wc-russian-post-checkout-style', 'article#russian-post-map-container { overflow: hidden; }' );
			}

			wp_enqueue_script( 'wc_russian_post_map' );
			wp_localize_script( 'wc_russian_post_map', 'wc_russian_post_map_params', $this->get_js_localize_script_params() );

			if ( wc_russian_post_is_enable_address_suggestions() ) {

				wp_enqueue_style( 'jquery-suggestions' );
				wp_enqueue_script( 'wc-russian-post-address-suggestions' );

				wp_localize_script( 'wc-russian-post-address-suggestions', 'wc_russian_post_address_suggestions_params', array(
					'default_country'    => WC()->customer->get_default_country(),
					'requires_address'   => wc_string_to_bool( get_option( 'woocommerce_shipping_cost_requires_address' ) ),
					'enable_state'       => wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_state_suggestions', 'yes' ),
					'enable_city'        => wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_city_suggestions', 'yes' ),
					'enable_address'     => wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_address_suggestions', 'yes' ),
					'need_fill_postcode' => wc_russian_post_shipping()->get_settings_instance()->get_option( 'fill_postcode_by_address', 'yes' ),
					'need_set_location'  => function_exists( 'wc_edostavka_set_customer_location' ),
					'ajax_url'           => admin_url( 'admin-ajax.php', 'relative' )
				) );

				wp_localize_script( 'woodev-suggestions-plugin', 'wc_russian_post_suggestions_plugin_params', apply_filters( 'wc_russian_post_suggestions_plugin_default_params', array(
					'serviceUrl'     => esc_url( 'https://passport.pochta.ru/suggestions/api/4_1/rs' ),
					'geoLocation'    => false,
					'countryISOCode' => WC()->customer->get_default_country()
				) ) );
			}

			wp_enqueue_script( 'wc-russian-post-checkout' );
		}
	}

	public function get_js_localize_script_params() {

		$account = new Install_Module();

		return apply_filters( 'wc_russian_post_checkout_script_params', array(
			'ajax_url'                      => admin_url( 'admin-ajax.php', 'relative' ),
			'account_id'                    => $account->get_guid_id(),
			'account_type'                  => $account->get_cms_type(),
			'weight_cart'                   => $this->get_cart_total_weight(),
			'dimensions_cart'               => $this->get_cart_dimensions(),
			'total_cart'                    => $this->get_cart_content_total(),
			'set_russian_post_point_notice' => wp_create_nonce( 'wc_russian_post_point_notice' ),
			'auto_close_map'                => wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'auto_close_map', 'yes' ) ),
			'i18n'                          => array(
				'confirm_button_text' => __( 'I got it!', 'woocommerce-russian-post' )
			)
		) );
	}

	private function get_cart_total_weight() {
		if ( WC()->cart->get_cart_contents_weight() > 0.0 ) {
			return intval( wc_get_weight( WC()->cart->get_cart_contents_weight(), 'g' ) );
		} else {
			return intval( wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_weight', 500 ) * WC()->cart->get_cart_contents_count() );
		}
	}

	private function get_cart_content_total() {

		$content_total = 'cod' == WC()->session->get( 'chosen_payment_method' ) ? intval( WC()->cart->get_cart_contents_total() * 100 ) : 0;

		return apply_filters( 'wc_russian_post_cart_content_total', $content_total, WC()->cart );
	}

	private function get_cart_dimensions() {
		$dimensions = array();

		if ( WC()->cart && WC()->cart->get_cart() ) {

			$default_height = wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_height', 150 );
			$default_width  = wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_width', 150 );
			$default_length = wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_length', 150 );

			foreach ( ( array ) WC()->cart->get_cart() as $values ) {
				/** @var \WC_Product $product */
				$product = $values['data'];
				if ( $product && $product->needs_shipping() ) {

					$product_height = $product->get_height() > 0 ? wc_get_dimension( $product->get_height(), 'cm' ) : wc_get_dimension( $default_height, 'cm', 'mm' );
					$product_width  = $product->get_width() > 0 ? wc_get_dimension( $product->get_width(), 'cm' ) : wc_get_dimension( $default_width, 'cm', 'mm' );
					$product_length = $product->get_length() > 0 ? wc_get_dimension( $product->get_length(), 'cm' ) : wc_get_dimension( $default_length, 'cm', 'mm' );

					for ( $count = 0; $values['quantity'] > $count; $count ++ ) {
						$dimensions[] = array(
							'length' => ceil( $product_length ),
							'width'  => ceil( $product_width ),
							'height' => ceil( $product_height )
						);
					}
				}
			}
		}

		return $dimensions;
	}

	public function default_address_fields( $fields ) {
		if ( ! wc_russian_post_shipping()->get_integrations_instance()->get_edostavka_instance() ) {

			$start_priority = isset( $fields['country'], $fields['country']['priority'] ) ? $fields['country']['priority'] : 40;

			foreach ( array( 'state', 'city', 'address_1', 'address_2', 'postcode' ) as $field_key ) {

				if ( ! isset( $fields[ $field_key ] ) ) {
					continue;
				}

				$fields[ $field_key ]['priority'] = ++ $start_priority;
			}
		}

		if ( wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'hide_fields', 'yes' ) ) ) {

			$method_instance = wc_russian_post_get_chosen_method_instance();

			if ( $method_instance && $method_instance->get_method_type() == 'postal' ) {
				foreach ( array( 'address_1', 'postcode' ) as $field ) {
					if ( ! isset( $fields[ $field ] ) ) {
						continue;
					}

					$fields[ $field ]['required'] = false;
					$fields[ $field ]['class']    = array( 'form-field-hidden' );
				}
			}
		}

		return $fields;
	}

	public function update_order_review_fragments( $fragments ) {

		if ( wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'hide_fields', 'yes' ) ) ) {

			$checkout_fields      = WC()->checkout()->get_checkout_fields( 'billing' );
			$chosen_rate          = $this->chosen_rate_is_russian_post( true );
			$billing_address_args = $billing_postcode_args = array();

			if ( isset( $checkout_fields['billing_address_1'] ) ) {
				$billing_address_args            = $checkout_fields['billing_address_1'];
				$billing_address_args['return']  = true;
				$billing_address_args['default'] = WC()->customer->get_billing_address_1();
			}

			if ( isset( $checkout_fields['billing_postcode'] ) ) {
				$billing_postcode_args            = $checkout_fields['billing_postcode'];
				$billing_postcode_args['return']  = true;
				$billing_postcode_args['default'] = WC()->customer->get_billing_postcode();
			}

			if ( $chosen_rate ) {
				$rate_meta_data = new Shipping_Rate_Meta_Data( $chosen_rate );
				if ( $rate_meta_data->get_method_type() == 'postal' ) {

					if ( $billing_address_args ) {
						$billing_address_args['required'] = false;
						$billing_address_args['class']    = array( 'form-field-hidden' );
					}

					if ( $billing_postcode_args ) {
						$billing_postcode_args['required'] = false;
						$billing_postcode_args['class']    = array( 'form-field-hidden' );
					}
				}
			}

			if ( $billing_address_args ) {
				$fragments['#billing_address_1_field'] = woocommerce_form_field( 'billing_address_1', $billing_address_args );
			}

			if ( $billing_postcode_args ) {
				$fragments['#billing_postcode_field'] = woocommerce_form_field( 'billing_postcode', $billing_postcode_args );
			}
		}

		return $fragments;
	}

	public function add_delivery_points_button() {

		$chosen_rate = $this->chosen_rate_is_russian_post( true );

		if ( is_checkout() && $chosen_rate && is_a( $chosen_rate, 'WC_Shipping_Rate' ) ) {

			$method_instance = \WC_Shipping_Zones::get_shipping_method( $chosen_rate->get_instance_id() );

			if ( ! $method_instance->is_courier() ) {
				$out            = __return_empty_string();
				$button_text    = __( 'Choose postal office', 'woocommerce-russian-post' );
				$button_classes = array( 'wc-russian-post-choose-delivery-point' );
				$rate_meta_data = new Shipping_Rate_Meta_Data( $chosen_rate );

				if ( $rate_meta_data->get_normalize_address() ) {
					try {

						$customer_delivery_point = new Customer_Delivery_Point_Data( get_current_user_id() );

						if ( $customer_delivery_point->get_fias() && $customer_delivery_point->get_fias() == $rate_meta_data->get_normalize_address()->get_place_guid() ) {
							$out              .= sprintf( '<div class="wc-russian-post-chosen-address"><strong>%s</strong></div>', $customer_delivery_point->get_normalize_address()->get_short_formatted_address() );
							$button_text      = __( 'Another postal office', 'woocommerce-russian-post' );
							$button_classes[] = 'wc-russian-post-choose-delivery-point--chosen';
						}

					} catch ( \Exception $e ) {
						wc_russian_post_shipping()->log( $e->getMessage() );
					}

					$out .= sprintf( '<button class="button %s" data-zip_code="%d" data-cart_total="%d" data-start_location="%s">%s</button>', implode( ' ', $button_classes ), $rate_meta_data->get_normalize_address()->get_index(), $this->get_cart_content_total(), esc_html( $rate_meta_data->get_normalize_address()->get_formatted_address() ), $button_text );

					printf( '<tr class="cart-delivery-points"><th>%s: </th><td>%s</td></tr>', __( 'Postal office', 'woocommerce-russian-post' ), $out );
				}
			}
		}
	}

	/**
	 * @param \WC_Shipping_Rate $method
	 *
	 * @return void
	 */
	public function shipping_rate_additional_information( $method ) {
		if ( ! \Woodev_Helper::str_starts_with( $method->get_method_id(), wc_russian_post_shipping()->get_method_id() ) ) {
			return;
		}

		$method_instance = \WC_Shipping_Zones::get_shipping_method( $method->get_instance_id() );
		$rate_meta_data  = new Shipping_Rate_Meta_Data( $method );
		$additional_info = array();

		if ( wc_string_to_bool( $method_instance->get_option( 'show_delivery_time', 'no' ) ) && $rate_meta_data->get_rate() ) {
			$rate_data = $rate_meta_data->get_rate();
			if ( isset( $rate_data->delivery_interval, $rate_data->delivery_interval->description ) ) {
				$additional_info[] = sprintf( '<p class="wc-russian-post-method-delivery-time">%s: %s</p>', __( 'Time of delivery', 'woocommerce-russian-post' ), $rate_data->delivery_interval->description );
			}
		}

		if ( ! empty( $method_instance->get_option( 'description_rate' ) ) ) {
			$additional_info[] = sprintf( '<p class="wc-russian-post-method-description">%s</p>', esc_textarea( $method_instance->get_option( 'description_rate' ) ) );
		}

		$additional_info = apply_filters( 'wc_russian_post_additional_info_strings', $additional_info, $method, $method_instance, $this );

		if ( array_filter( $additional_info ) ) {
			printf( '<div class="wc-russian-post-method-additional-info">%s</div>', implode( '', $additional_info ) );
		}
	}

	public function add_map_template() {
		if ( is_checkout() ) {
			wc_russian_post_shipping()->load_template( 'views/html-modal-map.php' );
		}
	}

	/**
	 * @param boolean $need_instance Need to return boolean or WC_Shipping_Rate instance
	 *
	 * @return \WC_Shipping_Rate|bool
	 */
	public function chosen_rate_is_russian_post( $need_instance = false ) {

		if ( WC()->session ) {
			$shipping_packages               = WC()->shipping()->get_packages();
			$chosen_shipping_methods_session = WC()->session->get( 'chosen_shipping_methods' );

			if ( ! empty( $chosen_shipping_methods_session ) && is_array( $chosen_shipping_methods_session ) ) {

				foreach ( $chosen_shipping_methods_session as $package_key => $chosen_package_rate_id ) {

					if ( ! empty( $shipping_packages[ $package_key ]['rates'][ $chosen_package_rate_id ] ) ) {

						$chosen_rate = $shipping_packages[ $package_key ]['rates'][ $chosen_package_rate_id ];

						if ( is_a( $chosen_rate, 'WC_Shipping_Rate' ) && in_array( $chosen_rate->get_method_id(), array(
								'wc_russian_post_courier',
								'wc_russian_post_postal'
							), true ) ) {

							if ( $need_instance ) {
								return $chosen_rate;
							}

							return true;
						}
					}
				}
			}
		}

		return false;
	}

	public function get_available_payment_gateways( $available_payments ) {

		if ( WC()->session ) {

			$chosen_methods = WC()->session->get( 'chosen_shipping_methods', array() );

			foreach ( $chosen_methods as $chosen_method ) {

				if ( ! \Woodev_Helper::str_starts_with( $chosen_method, wc_russian_post_shipping()->get_method_id() ) ) {
					continue;
				}

				list( $method_id, $method_instance ) = explode( ':', $chosen_method, 2 );

				$options = get_option( sprintf(
					'woocommerce_%s_%s_settings',
					$method_id,
					$method_instance
				), array() );

				if ( ! empty( $options ) && ! empty( $options['allowed_payments'] ) && is_array( $options['allowed_payments'] ) ) {
					$available_payments = array_intersect_key( $available_payments, array_flip( $options['allowed_payments'] ) );
					break;
				}
			}
		}

		return $available_payments;
	}

	public function cart_shipping_packages( $packages ) {

		$new_packages = array();

		foreach ( $packages as $index => $package ) {

			$new_packages[ $index ] = $package;

			if ( ! isset( $new_packages[ $index ]['chosen_payment_method'] ) ) {
				$new_packages[ $index ]['chosen_payment_method'] = WC()->session->get( 'chosen_payment_method' );
			}

		}

		return $new_packages;
	}

	/**
	 * @param array     $data   An array of posted data {@see WC_Checkout::get_posted_data()}
	 * @param \WP_Error $errors Validation errors
	 *
	 * @return void
	 * @throws \Exception
	 */
	public function validate_checkout( $data, \WP_Error $errors ) {
		$required_field_errors = $errors->get_error_data( 'required-field' );

		if ( ! empty( $required_field_errors ) ) {
			return;
		}

		if ( WC()->cart && WC()->cart->needs_shipping() ) {

			$chosen_rate = $this->chosen_rate_is_russian_post( true );

			if ( $chosen_rate && is_a( $chosen_rate, 'WC_Shipping_Rate' ) ) {

				$rate_meta_data = new Shipping_Rate_Meta_Data( $chosen_rate );

				if ( $rate_meta_data->get_method_type() == 'postal' ) {

					try {

						$customer_delivery_point = new Customer_Delivery_Point_Data( get_current_user_id() );

						if ( ! $customer_delivery_point->get_code() ) {
							$errors->add( 'shipping', __( 'You didnt select a postal office. Please choose a postal office to delivery your order.', 'woocommerce-russian-post' ) );
						} elseif ( $customer_delivery_point->get_fias() && $customer_delivery_point->get_fias() !== $rate_meta_data->get_normalize_address()->get_place_guid() ) {
							$errors->add( 'shipping', __( 'The city of chosen delivery point is not matched with your shipping city. Please select the correct delivery point, either change your shipping address or select another shipping method.', 'woocommerce-russian-post' ) );
						}

						if ( 'cod' == $data['payment_method'] && ( 'postamat' == $customer_delivery_point->get_type() || $customer_delivery_point->get_mail_type() == 'ECOM_MARKETPLACE' ) ) {
							$available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
							$payment_method     = $available_gateways[ $data['payment_method'] ];
							$errors->add( 'shipping', sprintf( __( 'The payment method <strong>%s</strong> is unavailable for Postamat and ECOM shipping type. To continue with your order, please choose another payment or shipping method.', 'woocommerce-russian-post' ), $payment_method->get_title() ) );
						}

						if ( 'postamat' == $customer_delivery_point->get_type() && ! in_array( $customer_delivery_point->get_mail_type(), array(
								'ONLINE_PARCEL',
								'ECOM_MARKETPLACE'
							), true ) ) {
							$errors->add( 'shipping', sprintf( __( 'Delivery to Postamat is available only for such types of shipment as "%s" and "%s"', 'woocommerce-russian-post' ), wc_russian_post_get_parcel_type( 'ONLINE_PARCEL' ), wc_russian_post_get_parcel_type( 'ECOM_MARKETPLACE' ) ) );
						}

						if ( 'postamat' == $customer_delivery_point->get_type() && wc_russian_post_get_dimension_by_key( $customer_delivery_point->get_box_size() ) && ! $this->can_fit_dimension_type( $customer_delivery_point->get_box_size() ) ) {
							$errors->add( 'shipping', __( 'The total dimensions of all products exceed the maximum allowable cell sizes of the chosen parcel locker. Please choose another parcel locker or shipping method.', 'woocommerce-russian-post' ) );
						}

					} catch ( \Exception $e ) {
						wc_russian_post_shipping()->log( $e->getMessage() );
					}

				} elseif ( $rate_meta_data->get_method_type() == 'courier' ) {

					$clean_address = wc_russian_post_shipping()->get_api()->get_clean_address( 1, implode( ', ', array_filter( array(
						$data['billing_postcode'],
						$data['billing_state'],
						$data['billing_city'],
						$data['billing_address_1']
					) ) ) );

					$normalize_address = new Address_Normalize( $clean_address );

					/** Most likely this event will never happen */
					if ( ! $normalize_address->is_usable() ) {
						$errors->add( 'shipping', sprintf( __( 'The address "%s" you entered is unavailable to deliver by Russian Post. Please ensure your shipping address is correct.', 'woocommerce-russian-post' ), $normalize_address->get_formatted_address( ', ', true ) ) );
					}
				}
			}
		}
	}

	/**
	 * @param \WC_Order $order
	 * @param array     $data Posted data.
	 *
	 * @return void
	 * @throws \Exception
	 */
	public function checkout_create_order( $order, $data ) {
		if ( ! is_a( $order, 'WC_Order' ) ) {
			throw new \Exception( __( 'The $order variable is not an object of the WC_Order class.', 'woocommerce-russian-post' ) );
		}

		/** @var \WC_Order_Item_Shipping $shipping_method */
		foreach ( $order->get_shipping_methods() as $shipping_method ) {
			if ( ! \Woodev_Helper::str_starts_with( $shipping_method->get_method_id(), wc_russian_post_shipping()->get_method_id() ) ) {
				continue;
			}

			$meta_data = $shipping_method->get_meta( 'wc_russian_post_rate' );

			$order->update_meta_data( '_wc_russian_post_is_russian_post', true ); //Mark order as Russian Post

			if ( $meta_data['method_type'] == 'postal' ) {
				try {

					$customer_delivery_point = new Customer_Delivery_Point_Data( $order->get_customer_id() );

					if ( $customer_delivery_point->get_mail_type() !== $meta_data['rate']->shipment_type ) {
						$order->add_order_note( sprintf( __( 'Attention! The shipping method type has been changed from %s to %s. This means that the final shipping cost may also change both up and down.', 'woocommerce-russian-post' ), $shipping_method->get_method_title(), wc_russian_post_get_parcel_type( $meta_data['rate']->shipment_type ), wc_russian_post_get_parcel_type( $customer_delivery_point->get_mail_type() ) ) );
						$meta_data['rate']->shipment_type = $customer_delivery_point->get_mail_type();
					}

					$meta_data['delivery_point'] = $customer_delivery_point->get_point_data();

					$shipping_method->update_meta_data( 'wc_russian_post_rate', $meta_data );
					$shipping_method->save_meta_data();

				} catch ( \Exception $e ) {
					wc_russian_post_shipping()->log( $e->getMessage() );
				}
			}
		}
	}

	/**
	 * @param \WC_Order $order
	 *
	 * @return void
	 */
	public function order_created( $order ) {
		$order = new Order( $order );
		if ( $order->is_russian_post() ) {
			$order->set_order_status( 'new' ); //Set Russian Post order status
		}
	}

	public function add_details_after_order_table( \WC_Order $order ) {

		$order = new Order( $order );

		if ( $order->is_russian_post() ) {

			if ( 'postal' == $order->get_shipping_rate_meta( 'method_type' ) ) {

				wc_russian_post_shipping()->load_template( 'views/html-order-delivery-point.php', array(
					'title'    => sprintf( __( 'Details of chosen %s', 'woocommerce-russian-post' ), lcfirst( $order->is_postamat() ? _x( 'Postamat', 'Предложный падеж', 'woocommerce-russian-post' ) : _x( 'Postal office', 'Предложный падеж', 'woocommerce-russian-post' ) ) ),
					'shipping' => $order->get_shipping_rate_meta( 'delivery_point' ),
					'details'  => $order->get_delivery_point_data()
				) );

			}

			if ( $order->get_order_meta( 'tracking_history' ) ) {
				wc_russian_post_shipping()->load_template( 'views/html-order-tracking-history.php', array( 'order' => $order ) );
			}

		}

	}

	private function can_fit_dimension_type( $dimension_type ) {

		$postamat_dimensions = wc_russian_post_get_dimension_by_key( $dimension_type );
		$cart_dimensions     = $this->get_cart_dimensions();

		$cart_content_values = array(
			'height' => array_column( $cart_dimensions, 'height' ),
			'width'  => array_column( $cart_dimensions, 'width' ),
			'length' => array_column( $cart_dimensions, 'length' )
		);

		$max_values = array(
			'height' => max( $cart_content_values['height'] ),
			'width'  => max( $cart_content_values['width'] ),
			'length' => max( $cart_content_values['length'] )
		);

		$greatest_dimension = array_search( max( $max_values ), $max_values, true );

		if ( wc_get_dimension( $max_values[ $greatest_dimension ], 'mm', 'cm' ) >= $postamat_dimensions['max_value'] ) {
			return false;
		}

		$exclude_max_values = array_diff_key( $cart_content_values, array_flip( array( $greatest_dimension ) ) );
		$great_dimension    = array_search( max( $exclude_max_values ), $exclude_max_values, true );
		$least_values       = array_diff_key( $exclude_max_values, array_flip( array(
			$greatest_dimension,
			$great_dimension
		) ) );

		if ( wc_get_dimension( array_product( array(
				$max_values[ $greatest_dimension ],
				$max_values[ $great_dimension ],
				array_sum( current( $least_values ) )
			) ), 'mm', 'cm' ) >= $postamat_dimensions['volume'] ) {
			return false;
		}

		return true;
	}
}