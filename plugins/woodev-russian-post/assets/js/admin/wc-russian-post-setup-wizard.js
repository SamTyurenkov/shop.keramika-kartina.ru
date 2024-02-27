"use strict";
jQuery(function ($) {

    $('input.toggle-preferences').on('change', function ( e ) {

        if( e.target.id == 'enable_tracking' ) {

            const elements = $( this ).closest( '.woodev-wc-russian-post-setup-content' ).find( '.woodev-plugin-admin-setup-control-toggled' );

            if( $( this ).is( ':checked' ) ) {
                elements.slideDown();
            } else {
                elements.slideUp();
            }
        }
    } );
});