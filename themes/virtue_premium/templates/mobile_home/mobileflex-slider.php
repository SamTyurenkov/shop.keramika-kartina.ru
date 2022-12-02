<?php
/**
 * Home Flex Mobile Slider
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( '1' == virtue_premium_get_option( 'mobile_slider_captions' ) ) {
	$captions = 'true';
} else {
	$captions = 'false';
}
if ( '1' == virtue_premium_get_option( 'mobile_slider_autoplay' ) ) {
	$autoplay = 'true';
} else {
	$autoplay = 'false';
}
if ( 'fade' == virtue_premium_get_option( 'mobile_trans_type' ) ) {
	$trans_type = 'true';
} else {
	$trans_type = 'false';
}
?>

<div class="sliderclass clearfix home_mobile_slider">
	<div id="imageslider" class="container">
		<?php
		virtue_build_slider_home( virtue_premium_get_option( 'home_mobile_slider' ), virtue_premium_get_option( 'mobile_slider_size_width', '480' ), virtue_premium_get_option( 'mobile_slider_size', '300' ), 'kt-slider-same-image-ratio', 'kt_slider_home_mobile', 'slider', $captions, $autoplay, virtue_premium_get_option( 'mobile_slider_pausetime', '7000' ), 'true', $trans_type, virtue_premium_get_option( 'mobile_slider_transtime', '300' ) );
		?>
	</div><!--Container-->
</div><!--sliderclass-->

