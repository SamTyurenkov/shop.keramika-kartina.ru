<?php

namespace Woodev\Russian_Post\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Integration extends \WC_Integration {

	public function __construct() {

		if ( ! is_textdomain_loaded( 'woocommerce-russian-post' ) ) {
			wc_russian_post_shipping()->load_translations();
		}

		$this->id                 = wc_russian_post_shipping()->get_method_id();
		$this->method_title       = sprintf( __( 'Russian Post (v%s)', 'woocommerce-russian-post' ), WC_RUSSIAN_POST_SHIPPING_VERSION );
		$this->method_description = sprintf( __( 'Main settings of <a href="%s">%s</a>.', 'woocommerce-russian-post' ), 'https://passport.pochta.ru/', wc_russian_post_shipping()->get_plugin_name() );

		$this->init_form_fields();
		$this->init_settings();

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'woocommerce_update_options_integration_' . $this->id, array( $this, 'process_admin_options' ) );
	}

	public function process_admin_options() {
		wc_russian_post_shipping()->get_site_settings( isset( $_POST['save'] ) );
		parent::process_admin_options();

		wp_clear_scheduled_hook( 'wc_russian_post_orders_update' );
	}

	public function enqueue_scripts() {
		if ( wc_russian_post_shipping()->is_plugin_settings() ) {
			wp_enqueue_script( 'wc-russian-post-integration-settings', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/admin/integration-settings.js', array(
				'jquery'
			), WC_RUSSIAN_POST_SHIPPING_VERSION, true );
			wp_localize_script( 'wc-russian-post-integration-settings', 'wc_russian_post_integration_params', array(
				'allow_edostavka_suggestions' => wc_russian_post_is_allow_edostavka_address_suggestions()
			) );
		}
	}

	public function admin_options() {
		$this->display_errors();
		parent::admin_options();
	}

	public function init_form_fields() {

		$form_fields = array(
			'account'                    => array(
				'title'       => __( 'Authorization', 'woocommerce-russian-post' ),
				'type'        => 'title',
				'description' => $this->get_auth_description(),
			),
			'account_name'               => array(
				'title'             => __( 'Username', 'woocommerce-russian-post' ),
				'type'              => 'text',
				'placeholder'       => esc_html__( 'Phone number or email', 'woocommerce-russian-post' ),
				'desc_tip'          => esc_html__( 'Enter your username from Russian Post account', 'woocommerce-russian-post' ),
				'custom_attributes' => array(
					'autocomplete' => 'off',
					'required'     => 'required',
					'oninvalid'    => "this.setCustomValidity( 'Необходимо указать имя пользователя от личного кабинета Почты РФ.' )",
					'oninput'      => "setCustomValidity('')"
				),
				'sanitize_callback' => array( $this, 'validate_account_username' )
			),
			'account_password'           => array(
				'title'             => __( 'Password', 'woocommerce-russian-post' ),
				'type'              => 'text',
				'placeholder'       => esc_html__( 'Enter your password', 'woocommerce-russian-post' ),
				'desc_tip'          => esc_html__( 'Enter password from your Russian Post account. Notice: Password should not includes special symbols like as #,%,&,$,! etc', 'woocommerce-russian-post' ),
				'custom_attributes' => array(
					'autocomplete' => 'off',
					'required'     => 'required',
					'oninvalid'    => "this.setCustomValidity( 'Необходимо указать пароль от личного кабинета Почты РФ.' )",
					'oninput'      => "setCustomValidity('')"
				)
			),
			'account_token'              => array(
				'title'             => __( 'Auth token', 'woocommerce-russian-post' ),
				'type'              => 'text',
				'placeholder'       => esc_html__( 'Enter your authorization token', 'woocommerce-russian-post' ),
				'description'       => __( 'You can get the token on your account page of Russian Post. It locate on <a href="https://otpravka.pochta.ru/settings#/api-settings">settings API page</a>.', 'woocommerce-russian-post' ),
				'custom_attributes' => array(
					'autocomplete' => 'off',
					'required'     => 'required',
					'oninvalid'    => "this.setCustomValidity( 'Необходимо указать токен авторизации. Без этого значения плагин работать не будет!' )",
					'oninput'      => "setCustomValidity('')"
				)
			),
			'authorization'              => array(
				'type' => 'authorization'
			),
			'package_dimension'          => array(
				'title'       => __( 'Goods dimensions', 'woocommerce-russian-post' ),
				'type'        => 'title',
				'description' => esc_html__( 'Enter product`s default parameters. These parameters using only in case when product doesnt have it.', 'woocommerce-russian-post' )
			),
			'minimum_weight'             => array(
				'title'    => __( 'Weight, (gram)', 'woocommerce-russian-post' ),
				'type'     => 'text',
				'default'  => 500,
				'desc_tip' => esc_html__( 'Enter weight for single product.', 'woocommerce-russian-post' ),
			),
			'minimum_height'             => array(
				'title'    => __( 'Height, (mm.)', 'woocommerce-russian-post' ),
				'type'     => 'text',
				'default'  => 150,
				'desc_tip' => esc_html__( 'Enter height for single product.', 'woocommerce-russian-post' ),
			),
			'minimum_width'              => array(
				'title'    => __( 'Width, (mm.)', 'woocommerce-russian-post' ),
				'type'     => 'text',
				'default'  => 150,
				'desc_tip' => esc_html__( 'Enter width for single product.', 'woocommerce-russian-post' ),
			),
			'minimum_length'             => array(
				'title'    => __( 'Length, (mm.)', 'woocommerce-russian-post' ),
				'type'     => 'text',
				'default'  => 150,
				'desc_tip' => esc_html__( 'Enter length for single product.', 'woocommerce-russian-post' )
			),
			'fields_params'              => array(
				'title'       => __( 'Order fields params', 'woocommerce-russian-post' ),
				'type'        => 'title',
				'description' => __( 'Set up behaves fields of checkout form like as Address, City, Postal Code etc', 'woocommerce-russian-post' )
			),
			'enable_state_suggestions'   => array(
				'title'    => __( 'State suggestions', 'woocommerce-russian-post' ),
				'desc_tip' => esc_html__( 'Allow auto-suggestions for "State" field on checkout page. It works only Russian`s addresses.', 'woocommerce-russian-post' ),
				'default'  => 'yes',
				'label'    => __( 'Enable/Disable', 'woocommerce-russian-post' ),
				'type'     => 'checkbox'
			),
			'enable_city_suggestions'    => array(
				'title'    => __( 'City suggestions', 'woocommerce-russian-post' ),
				'desc_tip' => esc_html__( 'Allow auto-suggestions for "City" field on checkout page. It works only Russian`s addresses.', 'woocommerce-russian-post' ),
				'default'  => 'yes',
				'label'    => __( 'Enable/Disable', 'woocommerce-russian-post' ),
				'type'     => 'checkbox'
			),
			'enable_address_suggestions' => array(
				'title'    => __( 'Address suggestions', 'woocommerce-russian-post' ),
				'desc_tip' => esc_html__( 'Allow auto-suggestions for "Address" field on checkout page. It works only Russian`s addresses.', 'woocommerce-russian-post' ),
				'default'  => 'yes',
				'label'    => __( 'Enable/Disable', 'woocommerce-russian-post' ),
				'type'     => 'checkbox'
			),
			'fill_postcode_by_address'   => array(
				'title'    => __( 'Fill postcode', 'woocommerce-russian-post' ),
				'desc_tip' => esc_html__( 'Enable this option to allow to fill the field of zipcode by selected address. It works only if "Address suggestions" option is enabled.', 'woocommerce-russian-post' ),
				'default'  => 'yes',
				'label'    => __( 'Yes/No', 'woocommerce-russian-post' ),
				'type'     => 'checkbox'
			),
			'hide_fields'                => array(
				'title'    => __( 'Hide address & post code fields', 'woocommerce-russian-post' ),
				'label'    => __( 'Enable this option if you want to hide the address and postal code fields when the chosen shipping method type is "To postal office".', 'woocommerce-russian-post' ),
				'default'  => 'yes',
				'type'     => 'checkbox',
				'desc_tip' => esc_html__( 'Enable or disable this option as you need', 'woocommerce-russian-post' )
			),
			'auto_close_map'             => array(
				'title'    => __( 'Automatically close the map', 'woocommerce-russian-post' ),
				'label'    => __( 'Close the map automatically when the customer has chosen postal office', 'woocommerce-russian-post' ),
				'default'  => 'yes',
				'type'     => 'checkbox',
				'desc_tip' => esc_html__( 'Enable or disable this option as you need', 'woocommerce-russian-post' )
			),
			'orders_params'              => array(
				'title' => __( 'Orders', 'woocommerce-russian-post' ),
				'type'  => 'title'
			),
			'export_type'                => array(
				'title'    => __( 'Order export type', 'woocommerce-russian-post' ),
				'type'     => 'select',
				'class'    => 'wc-enhanced-select',
				'default'  => Order::OTPRAVKA_EXPORT_TYPE,
				'options'  => array(
					Order::OTPRAVKA_EXPORT_TYPE => __( 'Otpravka', 'woocommerce-russian-post' ),
					Order::WIDGET_EXPORT_TYPE   => __( 'Widget', 'woocommerce-russian-post' )
				),
				'desc_tip' => esc_html__( 'Choose type of order export. Depending on the service you choose, orders will be sent to that service. For more information, please see the plugin documentation.', 'woocommerce-russian-post' )
			),
			'auto_export_orders'         => array(
				'title'    => __( 'Export orders automatically', 'woocommerce-russian-post' ),
				'desc_tip' => esc_html__( 'Enable auto orders export to Russian Post dashboard', 'woocommerce-russian-post' ),
				'default'  => 'no',
				'label'    => __( 'Enable/Disable', 'woocommerce-russian-post' ),
				'type'     => 'checkbox'
			),
			'export_statuses'            => array(
				'title'             => __( 'Order statuses for export', 'woocommerce-russian-post' ),
				'type'              => 'multiselect',
				'options'           => array_diff_key(
					wc_get_order_statuses(),
					array_flip( apply_filters( 'wc_russian_post_disabled_statuses_for_export', array(
						'wc-completed',
						'wc-cancelled',
						'wc-refunded',
						'wc-failed'
					) ) )
				),
				'class'             => 'chosen_select',
				'css'               => 'width: 450px;',
				'desc_tip'          => esc_html__( 'Choose order status for auto export', 'woocommerce-russian-post' ),
				'custom_attributes' => array(
					'data-placeholder' => esc_html__( 'Choose order status', 'woocommerce-russian-post' )
				)
			),
			'vat_rate'                   => array(
				'title'    => __( 'VAT rate', 'woocommerce-russian-post' ),
				'type'     => 'select',
				'class'    => 'wc-enhanced-select',
				'default'  => '-1',
				'options'  => array(
					'-1' => __( 'Without VAT', 'woocommerce-russian-post' ),
					'0'  => '0%',
					'10' => '10%',
					'20' => '20%'
				),
				'desc_tip' => esc_html__( 'Choose your VAT rate', 'woocommerce-russian-post' )
			),
			'debug'                      => array(
				'title' => __( 'Debug', 'woocommerce-russian-post' ),
				'type'  => 'title'
			),
			'enable_debug_mode'          => array(
				'title'       => __( 'Enable debug mode', 'woocommerce-russian-post' ),
				'type'        => 'checkbox',
				'description' => sprintf( __( 'All logs will be <a href="%s">saved here</a>', 'woocommerce-russian-post' ), \Woodev_Helper::get_wc_log_file_url( $this->id ) ),
				'default'     => 'no'
			)
		);

		if ( extension_loaded( 'soap' ) ) {
			$form_fields = \Woodev_Helper::array_insert_after( $form_fields, 'vat_rate', array(
				'tracking_params'     => array(
					'title'       => __( 'Tracking', 'woocommerce-russian-post' ),
					'type'        => 'title',
					'description' => __( 'To use this option, you need to provide your credentials for the Tracking Russian Post service. You can obtain these credentials <a href="https://tracking.pochta.ru/access-settings" target="_blank">here</a>', 'woocommerce-russian-post' )
				),
				'enable_tracking'     => array(
					'title'    => __( 'Enable tracking', 'woocommerce-russian-post' ),
					'type'     => 'checkbox',
					'desc_tip' => esc_html__( 'Enable delivery status tracking', 'woocommerce-russian-post' ),
					'default'  => 'no'
				),
				'tracking_login'      => array(
					'title'       => __( 'Login', 'woocommerce-russian-post' ),
					'desc_tip'    => esc_html__( 'Enter your login', 'woocommerce-russian-post' ),
					'placeholder' => esc_html__( 'Your login', 'woocommerce-russian-post' ),
					'type'        => 'text'
				),
				'tracking_password'   => array(
					'title'       => __( 'Password', 'woocommerce-russian-post' ),
					'desc_tip'    => esc_html__( 'Enter your password', 'woocommerce-russian-post' ),
					'placeholder' => esc_html__( 'Your password', 'woocommerce-russian-post' ),
					'type'        => 'text'
				),
				'tracking_complete'   => array(
					'title'    => __( 'Complete status', 'woocommerce-russian-post' ),
					'type'     => 'select',
					'class'    => 'wc-enhanced-select',
					'default'  => 'none',
					'options'  => array_diff_key(
						array( 'none' => __( 'Non use', 'woocommerce-russian-post' ) ) + wc_get_order_statuses(),
						array_flip( apply_filters( 'wc_russian_post_disabled_statuses_for_complete', array(
							'wc-cancelled',
							'wc-refunded',
							'wc-failed'
						) ) )
					),
					'desc_tip' => esc_html__( 'Choose the status for delivered orders.', 'woocommerce-russian-post' )
				),
				'tracking_delivering' => array(
					'title'    => __( 'In delivering status', 'woocommerce-russian-post' ),
					'type'     => 'select',
					'class'    => 'wc-enhanced-select',
					'default'  => 'none',
					'options'  => array_diff_key(
						array( 'none' => __( 'Non use', 'woocommerce-russian-post' ) ) + wc_get_order_statuses(),
						array_flip( apply_filters( 'wc_russian_post_disabled_statuses_for_delivering', array(
							'wc-completed',
							'wc-cancelled',
							'wc-refunded',
							'wc-failed'
						) ) )
					),
					'desc_tip' => esc_html__( 'Select a status for orders in transit. NOTE: Do not use this option if you do not have the appropriate status for the order.', 'woocommerce-russian-post' )
				),
				'tracking_canceled'   => array(
					'title'    => __( 'Cancel status', 'woocommerce-russian-post' ),
					'type'     => 'select',
					'class'    => 'wc-enhanced-select',
					'default'  => 'none',
					'options'  => array_diff_key(
						array( 'none' => __( 'Non use', 'woocommerce-russian-post' ) ) + wc_get_order_statuses(),
						array_flip( apply_filters( 'wc_russian_post_disabled_statuses_for_canceled', array(
							'wc-completed'
						) ) )
					),
					'desc_tip' => esc_html__( 'Select a status for canceled orders. NOTE: Do not use this option if you do not want the order to be canceled in case of failed delivery..', 'woocommerce-russian-post' )
				)
			) );
		}

		$this->form_fields = apply_filters( 'wc_russian_post_integration_form_fields', array_map( array(
			$this,
			'set_verify_code'
		), $form_fields ) );
	}

	private function set_verify_code( $field ) {

		if ( ! wc_russian_post_shipping()->get_license_instance()->is_active() && 'title' !== $field['type'] ) {
			if ( ! isset( $field['class'] ) ) {
				$field['class'] = '';
			}
			$field['class'] .= ' woodev-modal';
		}

		return $field;
	}

	public function is_configured() {
		return ! empty( $this->get_option( 'account_name' ) ) && ! empty( $this->get_option( 'account_password' ) ) && ! empty( $this->get_option( 'account_token' ) );
	}

	public function validate_account_username( $value ) {
		if ( ! \WC_Validation::is_email( $value ) && ! \WC_Validation::is_phone( $value ) ) {
			throw new \Exception( __( 'Can not save settings. Account username must be email or phone number', 'woocommerce-russian-post' ) );
		}

		return $this->validate_text_field( 'account_name', $value );
	}

	public function generate_authorization_html() {

		$status = null;

		try {

			$status = wc_russian_post_shipping()->get_api()->get_account_limit( ! empty( $_POST['save'] ) );

		} catch ( \Woodev_Plugin_Exception $e ) {
		}

		if ( $status && isset( $status->{'allowed-count'}, $status->{'current-count'} ) ) {
			$status = sprintf( __( '<span class="status-successful-connect">Account is connected</span> Count of requests %d from %d', 'woocommerce-russian-post' ), $status->{'current-count'}, $status->{'allowed-count'} );
		} elseif ( is_null( $status ) ) {
			if ( $this->is_configured() ) {
				$status = __( '<span class="status-fail-connect">Your account is not connected</span> You are probably having a mistake in your account credential data. Make sure you have entered your account information correctly.', 'woocommerce-russian-post' );
			} else {
				$status = __( '<span class="status-fail-connect">Your account is not connected</span> You need to enter your credential data.', 'woocommerce-russian-post' );
			}
		}

		ob_start();

		wc_russian_post_shipping()->load_template( 'views/html-authorization-status.php', array(
			'status' => $status
		) );

		return ob_get_clean();
	}

	private function get_auth_description() {

		$descriptions = array();

		$descriptions[] = sprintf(
			__( '<p>Provide your authorization data from <a href="%s" target="_blank">Russian Post account</a></p>', 'woocommerce-russian-post' ),
			'https://otpravka.pochta.ru/dashboard'
		);

		if ( wc_russian_post_shipping()->get_documentation_url() ) {
			$descriptions[] = sprintf(
				__( '<p>Before beginning usage of this plugin, please <a href="%s" target="_blank">read documentation</a></p>', 'woocommerce-russian-post' ),
				wc_russian_post_shipping()->get_documentation_url()
			);
		}

		if ( wc_russian_post_shipping()->get_account_url() ) {
			$descriptions[] = sprintf(
				__( '<p><a href="%s" target="_blank" class="button-secondary">Your account dashboard here</a></p>', 'woocommerce-russian-post' ),
				wc_russian_post_shipping()->get_account_url()
			);
		}

		return implode( '', $descriptions );
	}
}