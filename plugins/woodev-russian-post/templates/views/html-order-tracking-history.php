<?php

if( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @var $order \Woodev\Russian_Post\Classes\Order
 */

/** @var array $tracking_history */
$tracking_history = $order->get_order_meta( 'tracking_history' );

?>

<style>
    .wc-russian-post-table-point-details__currant-status {
        display: inline-flex;
        color: #777;
        background: #e5e5e5;
        border-radius: 4px;
        border-bottom: 1px solid rgba(0,0,0,.05);
        white-space: nowrap;
        max-width: 100%;
    }
    .wc-russian-post-table-point-details__currant-status mark {
        margin: 0 .5em;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #6e6e6e;
    }
</style>

<h2><?php _e( 'Tracking history', 'woocommerce-russian-post' ); ?></h2>

<table class="woocommerce-table shop_table wc-russian-post-table-point-details">

    <caption>
		<span class="wc-russian-post-table-point-details__package">
			<?php printf( '%s: %s', $tracking_history[0]['params']['name'], $order->get_tracking_link() ); ?>
		</span>
        <span class="wc-russian-post-table-point-details__currant-status">
			<mark title="<?php esc_attr_e( __( 'Current delivery status', 'woocommerce-russian-post' ) ); ?>"><?php echo $order->get_order_status_name(); ?></mark>
		</span>
    </caption>

    <thead>
        <tr>
            <th><?php _e( 'Status', 'woocommerce-russian-post' ); ?></th>
            <th><?php _e( 'Date', 'woocommerce-russian-post' ); ?></th>
            <th><?php _e( 'Location', 'woocommerce-russian-post' ); ?></th>
        </tr>
    </thead>

    <tbody>

    <?php foreach ( $tracking_history as $history ) : ?>

        <tr>
            <td scope="row">
			    <?php echo implode( ' ', array_filter( array( $history['status']['type_name'], $history['status']['attr_name'] ) ) ); ?></td>
            <td>
			    <?php
			    $timezone = new DateTimeZone( wc_timezone_string() );
			    $timestamp = strtotime( $history['status']['date'] );
			    printf( __( '%s at %s', 'woocommerce-russian-post' ),
				    wp_date( wc_date_format(), $timestamp, $timezone ),
				    wp_date( wc_time_format(), $timestamp, $timezone )
			    );
			    ?>
            </td>
            <td><?php esc_attr_e( $history['origin']['address'] );?></td>
        </tr>

    <?php endforeach; ?>

    </tbody>

</table>
