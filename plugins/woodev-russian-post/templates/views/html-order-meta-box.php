<?php

/**
 * @var \Woodev\Russian_Post\Classes\Order $order
 */

$latest_update_time = $order->get_order_meta( 'latest_order_update_time' ) ?: strtotime( $order->get_date_created()->date( wc_date_format() ) );
$format_date = wp_date( wc_date_format(), $latest_update_time, new DateTimeZone( wc_timezone_string() ) );
$format_time = wp_date( wc_time_format(), $latest_update_time, new DateTimeZone( wc_timezone_string() ) );

?>

<table id="wc_russian_post_order_meta_box" class="wc-russian-post-order-table widefat fixed striped">

	<tr class="wc-russian-post-order-table__row wc-russian-post-order-table__row--status">
		<td><?php _e( 'Status:', 'woocommerce-russian-post' ); ?></td>
		<td>
			<mark class="order-status status-russian-post-<?php echo strtolower( $order->get_order_status() ); ?>">
				<span><?php echo $order->get_order_status_name();?></span>
			</mark>
		</td>
	</tr>

	<?php if( $order->get_tracking_link() ) : ?>

		<tr class="wc-russian-post-order-table__row wc-russian-post-order-table__row--tracking">
			<td><?php _e( 'Tracking code:', 'woocommerce-russian-post' ); ?></td>
			<td><?php echo $order->get_tracking_link(); ?></td>
		</tr>

	<?php endif; ?>

    <tr class="wc-russian-post-order-table__row wc-russian-post-order-table__row--update">
        <td><?php _e( 'Latest update:', 'woocommerce-russian-post' ); ?></td>
        <td>
            <time datetime="<?php echo esc_attr( date( 'c', $latest_update_time ) );?>" title="<?php echo esc_html( $format_date . ' ' . $format_time );?>">
				<?php printf( __( '%s at %s', 'woocommerce-russian-post' ), $format_date, $format_time ); ?>
            </time>
        </td>
    </tr>

    <?php if( $tracking_history = $order->get_order_meta( 'tracking_history' ) ) : ?>

        <tr class="wc-russian-post-order-table__row wc-russian-post-order-table__row--history">
            <td><?php _e( 'History:', 'woocommerce-russian-post' ); ?></td>
            <td>
                <ul class="wc-russian-post-order-table__status-history">
                <?php foreach ( $tracking_history as $history_period ) : ?>
                    <li>
                        <span class="datetime"><?php echo wp_date( wc_date_format(), strtotime( $history_period['status']['date'] ), new DateTimeZone( wc_timezone_string() ) ); ?></span>
                        &ndash;
                        <span class="status-name"><?php echo esc_html( implode( ', ', array_filter( array( $history_period['status']['type_name'], $history_period['status']['attr_name'] ) ) ) );?></span>
                    </li>
                <?php endforeach; ?>
                </ul>
            </td>
        </tr>

    <?php endif;?>

</table>
