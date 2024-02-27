<?php

namespace Woodev\Russian_Post\Data_Stores;

use Woodev\Russian_Post\Classes\Customer_Delivery_Point_Data;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Customer_Data_Store extends \Woodev\Russian_Post\Abstracts\Abstract_Customer_Data_Store {

	/**
	 * Internal meta type used to store user data.
	 *
	 * @var string
	 */
	protected $meta_type = 'user';

	/**
	 * @param Customer_Delivery_Point_Data $customer
	 *
	 * @return void
	 */
	public function read( &$customer ) {

		$customer->set_defaults();
		$props = ( array ) $customer->get_meta( $customer->get_object_type(), true, 'edit' );

		$customer->set_point_data( $props );
		$customer->read_meta_data();
		$customer->set_object_read( true );
	}

	public function create( &$customer ) {}

	/**
	 * @param Customer_Delivery_Point_Data $customer
	 *
	 * @return void
	 */
	public function update( &$customer ) {

		$data = $this->has_changes( $customer );

		if( $data ) {
			$customer->update_meta_data( $customer->get_object_type(), $data );
			$customer->save_meta_data();
			$customer->apply_changes();
		}

	}

	public function delete( &$customer, $args = array() ) {
		$customer->delete_meta_data( $customer->get_object_type() );
	}
}