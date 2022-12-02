<?php
/**
 * Home Shortcode Slider Mobile
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<div class="sliderclass cyclone_mhome_slider">
	<?php
	echo do_shortcode( virtue_premium_get_option( 'mobile_cyclone_slider' ) );
	?>
</div><!--sliderclass-->
