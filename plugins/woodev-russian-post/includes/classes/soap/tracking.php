<?php

namespace Woodev\Russian_Post\Classes\Soap;

if( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Tracking {

	private $tracking_login;

	private $tracking_password;

	private $history;

	private $barcode;

	/**
	 * @throws \Exception
	 */
	public function __construct() {
		$this->tracking_login    = wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_login' );
		$this->tracking_password = wc_russian_post_shipping()->get_settings_instance()->get_option( 'tracking_password' );

		if( empty( $this->tracking_login ) || empty( $this->tracking_password ) ) {
			throw new \Exception( __( 'Credentials of Tracking service cannot be empty.', 'woocommerce-russian-post' ) );
		}
	}

	/**
	 * @return Soap_Client
	 */
	private function get_client() {
		return new Soap_Client( 'https://tracking.russianpost.ru/rtm34?wsdl' );
	}

	public function set_barcode( $barcode = '' ) {
		$this->barcode = $barcode;

		return $this;
	}

	public function get_barcode() {
		return $this->barcode;
	}

	/**
	 * @param \stdClass $item
	 *
	 * @return array[]
	 */
	private function item( $item ) {
		return array(
			'destination' => array(
				'address' => $item->AddressParameters->DestinationAddress->Description,
				'index'   => $item->AddressParameters->DestinationAddress->Index,
				'country' => $item->AddressParameters->MailDirect->Code2A
			),
			'origin'      => array(
				'address' => $item->AddressParameters->OperationAddress->Description,
				'index'   => $item->AddressParameters->OperationAddress->Index,
				'country' => $item->AddressParameters->CountryFrom->Code2A
			),
			'params'      => array(
				'barcode'            => $item->ItemParameters->Barcode,
				'name'               => $item->ItemParameters->ComplexItemName,
				'mail_type_id'       => $item->ItemParameters->MailType->Id,
				'mail_type_name'     => $item->ItemParameters->MailType->Name,
				'mail_category_id'   => $item->ItemParameters->MailCtg->Id,
				'mail_category_name' => $item->ItemParameters->MailCtg->Name,
			),
			'status'      => array(
				'date'       => $item->OperationParameters->OperDate,
				'type_id'    => $item->OperationParameters->OperType->Id,
				'type_name'  => $item->OperationParameters->OperType->Name,
				'attr_id'    => $item->OperationParameters->OperAttr->Id,
				'attr_name'  => isset( $item->OperationParameters->OperAttr->Name ) ? $item->OperationParameters->OperAttr->Name : null,
				'is_finally' => in_array( $item->OperationParameters->OperType->Id, array(
					2,
					5,
					15,
					16,
					17,
					18
				), true )
			),
			'sender'      => $item->UserParameters->Sndr,
			'recipient'   => $item->UserParameters->Rcpn
		);
	}

	/**
	 * @return array
	 */
	public function get_items() {

		if( ! $this->history ) {
			$this->get_history( $this->get_barcode() );
		}

		$result = array();

		foreach ( $this->history as $item ) {
			if( ! isset( $item->AddressParameters, $item->ItemParameters, $item->OperationParameters, $item->UserParameters ) ) {
				continue;
			}

			$result[] = $this->item( $item );
		}

		usort( $result, function ( $a, $b ) {
			if( strtotime( $a['status']['date'] ) === strtotime( $b['status']['date'] ) ) {
				return strcasecmp( $a['status']['date'], $b['status']['date'] );
			}

			return ( strtotime( $a['status']['date'] ) > strtotime( $b['status']['date'] ) ) ? - 1 : 1;
		} );

		return $result;
	}

	/**
	 * @param string $barcode
	 *
	 * @return self
	 */
	public function get_history( $barcode = '' ) {

		if( ! $this->get_barcode() || $this->get_barcode() !== $barcode ) {
			$this->set_barcode( $barcode );
		}

		if( ! $this->history ) {

			$this->history = $this->get_client()->getOperationHistory( new \SoapParam( array(
				'OperationHistoryRequest' => array(
					'Barcode'     => $this->get_barcode(),
					'MessageType' => 0
				),
				'AuthorizationHeader'     => array(
					'login'    => $this->tracking_login,
					'password' => $this->tracking_password
				)
			), 'OperationHistoryRequest' ) )->OperationHistoryData->historyRecord;

			if( ! is_array( $this->history ) && is_object( $this->history ) ) {
				$this->history = array( $this->history );
			}
		}

		return $this;
	}

	/**
	 * Returns the last element of history items
	 *
	 * @return false|array
	 */
	public function get_last() {
		return current( $this->get_items() );
	}

	/**
	 * Checking, It is a final status or not
	 *
	 * @return bool
	 */
	public function is_finally() {
		$last = $this->get_last();

		return $last && isset( $last['status'], $last['status']['is_finally'] ) && $last['status']['is_finally'];
	}

	public function is_completed() {

		$last = $this->get_last();

		return $this->is_finally() && $last['status']['type_id'] == 2 && in_array( $last['status']['attr_id'], array(
				1,
				3,
				5,
				6,
				8,
				10,
				11,
				12,
				13,
				15,
				17,
				18,
				19,
				21,
				23
			), true );
	}

	public function is_canceled() {
		$last = $this->get_last();

		return $last && in_array( $last['status']['type_id'], array( 3, 5, 17, 18 ), true );
	}

	/**
	 * @return bool
	 */
	public function is_delivering() {
		return ( ! $this->is_accepted() && ! $this->is_completed() && ! $this->is_canceled() );
	}

	public function is_accepted() {
		$last = $this->get_last();
		return $last && $last['status']['type_id'] == 1;
	}
}