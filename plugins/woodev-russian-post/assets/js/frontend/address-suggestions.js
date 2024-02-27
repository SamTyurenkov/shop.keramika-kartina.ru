/* global jQuery, Window, Document, global object wc_russian_post_address_suggestions_params */
( function( $, w, d, params ) {

    $( d.body ).on( 'updated_checkout', function() {

        const countryISOCode    = $( '#billing_country' ).val() || params?.default_country
        const $regionField      = $( '#billing_state' )
        const $cityField        = $( '#billing_city' )
        const $addressField     = $( '#billing_address_1' )


        if( 'yes' == params.enable_state ) {

            $regionField.WoodevDadataSuggestions( {
                constraints: {
                    locations: {
                        country_iso_code: countryISOCode
                    }
                },
                bounds: 'region-area',
                countryISOCode: countryISOCode,
                onSelect: function ( suggestions ) {
                    if( ! $( this ).closest( '.form-row' ).hasClass( 'address-field' ) ) {
                        $( this ).closest( '.form-row' ).addClass( 'address-field' )
                    }

                    $( this ).trigger( 'change', [ suggestions.data ] )
                }
            } )
        }

        if( 'yes' == params.enable_city && ! $cityField.is( 'select, input[type="hidden"]' ) ) {

            $cityField.WoodevDadataSuggestions( {
                bounds: 'city-settlement',
                countryISOCode: countryISOCode,
                onSelect: function ( suggestions, changed ) {

                    if( ! $( this ).closest( '.form-row' ).hasClass( 'address-field' ) ) {
                        $( this ).closest( '.form-row' ).addClass( 'address-field' )
                    }

                    const resolver = $.Deferred();

                    resolver.done( function() {

                        if( ! params.requires_address ) {
                            $( d.body ).trigger( 'update_checkout', { update_shipping_method: true } )
                        }

                        $cityField.prop( 'disabled', false ).css( {
                            cursor: 'text',
                            opacity: 1
                        } )

                    } ).fail( function ( content ) {

                        content && $.alert && $.alert( {
                            title: false,
                            content: content,
                            closeIcon: true,
                            backgroundDismiss: true,
                            escapeKey: true,
                            animationBounce: 1,
                            useBootstrap: false,
                            theme: 'modern',
                            boxWidth: '450px',
                            animateFromElement: false,
                            type   : 'red',
                            buttons: {
                                ok: {
                                    text: 'Я понял',
                                    btnClass: 'btn-blue'
                                }
                            }
                        } )

                        $cityField.prop( 'disabled', false ).css( {
                            cursor: 'text',
                            opacity: 1
                        } )

                    } );

                    if( params.need_set_location && changed && suggestions.data ) {

                        $( this ).prop( 'disabled', true ).css( {
                            cursor: 'not-allowed',
                            opacity: .5
                        } )

                        $.post( params.ajax_url, {
                            action: 'russian_post_set_customer_location',
                            data: suggestions.data
                        } ).done( function ( data ) {
                            if( data.success ) {
                                resolver.resolve()
                            } else {
                                resolver.reject( data.data ? data.data.toString() : null )
                            }
                        } )

                    } else if( changed ) {
                        resolver.resolve();
                    }

                    $( this ).trigger( 'change', [ suggestions.data ] )
                },
                formatSelected: function ( suggestion ) {
                    //Удаляем из выбранной подсказки префиксы типов населённого пукта, такие как "г", "пос." и т.д
                    const locationTypes = [
                        suggestion.data?.city_district_type,
                        suggestion.data?.city_district_type_full,
                        suggestion.data?.city_type,
                        suggestion.data?.city_type_full,
                        suggestion.data?.settlement_type,
                        suggestion.data?.settlement_type_full
                    ].filter( i => i )

                    return suggestion.value.toString().split( ', ' ).map( function( part ) {
                        return part.split( ' ' ).filter( sigment => ! locationTypes.includes( sigment.toLowerCase() ) ).join( ' ' )
                    } ).join( ', ' )
                },
                onSuggestionsFetch: function ( suggestions ) {
                    //Удаляем из найденных подсказок варианты уровня планировочной структуры
                    return suggestions.filter( function( suggestion ) {
                        return suggestion.data.fias_level !== '65'
                    } );
                }
            } )

            if( 'undefined' !== typeof $regionField.suggestions() ) {
                $cityField.suggestions().setOptions( {
                    constraints: $regionField
                } )
            }

            if( 'yes' !== params.enable_address ) {
                $cityField.suggestions().fixData()
            }
        }

        if( 'yes' == params.enable_address ) {

            $addressField.WoodevDadataSuggestions( {
                bounds: 'street-flat', //искать в переделах улийца-квартира
                count: 15,
                countryISOCode: countryISOCode,
                onSelect: function ( suggestions, changed ) {

                    if( ! $( this ).closest( '.form-row' ).hasClass( 'address-field' ) ) {
                        $( this ).closest( '.form-row' ).addClass( 'address-field' )
                    }

                    $( this ).trigger( 'change', [ suggestions.data ] )

                    const citySettlementData = [ suggestions.data.city, suggestions.data.settlement ].filter( function ( part ) {
                        return part
                    } );

                    const cityCurrentValue = $cityField.val().toString().trim();

                    if( 'undefined' == typeof $cityField.suggestions() && ( ! $.inArray( cityCurrentValue.toLowerCase(), citySettlementData.map( function ( element ) {
                        return element.toString().toLowerCase()
                    } ) ) || '' == cityCurrentValue ) ) {
                        $cityField.val( citySettlementData.join( ', ' ) ).change()
                    }

                    if( 'yes' == params?.need_fill_postcode && suggestions.data ) {
                        $( 'input#billing_postcode, input#shipping_postcode' ).val( suggestions.data.postal_code ).change()
                    }

                    if( changed ) {
                        $( d.body ).trigger( 'update_checkout', { update_shipping_method: true } )
                    }
                }
            } )

            if( 'undefined' !== typeof $cityField.suggestions() ) {

                $addressField.suggestions().setOptions( {
                    constraints: $cityField
                } )

                $addressField.suggestions().fixData()

                $cityField.on( 'suggestions-clear', function () {
                    $addressField.prop( 'disabled', true ).attr( 'title', 'Сначала укажите населённый пукт' ).css( {
                        cursor: 'not-allowed',
                        opacity: .5
                    } )
                } ).on( 'suggestions-set', function () {
                    $addressField.prop( 'disabled', false ).removeAttr( 'title' ).css( {
                        cursor: 'text',
                        opacity: 1
                    } )
                } )

            } else {

                $cityField.on( 'change', function () {

                    'undefined' !== typeof $addressField.suggestions() && $addressField.suggestions().setOptions( {
                        constraints: {
                            locations: {
                                city: $cityField.val().toString().trim()
                            }
                        },
                        restrict_value: true,
                        formatSelected: function ( suggestion ) {
                            return suggestion.value.toString().split( ', ' ).filter( function( item ) {
                                return item !== suggestion.data.country &&
                                    item !== suggestion.data.postal_code &&
                                    item !== suggestion.data.city_with_type &&
                                    item !== suggestion.data.city_district_with_type &&
                                    item !== suggestion.data.area_with_type &&
                                    item !== suggestion.data.region_with_type
                            } ).join( ', ' )
                        }
                    } )

                } ).change()
            }
        }

    } );

} )( jQuery, window, document, wc_russian_post_address_suggestions_params );