<?php
/**
 * Virtue Premium Theme Options
 *
 * @package     Virtue Theme
 * @since       4.6.6
 */

/**
 * Theme Options
 */
if ( ! class_exists( 'Virtue_Theme_Options' ) ) {
	/**
	 * Theme Options
	 */
	class Virtue_Theme_Options {
		/**
		 * Holds default theme option values
		 *
		 * @var default values of the theme.
		 */
		public static $default_options = null;

		/**
		 * Holds theme option values
		 *
		 * @var values of the theme settings.
		 */
		public static $options = null;

		/**
		 * Class instance control.
		 *
		 * @access private
		 * @var $instance Class instance.
		 */
		private static $instance;

		/**
		 * Instance Control.
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self;
			}
			return self::$instance;
		}
		/**
		 * Set default theme option values
		 *
		 * @return default values of the theme.
		 */
		public static function defaults() {
			if ( is_null( self::$default_options ) ) {
				self::$default_options = apply_filters( 'virtue_theme_options_defaults', array(
					'boxed_layout'                           => 'wide',
					'sidebar_side'                           => 'right',
					// Header.
					'header_style'                           => 'standard',
					'header_height'                          => '120',
					'side_header_menu_width'                 => '33.333333',
					'sticky_header'                          => 0,
					'shrink_center_header'                   => 0,
					'shrink_center_header_height'            => '120',
					'm_center_sticky_header'                 => 0,
					'm_sticky_header'                        => 0,
					'logo_layout'                            => 'logoleft',
					'primary_sticky'                         => 0,
					'x1_virtue_logo_upload'                  => '',
					'logo_width'                             => '',
					'x2_virtue_logo_upload'                  => '',
					'font_logo_style'                        => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '32px',
						'line-height'        => '40px',
					),
					'logo_below_text'                        => '',
					'font_tagline_style'                     => array(
						'font-family'        => 'Lato',
						'color'              => '#444444',
						'font-style'         => '400',
						'font-size'          => '14px',
						'line-height'        => '20px',
					),
					'logo_padding_top'                       => '25',
					'logo_padding_bottom'                    => '10',
					'logo_padding_left'                      => '0',
					'logo_padding_right'                     => '0',
					'logo_padding_right'                     => '0',
					'menu_margin_top'                        => '40',
					'menu_margin_bottom'                     => '10',
					'virtue_banner_upload'                   => '',
					'virtue_banner_link'                     => '',
					'sitewide_after_header_shortcode_input'  => '',
					// Mobile header.
					'mobile_header'                          => 0,
					'mobile_header_tablet_show'              => 0,
					'mobile_header_logo'                     => '',
					'mobile_header_height'                   => '60',
					'mobile_header_sticky'                   => 0,
					'mobile_header_account'                  => 0,
					'mobile_header_cart'                     => 0,
					'mobile_header_search'                   => 0,
					'mobile_header_search_woo'               => 0,
					// Topbar settings.
					'topbar'                                 => 1,
					'topbar_off_mobile'                      => 0,
					'topbar_mobile'                          => 0,
					'topbar_icons'                           => 0,
					'topbar_icon_menu'                       => '',
					'show_cartcount'                         => 1,
					'topbar_search'                          => 1,
					'topbar_widget'                          => 0,
					'topbar_layout'                          => 0,
					// Footer settings.
					'footer_layout'                          => 'fourc',
					'sitewide_calltoaction'                  => 0,
					'sitewide_action_text'                   => '',
					'sitewide_action_color'                  => '',
					'sitewide_action_text_btn'               => '',
					'sitewide_action_link'                   => '',
					'sitewide_action_btn_color'              => '',
					'sitewide_action_bg_color'               => '',
					'sitewide_action_btn_color_hover'        => '',
					'sitewide_action_bg_color_hover'         => '',
					'sitewide_action_padding'                => '20',
					'sitewide_action_background'             => '',
					'sitewide_footer_shortcode_input'        => '',
					// Home slider.
					'choose_slider'                          => 'none',
					'rev_slider'                             => '',
					'kt_slider'                              => '',
					'ksp_slider'                             => '',
					'above_header_slider'                    => 0,
					'above_header_slider_arrow'              => 0,
					'home_cyclone_slider'                    => '',
					'home_slider'                            => '',
					'slider_size'                            => '400',
					'slider_size_width'                      => '1140',
					'slider_autoplay'                        => 1,
					'slider_pausetime'                       => '7000',
					'trans_type'                             => 'fade',
					'slider_transtime'                       => '600',
					'slider_captions'                        => 0,
					'video_embed'                            => '',
					// Home Mobile slider.
					'mobile_switch'                          => 0,
					'mobile_tablet_show'                     => 0,
					'choose_mobile_slider'                   => 'none',
					'mobile_rev_slider'                      => '',
					'mobile_ksp'                             => '',
					'mobile_cyclone_slider'                  => '',
					'home_mobile_slider'                     => '',
					'mobile_slider_size'                     => '300',
					'mobile_slider_size_width'               => '480',
					'mobile_slider_autoplay'                 => 1,
					'mobile_slider_pausetime'                => '7000',
					'mobile_trans_type'                      => 'fade',
					'mobile_slider_transtime'                => '600',
					'mobile_slider_captions'                 => 0,
					'mobile_video_embed'                     => '',
					// Home Page.
					'home_sidebar_layout'                    => 'full',
					'home_sidebar'                           => 'sidebar-primary',
					'homepage_layout'                        => '',
					// Home Image menu.
					'home_image_menu'                        => '',
					'home_image_menu_column'                 => '3',
					'img_menu_height'                        => '110',
					'img_menu_height_setting'                => 'normal',
					// Home Feature Product.
					'product_title'                          => '',
					'home_product_feat_column'               => '4',
					'home_product_count'                     => '6',
					'home_product_feat_scroll'               => 'oneitem',
					'home_product_feat_speed'                => '9',
					// Home On sale Products.
					'product_sale_title'                     => '',
					'home_product_sale_column'               => '4',
					'home_product_sale_count'                => '6',
					'home_product_sale_scroll'               => 'oneitem',
					'home_product_sale_speed'                => '9',
					// Home Best Selling Products.
					'product_best_title'                     => '',
					'home_product_best_column'               => '4',
					'home_product_best_count'                => '6',
					'home_product_best_scroll'               => 'oneitem',
					'home_product_best_speed'                => '9',
					// Home Latest Posts.
					'blog_title'                             => '',
					'home_post_count'                        => '2',
					'home_post_column'                       => '2',
					'home_post_type'                         => '',
					'home_post_word_count'                   => '34',
					// Home Portfolio carousel.
					'portfolio_title'                        => '',
					'portfolio_type'                         => '',
					'home_portfolio_carousel_column'         => '3',
					'home_portfolio_carousel_height'         => '',
					'home_portfolio_carousel_count'          => '6',
					'home_portfolio_carousel_speed'          => 'oneitem',
					'home_portfolio_order'                   => 'menu_order',
					'portfolio_show_type'                    => 0,
					'portfolio_show_excerpt'                 => 0,
					// Home Custom Carousel.
					'custom_carousel_title'                  => '',
					'home_custom_carousel_items'             => '',
					'home_custom_carousel_column'            => '3',
					'home_custom_carousel_scroll'            => 'oneitem',
					'home_custom_speed'                      => '9',
					'home_custom_carousel_imageratio'        => 0,
					// Home Icon Menu.
					'icon_menu'                              => '',
					'home_icon_menu_column'                  => '3',
					'icon_bg_color'                          => '',
					'icon_font_color'                        => '',
					// Home portfolio grid.
					'portfolio_full_title'                   => '',
					'portfolio_full_type'                    => '',
					'portfolio_full_show_filter'             => 0,
					'home_port_count'                        => '8',
					'home_portfolio_full_order'              => 'menu_order',
					'home_portfolio_full_layout'             => 'normal',
					'home_port_columns'                      => '4',
					'home_portfolio_full_height'             => '',
					'portfolio_full_masonry'                 => 0,
					'portfolio_full_show_type'               => 0,
					'portfolio_full_show_excerpt'            => 0,
					'home_portfolio_lightboxt'               => 0,
					// Home Content.
					'home_post_summery'                      => 'summery',
					'home_post_grid'                         => 0,
					'home_post_grid_columns'                 => 'fourcolumn',
					// Shop Settings.
					'product_shop_layout'                    => '4',
					'shop_layout'                            => 'full',
					'shop_sidebar'                           => 'sidebar-primary',
					'shop_cat_layout'                        => 'full',
					'shop_cat_sidebar'                       => 'sidebar-primary',
					'products_per_page'                      => '12',
					'product_fitrows'                        => 1,
					'shop_filter'                            => 0,
					'cat_filter'                             => 0,
					'infinitescroll'                         => 0,
					'shop_toggle'                            => 0,
					'shop_excerpt'                           => 0,
					'shop_rating'                            => 1,
					'outofstocktag'                          => 0,
					'shop_hide_action'                       => 1,
					'product_img_flip'                       => 0,
					'product_quantity_input'                 => 1,
					// Shop Cat Layout/Images.
					'product_cat_layout'                     => '4',
					'product_cat_img_ratio'                  => 'widelandscape',
					// Shop Product Title Settings.
					'font_shop_title'                        => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '700',
						'font-size'          => '16px',
						'line-height'        => '20px',
					),
					'shop_title_uppercase'                   => 0,
					'shop_title_min_height'                  => '40',
					// Product Image Sizes.
					'shop_img_ratio'                         => 'square',
					'product_img_resize'                     => 1,
					'product_simg_resize'                    => 1,
					// Shop Slider.
					'shop_slider'                            => 0,
					'choose_shop_slider'                     => 'none',
					'shop_rev_slider'                        => 'select',
					'shop_ksp'                               => 'select',
					'shop_cyclone_slider'                    => '',
					'shop_slider_size'                       => '400',
					'shop_slider_size_width'                 => '1140',
					'shop_slider_autoplay'                   => 1,
					'shop_slider_pausetime'                  => '7000',
					'shop_trans_type'                        => 'fade',
					'shop_slider_transtime'                  => '600',
					'shop_slider_captions'                   => 0,

					'singleproduct_layout'                   => 'normal',
					'product_gallery_slider'                 => 0,
					'product_gallery_zoom'                   => 0,
					'product_sidebar_default'                => 'no',
					'product_sidebar_default_sidebar'        => 'sidebar-primary',
					'product_radio'                          => 0,
					'product_nav'                            => 0,
					'product_tabs'                           => 1,
					'product_tabs_scroll'                    => 0,
					'ptab_description'                       => '10',
					'ptab_additional'                        => '20',
					'ptab_reviews'                           => '30',
					'ptab_video'                             => '40',
					'custom_tab_01'                          => 0,
					'custom_tab_02'                          => 0,
					'custom_tab_03'                          => 0,
					'related_products'                       => 1,
					'related_item_column'                    => '4',

					'portfolio_permalink'                    => '',
					'portfolio_comments'                     => 0,
					'portfolio_header_single_image_height'   => 0,
					'portfolio_link'                         => '',
					'portfolio_arrow_nav'                    => 'all',
					'portfolio_tax_column'                   => '4',
					'portfolio_tax_items'                    => '12',
					'portfolio_tax_order'                    => 'menu_order',
					'portfolio_tax_height'                   => '',
					'portfolio_tax_masonry'                  => 0,
					'portfolio_tax_lightbox'                 => 1,
					'portfolio_type_under_title'             => 1,
					'portfolio_tax_show_excerpt'             => 0,
					'portfolio_recent_car_column'            => '4',
					'portfolio_recent_carousel_speed'        => '9',
					'portfolio_recent_car_items'             => '8',
					'portfolio_recent_carousel_scroll'       => 'oneitem',

					'post_word_count'                        => '40',
					'custom_excerpt_readmore'                => 0,
					'close_comments'                         => 0,
					'hide_author'                            => 1,
					'hide_postedin'                          => 1,
					'hide_commenticon'                       => 1,
					'hide_postdate'                          => 1,
					'show_postlinks'                         => 0,
					'postlinks_in_cat'                       => 'all',
					'blog_infinitescroll'                    => 0,
					'blog_cat_infinitescroll'                => 0,
					'blog_grid_display_height'               => 0,
					'blogpost_sidebar_default'               => 'yes',
					'blogpost_sidebar_id_default'            => 'sidebar-primary',
					'post_summery_default'                   => 'text',
					'post_summery_default_image'             => '',
					'post_head_default'                      => 'none',
					'post_header_single_image_height'        => 0,
					'post_author_default'                    => 'no',
					'post_carousel_default'                  => 'no',
					'blog_similar_random_order'              => 0,
					'post_carousel_columns'                  => '3',
					'category_post_summary'                  => 'summary',
					'category_post_grid_column'              => '3',
					'blog_cat_layout'                        => 'sidebar',
					'blog_cat_sidebar'                       => 'sidebar-primary',

					'skin_stylesheet'                        => 'default.css',
					'primary_color'                          => '',
					'primary20_color'                        => '',
					'gray_font_color'                        => '',
					'footerfont_color'                       => '',

					'content_bg_color'                       => '',
					'bg_content_bg_img'                      => '',
					'content_bg_repeat'                      => '',
					'content_bg_placementx'                  => '',
					'content_bg_placementy'                  => '',
					'topbar_bg_color'                        => '',
					'bg_topbar_bg_img'                       => '',
					'topbar_bg_repeat'                       => '',
					'topbar_bg_placementx'                   => '',
					'topbar_bg_placementy'                   => '',
					'header_bg_color'                        => '',
					'bg_header_bg_img'                       => '',
					'header_bg_repeat'                       => '',
					'header_bg_placementx'                   => '',
					'header_bg_placementy'                   => '',
					'menu_bg_color'                          => '',
					'bg_menu_bg_img'                         => '',
					'menu_bg_repeat'                         => '',
					'menu_bg_placementx'                     => '',
					'menu_bg_placementy'                     => '',
					'mobile_bg_color'                        => '',
					'bg_mobile_bg_img'                       => '',
					'mobile_bg_repeat'                       => '',
					'mobile_bg_placementx'                   => '',
					'mobile_bg_placementy'                   => '',
					'feature_bg_color'                       => '',
					'bg_feature_bg_img'                      => '',
					'feature_bg_repeat'                      => '',
					'feature_bg_placementx'                  => '',
					'feature_bg_placementy'                  => '',
					'footer_bg_color'                        => '',
					'bg_footer_bg_img'                       => '',
					'footer_bg_repeat'                       => '',
					'footer_bg_placementx'                   => '',
					'footer_bg_placementy'                   => '',
					'boxed_bg_color'                         => '',
					'bg_boxed_bg_img'                        => '',
					'boxed_bg_repeat'                        => '',
					'boxed_bg_placementx'                    => '',
					'boxed_bg_placementy'                    => '',
					'boxed_bg_fixed'                         => '',
					'boxed_bg_size'                          => '',

					'font_h1'                                => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '38px',
						'line-height'        => '40px',
					),
					'font_h2'                                => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '32px',
						'line-height'        => '40px',
					),
					'font_h3'                                => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '28px',
						'line-height'        => '40px',
					),
					'font_h4'                                => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '24px',
						'line-height'        => '40px',
					),
					'font_h5'                                => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '18px',
						'line-height'        => '24px',
					),
					'font_p'                                => array(
						'font-family'        => '',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '14px',
						'line-height'        => '20px',
					),

					'show_subindicator'                      => 0,
					'menu_search'                            => 0,
					'menu_search_woo'                        => 0,
					'menu_account'                           => 0,
					'menu_cart'                              => 0,
					'font_primary_menu'                      => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '12px',
						'line-height'        => '18px',
					),
					'primarymenu_hover_color'                => '',
					'primarymenu_hover_bg_color'             => '',
					'font_secondary_menu'                      => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '18px',
						'line-height'        => '22px',
					),
					'secondarymenu_hover_color'              => '',
					'secondarymenu_hover_bg_color'           => '',
					'secondary_menu_size'                    => '16.5%',

					'dropdown_font_color'                    => '',
					'dropdown_background_color'              => '',
					'dropdown_border_color'                  => '',
					'dropdown_menu_font_size'                => array(
						'font-size'          => '12px',
						'line-height'        => 'inherit',
					),
					'dropdown_font_hover_color'              => '',
					'show_mobile_btn'                        => 0,
					'mobile_submenu_collapse'                => 0,
					'font_mobile_menu'                       => array(
						'font-family'        => 'Lato',
						'color'              => '',
						'font-style'         => '400',
						'font-size'          => '16px',
						'line-height'        => '20px',
					),
					'mobilemenu_hover_color'                 => '',
					'mobilemenu_hover_bg_color'              => '',

					'mobile_menu_text'                       => '',
					'search_placeholder_text'                => '',
					'cart_placeholder_text'                  => '',
					'sold_placeholder_text'                  => '',
					'sale_placeholder_text'                  => '',
					'wc_clear_placeholder_text'              => '',
					'notavailable_placeholder_text'          => '',
					'post_readmore_text'                     => '',
					'post_by_text'                           => '',
					'post_incat_text'                        => '',
					'filter_all_text'                        => '',
					'shop_filter_text'                       => '',
					'portfolio_filter_text'                  => '',
					'description_tab_text'                   => '',
					'description_header_text'                => '',
					'additional_information_tab_text'        => '',
					'additional_information_header_text'     => '',
					'video_tab_text'                         => '',
					'video_title_text'                       => '',
					'reviews_tab_text'                       => '',
					'related_products_text'                  => '',
					'wc_upsell_products_text'                => '',
					'lightbox_loading_text'                  => '',
					'lightbox_of_text'                       => '',
					'lightbox_error_text'                    => '',
					'contact_consent'                        => '',

					'show_breadcrumbs_shop'                  => 0,
					'show_breadcrumbs_product'               => 0,
					'show_breadcrumbs_post'                  => 0,
					'show_breadcrumbs_portfolio'             => 0,
					'show_breadcrumbs_staff'                 => 0,
					'staff_link'                             => '',
					'show_breadcrumbs_page'                  => 0,
					'home_breadcrumb_text'                   => '',
					'blog_link'                              => '',
					'shop_breadcrumbs'                       => 0,

					'page_comments'                          => 0,
					'page_title_show'                        => 1,
					'testimonial_single_nav'                 => 0,
					'testimonial_page'                       => '',
					'hide_image_border'                      => 1,
					'remove_image_padding'                   => 0,
					'select2_select'                         => 0,
					'minimal_icons'                          => 0,
					'virtue_custom_favicon'                  => '',
					'contact_email'                          => 'test@test.com',
					'footer_text'                            => '[copyright] [the-year] [site-name] [theme-credit]',
					'search_page_layout'                     => 'sidebar',
					'search_sidebar'                         => 'sidebar-primary',
					'search_layout'                          => 'grid',
					'search_results_show_search'             => 'false',
					'cust_sidebars'                          => '',
					'page_max_width'                         => 0,
					'smooth_scrolling'                       => '0',
					'smooth_scrolling_hide'                  => 0,
					'smooth_scrolling_background'            => 0,
					'virtue_gallery'                         => 1,
					'virtue_gallery_masonry'                 => 1,
					'gallery_captions'                       => 0,
					'virtue_animate_in'                      => 1,
					'kadence_lightbox'                       => 0,
					'load_google_fonts_locally'              => 0,
					'google_map_api'                         => '',

					'google_analytics'                       => '',
					'google_analytics_anony'                 => 0,
					'seo_switch'                             => 0,
					'seo_sitetitle'                          => '',
					'seo_sitedescription'                    => '',
					'custom_css'                             => '',

					'kt_header_script'                       => '',
					'kt_after_body_open_script'              => '',
					'kt_footer_script'                       => '',

					'kadence_woo_extension'                  => 1,
					'kadence_portfolio_extension'            => 1,
					'kadence_staff_extension'                => 1,

					'kadence_testimonial_extension'          => 1,
					'kadence_header_footer_extension'        => 1,
					'enable_custom_404'                      => 0,
					'custom_404_page'                        => '',
					'kt_revslider_notice'                    => 1,
					'hide_rev_activation_notice'             => 1,
					'kt_cycloneslider_notice'                => 1,
					'kt_kadenceslider_notice'                => 1,
					'kt_pagebuilder_notice'                  => 1,
					'kt_tinymce_notice'                      => 1,
				) );
			}
			return self::$default_options;
		}
		/**
		 * Get options from database
		 */
		public static function get_options() {
			if ( is_null( self::$options ) ) {
				$options = get_option( 'virtue_premium' );
				self::$options = wp_parse_args( $options, self::defaults() );
			}
			return self::$options;
		}
	}
}
