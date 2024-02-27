<?php

namespace Woodev\Russian_Post\Data_Stores;

use Woodev\Russian_Post\Classes\Customer_Delivery_Point_Data;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Customer_Data_Store_Session extends \Woodev\Russian_Post\Abstracts\Abstract_Customer_Data_Store {
	/**
	 * @param Customer_Delivery_Point_Data $customer
	 *
	 * @return void
	 */
	public function read( &$customer ) {
		$customer->set_defaults();

		$props = WC()->session->get( $customer->get_object_type(), array() );

		$customer->set_point_data( $props );
		$customer->set_object_read( true );
	}

	/**
	 * @param Customer_Delivery_Point_Data $customer
	 *
	 * @return void
	 */
	public function create( &$customer ) {
		$data = $this->has_changes( $customer );
		if( $data ) {
			WC()->session->set( $customer->get_object_type(), $data );
		}
	}

	public function update( &$customer ) {}

	public function delete( &$customer, $args = array() ) {
		WC()->session->set( $customer->get_object_type(), null );
	}
}