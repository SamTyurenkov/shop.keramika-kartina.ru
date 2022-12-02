<?php
/**
 * Shop Shortcode Slider
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<div class="sliderclass shortcode-slider-shop shop-sliderclass cyclone_shop_slider">
	<?php echo do_shortcode( virtue_premium_get_option( 'shop_cyclone_slider' ) ); ?>
</div><!--sliderclass-->
