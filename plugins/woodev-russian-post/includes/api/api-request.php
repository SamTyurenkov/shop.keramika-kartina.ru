<?php

namespace Woodev\Russian_Post\API;

defined( 'ABSPATH' ) or exit;

class API_Request extends \Woodev_API_JSON_Request {

	use \Woodev_Cacheable_Request_Trait;

	/**
	 * Build the request.
	 *
	 * @param string $method API method to use
	 * @param string $path REST path
	 */
	public function __construct( $method = 'GET', $path = '/' ) {

		$this->method = $method;
		$this->path   = $path;
	}


	/**
	 * Sets the request params.
	 *
	 * Useful for GET requests.
	 *
	 * @param array $params params to set
	 */
	public function set_params( array $params ) {
		$this->params = $params;
	}


	/**
	 * Sets the request data.
	 *
	 * Useful for POST/PUT requests.
	 *
	 * @param array $data data to set
	 */
	public function set_data( array $data ) {
		$this->data = $data;
	}

	/**
	 * Gets request parameters.
	 *
	 * @return array
	 */
	public function get_params() {
		return $this->params;
	}

	public function get_path() {

		$path   = $this->path;
		$params = $this->get_params();

		if ( 'GET' === $this->get_method() && ! empty( $params ) ) {

			$path .= '?' . http_build_query( $this->get_params(), '', '&' );
		}

		return $path;
	}

	public function to_string() {

		if ( 'GET' === $this->get_method() ) {
			return array();
		} elseif( in_array( $this->get_method(), array( 'POST', 'PUT', 'DELETE' ) ) ) {
			return wp_json_encode( $this->get_params() );
		} else {
			return http_build_query( $this->get_params() );
		}
	}
}