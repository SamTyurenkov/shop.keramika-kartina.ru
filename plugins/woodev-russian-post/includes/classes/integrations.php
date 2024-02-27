<?php

namespace Woodev\Russian_Post\Classes;

defined( 'ABSPATH' ) or exit;

use Woodev\Russian_Post as Plugin;

/**
 * Integrations class for plugins compatibility
 */
class Integrations {

	/** @var null|Plugin\Integrations\Integration_Edostavka instance */
	private $edostavka;

	/**
	 * Load integrations
	 */
	public function __construct() {

		if ( wc_russian_post_shipping()->is_plugin_active( 'woocommerce-edostavka.php' ) && defined( 'WC_CDEK_SHIPPING_VERSION' ) && version_compare( WC_CDEK_SHIPPING_VERSION, 2.2, '>=' ) ) {
			$this->edostavka = wc_russian_post_shipping()->load_class( '/includes/integrations/integration-edostavka.php', 'Woodev\Russian_Post\Integrations\Integration_Edostavka' );
		}
	}

	/**
	 * Returns the Edostavka integration handler instance.
	 *
	 * @since 1.2.0
	 *
	 * @return null|Plugin\Integrations\Integration_Edostavka
	 */
	public function get_edostavka_instance() {
		return $this->edostavka;
	}

}