<?php

namespace Woodev\Russian_Post\Admin;

use Woodev\Russian_Post\Classes\Address_Normalize;
use Woodev\Russian_Post\Classes\Order;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Order_List_Table extends \WP_List_Table {

	function __construct() {

		parent::__construct(
			array(
				'singular' => __( 'Russian Post Order', 'woocommerce-russian-post' ),
				'plural'   => __( 'Russian Post Orders', 'woocommerce-russian-post' ),
				'ajax'     => false
			)
		);

		add_filter( 'woocommerce_order_data_store_cpt_get_orders_query', array( $this, 'handle_query_var' ), 10, 2 );
	}

	/**
	 * Gets the list of orders available on this table.
	 *
	 * @return array
	 */
	public function get_views() {

		$current_status = isset( $_REQUEST['russian_post_order_status'] ) ? sanitize_text_field( $_REQUEST['russian_post_order_status'] ) : '';
		$views          = array();
		$counts         = array( 'all' => 0 );
		$base_url       = admin_url( 'admin.php?page=wc_russian_post_orders' );
		$status_counts  = wc_russian_post_get_counts_order_status();
		$statuses       = wc_russian_post_get_order_statuses();

		foreach ( $status_counts as $row ) {
			$counts[ strtolower( $row->status ) ] = $row->count;
			$counts['all']                        += $row->count;
		}

		$total_requests = isset( $counts['all'] ) ? $counts['all'] : 0;

		if ( isset( $_REQUEST['s'] ) ) {
			$base_url = add_query_arg( 's', $_REQUEST['s'], $base_url );
		}

		$status_label = sprintf(
		/* translators: %s: Number of requests. */
			_nx(
				'All orders <span class="count">(%s)</span>',
				'All orders <span class="count">(%s)</span>',
				$total_requests,
				'All orders status',
				'woocommerce-russian-post'
			),
			number_format_i18n( $total_requests )
		);

		$views['all'] = array(
			'url'     => esc_url( $base_url ),
			'label'   => $status_label,
			'current' => empty( $current_status ),
		);

		foreach ( $statuses as $status_key => $status_name ) {

			$total_status_requests = isset( $counts[ $status_key ] ) ? $counts[ $status_key ] : 0;

			if ( ! $total_status_requests ) {
				continue;
			}

			$status_label = sprintf(
				'%s <span class="count">(%s)</span>',
				ucfirst( $status_name ),
				number_format_i18n( $total_status_requests )
			);

			$status_link = add_query_arg( 'russian_post_order_status', $status_key, $base_url );

			$views[ $status_key ] = array(
				'url'     => esc_url( $status_link ),
				'label'   => $status_label,
				'current' => $status_key === $current_status,
			);
		}

		return $this->get_views_links( $views );
	}

	/**
	 * Get bulk actions.
	 *
	 * @return array Array of bulk action labels keyed by their action.
	 */
	protected function get_bulk_actions() {
		return array(
			'export' => __( 'Export', 'woocommerce-russian-post' ),
			'update' => __( 'Update', 'woocommerce-russian-post' ),
			'cancel' => __( 'Cancel', 'woocommerce-russian-post' )
		);
	}

	/**
	 * Gets a list of sortable columns.
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		return array(
			'order_date' => array( 'post_date', false ),
			// false because the initial sort direction is DESC so we want the first column click to sort ASC
			'order'      => array( 'ID', false )
			// same logic as order_date
		);
	}

	/**
	 * Default primary column.
	 *
	 * @return string Default primary column name.
	 */
	protected function get_default_primary_column_name() {
		return 'order';
	}

	/**
	 * Gets a list of columns.
	 *
	 * @return array
	 */
	public function get_columns() {
		return array(
			'cb'         => '<input type="checkbox" />',
			'order'      => __( 'Order', 'woocommerce-russian-post' ),
			'status'     => __( 'Status', 'woocommerce-russian-post' ),
			'customer'   => __( 'Customer', 'woocommerce-russian-post' ),
			'delivery'   => __( 'Delivery', 'woocommerce-russian-post' ),
			'type'       => __( 'Shipment type', 'woocommerce-russian-post' ),
			'payment'    => __( 'Payment', 'woocommerce-russian-post' ),
			'barcode'    => __( 'Tracking number', 'woocommerce-russian-post' ),
			'order_date' => __( 'Order Date', 'woocommerce-russian-post' ),
			'actions'    => __( 'Actions', 'woocommerce-russian-post' ),
		);
	}

	/**
	 * Get content for the special checkbox column
	 *
	 * @param Order $item one row (item) in the table
	 *
	 * @return string the checkbox column content
	 * @see \WP_List_Table::single_row_columns()
	 */
	function column_cb( $item ) {
		return sprintf( '<input type="checkbox" name="%1$s[]" value="%2$s" /><span class="spinner"></span>', 'order_id', $item->get_id() );
	}

	/**
	 * Get column content, this is called once per column, per row item ($order)
	 * returns the content to be rendered within that cell.
	 *
	 * @param Order $item one row (item) in the table
	 * @param string $column_name the column slug
	 *
	 * @return string the column content
	 * @see WP_List_Table::single_row_columns()
	 */
	public function column_default( $item, $column_name ) {

		$column_content = '';

		switch ( $column_name ) {

			case 'customer':

				$customer_name = $item->get_formatted_billing_full_name();
				$billing_email = $item->get_billing_email();
				$user_id       = $item->get_customer_id();

				if ( ! $customer_name ) {
					$user          = get_user_by( 'id', $user_id );
					$customer_name = ucwords( $user->display_name );
				}


				if ( 0 !== $user_id ) {
					$column_content = sprintf( '<a href="%s">%s (%s)</a>', get_edit_user_link( $user_id ), $customer_name, $billing_email );
				} else {
					$column_content = sprintf( '<span>%s <br />%s</span>', $customer_name, $billing_email );
				}

				if ( $item->get_billing_phone() ) {
					$column_content .= sprintf( '<span class="description dashicons-before dashicons-phone"> %s</span>', wc_format_phone_number( $item->get_billing_phone() ) );
				}

				break;

			case 'delivery':

				if( ! $item->get_shipping_method_instance() ) {
					return '&ndash;';
				}

				if ( $item->get_shipping_method_instance()->is_courier() ) {
					$tip = __( 'Delivery to customer shipping address', 'woocommerce-russian-post' );
					/** @var Address_Normalize $normalize_address */
					$normalize_address = $item->get_shipping_rate_meta( 'normalize_address' );
				} else {

					$tip            = $item->is_postamat() ? __( 'Delivery to Pochtamat', 'woocommerce-russian-post' ) : __( 'Delivery to postal office of Russian Post', 'woocommerce-russian-post' );
					$delivery_point = $item->get_shipping_rate_meta( 'delivery_point' );
					/** @var Address_Normalize $normalize_address */
					$normalize_address = $delivery_point['normalize_address'];
				}

				if ( $normalize_address instanceof Address_Normalize ) {
					$column_content = sprintf( __( 'Address: %s', 'woocommerce-russian-post' ), esc_html( $normalize_address->get_formatted_address() ) );
				} else {

					//This situation should not happen, but if it did, then most likely something went wrong during the creation of the order.

					$address_string = sprintf( __( 'Address: %s', 'woocommerce-russian-post' ), esc_html( implode( ', ', array_filter( array(
						$item->get_shipping_postcode(),
						$item->get_shipping_state(),
						$item->get_shipping_city(),
						$item->get_shipping_address_1(),
						$item->get_shipping_address_2(),
					) ) ) ) );

					if( !$item->is_exported() ) {
						$column_content = sprintf( '<span class="tips" data-tip="%s">%s</span> <span class="woocommerce-help-tip"></span>', __( 'Note! The address may not be accurate as it has not been validated. Please recheck the recipients address before sending.', 'woocommerce-russian-post' ), $address_string );
					} else {
						$column_content = sprintf( __( 'Address: %s', 'woocommerce-russian-post' ), esc_html( $address_string ) );
					}
				}

				$column_content .= sprintf( '<span class="description tips" data-tip="%s">%s: %s</span>', esc_attr( $tip ), $item->get_shipping_method(), wp_kses_post( wc_price( $item->get_shipping_total() ) ) );

				break;

			case 'payment':
				$column_content = sprintf( '<span>%s: %s</span>', esc_html( $item->get_payment_method_title() ), $item->get_formatted_order_total() );
				break;

			case 'barcode':
				$column_content = $item->get_tracking_link() ?: '&ndash;';
				break;
		}

		return $column_content;
	}

	/**
	 * @param Order $item
	 *
	 * @return string
	 */
	public function column_type( $item ) {

		if( ! $item->get_shipping_method_instance() ) {
			return '&ndash;';
		}

		if ( $item->get_shipping_method_instance()->is_courier() ) {
			$type = 'courier';
			$name = _x( 'Courier', 'shipment type', 'woocommerce-russian-post' );
		} else {
			if ( $item->is_postamat() ) {
				$type = 'postamat';
				$name = _x( 'Postamat', 'shipment type', 'woocommerce-russian-post' );
			} else {
				$type = 'office';
				$name = _x( 'Postal office', 'shipment type', 'woocommerce-russian-post' );
			}
		}

		return sprintf( '<mark class="shipment-type shipment-type--%s"><span>%s</span></mark>', $type, $name );
	}

	/**
	 * @param Order $item
	 *
	 * @return string
	 */
	public function column_order( Order $item ) {

		if ( 'trash' === $item->get_status() ) {
			return sprintf( '<strong>%s</strong>', sprintf( __( 'Order %s', 'woocommerce-russian-post' ), $item->get_order_number() ) );
		} else {

			return sprintf(
				'<a href="%s" title="%s">%s</a>',
				add_query_arg(
					array(
						'view'     => 'orders',
						'order_id' => $item->get_id(),
					),
					$item->get_edit_order_url()
				),
				esc_html__( 'Edit this order', 'woocommerce-russian-post' ),
				sprintf( esc_html__( 'Order %s', 'woocommerce-russian-post' ), $item->get_order_number() )
			);
		}
	}

	/**
	 * @param Order $item
	 *
	 * @return string
	 */
	public function column_status( Order $item ) {

		switch ( wc_strtolower( $item->get_order_status() ) ) {
			case 'new' :
				$tooltip = sprintf( __( 'Status "%s" means the order is only created but was not exported to Russian Post yet', 'woocommerce-russian-post' ), $item->get_order_status_name( 'new' ) );
				break;
			case 'canceled' :
				$tooltip = __( 'This order was canceled by the manager of the shop', 'woocommerce-russian-post' );
				break;
			case 'exported' :
				$tooltip = __( 'This order was successful exported to Russia Post', 'woocommerce-russian-post' );
				break;
			default :
				$tooltip = sprintf( __( 'Status of Russian Post order is %s', 'woocommerce-russian-post' ), $item->get_order_status_name( $item->get_order_status() ) );
				break;
		}

		return sprintf( '<mark class="order-status %s tips" data-tip="%s"><span>%s</span></mark>', esc_attr( sanitize_html_class( 'status-russian-post-' . strtolower( $item->get_order_status() ) ) ), esc_attr( $tooltip ), esc_html( $item->get_order_status_name() ) );
	}

	public function column_order_date( Order $item ) {

		$order_timestamp = $item->get_date_created() ? $item->get_date_created()->getTimestamp() : '';

		if ( ! $order_timestamp ) {
			echo '&ndash;';

			return;
		}

		if ( $order_timestamp > strtotime( '-1 day', time() ) && $order_timestamp <= time() ) {
			$show_date = sprintf(
				_x( '%s ago', '%s = human-readable time difference', 'woocommerce' ),
				human_time_diff( $item->get_date_created()->getTimestamp(), time() )
			);
		} else {
			$show_date = $item->get_date_created()->date_i18n( __( 'j M Y', 'woocommerce' ) );
		}

		return sprintf(
			'<time datetime="%1$s" title="%2$s">%3$s</time>',
			esc_attr( $item->get_date_created()->date( 'c' ) ),
			esc_html( $item->get_date_created()->date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) ),
			esc_html( $show_date )
		);
	}

	public function column_actions( Order $item ) {
		printf( '<p>%s</p>', wc_render_action_buttons( $this->get_order_actions( $item ) ) );
	}

	public function get_order_actions( $order_item ) {
		$actions = array();

		if ( $order_item instanceof Order ) {

			$action_base_url = add_query_arg( array(
				'action'  => 'russian_post_order_action',
				'item_id' => $order_item->get_id(),
				'make'    => ''
			), admin_url( 'admin-ajax.php' ) );

			if ( ! $order_item->is_exported() && $order_item->has_status( array(
					'pending',
					'on-hold',
					'processing'
				) ) ) {

				$actions['export'] = array(
					'url'    => wp_nonce_url( add_query_arg( 'make', 'export', $action_base_url ), 'russian-post-order-action' ),
					'name'   => __( 'Export order', 'woocommerce-russian-post' ),
					'title'  => __( 'Export order to Russian Post', 'woocommerce-russian-post' ),
					'action' => 'russian-post-export',
				);

			} elseif ( $order_item->is_exported() ) {

				$actions['update'] = array(
					'url'    => wp_nonce_url( add_query_arg( 'make', 'update', $action_base_url ), 'russian-post-order-action' ),
					'name'   => __( 'Update order inform', 'woocommerce-russian-post' ),
					'title'  => __( 'Force update order information like as delivery status and change order data in Russian Post', 'woocommerce-russian-post' ),
					'action' => 'russian-post-update',
				);

				if ( $order_item::OTPRAVKA_EXPORT_TYPE == $order_item->get_export_type() ) {

					$actions['cancel'] = array(
						'url'    => wp_nonce_url( add_query_arg( 'make', 'cancel', $action_base_url ), 'russian-post-order-action' ),
						'name'   => __( 'Cancel', 'woocommerce-russian-post' ),
						'title'  => __( 'Remove order from Russian Post', 'woocommerce-russian-post' ),
						'action' => 'russian-post-cancel',
					);
				}
			}
		}

		return $actions;
	}

	private function get_current_orderby() {
		return isset( $_GET['orderby'] ) ? $_GET['orderby'] : 'post_date';
	}

	private function get_current_order() {
		return isset( $_GET['order'] ) ? $_GET['order'] : 'DESC';
	}

	/**
	 * @param array $query - Args for WP_Query.
	 * @param array $query_vars - Query vars from WC_Order_Query.
	 *
	 * @return array modified $query
	 */
	public function handle_query_var( $query, $query_vars ) {

		if ( ! empty( $query_vars['is_russian_post'] ) ) {
			$query['meta_query'][] = array(
				'key'     => '_wc_russian_post_is_russian_post',
				'compare' => 'EXISTS'
			);
		}

		if ( ! empty( $query_vars['russian_post_status'] ) ) {
			$query['meta_query'][] = array(
				'key'   => '_wc_russian_post_status',
				'value' => strtoupper( $query_vars['russian_post_status'] )
			);
		}

		return $query;
	}

	/**
	 * Prepares the list of items for displaying.
	 *
	 * @uses \WP_List_Table::set_pagination_args()
	 */
	public function prepare_items() {

		$per_page = $this->get_items_per_page( 'wc_russian_post_orders_edit_per_page' );

		// main query args
		$args = array(
			'paginate'        => true,
			'status'          => array_keys( wc_get_order_statuses() ),
			'type'            => wc_get_order_types( 'view-orders' ),
			'limit'           => $per_page,
			'paged'           => $this->get_pagenum(),
			'orderby'         => $this->get_current_orderby(),
			'order'           => $this->get_current_order(),
			'is_russian_post' => true
		);

		if ( isset( $_GET['russian_post_order_status'] ) && 'all' !== wc_clean( $_GET['russian_post_order_status'] ) ) {
			$args['russian_post_status'] = wc_clean( $_GET['russian_post_order_status'] );
		}

		$args = $this->add_search_args( $args );

		try {

			/** @var \WC_Order_Data_Store_CPT $data_store */
			$data_store = \WC_Data_Store::load( 'order' );
			$orders     = $data_store->query( $args );

			foreach ( ( array ) $orders->orders as $order_post ) {
				$order         = new Order( $order_post );
				$this->items[] = $order;
			}

			$this->set_pagination_args(
				array(
					'total_items' => $orders->total,
					'per_page'    => $per_page,
					'total_pages' => $orders->max_num_pages
				)
			);

		} catch ( \Exception $e ) {
			wc_russian_post_shipping()->log( $e->getMessage(), 'wc_russian_post_exception_error' );
		}
	}

	public function no_items() {
		esc_html_e( 'No Russian Post orders found.', 'woocommerce-russian-post' );
	}

	/**
	 * Generates content for a single row of the table,
	 *
	 * @param Order $item The current item.
	 */
	public function single_row( $item ) {
		echo '<tr id="wc-russian-post-order-' . esc_attr( $item->get_id() ) . '" class="wc-russian-post-order-status-' . esc_attr( $item->get_status() ) . '">';
		$this->single_row_columns( $item );
		echo '</tr>';
	}

	/**
	 * Adds in any query arguments based on the search term
	 *
	 * @param array $args associative array of WP_Query arguments used to query and populate the list table
	 *
	 * @return array associative array of WP_Query arguments used to query and populate the list table
	 */
	private function add_search_args( $args ) {

		global $wpdb;

		if ( isset( $_GET['s'] ) && $_GET['s'] ) {

			$search_fields = array_map( 'esc_attr', array(
				'_order_key',
				'_billing_email',
				'_wc_russian_post_status',
				'_wc_russian_post_tracking_number',
			) );

			$search_order_id = str_replace( 'Order #', '', $_GET['s'] );
			if ( ! is_numeric( $search_order_id ) ) {
				$search_order_id = 0;
			}

			// Search orders
			$post_ids = array_merge(
				$wpdb->get_col(
					$wpdb->prepare( "
						SELECT post_id
						FROM {$wpdb->postmeta}
						WHERE meta_key IN ('" . implode( "','", $search_fields ) . "')
						AND meta_value LIKE '%%%s%%'",
						esc_attr( $_GET['s'] )
					)
				),
				$wpdb->get_col(
					$wpdb->prepare( "
						SELECT order_id
						FROM {$wpdb->prefix}woocommerce_order_items as order_items
						WHERE order_item_name LIKE '%%%s%%'
						",
						esc_attr( $_GET['s'] )
					)
				),
				$wpdb->get_col(
					$wpdb->prepare( "
						SELECT posts.ID
						FROM {$wpdb->posts} as posts
						LEFT JOIN {$wpdb->postmeta} as postmeta ON posts.ID = postmeta.post_id
						LEFT JOIN {$wpdb->users} as users ON postmeta.meta_value = users.ID
						WHERE
							post_excerpt LIKE '%%%1\$s%%' OR
							post_title   LIKE '%%%1\$s%%' OR
							(
								meta_key = '_customer_user' AND
								(
									user_login    LIKE '%%%1\$s%%' OR
									user_nicename LIKE '%%%1\$s%%' OR
									user_email    LIKE '%%%1\$s%%' OR
									display_name  LIKE '%%%1\$s%%'
								)
							)
						",
						esc_attr( $_GET['s'] )
					)
				),
				array( $search_order_id )
			);

			$args['post__in'] = $post_ids;
		}

		return $args;
	}
}