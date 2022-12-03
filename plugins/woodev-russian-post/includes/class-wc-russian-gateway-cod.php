<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WD_Russian_Post_Gateway_COD extends WC_Payment_Gateway {
	
	public function __construct() {
		$this->id                 = 'wc_russian_post_cod';
		$this->icon				  = wc_russian_post_shipping()->get_plugin_url() . '/assets/img/wc-russian-post-logo-image.jpg';
		$this->method_title       = 'Почта России - наложенный платёж';
		$this->method_description = 'Оплата наличными при получении в отделении Почты России';
		$this->has_fields         = false;
		
		$this->init_form_fields();
		$this->init_settings();
		
		$this->title              = $this->get_option( 'title' );
		$this->description        = $this->get_option( 'description' );
		$this->instructions       = $this->get_option( 'instructions' );
		$this->fee_amount  		  = $this->get_option( 'fee_amount' );
		$this->fee_text   		  = $this->get_option( 'fee_text' );
		$this->enable_cod   	  = $this->get_option( 'enable_cod', 'no' );

		add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
		add_action( 'woocommerce_thankyou_' . $this->id, array( $this, 'thankyou_page' ) );
	}
	
	public function payment_fields() {
		
		parent::payment_fields();
		
		if( $this->is_available() ) :
		?>
		<script type="text/javascript">
			(function($){
				$( 'form.checkout' ).on( 'change', 'input[name^="payment_method"]', function() {
					$( document.body ).trigger( 'update_checkout', { update_shipping_method: true } );
				});
			})(jQuery);
		</script>
		<?php
		endif;
		
		if( 'yes' === $this->enable_cod && wc_russian_user_is_cod_enabled() ) {
			
			$allow_cod = true;
			
			if( $this->chosen_shipping_method_is_russian_post() && 'ecom' === strtolower( $this->chosen_shipping_method_is_russian_post() ) ) {
				$pvzdata = WC()->session->get( 'wc_russian_post_seted_delivery_point' );
				if( ! $pvzdata || ( isset( $pvzdata['allowCard'] ) && true !== $pvzdata['allowCard'] ) ) {
					$allow_cod = false;
				}
			}
			
			if( $allow_cod ) {
				
				printf( '<fieldset id="wc_russian_post_set_payment_by_cod">%s</fieldset>', woocommerce_form_field( 'wc_russian_post_payment_by_cod', array(
					'type'			=> 'checkbox',
					'label'			=> __( 'Pay by card?', 'woocommerce-russian-post' ),
					//'description'	=> 'Если вы планируете оплатить заказ банковской картой при получении заказа, отметьте выберите эту опцию.',
					'default'		=> 'no',
					'return'		=> true
				) ) );
			}
		}
		
	}
	
	public function init_form_fields() {
		$this->form_fields = array(
			'enabled'            => array(
				'title'       => 'Включить/Выключить',
				'label'       => 'Включить наложенный платёж',
				'type'        => 'checkbox',
				'description' => '',
				'default'     => 'no',
			),
			'title'              => array(
				'title'       => 'Наименование',
				'type'        => 'text',
				'description' => __( 'Payment method description that the customer will see on your checkout.', 'woocommerce' ),
				'default'     => 'Оплата в отделении Почты России',
				'desc_tip'    => true,
			),
			'description'        => array(
				'title'       => __( 'Description', 'woocommerce' ),
				'type'        => 'textarea',
				'description' => __( 'Payment method description that the customer will see on your website.', 'woocommerce' ),
				'default'     => 'Оплата заказа при получении в отделении Почты России.',
				'desc_tip'    => true,
			),
			'instructions'       => array(
				'title'       => __( 'Instructions', 'woocommerce' ),
				'type'        => 'textarea',
				'description' => __( 'Instructions that will be added to the thank you page.', 'woocommerce' ),
				'default'     => 'Для получения данного заказа вам необходимо оплатить его прямо в отделении Почты России.',
				'desc_tip'    => true,
			),
			'fee_amount'       => array(
				'title'       => 'Наценка',
				'type'        => 'text',
				'description' => 'Укажите какую наценку необходимо прибавлять к заказу если выбран данный метод дсотавки. Остаьте пустым что бы не использовать.',
				'default'     => 0,
				'desc_tip'    => true,
			),
			'fee_text'       => array(
				'title'       => 'Название наценки',
				'type'        => 'text',
				'description' => 'Укажите какой текст/название наценки отобжать покупателю.',
				'default'     => 'Доп.сбор за наложенный платёж.',
				'desc_tip'    => true,
			),
			'enable_cod'	=> array(
				'title'       => 'Оплата картой',
				'label'		  => 'Разрешить оплату картой',
				'type'        => 'checkbox',
				'description' => 'Включите эту опцию если хотите разрешить покупателям оплачивать заказ банковской картой при получении. <strong>Имейте ввиду</strong>, что для использования этой опции у вас должна быть подключена услуга "Оплата картой" в Почте РФ.',
				'default'     => 'no',
			)
		);
		
		if( ! wc_russian_user_is_cod_enabled() ) {
			$this->form_fields['enable_cod']['value'] = 'no';
			$this->form_fields['enable_cod']['description'] = 'Данная опция недоступна для вашего аккаунта. Вам необхоидмо подключить услугу "Оплата картой" в Почте РФ.';
			$this->form_fields['enable_cod']['custom_attributes']['disabled'] = 'disabled';
		}
	}
	
	public function is_available() {
		
		if( WC()->session ) {
			$chosen_shipping_methods_session = WC()->session->get( 'chosen_shipping_methods' );
			$is_russian_post = $this->chosen_shipping_method_is_russian_post();
			$user_options = wc_russian_post_get_user_options();
			$allow_cod = wc_russian_user_is_cod_enabled();
			$espp = ( isset( $user_options['espp_code'] ) && ! empty( $user_options['espp_code'] ) ) ? true : false;
			
			if( ! $is_russian_post || ! $espp || WC()->customer->get_shipping_country() !== 'RU' ) {
				return false;
			}
			
			if( $is_russian_post && 'ecom' === strtolower( $is_russian_post ) && ( $pvzdata = WC()->session->get( 'wc_russian_post_seted_delivery_point' ) ) ) {
				if( isset( $pvzdata['onlyPrePayment'] ) && 'true' == $pvzdata['onlyPrePayment'] ) {
					return false;
				}
			}
		}		
		
		return parent::is_available();
	}
	
	private function chosen_shipping_method_is_russian_post() {
		
		if( WC()->session ) {
			
			$chosen_shipping = WC()->session->get( 'chosen_shipping_methods' );
			$shipping_packages  = WC()->shipping()->get_packages();
			
			if ( ! empty( $chosen_shipping ) && is_array( $chosen_shipping ) ) {
				
				foreach ( $chosen_shipping as $key => $shipping ) {
					
					if ( ! empty( $shipping_packages[ $key ]['rates'][ $shipping ] ) ) {
						
						$chosen_rate = $shipping_packages[ $key ]['rates'][ $shipping ];
						
						if( Woodev_Helper::str_starts_with( $chosen_rate->get_method_id(), wc_russian_post_shipping()->get_method_id() ) ) {
							$meta = $chosen_rate->get_meta_data();
							return $meta['mail_type'] ? $meta['mail_type'] : false;
						}
					}
				}
			}
		}
		
		return false;
	}
	
	private function get_package_rate_ids( $chosen_package_rate_ids ) {

		$shipping_packages  = WC()->shipping()->get_packages();
		$canonical_rate_ids = array();

		if ( ! empty( $chosen_package_rate_ids ) && is_array( $chosen_package_rate_ids ) ) {
			foreach ( $chosen_package_rate_ids as $package_key => $chosen_package_rate_id ) {
				if ( ! empty( $shipping_packages[ $package_key ]['rates'][ $chosen_package_rate_id ] ) ) {
					$chosen_rate          = $shipping_packages[ $package_key ]['rates'][ $chosen_package_rate_id ];
					$canonical_rate_ids[] = $chosen_rate->get_method_id();
				}
			}
		}

		return $canonical_rate_ids;
	}
	
	public function thankyou_page() {
		if ( $this->instructions ) {
			echo wp_kses_post( wpautop( wptexturize( $this->instructions ) ) );
		}
	}
	
	public function process_payment( $order_id ) {
		$order = wc_get_order( $order_id );

		if ( $order->get_total() > 0 ) {
			$order->update_status( $order->has_downloadable_item() ? 'on-hold' : 'processing', 'Оплата будет произведена в отделении Почты России при получении заказа.' );
		} else {
			$order->payment_complete();
		}
		
		WC()->cart->empty_cart();
		
		return array(
			'result'   => 'success',
			'redirect' => $this->get_return_url( $order ),
		);
	}
	
	public function get_fee( WC_Cart $cart ) {
		
		if( ! empty( $this->fee_amount ) ) {
			
			$total = $cart->get_cart_contents_total() + $cart->get_shipping_total();
			
			if ( strstr( $this->fee_amount, '%' ) ) {
				return ( apply_filters( 'wc_russian_post_fee_total_cod', $total, $cart, $this ) / 100 ) * str_replace( '%', '', $this->fee_amount );
			}
			
			if( $this->fee_amount > 0 ) {
				return $this->fee_amount;
			}
		}
	}
}