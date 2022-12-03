<?php

defined( 'ABSPATH' ) or exit;

function wc_russian_post_get_courier_types() {
	return apply_filters( 'wc_russian_post_courier_types', array(
		'ONLINE_COURIER',
		'EMS',
		'EMS_OPTIMAL',
		'EMS_RT',
		'EMS_TENDER',
		'BUSINESS_COURIER',
		'BUSINESS_COURIER_ES'
	) );
}

function wc_russian_post_get_fragile_allowed_mail_types() {
	return apply_filters( 'wc_russian_post_fragile_allowed_mail_types', array( 'POSTAL_PARCEL' ) );
}

function wc_russian_post_get_allowed_sms_notice_mail_types() {
	return apply_filters( 'wc_russian_post_allowed_sms_notice_mail_types', array(
		'EMS',
		'EMS_OPTIMAL',
		'POSTAL_PARCEL',
		'PARCEL_CLASS_1',
		'ONLINE_PARCEL'
	) );
}

function wc_russian_post_get_allowed_content_check_mail_types() {
	return apply_filters( 'wc_russian_post_allowed_content_check_mail_types', array(
		'EMS_OPTIMAL',
		'POSTAL_PARCEL',
		'ONLINE_PARCEL'
	) );
}

function wc_russian_post_get_kind_of_parcel( $key = '' ) {
	
	$kinds = apply_filters( 'wc_russian_post_kind_of_parcel', array(
		'GIFT'				=> 'Подарок',
		'DOCUMENT'			=> 'Документы',
		'SALE_OF_GOODS'		=> 'Продажа товара',
		'COMMERCIAL_SAMPLE'	=> 'Коммерческий образец',
		'OTHER'				=> 'Прочее'
	) );
	
	if( ! empty( $key ) && isset( $kinds[ $key ] ) ) {
		return $kinds[ $key ];
	}
	
	return $kinds;
}

function wc_russian_post_get_category_parcel( $key = '' ) {
	
	$categories = apply_filters( 'wc_russian_post_category_parcel', array(
		'SIMPLE'										=> 'Простое',
		'ORDERED'										=> 'Заказное',
		'ORDINARY'										=> 'Обыкновенное',
		'WITH_DECLARED_VALUE'							=> 'С объявленной ценностью',
		'WITH_DECLARED_VALUE_AND_CASH_ON_DELIVERY'		=> 'С объявленной ценностью и наложенным платежом',
		'WITH_DECLARED_VALUE_AND_COMPULSORY_PAYMENT'	=> 'С объявленной ценностью и обязательным платежом',
		'WITH_COMPULSORY_PAYMENT'						=> 'С обязательным платежом',
	) );
	
	if( ! empty( $key ) && isset( $categories[ $key ] ) ) {
		return $categories[ $key ];
	}
	
	return $categories;
}

function wc_russian_post_get_transport_types( $key = '' ) {
	
	$types = apply_filters( 'wc_russian_post_transport_types', array(
		'SURFACE'	=> 'Наземный',
		'AVIA'		=> 'Авиа',
		'COMBINED'	=> 'Комбинированный',
		'EXPRESS'	=> 'Системой ускоренной почты',
		'STANDARD'	=> 'EMS Оптимальное'
	) );
	
	if( ! empty( $key ) && isset( $types[ $key ] ) ) {
		return $types[ $key ];
	}
	
	return $types;
}

function wc_russian_post_get_payment_method_types( $key = '' ) {
	
	$types = apply_filters( 'wc_russian_post_get_payment_method_types', array(
		'CASHLESS'				=> 'Безналичный расчет',
		'STAMP'					=> 'Оплата марками',
		'FRANKING'				=> 'Франкирование',
		'TO_FRANKING'			=> 'На франкировку',
		'ONLINE_PAYMENT_MARK'	=> 'Оплата онлайн'
	) );
	
	if( ! empty( $key ) && isset( $types[ $key ] ) ) {
		return $types[ $key ];
	}
	
	return $types;
}

function wc_russian_post_get_mail_types( $key = '' ) {
	
	$mail_types = wc_russian_post_shipping()->get_license_instance()->get_license_data();
	
	$types = apply_filters( 'wc_russian_post_mail_types', isset( $mail_types->mail_types ) ? ( array ) $mail_types->mail_types : array() );
	
	if( ! empty( $key ) && isset( $types[ $key ] ) ) {
		return $types[ $key ];
	}
	
	return $types;
}

