<?php

namespace Woodev\Russian_Post\Classes;

class Install_Module implements \Woodev\Russian_Post\Interfaces\Install_Module {

	public function get_subdomain() {
		return wp_parse_url( home_url(), PHP_URL_HOST );
	}

	/**
	 * @return string
	 */
	public function get_guid_id() {
		return get_option( 'wc_russian_post_guid_id', __return_empty_string() );
	}

	/**
	 * @return string
	 */
	public function get_cms_version() {
		return get_bloginfo( 'version' );
	}

	/**
	 * @return string
	 */
	public function get_cms_type() {
		return 'wordpress';
	}

	public function get_admin_index() {
		return admin_url( 'post.php?action=edit&post=' );
	}

	public function get_barcode_link() {
		return WC()->api_request_url( 'russian_post_barcode' );
	}

	public function get_status_link() {
		return WC()->api_request_url( 'russian_post_status' );
	}
}