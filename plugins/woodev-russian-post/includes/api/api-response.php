<?php

namespace Woodev\Russian_Post\API;

defined( 'ABSPATH' ) or exit;

class API_Response extends \Woodev_API_JSON_Response implements \Woodev\Russian_Post\Interfaces\API_Response {

	/**
	 * @return boolean
	 */
	public function has_api_error() {
		return ( isset( $this->error ) && ! empty( $this->error ) ) || ( isset( $this->errors ) && ! empty( $this->errors ) );
	}

	/**
	 * @return string|integer
	 */
	public function get_api_error_code() {
		// TODO: Implement get_api_error_code() method.
	}

	/**
	 * @return string
	 */
	public function get_api_error_message() {
		// TODO: Implement get_api_error_message() method.
	}
}