<?php

defined( 'ABSPATH' ) or exit;


class WC_Russian_Post_Order extends WC_Order {

	public $russian_post_status;
	
	public $russian_post_id;
	
	public $is_russian_post;
	
	public $tracking_number;
	
	public $package_items = array();

	public function __construct( $order_id ) {
		
		parent::__construct( $order_id );
		
		$this->is_russian_post = false;
		
		$terms = wp_get_object_terms( $this->id, 'russian_post_order_status', array( 'fields' => 'slugs' ) );
		$this->russian_post_status = ( isset( $terms[0] ) ) ? str_replace( 'wc_russian_post_', '', $terms[0] ) : 'new';
		
		$custom_fields = apply_filters( 'wc_russian_post_order_defaults', array(
			'russian_post_id'	=> '',
			'delivery_time' 	=> array(),
			'tracking_number'	=> '',
		), $order_id );
		
		foreach ( $custom_fields as $key => $default ) {

			$value = $this->get_order_meta( $key );

			$this->$key = ( ! empty( $value ) ) ? $value : $default;
		}
		
		$shipping = $this->get_items( 'shipping' );
		
		foreach( $shipping as $key => $item ) {
			if( ! Woodev_Helper::str_starts_with( $item->get_method_id(), wc_russian_post_shipping()->get_method_id() ) ) {
				continue;
			}
			
			$this->is_russian_post = true;
			
			foreach ( $item->get_meta_data() as $meta_data ) {
				if( in_array( $meta_data->key, wc_russian_post_get_custom_order_fields() ) ) {
					$key_name = $meta_data->key;
					$this->$key_name = ( ! empty( $meta_data->value ) ) ? $meta_data->value : null;
				}
			}
		}
		
		$this->is_exported = in_array( $this->russian_post_status, array( 'new', 'failed', 'deleted' ) ) ? false : true;
	}
	
	public function get_package_items() {
		return $this->package_items;
	}
	
	private function convert_items() {

		$this->package_items = array();
		
		$loop_index = 0;
		
		foreach ( $this->get_items() as $item ) {

			$product = $this->get_product_from_item( $item );

			if ( ! $product->needs_shipping() ) {
				continue;
			}
			
			$this->package_items[ $loop_index ]['code']     	= $product->get_id();
			$this->package_items[ $loop_index ]['quantity'] 	= $item->get_quantity();
			$this->package_items[ $loop_index ]['description'] 	= $product->get_name();
			$this->package_items[ $loop_index ]['value'] 		= $product->get_price() * 100;
			$this->package_items[ $loop_index ]['weight'] 		= max( 1, wc_get_weight( $product->get_weight(), 'g' ) );
			$this->package_items[ $loop_index ]['goods-type']	= 'GOODS';
			$this->package_items[ $loop_index ]['insr-value']	= $this->get_item_total( $item ) * 100;
			
			$sku = $product->get_sku();
			if( ! empty( $sku ) ) {
				$this->package_items[ $loop_index ]['item-number']	= $product->get_sku();
			}
			
			$loop_index++;
		}
	}
	
	public function export() {
		
		if ( ! $this->is_russian_post || $this->is_exported || ! wc_russian_post_shipping()->get_license_instance()->is_license_valid() ) {
			return;
		}
		
		if ( ! in_array( $this->status, array( 'on-hold', 'processing' ) ) ) {
			//return;
		}
		
		$this->convert_items();
		
		if ( empty( $this->package_items ) ) {
			return;
		}
		
		try {
			
			$response = wc_russian_post_shipping()->get_api()->export_order( $this );
			
			$order    = $response->get_single_order();
			
			if( $order && isset( $order['status_code'] ) ) {
				
				$this->update_russian_post_status( $order['status_code'], $order['status_text'] );
				
				$this->is_exported = true;
				$this->update_order_meta( 'russian_post_id', $order['russian_post_id'] );
				$this->update_order_meta( 'tracking_number', $order['tracking_number'] );
				$this->update_order_meta( 'delivery_time', $order['delivery_time'] );
				
				do_action( 'wc_russian_post_order_exception', $this->id );
				
				do_action( 'wc_russian_post_order_exported', $this, $response );
			
			} else {
				
				$this->update_russian_post_status( 'failed', 'Во время эспорта заказа в ЛК Почты РФ произошла ошибка. Попробуйте ещё раз.' );
			}
			

		} catch ( Woodev_API_Exception $e ) {

			wc_russian_post_shipping()->log( $e->getMessage() );

			$this->update_russian_post_status( 'failed', sprintf( '<p class="wc_russian_post_note"><strong>API/HTTP Error:</strong> %s</p>', $e->getMessage() ) );
		}
	}
	
