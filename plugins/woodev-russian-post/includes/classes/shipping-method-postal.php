<?php

namespace Woodev\Russian_Post\Classes;

class Shipping_Method_Postal extends \Woodev\Russian_Post\Abstracts\Abstract_Shipping_Method {

	public function __construct( $instance_id = 0 ) {
		parent::__construct( $instance_id );

		$this->method_type          = 'postal';
		$this->id                   = 'wc_russian_post_postal';
		$this->method_title         = __( 'Russian Post - Postal Office (Woodev)', 'woocommerce-russian-post' );
		$this->method_description   = __( 'Shipping method via Russian Post to postal office', 'woocommerce-russian-post' );
		$this->title                = $this->get_option( 'title' );
	}

	protected function get_remote_rates( $params, $refresh = false ) {

		try {
			return wc_russian_post_shipping()->get_api()->get_pick_up_tariff_public( $params, $refresh );
		} catch ( \Woodev_Plugin_Exception $e ) {
			wc_russian_post_shipping()->log( $e->getMessage() );
			return false;
		}
	}

	protected function get_available_shipment_types() {
		$parcel_types = wc_russian_post_get_parcel_types();

		$available = array(
			'POSTAL_PARCEL',
			'ONLINE_PARCEL',
			'EMS_OPTIMAL',
			'PARCEL_CLASS_1',
			'ECOM_MARKETPLACE',
			'ECOM',
			'COMBINED',
			'SMALL_PACKET'
		);

		return array_intersect_key( $parcel_types, array_flip( $available ) );
	}
}