<?php

/**
 * Plugin Name: Russian Post EMS integration with Woocommerce
 * Plugin URI: https://woodev.ru/downloads/pochta-rossii-woocommerce
 * Description: Плагин интеграции Woocommerce с службой доставки Почта РФ. Позволяет произвести расчёт стоимости доставки. А так же экспорта заказов в ЛК Почты России.
 * Version: 1.2.3.3
 * Requires at least: 5.9
 * Tested up to: 6.3
 * Author: WooDev
 * WC tested up to: 8.0
 * WC requires at least: 5.6
 * Text Domain: woocommerce-russian-post
 * Domain Path: /languages/
 * Requires PHP: 5.6
 * Author URI: https://woodev.ru
 */

if( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'WC_RUSSIAN_POST_SHIPPING_VERSION', '1.2.3.3' );
define( 'WC_RUSSIAN_POST_SHIPPING_FILE', __FILE__ );

if( ! class_exists( 'Woodev_Plugin_Bootstrap' ) ) {
	require_once( plugin_dir_path( WC_RUSSIAN_POST_SHIPPING_FILE ) . 'woodev/bootstrap.php' );
}

Woodev_Plugin_Bootstrap::instance()->register_plugin( '1.2.1', __( 'Russian Post EMS integration with Woocommerce', 'woocommerce-russian-post' ), __FILE__, 'init_wc_russian_post_shipping_init', array(
	'minimum_wc_version'   => '5.6',
	'minimum_wp_version'   => '5.9',
	'backwards_compatible' => '1.2.1'
) );

use Woodev\Russian_Post as Plugin;
use Woodev\Russian_Post\Classes as Plugin_Class;

