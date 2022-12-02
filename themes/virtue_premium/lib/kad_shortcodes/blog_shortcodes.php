<?php 
/**
 * Blog Shortcodes
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Virtue blog shortcode
 *
 * @param array  $atts attributes.
 * @param string $content inner content.
 */
function kad_blog_shortcode_function( $atts, $content ) {
	extract( shortcode_atts( array(
		'orderby'    => '',
		'order'      => '',
		'type'       => '',
		'speed'      => '',
		'height'     => '',
		'width'      => '',
		'offset'     => null,
		'author'     => '',
		'cat'        => '',
		'columns'    => 'two',
		'word_count' => '',
		'items'      => '',
	), $atts ) );
	$carousel_rn = ( rand( 10, 100 ) );
	if ( empty( $orderby ) ) {
		$orderby = 'date';
	}
	if ( ! empty( $order ) ) {
		$order = $order;
	} elseif ( 'menu_order' == $orderby || 'title' == $orderby ) {
		$order = 'ASC';
	} else {
		$order = 'DESC';
	}
	if ( empty( $items ) ) {
		$items = '4';
	}
	if ( empty( $word_count ) ) {
		$word_count = '36';
	}
	if ( empty( $cat ) ) {
		$cat = '';
	}
	if ( empty( $author ) ) {
		$author = '';
	}

	if ( ! empty( $type ) && 'slider' == $type ) {
		if ( ! empty( $height ) ) {
			$slideheight = $height;
		} else {
			$slideheight = 400;
		}
		if ( ! empty( $width ) ) {
			$slidewidth = $width;
		} else {
			$slidewidth = 1140;
		}
		if ( empty( $speed ) ) {
			$speed = '7000';
		}
		ob_start();
		echo '<div class="sliderclass">';
		echo '<div id="kt_latest_slider_' . esc_attr( $carousel_rn ) . '" class="slick-slider kad-light-wp-gallery kt-slickslider loading kt-slider-same-image-ratio" data-slider-speed="' . esc_attr( $speed ) . '" data-slider-anim-speed="300" data-slider-fade="true" data-slider-type="slider" data-slider-center-mode="true" data-slider-auto="true" data-slider-thumbid="#kt_latest_slider_' . esc_attr( $carousel_rn ) . '-thumbs" data-slider-arrows="true" data-slider-initdelay="0" data-slides-to-show="1" data-slider-thumbs-showing="' . esc_attr( ceil( $slidewidth / 180 ) ) . '" style="max-width:' . esc_attr( $slidewidth ) . 'px;">';
		if ( isset( $wp_query ) ) {
			$temp = $wp_query;
		}
		$wp_query = null;
		$wp_query = new WP_Query();
		$wp_query->query( array(
			'orderby'        => $orderby,
			'order'          => $order,
			'offset'         => $offset,
			'post_type'      => 'post',
			'category_name'  => $cat,
			'posts_per_page' => $items,
		) );
		if ( $wp_query ) {
			while ( $wp_query->have_posts() ) :
				$wp_query->the_post();
				global $post;
				echo '<div class="kt-slick-slide">';
					echo '<a href="' . esc_url( get_the_permalink() ) . '">';
						$args = array(
							'width'       => $slidewidth,
							'height'      => $slideheight,
							'crop'        => true,
							'class'       => 'kt-latest-posts-slider',
							'alt'         => esc_attr( get_the_title() ),
							'id'          => ( has_post_thumbnail( $post->ID ) ? get_post_thumbnail_id( $post->ID ) : null ),
							'placeholder' => true,
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
			endwhile;
		} else {
			echo '<li class="error-not-found">' . esc_html__( 'Sorry, no blog entries found.', 'virtue' ) . '</li>';
		}
		$wp_query = null;
		if ( isset( $temp ) ) {
			$wp_query = $temp;
		}
		wp_reset_query();
		echo '</div>';
		echo '</div>';
		$output = ob_get_contents();
		ob_end_clean();
		wp_reset_postdata();
		return $output;
	} else {
		ob_start();
		if ( 'one' == $columns ) {
			$img_width      = 360;
			$postwidthclass = 'col-md-12 col-sm-12';
			$home_sidebar   = false;
			$articleclass   = 'home-blog-one-column';
		} else {
			if ( virtue_display_sidebar() ) {
				$home_sidebar   = true;
				$img_width      = 407;
				$postwidthclass = 'col-md-6 col-sm-6 home-sidebar';
				$articleclass   = 'home-blog-two-columns';
			} else {
				$home_sidebar   = false;
				$img_width      = 270;
				$postwidthclass = 'col-md-6 col-sm-6';
				$articleclass   = 'home-blog-two-columns';
			}
		} ?>
			<div class="home_blog kad-animation home-blog-shortcode <?php echo esc_attr( $articleclass ); ?>" data-animation="fade-in" data-delay="0">
				<div class="row">
				<?php
				$xyz      = '0';
				$wp_query = null;
				$wp_query = new WP_Query();
				$wp_query->query( array(
					'orderby'        => $orderby,
					'order'          => $order,
					'offset'         => $offset,
					'post_type'      => 'post',
					'author__in'     => $author,
					'category_name'  => $cat,
					'posts_per_page' => $items,
				) );
				if ( $wp_query ) {
					while ( $wp_query->have_posts() ) :
						$wp_query->the_post();
						?>
						<div class="<?php echo esc_attr( $postwidthclass ); ?> blog-home-shortcode-single-post clearclass<?php echo esc_attr( $xyz++%2 ); ?>">
							<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
								<div class="rowtight">
								<?php
								global $post;
								if ( 'text' != virtue_premium_get_option( 'post_summery_default' ) ) {
									if ( true == $home_sidebar ) {
										$textsize  = 'tcol-md-12 tcol-sm-12 tcol-ss-12';
										$imagesize = 'tcol-md-12 tcol-sm-12 tcol-ss-12';
									} else {
										$textsize  = 'tcol-md-7 tcol-sm-12 tcol-ss-12';
										$imagesize = 'tcol-md-5 tcol-sm-12 tcol-ss-12';
									}
									$args = array(
										'width'         => $img_width,
										'height'        => 270,
										'crop'          => true,
										'class'         => 'iconhover post-excerpt-image',
										'alt'           => null,
										'id'            => get_post_thumbnail_id( $post->ID ),
										'placeholder'   => true,
										'lazy'          => true,
										'schema'        => true,
										'intrinsic'     => true,
										'intrinsic_max' => true,
									);
									?>
									<div class="<?php echo esc_attr( $imagesize ); ?>">
										<div class="imghoverclass">
											<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
												<?php virtue_print_full_image_output( $args ); ?>
											</a>
										</div>
									</div>
									<?php
								} else {
									if ( has_post_thumbnail( $post->ID ) ) {
										if ( true == $home_sidebar ) {
											$textsize  = 'tcol-md-12 tcol-sm-12 tcol-ss-12';
											$imagesize = 'tcol-md-12 tcol-sm-12 tcol-ss-12';
										} else {
											$textsize  = 'tcol-md-7 tcol-sm-12 tcol-ss-12';
											$imagesize = 'tcol-md-5 tcol-sm-12 tcol-ss-12';
										}
										$args = array(
											'width'         => $img_width,
											'height'        => 270,
											'crop'          => true,
											'class'         => 'iconhover post-excerpt-image',
											'alt'           => null,
											'id'            => get_post_thumbnail_id( $post->ID ),
											'placeholder'   => true,
											'lazy'          => true,
											'schema'        => true,
											'intrinsic'     => true,
											'intrinsic_max' => true,
										);
										?>
										<div class="<?php echo esc_attr( $imagesize ); ?>">
											<div class="imghoverclass">
												<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
													<?php virtue_print_full_image_output( $args ); ?>
												</a> 
											</div>
										</div>
										<?php
									} else {
										$textsize = 'tcol-md-12 tcol-ss-12';
									}
								}
								?>
								<div class="<?php echo esc_attr( $textsize ); ?> postcontent">
									<div class="postmeta color_gray">
										<div class="postdate bg-lightgray headerfont">
											<span class="postday"><?php echo get_the_date( 'j' ); ?></span>
											<?php echo get_the_date( 'M Y' ); ?>
										</div>
									</div>
								<header class="home_blog_title">
									<a href="<?php the_permalink(); ?>">
										<h5 class="entry-title"><?php the_title(); ?></h5>
									</a>
									<div class="subhead color_gray">
									<span class="postauthortop" rel="tooltip" data-placement="top" data-original-title="<?php echo get_the_author(); ?>">
										<i class="icon-user"></i>
									</span>
									<span class="kad-hidepostauthortop"> | </span>
										<?php
										$post_category = get_the_category( $post->ID );
										if ( ! empty( $post_category ) ) {
											?>
											<span class="postedintop" rel="tooltip" data-placement="top" data-original-title="<?php foreach ( $post_category as $category ) { echo esc_html( $category->name ) . '&nbsp;'; } ?>"><i class="icon-folder"></i></span>
											<?php
										}
										if ( comments_open() || ( 0 != get_comments_number() ) ) {
											?>
											<span class="kad-hidepostedin">|</span>
											<span class="postcommentscount" rel="tooltip" data-placement="top" data-original-title="<?php esc_attr( get_comments_number() ); ?>">
												<i class="icon-bubbles"></i>
											</span>
										<?php } ?>
									</div>
								</header>
								<div class="entry-content">
									<p>
										<?php echo virtue_excerpt( $word_count ); ?>
										<a href="<?php the_permalink(); ?>">
											<?php
											echo esc_html( virtue_premium_get_option( 'post_readmore_text', __( 'Read More', 'virtue' ) ) );
											?>
										</a>
									</p>
								</div>
								<footer>
								</footer>
							</div>
						</div>
					</article>
				</div>
				<?php
				endwhile;
				} else {
				?>
				<li class="error-not-found"><?php esc_html_e( 'Sorry, no blog entries found.', 'virtue' ); ?></li>
				<?php
				}
				$wp_query = null;
				wp_reset_query();
				?>
			</div>
		</div> <!--home-blog -->
		<?php
		$output = ob_get_contents();
		ob_end_clean();
		wp_reset_postdata();
		return $output;
	}
}

/**
 * Shortcode for Blog Posts Full and Simple
 *
 * @param array  $atts attributes.
 * @param string $content inner content.
 */
function kad_blog_simple_shortcode_function( $atts, $content ) {
	extract( shortcode_atts( array(
		'orderby'             => 'date',
		'order'               => '',
		'cat'                 => '',
		'author'              => '',
		'offset'              => null,
		'fullpost'            => 'false',
		'ignore_sticky_posts' => 'false',
		'items'               => '8',
	), $atts ) );
	if ( ! empty( $order ) ) {
		$order = $order;
	} elseif ( 'menu_order' == $orderby || 'title' == $orderby ) {
		$order = 'ASC';
	} else {
		$order = 'DESC';
	}
	if ( empty( $cat ) ) {
		$cat = '';
	}
	if ( empty( $author ) ) {
		$author = '';
	}
	if ( 'true' == $ignore_sticky_posts ) {
		$sticky_posts = '1';
	} else {
		$sticky_posts = '0';
	}

	ob_start();
	global $kt_post_with_sidebar;
	if ( virtue_display_sidebar() ) {
		$display_sidebar      = true;
		$fullclass            = '';
		$kt_post_with_sidebar = true;
	} else {
		$display_sidebar      = false;
		$fullclass            = 'fullwidth';
		$kt_post_with_sidebar = false;
	}
	if ( 'true' == $fullpost ) {
		$summery   = 'full';
		$postclass = 'single-article fullpost';
	} else {
		$summery   = 'normal';
		$postclass = 'postlist';
	}
	?>
		<div class="<?php echo esc_attr( $postclass ) . ' ' . esc_attr( $fullclass ); ?>">
			<?php
			if ( ! empty( $wp_query ) ) {
				$temp = $wp_query;
			}
			$wp_query = null;
			$wp_query = new WP_Query();
			$wp_query->query( array(
				'orderby'             => $orderby,
				'order'               => $order,
				'offset'              => $offset,
				'author__in'          => $author,
				'category_name'       => $cat,
				'ignore_sticky_posts' => $sticky_posts,
				'posts_per_page'      => $items,
			) );
			$count = 0;
			if ( $wp_query ) {
				while ( $wp_query->have_posts() ) :
					$wp_query->the_post();
					if ( 'true' == $fullpost ) {
						get_template_part( 'templates/content', 'fullpost' );
					} else {
						 get_template_part( 'templates/content', get_post_format() );
					}
				endwhile;
			} else {
				?>
				<li class="error-not-found"><?php esc_html_e( 'Sorry, no blog entries found.', 'virtue' ); ?></li>
				<?php
			}
			$wp_query = null;
			if ( ! empty( $temp ) ) {
				$wp_query = $temp;
			}
			wp_reset_query();
			?>
		</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	wp_reset_postdata();
	return $output;
}

/**
 * Shortcode for Blog Post in a grid Grid
 *
 * @param array  $atts attributes.
 * @param string $content inner content.
 */
function kad_blog_grid_shortcode_function( $atts, $content ) {
	extract( shortcode_atts( array(
		'orderby'             => 'date',
		'order'               => '',
		'cat'                 => '',
		'author'              => '',
		'offset'              => null,
		'columns'             => '3',
		'iso_style'           => 'masonry',
		'ignore_sticky_posts' => 'false',
		'items'               => '8',
	), $atts ) );
	if ( ! empty( $order ) ) {
		$order = $order;
	} elseif ( 'menu_order' == $orderby || 'title' == $orderby ) {
		$order = 'ASC';
	} else {
		$order = 'DESC';
	}
	if ( empty( $cat ) ) {
		$cat = '';
	}
	if ( empty( $author ) ) {
		$author = '';
	}
	if ( 'true' == 'ignore_sticky_posts' ) {
		$sticky_posts = '1';
	} else {
		$sticky_posts = '0';
	}
	if ( '2' == $columns ) {
		$itemsize = 'tcol-md-6 tcol-sm-6 tcol-xs-12 tcol-ss-12';
	} elseif ( '3' == $columns ) {
		$itemsize = 'tcol-md-4 tcol-sm-4 tcol-xs-6 tcol-ss-12';
	} elseif ( '5' == $columns ) {
		$itemsize = 'tcol-md-25 tcol-sm-3 tcol-xs-4 tcol-ss-6';
	} elseif ( '6' == $columns ) {
		$itemsize = 'tcol-md-2 tcol-sm-25 tcol-xs-4 tcol-ss-6';
	} else {
		$itemsize = 'tcol-md-3 tcol-sm-4 tcol-xs-6 tcol-ss-12';
	}
	if ( '1' == virtue_premium_get_option( 'blog_grid_display_height' ) ) {
		$matchheight = 1;
	} else {
		$matchheight = 0;
	}
	ob_start();
	?>
		<div id="kad-blog-grid" class="shortcode_blog_grid_content rowtight reinit-isotope init-isotope" data-fade-in="<?php echo esc_attr( virtue_animate() ); ?>" data-iso-match-height="<?php echo esc_attr( $matchheight ); ?>" data-iso-selector=".b_item" data-iso-style="<?php echo esc_attr( $iso_style ); ?>"> 
		<?php
		if ( ! empty( $wp_query ) ) {
			$temp = $wp_query;
		}
		$wp_query = null;
		$wp_query = new WP_Query();
		$wp_query->query( array(
			'orderby'             => $orderby,
			'order'               => $order,
			'offset'              => $offset,
			'category_name'       => $cat,
			'author__in'          => $author,
			'ignore_sticky_posts' => $sticky_posts,
			'posts_per_page'      => $items,
		) );
		$count = 0;
		if ( $wp_query ) {
			while ( $wp_query->have_posts() ) :
				$wp_query->the_post();
				if ( '2' == $columns ) {
					?>
					<div class="<?php echo esc_attr( $itemsize ); ?> b_item kad_blog_item">
						<?php get_template_part( 'templates/content', 'twogrid' ); ?>
					</div>
					<?php
				} else {
					?>
					<div class="<?php echo esc_attr( $itemsize ); ?> b_item kad_blog_item">
						<?php get_template_part( 'templates/content', 'fourgrid' ); ?>
					</div>
					<?php
				}
			endwhile;
		} else {
			?>
			<li class="error-not-found"><?php esc_html_e( 'Sorry, no blog entries found.', 'virtue' ); ?></li>
			<?php
		}
		$wp_query = null;
		if ( ! empty( $temp ) ) {
			$wp_query = $temp;
		}
		wp_reset_query();
		?>
		</div>

	<?php
	$output = ob_get_contents();
	ob_end_clean();
	wp_reset_postdata();
	return $output;
}
