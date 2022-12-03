<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WC_Russian_Post_Shipping_ECOM extends WC_Russian_Post_Shipping {
	
	public $is_ecom = true;
	
	public function __construct( $instance_id = 0 ) {
		
		parent::__construct( $instance_id );
		
		$this->id					= sprintf( '%s_ecom', $this->get_plugin()->get_method_id() );
		$this->method_title       	= 'Почта России ECOM (WooDev)';
		$this->method_description 	= 'Расчёт доставки через Почта России по тарифу ЕКОМ для интернет-магазинов.';
		
		$this->set_settings();
	}
	
	public function is_available( $package ) {
		$available = parent::is_available( $package );
		
		if( ! isset( $package['destination'], $package['destination']['country'] ) || 'RU' !== $package['destination']['country'] ) {
			$available = false;
		}
		
		return $available;
	}
	
	public function is_ecom() {
		return true;
	}
	
	public function admin_options() {
		
		global $hide_save_button;
		
		$user_options = wc_russian_post_get_user_options();
		$have_ecom = count( $this->get_available_ecom_ops() ) > 0 ? true : false;
		
		if( $user_options && $user_options['api_enabled'] ) {
			
			if( ! $have_ecom ) {
				$hide_save_button = true;
				echo '<div class="notice notice-warning"><p>Для вашего аккаунта не подключена доставка ЕКОМ. Обратитесь в поддержку Почты РФ, для подключения доставки ЕКОМ.</p></div>';
			} else {
				parent::admin_options();
			}
			
		} else {
			$hide_save_button = true;
			printf( '<div class="notice notice-warning"><p>Не удалось получить данные клиента, возможно вы не заполнили поля "логин", "пароль" и/или "токен" <a href="%s">на странице настроек плагина</a>. Если данные введены, то убедитесь что вы ввели коррктные значения.</p></div>', $this->get_plugin()->get_settings_url() );
		}
	}
	
	public function get_available_ecom_ops() {
		
		$ops = array();
		$user_options = wc_russian_post_get_user_options();
		
		if( $user_options && $user_options['api_enabled'] ) {
			
			foreach( $user_options['shipping_points'] as $point ) {
				if( ! $point->enabled ) {
					continue;
				}
				
				if( $point->{'available-mail-types'} ) {
					foreach( ( array ) $point->{'available-mail-types'} as $type ) {	
						if( 'ecom' == strtolower( $type ) ) {
							$ops[ $point->{'operator-postcode'} ] = $point->{'ops-address'};
						}
					}
				}
			}
		}
		
		return $ops;
	}
	
	public function set_settings() {
		
		$this->title				= $this->get_option( 'title', $this->method_title );
		$this->packing_method   	= $this->get_option( 'packing_method', 'per_item' );
		$this->boxes            	= $this->get_option( 'boxes', array() );
		$this->shipping_point   	= $this->get_option( 'shipping_point' );
		$this->completeness_check	= $this->get_option( 'completeness_check', 'no' );
		$this->fee   				= $this->get_option( 'fee' );
		$this->fee_type   			= $this->get_option( 'fee_type', '' );
		$this->min_price   			= $this->get_option( 'min_price', '' );
		$this->max_price   			= $this->get_option( 'max_price', '' );
		$this->static_price   		= $this->get_option( 'static_price', '' );
		$this->free_cost   			= $this->get_option( 'free_cost', '' );
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
		
		if( count( $this->get_available_ecom_ops() ) > 0 ) {
			
			$instance_form_fields['shipping_point'] = array(
				'title'           => 'Отделение отправки',
				'type'            => 'select',
				'options'         => $this->get_available_ecom_ops(),
				//'default'		  => key( $this->available_ecom_ops )
			);
					
		}
		
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
		
		$instance_form_fields['additional_info'] = array(
			'title'           => 'Дополнительная информация',
			'type'            => 'title',
			'description'     => 'Указанная ниже информация будет отображаться покупателям на страницах корзины и чекаута.',
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
		
		$this->package = $package;
		
		if( ! $this->is_configured() ) {
			$this->get_plugin()->log( 'Метод доставки ЕКОМ Почты РФ не доступны так как вы не указали данные авторизации в настройках плагина.' );
			return;
		}
		
		if( ! $this->get_plugin()->get_license_instance()->is_license_valid() ) {
			return;
		}
		
		$rate = array();
		$meta_data_params = array(
			'mail_type'	=> 'ECOM'
		);
		$user_options = wc_russian_post_get_user_options();
		$cost = 0;
		$packages = $this->get_packages( $package );
		
		if( ! $user_options || ! isset( $user_options['api_enabled'] ) ) {
			$this->get_plugin()->log( 'Данные пользователя пустые. Вероятно пользователь не подключён.' );
			return;
		}
		
		$allow_cod = wc_russian_user_is_cod_enabled();
		
		if( WC()->session && ( $pvzdata = WC()->session->get( 'wc_russian_post_seted_delivery_point' ) ) ) {
			
			$shipping_params = array(
				'mass'					=> $packages['weight'],
				'index-from'			=> $this->shipping_point,
				'mail-type'				=> 'ECOM',
				'mail-category'			=> 'ORDINARY',
				'delivery-point-index'	=> $pvzdata['indexTo'],
				'dimension-type' 		=> $this->get_dimension_type( $packages ),
				'goods-value'			=> $package['contents_cost'] * 100,
				'entries-type'			=> 'SALE_OF_GOODS',
				'completeness-checking'	=> wc_string_to_bool( $this->completeness_check )
			);
			
			$meta_data_params['package_mass'] 			= $packages['weight'];
			$meta_data_params['package_height'] 		= $packages['height'];
			$meta_data_params['package_length'] 		= $packages['length'];
			$meta_data_params['package_width'] 			= $packages['width'];
			$meta_data_params['dimension_type'] 		= $shipping_params['dimension-type'];
			$meta_data_params['index_from'] 			= $this->shipping_point;
			$meta_data_params['delivery_point_index']	= $pvzdata['indexTo'];
			
			if( 'wc_russian_post_cod' == $this->get_payment_method() ) {
				//$shipping_params['mail-category'] = $allow_cod ? 'WITH_DECLARED_VALUE_AND_COMPULSORY_PAYMENT' : 'WITH_COMPULSORY_PAYMENT';
			}
			
			if( $shipping_params['dimension-type'] == 'OVERSIZED' ) {
				$shipping_params['dimension'] = array(
					'height'	=> $packages['height'],
					'length'	=> $packages['length'],
					'width'		=> $packages['width']
				);
			}
			
			$rate = $this->dispatch_rate( apply_filters( 'wc_russian_post_ecom_shipping_params', $shipping_params, $package ) );
		}
		
		if( $rate && ! empty( $rate ) && is_array( $rate ) ) {
			
			if( isset( $rate['min_days'] ) && $rate['min_days'] > 0 ) {
				$meta_data_params['min_days'] = $rate['min_days'];
			}
			
			if( isset( $rate['max_days'] ) && $rate['max_days'] > 0 ) {
				$meta_data_params['max_days'] = $rate['max_days'];
			}
			
			$cost = $rate['cost'];
		}
		
		$this->add_rate( array(
			'cost'		=> $this->get_rate_cost( $cost, $package ),
			'id'		=> $this->get_rate_id(),
			'label'		=> $this->title,
			'meta_data'	=> $meta_data_params,
			'package'	=> $package
		) );
	}
}