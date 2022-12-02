<?php
/**
 * Shop Rev Slider
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<div class="sliderclass shop-sliderclass revslider_home_hidetop">
	<?php
	if ( function_exists( 'putRevSlider' ) ) {
		putRevSlider( virtue_premium_get_option( 'shop_rev_slider' ) );
	} else {
		echo '<p class="error" style="text-align:center; color: red;">' . esc_html__( 'Please Install Revolution Slider Plugin', 'virtue' ) . '</p>';
	}
	?>
</div><!--sliderclass-->
