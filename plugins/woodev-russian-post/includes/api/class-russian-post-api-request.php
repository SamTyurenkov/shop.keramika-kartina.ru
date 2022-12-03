<?php

defined( 'ABSPATH' ) or exit;

class WC_Russian_Post_API_Request extends Woodev_API_JSON_Request {
	
	/*
	* Расчет стоимости пересылки
	*/
	public function get_tariff( $params ) {
		$this->path   = '/1.0/tariff';
		$this->method = 'POST';
		$this->params = $params;
	}
	
	/*
	* Отображает баланс расчетного счета. Возвращаемые значения указываются в копейках.
	*/
	public function get_balance() {
		$this->path = '/1.0/counterpart/balance';
		$this->method = 'GET';
	}
	
	/*
	* Текущие настройки пользователя
	*/
	public function get_settings() {
		$this->path = '/1.0/settings';
		$this->method = 'GET';
	}
	
	/*
	* Текущие точки сдачи
	*/
	public function get_shipping_points() {
		$this->path = '/1.0/user-shipping-points';
		$this->method = 'GET';
	}
	
	public function get_normalize_address( $id, $address ) {
		$this->path = '/1.0/clean/address';
		$this->method = 'POST';
		$this->params = array(
			array(
				'id'				=> $id,
				'original-address' 	=> $address
			)
		);
	}
	
	private function get_default_order_params( WC_Russian_Post_Order $order ) {
		
		$first_name	= $order->get_shipping_first_name() ? $order->get_shipping_first_name() : $order->get_billing_first_name();
		$last_name	= $order->get_shipping_last_name() ? $order->get_shipping_last_name() : $order->get_billing_last_name();
		$postcode	= $order->get_shipping_postcode() ? $order->get_shipping_postcode() : $order->get_billing_postcode();
		$city		= $order->get_shipping_city() ? $order->get_shipping_city() : $order->get_billing_city();
		$state 		= $order->get_shipping_state() ? $order->get_shipping_state() : $order->get_billing_state();
		$address	= $order->get_shipping_address_1() ? $order->get_shipping_address_1() : $order->get_billing_address_1();
		
		$default_country = get_option( 'woocommerce_default_country' );
		$default_country = explode( ':', $default_country );
		$default_country = $default_country[0];
		$billing_country = $order->get_shipping_country() ? $order->get_shipping_country() : ( $order->get_billing_country() ? $order->get_billing_country() : $default_country );
		
		return apply_filters( 'wc_russian_post_default_order_params', array(
			'address-type-to' 	=> 'DEFAULT',
			'given-name' 		=> $first_name,
			'surname'			=> $last_name,
			'index-to'			=> intval( $postcode ),
			'mail-category'		=> $order->mail_category,
			'mail-type'			=> $order->mail_type,
			'mail-direct'		=> wc_russian_post_get_allow_country_codes( $billing_country ),
			'mass'				=> intval( $order->package_mass ),
			'tel-address'		=> wc_sanitize_phone_number( $order->get_billing_phone() ),
			'fragile'			=> $order->fragile ? 'true' : 'false',
			'order-num'			=> $order->get_order_number(),
			'place-to'			=> $city,
			'region-to'			=> $state,
			'street-to'			=> $address,
			'postoffice-code'	=> $order->index_from
		) );
	}
	
