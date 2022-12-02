<?php
/**
 * Home Rev Slider Mobile
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<div class="sliderclass home_sliderclass home-mobile-slider revslider_home_hidetop">
	<?php
	if ( function_exists( 'putRevSlider' ) ) {
		putRevSlider( virtue_premium_get_option( 'mobile_rev_slider' ) );
	} else {
		echo '<p class="error" style="text-align:center; color: red;">' . esc_html__( 'Please Install Revolution Slider Plugin', 'virtue' ) . '</p>';
	}
	?>
</div><!--sliderclass-->
