<?php
/**
 * Content Single Portfolio
 *
 * @package Virtue Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
global $post;
?>
<div id="pageheader" class="titleclass">
	<div class="container">
		<div class="page-header single-portfolio-item">
			<div class="row">
				<div class="col-md-8 col-sm-8">
					<?php
					if ( kadence_display_portfolio_breadcrumbs() ) {
						kadence_breadcrumbs();
					}
					?>
					<h1 class="entry-title"><?php the_title(); ?></h1>
				</div>
				<div class="col-md-4 col-sm-4">
					<div class="portfolionav clearfix">
					<?php
					if ( 'cat' == virtue_premium_get_option( 'portfolio_arrow_nav' ) ) {
						$arrownav = true;
					} else {
						$arrownav = false;
					}
					$parent_link = get_post_meta( $post->ID, '_kad_portfolio_parent', true );
					if ( ! empty( $parent_link ) && ( 'default' != $parent_link ) ) {
						$parent_id = $parent_link;
					} else {
						$parent_id = virtue_premium_get_option( 'portfolio_link' );
					}
					previous_post_link_plus( array(
						'order_by'    => 'menu_order',
						'loop'        => true,
						'in_same_tax' => $arrownav,
						'format'      => '%link',
						'link'        => '<i class="icon-arrow-left"></i>',
					) );
					if ( ! empty( $parent_id ) ) {
						echo '<a href="' . esc_url( get_page_link( $parent_id ) ) . '" title="' . esc_attr( get_the_title( $parent_id ) ) . '">';
					} else {
						echo '<a href="../">';
					}
					echo '<i class="icon-grid"></i>';
					echo '</a>';

					next_post_link_plus( array(
						'order_by'    => 'menu_order',
						'loop'        => true,
						'in_same_tax' => $arrownav,
						'format'      => '%link',
						'link'        => '<i class="icon-arrow-right"></i>',
					) );
						?>
					</div>
				</div>
			</div>
		</div>
	</div><!--container-->
</div><!--titleclass-->
<?php
if ( ! post_password_required() ) {
	$layout     = get_post_meta( $post->ID, '_kad_ppost_layout', true );
	$ppost_type = get_post_meta( $post->ID, '_kad_ppost_type', true );
	$imgheight  = get_post_meta( $post->ID, '_kad_posthead_height', true );
	$imgwidth   = get_post_meta( $post->ID, '_kad_posthead_width', true );
	$autoplay   = get_post_meta( $post->ID, '_kad_portfolio_autoplay', true );
	if ( isset( $autoplay ) && 'no' == $autoplay ) {
		$slideauto = 'false';
	} else {
		$slideauto = 'true';
	}
	if ( 'above' == $layout ) {
		$imgclass     = 'col-md-12';
		$textclass    = 'pcfull clearfix';
		$entryclass   = 'col-md-8';
		$valueclass   = 'col-md-4';
		$slidewidth_d = 1140;
	} elseif ( 'three' == $layout ) {
		$imgclass     = 'col-md-12';
		$textclass    = 'pcfull clearfix';
		$entryclass   = 'col-md-12';
		$valueclass   = 'col-md-12';
		$slidewidth_d = 1140;
	} else {
		$imgclass     = 'col-md-7';
		$textclass    = 'col-md-5 pcside';
		$entryclass   = '';
		$valueclass   = '';
		$slidewidth_d = 653;
	}
	$portfolio_margin = '';
	if ( ! empty( $imgheight ) ) {
		$slideheight = $imgheight;
		$imageheight = $imgheight;
	} else {
		$slideheight = 450;
		$imageheight = apply_filters( 'kt_single_portfolio_image_height', 450 );
	}
	if ( ! empty( $imgwidth ) ) {
		$slidewidth = $imgwidth;
	} else {
		$slidewidth = $slidewidth_d;
	}

	do_action( 'kadence_single_portfolio_before' );

	if ( 'imgcarousel' == $ppost_type ) {
		?>
		<div class="postfeat carousel_outerrim">
			<div id="portfolio-carousel-gallery" class="fredcarousel" style="overflow:hidden;">
			<?php
			$image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
			if ( ! empty( $image_gallery ) ) {
				virtue_build_slider( $post->ID, $image_gallery, null, $slideheight, 'image', 'kt-image-carousel kt-image-carousel-center-fade kad-wp-gallery', 'carousel', 'false', $slideauto, '7000', 'true', 'false', '300' );
			}
			?>
			</div> <!--fredcarousel-->
		</div>
	<?php
	}
	?>
	<div id="content" class="container">
		<div class="row">
			<div class="main <?php echo esc_attr( virtue_main_class() ); ?> portfolio-single" role="main">
			<?php
			while ( have_posts() ) :
				the_post();
				?>
				<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">
					<div class="postclass">
						<div class="row">
							<div class="<?php echo esc_attr( $imgclass ); ?>">
							<?php
							do_action( 'kadence_single_portfolio_before_feature' );
							if ( 'flex' == $ppost_type ) {
								$image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
								if ( ! empty( $image_gallery ) ) {
									virtue_build_slider( $post->ID, $image_gallery, $slidewidth, $slideheight, 'image', 'kt-slider-same-image-ratio', 'slider', 'false', $slideauto );
								}
							} elseif ( 'rev' == $ppost_type || 'cyclone' == $ppost_type || 'ktslider' == $ppost_type ) {

								$shortcodeslider = get_post_meta( $post->ID, '_kad_shortcode_slider', true );
								if ( ! empty( $shortcodeslider ) ) {
									echo do_shortcode( $shortcodeslider );
								}
							} elseif ( 'video' == $ppost_type ) {
								echo '<div class="videofit">';
								$video_url = get_post_meta( $post->ID, '_kad_post_video_url', true );
								if ( ! empty( $video_url ) ) {
									echo wp_oembed_get( $video_url );
								} else {
									$video = get_post_meta( $post->ID, '_kad_post_video', true );
									echo do_shortcode( $video );
								}
								echo '</div>';
							} elseif ( 'imagegrid' == $ppost_type ) {
								$image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
								$columns = get_post_meta( $post->ID, '_kad_portfolio_img_grid_columns', true );
								if ( empty( $columns ) ) {
									$columns = '4';
								}
								echo do_shortcode( '[gallery ids="' . esc_attr( $image_gallery ) . '" columns="' . esc_attr( $columns ) . '"]' );
							} elseif ( 'carousel' == $ppost_type ) {
								echo '<div id="imageslider" class="carousel_outerrim">';
									$image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
									virtue_build_slider( $post->ID, $image_gallery, null, $slideheight, 'image', 'kt-slider-different-image-ratio', 'slider', 'false', $slideauto, '7000', 'true', 'false' );
								echo '</div><!--Container-->';
							} elseif ( 'imagelist' == $ppost_type ) {
								echo '<div class="kad-light-gallery">';
								$image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
								if ( ! empty( $image_gallery ) ) {
									$attachments = array_filter( explode( ',', $image_gallery ) );
									if ( $attachments ) {
										$counter = 0;
										foreach ( $attachments as $attachment ) {
											$caption       = get_post( $attachment )->post_excerpt;
											$img           = virtue_get_image_array( $slidewidth, $slideheight, true, 'kt-plist-image', null, $attachment );
											$img['schema'] = true;
											echo '<div class="portfolio_list_item pli' . esc_attr( $counter ) . '">';
												echo '<a href="' . esc_attr( $img['full'] ) . '" data-rel="lightbox" class="lightboxhover" title="' . esc_attr( $caption ) . '">';
													virtue_print_image_output( $img );
												echo '</a>';
											echo '</div>';
											$counter ++;
										}
									}
								}
								echo '</div>';
							} elseif ( 'imagelist2' == $ppost_type ) {
								echo '<div class="kad-light-gallery portfolio_image_list_style2">';
								$image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
								if ( ! empty( $image_gallery ) ) {
									$attachments = array_filter( explode( ',', $image_gallery ) );
									if ( $attachments ) {
										$counter = 0;
										foreach ( $attachments as $attachment ) {
											$caption       = get_post( $attachment )->post_excerpt;
											$img           = virtue_get_image_array( $slidewidth, $slideheight, true, 'kt-plist-image', null, $attachment );
											$img['schema'] = true;

											echo '<div class="portfolio_list_item pli' . esc_attr( $counter ) . '">';
												echo '<a href="' . esc_attr( $img['full'] ) . '" data-rel="lightbox" class="lightboxhover" title="' . esc_attr( $caption ) . '">';
													virtue_print_image_output( $img );
												echo '</a>';
											echo '</div>';
											$counter ++;
										}
									}
								}
								echo '</div>';
							} elseif ( 'imgcarousel' == $ppost_type ) {
								// Nothing needs to be done.
								$portfolio_margin = '';
							} elseif ( 'none' == $ppost_type ) {
								$portfolio_margin = 'kad_portfolio_nomargin';
							} else {
								if ( has_post_thumbnail( $post->ID ) ) {
									$img           = virtue_get_image_array( $slidewidth, $slideheight, true, 'kt-pfeature-image', null, get_post_thumbnail_id() );
									$img['schema'] = true;
									echo '<div class="imghoverclass portfolio-single-img">';
										echo '<a href="' . esc_attr( $img['full'] ) . '" data-rel="lightbox" class="lightboxhover">';
											virtue_print_image_output( $img );
										echo '</a>';
									echo '</div>';
								}
							}
							do_action( 'kadence_single_portfolio_after_feature' );
							?>
							</div><!--imgclass -->
							<div class="<?php echo esc_attr( $textclass ); ?>">
								<div class="entry-content <?php echo esc_attr( $entryclass ); ?> <?php echo esc_attr( $portfolio_margin ); ?>">
									<?php
									do_action( 'kadence_single_portfolio_before_content' );
									the_content();
									do_action( 'kadence_single_portfolio_after_content' );
									?>
								</div>
								<?php
								$project_v1t = get_post_meta( $post->ID, '_kad_project_val01_title', true );
								$project_v1d = get_post_meta( $post->ID, '_kad_project_val01_description', true );
								$project_v2t = get_post_meta( $post->ID, '_kad_project_val02_title', true );
								$project_v2d = get_post_meta( $post->ID, '_kad_project_val02_description', true );
								$project_v3t = get_post_meta( $post->ID, '_kad_project_val03_title', true );
								$project_v3d = get_post_meta( $post->ID, '_kad_project_val03_description', true );
								$project_v4t = get_post_meta( $post->ID, '_kad_project_val04_title', true );
								$project_v4d = get_post_meta( $post->ID, '_kad_project_val04_description', true );
								$project_v5t = get_post_meta( $post->ID, '_kad_project_val05_title', true );
								$project_v5d = get_post_meta( $post->ID, '_kad_project_val05_description', true );
								$tag_terms   = get_the_terms( $post->ID, 'portfolio-tag' );
								if ( ! empty( $project_v1t ) || ! empty( $project_v2t ) || ! empty( $project_v3t ) || ! empty( $project_v4t ) || ! empty( $project_v5t ) || ! empty( $tag_terms ) ) {
									?>
								<div class="<?php echo esc_attr( $valueclass ); ?>">
									<div class="pcbelow">
									<?php do_action( 'kadence_single_portfolio_value_before' ); ?> 
										<ul class="portfolio-content disc">
										<?php
										if ( ! empty( $project_v1t ) ) {
											echo '<li class="pdetails"><span>' . wp_kses_post( $project_v1t ) . '</span> ' . wp_kses_post( $project_v1d ) . '</li>';
										}
										if ( ! empty( $project_v2t ) ) {
											echo '<li class="pdetails"><span>' . wp_kses_post( $project_v2t ) . '</span> ' . wp_kses_post( $project_v2d ) . '</li>';
										}
										if ( ! empty( $project_v3t ) ) {
											echo '<li class="pdetails"><span>' . wp_kses_post( $project_v3t ) . '</span> ' . wp_kses_post( $project_v3d ) . '</li>';
										}
										if ( ! empty( $project_v4t ) ) {
											echo '<li class="pdetails"><span>' . wp_kses_post( $project_v4t ) . '</span> ' . wp_kses_post( $project_v4d ) . '</li>';
										}
										if ( ! empty( $project_v5t ) ) {
											echo '<li class="pdetails"><span>' . wp_kses_post( $project_v5t ) . '</span> <a href="' . esc_url( $project_v5d ) . '" target="_new">' . esc_html( $project_v5d ) . '</a></li>';
										}
										if ( $tag_terms ) {
											?>
											<li class="kt-portfolio-tags pdetails"><span class="portfoliotags"><i class="icon-tag"></i> </span>
												<?php echo get_the_term_list( $post->ID, 'portfolio-tag', '', ', ', '' ); ?>
											</li>
											<?php
										}
										do_action( 'kadence_single_portfolio_list_li' );
										?>
										</ul><!--Portfolio-content-->
									<?php do_action( 'kadence_single_portfolio_value_after' ); ?> 
									</div>
								</div>
								<?php } ?>
							</div><!--textclass -->
						</div><!--row-->
						<div class="clearfix"></div>
					</div><!--postclass-->
					<footer>
					<?php
					/**
					 * Hoook for footer nav.
					 *
					 * @hooked virtue_portfolio_nav - 10
					 */
					do_action( 'kadence_single_portfolio_footer' );
					?>
					</footer>
				</article>
				<?php
				/**
				 * Hook for carousel and comments
				 *
				 * @hooked virtue_portfolio_bottom_carousel - 30
				 * @hooked virtue_portfolio_comments - 40
				 */
				do_action( 'kadence_single_portfolio_after' );

			endwhile;

} else {
	?>
	<div id="content" class="container">
		<div class="row">
			<div class="main <?php echo esc_attr( virtue_main_class() ); ?> portfolio-single" role="main">
			<?php
			echo get_the_password_form();
}
?>
			</div>
<?php do_action( 'kadence_single_portfolio_end' ); ?>