	public function process_new_order( $order ) {
		
		if ( ! $order instanceof WC_Russian_Post_Order ) {
			throw new Woodev_API_Exception( 'Заказ должен быть объектом класса WC_Russian_Post_Order' );
		}
		
		$params = $this->get_default_order_params( $order );
		$is_cod_payment = wc_russian_user_is_cod_enabled() && 'wc_russian_post_cod' === $order->get_payment_method() && $order->get_order_meta( 'payment_by_cod' ) ? true : false;
		
		$dimension_disallow = apply_filters( 'wc_russian_post_types_dimension_disallow', array( 'PARCEL_CLASS_1', 'ONLINE_PARCEL', 'EMS' ) );
		
		if( ! in_array( $order->mail_type, $dimension_disallow, true ) && wc_russian_post_is_oversize_dimension( $order->package_length, $order->package_width, $order->package_height ) ) {
			$params['dimension'] = array(
				'height'	=> intval( $order->package_height ),
				'length'	=> intval( $order->package_length ),
				'width'		=> intval( $order->package_width )
			);
		}
		
		if( 'SMALL_PACKET' == $order->mail_type ) {
			$params['mail-category'] = 'ORDERED';
		} elseif( 'wc_russian_post_cod' === $order->get_payment_method() ) {
			$params['mail-category'] = 'WITH_DECLARED_VALUE_AND_CASH_ON_DELIVERY';
		} else {
			$params['mail-category'] = 'ORDINARY';
		}
		
		if( $is_cod_payment ) {
			
			$goods = array();
			$goods_count = 0;
			$order_items = Woodev_Helper::get_order_line_items( $order );
			$goods_value = 0;
			
			foreach( $order_items as $item ) {
				if( ! $item->product->needs_shipping() ) {
					continue;
				}
				$goods[ $goods_count ] = array(
					//'code'			=> $item->id,
					'description'	=> $item->name,
					'goods-type'	=> 'GOODS',
					'item-number'	=> ( $item->product && ! empty( $item->product->get_sku() ) ) ? $item->product->get_sku() : $item->product->get_id(),
					'quantity'		=> $item->quantity,
					'value'			=> $item->item_total * 100,
					'insr-value'	=> 'wc_russian_post_cod' === $order->get_payment_method() ? $item->line_total * 100 : 0,
					'vat-rate'		=> -1,
					'payattr'     	=> 'wc_russian_post_cod' === $order->get_payment_method() ? 4 : 1,
					'lineattr'		=> 1,
					'weight'		=> $item->product ? ( $item->product->get_weight() > 0 ? wc_get_weight( $item->product->get_weight(), 'g' ) : wc_russian_post_shipping()->get_shipping_option( 'minimum_weight' ) ) : wc_russian_post_shipping()->get_shipping_option( 'minimum_weight' )
				);
				
				$goods_value += $item->line_total * 100;
				
				$goods_count++;
			}
			
			if( ! empty( $goods ) ) {
				$params['goods']['items'] = $goods;
			}
			
			if( $is_cod_payment ) {
				$params['delivery-with-cod'] = true;
			}
		}
		
		/*
		* Если отправка международная
		*/
		if( 643 !== $params['mail-direct'] && apply_filters( 'wc_russian_post_allow_international_shipping', true, $order ) ) {
			//Для отправлений за территорией РФ "Международная доставка", все значения заполняются на латинсоком. Вместо поля index-to нужно передавать str-index-to (буквенно-цифровой формат)
			
			$fields_for_translate = array( 'region-to', 'place-to', 'street-to', 'given-name', 'surname' );
			
			foreach( $fields_for_translate as $field ) {
				if( isset( $params[ $field ] ) && ! empty( $params[ $field ] ) ) {
					$params[ $field ] = Woodev_Helper::str_convert( $params[ $field ] );
				}
			}
			
			$params['str-index-to']	= $order->get_shipping_postcode();
			$params['recipient-name'] = implode( ' ', array( $params['surname'], $params['given-name'] ) );
			
			$customs_entries = array();
			$order_items = Woodev_Helper::get_order_line_items( $order );
			
			foreach( $order_items as $item ) {
				if( ! $item->product->needs_shipping() ) {
					continue;
				}
				$customs_entries[] = array(
					'amount'		=> $item->quantity,
					'country-code'	=> wc_russian_post_get_allow_country_codes( 'RU' ),
					'description'	=> Woodev_Helper::str_truncate( Woodev_Helper::str_convert( $item->name ), 57, '...' ),
					'tnved-code'	=> get_post_meta( $item->product->id, '_tnved_code', true ),
					'value'			=> $item->line_total * 100,
					'weight'		=> $item->product ? ( $item->product->get_weight() > 0 ? wc_get_weight( $item->product->get_weight(), 'g' ) : wc_russian_post_shipping()->get_shipping_option( 'minimum_weight' ) ) : wc_russian_post_shipping()->get_shipping_option( 'minimum_weight' )
				);
			}
			
			$params['customs-declaration'] = array(
				'currency'        => $order->get_currency(),
				'entries-type'    => 'SALE_OF_GOODS',
				'customs-entries' => $customs_entries
			);
		
		} else {
			
			/*
			try {
				$normalize_address = wc_russian_post_shipping()->get_api()->get_normalize_address( $order->get_id(), implode( ', ', array(
					$order->get_shipping_state(),
					$order->get_shipping_city(),
					$order->get_shipping_address_1()
				) ) );
				
				
			
			} catch( Woodev_API_Exception $e ) {
				
				wc_russian_post_shipping()->log( $e->getMessage() );
			}
			*/
		}
		
		if( 'wc_russian_post_cod' === $order->get_payment_method() ) {
			$order_total 	= intval( $order->get_total() ) * 100;
			$shipping_total = intval( $order->get_shipping_total() ) * 100;
			
			if( in_array( $params['mail-category'], array( 'WITH_DECLARED_VALUE', 'WITH_DECLARED_VALUE_AND_CASH_ON_DELIVERY' ), true ) ) {
				
				$params['insr-value'] = $order_total;
				
				if( 'WITH_DECLARED_VALUE_AND_CASH_ON_DELIVERY' === $params['mail-category'] ) {
					$params['payment'] = $order_total;
				}
			}
		}
		
		if( $order->customer_notice ) {
			$params['sms-notice-recipient'] = 1;
		}
		
		if( $order->completeness_checking ) {
			$params['completeness-checking'] = true;
		}
		
		$request_params = array( $params );
		
		$this->method = 'PUT';
		$this->path   = '/1.0/user/backlog';
		$this->params = apply_filters( 'wc_russian_post_new_order_params', $request_params, $order );
		
	}
	
