<div class="wpuf-user-loggedin">
<div style="width:30%;display:inline-block">
	<span class="wpuf-user-avatar">
		<?php echo get_avatar( $user->ID ); ?>
	</span>
	</div>

	<div style="width:70%;display:inline-block">
	<p><?php printf( __( 'Hello %s', 'wpuf' ), $user->display_name ); ?></p>

	<p><?php printf( __( 'You are currently logged in! %s?', 'wpuf' ), wp_loginout( '', false ) ) ?></p>
	</div>
</div>