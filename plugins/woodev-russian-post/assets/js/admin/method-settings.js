"use strict";
jQuery(function ($) {

    $( wc_russian_post_settings_params.allowed_shipment_type_selector ).one( 'change', function( event ) {

        if( 'any' !== $( this ).val() ) {
            event.preventDefault();
            event.stopImmediatePropagation();

            const parcel_name = wc_russian_post_settings_params.parcel_types[ $( this ).val() ];
            const title = $( wc_russian_post_settings_params.title_selector ).val();

            const content = [
                'Обратите внимание, опция "<strong>Доступный тип доставки</strong>" не указывает какой именно должен использоваться тип отправления для расчёта стоимости доставки, а ограничивает данный метод доставки для выбранного вида отправления.',
                sprintf( 'Т.е. метод "<strong>%s</strong>" будет доступен только в том случае если тарификатор почты России рассчитает стоимость именно по виду отправления <strong>%s</strong>.', title.toString().replace("%parcel_type%", parcel_name ), parcel_name ),
                'Чтобы не устанавливать ограничения, выберите значение "Любой тип".',
                sprintf( 'Более подробную информацию об этой и других опциях вы можете почитать <a href="%s" target="_blank">на странице документации плагина</a>.', wc_russian_post_settings_params.documentation_url )
            ];

            $.alert({
                title: 'Информация',
                content: content.join( '<br />' ),
                closeIcon: true,
                backgroundDismiss: true,
                escapeKey: true,
                animationBounce: 1,
                useBootstrap: false,
                theme: 'modern',
                boxWidth: '450px',
                animateFromElement: false,
                type   : 'blue',
                buttons: {
                    ok: {
                        text: 'Я понял',
                        btnClass: 'btn-blue'
                    }
                }
            });
        }

    } );

});