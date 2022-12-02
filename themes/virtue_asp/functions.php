<?php

add_action('init', 'wpse_73054_add_author_woocommerce', 999 );
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_price', 10);

function wpse_73054_add_author_woocommerce() {
    add_post_type_support( 'product', 'author' );
}
//ACCOUNT PAGES
function add_menu_to_edit () {
	echo '<div class="wpuf-dashboard-container">
    <nav class="wpuf-dashboard-navigation">
        <ul>
<li><a href="/account/?section=dashboard">Профиль</a></li><li><a href="/account/?section=addmypost">Новости</a></li><li><a href="/account/?section=addmywork">Товары</a></li> </ul></nav></div>';
}
add_shortcode('edit_post_menu', 'add_menu_to_edit');

add_filter( 'wpuf_account_sections', 'wpuf_my_page' );

function wpuf_my_page( $sections ) {
    $sections = array_merge( $sections, array( array( 'slug' => 'addmypost', 'label' => 'Новости' ) ) );

    return $sections;
}

add_action( 'wpuf_account_content_addmypost', 'wpuf_my_page_section', 1, 2 );

function wpuf_my_page_section( $sections, $current_section ) {
    wpuf_load_template(
        "addmypost.php",
        array( 'sections' => $sections, 'current_section' => $current_section )
    );
}


add_filter( 'wpuf_account_sections', 'wpuf_my_page3' );

function wpuf_my_page3( $sections ) {
    $sections = array_merge( $sections, array( array( 'slug' => 'addmywork', 'label' => 'Товары' ) ) );

    return $sections;
}

add_action( 'wpuf_account_content_addmywork', 'wpuf_my_page_section3', 2, 2 );

function wpuf_my_page_section3( $sections, $current_section ) {
    wpuf_load_template(
        "addmywork.php",
        array( 'sections' => $sections, 'current_section' => $current_section )
    );
}
//
//DISPLAY META IN PRODUCTS SHORTCODE
function get_meta($field, $id = null)
{
	return get_post_meta($id != '' ? $id : get_the_ID(), $field, true);
}
function get_cate($field, $id = null)
{
	$categories = get_the_category($id != '' ? $id : get_the_ID(), true);
	if ( ! empty( $categories ) ) {
    return esc_html( $categories[0]->name );   
	}
	else {
	return '';
	}
}

function short_feat() {
ob_start();

echo '<div class="moneyzbefore2" style="text-align:center">';
	
echo 'Комплект нижнего белья';
	
echo '</div>';

return ob_get_clean();
}
add_shortcode('sfeat', 'short_feat');

function booking_shortcode() {
ob_start();

echo '<div class="moneyzbefore"><ul>';

$sostav = get_meta('sostav');
if (($sostav != '') && ($sostav != 'null')) { echo '<li><b>Состав:</b> '; echo $sostav; echo "</li>";};
	
echo '</ul></div>';

return ob_get_clean();
}
add_shortcode('booking_sc', 'booking_shortcode');