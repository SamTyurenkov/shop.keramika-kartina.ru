<?php

defined( 'ABSPATH' ) or exit;

function wc_russian_post_get_user_options() {
	return get_option( 'wc_russian_post_user_options', false );
}

/**
 * @see https://otpravka.pochta.ru/specification#/enums-base-mail-type
 * @return array|null
 */
function wc_russian_post_get_parcel_types() {
	return apply_filters( 'wc_russian_post_parcel_types', array(
		'POSTAL_PARCEL'            => __( 'Parcel', 'woocommerce-russian-post' ),
		'ONLINE_PARCEL'            => __( 'Online parcel', 'woocommerce-russian-post' ),
		'ONLINE_COURIER'           => __( 'Online courier', 'woocommerce-russian-post' ),
		'EMS'                      => __( 'EMS', 'woocommerce-russian-post' ),
		'EMS_OPTIMAL'              => __( 'EMS optimal', 'woocommerce-russian-post' ),
		'EMS_RT'                   => __( 'EMS RT', 'woocommerce-russian-post' ),
		'BUSINESS_COURIER'         => __( 'Business courier', 'woocommerce-russian-post' ),
		'BUSINESS_COURIER_ES'      => __( 'Business courier express', 'woocommerce-russian-post' ),
		'PARCEL_CLASS_1'           => __( 'Parcel 1-st class', 'woocommerce-russian-post' ),
		'SMALL_PACKET'             => __( 'Small packet', 'woocommerce-russian-post' ),
		'ECOM'                     => __( 'ECOM', 'woocommerce-russian-post' ),
		'ECOM_MARKETPLACE'         => __( 'ECOM Marketplace', 'woocommerce-russian-post' ),
		'ECOM_MARKETPLACE_COURIER' => __( 'ECOM Marketplace courier', 'woocommerce-russian-post' ),
		'COMBINED'                 => __( 'Combined parcel', 'woocommerce-russian-post' )
	) );
}

function wc_russian_post_get_parcel_type( $type = '' ) {

	$parcel_types     = wc_russian_post_get_parcel_types();
	$type             = wc_strtoupper( $type );
	$is_international = false;

	if ( Woodev_Helper::str_ends_with( $type, '_INT' ) ) {
		$type             = str_replace( '_INT', '', $type );
		$is_international = true;
	}

	if ( isset( $parcel_types[ $type ] ) ) {

		$name = $parcel_types[ $type ];

		if ( $is_international ) {
			$name = sprintf( '%s %s', $name, __( 'International', 'woocommerce-russian-post' ) );
		}

		return $name;
	}

	return $type;
}

function wc_russian_post_is_allow_edostavka_address_suggestions() {

	$edostavka_instance = wc_russian_post_shipping()->get_integrations_instance()->get_edostavka_instance();

	if ( $edostavka_instance ) {

		return in_array( true, array(
			( ! in_array( $edostavka_instance->get_settings( 'enable_dropdown_city_field', 'enable' ), array(
					'enable',
					'zone'
				), true ) && in_array( true, array(
					wc_string_to_bool( $edostavka_instance->get_settings( 'enable_suggestions_state', 'no' ) ),
					wc_string_to_bool( $edostavka_instance->get_settings( 'enable_suggestions_city', 'no' ) )
				), true ) ),
			wc_string_to_bool( $edostavka_instance->get_settings( 'enable_suggestions_address', 'no' ) )
		), true );
	}

	return false;
}

function wc_russian_post_is_enable_address_suggestions() {

	if( wc_russian_post_is_allow_edostavka_address_suggestions() ) {
		return false;
	}

	$settings_instance = get_option( sprintf( 'woocommerce_%s_settings', wc_russian_post_shipping()->get_method_id() ), array() );

	return in_array( true, array(
		wc_string_to_bool( $settings_instance[ 'enable_state_suggestions' ] ?: 'yes' ),
		wc_string_to_bool( $settings_instance[ 'enable_city_suggestions' ] ?: 'yes' ),
		wc_string_to_bool( $settings_instance[ 'enable_address_suggestions' ] ?: 'yes' )
	), true );
}