	public function remove_order() {
		if ( ! $this->is_russian_post || ! wc_russian_post_shipping()->get_license_instance()->is_license_valid() ) {
			return;
		}
		
		try {
		
			$response = wc_russian_post_shipping()->get_api()->remove_order( $this->russian_post_id );
			$this->update_russian_post_status( 'deleted', 'Заказ был удалён из ЛК Почты России.' );
			$this->is_exported = false;
			$this->update_order_meta( 'russian_post_id', null );
			$this->update_order_meta( 'tracking_number', null );
			$this->update_order_meta( 'delivery_time', array() );
		
		} catch ( Woodev_API_Exception $e ) {

			wc_russian_post_shipping()->log( $e->getMessage() );
		}
	}
	
	public function update_order_meta( $meta_key, $meta_value ) {

		if ( ! $meta_key || ! $meta_value ) {
			return;
		}

		update_post_meta( $this->id, '_wc_russian_post_'. $meta_key, $meta_value );

		$this->$meta_key = $meta_value;
	}
	
	public function get_order_meta( $key, $single = true ) {
		return get_post_meta( $this->id, "_wc_russian_post_{$key}", $single );
	}


	public function update_russian_post_status( $new_status, $note = '' ) {

		if ( ! $this->is_russian_post || ! $new_status ) {
			return;
		}
		
		$old_status_term = get_term_by( 'slug', sanitize_title( 'wc_russian_post_' . $this->russian_post_status ), 'russian_post_order_status' );
		
		$new_status_term = get_term_by( 'slug', sanitize_title( 'wc_russian_post_' . $new_status ), 'russian_post_order_status' );
		
		if ( ! $old_status_term ) {

			$old_status_term = new stdClass();
			$old_status_term->slug = 'new';
			$old_status_term->name = 'Новый заказ';
		}
		
		if ( ! $new_status_term ) {

			$term = wp_insert_term( ucwords( $new_status ), 'russian_post_order_status', array( 'slug' => 'wc_russian_post_' . $new_status ) );

			if ( is_array( $term ) ) {
				$new_status_term = get_term( $term['term_id'], 'russian_post_order_status' );
			}
		}

		if ( $new_status_term ) {
			
			wp_set_object_terms( $this->id, array( $new_status_term->slug ), 'russian_post_order_status', false );
			
			$old_status_term->slug = str_replace( 'wc_russian_post_', '', $old_status_term->slug );
			$new_status_term->slug = str_replace( 'wc_russian_post_', '', $new_status_term->slug );

			if ( $old_status_term->slug != $new_status_term->slug ) {
				
				do_action( 'wc_russian_post_order_status_' . $new_status_term->slug, $this->id );
				do_action( 'wc_russian_post_order_status_changed', $this->id, $old_status_term->slug, $new_status_term->slug );
				do_action( "wc_russian_post_order_status_{$old_status_term->slug}_to_{$new_status_term->slug}", $this->id );
				
				$this->add_order_note( sprintf( 'Статус заказа Почты России сменился с %1$s на %2$s. %3$s', $old_status_term->name, $new_status_term->name, $note ) );
				
				if ( 'completed' === $new_status_term->slug ) {
					$this->update_status( 'completed' );
				}

				$this->russian_post_status = $new_status_term->slug;
			}
		}
	}
	
	public function get_status_for_display( $status = '' ) {

		if ( ! $status ) {
			$status = $this->russian_post_status;
		}

		$status = get_term_by( 'slug', sanitize_title( 'wc_russian_post_' . $status ), 'russian_post_order_status' );
		
		if( $this->is_russian_post ) {
			if ( $status ) {
				return $status->name;
			} else {
				return 'Новый заказ';
			}
		} else {
			return __( 'N/A', 'woocommerce' );
		}
		
	}

	public function get_export_url() {
		return wp_nonce_url( admin_url( 'admin-ajax.php?action=wc_russian_post_export_order&order_id=' . $this->id ), 'wc_russian_post_export_order' );
	}
	
	public function get_remove_order_url() {
		return wp_nonce_url( admin_url( 'admin-ajax.php?action=wc_russian_post_remove_order&order_id=' . $this->id ), 'wc_russian_post_remove_order' );
	}

}
