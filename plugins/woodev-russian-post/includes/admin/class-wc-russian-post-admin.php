<?php

defined( 'ABSPATH' ) or exit;


class WC_Russian_Post_Shipping_Admin {
	
	public $message_handler;
	
	public function __construct() {
		
		add_action( 'admin_notices', array( $this, 'show_admin_messages' ) );
		
		add_action( 'admin_enqueue_scripts', array( $this, 'load_styles_scripts' ) );
		add_action( 'woocommerce_admin_order_actions_end', array( $this, 'add_order_actions' ) );
		add_filter( 'manage_edit-shop_order_columns', array( $this, 'add_order_status_column_header' ), 20 );
		add_action( 'manage_shop_order_posts_custom_column', array( $this, 'add_order_status_column' ) );
		
		add_action( 'restrict_manage_posts', array( $this, 'filter_orders_by_russian_post_status' ) , 20 );
		
		/*
		* Массовый экспорт почему то не работает, нужно разабраться
		*/
		/*
		add_action( 'admin_footer-edit.php', array( $this, 'add_order_bulk_actions' ) );
		add_action( 'load-edit.php',         array( $this, 'process_order_bulk_actions' ) );
		*/
		add_action( 'add_meta_boxes', array( $this, 'add_order_meta_box' ) );
		add_action( 'woocommerce_before_order_itemmeta', array( $this, 'add_order_item_serial_numbers' ), 10, 3 );
		
		add_filter( 'woocommerce_hidden_order_itemmeta', array( $this, 'hidden_order_itemmeta' ) );
		
		add_action( 'before_delete_post', array( $this, 'delete_order' ) );
		
		add_action( 'woocommerce_product_options_shipping', array( $this, 'add_product_options_tnved_code' ) );
		add_action( 'woocommerce_process_product_meta_simple', array( $this, 'save_product_options_tnved_code' ) );
		add_action( 'woocommerce_process_product_meta_variable', array( $this, 'save_product_options_tnved_code' ) );
	}
	
	public function load_styles_scripts( $hook_suffix ) {
		if ( 'edit.php' == $hook_suffix || 'post.php' == $hook_suffix || 'post-new.php' == $hook_suffix ) {
			wp_enqueue_style( 'woocommerce_russian_post_admin', wc_russian_post_shipping()->get_plugin_url() . '/assets/css/admin/admin.css', array( 'woocommerce_admin_styles' ), WC_RUSSIAN_POST_SHIPPING_VERSION );
		}
	}
	
	public function show_admin_messages() {

		$this->message_handler->show_messages();
	}
	
	public function add_order_meta_box() {

		add_meta_box( 'wc_russian_post_order_meta_box', 'Почта России - Информация',
			array( $this, 'render_order_meta_box'),
			'shop_order',
			'side',
			'high'
		);
	}
	
	public function render_order_meta_box() {
		global $post;

		$order = new WC_Russian_Post_Order( $post->ID );
		
		if ( $order->is_russian_post && ! $order->is_exported ) {
			echo "<p>Информация о заказе станет доступна только после того как заказ будет отправлен в Почту России.</p>";
			printf( '<p><a class="button" href="%1$s">%2$s</a></p>', esc_url( $order->get_export_url() ), 'Отправить заказ' );
			return;
		} elseif( ! $order->is_russian_post ) {
			echo '<p>Информация не доступна так как этот заказ не использует метод доставки "Почта России".</p>';
			return;
		}
		
		?>
		<table id="wc_russian_post_order_meta_box">

			<tr>
				<th><strong>Номер заказа : </strong></th>
				<td><?php echo esc_html( ( empty( $order->russian_post_id ) ) ? __( 'N/A', 'woocommerce' ) : $order->russian_post_id ); ?></td>
			</tr>
			<tr>
				<th><strong>Статус : </strong></th>
				<td class="russian_post_status">
					<mark class="<?php echo esc_attr( $order->russian_post_status ); ?>"><?php echo esc_html( $order->get_status_for_display() ); ?></mark>
				</td>
			</tr>

			<?php if ( 'shipped' === $order->russian_post_status && ! empty( $order->tracking_number ) ) : ?>

				<tr>
					<th><strong>Номер отслеживания : </strong></th>
					<td><?php printf( '<a href="https://www.pochta.ru/new-tracking#%s" target="_blank">%s</a>', $order->tracking_number, $order->tracking_number ); ?></td>
				</tr>
				<tr>
					<td colspan="2"><a class="button button-link-delete" href="<?php echo esc_url( $order->get_remove_order_url() );?>">Удалить из Почты России</a></td>
				</tr>

			<?php endif; ?>

		</table>
		<?php
	}
	
	public function add_order_actions( $order ) {

		$order = new WC_Russian_Post_Order( $order->id );

		if ( $order->is_russian_post && ! $order->is_exported ) {
			printf( '<a class="button tips export_to_russian_post" href="%1$s" data-tip="%2$s">%2$s</a>', esc_url( $order->get_export_url() ), 'Отправить в Почту России' );
		} elseif( $order->russian_post_id ) {
			printf( '<a class="button button-link-delete tips remove_to_russian_post" href="%1$s" data-tip="%2$s">%2$s</a>', esc_url( $order->get_remove_order_url()), 'Удалить из ЛК Почты России' );
		}
	}
	
