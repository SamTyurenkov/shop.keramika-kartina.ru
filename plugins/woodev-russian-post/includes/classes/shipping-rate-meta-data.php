<?php

namespace Woodev\Russian_Post\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Shipping_Rate_Meta_Data {

	private $meta_data = array();

	public function __construct( \WC_Shipping_Rate $rate ) {
		$meta_data = $rate->get_meta_data();
		if( isset( $meta_data['wc_russian_post_rate'] ) ) {
			$this->meta_data = array_filter( $meta_data['wc_russian_post_rate'] );
		}
	}

	/**
	 * @return array
	 */
	public function get_meta_data() {
		return $this->meta_data;
	}

	private function get_meta_prop( $prop ) {
		if( isset( $this->meta_data[ $prop ] ) ) {
			return $this->meta_data[ $prop ];
		}

		return null;
	}

	/**
	 * @return string|null
	 */
	public function get_method_type() {
		return $this->get_meta_prop( 'method_type' );
	}

	/**
	 * @return \stdClass[]|null
	 */
	public function get_rate() {
		return $this->get_meta_prop( 'rate' );
	}

	/**
	 * @return Address_Normalize|null
	 */
	public function get_normalize_address() {
		return $this->get_meta_prop( 'normalize_address' );
	}
}