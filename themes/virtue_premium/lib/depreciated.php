<?php
/**
 * Virtue depreciated
 *
 * @package Virtue Theme
 */

/**
 * Virtue depreciated filters
 */
function virtue_depreciated_filters() {
	/**
	 * Virtue depreciated filters
	 */
	global $virtue_map_deprecated_filters;

	$virtue_map_deprecated_filters = array(
		'virtue_site_name' => 'kad_site_name',
	);

	foreach ( $virtue_map_deprecated_filters as $new => $old ) {
		add_filter( $new, 'virtue_deprecated_filter_mapping' );
	}

	/**
	 * Virtue depreciated filters maping
	 *
	 * @param string $data The filter string.
	 * @param mixed  $arg_1 The filter first arg.
	 * @param mixed  $arg_2 The filter second arg.
	 * @param mixed  $arg_3 The filter third arg.
	 */
	function virtue_deprecated_filter_mapping( $data, $arg_1 = '', $arg_2 = '', $arg_3 = '' ) {
		global $virtue_map_deprecated_filters;
		$filter = current_filter();
		if ( isset( $virtue_map_deprecated_filters[ $filter ] ) ) {
			if ( has_filter( $virtue_map_deprecated_filters[ $filter ] ) ) {
				$data = apply_filters( $virtue_map_deprecated_filters[ $filter ], $data, $arg_1, $arg_2, $arg_3 );
				error_log( 'The ' . $virtue_map_deprecated_filters[ $filter ] . ' filter is deprecated. Please use ' . $filter . ' instead.' );
			}
		}
		return $data;
	}
}
add_action( 'after_setup_theme', 'virtue_depreciated_filters' );


/**
 * Depreciated kadence_sidebar_class
 */
function kadence_sidebar_class() {
	error_log( 'The kadence_sidebar_class() function is deprecated since version 4.3.5. Please use virtue_sidebar_class() instead.' );
	return virtue_sidebar_class();
}
/**
 * Depreciated kadence_main_class
 */
function kadence_main_class() {
	error_log( 'The kadence_main_class() function is deprecated since version 4.3.5. Please use virtue_main_class() instead.' );
	return virtue_main_class();
}
/**
 * Depreciated kadence_display_sidebar
 */
function kadence_display_sidebar() {
	error_log( 'The kadence_display_sidebar() function is deprecated since version 4.3.5. Please use virtue_display_sidebar() instead.' );
	return virtue_display_sidebar();
}
