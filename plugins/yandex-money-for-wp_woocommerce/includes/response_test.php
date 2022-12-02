<?php
require($_SERVER['DOCUMENT_ROOT'].'/wp-load.php');


		require 'yandexnotification.php';
		// создаём уведомление
		$notification = new YandexNotification();
		// указываем параметры
		$notification->codepro = false;
		$notification->label = 'VS|1435|2.00';
		$notification->notification_type = 'p2p-incoming';
		$notification->operation_id = '963623907502068025';
		$notification->amount = '0.99';
		$notification->currency = '643';
		$notification->datetime = '2015-04-08T12:39:13Z';
		$notification->sender = '410011017062693';
		$notification->sha1_hash = 'bd1b3991b5d81d2aad5eea03bf80d6a8a6270bf6';
		$notification->withdraw_amount = '1.00';
		$notification_secret = 'secret';

		$site_url = 'http://site.ru/?wc-api=wc_yandex_m&vsvse_yandex=result';

		// отправляем уведомления на ваш сервер

				$notification->dispatch(
				    $site_url, 
				    $notification_secret // уведомление будет подписано указанным секретом
				);		  	


?>