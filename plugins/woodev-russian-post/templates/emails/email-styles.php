<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$base      = get_option( 'woocommerce_email_base_color' );
$base_text = wc_light_or_dark( $base, '#202020', '#ffffff' );
?>

a.button {
	color: <?php echo esc_attr( $base_text ); ?>;
	font-weight: normal;
	text-decoration: none;
	background-color: <?php echo esc_attr( $base ); ?>;
	padding: 10px 15px;
	border-radius: 5px;
}
