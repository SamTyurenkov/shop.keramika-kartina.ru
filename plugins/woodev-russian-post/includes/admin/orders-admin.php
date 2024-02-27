<?php

namespace Woodev\Russian_Post\Admin;

use Woodev\Russian_Post\Classes\Order;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Orders_Admin {

	public function __construct() {
		add_action( 'add_meta_boxes', array ( $this, 'add_order_meta_box' ) );
	}

	public function add_order_meta_box() {

		add_meta_box( 'wc_russian_post_order_meta_box', __( 'Russian Post - Order information', 'woocommerce-russian-post' ),
			array ( $this, 'render_order_meta_box' ),
			'shop_order',
			'side',
			'high'
		);
	}

	public function render_order_meta_box( \WP_Post $post ) {

		$order = new Order( $post->ID );

		if ( $order->is_russian_post() ) {

			wc_russian_post_shipping()->get_message_handler()->show_messages();

			wp_enqueue_style( 'woocommerce_russian_post_admin', wc_russian_post_shipping()->get_plugin_url() . '/assets/css/admin/order.css', array ( 'woocommerce_admin_styles' ), WC_RUSSIAN_POST_SHIPPING_VERSION );

			if ( ! $order->is_exported() ) {
				_e( 'The information about the order will become available only after the order has been sent to Russian Post.', 'woocommerce-russian-post' );
			} else {

				wc_russian_post_shipping()->load_template( 'views/html-order-meta-box.php', array (
					'order' => $order
				) );
			}

			$orders_list_table = new Order_List_Table();

			printf( '<div class="wc-russian-post-order-actions">%s</div>', wc_render_action_buttons( $orders_list_table->get_order_actions( $order ) ) );

		} else {
			_e( 'This order doesnt utilize the Russian Post shipping method.', 'woocommerce-russian-post' );
		}
	}

}