/**
 * @return bool|Woodev\Russian_Post\Abstracts\Abstract_Shipping_Method
 */
function wc_russian_post_get_chosen_method_instance() {

	$is_frontend = is_cart() || is_account_page() || is_checkout() || is_customize_preview();

	if ( $is_frontend && WC()->session ) {

		$chosen_shipping_methods_session = WC()->session->get( 'chosen_shipping_methods', array() );

		if ( ! empty( $chosen_shipping_methods_session ) ) {

			$method_instance = false;

			foreach ( $chosen_shipping_methods_session as $package_key => $chosen_package_rate_id ) {

				if ( Woodev_Helper::str_starts_with( $chosen_package_rate_id, wc_russian_post_shipping()->get_method_id() ) ) {

					list( $method_id, $instance_id ) = explode( ':', $chosen_package_rate_id );

					$method_instance = WC_Shipping_Zones::get_shipping_method( $instance_id );

					if ( $method_instance instanceof \Woodev\Russian_Post\Abstracts\Abstract_Shipping_Method ) {
						break;
					}
				}
			}

			if ( $method_instance ) {
				return $method_instance;
			}
		}
	}

	return false;
}

/**
 * Removes prefix of address part if it exists
 *
 * @param string $address Original address part string
 * @param string $type    Type of address part. Must be city or region
 *
 * @return false|string
 */
function wc_russian_post_clear_address_part( $address = '', $type = 'city' ) {
	if ( empty( $address ) ) {
		return false;
	}

	switch ( $type ) {
		case 'city' :
			$address = str_ireplace(
				array(
					'г. ',
					' г.',
					'г ',
					'город',
					' дер.',
					'дер. ',
					'дер ',
					'пос. ',
					' пос.',
					'пос ',
					'c ',
					'c. ',
					'cел ',
					'cел. ',
					'поселок',
					'деревня',
					'село'
				),
				__return_empty_string(),
				$address
			);
			break;
		case 'region' :
			$address = str_ireplace(
				array(
					'обл. ',
					'обл ',
					' обл.',
					'область',
					'р-н',
					'район'
				),
				__return_empty_string(),
				$address
			);
			break;
	}

	return trim( $address );
}

function wc_russian_post_get_order_statuses() {
	return apply_filters( 'wc_russian_post_order_statuses', array(
		'new'        => __( 'New', 'woocommerce-russian-post' ),
		'exported'   => __( 'Exported', 'woocommerce-russian-post' ),
		'accepted'   => __( 'Accepted', 'woocommerce-russian-post' ),
		'dispatched' => __( 'In delivery', 'woocommerce-russian-post' ),
		'failed'     => __( 'Failed', 'woocommerce-russian-post' ),
		'delivered'  => __( 'Delivered', 'woocommerce-russian-post' ),
		'canceled'   => __( 'Canceled', 'woocommerce-russian-post' ),
	) );
}

function wc_russian_post_get_order_status( $key = '' ) {
	$statuses = wc_russian_post_get_order_statuses();

	return isset( $statuses[ $key ] ) ? $statuses[ $key ] : null;
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

	if ( ! empty( $key ) && isset( $codes[ $key ] ) ) {
		return $codes[ $key ];
	}

	return $codes;
}

/**
 * @see https://otpravka.pochta.ru/specification#/enums-dimension-type
 *
 * @return array[]
 */
function wc_russian_post_get_dimension_type_sizes() {
	return array(
		'S'  => array( 260, 170, 80 ),
		'M'  => array( 300, 200, 150 ),
		'L'  => array( 400, 270, 180 ),
		'XL' => array( 530, 260, 220 )
	);
}

