<?php

defined( 'ABSPATH' ) or exit;

class WC_Russian_Post_API_Response extends Woodev_API_JSON_Response {
	
	public function get_errors() {
		
		$errors = array();
		
		if ( $this->errors ) {

			foreach( ( array ) $this->errors as $error_codes ) {
				if (is_string($error_codes)) {
					$errors[ 'UNKNOWN_SINGLE_ERROR' ] = $error_codes;
				} else if( $error_codes->{'error-codes'} ) {
					foreach( $error_codes->{'error-codes'} as $error ) {
						$errors[ $error->code ] = $error->description;
					}
				}
			}
		} elseif( $this->error ) {
			$errors[ 'UNKNOWN_SINGLE_ERROR' ] = $this->get_message();
		} elseif( $this->code && $this->{'sub-code'} ) {
			$errors[ $this->{'sub-code'} ] = $this->get_message();
		}

		return $errors;
	}
	
	public function get_status() {

		return $this->status ? $this->status : null;
	}
	
	public function get_message() {

		return $this->message ? $this->message : ( $this->desc ? $this->desc : 'Неизвестная ошибка' );
	}
	
	public function get_tariff() {
		if( ! $this->{'total-rate'} || ( $this->{'total-rate'} && $this->{'total-rate'} === 0 && ( ! $this->{'avia-rate'} || ! $this->{'ground-rate'} ) ) ) {
			throw new Woodev_API_Exception( 'Не удалось получить стоимость доставки.' );
			return false;
		} else {
			
			$delivery_time = $this->{'delivery-time'};
			
			$max_days = isset( $delivery_time->{'max-days'} ) ? $delivery_time->{'max-days'} : null;
			$min_days = isset( $delivery_time->{'min-days'} ) ? $delivery_time->{'min-days'} : null;
			$payment = isset( $this->{'payment-method'} ) ? $this->{'payment-method'} : null;
			$oversize = isset( $this->{'oversize-rate'} ) ? $this->{'oversize-rate'}->rate : 0;
			
			return array(
				'cost'		=> $this->{'total-rate'} + $this->{'total-vat'} + $oversize,
				'payment'	=> $payment,
				'max_days'	=> $max_days,
				'min_days'	=> $min_days,
			);
		}
	}
	
	public function get_postoffice_info() {
		if( ! $this->response_data || empty( $this->response_data ) ) {
			throw new Woodev_API_Exception( 'Не удалось получить информацию об ОПС.' );
			return false;
		}
		
		return $this->response_data;
	}
	
	public function get_settings() {
		$error = '';
		
		if( $this->api_enabled ) {
			return array(
				'api_enabled'		=> true,
				'shipping_points'	=> $this->{'available-shipping-points'},
				'mailing_option'	=> $this->{'mailing-option'},
				'espp_code'			=> $this->{'espp-code'},
				'access_token'		=> $this->apig_access_token,
				'cod_enabled'		=> $this->{'delivery_with-cod_enabled'} ? true : false
			);
		} elseif( $this->status && 'ERROR' == $this->status ) {
			$error = $this->message ? $this->message : 'Неизвестная ошибка.';
		} elseif( $this->code && $this->desc ) {
			$error = $this->desc;
		} else {
			$error = 'Не удалось получить настроки аккаунта.';
		}
		
		if( ! empty( $error ) ) {
			throw new Woodev_API_Exception( $error );
		}
	}
	
	public function get_orders() {
		$orders = array();
		
		foreach( ( array ) $this->{'result-ids'} as $result_id ) {
			try {

				$orders[] = wc_russian_post_shipping()->get_api()->get_remote_order( $result_id );

			} catch ( Woodev_API_Exception $e ) {

				wc_russian_post_shipping()->log( $e->getMessage() );
			}
		}
		
		return $orders;
	}
	
	public function get_single_order() {
		
		$orders = $this->get_orders();
		return ! empty( $orders ) ? $orders[0] : null;
	}
	
