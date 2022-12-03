<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<script type="text/template" id="tmpl-wc-modal-russian-post-map">
	<div class="wc-backbone-modal">
		<div class="wc-backbone-modal-content">
			<section class="wc-backbone-modal-main" role="main">
				<header class="wc-backbone-modal-header">
					<h1><?php _e( 'Choose delivery point', 'woocommerce-russian-post' );?></h1>
					<button class="modal-close modal-close-link dashicons dashicons-no-alt">
						<span class="screen-reader-text"><?php _e( 'Close', 'woocommerce-russian-post' );?></span>
					</button>
				</header>
				<article id="russian-post-map-container" class="modal-map-container"></article>
			</section>
		</div>
	</div>
	<div class="wc-backbone-modal-backdrop modal-close"></div>
</script>

<script type="text/template" id="tmpl-wc-modal-russian-post-map-balloon">
	<div class="balloon">
		<div class="balloon__header">
			<span class="balloon__icon balloon__icon_<# if( 'additional_pvz' !== data.data.type || data.isCluster ) { #>russian-post<# } else { #>additional-post<# } #>"></span>
			<div class="balloon__title">
				<span class="balloon__index">{{ data.data.brandName }}, <# if( data.data.type === 'additional_pvz' ) { #><?php _e( 'Delivery point', 'woocommerce-russian-post' );?><# } else { #><?php _e( 'Office', 'woocommerce-russian-post' );?><# } #> № {{ data.data.deliveryPointIndex }}</span>
				<?php /*
				<# if( data.data.tariff && data.data.tariff.total > 0 ) { #>
					<span class="balloon__tariff">
					Доставка: {{ data.data.tariff.total / 100 }} ₽
					<# if( data.data.delivery && null !== data.data.delivery.deliveryMin && null !== data.data.delivery.deliveryMax ) { #>
						<# if( ( 0 === data.data.delivery.deliveryMin && 0 === data.data.delivery.deliveryMax ) || data.data.delivery.deliveryMin === data.data.delivery.deliveryMax ) { #>
							{{ data.data.delivery.deliveryMin }} рабочих дней
						<# } else { #>
							от {{ data.data.delivery.deliveryMin }} до {{ data.data.delivery.deliveryMax }} рабочих дней
						<# } #>
					<# } #>
					</span>
				<# } #>
				*/
				?>
			</div>
		</div>
		<div class="balloon__content <# if( data.data.type === 'additional_pvz' ) { #>balloon__content_less-max<# } else { #>balloon__content_less-min<# } #>">
			<span class="balloon__address"><# if( data.data.address ) { #>{{ data.data.address.place }}, {{ data.data.address.street }}, {{ data.data.address.house }}<# } #></span>
			<# if ( data.data.type === 'additional_pvz' ) { #>
			<div class="balloon__payments">
			<# if ( data.data.cardPayment ) { #><span class="balloon__payment-item balloon__payment-item_card"><?php _e( 'Pay by card', 'woocommerce-russian-post' );?></span><# } #>
			<# if ( data.data.cashPayment ) { #><span class="balloon__payment-item balloon__payment-item_cash"><?php _e( 'Pay by cash', 'woocommerce-russian-post' );?></span><# } #>
			<# if ( ! data.data.cardPayment && ! data.data.cashPayment ) { #><span class="balloon__payment-item balloon__payment-item_prepayment"><?php _e( 'Prepay only', 'woocommerce-russian-post' );?></span><# } #>
			</div>
			<# } #>
			<div class="balloon__schedule">
			<# for( time in data.data.workTime ) { #>
				<span class="balloon__schedule-item">{{ data.data.workTime[time] }}</span>
			<# } #>
			</div>
			<# if ( data.data.type === 'additional_pvz' ) { #>
			<div class="balloon__options">
				<span class="balloon__option-item balloon__option-item_<# if( data.data.contentsChecking ) { #>check<# } else { #>error<# } #>"><?php _e( 'Content checking', 'woocommerce-russian-post' );?></span>
				<span class="balloon__option-item balloon__option-item_<# if( data.data.partialRedemption ) { #>check<# } else { #>error<# } #>"><?php _e( 'Partian redemption', 'woocommerce-russian-post' );?></span>
				<span class="balloon__option-item balloon__option-item_<# if( data.data.withFitting ) { #>check<# } else { #>error<# } #>"><?php _e( 'Fitting', 'woocommerce-russian-post' );?></span>
				<span class="balloon__option-item balloon__option-item_<# if( data.data.functionalityChecking ) { #>check<# } else { #>error<# } #>"><?php _e( 'Functionality checking', 'woocommerce-russian-post' );?></span>
			</div>
			<# } #>
			<span class="balloon__description">{{ data.data.getto }}</span>
		</div>
		<span class="balloon__show-more <# if( data.element && data.element.properties.isShowedAll ) { #>balloon__show-more_hidden<# } #>"><?php _e( 'Show more...', 'woocommerce-russian-post' );?></span>
		<# if ( data.data.tariff || data.data.type === 'additional_pvz' ) { #>
		<button type="button" class="balloon__button <# if( data.currentBalloon == data.data.id ) { #>balloon__button_disabled<# } #>" data-pvzdata="<# print( _.escape( JSON.stringify( { indexTo: data.data.deliveryPointIndex, regionTo: data.data.address.region, areaTo: data.data.address.area, cityTo: data.data.address.place, streetTo: data.data.address.street, houseTo: data.data.address.house, allowCard: data.data.cardPayment, allowCash: data.data.cashPayment, onlyPrePayment: ( ! data.data.cardPayment && ! data.data.cashPayment ), cashOnDelivery: ( data.data.tariff ? data.data.tariff.total : false ) } ).replace(/"/g,"'") ) ); #>" data-placemarkid="{{ data.data.id }}"><?php _e( 'Pick-up here', 'woocommerce-russian-post' );?></button>
		<# } else { #>
		<span class="balloon__delivery-error"><?php _e( 'Unable to deliver to this pickup point', 'woocommerce-russian-post' );?></span>
		<# } #>
	</div>
</script>