<?php

namespace Woodev\Russian_Post\Interfaces;

interface Uninstall_Module {

	/**
	 * @return string
	 */
	public function get_guid_id();

	/**
	 * @return string
	 */
	public function get_guid_key();

}