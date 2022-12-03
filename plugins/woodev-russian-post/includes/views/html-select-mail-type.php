<?php
	
if( ! $data['options'] ) {
	return;
}
?>

<tr valign="top" id="mail_type_options">
	<th scope="row" class="titledesc">Тип отправки</th>
	<td class="forminp">
		<fieldset>
			<select class="wc-enhanced-select mail-type-select" name="<?php echo esc_attr( $this->get_field_key( $key ) ); ?>" id="<?php echo esc_attr( $this->get_field_key( $key ) ); ?>" style="width:300px;" data-placeholder="Выберите тип отправки">
				<?php if( $this->shipping_point && $data['options'][ $this->shipping_point ] ) : ?>
					<?php foreach ( (array) $data['options'][ $this->shipping_point ] as $option_key => $option_value ) : ?>
						<option value="<?php echo esc_attr( $option_key ); ?>" <?php selected( ( string ) $option_key, esc_attr( $this->get_option( $key ) ) ); ?>><?php echo esc_attr( $option_value ); ?></option>
					<?php endforeach; ?>
				<?php endif;?>	
			</select>
		</fieldset>
		<script type="text/javascript">
			jQuery( window ).load( function() {
				
				var $shipping_point = jQuery( '#<?php echo $this->get_field_key( 'shipping_point' );?>' );
				
				$shipping_point.change( function() {
					
					var raw_data = jQuery( this ).data( 'mail_types' );
					jQuery( ':input.mail-type-select' ).empty();
					
					var data = [];
					
					var $user_profile_options = jQuery.parseJSON( '<?php echo wp_json_encode( $this->user_profile_options, JSON_UNESCAPED_UNICODE );?>' );
					
					if( $user_profile_options[ jQuery( this ).val() ].courier ) {
						jQuery( '#woocommerce_wc_russian_post_is_courier' ).prop( 'checked', true );
						jQuery( '#woocommerce_wc_russian_post_is_courier' ).prop( 'disabled', false );
					} else {
						jQuery( '#woocommerce_wc_russian_post_is_courier' ).prop( 'checked', false );
						jQuery( '#woocommerce_wc_russian_post_is_courier' ).prop( 'disabled', true );
					}
					
					if( raw_data[ jQuery( this ).val() ] ) {
						jQuery.each( raw_data[ jQuery( this ).val() ], function( index, value ) {
							data.push({
								id:index,
								text:value
							});
						} );
					}
					
					jQuery( ':input.mail-type-select' ).selectWoo( {
						minimumResultsForSearch: -1,
						data: data
					} );
				
				} );
				
				if( jQuery( 'option', $shipping_point ).length == 1 ) {
					//$shipping_point.change();
				}
			} );
		</script>
	</td>
</tr>