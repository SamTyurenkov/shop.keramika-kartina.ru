<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WC_Russian_Post_Shipping_Simple extends WC_Russian_Post_Shipping {
	
	public function __construct( $instance_id = 0 ) {
		
		parent::__construct( $instance_id );
		
		$this->id					= $this->get_plugin()->get_method_id();
		$this->method_title       	= 'Почта России (WooDev)';
		$this->method_description 	= 'Расчёт доставки через ФГУП Почта России';
		
		$this->set_settings();
	}
	
	public function is_ecom() {
		return false;
	}
	
	public function is_available( $package ) {
		$available = parent::is_available( $package );
		
		if ( empty( $package['destination']['postcode'] ) ) {
			$available = false;
		}
		
		if( ! in_array( $package['destination']['country'], array_keys( wc_russian_post_get_allow_country_codes() ), true ) ) {
			$available = false;
		}

		return apply_filters( 'woocommerce_shipping_' . $this->id . '_is_available', $available, $package );
	}
	
	public function set_settings() {
		
		$this->title				= $this->get_option( 'title', $this->method_title );
		$this->packing_method   	= $this->get_option( 'packing_method', 'per_item' );
		$this->shipping_point   	= $this->get_option( 'shipping_point' );
		$this->boxes            	= $this->get_option( 'boxes', array() );
		$this->mail_type   			= $this->get_option( 'mail_type', '' );
		$this->declared_cost   		= $this->get_option( 'declared_cost', '0' );
		$this->is_courier   		= $this->get_option( 'is_courier', 'no' );
		$this->is_fragile   		= $this->get_option( 'is_fragile', 'no' );
		$this->completeness_check	= $this->get_option( 'completeness_check', 'no' );
		$this->enable_sms_notice   	= $this->get_option( 'enable_sms_notice', 'no' );
		$this->fee   				= $this->get_option( 'fee' );
		$this->fee_type   			= $this->get_option( 'fee_type', '' );
		$this->min_price   			= $this->get_option( 'min_price', '' );
		$this->max_price   			= $this->get_option( 'max_price', '' );
		$this->static_price   		= $this->get_option( 'static_price', '' );
		$this->free_cost   			= $this->get_option( 'free_cost', '' );
		$this->shipping_class_id  	= (int) $this->get_option( 'shipping_class_id', '-1' );
		$this->show_delivery_time   = $this->get_option( 'show_delivery_time', 'no' );
		$this->additional_time   	= $this->get_option( 'additional_time', '0' );
		$this->description_rate   	= $this->get_option( 'description_rate', '' );
		
		return true;
	}
	
	public function get_instance_form_fields() {
		
		$instance_form_fields = parent::get_instance_form_fields();
		
		if( ! $this->is_configured() ) {
			
			return $instance_form_fields;
		}
		
		$user_options = wc_russian_post_get_user_options();
		
		$instance_form_fields['parcel_options'] = array(
			'title'	=> 'Параметры отправки',
			'type'	=> 'title'
		);
			
		if( $user_options['api_enabled'] ) {
				
			$shipping_point_options = $mail_type_options = array();
				
			foreach( $user_options['shipping_points'] as $point ) {
				
				if( ! $point->enabled ) {
					continue;
				}
				
				$post_code = $point->{'operator-postcode'};
				$shipping_point_options[ $post_code ] = $point->{'ops-address'};
				
				$this->user_profile_options[ $post_code ] = array(
					'courier'	=> $point->{'courier-call'} ? true : false
				);
				
				if( $point->{'available-mail-types'} ) {
					
					if( count( $point->{'available-mail-types'} ) == 1 && $point->{'available-mail-types'}[0] == 'ECOM' ) {
						unset( $shipping_point_options[ $post_code ] );
						continue;
					}
					
					foreach( ( array ) $point->{'available-mail-types'} as $type ) {
						if( $type == 'ECOM' ) {
						 continue;
						}
						
						$type_name = wc_russian_post_get_mail_types( $type );
						if( $type_name && is_string( $type_name ) ) {
							$mail_type_options[ $post_code ][ $type ] = $type_name;
						}
					}
				}
				
				if( $point->{'available-products'} ) {
					
					foreach( ( array ) $point->{'available-products'} as $product ) {
						if( ! in_array( $product->{'mail-type'}, array_keys( $mail_type_options[ $post_code ] ) ) ) {
							continue;
						}
						
						if( 0 === strpos( $product->{'product-type'}, 'INTERNATIONAL_' ) ) {
							$mail_type_options[ $post_code ][ 'INTERNATIONAL_' . $product->{'mail-type'} ] = sprintf( '%s (международная)', wc_russian_post_get_mail_types( $product->{'mail-type'} ) );
						}
						
						$this->user_profile_options[ $post_code ]['mail_category'][ $product->{'mail-type'} ][] = $product->{'mail-category'};
					}
				}
			}
				
			if( count( $shipping_point_options ) > 0 ) {
				$instance_form_fields['shipping_point'] = array(
					'title'           => 'Отделение отправки',
					'type'            => 'select',
					'default'         => $user_options['shipping_points'][0]->{'operator-postcode'},
					'options'         => $shipping_point_options,
					'custom_attributes'	=> array(
						'data-mail_types'	=> htmlspecialchars( wp_json_encode( $mail_type_options ) )
					)
				);
					
				$instance_form_fields['mail_type'] = array(
					'type'		=> 'select_mail_type',
					'options'	=> $mail_type_options
				);
					
			}				
				
		}
		
		$instance_form_fields['declared_cost'] = array(
			'title'           => 'Объявленная ценность',
			'type'            => 'text',
			'default'         => '0',
			'description'	  => 'Укажите значение объявленной ценности. Можно указать как целое число (в рублях), так и в процентах (например 250 или 10%). Укажите ноль или оставьте пустым, что бы не передавать ОЦ.'
		);
		
		$courier_allow = array();
		
		foreach( wc_russian_post_get_courier_types() as $courier ) {
			$courier_allow[] = wc_russian_post_get_mail_types( $courier );
		}
		
		$instance_form_fields['is_courier'] = array(
			'title'           => 'Курьерская доставка',
			'type'            => 'checkbox',
			'default'         => 'no',
			'label'			  => 'Это курьерская доставка',
			'desc_tip'        => sprintf( 'Отметьте эту опцию если хотите, что бы данный метод доставки был курьерским. Доступно только для: %s.', implode( ', ', $courier_allow ) )
		);
		
		if( isset( $this->user_profile_options[ $this->shipping_point ], $this->user_profile_options[ $this->shipping_point ]['courier'] ) ) {
			
			if( false === $this->user_profile_options[ $this->shipping_point ]['courier'] ) {
				$instance_form_fields['is_courier']['custom_attributes'] = array( 'disabled' => 'disabled', 'checked' => '' );
			} else {
				unset( $instance_form_fields['is_courier']['custom_attributes']['disabled'] );
			}
			
		}
		
		$fragile_allow = array();
		
		foreach( wc_russian_post_get_fragile_allowed_mail_types() as $fragile_type ) {
			$fragile_allow[] = wc_russian_post_get_mail_types( $fragile_type );
		}
		
		$instance_form_fields['is_fragile'] = array(
			'title'           => 'Хрупкий товар',
			'type'            => 'checkbox',
			'default'         => 'no',
			'label'			  => 'Отметка "Осторожно/Хрупко"',
			'desc_tip'        => sprintf( 'Отметьте эту опцию если отправляемый вами товар является хрупким. Доступно только для: %s.', implode( ',', $fragile_allow ) )
		);
		
		$instance_form_fields['completeness_check'] = array(
			'title'           => 'Проверка комплектности',
			'type'            => 'checkbox',
			'default'         => 'no',
			'label'			  => 'Включить услугу проверки комплектности'
		);
		
		$instance_form_fields['cost_settings'] = array(
			'title'           => 'Настройка стоимости',
			'type'            => 'title'
		);
		
		$instance_form_fields['fee'] = array(
			'title'       	=> 'Наценка на доставку',
			'type'        	=> 'text',
			'desc_tip' 		=> 'Введите наценку котороя будет прибавляться к стоимости доставки. Например 250 или 5%. Оставьте пустым что бы не использовать эту опцию.',
			'placeholder' 	=> wc_format_localized_price( 0 ),
		);
		
		$instance_form_fields['fee_type'] = array(
			'title'			=> 'Тип наценки',
			'type'			=> 'select',
			'desc_tip'		=> 'Выберите как применять наценку',
			'default'		=> 'order',
			'options'		=> array(
				'order'		=> 'Прибавлять к стоимости заказа',
				'shipping'	=> 'Прибавлять к стоимости доставки'
			)
		);
		
		$instance_form_fields['min_price'] = array(
			'title'			=> 'Минимальная сумма',
			'type'			=> 'price',
			'desc_tip'		=> 'Установите минимальную сумму заказа после которого будет отображатся этот метод. Оставьте пустым, что бы не использовать эту опцию.',
			'placeholder' 	=> wc_format_localized_price( 0 )
		);
		
		$instance_form_fields['max_price'] = array(
			'title'			=> 'Максимальная сумма',
			'type'			=> 'price',
			'desc_tip'		=> 'Установите максимальную сумму заказа до которой будет отображатся этот метод. Оставьте пустым, что бы не использовать эту опцию.',
			'placeholder' 	=> wc_format_localized_price( 0 )
		);
		
		$instance_form_fields['static_price'] = array(
			'title'			=> 'Фиксированная стоимость',
			'type'			=> 'price',
			'desc_tip'    	=> 'Укажите фиксированную стоимость для этого метода. Реальная стоимость будет проигнорирована.',
			'placeholder' 	=> wc_format_localized_price( 0 )
		);
		
		$instance_form_fields['free_cost'] = array(
			'title'			=> 'Бесплатная доставка',
			'type'			=> 'price',
			'desc_tip'		=> 'Укажите сумму заказа при достижении которой данный метод доставки будет бесплатным. Оставьте пустым, что бы не использовать эту опцию.',
			'placeholder' 	=> wc_format_localized_price( 0 )
		);
		
		$instance_form_fields['shipping_class_id'] = array(
			'title'			=> 'Класс доставки',
			'type'        	=> 'select',
			'description' 	=> 'При необходимости выберете класс доставки который будет применен к этому методу доставки.',
			'desc_tip'    	=> true,
			'default'     	=> '-1',
			'class'       	=> 'wc-enhanced-select',
			'options'     	=> $this->get_shipping_classes_options()
		);
		
		$instance_form_fields['additional_info'] = array(
			'title'           => 'Дополнительная информация',
			'type'            => 'title',
			'description'     => 'Указанная ниже информация будет отображаться покупателям на страницах корзины и чекаута.',
		);
		
		$instance_form_fields['enable_sms_notice'] = array(
			'title'           => 'СМС уведомление',
			'type'            => 'checkbox',
			'default'         => 'no',
			'label'			  => 'Разрещить СМС уведомление для покупателей'
		);
		
		$instance_form_fields['show_delivery_time'] = array(
			'title'       => 'Срок доставки',
			'type'        => 'checkbox',
			'label'       => 'Показывать срок доставки',
			'desc_tip' 	  => 'Отобразить предполагаемое время доставки.',
			'default'     => 'no',
		);
		
		$instance_form_fields['additional_time'] = array(
			'title'       => 'Добавочное время',
			'type'        => 'text',
			'desc_tip' 	  => 'Дополнительные дни к сроку доставки.',
			'default'     => '0',
			'placeholder' => '0',
		);
		
		$instance_form_fields['description_rate'] = array(
			'title'       => 'Описание метода',
			'type'        => 'textarea',
			'desc_tip' 	  => 'Этот текст будут отображаться под названием метода доставки. Оставьте пустым, что бы не отобрать ничего.',
		);
		
		$instance_form_fields['packing'] = array(
			'title'           => 'Упаковка',
			'type'            => 'title',
			'description'     => 'Параметры ниже будут определять как упаковывать товары.',
		);
		
		$instance_form_fields['packing_method'] = array(
			'title'           => 'Метод упаковки',
			'type'            => 'select',
			'default'         => '',
			'class'           => 'packing_method',
			'options'         => array(
				'per_item'       => 'Каждый товар индивидуально (по умолчанию)',
				'box_packing'    => 'Упаковывать в коробки (рекомендуются)'
			),
		);
		
		$instance_form_fields['boxes'] = array(
			'type'            => 'box_packing'
		);
		
		return $instance_form_fields;
	}
	
	public function calculate_shipping( $package = array() ) {
		
		if ( ! $this->is_valid_package_destination( $package ) ) {
			return;
		}
		
		if ( ! $this->has_only_selected_shipping_class( $package ) ) {
			$this->get_plugin()->log( 'В заказе присутсвуют товары не соответсвующие выбранному классу доставки.' );
			return;
		}
		
		if( ! $this->is_configured() ) {
			$this->get_plugin()->log( 'Методы доставки Почты РФ не доступны так как вы не указали данные авторизации в настройках плагина.' );
			return;
		}
		
		$is_international = false;
		$rate = array();
		$this->package = $package;
		$meta_data_params = array();
		$user_options = wc_russian_post_get_user_options();
		
		if( 0 === strpos( $this->mail_type, 'INTERNATIONAL_' ) ) {
			$is_international = true;
			$mail_type = str_replace( 'INTERNATIONAL_', '', $this->mail_type );
		} else {
			$mail_type = $this->mail_type;
		}
		
		if( $mail_type == 'SMALL_PACKET' && ! $is_international ) {
			$is_international = true;
		}
		
		if( ! $user_options || ! isset( $user_options['api_enabled'] ) ) {
			$this->get_plugin()->log( 'Данные пользователя пустые. Вероятно пользователь не подключён.' );
			return;
		}
		
		$current_point = wp_list_filter( $user_options['shipping_points'], array( 'operator-postcode' => $this->shipping_point, 'enabled' => true ) );
		$current_point = array_shift( $current_point );
		$available_products = wp_list_filter( $current_point->{'available-products'}, array( 'mail-type' => $mail_type ) );
		$available_mail_category = array();
		
		foreach( $available_products as $user_product ) {
			$available_mail_category[] = $user_product->{'mail-category'};
		}
		
		if( empty( $current_point ) ) {
			$this->get_plugin()->log( 'Информация о теккущей точки приёма недоступна.' );
			return;
		}
		
		if( ! in_array( $mail_type, $current_point->{'available-mail-types' } ) ) {

			$mailtypes = wc_russian_post_get_mail_types( $mail_type );
			if(is_array($mailtypes)) $mailtypes = implode(',',$mailtypes);
			$this->get_plugin()->log( sprintf( 'Тип отправления %s недоступен для данного пользователя', $mailtypes ) );
			return;
		}
		
		if( ! isset( $this->user_profile_options[ $this->shipping_point ] ) || empty( $this->user_profile_options[ $this->shipping_point ] ) ) {
			$this->get_plugin()->log( 'Опции пользователя для текущий точки отправления не найдены. Проверьте актуальность настройки метода.' );
			return;
		}
		
		$declared_value = $this->declared_cost( $this->package );
		$mail_category = $declared_value > 0 ? 'WITH_DECLARED_VALUE' : 'ORDINARY';
		
		if( wc_russian_user_is_cod_enabled() && 'wc_russian_post_cod' == $this->get_payment_method() ) {
			$mail_category = 'WITH_DECLARED_VALUE_AND_CASH_ON_DELIVERY';
		}
		
		if( $mail_type == 'SMALL_PACKET' ) {
			$mail_category = 'ORDERED';
		}
		
		if( ! in_array( $mail_category, $this->user_profile_options[ $this->shipping_point ]['mail_category'][ $mail_type ] ) ) {
			$this->get_plugin()->log( sprintf( 'Категория РПО %s недоступена для данного отправления', wc_russian_post_get_category_parcel( $mail_category ) ) );
			return;
		}
		
		$packages = $this->get_packages( $this->package );
		
		//wc_add_notice( sprintf( '<pre>%s</pre>', wc_print_r( $packages ) ) );
		
		$shipping_params = array(
			'mass'					=> $packages['weight'],
			'index-from'			=> $this->get_option( 'shipping_point' ),
			'mail-type'				=> $mail_type,
			'mail-category'			=> $mail_category
		);
		
		if( 'RU' !== $this->package['destination']['country'] && $is_international ) {
			
			$shipping_params['mail-direct'] = wc_russian_post_get_allow_country_codes( $this->package['destination']['country'] );
		
		} else {
			
			$shipping_params['index-to'] = intval( $this->package['destination']['postcode'] );
			
			if( wc_russian_post_is_oversize_dimension( $packages['length'], $packages['width'], $packages['height'] ) ) {
				$shipping_params['dimension'] = array(
					'height'	=> $packages['height'],
					'length'	=> $packages['length'],
					'width'		=> $packages['width']
				);
			}
			
			if( $declared_value > 0 ) {
				$shipping_params['declared-value'] = $declared_value;
			}
		}
		
		$meta_data_params = array(
			'is_russian_post'		=> true,
			'index_from'			=> $this->get_option( 'shipping_point' ),
			'declared_value'		=> $declared_value,
			'mail_type'				=> $mail_type,
			'mail_category'			=> $mail_category,
			'package_height'		=> $packages['height'],
			'package_length'		=> $packages['length'],
			'package_width'			=> $packages['width'],
			'package_mass'			=> $packages['weight']
		);
		
		//$points = $this->get_api()->get_all_delivery_points();
		
		//wc_add_notice( sprintf( '<pre>%s</pre>', wc_print_r( $points, true ) ) );
		
		if( $current_point->{'courier-call'} === true && wc_string_to_bool( $this->is_courier ) ) {
			$shipping_params['courier'] = true;
			$meta_data_params['courier'] = true;
		}
		
		if( wc_string_to_bool( $this->is_fragile ) && in_array( $mail_type, wc_russian_post_get_fragile_allowed_mail_types() ) ) {
			$shipping_params['fragile'] = true;
			$meta_data_params['fragile'] = true;
		}
		
		if( $this->allowed_sms_notice() && ( isset( $this->package['wc_russian_post_sms_notice'] ) && wc_string_to_bool( $this->package['wc_russian_post_sms_notice'] ) ) ) {
			$shipping_params['sms-notice-recipient'] = 1;
			$meta_data_params['customer_notice'] = true;
		}
		
		if( wc_string_to_bool( $this->completeness_check ) && in_array( $mail_type, wc_russian_post_get_allowed_content_check_mail_types() ) ) {
			$shipping_params['completeness-checking'] = true;
			$meta_data_params['completeness_checking'] = true;
		}
			
		if ( 'yes' !== get_option( 'woocommerce_shipping_debug_mode', 'no' ) ) {
			
			$rate_hash = sprintf( '%s_rates_%s', $this->get_id(), md5( serialize( array( $shipping_params, $this->package, $meta_data_params ) ) ) );
			$session_key	= 'shipping_for_russian_post_rate_package_' . $rate_hash;
			$stored_rates 	= WC()->session->get( $session_key );
			
			if ( ! is_array( $stored_rates ) || $rate_hash !== $stored_rates['rate_hash'] ) {

				$rate = $this->dispatch_rate( $shipping_params, $meta_data_params );

				WC()->session->set( $session_key, array(
						'rate_hash'	=> $rate_hash,
						'response'	=> $rate,
					)
				);
			} elseif( isset( $stored_rates['response'] ) ) {
				$rate = $stored_rates['response'];
				$this->get_plugin()->log( 'Информация о методе доставки взята из сессии.' );
			}
		
		} else {
			$rate = $this->dispatch_rate( $shipping_params, $meta_data_params );
		}
		
		if( $rate && ! empty( $rate ) && is_array( $rate ) ) {
			
			if( isset( $rate['min_days'] ) && $rate['min_days'] > 0 ) {
				$meta_data_params['min_days'] = $rate['min_days'];
			}
			
			if( isset( $rate['max_days'] ) && $rate['max_days'] > 0 ) {
				$meta_data_params['max_days'] = $rate['max_days'];
			}
			
			if( $this->get_plugin()->get_license_instance()->is_license_valid() ) {
				$this->add_rate( array(
					'cost'		=> $this->get_rate_cost( $rate['cost'], $this->package ),
					'id'		=> $this->get_rate_id(),
					'label'		=> $this->title,
					'meta_data'	=> apply_filters( 'wc_russian_post_custom_order_meta_data_fields', $meta_data_params ),
					'package'	=> $this->package
				) );
			}
		
		} else {
			
			$this->get_plugin()->log( sprintf( 'Для метода доставки %s нет данных.', $this->title ) );
		}
	}
	
	public function allowed_sms_notice() {
		return wc_string_to_bool( $this->enable_sms_notice ) && in_array( $this->mail_type, wc_russian_post_get_allowed_sms_notice_mail_types() );
	}
}