<?php

namespace Woodev\Russian_Post\Abstracts;

use Woodev\Russian_Post\Classes\Order;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

abstract class Abstract_Export_Order {

	/** @var Order */
	private $order;

	/** @var \stdClass|null */
	private $site_settings;

	public function __construct( Order $order ) {
		$this->order         = $order;
		$this->site_settings = wc_russian_post_shipping()->get_site_settings();
	}

	public function get_russian_post_order() {
		return $this->order;
	}

	/**
	 * Returns all site settings from user account profile
	 *
	 * @return false|\stdClass|\stdClass[]|null
	 */
	public function get_site_settings() {
		return $this->site_settings;
	}

	/**
	 * @param string $setting The name of the desired option
	 * @param mixed  $default Default value if option is not exists
	 *
	 * @return mixed|null
	 */
	public function get_site_setting( $setting, $default = null ) {

		$settings = $this->get_site_settings();

		if ( isset( $settings->$setting ) ) {
			return $settings->$setting;
		}

		return $default;
	}

	public function get_total_weight( $unit = 'g' ) {

		$weight = 0;

		/** @var \WC_Order_Item_Product $item */
		foreach ( $this->order->get_items() as $item ) {

			$product  = $item->get_product();
			$quantity = $item->get_quantity();

			if ( ! $product || ! $product->needs_shipping() ) {
				continue;
			}

			$product_weight = wc_get_weight( $product->get_weight(), $unit );

			if ( $product_weight > 0 ) {
				$weight += $product_weight * $quantity;
			} else {
				$weight += intval( wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_weight', 500 ) ) * $quantity;
			}


		}

		return $weight;
	}

	/**
	 * @return \WC_Order_Item_Shipping|null
	 */
	public function get_shipping_item() {
		return $this->order->get_shipping_item();
	}

	public function get_shipping_rate_meta( $name, $default = null ) {
		return $this->order->get_shipping_rate_meta( $name, $default );
	}

	public function get_shipment_type() {

		$rate          = $this->get_shipping_rate_meta( 'rate' );
		$shipment_type = $rate->shipment_type ?: $rate->tariff_id;

		if ( $this->get_russian_post_order()->is_postamat() ) {
			$delivery_point = $this->get_shipping_rate_meta( 'delivery_point' );
			if ( $delivery_point && isset( $delivery_point['mail_type'] ) && in_array( $delivery_point['mail_type'], array_keys( wc_russian_post_get_parcel_types() ), true ) && $shipment_type !== $delivery_point['mail_type'] ) {
				$shipment_type = $delivery_point['mail_type'];
			}
		}

		return $shipment_type;
	}

	public function order_needs_payment() {
		return $this->order->get_payment_method() === 'cod';
	}

	public function order_needs_insurance_cost() {
		//we always have insurance if the order needs payment
		return apply_filters( 'wc_russian_post_order_needs_insurance_cost', $this->order_needs_payment(), $this );
	}

	public function is_international_shipping() {
		$country_code = $this->get_russian_post_order()->get_shipping_country() ?: $this->get_russian_post_order()->get_billing_country();

		return ( 'RU' !== $country_code || \Woodev_Helper::str_ends_with( wc_strtoupper( $this->get_shipment_type() ), '_INT' ) || 'SMALL_PACKET' === wc_strtoupper( $this->get_shipment_type() ) );
	}

	public function is_ecom() {
		return in_array( wc_strtoupper( $this->get_shipment_type() ), array(
			'ECOM',
			'ECOM_MARKETPLACE',
			'ECOM_MARKETPLACE_COURIER'
		), true );
	}

	/**
	 * Returns parcel mail category
	 *
	 * @see https://otpravka.pochta.ru/specification#/enums-base-mail-category
	 *
	 * @return string
	 */
	public function get_mail_category() {

		$mail_category = $this->order_needs_payment() ? 'WITH_DECLARED_VALUE_AND_CASH_ON_DELIVERY' : ( $this->is_ecom() ? 'WITH_DECLARED_VALUE' : 'ORDINARY' );

		if ( ! $this->is_ecom() && $this->get_russian_post_order()->is_postamat() ) {
			$mail_category = sprintf( 'COMBINED_%s', $mail_category );
		}

		if ( $this->is_ecom() ) {
			$mail_category = 'WITH_DECLARED_VALUE';
		}

		return apply_filters( 'wc_russian_mail_category', $mail_category, $this );

	}

	/**
	 * @return array
	 */
	abstract public function get_export_data();
}