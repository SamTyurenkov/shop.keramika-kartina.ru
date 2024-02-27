<?php

namespace Woodev\Russian_Post\Classes;

class Webhooks {

	protected $raw_request_data;

	public function __construct() {
		add_action( 'woocommerce_api_russian_post_barcode', array( $this, 'handle_request' ) );
		add_action( 'woocommerce_api_russian_post_status', array( $this, 'handle_request' ) );
	}

	public function handle_request() {

		try {

			$this->log_request( sprintf( __( 'Webhook Request Body: %s', 'woocommerce-russian-post' ), $this->get_raw_request_data() ) );

			$this->validate_request();

			$this->process_request();

		} catch( \Exception $e ) {
			$this->log_request( sprintf( __( '[Webhook Error]: %s', 'woocommerce-russian-post' ), $e->getMessage() ) );
			wp_send_json( $e->getMessage(), $e->getCode() );
		}

		wp_send_json( __( 'Bad request', 'woocommerce-russian-post' ), 405 );
	}

	/**
	 * @throws \Exception
	 */
	protected function validate_request() {

		$request_data = $this->get_request_data();
		$module_data = new Uninstall_Module();

		if ( ! $request_data ) {
			throw new \Exception( __( 'Invalid data.', 'woocommerce-russian-post' ), 400 );
		}

		if( ! isset( $request_data->guid_id ) || $module_data->get_guid_id() !== $request_data->guid_id ) {
			throw new \Exception( __( 'Invalid GUID ID.', 'woocommerce-russian-post' ), 400 );
		}

		if( ! isset( $request_data->guid_key ) || $module_data->get_guid_key() !== $request_data->guid_key ) {
			throw new \Exception( __( 'Invalid GUID key.', 'woocommerce-russian-post' ), 400 );
		}
	}

	/**
	 * @throws \Exception
	 */
	protected function process_request() {
		$request_data = $this->get_request_data();
		$order = wc_get_order( absint( $request_data->order_id ) );

		if( ! $order ) {
			throw new \Exception( sprintf( __( 'The order %s is not found.', 'woocommerce-russian-post' ), $request_data->order_id ), 400 );
		}

		$order = new Order( $order );

		if( ! empty( $request_data->barcode ) ) {

			$order->set_tracking_number( $request_data->barcode );

			wp_send_json( array(
				'barcode_is_updated' => 'ok'
			), 200 );

		} elseif( ! empty( $request_data->status ) ) {
			//TODO: It is probably necessary to check the status code before setting it
			$order->set_order_status( $request_data->status );

			wp_send_json( array(
				'status_is_updated' => 'ok'
			), 200 );
		}
	}

	protected function get_raw_request_data() {

		if ( is_null( $this->raw_request_data ) ) {
			$this->raw_request_data = \WP_REST_Server::get_raw_data();
		}

		return $this->raw_request_data;
	}

	protected function get_request_data() {
		return json_decode( $this->get_raw_request_data() );
	}

	protected function log_request( $message ) {
		wc_russian_post_shipping()->log( $message, sprintf( '%s_webhooks', wc_russian_post_shipping()->get_id() ) );
	}
}