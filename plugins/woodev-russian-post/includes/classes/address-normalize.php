<?php

namespace Woodev\Russian_Post\Classes;

defined( 'ABSPATH' ) or exit;

class Address_Normalize {

	/** @var string $id Request ID */
	private $id;

	/** @var string $area Area string */
	private $area;

	/** @var string $building Building (part of building) */
	private $building;

	/** @var string $corpus Corpus (part of building) */
	private $corpus;

	/** @var string $hotel Hotel name */
	private $hotel;

	/** @var string $house Number of building (part of address) */
	private $house;

	/** @var string $index Postcode (part of address) */
	private $index;

	/** @var string $letter Letter number or name (part of building) */
	private $letter;

	/** @var string $location Domestic location (part of address) */
	private $location;

	/** @var string $place City or village name (part of address) */
	private $place;

	/** @var string $quality_code Quality address code */
	private $quality_code;

	/** @var string $region State or district name */
	private $region;

	/** @var string $room Room number (part of address) */
	private $room;

	/** @var string $street Street name (part of address) */
	private $street;

	/** @var string $validation_code Validation code */
	private $validation_code;

	/** @var string $address_guid Address GUID */
	private $address_guid;

	/** @var string $place_guid Place GUID */
	private $place_guid;

	/** @var string $region_guid Region GUID */
	private $region_guid;

	/** @var string $street_guid Street GUID */
	private $street_guid;

	/**
	 * @param \stdClass[] $entities
	 */
	public function __construct( $entities = array() ) {

		foreach ( ( array ) $entities as $entity ) foreach ( get_object_vars( $entity ) as $key => $value ) {
			$prop_name = str_replace( '-', '_', $key );
			if( ! is_callable( array( $this, "set_{$prop_name}" ) ) ) continue;
			$this->{"set_{$prop_name}"}( $value );
		}
	}

	/**
	 * It checks, whether address is allowed for delivery or not
	 * @return bool
	 */
	public function is_usable() {
		return in_array( wc_strtoupper( $this->get_quality_code() ), array( 'GOOD', 'POSTAL_BOX', 'ON_DEMAND', 'UNDEF_05' ), true ) && in_array( wc_strtoupper( $this->get_validation_code() ), array( 'VALIDATED', 'OVERRIDDEN', 'CONFIRMED_MANUALLY' ), true );
	}

	/**
	 * @param string $separator
	 * @param boolean $strict
	 *
	 * @return string|void
	 */
	public function get_formatted_address( $separator = ', ', $strict = false ) {

		if( $strict && ! $this->is_usable() ) {
			return;
		}

		return implode( $separator, array_filter( array(
			$this->get_index(),
			$this->get_place(),
			$this->get_region(),
			$this->get_area(),
			$this->get_location(),
			$this->get_hotel(),
			$this->get_street(),
			$this->get_house(),
			$this->get_building(),
			$this->get_letter(),
			$this->get_corpus(),
			$this->get_room()
		) ) );
	}

	/**
	 * @param string $separator
	 * @param boolean $strict
	 *
	 * @return string|void
	 */
	public function get_short_formatted_address( $separator = ', ', $strict = false ) {

		if( $strict && ! $this->is_usable() ) {
			return;
		}

		return implode( $separator, array_filter( array(
			$this->get_hotel(),
			$this->get_street(),
			$this->get_house(),
			$this->get_building(),
			$this->get_letter(),
			$this->get_corpus(),
			$this->get_room()
		) ) );
	}

	public function get_guids() {
		return array_filter( array(
			'address'   => $this->get_address_guid(),
			'place'     => $this->get_place_guid(),
			'region'    => $this->get_region_guid(),
			'street'    => $this->get_street_guid()
		) );
	}

	/**
	 * @return string
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * @param string $id
	 */
	public function set_id( $id ) {
		$this->id = $id;
	}

	/**
	 * @return string
	 */
	public function get_area() {
		return $this->area;
	}

