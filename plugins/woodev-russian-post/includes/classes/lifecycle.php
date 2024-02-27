<?php

namespace Woodev\Russian_Post\Classes;

defined( 'ABSPATH' ) or exit;

class Lifecycle extends \Woodev_Lifecycle {

	public function __construct( \Woodev_Plugin $plugin ) {

		parent::__construct( $plugin );

		$this->upgrade_versions = array(
			'1.2.0',
			'1.2.3'
		);
	}

	protected function upgrade_to_1_2_0() {
		$this->install_module();
		update_option( 'woocommerce_wc_russian_post_upgraded_to_1_2_0', 'yes' );
	}

	protected function upgrade_to_1_2_3() {
		$legacy_license_key = get_option( 'russian_post_ems_integration_with_woocommerce_license_key', '' );

		if ( ! empty( $legacy_license_key ) ) {

			update_option( $this->get_plugin()->get_plugin_option_name( 'license_key' ), $legacy_license_key );

			$this->get_plugin()->get_license_instance()->verify_license( $legacy_license_key );

			delete_option( 'russian_post_ems_integration_with_woocommerce_license_key' );
			delete_option( 'russian_post_ems_integration_with_woocommerce_license' );
		}
	}

	public function activate() {
		$this->install_module();
	}

	protected function install() {
		//Need to run Setup Wizard if it's first installation
		set_transient( 'wc_russian_post_setup_wizard_redirect', 1, 30 );
	}

	public function deactivate() {

		$uninstall_module = new Uninstall_Module();

		$response = $this->get_plugin()->get_api()->uninstall_module( array(
			'guidId'  => $uninstall_module->get_guid_id(),
			'guidKey' => $uninstall_module->get_guid_key()
		) );

		if ( $response ) {
			$response_data = new DTO\Uninstall_Module_DTO( $response );
			if ( $response_data->get_guid_id() == get_option( 'wc_russian_post_guid_id', null ) ) {
				update_option( 'wc_russian_post_guid_key', null );
			}
		}
	}

	private function install_module() {

		$install_module = new Install_Module();

		$request_params = array(
			'subdomain'    => $install_module->get_subdomain(),
			'cms_version'  => $install_module->get_cms_version(),
			'cms_type'     => $install_module->get_cms_type(),
			'admin_index'  => $install_module->get_admin_index(),
			'barcode_link' => $install_module->get_barcode_link(),
			'status_link'  => $install_module->get_status_link()
		);

		$reactivate = false;

		if ( ! empty( $install_module->get_guid_id() ) ) {
			$request_params['guid_id'] = $install_module->get_guid_id();
			$reactivate                = true;
		}

		$response = $this->get_plugin()->get_api()->install_module( $request_params );

		if ( $response ) {
			$response_data = new DTO\Install_Module_DTO( $response );
			if ( $response_data->get_guid_id() && $response_data->get_guid_key() ) {
				update_option( 'wc_russian_post_guid_id', $response_data->get_guid_id() );
				update_option( 'wc_russian_post_guid_key', $response_data->get_guid_key() );

				$heading = $reactivate ? __( 'Your dashboard link was updated', 'woocommerce-russian-post' ) : __( 'Your new dashboard link was created', 'woocommerce-russian-post' );
				$subject = sprintf( __( 'The plugin %s was activated', 'woocommerce-russian-post' ), $this->get_plugin()->get_plugin_name() );
				$message = sprintf( __( '<p>To enter to your dashboard page, click the button below</p><center><a href="%s" class="button">Enter to dashboard</a></center>', 'woocommerce-russian-post' ), $this->get_plugin()->get_account_url() );
				$message = WC()->mailer()->wrap_message( $heading, $message );

				add_filter( 'woocommerce_email_styles', array( $this, 'add_email_styles' ), 5 );

				WC()->mailer()->send( get_option( 'admin_email' ), $subject, $message );

				remove_filter( 'woocommerce_email_styles', array( $this, 'add_email_styles' ) );
			}
		}
	}

	public function add_email_styles( $css ) {

		ob_start();
		$this->get_plugin()->load_template( 'emails/email-styles.php' );
		$css .= ob_get_clean();

		return $css;
	}

}