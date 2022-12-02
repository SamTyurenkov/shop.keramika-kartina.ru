<?php
/**
 * Build Slider functions.
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! function_exists( 'virtue_build_slider_home' ) ) {
	/**
	 * Build Home Slider.
	 *
	 * @param string $slides the slides.
	 * @param string $width the width.
	 * @param string $height the height.
	 * @param string $class the class.
	 * @param string $id the id.
	 * @param string $type the type.
	 * @param string $captions enable captions.
	 * @param string $auto enable auto.
	 * @param string $speed the speed.
	 * @param string $arrows enable arrows.
	 * @param string $fade enable fade.
	 * @param string $fade_speed the fade_speed.
	 */
	function virtue_build_slider_home( $slides = null, $width = null, $height = null, $class = null, $id = 'kt_slider_options', $type = 'slider', $captions = 'false', $auto = 'true', $speed = '7000', $arrows = 'true', $fade = 'true', $fade_speed = '400' ) {
		$crop     = true;
		$imgwidth = $width;
		$stype    = 'slider';
		if ( 'thumb' === $type ) {
			echo '<div class="thumb-slider-container" style="max-width:' . esc_attr( $width ) . 'px;">';
			$stype = 'thumb';
		} elseif ( 'different-ratio' === $type ) {
			$crop     = false;
			$imgwidth = null;
		} elseif ( 'carousel' === $type ) {
			$crop     = false;
			$imgwidth = null;
			$width    = 'none';
			$stype    = 'carousel';
			$fade     = 'false';
			$class   .= ' kt-image-carousel';
		}
		if ( ! empty( $slides ) ) :
			echo '<div id="' . esc_attr( $id ) . '" class="slick-slider kad-light-gallery kt-slickslider titleclass loading ' . esc_attr( $class ) . '" data-slider-speed="' . esc_attr( $speed ) . '" data-slider-anim-speed="' . esc_attr( $fade_speed ) . '" data-slider-fade="' . esc_attr( $fade ) . '" data-slider-type="' . esc_attr( $stype ) . '" data-slider-auto="' . esc_attr( $auto ) . '" data-slider-thumbid="#' . esc_attr( $id ) . '-thumbs" data-slider-arrows="' . esc_attr( $arrows ) . '" data-slider-thumbs-showing="' . esc_attr( ceil( $width / 180 ) ) . '" style="max-width:' . esc_attr( $width ) . 'px;">';
			foreach ( $slides as $slide ) {
				$alt = get_post_meta( $slide['attachment_id'], '_wp_attachment_image_alt', true );
				$img = virtue_get_image_array( $imgwidth, $height, $crop, null, $alt, $slide['attachment_id'], false );
				echo '<div class="kt-slick-slide">';
				if ( ! empty( $slide['link'] ) ) {
					if ( ! empty( $slide['target'] ) && 1 == $slide['target'] ) {
						$target = '_blank';
					} else {
						$target = '_self';
					}
					echo '<a href="' . esc_url( $slide['link'] ) . '" target="' . esc_attr( $target ) . '" class="kt-slider-image-link">';
				}
					echo '<div itemprop="image" itemscope itemtype="https://schema.org/ImageObject">';
						echo '<img src="' . esc_url( $img['src'] ) . '" width="' . esc_attr( $img['width'] ) . '" height="' . esc_attr( $img['height'] ) . '" alt="' . esc_attr( $img['alt'] ) . '" itemprop="contentUrl" ' . wp_kses_post( $img['srcset'] ) . '/>';
						echo '<meta itemprop="url" content="' . esc_url( $img['src'] ) . '">';
						echo '<meta itemprop="width" content="' . esc_attr( $img['width'] ) . 'px">';
						echo '<meta itemprop="height" content="' . esc_attr( $img['height'] ) . 'px">';
					echo '</div>';
				if ( 'true' == $captions ) {
						echo '<div class="flex-caption">';
					if ( ! empty( $slide['title'] ) ) {
						echo '<div class="captiontitle headerfont">' . wp_kses_post( $slide['title'] ) . '</div>';
					}
					if ( ! empty( $slide['description'] ) ) {
						echo '<div><div class="captiontext headerfont"><p>' . wp_kses_post( $slide['description'] ) . '</p></div></div>';
					}
						echo '</div>';
				}
				if ( ! empty( $slide['link'] ) ) {
					echo '</a>';
				}
				echo '</div>';
			}
			echo '</div> <!--Image Slider-->';
			if ( 'thumb' === $type ) {
				echo '<div id="' . esc_attr( $id ) . '-thumbs" class="kt-slickslider-thumbs slick-slider">';
				foreach ( $slides as $slide ) {
					$alt = get_post_meta( $slide['attachment_id'], '_wp_attachment_image_alt', true );
					$img = virtue_get_image_array( 180, 100, true, null, $alt, $slide['attachment_id'], false );
					echo '<div class="kt-slick-thumb">';
						echo '<img src="' . esc_url( $img['src'] ) . '" width="' . esc_attr( $img['width'] ) . '" height="' . esc_attr( $img['height'] ) . '" alt="' . esc_attr( $img['alt'] ) . '" itemprop="image" ' . wp_kses_post( $img['srcset'] ) . '/>';
						echo '<div class="thumb-highlight"></div>';
					echo '</div>';
				}
				echo '</div> <!--kt-slickslider-thumbs-->';
				echo '</div> <!--Thumb Container-->';
			}
		endif;
	}
}

