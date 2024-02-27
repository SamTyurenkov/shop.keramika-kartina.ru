<?php

namespace Woodev\Russian_Post\Classes;

class Shipping_Method_Courier extends \Woodev\Russian_Post\Abstracts\Abstract_Shipping_Method {

	public function __construct( $instance_id = 0 ) {
		parent::__construct( $instance_id );

		$this->method_type          = 'courier';
		$this->id                   = 'wc_russian_post_courier';
		$this->method_title         = __( 'Russian Post - Courier (Woodev)', 'woocommerce-russian-post' );
		$this->method_description   = __( 'Shipping method via Russian Post a courier to door', 'woocommerce-russian-post' );
		$this->title                = $this->get_option( 'title' );
	}

	protected function get_remote_rates( $params, $refresh = false ) {

		try {
			return wc_russian_post_shipping()->get_api()->get_courier_tariff_public( $params, $refresh );
		} catch ( \Woodev_Plugin_Exception $e ) {
			wc_russian_post_shipping()->log( $e->getMessage() );
			return false;
		}
	}

	protected function get_available_shipment_types() {
		$parcel_types = wc_russian_post_get_parcel_types();
		$available = array(
			'ONLINE_COURIER',
			'EMS',
			'BUSINESS_COURIER',
			'BUSINESS_COURIER_ES',
			'ECOM_MARKETPLACE_COURIER'
		);

		return array_intersect_key( $parcel_types, array_flip( $available ) );
	}
}