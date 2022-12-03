<?php
/**
 * Plugin Name: Почта России EMS для юр.лиц
 * Plugin URI: https://woodev.ru/downloads/pochta-rossii-woocommerce
 * Description: Плагин интеграции Woocommerce с почтовой службой Почта РФ. Позволяет произвести расчёт стоимости EMS и других видов доставки. А так же экспорта заказов в ЛК Почты России <strong>для юридических лиц с активным договором</strong>
 * Version: 1.1.5
 * Requires at least: 4.6
 * Tested up to: 5.5
 * Author: WooDev
 * WC tested up to: 5.0.0
 * WC requires at least: 3.6
 * Author URI: https://woodev.ru
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'WC_RUSSIAN_POST_SHIPPING_VERSION', '1.1.5' );
define( 'WC_RUSSIAN_POST_SHIPPING_FILE', __FILE__ );

if ( ! class_exists( 'Woodev_Plugin_Bootstrap' ) ) {
	require_once( plugin_dir_path( WC_RUSSIAN_POST_SHIPPING_FILE ) . 'woodev/bootstrap.php' );
}

Woodev_Plugin_Bootstrap::instance()->register_plugin( '1.1.1', 'Почта России для юр.лиц', __FILE__, 'init_wc_russian_post_shipping_init', array(
	'load_shipping_method' 	=> true,
	'minimum_wc_version'	=> '3.6',
	'minimum_wp_version'	=> '4.6',
	'backwards_compatible' 	=> '1.1.0',
) );

function init_wc_russian_post_shipping_init() {
	
	if( ! class_exists( 'WD_Russian_Post_Shipping' ) ) {
		
		final class WD_Russian_Post_Shipping extends Woodev_Plugin {
			
			private $api;
			
			protected $admin;
			
			protected $checkout;
			
			protected static $instance = null;
			
			protected $method_id = 'wc_russian_post';
			
			public function __construct() {
				
				parent::__construct( $this->get_method_id(), WC_RUSSIAN_POST_SHIPPING_VERSION, array(
					'display_php_notice'	=> true,
					'text_domain'			=> 'woocommerce-russian-post'
				) );
				
				add_action( 'woodev_plugins_loaded', array( $this, 'includes' ) );
				
				add_filter( 'woocommerce_integrations', array( $this, 'include_integrations' ) );
				
				add_filter( 'woocommerce_email_classes', array( $this, 'load_order_exception_email' ) );
				add_action( 'woocommerce_email_actions', array( $this, 'add_order_exception_email_action' ) );
				
				add_action( 'woocommerce_register_taxonomy', array( $this, 'register_status_taxonomy' ) );
				
				add_action( 'woocommerce_shipping_init', array( $this, 'shipping_init' ) );
				add_filter( 'woocommerce_shipping_methods', array( $this, 'add_method' ) );
				
				add_filter( 'woocommerce_payment_gateways', array( $this, 'add_russian_post_cod_gateway' ) );
				add_action( 'woocommerce_email_before_order_table', array( $this, 'instructions_email' ), 10, 2 );
			}
			
			public static function instance() {
				if ( is_null( self::$instance ) ) {
					self::$instance = new self();
				}
				return self::$instance;
			}
			
			public function includes() {
				include_once( $this->get_plugin_path() . '/includes/functions.php' );
				require_once( $this->get_plugin_path() . '/includes/class-wc-russian-post-order.php' );
				include_once( $this->get_plugin_path() . '/includes/class-russian-post-integration.php' );
				require_once( $this->get_plugin_path() . '/includes/class-wc-russian-gateway-cod.php' );
				
				$this->checkout = $this->load_class( '/includes/class-wc-russian-post-checkout.php', 'WC_Russian_Post_Checkout' );
				
				if ( is_admin() && ! is_ajax() ) {
					$this->admin = $this->load_class( '/includes/admin/class-wc-russian-post-admin.php', 'WC_Russian_Post_Shipping_Admin' );
					$this->admin->message_handler = $this->get_message_handler();
				}
			}
			
			public function include_integrations( $integrations ) {
				if( class_exists( 'WC_Russian_Post_Integration' ) ) {
					$integrations[] = 'WC_Russian_Post_Integration';
				}
				return $integrations;
			}
			
			public function shipping_init() {
				include_once( $this->get_plugin_path() . '/includes/abstract-shipping-russian-post.php' );
				include_once( $this->get_plugin_path() . '/includes/class-shipping-russian-post.php' );
				//include_once( $this->get_plugin_path() . '/includes/class-shipping-russian-post-ecom.php' );
			}
			
			public function add_method( $methods ) {
				
				if ( ! array_key_exists( $this->get_method_id(), $methods ) ) {
					$methods[ $this->get_method_id() ] = 'WC_Russian_Post_Shipping_Simple';
					//$methods[ sprintf( '%s_ecom', $this->get_method_id() ) ] = 'WC_Russian_Post_Shipping_ECOM';
				}

				return $methods;
			}
			
			public function get_shipping_options() {
				return get_option( 'woocommerce_wc_russian_post_settings', array() );
			}
			
			public function get_shipping_option( $option_name, $default = null ) {
				
				if( $option_name && ! empty( $option_name ) ) {
					
					$integration_option = $this->get_integration_instance()->get_option( $option_name, $default );
					
					if( $integration_option ) {
						
						return $integration_option;
					
					} else {
						
						$settings = $this->get_shipping_options();
						
						if( $option_name && isset( $settings[ $option_name ] ) ) {
							return $settings[ $option_name ];
						}
					}
				}

				return $default;
			}
			
			public function load_order_exception_email( $email_classes ) {

				require_once( $this->get_plugin_path() . '/includes/emails/class-wc-russian-post-order-exception-email.php' );

				$email_classes['WC_Russian_Post_Order_Exception_Email'] = new WC_Russian_Post_Order_Exception_Email();

				return $email_classes;
			}
			
			public function add_order_exception_email_action( $actions ) {

				$actions[] = 'wc_russian_post_order_exception';

				return $actions;
			}
			
			public function add_russian_post_cod_gateway( $gateways ) {
				
				$gateways[] = 'WD_Russian_Post_Gateway_COD';

				return $gateways;
			}
			
			public function instructions_email( $order, $sent_to_admin ) {
				
				$cod_gateway = new WD_Russian_Post_Gateway_COD();
				$instructions = $cod_gateway->get_option( 'instructions' );
				
				if ( $instructions && ! $sent_to_admin && $cod_gateway->id === $order->get_payment_method() ) {
					echo wp_kses_post( wpautop( wptexturize( $instructions ) ) . PHP_EOL );
				}
			}
			
			public function register_status_taxonomy() {

				register_taxonomy( 'russian_post_order_status', array( 'shop_order' ),
					array(
						'hierarchical'          => false,
						'update_count_callback' => '_update_generic_term_count',
						'show_ui'               => false,
						'show_in_nav_menus'     => false,
						'query_var'             => ( is_admin() ),
						'rewrite'               => false,
					)
				);
			}
			
			public function get_method_id() {
				return $this->method_id;
			}
			
			public function get_integration_by_name( $name = '' ) {
				if( WC()->integrations ) {
					$integrations = WC()->integrations->get_integrations();
					if ( isset( $integrations[ $name ] ) ) {
						return $integrations[ $name ];
					}
				}
			}
			
			public function get_integration_instance() {
				return $this->get_integration_by_name( $this->get_method_id() );
			}
			
			public function get_admin_instance() {
				return $this->admin;
			}
			
			public function get_checkout_instance() {
				return $this->checkout;
			}
			
			public function get_plugin_name() {
				return 'Почта России для юр.лиц';
			}
			
			public function get_download_id() {
				return 8772;
			}
			
			protected function get_file() {
				return WC_RUSSIAN_POST_SHIPPING_FILE;
			}
			
			public function get_settings_url( $plugin_id = null ) {
				return admin_url( 'admin.php?page=wc-settings&tab=integration&section=wc_russian_post' );
			}
			
			public function is_plugin_settings() {
				return isset( $_GET['page'], $_GET['tab'], $_GET['section'] )
					&& 'wc-settings' === $_GET['page']
					&& 'shipping' === $_GET['tab']
					&& $this->get_method_id() === $_GET['section'];
			}
			
			public function get_documentation_url() {
				return add_query_arg( array(
					'utm_source' => str_replace( '.', '_', wp_parse_url( home_url(), PHP_URL_HOST ) ),
					'utm_medium' => 'organic'
				), 'https://woodev.ru/docs/plagin-integratsii-pochty-rossii-s-woocommerce' );
			}
			
			public function get_sales_page_url() {
				return add_query_arg( array(
					'utm_source' => str_replace( '.', '_', wp_parse_url( home_url(), PHP_URL_HOST ) ),
					'utm_medium' => 'organic'
				), 'https://woodev.ru/downloads/pochta-rossii-woocommerce' );
			}
			
			public function get_support_url() {
				$args = array(
					'wpf4766_3'	=> urlencode( 'Проблемы с плагином' ),
					'wpf4766_5'	=> $this->get_download_id(),
					'wpf4766_7'	=> site_url(),
					'utm_source' => str_replace( '.', '_', wp_parse_url( home_url(), PHP_URL_HOST ) ),
					'utm_medium' => 'organic'
				);
				return add_query_arg( $args, 'https://woodev.ru/support/' );
			}
			
			public function get_api() {
				if ( is_object( $this->api ) ) {
					return $this->api;
				}
				
				require_once( $this->get_plugin_path() . '/includes/api/class-russian-post-api.php' );
				require_once( $this->get_plugin_path() . '/includes/api/class-russian-post-api-request.php' );
				require_once( $this->get_plugin_path() . '/includes/api/class-russian-post-api-response.php' );
				
				return $this->api = new WD_Russian_Post_API( $this->get_shipping_option( 'account_name' ), $this->get_shipping_option( 'account_password' ), $this->get_shipping_option( 'account_token' ) );
			}
			
			public function get_customer_coordinates() {				
				return wc_russian_post_get_customer_coordinates();
			}
			
			public function add_admin_notices() {
				
				parent::add_admin_notices();
			}
			
			protected function install() {
				add_action( 'shutdown', array( $this, 'delayed_install' ) );
			}
			
			protected function upgrade( $installed_version ) {
				
				if ( version_compare( $installed_version, '1.0.3', '<' ) ) {
					
					if( false == wc_russian_post_get_user_options() ) {
						
						global $wpdb;
						
						$option_name = 'wc_russian_post_user_options';
						
						$wpdb->query( " UPDATE $wpdb->options SET option_name = $option_name WHERE option_name LIKE '_transient_{$option_name}_%'" );
					}
				}
			}
			
			public function delayed_install() {

				$this->register_status_taxonomy();
				
				$terms = array(
					'wc_russian_post_new'		=> __( 'New', 'woocommerce-russian-post' ),
					'wc_russian_post_failed'	=> __( 'Failed', 'woocommerce-russian-post' ),
					'wc_russian_post_shipped'	=> __( 'Shipped', 'woocommerce-russian-post' ),
					'wc_russian_post_deleted'	=> __( 'Deleted', 'woocommerce-russian-post' ),
				);

				foreach ( $terms as $term_slug => $term_name ) {

					if ( ! get_term_by( 'slug', $term_slug, 'russian_post_order_status' ) ) {
						wp_insert_term( $term_name, 'russian_post_order_status', array( 'slug' => $term_slug ) );
					}
				}
			}
		}
	}

	function wc_russian_post_shipping() {
		return WD_Russian_Post_Shipping::instance();
	}
	
	wc_russian_post_shipping();
}