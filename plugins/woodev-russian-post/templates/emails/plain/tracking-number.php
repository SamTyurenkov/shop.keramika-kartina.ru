<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @var string      $email_heading
 * @var string      $email
 * @var string      $message_text
 * @var WC_Order    $order
 * @var boolean     $sent_to_admin
 * @var string      $plain_text
 */

echo "= " . $email_heading . " =\n\n";

echo wptexturize( $message_text ) . "\n\n";

echo __( 'More details of your order is below.', 'woocommerce-russian-post' ) . "\n\n";

echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n\n";

do_action( 'woocommerce_email_order_details', $order, $sent_to_admin, $plain_text, $email );

echo "\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n\n";

do_action( 'woocommerce_email_order_meta', $order, $sent_to_admin, $plain_text, $email );

do_action( 'woocommerce_email_customer_details', $order, $sent_to_admin, $plain_text, $email );

echo "\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n\n";

echo apply_filters( 'woocommerce_email_footer_text', get_option( 'woocommerce_email_footer_text' ) );
