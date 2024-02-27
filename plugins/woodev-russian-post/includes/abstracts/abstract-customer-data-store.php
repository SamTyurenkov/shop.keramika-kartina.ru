<?php

namespace Woodev\Russian_Post\Abstracts;

use Woodev\Russian_Post\Classes\Customer_Delivery_Point_Data;

defined( 'ABSPATH' ) || exit;

class Abstract_Customer_Data_Store extends \WC_Data_Store_WP implements \WC_Object_Data_Store_Interface {

	/**
	 * @param $customer
	 */
	public function create( &$customer ) {
		// TODO: Implement create() method.
	}

	/**
	 * @param $customer
	 */
	public function read( &$customer ) {
		// TODO: Implement read() method.
	}

	/**
	 * @param $customer
	 */
	public function update( &$customer ) {
		// TODO: Implement update() method.
	}

	/**
	 * @param Customer_Delivery_Point_Data $customer
	 * @param array $args
	 *
	 * @return void
	 */
	public function delete( &$customer, $args = array() ) {
		// TODO: Implement delete() method.
	}

	/**
	 * @param Customer_Delivery_Point_Data $customer
	 *
	 * @return array|null
	 */
	public function has_changes( $customer ) {

		$changes = $customer->get_changes();

		if( $changes && array_intersect_key( $customer->get_data_keys(), array_keys( $changes ) ) ) {
			return $customer->get_point_data( 'edit' );
		}

		return null;
	}
}