/* global jQuery */
;( function( $, params ) {

    if( ! params.allow_edostavka_suggestions ) {
        $( '#woocommerce_wc_russian_post_enable_address_suggestions' ).on( 'change', function( event ) {

            if( ! $( event.target ).is( ':checked' ) ) {
                $( '#woocommerce_wc_russian_post_fill_postcode_by_address' ).prop( 'disabled', true );
            } else {
                $( '#woocommerce_wc_russian_post_fill_postcode_by_address' ).prop( 'disabled', false );
            }

        } ).trigger( 'change' );
    }

    $( '#woocommerce_wc_russian_post_enable_tracking' ).on( 'change', function ( event ) {

        if( ! $( event.target ).is( ':checked' ) ) {
            $( '#woocommerce_wc_russian_post_tracking_login' ).prop( 'disabled', true );
            $( '#woocommerce_wc_russian_post_tracking_password' ).prop( 'disabled', true );
            $( '#woocommerce_wc_russian_post_tracking_complete' ).closest( 'tr' ).hide();
            $( '#woocommerce_wc_russian_post_tracking_delivering' ).closest( 'tr' ).hide();
            $( '#woocommerce_wc_russian_post_tracking_canceled' ).closest( 'tr' ).hide();
        } else {
            $( '#woocommerce_wc_russian_post_tracking_login' ).prop( 'disabled', false );
            $( '#woocommerce_wc_russian_post_tracking_password' ).prop( 'disabled', false );
            $( '#woocommerce_wc_russian_post_tracking_complete' ).closest( 'tr' ).show();
            $( '#woocommerce_wc_russian_post_tracking_delivering' ).closest( 'tr' ).show();
            $( '#woocommerce_wc_russian_post_tracking_canceled' ).closest( 'tr' ).show();
        }

    } ).trigger( 'change' );

} )( jQuery, wc_russian_post_integration_params );