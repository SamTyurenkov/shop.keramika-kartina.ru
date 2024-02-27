<?php

namespace Woodev\Russian_Post\Classes;

class Uninstall_Module implements \Woodev\Russian_Post\Interfaces\Uninstall_Module {

	/**
	 * @inheritDoc
	 */
	public function get_guid_id() {
		return get_option( 'wc_russian_post_guid_id', __return_empty_string() );
	}

	/**
	 * @inheritDoc
	 */
	public function get_guid_key() {
		return get_option( 'wc_russian_post_guid_key', __return_empty_string() );
	}
}