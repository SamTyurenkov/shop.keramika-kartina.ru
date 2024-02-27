<?php

namespace Woodev\Russian_Post\Admin;

use Woodev\Russian_Post\Classes\Order;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Admin {

	/** @var \Woodev_Admin_Message_Handler instance */
	public $message_handler;

	/**
	 * The orders list table object.
	 *
	 * @var Order_List_Table
	 */
	private $orders_list_table;

	/** @var string */
	const TABLE_PAGE_SLUG = 'wc_russian_post_orders';

	/** @var Orders_Admin admin handler for orders data instance */
	private $orders;

	/** @var Products_Admin admin handler for products & product categories instance */
	private $products;

	public function __construct() {

		$this->includes();

		add_action( 'admin_menu', array( $this, 'add_menu_link' ) );
		add_action( 'in_admin_header', array( $this, 'load_orders_list_table' ) );
		add_filter( 'set-screen-option', array( $this, 'set_orders_list_option' ), 10, 3 );
		add_action( 'woocommerce_order_status_cancelled', array( $this, 'set_cancelled_status' ) );
	}

	private function includes() {
		$this->orders   = wc_russian_post_shipping()->load_class( '/includes/admin/orders-admin.php', Orders_Admin::class );
		$this->products = wc_russian_post_shipping()->load_class( '/includes/admin/products-admin.php', Products_Admin::class );
	}

	/**
	 * Get the orders handler instance.
	 *
	 * @return Orders_Admin instance
	 */
	public function get_orders_instance() {
		return $this->orders;
	}


	/**
	 * Get the products & product categories admin handler instance.
	 *
	 * @return Products_Admin instance
	 */
	public function get_products_instance() {
		return $this->products;
	}

	public function load_orders_list_table() {
		if ( isset( $_GET['page'] ) && self::TABLE_PAGE_SLUG == $_GET['page'] ) {
			$this->get_orders_list_table();
		}
	}

	private function get_orders_list_table() {

		if ( ! $this->orders_list_table ) {
			$this->orders_list_table = new Order_List_Table();
		}

		return $this->orders_list_table;
	}

	public function add_options() {
		$args = array(
			'label'   => __( 'Orders per page', 'woocommerce-russian-post' ),
			'default' => 20,
			'option'  => 'wc_russian_post_orders_edit_per_page',
		);

		add_screen_option( 'per_page', $args );
	}

	public function set_orders_list_option( $status, $option, $value ) {
		if ( 'wc_russian_post_orders_edit_per_page' == $option ) {
			return $value;
		}

		return $status;
	}

	public function add_menu_link() {

		$order_count = wc_russian_post_get_counts_order_status();
		$new_orders  = 0;

		foreach ( $order_count as $row ) {
			if ( wc_strtolower( $row->status ) !== 'new' ) {
				continue;
			}
			$new_orders = $row->count;
		}

		$menu_name = __( 'Russian Post Orders', 'woocommerce-russian-post' );

		if ( $new_orders > 0 ) {
			$menu_name .= sprintf( ' <span class="update-plugins count-%d"><span class="new-count">%d</span></span>', $new_orders, number_format_i18n( $new_orders ) );
		}

		$hook = add_submenu_page(
			'woocommerce',
			__( 'Russian Post Orders', 'woocommerce-russian-post' ),
			$menu_name,
			'manage_woocommerce',
			self::TABLE_PAGE_SLUG,
			array( $this, 'show_table_page' )
		);

		add_action( 'load-woocommerce_page_' . self::TABLE_PAGE_SLUG, array( $this, 'add_options' ) );
		add_action( 'admin_print_scripts-' . $hook, array( $this, 'load_scripts' ) );
		add_action( 'load-' . $hook, array( $this, 'process_bulk_action' ) );
	}

	public function load_scripts() {
		wp_enqueue_script( 'wc-russian-post-orders-table', wc_russian_post_shipping()->get_plugin_url() . '/assets/js/admin/orders-table.js', array( 'jquery-tiptip' ), WC_RUSSIAN_POST_SHIPPING_VERSION, true );
		wp_enqueue_style( 'wc-russian-post-orders-table', wc_russian_post_shipping()->get_plugin_url() . '/assets/css/admin/orders-table.css', array( 'woocommerce_admin_styles' ), WC_RUSSIAN_POST_SHIPPING_VERSION );
	}

	public function show_table_page() {
		$table = $this->get_orders_list_table();
		$table->prepare_items();

		echo '<div class="wrap woocommerce wc-russian-post-orders-wrapper">';
		echo '<form method="get" id="mainform" action="" enctype="multipart/form-data">';

		echo '<h2>' . __( 'Manage Russian Post Orders', 'woocommerce-russian-post' );

		if ( isset( $_GET['s'] ) && $_GET['s'] ) {
			echo '<span class="subtitle">' . sprintf( __( 'Search results for "%s"', 'woocommerce-russian-post' ), $_GET['s'] ) . '</span>';
		}

		echo '</h2>';

		$this->message_handler->show_messages();

		// Display the views
		$table->views();
		$table->search_box( __( 'Search Orders', 'woocommerce-russian-post' ), 'russian_post_order' );

		if ( ! empty( $_REQUEST['russian_post_status'] ) ) {
			echo '<input type="hidden" name="russian_post_status" value="' . esc_attr( $_REQUEST['russian_post_status'] ) . '" />';
		}

		echo '<input type="hidden" name="page" value="' . esc_attr( $_REQUEST['page'] ) . '" />';

		$table->display();

		echo '</form>';
		echo '</div>';
	}

	/**
	 * Process bulk actions.
	 *
	 * @since 4.9.6
	 * @since 5.6.0 Added support for the `complete` action.
	 */
	public function process_bulk_action() {
		$action       = $this->get_orders_list_table()->current_action();
		$bulk_actions = $this->get_orders_list_table()->get_bulk_actions();
		$order_ids    = isset( $_REQUEST['order_id'] ) ? wp_parse_id_list( wp_unslash( $_REQUEST['order_id'] ) ) : array();

		if ( $action && in_array( $action, array_keys( $bulk_actions ), true ) ) {

			if ( empty( $order_ids ) ) {
				if ( ! empty( $_REQUEST['_wp_http_referer'] ) ) {
					$this->message_handler->add_info( sprintf( __( 'Action "%s" have not been completed, because you have not selected any order.', 'woocommerce-russian-post' ), $bulk_actions[ $action ] ) );
					wp_redirect( esc_url_raw( remove_query_arg( array(
						'_wp_http_referer',
						'_wpnonce',
						'action',
						'action2'
					), stripslashes( $_SERVER['REQUEST_URI'] ) ) ) );
					exit;
				}

				return;
			}

			$messages = array(
				'success' => array(),
				'error'   => array()
			);

			foreach ( $order_ids as $order_id ) {

				$order = new Order( $order_id );

				switch ( $action ) {
					case 'export' :
						if ( ! $order->is_exported() ) {
							if ( $order->export_action() ) {
								$messages['success'][] = sprintf( __( 'Order %s was successfully exported to Russian Post', 'woocommerce-russian-post' ), $order->get_order_number() );
							} else {
								$messages['error'][] = sprintf( __( 'Order %s could not be exported.', 'woocommerce-russian-post' ), $order->get_order_number() );
							}

						} else {
							$messages['error'][] = sprintf( __( 'Order %s could not be exported because it was already exported.', 'woocommerce-russian-post' ), $order->get_order_number() );
						}
						break;
					case 'update' :
						if ( $order->is_exported() ) {
							if ( $order->update_order() ) {
								$messages['success'][] = sprintf( __( 'Order %s was successfully updated.', 'woocommerce-russian-post' ), $order->get_order_number() );
							} else {
								$messages['error'][] = sprintf( __( 'Order %s could not be updated.', 'woocommerce-russian-post' ), $order->get_order_number() );
							}
						} else {
							$messages['error'][] = sprintf( __( 'Order %s could not be updated because it was not exported yet.', 'woocommerce-russian-post' ), $order->get_order_number() );
						}
						break;
					case 'cancel' :
						if ( $order->is_exported() ) {
							if ( $order->cancel_action() ) {
								$messages['success'][] = sprintf( __( 'Order %s was successfully canceled.', 'woocommerce-russian-post' ), $order->get_order_number() );
							} else {
								$messages['error'][] = sprintf( __( 'Order %s could not be canceled.', 'woocommerce-russian-post' ), $order->get_order_number() );
							}
						} else {
							$messages['error'][] = sprintf( __( 'Order %s could not be canceled because it was not exported yet.', 'woocommerce-russian-post' ), $order->get_order_number() );
						}
						break;
				}
			}

			foreach ( $messages as $type => $message_items ) {

				if ( ! empty( $message_items ) ) {

					foreach ( $message_items as $message ) {

						switch ( $type ) {
							case 'success' :
								$this->message_handler->add_message( $message );
								break;
							case 'error' :
								$this->message_handler->add_error( $message );
								break;
						}
					}

				}
			}

			$this->redirect_with_notice();
		}
	}

	public function set_cancelled_status( $order_id ) {

		$order = new Order( $order_id );

		if ( $order->is_russian_post() ) {

			if ( in_array( wc_strtolower( $order->get_order_status() ), array( 'new', 'exported', 'failed' ), true ) ) {

				if ( ! $order->is_exported() ) {
					$order->set_order_status( 'canceled' );
					$order->add_order_note( sprintf( __( 'The order #%s was cancel by manager.', 'woocommerce-russian-post' ), $order->get_id() ) );
				} else {
					$order->cancel_action();
				}
			} else {
				throw new \Exception( sprintf( __( 'Cannot cancel order #%s because it is not editable.', 'woocommerce-russian-post' ), $order->get_order_number() ) );
			}
		}
	}

	protected function redirect_with_notice() {

		if ( isset( $_REQUEST['_wp_http_referer'] ) ) {
			$redirect_url = $_REQUEST['_wp_http_referer'];
		} else {
			$redirect_url = remove_query_arg( array(
				'_wp_http_referer',
				'_wpnonce',
				'action',
				'action2',
				'order_id'
			), stripslashes( $_SERVER['REQUEST_URI'] ) );
		}

		wp_safe_redirect( esc_url_raw( $this->message_handler->redirect( $redirect_url, null ) ) );
		exit;
	}
}