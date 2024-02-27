<?php

namespace Woodev\Russian_Post\Admin;

use Woodev\Russian_Post\Classes\Order;

if( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Setup_Wizard extends \Woodev_Plugin_Setup_Wizard {

	/**
	 * Loads the Setup Wizard's scripts and styles.
	 */
	protected function load_scripts_styles() {

		parent::load_scripts_styles();

		wp_enqueue_style(
			'wc-russian-post-setup-wizard',
			$this->get_plugin()->get_plugin_url() . '/assets/css/admin/wc-russian-post-setup-wizard.css',
			array( 'woodev-admin-setup' ),
			$this->get_plugin()->get_version()
		);

		// load scripts
		wp_enqueue_script(
			'wc-memberships-setup-wizard',
			$this->get_plugin()->get_plugin_url() . '/assets/js/admin/wc-russian-post-setup-wizard.js',
			array( 'woodev-admin-setup' ),
			$this->get_plugin()->get_version(),
			true
		);
	}

	/**
	 * Registers the wizard's steps.
	 *
	 * @since 1.2.0
	 */
	protected function register_steps() {

		$this->register_step(
			'welcome',
			'Старт!',
			array( $this, 'render_welcome_step' )
		);

		// overwrite the text for the Continue button with help from render_step() overwritten below
		$this->steps['welcome']['button_label'] = 'Начать установку';

		$this->register_step(
			'account',
			'Авторизация',
			array( $this, 'render_account_step' ),
			array( $this, 'save_account_settings' )
		);

		$this->register_step(
			'dimension',
			'Габариты и вес',
			array( $this, 'render_dimension_step' ),
			array( $this, 'save_dimension_settings' )
		);

		$this->register_step(
			'orders',
			'Заказы',
			array( $this, 'render_orders_step' ),
			array( $this, 'save_orders_settings' )
		);

		if( extension_loaded( 'soap' ) ) {

			$this->register_step(
				'tracking',
				'Отслеживание',
				array( $this, 'render_tracking_step' ),
				array( $this, 'save_tracking_settings' )
			);
		}

		$this->register_step(
			'additional',
			'Доп.опции',
			array( $this, 'render_additional_step' ),
			array( $this, 'save_additional_settings' )
		);
	}

	/**
	 * Adds hooks to check whether we need to redirect to the Setup Wizard and calls
	 * the parent method to add default actions and hooks.
	 *
	 */
	protected function add_hooks() {

		// maybe redirect to the setup wizard when the plugin is activated
		if( ! $this->is_complete() ) {
			add_action( 'woodev_' . $this->get_plugin()->get_id() . '_installed', [ $this, 'maybe_redirect' ] );
		}

		parent::add_hooks();
	}

	/**
	 * Redirects to the Setup Wizard admin page if the plugin was just installed.
	 */
	public function maybe_redirect() {

		if( get_transient( 'wc_russian_post_setup_wizard_redirect' ) ) {

			$do_redirect = true;

			// postpone the redirect on the network admin screen or while doing ajax
			if( wp_doing_ajax() || is_network_admin() ) {
				$do_redirect = false;
			}

			// disable the redirect if multiple plugins were activated together
			if( isset( $_GET['activate-multi'] ) ) {

				delete_transient( 'wc_russian_post_setup_wizard_redirect' );

				$do_redirect = false;
			}

			if( $do_redirect ) {

				delete_transient( 'wc_russian_post_setup_wizard_redirect' );

				wp_safe_redirect( $this->get_setup_url() );
				exit;
			}
		}
	}

	/**
	 * Renders the default welcome note heading.
	 */
	protected function render_welcome_heading() {
		printf(
		/* translators: Placeholder: %s - plugin name */
			esc_html__( 'Welcome to setup of the plugin %s!', 'woocommerce-russian-post' ),
			$this->get_plugin()->get_plugin_name()
		);
	}

	/**
	 * Renders the initial welcome note text.
	 *
	 * @since 1.2.0
	 */
	protected function render_welcome_text() {
		//Это текст который отображается под заголовком на стартовом шаге визорта
		parent::render_welcome_text();
	}

	/**
	 * Renders the main content for the welcome step.
	 */
	protected function render_welcome_step() {

		printf( __( '<p><strong>Note:</strong> You must have a <a href="%s" target="_blank">Russian Post account</a> with a valid contract to complete setup.', 'woocommerce-russian-post' ), 'https://otpravka.pochta.ru/dashboard' );

		printf( __( '<p>Not ready to setup yet? You can do this later on the <a href="%s">plugin settings page</a>.</p>', 'woocommerce-russian-post' ), esc_url( $this->get_plugin()->get_settings_url() ) );
	}

	/**
	 * Renders the "Account" step.
	 */
	protected function render_account_step() {

		printf( '<h2>%s</h2>', esc_html__( 'Authorization data from Russian Post API', 'woocommerce-russian-post' ) );

		printf( '<p class="description">%s</p>', sprintf( __( 'The plugin needs authorization data from the Russian Post API to work. If you do not have access to your personal account of the Russian Post, then you need to create one <a href="%s" target="_blank">on this page</a>.', 'woocommerce-russian-post' ), 'https://otpravka.pochta.ru/dashboard' ) );

		$this->render_form_field(
			'account_name',
			array(
				'type'        => 'text',
				'required'    => true,
				'label'       => __( 'Username', 'woocommerce-russian-post' ),
				'placeholder' => esc_html__( 'Phone number or email', 'woocommerce-russian-post' ),
				'description' => esc_html__( 'Enter your username from Russian Post account', 'woocommerce-russian-post' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'account_name' )
		);

		$this->render_form_field(
			'account_password',
			array(
				'type'        => 'text',
				'required'    => true,
				'label'       => __( 'Password', 'woocommerce-russian-post' ),
				'placeholder' => esc_html__( 'Enter your password', 'woocommerce-russian-post' ),
				'description' => esc_html__( 'Enter password from your Russian Post account. Notice: Password should not includes special symbols like as #,%,&,$,! etc', 'woocommerce-russian-post' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'account_password' )
		);

		$this->render_form_field(
			'account_token',
			array(
				'type'        => 'text',
				'required'    => true,
				'label'       => __( 'Auth token', 'woocommerce-russian-post' ),
				'placeholder' => esc_html__( 'Enter your authorization token', 'woocommerce-russian-post' ),
				'description' => __( 'You can get the token on your account page of Russian Post. It locate on <a href="https://otpravka.pochta.ru/settings#/api-settings">settings API page</a>.', 'woocommerce-russian-post' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'account_token' )
		);
	}

	/**
	 * @return void
	 * @throws \Woodev_Plugin_Exception
	 */
	protected function save_account_settings() {

		$account_name     = \Woodev_Helper::get_post( 'account_name' );
		$account_password = \Woodev_Helper::get_post( 'account_password' );
		$account_token    = \Woodev_Helper::get_post( 'account_token' );

		if( ( ! \WC_Validation::is_phone( $account_name ) && ! \WC_Validation::is_email( $account_name ) ) ) {
			throw new \Woodev_Plugin_Exception( __( 'Can not save settings. Account username must be email or phone number', 'woocommerce-russian-post' ) );
		}

		if( empty( $account_password ) ) {
			throw new \Woodev_Plugin_Exception( __( 'The password cannot be empty. Please enter your correct account password.', 'woocommerce-russian-post' ) );
		}

		if( empty( $account_token ) ) {
			throw new \Woodev_Plugin_Exception( __( 'The token cannot be empty. Please enter your API Token.', 'woocommerce-russian-post' ) );
		}

		wc_russian_post_shipping()->get_settings_instance()->update_option( 'account_name', $account_name );
		wc_russian_post_shipping()->get_settings_instance()->update_option( 'account_password', $account_password );
		wc_russian_post_shipping()->get_settings_instance()->update_option( 'account_token', $account_token );
	}

	/**
	 * Renders the "Goods dimensions" step.
	 */
	protected function render_dimension_step() {

		printf( '<h2>%s</h2>', esc_html__( 'Dimensions and weight parameters of the goods', 'woocommerce-russian-post' ) );

		printf( '<p class="description">%s</p>', __( 'Specify the average parameters of the dimensions and weight of one product. These values will be used when calculating the cost of delivery if this or that parameter is not specified in the product card.', 'woocommerce-russian-post' ) );

		$this->render_form_field(
			'minimum_weight',
			array(
				'type'        => 'text',
				'required'    => true,
				'label'       => __( 'Weight, (gram)', 'woocommerce-russian-post' ),
				'default'     => 500,
				'placeholder' => esc_html__( 'E.g 500', 'woocommerce-russian-post' ),
				'class'       => array( 'one-four' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_weight', 500 )
		);

		$this->render_form_field(
			'minimum_height',
			array(
				'type'        => 'text',
				'required'    => true,
				'label'       => __( 'Height, (mm.)', 'woocommerce-russian-post' ),
				'default'     => 150,
				'placeholder' => esc_html__( 'E.g 150', 'woocommerce-russian-post' ),
				'class'       => array( 'one-four' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_height', 150 )
		);

		$this->render_form_field(
			'minimum_width',
			array(
				'type'        => 'text',
				'required'    => true,
				'label'       => __( 'Width, (mm.)', 'woocommerce-russian-post' ),
				'default'     => 150,
				'placeholder' => esc_html__( 'E.g 150', 'woocommerce-russian-post' ),
				'class'       => array( 'one-four' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_width', 150 )
		);

		$this->render_form_field(
			'minimum_length',
			array(
				'type'        => 'text',
				'required'    => true,
				'label'       => __( 'Length, (mm.)', 'woocommerce-russian-post' ),
				'default'     => 150,
				'placeholder' => esc_html__( 'E.g 150', 'woocommerce-russian-post' ),
				'class'       => array( 'one-four' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_length', 150 )
		);

		echo '<div class="clear"></div>';
	}

	/**
	 * Saves the product dimension preferences.
	 *
	 * @throws \Woodev_Plugin_Exception
	 * @since 1.2.0
	 */
	protected function save_dimension_settings() {
		$fields = array(
			'minimum_weight' => __( 'Weight', 'woocommerce-russian-post' ),
			'minimum_height' => __( 'Height', 'woocommerce-russian-post' ),
			'minimum_width'  => __( 'Width', 'woocommerce-russian-post' ),
			'minimum_length' => __( 'Length', 'woocommerce-russian-post' )
		);

		foreach ( $fields as $key => $field ) {

			$value = \Woodev_Helper::get_post( $key );

			if( empty( $value ) ) {
				throw new \Woodev_Plugin_Exception( sprintf( __( 'Parameter %s cannot be empty', 'woocommerce-russian-post' ), $field ) );
			} elseif( ! ctype_digit( strval( $value ) ) ) {
				throw new \Woodev_Plugin_Exception( sprintf( __( 'Parameter %s must be integer', 'woocommerce-russian-post' ), $field ) );
			}

			wc_russian_post_shipping()->get_settings_instance()->update_option( $key, $value );
		}

	}

	/**
	 * Renders the "Orders" step.
	 *
	 * @since 1.2.0
	 */
	protected function render_orders_step() {

		printf( '<h2>%s</h2>', __( 'Orders parameters', 'woocommerce-russian-post' ) );

		printf( '<p class="description">%s</p>', __( 'Settings for order parameters that will be exported to the personal account of the Russian Post', 'woocommerce-russian-post' ) );

		$this->render_form_field(
			'export_type',
			array(
				'label'             => __( 'Order export type', 'woocommerce-russian-post' ),
				'type'              => 'select',
				'default'           => Order::OTPRAVKA_EXPORT_TYPE,
				'options'           => array(
					Order::OTPRAVKA_EXPORT_TYPE => __( 'Otpravka', 'woocommerce-russian-post' ),
					Order::WIDGET_EXPORT_TYPE   => __( 'Widget', 'woocommerce-russian-post' )
				),
				'custom_attributes' => array( 'style' => 'width: 100%' ),
				//'description'       => esc_html__( 'Choose type of order export. Depending on the service you choose, orders will be sent to that service. For more information, please see the plugin documentation.', 'woocommerce-russian-post' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'export_type', Order::OTPRAVKA_EXPORT_TYPE )
		);

		printf( '<small class="description">%s</small>', sprintf( __( 'The type of export of the order will depend on which personal account the order will be exported to. <a href="%s" target="_blank">Personal account  <strong>Widget</strong></a>. <a href="%s" target="_blank">Personal account <strong>Otpravka</strong></a>.', 'woocommerce-russian-post' ), esc_url( wc_russian_post_shipping()->get_account_url() ), esc_url( 'https://otpravka.pochta.ru/dashboard' ) ) );

		$auto_export_orders_value = wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'auto_export_orders', 'no' ) );
		$auto_export_orders_data  = array(
			'label'       => __( 'Export orders automatically', 'woocommerce-russian-post' ),
			'name'        => 'auto_export_orders',
			'type'        => 'toggle',
			'value'       => 'yes',
			'input_class' => array( 'toggle-preferences' ),
			'description' => esc_html__( 'Orders will be automatically exported to the dashboard of the Russian Post when the selected status is assigned to the order.', 'woocommerce-russian-post' )
		);

		$this->render_form_field(
			'auto_export_orders',
			$auto_export_orders_data,
			$auto_export_orders_value
		);

		$this->render_form_field(
			'export_statuses',
			array(
				'label'             => __( 'Order statuses for export', 'woocommerce-russian-post' ),
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
				'placeholder'       => esc_html__( 'Choose order status', 'woocommerce-russian-post' ),
				'custom_attributes' => array(
					'style'            => 'width: 100%',
					'data-allow_clear' => true
				),
				'description'       => esc_html__( 'Choose order status for auto export', 'woocommerce-russian-post' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'export_statuses' )
		);

		$this->render_form_field(
			'vat_rate',
			array(
				'label'             => __( 'VAT rate', 'woocommerce-russian-post' ),
				'type'              => 'select',
				'default'           => '-1',
				'options'           => array(
					'-1' => __( 'Without VAT', 'woocommerce-russian-post' ),
					'0'  => '0%',
					'10' => '10%',
					'20' => '20%'
				),
				'custom_attributes' => array( 'style' => 'width: 100%' ),
				'description'       => esc_html__( 'Choose your VAT rate', 'woocommerce-russian-post' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'vat_rate', '-1' )
		);

	}

	/**
	 * Saves the "Orders" preferences.
	 *
	 * @throws \Woodev_Plugin_Exception
	 * @since 1.2.0
	 *
	 */
	protected function save_orders_settings() {

		foreach ( array( 'export_type', 'auto_export_orders', 'export_statuses', 'vat_rate' ) as $field ) {

			$value = \Woodev_Helper::get_posted_value( $field );

			if( 'auto_export_orders' == $field ) {
				$value = wc_bool_to_string( $value );
			}

			wc_russian_post_shipping()->get_settings_instance()->update_option( $field, $value );
		}
	}

	/**
	 * Renders the "Tracking" step.
	 *
	 * @since 1.2.0
	 */
	protected function render_tracking_step() {

		printf( '<h2>%s</h2>', __( 'Tracking parameters', 'woocommerce-russian-post' ) );

		printf( '<p class="description">%s</p>', __( 'To use this option, you need to provide your credentials for the Tracking Russian Post service. You can obtain these credentials <a href="https://tracking.pochta.ru/access-settings" target="_blank">here</a>', 'woocommerce-russian-post' ) );

		$enable_tracking_value = wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_tracking', 'no' ) );

		$this->render_form_field(
			'enable_tracking',
			array(
				'label'       => __( 'Enable tracking', 'woocommerce-russian-post' ),
				'name'        => 'enable_tracking',
				'type'        => 'toggle',
				'value'       => 'yes',
				'input_class' => array( 'toggle-preferences' ),
				'description' => esc_html__( 'Track changes in delivery status for orders. The status is checked automatically according to the schedule once a day.', 'woocommerce-russian-post' )
			),
			$enable_tracking_value
		);

		$this->render_form_field(
			'tracking_login',
			array(
				'type'        => 'text',
				'label'       => __( 'Login', 'woocommerce-russian-post' ),
				'placeholder' => esc_html__( 'Enter your login', 'woocommerce-russian-post' ),
				'class'       => $enable_tracking_value ? array(
					'woodev-plugin-admin-setup-control-toggled',
					'one-half'
				) : array( 'woodev-plugin-admin-setup-control-toggled', 'hidden', 'one-half' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_login' )
		);

		$this->render_form_field(
			'tracking_password',
			array(
				'type'        => 'text',
				'label'       => __( 'Password', 'woocommerce-russian-post' ),
				'placeholder' => esc_html__( 'Enter your password', 'woocommerce-russian-post' ),
				'class'       => $enable_tracking_value ? array(
					'woodev-plugin-admin-setup-control-toggled',
					'one-half'
				) : array( 'woodev-plugin-admin-setup-control-toggled', 'hidden', 'one-half' )
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_password' )
		);

		echo '<div class="clear"></div>';

		$this->render_form_field(
			'tracking_complete',
			array(
				'label'             => __( 'Complete status', 'woocommerce-russian-post' ),
				'type'              => 'select',
				'default'           => 'none',
				'options'           => array_diff_key(
					array( 'none' => __( 'Non use', 'woocommerce-russian-post' ) ) + wc_get_order_statuses(),
					array_flip( apply_filters( 'wc_russian_post_disabled_statuses_for_complete', array(
						'wc-cancelled',
						'wc-refunded',
						'wc-failed'
					) ) )
				),
				'custom_attributes' => array( 'style' => 'width: 100%' ),
				'description'       => esc_html__( 'Choose the status for delivered orders.', 'woocommerce-russian-post' ),
				'class'             => $enable_tracking_value ? array( 'woodev-plugin-admin-setup-control-toggled' ) : array(
					'woodev-plugin-admin-setup-control-toggled',
					'hidden'
				)
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_complete', 'none' )
		);

		$this->render_form_field(
			'tracking_delivering',
			array(
				'label'             => __( 'In delivering status', 'woocommerce-russian-post' ),
				'type'              => 'select',
				'default'           => 'none',
				'options'           => array_diff_key(
					array( 'none' => __( 'Non use', 'woocommerce-russian-post' ) ) + wc_get_order_statuses(),
					array_flip( apply_filters( 'wc_russian_post_disabled_statuses_for_delivering', array(
						'wc-completed',
						'wc-cancelled',
						'wc-refunded',
						'wc-failed'
					) ) )
				),
				'custom_attributes' => array( 'style' => 'width: 100%' ),
				'description'       => esc_html__( 'Select a status for orders in transit. NOTE: Do not use this option if you do not have the appropriate status for the order.', 'woocommerce-russian-post' ),
				'class'             => $enable_tracking_value ? array( 'woodev-plugin-admin-setup-control-toggled' ) : array(
					'woodev-plugin-admin-setup-control-toggled',
					'hidden'
				)
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_delivering', 'none' )
		);

		$this->render_form_field(
			'tracking_canceled',
			array(
				'label'             => __( 'Cancel status', 'woocommerce-russian-post' ),
				'type'              => 'select',
				'default'           => 'none',
				'options'           => array_diff_key(
					array( 'none' => __( 'Non use', 'woocommerce-russian-post' ) ) + wc_get_order_statuses(),
					array_flip( apply_filters( 'wc_russian_post_disabled_statuses_for_canceled', array(
						'wc-completed'
					) ) )
				),
				'custom_attributes' => array( 'style' => 'width: 100%' ),
				'description'       => esc_html__( 'Select a status for canceled orders. NOTE: Do not use this option if you do not want the order to be canceled in case of failed delivery..', 'woocommerce-russian-post' ),
				'class'             => $enable_tracking_value ? array( 'woodev-plugin-admin-setup-control-toggled' ) : array(
					'woodev-plugin-admin-setup-control-toggled',
					'hidden'
				)
			),
			wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_canceled', 'none' )
		);
	}

	/**
	 * Saves the "Tracking" preferences.
	 *
	 * @throws \Woodev_Plugin_Exception
	 * @since 1.2.0
	 *
	 */
	protected function save_tracking_settings() {

		$enable_tracking   = wc_bool_to_string( \Woodev_Helper::get_posted_value( 'enable_tracking' ) );
		$tracking_login    = \Woodev_Helper::get_posted_value( 'tracking_login' );
		$tracking_password = \Woodev_Helper::get_posted_value( 'tracking_password' );

		if( 'yes' === $enable_tracking && ( empty( $tracking_login ) || empty( $tracking_password ) ) ) {
			throw new \Woodev_Plugin_Exception( __( 'Login and password can not be empty if you want to use Tracking options. Please enter your credential data from the tracking service or disable the tracking option.', 'woocommerce-russian-post' ) );
		}

		wc_russian_post_shipping()->get_settings_instance()->update_option( 'enable_tracking', $enable_tracking );
		wc_russian_post_shipping()->get_settings_instance()->update_option( 'tracking_login', $tracking_login );
		wc_russian_post_shipping()->get_settings_instance()->update_option( 'tracking_password', $tracking_password );

		foreach ( array( 'tracking_complete', 'tracking_delivering', 'tracking_canceled' ) as $field ) {
			wc_russian_post_shipping()->get_settings_instance()->update_option( $field, \Woodev_Helper::get_posted_value( $field ) );
		}

	}

	/**
	 * Renders the "Additional" step.
	 *
	 * @since 1.2.0
	 */
	protected function render_additional_step() {

		$this->render_form_field(
			'enable_state_suggestions',
			array(
				'label'       => __( 'State suggestions', 'woocommerce-russian-post' ),
				'name'        => 'enable_state_suggestions',
				'type'        => 'toggle',
				'value'       => 'yes',
				'input_class' => array( 'toggle-preferences' ),
				'description' => esc_html__( 'Allow auto-suggestions for "State" field on checkout page. It works only Russian`s addresses.', 'woocommerce-russian-post' )
			),
			wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_state_suggestions', 'yes' ) )
		);

		$this->render_form_field(
			'enable_city_suggestions',
			array(
				'label'       => __( 'City suggestions', 'woocommerce-russian-post' ),
				'name'        => 'enable_city_suggestions',
				'type'        => 'toggle',
				'value'       => 'yes',
				'input_class' => array( 'toggle-preferences' ),
				'description' => esc_html__( 'Allow auto-suggestions for "City" field on checkout page. It works only Russian`s addresses.', 'woocommerce-russian-post' )
			),
			wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_city_suggestions', 'yes' ) )
		);

		$this->render_form_field(
			'enable_address_suggestions',
			array(
				'label'       => __( 'Address suggestions', 'woocommerce-russian-post' ),
				'name'        => 'enable_address_suggestions',
				'type'        => 'toggle',
				'value'       => 'yes',
				'input_class' => array( 'toggle-preferences' ),
				'description' => esc_html__( 'Allow auto-suggestions for "Address" field on checkout page. It works only Russian`s addresses.', 'woocommerce-russian-post' )
			),
			wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_address_suggestions', 'yes' ) )
		);

		$this->render_form_field(
			'fill_postcode_by_address',
			array(
				'label'       => __( 'Fill postcode field', 'woocommerce-russian-post' ),
				'name'        => 'fill_postcode_by_address',
				'type'        => 'toggle',
				'value'       => 'yes',
				'input_class' => array( 'toggle-preferences' ),
				'description' => esc_html__( 'Enable this option to allow to fill the field of zipcode by selected address. It works only if "Address suggestions" option is enabled.', 'woocommerce-russian-post' )
			),
			wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'fill_postcode_by_address', 'yes' ) )
		);

		$this->render_form_field(
			'enable_debug_mode',
			array(
				'label'       => __( 'Debug mode', 'woocommerce-russian-post' ),
				'name'        => 'enable_debug_mode',
				'type'        => 'toggle',
				'value'       => 'yes',
				'input_class' => array( 'toggle-preferences' ),
				'allow_html'  => true,
				'description' => sprintf( __( 'In debug mode, all requests and responses from the Russian Post server will be written to <a href="%s">a log file</a>. It is necessary in case of finding out the reasons for a malfunctioning plugin. Do not use this option unless necessary.', 'woocommerce-russian-post' ), \Woodev_Helper::get_wc_log_file_url( wc_russian_post_shipping()->get_id() ) )
			),
			wc_string_to_bool( wc_russian_post_shipping()->get_settings_instance()->get_option( 'enable_debug_mode', 'no' ) )
		);
	}

	/**
	 * Saves the "Additional" preferences.
	 *
	 * @since 1.2.0
	 *
	 */
	protected function save_additional_settings() {

		foreach (
			array(
				'enable_state_suggestions',
				'enable_city_suggestions',
				'enable_address_suggestions',
				'fill_postcode_by_address',
				'enable_debug_mode'
			) as $field
		) {

			$value = wc_bool_to_string( \Woodev_Helper::get_posted_value( $field ) );

			wc_russian_post_shipping()->get_settings_instance()->update_option( $field, $value );
		}

	}

	/**
	 * Returns extra steps for the last screen of the Setup Wizard.
	 *
	 * @return array associative array of extra steps
	 * @since 1.2.0
	 *
	 */
	protected function get_next_steps() {

		$steps = array();

		$license_valid = $this->get_plugin()->get_license_instance()->is_license_valid();

		if( ! $license_valid ) {
			$steps['activate-license'] = array(
				'name'         => __( 'Activate license', 'woocommerce-russian-post' ),
				'label'        => __( 'Activate your license key', 'woocommerce-russian-post' ),
				'description'  => __( 'To correct the plugin work, need to enter and activate a license key. Keep in your mind, without a license key, you will not be able to get updates, support and many functions will not be available to use.', 'woocommerce-russian-post' ),
				'url'          => $this->get_plugin()->get_license_instance()->get_license_settings_url(),
				'button_class' => 'button button-large button-primary'
			);
		}

		$steps['account-settings'] = array(
			'name'         => __( 'Go to Dashboard', 'woocommerce-russian-post' ),
			'label'        => __( 'Account settings', 'woocommerce-russian-post' ),
			'description'  => __( 'Be sure to configure the settings of the user personal account. To log-in, you will need credential data from your account.', 'woocommerce-russian-post' ),
			'url'          => $this->get_plugin()->get_account_url(),
			'button_class' => $license_valid ? 'button button-large button-primary' : 'button button-large'
		);

		$steps['setup-shipping'] = array(
			'name'         => __( 'Setup shipping', 'woocommerce-russian-post' ),
			'label'        => __( 'Setup shipping methods', 'woocommerce-russian-post' ),
			'description'  => __( 'Create shipping method of Russian Post and setup it.', 'woocommerce-russian-post' ),
			'url'          => add_query_arg( array(
				'page' => 'wc-settings',
				'tab'  => 'shipping'
			), admin_url( 'admin.php' ) ),
			'button_class' => 'button button-large'
		);

		$steps['setup-email'] = array(
			'name'         => __( 'Setup notification', 'woocommerce-russian-post' ),
			'label'        => __( 'Setup users email notifications', 'woocommerce-russian-post' ),
			'description'  => __( 'You can also change users email notification settings. E.g email message and heading.', 'woocommerce-russian-post' ),
			'url'          => add_query_arg( array(
				'page'    => 'wc-settings',
				'tab'     => 'email',
				'section' => 'wc_russian_post_tracking_email'
			), admin_url( 'admin.php' ) ),
			'button_class' => 'button button-large'
		);

		return $steps;
	}

	/**
	 * Returns additional actions shown at the bottom of the last step of the Setup Wizard.
	 *
	 * @return array associative array of labels and URLs meant for action buttons
	 * @since 1.2.0
	 *
	 */
	protected function get_additional_actions() {

		return array(
			__( 'Visit docs', 'woocommerce-russian-post' )     => $this->get_plugin()->get_documentation_url(),
			__( 'Get Support', 'woocommerce-russian-post' )    => $this->get_plugin()->get_support_url(),
			__( 'Leave a Review', 'woocommerce-russian-post' ) => $this->get_plugin()->get_reviews_url(),
		);
	}

	protected function render_before_next_steps() {

        printf( '<span>%s</span>', esc_html__( 'Well, it is almost done. Just a little further.', 'woocommerce-russian-post' ) );

		if( ! wc_russian_post_shipping()->get_settings_instance()->is_configured() ) {
			printf( __( '<p>It seems you have not entered your credential data. You can <a href="%s">go back and enter your credetial</a> or visit the <a href="%s">plugin settings page</a></p>', 'woocommerce-russian-post' ), esc_url( $this->get_step_url( 'account' ) ), esc_url( $this->get_plugin()->get_settings_url() ) );
		}

		if( $this->get_plugin()->get_license_instance()->is_license_valid() ) {
			printf( __( '<small class="description">Your licanse key: %s</small>', 'woocommerce-russian-post' ), $this->get_plugin()->get_license_instance()->get_license() );
		}
	}

	/**
	 * Renders the newsletter content after the next steps in the last Setup Wizard screen.
	 *
	 * @since 1.2.0
	 */
	protected function render_after_next_steps() {
		?>
        <div class="newsletter-prompt">
            <h2><?php esc_html_e( 'Want to keep in touch?', 'woocommerce-russian-post' ); ?></h2>
            <p><?php esc_html_e( 'To receive timely information about new versions of the plugin and other news related to the work of our plugins, join to our telegram channel.', 'woocommerce-russian-post' ); ?></p>
            <a class="button button-primary newsletter-signup" href="https://t.me/wooplug"><?php esc_html_e( 'Join us', 'woocommerce-russian-post' ); ?></a>
        </div>
		<?php
	}
}