<?php
/**
 * Template Featured Slider
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
$lightbox = 'false';

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
?>
<div class="pagefeat container">
	<?php virtue_build_slider( $post->ID, $image_gallery, $slidewidth, $slideheight, $link, 'kt-slider-same-image-ratio', 'slider', $captions, $autoplay, virtue_premium_get_option( 'slider_pausetime' ) ); ?>
</div>
