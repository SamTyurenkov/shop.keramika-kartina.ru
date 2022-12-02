<?php
/**
 * Template Featured Carousel Slider
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

global $post;

$uselightbox = get_post_meta( $post->ID, '_kad_feature_img_lightbox', true );
$height      = get_post_meta( $post->ID, '_kad_posthead_height', true );
$swidth      = get_post_meta( $post->ID, '_kad_posthead_width', true );
if ( ! empty( $uselightbox ) && 'no' == $uselightbox ) {
	$link = 'none';
} else {
	$link = 'image';
}

if ( ! empty( $height ) ) {
	$slideheight = $height;
} else {
	$slideheight = 400;
}
if ( ! empty( $swidth ) ) {
	$slidewidth = $swidth;
} else {
	$slidewidth = 1140;
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

$image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );

echo '<section class="pagefeat carousel_outerrim">';
	echo '<div class="carousel_slider_outer" style="max-width:' . esc_attr( $slidewidth ) . 'px;">';
		virtue_build_slider( $post->ID, $image_gallery, null, $slideheight, $link, 'kt-slider-different-image-ratio carousel_slider', 'slider', $captions, $autoplay, virtue_premium_get_option( 'slider_pausetime' ), 'true', 'false' );
	echo '</div>';
echo '</section>';
