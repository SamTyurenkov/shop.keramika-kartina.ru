<?php
/*
 * Plugin Name: Yandex.Metrica
 * Plugin URI: https://wordpress.org/plugins/wp-yandex-metrika/
 * Description: The official WordPress plugin from the Yandex.Metrica team. The plugin is a free tool for connecting tags based on the WordPress CMS. It provides the ability to transfer data about user sessions and e-commerce events directly to the Yandex.Metrica dashboard.
 * Author: Yandex
 * Author URI: https://metrika.yandex.ru
 * Version: 1.1.7
 * Requires at least: 5.2.9
 * Requires PHP: 5.6.20
 * Text Domain: wp-yandex-metrika
 * Domain Path: /languages/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once ABSPATH . 'wp-admin/includes/plugin.php';

define('YAM_SLUG', basename(__FILE__, '.php'));
define('YAM_VER', get_plugin_data(__FILE__)['Version']);
define('YAM_PAGE_SLUG', 'yam_settings');
define('YAM_OPTIONS_SLUG', 'yam_options');
define('YAM_FILE', __FILE__);
define('YAM_PATH', __DIR__);


require_once __DIR__ . '/includes/class.ya-metrika-helpers.php';
require_once __DIR__ . '/includes/class.ya-metrika.php';
require_once __DIR__ . '/includes/class.ya-metrika-backend.php';
require_once __DIR__ . '/includes/class.ya-metrika-frontend.php';
require_once __DIR__ . '/includes/class.ya-metrika-logs.php';

YaMetrika::getInstance();
YaMetrikaBackend::getInstance();
YaMetrikaFrontend::getInstance();

if (is_plugin_active( 'woocommerce/woocommerce.php' )) {
    require_once __DIR__ . '/includes/class.ya-metrika-woocommerce.php';
    YaMetrikaWoocommerce::getInstance();
}

register_activation_hook( __FILE__, [YaMetrika::getInstance(), 'onActivation']);
register_deactivation_hook( __FILE__, [YaMetrika::getInstance(), 'onDeactivation'] );
