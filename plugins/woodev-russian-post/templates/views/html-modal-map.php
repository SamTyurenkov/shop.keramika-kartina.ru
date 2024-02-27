<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<script type="text/template" id="tmpl-wc-modal-russian-post-map">
	<div class="wc-backbone-modal">
		<div class="wc-backbone-modal-content">
			<section class="wc-backbone-modal-main" role="main">
				<header class="wc-backbone-modal-header">
					<h1><?php _e( 'Choose postal office', 'woocommerce-russian-post' );?></h1>
					<button class="modal-close modal-close-link">
                        <span>&times;</span>
						<span class="screen-reader-text"><?php _e( 'Close', 'woocommerce-russian-post' );?></span>
					</button>
				</header>
				<article id="russian-post-map-container" class="modal-map-container" data-zip_code="{{{ data.zip_code }}}" data-cart_total="{{{ data.cart_total }}}" data-start_location="{{{ data.start_location }}}"></article>
			</section>
		</div>
	</div>
	<div class="wc-backbone-modal-backdrop modal-close"></div>
</script>