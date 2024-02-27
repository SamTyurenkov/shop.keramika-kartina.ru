<?php

namespace Woodev\Russian_Post\Interfaces;

interface Install_Module {

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

	/**
	 * @return string
	 */
	public function get_cms_type();

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