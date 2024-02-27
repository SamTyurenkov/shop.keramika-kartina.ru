( function( $, w, d, wp, params ) {

    $( function() {

        $( d.body ).on( 'click', '.wc-russian-post-choose-delivery-point', function ( event ) {
            event.preventDefault();

            $( this ).WCBackboneModal( {
                template: 'wc-modal-russian-post-map',
                variable: {
                    zip_code: $( event.target ).data( 'zip_code' ),
                    cart_total: $( event.target ).data( 'cart_total' ),
                    start_location: $( event.target ).data( 'start_location' )
                }
            } );

        } ).on( 'wc_backbone_modal_loaded', function () {

            ecomStartWidget( {
                accountId: params.account_id,
                accountType: params.account_type,
                weight: params.weight_cart,
                sumoc: $( '#russian-post-map-container' ).data( 'cart_total' ),
                startZip: $( '#russian-post-map-container' ).data( 'zip_code' ),
                start_location: $( '#russian-post-map-container' ).data( 'start_location' ),
                containerId: 'russian-post-map-container',
                //dimensions: params.dimensions_cart,
                callbackFunction: function ( data, e ) {

                    if( data ) {

                        $.ajax( {
                            url: params.ajax_url,
                            method: 'post',
                            dataType: 'json',
                            data: {
                                action: 'set_russian_post_point',
                                nonce: params.set_russian_post_point_notice,
                                data: data
                            },
                            beforeSend: function () {
                                $( '#russian-post-map-container' ).block( {
                                    message: null,
                                    overlayCSS: {
                                        background: '#fff',
                                        opacity: 0.6
                                    }
                                } );
                            },
                            complete: function(){
                                $( '#russian-post-map-container' ).unblock();
                            },
                            success: function ( response ) {

                                if( response && response.success ) {

                                    if( response.data ) {

                                        $.each( response.data, function ( key, value ) {

                                            if( 'city' == key && $( '#billing_city' ).is( 'select' ) ) {

                                                $( '#billing_city' ).html( $( '<option />', { value: value, text: value, selected:true } ) );

                                            } else {
                                                $( '#billing_' + key, ).val( value ).change();
                                                $( '#shipping_' + key, ).val( value ).change();
                                            }
                                        } );
                                    }

                                    $( d.body ).trigger( 'update_checkout' );

                                    if( params.auto_close_map ) {
                                        $( '#russian-post-map-container' ).parent().find( '.modal-close-link' ).click()
                                    }

                                } else {

                                    if( response.data ) {

                                        $.alert({
                                            title: false,
                                            content: response.data,
                                            closeIcon: true,
                                            backgroundDismiss: true,
                                            escapeKey: true,
                                            animationBounce: 1,
                                            useBootstrap: false,
                                            theme: 'modern',
                                            boxWidth: '360px',
                                            animateFromElement: false,
                                            type   : 'red',
                                            buttons: {
                                                ok: {
                                                    text: params.i18n.confirm_button_text,
                                                    btnClass: 'btn-blue'
                                                }
                                            }
                                        });
                                    }

                                    if( 'undefined' !== resetSelectedPlacemarkInEcomWidget ) {
                                        resetSelectedPlacemarkInEcomWidget()
                                    }
                                }
                            }
                        } );

                    } else {
                        w.console.error( 'Не удалось получить данные выбранного отделения/почтомата' );
                    }
                }
            } )
        } );

    } );

} )( jQuery, window, document, wp, wc_russian_post_map_params );