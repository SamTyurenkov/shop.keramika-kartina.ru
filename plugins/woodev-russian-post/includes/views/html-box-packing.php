<tr valign="top" id="packing_options">
	<th scope="row" class="titledesc">Размеры коробок</th>
	<td class="forminp">
		<style type="text/css">
			.russian_post_boxes td, .russian_post_services td {
				vertical-align: middle;
				padding: 4px 7px;
			}
			.russian_post_boxes td > span, .russian_post_services td > span {
				padding: 7px 5px;
				display: inline-block;
			}
			.russian_post_services th, .russian_post_boxes th {
				padding: 9px 7px;
			}
			.russian_post_boxes td input {
				margin-right: 4px;
			}
			.russian_post_boxes .check-column {
				vertical-align: middle;
				text-align: left;
				padding: 0 7px;
			}
			.russian_post_services th.sort {
				width: 16px;
				padding: 0 16px;
			}
			.russian_post_services td.sort {
				cursor: move;
				width: 16px;
				padding: 0 16px;
				cursor: move;
				background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAHUlEQVQYV2O8f//+fwY8gJGgAny6QXKETRgEVgAAXxAVsa5Xr3QAAAAASUVORK5CYII=) no-repeat center;
			}
		</style>
		<table class="russian_post_boxes widefat">
			<thead>
				<tr>
					<th class="check-column"><input type="checkbox" /></th>
					<th>Название</th>
					<th>Длина</th>
					<th>Ширина</th>
					<th>Высота</th>
					<th>Вес упаковки</th>
					<th>Тип упаковки</th>
					<th>Включено</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th colspan="3">
						<a href="#" class="button plus insert">Добавить упаковку</a>
						<a href="#" class="button minus remove">Удалить выделеные</a>
					</th>
					<th colspan="6">
						<small class="description">Товары будут упакованы в эти коробки в зависимости от их размеров и объема. Товары, не помещающиеся в коробки, будут упакованы индивидуально.</small>
					</th>
				</tr>
			</tfoot>
			<tbody id="rates">
				<?php
					if ( $this->default_boxes ) {
						foreach ( $this->default_boxes as $key => $box ) {
							?>
							<tr>
								<td class="check-column"></td>
								<td><?php echo $box['name']; ?></td>
								<td><input type="text" size="5" readonly value="<?php echo esc_attr( $box['length'] ); ?>" /><span>мм</span></td>
								<td><input type="text" size="5" readonly value="<?php echo esc_attr( $box['width'] ); ?>" /><span>мм</span></td>
								<td><input type="text" size="5" readonly value="<?php echo esc_attr( $box['height'] ); ?>" /><span>мм</span></td>
								<td><input type="text" size="5" readonly value="<?php echo esc_attr( $box['box_weight'] ); ?>" /><span>гр</span></td>
								<td><input type="text" size="5" readonly value="<?php echo esc_attr( $box['box_type'] ); ?>" /></td>
								<td><input type="checkbox" name="boxes_enabled[<?php echo $box['id']; ?>]" <?php checked( ! isset( $this->boxes[ $box['id'] ]['enabled'] ) || $this->boxes[ $box['id'] ]['enabled'] == 1, true ); ?> /></td>
							</tr>
							<?php
						}
					}
					if ( $this->boxes ) {
						foreach ( $this->boxes as $key => $box ) {
							if ( ! is_numeric( $key ) )
								continue;
								$box_name = isset( $box['name'] ) ? esc_attr( $box['name'] ) : '';
								$is_oversize = '';
								if( true === wc_russian_post_is_oversize_dimension( $box['length'], $box['width'], $box['height'] ) ) {
									$is_oversize = '(Негабарит)';
								}
							?>
							<tr>
								<td class="check-column"><input type="checkbox" /></td>
								<td><input type="text" size="10" name="boxes_name[<?php echo $key; ?>]" value="<?php echo $box_name; ?>" /><span><?php echo $is_oversize;?></span></td>
								<td><input type="text" size="5" name="boxes_length[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['length'] ); ?>" /><span>мм</span></td>
								<td><input type="text" size="5" name="boxes_width[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['width'] ); ?>" /><span>мм</span></td>
								<td><input type="text" size="5" name="boxes_height[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['height'] ); ?>" /><span>мм</span></td>
								<td><input type="text" size="5" name="boxes_box_weight[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['box_weight'] ); ?>" /><span>гр</span></td>
								<td>
									<select name="boxes_box_type[<?php echo $key; ?>]" >
										<?php foreach( $this->package_box_types as $type => $name ) : ?>
										<option value="<?php echo esc_attr( $type );?>" <?php selected( $box['box_type'], $type, true );?>><?php echo $name;?></option>
										<?php endforeach;?>
									</select>
								</td>
								<td><input type="checkbox" name="boxes_enabled[<?php echo $key; ?>]" <?php checked( $box['enabled'], true ); ?> /></td>
							</tr>
							<?php
						}
					}
				?>
			</tbody>
		</table>
		<script type="text/javascript">

			jQuery(window).load(function(){

				jQuery('#<?php echo $this->get_field_key( 'packing_method' );?>').change(function(){
					
					if ( jQuery(this).val() == 'box_packing' )
						jQuery('#packing_options').show();
					else
						jQuery('#packing_options').hide();

				}).change();
				
				var $box_type_options = '<?php echo wp_json_encode( $this->package_box_types );?>';
				var $_box_type_options = '';
				jQuery.each( jQuery.parseJSON( $box_type_options ), function( type, name ) {
					$_box_type_options += '<option value="' + type + '">' + name + '</option>';
				} );

				jQuery('.russian_post_boxes .insert').click( function() {
					var $tbody = jQuery('.russian_post_boxes').find('tbody');
					var size = $tbody.find('tr').size();
					var code = '<tr class="new">\
							<td class="check-column"><input type="checkbox" /></td>\
							<td><input type="text" size="10" name="boxes_name[' + size + ']" /></td>\
							<td><input type="text" size="5" name="boxes_length[' + size + ']" /><span>мм</span></td>\
							<td><input type="text" size="5" name="boxes_width[' + size + ']" /><span>мм</span></td>\
							<td><input type="text" size="5" name="boxes_height[' + size + ']" /><span>мм</span></td>\
							<td><input type="text" size="5" name="boxes_box_weight[' + size + ']" /><span>гр</span></td>\
							<td><select name="boxes_box_type[' + size + ']">' + $_box_type_options + '</select></td>\
							<td><input type="checkbox" name="boxes_enabled[' + size + ']" /></td>\
						</tr>';

					$tbody.append( code );

					return false;
				} );

				jQuery('.russian_post_boxes .remove').click(function() {
					var $tbody = jQuery('.russian_post_boxes').find('tbody');

					$tbody.find('.check-column input:checked').each(function() {
						jQuery(this).closest('tr').hide().find('input').val('');
					});

					return false;
				});

			});

		</script>
	</td>
</tr>