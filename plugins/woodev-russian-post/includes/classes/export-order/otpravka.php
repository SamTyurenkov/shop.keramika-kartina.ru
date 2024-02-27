<?php

namespace Woodev\Russian_Post\Classes\Export_Order;

use Woodev\Russian_Post\Abstracts\Abstract_Export_Order;
use Woodev\Russian_Post\Classes\Address_Normalize;

if( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Otpravka extends Abstract_Export_Order {

	/**
	 * @return Item[]
	 */
	public function get_order_lines() {

		$lines = array();

		/** @var \WC_Order_Item_Product $item */
		foreach ( $this->get_russian_post_order()->get_items() as $item ) {
			if( ! $item->get_product()->needs_shipping() ) {
				continue;
			}
			$lines[] = new Item( $item );
		}

		return $lines;
	}

	public function get_order_items() {
		$items = array();

		foreach ( $this->get_order_lines() as $item ) {
			$items[] = apply_filters( 'wc_russian_post_order_otpravka_export_item_data',  array_filter( array(
				//'country-code' => $item->get_country_code(), //Код страны происхождения.
				'description'  => $item->get_title(), //Наименование товара (req)
				'goods-type'   => 'GOODS', //Признак товар или услуга. ENUM: GOODS|SERVICE
				'insr-value'   => $this->order_needs_payment() ? $item->get_value() : 0, //Объявленная ценность (копейки)
				'item-number'  => $item->get_code(), //Номенклатура (артикул) товара
				'lineattr'     => 1, //Признак предмета расчета
				'payattr'      => $this->order_needs_payment() ? 4 : 1, //Признак способа расчета.
				'quantity'     => $item->get_quantity(), //Количество товара (req)
				'value'        => $item->get_value(), //Цена за единицу товара в копейках
				'vat-rate'     => $item->get_vat_rate(), //Ставка НДС
				'weight'       => $item->get_weight() //Вес товара (в граммах)
			) ), $item, $this );
		}

		return $items;
	}

	public function get_items_dimensions() {

		$dimensions = array();

		foreach ( $this->get_order_lines() as $item ) {

			for( $count = 0; $item->get_quantity() > $count; $count++ ) {
				$dimensions[] = array(
					'length'    => ceil( $item->get_length( 'mm' ) ),
					'width'     => ceil( $item->get_width( 'mm' ) ),
					'height'    => ceil( $item->get_height( 'mm' ) )
				);
			}
		}

		return $dimensions;
	}

	public function get_customs_entries() {
		$entries = array();

		foreach ( $this->get_order_lines() as $item ) {
			$entries[] = array_filter( array(
				'amount'       => $item->get_quantity(), //Количество (req)
				'description'  => \Woodev_Helper::str_truncate( \Woodev_Helper::str_convert( $item->get_title() ), 57, '...' ), //Наименование товара (req)
				'tnved-code'   => $item->get_tnved_code(), //Код ТНВЭД (req)
				'value'        => $item->get_value(), //Цена за единицу товара в копейках
				'weight'       => $item->get_weight() //Вес товара (в граммах)
			) );
		}

		return $entries;
	}

	public function get_recipient_data() {

		$first_name   = $this->get_russian_post_order()->get_shipping_first_name() ?: $this->get_russian_post_order()->get_billing_first_name();
		$last_name    = $this->get_russian_post_order()->get_shipping_last_name() ?: $this->get_russian_post_order()->get_billing_last_name();
		$full_name    = $this->get_russian_post_order()->get_formatted_shipping_full_name() ?: $this->get_russian_post_order()->get_formatted_billing_full_name();
		$company_name = $this->get_russian_post_order()->get_shipping_company() ?: $this->get_russian_post_order()->get_billing_company();

		return array_filter( array(
			'recipient-name' => implode( ', ', array_filter( array( $full_name, $company_name ) ) ), //Наименование получателя одной строкой (ФИО, наименование организации) (req)
			'given-name'     => $first_name, //Имя получателя (req)
			'surname'        => $last_name, //Фамилия получателя (req)
			'tel-address'    => wc_sanitize_phone_number( $this->get_russian_post_order()->get_billing_phone() ) //Телефон получателя (req)
		) );
	}

	/**
	 * @return Address_Normalize
	 */
	public function get_normalize_address() {
		if( 'postal' == $this->get_shipping_rate_meta( 'method_type' ) ) {
			$delivery_point = $this->get_shipping_rate_meta( 'delivery_point' );
			/** @var Address_Normalize $normalize_address */
			$normalize_address = $delivery_point['normalize_address'];
		} else {
			/** @var Address_Normalize $normalize_address */
			$normalize_address = $this->get_shipping_rate_meta( 'normalize_address' );
		}

		if( ! $normalize_address instanceof Address_Normalize ) {
			try {

				$clean_address = wc_russian_post_shipping()->get_api()->get_clean_address( 1, implode( ', ', array_filter( array(
					$this->get_russian_post_order()->get_shipping_postcode() ?: $this->get_russian_post_order()->get_billing_postcode(),
					$this->get_russian_post_order()->get_shipping_state() ?: $this->get_russian_post_order()->get_billing_state(),
					$this->get_russian_post_order()->get_shipping_city() ?: $this->get_russian_post_order()->get_billing_city(),
					$this->get_russian_post_order()->get_shipping_address_1() ?: $this->get_russian_post_order()->get_billing_address_1(),
					$this->get_russian_post_order()->get_shipping_address_2() ?: $this->get_russian_post_order()->get_billing_address_2()
				) ) ) );

				$normalize_address = new Address_Normalize( $clean_address );

			} catch ( \Exception $e ) {
				wc_russian_post_shipping()->log( sprintf( 'Error: %s in method %s', $e->getMessage(), __METHOD__ ) );
			}
		}

		return $normalize_address;
	}

	public function get_order_payment_cost() {
		return $this->order_needs_payment() ? $this->get_russian_post_order()->get_total() * 100 : 0;
	}

	public function get_order_insurance_cost() {
		return $this->get_order_payment_cost();
	}

	private function detect_box_size() {

		$item_dimensions = $this->get_items_dimensions();

		$item_values    = array(
			'height' => array_column( $item_dimensions, 'height' ),
			'width'  => array_column( $item_dimensions, 'width' ),
			'length' => array_column( $item_dimensions, 'length' )
		);

		$max_values = array(
			'height' => max( $item_values['height'] ),
			'width'  => max( $item_values['width'] ),
			'length' => max( $item_values['length'] )
		);

		$greatest_dimension = array_search( max( $max_values ), $max_values, true );

		foreach ( array_keys( wc_russian_post_get_dimension_type_sizes() ) as $key ) {
			$dimension = wc_russian_post_get_dimension_by_key( $key );
			if( $dimension['max_value'] > $max_values[ $greatest_dimension ] ) {
				return $key;
			}
		}

		return false;
	}

	/**
	 * @throws \Exception
	 */
	public function get_export_data() {

		if( ! $this->get_normalize_address() instanceof Address_Normalize ) {
			throw new \Exception( 'При формировании данных заказа произошла ошибка. Метод get_normalize_address не является экземпляром класса Address_Normalize' );
		}

		if( ! $this->get_shipment_type() ) {
			throw new \Exception( 'Не удалось получить тип отправления. Заказ не может быть экспортирован.' );
		}

		$export_data = array(
			'address-type-to'        => 'DEFAULT', //Тип адреса. (req)
			'area-to'                => $this->get_normalize_address()->get_area(), //Район
			'building-to'            => $this->get_normalize_address()->get_building(), //Часть здания: Строение
			'corpus-to'              => $this->get_normalize_address()->get_corpus(), //Часть здания: Корпус
			'hotel-to'               => $this->get_normalize_address()->get_hotel(), //Название гостиницы
			'house-to'               => $this->get_normalize_address()->get_house(), //Часть адреса: Номер здания (req)
			'letter-to'              => $this->get_normalize_address()->get_letter(), //Часть здания: Литера
			'location-to'            => $this->get_normalize_address()->get_location(), //Микрорайон
			'place-to'               => $this->get_normalize_address()->get_place(), //Населенный пункт (req)
			'region-to'              => $this->get_normalize_address()->get_region(), //Область, регион (req)
			'room-to'                => $this->get_normalize_address()->get_room(), //Часть здания: Номер помещения
			'street-to'              => $this->get_normalize_address()->get_street(), //Часть адреса: Улица (req)

			'order-num'              => $this->get_russian_post_order()->get_order_number(), //Номер заказа. Внешний идентификатор заказа, который формируется отправителем (req)
			'comment'                => $this->get_russian_post_order()->get_customer_note(), //Комментарий к заказу
			'mass'                   => $this->get_total_weight(), //Вес РПО (в граммах) (req)
			'mail-category'          => $this->get_mail_category(), //Категория РПО (req)
			'mail-direct'            => wc_russian_post_get_allow_country_codes( $this->get_russian_post_order()->get_shipping_country() ?: $this->get_russian_post_order()->get_billing_country() ), //Код страны. (req)
			'mail-type'              => $this->get_shipment_type(), //Вид РПО (req)
			'postoffice-code'        => strval( $this->get_site_setting( 'senderZipCode' ) ), //Индекс места приема

			'transport-type'         => $this->get_site_setting( 'transportType' ) //Возможный вид транспортировки (для международных отправлений).
		);

		if( $this->order_needs_payment() ) {
			$export_data = array_merge( $export_data, array(
				'insr-value'        => $this->get_order_insurance_cost(), //Объявленная ценность (копейки)
				'payment'           => $this->get_order_payment_cost(), //Сумма наложенного платежа (копейки)
				'payment-method'    => 'CASHLESS', //Способ оплаты
			) );
		}

		if( $this->is_ecom() ) {
			$export_data = array_merge( $export_data, array(
				'insr-value'        => $this->get_russian_post_order()->get_total() * 100, //Объявленная ценность (копейки)
			) );
		}

		$export_data = array_merge( $export_data, $this->get_recipient_data() );

		if( $this->is_international_shipping() ) {

			if( 'EMS_INT' === wc_strtoupper( $this->get_shipment_type() ) ) {
				$export_data['with-goods']     = true; //С товарами (для ЕМС международного)
				$export_data['with-documents'] = true; //С документами (для ЕМС международного)
			}

			$export_data['customs-declaration'] = array( //Таможенная декларация (для международных отправлений)
				'currency'         => $this->get_russian_post_order()->get_currency(), //Код валюты. (req)
				'customs-entries'  => $this->get_customs_entries(),
				'entries-type'     => 'SALE_OF_GOODS'
			);

			$export_data['str-index-to']   = $this->get_russian_post_order()->get_shipping_postcode() ?: $this->get_russian_post_order()->get_billing_postcode(); //Почтовый индекс (буквенно-цифровой) (req if international)

			$translate_fields = array( 'region-to', 'place-to', 'street-to', 'given-name', 'surname', 'recipient-name' );

			foreach ( $translate_fields as $field ) {
				if( isset( $export_data[ $field ] ) && ! empty( $export_data[ $field ] ) ) {
					$export_data[ $field ] = \Woodev_Helper::str_convert( $export_data[ $field ] );
				}
			}

		} else {

			$delivery_point = $this->get_shipping_rate_meta( 'delivery_point' );
			$is_postamat    = $this->get_russian_post_order()->is_postamat();

			if( 'postal' == $this->get_shipping_rate_meta( 'method_type' ) ) {

				if( in_array( wc_strtoupper( $this->get_shipment_type() ), array( 'ECOM', 'ECOM_MARKETPLACE' ), true ) || $is_postamat ) {

					$export_data['ecom-data'] = array(
						'delivery-point-index'  => $delivery_point['code'], //Идентификатор пункта выдачи заказов
						'identity-methods'      => $is_postamat ? array( 'PIN' ) : array( 'WITHOUT_IDENTIFICATION' )
					);

					$export_data['dimension-type'] = $this->detect_box_size() ?: wc_strtoupper( $this->get_site_setting( 'defaultBoxSize' ) ); //Типоразмер
				}

				if( $this->get_site_setting( 'useFragile') ) {
					$export_data['fragile'] = true; //Установлена ли отметка "Осторожно/Хрупкое"?
				}

				if( $this->get_site_setting( 'useSmsAlertByDefault' ) ) {
					$export_data['sms-notice-recipient'] = 1; //Признак услуги SMS уведомления
				}

				if( ! $is_postamat ) {
					$export_data['index-to'] = $delivery_point['postal_code'] ?: $this->get_normalize_address()->get_index();
				}


			} else {

				/** @var Address_Normalize $address */
				$address                 = $this->get_shipping_rate_meta( 'normalize_address' );
				$export_data['index-to'] = $address->get_index() ?: ( $this->get_russian_post_order()->get_shipping_postcode() ?: $this->get_russian_post_order()->get_billing_postcode() ); //Почтовый индекс, для отправлений адресованных в почтомат или пункт выдачи, должен использоваться объект "ecom-data"

				if( $this->get_site_setting( 'useFragileCourier' ) ) {
					$export_data['fragile'] = true; //Установлена ли отметка "Осторожно/Хрупкое"?
				}

				if( $this->get_site_setting( 'useSmsAlertByDefaultCourier' ) ) {
					$export_data['sms-notice-recipient'] = 1; //Признак услуги SMS уведомления
				}

				//TODO: Разобраться для чего нужны эти отметки
				//$export_data['courier']          = true; //Отметка "Курьер"
				//$export_data['delivery-to-door'] = true; //Отметка 'Доставка до двери'
			}
		}

		return apply_filters( 'wc_russian_post_order_otpravka_export_data', array_filter( $export_data ), $this->get_russian_post_order(), $this );
	}
}