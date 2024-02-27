<?php

namespace Woodev\Russian_Post\Interfaces;

interface Install_Module_Entity extends Uninstall_Module_Entity {

	/**
	 * @return string
	 */
	public function get_guid_key();

	/**
	 * @return string
	 */
	public function get_barcode_link();

	/**
	 * @return string
	 */
	public function get_status_link();
}