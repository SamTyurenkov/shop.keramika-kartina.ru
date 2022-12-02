<?php

add_action( 'get_header', 'remove_storefront_sidebar' );
function remove_storefront_sidebar() {
		remove_action( 'storefront_sidebar', 'storefront_get_sidebar', 10 );

}

 add_action('wp_enqueue_scripts',  'set_enqueues',999);
 
 function set_enqueues() {
	  wp_enqueue_style('main-css', get_stylesheet_directory_uri() . '/css/main.css', array(), filemtime(get_stylesheet_directory() . '/css/main.css'), 'all');
 }
 