	public function add_order_status_column_header( $column_headers ) {

		$new_column_headers = array();

		foreach ( $column_headers as $column_id => $column_info ) {

			$new_column_headers[ $column_id ] = $column_info;

			if ( 'order_status' == $column_id ) {
				$new_column_headers['russian_post_status'] = 'Статус Почты России';
			}
		}

		return $new_column_headers;
	}
	
	public function add_order_status_column( $column ) {
		global $post;

		if ( 'russian_post_status' == $column ) {

			$order = new WC_Russian_Post_Order( $post->ID );

			printf( '<mark class="%1$s">%2$s</mark>', esc_attr( $order->russian_post_status ), strtolower( $order->get_status_for_display() ) );
		}
	}
	
	public function filter_orders_by_russian_post_status() {
		global $typenow, $wp_query;

		if ( 'shop_order' != $typenow ) {
			return;
		}

		$terms = get_terms( 'russian_post_order_status' );

		?>
		<select name="russian_post_order_status" id="dropdown_russian_post_order_status" class="wc-enhanced-select" data-placeholder="Показать все заказы Почты России" style="min-width: 190px;">
			<option value=""></option>
			<?php foreach ( $terms as $term ) : ?>
				<option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $term->slug, ( isset( $wp_query->query['russian_post_order_status'] ) ) ? $wp_query->query['russian_post_order_status'] : '' ); ?>>
					<?php printf( '%1$s (%2$s)', $term->name, absint( $term->count ) ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<?php
	}
	
	public function add_order_bulk_actions() {
		global $post_type, $post_status;

		if ( $post_type == 'shop_order' && $post_status != 'trash' ) {
			?>
				<script type="text/javascript">
					jQuery( document ).ready( function ( $ ) {
						$( 'select[name^=action]' ).append(
							$( '<option>' ).val( 'export_to_russian_post' ).text( 'Отправить в Почту России' ),
							$( '<option>' ).val( 'remove_to_russian_post' ).text( 'Удалить из ЛК Почты России' )
						);
					});
				</script>
			<?php
		}
	}
	
	public function process_order_bulk_actions() {
		global $typenow;

		if ( 'shop_order' == $typenow && wc_russian_post_shipping()->get_license_instance()->is_license_valid() ) {
			
			$wp_list_table = _get_list_table( 'WP_Posts_List_Table' );
			$action        = $wp_list_table->current_action();
			
			if( ! in_array( $action, array( 'export_to_russian_post', 'remove_to_russian_post' ) ) ) {
				return;
			}
			
			check_admin_referer( 'bulk-posts' );
			
			if ( isset( $_REQUEST['post'] ) ) {
				$order_ids = array_map( 'absint', $_REQUEST['post'] );
			}
			
			if ( empty( $order_ids ) ) {
				return;
			}
			
			@set_time_limit( 0 );
			
			$changed = 0;
			
			foreach ( $order_ids as $order_id ) {

				$order = new WC_Russian_Post_Order( $order_id );
				
				if( 'export_to_russian_post' === $action ) {
					$order->export();
				} elseif( 'remove_to_russian_post' === $action ) {
					$order->remove_order();
				}
				
				$changed++;
			}
			
			$message = sprintf( _n( '%1$s статус изменён.', '%1$s статусы изменены.', $changed ), number_format_i18n( $changed ) );
			wc_russian_post_shipping()->get_admin_instance()->message_handler->add_message( $message );
			
			wp_safe_redirect( wp_get_referer() );
			exit;
		}
	}
	
	public function add_order_item_serial_numbers( $item_id, $item, $product ) {

		$tracking_number = isset( $item['wc_russian_post_tracking_number'] ) ? $item['wc_russian_post_tracking_number'] : null;

		if ( ! is_null( $tracking_number ) && ! empty( $tracking_number ) ) {
			echo '<div class="wc-russian_post-order-item-serial-numbers"><strong>Номер отслеживания</strong> ' . esc_html( $tracking_number ) . '</div>';
		}
	}
	
	public function hidden_order_itemmeta( $meta ) {
		return array_merge( $meta, wc_russian_post_get_custom_order_fields() );
	}
	
	public function delete_order( $post_id ) {
		if ( ! current_user_can( 'delete_posts' ) || ! $post_id ) {
			return;
		}
		
		if ( 'shop_order' === get_post_type( $post_id ) ) {
			
			$order = new WC_Russian_Post_Order( $post_id );
			
			if( $order->is_russian_post ) {
				
				$order->remove_order();
			}
		}
	}
	
	public function add_product_options_tnved_code() {
		
		woocommerce_wp_text_input( array(
			'id'          => '_tnved_code',
			'label'       => 'Код ТН ВЭД',
			'placeholder' => 'Введите ТН ВЭД код для данного товара',
			'desc_tip'    => true,
			'description' => 'Данный код обязателен для международной отправки. Без указания кода, данный товар невозможно будет отправить заграницу.',
			'type'        => 'text'
		) );
	}
	
	public function save_product_options_tnved_code( $post_id ) {
		
		if( isset( $_POST['_tnved_code'] ) ) {
			update_post_meta( $post_id, '_tnved_code', wc_clean( $_POST['_tnved_code'] ) );
		}
	}
	
}
