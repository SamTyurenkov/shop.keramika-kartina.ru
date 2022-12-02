<?php
/**
 * Template Featured Slider
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

global $post;

$shortcodeslider = get_post_meta( $post->ID, '_kad_post_cyclone', true );
?>
<div class="sliderclass">
<?php
if ( ! empty( $shortcodeslider ) ) {
	echo do_shortcode( $shortcodeslider );
}
?>
</div><!--sliderclass-->
