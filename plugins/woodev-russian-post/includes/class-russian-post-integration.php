<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WC_Russian_Post_Integration extends WC_Integration {

	public $geolocation_enable = false;

	public function __construct() {
		
		$this->id					= wc_russian_post_shipping()->get_method_id();
		$this->method_title       	= sprintf( 'Почта России: (%s)', WC_RUSSIAN_POST_SHIPPING_VERSION );
		$this->method_description 	= sprintf( 'Основные настройки метода доставки <a href="%s">Почты России</a>.', 'https://passport.pochta.ru/' );
		
		$this->geolocation_enable = in_array( get_option( 'woocommerce_default_customer_address' ), array( 'geolocation', 'geolocation_ajax' ), true );
		
		$this->init_form_fields();
		$this->init_settings();
		
		add_action( 'woocommerce_update_options_integration_' . $this->id, array( $this, 'process_admin_options' ) );
		
		if ( is_admin() ) {
			add_action( 'admin_notices', array( $this, 'admin_notices' ) );
		}
		
		if ( isset( $_POST['wc_russian_post_authorization_redirect'] ) && $_POST['wc_russian_post_authorization_redirect'] && empty( $_POST['save'] ) ) {
			add_action( 'admin_init', array( $this, 'process_authorization_redirect' ) );
		}
	}
	
	public function init_form_fields() {
	
		$statuses = array();
		
		foreach ( wc_get_order_statuses() as $key => $value ) {
			$statuses[ $key ] = $value;
		}
		
		$form_fields = array(
			'account'	=> array(
				'title'           => 'Авторизация',
				'type'            => 'title',
				'description'     => 'Укажите данные от вашего аккаунта на сайте <a href="https://otpravka.pochta.ru/dashboard">Почта России</a>',
		    ),
			'account_name'	=> array(
				'title'           => 'Имя пользователя',
				'type'            => 'text',
				'placeholder'	  => 'Номер телефона или емайл',
				'description'     => '',
				'default'         => '',
				'custom_attributes' => array(
					'autocomplete' 	=> 'off',
					'required'		=> 'required',
					'oninvalid'		=> "this.setCustomValidity( 'Необходимо указать имя пользователя от личного кабинета Почты РФ.' )",
					'oninput'		=> "setCustomValidity('')"
				)
		    ),
		    'account_password'	=> array(
				'title'           => 'Пароль',
				'type'            => 'text',
				'placeholder'	  => 'Введите ваш пароль',
				'description'     => '',
				'default'         => '',
				'custom_attributes' => array(
					'autocomplete' 	=> 'off',
					'required'		=> 'required',
					'oninvalid'		=> "this.setCustomValidity( 'Необходимо указать пароль от личного кабинета Почты РФ.' )",
					'oninput'		=> "setCustomValidity('')"
				)
		    ),
		    'account_token'           => array(
				'title'           => 'Токен авторизации',
				'type'            => 'text',
				'description'     => 'Токен можно найти в вашем личном кабинете на сайте Почты России в разделе <a href="https://otpravka.pochta.ru/settings#/api-settings">Настройки API</a>',
				'default'         => '',
				'custom_attributes' => array(
					'autocomplete' 	=> 'off',
					'required'		=> 'required',
					'oninvalid'		=> "this.setCustomValidity( 'Необходимо указать токен авторизации. Без этого значения плагин работать не будет!' )",
					'oninput'		=> "setCustomValidity('')"
				)
		    ),
			'package_dimension' => array(
				'title'            => 'Параметры товара',
				'type'             => 'title',
				'description'      => 'Укажите параметры товара по умолчанию. Данные параметры будут использоваться в случае если у товара отсутвует тот или иной параметр.'
			),
			'minimum_weight' => array(
				'title' 		=> 'Масса по умолчанию, (грамм)',
				'type' 			=> 'text',
				'default'		=> 500,
				'desc_tip'      => 'Укажите массу одного товара по умолчанию. Эта масса будет использоваться в расчете доставки одной единицы товара, если у товара не будет указана его масса в карточке товара.',
			),
			'minimum_height' => array(
				'title' 		=> 'Высота по умолчанию, (мм.)',
				'type' 			=> 'text',
				'default'		=> 150,
				'desc_tip'      => 'Укажите высоту одного товара по умолчанию.',
			),
			'minimum_width' => array(
				'title' 		=> 'Ширина по умолчанию, (мм.)',
				'type' 			=> 'text',
				'default'		=> 150,
				'desc_tip'      => 'Укажите ширину одного товара по умолчанию.',
			),
			'minimum_length' => array(
				'title' 		=> 'Длина по умолчанию, (мм.)',
				'type' 			=> 'text',
				'default'		=> 150,
				'desc_tip'      => 'Укажите длину одного товара по умолчанию.',
			),
			'widget_params'	=> array(
				'title'           => 'Настройки виджета ПВЗ',
				'type'            => 'title'
		    ),
			'show_search_control' => array(
				'title'		=> 'Поле поиска на карте',
				'desc_tip'  => 'Показывать поле для поиска населённых пунктов на карте.',
				'default' 	=> 'yes',
				'label'		=> 'Вкл/Выкл',
				'type'    	=> 'checkbox'
			),
			'enable_geolocation_control' => array(
				'title'		=> 'Разрешить геолокацию',
				'desc_tip'  => 'Разрешить использовать поиск населенного пункта по геолокации пользователя',
				'default' 	=> 'no',
				'label'		=> 'Вкл/Выкл',
				'type'    	=> 'checkbox'
			),
			'replace_address_from_map' => array(
				'title'		=> 'Заменять значения адреса при выборе ПВЗ на карте',
				'desc_tip'  => 'Опция позваляет заменять значения полей "Город", "Область", "Адрес" и "Индекс" на адрес выбранного пункта выдачи. Работает только для доставки ЕКОМ.',
				'default' 	=> 'yes',
				'label'		=> 'Да/Нет',
				'type'    	=> 'checkbox'
			),
			'additional_params'	=> array(
				'title'           => 'Дополнительно',
				'type'            => 'title'
		    ),
			'enable_address_suggestions' => array(
				'title'		=> 'Автоподсказки',
				'desc_tip'  => 'Включить подсказки для поля "адрес" на странице оформелния заказа. Работает только для адресов России.',
				'default' 	=> 'yes',
				'label'		=> 'Вкл/Выкл',
				'type'    	=> 'checkbox'
			),
			'replace_address_field_params' => array(
				'title'		=> 'Заменять значения "Город", "Область" и "Индекс"',
				'desc_tip'  => 'Опция позваляет заменять значения полей "Город", "Область" и "Индекс" на основании введёного адреса. Работает только при включённой опции "Автоподсказки" и только для населённых пунктов России.',
				'default' 	=> 'yes',
				'label'		=> 'Да/Нет',
				'type'    	=> 'checkbox'
			),
			'auto_export_orders'	=> array(
				'title'		=> 'Автоматически экспортировать заказы',
				'desc_tip'  => 'Включить автоматический экспорт заказов в Почту России, если заказ оплачен или не наложенный платёж.',
				'default' 	=> 'no',
				'label'		=> 'Вкл/Выкл',
				'type'    	=> 'checkbox'
			),
			'export_statuses' => array(
				'title'             => 'Статусы заказ для экспорта&hellip;',
				'type'              => 'multiselect',
				'options'           => $statuses,
				'class'             => 'chosen_select',
				'css'               => 'width: 450px;',
				'description'       => 'Выберите статусы заказов при достижении которых заказ будет автоматически экспортироваться в Почту России',
				'desc_tip'          => true,
				'custom_attributes' => array(
					'data-placeholder' => 'Выберите статус заказа'
				)
			),
			'testing'	=> array(
				'title'           => 'Тестирование',
				'type'            => 'title'
		    ),
			'debug_mode' => array(
				'title'   => 'Режим отладки',
				'type'    => 'checkbox',
				'description'    => sprintf( 'Сохранить отчёты об ошибках и запросы/ответы API в <a href="%s">лог</a>', Woodev_Helper::get_wc_log_file_url( $this->id ) ),
				'default' => 'no'
			)
		);
		
		if( $this->geolocation_enable ) {
			$form_fields = Woodev_Helper::array_insert_after( $form_fields, 'export_statuses', array(
				'autocomplate_customer_address' => array(
					'title'		=> 'Автозаполнение адреса покупателя',
					'label'		=> 'Включить',
					'type'		=> 'checkbox',
					'default'	=> 'no',
					'value'		=> 'yes',
					'desc_tip'	=> 'Разрешить плагину автоматически заполнять поля местоположения на основании полученного IP адреса?'
				)
			) );
		}
		
		if( $this->is_configured() ) {
			$form_fields = Woodev_Helper::array_insert_after( $form_fields, 'account_token', array(
				'authorization'	=> array(
					'type'		=> 'authorization'
				)
			) );
		}
		
		$this->form_fields = apply_filters( 'wc_russian_post_integration_form_fields', array_map( array( $this, 'set_verify_code' ), $form_fields ) );
	}
	
	protected function set_verify_code( $field ) {
		
		if ( ! wc_russian_post_shipping()->get_license_instance()->is_active() && 'title' !== $field['type'] ) {
			if( ! isset( $field['class'] ) ) {
				$field['class'] = '';
			}
			$field['class'] .= ' woodev-modal';
		}
		
		return $field;
	}
	
	public function is_configured() {
		return ! empty( $this->get_option( 'account_name' ) ) && ! empty( $this->get_option( 'account_password' ) ) && ! empty( $this->get_option( 'account_token' ) );
	}
	
	public function generate_authorization_html() {
		
		$user_options = wc_russian_post_get_user_options();
		
		ob_start();
		
		include( 'views/html-authorization.php' );
		
		return ob_get_clean();
	}
	
	public function process_authorization_redirect() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Доступ запрещён' );
		}

		$redirect_args = array(
			'page'    => 'wc-settings',
			'tab'     => 'integration',
			'section' => wc_russian_post_shipping()->get_method_id(),
		);
		
		$user_options = $this->get_user_options();
		
		if ( $user_options && isset( $user_options['api_enabled'] ) && $user_options['api_enabled'] ) {
			$redirect_args['wc_russian_post_authorization'] = 'success';			
		} else {
			$redirect_args['wc_russian_post_authorization'] = 'fail';
		}
		
		wp_redirect( add_query_arg( $redirect_args, admin_url( 'admin.php' ) ), 301 );
		exit;
	}
	
	public function get_user_options() {
		
		$option_name = 'wc_russian_post_user_options';
		$user_options = wc_russian_post_get_user_options();
			
		try {
					
			$settings = wc_russian_post_shipping()->get_api()->get_settings();
			$user_options = $settings->get_settings();
						
			update_option( $option_name, $user_options );
						
		} catch( Woodev_API_Exception $e ) {
			wc_russian_post_shipping()->log( $e->getMessage() );
			delete_option( $option_name );
		}
		
		return $user_options;
	}
	
	public function admin_notices() {
		
		$screen = get_current_screen();
		$message = '';
		$notice_class = 'updated';
		
		if ( 'woocommerce_page_wc-settings' == $screen->id && isset( $_GET['wc_russian_post_authorization'] ) ) {
			if ( 'success' == $_GET['wc_russian_post_authorization'] ) {
				$message = 'Аккаунт для Почты РФ успешно аутентифицирован.';
			} else {
				$message = 'Не удалось подключиться к личному кабинету Почты РФ. Убедитесь, что вы указали все данные авторизации верно или <a href="https://otpravka.pochta.ru/help" target="_blank">свяжитесь с тех.поддержкой Почтой РФ</a> для уточнения причины.';
				$notice_class = 'notice-error';
			}
		}
		
		if( ! empty( $message ) ) {
			
			wc_russian_post_shipping()->get_admin_notice_handler()->add_admin_notice(
				$message,
				'wc-russian-post-authorization-status',
				array( 'always_show_on_settings' => false, 'notice_class' => $notice_class )
			);
		}
	}
}