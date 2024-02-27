( function( $ ) {

    if( 'undefined' !== wc_russian_post_checkout_params && wc_russian_post_checkout_params?.need_reload_shipping ) {
        //Обновляем методы доставки если сменился метод оплаты.
        $( 'form.checkout' ).on( 'change', 'input[name^="payment_method"]', function( event ) {
            $( document.body ).trigger( 'update_checkout', { update_shipping_method: true } );
        } );
    }

} )( jQuery )