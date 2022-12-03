<?php

defined( 'ABSPATH' ) or exit;

class WC_Russian_Post_Checkout {
	
	public function __construct() {
		
		$options = get_option( 'woocommerce_wc_russian_post_settings', array() );
		
		if ( isset( $options['auto_export_orders'] ) && 'yes' === $options['auto_export_orders'] && isset( $options['export_statuses'] ) && ! empty( $options['export_statuses'] ) ) {
			
			foreach( $options['export_statuses'] as $export_status ) {
				$status_slug = ( 'wc-' === substr( $export_status, 0, 3 ) ) ? substr( $export_status, 3 ) : $export_status;
				add_action( 'woocommerce_order_status_' . $status_slug, array( $this, 'export_order_on_payment' ), 99 );
			}
		}
		
		add_action( 'wp_ajax_wc_russian_post_export_order', array( $this, 'process_order_export' ) );
		add_action( 'wp_ajax_wc_russian_post_remove_order', array( $this, 'process_order_remove' ) );
		
		add_filter( 'woocommerce_email_order_meta', array( $this, 'add_completed_email_tracking' ), 10, 3 );
		
		add_action( 'woocommerce_order_details_after_order_table', array( $this, 'add_view_order_tracking' ) );
		
		add_filter( 'woocommerce_available_payment_gateways', array( $this, 'remove_cod_payment_method' ) );
		
		add_action( 'woocommerce_cart_calculate_fees', array( $this, 'add_checkout_russian_cod_payment_fee' ) );
		
		add_action( 'woocommerce_review_order_before_payment', array( $this, 'add_additional_services' ) );
		
		add_filter( 'woocommerce_update_order_review_fragments', array( $this, 'order_review_fragments' ) );
		
		add_action( 'wp_footer', array( $this, 'checkout_additional_services_refresh' ) );
		
		add_action( 'wp_ajax_wc_russian_post_customer_notice_ajax_data', array( $this, 'checkout_additional_services_set_session' ) );
		add_action( 'wp_ajax_nopriv_wc_russian_post_customer_notice_ajax_data', array( $this, 'checkout_additional_services_set_session' ) );
		
		add_action( 'wc_ajax_set_russian_post_point', array( $this, 'set_russian_post_point' ) );
		add_action( 'wc_ajax_ajax_get_user_location', array( $this, 'ajax_get_user_location' ) );
		add_action( 'wc_ajax_ajax_get_postoffice_by_index', array( $this, 'ajax_get_postoffice_by_index' ) );
		add_action( 'wc_ajax_address_autocomplete', array( $this, 'address_autocomplete' ) );
		add_action( 'wc_ajax_set_edostavka_customer_city', array( $this, 'set_edostavka_customer_city' ) );
		//add_action( 'wc_ajax_set_customer_address', array( $this, 'set_customer_address' ) );
		
		add_filter( 'edostavka_update_order_review_address_args', array( $this, 'unset_customer_default_address' ), 10, 2 );
		
		add_filter( 'woocommerce_cart_shipping_packages', array( $this, 'set_shipping_packages' ) );
		
		add_action( 'woocommerce_after_shipping_rate', array( $this, 'shipping_rate_additional_information' ), 10, 2 );
		//add_action( 'woocommerce_after_shipping_rate', array( $this, 'add_delivery_points' ), 12, 2 );
		add_action( 'woocommerce_review_order_after_shipping', array( $this, 'add_delivery_points' ) );
		
		add_action( 'wp_footer', array( $this, 'add_map_template' ) );
		
		if( apply_filters( 'wc_russian_post_allow_checkout_styles', true ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'load_styles' ) );
		}
		
		add_filter( 'woocommerce_validate_postcode', array( $this, 'validate_postcode' ), 10, 3 );
		
		add_filter( 'woocommerce_shipping_may_be_available_html', array( $this, 'notice_text' ) );
		
		add_filter( 'woocommerce_default_address_fields', array( $this, 'set_default_customer_location' ), 16 );
		
		add_action( 'woocommerce_after_checkout_validation', array( $this, 'checkout_validation' ), 10, 2 );
		
