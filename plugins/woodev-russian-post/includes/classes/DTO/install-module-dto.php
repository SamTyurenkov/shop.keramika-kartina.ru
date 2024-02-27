<?php

namespace Woodev\Russian_Post\Classes\DTO;

defined( 'ABSPATH' ) or exit;

class Install_Module_DTO implements \Woodev\Russian_Post\Interfaces\Install_Module_Entity {

	/** @var string $guid_key */
	private $guid_key;

	/** @var string $guid_id */
	private $guid_id;

	/** @var string $barcode_link */
	private $barcode_link;

	/** @var string $status_link */
	private $status_link;

	/** @var string $admin_index */
	private $admin_index;

	/** @var string $subdomain */
	private $subdomain;

	/** @var string $cms_version */
	private $cms_version;

	public function __construct( \stdClass $input ) {
		$this->guid_key     = $input->guidKey;
		$this->guid_id      = $input->guidId;
		$this->barcode_link = $input->barcodeLink;
		$this->status_link  = $input->statusLink;
		$this->admin_index  = $input->adminIndex;
		$this->subdomain    = $input->subdomain;
		$this->cms_version  = $input->cmsVersion;
	}

	public function get_guid_key() {
		return $this->guid_key;
	}

	public function get_barcode_link() {
		return $this->barcode_link;
	}

	public function get_status_link() {
		return $this->status_link;
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