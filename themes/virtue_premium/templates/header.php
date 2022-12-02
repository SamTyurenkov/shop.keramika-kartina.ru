<?php
/**
 * Main Header File
 *
 * @package Virtue Theme
 */

if ( '1' == virtue_premium_get_option( 'primary_sticky' ) && ( 'logocenter' == virtue_premium_get_option( 'logo_layout' ) || 'logowidget' == virtue_premium_get_option( 'logo_layout' ) ) ) {
	$menu_stick       = 1;
	$menu_stick_class = 'kt-mainnavsticky';
} else {
	$menu_stick       = 0;
	$menu_stick_class = '';
}

?>
<header id="kad-banner" class="banner headerclass kt-not-mobile-sticky <?php echo esc_attr( $menu_stick_class ); ?>" data-header-shrink="0" data-mobile-sticky="0" data-menu-stick="<?php echo esc_attr( $menu_stick ); ?>">
<?php
if ( '1' == virtue_premium_get_option( 'topbar' ) ) {
	get_template_part( 'templates/header', 'topbar' );
}

if ( 'logocenter' === virtue_premium_get_option( 'logo_layout' ) ) {
	$logocclass = 'col-md-12';
	$menulclass = 'col-md-12';
} elseif ( 'logohalf' === virtue_premium_get_option( 'logo_layout' ) ) {
	$logocclass = 'col-md-6';
	$menulclass = 'col-md-6';
} elseif ( 'logowidget' === virtue_premium_get_option( 'logo_layout' ) ) {
	$logocclass = 'col-md-4';
	$menulclass = 'col-md-12';
} else {
	$logocclass = 'col-md-4';
	$menulclass = 'col-md-8';
}
?>
	<div class="container">
		<div class="row">
			<div class="<?php echo esc_attr( $logocclass ); ?> clearfix kad-header-left">
				<div id="logo" class="logocase">
					<a class="brand logofont" href="<?php echo esc_url( apply_filters( 'kadence_logo_link', home_url( '/' ) ) ); ?>" title="<?php bloginfo( 'name' ); ?>">
						<?php
						$logo_img = virtue_premium_get_option( 'x1_virtue_logo_upload' );
						if ( isset( $logo_img['url'] ) && ! empty( $logo_img['url'] ) ) {
							?>
							<div id="thelogo">
								<?php
								$logo_width = virtue_premium_get_option( 'logo_width' );
								if ( ! empty( $logo_width ) ) {
									$img = array(
										'width'         => $logo_width,
										'height'        => null,
										'crop'          => false,
										'class'         => 'kad-standard-logo',
										'alt'           => get_bloginfo( 'name' ),
										'id'            => $logo_img['id'],
										'placeholder'   => false,
										'lazy'          => true,
										'schema'        => false,
										'intrinsic'     => true,
										'intrinsic_max' => true,
									);
									virtue_print_full_image_output( $img );
								} else {
									?>
									<img src="<?php echo esc_url( $logo_img['url'] ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="kad-standard-logo" />
									<?php
								}
								$hd_logo_img = virtue_premium_get_option( 'x2_virtue_logo_upload' );
								if ( isset( $hd_logo_img['url'] ) && ! empty( $hd_logo_img['url'] ) ) {
									?>
									<img src="<?php echo esc_url( $hd_logo_img['url'] ); ?>" class="kad-retina-logo" alt="<?php bloginfo( 'name' ); ?>" style="max-height:<?php echo esc_attr( $logo_img['height'] ); ?>px" />
								<?php } ?>
							</div>
						<?php
						} else {
							echo wp_kses_post( apply_filters( 'virtue_site_name', get_bloginfo( 'name' ) ) );
						}
						?>
					</a>
					<?php
					$belowlogo_text = virtue_premium_get_option( 'logo_below_text' );
					if ( ! empty( $belowlogo_text ) ) {
						?>
					<p class="kad_tagline belowlogo-text"><?php echo wp_kses_post( virtue_premium_get_option( 'logo_below_text' ) ); ?></p>
				<?php } ?>
				</div> <!-- Close #logo -->
			</div><!-- close kad-header-left -->
			<?php if ( 'logowidget' === virtue_premium_get_option( 'logo_layout' ) ) { ?>
				<div class="col-md-8 kad-header-widget">
					<?php
					if ( is_active_sidebar( 'headerwidget' ) ) {
						dynamic_sidebar( 'headerwidget' );
					}
					?>
				</div><!-- close kad-header-widget -->
			</div><!-- Close Row -->
			<div class="row"> 
			<?php } ?>
			<div class="<?php echo esc_attr( $menulclass ); ?> kad-header-right">
			<?php
			do_action( 'kt_before_right_header_content' );
			if ( has_nav_menu( 'primary_navigation' ) ) {
				do_action( 'virtue_above_primarymenu' );
				?>
				<nav id="nav-main" class="clearfix">
					<?php
					wp_nav_menu( array(
						'theme_location' => 'primary_navigation',
						'menu_class'     => 'sf-menu',
					) );
					?>
				</nav>
				<?php
			}
			do_action( 'kt_after_right_header_content' );
			?>
			</div> <!-- Close kad-header-right -->       
		</div> <!-- Close Row -->
		<?php
		if ( has_nav_menu( 'mobile_navigation' ) ) {
			if ( '1' == virtue_premium_get_option( 'mobile_header' ) && '1' == virtue_premium_get_option( 'mobile_header_tablet_show' ) ) {
				echo '<!-- mobileheader -->';
			} else {
				?>
				<div id="mobile-nav-trigger" class="nav-trigger mobile-nav-trigger-id">
					<button class="nav-trigger-case collapsed mobileclass" data-toggle="collapse" rel="nofollow" data-target=".mobile_menu_collapse">
						<span class="kad-navbtn clearfix">
							<i class="icon-menu"></i>
						</span>
						<span class="kad-menu-name">
							<?php echo esc_html( virtue_premium_get_option( 'mobile_menu_text', __( 'Menu', 'virtue' ) ) ); ?>
						</span>
					</button>
				</div>
				<div id="kad-mobile-nav" class="kad-mobile-nav id-kad-mobile-nav">
					<div class="kad-nav-inner mobileclass">
						<div id="mobile_menu_collapse" class="kad-nav-collapse collapse mobile_menu_collapse">
							<?php
							do_action( 'kt_mobile_menu_before' );
							if ( '1' == virtue_premium_get_option( 'menu_search' ) ) {
								if ( class_exists( 'woocommerce' ) && '1' == virtue_premium_get_option( 'menu_search_woo' ) ) {
									get_product_search_form();
								} else {
									get_search_form();
								}
							}
							if ( '1' == virtue_premium_get_option( 'mobile_submenu_collapse' ) ) {
								wp_nav_menu( array(
									'theme_location' => 'mobile_navigation',
									'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
									'menu_class'     => 'kad-mnav',
									'walker'         => new Virtue_Mobile_Nav_Walker(),
								) );
							} else {
								wp_nav_menu( array(
									'theme_location' => 'mobile_navigation',
									'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
									'menu_class'     => 'kad-mnav',
								) );
							}
							do_action( 'kt_mobile_menu_after' );
							?>
						</div>
					</div>
				</div>   
			<?php
			}
		}
		?>
	</div> <!-- Close Container -->
	<?php
	do_action( 'kt_before_secondary_navigation' );
	if ( has_nav_menu( 'secondary_navigation' ) ) {
		?>
		<div id="cat_nav" class="navclass">
			<div class="container">
				<nav id="nav-second" class="clearfix">
					<?php
					wp_nav_menu( array(
						'theme_location' => 'secondary_navigation',
						'menu_class'     => 'sf-menu',
					) );
					?>
				</nav>
			</div><!--close container-->
		</div><!--close navclass-->
		<?php
	}
	$banner_img = virtue_premium_get_option( 'virtue_banner_upload' );
	if ( isset( $banner_img['url'] ) && ! empty( $banner_img['url'] ) ) {
		?>
		<div class="container virtue_sitewide_banner">
			<div class="virtue_banner">
				<?php
				$banner_link = virtue_premium_get_option( 'virtue_banner_link' );
				if ( ! empty( $banner_link ) ) {
					?>
					<a href="<?php echo esc_url( virtue_premium_get_option( 'virtue_banner_link' ) ); ?>">
					<?php
				}
					$alt_text = get_post_meta( $banner_img['id'], '_wp_attachment_image_alt', true );
					?>
					<img src="<?php echo esc_url( $banner_img['url'] ); ?>" width="<?php echo esc_attr( $banner_img['width'] ); ?>" height="<?php echo esc_attr( $banner_img['height'] ); ?>" alt="<?php echo esc_attr( $alt_text ); ?>" />
				<?php
				if ( ! empty( $banner_link ) ) {
					?>
					</a>
				<?php
				}
				?>
			</div><!--close virtue_banner-->
		</div><!--close container-->
		<?php
	}
	do_action( 'kt_after_header_content' );
	?>
</header>
