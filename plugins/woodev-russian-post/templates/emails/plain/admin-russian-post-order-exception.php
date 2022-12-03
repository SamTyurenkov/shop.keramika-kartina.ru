<?php

defined( 'ABSPATH' ) or exit;

echo esc_html( wp_strip_all_tags( $email_heading ) ). "\n\n";

echo wptexturize( $message ) . "\n\n";

echo "****************************************************\n\n";

if ( $additional_content ) {
	echo esc_html( wp_strip_all_tags( wptexturize( $additional_content ) ) );
	echo "\n\n----------------------------------------\n\n";
}

echo wp_kses_post( apply_filters( 'woocommerce_email_footer_text', get_option( 'woocommerce_email_footer_text' ) ) );
