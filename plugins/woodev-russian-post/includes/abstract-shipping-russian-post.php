<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

abstract class WC_Russian_Post_Shipping extends WC_Shipping_Method {
	
	private $default_boxes;
	
	public $geolocation_enable = false;
	
	private $package = array();
	
	protected $user_profile_options = array();
	
	public $is_ecom = false;
	
	private $currencies;
	
	public $shipping_point;
	
	public $integration;
	
	private $package_box_types = array(
		 'box' 		=> 'Коробка',
		 'tube' 	=> 'Туба',
		 'envelope' => 'Конверт',
		 'packet' 	=> 'Пакет'
	);
	
	public function __construct( $instance_id = 0 ) {
		
		$this->instance_id 	= absint( $instance_id );
		
		$this->supports           = array(
			'shipping-zones',
			'instance-settings'
		);
		
		$this->integration = WC()->integrations->get_integration( $this->get_plugin()->get_method_id() );
		
		$this->default_boxes	= include( dirname( __FILE__ ) . '/data/data-box-sizes.php' );
		
		$this->init_form_fields();
		$this->init_settings();
		
		//$this->set_settings();

		add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'process_admin_options' ) );
		add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'clear_transients' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'load_admin_scripts' ) );
		
		if ( ! has_action( 'woodev_' . $this->get_id() . '_api_request_performed' ) ) {
			add_action( 'woodev_' . $this->get_id() . '_api_request_performed', array( $this, 'log_api_request' ), 10, 2 );
		}
		
	}
	
	public function get_id() {
		return $this->id;
	}
	
	public function load_admin_scripts() {
		wp_enqueue_script( 'selectWoo' );
	}
	
	public function process_admin_options() {
		
		if( ! $this->get_plugin()->get_license_instance()->is_active() ) {
			return;
		}
		
		parent::process_admin_options();
		
		if( ! $this->is_configured() ) {
			$this->get_plugin()->get_admin_instance()->message_handler->add_error( sprintf( 'Для работы плагина "%s" вам необходимо указать ваш логин, пароль и API токен <a href="%s">на странице настроек плагина</a>', 
				$this->get_plugin()->get_plugin_name(),
				add_query_arg( array(
					'page'    => 'wc-settings',
					'tab'     => 'integration',
					'section' => wc_russian_post_shipping()->get_method_id(),
				), admin_url( 'admin.php' ) ) 
			) );
		}
		
	}
	
	public function is_ecom() {
		return false;
	}
	
	public function get_instance_form_fields() {
		
		$instance_form_fields = array();
		
		$instance_form_fields['title'] = array(
			'title'           => 'Название метода',
			'type'            => 'text',
			'default'         => 'Доставка ЕКОМ (Почта РФ)'
		);
		
		return $instance_form_fields;
	}
	
	public function admin_options() {	
		$this->get_plugin()->get_admin_instance()->message_handler->show_messages();
		parent::admin_options();
	}
	
	protected function is_configured() {
		return ! empty( $this->integration->get_option( 'account_name' ) ) && ! empty( $this->integration->get_option( 'account_password' ) ) && ! empty( $this->integration->get_option( 'account_token' ) );
	}
	
	public function generate_box_packing_html() {
		ob_start();
		include( 'views/html-box-packing.php' );
		return ob_get_clean();
	}
	
	public function generate_select_mail_type_html( $key, $data ) {
		ob_start();
		include( 'views/html-select-mail-type.php' );
		return ob_get_clean();
	}
	
	public function validate_box_packing_field( $key ) {
		$boxes_name       = isset( $_POST['boxes_name'] ) ? $_POST['boxes_name'] : array();
		$boxes_length     = isset( $_POST['boxes_length'] ) ? $_POST['boxes_length'] : array();
		$boxes_width      = isset( $_POST['boxes_width'] ) ? $_POST['boxes_width'] : array();
		$boxes_height     = isset( $_POST['boxes_height'] ) ? $_POST['boxes_height'] : array();
		$boxes_box_weight = isset( $_POST['boxes_box_weight'] ) ? $_POST['boxes_box_weight'] : array();
		$boxes_box_type   = isset( $_POST['boxes_box_type'] ) ? $_POST['boxes_box_type'] : array();
		$boxes_enabled    = isset( $_POST['boxes_enabled'] ) ? $_POST['boxes_enabled'] : array();

		$boxes = array();

		if ( ! empty( $boxes_length ) && sizeof( $boxes_length ) > 0 ) {
			for ( $i = 0; $i <= max( array_keys( $boxes_length ) ); $i ++ ) {

				if ( ! isset( $boxes_length[ $i ] ) )
					continue;

				if ( $boxes_length[ $i ] && $boxes_width[ $i ] && $boxes_height[ $i ] ) {

					$boxes[] = array(
						'name'       => wc_clean( $boxes_name[ $i ] ),
						'length'     => floatval( $boxes_length[ $i ] ),
						'width'      => floatval( $boxes_width[ $i ] ),
						'height'     => floatval( $boxes_height[ $i ] ),
						'box_weight' => floatval( $boxes_box_weight[ $i ] ),
						'box_type'   => in_array( $boxes_box_type[ $i ], $this->package_box_types ) ? wc_clean( $boxes_box_type[ $i ] ) : 'box',
						'enabled'    => isset( $boxes_enabled[ $i ] ) ? true : false
					);
				}
			}
		}
		foreach ( $this->default_boxes as $box ) {
			$boxes[ $box['id'] ] = array(
				'enabled' => isset( $boxes_enabled[ $box['id'] ] ) ? true : false
			);
		}
		return $boxes;
	}
	
	public function validate_select_mail_type_field( $key ) {
		$mail_type  = $_POST[ $this->get_field_key( 'mail_type' ) ];
		
		if( array_key_exists( str_replace( 'INTERNATIONAL_', '', $mail_type ), wc_russian_post_get_mail_types() ) ) {
			return $mail_type;
		}
	}
	
	protected function set_verify_code( $field ) {
		
		if ( ! $this->get_plugin()->get_license_instance()->is_active() && 'title' !== $field['type'] ) {
			if( ! isset( $field['class'] ) ) {
				$field['class'] = '';
			}
			$field['class'] .= ' woodev-modal';
		}
		
		return $field;
	}
	
	public function get_packages( $package ) {
		switch ( $this->packing_method ) {
			case 'box_packing' :
				return $this->box_shipping( $package );
			break;
			case 'per_item' :
			default :
				return $this->per_item_shipping( $package );
			break;
		}
	}
	
	private function box_shipping( $package ) {
		if ( ! class_exists( 'WC_Boxpack' ) ) {
			include_once 'box-packer/class-wc-boxpack.php';
		}
		
		$length = $width = $height = $weight = 0;
		$package_id = null;

		$boxpack = new WC_Boxpack();
		
		foreach ( $this->default_boxes as $key => $box ) {
			$box['enabled'] = isset( $this->boxes[ $box['id'] ]['enabled'] ) ? $this->boxes[ $box['id'] ]['enabled'] : true;
			$this->boxes[] = $box;
		}
		
		foreach ( $this->boxes as $key => $box ) {
			if ( ! is_numeric( $key ) ) {
				continue;
			}

			if ( ! $box['enabled'] ) {
				continue;
			}

			$newbox = $boxpack->add_box( $box['length'], $box['width'], $box['height'], $box['box_weight'] );

			if ( isset( $box['id'] ) ) {
				$newbox->set_id( current( explode( ':', $box['id'] ) ) );
			}
			
			if( isset( $box['box_type'] ) ) {
				$newbox->set_type( $box['box_type'] );
			}
		}
		
		foreach ( $package['contents'] as $item_id => $values ) {
			if ( ! $values['data']->needs_shipping() ) {
				$this->get_plugin()->log( sprintf( 'Товар %s виртуальный.', $item_id ) );
				continue;
			}
			
			$_length = wc_get_dimension( $values['data']->get_length(), 'cm' );
            $_width  = wc_get_dimension( $values['data']->get_width(), 'cm' );
            $_height = wc_get_dimension( $values['data']->get_height(), 'cm' );
            $_weight = wc_get_weight( $values['data']->get_weight(), 'g' );
				
			$_height = $_height > 0 ? $_height : wc_get_dimension( $this->integration->get_option( 'minimum_height' ), 'cm', 'mm' );
            $_width  = $_width > 0 ? $_width : wc_get_dimension( $this->integration->get_option( 'minimum_width' ), 'cm', 'mm' );
            $_length = $_length > 0 ? $_length : wc_get_dimension( $this->integration->get_option( 'minimum_length' ), 'cm', 'mm' );
            $_weight = $_weight > 0 ? $_weight : $this->integration->get_option( 'minimum_weight' );
			
			for ( $i = 0; $i < $values['quantity']; $i ++ ) {
				$boxpack->add_item( $_width, $_height, $_length, $_weight, $values['data']->get_price() );
			}
		}
		
		$boxpack->pack();
		$packages = $boxpack->get_packages();
		
		foreach ( $packages as $package_dimension ) {
			$length += max( 1, round( intval( $package_dimension->length ), 2 ) );
			$width  += max( 1, round( intval( $package_dimension->width ), 2 ) );
			$height += max( 1, round( intval( $package_dimension->height ), 2 ) );
			$weight += max( 0, round( intval( $package_dimension->weight ), 2 ) );
		}
		
		if( count( $packages ) === 1 ) {
			$package_id = $packages[0]->id;
		}
		
		return array(
			'length'		=> $length,
			'height'		=> $height,
			'width'			=> $width,
			'weight'		=> $weight,
			'package_id'	=> $package_id
		);
	}
	
	private function per_item_shipping( $package ) {
		
		if( ! class_exists( 'WD_Russain_Post_Package' ) ) {
			include_once( 'class-package.php' );
		}
		
		$package = new WD_Russain_Post_Package( $package );
		
		$default_width = wc_get_dimension( $this->integration->get_option( 'minimum_width' ), 'cm', 'mm' );
		$default_height = wc_get_dimension( $this->integration->get_option( 'minimum_height' ), 'cm', 'mm' );
		$default_length = wc_get_dimension( $this->integration->get_option( 'minimum_length' ), 'cm', 'mm' );
		
		$package->set_minimum_dimension( $default_width, $default_height, $default_length, $this->integration->get_option( 'minimum_weight' ) );
		
		return array_merge( array( 'package_id' => null ), $package->get_data() );
	}
	
	public function is_valid_package_destination( $package ) {

		$country  = isset( $package['destination']['country'] ) ? $package['destination']['country'] : '';
		$postcode = isset( $package['destination']['postcode'] ) ? $package['destination']['postcode'] : '';
			
		if ( empty( $country ) ) {
			$this->get_plugin()->log( 'Расчёт стоимости отменён - не указана страна' );
			return false;
		}
			
		if ( 'RU' == $country && ! WC_Validation::is_postcode( $postcode, $country ) ) {
			$this->get_plugin()->log( 'Расчёт стоимости отменён - неправильно указан индекс' );
			return false;
		}

		return true;

	}
	
	protected function dispatch_rate( $shipping_params, $meta = array() ) {
		
		try {
				
			$request = $this->get_plugin()->get_api()->get_tariff( apply_filters( 'wc_russian_post_shipping_params', $shipping_params, $this->package ) );
				
			if( ! empty( $request ) && isset( $request['cost'] ) ) {
				return $request;
			}
			
		} catch( Woodev_API_Exception $e ) {
				
			$this->get_plugin()->log( $e->getMessage() );
		}
		
		return false;
	}
	
	protected function get_rate_cost( $cost, $package = array() ) {
		
		if( empty( $package ) ) {
			$package = $this->package;
		}
		
		$raw_cost = $cost;
		
		if( $this->static_price > 0 ) {
			$cost = $this->static_price * 100;
		}
		
		if( $this->free_cost > 0 && $this->free_cost <= $package['contents_cost'] ) {
			return 0;
		}
		
		$total = $this->fee_type == 'order' ? $package['contents_cost'] : ( $raw_cost / 100 );
		
		$cost = apply_filters( 'wc_russian_post_get_rate_cost', ( intval( $cost ) / 100 ) + intval( $this->get_fee( $this->fee, $total ) ), $package );
		
		return $cost;
	}
	
	public function declared_cost( $package ) {
		$cost = 0;
		$total = $package['contents_cost'];
		
		if( 'wc_russian_post_cod' == $this->get_payment_method() ) {
			return $total * 100;
		}
		
		if ( strstr( $this->declared_cost, '%' ) ) {
			$cost = ( $total / 100 ) * str_replace( '%', '', $this->declared_cost ) * 100;
		} elseif( $this->declared_cost > 0 ) {
			$cost = $this->declared_cost * 100;
		}
		
		return $cost;
	}
	
	public function get_payment_method() {
		return WC()->session ? WC()->session->get( 'chosen_payment_method' ) : Woodev_Helper::get_post( 'payment_method' );
	}
	
	public function get_dimension_type( $package = array() ) {
		
		$type = 'S';
		
		if( wc_russian_post_is_oversize_dimension( $package['length'], $package['width'], $package['height'] ) ) {
			$type = 'OVERSIZED';
		} elseif( $package['length'] < 300 && $package['width'] < 200 && $package['height'] < 150 ) {
			$type = 'M';
		} elseif( $package['length'] < 400 && $package['width'] < 270 && $package['height'] < 180 ) {
			$type = 'L';
		} elseif( $package['length'] < 530 && $package['width'] < 360 && $package['height'] < 220 ) {
			$type = 'XL';
		}
		
		return $type;
	}
	
	public function clear_transients() {
		global $wpdb;

		$wpdb->query( "DELETE FROM `$wpdb->options` WHERE `option_name` LIKE ('_transient_wc_russian_post_%') OR `option_name` LIKE ('_transient_timeout_wc_russian_post_%')" );
	}
	
	public function is_available( $package ) {
		
		$available = parent::is_available( $package );
		
		if ( ! $this->is_configured() ) {
			$available = false;
		}
		
		if ( ! $this->currency_is_accepted() ) {
			$available = false;
		}
		
		if( isset( $this->max_price ) && $this->max_price > 0 && $package['contents_cost'] > $this->max_price ) {
			$available = false;
		}
		
		if ( isset( $this->min_price ) && $this->min_price > 0 && $package['contents_cost'] < $this->min_price ) {
			$available = false;
		}
		
		return apply_filters( 'woocommerce_shipping_' . $this->get_id() . '_is_available', $available, $package, $this );
	}
	
	public function currency_is_accepted( $currency = null ) {
	
		if ( ! $this->currencies ) {
			return true;
		}
		
		if ( is_null( $currency ) ) {
			$currency = get_woocommerce_currency();
		}

		return in_array( $currency, $this->currencies );
	}
	
	public function is_method_chosen() {
		return in_array( $this->get_id(), wc_get_chosen_shipping_method_ids() );
	}
	
	public function log_api_request( $request, $response ) {

		$this->add_debug_message( wc_russian_post_shipping()->get_api_log_message( $request ), 'message' );
		
		if ( ! empty( $response ) ) {
			$this->add_debug_message( wc_russian_post_shipping()->get_api_log_message( $response ), 'message' );
		}
	}
	
	protected function add_debug_message( $message, $type = 'message' ) {

		$debug_mode = $this->integration->get_option( 'debug_mode' );
		
		if ( ( ! $debug_mode || 'yes' !== $debug_mode ) || ! $message ) {
			return;
		}
		
		wc_russian_post_shipping()->log( $message, $this->get_id() );
	}
	
	public function get_plugin() {
		return wc_russian_post_shipping();
	}
	
	protected function get_shipping_classes_options() {
		$shipping_classes = WC()->shipping->get_shipping_classes();
		$options          = array(
			'-1' => 'Любой класс доставки',
			'0'  => 'Без класса доставки',
		);

		if ( ! empty( $shipping_classes ) ) {
			$options += wp_list_pluck( $shipping_classes, 'name', 'term_id' );
		}

		return $options;
	}
	
	protected function has_only_selected_shipping_class( $package ) {
		$only_selected = true;

		if ( -1 === $this->shipping_class_id ) {
			return $only_selected;
		}

		foreach ( $package['contents'] as $item_id => $values ) {
			$product = $values['data'];
			$qty     = $values['quantity'];

			if ( $qty > 0 && $product->needs_shipping() ) {
				if ( $this->shipping_class_id !== $product->get_shipping_class_id() ) {
					$only_selected = false;
					break;
				}
			}
		}

		return $only_selected;
	}
}