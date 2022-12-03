( function( $, w ) {
    $( document ).ready( function() {
		
		if( wc_russian_post_map_params.enable_suggestions && $( '#billing_address_1' ).length > 0 ) {
			
			$( document.body ).on( 'updated_checkout', function() {
				
				if( $( '#billing_country' ).val() != 'RU' ) {
					return;
				}				
				
				$( '#billing_address_1' ).autocomplete( {
				
					source: function( request, response ) {
						
						var query = {
							query: request.term,
							restrict_value: true,
							language: wc_russian_post_map_params.locale,
							from_bound: { value:'settlement' },
							to_bound: { value:'house' },
							locations: [
								{
									country_iso_code: 'RU'
								}
							]
						};
						
						if( '' != $( '#billing_city' ).val() ) {
							query.locations.push( { city: $( '#billing_city' ).val() } );
							query.locations.push( { settlement: $( '#billing_city' ).val() } );
						}
						
						fetch( 'https://passport.pochta.ru/suggestions/api/4_1/rs/suggest/address', {
								method: "POST",
								mode: "cors",
								headers: {
									"Content-Type": "application/json",
									"Accept": "application/json"
								},
								body: JSON.stringify( query )
							}
						).then( response => response.json() ).then( function( result ) {
							//console.log(result.suggestions);
							if( result.suggestions ) {
								response( result.suggestions );
							}
						} ).catch( error => console.error( "Ошибка при запросе получения данных о адресе", error ) );
					},
					minLength: 2,
					select: function( event, ui ) {
						var chenged = false;
						/*
						var $address_array = [
							ui.item.data.street_with_type
						];
						
						if( ui.item.data.house ) {
							$address_array.push( ui.item.data.house_type + ' ' + ui.item.data.house );
						}
						
						if( ui.item.data.block ) {
							$address_array.push( ui.item.data.block_type_full + ' ' + ui.item.data.block );
						}
						
						if( ui.item.data.flat ) {
							$address_array.push( ui.item.data.flat_type_full + ' ' + ui.item.data.flat );
						}
						
						$( '#billing_address_1' ).val( $address_array.join( ', ' ) );
						*/
						
						var $billing_address = ui.item.value;
						
						if( $billing_address.includes( ui.item.data.region_with_type ) !== -1 ) {
							$billing_address = $billing_address.replace( ui.item.data.region_with_type, '' ).replace(/^,/, '' ).trim();
						}
						
						if( $billing_address.includes( ui.item.data.city_with_type ) !== -1 ) {
							$billing_address = $billing_address.replace( ui.item.data.city_with_type, '' ).replace(/^,/, '' ).trim();
						}
						
						$( '#billing_address_1' ).val( $billing_address ).change();
						
						if( wc_russian_post_map_params.replace_address_field ) {
							
							if( ui.item.data.postal_code && ( $( '#billing_postcode' ).val() == '' || ui.item.data.postal_code != $( '#billing_postcode' ).val() ) ) {
								$( '#billing_postcode' ).val( ui.item.data.postal_code ).change();
								chenged = true;
							} else if( ! ui.item.data.postal_code ) {
								$( '#billing_postcode' ).val( '' ).change();
								chenged = true;
							}
							
							if( ! wc_russian_post_map_params.cdek_exist && ui.item.data.city && ( $( '#billing_city' ).val() == '' || ui.item.data.city != $( '#billing_city' ).val() ) ) {
								
								if( $( '#billing_city' ).is( 'select' ) &&  $( '#billing_city' ).hasClass( 'select' ) ) {
									$( '#billing_city' ).html( $( '<option />', { value: ui.item.data.city, text: ui.item.data.city, selected:true } ) );
								} else {
									$( '#billing_city' ).val( ui.item.data.city ).change();
								}
								
								chenged = true;
							
							}
							
							if( wc_russian_post_map_params.cdek_exist && ui.item.data.city ) {
								
								var query_params = { city: ui.item.data.city };
								
								if( ui.item.data.postal_code ) {
									query_params.postcode = ui.item.data.postal_code;
								}
								
								$.post( wc_russian_post_map_params.ajax_url.toString().replace( '%%endpoint%%', 'set_edostavka_customer_city' ), 
									query_params, function( { data: code } ) {
										if( code && code != $( '#billing_state_id' ).val() ) {
											$( '#billing_state_id' ).val( code );
										}
									}
								);
							}
							
							if( ui.item.data.region_with_type && ( $( '#billing_state' ).val() == '' || ui.item.data.region_with_type != $( '#billing_state' ).val() ) ) {
								$( '#billing_state' ).val( ui.item.data.region_with_type ).change();
								chenged = true;
							}
						}
						
						if( chenged && '' != $( '#billing_postcode' ).val() ) {
							//Удалить или сменить false что бы функция работала
							if( wc_russian_post_map_params.cdek_exist && false ) {
								$.post( wc_russian_post_map_params.ajax_url.toString().replace( '%%endpoint%%', 'set_customer_address' ), { address: $billing_address }, function( data ) {
									if( data && data.success ) {
										console.log( data.data );
										$( document.body ).trigger( 'update_checkout', { update_shipping_method: true } );
									}
								} );
							} else {
								$( document.body ).trigger( 'update_checkout', { update_shipping_method: true } );
							}
						}
						
						return false;
					}
				} );
			} );
		}
	} );

} )( jQuery, window );