<?php
/**
 *
 * @var string  $input_name
 * @var int     $index
 * @var array   $token
 * @var array   $fields
 * @var string  $type
 * @var array   $actions
 * @var int     $user_id
 */
?>

<?php $token_input_name = $input_name . '[' . $index . ']'; ?>

<tr class="token <?php echo ! $token['id'] ? 'new-token' : ''; ?>">

	<?php foreach ( $fields as $field_id => $field ) : ?>

		<?php $is_select = 'select' === $field['type'] && isset( $field['options'] ) && ! empty( $field['options'] ); ?>

		<td class="token-<?php echo esc_attr( $field_id ); ?>">

			<?php if ( ! $field['editable'] ) : ?>

				<?php $display_value = $is_select && ! empty( $field['options'][ $token[ $field_id ] ] ) ? $field['options'][ $token[ $field_id ] ] : $token[ $field_id ]; ?>

				<span class="token-<?php echo esc_attr( $field_id ); ?> token-attribute"><?php echo esc_attr( $display_value ); ?></span>

				<input name="<?php echo esc_attr( $token_input_name ); ?>[<?php echo esc_attr( $field_id ); ?>]" value="<?php echo esc_attr( $token[ $field_id ] ); ?>" type="hidden" />

			<?php elseif ( $is_select ) : ?>

				<select name="<?php echo esc_attr( $token_input_name ); ?>[<?php echo esc_attr( $field_id ); ?>]">

					<option value=""><?php esc_html_e( '-- Select an option --', 'woodev-plugin-framework' ); ?></option>

					<?php foreach ( $field['options'] as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $value, $token[ $field_id ] ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>

				</select>

			<?php else : ?>

				<?php // Build the input attributes
				$attributes = array();

				foreach ( $field['attributes'] as $name => $value ) {
					$attributes[] = esc_attr( $name ) . '="' . esc_attr( $value ) . '"';
				} ?>

				<input
					name="<?php echo esc_attr( $token_input_name ); ?>[<?php echo esc_attr( $field_id ); ?>]"
					value="<?php echo esc_attr( $token[ $field_id ] ); ?>"
					type="text"
					<?php echo implode( ' ', $attributes ); ?>
					<?php echo $field['required'] ? 'required' : ''; ?>
				/>

			<?php endif; ?>

		</td>

	<?php endforeach; ?>

	<input name="<?php echo esc_attr( $token_input_name ); ?>[type]" value="<?php echo esc_attr( $type ); ?>" type="hidden" />

	<td class="token-default token-attribute">
		<input name="<?php echo esc_attr( $input_name ); ?>_default" value="<?php echo esc_attr( $token['id'] ); ?>" type="radio" <?php checked( true, $token['default'] ); ?>/>
	</td>

	<?php // Token actions ?>
	<td class="token-actions">

		<?php foreach ( $actions as $action => $label ) : ?>
				<button class="woodev-payment-gateway-token-action-button button" data-action="<?php echo esc_attr( $action ); ?>" data-token-id="<?php echo esc_attr( $token['id'] ); ?>" data-user-id="<?php echo esc_attr( $user_id ); ?>">
					<?php echo esc_attr( $label ); ?>
				</button>
		<?php endforeach; ?>

	</td>

</tr>
