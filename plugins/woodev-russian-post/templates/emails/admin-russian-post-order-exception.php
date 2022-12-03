<?php


defined( 'ABSPATH' ) or exit;

?>

<?php do_action( 'woocommerce_email_header', $email_heading, $email ); ?>

	<?php echo wptexturize( wpautop( $message ) ); ?>
	
	<?php if ( $additional_content ) echo wp_kses_post( wpautop( wptexturize( $additional_content ) ) ); ?>

<?php do_action( 'woocommerce_email_footer', $email ); ?>
