<?php

add_action( 'get_header', 'remove_storefront_sidebar' );
function remove_storefront_sidebar() {
		remove_action( 'storefront_sidebar', 'storefront_get_sidebar', 10 );

}

 add_action('wp_enqueue_scripts',  'set_enqueues',999);
 
 function set_enqueues() {
	  wp_enqueue_style('main-css', get_stylesheet_directory_uri() . '/css/main.css', array(), filemtime(get_stylesheet_directory() . '/css/main.css'), 'all');
 }
 
add_action( 'init', 'remove_parent_actions');

function remove_parent_actions() {
remove_action( 'woocommerce_after_shop_loop', 'storefront_sorting_wrapper', 9 );
remove_action( 'woocommerce_after_shop_loop', 'woocommerce_catalog_ordering', 10 );
remove_action( 'woocommerce_after_shop_loop', 'woocommerce_result_count', 20 );
remove_action( 'woocommerce_after_shop_loop', 'woocommerce_pagination', 30 );
remove_action( 'woocommerce_after_shop_loop', 'storefront_sorting_wrapper_close', 31 );

remove_action( 'woocommerce_before_shop_loop', 'storefront_sorting_wrapper', 9 );
remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 10 );
remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
remove_action( 'woocommerce_before_shop_loop', 'storefront_woocommerce_pagination', 30 );
remove_action( 'woocommerce_before_shop_loop', 'storefront_sorting_wrapper_close', 31 );
}

add_action( 'woocommerce_before_shop_loop', 'storefront_child_filter', 9 );

function storefront_child_filter() {
	echo do_shortcode('[wpf-filters id=1]');
}