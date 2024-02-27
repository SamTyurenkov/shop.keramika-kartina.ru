<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @var $title      string      Title of table
 * @var $shipping   array       Data of shipping
 * @var $details    stdClass    Delivery point details
 * @var $order      Woodev\Russian_Post\Classes\Order The order instance class
 */

$shipping_address = $shipping['normalize_address'];

if( $shipping_address instanceof \Woodev\Russian_Post\Classes\Address_Normalize && is_callable( array( $shipping_address, 'get_formatted_address' ) ) ) {
	$shipping_address = $shipping_address->get_formatted_address();
} elseif( $order ) {
	$shipping_address = implode( ', ', array_filter( [
		$order->get_shipping_postcode(),
		$order->get_shipping_state(),
		$order->get_shipping_city(),
		$order->get_shipping_address_1(),
		$order->get_shipping_address_2()
    ] ) );
} else {
    return;
}

?>

<style>
    .wc-russian-post-table-point-details td[scope="row"] {
        font-weight: bold;
    }
    .wc-russian-post-table-point-details__working-hours {
        margin:0;
        list-style:none;
    }
    .wc-russian-post-table-point-details__working-hours > li {}
    .wc-russian-post-table-point-details__working-hours > li:not(:last-of-type) {
        margin-bottom: .1em;
    }
</style>

<h2><?php echo $title; ?></h2>

<table class="woocommerce-table shop_table wc-russian-post-table-point-details">

    <tbody>

    <tr>
        <td scope="row"><?php _e( 'Name:', 'woocommerce-russian-post' );?></td>
        <td><?php echo implode( ' ', array_filter( array( $details->brandName, $details->deliveryPointType, $details->deliveryPointIndex ) ) );?></td>
    </tr>

    <tr>
        <td scope="row"><?php _e( 'Address:', 'woocommerce-russian-post' );?></td>
        <td>
		    <?php
		    $map_url = add_query_arg( array( 'whatshere' => array( 'point' => sprintf( '%s,%s', $details->geo->coordinates[0], $details->geo->coordinates[1] ), 'zoom' => 16 ) ), 'https://yandex.ru/maps/' );
		    printf( '<a href="%s" target="_blank" title="%s">%s</a>', esc_url( $map_url ), esc_attr__( 'Show address on the Yandex map', 'woocommerce-russian-post' ), $shipping_address );
		    ?>
        </td>
    </tr>

    <?php if( $details->getto ) : ?>
        <tr>
            <td scope="row"><?php _e( 'Pickup points note:', 'woocommerce-russian-post' );?></td>
            <td><?php echo esc_textarea( $details->getto ); ?></td>
        </tr>
    <?php endif;?>

    <?php if( $details->workTime && is_array( $details->workTime ) ) : ?>
        <tr>
            <td scope="row"><?php _e( 'Office schedule:', 'woocommerce-russian-post' );?></td>
            <td>
                <ul class="wc-russian-post-table-point-details__working-hours">
				    <?php foreach( $details->workTime as $working ) printf( '<li>%s</li>', $working ); ?>
                </ul>
            </td>
        </tr>
    <?php endif;?>

    </tbody>

</table>


