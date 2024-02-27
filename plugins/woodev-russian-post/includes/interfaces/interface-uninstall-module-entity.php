<?php

namespace Woodev\Russian_Post\Interfaces;

interface Uninstall_Module_Entity {
	/**
	 * @return string
	 */
	public function get_admin_index();

	/**
	 * @return string
	 */
	public function get_subdomain();

	/**
	 * @return string
	 */
	public function get_guid_id();

	/**
	 * @return string
	 */
	public function get_cms_version();
}