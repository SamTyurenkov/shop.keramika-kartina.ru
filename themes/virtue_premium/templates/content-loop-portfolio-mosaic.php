<?php
/**
 * Content loop portfolio mosaic
 *
 * @package Virtue Theme
 */

global $post, $kt_portfolio_loop, $kt_portfolio_loop_mosaic;
$postsummery = get_post_meta( $post->ID, '_kad_post_summery', true );
$terms       = get_the_terms( $post->ID, 'portfolio-type' );
if ( $terms && ! is_wp_error( $terms ) ) {
	$links = array();
	foreach ( $terms as $term ) {
		$links[] = $term->slug;
	}
	$links = preg_replace( '/[^a-zA-Z 0-9]+/', ' ', $links );
	$links = str_replace( ' ', '-', $links );
	$tax   = join( ' ', $links );
} else {
	$tax = '';
}

if ( 31 == $kt_portfolio_loop_mosaic['item_count'] ) {
	$kt_portfolio_loop_mosaic['item_count'] = 0;
}
if ( in_array( $kt_portfolio_loop_mosaic['item_count'], explode( ',', $kt_portfolio_loop_mosaic['wide_string'] ) ) ) {
	$mosaic_xsize    = $kt_portfolio_loop_mosaic['ximgsize_wide'];
	$mosaic_ysize    = $kt_portfolio_loop_mosaic['yimgsize_wide'];
	$mosaic_itemsize = $kt_portfolio_loop_mosaic['itemsize_wide'];
} elseif ( in_array( $kt_portfolio_loop_mosaic['item_count'], explode( ',', $kt_portfolio_loop_mosaic['large_string'] ) ) ) {
	$mosaic_xsize    = $kt_portfolio_loop_mosaic['ximgsize_large'];
	$mosaic_ysize    = $kt_portfolio_loop_mosaic['yimgsize_large'];
	$mosaic_itemsize = $kt_portfolio_loop_mosaic['itemsize_large'];
} elseif ( in_array( $kt_portfolio_loop_mosaic['item_count'], explode( ',', $kt_portfolio_loop_mosaic['tall_string'] ) ) ) {
	$mosaic_xsize    = $kt_portfolio_loop_mosaic['ximgsize_tall'];
	$mosaic_ysize    = $kt_portfolio_loop_mosaic['yimgsize_tall'];
	$mosaic_itemsize = $kt_portfolio_loop_mosaic['itemsize_tall'];
} else {
	$mosaic_xsize    = $kt_portfolio_loop_mosaic['ximgsize_normal'];
	$mosaic_ysize    = $kt_portfolio_loop_mosaic['yimgsize_normal'];
	$mosaic_itemsize = $kt_portfolio_loop_mosaic['itemsize_normal'];
}
?>
<div class="<?php echo esc_attr( $mosaic_itemsize ); ?> <?php echo esc_attr( strtolower( $tax ) ); ?> all p-item">
	<div class="portfolio_item grid_item postclass kad-light-gallery g_mosiac_item kt_item_fade_in kad_portfolio_fade_in">
	<?php
	if ( 'slider' == $postsummery ) {
		$image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
		if ( ! empty( $image_gallery ) ) {
			$i = 1;
			$attachments = array_filter( explode( ',', $image_gallery ) );
			if ( $attachments ) {
				echo '<div class="mosaic_item_wrap">';
				echo '<div id="kt_slider_' . esc_attr( $post->ID ) . '" class="slick-slider kt-slickslider clearfix loading kt-slider-same-image-ratio" data-slider-speed="7000" data-slider-anim-speed="400" data-slider-fade="true" data-slider-type="slider" data-slider-center-mode="true" data-slider-auto="true" data-slider-arrows="true" data-slider-initdelay="' . esc_attr( rand( 10, 2000 ) ) . '">';
				foreach ( $attachments as $attachment ) {
					$img_args = array(
						'width'       => $mosaic_xsize,
						'height'      => $mosaic_ysize,
						'crop'        => true,
						'alt'         => null,
						'id'          => $attachment,
						'placeholder' => false,
					);
					$img = virtue_get_processed_image_array( $img_args );
					if ( 1 === $i ) {
						$firstattachment = $img['full'];
					}
					$item = get_post( $attachment );
					$img['extras'] = 'data-caption="' . esc_attr( wptexturize( $item->post_excerpt ) ) . '" itemprop="contentUrl"';
					echo '<div class="kt-slick-slide gallery_item">';
						echo '<div itemprop="image" itemscope itemtype="https://schema.org/ImageObject">';
							virtue_print_image_output( $img );
							echo '<meta itemprop="url" content="' . esc_url( $img['src'] ) . '">';
							echo '<meta itemprop="width" content="' . esc_attr( $img['width'] ) . 'px">';
							echo '<meta itemprop="height" content="' . esc_attr( $img['height'] ) . 'px">';
						echo '</div>';
					if ( 'true' == $kt_portfolio_loop['lightbox'] && 1 !== $i ) {
						echo '<a href="' . esc_url( $img['full'] ) . '" class="kad_portfolio_lightbox_link" data-rel="lightbox">';
						echo '<i class="icon-search"></i>';
						echo '</a>';
					}
					echo '</div>';
					$i++;
				}
				echo '</div>';
				if ( 'true' == $kt_portfolio_loop['lightbox'] ) {
					echo '<a href="' . esc_url( $firstattachment ) . '" class="kad_portfolio_lightbox_link" data-rel="lightbox">';
					echo '<i class="icon-search"></i>';
					echo '</a>';
				}
				echo '</div>';
			}
		}
	} elseif ( 'videolight' == $postsummery ) {
		if ( has_post_thumbnail( $post->ID ) ) {
		$image_id = get_post_thumbnail_id( $post->ID );
		$image_url = wp_get_attachment_image_src($image_id, 'full' ); 
		$thumbnailURL = $image_url[0]; 
		$image = aq_resize($thumbnailURL, $mosaic_xsize, $mosaic_ysize, true, false);
		$video_string = get_post_meta( $post->ID, '_kad_post_video_url', true );
		if(!empty($video_string)) {$video_url = $video_string;} else {$video_url = $thumbnailURL;}
		if(empty($image[0])) {$image = array($thumbnailURL,$mosaic_xsize,$mosaic_ysize);} 
		// Get srcset
		$img_srcset = kt_get_srcset( $image[1], $image[2], $thumbnailURL, $image_id);
		if(!empty($img_srcset) ) {
		$img_srcset_output = 'srcset="'.esc_attr($img_srcset).'" sizes="(max-width: '.esc_attr($image[1]).'px) 100vw, '.esc_attr($image[1]).'px"';
		} else {
		$img_srcset_output = '';
		}?>
		<div class="imghoverclass mosaic_item_wrap">
		<img src="<?php echo esc_url($image[0]); ?>" alt="<?php the_title_attribute(); ?>" width="<?php echo esc_attr($image[1]);?>" height="<?php echo esc_attr($image[2]);?>" <?php echo $img_srcset_output;?> class="lightboxhover" style="display: block;">
		</div>
		<?php if($kt_portfolio_loop['lightbox'] == 'true') {?>
				<a href="<?php echo esc_url($video_url); ?>" class="kad_portfolio_lightbox_link pvideolight" title="<?php the_title_attribute();?>" data-rel="lightbox">
					<i class="icon-search"></i>
				</a>
		<?php }?>
		<?php $image = null; $thumbnailURL = null;?>
		<?php } 
            } else {
					if (has_post_thumbnail( $post->ID ) ) {
						$image_id = get_post_thumbnail_id( $post->ID );
						$image_url = wp_get_attachment_image_src($image_id, 'full' ); 
						$thumbnailURL = $image_url[0]; 
						$image = aq_resize($thumbnailURL, $mosaic_xsize, $mosaic_ysize, true, false);
						if(empty($image[0])) {$image = array($thumbnailURL,$mosaic_xsize,$mosaic_ysize);}
						// Get srcset
		        		$img_srcset = kt_get_srcset( $image[1], $image[2], $thumbnailURL, $image_id);
		        		if(!empty($img_srcset) ) {
				        	$img_srcset_output = 'srcset="'.esc_attr($img_srcset).'" sizes="(max-width: '.esc_attr($image[1]).'px) 100vw, '.esc_attr($image[1]).'px"';
				        } else {
				        	$img_srcset_output = '';
				        }
		        		?>
							<div class="imghoverclass mosaic_item_wrap">
	                                <img src="<?php echo esc_url($image[0]); ?>" alt="<?php the_title_attribute(); ?>" width="<?php echo esc_attr($image[1]);?>" height="<?php echo esc_attr($image[2]);?>" <?php echo $img_srcset_output;?> class="lightboxhover" style="display: block;">
	                        </div>
	                                <?php if($kt_portfolio_loop['lightbox'] == 'true') {?>
												<a href="<?php echo esc_url($thumbnailURL); ?>" class="kad_portfolio_lightbox_link" title="<?php the_title_attribute();?>" data-rel="lightbox">
													<i class="icon-search"></i>
												</a>
									<?php }?>
                        <?php $image = null; $thumbnailURL = null;?>
                    <?php } 
            } ?>
            <a href="<?php the_permalink();?>" class="portfoliomosaiclink" title="<?php the_title_attribute(); ?>">
              						</a>
              	<a href="<?php the_permalink() ?>" class="portfoliolink">
					<div class="piteminfo">   
                        <h5><?php the_title();?></h5>
                        <?php if($kt_portfolio_loop['showtypes'] == 'true') {
                        	$terms = get_the_terms( $post->ID, 'portfolio-type' ); 
                        	if ($terms) {?> 
                        		<p class="cportfoliotag">
                        			<?php $output = array(); foreach($terms as $term){ $output[] = $term->name;} echo implode(', ', $output); ?>
                        		</p>
                        <?php } 
                       	} 
                       	if($kt_portfolio_loop['showexcerpt'] == 'true') { ?> 
                       		<p><?php echo virtue_excerpt(16); ?></p> 
                       	<?php } ?>
                    </div>
                </a>
        </div>
        </div>
        <?php $kt_portfolio_loop_mosaic['item_count'] ++;

