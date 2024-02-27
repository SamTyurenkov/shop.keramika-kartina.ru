<?php

namespace Woodev\Russian_Post\Interfaces;

interface Authorization_Module extends Uninstall_Module {

	/**
	 * @return string
	 */
	public function get_admin_index();

	/**
	 * @return string
	 */
	public function get_barcode_link();

	/**
	 * @return string
	 */
	public function get_status_link();

}