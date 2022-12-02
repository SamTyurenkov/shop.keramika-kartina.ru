<?php
/**
 * Shop Kadence Slider Pro
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<div class="sliderclass shop-sliderclass revslider_home_hidetop">
	<?php
	echo do_shortcode( '[kadence_slider_pro id="' . virtue_premium_get_option( 'shop_ksp' ) . '"]' );
	?>
</div><!--sliderclass-->
