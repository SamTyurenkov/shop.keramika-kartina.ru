<?php

defined( 'ABSPATH' ) or exit;

class WC_Russian_Post_Order_Exception_Email extends WC_Email {
	
	public function __construct() {
		
		$this->id          		= 'wc_russian_post_order_exception';
		$this->customer_email   = true;
		$this->title       		= 'Номер отслеживания [Почта России]';
		$this->description 		= 'Это емайл уведомелние отправляется покупателю как только заказ успешно импортирован в ЛК Почты России';
		$this->heading     		= sprintf( 'Заказ %1$s отправлен', '{order_number}' );
		$this->subject     		= sprintf( 'Ваш заказ на сайте [%s] передан в Почту России', get_bloginfo( 'name' ) );
		$this->message_text		= $this->get_option( 'message_text', $this->get_default_text() );
		
		$this->placeholders   = array(
			'{order_date}'   					=> '',
			'{order_number}' 					=> '',
			'{russian_post_status}' 			=> '',
			'{russian_post_tracking_number}' 	=> ''
		);

		$this->template_base = wc_russian_post_shipping()->get_plugin_path() . '/templates/';
		$this->template_html  = 'emails/admin-russian-post-order-exception.php';
		$this->template_plain = 'emails/plain/admin-russian-post-order-exception.php';
		
		add_action( 'wc_russian_post_order_exception_notification', array( $this, 'trigger' ) );
		
		parent::__construct();
	}
	
	private function get_default_text() {
		return sprintf( 'Здравствуте. Ваш заказ %s был передан в Почту России для доставки. Заказу был присвоен номер отслеживания %s который вы можете указать на сайте Почты России %s', '{order_number}', '{russian_post_tracking_number}', esc_url( 'https://www.pochta.ru/new-tracking' ) );
	}
	
	public function trigger( $order_id, $order = false ) {
		$this->setup_locale();
		
		if ( $order_id && ! is_a( $order, 'WC_Order' ) ) {
			$order = new WC_Russian_Post_Order( $order_id );
		}
		
		if ( is_a( $order, 'WC_Russian_Post_Order' ) ) {
			
			$this->object = $order;
			
			if(  ! $this->object->tracking_number || empty(  $this->object->tracking_number ) ) {
				return;
			}
			
			if ( method_exists( $order, 'get_billing_email' ) ) {
				$this->recipient = $this->object->get_billing_email();
			} else {
				$this->recipient = $this->object->billing_email;
			}
			
			$this->placeholders['{order_date}']						= date_i18n( wc_date_format(), strtotime( $this->object->order_date ) );
			$this->placeholders['{order_number}']					= $this->object->get_order_number();
			$this->placeholders['{russian_post_status}']			= $this->object->get_status_for_display();
			$this->placeholders['{russian_post_tracking_number}']	= $this->object->tracking_number;
		}
		
		if ( $this->is_enabled() && $this->get_recipient() ) {
			$this->send( $this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments() );
		}

		$this->restore_locale();
	}
	
	public function get_content_html() {
		return wc_get_template_html(
			$this->template_html,
			array(
				'order'              	=> $this->object,
				'email_heading'      	=> $this->get_heading(),
				'message'				=> $this->format_string( $this->message_text ),
				'additional_content' 	=> $this->get_additional_content(),
				'sent_to_admin'      	=> false,
				'plain_text'         	=> false,
				'email'              	=> $this,
			),
			'',
			$this->template_base
		);
	}
	
	public function get_content_plain() {
		return wc_get_template_html(
			$this->template_plain,
			array(
				'order'              	=> $this->object,
				'email_heading'      	=> $this->get_heading(),
				'message'				=> $this->format_string( $this->message_text ),
				'additional_content' 	=> $this->get_additional_content(),
				'sent_to_admin'      	=> false,
				'plain_text'         	=> true,
				'email'              	=> $this,
			),
			'',
			$this->template_base
		);
	}
	
	public function get_default_additional_content() {
		return 'Спасибо что выбрали нас!';
	}
	
	public function init_form_fields() {
		
		$placeholder_text  = sprintf( 'Доступные тэги: <code>%s</code>', implode( '</code>, <code>', array_keys( $this->placeholders ) ) );
		
		$this->form_fields = array(

			'enabled'    => array(
				'title'   => 'Вкл/Выкл',
				'type'    => 'checkbox',
				'label'   => 'Включить уведомления по емайл',
				'default' => 'yes'
			),

			'subject'    => array(
				'title'       	=> 'Тема',
				'type'        	=> 'text',
				'desc_tip' 		=> 'Укажите тему сообщения.' . ' ' . $placeholder_text,
				'placeholder' 	=> '',
				'default'     	=> sprintf( 'Ваш заказ на сайте [%s] отправлен Почтой России', get_bloginfo( 'name' ) )
			),

			'heading'    => array(
				'title'       	=> 'Заголовок письма',
				'type'        	=> 'text',
				'desc_tip' 		=> 'Укажите заголовок письма' . ' ' . $placeholder_text,
				'placeholder' 	=> '',
				'default'     	=> sprintf( 'Заказ %1$s отправлен', '{order_number}' )
			),
			
			'message_text' => array(
				'title'       	=> 'Тело письма',
				'type'        	=> 'textarea',
				'desc_tip' 		=> 'Укажите текст который будет отображаться в теле письма.' . ' ' . $placeholder_text,
				'placeholder' 	=> 'Укажите текст',
				'default'     	=> $this->get_default_text(),
			),
			
			'additional_content' => array(
				'title'       	=> 'Дополнительный контент',
				'desc_tip' 		=> 'Текст, который будет отображаться под основным содержанием письма.' . ' ' . $placeholder_text,
				'css'         	=> 'width:400px; height: 75px;',
				'placeholder' 	=> __( 'N/A', 'woocommerce' ),
				'type'        	=> 'textarea',
				'default'     	=> $this->get_default_additional_content()
			),

			'email_type' => array(
				'title'       => 'Тип емайл',
				'type'        => 'select',
				'description' => 'Выберите в каком формате отправлять сообщения.',
				'default'     => 'html',
				'class'       => 'email_type',
				'options' => array(
					'plain'     => __( 'Plain text', 'woocommerce' ),
					'html'      => __( 'HTML', 'woocommerce' ),
					'multipart' => __( 'Multipart', 'woocommerce' ),
				)
			),
		);
	}


}
