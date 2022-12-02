<?php
/**
 * Sidebar Template
 *
 * @package Virtue Theme
 */

?>
<form role="search" method="get" class="form-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label>
		<span class="screen-reader-text"><?php esc_html_e( 'Search for:', 'virtue' ); ?></span>
		<input type="text" value="<?php echo ( is_search() ? esc_attr( get_search_query() ) : '' ); ?>" name="s" class="search-query" placeholder="<?php echo esc_attr( virtue_premium_get_option( 'search_placeholder_text', __( 'Search', 'virtue' ) ) ); ?>">
	</label>
	<button type="submit" class="search-icon" aria-label="<?php echo esc_attr__( 'Submit Search', 'virtue' ); ?>"><i class="icon-search"></i></button>
</form>
