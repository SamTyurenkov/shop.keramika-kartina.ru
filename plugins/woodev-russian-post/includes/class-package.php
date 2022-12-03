<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class WD_Russain_Post_Package {

	protected $package = array();
	
	private $dimension = array(
		'width' => 0,
		'height' => 0,
		'length' => 0,
		'weight' => 0
	);

	public function __construct( $package = array() ) {
		$this->package = $package;
	}

	public function set_minimum_dimension( $width = 0, $height = 0, $length = 0, $weight = 0 ) {
		$this->dimension['width'] = $width;
		$this->dimension['height'] = $height;
		$this->dimension['length'] = $length;
		$this->dimension['weight'] = $weight;
	}

	protected function get_package_data() {
		$count  = 0;
		$height = array();
		$width  = array();
		$length = array();
		$weight = array();

		foreach ( $this->package['contents'] as $item_id => $values ) {
			$product = $values['data'];
			$qty     = $values['quantity'];

			if ( $qty > 0 && $product->needs_shipping() ) {

				$_height = wc_get_dimension( (float) $product->get_length(), 'cm' );
				$_width  = wc_get_dimension( (float) $product->get_width(), 'cm' );
				$_length = wc_get_dimension( (float) $product->get_height(), 'cm' );
				$_weight = wc_get_weight( (float) $product->get_weight(), 'g' );
				
				$_height = $_height > 0 ? $_height : $this->dimension['height'];
				$_width  = $_width > 0 ? $_width : $this->dimension['width'];
				$_length = $_length > 0 ? $_length : $this->dimension['length'];
				$_weight = $_weight > 0 ? $_weight : $this->dimension['weight'];

				$height[ $count ] = $_height;
				$width[ $count ]  = $_width;
				$length[ $count ] = $_length;
				$weight[ $count ] = $_weight;

				if ( $qty > 1 ) {
					$n = $count;
					for ( $i = 0; $i < $qty; $i++ ) {
						$height[ $n ] = $_height;
						$width[ $n ]  = $_width;
						$length[ $n ] = $_length;
						$weight[ $n ] = $_weight;
						$n++;
					}
					$count = $n;
				}

				$count++;
			}
		}

		return array(
			'height' => array_values( $height ),
			'length' => array_values( $length ),
			'width'  => array_values( $width ),
			'weight' => array_sum( $weight ),
		);
	}


	protected function cubage_total( $height, $width, $length ) {
		$all         = array();
		$total       = 0;
		$total_items = count( $height );

		for ( $i = 0; $i < $total_items; $i++ ) {
			$all[ $i ] = $height[ $i ] * $width[ $i ] * $length[ $i ];
		}

		foreach ( $all as $value ) {
			$total += $value;
		}

		return $total;
	}


	protected function get_max_values( $height, $width, $length ) {
		$find = array(
			'height' => max( $height ),
			'width'  => max( $width ),
			'length' => max( $length ),
		);

		return $find;
	}


	protected function calculate_root( $height, $width, $length, $max_values ) {
		$cubage_total = $this->cubage_total( $height, $width, $length );
		$root         = 0;
		$biggest      = max( $max_values );

		if ( 0 !== $cubage_total && 0 < $biggest ) {
			$division = $cubage_total / $biggest;
			$root = round( sqrt( $division ), 1 );
		}

		return $root;
	}
	
	protected function calculate_cubic( $height, $width, $length ) {
		$cubage_total = $this->cubage_total( $height, $width, $length );
		return round( pow( $cubage_total, 1/3 ), 1 );
	}

	protected function get_cubage( $height, $width, $length ) {
		$cubage     = array();
		$max_values = $this->get_max_values( $height, $width, $length );
		$root       = $this->calculate_root( $height, $width, $length, $max_values );
		$greatest   = array_search( max( $max_values ), $max_values, true );
		$cubic      = $this->calculate_cubic( $height, $width, $length );

		if( $cubic > max( $max_values ) ) {
			$cubage = array(
                'height' => $cubic,
                'width'  => $cubic,
                'length' => $cubic,
            );
		} else {
			
			switch ( $greatest ) {
				case 'height' :
					$cubage = array(
						'height' => max( $height ),
						'width'  => max( $width ) > max( $length ) ? max( $width ) : array_sum( $width ),
						'length' => max( $length ) > max( $width ) ? max( $length ) : array_sum( $length )
					);
					break;
				case 'width' :
					$cubage = array(
						'height' => max( $height ) > max( $length ) ? max( $height ) : array_sum( $height ),
						'width'  => max( $width ),
						'length' => max( $length ) > max( $height ) ? max( $length ) : array_sum( $length ),
					);
					break;
				case 'length' :
					$cubage = array(
						'height' => max( $height ) > max( $width ) ? max( $height ) : array_sum( $height ),
						'width'  => max( $width ) > max( $height ) ? max( $width ) : array_sum( $width ),
						'length' => max( $length ),
					);
					break;
				default :
					$cubage = array(
						'height' => 0,
						'width'  => 0,
						'length' => 0,
					);
					break;
			}
		}

		return $cubage;
	}


	public function get_data() {
		$data = $this->get_package_data();

		if ( ! empty( $data['height'] ) && ! empty( $data['width'] ) && ! empty( $data['length'] ) ) {
			$cubage = $this->get_cubage( $data['height'], $data['width'], $data['length'] );
		} else {
			$cubage = array(
				'height' => 0,
				'width'  => 0,
				'length' => 0,
			);
		}

		return array(
			'height' => $cubage['height'],
			'width'  => $cubage['width'],
			'length' => $cubage['length'],
			'weight' => $data['weight']
		);
	}
}