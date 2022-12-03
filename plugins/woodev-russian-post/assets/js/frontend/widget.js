( function( $, w, d, wp, wc_russian_post_map_params ) {
	
	$( function() {
		
		var $balloon_template = wp.template( 'wc-modal-russian-post-map-balloon' ),
			prevBounds = null,
			map,
			currentBalloon = wc_russian_post_map_params.chosen_pvz && wc_russian_post_map_params.chosen_pvz.currentBalloon ? wc_russian_post_map_params.chosen_pvz.currentBalloon : null,
			currentTabLink = 0,
			currentTabHeader = 0,
			MapModel = Backbone.Model.extend(),
			MapView = Backbone.View.extend( {
				initialize: function() {
					
					$( d.body ).on( 'wc_backbone_modal_loaded', { view: this }, this.onModalLoaded );
					$( d.body ).on( 'click', '.wc-russian-post-choose-delivery-point', { view: this }, this.onModalInit );
					
					$( d ).on("click", ".main-tabs__list-item", this.onMapTabSwitch );
					$( d ).on("click", ".tabs__list-item", this.onMapTabItemSwitch );
					$( d.body ).on( 'wc_backbone_modal_removed', this.onModalRemoved );
				},
				
				onModalLoaded: function( event, target ) {
					event.data.view.render();
				},
				
				render: function() {
					var view   = this;
						
					$( '.modal-map-container' ).empty();
					view.mapLoad();
				},
				
				onModalInit: function( event ) {
					event.preventDefault();
					
					$( this ).WCBackboneModal( { template : 'wc-modal-russian-post-map' } );
				},
				
				onMapTabSwitch: function( event ) {
					
					var tabs = $( this ).closest(".tabs");
									
					currentTabHeader = $( this ).closest("li").index(),
									
					tabs.find("ul.main-tabs > li").removeClass("main-tabs__list-item_current"),
									
					$( this ).closest("li").addClass("main-tabs__list-item_current"),
									
					tabs.find(".sub-tabs-wrapper").find("ul.tabs__header").not('ul.tabs__header:eq(' + currentTabHeader + ')').slideUp( {
						duration: 0
					} ),
									
					tabs.find(".sub-tabs-wrapper").find('ul.tabs__header:eq(' + currentTabHeader + ')').slideDown( {
						duration: 0
					} ),
									
					tabs.find('.tabs__header:eq(' + currentTabHeader + ')').find('.tabs__link:eq(' + currentTabLink + ')').trigger("click"),
									
					event.preventDefault()
				},
				
				onMapTabItemSwitch: function( event ) {
					
					var tabs = $( this ).closest(".tabs");
									
					currentTabLink = $( this ).closest("li").index(),
									
					tabs.find("ul.tabs__header > li").removeClass("tabs__list-item_current"),
									
					$( this ).closest("li").addClass("tabs__list-item_current"),
									
					tabs.find(".tabs__content").find("div.tabs__item").not('div.tabs__item:eq(' + event.target.dataset.contentid + ')').slideUp( {
						duration: 0
					} ),
									
					tabs.find(".tabs__content").find( 'div#' + event.target.dataset.contentid ).slideDown( {
						duration: 0
					} ),
									
					event.preventDefault()
				},
				
				onModalRemoved:function() {
					prevBounds = null;
					map.destroy();
				},
				
				mapLoad: function() {
					
					WCRussianPostMaps.ready( function() {
						
						const F = new Set,
							D = new Map,
							preloaderSpinner = '<div class="preloader"><svg class="preloader__spinner" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="preloader__path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg></div>';
						
						map = new WCRussianPostMaps.Map( 'russian-post-map-container', {
							center: [55.76, 37.64],
							zoom: 12
						} ),
						
						objectManager = function() {
							
							var ballonObject = new WCRussianPostMaps.ObjectManager( {
								clusterize: true,
								clusterIconColor: "#2050a8",
								clusterBalloonLayout: templateLayout( true ),
								clusterBalloonContentLayout: WCRussianPostMaps.templateLayoutFactory.createClass('<div class="tabs"><ul class="main-tabs">{% for geoObject in properties.geoObjects %}{% if (geoObject.properties.orderNumber == 1) %}<li class="main-tabs__list-item"><span class="main-tabs__link">{{ geoObject.properties.index }}</span></li>{% endif %}{% endfor %}</ul><div class="sub-tabs-wrapper">{% for geoObject in properties.geoObjects %}{% if (geoObject.properties.orderNumber == 1) %}<ul class="tabs__header">{% for item in properties.geoObjects %}{% if (item.properties.index == geoObject.properties.index) %}<li class="tabs__list-item"><span class="tabs__link" data-contentid="{{ item.properties.placemarkId }}">{% if (item.properties.type == \'additional_pvz\') %}Пункт выдачи{% else %}Отделение{% endif %}</span></li>{% endif %}{% endfor %}</ul>{% endif %}{% endfor %}</div><div class="tabs__content">{% for geoObject in properties.geoObjects %}<div class="tabs__item" id="{{ geoObject.properties.placemarkId }}">{{ geoObject.properties.balloonContent|raw }}</div>{% endfor %}</div></div>'),
								clusterBalloonContentLayoutHeight: "auto",
								clusterBalloonLeftColumnHeight: "auto",
								clusterBalloonItemContentLayout: WCRussianPostMaps.templateLayoutFactory.createClass('<div class="balloon__body">{{ properties.balloonContent|raw }}</div>')
							} );
							
							ballonObject.objects.events.add("balloonopen", function( balloon ) {
								
								const balloonId = ballonObject.objects.getById( balloon.get("objectId") );
								
								getBalloonInfo( balloonId, ballonObject ),
								
								$( d ).on("click", ".balloon__show-more", function() {
									balloonId.properties.balloonContent = balloonContent( balloonId.properties.balloonContent ),
									ballonObject.objects.balloon.setData( ballonObject.objects.balloon.getData() )
								} )
							} );
							
							ballonObject.objects.events.add("balloonclose", function() {
								$( d ).off("click", ".balloon__show-more" );
							} );
							
							ballonObject.clusters.events.add("balloonopen", function( balloon ) {
									
								const features = ballonObject.clusters.getById( balloon.get("objectId") ).features;
									
								features && features.length && features.forEach( function( future ) {
									getBalloonInfo( future, ballonObject, true );
								} ),
									
								$( d ).on("click", ".balloon__show-more", function() {
									
									features.forEach( function( future ) {
										
										const futureId = ballonObject.objects.getById( future.id );
										
										futureId.properties.balloonContent = balloonContent( futureId.properties.balloonContent ),
										ballonObject.clusters.balloon.setData( ballonObject.clusters.balloon.getData() ),
										switchTabs()
									} )
								} )
							});
							
							ballonObject.clusters.events.add("balloonclose", function() {
								currentTabLink = 0,
								currentTabHeader = 0,
								
								$( d ).off("click", ".balloon__show-more");
							} );
							
							$( d ).on("click", ".balloon__button", function( button ) {
								
								var placemarkid = button.target.dataset.placemarkid,
									pvzdata = JSON.parse( button.target.dataset.pvzdata.replace(/'/g, '"') ),
									oldBalloon = ballonObject.objects.getById( currentBalloon ),
									newBalloon = ballonObject.objects.getById( placemarkid ),
									newBalloonContent = newBalloon.properties.balloonContent;
									
									console.log( { balloon: { id: currentBalloon, value: oldBalloon }, placemark: { id: placemarkid, value: newBalloon } } );
								
								if ( placemarkid != currentBalloon ) {
									const u = function( t, n ) {
											const e = n.clusters._clustersById,
												r = Object.keys(n.clusters._clustersById);
											
											for (const n of r) if (e[n].features.find(n => +n.id == +t)) return n;
											
											return null
										}( placemarkid, ballonObject );
										
									newBalloon.properties.balloonContent = preloaderSpinner,
									setBalloonData(!!u, ballonObject);
										
									$.post( wc_russian_post_map_params.ajax_url.toString().replace( '%%endpoint%%', 'set_russian_post_point' ), {
										pvzdata: $.extend( pvzdata, { currentBalloon : placemarkid } ),
										wc_russian_post_points_nonce: wc_russian_post_map_params.wc_russian_post_notice
									}, 'json' ).then( function( data ) {
											
										if( data.success && data.data && data.data == pvzdata.indexTo ) {
											$( d.body ).trigger( 'update_checkout', { update_shipping_method: true } ),
											currentBalloon = placemarkid,
											newBalloon.properties.balloonContent = newBalloonContent.replace("balloon__button", "balloon__button balloon__button_disabled"),
											oldBalloon && ( oldBalloon.properties.balloonContent = oldBalloon.properties.balloonContent.replace("balloon__button_disabled", "") ),
											setBalloonData(!!u, ballonObject)
										} else {
											newBalloon.properties.balloonContent = newBalloonContent;
										}
										
									} ).fail( function() {
										newBalloon.properties.balloonContent = newBalloonContent;
										w.alert( wc_russian_post_map_params.strings.point_failed );
									} );
								}
							} );
							
							return ballonObject;
							
						}();
						
						map.geoObjects.add( objectManager ),
						
						function( mapObject, zipcode ) {
							
							var endpoint = zipcode ? 'ajax_get_postoffice_by_index' : 'ajax_get_user_location';
								
							$.post( wc_russian_post_map_params.ajax_url.toString().replace( '%%endpoint%%', endpoint ), { zip: zipcode }, function( { data: data } ) {
								if( data ) {
									mapObject.setCenter( data );
								} else {
									setCenter( mapObject );
								}
							} );
						
						}( map, $( '#billing_postcode' ).val() || $( '#shipping_postcode' ).val() ),
						
						function( mapObject ) {
							mapObject.controls.remove("trafficControl");
							mapObject.controls.remove("typeSelector");
							mapObject.controls.remove("rulerControl");
							mapObject.controls.remove("fullscreenControl");
							
							if( 1 != wc_russian_post_map_params.show_search_control ) {
								mapObject.controls.remove("searchControl");
							}
							
							if( 1 != wc_russian_post_map_params.enable_geolocation_control ) {
								mapObject.controls.remove("geolocationControl");
							}
						}( map ),
						
						map.events.add( "boundschange", function( { originalEvent: event } ) {
							
							( function( object, bounds ) {
								/*
								getPvzList( bounds ).pipe(function( data ) {
									
									if( data.pageNumber < data.totalPages ) {
										
										return getPvzList( bounds, data.pageNumber + 1 ).pipe(function( next ) {
											var n = next && next.boundingBox;
											prevBounds = n && n.coordinates ? [n.coordinates[0][0], n.coordinates[0][2]] : prevBounds;
											
											//return $.extend( data, next );
											return next;
										} );
									
									} else {
										
										return data;
									}
									
								} )
								*/
								
								getPvzList( bounds ).pipe( function( data ) {
									
									if( data.pageNumber < data.totalPages ) {
										return getPvzList( bounds, data.pageNumber + 1 );
									}
										
									var boundingBox = data && data.boundingBox;
									prevBounds = boundingBox && boundingBox.coordinates ? [boundingBox.coordinates[0][0], boundingBox.coordinates[0][2]] : prevBounds;
									
									return data;
								
								} ).done( function( { data: result } ) {
									
									if( ! result ) return;
									
									object.add( function( result ){
										
										return result.map( function( elem ) {
											
											if( F.has( elem.id ) ) return null;
											
											return F.add( elem.id ),
											D.has( elem.deliveryPointIndex ) ? D.set( elem.deliveryPointIndex, D.get( elem.deliveryPointIndex ) + 1 ) : D.set( elem.deliveryPointIndex, 1 ),
											{
												type: "Feature",
												id: elem.id,
												geometry: {
													type: "Point",
													coordinates: elem.geo.coordinates.reverse()
												},
												options: {
													balloonLayout: templateLayout(),
													balloonPanelMaxMapArea: 0,
													balloonAutoPan: true,
													openEmptyBalloon: true,
													hideIconOnBalloonOpen: false,
													iconLayout: "default#image",
													iconImageHref: elem.type === 'additional_pvz' ? 'https://widget.pochta.ru/map/src/assets/additional-post-pin-icon.svg' : 'https://widget.pochta.ru/map/src/assets/russian-post-pin-icon.svg',
													iconImageSize: [40, 40],
													iconImageOffset: [-20, -20]
												},
												properties: {
													isShowedAll: false,
													placemarkId: elem.id,
													index: elem.deliveryPointIndex,
													type: elem.type,
													balloonContent: preloaderSpinner,
													orderNumber: D.get( elem.deliveryPointIndex )
												}
											}
										
										} ).filter( function( pvz ) { return pvz } );
										
									}( result ) );
									
								} );
								
							} )( objectManager, event.newBounds );
						} );
						
						function setCenter( mapObject, coordinates = null ) {
							
							WCRussianPostMaps.geolocation.get( {
								mapStateAutoApply: true
							} ).done( function( { geoObjects: geo } ) {
								mapObject.setCenter( coordinates || geo.position );
							} );
						}
						
						function getBalloonInfo( element, ballonObject, isCluster = false ) {
							
							var balloonObjectId = ballonObject.objects.getById( element.id );
							
							( $.getJSON( 'https://widget.pochta.ru/api/pvz/' + element.id ) ).pipe( function( info ) {
								
								var params = {
									id: 130,
									weight: wc_russian_post_map_params.cart_weight,
									sumoc: wc_russian_post_map_params.cart_cost_total,
									indexTo: info.deliveryPointIndex
								};
								
								if( info.type === 'additional_pvz' ) {
									params.type = 'ECOM';
								}
								
								return $.getJSON( 'https://widget.pochta.ru/api/data/free_tariff_by_settings', params ).pipe( function( tariffs ) {
									return $.extend( tariffs, info );
								} );
								
							} ).done( function( info ) {
								
								balloonObjectId.properties.balloonContent = function( data, element, isCluster ) {
									return $balloon_template( { data, element, isCluster, currentBalloon } );
								}( info, element, isCluster ),
								setBalloonData( isCluster, ballonObject )
							
							} );
						}
						
						function balloonContent( content ) {
							return ( content = content.replace(/balloon__content_less/g, "") ).replace( "balloon__show-more", "balloon__show-more_hidden" );
						}
						
						function setBalloonData( isCluster, ballonObject ) {
							isCluster ? ballonObject.clusters.balloon.setData( ballonObject.clusters.balloon.getData() ) : ballonObject.objects.balloon.setData( ballonObject.objects.balloon.getData() ),
							switchTabs()
						}
						
						function switchTabs() {
							$(".main-tabs").find('.main-tabs__link:eq(' + currentTabHeader + ')').trigger("click"),
							$(".tabs").find('.tabs__header:eq(' + currentTabHeader + ')').find('.tabs__link:eq(' + currentTabLink + ')').trigger("click")
						}
						
						function templateLayout( isCluster = false ) {
								
							var style = isCluster ? "cluster-balloon" : "my-balloon";
							var template = '<div class="' + style + '"><a class="' + style + '__close-button" href="#">&times;</a>$[[options.contentLayout]]</div>';
							
							return WCRussianPostMaps.templateLayoutFactory.createClass( template, {
								build: function() {
									this.constructor.superclass.build.call( this );
									this.element = $( isCluster ? '.cluster-balloon' : '.my-balloon', this.getParentElement() );
									this.element.find( ( isCluster ? '.cluster-balloon' : '.my-balloon' ) + '__close-button' ).on("click", $.proxy( this.onCloseClick, this ) );
									this.element.find( '.balloon__button' ).on("click", $.proxy( this.onButtonClick, this ) );
								},
								onCloseClick: function( event ) {
									event.preventDefault(),
									this.events.fire("userclose")
								},
								onButtonClick: function( event ) {
									event.preventDefault();
									
									if( wc_russian_post_map_params.replace_address_from_map ) {
										
										var pvzdata = JSON.parse( event.target.dataset.pvzdata.replace(/'/g, '"') );
										var address_value = [ pvzdata.streetTo ];
										var city_value = pvzdata.cityTo.toString().replace( new RegExp( ['г ','д ', 'пос ' ].join('|'), 'g' ), function() { return ''; } );
										if( pvzdata.houseTo ) {
											address_value.push( pvzdata.houseTo );
										}
										
										$( '#billing_address_1, #shipping_address_1' ).val( address_value.join( ', ' ) ).change();
										$( '#billing_postcode, #shipping_postcode' ).val( pvzdata.indexTo ).change();
										
										if( $( '#billing_city, #shipping_city' ).is( 'select' ) &&  $( '#billing_city, #shipping_city' ).hasClass( 'select' ) ) {
											$( '#billing_city, #shipping_city' ).html( $( '<option />', { value: city_value, text: city_value, selected:true } ) );
											
											if( wc_russian_post_map_params && wc_russian_post_map_params.cdek_exist ) {
												var query_params = {
													city: city_value
												};
												if( pvzdata.indexTo ) {
													query_params.postcode = pvzdata.indexTo;
												}
												$.post( wc_russian_post_map_params.ajax_url.toString().replace( '%%endpoint%%', 'set_edostavka_customer_city' ), 
													   query_params, function( { data: data } ) {
													if( data ) {
														$( '#billing_state_id' ).val( data.code );
													}
													console.log( data );
													}
												);
											}
										} else {
											$( '#billing_city, #shipping_city' ).val( city_value ).change();
										}										
										
										//$( '#billing_state, #shipping_state' ).val( pvzdata.regionTo.toString().replace( new RegExp( ['обл ','край ', 'Респ ' ].join('|'), 'g' ), function() { return ''; } ) ).change();
										$( '#billing_state, #shipping_state' ).val( pvzdata.regionTo ).change();
									}
									
								},
								getShape: function() {
									
									if ( ! this.isElement( this.element ) ) return this.constructor.superclass.getShape.call( this );
									
									var position = this.element.position();
									
									return new WCRussianPostMaps.shape.Rectangle( new WCRussianPostMaps.geometry.pixel.Rectangle( [
										[ position.left, position.top ],
										[ position.left + this.element[0].offsetWidth, position.top + this.element[0].offsetHeight ]
									] ) )
								},
								isElement: function( element ) {
									return element && element[0]
								}
							} )
						}
						
						function getPvzList( bounds, pageNumber = 1 ) {
							
							var params = {
								pageSize: 1000,
								page: pageNumber,
								acceptEcom: true,
								pvzType: [ 'additional_pvz' ],
								currentTopRightPoint: [ bounds[0][1], bounds[0][0] ],
								currentBottomLeftPoint: [ bounds[1][1], bounds[1][0] ]
							};
							
							/*
							* Если нужно показывать почтовые отделения, то меняем false на true
							*/
							if( true ) {
								params.pvzType.push( 'russian_post' ); //Показывать отделения почты РФ
								//params.pvzType.push( 'postamat' ); //Показывать постоматы
								params.pvzType.push( 'additional_pvz' ); //Показывать пункты выдачи
							}
							
							if( prevBounds ) {
								params.prevTopRightPoint = prevBounds[0];
								params.prevBottomLeftPoint = prevBounds[1]
							}
							
							return $.getJSON( 'https://widget.pochta.ru/api/pvz', params );
						}
					
					} );
				}
			} ),
		
			mapView = new MapView( { model: new MapModel() } );
	} );
	
} )( jQuery, window, document, wp, wc_russian_post_map_params );