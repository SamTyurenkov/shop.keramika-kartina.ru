<?php

namespace Woodev\Russian_Post\Abstracts;

use Woodev\Russian_Post\Classes\Address_Normalize;
use Woodev\Russian_Post\Classes\Install_Module;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

abstract class Abstract_Shipping_Method extends \WC_Shipping_Method {

	protected $method_type;

	/** @var Address_Normalize */
	protected $normalize_address;

	public function __construct( $instance_id = 0 ) {

		parent::__construct( $instance_id );

		$this->supports = array(
			'shipping-zones',
			'instance-settings'
		);

		$this->init_form_fields();
		$this->init_settings();

		add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'process_admin_options' ) );
	}

	public function admin_options() {

		if ( $this->is_settings() ) {

			wp_enqueue_style( 'wc-russian-post-method-jquery-confirm', wc_russian_post_shipping()->get_framework_assets_url() . '/css/admin/jquery-confirm.min.css' );
			wp_enqueue_style( 'wc-russian-post-method-admin-confirm', wc_russian_post_shipping()->get_framework_assets_url() . '/css/admin/admin-confirm.css' );

			wp_add_inline_style( 'wc-russian-post-method-admin-confirm', "body .jconfirm.jconfirm-modern .jconfirm-box div.jconfirm-content { text-align: left; }" );

			wp_register_script( 'wc-russian-post-jquery-confirm', wc_russian_post_shipping()->get_framework_assets_url() . '/js/admin/jquery.jquery-confirm.min.js', array( 'jquery' ), null, true );
			wp_enqueue_script( 'wc-russian-post-method-settings', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/admin/method-settings.js', array(
				'jquery',
				'wc-russian-post-jquery-confirm'
			), WC_RUSSIAN_POST_SHIPPING_VERSION, true );
			wp_localize_script( 'wc-russian-post-method-settings', 'wc_russian_post_settings_params', array(
				'parcel_types'                   => wc_russian_post_get_parcel_types(),
				'documentation_url'              => esc_url( wc_russian_post_shipping()->get_documentation_url() ),
				'allowed_shipment_type_selector' => sprintf( '#%s', $this->get_field_key( 'allowed_shipment_type' ) ),
				'title_selector'                 => sprintf( '#%s', $this->get_field_key( 'title' ) )
			) );
		}

		wc_russian_post_shipping()->get_message_handler()->show_messages();
		parent::admin_options();
	}

	public function process_admin_options() {

		if ( ! wc_russian_post_shipping()->get_license_instance()->is_active() ) {

			wc_russian_post_shipping()->get_message_handler()->add_error(
				sprintf(
					__( 'Changes of settings were not applied because your license key of the plugin %s is invalid, expired or not entered. Please, check your license key on the <a href="%s">Licenses Page</a>.', 'woocommerce-russian-post' ),
					wc_russian_post_shipping()->get_plugin_name(),
					wc_russian_post_shipping()->get_license_instance()->get_license_settings_url()
				)
			);

			return;
		}

		parent::process_admin_options();
	}

	public function init_form_fields() {

		$instance_form_fields = array(
			'title'                 => array(
				'title'    => __( 'Method name', 'woocommerce-russian-post' ),
				'type'     => 'text',
				'default'  => __( 'Russian Post Delivery', 'woocommerce-russian-post' ),
				'desc_tip' => esc_html__( 'Enter the name for this method. You can use special tag %parcel_type% (it will be replaced to shipment type name).', 'woocommerce-russian-post' )
			),
			'min_price'             => array(
				'title'       => __( 'Minimal cost', 'woocommerce-russian-post' ),
				'type'        => 'price',
				'css'         => 'max-width:75px;',
				'desc_tip'    => 'Установите минимальную сумму заказа после которой будет отображатся этот метод. Оставьте пустым, что бы не использовать эту опцию.',
				'placeholder' => wc_format_localized_price( 0 )
			),
			'max_price'             => array(
				'title'       => __( 'Maximal cost', 'woocommerce-russian-post' ),
				'type'        => 'price',
				'css'         => 'max-width:75px;',
				'desc_tip'    => 'Установите максимальную сумму заказа до которой будет отображатся этот метод. Оставьте пустым, что бы не использовать эту опцию.',
				'placeholder' => wc_format_localized_price( 0 )
			),
			'free_cost'             => array(
				'title'       => __( 'Free shipping', 'woocommerce-russian-post' ),
				'type'        => 'price',
				'css'         => 'max-width:75px;',
				'desc_tip'    => 'Укажите сумму заказа при достижении которой данный метод доставки будет бесплатным. Оставьте пустым, что бы не использовать эту опцию.',
				'placeholder' => wc_format_localized_price( 0 )
			),
			'show_delivery_time'    => array(
				'title'    => __( 'Delivery time', 'woocommerce-russian-post' ),
				'type'     => 'checkbox',
				'label'    => __( 'Show estimated delivery time', 'woocommerce-russian-post' ),
				'desc_tip' => esc_html__( 'Show estimated delivery time', 'woocommerce-russian-post' ),
				'default'  => 'no'
			),
			'description_rate'      => array(
				'title'       => __( 'Method description', 'woocommerce-russian-post' ),
				'type'        => 'textarea',
				'css'         => 'max-width:400px;',
				'placeholder' => esc_html__( 'Enter text to describe this shipping method. Leave blank to not use.', 'woocommerce-russian-post' ),
				'desc_tip'    => esc_html__( 'This text will be showing under of method title. Leave blank to not use.', 'woocommerce-russian-post' ),
			),
			'shipping_class_id'     => array(
				'title'    => __( 'Shipping class', 'woocommerce-russian-post' ),
				'type'     => 'select',
				'desc_tip' => __( 'Choose a shipping class that will be applied to this shipping method, if you need it', 'woocommerce-russian-post' ),
				'default'  => 'any',
				'class'    => 'wc-enhanced-select',
				'options'  => $this->get_shipping_classes_options()
			),
			'allowed_shipment_type' => array(
				'title'    => __( 'Allowed shipment type', 'woocommerce-russian-post' ),
				'type'     => 'select',
				'desc_tip' => __( 'Choose the shipment type that allowed to this shipping method.', 'woocommerce-russian-post' ),
				'default'  => 'any',
				'class'    => 'wc-enhanced-select',
				'options'  => array_merge(
					array(
						'any' => __( 'Any type (recommended)', 'woocommerce-russian-post' )
					),
					$this->get_available_shipment_types()
				)
			),
			'allowed_payments'      => array(
				'title'             => __( 'Allowed payment methods', 'woocommerce-russian-post' ),
				'placeholder'       => esc_html__( 'Choose payment methods', 'woocommerce-russian-post' ),
				'type'              => 'multiselect',
				'class'             => 'wc-enhanced-select-nostd',
				'desc_tip'          => __( 'Choose payment methods, those will be available for this method. Leave blank to use any available payment method.', 'woocommerce-russian-post' ),
				'options'           => array(),
				'custom_attributes' => array(
					'data-placeholder' => esc_html__( 'Choose payment methods', 'woocommerce-russian-post' )
				)
			)
		);

		if ( wc_string_to_bool( get_option( 'woocommerce_enable_coupons' ) ) ) {

			$instance_form_fields = \Woodev_Helper::array_insert_after( $instance_form_fields, 'free_cost', array(
				'coupon_free_shipping' => array(
					'title'    => 'Купон на бесплатную доставку',
					'label'    => sprintf( 'Разрешить использование <a href="%s" target="_blank">купонов на бесплатную доставку</a>', esc_url( admin_url( 'edit.php?post_type=shop_coupon' ) ) ),
					'type'     => 'checkbox',
					'default'  => 'no',
					'desc_tip' => 'Если вы используете купоны с бесплатной доставкой, то вы можете включить эту опцию чтобы сделать данный метод доставки бесплатным при применении купона.'
				)
			) );
		}

		$this->instance_form_fields = $instance_form_fields;
	}

	/**
	 * @param array $package
	 *
	 * @return bool
	 */
	public function is_available( $package ) {
		if ( ! wc_russian_post_shipping()->get_license_instance()->is_license_valid() ) {
			return false;
		}

		$available = parent::is_available( $package );

		if ( $available ) {

			if ( $this->get_option( 'max_price' ) > 0 && $package['cart_subtotal'] > $this->get_option( 'max_price' ) ) {
				$available = false;
			}

			if ( $this->get_option( 'min_price' ) > 0 && $package['cart_subtotal'] < $this->get_option( 'min_price' ) ) {
				$available = false;
			}
		}

		return apply_filters( 'woocommerce_shipping_' . $this->id . '_is_available', $available, $package, $this );
	}

	/**
	 * @return array
	 */
	abstract protected function get_available_shipment_types();

	/**
	 * @return Address_Normalize
	 */
	public function get_normalize_address() {
		return $this->normalize_address;
	}

	/**
	 * @param Address_Normalize $normalize_address
	 */
	public function set_normalize_address( $normalize_address ) {
		$this->normalize_address = $normalize_address;
	}

	/**
	 * @param array $package
	 *
	 * @return array|false
	 */
	protected function dispatch_rate( array $package ) {

		if ( isset( $package['destination'] ) ) {

			if ( empty( trim( $package['destination']['city'] ) ) ) {
				return false;
			}

			$account           = new Install_Module();
			$formatted_address = $this->get_formatted_address_from_package( $package['destination'] );

			if ( isset( $package['destination']['country'] ) && ! empty( $package['destination']['country'] ) && 'RU' == $package['destination']['country'] ) {

				try {

					$clean_address = wc_russian_post_shipping()->get_api()->get_clean_address( 1, $formatted_address );
					$normalize_address = new Address_Normalize( $clean_address );
					$this->set_normalize_address( $normalize_address );

					$rate_params = array(
						'order' => array(
							'account_id'       => $account->get_guid_id(),
							'account_type'     => $account->get_cms_type(),
							'shipping_address' => array( 'location' => array( 'region_zip' => '' ) ),
							'items_price'      => $this->get_cart_total( $package ),
							'total_weight'     => wc_format_decimal( $this->get_cart_contents_weight( 'g' ), 2 )
						)
					);

					if ( $this->get_normalize_address() && $this->get_normalize_address()->get_place() ) {

						if ( $this->get_normalize_address()->is_usable() ) {

							$rate_params['order']['shipping_address'] = array(
								'full_locality_name' => $this->get_normalize_address()->get_formatted_address(),
								'location'           => array(
									'region_zip' => $this->get_normalize_address()->get_index()
								)
							);

						} else {

							$rate_params['order']['shipping_address']['full_locality_name'] = implode( ', ', array_filter( array(
								$this->get_normalize_address()->get_region(),
								$this->get_normalize_address()->get_place()
							) ) );

							if ( ! $this->get_normalize_address()->get_index() ) {

								try {

									$postal_codes = wc_russian_post_shipping()->get_api()->get_postoffice_codes( array_filter( array(
										'settlement' => $this->get_normalize_address()->get_place(),
										'region'     => $this->get_normalize_address()->get_region(),
										'district'   => $this->get_normalize_address()->get_area()
									) ) );

									if ( is_array( $postal_codes ) && ! empty( $postal_codes ) ) {
										$postal_code = wc_russian_post_get_best_match_postal_code( $postal_codes );
										$rate_params['order']['shipping_address']['location']['region_zip'] = $postal_code;
									}

								} catch ( \Exception $e ) {
									wc_russian_post_shipping()->log( $e->getMessage() );
								}

							} else {
								$rate_params['order']['shipping_address']['location']['region_zip'] = $this->get_normalize_address()->get_index();
							}
						}

					} else {
						$rate_params['order']['shipping_address']['full_locality_name'] = $package['destination']['city'];
						if ( ! empty( $package['destination']['postcode'] ) && \WC_Validation::is_postcode( $package['destination']['postcode'], 'RU' ) ) {
							$rate_params['order']['shipping_address']['location']['region_zip'] = $package['destination']['postcode'];
						}
					}

					if( ! $this->get_normalize_address()->get_index() && ! empty( $rate_params['order']['shipping_address']['location']['region_zip'] ) ) {
						$normalize_address->set_index( $rate_params['order']['shipping_address']['location']['region_zip'] );
						$this->set_normalize_address( $normalize_address );
					}

					if( ! $this->get_normalize_address()->get_index() && 'postal' == $this->get_method_type() ) {
						throw new \Woodev_Plugin_Exception( sprintf( __( 'Shipping method %s has been suspended because the zip code was not defined', 'woocommerce-russian-post' ), $this->get_title() ) );
					}

					return $this->get_rate( $rate_params );

				} catch ( \Woodev_Plugin_Exception $e ) {
					wc_russian_post_shipping()->log( $e->getMessage() );
					return false;
				}

			} else {

				return $this->get_rate( array(
					'order' => array(
						'account_id'       => $account->get_guid_id(),
						'account_type'     => $account->get_cms_type(),
						'shipping_address' => array(
							'full_locality_name' => $formatted_address,
							'location'           => array(
								'country' => $package['destination']['country']
							)
						),
						'items_price'      => $this->get_cart_total( $package ),
						'total_weight'     => wc_format_decimal( $this->get_cart_contents_weight( 'g' ), 2 )
					)
				) );
			}
		}

		return false;
	}

	protected function get_rate( $params ) {
		if ( $params && $rates = $this->get_remote_rates( $params, wc_string_to_bool( get_option( 'woocommerce_shipping_debug_mode', 'no' ) ) ) ) {
			return $rates;
		}

		return false;
	}

	/**
	 * @param array $params Shipping params
	 *
	 * @return false|array
	 */
	abstract protected function get_remote_rates( $params, $refresh = false );

	/**
	 * @param array $destination Array of {
	 *                           Types of destination
	 *
	 * @type string $address_1
	 * @type string $city
	 * @type string $state
	 * @type string $postcode
	 * @type string $country
	 *                           }
	 *
	 * @return string
	 */
	private function get_formatted_address_from_package( array $destination ) {

		$formatted = array();

		$args = array_map( 'trim', wp_parse_args( $destination, array(
			'address_1' => '',
			'city'      => '',
			'state'     => '',
			'postcode'  => '',
			'country'   => '',
		) ) );

		if ( ! empty( $args['country'] ) ) {
			$countries = WC()->countries->get_countries();
			if ( ! empty( $countries[ $args['country'] ] ) ) {
				$formatted[] = $countries[ $args['country'] ];
			}
		}

		if ( ! empty( $args['postcode'] ) ) {
			$formatted[] = $args['postcode'];
		}

		if ( ! empty( $args['state'] ) ) {

			$states = WC()->countries->get_states( $args['country'] );

			if ( $states && isset( $states[ $args['state'] ] ) ) {
				$formatted[] = $states[ $args['state'] ];
			} else {
				$formatted[] = $args['state'];
			}
		}

		if ( ! empty( $args['city'] ) ) {
			$formatted[] = trim( $args['city'] );
		}

		if ( ! empty( $args['address_1'] ) ) {
			$formatted[] = trim( $args['address_1'] );
		}

		/**
		 * Filters the address string gotten from destination data array.
		 *
		 * @param string $address_string Formatted address string.
		 * @param array  $destination    Array of destination data.
		 *
		 * @since 1.2.0
		 *
		 */
		return apply_filters( 'wc_russian_post_formatted_address', implode( ', ', $formatted ), $destination );
	}

	/**
	 * @param array $package \WC_Cart::get_shipping_packages()
	 *
	 * @return void
	 */
	public function calculate_shipping( $package = array() ) {

		if ( ! $this->should_send_cart_api_request() ) {
			return;
		}

		if ( ! $this->has_only_selected_shipping_class( $package ) ) {
			wc_russian_post_shipping()->log( __( 'On this order has products that dont match chosen shipping class.', 'woocommerce-russian-post' ) );

			return;
		}

		$rates        = $this->dispatch_rate( $package );
		$allowed_type = $this->get_option( 'allowed_shipment_type', 'any' );

		if ( $rates && is_array( $rates ) ) {

			foreach ( $rates as $rate ) {

				if ( ! empty( $rate->errors ) || ! in_array( $allowed_type, array(
						'any',
						wc_strtoupper( $rate->shipment_type )
					), true ) ) {
					continue;
				}

				$rate_atts = apply_filters( 'wc_russian_post_rates_item', array(
					'id'        => $this->get_rate_id(),
					'label'     => $this->get_title( $rate->shipment_type ),
					'cost'      => $this->get_rate_cost( floatval( $rate->price ), $package ),
					'package'   => $package,
					'meta_data' => array(
						'wc_russian_post_rate' => array(
							'method_type'       => $this->get_method_type(),
							'rate'              => $rate,
							'normalize_address' => $this->get_normalize_address()
						)
					),
				), $rate, $package, $this );

				$this->add_rate( $rate_atts );

				do_action( 'wc_russian_post_rate_calculate_shipping', $rate, $package, $this );
			}
		}

	}

	public function get_rate_cost( $cost, $package = array() ) {

		$free_cost = $this->get_option( 'free_cost', 0 );

		if ( $free_cost > 0 && $package['contents_cost'] > $free_cost ) {
			$cost = wc_format_localized_price( 0 );
		}

		if ( $cost > 0 && wc_string_to_bool( get_option( 'woocommerce_enable_coupons' ) ) && WC()->cart && wc_string_to_bool( $this->get_option( 'coupon_free_shipping', 'no' ) ) ) {

			/** @var \WC_Coupon[] $coupons */
			$coupons = WC()->cart->get_coupons();

			if ( $coupons ) {
				foreach ( $coupons as $code => $coupon ) {
					if ( $coupon->is_valid() && $coupon->get_free_shipping() ) {
						$cost = wc_format_localized_price( 0 );
						break;
					}
				}
			}
		}

		return apply_filters( 'wc_russian_post_rate_cost', $cost, $package, $this );
	}

	public function get_title( $parcel_type = '' ) {
		$title = parent::get_title();

		if ( ! empty( $parcel_type ) && strstr( $title, '%parcel_type%' ) ) {
			$title = str_replace( '%parcel_type%', wc_russian_post_get_parcel_type( $parcel_type ), $title );
		}

		return apply_filters( 'wc_russian_post_method_title', $title, $parcel_type, $this );
	}

	/**
	 * @return string|null
	 */
	public function get_method_type() {
		return $this->method_type;
	}

	/**
	 * @return bool
	 */
	public function is_courier() {
		return 'courier' === $this->get_method_type();
	}

	private function should_send_cart_api_request() {
		return ! (
			( is_admin() && did_action( 'woocommerce_cart_loaded_from_session' ) ) ||
			( defined( 'REST_REQUEST' ) || defined( 'REST_API_REQUEST' ) || defined( 'XMLRPC_REQUEST' ) )
		);
	}

	protected function get_shipping_classes_options() {

		$shipping_classes = WC()->shipping()->get_shipping_classes();

		$options = array(
			'any'  => __( 'Any shipping classes', 'woocommerce-russian-post' ),
			'none' => __( 'Without shipping class', 'woocommerce-russian-post' )
		);

		if ( ! empty( $shipping_classes ) ) {
			$options += wp_list_pluck( $shipping_classes, 'name', 'term_id' );
		}

		return $options;
	}

	protected function has_only_selected_shipping_class( $package ) {
		$only_selected = true;

		if ( 'any' === $this->get_option( 'shipping_class_id', 'any' ) ) {
			return $only_selected;
		}

		foreach ( $package['contents'] as $item_id => $values ) {

			/** @var \WC_Product $product */
			$product = $values['data'];
			$qty     = $values['quantity'];

			if ( $qty > 0 && $product->needs_shipping() ) {
				if ( $product->get_shipping_class_id() && $this->get_option( 'shipping_class_id', 'any' ) !== $product->get_shipping_class_id() ) {
					$only_selected = false;
					break;
				}
			}
		}

		return $only_selected;
	}

	public function generate_multiselect_html( $key, $data ) {

		if ( $key == 'allowed_payments' && $this->is_settings() ) {

			$enabled_gateways = array();

			if ( WC()->payment_gateways() ) {

				foreach ( WC()->payment_gateways()->payment_gateways() as $gateway ) {

					$gateway_title = wc_strtolower( trim( $gateway->get_title() ) ) != wc_strtolower( trim( $gateway->get_method_title() ) ) ? sprintf( '%s (%s)', $gateway->get_title(), $gateway->get_method_title() ) : $gateway->get_title();

					$enabled_gateways[ $gateway->id ] = $gateway_title;
				}
			}

			$data['options'] = $enabled_gateways;
		}

		return parent::generate_multiselect_html( $key, $data );
	}

	private function is_settings() {

		if ( is_admin() ) {
			if ( ! isset( $_REQUEST['page'] ) || 'wc-settings' !== $_REQUEST['page'] ) {
				return false;
			}
			if ( ! isset( $_REQUEST['tab'] ) || 'shipping' !== $_REQUEST['tab'] ) {
				return false;
			}
			if ( $this->supports( 'instance-settings' ) && ( ! isset( $_REQUEST['instance_id'] ) || absint( $_REQUEST['instance_id'] ) !== $this->get_instance_id() ) ) {
				return false;
			}

			return true;
		}

		return false;
	}

	public function get_cart_contents_weight( $unit = 'kg' ) {

		if ( WC()->cart && WC()->cart->get_cart_contents_weight() > 0 ) {
			$weight = wc_get_weight( WC()->cart->get_cart_contents_weight(), $unit );
		} else {
			$weight = wc_get_weight( wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_weight', 500 ), $unit, 'g' ) * WC()->cart->get_cart_contents_count();
		}

		return max( 1, $weight );
	}

	public function get_cart_total( array $package ) {
		$cart_total = isset( $package['chosen_payment_method'] ) && 'cod' == $package['chosen_payment_method'] ? $package['cart_subtotal'] : 0;
		return apply_filters( 'wc_russian_post_shipping_rate_cart_total', $cart_total, $package );
	}

}