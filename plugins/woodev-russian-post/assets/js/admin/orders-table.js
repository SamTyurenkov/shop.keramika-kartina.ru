( function( $ ) {

    $( function() {

        $( document.body ).on( 'init_tooltips', function() {

            $( '.tips' ).tipTip( {
                'attribute': 'data-tip',
                'fadeIn': 50,
                'fadeOut': 50,
                'delay': 200,
                'keepAlive': true
            } );

            $( '.column-actions .wc-action-button' ).tipTip( {
                'fadeIn': 50,
                'fadeOut': 50,
                'delay': 200
            } );

        } );

        $( document.body ).trigger( 'init_tooltips' );
    } );

} )( jQuery );