<?php
/**
 * Home Flex Slider
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( '1' == virtue_premium_get_option( 'slider_captions' ) ) {
	$captions = 'true';
} else {
	$captions = 'false';
}
if ( '1' == virtue_premium_get_option( 'slider_autoplay' ) ) {
	$autoplay = 'true';
} else {
	$autoplay = 'false';
}
if ( 'fade' == virtue_premium_get_option( 'trans_type' ) ) {
	$trans_type = 'true';
} else {
	$trans_type = 'false';
}
?>
<div class="sliderclass clearfix home_desk_slider">
	<div id="imageslider" class="container">
		<?php
		virtue_build_slider_home( virtue_premium_get_option( 'home_slider' ), virtue_premium_get_option( 'slider_size_width', '1140' ), virtue_premium_get_option( 'slider_size', '400' ), 'kt-slider-same-image-ratio', 'kt_slider_home', 'slider', $captions, $autoplay, virtue_premium_get_option( 'slider_pausetime', '7000' ), 'true', $trans_type, virtue_premium_get_option( 'slider_transtime', '300' ) );
		?>
	</div><!--Container-->
</div><!--sliderclass-->
