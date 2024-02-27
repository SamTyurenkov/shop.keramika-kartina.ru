<?php

namespace Woodev\Russian_Post\API;

use Woodev\Russian_Post\API\API_Request;
use Woodev\Russian_Post\API\API_Response;

defined( 'ABSPATH' ) or exit;

class API extends \Woodev_Cacheable_API_Base {

	const CMS_TYPE = 'cms';

	const WIDGET_TYPE = 'widget';

	const OTPRAVKA_TYPE = 'otpravka-api';

	public function __construct() {
		$this->set_request_content_type_header( 'application/json' );
		$this->set_request_accept_header( 'application/json' );
		$this->set_response_handler( '\Woodev\Russian_Post\API\API_Response' );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_courier_tariff_public( array $params, $refresh = false ) {
		return $this->get_objects( self::WIDGET_TYPE, 'POST', '/api/pvz/courier_tariff_public', $params, $refresh );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_pick_up_tariff_public( array $params, $refresh = false ) {
		return $this->get_objects( self::WIDGET_TYPE, 'POST', '/api/pvz/pick_up_tariff_public', $params, $refresh );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_index_public( array $params, $refresh = false ) {
		return $this->get_objects( self::WIDGET_TYPE, 'POST', '/api/pvz/index_public', $params, $refresh );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_show_public( array $params, $refresh = false ) {
		return $this->get_objects( self::WIDGET_TYPE, 'POST', '/api/pvz/show_public', $params, $refresh );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_pvz_by_id( $id, $refresh = false ) {
		return $this->get_objects( self::WIDGET_TYPE, 'GET', "/api/pvz/{$id}", array(), $refresh );
	}

	/**
	 * @param array $params {
	 *
	 *  @type string $accountId
	 *  @type string $accountType Account type. In our case, it must be "wordpress"
	 * }
	 *
	 * @param bool $refresh
	 *
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_site_settings( $params, $refresh = false ) {
		return $this->get_objects( self::WIDGET_TYPE, 'POST', '/api/sites/public_show', $params, $refresh );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_orders_public( array $params ) {
		return $this->get_object( 'isOrderCreated', self::CMS_TYPE, 'POST', '/api/cms/orders_public', $params );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function install_module( array $params ) {
		return $this->get_objects( self::CMS_TYPE, 'POST', '/api/cms/install', $params );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function uninstall_module( array $params ) {
		return $this->get_objects( self::CMS_TYPE, 'POST', '/api/cms/uninstall', $params );
	}

	/**
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_account_limit( $refresh = false ) {
		return $this->get_objects( self::OTPRAVKA_TYPE, 'GET', '/1.0/settings/limit', array(), $refresh );
	}

	/**
	 * @param string $id Request ID
	 * @param string $address Original address text
	 *
	 * @return \stdClass|null
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_clean_address( $id, $address ) {
		return $this->get_objects( self::OTPRAVKA_TYPE, 'POST', '/1.0/clean/address', array(
			array(
				'id'                => $id,
				'original-address'  => $address
			)
		) );
	}

	public function get_post_office( $postal_code ) {
		return $this->get_objects( self::OTPRAVKA_TYPE, 'GET', "/postoffice/1.0/{$postal_code}" );
	}

	public function get_post_office_services( $postal_code ) {
		return $this->get_objects( self::OTPRAVKA_TYPE, 'GET', "/postoffice/1.0/{$postal_code}/services" );
	}

	public function get_new_order( $params = array() ) {
		return $this->get_objects( self::OTPRAVKA_TYPE, 'PUT', '/2.0/user/backlog', $params );
	}

	public function get_update_order( $id, $params = array()  ) {
		return $this->get_objects( self::OTPRAVKA_TYPE, 'PUT', "/1.0/backlog/{$id}", $params );
	}

	public function delete_order( $params = array()  ) {
		return $this->get_objects( self::OTPRAVKA_TYPE, 'DELETE', '/1.0/backlog', $params );
	}

	/**
	 * Returns array of postal codes by settlement, region and district name
	 *
	 * @param array $params Array of {
	 *      @type string $settlement Locality name
	 *      @type string $region Name of region
	 *      @type string $district Name of district
	 * }
	 *
	 * @since 1.2.2
	 *
	 * @return array|null
	 * @throws \Woodev_Plugin_Exception
	 */
	public function get_postoffice_codes( $params ) {
		return $this->get_objects( self::OTPRAVKA_TYPE, 'GET', '/postoffice/1.0/settlement.offices.codes', $params );
	}

	/**
	 * @param string $type String of type API
	 *
	 * @return string Returns string URL of API
	 */
	private function get_api_url( $type ) {
		return str_replace( '{type}', $type, 'https://{type}.pochta.ru' );
	}

	/**
	 * @param string $type Set request type. Allowed type is cms or otpravka-api
	 *
	 * @return void
	 */
	private function set_request_uri( $type ) {
		$this->request_uri = $this->get_api_url( $type );
	}

	/**
	 * @param array $args
	 * @throws \Woodev_API_Exception
	 * @return API_Request
	 */
	protected function get_new_request( $args = array() ) {

		$args = wp_parse_args( $args, array(
			'method'    => 'GET',
			'path'      => '/',
			'api_type'  => '',
		) );

		if( in_array( $args['api_type'], array( self::CMS_TYPE, self::WIDGET_TYPE, self::OTPRAVKA_TYPE ), true ) ) {
			$this->set_request_uri( $args['api_type'] );
		} else {
			throw new \Woodev_API_Exception( 'Invalid request type' );
		}

		if( self::OTPRAVKA_TYPE == $args['api_type'] ) {

			$token      = wc_russian_post_shipping()->get_settings_instance()->get_option( 'account_token' );
			$login      = wc_russian_post_shipping()->get_settings_instance()->get_option( 'account_name' );
			$password   = wc_russian_post_shipping()->get_settings_instance()->get_option( 'account_password' );

			$this->set_request_header( 'Authorization', sprintf( 'AccessToken %s', trim( $token ) ) );
			$this->set_request_header( 'X-User-Authorization', sprintf( 'Basic %s', base64_encode( "{$login}:{$password}" ) ) );
		}

		return new API_Request( $args['method'], $args['path'] );
	}

	/**
	 * @throws \Woodev_API_Exception
	 */
	protected function do_post_parse_response_validation() {

		if( $this->get_response_code() >= 300 ) {
			throw new \Woodev_API_Exception( sprintf( 'Code: %s, Message: %s', $this->get_response_code(), $this->get_response_message() ) );
		}

		/** @var API_Response $response */
		$response = $this->get_response();

		if ( $response->has_api_error() ) {

			throw new \Woodev_API_Exception( sprintf( 'Code: %s, Message: %s', $response->get_api_error_code(), $response->get_api_error_message() ) );
		}
	}

	/**
	 * Logs an error message to the plugin's log if debug mode is enabled.
	 *
	 * @param string $message the message to log
	 */
	private function log_error_message( $message ) {

		if ( is_string( $message ) && $this->get_plugin()->is_debug_mode_enabled() ) {

			$this->get_plugin()->log( $message );
		}
	}

	/**
	 * Returns an object from Russian Post API (helper method).
	 *
	 * @param string    $type type of API request
	 * @param string    $method HTTP method (ex. POST|PUT)
	 * @param string    $path API path for the object
	 * @param array     $params request query parameters
	 * @param boolean   $refresh force refresh cache
	 *
	 * @return null|object|array|object[]
	 * @throws \Woodev_Plugin_Exception
	 */
	private function get_objects( $type, $method, $path, array $params = array(), $refresh = false ) {

		$objects = null;

		try {

			$request = $this->get_new_request( array(
				'api_type'  => $type,
				'method'    => $method,
				'path'      => $path
			) );

			if( ! empty( $params ) ) {
				$request->set_params( $params );
			}

			if( self::CMS_TYPE === $type ) {
				$request->bypass_cache();
			} elseif( $refresh ) {
				$request->set_force_refresh( true );
			}

			/** @var API_Response $response */
			$response = $this->perform_request( $request );

			if ( ! empty( $response->response_data ) && ! $response->has_api_error() ) {
				$objects = $response->response_data;
			}

		} catch ( \Woodev_API_Exception $e ) {

			$this->log_error_message( $e->getMessage() );
		}

		return $objects;
	}


	/**
	 * Returns an object collection from Russian Post API (helper method).
	 *
	 * @param string $object_name the object name that matches a response property
	 * @param string $type type of API request
	 * @param string $method HTTP method (ex. POST|PUT)
	 * @param string $path API path for the object
	 * @param array $params request query parameters
	 *
	 * @return \stdClass[] array of objects
	 * @throws \Woodev_Plugin_Exception
	 */
	private function get_object( $object_name, $type, $method, $path, array $params ) {

		$result = null;

		$objects = $this->get_objects( $type, $method, $path, $params );

		if( $objects && isset( $objects->$object_name ) ) {
			$result = $objects->$object_name;
		}

		return $result;
	}

	/**
	 * Converts user-agent string from cyrillic to latin
	 *
	 * @return string Converted user-agent string
	 */
	protected function get_request_user_agent() {
		return \Woodev_Helper::str_convert( parent::get_request_user_agent() );
	}

	protected function get_plugin() {
		return wc_russian_post_shipping();
	}
}