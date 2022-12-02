<?php
/**
 * Staff Post loop content
 *
 * @package Virtue Theme
 */

global $post, $kt_staff_loop;
if ( '2' == $kt_staff_loop['columns'] ) {
	$itemsize  = 'tcol-md-6 tcol-sm-6 tcol-xs-12 tcol-ss-12';
	$imgwidth  = 560;
	$imgheight = 560;
} elseif ( '1' == $kt_staff_loop['columns'] ) {
	$itemsize  = 'tcol-md-12 tcol-ss-12';
	$imgwidth  = 560;
	$imgheight = 560;
} elseif ( '3' == $kt_staff_loop['columns'] ) {
	$itemsize  = 'tcol-md-4 tcol-sm-4 tcol-xs-6 tcol-ss-12';
	$imgwidth  = 366;
	$imgheight = 366;
} elseif ( '6' == $kt_staff_loop['columns'] ) {
	$itemsize  = 'tcol-md-2 tcol-sm-3 tcol-xs-4 tcol-ss-6';
	$imgwidth  = 240;
	$imgheight = 240;
} elseif ( '5' == $kt_staff_loop['columns'] ) {
	$itemsize  = 'tcol-md-25 tcol-sm-3 tcol-xs-4 tcol-ss-6';
	$imgwidth  = 240;
	$imgheight = 240;
} else {
	$itemsize  = 'tcol-md-3 tcol-sm-4 tcol-xs-6 tcol-ss-12';
	$imgwidth  = 270;
	$imgheight = 270;
}
$crop = true;
if ( ! empty( $kt_staff_loop['cropheight'] ) ) {
	$imgheight = $kt_staff_loop['cropheight'];
}
if ( 'no' == $kt_staff_loop['crop'] ) {
	$imgheight = '';
	$crop      = false;
}
$image_width  = apply_filters( 'kt_staff_grid_image_width', $imgwidth );
$image_height = apply_filters( 'kt_staff_grid_image_height', $imgheight );

$terms = get_the_terms( $post->ID, 'staff-group' );
if ( $terms && ! is_wp_error( $terms ) ) {
	$links = array();
	foreach ( $terms as $term ) {
		$links[] = $term->name;
	}
	$links = preg_replace( '/[^a-zA-Z 0-9]+/', ' ', $links );
	$links = str_replace( ' ', '-', $links );
	$tax   = join( ' ', $links );
} else {
	$tax = '';
}
?>
<div class="<?php echo esc_attr( $itemsize ); ?> <?php echo esc_attr( strtolower( $tax ) ); ?> s_item">
	<div class="grid_item staff_item kt_item_fade_in kad_staff_fade_in postclass">
		<?php
		if ( has_post_thumbnail( $post->ID ) ) {
			$img_args = array(
				'width'         => $image_width,
				'height'        => $image_height,
				'crop'          => true,
				'class'         => null,
				'alt'           => null,
				'id'            => get_post_thumbnail_id(),
				'placeholder'   => false,
				'schema'        => false,
				'intrinsic'     => true,
				'intrinsic_max' => true,
			);
			$img = virtue_get_processed_image_array( $img_args );
			echo '<div class="imghoverclass">';

			if ( 'true' == $kt_staff_loop['link'] ) {
				echo '<a href="' . esc_attr( get_the_permalink() ) . '">';
			} elseif ( 'lightbox' == $kt_staff_loop['link'] ) {
				echo '<a href="' . esc_url( $img['full'] ) . '" data-rel="lightbox"  class="lightboxhover">';
			}
				virtue_print_full_image_output( $img_args );
			if ( 'true' == $kt_staff_loop['link'] || 'lightbox' == $kt_staff_loop['link'] ) {
				echo '</a>';
			}
			echo '</div>';
		}
		?>

		<div class="staff_item_info">   
			<?php
			if ( 'true' == $kt_staff_loop['link'] ) {
				echo '<a href="' . esc_attr( get_the_permalink() ) . '">';
			}
			?>
			<h3><?php the_title(); ?></h3>
			<?php
			if ( 'true' == $kt_staff_loop['link'] ) {
				echo '</a>';
			}

			if ( 'false' == $kt_staff_loop['content'] ) {
				the_excerpt();
			} else {
				the_content();
			}
			?>
		</div>
	</div>
</div>
