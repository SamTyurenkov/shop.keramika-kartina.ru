<?php
/**
 * Home Latest Slider
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
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
		echo '<div id="kt_latest_slider_home" class="slick-slider kad-light-wp-gallery kt-slickslider loading kt-slider-same-image-ratio" data-slider-speed="' . esc_attr( virtue_premium_get_option( 'slider_pausetime', '7000' ) ) . '" data-slider-anim-speed="' . esc_attr( virtue_premium_get_option( 'slider_transtime', '300' ) ) . '" data-slider-fade="' . esc_attr( $trans_type ) . '" data-slider-type="slider" data-slider-center-mode="true" data-slider-auto="' . esc_attr( $autoplay ) . '" data-slider-thumbid="#kt_latest_slider_home-thumbs" data-slider-arrows="true" data-slider-initdelay="0" data-slides-to-show="1" data-slider-thumbs-showing="' . esc_attr( ceil( virtue_premium_get_option( 'slider_size_width', '1140' ) / 180 ) ) . '" style="max-width:' . esc_attr( virtue_premium_get_option( 'slider_size_width', '1140' ) ) . 'px;">';
		$temp     = $wp_query;
		$wp_query = null;
		$wp_query = new WP_Query();
		$wp_query->query( array( 'posts_per_page' => 4 ) );
		if ( $wp_query ) {
			while ( $wp_query->have_posts() ) :
				$wp_query->the_post();
				if ( has_post_thumbnail( $post->ID ) ) {
					echo '<div class="kt-slick-slide">';
						echo '<a href="' . esc_url( get_the_permalink() ) . '">';
							$args = array(
								'width'       => virtue_premium_get_option( 'slider_size_width', '1140' ),
								'height'      => virtue_premium_get_option( 'slider_size', '400' ),
								'crop'        => true,
								'class'       => 'kt-latest-posts-slider',
								'alt'         => esc_attr( get_the_title() ),
								'id'          => get_post_thumbnail_id( $post->ID ),
								'placeholder' => false,
								'lazy'        => false,
								'schema'      => true,
							);
							virtue_print_full_image_output( $args );
							echo '<div class="flex-caption">';
								echo '<div class="captiontitle headerfont">';
									the_title();
								echo '</div>';
							echo '</div>';
						echo '</a>';
					echo '</div>';
				}
			endwhile;
		} else {
			echo '<li class="error-not-found">' . esc_html__( 'Sorry, no blog entries found.', 'virtue' ) . '</li>';
		}
		$wp_query = null;
		$wp_query = $temp;
		wp_reset_query();
		echo '</div>';
		?>
	</div><!--Container-->
</div><!--sliderclass-->