function wc_russian_post_get_allow_country_codes( $key = '' ) {
	
	$codes = apply_filters( 'wc_russian_post_allow_country_codes', array(
		'RU' => 643,
		'AU' => 36,
		'AT' => 40,
		'AZ' => 31,
		'AX' => 949,
		'AL' => 8,
		'DZ' => 12,
		'AS' => 16,
		'AI' => 660,
		'AO' => 24,
		'AD' => 20,
		'AQ' => 10,
		'AG' => 28,
		'AR' => 32,
		'AM' => 51,
		'AW' => 533,
		'AF' => 4,
		'BS' => 44,
		'BD' => 50,
		'BB' => 52,
		'BH' => 48,
		'BY' => 112,
		'BZ' => 84,
		'BE' => 56,
		'BJ' => 204,
		'BM' => 60,
		'BG' => 100,
		'BO' => 68,
		'BQ' => 535,
		'BA' => 70,
		'BW' => 72,
		'BR' => 76,
		'VG' => 92,
		'BN' => 96,
		'BF' => 854,
		'BI' => 108,
		'BT' => 64,
		'VU' => 548,
		'VA' => 336,
		'GB' => 826,
		'HU' => 348,
		'VE' => 862,
		'VI' => 850,
		'UM' => 581,
		'TL' => 626,
		'VN' => 704,
		'GA' => 266,
		'HT' => 332,
		'GY' => 328,
		'GM' => 270,
		'GH' => 288,
		'GP' => 312,
		'GT' => 320,
		'GN' => 324,
		'GW' => 624,
		'DE' => 276,
		'GG' => 831,
		'GI' => 292,
		'HN' => 340,
		'HK' => 344,
		'GD' => 308,
		'GL' => 304,
		'GR' => 300,
		'GE' => 268,
		'GU' => 316,
		'DK' => 208,
		'JE' => 832,
		'DJ' => 262,
		'DM' => 212,
		'DO' => 214,
		'EG' => 818,
		'ZM' => 894,
		'EH' => 732,
		'ZW' => 716,
		'IL' => 376,
		'IN' => 356,
		'ID' => 360,
		'JO' => 400,
		'IQ' => 368,
		'IR' => 364,
		'IE' => 372,
		'IS' => 352,
		'ES' => 724,
		'IT' => 380,
		'YE' => 887,
		'CV' => 132,
		'KZ' => 398,
		'KY' => 136,
		'KH' => 116,
		'CM' => 120,
		'CA' => 124,
		'QA' => 634,
		'KE' => 404,
		'CY' => 196,
		'KI' => 296,
		'CN' => 156,
		'CC' => 166,
		'CO' => 170,
		'KM' => 174,
		'CG' => 180,
		'CD' => 178,
		'CR' => 188,
		'CI' => 384,
		'CU' => 192,
		'KW' => 414,
		'KG' => 417,
		'CW' => 531,
		'LA' => 418,
		'LV' => 428,
		'LS' => 426,
		'LR' => 430,
		'LB' => 422,
		'LY' => 434,
		'LT' => 440,
		'LI' => 438,
		'LU' => 442,
		'MU' => 480,
		'MR' => 478,
		'MG' => 450,
		'YT' => 175,
		'MO' => 446,
		'MK' => 807,
		'MW' => 454,
		'MY' => 458,
		'ML' => 466,
		'MV' => 462,
		'MT' => 470,
		'MA' => 504,
		'MQ' => 474,
		'MH' => 584,
		'MX' => 484,
		'FM' => 583,
		'MZ' => 508,
		'MD' => 498,
		'MC' => 492,
		'MN' => 496,
		'MS' => 500,
		'MM' => 104,
		'NA' => 516,
		'NR' => 520,
		'NP' => 524,
		'NE' => 562,
		'NG' => 566,
		'NL' => 528,
		'NI' => 558,
		'NU' => 570,
		'NZ' => 554,
		'NC' => 540,
		'NO' => 578,
		'AE' => 784,
		'OM' => 784,
		'BV' => 74,
		'IM' => 833,
		'NF' => 574,
		'CX' => 162,
		'SH' => 906,
		'HM' => 334,
		'CK' => 184,
		'PK' => 586,
		'PW' => 585,
		'PS' => 275,
		'PA' => 591,
		'PG' => 598,
		'PY' => 600,
		'PE' => 604,
		'PN' => 612,
		'PL' => 616,
		'PT' => 620,
		'PR' => 630,
		'RE' => 638,
		'RW' => 646,
		'RO' => 642,
		'SV' => 222,
		'WS' => 882,
		'SM' => 674,
		'ST' => 678,
		'SA' => 682,
		'SZ' => 748,
		'KP' => 410,
		'MP' => 580,
		'SC' => 690,
		'BL' => 652,
		'SX' => 534,
		'MF' => 534,
		'PM' => 666,
		'SN' => 686,
		'VC' => 670,
		'KN' => 659,
		'LC' => 662,
		'RS' => 662,
		'SG' => 702,
		'SY' => 760,
		'SK' => 760,
		'SI' => 705,
		'US' => 840,
		'SB' => 90,
		'SO' => 706,
		'SD' => 729,
		'SR' => 729,
		'SL' => 694,
		'TJ' => 762,
		'TW' => 158,
		'TH' => 764,
		'TZ' => 834,
		'TC' => 796,
		'TG' => 768,
		'TK' => 772,
		'TO' => 776,
		'TT' => 780,
		'TV' => 798,
		'TN' => 788,
		'TM' => 795,
		'TR' => 792,
		'UG' => 800,
		'UZ' => 860,
		'UA' => 804,
		'WF' => 876,
		'UY' => 858,
		'FO' => 234,
		'FJ' => 242,
		'PH' => 608,
		'FI' => 246,
		'FK' => 238,
		'FR' => 250,
		'GF' => 254,
		'PF' => 258,
		'TF' => 260,
		'HR' => 258,
		'CF' => 140,
		'TD' => 140,
		'ME' => 499,
		'CZ' => 203,
		'CL' => 152,
		'CH' => 756,
		'SE' => 752,
		'SJ' => 744,
		'LK' => 144,
		'EC' => 218,
		'GQ' => 226,
		'ER' => 232,
		'EE' => 233,
		'ET' => 231,
		'ZA' => 710,
		'GS' => 239,
		'KR' => 410,
		'SS' => 728,
		'JM' => 388,
		'JP' => 392
	) );
	
	if( ! empty( $key ) && isset( $codes[ $key ] ) ) {
		return $codes[ $key ];
	}
	
	return $codes;
}

