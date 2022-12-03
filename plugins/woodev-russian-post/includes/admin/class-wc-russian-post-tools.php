<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class WC_Russian_Post_Tools {
	
	public function __construct() {
		add_filter( 'woocommerce_debug_tools', array( $this, 'get_tools' ) );
	}
	
	public function get_tools( $tools ) {
		$wc_russian_post_tools = array(
			'load_delivery_points' => array(
				'name'     => 'Пункты выдачи для ECOM (Почта РФ)',
				'button'   => 'Обновить пункты выдачи',
				'desc'     => 'Этот инструмент позволяет загрузить пункты выдачи заказов для ECOM РПО.',
				'callback' => array( $this, 'update_points_callback' ),
			)
		);

		return array_merge( $tools, $wc_russian_post_tools );
	}
	
	public function update_points_callback() {
		/*
		$points = array();
		
		try {
			
			$request = wc_russian_post_shipping()->get_api()->get_all_delivery_points();
			
			$points = $request;
		
		} catch( Woodev_API_Exception $e ) {
				
			$this->get_plugin()->log( $e->getMessage() );
		}
		
		if( ! empty( $points ) ) {
			return sprintf( '<pre>%s</pre>', wc_print_r( $points, true ) );
		}
		
		return 'fdsfdsfds';
		
		
		$background_jobs = wc_russian_post_shipping()->get_background_job_instance();

		$job = $background_jobs->create_job( array( 'action' => 'test', 'option' => 'value' ) );
		$background_jobs->dispatch();
		
		return wc_print_r( $background_jobs->get_jobs(), true );
		*/
		
		//$points = WC_Russian_Post_Delivery_points::get_delivery_points();
		
		$background_jobs = wc_russian_post_shipping()->get_background_job_instance();
		
		if( $background_jobs->is_queue_empty() ) {
			$this->close_http_connection();
			$points = WC_Russian_Post_Delivery_points::get_delivery_points();
			$job = $background_jobs->create_job( array( 'delivery_points' => $points ) );
		}

		//$job = $background_jobs->create_job( array( 'delivery_points' => $points ) );
		//$background_jobs->dispatch();
		
		
		foreach( $background_jobs->get_jobs() as $job ) {
			//$background_jobs->delete_job( $job );
		}
		
		$test_url = add_query_arg( array( 'action' => 'woodev_wc_russian_post_job' ), admin_url( 'admin-ajax.php' ) );
		$result   = wp_safe_remote_get( $test_url );
		$body     = ! is_wp_error( $result ) ? wp_remote_retrieve_body( $result ) : null;
		
		return wc_print_r( $background_jobs->get_jobs(), true );
	}
	
	protected function close_http_connection() {
		
		if ( session_id() ) {
			session_write_close();
		}

		wc_set_time_limit( 0 );
		
		if ( is_callable( 'fastcgi_finish_request' ) ) {
			fastcgi_finish_request();
		} else {
			
			if ( ! headers_sent() ) {
				header( 'Connection: close' );
			}
			
			@ob_end_flush();
			flush();
		}
	}
	/*
	public function load_easyway_points() {
		global $wpdb;

		if ( class_exists( 'WC_Logger' ) ) {
			$logger = new WC_Logger();
		} else {
			$logger = WC()->logger();

		}
		
		$logger->info( 'Процесс загрузки ПВЗ начался.', array( 'source' => 'load_easyway_points' ) );
		
		$response = woocommerce_easyway()->get_api()->get_all_points();
		
		if ( is_wp_error( $response ) ) {
			$logger->error( sprintf( 'Ошибка запроса: %s', $response->get_error_message() ), array( 'source' => 'load_easyway_points' ) );
		} else {
			
			$points = $response->get_points();
			$table_name = $wpdb->prefix . 'easyway_points';
			
			if( count( $points ) > 0 ) {
				
				$wpdb->query( "DELETE FROM {$table_name} WHERE 1 = 1;" );
				$total_count = 0;
				
				foreach( $points as $point ) {
					
					$default = array(
						'city'		=> '',
						'address'	=> '',
						'point_id'	=> '',
						'lat'		=> '',
						'lng'		=> '',
						'region_id'	=> '',
						'office'	=> false,
						'partner'	=> '',
						'schedule'	=> '',
						'phone'		=> '',
						'trip'		=> '',
						'terminal'	=> false,
					);

					$data = wp_parse_args( $point, $default );
					
					if( empty( $data['city'] ) || empty( $data['point_id'] ) ) {
						continue;
					}
					
					$wpdb->insert(
						$table_name,
						$data
					);
					
					$total_count++;
				}
				
				$logger->info( sprintf( 'Найдено %d, загружено %d пунктов выдачи.', count( $points ), $total_count ), array( 'source' => 'load_easyway_points' ) );
			}
		}
	}
	*/
}