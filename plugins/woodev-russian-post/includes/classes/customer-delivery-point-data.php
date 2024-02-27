<?php

namespace Woodev\Russian_Post\Classes;

defined( 'ABSPATH' ) || exit;

class Customer_Delivery_Point_Data extends \WC_Data {

	/**
	 * Stores customer data.
	 *
	 * @var string[]
	 */
	protected $data = array(
		'point_id'          => null,
		'box_size'          => null,
		'type'              => null,
		'mail_type'         => null,
		'code'              => null,
		'postal_code'       => null,
		'fias'              => null,
		'city'              => null,
		'region'            => null,
		'original_address'  => null,
		'normalize_address' => null
	);

	/**
	 * This is the name of this object type.
	 *
	 * @var string
	 */
	protected $object_type = 'wc_russian_post_customer_delivery_point';

	/**
	 * Stores meta in cache for future reads.
	 *
	 * A group must be set to enable caching.
	 * @var string
	 */
	protected $cache_group = 'customer_delivery_point';

	/**
	 * @param self|int $customer       Customer ID or data.
	 * @throws \Exception If customer cannot be read/found and $data is set.
	 */
	public function __construct( $customer = 0 ) {
		parent::__construct( $customer );

		if ( $customer instanceof self ) {
			$this->set_id( absint( $customer->get_id() ) );
		} elseif ( is_numeric( $customer ) && $customer > 0 ) {
			$this->set_id( $customer );
		}

		$this->data_store = \WC_Data_Store::load( 'customer_delivery_point' );

		if( $this->get_id() ) {
			$this->data_store->read( $this );
		} else {
			$this->set_id( 0 );
			$this->set_object_read( true );
		}

		if( isset( WC()->session ) && ! $this->get_id() ) {
			$this->data_store = \WC_Data_Store::load( 'customer_delivery_point_session' );
			$this->data_store->read( $this );
		}
	}

	public function get_object_type() {
		return $this->object_type;
	}

	/**
	 * @return string[]
	 */
	public function get_point_data( $context = 'view' ) {
		return array(
			'point_id'          => $this->get_point_id( $context ),
			'box_size'          => $this->get_box_size( $context ),
			'type'              => $this->get_type( $context ),
			'mail_type'         => $this->get_mail_type( $context ),
			'code'              => $this->get_code( $context ),
			'postal_code'       => $this->get_postal_code( $context ),
			'fias'              => $this->get_fias( $context ),
			'city'              => $this->get_city( $context ),
			'region'            => $this->get_region( $context ),
			'original_address'  => $this->get_original_address( $context ),
			'normalize_address' => $this->get_normalize_address( $context )
		);
	}

	/**
	 * @param array $data {
	 *      Array of parameters.
	 *
	 *      @type int               $point_id Unique ID of the delivery point
	 *      @type string            $box_size Maximum allowed box size of postamat. It can be S,M,L or XL
	 *      @type string            $type Type of delivery point
	 *      @type string            $mail_type Mail type like as EMS, ONLINE_PARCEL e.t.c
	 *      @type string            $code Code of postamat. If it is type postal office then it equals postal code
	 *      @type string|int        $postal_code
	 *      @type string            $fias
	 *      @type string            $city
	 *      @type string            $region
	 *      @type string            $original_address
	 *      @type Address_Normalize $normalize_address
	 * }
	 *
	 * @return void
	 */
	public function set_point_data( $data = array() ) {
		$this->set_props( $data );
	}

	/**
	 * @param string|int $id
	 *
	 * @return void
	 */
	public function set_point_id( $id ) {
		$this->set_prop( 'point_id', $id );
	}

	public function get_point_id( $context = 'view' ) {
		return $this->get_prop( 'point_id', $context );
	}

	public function set_box_size( $size ) {
		$this->set_prop( 'box_size', $size );
	}

	public function get_box_size( $context = 'view' ) {
		return $this->get_prop( 'box_size', $context );
	}

	/**
	 * @param string $type
	 *
	 * @throws \Exception
	 */
	public function set_type( $type ) {

		if( ! in_array( wc_strtolower( $type ), array( 'postamat', 'russian_post' ), true ) ) {
			throw new \Exception( 'Incorrect delivery point type provided' );
		}

		$this->set_prop( 'type', $type );
	}

	public function get_type( $context = 'view' ) {
		return $this->get_prop( 'type', $context );
	}

	public function set_mail_type( $type ) {
		if( ! in_array( wc_strtoupper( $type ), array_keys( wc_russian_post_get_parcel_types() ), true ) ) {
			throw new \Exception( 'Incorrect mail type provided' );
		}

		$this->set_prop( 'mail_type', $type );
	}

	public function get_mail_type( $context = 'view' ) {
		return $this->get_prop( 'mail_type', $context );
	}

	public function set_code( $code ) {
		$this->set_prop( 'code', $code );
	}

	public function get_code( $context = 'view' ) {
		return $this->get_prop( 'code', $context );
	}

	public function set_postal_code( $code ) {
		$this->set_prop( 'postal_code', $code );
	}

	public function get_postal_code( $context = 'view' ) {
		return $this->get_prop( 'postal_code', $context );
	}

	public function set_fias( $fias ) {
		$this->set_prop( 'fias', $fias );
	}

	public function get_fias( $context = 'view' ) {
		return $this->get_prop( 'fias', $context );
	}

	public function set_city( $city ) {
		$this->set_prop( 'city', $city );
	}

	public function get_city( $context = 'view' ) {
		return $this->get_prop( 'city', $context );
	}

	public function set_region( $region ) {
		$this->set_prop( 'region', $region );
	}

	public function get_region( $context = 'view' ) {
		return $this->get_prop( 'region', $context );
	}

	public function set_original_address( $address ) {
		$this->set_prop( 'original_address', $address );
	}

	public function get_original_address( $context = 'view' ) {
		return $this->get_prop( 'original_address', $context );
	}

	public function set_normalize_address( Address_Normalize $address_normalize ) {
		$this->set_prop( 'normalize_address', $address_normalize );
	}

	/**
	 * @param string $context view or edit
	 *
	 * @return Address_Normalize|null
	 */
	public function get_normalize_address( $context = 'view' ) {
		return $this->get_prop( 'normalize_address', $context );
	}
}