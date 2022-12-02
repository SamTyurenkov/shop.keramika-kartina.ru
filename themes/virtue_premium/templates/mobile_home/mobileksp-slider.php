<?php
/**
 * Home Kadence Slider Pro Mobile
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<div class="sliderclass home_sliderclass home-mobile-slider revslider_home_hidetop">
	<?php
		echo do_shortcode( '[kadence_slider_pro id="' . virtue_premium_get_option( 'mobile_ksp' ) . '"]' );
	?>
</div><!--sliderclass-->