	public function get_remote_order() {
		/*
		if( $this->barcode || empty( $this->barcode ) ) {
			throw new Woodev_API_Exception( 'Неудалось получить номер отслежмивания посылки.' );
			return;
		}
		*/
		$result = array(
			'russian_post_id'	=> $this->id,
			'tracking_number'	=> $this->barcode,
			'payment_method'	=> $this->{'payment-method'},
			'status_code'		=> 'shipped',
			'status_text'		=> 'Заказ успешно создан в ЛК Почта России.',
			'delivery_time'		=> array()
		);
		
		if( $this->{'is-deleted'} && 'true' === $this->{'is-deleted'} ) {
			$result['status_code'] = 'failed';
			$result['status_text'] = 'Заказ был удалён из системы.';
		}
		
		if( $this->{'delivery-time'} ) {
			$result['delivery_time']['min'] = $this->{'delivery-time'}->{'min-days'} ? $this->{'delivery-time'}->{'min-days'} : null;
			$result['delivery_time']['max'] = $this->{'delivery-time'}->{'max-days'} ? $this->{'delivery-time'}->{'max-days'} : null;
		}
		
		return $result;
	}
	
	public function get_remove_ids() {
		
		return $this->{'result-ids'};
	}
	
	public function get_delivery_points() {
		if( empty( $this->response_data ) || ! is_array( $this->response_data )) {
			throw new Woodev_API_Exception( 'Не удалось получить список ПВЗ' );
			return;
		}
		
		$points = array();
		
		foreach( ( array ) $this->response_data as $point_index => $point ) {
			$points[ $point_index ] = array(
				'id'		=> $point->id,
				'index'		=> $point->{'delivery-point-index'},
				'type'		=> $point->{'delivery-point-type'},
				'work_time'	=> $point->{'work-time'},
				'payment'	=> array(
					'card'	=> $point->{'card-payment'},
					'cash'	=> $point->{'cash-payment'}
				),
				'location'	=> array(
					'lat'	=> $point->latitude,
					'lon'	=> $point->longitude
				),
				'address'	=> array()
			);
			
			if( $point->getto ) {
				$points[ $point_index ]['route'] = $point->getto;
			}
			
			if( isset( $point->{'dimension-limit'} ) && ! empty( $point->{'dimension-limit'} ) ) {
				$points[ $point_index ]['dimension_limit'] = $point->{'dimension-limit'};
			}
			
			if( isset( $point->{'weight-limit'} ) && ! empty( $point->{'weight-limit'} ) ) {
				$points[ $point_index ]['weight_limit'] = $point->{'weight-limit'};
			}
			
			if( ! empty( $point->address ) ) {
				foreach( ( array ) $point->address as $key => $address_part ) {
					$points[ $point_index ]['address'][ $key ] = $address_part;
				}
				
				if( $point->address->place ) {
					$points[ $point_index ]['city_name'] = trim( str_replace( 'г ', '', $point->address->place ) );
				}
			}
		}
		
		return $points;
	}
	
	public function normalize_address() {
		if( empty( $this->response_data ) || ! is_array( $this->response_data ) || ! isset( $this->response_data[0] ) ) {
			throw new Woodev_API_Exception( 'Не удалось получить информацию об адресе' );
			return;
		}
		
		$normalize_address = $this->response_data[0];
		
		if( ! in_array( $normalize_address->{'quality-code'}, array( 'GOOD', 'ON_DEMAND', 'POSTAL_BOX', 'UNDEF_05' ), true ) ) {
			throw new Woodev_API_Exception( 'Качество кода не соответсвует требуемым параметрам для нормализации адреса.' );
			return;
		}
		
		if( ! in_array( $normalize_address->{'validation-code'}, array( 'VALIDATED', 'OVERRIDDEN', 'CONFIRMED_MANUALLY' ), true ) ) {
			throw new Woodev_API_Exception( 'Код проверки не соответсвует требуемым параметрам для нормализации адреса.' );
			return;
		}
		
		$result_data = array();
		$alloved_fields = array( 'area', 'building', 'corpus', 'hotel', 'house', 'index', 'letter', 'location', 'num-address-type', 'original-address', 'place', 'region', 'room', 'slash', 'street' );
		foreach( $alloved_fields as $field ) {
			if( isset( $normalize_address->$field ) && ! empty( $normalize_address->$field ) ) {
				$result_data[ $field ] = $normalize_address->$field;
			}
		}
		
		return $result_data;
	}
}