if ( ! function_exists( 'virtue_build_slider_home_fullwidth' ) ) {
	/**
	 * Build Home Fullwidth Slider.
	 *
	 * @param string $slides the slides.
	 * @param string $width the width.
	 * @param string $height the height.
	 * @param string $class the class.
	 * @param string $id the id.
	 * @param string $type the type.
	 * @param string $captions enable captions.
	 * @param string $auto enable auto.
	 * @param string $speed the speed.
	 * @param string $arrows enable arrows.
	 * @param string $fade enable fade.
	 * @param string $fade_speed the fade_speed.
	 */
	function virtue_build_slider_home_fullwidth( $slides = null, $width = null, $height = null, $class = null, $id = 'kt_slider_options', $type = 'slider', $captions = 'false', $auto = 'true', $speed = '7000', $arrows = 'true', $fade = 'true', $fade_speed = '400' ) {
		$stype = 'slider';
		if ( ! empty( $slides ) ) :
			echo '<div id="' . esc_attr( $id ) . '" class="slick-slider kad-home-full-slider titleclass kt-slickslider loading ' . esc_attr( $class ) . '" data-slider-speed="' . esc_attr( $speed ) . '" data-slider-anim-speed="' . esc_attr( $fade_speed ) . '" data-slider-fade="' . esc_attr( $fade ) . '" data-slider-type="' . esc_attr( $stype ) . '" data-slider-auto="' . esc_attr( $auto ) . '" data-slider-thumbid="#' . esc_attr( $id ) . '-thumbs" data-slider-arrows="' . esc_attr( $arrows ) . '" data-slider-thumbs-showing="0">';
			foreach ( $slides as $slide ) {
				echo '<div class="kt-slick-slide">';
				if ( ! empty( $slide['link'] ) ) {
					if ( ! empty( $slide['target'] ) && 1 == $slide['target'] ) {
						$target = '_blank';
					} else {
						$target = '_self';
					}
					echo '<a href="' . esc_url( $slide['link'] ) . '" target="' . esc_attr( $target ) . '" class="kt-slider-image-link">';
				}
				echo '<div class="kt-flex-fullslide" style="background-image:url(' . esc_url( $slide['url'] ) . '); height:' . esc_attr( $height ) . 'px;">';
				if ( 'true' == $captions ) {
					echo '<div class="flex-caption" style="height:' . esc_attr( $height ) . 'px;">';
						echo '<div class="flex-caption-case" style="height:' . esc_attr( $height ) . 'px;">';
					if ( ! empty( $slide['title'] ) ) {
						echo '<div class="captiontitle headerfont">' . wp_kses_post( $slide['title'] ) . '</div>';
					}
					if ( ! empty( $slide['description'] ) ) {
						echo '<div><div class="captiontext headerfont">' . wp_kses_post( $slide['description'] ) . '</div></div>';
					}
						echo '</div>';
					echo '</div>';
				}
				echo '</div>';
				if ( ! empty( $slide['link'] ) ) {
					echo '</a>';
				}
				echo '</div>';
			}
			echo '</div> <!--Image Slider-->';
		endif;
	}
}

