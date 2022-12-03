<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WD_Russian_Post_API extends Woodev_API_Base {
	
	private $app_token;
	private $login;
	private $password;
	protected $api_endpoint = 'https://otpravka-api.pochta.ru/1.0/';
	
	public function __construct( $login, $password, $token ) {
		
		$this->set_request_content_type_header( 'application/json' );
		$this->set_request_accept_header( 'application/json' );
		$this->set_response_handler( 'WC_Russian_Post_API_Response' );
		
		$this->set_request_header( 'Authorization', sprintf( 'AccessToken %s', trim( $token ) ) );
		$this->set_request_header( 'X-User-Authorization', sprintf( 'Basic %s', base64_encode( "{$login}:{$password}" ) ) );
		
		$this->request_uri = 'https://otpravka-api.pochta.ru';
	}
	
	public function get_tariff( $params = array() ) {
		$request = $this->get_new_request();
		
		$request->get_tariff( $params );
		
		$response = $this->perform_request( $request );
		
		return $response->get_tariff();
	}
	
	public function get_postoffice_by_index( $index ) {
		$request = $this->get_new_request();
		
		$request->get_postoffice_by_index( $index );
		
		$response = $this->perform_request( $request );
		
		return $response->get_postoffice_info();
	}
	
	public function get_postoffice_by_address( $address ) {
		$request = $this->get_new_request();
		
		$request->get_postoffice_by_address( $address );
		
		$response = $this->perform_request( $request );
		
		return $response->get_postoffice_info();
	}
	
	public function get_settings() {
		$request = $this->get_new_request();
		
		$request->get_settings();
		
		return $this->perform_request( $request );
	}
	
	public function export_order( $order ) {

		$request = $this->get_new_request();

		$request->process_new_order( $order );

		return $this->perform_request( $request );
	}
	
	public function remove_order( $ids ) {
		
		$request = $this->get_new_request();
		$ids = is_array( $ids ) ? $ids : array( $ids );
		$request->process_remove_order( $ids );
		$response = $this->perform_request( $request );
		
		return $response->get_remove_ids();
	}
	
	public function get_remote_order( $id ) {
		
		$request = $this->get_new_request();
		
		$request->get_remote_order( $id );
		
		$response = $this->perform_request( $request );
		
		return $response->get_remote_order();
	}
	
	public function get_postoffice_by_location() {
		$location = wc_russian_post_shipping()->get_customer_coordinates();
		
		$request = $this->get_new_request();
		
		$request->get_postoffice_by_location( $location );
		
		$response = $this->perform_request( $request );
		
		return $response->get_postoffice_info();
	}
	
	public function get_all_delivery_points() {
		$request = $this->get_new_request();
		$request->get_delivery_points();
		$response = $this->perform_request( $request );
		
		return $response->get_delivery_points();
	}
	
	public function get_normalize_address( $id, $address ) {
		$request = $this->get_new_request();
		$request->get_normalize_address( $id, $address );
		$response = $this->perform_request( $request );
		
		return $response->normalize_address();
	}
	
	protected function do_post_parse_response_validation() {
		
		$response = $this->get_response();
		$errors   = $response->get_errors();
		$message  = '';

		if ( ! empty( $errors ) ) {

			$errors = array();

			foreach ( $response->get_errors() as $error_code => $error_text ) {
				$errors[] = sprintf( 'Ошибка (%s): %s', $error_code, esc_attr( $error_text ) );
			}

			$message = implode( '. ', $errors );

		}
		
		if ( $message ) {
			throw new Woodev_API_Exception( $message );
		}
	}
	
	protected function get_new_request( $args = array() ) {
		return new WC_Russian_Post_API_Request();
	}
	
	protected function get_plugin() {
		return wc_russian_post_shipping();
	}
}