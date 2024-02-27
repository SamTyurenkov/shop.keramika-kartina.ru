<?php

namespace Woodev\Russian_Post\Admin;

use Woodev\Russian_Post\Classes\Order;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Products_Admin {

	public function __construct() {

		add_action( 'woocommerce_product_options_shipping', array( $this, 'product_options' ) );
		add_action( 'woocommerce_process_product_meta', array( $this, 'save_product' ) );
		add_action( 'before_delete_post', array( $this, 'before_delete_order' ) );
	}

	/**
	 * Adds options to a product in the Shipping tab.
	 */
	public function product_options() {
		global $post;

		$product = wc_get_product( $post );

		if ( ! $product instanceof \WC_Product ) {
			return;
		}

		woocommerce_wp_text_input( array(
			'id'          => '_tnved_code',
			'label'       => __( 'TN VED code', 'woocommerce-russian-post' ),
			'placeholder' => esc_html__( 'Enter TN VED code for this product', 'woocommerce-russian-post' ),
			'desc_tip'    => true,
			'description' => esc_html__( 'This code is required for international shipping. If you do not enter the code, you cannot send this product to a foreign country via Russian Post.', 'woocommerce-russian-post' ),
			'type'        => 'text'
		) );
	}

	public function save_product( $product_id ) {

		$tnved_code = isset( $_POST[ '_tnved_code' ] ) ? $_POST[ '_tnved_code' ] : null;

		if( $product = wc_get_product( $product_id ) ) {
			$product->update_meta_data( '_tnved_code', $tnved_code );
			$product->save_meta_data();
		}
	}

	public function before_delete_order( $order_id ) {

		if ( ! current_user_can( 'delete_posts' ) || ! $order_id ) {
			return;
		}

		if( in_array( get_post_type( $order_id ), wc_get_order_types(), true ) ) {
			$order = new Order( $order_id );
			if( $order->is_russian_post() && $order->is_exported() ) {
				$order->cancel_action();
			}
		}
	}
}