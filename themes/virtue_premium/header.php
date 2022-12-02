<?php
/**
 * Base Header template
 *
 * DO NOT ADD SCRIPTS HERE
 * USE a plugin like : https://wordpress.org/plugins/header-and-footer-scripts/
 *
 * This is commented out on purpose, it keeps plugins for incorrectly stating errors <?php wp_head(); ?>
 *
 * @version 4.7.8
 * @package Virtue Theme
 */

get_template_part( 'templates/head' );
?>
<body <?php body_class(); ?> <?php echo wp_kses_post( virtue_body_data() ); ?> >
	<?php
	/**
	 * Hook for adding google tag Manager
	 *
	 * @hooked virtue_wp_after_body_script_output - 20
	 */
	do_action( 'virtue_after_body' );
	?>
	<div id="wrapper" class="container">
	<!--[if lt IE 8]><div class="alert"> <?php esc_html_e( 'You are using an outdated browser. Please upgrade your browser to improve your experience.', 'virtue' ); ?></div><![endif]-->
	<?php
	/**
	 * Hook for before header.
	 */
	do_action( 'virtue_header_before' );
	/**
	 * Depreciated Hook for before header.
	 */
	do_action( 'kt_beforeheader' );

	/**
	 * Hook for the entire Header Markup.
	 *
	 * @hooked virtue_header_markup - 10
	 */
	do_action( 'virtue_header' );
	/**
	 * Depreciated Hook for after header.
	 */
	do_action( 'kt_header_after' );
	/**
	 * Hook for after header.
	 */
	do_action( 'virtue_header_after' );
