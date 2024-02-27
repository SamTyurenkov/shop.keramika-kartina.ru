<?php

namespace Woodev\Russian_Post\Classes\Export_Order;

use Woodev\Russian_Post\Abstracts\Abstract_Export_Order;
use Woodev\Russian_Post\Classes\Address_Normalize;
use Woodev\Russian_Post\Classes\Install_Module;
use Woodev\Russian_Post\Classes\Uninstall_Module;
use Woodev\Russian_Post\Interfaces\Orders_Public;
use Woodev\Russian_Post\Interfaces\Orders_Public_User;
use Woodev\Russian_Post\Interfaces\Orders_Public_Order;

if( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Widget extends Abstract_Export_Order implements Orders_Public, Orders_Public_Order, Orders_Public_User {

	public function get_api_order_id() {
		return $this->get_russian_post_order()->get_order_number();
	}

	public function get_api_order_type() {
		return ( new Install_Module() )->get_cms_type();
	}

	public function get_financial_status() {
		return $this->order_needs_payment() ? 'unpaid' : 'paid';
	}

	public function get_fio_plugin() {
		return $this->get_russian_post_order()->get_formatted_billing_full_name();
	}

	public function get_insr_value_plugin() {
		return $this->order_needs_payment() ? strval( $this->get_russian_post_order()->get_order_subtotal() * 100 ) : 0;
	}

	public function get_order_lines() {

		$lines = array();

		/** @var \WC_Order_Item_Product $item */
		foreach ( $this->get_russian_post_order()->get_items() as $item ) {
			if( ! $item->get_product()->needs_shipping() ) {
				continue;
			}
			$lines[] = new Item( $item );
		}

		return $lines;
	}

	public function get_payment_plugin() {
		return $this->order_needs_payment() ? strval( $this->get_russian_post_order()->get_order_subtotal() * 100 ) : 0;
	}

	public function get_phone_plugin() {
		return wc_format_phone_number( $this->get_russian_post_order()->get_billing_phone() );
	}

	public function get_shipment_address_plugin() {

		if( 'postal' == $this->get_shipping_rate_meta( 'method_type' ) ) {
			$delivery_point = $this->get_shipping_rate_meta( 'delivery_point' );
			/** @var Address_Normalize $normalize_address */
			$normalize_address = $delivery_point['normalize_address'];
		} else {
			/** @var Address_Normalize $normalize_address */
			$normalize_address = $this->get_shipping_rate_meta( 'normalize_address' );
		}

		return $normalize_address->get_formatted_address();
	}

	public function get_shipment_index_plugin() {

		if( 'postal' == $this->get_shipping_rate_meta( 'method_type' ) ) {
			$delivery_point = $this->get_shipping_rate_meta( 'delivery_point' );
			$postcode       = $delivery_point['code'];
		} else {
			/** @var Address_Normalize $address */
			$address  = $this->get_shipping_rate_meta( 'normalize_address' );
			$postcode = $address->get_index();
		}

		if( empty( $postcode ) ) {
			$postcode = $this->get_russian_post_order()->get_billing_postcode();
		}

		return $postcode;
	}

	/*public function get_shipment_type() {
		return $this->get_shipping_rate_meta( 'method_type' );
	}*/

	public function get_shop_delivery_cost() {
		return intval( $this->get_russian_post_order()->get_shipping_total() ) * 100;
	}

	public function get_weight() {
		return $this->get_total_weight();
	}

	public function get_cms_version() {
		return ( new Install_Module() )->get_cms_version();
	}

	public function get_guid_id() {
		return ( new Install_Module() )->get_guid_id();
	}

	public function get_guid_key() {
		return ( new Uninstall_Module() )->get_guid_key();
	}

	public function get_user() {
		return array(
			'guid_id'     => $this->get_guid_id(),
			'guid_key'    => $this->get_guid_key(),
			'cms_version' => $this->get_cms_version()
		);
	}

	public function get_order_items() {
		$items = array();

		/** @var Item $item */
		foreach ( $this->get_order_lines() as $item ) {
			$items[] = array(
				'api_order_line_id'  => $item->get_api_order_line_id(),
				'api_order_type'     => $item->get_api_order_type(),
				'stock_keeping_unit' => $item->get_code(),
				'country_code'       => $item->get_country_code(),
				'customs_code'       => $item->get_customs_code(),
				'quantity'           => $item->get_quantity(),
				'title'              => $item->get_title(),
				'trade_mark'         => $item->get_trade_mark(),
				'tnved_code'         => $item->get_tnved_code(),
				'value'              => $item->get_value(),
				'vat_rate'           => $item->get_vat_rate(),
				'weight'             => $item->get_weight(),
				'dimensions'         => array(
					'length' => $item->get_length(),
					'width'  => $item->get_width(),
					'height' => $item->get_height()
				)
			);
		}

		return $items;
	}

	public function get_order() {
		return array(
			'api_order_id'            => $this->get_api_order_id(),
			'api_order_type'          => $this->get_api_order_type(),
			'financial_status'        => $this->get_financial_status(),
			'fio_plugin'              => $this->get_fio_plugin(),
			'insr_value_plugin'       => $this->get_insr_value_plugin(),
			'payment_plugin'          => $this->get_payment_plugin(),
			'phone_plugin'            => $this->get_phone_plugin(),
			'shipment_address_plugin' => $this->get_shipment_address_plugin(),
			'shipment_index_plugin'   => $this->get_shipment_index_plugin(),
			'shipment_type'           => $this->get_shipment_type(),
			'shop_delivery_cost'      => $this->get_shop_delivery_cost(),
			'weight'                  => $this->get_weight(),
			'order_lines'             => $this->get_order_items()
		);
	}

	public function get_export_data() {
		return apply_filters( 'wc_russian_post_order_widget_export_data', array(
			'user'  => $this->get_user(),
			'order' => $this->get_order()
		), $this->get_russian_post_order(), $this );
	}
}