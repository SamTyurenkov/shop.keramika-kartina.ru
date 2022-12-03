<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WC_Russian_Post_Delivery_points {

	public static function get_delivery_points() {
		
		$points = array();
		
		try {
		
			$points = wc_russian_post_shipping()->get_api()->get_all_delivery_points();
		
		} catch( Woodev_API_Exception $e ) {
				
			wc_russian_post_shipping()->log( $e->getMessage() );
		}
		
		return $points;
	}
	
	public static function insert_point( $point = array() ) {
		
		if( empty( $point ) || ! is_array( $point) || ! isset( $point['city_name'] ) || empty( $point['city_name'] ) ) {
			return false;
		}
		
		global $wpdb;
		
		$table_name = sprintf( '%s%s%s', $wpdb->prefix, wc_russian_post_shipping()->get_method_id(), '_delivery_points' );
		
		$point = array(
			'city_name'			=> $point['city_name'],
			'point_id'			=> $point['point_id'],
			'point_index'		=> $point['point_index'],
			'type'				=> $point['type'],
			'work_time'			=> $point['work_time'],
			'card_enable'		=> $point['card_enable'],
			'cash_enable'		=> $point['cash_enable'],
			'address'			=> $point['address'],
			'lat'				=> $point['lat'],
			'lng'				=> $point['lng'],
			'weight_limit'		=> $point['weight_limit'],
			'dimension_limit'	=> $point['dimension_limit'],
			'route'				=> $point['route']
		);
			
		$result = $wpdb->insert(
			$table_name,
			$point,
			array( '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s' )
		);
		
		return false !== $result;
	}
	
	public static function update_points() {
		
		foreach( self::get_delivery_points() as $point ) {
			
			$point = array(
				'city_name'			=> $point['city_name'],
				'point_id'			=> $point['id'],
				'point_index'		=> $point['index'],
				'type'				=> $point['type'],
				'work_time'			=> $point['work_time'],
				'card_enable'		=> $point['payment']['card'],
				'cash_enable'		=> $point['payment']['cash'],
				'address'			=> $point['address'],
				'lat'				=> $point['location']['lat'],
				'lng'				=> $point['location']['lng'],
				'weight_limit'		=> $point['weight_limit'] ?? null,
				'dimension_limit'	=> $point['dimension_limit'] ?? null,
				'route'				=> $point['route'] ?? null
			);
			
			if( ! self::insert_point( $point ) ) {
				continue;
			}
		}
	}
}