if ( ! function_exists( 'virtue_build_slider' ) ) {
	/**
	 * Build a Slider.
	 *
	 * @param string $id the id of the slider.
	 * @param string $images the images to show.
	 * @param string $width the width.
	 * @param string $height the height.
	 * @param string $link the type of link for the slider.
	 * @param string $class the class.
	 * @param string $type the type.
	 * @param string $captions enable captions.
	 * @param string $auto enable auto.
	 * @param string $speed the speed.
	 * @param string $arrows enable arrows.
	 * @param string $fade enable fade.
	 * @param string $fade_speed the fade_speed.
	 * @param string $delay the start delay.
	 */
	function virtue_build_slider( $id = 'post', $images = null, $width = null, $height = null, $link = 'image', $class = null, $type = 'slider', $captions = 'false', $auto = 'true', $speed = '7000', $arrows = 'true', $fade = 'true', $fade_speed = '400', $delay = '0' ) {
		if ( empty( $images ) ) {
			global $post;
			$attach_args = array(
				'order'          => 'ASC',
				'post_type'      => 'attachment',
				'post_parent'    => $post->ID,
				'post_mime_type' => 'image',
				'post_status'    => null,
				'orderby'        => 'menu_order',
				'numberposts'    => 10,
			);
			$attachments_posts = get_posts( $attach_args );
			$images = '';
			foreach ( $attachments_posts as $val ) {
				$images .= $val->ID . ',';
			}
		}
		$thumb_overview_width = $width;
		if ( empty( $thumb_overview_width ) ) {
			$thumb_overview_width = 400;
		}
		if ( 'thumb' == $type ) {
			echo '<div class="thumb-slider-container" style="max-width:' . esc_attr( $width ) . 'px;">';
		}
		if ( ! empty( $images ) ) :
			$attachments = array_filter( explode( ',', $images ) );
			$items = count( $attachments );
			if ( 11 < $items ) {
				$show_slides = 10;
			} else {
				$show_slides = $items - 1;
			}
			echo '<div id="kt_slider_' . esc_attr( $id ) . '" class="slick-slider kad-light-wp-gallery kt-slickslider loading ' . esc_attr( $class ) . '" data-slider-speed="' . esc_attr( $speed ) . '" data-slider-anim-speed="' . esc_attr( $fade_speed ) . '" data-slider-fade="' . esc_attr( $fade ) . '" data-slider-type="' . esc_attr( $type ) . '" data-slider-center-mode="true" data-slider-auto="' . esc_attr( $auto ) . '" data-slider-thumbid="#kt_slider_' . esc_attr( $id ) . '-thumbs" data-slider-arrows="' . esc_attr( $arrows ) . '" data-slider-initdelay="' . esc_attr( $delay ) . '" data-slides-to-show="' . esc_attr( $show_slides ) . '" data-slider-thumbs-showing="' . esc_attr( ceil( $thumb_overview_width / 80 ) ) . '" style="max-width:' . esc_attr( $width ) . 'px;">';

			$attachments = array_filter( explode( ',', $images ) );
			if ( $attachments ) {
				foreach ( $attachments as $attachment ) {
					$alt           = get_post_meta( $attachment, '_wp_attachment_image_alt', true );
					$img           = virtue_get_image_array( $width, $height, true, null, $alt, $attachment, false );
					$item          = get_post( $attachment );
					$img['schema'] = true;
					$img['lazy']   = false;
					$img['extras'] = 'data-caption="' . esc_attr( $item->post_excerpt ) . '"';

					echo '<div class="kt-slick-slide gallery_item">';
					if ( 'post' == $link ) {
						echo '<a href="' . esc_url( get_the_permalink() ) . '" class="kt-slider-image-link">';
					} elseif ( 'attachment' == $link ) {
						echo '<a href="' . esc_url( get_permalink( $attachment ) ) . '" class="kt-slider-image-link">';
					} elseif ( 'none' == $link ) {
						echo '';
					} else {
						echo '<a href="' . esc_url( $img['full'] ) . '" data-rel="lightbox" class="kt-slider-image-link">';
					}
					virtue_print_image_output( $img );

					if ( 'true' == $captions ) {
						if ( trim( $item->post_excerpt ) ) {
							echo '<div class="caption flex-caption">';
								echo '<div class="captiontitle headerfont">' . wp_kses_post( $item->post_excerpt ) . '</div>';
							echo '</div>';
						}
					}
					if ( 'none' != $link ) {
						echo '</a>';
					}
					echo '</div>';
				}
			}
			echo '</div> <!--Image Slider-->';
			if ( 'thumb' == $type ) {
				echo '<div id="kt_slider_' . esc_attr( $id ) . '-thumbs" class="kt-slickslider-thumbs slick-slider">';
				$attachments = array_filter( explode( ',', $images ) );
				if ( $attachments ) {
					foreach ( $attachments as $attachment ) {
						$alt = get_post_meta( $attachment, '_wp_attachment_image_alt', true );
						$img = virtue_get_image_array( 80, 80, true, null, $alt, $attachment, false );
						echo '<div class="kt-slick-thumb">';
						echo '<img src="' . esc_url( $img['src'] ) . '" width="' . esc_attr( $img['width'] ) . '" height="' . esc_attr( $img['height'] ) . '" alt="' . esc_attr( $img['alt'] ) . '" itemprop="image" ' . wp_kses_post( $img['srcset'] ) . '/>';
						echo '<div class="thumb-highlight"></div>';
						echo '</div>';
					}
				}
					echo '</div><!--Image Slider-->';
				echo '</div><!--thumb-slider-container-->';
			}
		endif;
	}
}
if ( ! function_exists( 'virtue_build_post_carousel' ) ) {
	/**
	 * Build a post carousel.
	 *
	 * @param string $width the width.
	 * @param string $height the height.
	 * @param string $class the class.
	 * @param string $type the type.
	 * @param string $cat the post category.
	 * @param number $items the amount of items.
	 * @param string $orderby orderby method.
	 * @param string $order order method.
	 * @param string $offset the order offset.
	 * @param string $auto enable auto.
	 * @param string $speed the speed.
	 * @param string $arrows enable arrows.
	 * @param string $trans_speed the slide speed.
	 * @param string $featured for featured products.
	 */
	function virtue_build_post_carousel( $width = null, $height = 400, $class = null, $type = 'post', $cat = null, $items = 8, $orderby = 'date', $order = 'DESC', $offset = null, $auto = 'true', $speed = '7000', $arrows = 'true', $trans_speed = '400', $featured = null ) {
		$extraargs = array();
		if ( 'portfolio' == $type ) {
			$tax = 'portfolio-type';
			$qtax = 'portfolio-type';
		} elseif ( 'product' == $type ) {
			if ( 'true' == $featured ) {
				$extraargs = array(
					'meta_key'   => '_featured',
					'meta_value' => 'yes',
				);
			}
			$tax  = 'product_cat';
			$qtax = 'product_cat';
		} elseif ( 'staff' == $type ) {
			$tax  = 'staff-group';
			$qtax = 'staff-group';
		} elseif ( 'testimonal' == $type ) {
			$tax  = 'testimonal-group';
			$qtax = 'testimonal-group';
		} else {
			$tax  = 'category';
			$qtax = 'category_name';
		}
		if ( ! empty( $cat ) ) {
			$cat = get_term( $cat, $tax );
			$cat = $cat->slug;
		}
		$args = array(
			'orderby'        => $orderby,
			'order'          => $order,
			'post_type'      => $type,
			'offset'         => $offset,
			'post_status'    => 'publish',
			$qtax            => $cat,
			'posts_per_page' => $items,
		);
		$args = array_merge( $args, $extraargs );
		echo '<div class="slick-slider kad-light-gallery kt-slickslider loading ' . esc_attr( $class ) . '" data-slides-to-show="' . esc_attr( $items - 1 ) . '" data-slider-speed="' . esc_attr( $speed ) . '" data-slider-anim-speed="' . esc_attr( $trans_speed ) . '" data-slider-fade="false" data-slider-type="carousel" data-slider-auto="' . esc_attr( $auto ) . '" data-slider-arrows="' . esc_attr( $arrows ) . '">';
		if ( isset( $wp_query ) ) {
			$temp = $wp_query;
		} else {
			$temp = null;
		}
		$wp_query = null;
		$wp_query = new WP_Query();
		$wp_query->query( $args );
		if ( $wp_query ) {
			while ( $wp_query->have_posts() ) :
				$wp_query->the_post();
				global $post;
				$img = virtue_get_image_array( $width, $height, true, null, null, null, true );
				echo '<div class="kt-slick-slide blog_photo_item">';
					echo '<div class="carousel-image-object" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">';
						echo '<img src="' . esc_url( $img['src'] ) . '" width="' . esc_attr( $img['width'] ) . '" height="' . esc_attr( $img['height'] ) . '" ' . wp_kses_post( $img['srcset'] ) . ' class="' . esc_attr( $img['class'] ) . '" itemprop="contentUrl" alt="' . esc_attr( $img['alt'] ) . '">';
						echo '<meta itemprop="url" content="' . esc_url( $img['src'] ) . '">';
						echo '<meta itemprop="width" content="' . esc_attr( $img['width'] ) . 'px">';
						echo '<meta itemprop="height" content="' . esc_attr( $img['height'] ) . 'px">';
					echo '</div>';
					echo '<div class="photo-postcontent">';
						echo '<div class="photo-post-bg"></div>';
						echo '<div class="photo-postcontent-inner">';
							echo '<header>';
								echo '<h4 class="entry-title">' . get_the_title() . '</h4>';
							echo '</header>';
							echo '<div class="kt-post-photo-added-content">';
								echo '<div class="kt_post_category">';
								if ( 'product' == $type ) {
									if ( function_exists( 'woocommerce_template_loop_price' ) ) {
										woocommerce_template_loop_price();
									}
								} elseif ( 'post' != $type ) {
									the_terms( $post->ID, $tax, '', ' | ', '' );
								} else {
									the_category(' | ');
								}
								echo '</div>';
							echo '</div>';
						echo '</div>';
					echo '</div>';
				echo '<a href="' . esc_url( get_the_permalink() ) . '" class="photo-post-link"></a>';
				echo '</div>';
			endwhile;
		} else {
			echo '<div class="error-not-found">' . esc_html__( 'Sorry, no entries found.', 'virtue' ) . '</li>';
		}
		$wp_query = null;
		$wp_query = $temp;  // Reset.
		wp_reset_query();
		echo '</div> <!--Post Carousel-->';
	}
}
