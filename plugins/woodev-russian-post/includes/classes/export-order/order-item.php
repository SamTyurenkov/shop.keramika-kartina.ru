<?php

namespace Woodev\Russian_Post\Classes\Export_Order;

use Woodev\Russian_Post\Classes\Install_Module;
use Woodev\Russian_Post\Interfaces\Orders_Public_Order_Line;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Item implements Orders_Public_Order_Line {

	/** @var \WC_Order_Item_Product */
	private $item;

	public function __construct( \WC_Order_Item_Product $item ) {
		$this->item = $item;
	}

	public function get_api_order_line_id() {
		return $this->item->get_product_id();
	}

	public function get_api_order_type() {
		return ( new Install_Module() )->get_cms_type();
	}

	public function get_code() {
		$sku = $this->item->get_product()->get_sku();

		return $sku ?: strval( $this->item->get_product()->get_id() );
	}

	public function get_country_code() {
		return 643; //Temporary, it will be static value. The code 643 is the code of the Russian Federation.
	}

	public function get_customs_code() {
		return null;
	}

	public function get_quantity() {
		return $this->item->get_quantity();
	}

	public function get_title() {
		return $this->item->get_name();
	}

	public function get_trade_mark() {
		// TODO: Implement get_trade_mark() method.
	}

	public function get_tnved_code() {
		return $this->item->get_meta( '_tnved_code' );
	}

	public function get_value() {
		return intval( $this->item->get_order()->get_item_total( $this->item ) ) * 100;
	}

	public function get_vat_rate() {
		return intval( wc_russian_post_shipping()->get_settings_instance()->get_option( 'vat_rate', '-1' ) );
	}

	public function get_weight( $unit = 'g' ) {
		$weight = wc_get_weight( floatval( $this->item->get_product()->get_weight() ), $unit );
		if ( $weight > 0 ) {
			return $weight;
		} else {
			return wc_get_weight( wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_weight', 500 ), $unit, 'g' );
		}
	}

	/**
	 * Returns the product length dimension.
	 *
	 * @param string $unit Unit to convert to.
	 *
	 * @return float
	 */
	public function get_length( $unit = 'cm' ) {
		$length = wc_get_dimension( floatval( $this->item->get_product()->get_length() ), $unit );
		$default = wc_get_dimension( wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_length', 150 ), $unit, 'mm' );
		return $length ?: $default;
	}

	/**
	 * Returns the product width dimension.
	 *
	 * @param string $unit Unit to convert to.
	 *
	 * @return float
	 */
	public function get_width( $unit = 'cm' ) {
		$width = wc_get_dimension( floatval( $this->item->get_product()->get_width() ), $unit );
		$default = wc_get_dimension( wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_width', 150 ), $unit, 'mm' );
		return $width ?: $default;
	}

	/**
	 * Returns the product height dimension.
	 *
	 * @param string $unit Unit to convert to.
	 *
	 * @return float
	 */
	public function get_height( $unit = 'cm' ) {
		$height = wc_get_dimension( floatval( $this->item->get_product()->get_height() ), $unit );
		$default = wc_get_dimension( wc_russian_post_shipping()->get_settings_instance()->get_option( 'minimum_height', 150 ), $unit, 'mm' );
		return $height ?: $default;
	}
}