function init_wc_russian_post_shipping_init() {

	if( ! class_exists( 'WD_Russian_Post_Shipping' ) ) {

		final class WD_Russian_Post_Shipping extends Woodev_Plugin {

			/**
			 * @var Plugin\API\API()
			 */
			private $api;

			protected $admin;

			protected $checkout;

			protected $webhooks;

			/** @var Plugin_Class\Integrations instance */
			protected $integrations;

			/**
			 * @var WD_Russian_Post_Shipping|null
			 */
			protected static $instance = null;

			/** plugin id */
			protected $method_id = 'wc_russian_post';

			public function __construct() {

				parent::__construct( $this->get_method_id(), WC_RUSSIAN_POST_SHIPPING_VERSION, array(
					'text_domain' => 'woocommerce-russian-post'
				) );

				add_filter( 'woocommerce_integrations', array( $this, 'include_integrations' ) );

				add_action( 'woocommerce_shipping_init', array( $this, 'shipping_init' ) );
				add_filter( 'woocommerce_shipping_methods', array( $this, 'add_shipping_methods' ) );

				add_filter( 'woocommerce_data_stores', array( $this, 'register_data_stores' ) );

				add_filter( 'woocommerce_email_classes', array( $this, 'email_classes' ) );

				add_filter( 'woocommerce_validate_postcode', array( $this, 'validate_postcode' ), 10, 3 );
			}

			/**
			 * Main Russian Post Instance, ensures only one instance is/can be loaded
			 *
			 * @return WD_Russian_Post_Shipping
			 * @see wc_russian_post_shipping()
			 */
			public static function instance() {
				if( is_null( self::$instance ) ) {
					self::$instance = new self();
				}

				return self::$instance;
			}

			public function init_plugin() {

				$this->includes();

				$this->add_milestone_hooks();

				$this->init_orders_background_actions();
			}

			public function includes() {
				//Interfaces
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-uninstall-module.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-uninstall-module-entity.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-install-module.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-install-module-entity.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-authorization-module.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-authorization-module-entity.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-order-public-user.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-orders-public-order-line.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-orders-public-order.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-orders-public.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-orders-public-entity.php' );
				require_once( $this->get_plugin_path() . '/includes/interfaces/interface-api-response.php' );

				//Classes
				require_once( $this->get_plugin_path() . '/includes/classes/install-module.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/uninstall-module.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/integration.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/address-normalize.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/shipping-rate-meta-data.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/customer-delivery-point-data.php' );
				require_once( $this->get_plugin_path() . '/includes/abstracts/abstract-export-order.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/export-order/order-item.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/export-order/widget.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/export-order/otpravka.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/order.php' );

				//DTOs
				require_once( $this->get_plugin_path() . '/includes/classes/DTO/install-module-dto.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/DTO/uninstall-module-dto.php' );

				$this->webhooks     = $this->load_class( '/includes/classes/webhooks.php', Plugin_Class\Webhooks::class );
				$this->integrations = $this->load_class( '/includes/classes/integrations.php', Plugin_Class\Integrations::class );

				require_once( $this->get_plugin_path() . '/includes/functions.php' );

				if( extension_loaded( 'soap' ) ) {
					require_once( $this->get_plugin_path() . '/includes/classes/soap/soap-client.php' );
					require_once( $this->get_plugin_path() . '/includes/classes/soap/tracking.php' );
				}

				if( ! is_admin() ) {
					$this->frontend_includes();
				}

				if( is_admin() && ! is_ajax() ) {
					$this->admin_includes();
				}

				if( ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' ) && ! WC()->is_rest_api_request() ) {
					$this->ajax_includes();
				}
			}

			private function frontend_includes() {
				$this->checkout = $this->load_class( '/includes/classes/checkout.php', Plugin_Class\Checkout::class );
			}

			private function ajax_includes() {
				include_once( $this->get_plugin_path() . '/includes/classes/ajax.php' );
			}

			private function admin_includes() {

				$this->admin = $this->load_class( '/includes/admin/admin.php', Plugin\Admin\Admin::class );

				$this->admin->message_handler = $this->get_message_handler();

				require_once( $this->get_plugin_path() . '/includes/admin/order-list-table.php' );
			}

			/**
			 * Gets deprecated hooks for handling them.
			 *
			 * @return array
			 */
			protected function get_deprecated_hooks() {
				return array(
					'wc_russian_post_new_order_params'              => array(
						'version'     => '1.2.0',
						'replacement' => 'wc_russian_post_order_otpravka_export_data',
						'removed'     => true
					),
					'wc_russian_post_get_rate_cost'                 => array(
						'version'     => '1.2.0',
						'replacement' => 'wc_russian_post_rate_cost',
						'removed'     => true
					),
					'wc_russian_post_types_dimension_disallow'      => array(
						'version' => '1.2.0',
						'removed' => true
					),
					'wc_russian_post_allow_international_shipping'  => array(
						'version' => '1.2.0',
						'removed' => true
					),
					'wc_russian_post_order_defaults'                => array(
						'version' => '1.2.0',
						'removed' => true
					),
					'wc_russian_post_custom_order_meta_data_fields' => array(
						'version' => '1.2.0',
						'removed' => true
					),
					'wc_russian_post_shipping_params'               => array(
						'version' => '1.2.0',
						'removed' => true
					),
					'wc_russian_post_order_exception'               => array(
						'version' => '1.2.0',
						'removed' => true
					),
					'wc_russian_post_order_exported'                => array(
						'version' => '1.2.0',
						'removed' => true
					)
				);
			}

			/**
			 * Adds milestone hooks.
			 */
			protected function add_milestone_hooks() {

				add_action( 'wc_russian_post_order_status_changed', function ( $old_status, $status ) {

					if( 'exported' === $status ) {

						$this->get_lifecycle_handler()->trigger_milestone(
							'russian-post-order-exported',
							lcfirst( __( 'You have successfully exported your first order to Russian Post!', 'woocommerce-russian-post' ) )
						);

					} elseif( 'delivered' === $status ) {

						$this->get_lifecycle_handler()->trigger_milestone(
							'russian-post-order-delivered',
							lcfirst( __( 'You have the first order that was delivered to the recipient.', 'woocommerce-russian-post' ) )
						);

					}

				}, 10, 2 );
			}

			public function init_orders_background_actions() {

				$integration_settings = get_option( 'woocommerce_wc_russian_post_settings', array() );

				$integration_settings = wp_parse_args( $integration_settings, array(
					'auto_export_orders' => 'no',
					'export_statuses'    => array(),
					'enable_tracking'    => 'no'
				) );

				if( wc_string_to_bool( $integration_settings['auto_export_orders'] ) ) {

					foreach ( ( array ) $integration_settings['export_statuses'] as $export_status ) {
						$status_slug = ( 'wc-' === substr( $export_status, 0, 3 ) ) ? substr( $export_status, 3 ) : $export_status;
						add_action( 'woocommerce_order_status_' . $status_slug, array(
							$this,
							'auto_export_order'
						), 99 );
					}
				}

				if( wc_string_to_bool( $integration_settings['enable_tracking'] ) && extension_loaded( 'soap' ) && ! wp_next_scheduled( 'wc_russian_post_orders_update' ) ) {
					wp_schedule_event( time() + 10, 'twicedaily', 'wc_russian_post_orders_update' );
				}
			}

			public function auto_export_order( $order_id ) {

				$order = new Plugin_Class\Order( $order_id );

				if( $order->is_russian_post() && ! $order->is_exported() && $order->export_action() ) {
					$order->add_order_note( __( 'The order was successfully auto-exported to Russian Post.', 'woocommerce-russian-post' ) );
				}
			}

			public function validate_postcode( $valid, $postcode, $country ) {
				if( 'RU' == $country ) {
					$valid = (bool) preg_match( '/^[1-9]\d{5}$/', $postcode );
				}
				return $valid;
			}

			/**
			 * Renders admin notices (such as upgrade notices).
			 *
			 * @since 1.2.0
			 */
			public function add_admin_notices() {
				parent::add_admin_notices();
				$screen = get_current_screen();

				if( $screen && ( 'plugins' === $screen->id || $this->is_plugin_settings() ) ) {

					if( 'yes' === get_option( 'woocommerce_wc_russian_post_upgraded_to_1_2_0' ) ) {

						$this->get_admin_notice_handler()->add_admin_notice(
							sprintf( __( 'Hi there! It looks like you have upgraded %1$s from an older version. We have added lots of new features, please %2$scheck out the documentation%3$s for an overview and some helpful upgrading tips!', 'woocommerce-russian-post' ), $this->get_plugin_name(), '<a target="_blank" href="' . $this->get_documentation_url() . '">', '</a>' ),
							'wc_russian_post_upgrade_install',
							array(
								'always_show_on_settings' => false,
								'notice_class'            => 'updated'
							)
						);

					} else {

						$this->get_admin_notice_handler()->add_admin_notice(
							sprintf( __( 'Thanks for installing <strong>%1$s</strong>! To get started, take a few minutes to %2$sread the documentation%3$s', 'woocommerce-russian-post' ), $this->get_plugin_name(), '<a href="' . $this->get_documentation_url() . '" target="_blank">', '</a>' ),
							'wc_russian_post_fresh_install',
							array(
								'always_show_on_settings' => false,
								'notice_class'            => 'updated'
							)
						);
					}
				}
			}

			public function include_integrations( $integrations ) {
				if( class_exists( Plugin_Class\Integration::class ) ) {
					return array_merge( array( Plugin_Class\Integration::class ), $integrations );
				}

				return $integrations;
			}

			public function shipping_init() {
				require_once( $this->get_plugin_path() . '/includes/abstracts/abstract-shipping-methods.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/shipping-method-courier.php' );
				require_once( $this->get_plugin_path() . '/includes/classes/shipping-method-postal.php' );
			}

			public function add_shipping_methods( $methods ) {

				if( ! isset( $methods['wc_russian_post_courier'] ) ) {
					$methods['wc_russian_post_courier'] = Plugin_Class\Shipping_Method_Courier::class;
				}

				if( ! isset( $methods['wc_russian_post_postal'] ) ) {
					$methods['wc_russian_post_postal'] = Plugin_Class\Shipping_Method_Postal::class;
				}

				return $methods;
			}

			public function register_data_stores( $stores ) {

				if( ! class_exists( Plugin\Abstracts\Abstract_Customer_Data_Store::class ) ) {
					require_once( $this->get_plugin_path() . '/includes/abstracts/abstract-customer-data-store.php' );
				}

				if( ! class_exists( Plugin\Data_Stores\Customer_Data_Store::class ) ) {
					require_once( $this->get_plugin_path() . '/includes/data-stores/customer-data-store.php' );
				}

				if( ! class_exists( Plugin\Data_Stores\Customer_Data_Store_Session::class ) ) {
					require_once( $this->get_plugin_path() . '/includes/data-stores/customer-data-store-session.php' );
				}

				if( ! isset( $stores['customer_delivery_point'] ) ) {
					$stores['customer_delivery_point'] = Plugin\Data_Stores\Customer_Data_Store::class;
				}

				if( ! isset( $stores['customer_delivery_point_session'] ) ) {
					$stores['customer_delivery_point_session'] = Plugin\Data_Stores\Customer_Data_Store_Session::class;
				}

				return $stores;
			}

			/**
			 * @param WC_Email[] $emails Array Woocommerce Email Classes
			 *
			 * @return array
			 */
			public function email_classes( $emails ) {

				$email_class = Plugin_Class\Tracking_Email::class;

				if( ! class_exists( $email_class ) ) {
					require_once( $this->get_plugin_path() . '/includes/classes/tracking-email.php' );
				}

				$emails = array_merge( $emails, array(
					'wc_russian_post_tracking_email' => new $email_class()
				) );

				return $emails;
			}

			public function get_method_id() {
				return $this->method_id;
			}

			/**
			 * @return string
			 */
			protected function get_file() {
				return WC_RUSSIAN_POST_SHIPPING_FILE;
			}

			/**
			 * @return string
			 */
			public function get_plugin_name() {
				return __( 'Russian Post EMS integration with Woocommerce', 'woocommerce-russian-post' );
			}

			/**
			 * @return Plugin_Class\Checkout
			 */
			public function get_checkout_instance() {
				return $this->checkout;
			}

			public function get_admin_instance() {
				return $this->admin;
			}

			/**
			 * Returns the integrations handler class instance.
			 *
			 * @return Plugin_Class\Integrations
			 * @since 1.2.0
			 *
			 */
			public function get_integrations_instance() {
				return $this->integrations;
			}

			/**
			 * @return Plugin_Class\Integration|null
			 */
			public function get_settings_instance() {
				return WC()->integrations->get_integration( $this->get_method_id() );
			}

			/**
			 * @return int
			 */
			public function get_download_id() {
				return 8772;
			}

			public function get_settings_url( $plugin_id = null ) {
				return add_query_arg( array(
					'page'    => 'wc-settings',
					'tab'     => 'integration',
					'section' => $this->get_method_id()
				), admin_url( 'admin.php' ) );
			}

			public function is_plugin_settings() {
				return isset( $_GET['page'], $_GET['tab'] )
				       && 'wc-settings' === $_GET['page']
				       && 'integration' === $_GET['tab']
				       && ( ! isset( $_GET['section'] ) || $this->get_method_id() === $_GET['section'] );
			}

			public function is_general_configuration_page() {
				return $this->is_plugin_settings();
			}

			public function get_general_configuration_url() {
				return $this->get_settings_url( $this->get_method_id() );
			}

			public function get_documentation_url() {
				return add_query_arg( array(
					'utm_source' => str_replace( '.', '_', wp_parse_url( home_url(), PHP_URL_HOST ) ),
					'utm_medium' => 'organic'
				), 'https://woodev.ru/docs/nastrojka-plagina-pochty-rossii-woocommerce' );
			}

			public function get_sales_page_url() {
				return add_query_arg( array(
					'utm_source' => str_replace( '.', '_', wp_parse_url( home_url(), PHP_URL_HOST ) ),
					'utm_medium' => 'organic'
				), 'https://woodev.ru/downloads/pochta-rossii-woocommerce' );
			}

			public function get_support_url() {
				$args = array(
					'wpf4766_3'  => urlencode( 'Проблемы с плагином' ),
					'wpf4766_5'  => $this->get_download_id(),
					'wpf4766_7'  => site_url(),
					'utm_source' => str_replace( '.', '_', wp_parse_url( home_url(), PHP_URL_HOST ) ),
					'utm_medium' => 'organic'
				);

				return add_query_arg( $args, 'https://woodev.ru/support/' );
			}

			public function get_api() {
				if( is_object( $this->api ) ) {
					return $this->api;
				}

				//Load main API class
				require_once( $this->get_plugin_path() . '/includes/api/api.php' );
				require_once( $this->get_plugin_path() . '/includes/api/api-request.php' );
				require_once( $this->get_plugin_path() . '/includes/api/api-response.php' );

				return $this->api = new Plugin\API\API();
			}

			/**
			 * @return boolean
			 */
			public function is_debug_mode_enabled() {
				return wc_string_to_bool( $this->get_settings_instance()->get_option( 'enable_debug_mode', 'no' ) );
			}

			public function log( $message, $log_id = null ) {
				if( $this->is_debug_mode_enabled() ) {
					parent::log( $message, $log_id );
				}
			}

			public function get_api_log_message( $data ) {

				$messages = array();

				$messages[] = isset( $data['uri'] ) && $data['uri'] ? 'Запрос к API' : 'Ответ от сервера';

				foreach ( (array) $data as $key => $value ) {
					if( 'body' == $key ) {
						$value = json_decode( $value );
					}
					$messages[] = sprintf( '%s: %s', $key, is_array( $value ) || ( is_object( $value ) && 'stdClass' == get_class( $value ) ) ? print_r( (array) $value, true ) : $value );
				}

				return implode( "\n", $messages );
			}

			public function get_account_url() {

				$account_data = new Plugin_Class\Uninstall_Module();

				if( $account_data->get_guid_id() && $account_data->get_guid_key() ) {

					return add_query_arg( array(
						'guid_id'  => $account_data->get_guid_id(),
						'guid_key' => $account_data->get_guid_key()
					), 'https://cms.pochta.ru/authorization/cms' );
				}

				return false;
			}

			/**
			 * @param bool $force Force update data
			 *
			 * @return false|stdClass[]
			 */
			public function get_site_settings( $force = false ) {

				$transient_name = 'wc_russian_post_site_settings';
				$site_settings  = get_transient( $transient_name );

				if( false === $site_settings || $force ) {
					try {

						$module_data = new Plugin_Class\Install_Module();

						$site_settings = $this->get_api()->get_site_settings( array(
							'accountId'   => $module_data->get_guid_id(),
							'accountType' => $module_data->get_cms_type()
						), true );

						if( is_object( $site_settings ) ) {
							$site_settings->lastUpdate = time();
						}

						set_transient( $transient_name, $site_settings, DAY_IN_SECONDS );

					} catch ( \Woodev_API_Exception $e ) {
						$this->log( sprintf( __( 'Cannot get site settings. Error: %s', 'woocommerce-russian-post' ), $e->getMessage() ) );
					}
				}

				return $site_settings;
			}

			/**
			 * Builds the lifecycle handler instance.
			 */
			protected function init_lifecycle_handler() {

				require_once( $this->get_plugin_path() . '/includes/classes/lifecycle.php' );

				$this->lifecycle_handler = new Plugin_Class\Lifecycle( $this );
			}

			/**
			 * Build and initialize the Setup Wizard handler.
			 *
			 * @since 1.2.0
			 */
			protected function init_setup_wizard_handler() {
				parent::init_setup_wizard_handler();

				require_once( $this->get_plugin_path() . '/includes/admin/setup-wizard.php' );

				$this->setup_wizard_handler = new Plugin\Admin\Setup_Wizard( $this );
			}
		}

	}

	function wc_russian_post_shipping() {
		return WD_Russian_Post_Shipping::instance();
	}

	wc_russian_post_shipping();
}