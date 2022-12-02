<?php
/*
Plugin Name: Яндекс.Деньги для Woocommerce
Description: Оплата товаров с помощью Яндекс.Денег
Plugin URI: http://verstaemvse.ru
Author: Антон Шелестов
Author URI: http://verstaemvse.ru
Version: 1.0
*/

if ( ! class_exists( 'Request_VerstaemVse' ) ) {
	class Request_VerstaemVse {

		private $api_url = 'http://api.verstaemvse.ru';

		function __construct() {

			$this->site_url = home_url('', 'http');
			$this->id_plugin = 'vsvse_yandex_money_woocommerce';
			$this->id_plugin_ver = 'vsvse_yandex_money_woocommerce_v_1';

			$this->trans_key = 'wc_vsvse_yandex_money_woocommerce_key';
			$this->trans_result = 'wc_vsvse_yandex_money_woocommerce_result';

			$this->day_scan = 1;

			add_action('wp_ajax_vsvse_authenticate_sent', array($this, 'vsvse_authenticate_sent'));

			if( get_transient( $this->trans_key ) === false ) {

				add_action( 'admin_menu',  array($this, 'vsvse_authenticate') );

			} else {
				if( get_transient( $this->trans_result ) === false ) {

					$result = $this->result_body(true, get_transient( $this->trans_key ));

					if($result['body'] == 'valid_false') {
						delete_transient($this->trans_key);
						delete_transient($this->trans_result);
					} else {
						set_transient( $this->trans_result, $result['body'], $this->day_scan * DAY_IN_SECONDS );
					}
				}
			}

		}

		function vsvse_authenticate(){
			add_submenu_page( 
				'woocommerce', 
				'Регистрация серийного ключа плагина Яндекс.Деньги', 
				'Яндекс.Деньги', 
				'manage_options', 
				'wc-yandex_authenticate', 
				array( $this, 'yandex_authenticate_form')
			);
		}

		function result_body($check, $s_key) {
		
			$result = wp_remote_post($this->api_url, array(
				'method'      => 'POST',
				'timeout'     => 45,
				'redirection' => 5,
				'httpversion' => '1.0',
				'blocking'    => true,
				'headers'     => array(),
				'body'        => array(
							'site_url' 		=> $this->site_url,
							'serial_key' 	=> $s_key,
							'ip_addr' 		=> $_SERVER["REMOTE_ADDR"],
							'server_name' 	=> $_SERVER["SERVER_NAME"],
							'ip_server' 	=> $_SERVER["SERVER_ADDR"],
							'folder_server' => $_SERVER["DOCUMENT_ROOT"],
							'last_scan' 	=> Date('d.m.Y H:i'),
							'id_plugin' 	=> $this->id_plugin,
							'id_plugin_ver' => $this->id_plugin_ver,
							'check' 		=> $check,
							'password' 		=> 'password_QWWerty'
						),
				'cookies'     => array(),
				'ssl_verify' => false		
			));

			if ( is_wp_error( $result ) ) {
   				return $result->get_error_message();
   			} else {
				return $result;
   			}
		}

		function vsvse_authenticate_sent() {	    

			$result = $this->result_body(false, $_POST['serial_key']);

			if(gettype($result) != 'array') {
					echo json_encode(array('result' => false));
			} else {

				preg_match_all( '|<result_code.*?>(.*)</result_code>|sei', $result['body'], $matches );

				if(isset($matches[1][0])) {
					set_transient( $this->trans_key, $_POST['serial_key'] );
					set_transient( $this->trans_result, $matches[1][0], $this->day_scan * DAY_IN_SECONDS );
					echo json_encode(array('result' => $result, 'result_code' => $matches[1][0]));
				} else {
					echo json_encode(array('result' => $result));
				}
			}
			wp_die();
		}

		function yandex_authenticate_form() {

			echo '	<div style="max-width:600px;position:relative;margin: 30px 30px 30px 0;"><div id="lic_overlay" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: #fff url(' . plugins_url('ajax-loader.gif', __FILE__) . ') no-repeat center;background: rgba(255,255,255,0.5) url(' . plugins_url('ajax-loader.gif', __FILE__) . ') no-repeat center;display: none;z-index: 5;"></div>
					<div style="background: #ddd;padding: 20px 30px;border-radius: 3px;overflow: hidden;">
						<div style="font-size: 16px;margin-bottom:20px;">
							<strong>Укажите полученный лицензионный ключ</strong>
						</div>
						<div style="">
							<input id="vsvse_key" type="text" value="" class="regular-text code">
							<input type="submit" id="vsvse_submit" class="button button-secondary" value="Активировать">
						</div>
						<div id="lic_message" style="display:none;padding:15px 5px 5px;"></div>
					</div>
				</div>
				<script type="text/javascript">
					jQuery(function() {
						jQuery("#vsvse_submit").on( "click", function(){

							jQuery("#lic_overlay").fadeIn();

							var data = {
								action		: "vsvse_authenticate_sent",
								serial_key 	: jQuery("#vsvse_key").val()					
							};
							
							jQuery.ajax({
								type: "POST",
								url: ajaxurl,
								dataType: "json",
								data: data,
								success: function(resp){
									if(resp.result == false) {
										jQuery("#lic_message").slideDown("fast").html("<span style=\"color:red;\">Нет связи с сервером. Обратитесть к администратору плагина</span>");	
									} else {
										jQuery("#lic_message").slideDown("fast").html(jQuery(resp.result.body).find(".result_msg").html());										
									}
								},
								error: function(resp){
								},
								complete : function(){
									jQuery("#lic_overlay").fadeOut();
								}					
							});
						});
					});
				</script>';
		}

	}
}

$Request_VerstaemVse = new Request_VerstaemVse();
require_once( plugin_dir_path(__FILE__) . '/includes/function.php' );

?>