	/**
	 * @param string $area
	 */
	public function set_area( $area ) {
		$this->area = $area;
	}

	/**
	 * @return string
	 */
	public function get_building() {
		return $this->building;
	}

	/**
	 * @param string $building
	 */
	public function set_building( $building ) {
		$this->building = $building;
	}

	/**
	 * @return string
	 */
	public function get_corpus() {
		return $this->corpus;
	}

	/**
	 * @param string $corpus
	 */
	public function set_corpus( $corpus ) {
		$this->corpus = $corpus;
	}

	/**
	 * @return string
	 */
	public function get_hotel() {
		return $this->hotel;
	}

	/**
	 * @param string $hotel
	 */
	public function set_hotel( $hotel ) {
		$this->hotel = $hotel;
	}

	/**
	 * @return string
	 */
	public function get_house() {
		return $this->house;
	}

	/**
	 * @param string $house
	 */
	public function set_house( $house ) {
		$this->house = $house;
	}

	/**
	 * @return string
	 */
	public function get_index() {
		return $this->index;
	}

	/**
	 * @param string $index
	 */
	public function set_index( $index ) {
		$this->index = $index;
	}

	/**
	 * @return string
	 */
	public function get_letter() {
		return $this->letter;
	}

	/**
	 * @param string $letter
	 */
	public function set_letter( $letter ) {
		$this->letter = $letter;
	}

	/**
	 * @return string
	 */
	public function get_location() {
		return $this->location;
	}

	/**
	 * @param string $location
	 */
	public function set_location( $location ) {
		$this->location = $location;
	}

	/**
	 * @return string
	 */
	public function get_place() {
		return $this->place;
	}

	/**
	 * @param string $place
	 */
	public function set_place( $place ) {
		$this->place = $place;
	}

	/**
	 * @return string
	 */
	public function get_quality_code() {
		return $this->quality_code;
	}

	/**
	 * @param string $quality_code
	 */
	public function set_quality_code( $quality_code ) {
		$this->quality_code = $quality_code;
	}

	/**
	 * @return string
	 */
	public function get_region() {
		return $this->region;
	}

	/**
	 * @param string $region
	 */
	public function set_region( $region ) {
		$this->region = $region;
	}

	/**
	 * @return string
	 */
	public function get_room() {
		return $this->room;
	}

	/**
	 * @param string $room
	 */
	public function set_room( $room ) {
		$this->room = $room;
	}

	/**
	 * @return string
	 */
	public function get_street() {
		return $this->street;
	}

	/**
	 * @param string $street
	 */
	public function set_street( $street ) {
		$this->street = $street;
	}

	/**
	 * @return string
	 */
	public function get_validation_code() {
		return $this->validation_code;
	}

	/**
	 * @param string $validation_code
	 */
	public function set_validation_code( $validation_code ) {
		$this->validation_code = $validation_code;
	}

	/**
	 * @return string
	 */
	public function get_address_guid() {
		return $this->address_guid;
	}

	/**
	 * @param string $address_guid
	 */
	public function set_address_guid( $address_guid ) {
		$this->address_guid = $address_guid;
	}

	/**
	 * @return string
	 */
	public function get_place_guid() {
		return $this->place_guid;
	}

	/**
	 * @param string $place_guid
	 */
	public function set_place_guid( $place_guid ) {
		$this->place_guid = $place_guid;
	}

	/**
	 * @return string
	 */
	public function get_region_guid() {
		return $this->region_guid;
	}

	/**
	 * @param string $region_guid
	 */
	public function set_region_guid( $region_guid ) {
		$this->region_guid = $region_guid;
	}

	/**
	 * @return string
	 */
	public function get_street_guid() {
		return $this->street_guid;
	}

	/**
	 * @param string $street_guid
	 */
	public function set_street_guid( $street_guid ) {
		$this->street_guid = $street_guid;
	}
}