		add_filter( 'woocommerce_checkout_posted_data', array( $this, 'set_cod_payment_if_exists' ) );
		add_action( 'woocommerce_checkout_update_order_meta', array( $this, 'update_order_meta' ), 10, 2 );
	}
	
	public function load_styles() {
		
		if( is_admin() ) {
			return;
		}
		
		$map_api_url = add_query_arg( array(
			'lang' 		=> get_locale(),
			'ns'		=> 'WCRussianPostMaps',
			'apikey' 	=> apply_filters( 'wc_russian_post_map_api_key', '27feee8b-07c9-47e2-b9c2-a9475a05c57f' )
		), '//api-maps.yandex.ru/2.1/' );
		
		wp_enqueue_style( 'jquery-ui', '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css' );
		
		wp_enqueue_style( 'wc-russian-post-checkout-style', wc_russian_post_shipping()->get_plugin_url() . '/assets/css/frontend/checkout.css', array(), WC_RUSSIAN_POST_SHIPPING_VERSION );
		wp_enqueue_style( 'wc-russian-post-widget', wc_russian_post_shipping()->get_plugin_url() . '/assets/css/frontend/widget.css', array(), WC_RUSSIAN_POST_SHIPPING_VERSION );
		
		wp_register_script( 'wc_russian_post_widget_map', $map_api_url, array(), '2.1', true );
		wp_register_script( 'jquery-blockui', WC()->plugin_url() . '/assets/js/jquery-blockui/jquery.blockUI.js', array( 'jquery' ), '2.70', true );
		wp_register_script( 'wc-backbone-modal', WC()->plugin_url() . '/assets/js/admin/backbone-modal.js', array( 'underscore', 'backbone', 'wp-util' ), WC_VERSION );
		
		if( is_cart() || is_checkout() ) {
			wp_enqueue_script( 'wc_russian_post_widget', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/frontend/widget.js', array( 'jquery-blockui', 'wc-backbone-modal', 'wc_russian_post_widget_map' ), WC_RUSSIAN_POST_SHIPPING_VERSION, true );
			wp_enqueue_script( 'wc_russian_post_checkout', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/frontend/checkout.js', array( 'jquery-ui-autocomplete' ), WC_RUSSIAN_POST_SHIPPING_VERSION, true );
			wp_localize_script( 'wc_russian_post_widget', 'wc_russian_post_map_params', $this->get_js_localize_script_params() );
		}
		
	}
	
	public function get_js_localize_script_params() {
		
		$options = get_option( 'woocommerce_wc_russian_post_settings', array() );
		
		return apply_filters( 'wc_russian_post_checkout_script_params', array(
			'ajax_url' 					=> WC_AJAX::get_endpoint( '%%endpoint%%' ),
			'wc_russian_post_notice'	=> wp_create_nonce( 'wc_russian_post_notice' ),
			'chosen_pvz'				=> WC()->session && WC()->session->get( 'wc_russian_post_seted_delivery_point' ) ? WC()->session->get( 'wc_russian_post_seted_delivery_point' ) : null,
			'cart_weight'				=> WC()->cart && round( WC()->cart->cart_contents_weight ) ? min( 500, wc_get_weight( WC()->cart->cart_contents_weight, 'g' ) ) : $options['minimum_weight'],
			'cart_cost_total'			=> WC()->cart ? round( WC()->cart->get_cart_contents_total() ) : 0,
			'locale'					=> get_locale() == 'ru_RU' ? 'ru' : 'en',
			'show_search_control'		=> 'yes' === $options['show_search_control'],
			'enable_geolocation_control' => 'yes' === $options['enable_geolocation_control'],
			'enable_suggestions'		=> 'yes' === $options['enable_address_suggestions'],
			'replace_address_field'		=> 'yes' === $options['replace_address_field_params'],
			'replace_address_from_map'	=> 'yes' === $options['replace_address_from_map'],
			'cdek_exist'				=> ( class_exists( 'WC_Edostavka' ) || class_exists( 'WC_Edostavka_Calc_Shipping' ) ) ? true : false,
			'strings'					=> array(
				'point_failed'		=> __( 'Failed to set pickup point', 'woocommerce-russian-post' )
			)
		) );
	}
	
	public function process_order_export() {

		if ( ! current_user_can( 'manage_woocommerce' ) || ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'У вас не достаточно прав что бы просмативать эту страницу.' );
		}

		if ( ! check_admin_referer( 'wc_russian_post_export_order' ) ) {
			wp_die( 'Что то пошло не так, пожалуйста попробуйте снова.' );
		}

		$order_id = ( isset( $_GET['order_id'] ) && is_numeric( $_GET['order_id'] ) ) ? (int) $_GET['order_id'] : '';

		if ( ! $order_id ) {
			die;
		}

		$order = new WC_Russian_Post_Order( $order_id );

		$order->export();

		wp_safe_redirect( wp_get_referer() );
		exit;
	}
	
	public function process_order_remove() {
		if ( ! current_user_can( 'manage_woocommerce' ) || ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'У вас не достаточно прав что бы просмативать эту страницу.' );
		}
		
		if ( ! check_admin_referer( 'wc_russian_post_remove_order' ) ) {
			wp_die( 'Что то пошло не так, пожалуйста попробуйте снова.' );
		}
		
		$order_id = ( isset( $_GET['order_id'] ) && is_numeric( $_GET['order_id'] ) ) ? (int) $_GET['order_id'] : '';

		if ( ! $order_id ) {
			die( 'ID заказа не определён.' );
		}

		$order = new WC_Russian_Post_Order( $order_id );

		$order->remove_order();

		wp_safe_redirect( wp_get_referer() );
		exit;
	}
	
	public function export_order_on_payment( $order_id ) {
		
		if ( apply_filters( 'wc_russian_post_auto_export_order', true, $order_id ) ) {

			$order = new WC_Russian_Post_Order( $order_id );

			$order->export();
		}
	}
	
	public function add_completed_email_tracking( $order, $sent_to_admin = false, $plain_text = false ) {

		$order = new WC_Russian_Post_Order( $order );
		if( ! empty( $order->tracking_number ) ) {
			
			$tracking_url = sprintf( 'https://www.pochta.ru/new-tracking#%s', $order->tracking_number );
			
			if ( $plain_text ) {
				echo 'Отслеживание заказа: ' . esc_url( $tracking_url ) . "\n\n";
			} else {
				echo '<p style="margin: 16px 0 0;"><a href="' . esc_url( $tracking_url ) . '">' . __( 'Follow delivery status', 'woocommerce-russian-post' ) . '</a></p>';
			}
		}
		
	}
	
	public function add_view_order_tracking( $order ) {

		$order = new WC_Russian_Post_Order( $order );
		
		if( ! empty( $order->tracking_number ) ) {
			
			$tracking_url = sprintf( 'https://www.pochta.ru/new-tracking#%s', $order->tracking_number );
		
			printf( '<p class="wc-russian_post-track-shipment"><a href="%s" class="button" target="_blank">%s</a></p>', $tracking_url, __( 'Follow delivery status', 'woocommerce-russian-post' ) );
		}
		
	}
	
	public function remove_cod_payment_method( $available_gateways ) {
		
		if( isset( $available_gateways['cod'] ) && $this->chosen_rate_is_russian_post() ) {
			unset( $available_gateways['cod'] );
		}		
		
		return $available_gateways;
	}
	
	protected function chosen_rate_is_russian_post( $need_instance = false ) {
		
		if( WC()->session ) {
			$shipping_packages  = WC()->shipping()->get_packages();
			$chosen_shipping_methods_session = WC()->session->get( 'chosen_shipping_methods' );

			if ( ! empty( $chosen_shipping_methods_session ) && is_array( $chosen_shipping_methods_session ) ) {
				foreach ( $chosen_shipping_methods_session as $package_key => $chosen_package_rate_id ) {
					if ( ! empty( $shipping_packages[ $package_key ]['rates'][ $chosen_package_rate_id ] ) ) {
						$chosen_rate = $shipping_packages[ $package_key ]['rates'][ $chosen_package_rate_id ];
						if( Woodev_Helper::str_starts_with( $chosen_rate->get_method_id(), wc_russian_post_shipping()->get_method_id() ) ) {
							
							if( $need_instance ) {
								return $chosen_rate->get_instance_id();
							}
							
							return true;
						}
					}
				}
			}
		}
		
		return false;
	}
	
	public function add_checkout_russian_cod_payment_fee( $cart ) {
		
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) return;
		
		$chosen_gateway = WC()->session ? WC()->session->get( 'chosen_payment_method' ) : Woodev_Helper::get_post( 'payment_method' );
		
		if( ! class_exists( 'WD_Russian_Post_Gateway_COD' ) ) {
			require_once( wc_russian_post_shipping()->get_plugin_path() . '/includes/class-wc-russian-gateway-cod.php' );
		}
		
		$cod_method = new WD_Russian_Post_Gateway_COD;
		
		if ( $chosen_gateway == $cod_method->id ) {
			$fee = $cart->add_fee( $cod_method->fee_text, $cod_method->get_fee( $cart ) );
			if( $fee > 0 ) {
				return $fee;
			}
		}		
	}
	
	public function add_additional_services() {
		
		echo '<div id="wc-russian-customer-notices">';
		
		$instance_id = $this->chosen_rate_is_russian_post( true );
		$shipping_method = WC_Shipping_Zones::get_shipping_method( $instance_id );
		
		if ( $shipping_method ) {
			
			if( method_exists( $shipping_method, 'allowed_sms_notice' ) && $shipping_method->allowed_sms_notice() ) {
				
				echo '<h3>' . __( 'SMS notices', 'woocommerce-russian-post' ) . '</h3>';
				woocommerce_form_field( 'wc_russian_post_sms_notice', array(
					'type' 		=> 'checkbox',
					'class' 	=> array( 'form-row-wide' ),
					'label'		=> __( 'I would like get SMS notices', 'woocommerce-russian-post' ),
					'default'	=> 'no'
				), WC()->session->get( 'wc_russian_post_sms_notice' ) );
			
			}
			
		}
		
		echo '</div>';
		
	}
	
	public function order_review_fragments( $fragments ) {
		
		ob_start();
		$this->add_additional_services();
		$buffer = ob_get_clean();
			
		$fragments['#wc-russian-customer-notices'] = $buffer;
		
		return $fragments;
	}
	
	public function checkout_additional_services_refresh() {
		if ( ! is_checkout() ) return;
		?>
		<script type="text/javascript">
		jQuery( function($){
			$( document.body ).on( 'updated_checkout', function() {
				
				$( 'form.checkout' ).on( 'change', 'input[name=wc_russian_post_sms_notice]', function( e ) {
					
					e.preventDefault();
					var value = $( this ).is( ':checked' ) ? 1 : '';
					
					$.ajax( {
						type: 'POST',
						url: wc_checkout_params.ajax_url,
						data: {
							'action': 'wc_russian_post_customer_notice_ajax_data',
							'checked': value,
						},
						success: function ( result ) {
							if( result.success ) {
								$( document.body ).trigger( 'update_checkout', { update_shipping_method: true } );
							}
						}
					} );
				} );
			} );
		});
		</script>
		<?php
	}
	
	public function checkout_additional_services_set_session() {
		
		WC()->session->set( 'wc_russian_post_sms_notice', Woodev_Helper::get_post( 'checked' ) );
			
		wp_send_json_success();
	}
	
	public function set_russian_post_point() {
		if( wp_create_nonce( 'wc_russian_post_notice', 'wc_russian_post_points_nonce' ) ) {
			
			$pvzdata = $_POST && isset( $_POST['pvzdata'] ) ? $_POST['pvzdata'] : null;
			
			if( ! is_null( $pvzdata ) ) {
				
				if( WC()->session ) {
					WC()->session->set( 'wc_russian_post_seted_delivery_point', wc_clean( $pvzdata ) );
				}
				
				wp_send_json_success( $pvzdata['indexTo'] );
			
			} else {
				wp_send_json_error( 'Не передан обязательный параметр pvzdata.' );
			}
			
		} else {
			wp_send_json_error( 'Проверка секретного ключа не прошла.' );
		}
	}
	
	public function ajax_get_user_location() {
		$coordinates = wc_russian_post_get_customer_coordinates();
		wp_send_json_success( array( $coordinates['lat'], $coordinates['lon'] ) );
	}
	
	public function ajax_get_postoffice_by_index() {
		try {
			
			$postoffice = wc_russian_post_shipping()->get_api()->get_postoffice_by_index( wc_clean( $_POST['zip'] ) );
			
			$result = Woodev_Helper::get_post( 'full_info' ) ? $postoffice : array( $postoffice->latitude, $postoffice->longitude );
			
			wp_send_json_success( $result );
		
		} catch( Woodev_API_Exception $e ) {
				
			wc_russian_post_shipping()->log( $e->getMessage() );
			wp_send_json_error( $e->getMessage() );
		}
	}
	
	public function address_autocomplete() {
		
		try {
			
			$post_offeces = wc_russian_post_shipping()->get_api()->get_postoffice_by_address( wc_clean( Woodev_Helper::get_request( 'term' ) ) );
			wp_send_json_success( $post_offeces );
		
		} catch( Woodev_API_Exception $e ) {
				
			wc_russian_post_shipping()->log( $e->getMessage() );
			wp_send_json_error( $e->getMessage() );
		}
	}
	
	public function set_edostavka_customer_city() {
		if( function_exists( 'wc_edostavka_set_customer_state_id' ) && isset( $_POST['city'] ) && ! empty( $_POST['city'] ) ) {
			
			$data = $this->get_edostavka_location_data( array(
				'country_codes'	=> ( isset( $_POST['country'] ) && ! empty( $_POST['country'] ) ) ? $_POST['country'] : 'RU',
				'city' 			=> wc_clean( $_POST['city'] ),
				'postal_code'	=> ( isset( $_POST['postcode'] ) && ! empty( $_POST['postcode'] ) ) ? wc_clean( $_POST['postcode'] ) : null
			) );
			
			if( isset( $data['code'] ) ) {
				wc_edostavka_set_customer_state_id( $data['code'] );
				wp_send_json_success( $data['code'] );
			} else {
				wp_send_json_error( 'Не удалось получить ID города.' );
			}
		}
	}
	
	protected function get_edostavka_location_data( $attr = array() ) {
		
		try {
			
			if( method_exists( WC_Edostavka_Integration::class, 'get_access_token' ) ) {
				
				$reflection = new ReflectionMethod( WC_Edostavka_Integration::class, 'get_access_token' );
				
				if( ! $reflection->isPublic() ) {
					throw new Woodev_Plugin_Exception( sprintf( 'Метод get_access_token класса %s не является публичным. Вам нужно обновить плагин СДЭК, что бы эта функция работала корректно.', WC_Edostavka_Integration::class ) );
				} else {
					
					$access_token = wc_russian_post_shipping()->get_integration_by_name( 'edostavka-integration' )->get_access_token();
			
					if( $access_token && ! empty( $access_token ) ) {
						
						$api_params = wp_parse_args( $attr, array(
							'country_codes'	=> 'RU',
							'size'	=> 1
						) );
						
						if( isset( $api_params['postal_code'] ) && ! empty( $api_params['postal_code'] ) ) {
							$api_params['postal_code'] = wc_format_postcode( $api_params['postal_code'], 'RU' );
						}
						
						$response = wp_remote_get( add_query_arg( $api_params, 'https://api.cdek.ru/v2/location/cities' ), array(
							'headers'   => array(
								'Authorization' => sprintf( 'Bearer %s', $access_token )
							)
						) );
						
						if ( ! is_wp_error( $response ) && 200 == wp_remote_retrieve_response_code( $response ) ) {
							$response_data = json_decode( wp_remote_retrieve_body( $response ), true );
							if( isset( $response_data[0] ) && ! empty( $response_data[0] ) ) {
								return $response_data[0];
							}
						
						} elseif( is_wp_error( $response ) ) {
							throw new Woodev_Plugin_Exception( $response->get_error_message() );
						}
					
					} else {
						throw new Woodev_Plugin_Exception( 'Не удалось получить токен для запросов к API СДЭК.' );
					}
				}
			}
		
		} catch( Woodev_Plugin_Exception $e ) {
			wc_russian_post_shipping()->log( $e->getMessage() );
		}
		
		return null;
	}
	
	public function set_customer_address() {
		if( WC()->customer && WC()->session && isset( $_POST['address'] ) ) {
			WC()->customer->set_billing_address_1( wc_clean( $_POST['address'] ) );
			WC()->customer->save();
			WC()->session->set( 'to_door_address', wc_clean( $_POST['address'] ) );
			wp_send_json_success( 'Адрес пользователя установлен.' );
		}
	}
	
	public function unset_customer_default_address( $billing_address_args, $method ) {
		
		if( ! $method instanceof WC_Edostavka_Shipping && WC()->customer ) {
			$billing_address_args['default'] = WC()->customer->get_billing_address_1();
		}
		
		return $billing_address_args;
	}
	
	public function set_shipping_packages( $packages ) {
	
		$methods = WC()->shipping->load_shipping_methods();

		if ( ! isset( $methods[ wc_russian_post_shipping()->get_method_id() ] ) || 'yes' !== $methods[ wc_russian_post_shipping()->get_method_id() ]->enabled ) {
			return $packages;
		}
		
		$new_packages = array();

		foreach( $packages as $package_key => $package ) {
			$new_packages[ $package_key ] = $package;
			$new_packages[ $package_key ]['wc_russian_post_sms_notice'] = WC()->session ? WC()->session->get( 'wc_russian_post_sms_notice' ) : Woodev_Helper::get_post( 'wc_russian_post_sms_notice' );
			
			if( function_exists( 'wc_edostavka_get_customer_state_id' ) ) {
				$new_packages[ $package_key ]['destination']['state_id'] = wc_edostavka_get_customer_state_id();
			}
		}

		return $new_packages;
	}
	
	public function add_delivery_points() {
		
		$chosen_rate = $this->chosen_rate_is_russian_post( true );
		
		if ( $chosen_rate ) {
			
			$method_instance = WC_Shipping_Zones::get_shipping_method( $chosen_rate );
			
			if( $method_instance->is_ecom() ) {
				
				$out = '';
				$button_text = __( 'Choose delivery point', 'woocommerce-russian-post' );
				$button_classes = array( 'wc-russian-post-choose-delivery-point' );
				
				if( WC()->session && ( $pvzdata = WC()->session->get( 'wc_russian_post_seted_delivery_point' ) ) ) {
					
					$address = array();
					
					foreach( array( 'indexTo', 'regionTo', 'areaTo', 'cityTo', 'streetTo', 'houseTo' ) as $field ) {
						if( empty( $pvzdata[ $field ] ) ) continue;
						$address[] = $pvzdata[ $field ];
					}
					
					$out .= sprintf( '<p>%s: <strong>%s</strong>.</p>', __( 'You have chosen delivery point', 'woocommerce-russian-post' ), implode( ', ', $address ) );
					$button_text = __( 'Another delivery point', 'woocommerce-russian-post' );
					$button_classes[] = 'wc-russian-post-choose-delivery-point--chosen';
				}
				
				$out .= sprintf( '<button class="button %s">%s</button>', implode( ' ', $button_classes ), $button_text );
		
				printf( '<tr class="cart-delivery-points"><th>%s: </th><td>%s</td></tr>', __( 'Delivery point', 'woocommerce-russian-post'), $out );
			
			}
			
		}
	}
	
	public function add_map_template() {
		include_once( wc_russian_post_shipping()->get_plugin_path() . '/templates/html-modal-map.php' );
	}
	
	public function shipping_rate_additional_information( $method, $index ) {
		if( ! Woodev_Helper::str_starts_with( $method->get_method_id(), wc_russian_post_shipping()->get_method_id() ) ) {
			return;
		}
		
		$method_instance = WC_Shipping_Zones::get_shipping_method( $method->get_instance_id() );
		$meta_data = $method->get_meta_data();
		$delivery_time = '';
		$description_rate = '';
		$additional_time = intval( $method_instance->additional_time );
		
		if( 'yes' === $method_instance->show_delivery_time ) {
			
			$min_days = isset( $meta_data['min_days'] ) ? intval( $meta_data['min_days'] ) + $additional_time : 0;
			$max_days = isset( $meta_data['max_days'] ) ? intval( $meta_data['max_days'] ) + $additional_time : 0;
			$min_days_str = $min_days > 0 ? $this->date_days_patern( $min_days ) : 'today';
			$max_days_str = $max_days > 0 ? $this->date_days_patern( $max_days ) : 'tomorrow';
			
			$from = sprintf( __( 'from %s', 'woocommerce-russian-post' ), $this->string_to_date_i18n( $min_days_str ) );
			$to = sprintf( _x( 'to %s', 'количество дней ДО', 'woocommerce-russian-post' ), $this->string_to_date_i18n( $max_days_str ) );
			
			if( $max_days > 0 && ( $min_days !== 0 && $max_days !== $min_days ) ) {
				$delivery_time = sprintf( '<p class="wc-russian-post-method-delivery-time">%s: %s %s</p>', __( 'Time of delivery', 'woocommerce-russian-post' ), $from, $to );			
			} elseif( $max_days > 0 && ( $min_days == 0 || $max_days == $min_days ) ) {
				$delivery_time = sprintf( '<p class="wc-russian-post-method-delivery-time">%s: %s</p>', __( 'Time of delivery', 'woocommerce-russian-post' ), $to );
			}
		}
		
		if( ! empty( $method_instance->description_rate ) ) {
			$description_rate = sprintf( '<p class="wc-russian-post-method-description">%s</p>', esc_textarea( $method_instance->description_rate ) );
		}
		
		if( ! empty( $delivery_time ) || ! empty( $description_rate ) ) {
			echo '<div class="wc-russian-post-method-additional-info">';
			echo $delivery_time;
			echo $description_rate;
			echo '</div>';
		}
	}
	
	private function date_days_patern( $days ) {
		return sprintf( _n( '%s day', '%s days', $days ), $days );
	}
	
	private function string_to_date_i18n( $string ) {
		return wc_string_to_datetime( $string )->date_i18n( wc_date_format() );
	}
	
	public function validate_postcode( $valid, $postcode, $country ) {
		
		if( 'RU' == $country ) {
			$valid = preg_match( '/^([0-9]{6})$/', $postcode ) ? true : false;
		}
		
		return $valid;
	}
	
	public function notice_text( $text ) {
		$text .= '<p>Для расчёта стоимости доставки через Почта РФ, вам так же необходимо ввести ваш почтовый индекс.</p>';
		return $text;
	}
	
	public function set_default_customer_location( $fields ) {
		
		try {
			
			if( 'yes' == wc_russian_post_shipping()->get_shipping_option( 'autocomplate_customer_address', 'no' ) ) {
				
				$location = wc_russian_post_shipping()->get_customer_coordinates();
				
				if( empty( $location ) ) {
					throw new Woodev_API_Exception( 'Геоданные пользователя не определилсь' );
				}
				
				foreach( $location as $key => $value ) {
					if( ! isset( $fields[ $key ] ) ) {
						continue;
					}
					
					if( 'city' == $key ) {
						
						if( in_array( $fields[ $key ]['type'], array( 'select' ), true ) ) {
							$fields[ $key ]['options'] = array( $value => $value );
						}						
						
						if( function_exists( 'wc_edostavka_set_customer_state_id' ) && function_exists( 'wc_edostavka_get_customer_state_id' ) ) {
							$current_state_id = wc_edostavka_get_customer_state_id();
							if( ( empty( $current_state_id ) || 0 === $current_state_id ) ) {
								
								$edostavka_location = $this->get_edostavka_location_data( array(
									'country_codes'	=> $location['country'] ? $location['country'] : 'RU',
									'city' 			=> $value,
									'postal_code'	=> $location['postcode'] ? $location['postcode'] : null
								) );
								
								if( $edostavka_location && ! empty( $edostavka_location ) && isset( $edostavka_location['code'] ) ) {
									wc_edostavka_set_customer_state_id( $edostavka_location['code'] );
								}
							}
							
						}
					}
					
					if( function_exists( 'wc_edostavka_get_customer_state_id' ) ) {
						$fields[ 'state_id' ]['default'] = wc_edostavka_get_customer_state_id();
					}
					
					$fields[ $key ]['default'] = $value;
				}
			
			} else {
				throw new Woodev_API_Exception( 'Опция автоматического опреления геолокации отключена' );
			}
		
		} catch( Woodev_API_Exception $e ) {
			wc_russian_post_shipping()->log( $e->getMessage() );
		}
		
		return $fields;
	}
	
	public function checkout_validation( $data, $errors ) {
		
		if( $data && $data['shipping_method'] ) {
			
			$chosen_method_ecom = false;
			
			foreach( $data['shipping_method'] as $method ) {
				if( Woodev_Helper::str_starts_with( $method, sprintf( '%s_ecom', wc_russian_post_shipping()->get_method_id() ) ) ) {
					$chosen_method_ecom = true;
					break;
				}
			}
			
			if( WC()->session && $chosen_method_ecom ) {
				$seted_delivery_point = WC()->session->get( 'wc_russian_post_seted_delivery_point' );
				if( empty( $seted_delivery_point ) ) {
					$errors->add( 'shipping', __( 'To continue you must select delivery point (post office) on the map', 'woocommerce-russian-post' ) );
				}
			}
		}
		
	}
	
	public function set_cod_payment_if_exists( $data ) {
		if( wc_russian_user_is_cod_enabled() && isset( $_POST['wc_russian_post_payment_by_cod'] ) ) {
			$data['payment_by_cod'] = true;
		}
		
		return $data;
	}
	
	public function update_order_meta( $order_id, $data ) {
		if( isset( $data['payment_by_cod'] ) && $data['payment_by_cod'] ) {
			$order = new WC_Russian_Post_Order( $order_id );
			$order->update_order_meta( 'payment_by_cod', true );
		}
	}
}