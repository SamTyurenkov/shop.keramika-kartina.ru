<?php

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

global $wpdb;

//Clear schedules
wp_clear_scheduled_hook( 'wc_russian_post_orders_update' );

// Delete options.
$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE 'wc_russian_post\_%';" );
$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE 'woodev_wc_russian_post\_%';" );

wp_cache_flush();