function wc_russian_post_get_eeu_countries() {
	return apply_filters( 'wc_russian_post_eeu_countries', array(
		'KZ',
		'RU',
		'BY',
		'AM'
	) );
}

function wc_russian_post_get_custom_order_fields() {
	return apply_filters( 'wc_russian_post_custom_order_fields', array(
		'is_russian_post',
		'index_from',
		'entries_type',
		'dimension_type',
		'declared_value',
		'courier',
		'mail_type',
		'mail_category',
		'transport_type',
		'fragile',
		'package_height',
		'package_length',
		'package_width',
		'package_mass',
		'customer_notice',
		'completeness_checking',
		'contents_checking',
		'min_days',
		'max_days',
		'delivery_point_index'
	) );
}

function wc_russian_post_get_ecom_services( $code = '' ) {
	
	$services = apply_filters( 'wc_russian_post_ecom_services', array(
		'WITHOUT_SERVICE'			=> 'Без сервиса',
		'WITHOUT_OPENING'			=> 'Без вскрытия',
		'CONTENTS_CHECKING'			=> 'С проверкой вложения',
		'WITH_FITTING'				=> 'С примеркой',
		'COURIER_DELIVERY'			=> 'Доставка курьером',
		'PARTIAL_REDEMPTION'		=> 'С частичным выкупом',
		'FUNCTIONALITY_CHECKING'	=> 'С проверкой работоспособности',
	) );
	
	if( ! empty( $code ) && isset( $services[ $code ] ) ) {
		return $services[ $code ];
	}
	
	return $services;
}

function wc_russian_post_get_user_options() {
	return get_option( 'wc_russian_post_user_options', false );
}

function wc_russian_user_is_cod_enabled() {
	$user_options = wc_russian_post_get_user_options();
	return $user_options && isset( $user_options['cod_enabled'] ) && $user_options['cod_enabled'] ? true : false;
}

function wc_russian_post_delivery_points_table_is_empty() {
	
	global $wpdb;
	
	$table_name = sprintf( '%s%s%s', $wpdb->prefix, wc_russian_post_shipping()->get_method_id(), '_delivery_points' );
	
	if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_name}';" ) ) {
		
		$count = $wpdb->get_var( "SELECT COUNT(*) FROM {$table_name} WHERE city_name IS NOT NULL" );	
		
		return $count == 0 ? false : true;
	}
	
	return false;
}

function wc_russian_post_get_customer_coordinates() {
	
	$lang = get_locale() == 'ru_RU' ? 'ru' : 'en';
	$customer_ip = WC_Geolocation::get_ip_address();
	$transient_name = 'wc_russian_post_customer_ip_' . md5( $customer_ip ) . '_lang_' .$lang;
	$coorditanes = get_transient( $transient_name );
				
	if ( false === $coorditanes ) {
		
		$service_url = add_query_arg( array( 'lang' => $lang ), sprintf( 'http://ip-api.com/json/%s', $customer_ip ) );
		$response = wp_safe_remote_get( $service_url, array( 'timeout' => 2 ) );
					
		if ( ! is_wp_error( $response ) && $response['body'] ) {
						
			$data = json_decode( $response['body'] );
			$coorditanes = array(
				'lat'		=> isset( $data->lat ) ? $data->lat : '',
				'lon'		=> isset( $data->lon ) ? $data->lon : '',
				'country' 	=> isset( $data->countryCode ) ? $data->countryCode : '',
				'state' 	=> isset( $data->regionName ) ? $data->regionName : '',
				'postcode' 	=> isset( $data->zip ) ? $data->zip : '',
				'city' 		=> isset( $data->city ) ? $data->city : '',
				'IP'		=> $customer_ip,
				'lang'		=> $lang
			);
						
			set_transient( $transient_name, $coorditanes, WEEK_IN_SECONDS );
		}
	}
				
	return $coorditanes;
}

/**
* Передавать значения в cm.
*/
function wc_russian_post_is_oversize_dimension( $length = 0, $width = 0, $height = 0 ) {
	$size = array( $length, $width, $height );
	/*
	* Негабарит, если сумма сторон более 1400 мм или одна из сторон более 600 мм
	*/
	return ( array_sum( $size ) >= 140 ) || ( max( $size ) >= 60 );
}