<?php
/**
 * Shop Flex Slider
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
if ( '1' == virtue_premium_get_option( 'shop_slider_captions' ) ) {
	$captions = 'true';
} else {
	$captions = 'false';
}
if ( '1' == virtue_premium_get_option( 'shop_slider_autoplay' ) ) {
	$autoplay = 'true';
} else {
	$autoplay = 'false';
}
if ( 'fade' == virtue_premium_get_option( 'shop_trans_type' ) ) {
	$trans_type = 'true';
} else {
	$trans_type = 'false';
}
?>
<div class="sliderclass clearfix home_desk_slider">
	<div id="imageslider" class="container">
		<?php
		virtue_build_slider_home( virtue_premium_get_option( 'shop_slider_images' ), virtue_premium_get_option( 'shop_slider_size_width', '1140' ), virtue_premium_get_option( 'shop_slider_size', '400' ), 'kt-slider-same-image-ratio', 'kt_slider_shop', 'slider', $captions, $autoplay, virtue_premium_get_option( 'shop_slider_pausetime', '7000' ), 'true', $trans_type, virtue_premium_get_option( 'shop_slider_transtime', '300' ) );
		?>
	</div><!--Container-->
</div><!--sliderclass-->
