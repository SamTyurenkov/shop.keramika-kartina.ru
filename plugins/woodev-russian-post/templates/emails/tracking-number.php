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
?>

<?php do_action( 'woocommerce_email_header', $email_heading, $email ); ?>

<?php echo wptexturize( wpautop( $message_text ) ); ?>

	<p><?php _e( 'More details of your order is below.', 'woocommerce-russian-post' );?></p>

<?php

do_action( 'woocommerce_email_order_details', $order, $sent_to_admin, $plain_text, $email );

do_action( 'woocommerce_email_order_meta', $order, $sent_to_admin, $plain_text, $email );

do_action( 'woocommerce_email_customer_details', $order, $sent_to_admin, $plain_text, $email );

do_action( 'woocommerce_email_footer', $email );
