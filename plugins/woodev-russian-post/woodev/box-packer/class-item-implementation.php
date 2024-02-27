<?php

defined( 'ABSPATH' ) or exit;

if ( ! class_exists( 'Woodev_Packer_Item_Implementation' ) ) :

class Woodev_Packer_Item_Implementation implements Woodev_Box_Packer_Item {

	/** @var string */
	private $name;
	/** @var float */
	private $weight;
	/** @var float */
	private $height;
	/** @var float */
	private $width;
	/** @var float */
	private $length;
	/** @var float */
	private $volume;
	/** @var float */
	private $value;
	/** @var mixed */
	private $internal_data;
	/** @var @var WC_Product */
	private $product;

	/**
	 * Woodev_Packer_Item_Implementation constructor.
	 *
	 * @param float      $length .
	 * @param float      $width .
	 * @param float      $height .
	 * @param float      $weight .
	 * @param float      $money_value Item money value.
	 * @param null|mixed $internal_data .
	 */
	public function __construct( $length, $width, $height, $weight = 0.0, $money_value = 0.0, $internal_data = null ) {
		$dimensions = array( $length, $width, $height );
		sort( $dimensions );
		$this->length   = ( float ) $dimensions[2];
		$this->width    = ( float ) $dimensions[1];
		$this->height   = ( float ) $dimensions[0];
		$this->volume   = ( float ) ($width * $height * $length);
		$this->weight   = ( float ) $weight;
		$this->value    = ( float ) $money_value;
		$this->internal_data = $internal_data;

		if( is_array( $this->internal_data ) && isset( $this->internal_data['name'] ) ) {
			$this->name = $this->internal_data['name'];
		}
	}

	public function set_product( WC_Product $product ) {
		$this->product = $product;
	}

	public function has_name() {
		return ! empty( $this->name );
	}

	/**
	 * @return WC_Product|null
	 */
	public function get_product() {
		return $this->product;
	}

	public function get_name() {

		if( $this->get_product() ) {
			$this->name = $this->get_product()->get_name();
		}

		return $this->name;
	}

	public function get_volume() {
		return $this->volume;
	}

	public function get_height() {
		return $this->height;
	}

	public function get_width() {
		return $this->width;
	}

	public function get_length() {
		return $this->length;
	}

	public function get_weight() {
		return $this->weight;
	}

	public function get_value() {
		return $this->value;
	}

	public function get_internal_data() {
		return $this->internal_data;
	}
}

endif;