	public function get_remote_order( $id ) {
		$this->method = 'GET';
		$this->path   = sprintf( '/1.0/backlog/%s', $id );
	}
	
	public function process_remove_order( $ids ) {
		$this->method = 'DELETE';
		$this->path   = '/1.0/backlog';
		$this->params = $ids;
	}
	
	/*
	*
	*
	*/
	public function is_unreliable_recipient( $address = '', $name = '', $phone = '' ) {
		$this->path = '/1.0/unreliable-recipient';
		$this->method = 'POST';
		$this->params = array();
		
		if( ! empty( $address ) ) {
			$this->params['raw-address'] = $address;
		}
		
		if( ! empty( $name ) ) {
			$this->params['raw-full-name'] = $name;
		}
		
		if( ! empty( $phone ) ) {
			$this->params['raw-telephone'] = $phone;
		}
	}
	
	public function get_postoffice_by_index( $index ) {
		$this->path = sprintf( '/postoffice/1.0/%s', $index );
		$this->method = 'GET';
	}
	
	public function get_postoffice_by_address( $address ) {
		$this->path = '/postoffice/1.0/by-address/';
		$this->method = 'GET';
		$this->params = array(
			'address'	=> $address,
			'top'		=> 10
		);
	}
	
	public function get_postoffice_by_location( $location = array() ) {
		$this->path = '/postoffice/1.0/nearby?filter=ALL';
		$this->method = 'GET';
		
		$this->params = array(
			'latitude'	=> $location['lat'],
			'longitude'	=> $location['lon']
		);
	}
	
	/*
	* Запрос данных о партиях в архиве
	*/
	public function get_long_term_archive( $query ) {
		$this->path = '/1.0/long-term-archive/shipment/search';
		$this->method = 'GET';
		$this->params = array( 'query' => $query );
	}
	
	public function get_delivery_points() {
		$this->path = '/1.0/delivery-point/findAll';
		$this->method = 'GET';
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