<?php

namespace Woodev\Russian_Post\Classes\DTO;

class Uninstall_Module_DTO implements \Woodev\Russian_Post\Interfaces\Uninstall_Module_Entity {

	/** @var string $guid_id */
	private $guid_id;

	/** @var string $admin_index */
	private $admin_index;

	/** @var string $subdomain */
	private $subdomain;

	/** @var string $cms_version */
	private $cms_version;

	public function __construct( \stdClass $input ) {
		$this->guid_id      = $input->guidId;
		$this->admin_index  = $input->adminIndex;
		$this->subdomain    = $input->subdomain;
		$this->cms_version  = $input->cmsVersion;
	}

	public function get_admin_index() {
		return $this->admin_index;
	}

	public function get_subdomain() {
		return $this->subdomain;
	}

	public function get_guid_id() {
		return $this->guid_id;
	}

	public function get_cms_version() {
		return $this->cms_version;
	}
}