function wc_russian_post_get_dimension_by_key( $key ) {

	$sizes = wc_russian_post_get_dimension_type_sizes();
	$key   = wc_strtoupper( $key );

	if ( ! in_array( $key, array_keys( $sizes ), true ) ) {
		return false;
	}

	return array(
		'dimensions' => $sizes[ $key ],
		'max_value'  => max( $sizes[ $key ] ),
		'volume'     => array_product( $sizes[ $key ] )
	);
}

function wc_russian_post_get_best_match_postal_code( array $codes ) {

	$filtered_codes = array_filter( $codes, function ( $code ) {
		return substr( strval( $code ), - 3 ) === '000';
	} );

	if ( count( $filtered_codes ) > 0 ) {
		return reset( $filtered_codes );
	}

	return reset( $codes );
}

function wc_russian_post_get_counts_order_status() {
	global $wpdb;

	$query = "
				SELECT {$wpdb->postmeta}.meta_value AS status, COUNT(*) AS count
				FROM {$wpdb->posts}
				INNER JOIN {$wpdb->postmeta} ON ({$wpdb->posts}.ID = {$wpdb->postmeta}.post_id)
				WHERE {$wpdb->posts}.post_type = 'shop_order'
				AND ({$wpdb->postmeta}.meta_key = '_wc_russian_post_status')
				AND {$wpdb->posts}.post_status NOT IN ( 'auto-draft', 'draft', 'trash' )
				GROUP BY {$wpdb->postmeta}.meta_value";

	return $wpdb->get_results( $query );
}

//Add cron action hook. It updates the history of delivering
add_action( 'wc_russian_post_orders_update', 'wc_russian_post_update_all_orders' );

function wc_russian_post_update_all_orders() {

	$query = new WP_Query( apply_filters( 'wc_russian_post_update_orders_query_args', array(
		'post_type'   => wc_get_order_types( 'view-orders' ),
		'post_status' => array_keys( wc_get_order_statuses() ),
		'nopaging'    => true,
		'meta_query'  => array(
			array(
				'key'     => '_wc_russian_post_is_russian_post',
				'compare' => 'EXISTS'
			),
			array(
				'key'     => '_wc_russian_post_tracking_number',
				'compare' => 'EXISTS'
			),
			array(
				'key'     => '_wc_russian_post_status',
				'value'   => array( 'new', 'failed', 'delivered', 'canceled' ),
				'compare' => 'NOT IN'
			),
		)
	) ) );

	$query->set( 'fields', 'ids' );

	foreach ( $query->get_posts() as $order_id ) {

		$order = new Woodev\Russian_Post\Classes\Order( $order_id );

		$order->update_tracking_history( true );
	}

	if ( $query->post_count ) {
		wc_russian_post_shipping()->log( sprintf( _n( 'Updated information for %d order.', 'Updated information for %d orders.', $query->post_count, 'woocommerce-russian-post' ), $query->post_count ) );
	}

	return $query->post_count;
}

function wc_russian_post_get_site_setting( $setting, $default = null, $force = false ) {

	$site_settings = wc_russian_post_shipping()->get_site_settings( $force );

	if ( isset( $site_settings->$setting ) ) {
		return $site_settings->$setting;
	}

	return $default;
}

function wc_russian_post_get_allowed_shipment_types() {

	$types          = array();
	$shipment_types = wc_russian_post_get_site_setting( 'shipmentPriorities', array() );

	foreach ( $shipment_types as $shipment ) {
		if ( $shipment->enabled && in_array( wc_strtoupper( $shipment->shipmentType ), array_keys( wc_russian_post_get_parcel_types() ), true ) ) {
			$types[ $shipment->shipmentType ] = array(
				'id'       => $shipment->id,
				'type'     => wc_strtoupper( $shipment->shipmentType ),
				'priority' => $shipment->priority
			);
		}
	}

	uasort( $types, function ( $a, $b ) {
		if ( $a['priority'] === $b['priority'] ) {
			return 0;
		}

		return ( $a['priority'] > $b['priority'] ) ? 1 : - 1;
	} );

	return $types;
}