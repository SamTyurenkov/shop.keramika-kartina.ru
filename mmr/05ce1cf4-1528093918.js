/* jshint loopfunc: true */
// use jQuery and hoverIntent if loaded
if ( typeof(jQuery) != 'undefined' ) {
	if ( typeof(jQuery.fn.hoverIntent) == 'undefined' ) {
		/* jshint ignore:start */
		// hoverIntent v1.8.1 - Copy of wp-includes/js/hoverIntent.min.js
		!function(a){a.fn.hoverIntent=function(b,c,d){var e={interval:100,sensitivity:6,timeout:0};e="object"==typeof b?a.extend(e,b):a.isFunction(c)?a.extend(e,{over:b,out:c,selector:d}):a.extend(e,{over:b,out:b,selector:c});var f,g,h,i,j=function(a){f=a.pageX,g=a.pageY},k=function(b,c){return c.hoverIntent_t=clearTimeout(c.hoverIntent_t),Math.sqrt((h-f)*(h-f)+(i-g)*(i-g))<e.sensitivity?(a(c).off("mousemove.hoverIntent",j),c.hoverIntent_s=!0,e.over.apply(c,[b])):(h=f,i=g,c.hoverIntent_t=setTimeout(function(){k(b,c)},e.interval),void 0)},l=function(a,b){return b.hoverIntent_t=clearTimeout(b.hoverIntent_t),b.hoverIntent_s=!1,e.out.apply(b,[a])},m=function(b){var c=a.extend({},b),d=this;d.hoverIntent_t&&(d.hoverIntent_t=clearTimeout(d.hoverIntent_t)),"mouseenter"===b.type?(h=c.pageX,i=c.pageY,a(d).on("mousemove.hoverIntent",j),d.hoverIntent_s||(d.hoverIntent_t=setTimeout(function(){k(c,d)},e.interval))):(a(d).off("mousemove.hoverIntent",j),d.hoverIntent_s&&(d.hoverIntent_t=setTimeout(function(){l(c,d)},e.timeout)))};return this.on({"mouseenter.hoverIntent":m,"mouseleave.hoverIntent":m},e.selector)}}(jQuery);
		/* jshint ignore:end */
	}
	jQuery(document).ready(function($){
		var adminbar = $('#wpadminbar'), refresh, touchOpen, touchClose, disableHoverIntent = false;

		refresh = function(i, el){ // force the browser to refresh the tabbing index
			var node = $(el), tab = node.attr('tabindex');
			if ( tab )
				node.attr('tabindex', '0').attr('tabindex', tab);
		};

		touchOpen = function(unbind) {
			adminbar.find('li.menupop').on('click.wp-mobile-hover', function(e) {
				var el = $(this);

				if ( el.parent().is('#wp-admin-bar-root-default') && !el.hasClass('hover') ) {
					e.preventDefault();
					adminbar.find('li.menupop.hover').removeClass('hover');
					el.addClass('hover');
				} else if ( !el.hasClass('hover') ) {
					e.stopPropagation();
					e.preventDefault();
					el.addClass('hover');
				} else if ( ! $( e.target ).closest( 'div' ).hasClass( 'ab-sub-wrapper' ) ) {
					// We're dealing with an already-touch-opened menu genericon (we know el.hasClass('hover')),
					// so close it on a second tap and prevent propag and defaults. See #29906
					e.stopPropagation();
					e.preventDefault();
					el.removeClass('hover');
				}

				if ( unbind ) {
					$('li.menupop').off('click.wp-mobile-hover');
					disableHoverIntent = false;
				}
			});
		};

		touchClose = function() {
			var mobileEvent = /Mobile\/.+Safari/.test(navigator.userAgent) ? 'touchstart' : 'click';
			// close any open drop-downs when the click/touch is not on the toolbar
			$(document.body).on( mobileEvent+'.wp-mobile-hover', function(e) {
				if ( !$(e.target).closest('#wpadminbar').length )
					adminbar.find('li.menupop.hover').removeClass('hover');
			});
		};

		adminbar.removeClass('nojq').removeClass('nojs');

		if ( 'ontouchstart' in window ) {
			adminbar.on('touchstart', function(){
				touchOpen(true);
				disableHoverIntent = true;
			});
			touchClose();
		} else if ( /IEMobile\/[1-9]/.test(navigator.userAgent) ) {
			touchOpen();
			touchClose();
		}

		adminbar.find('li.menupop').hoverIntent({
			over: function() {
				if ( disableHoverIntent )
					return;

				$(this).addClass('hover');
			},
			out: function() {
				if ( disableHoverIntent )
					return;

				$(this).removeClass('hover');
			},
			timeout: 180,
			sensitivity: 7,
			interval: 100
		});

		if ( window.location.hash )
			window.scrollBy( 0, -32 );

		$('#wp-admin-bar-get-shortlink').click(function(e){
			e.preventDefault();
			$(this).addClass('selected').children('.shortlink-input').blur(function(){
				$(this).parents('#wp-admin-bar-get-shortlink').removeClass('selected');
			}).focus().select();
		});

		$('#wpadminbar li.menupop > .ab-item').bind('keydown.adminbar', function(e){
			if ( e.which != 13 )
				return;

			var target = $(e.target),
				wrap = target.closest('.ab-sub-wrapper'),
				parentHasHover = target.parent().hasClass('hover');

			e.stopPropagation();
			e.preventDefault();

			if ( !wrap.length )
				wrap = $('#wpadminbar .quicklinks');

			wrap.find('.menupop').removeClass('hover');

			if ( ! parentHasHover ) {
				target.parent().toggleClass('hover');
			}

			target.siblings('.ab-sub-wrapper').find('.ab-item').each(refresh);
		}).each(refresh);

		$('#wpadminbar .ab-item').bind('keydown.adminbar', function(e){
			if ( e.which != 27 )
				return;

			var target = $(e.target);

			e.stopPropagation();
			e.preventDefault();

			target.closest('.hover').removeClass('hover').children('.ab-item').focus();
			target.siblings('.ab-sub-wrapper').find('.ab-item').each(refresh);
		});

		adminbar.click( function(e) {
			if ( e.target.id != 'wpadminbar' && e.target.id != 'wp-admin-bar-top-secondary' ) {
				return;
			}

			adminbar.find( 'li.menupop.hover' ).removeClass( 'hover' );
			$( 'html, body' ).animate( { scrollTop: 0 }, 'fast' );
			e.preventDefault();
		});

		// fix focus bug in WebKit
		$('.screen-reader-shortcut').keydown( function(e) {
			var id, ua;

			if ( 13 != e.which )
				return;

			id = $( this ).attr( 'href' );

			ua = navigator.userAgent.toLowerCase();

			if ( ua.indexOf('applewebkit') != -1 && id && id.charAt(0) == '#' ) {
				setTimeout(function () {
					$(id).focus();
				}, 100);
			}
		});

		$( '#adminbar-search' ).on({
			focus: function() {
				$( '#adminbarsearch' ).addClass( 'adminbar-focused' );
			}, blur: function() {
				$( '#adminbarsearch' ).removeClass( 'adminbar-focused' );
			}
		} );

		// Empty sessionStorage on logging out
		if ( 'sessionStorage' in window ) {
			$('#wp-admin-bar-logout a').click( function() {
				try {
					for ( var key in sessionStorage ) {
						if ( key.indexOf('wp-autosave-') != -1 )
							sessionStorage.removeItem(key);
					}
				} catch(e) {}
			});
		}

		if ( navigator.userAgent && document.body.className.indexOf( 'no-font-face' ) === -1 &&
			/Android (1.0|1.1|1.5|1.6|2.0|2.1)|Nokia|Opera Mini|w(eb)?OSBrowser|webOS|UCWEB|Windows Phone OS 7|XBLWP7|ZuneWP7|MSIE 7/.test( navigator.userAgent ) ) {

			document.body.className += ' no-font-face';
		}
	});
} else {
	(function(d, w) {
		var addEvent = function( obj, type, fn ) {
			if ( obj.addEventListener )
				obj.addEventListener(type, fn, false);
			else if ( obj.attachEvent )
				obj.attachEvent('on' + type, function() { return fn.call(obj, window.event);});
		},

		aB, hc = new RegExp('\\bhover\\b', 'g'), q = [],
		rselected = new RegExp('\\bselected\\b', 'g'),

		/**
		 * Get the timeout ID of the given element
		 */
		getTOID = function(el) {
			var i = q.length;
			while ( i-- ) {
				if ( q[i] && el == q[i][1] )
					return q[i][0];
			}
			return false;
		},

		addHoverClass = function(t) {
			var i, id, inA, hovering, ul, li,
				ancestors = [],
				ancestorLength = 0;

			while ( t && t != aB && t != d ) {
				if ( 'LI' == t.nodeName.toUpperCase() ) {
					ancestors[ ancestors.length ] = t;
					id = getTOID(t);
					if ( id )
						clearTimeout( id );
					t.className = t.className ? ( t.className.replace(hc, '') + ' hover' ) : 'hover';
					hovering = t;
				}
				t = t.parentNode;
			}

			// Remove any selected classes.
			if ( hovering && hovering.parentNode ) {
				ul = hovering.parentNode;
				if ( ul && 'UL' == ul.nodeName.toUpperCase() ) {
					i = ul.childNodes.length;
					while ( i-- ) {
						li = ul.childNodes[i];
						if ( li != hovering )
							li.className = li.className ? li.className.replace( rselected, '' ) : '';
					}
				}
			}

			/* remove the hover class for any objects not in the immediate element's ancestry */
			i = q.length;
			while ( i-- ) {
				inA = false;
				ancestorLength = ancestors.length;
				while( ancestorLength-- ) {
					if ( ancestors[ ancestorLength ] == q[i][1] )
						inA = true;
				}

				if ( ! inA )
					q[i][1].className = q[i][1].className ? q[i][1].className.replace(hc, '') : '';
			}
		},

		removeHoverClass = function(t) {
			while ( t && t != aB && t != d ) {
				if ( 'LI' == t.nodeName.toUpperCase() ) {
					(function(t) {
						var to = setTimeout(function() {
							t.className = t.className ? t.className.replace(hc, '') : '';
						}, 500);
						q[q.length] = [to, t];
					})(t);
				}
				t = t.parentNode;
			}
		},

		clickShortlink = function(e) {
			var i, l, node,
				t = e.target || e.srcElement;

			// Make t the shortlink menu item, or return.
			while ( true ) {
				// Check if we've gone past the shortlink node,
				// or if the user is clicking on the input.
				if ( ! t || t == d || t == aB )
					return;
				// Check if we've found the shortlink node.
				if ( t.id && t.id == 'wp-admin-bar-get-shortlink' )
					break;
				t = t.parentNode;
			}

			// IE doesn't support preventDefault, and does support returnValue
			if ( e.preventDefault )
				e.preventDefault();
			e.returnValue = false;

			if ( -1 == t.className.indexOf('selected') )
				t.className += ' selected';

			for ( i = 0, l = t.childNodes.length; i < l; i++ ) {
				node = t.childNodes[i];
				if ( node.className && -1 != node.className.indexOf('shortlink-input') ) {
					node.focus();
					node.select();
					node.onblur = function() {
						t.className = t.className ? t.className.replace( rselected, '' ) : '';
					};
					break;
				}
			}
			return false;
		},

		scrollToTop = function(t) {
			var distance, speed, step, steps, timer, speed_step;

			// Ensure that the #wpadminbar was the target of the click.
			if ( t.id != 'wpadminbar' && t.id != 'wp-admin-bar-top-secondary' )
				return;

			distance    = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

			if ( distance < 1 )
				return;

			speed_step = distance > 800 ? 130 : 100;
			speed     = Math.min( 12, Math.round( distance / speed_step ) );
			step      = distance > 800 ? Math.round( distance / 30  ) : Math.round( distance / 20  );
			steps     = [];
			timer     = 0;

			// Animate scrolling to the top of the page by generating steps to
			// the top of the page and shifting to each step at a set interval.
			while ( distance ) {
				distance -= step;
				if ( distance < 0 )
					distance = 0;
				steps.push( distance );

				setTimeout( function() {
					window.scrollTo( 0, steps.shift() );
				}, timer * speed );

				timer++;
			}
		};

		addEvent(w, 'load', function() {
			aB = d.getElementById('wpadminbar');

			if ( d.body && aB ) {
				d.body.appendChild( aB );

				if ( aB.className )
					aB.className = aB.className.replace(/nojs/, '');

				addEvent(aB, 'mouseover', function(e) {
					addHoverClass( e.target || e.srcElement );
				});

				addEvent(aB, 'mouseout', function(e) {
					removeHoverClass( e.target || e.srcElement );
				});

				addEvent(aB, 'click', clickShortlink );

				addEvent(aB, 'click', function(e) {
					scrollToTop( e.target || e.srcElement );
				});

				addEvent( document.getElementById('wp-admin-bar-logout'), 'click', function() {
					if ( 'sessionStorage' in window ) {
						try {
							for ( var key in sessionStorage ) {
								if ( key.indexOf('wp-autosave-') != -1 )
									sessionStorage.removeItem(key);
							}
						} catch(e) {}
					}
				});
			}

			if ( w.location.hash )
				w.scrollBy(0,-32);

			if ( navigator.userAgent && document.body.className.indexOf( 'no-font-face' ) === -1 &&
				/Android (1.0|1.1|1.5|1.6|2.0|2.1)|Nokia|Opera Mini|w(eb)?OSBrowser|webOS|UCWEB|Windows Phone OS 7|XBLWP7|ZuneWP7|MSIE 7/.test( navigator.userAgent ) ) {

				document.body.className += ' no-font-face';
			}
		});
	})(document, window);

}
;
/*! jQuery v1.12.4 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="1.12.4",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(n.isPlainObject(c)||(b=n.isArray(c)))?(b?(b=!1,f=a&&n.isArray(a)?a:[]):f=a&&n.isPlainObject(a)?a:{},g[d]=n.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray||function(a){return"array"===n.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){var b=a&&a.toString();return!n.isArray(a)&&b-parseFloat(b)+1>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;try{if(a.constructor&&!k.call(a,"constructor")&&!k.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(!l.ownFirst)for(b in a)return k.call(a,b);for(b in a);return void 0===b||k.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(b){b&&n.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(h)return h.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(f=a[b],b=a,a=f),n.isFunction(a)?(c=e.call(arguments,2),d=function(){return a.apply(b||this,c.concat(e.call(arguments)))},d.guid=a.guid=a.guid||n.guid++,d):void 0},now:function(){return+new Date},support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s,w=b&&b.ownerDocument,x=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==x&&9!==x&&11!==x)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==x&&(o=$.exec(a)))if(f=o[1]){if(9===x){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(w&&(j=w.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(o[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=o[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==x)w=b,s=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),r=g(a),h=r.length,l=V.test(k)?"#"+k:"[id='"+k+"']";while(h--)r[h]=l+" "+qa(r[h]);s=r.join(","),w=_.test(a)&&oa(b.parentNode)||b}if(s)try{return H.apply(d,w.querySelectorAll(s)),d}catch(y){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=R.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},v=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},w=n.expr.match.needsContext,x=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,y=/^.[^:#\[\.,]*$/;function z(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(y.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return n.inArray(a,b)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;e>b;b++)if(n.contains(d[b],this))return!0}));for(b=0;e>b;b++)n.find(a,d[b],c);return c=this.pushStack(e>1?n.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(z(this,a||[],!1))},not:function(a){return this.pushStack(z(this,a||[],!0))},is:function(a){return!!z(this,"string"==typeof a&&w.test(a)?n(a):a||[],!1).length}});var A,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||A,"string"==typeof a){if(e="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:B.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),x.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}if(f=d.getElementById(e[2]),f&&f.parentNode){if(f.id!==e[2])return A.find(a);this.length=1,this[0]=f}return this.context=d,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof c.ready?c.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};C.prototype=n.fn,A=n(d);var D=/^(?:parents|prev(?:Until|All))/,E={children:!0,contents:!0,next:!0,prev:!0};n.fn.extend({has:function(a){var b,c=n(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(n.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=w.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?n.inArray(this[0],n(a)):n.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function F(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return u(a,"parentNode")},parentsUntil:function(a,b,c){return u(a,"parentNode",c)},next:function(a){return F(a,"nextSibling")},prev:function(a){return F(a,"previousSibling")},nextAll:function(a){return u(a,"nextSibling")},prevAll:function(a){return u(a,"previousSibling")},nextUntil:function(a,b,c){return u(a,"nextSibling",c)},prevUntil:function(a,b,c){return u(a,"previousSibling",c)},siblings:function(a){return v((a.parentNode||{}).firstChild,a)},children:function(a){return v(a.firstChild)},contents:function(a){return n.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(E[a]||(e=n.uniqueSort(e)),D.test(a)&&(e=e.reverse())),this.pushStack(e)}});var G=/\S+/g;function H(a){var b={};return n.each(a.match(G)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?H(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=!0,c||j.disable(),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(c.notify).done(c.resolve).fail(c.reject):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=e.call(arguments),d=c.length,f=1!==d||a&&n.isFunction(a.promise)?d:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(d>1)for(i=new Array(d),j=new Array(d),k=new Array(d);d>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().progress(h(b,j,i)).done(h(b,k,c)).fail(g.reject):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(d,[n]),n.fn.triggerHandler&&(n(d).triggerHandler("ready"),n(d).off("ready"))))}});function J(){d.addEventListener?(d.removeEventListener("DOMContentLoaded",K),a.removeEventListener("load",K)):(d.detachEvent("onreadystatechange",K),a.detachEvent("onload",K))}function K(){(d.addEventListener||"load"===a.event.type||"complete"===d.readyState)&&(J(),n.ready())}n.ready.promise=function(b){if(!I)if(I=n.Deferred(),"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll)a.setTimeout(n.ready);else if(d.addEventListener)d.addEventListener("DOMContentLoaded",K),a.addEventListener("load",K);else{d.attachEvent("onreadystatechange",K),a.attachEvent("onload",K);var c=!1;try{c=null==a.frameElement&&d.documentElement}catch(e){}c&&c.doScroll&&!function f(){if(!n.isReady){try{c.doScroll("left")}catch(b){return a.setTimeout(f,50)}J(),n.ready()}}()}return I.promise(b)},n.ready.promise();var L;for(L in n(l))break;l.ownFirst="0"===L,l.inlineBlockNeedsLayout=!1,n(function(){var a,b,c,e;c=d.getElementsByTagName("body")[0],c&&c.style&&(b=d.createElement("div"),e=d.createElement("div"),e.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(e).appendChild(b),"undefined"!=typeof b.style.zoom&&(b.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",l.inlineBlockNeedsLayout=a=3===b.offsetWidth,a&&(c.style.zoom=1)),c.removeChild(e))}),function(){var a=d.createElement("div");l.deleteExpando=!0;try{delete a.test}catch(b){l.deleteExpando=!1}a=null}();var M=function(a){var b=n.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b},N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(O,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}n.data(a,b,c)}else c=void 0;
}return c}function Q(a){var b;for(b in a)if(("data"!==b||!n.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function R(a,b,d,e){if(M(a)){var f,g,h=n.expando,i=a.nodeType,j=i?n.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||n.guid++:h),j[k]||(j[k]=i?{}:{toJSON:n.noop}),"object"!=typeof b&&"function"!=typeof b||(e?j[k]=n.extend(j[k],b):j[k].data=n.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[n.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[n.camelCase(b)])):f=g,f}}function S(a,b,c){if(M(a)){var d,e,f=a.nodeType,g=f?n.cache:a,h=f?a[n.expando]:n.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){n.isArray(b)?b=b.concat(n.map(b,n.camelCase)):b in d?b=[b]:(b=n.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!Q(d):!n.isEmptyObject(d))return}(c||(delete g[h].data,Q(g[h])))&&(f?n.cleanData([a],!0):l.deleteExpando||g!=g.window?delete g[h]:g[h]=void 0)}}}n.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?n.cache[a[n.expando]]:a[n.expando],!!a&&!Q(a)},data:function(a,b,c){return R(a,b,c)},removeData:function(a,b){return S(a,b)},_data:function(a,b,c){return R(a,b,c,!0)},_removeData:function(a,b){return S(a,b,!0)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=n.data(f),1===f.nodeType&&!n._data(f,"parsedAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));n._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){n.data(this,a)}):arguments.length>1?this.each(function(){n.data(this,a,b)}):f?P(f,a,n.data(f,a)):void 0},removeData:function(a){return this.each(function(){n.removeData(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=n._data(a,b),c&&(!d||n.isArray(c)?d=n._data(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return n._data(a,c)||n._data(a,c,{empty:n.Callbacks("once memory").add(function(){n._removeData(a,b+"queue"),n._removeData(a,c)})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=n._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}}),function(){var a;l.shrinkWrapBlocks=function(){if(null!=a)return a;a=!1;var b,c,e;return c=d.getElementsByTagName("body")[0],c&&c.style?(b=d.createElement("div"),e=d.createElement("div"),e.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(e).appendChild(b),"undefined"!=typeof b.style.zoom&&(b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",b.appendChild(d.createElement("div")).style.width="5px",a=3!==b.offsetWidth),c.removeChild(e),a):void 0}}();var T=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,U=new RegExp("^(?:([+-])=|)("+T+")([a-z%]*)$","i"),V=["Top","Right","Bottom","Left"],W=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)};function X(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return n.css(a,b,"")},i=h(),j=c&&c[3]||(n.cssNumber[b]?"":"px"),k=(n.cssNumber[b]||"px"!==j&&+i)&&U.exec(n.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,n.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var Y=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)Y(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},Z=/^(?:checkbox|radio)$/i,$=/<([\w:-]+)/,_=/^$|\/(?:java|ecma)script/i,aa=/^\s+/,ba="abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";function ca(a){var b=ba.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}!function(){var a=d.createElement("div"),b=d.createDocumentFragment(),c=d.createElement("input");a.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",l.leadingWhitespace=3===a.firstChild.nodeType,l.tbody=!a.getElementsByTagName("tbody").length,l.htmlSerialize=!!a.getElementsByTagName("link").length,l.html5Clone="<:nav></:nav>"!==d.createElement("nav").cloneNode(!0).outerHTML,c.type="checkbox",c.checked=!0,b.appendChild(c),l.appendChecked=c.checked,a.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!a.cloneNode(!0).lastChild.defaultValue,b.appendChild(a),c=d.createElement("input"),c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),a.appendChild(c),l.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,l.noCloneEvent=!!a.addEventListener,a[n.expando]=1,l.attributes=!a.getAttribute(n.expando)}();var da={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:l.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]};da.optgroup=da.option,da.tbody=da.tfoot=da.colgroup=da.caption=da.thead,da.th=da.td;function ea(a,b){var c,d,e=0,f="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||n.nodeName(d,b)?f.push(d):n.merge(f,ea(d,b));return void 0===b||b&&n.nodeName(a,b)?n.merge([a],f):f}function fa(a,b){for(var c,d=0;null!=(c=a[d]);d++)n._data(c,"globalEval",!b||n._data(b[d],"globalEval"))}var ga=/<|&#?\w+;/,ha=/<tbody/i;function ia(a){Z.test(a.type)&&(a.defaultChecked=a.checked)}function ja(a,b,c,d,e){for(var f,g,h,i,j,k,m,o=a.length,p=ca(b),q=[],r=0;o>r;r++)if(g=a[r],g||0===g)if("object"===n.type(g))n.merge(q,g.nodeType?[g]:g);else if(ga.test(g)){i=i||p.appendChild(b.createElement("div")),j=($.exec(g)||["",""])[1].toLowerCase(),m=da[j]||da._default,i.innerHTML=m[1]+n.htmlPrefilter(g)+m[2],f=m[0];while(f--)i=i.lastChild;if(!l.leadingWhitespace&&aa.test(g)&&q.push(b.createTextNode(aa.exec(g)[0])),!l.tbody){g="table"!==j||ha.test(g)?"<table>"!==m[1]||ha.test(g)?0:i:i.firstChild,f=g&&g.childNodes.length;while(f--)n.nodeName(k=g.childNodes[f],"tbody")&&!k.childNodes.length&&g.removeChild(k)}n.merge(q,i.childNodes),i.textContent="";while(i.firstChild)i.removeChild(i.firstChild);i=p.lastChild}else q.push(b.createTextNode(g));i&&p.removeChild(i),l.appendChecked||n.grep(ea(q,"input"),ia),r=0;while(g=q[r++])if(d&&n.inArray(g,d)>-1)e&&e.push(g);else if(h=n.contains(g.ownerDocument,g),i=ea(p.appendChild(g),"script"),h&&fa(i),c){f=0;while(g=i[f++])_.test(g.type||"")&&c.push(g)}return i=null,p}!function(){var b,c,e=d.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(l[b]=c in a)||(e.setAttribute(c,"t"),l[b]=e.attributes[c].expando===!1);e=null}();var ka=/^(?:input|select|textarea)$/i,la=/^key/,ma=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,na=/^(?:focusinfocus|focusoutblur)$/,oa=/^([^.]*)(?:\.(.+)|)/;function pa(){return!0}function qa(){return!1}function ra(){try{return d.activeElement}catch(a){}}function sa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)sa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=qa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=n.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return"undefined"==typeof n||a&&n.event.triggered===a.type?void 0:n.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(G)||[""],h=b.length;while(h--)f=oa.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=n.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=n.event.special[o]||{},l=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},i),(m=g[o])||(m=g[o]=[],m.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,l):m.push(l),n.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n.hasData(a)&&n._data(a);if(r&&(k=r.events)){b=(b||"").match(G)||[""],j=b.length;while(j--)if(h=oa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=m.length;while(f--)g=m[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(m.splice(f,1),g.selector&&m.delegateCount--,l.remove&&l.remove.call(a,g));i&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(k)&&(delete r.handle,n._removeData(a,"events"))}},trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(i=m=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!na.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),h=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),l=n.event.special[q]||{},f||!l.trigger||l.trigger.apply(e,c)!==!1)){if(!f&&!l.noBubble&&!n.isWindow(e)){for(j=l.delegateType||q,na.test(j+q)||(i=i.parentNode);i;i=i.parentNode)p.push(i),m=i;m===(e.ownerDocument||d)&&p.push(m.defaultView||m.parentWindow||a)}o=0;while((i=p[o++])&&!b.isPropagationStopped())b.type=o>1?j:l.bindType||q,g=(n._data(i,"events")||{})[b.type]&&n._data(i,"handle"),g&&g.apply(i,c),g=h&&i[h],g&&g.apply&&M(i)&&(b.result=g.apply(i,c),b.result===!1&&b.preventDefault());if(b.type=q,!f&&!b.isDefaultPrevented()&&(!l._default||l._default.apply(p.pop(),c)===!1)&&M(e)&&h&&e[q]&&!n.isWindow(e)){m=e[h],m&&(e[h]=null),n.event.triggered=q;try{e[q]()}catch(s){}n.event.triggered=void 0,m&&(e[h]=m)}return b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(n._data(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())a.rnamespace&&!a.rnamespace.test(g.namespace)||(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[n.expando])return a;var b,c,e,f=a.type,g=a,h=this.fixHooks[f];h||(this.fixHooks[f]=h=ma.test(f)?this.mouseHooks:la.test(f)?this.keyHooks:{}),e=h.props?this.props.concat(h.props):this.props,a=new n.Event(g),b=e.length;while(b--)c=e[b],a[c]=g[c];return a.target||(a.target=g.srcElement||d),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,h.filter?h.filter(a,g):a},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button,h=b.fromElement;return null==a.pageX&&null!=b.clientX&&(e=a.target.ownerDocument||d,f=e.documentElement,c=e.body,a.pageX=b.clientX+(f&&f.scrollLeft||c&&c.scrollLeft||0)-(f&&f.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(f&&f.scrollTop||c&&c.scrollTop||0)-(f&&f.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&h&&(a.relatedTarget=h===a.target?b.toElement:h),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==ra()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===ra()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return n.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b),d.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=d.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)}:function(a,b,c){var d="on"+b;a.detachEvent&&("undefined"==typeof a[d]&&(a[d]=null),a.detachEvent(d,c))},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?pa:qa):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:qa,isPropagationStopped:qa,isImmediatePropagationStopped:qa,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=pa,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=pa,a&&!this.isSimulated&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=pa,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||n.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),l.submit||(n.event.special.submit={setup:function(){return n.nodeName(this,"form")?!1:void n.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=n.nodeName(b,"input")||n.nodeName(b,"button")?n.prop(b,"form"):void 0;c&&!n._data(c,"submit")&&(n.event.add(c,"submit._submit",function(a){a._submitBubble=!0}),n._data(c,"submit",!0))})},postDispatch:function(a){a._submitBubble&&(delete a._submitBubble,this.parentNode&&!a.isTrigger&&n.event.simulate("submit",this.parentNode,a))},teardown:function(){return n.nodeName(this,"form")?!1:void n.event.remove(this,"._submit")}}),l.change||(n.event.special.change={setup:function(){return ka.test(this.nodeName)?("checkbox"!==this.type&&"radio"!==this.type||(n.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._justChanged=!0)}),n.event.add(this,"click._change",function(a){this._justChanged&&!a.isTrigger&&(this._justChanged=!1),n.event.simulate("change",this,a)})),!1):void n.event.add(this,"beforeactivate._change",function(a){var b=a.target;ka.test(b.nodeName)&&!n._data(b,"change")&&(n.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||n.event.simulate("change",this.parentNode,a)}),n._data(b,"change",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return n.event.remove(this,"._change"),!ka.test(this.nodeName)}}),l.focusin||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a))};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=n._data(d,b);e||d.addEventListener(a,c,!0),n._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=n._data(d,b)-1;e?n._data(d,b,e):(d.removeEventListener(a,c,!0),n._removeData(d,b))}}}),n.fn.extend({on:function(a,b,c,d){return sa(this,a,b,c,d)},one:function(a,b,c,d){return sa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=qa),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ta=/ jQuery\d+="(?:null|\d+)"/g,ua=new RegExp("<(?:"+ba+")[\\s/>]","i"),va=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,wa=/<script|<style|<link/i,xa=/checked\s*(?:[^=]|=\s*.checked.)/i,ya=/^true\/(.*)/,za=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,Aa=ca(d),Ba=Aa.appendChild(d.createElement("div"));function Ca(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function Da(a){return a.type=(null!==n.find.attr(a,"type"))+"/"+a.type,a}function Ea(a){var b=ya.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Fa(a,b){if(1===b.nodeType&&n.hasData(a)){var c,d,e,f=n._data(a),g=n._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)n.event.add(b,c,h[c][d])}g.data&&(g.data=n.extend({},g.data))}}function Ga(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!l.noCloneEvent&&b[n.expando]){e=n._data(b);for(d in e.events)n.removeEvent(b,d,e.handle);b.removeAttribute(n.expando)}"script"===c&&b.text!==a.text?(Da(b).text=a.text,Ea(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),l.html5Clone&&a.innerHTML&&!n.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&Z.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}}function Ha(a,b,c,d){b=f.apply([],b);var e,g,h,i,j,k,m=0,o=a.length,p=o-1,q=b[0],r=n.isFunction(q);if(r||o>1&&"string"==typeof q&&!l.checkClone&&xa.test(q))return a.each(function(e){var f=a.eq(e);r&&(b[0]=q.call(this,e,f.html())),Ha(f,b,c,d)});if(o&&(k=ja(b,a[0].ownerDocument,!1,a,d),e=k.firstChild,1===k.childNodes.length&&(k=e),e||d)){for(i=n.map(ea(k,"script"),Da),h=i.length;o>m;m++)g=k,m!==p&&(g=n.clone(g,!0,!0),h&&n.merge(i,ea(g,"script"))),c.call(a[m],g,m);if(h)for(j=i[i.length-1].ownerDocument,n.map(i,Ea),m=0;h>m;m++)g=i[m],_.test(g.type||"")&&!n._data(g,"globalEval")&&n.contains(j,g)&&(g.src?n._evalUrl&&n._evalUrl(g.src):n.globalEval((g.text||g.textContent||g.innerHTML||"").replace(za,"")));k=e=null}return a}function Ia(a,b,c){for(var d,e=b?n.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||n.cleanData(ea(d)),d.parentNode&&(c&&n.contains(d.ownerDocument,d)&&fa(ea(d,"script")),d.parentNode.removeChild(d));return a}n.extend({htmlPrefilter:function(a){return a.replace(va,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h,i=n.contains(a.ownerDocument,a);if(l.html5Clone||n.isXMLDoc(a)||!ua.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(Ba.innerHTML=a.outerHTML,Ba.removeChild(f=Ba.firstChild)),!(l.noCloneEvent&&l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(d=ea(f),h=ea(a),g=0;null!=(e=h[g]);++g)d[g]&&Ga(e,d[g]);if(b)if(c)for(h=h||ea(a),d=d||ea(f),g=0;null!=(e=h[g]);g++)Fa(e,d[g]);else Fa(a,f);return d=ea(f,"script"),d.length>0&&fa(d,!i&&ea(a,"script")),d=h=e=null,f},cleanData:function(a,b){for(var d,e,f,g,h=0,i=n.expando,j=n.cache,k=l.attributes,m=n.event.special;null!=(d=a[h]);h++)if((b||M(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)m[e]?n.event.remove(d,e):n.removeEvent(d,e,g.handle);j[f]&&(delete j[f],k||"undefined"==typeof d.removeAttribute?d[i]=void 0:d.removeAttribute(i),c.push(f))}}}),n.fn.extend({domManip:Ha,detach:function(a){return Ia(this,a,!0)},remove:function(a){return Ia(this,a)},text:function(a){return Y(this,function(a){return void 0===a?n.text(this):this.empty().append((this[0]&&this[0].ownerDocument||d).createTextNode(a))},null,a,arguments.length)},append:function(){return Ha(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ca(this,a);b.appendChild(a)}})},prepend:function(){return Ha(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ca(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ha(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ha(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&n.cleanData(ea(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&n.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return Y(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(ta,""):void 0;if("string"==typeof a&&!wa.test(a)&&(l.htmlSerialize||!ua.test(a))&&(l.leadingWhitespace||!aa.test(a))&&!da[($.exec(a)||["",""])[1].toLowerCase()]){a=n.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(ea(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ha(this,arguments,function(b){var c=this.parentNode;n.inArray(this,a)<0&&(n.cleanData(ea(this)),c&&c.replaceChild(b,this))},a)}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=0,e=[],f=n(a),h=f.length-1;h>=d;d++)c=d===h?this:this.clone(!0),n(f[d])[b](c),g.apply(e,c.get());return this.pushStack(e)}});var Ja,Ka={HTML:"block",BODY:"block"};function La(a,b){var c=n(b.createElement(a)).appendTo(b.body),d=n.css(c[0],"display");return c.detach(),d}function Ma(a){var b=d,c=Ka[a];return c||(c=La(a,b),"none"!==c&&c||(Ja=(Ja||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Ja[0].contentWindow||Ja[0].contentDocument).document,b.write(),b.close(),c=La(a,b),Ja.detach()),Ka[a]=c),c}var Na=/^margin/,Oa=new RegExp("^("+T+")(?!px)[a-z%]+$","i"),Pa=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e},Qa=d.documentElement;!function(){var b,c,e,f,g,h,i=d.createElement("div"),j=d.createElement("div");if(j.style){j.style.cssText="float:left;opacity:.5",l.opacity="0.5"===j.style.opacity,l.cssFloat=!!j.style.cssFloat,j.style.backgroundClip="content-box",j.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===j.style.backgroundClip,i=d.createElement("div"),i.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",j.innerHTML="",i.appendChild(j),l.boxSizing=""===j.style.boxSizing||""===j.style.MozBoxSizing||""===j.style.WebkitBoxSizing,n.extend(l,{reliableHiddenOffsets:function(){return null==b&&k(),f},boxSizingReliable:function(){return null==b&&k(),e},pixelMarginRight:function(){return null==b&&k(),c},pixelPosition:function(){return null==b&&k(),b},reliableMarginRight:function(){return null==b&&k(),g},reliableMarginLeft:function(){return null==b&&k(),h}});function k(){var k,l,m=d.documentElement;m.appendChild(i),j.style.cssText="-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",b=e=h=!1,c=g=!0,a.getComputedStyle&&(l=a.getComputedStyle(j),b="1%"!==(l||{}).top,h="2px"===(l||{}).marginLeft,e="4px"===(l||{width:"4px"}).width,j.style.marginRight="50%",c="4px"===(l||{marginRight:"4px"}).marginRight,k=j.appendChild(d.createElement("div")),k.style.cssText=j.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",k.style.marginRight=k.style.width="0",j.style.width="1px",g=!parseFloat((a.getComputedStyle(k)||{}).marginRight),j.removeChild(k)),j.style.display="none",f=0===j.getClientRects().length,f&&(j.style.display="",j.innerHTML="<table><tr><td></td><td>t</td></tr></table>",j.childNodes[0].style.borderCollapse="separate",k=j.getElementsByTagName("td"),k[0].style.cssText="margin:0;border:0;padding:0;display:none",f=0===k[0].offsetHeight,f&&(k[0].style.display="",k[1].style.display="none",f=0===k[0].offsetHeight)),m.removeChild(i)}}}();var Ra,Sa,Ta=/^(top|right|bottom|left)$/;a.getComputedStyle?(Ra=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)},Sa=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ra(a),g=c?c.getPropertyValue(b)||c[b]:void 0,""!==g&&void 0!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),c&&!l.pixelMarginRight()&&Oa.test(g)&&Na.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f),void 0===g?g:g+""}):Qa.currentStyle&&(Ra=function(a){return a.currentStyle},Sa=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ra(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Oa.test(g)&&!Ta.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function Ua(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Va=/alpha\([^)]*\)/i,Wa=/opacity\s*=\s*([^)]*)/i,Xa=/^(none|table(?!-c[ea]).+)/,Ya=new RegExp("^("+T+")(.*)$","i"),Za={position:"absolute",visibility:"hidden",display:"block"},$a={letterSpacing:"0",fontWeight:"400"},_a=["Webkit","O","Moz","ms"],ab=d.createElement("div").style;function bb(a){if(a in ab)return a;var b=a.charAt(0).toUpperCase()+a.slice(1),c=_a.length;while(c--)if(a=_a[c]+b,a in ab)return a}function cb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=n._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&W(d)&&(f[g]=n._data(d,"olddisplay",Ma(d.nodeName)))):(e=W(d),(c&&"none"!==c||!e)&&n._data(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function db(a,b,c){var d=Ya.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function eb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+V[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+V[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+V[f]+"Width",!0,e))):(g+=n.css(a,"padding"+V[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+V[f]+"Width",!0,e)));return g}function fb(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ra(a),g=l.boxSizing&&"border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Sa(a,b,f),(0>e||null==e)&&(e=a.style[b]),Oa.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+eb(a,b,c||(g?"border":"content"),d,f)+"px"}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Sa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":l.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;if(b=n.cssProps[h]||(n.cssProps[h]=bb(h)||h),g=n.cssHooks[b]||n.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=U.exec(c))&&e[1]&&(c=X(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(n.cssNumber[h]?"":"px")),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=bb(h)||h),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Sa(a,b,d)),"normal"===f&&b in $a&&(f=$a[b]),""===c||c?(e=parseFloat(f),c===!0||isFinite(e)?e||0:f):f}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?Xa.test(n.css(a,"display"))&&0===a.offsetWidth?Pa(a,Za,function(){return fb(a,b,d)}):fb(a,b,d):void 0},set:function(a,c,d){var e=d&&Ra(a);return db(a,c,d?eb(a,b,d,l.boxSizing&&"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),l.opacity||(n.cssHooks.opacity={get:function(a,b){return Wa.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=n.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===n.trim(f.replace(Va,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Va.test(f)?f.replace(Va,e):f+" "+e)}}),n.cssHooks.marginRight=Ua(l.reliableMarginRight,function(a,b){return b?Pa(a,{display:"inline-block"},Sa,[a,"marginRight"]):void 0}),n.cssHooks.marginLeft=Ua(l.reliableMarginLeft,function(a,b){return b?(parseFloat(Sa(a,"marginLeft"))||(n.contains(a.ownerDocument,a)?a.getBoundingClientRect().left-Pa(a,{
marginLeft:0},function(){return a.getBoundingClientRect().left}):0))+"px":void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+V[d]+b]=f[d]||f[d-2]||f[0];return e}},Na.test(a)||(n.cssHooks[a+b].set=db)}),n.fn.extend({css:function(a,b){return Y(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Ra(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return cb(this,!0)},hide:function(){return cb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){W(this)?n(this).show():n(this).hide()})}});function gb(a,b,c,d,e){return new gb.prototype.init(a,b,c,d,e)}n.Tween=gb,gb.prototype={constructor:gb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||n.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=gb.propHooks[this.prop];return a&&a.get?a.get(this):gb.propHooks._default.get(this)},run:function(a){var b,c=gb.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):gb.propHooks._default.set(this),this}},gb.prototype.init.prototype=gb.prototype,gb.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[n.cssProps[a.prop]]&&!n.cssHooks[a.prop]?a.elem[a.prop]=a.now:n.style(a.elem,a.prop,a.now+a.unit)}}},gb.propHooks.scrollTop=gb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},n.fx=gb.prototype.init,n.fx.step={};var hb,ib,jb=/^(?:toggle|show|hide)$/,kb=/queueHooks$/;function lb(){return a.setTimeout(function(){hb=void 0}),hb=n.now()}function mb(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=V[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function nb(a,b,c){for(var d,e=(qb.tweeners[b]||[]).concat(qb.tweeners["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function ob(a,b,c){var d,e,f,g,h,i,j,k,m=this,o={},p=a.style,q=a.nodeType&&W(a),r=n._data(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,m.always(function(){m.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=n.css(a,"display"),k="none"===j?n._data(a,"olddisplay")||Ma(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(l.inlineBlockNeedsLayout&&"inline"!==Ma(a.nodeName)?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",l.shrinkWrapBlocks()||m.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],jb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(o))"inline"===("none"===j?Ma(a.nodeName):j)&&(p.display=j);else{r?"hidden"in r&&(q=r.hidden):r=n._data(a,"fxshow",{}),f&&(r.hidden=!q),q?n(a).show():m.done(function(){n(a).hide()}),m.done(function(){var b;n._removeData(a,"fxshow");for(b in o)n.style(a,b,o[b])});for(d in o)g=nb(q?r[d]:0,d,m),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function pb(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function qb(a,b,c){var d,e,f=0,g=qb.prefilters.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=hb||lb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{},easing:n.easing._default},c),originalProperties:b,originalOptions:c,startTime:hb||lb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(pb(k,j.opts.specialEasing);g>f;f++)if(d=qb.prefilters[f].call(j,a,k,j.opts))return n.isFunction(d.stop)&&(n._queueHooks(j.elem,j.opts.queue).stop=n.proxy(d.stop,d)),d;return n.map(k,nb,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(qb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return X(c.elem,a,U.exec(b),c),c}]},tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.match(G);for(var c,d=0,e=a.length;e>d;d++)c=a[d],qb.tweeners[c]=qb.tweeners[c]||[],qb.tweeners[c].unshift(b)},prefilters:[ob],prefilter:function(a,b){b?qb.prefilters.unshift(a):qb.prefilters.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(W).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=qb(this,n.extend({},a),f);(e||n._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=n._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&kb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=n._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(mb(b,!0),a,d,e)}}),n.each({slideDown:mb("show"),slideUp:mb("hide"),slideToggle:mb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=n.timers,c=0;for(hb=n.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||n.fx.stop(),hb=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){ib||(ib=a.setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){a.clearInterval(ib),ib=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(b,c){return b=n.fx?n.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a,b=d.createElement("input"),c=d.createElement("div"),e=d.createElement("select"),f=e.appendChild(d.createElement("option"));c=d.createElement("div"),c.setAttribute("className","t"),c.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=c.getElementsByTagName("a")[0],b.setAttribute("type","checkbox"),c.appendChild(b),a=c.getElementsByTagName("a")[0],a.style.cssText="top:1px",l.getSetAttribute="t"!==c.className,l.style=/top/.test(a.getAttribute("style")),l.hrefNormalized="/a"===a.getAttribute("href"),l.checkOn=!!b.value,l.optSelected=f.selected,l.enctype=!!d.createElement("form").enctype,e.disabled=!0,l.optDisabled=!f.disabled,b=d.createElement("input"),b.setAttribute("value",""),l.input=""===b.getAttribute("value"),b.value="t",b.setAttribute("type","radio"),l.radioValue="t"===b.value}();var rb=/\r/g,sb=/[\x20\t\r\n\f]+/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a)).replace(sb," ")}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&(l.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)if(d=e[g],n.inArray(n.valHooks.option.get(d),f)>-1)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>-1:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var tb,ub,vb=n.expr.attrHandle,wb=/^(?:checked|selected)$/i,xb=l.getSetAttribute,yb=l.input;n.fn.extend({attr:function(a,b){return Y(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),e=n.attrHooks[b]||(n.expr.match.bool.test(b)?ub:tb)),void 0!==c?null===c?void n.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=n.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(G);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)?yb&&xb||!wb.test(c)?a[d]=!1:a[n.camelCase("default-"+c)]=a[d]=!1:n.attr(a,c,""),a.removeAttribute(xb?c:d)}}),ub={set:function(a,b,c){return b===!1?n.removeAttr(a,c):yb&&xb||!wb.test(c)?a.setAttribute(!xb&&n.propFix[c]||c,c):a[n.camelCase("default-"+c)]=a[c]=!0,c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=vb[b]||n.find.attr;yb&&xb||!wb.test(b)?vb[b]=function(a,b,d){var e,f;return d||(f=vb[b],vb[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,vb[b]=f),e}:vb[b]=function(a,b,c){return c?void 0:a[n.camelCase("default-"+b)]?b.toLowerCase():null}}),yb&&xb||(n.attrHooks.value={set:function(a,b,c){return n.nodeName(a,"input")?void(a.defaultValue=b):tb&&tb.set(a,b,c)}}),xb||(tb={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},vb.id=vb.name=vb.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},n.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:tb.set},n.attrHooks.contenteditable={set:function(a,b,c){tb.set(a,""===b?!1:b,c)}},n.each(["width","height"],function(a,b){n.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),l.style||(n.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var zb=/^(?:input|select|textarea|button|object)$/i,Ab=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return Y(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return a=n.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),n.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&n.isXMLDoc(a)||(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):zb.test(a.nodeName)||Ab.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),l.hrefNormalized||n.each(["href","src"],function(a,b){n.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this}),l.enctype||(n.propFix.enctype="encoding");var Bb=/[\t\r\n\f]/g;function Cb(a){return n.attr(a,"class")||""}n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,Cb(this)))});if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=Cb(c),d=1===c.nodeType&&(" "+e+" ").replace(Bb," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=n.trim(d),e!==h&&n.attr(c,"class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,Cb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=Cb(c),d=1===c.nodeType&&(" "+e+" ").replace(Bb," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=n.trim(d),e!==h&&n.attr(c,"class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):n.isFunction(a)?this.each(function(c){n(this).toggleClass(a.call(this,c,Cb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=n(this),f=a.match(G)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=Cb(this),b&&n._data(this,"__className__",b),n.attr(this,"class",b||a===!1?"":n._data(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+Cb(c)+" ").replace(Bb," ").indexOf(b)>-1)return!0;return!1}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var Db=a.location,Eb=n.now(),Fb=/\?/,Gb=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;n.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=n.trim(b+"");return e&&!n.trim(e.replace(Gb,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():n.error("Invalid JSON: "+b)},n.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new a.DOMParser,c=d.parseFromString(b,"text/xml")):(c=new a.ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var Hb=/#.*$/,Ib=/([?&])_=[^&]*/,Jb=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Kb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Lb=/^(?:GET|HEAD)$/,Mb=/^\/\//,Nb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Ob={},Pb={},Qb="*/".concat("*"),Rb=Db.href,Sb=Nb.exec(Rb.toLowerCase())||[];function Tb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(G)||[];if(n.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Ub(a,b,c,d){var e={},f=a===Pb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Vb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&n.extend(!0,a,c),a}function Wb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Xb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Rb,type:"GET",isLocal:Kb.test(Sb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Qb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Vb(Vb(a,n.ajaxSettings),b):Vb(n.ajaxSettings,a)},ajaxPrefilter:Tb(Ob),ajaxTransport:Tb(Pb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var d,e,f,g,h,i,j,k,l=n.ajaxSetup({},c),m=l.context||l,o=l.context&&(m.nodeType||m.jquery)?n(m):n.event,p=n.Deferred(),q=n.Callbacks("once memory"),r=l.statusCode||{},s={},t={},u=0,v="canceled",w={readyState:0,getResponseHeader:function(a){var b;if(2===u){if(!k){k={};while(b=Jb.exec(g))k[b[1].toLowerCase()]=b[2]}b=k[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===u?g:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return u||(a=t[c]=t[c]||a,s[a]=b),this},overrideMimeType:function(a){return u||(l.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>u)for(b in a)r[b]=[r[b],a[b]];else w.always(a[w.status]);return this},abort:function(a){var b=a||v;return j&&j.abort(b),y(0,b),this}};if(p.promise(w).complete=q.add,w.success=w.done,w.error=w.fail,l.url=((b||l.url||Rb)+"").replace(Hb,"").replace(Mb,Sb[1]+"//"),l.type=c.method||c.type||l.method||l.type,l.dataTypes=n.trim(l.dataType||"*").toLowerCase().match(G)||[""],null==l.crossDomain&&(d=Nb.exec(l.url.toLowerCase()),l.crossDomain=!(!d||d[1]===Sb[1]&&d[2]===Sb[2]&&(d[3]||("http:"===d[1]?"80":"443"))===(Sb[3]||("http:"===Sb[1]?"80":"443")))),l.data&&l.processData&&"string"!=typeof l.data&&(l.data=n.param(l.data,l.traditional)),Ub(Ob,l,c,w),2===u)return w;i=n.event&&l.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),l.type=l.type.toUpperCase(),l.hasContent=!Lb.test(l.type),f=l.url,l.hasContent||(l.data&&(f=l.url+=(Fb.test(f)?"&":"?")+l.data,delete l.data),l.cache===!1&&(l.url=Ib.test(f)?f.replace(Ib,"$1_="+Eb++):f+(Fb.test(f)?"&":"?")+"_="+Eb++)),l.ifModified&&(n.lastModified[f]&&w.setRequestHeader("If-Modified-Since",n.lastModified[f]),n.etag[f]&&w.setRequestHeader("If-None-Match",n.etag[f])),(l.data&&l.hasContent&&l.contentType!==!1||c.contentType)&&w.setRequestHeader("Content-Type",l.contentType),w.setRequestHeader("Accept",l.dataTypes[0]&&l.accepts[l.dataTypes[0]]?l.accepts[l.dataTypes[0]]+("*"!==l.dataTypes[0]?", "+Qb+"; q=0.01":""):l.accepts["*"]);for(e in l.headers)w.setRequestHeader(e,l.headers[e]);if(l.beforeSend&&(l.beforeSend.call(m,w,l)===!1||2===u))return w.abort();v="abort";for(e in{success:1,error:1,complete:1})w[e](l[e]);if(j=Ub(Pb,l,c,w)){if(w.readyState=1,i&&o.trigger("ajaxSend",[w,l]),2===u)return w;l.async&&l.timeout>0&&(h=a.setTimeout(function(){w.abort("timeout")},l.timeout));try{u=1,j.send(s,y)}catch(x){if(!(2>u))throw x;y(-1,x)}}else y(-1,"No Transport");function y(b,c,d,e){var k,s,t,v,x,y=c;2!==u&&(u=2,h&&a.clearTimeout(h),j=void 0,g=e||"",w.readyState=b>0?4:0,k=b>=200&&300>b||304===b,d&&(v=Wb(l,w,d)),v=Xb(l,v,w,k),k?(l.ifModified&&(x=w.getResponseHeader("Last-Modified"),x&&(n.lastModified[f]=x),x=w.getResponseHeader("etag"),x&&(n.etag[f]=x)),204===b||"HEAD"===l.type?y="nocontent":304===b?y="notmodified":(y=v.state,s=v.data,t=v.error,k=!t)):(t=y,!b&&y||(y="error",0>b&&(b=0))),w.status=b,w.statusText=(c||y)+"",k?p.resolveWith(m,[s,y,w]):p.rejectWith(m,[w,y,t]),w.statusCode(r),r=void 0,i&&o.trigger(k?"ajaxSuccess":"ajaxError",[w,l,k?s:t]),q.fireWith(m,[w,y]),i&&(o.trigger("ajaxComplete",[w,l]),--n.active||n.event.trigger("ajaxStop")))}return w},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax(n.extend({url:a,type:b,dataType:e,data:c,success:d},n.isPlainObject(a)&&a))}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){if(n.isFunction(a))return this.each(function(b){n(this).wrapAll(a.call(this,b))});if(this[0]){var b=n(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return n.isFunction(a)?this.each(function(b){n(this).wrapInner(a.call(this,b))}):this.each(function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}});function Yb(a){return a.style&&a.style.display||n.css(a,"display")}function Zb(a){if(!n.contains(a.ownerDocument||d,a))return!0;while(a&&1===a.nodeType){if("none"===Yb(a)||"hidden"===a.type)return!0;a=a.parentNode}return!1}n.expr.filters.hidden=function(a){return l.reliableHiddenOffsets()?a.offsetWidth<=0&&a.offsetHeight<=0&&!a.getClientRects().length:Zb(a)},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var $b=/%20/g,_b=/\[\]$/,ac=/\r?\n/g,bc=/^(?:submit|button|image|reset|file)$/i,cc=/^(?:input|select|textarea|keygen)/i;function dc(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||_b.test(a)?d(a,e):dc(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)dc(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)dc(c,a[c],b,e);return d.join("&").replace($b,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&cc.test(this.nodeName)&&!bc.test(a)&&(this.checked||!Z.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(ac,"\r\n")}}):{name:b.name,value:c.replace(ac,"\r\n")}}).get()}}),n.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return this.isLocal?ic():d.documentMode>8?hc():/^(get|post|head|put|delete|options)$/i.test(this.type)&&hc()||ic()}:hc;var ec=0,fc={},gc=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in fc)fc[a](void 0,!0)}),l.cors=!!gc&&"withCredentials"in gc,gc=l.ajax=!!gc,gc&&n.ajaxTransport(function(b){if(!b.crossDomain||l.cors){var c;return{send:function(d,e){var f,g=b.xhr(),h=++ec;if(g.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(f in b.xhrFields)g[f]=b.xhrFields[f];b.mimeType&&g.overrideMimeType&&g.overrideMimeType(b.mimeType),b.crossDomain||d["X-Requested-With"]||(d["X-Requested-With"]="XMLHttpRequest");for(f in d)void 0!==d[f]&&g.setRequestHeader(f,d[f]+"");g.send(b.hasContent&&b.data||null),c=function(a,d){var f,i,j;if(c&&(d||4===g.readyState))if(delete fc[h],c=void 0,g.onreadystatechange=n.noop,d)4!==g.readyState&&g.abort();else{j={},f=g.status,"string"==typeof g.responseText&&(j.text=g.responseText);try{i=g.statusText}catch(k){i=""}f||!b.isLocal||b.crossDomain?1223===f&&(f=204):f=j.text?200:404}j&&e(f,i,j,g.getAllResponseHeaders())},b.async?4===g.readyState?a.setTimeout(c):g.onreadystatechange=fc[h]=c:c()},abort:function(){c&&c(void 0,!0)}}}});function hc(){try{return new a.XMLHttpRequest}catch(b){}}function ic(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=d.head||n("head")[0]||d.documentElement;return{send:function(e,f){b=d.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||f(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var jc=[],kc=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=jc.pop()||n.expando+"_"+Eb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(kc.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&kc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(kc,"$1"+e):b.jsonp!==!1&&(b.url+=(Fb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?n(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,jc.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||d;var e=x.exec(a),f=!c&&[];return e?[b.createElement(e[1])]:(e=ja([a],b,f),f&&f.length&&n(f).remove(),n.merge([],e.childNodes))};var lc=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&lc)return lc.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=n.trim(a.slice(h,a.length)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};function mc(a){return n.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&n.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,n.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,n.contains(b,e)?("undefined"!=typeof e.getBoundingClientRect&&(d=e.getBoundingClientRect()),c=mc(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===n.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(c=a.offset()),c.top+=n.css(a[0],"borderTopWidth",!0),c.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-n.css(d,"marginTop",!0),left:b.left-c.left-n.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Qa})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);n.fn[a]=function(d){return Y(this,function(a,d,e){var f=mc(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?n(f).scrollLeft():e,c?e:n(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Ua(l.pixelPosition,function(a,c){return c?(c=Sa(a,b),Oa.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({
padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return Y(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var nc=a.jQuery,oc=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=oc),b&&a.jQuery===n&&(a.jQuery=nc),n},b||(a.jQuery=a.$=n),n});
jQuery.noConflict();
;
/*!
 * jQuery Migrate - v1.4.1 - 2016-05-19
 * Copyright jQuery Foundation and other contributors
 */
(function( jQuery, window, undefined ) {
// See http://bugs.jquery.com/ticket/13335
// "use strict";


jQuery.migrateVersion = "1.4.1";


var warnedAbout = {};

// List of warnings already given; public read only
jQuery.migrateWarnings = [];

// Set to true to prevent console output; migrateWarnings still maintained
// jQuery.migrateMute = false;

// Show a message on the console so devs know we're active
if ( window.console && window.console.log ) {
	window.console.log( "JQMIGRATE: Migrate is installed" +
		( jQuery.migrateMute ? "" : " with logging active" ) +
		", version " + jQuery.migrateVersion );
}

// Set to false to disable traces that appear with warnings
if ( jQuery.migrateTrace === undefined ) {
	jQuery.migrateTrace = true;
}

// Forget any warnings we've already given; public
jQuery.migrateReset = function() {
	warnedAbout = {};
	jQuery.migrateWarnings.length = 0;
};

function migrateWarn( msg) {
	var console = window.console;
	if ( !warnedAbout[ msg ] ) {
		warnedAbout[ msg ] = true;
		jQuery.migrateWarnings.push( msg );
		if ( console && console.warn && !jQuery.migrateMute ) {
			console.warn( "JQMIGRATE: " + msg );
			if ( jQuery.migrateTrace && console.trace ) {
				console.trace();
			}
		}
	}
}

function migrateWarnProp( obj, prop, value, msg ) {
	if ( Object.defineProperty ) {
		// On ES5 browsers (non-oldIE), warn if the code tries to get prop;
		// allow property to be overwritten in case some other plugin wants it
		try {
			Object.defineProperty( obj, prop, {
				configurable: true,
				enumerable: true,
				get: function() {
					migrateWarn( msg );
					return value;
				},
				set: function( newValue ) {
					migrateWarn( msg );
					value = newValue;
				}
			});
			return;
		} catch( err ) {
			// IE8 is a dope about Object.defineProperty, can't warn there
		}
	}

	// Non-ES5 (or broken) browser; just set the property
	jQuery._definePropertyBroken = true;
	obj[ prop ] = value;
}

if ( document.compatMode === "BackCompat" ) {
	// jQuery has never supported or tested Quirks Mode
	migrateWarn( "jQuery is not compatible with Quirks Mode" );
}


var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
	oldAttr = jQuery.attr,
	valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
		function() { return null; },
	valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
		function() { return undefined; },
	rnoType = /^(?:input|button)$/i,
	rnoAttrNodeType = /^[238]$/,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	ruseDefault = /^(?:checked|selected)$/i;

// jQuery.attrFn
migrateWarnProp( jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated" );

jQuery.attr = function( elem, name, value, pass ) {
	var lowerName = name.toLowerCase(),
		nType = elem && elem.nodeType;

	if ( pass ) {
		// Since pass is used internally, we only warn for new jQuery
		// versions where there isn't a pass arg in the formal params
		if ( oldAttr.length < 4 ) {
			migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
		}
		if ( elem && !rnoAttrNodeType.test( nType ) &&
			(attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
			return jQuery( elem )[ name ]( value );
		}
	}

	// Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
	// for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
	if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
		migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
	}

	// Restore boolHook for boolean property/attribute synchronization
	if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
		jQuery.attrHooks[ lowerName ] = {
			get: function( elem, name ) {
				// Align boolean attributes with corresponding properties
				// Fall back to attribute presence where some booleans are not supported
				var attrNode,
					property = jQuery.prop( elem, name );
				return property === true || typeof property !== "boolean" &&
					( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

					name.toLowerCase() :
					undefined;
			},
			set: function( elem, value, name ) {
				var propName;
				if ( value === false ) {
					// Remove boolean attributes when set to false
					jQuery.removeAttr( elem, name );
				} else {
					// value is true since we know at this point it's type boolean and not false
					// Set boolean attributes to the same name and set the DOM property
					propName = jQuery.propFix[ name ] || name;
					if ( propName in elem ) {
						// Only set the IDL specifically if it already exists on the element
						elem[ propName ] = true;
					}

					elem.setAttribute( name, name.toLowerCase() );
				}
				return name;
			}
		};

		// Warn only for attributes that can remain distinct from their properties post-1.9
		if ( ruseDefault.test( lowerName ) ) {
			migrateWarn( "jQuery.fn.attr('" + lowerName + "') might use property instead of attribute" );
		}
	}

	return oldAttr.call( jQuery, elem, name, value );
};

// attrHooks: value
jQuery.attrHooks.value = {
	get: function( elem, name ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrGet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value') no longer gets properties");
		}
		return name in elem ?
			elem.value :
			null;
	},
	set: function( elem, value ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrSet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
		}
		// Does not return so that setAttribute is also used
		elem.value = value;
	}
};


var matched, browser,
	oldInit = jQuery.fn.init,
	oldFind = jQuery.find,
	oldParseJSON = jQuery.parseJSON,
	rspaceAngle = /^\s*</,
	rattrHashTest = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/,
	rattrHashGlob = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g,
	// Note: XSS check is done below after string is trimmed
	rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;

// $(html) "looks like html" rule change
jQuery.fn.init = function( selector, context, rootjQuery ) {
	var match, ret;

	if ( selector && typeof selector === "string" ) {
		if ( !jQuery.isPlainObject( context ) &&
				(match = rquickExpr.exec( jQuery.trim( selector ) )) && match[ 0 ] ) {

			// This is an HTML string according to the "old" rules; is it still?
			if ( !rspaceAngle.test( selector ) ) {
				migrateWarn("$(html) HTML strings must start with '<' character");
			}
			if ( match[ 3 ] ) {
				migrateWarn("$(html) HTML text after last tag is ignored");
			}

			// Consistently reject any HTML-like string starting with a hash (gh-9521)
			// Note that this may break jQuery 1.6.x code that otherwise would work.
			if ( match[ 0 ].charAt( 0 ) === "#" ) {
				migrateWarn("HTML string cannot start with a '#' character");
				jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
			}

			// Now process using loose rules; let pre-1.8 play too
			// Is this a jQuery context? parseHTML expects a DOM element (#178)
			if ( context && context.context && context.context.nodeType ) {
				context = context.context;
			}

			if ( jQuery.parseHTML ) {
				return oldInit.call( this,
						jQuery.parseHTML( match[ 2 ], context && context.ownerDocument ||
							context || document, true ), context, rootjQuery );
			}
		}
	}

	ret = oldInit.apply( this, arguments );

	// Fill in selector and context properties so .live() works
	if ( selector && selector.selector !== undefined ) {
		// A jQuery object, copy its properties
		ret.selector = selector.selector;
		ret.context = selector.context;

	} else {
		ret.selector = typeof selector === "string" ? selector : "";
		if ( selector ) {
			ret.context = selector.nodeType? selector : context || document;
		}
	}

	return ret;
};
jQuery.fn.init.prototype = jQuery.fn;

jQuery.find = function( selector ) {
	var args = Array.prototype.slice.call( arguments );

	// Support: PhantomJS 1.x
	// String#match fails to match when used with a //g RegExp, only on some strings
	if ( typeof selector === "string" && rattrHashTest.test( selector ) ) {

		// The nonstandard and undocumented unquoted-hash was removed in jQuery 1.12.0
		// First see if qS thinks it's a valid selector, if so avoid a false positive
		try {
			document.querySelector( selector );
		} catch ( err1 ) {

			// Didn't *look* valid to qSA, warn and try quoting what we think is the value
			selector = selector.replace( rattrHashGlob, function( _, attr, op, value ) {
				return "[" + attr + op + "\"" + value + "\"]";
			} );

			// If the regexp *may* have created an invalid selector, don't update it
			// Note that there may be false alarms if selector uses jQuery extensions
			try {
				document.querySelector( selector );
				migrateWarn( "Attribute selector with '#' must be quoted: " + args[ 0 ] );
				args[ 0 ] = selector;
			} catch ( err2 ) {
				migrateWarn( "Attribute selector with '#' was not fixed: " + args[ 0 ] );
			}
		}
	}

	return oldFind.apply( this, args );
};

// Copy properties attached to original jQuery.find method (e.g. .attr, .isXML)
var findProp;
for ( findProp in oldFind ) {
	if ( Object.prototype.hasOwnProperty.call( oldFind, findProp ) ) {
		jQuery.find[ findProp ] = oldFind[ findProp ];
	}
}

// Let $.parseJSON(falsy_value) return null
jQuery.parseJSON = function( json ) {
	if ( !json ) {
		migrateWarn("jQuery.parseJSON requires a valid JSON string");
		return null;
	}
	return oldParseJSON.apply( this, arguments );
};

jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

// Don't clobber any existing jQuery.browser in case it's different
if ( !jQuery.browser ) {
	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;
}

// Warn if the code tries to get jQuery.browser
migrateWarnProp( jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated" );

// jQuery.boxModel deprecated in 1.3, jQuery.support.boxModel deprecated in 1.7
jQuery.boxModel = jQuery.support.boxModel = (document.compatMode === "CSS1Compat");
migrateWarnProp( jQuery, "boxModel", jQuery.boxModel, "jQuery.boxModel is deprecated" );
migrateWarnProp( jQuery.support, "boxModel", jQuery.support.boxModel, "jQuery.support.boxModel is deprecated" );

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		var instance = jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		return instance instanceof jQuerySub ?
			instance :
			jQuerySub( instance );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	migrateWarn( "jQuery.sub() is deprecated" );
	return jQuerySub;
};

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	migrateWarn( "jQuery.fn.size() is deprecated; use the .length property" );
	return this.length;
};


var internalSwapCall = false;

// If this version of jQuery has .swap(), don't false-alarm on internal uses
if ( jQuery.swap ) {
	jQuery.each( [ "height", "width", "reliableMarginRight" ], function( _, name ) {
		var oldHook = jQuery.cssHooks[ name ] && jQuery.cssHooks[ name ].get;

		if ( oldHook ) {
			jQuery.cssHooks[ name ].get = function() {
				var ret;

				internalSwapCall = true;
				ret = oldHook.apply( this, arguments );
				internalSwapCall = false;
				return ret;
			};
		}
	});
}

jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	if ( !internalSwapCall ) {
		migrateWarn( "jQuery.swap() is undocumented and deprecated" );
	}

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


// Ensure that $.ajax gets the new parseJSON defined in core.js
jQuery.ajaxSetup({
	converters: {
		"text json": jQuery.parseJSON
	}
});


var oldFnData = jQuery.fn.data;

jQuery.fn.data = function( name ) {
	var ret, evt,
		elem = this[0];

	// Handles 1.7 which has this behavior and 1.8 which doesn't
	if ( elem && name === "events" && arguments.length === 1 ) {
		ret = jQuery.data( elem, name );
		evt = jQuery._data( elem, name );
		if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {
			migrateWarn("Use of jQuery.fn.data('events') is deprecated");
			return evt;
		}
	}
	return oldFnData.apply( this, arguments );
};


var rscriptType = /\/(java|ecma)script/i;

// Since jQuery.clean is used internally on older versions, we only shim if it's missing
if ( !jQuery.clean ) {
	jQuery.clean = function( elems, context, fragment, scripts ) {
		// Set context per 1.8 logic
		context = context || document;
		context = !context.nodeType && context[0] || context;
		context = context.ownerDocument || context;

		migrateWarn("jQuery.clean() is deprecated");

		var i, elem, handleScript, jsTags,
			ret = [];

		jQuery.merge( ret, jQuery.buildFragment( elems, context ).childNodes );

		// Complex logic lifted directly from jQuery 1.8
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	};
}

var eventAdd = jQuery.event.add,
	eventRemove = jQuery.event.remove,
	eventTrigger = jQuery.event.trigger,
	oldToggle = jQuery.fn.toggle,
	oldLive = jQuery.fn.live,
	oldDie = jQuery.fn.die,
	oldLoad = jQuery.fn.load,
	ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
	rajaxEvent = new RegExp( "\\b(?:" + ajaxEvents + ")\\b" ),
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	hoverHack = function( events ) {
		if ( typeof( events ) !== "string" || jQuery.event.special.hover ) {
			return events;
		}
		if ( rhoverHack.test( events ) ) {
			migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
		}
		return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

// Event props removed in 1.9, put them back if needed; no practical way to warn them
if ( jQuery.event.props && jQuery.event.props[ 0 ] !== "attrChange" ) {
	jQuery.event.props.unshift( "attrChange", "attrName", "relatedNode", "srcElement" );
}

// Undocumented jQuery.event.handle was "deprecated" in jQuery 1.7
if ( jQuery.event.dispatch ) {
	migrateWarnProp( jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated" );
}

// Support for 'hover' pseudo-event and ajax event warnings
jQuery.event.add = function( elem, types, handler, data, selector ){
	if ( elem !== document && rajaxEvent.test( types ) ) {
		migrateWarn( "AJAX events should be attached to document: " + types );
	}
	eventAdd.call( this, elem, hoverHack( types || "" ), handler, data, selector );
};
jQuery.event.remove = function( elem, types, handler, selector, mappedTypes ){
	eventRemove.call( this, elem, hoverHack( types ) || "", handler, selector, mappedTypes );
};

jQuery.each( [ "load", "unload", "error" ], function( _, name ) {

	jQuery.fn[ name ] = function() {
		var args = Array.prototype.slice.call( arguments, 0 );

		// If this is an ajax load() the first arg should be the string URL;
		// technically this could also be the "Anything" arg of the event .load()
		// which just goes to show why this dumb signature has been deprecated!
		// jQuery custom builds that exclude the Ajax module justifiably die here.
		if ( name === "load" && typeof args[ 0 ] === "string" ) {
			return oldLoad.apply( this, args );
		}

		migrateWarn( "jQuery.fn." + name + "() is deprecated" );

		args.splice( 0, 0, name );
		if ( arguments.length ) {
			return this.bind.apply( this, args );
		}

		// Use .triggerHandler here because:
		// - load and unload events don't need to bubble, only applied to window or image
		// - error event should not bubble to window, although it does pre-1.7
		// See http://bugs.jquery.com/ticket/11820
		this.triggerHandler.apply( this, args );
		return this;
	};

});

jQuery.fn.toggle = function( fn, fn2 ) {

	// Don't mess with animation or css toggles
	if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
		return oldToggle.apply( this, arguments );
	}
	migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");

	// Save reference to arguments for access in closure
	var args = arguments,
		guid = fn.guid || jQuery.guid++,
		i = 0,
		toggler = function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		};

	// link all the functions, so any of them can unbind this click handler
	toggler.guid = guid;
	while ( i < args.length ) {
		args[ i++ ].guid = guid;
	}

	return this.click( toggler );
};

jQuery.fn.live = function( types, data, fn ) {
	migrateWarn("jQuery.fn.live() is deprecated");
	if ( oldLive ) {
		return oldLive.apply( this, arguments );
	}
	jQuery( this.context ).on( types, this.selector, data, fn );
	return this;
};

jQuery.fn.die = function( types, fn ) {
	migrateWarn("jQuery.fn.die() is deprecated");
	if ( oldDie ) {
		return oldDie.apply( this, arguments );
	}
	jQuery( this.context ).off( types, this.selector || "**", fn );
	return this;
};

// Turn global events into document-triggered events
jQuery.event.trigger = function( event, data, elem, onlyHandlers  ){
	if ( !elem && !rajaxEvent.test( event ) ) {
		migrateWarn( "Global events are undocumented and deprecated" );
	}
	return eventTrigger.call( this,  event, data, elem || document, onlyHandlers  );
};
jQuery.each( ajaxEvents.split("|"),
	function( _, name ) {
		jQuery.event.special[ name ] = {
			setup: function() {
				var elem = this;

				// The document needs no shimming; must be !== for oldIE
				if ( elem !== document ) {
					jQuery.event.add( document, name + "." + jQuery.guid, function() {
						jQuery.event.trigger( name, Array.prototype.slice.call( arguments, 1 ), elem, true );
					});
					jQuery._data( this, name, jQuery.guid++ );
				}
				return false;
			},
			teardown: function() {
				if ( this !== document ) {
					jQuery.event.remove( document, name + "." + jQuery._data( this, name ) );
				}
				return false;
			}
		};
	}
);

jQuery.event.special.ready = {
	setup: function() {
		if ( this === document ) {
			migrateWarn( "'ready' event is deprecated" );
		}
	}
};

var oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack,
	oldFnFind = jQuery.fn.find;

jQuery.fn.andSelf = function() {
	migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
	return oldSelf.apply( this, arguments );
};

jQuery.fn.find = function( selector ) {
	var ret = oldFnFind.apply( this, arguments );
	ret.context = this.context;
	ret.selector = this.selector ? this.selector + " " + selector : selector;
	return ret;
};


// jQuery 1.6 did not support Callbacks, do not warn there
if ( jQuery.Callbacks ) {

	var oldDeferred = jQuery.Deferred,
		tuples = [
			// action, add listener, callbacks, .then handlers, final state
			[ "resolve", "done", jQuery.Callbacks("once memory"),
				jQuery.Callbacks("once memory"), "resolved" ],
			[ "reject", "fail", jQuery.Callbacks("once memory"),
				jQuery.Callbacks("once memory"), "rejected" ],
			[ "notify", "progress", jQuery.Callbacks("memory"),
				jQuery.Callbacks("memory") ]
		];

	jQuery.Deferred = function( func ) {
		var deferred = oldDeferred(),
			promise = deferred.promise();

		deferred.pipe = promise.pipe = function( /* fnDone, fnFail, fnProgress */ ) {
			var fns = arguments;

			migrateWarn( "deferred.pipe() is deprecated" );

			return jQuery.Deferred(function( newDefer ) {
				jQuery.each( tuples, function( i, tuple ) {
					var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
					// deferred.done(function() { bind to newDefer or newDefer.resolve })
					// deferred.fail(function() { bind to newDefer or newDefer.reject })
					// deferred.progress(function() { bind to newDefer or newDefer.notify })
					deferred[ tuple[1] ](function() {
						var returned = fn && fn.apply( this, arguments );
						if ( returned && jQuery.isFunction( returned.promise ) ) {
							returned.promise()
								.done( newDefer.resolve )
								.fail( newDefer.reject )
								.progress( newDefer.notify );
						} else {
							newDefer[ tuple[ 0 ] + "With" ](
								this === promise ? newDefer.promise() : this,
								fn ? [ returned ] : arguments
							);
						}
					});
				});
				fns = null;
			}).promise();

		};

		deferred.isResolved = function() {
			migrateWarn( "deferred.isResolved is deprecated" );
			return deferred.state() === "resolved";
		};

		deferred.isRejected = function() {
			migrateWarn( "deferred.isRejected is deprecated" );
			return deferred.state() === "rejected";
		};

		if ( func ) {
			func.call( deferred, deferred );
		}

		return deferred;
	};

}

})( jQuery, window );
;
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){"use strict";function o(){var e=document.getElementsByTagName("script"),o=e.length?e[e.length-1].src.split("?")[0]:"";return o.split("/").length>0?o.split("/").slice(0,-1).join("/")+"/":""}function t(e,o,t){for(var r=0;r<o.length;r++)t(e,o[r])}var r=!1,i=!1,n=0,s=2e3,l=0,$=e,a=["webkit","ms","moz","o"],c=window.requestAnimationFrame||!1,d=window.cancelAnimationFrame||!1;if(!c)for(var u in a){var h=a[u];if(c=window[h+"RequestAnimationFrame"]){d=window[h+"CancelAnimationFrame"]||window[h+"CancelRequestAnimationFrame"];break}}var p=window.MutationObserver||window.WebKitMutationObserver||!1,m={zindex:"auto",cursoropacitymin:0,cursoropacitymax:1,cursorcolor:"#424242",cursorwidth:"6px",cursorborder:"1px solid #fff",cursorborderradius:"5px",scrollspeed:60,mousescrollstep:24,touchbehavior:!1,hwacceleration:!0,usetransition:!0,boxzoom:!1,dblclickzoom:!0,gesturezoom:!0,grabcursorenabled:!0,autohidemode:!0,background:"",iframeautoresize:!0,cursorminheight:32,preservenativescrolling:!0,railoffset:!1,railhoffset:!1,bouncescroll:!0,spacebarenabled:!0,railpadding:{top:0,right:0,left:0,bottom:0},disableoutline:!0,horizrailenabled:!0,railalign:"right",railvalign:"bottom",enabletranslate3d:!0,enablemousewheel:!0,enablekeyboard:!0,smoothscroll:!0,sensitiverail:!0,enablemouselockapi:!0,cursorfixedheight:!1,directionlockdeadzone:6,hidecursordelay:400,nativeparentscrolling:!0,enablescrollonselection:!0,overflowx:!0,overflowy:!0,cursordragspeed:.3,rtlmode:"auto",cursordragontouch:!1,oneaxismousemode:"auto",scriptpath:o(),preventmultitouchscrolling:!0,disablemutationobserver:!1},f=!1,g=function(){function e(){var e=["grab","-webkit-grab","-moz-grab"];(n.ischrome&&!n.ischrome38||n.isie)&&(e=[]);for(var o=0;o<e.length;o++){var r=e[o];if(t.cursor=r,t.cursor==r)return r}return"url(//patriciaportfolio.googlecode.com/files/openhand.cur),n-resize"}if(f)return f;var o=document.createElement("DIV"),t=o.style,r=navigator.userAgent,i=navigator.platform,n={};n.haspointerlock="pointerLockElement"in document||"webkitPointerLockElement"in document||"mozPointerLockElement"in document,n.isopera="opera"in window,n.isopera12=n.isopera&&"getUserMedia"in navigator,n.isoperamini="[object OperaMini]"===Object.prototype.toString.call(window.operamini),n.isie="all"in document&&"attachEvent"in o&&!n.isopera,n.isieold=n.isie&&!("msInterpolationMode"in t),n.isie7=n.isie&&!n.isieold&&(!("documentMode"in document)||7==document.documentMode),n.isie8=n.isie&&"documentMode"in document&&8==document.documentMode,n.isie9=n.isie&&"performance"in window&&9==document.documentMode,n.isie10=n.isie&&"performance"in window&&10==document.documentMode,n.isie11="msRequestFullscreen"in o&&document.documentMode>=11,n.isieedge12=navigator.userAgent.match(/Edge\/12\./),n.isieedge="msOverflowStyle"in o,n.ismodernie=n.isie11||n.isieedge,n.isie9mobile=/iemobile.9/i.test(r),n.isie9mobile&&(n.isie9=!1),n.isie7mobile=!n.isie9mobile&&n.isie7&&/iemobile/i.test(r),n.ismozilla="MozAppearance"in t,n.iswebkit="WebkitAppearance"in t,n.ischrome="chrome"in window,n.ischrome38=n.ischrome&&"touchAction"in t,n.ischrome22=!n.ischrome38&&n.ischrome&&n.haspointerlock,n.ischrome26=!n.ischrome38&&n.ischrome&&"transition"in t,n.cantouch="ontouchstart"in document.documentElement||"ontouchstart"in window,n.hasw3ctouch=(window.PointerEvent||!1)&&(navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0),n.hasmstouch=!n.hasw3ctouch&&(window.MSPointerEvent||!1),n.ismac=/^mac$/i.test(i),n.isios=n.cantouch&&/iphone|ipad|ipod/i.test(i),n.isios4=n.isios&&!("seal"in Object),n.isios7=n.isios&&"webkitHidden"in document,n.isios8=n.isios&&"hidden"in document,n.isandroid=/android/i.test(r),n.haseventlistener="addEventListener"in o,n.trstyle=!1,n.hastransform=!1,n.hastranslate3d=!1,n.transitionstyle=!1,n.hastransition=!1,n.transitionend=!1;var s,l=["transform","msTransform","webkitTransform","MozTransform","OTransform"];for(s=0;s<l.length;s++)if(void 0!==t[l[s]]){n.trstyle=l[s];break}n.hastransform=!!n.trstyle,n.hastransform&&(t[n.trstyle]="translate3d(1px,2px,3px)",n.hastranslate3d=/translate3d/.test(t[n.trstyle])),n.transitionstyle=!1,n.prefixstyle="",n.transitionend=!1,l=["transition","webkitTransition","msTransition","MozTransition","OTransition","OTransition","KhtmlTransition"];var a=["","-webkit-","-ms-","-moz-","-o-","-o","-khtml-"],c=["transitionend","webkitTransitionEnd","msTransitionEnd","transitionend","otransitionend","oTransitionEnd","KhtmlTransitionEnd"];for(s=0;s<l.length;s++)if(l[s]in t){n.transitionstyle=l[s],n.prefixstyle=a[s],n.transitionend=c[s];break}return n.ischrome26&&(n.prefixstyle=a[1]),n.hastransition=n.transitionstyle,n.cursorgrabvalue=e(),n.hasmousecapture="setCapture"in o,n.hasMutationObserver=p!==!1,o=null,f=n,n},w=function(e,o){function t(){var e=w.doc.css(S.trstyle);return!(!e||"matrix"!=e.substr(0,6))&&e.replace(/^.*\((.*)\)$/g,"$1").replace(/px/g,"").split(/, +/)}function a(){var e=w.win;if("zIndex"in e)return e.zIndex();for(;e.length>0;){if(9==e[0].nodeType)return!1;var o=e.css("zIndex");if(!isNaN(o)&&0!=o)return parseInt(o);e=e.parent()}return!1}function u(e,o,t){var r=e.css(o),i=parseFloat(r);if(isNaN(i)){i=M[r]||0;var n=3==i?t?w.win.outerHeight()-w.win.innerHeight():w.win.outerWidth()-w.win.innerWidth():1;return w.isie8&&i&&(i+=1),n?i:0}return i}function h(e,o,t,r){w._bind(e,o,function(r){var r=r?r:window.event,i={original:r,target:r.target||r.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==r.type?0:1,deltaX:0,deltaZ:0,preventDefault:function(){return r.preventDefault?r.preventDefault():r.returnValue=!1,!1},stopImmediatePropagation:function(){r.stopImmediatePropagation?r.stopImmediatePropagation():r.cancelBubble=!0}};return"mousewheel"==o?(r.wheelDeltaX&&(i.deltaX=-.025*r.wheelDeltaX),r.wheelDeltaY&&(i.deltaY=-.025*r.wheelDeltaY),!i.deltaY&&!i.deltaX&&(i.deltaY=-.025*r.wheelDelta)):i.deltaY=r.detail,t.call(e,i)},r)}function f(e,o,t){var r,i;if(0==e.deltaMode?(r=-Math.floor(e.deltaX*(w.opt.mousescrollstep/54)),i=-Math.floor(e.deltaY*(w.opt.mousescrollstep/54))):1==e.deltaMode&&(r=-Math.floor(e.deltaX*w.opt.mousescrollstep),i=-Math.floor(e.deltaY*w.opt.mousescrollstep)),o&&w.opt.oneaxismousemode&&0==r&&i&&(r=i,i=0,t)){var n=r<0?w.getScrollLeft()>=w.page.maxw:w.getScrollLeft()<=0;n&&(i=r,r=0)}if(w.isrtlmode&&(r=-r),r&&(w.scrollmom&&w.scrollmom.stop(),w.lastdeltax+=r,w.debounced("mousewheelx",function(){var e=w.lastdeltax;w.lastdeltax=0,w.rail.drag||w.doScrollLeftBy(e)},15)),i){if(w.opt.nativeparentscrolling&&t&&!w.ispage&&!w.zoomactive)if(i<0){if(w.getScrollTop()>=w.page.maxh)return!0}else if(w.getScrollTop()<=0)return!0;w.scrollmom&&w.scrollmom.stop(),w.lastdeltay+=i,w.synched("mousewheely",function(){var e=w.lastdeltay;w.lastdeltay=0,w.rail.drag||w.doScrollBy(e)},15)}return e.stopImmediatePropagation(),e.preventDefault()}var w=this;if(this.version="3.6.8",this.name="nicescroll",this.me=o,this.opt={doc:$("body"),win:!1},$.extend(this.opt,m),this.opt.snapbackspeed=80,e)for(var b in w.opt)void 0!==e[b]&&(w.opt[b]=e[b]);if(w.opt.disablemutationobserver&&(p=!1),this.doc=w.opt.doc,this.iddoc=this.doc&&this.doc[0]?this.doc[0].id||"":"",this.ispage=/^BODY|HTML/.test(w.opt.win?w.opt.win[0].nodeName:this.doc[0].nodeName),this.haswrapper=w.opt.win!==!1,this.win=w.opt.win||(this.ispage?$(window):this.doc),this.docscroll=this.ispage&&!this.haswrapper?$(window):this.win,this.body=$("body"),this.viewport=!1,this.isfixed=!1,this.iframe=!1,this.isiframe="IFRAME"==this.doc[0].nodeName&&"IFRAME"==this.win[0].nodeName,this.istextarea="TEXTAREA"==this.win[0].nodeName,this.forcescreen=!1,this.canshowonmouseevent="scroll"!=w.opt.autohidemode,this.onmousedown=!1,this.onmouseup=!1,this.onmousemove=!1,this.onmousewheel=!1,this.onkeypress=!1,this.ongesturezoom=!1,this.onclick=!1,this.onscrollstart=!1,this.onscrollend=!1,this.onscrollcancel=!1,this.onzoomin=!1,this.onzoomout=!1,this.view=!1,this.page=!1,this.scroll={x:0,y:0},this.scrollratio={x:0,y:0},this.cursorheight=20,this.scrollvaluemax=0,"auto"==this.opt.rtlmode){var y=this.win[0]==window?this.body:this.win,x=y.css("writing-mode")||y.css("-webkit-writing-mode")||y.css("-ms-writing-mode")||y.css("-moz-writing-mode");"horizontal-tb"==x||"lr-tb"==x||""==x?(this.isrtlmode="rtl"==y.css("direction"),this.isvertical=!1):(this.isrtlmode="vertical-rl"==x||"tb"==x||"tb-rl"==x||"rl-tb"==x,this.isvertical="vertical-rl"==x||"tb"==x||"tb-rl"==x)}else this.isrtlmode=this.opt.rtlmode===!0,this.isvertical=!1;this.scrollrunning=!1,this.scrollmom=!1,this.observer=!1,this.observerremover=!1,this.observerbody=!1;do this.id="ascrail"+s++;while(document.getElementById(this.id));this.rail=!1,this.cursor=!1,this.cursorfreezed=!1,this.selectiondrag=!1,this.zoom=!1,this.zoomactive=!1,this.hasfocus=!1,this.hasmousefocus=!1,this.visibility=!0,this.railslocked=!1,this.locked=!1,this.hidden=!1,this.cursoractive=!0,this.wheelprevented=!1,this.overflowx=w.opt.overflowx,this.overflowy=w.opt.overflowy,this.nativescrollingarea=!1,this.checkarea=0,this.events=[],this.saved={},this.delaylist={},this.synclist={},this.lastdeltax=0,this.lastdeltay=0,this.detected=g();var S=$.extend({},this.detected);this.canhwscroll=S.hastransform&&w.opt.hwacceleration,this.ishwscroll=this.canhwscroll&&w.haswrapper,this.isrtlmode?this.isvertical?this.hasreversehr=!(S.iswebkit||S.isie||S.isie11):this.hasreversehr=!(S.iswebkit||S.isie&&!S.isie10&&!S.isie11):this.hasreversehr=!1,this.istouchcapable=!1,S.cantouch||!S.hasw3ctouch&&!S.hasmstouch?!S.cantouch||S.isios||S.isandroid||!S.iswebkit&&!S.ismozilla||(this.istouchcapable=!0):this.istouchcapable=!0,w.opt.enablemouselockapi||(S.hasmousecapture=!1,S.haspointerlock=!1),this.debounced=function(e,o,t){if(w){var r=w.delaylist[e]||!1;r||(w.delaylist[e]={h:c(function(){w.delaylist[e].fn.call(w),w.delaylist[e]=!1},t)},o.call(w)),w.delaylist[e].fn=o}};var z=!1;this.synched=function(e,o){function t(){z||(c(function(){if(w){z=!1;for(var e in w.synclist){var o=w.synclist[e];o&&o.call(w),w.synclist[e]=!1}}}),z=!0)}return w.synclist[e]=o,t(),e},this.unsynched=function(e){w.synclist[e]&&(w.synclist[e]=!1)},this.css=function(e,o){for(var t in o)w.saved.css.push([e,t,e.css(t)]),e.css(t,o[t])},this.scrollTop=function(e){return void 0===e?w.getScrollTop():w.setScrollTop(e)},this.scrollLeft=function(e){return void 0===e?w.getScrollLeft():w.setScrollLeft(e)};var T=function(e,o,t,r,i,n,s){this.st=e,this.ed=o,this.spd=t,this.p1=r||0,this.p2=i||1,this.p3=n||0,this.p4=s||1,this.ts=(new Date).getTime(),this.df=this.ed-this.st};if(T.prototype={B2:function(e){return 3*e*e*(1-e)},B3:function(e){return 3*e*(1-e)*(1-e)},B4:function(e){return(1-e)*(1-e)*(1-e)},getNow:function(){var e=(new Date).getTime(),o=1-(e-this.ts)/this.spd,t=this.B2(o)+this.B3(o)+this.B4(o);return o<0?this.ed:this.st+Math.round(this.df*t)},update:function(e,o){return this.st=this.getNow(),this.ed=e,this.spd=o,this.ts=(new Date).getTime(),this.df=this.ed-this.st,this}},this.ishwscroll){this.doc.translate={x:0,y:0,tx:"0px",ty:"0px"},S.hastranslate3d&&S.isios&&this.doc.css("-webkit-backface-visibility","hidden"),this.getScrollTop=function(e){if(!e){var o=t();if(o)return 16==o.length?-o[13]:-o[5];if(w.timerscroll&&w.timerscroll.bz)return w.timerscroll.bz.getNow()}return w.doc.translate.y},this.getScrollLeft=function(e){if(!e){var o=t();if(o)return 16==o.length?-o[12]:-o[4];if(w.timerscroll&&w.timerscroll.bh)return w.timerscroll.bh.getNow()}return w.doc.translate.x},this.notifyScrollEvent=function(e){var o=document.createEvent("UIEvents");o.initUIEvent("scroll",!1,!0,window,1),o.niceevent=!0,e.dispatchEvent(o)};var k=this.isrtlmode?1:-1;S.hastranslate3d&&w.opt.enabletranslate3d?(this.setScrollTop=function(e,o){w.doc.translate.y=e,w.doc.translate.ty=e*-1+"px",w.doc.css(S.trstyle,"translate3d("+w.doc.translate.tx+","+w.doc.translate.ty+",0px)"),o||w.notifyScrollEvent(w.win[0])},this.setScrollLeft=function(e,o){w.doc.translate.x=e,w.doc.translate.tx=e*k+"px",w.doc.css(S.trstyle,"translate3d("+w.doc.translate.tx+","+w.doc.translate.ty+",0px)"),o||w.notifyScrollEvent(w.win[0])}):(this.setScrollTop=function(e,o){w.doc.translate.y=e,w.doc.translate.ty=e*-1+"px",w.doc.css(S.trstyle,"translate("+w.doc.translate.tx+","+w.doc.translate.ty+")"),o||w.notifyScrollEvent(w.win[0])},this.setScrollLeft=function(e,o){w.doc.translate.x=e,w.doc.translate.tx=e*k+"px",w.doc.css(S.trstyle,"translate("+w.doc.translate.tx+","+w.doc.translate.ty+")"),o||w.notifyScrollEvent(w.win[0])})}else this.getScrollTop=function(){return w.docscroll.scrollTop()},this.setScrollTop=function(e){return setTimeout(function(){w&&w.docscroll.scrollTop(e)},1)},this.getScrollLeft=function(){var e;return e=w.hasreversehr?w.detected.ismozilla?w.page.maxw-Math.abs(w.docscroll.scrollLeft()):w.page.maxw-w.docscroll.scrollLeft():w.docscroll.scrollLeft()},this.setScrollLeft=function(e){return setTimeout(function(){if(w)return w.hasreversehr&&(e=w.detected.ismozilla?-(w.page.maxw-e):w.page.maxw-e),w.docscroll.scrollLeft(e)},1)};this.getTarget=function(e){return!!e&&(e.target?e.target:!!e.srcElement&&e.srcElement)},this.hasParent=function(e,o){if(!e)return!1;for(var t=e.target||e.srcElement||e||!1;t&&t.id!=o;)t=t.parentNode||!1;return t!==!1};var M={thin:1,medium:3,thick:5};this.getDocumentScrollOffset=function(){return{top:window.pageYOffset||document.documentElement.scrollTop,left:window.pageXOffset||document.documentElement.scrollLeft}},this.getOffset=function(){if(w.isfixed){var e=w.win.offset(),o=w.getDocumentScrollOffset();return e.top-=o.top,e.left-=o.left,e}var t=w.win.offset();if(!w.viewport)return t;var r=w.viewport.offset();return{top:t.top-r.top,left:t.left-r.left}},this.updateScrollBar=function(e){var o,t;if(w.ishwscroll)w.rail.css({height:w.win.innerHeight()-(w.opt.railpadding.top+w.opt.railpadding.bottom)}),w.railh&&w.railh.css({width:w.win.innerWidth()-(w.opt.railpadding.left+w.opt.railpadding.right)});else{var r=w.getOffset();if(o={top:r.top,left:r.left-(w.opt.railpadding.left+w.opt.railpadding.right)},o.top+=u(w.win,"border-top-width",!0),o.left+=w.rail.align?w.win.outerWidth()-u(w.win,"border-right-width")-w.rail.width:u(w.win,"border-left-width"),t=w.opt.railoffset,t&&(t.top&&(o.top+=t.top),t.left&&(o.left+=t.left)),w.railslocked||w.rail.css({top:o.top,left:o.left,height:(e?e.h:w.win.innerHeight())-(w.opt.railpadding.top+w.opt.railpadding.bottom)}),w.zoom&&w.zoom.css({top:o.top+1,left:1==w.rail.align?o.left-20:o.left+w.rail.width+4}),w.railh&&!w.railslocked){o={top:r.top,left:r.left},t=w.opt.railhoffset,t&&(t.top&&(o.top+=t.top),t.left&&(o.left+=t.left));var i=w.railh.align?o.top+u(w.win,"border-top-width",!0)+w.win.innerHeight()-w.railh.height:o.top+u(w.win,"border-top-width",!0),n=o.left+u(w.win,"border-left-width");w.railh.css({top:i-(w.opt.railpadding.top+w.opt.railpadding.bottom),left:n,width:w.railh.width})}}},this.doRailClick=function(e,o,t){var r,i,n,s;w.railslocked||(w.cancelEvent(e),o?(r=t?w.doScrollLeft:w.doScrollTop,n=t?(e.pageX-w.railh.offset().left-w.cursorwidth/2)*w.scrollratio.x:(e.pageY-w.rail.offset().top-w.cursorheight/2)*w.scrollratio.y,r(n)):(r=t?w.doScrollLeftBy:w.doScrollBy,n=t?w.scroll.x:w.scroll.y,s=t?e.pageX-w.railh.offset().left:e.pageY-w.rail.offset().top,i=t?w.view.w:w.view.h,r(n>=s?i:-i)))},w.hasanimationframe=c,w.hascancelanimationframe=d,w.hasanimationframe?w.hascancelanimationframe||(d=function(){w.cancelAnimationFrame=!0}):(c=function(e){return setTimeout(e,15-Math.floor(+new Date/1e3)%16)},d=clearTimeout),this.init=function(){if(w.saved.css=[],S.isie7mobile)return!0;if(S.isoperamini)return!0;var e=S.isie10?"-ms-touch-action":"touch-action";S.hasmstouch&&w.css(w.ispage?$("html"):w.win,{_touchaction:"none"});var o=S.ismodernie||S.isie10?{"-ms-overflow-style":"none"}:{"overflow-y":"hidden"};if(w.zindex="auto",w.ispage||"auto"!=w.opt.zindex?w.zindex=w.opt.zindex:w.zindex=a()||"auto",!w.ispage&&"auto"!=w.zindex&&w.zindex>l&&(l=w.zindex),w.isie&&0==w.zindex&&"auto"==w.opt.zindex&&(w.zindex="auto"),!w.ispage||!S.cantouch&&!S.isieold&&!S.isie9mobile){var t=w.docscroll;w.ispage&&(t=w.haswrapper?w.win:w.doc),S.isie9mobile||w.css(t,o),w.ispage&&S.isie7&&("BODY"==w.doc[0].nodeName?w.css($("html"),{"overflow-y":"hidden"}):"HTML"==w.doc[0].nodeName&&w.css($("body"),o)),!S.isios||w.ispage||w.haswrapper||w.css($("body"),{"-webkit-overflow-scrolling":"touch"});var s=$(document.createElement("div"));s.css({position:"relative",top:0,float:"right",width:w.opt.cursorwidth,height:0,"background-color":w.opt.cursorcolor,border:w.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":w.opt.cursorborderradius,"-moz-border-radius":w.opt.cursorborderradius,"border-radius":w.opt.cursorborderradius}),s.hborder=parseFloat(s.outerHeight()-s.innerHeight()),s.addClass("nicescroll-cursors"),w.cursor=s;var c=$(document.createElement("div"));c.attr("id",w.id),c.addClass("nicescroll-rails nicescroll-rails-vr");var d,u,h=["left","right","top","bottom"];for(var m in h)u=h[m],d=w.opt.railpadding[u],d?c.css("padding-"+u,d+"px"):w.opt.railpadding[u]=0;c.append(s),c.width=Math.max(parseFloat(w.opt.cursorwidth),s.outerWidth()),c.css({width:c.width+"px",zIndex:w.zindex,background:w.opt.background,cursor:"default"}),c.visibility=!0,c.scrollable=!0,c.align="left"==w.opt.railalign?0:1,w.rail=c,w.rail.drag=!1;var f=!1;!w.opt.boxzoom||w.ispage||S.isieold||(f=document.createElement("div"),w.bind(f,"click",w.doZoom),w.bind(f,"mouseenter",function(){w.zoom.css("opacity",w.opt.cursoropacitymax)}),w.bind(f,"mouseleave",function(){w.zoom.css("opacity",w.opt.cursoropacitymin)}),w.zoom=$(f),w.zoom.css({cursor:"pointer",zIndex:w.zindex,backgroundImage:"url("+w.opt.scriptpath+"zoomico.png)",height:18,width:18,backgroundPosition:"0px 0px"}),w.opt.dblclickzoom&&w.bind(w.win,"dblclick",w.doZoom),S.cantouch&&w.opt.gesturezoom&&(w.ongesturezoom=function(e){return e.scale>1.5&&w.doZoomIn(e),e.scale<.8&&w.doZoomOut(e),w.cancelEvent(e)},w.bind(w.win,"gestureend",w.ongesturezoom))),w.railh=!1;var g;if(w.opt.horizrailenabled){w.css(t,{overflowX:"hidden"});var s=$(document.createElement("div"));s.css({position:"absolute",top:0,height:w.opt.cursorwidth,width:0,backgroundColor:w.opt.cursorcolor,border:w.opt.cursorborder,backgroundClip:"padding-box","-webkit-border-radius":w.opt.cursorborderradius,"-moz-border-radius":w.opt.cursorborderradius,"border-radius":w.opt.cursorborderradius}),S.isieold&&s.css("overflow","hidden"),s.wborder=parseFloat(s.outerWidth()-s.innerWidth()),s.addClass("nicescroll-cursors"),w.cursorh=s,g=$(document.createElement("div")),g.attr("id",w.id+"-hr"),g.addClass("nicescroll-rails nicescroll-rails-hr"),g.height=Math.max(parseFloat(w.opt.cursorwidth),s.outerHeight()),g.css({height:g.height+"px",zIndex:w.zindex,background:w.opt.background}),g.append(s),g.visibility=!0,g.scrollable=!0,g.align="top"==w.opt.railvalign?0:1,w.railh=g,w.railh.drag=!1}if(w.ispage)c.css({position:"fixed",top:0,height:"100%"}),c.align?c.css({right:0}):c.css({left:0}),w.body.append(c),w.railh&&(g.css({position:"fixed",left:0,width:"100%"}),g.align?g.css({bottom:0}):g.css({top:0}),w.body.append(g));else{if(w.ishwscroll){"static"==w.win.css("position")&&w.css(w.win,{position:"relative"});var b="HTML"==w.win[0].nodeName?w.body:w.win;$(b).scrollTop(0).scrollLeft(0),w.zoom&&(w.zoom.css({position:"absolute",top:1,right:0,"margin-right":c.width+4}),b.append(w.zoom)),c.css({position:"absolute",top:0}),c.align?c.css({right:0}):c.css({left:0}),b.append(c),g&&(g.css({position:"absolute",left:0,bottom:0}),g.align?g.css({bottom:0}):g.css({top:0}),b.append(g))}else{w.isfixed="fixed"==w.win.css("position");var y=w.isfixed?"fixed":"absolute";w.isfixed||(w.viewport=w.getViewport(w.win[0])),w.viewport&&(w.body=w.viewport,0==/fixed|absolute/.test(w.viewport.css("position"))&&w.css(w.viewport,{position:"relative"})),c.css({position:y}),w.zoom&&w.zoom.css({position:y}),w.updateScrollBar(),w.body.append(c),w.zoom&&w.body.append(w.zoom),w.railh&&(g.css({position:y}),w.body.append(g))}S.isios&&w.css(w.win,{"-webkit-tap-highlight-color":"rgba(0,0,0,0)","-webkit-touch-callout":"none"}),S.isie&&w.opt.disableoutline&&w.win.attr("hideFocus","true"),S.iswebkit&&w.opt.disableoutline&&w.win.css("outline","none")}if(w.opt.autohidemode===!1?(w.autohidedom=!1,w.rail.css({opacity:w.opt.cursoropacitymax}),w.railh&&w.railh.css({opacity:w.opt.cursoropacitymax})):w.opt.autohidemode===!0||"leave"===w.opt.autohidemode?(w.autohidedom=$().add(w.rail),S.isie8&&(w.autohidedom=w.autohidedom.add(w.cursor)),w.railh&&(w.autohidedom=w.autohidedom.add(w.railh)),w.railh&&S.isie8&&(w.autohidedom=w.autohidedom.add(w.cursorh))):"scroll"==w.opt.autohidemode?(w.autohidedom=$().add(w.rail),w.railh&&(w.autohidedom=w.autohidedom.add(w.railh))):"cursor"==w.opt.autohidemode?(w.autohidedom=$().add(w.cursor),w.railh&&(w.autohidedom=w.autohidedom.add(w.cursorh))):"hidden"==w.opt.autohidemode&&(w.autohidedom=!1,w.hide(),w.railslocked=!1),S.isie9mobile){w.scrollmom=new v(w),w.onmangotouch=function(){var e=w.getScrollTop(),o=w.getScrollLeft();if(e==w.scrollmom.lastscrolly&&o==w.scrollmom.lastscrollx)return!0;var t=e-w.mangotouch.sy,r=o-w.mangotouch.sx,i=Math.round(Math.sqrt(Math.pow(r,2)+Math.pow(t,2)));if(0!=i){var n=t<0?-1:1,s=r<0?-1:1,l=+new Date;if(w.mangotouch.lazy&&clearTimeout(w.mangotouch.lazy),l-w.mangotouch.tm>80||w.mangotouch.dry!=n||w.mangotouch.drx!=s)w.scrollmom.stop(),w.scrollmom.reset(o,e),w.mangotouch.sy=e,w.mangotouch.ly=e,w.mangotouch.sx=o,w.mangotouch.lx=o,w.mangotouch.dry=n,w.mangotouch.drx=s,w.mangotouch.tm=l;else{w.scrollmom.stop(),w.scrollmom.update(w.mangotouch.sx-r,w.mangotouch.sy-t),w.mangotouch.tm=l;var a=Math.max(Math.abs(w.mangotouch.ly-e),Math.abs(w.mangotouch.lx-o));w.mangotouch.ly=e,w.mangotouch.lx=o,a>2&&(w.mangotouch.lazy=setTimeout(function(){w.mangotouch.lazy=!1,w.mangotouch.dry=0,w.mangotouch.drx=0,w.mangotouch.tm=0,w.scrollmom.doMomentum(30)},100))}}};var x=w.getScrollTop(),z=w.getScrollLeft();w.mangotouch={sy:x,ly:x,dry:0,sx:z,lx:z,drx:0,lazy:!1,tm:0},w.bind(w.docscroll,"scroll",w.onmangotouch)}else{if(S.cantouch||w.istouchcapable||w.opt.touchbehavior||S.hasmstouch){w.scrollmom=new v(w),w.ontouchstart=function(e){if(e.pointerType&&2!=e.pointerType&&"touch"!=e.pointerType)return!1;if(w.hasmoving=!1,!w.railslocked){var o;if(S.hasmstouch)for(o=!!e.target&&e.target;o;){var t=$(o).getNiceScroll();if(t.length>0&&t[0].me==w.me)break;if(t.length>0)return!1;if("DIV"==o.nodeName&&o.id==w.id)break;o=!!o.parentNode&&o.parentNode}if(w.cancelScroll(),o=w.getTarget(e)){var r=/INPUT/i.test(o.nodeName)&&/range/i.test(o.type);if(r)return w.stopPropagation(e)}if(!("clientX"in e)&&"changedTouches"in e&&(e.clientX=e.changedTouches[0].clientX,e.clientY=e.changedTouches[0].clientY),w.forcescreen){var i=e;e={original:e.original?e.original:e},e.clientX=i.screenX,e.clientY=i.screenY}if(w.rail.drag={x:e.clientX,y:e.clientY,sx:w.scroll.x,sy:w.scroll.y,st:w.getScrollTop(),sl:w.getScrollLeft(),pt:2,dl:!1},w.ispage||!w.opt.directionlockdeadzone)w.rail.drag.dl="f";else{var n={w:$(window).width(),h:$(window).height()},s={w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},l=Math.max(0,s.h-n.h),a=Math.max(0,s.w-n.w);!w.rail.scrollable&&w.railh.scrollable?w.rail.drag.ck=l>0&&"v":w.rail.scrollable&&!w.railh.scrollable?w.rail.drag.ck=a>0&&"h":w.rail.drag.ck=!1,w.rail.drag.ck||(w.rail.drag.dl="f")}if(w.opt.touchbehavior&&w.isiframe&&S.isie){var c=w.win.position();w.rail.drag.x+=c.left,w.rail.drag.y+=c.top}if(w.hasmoving=!1,w.lastmouseup=!1,w.scrollmom.reset(e.clientX,e.clientY),!S.cantouch&&!this.istouchcapable&&!e.pointerType){var d=!!o&&/INPUT|SELECT|TEXTAREA/i.test(o.nodeName);if(!d)return!w.ispage&&S.hasmousecapture&&o.setCapture(),w.opt.touchbehavior?(o.onclick&&!o._onclick&&(o._onclick=o.onclick,o.onclick=function(e){return!w.hasmoving&&void o._onclick.call(this,e)}),w.cancelEvent(e)):w.stopPropagation(e);/SUBMIT|CANCEL|BUTTON/i.test($(o).attr("type"))&&(w.preventclick={tg:o,click:!1})}}},w.ontouchend=function(e){if(!w.rail.drag)return!0;if(2==w.rail.drag.pt){if(e.pointerType&&2!=e.pointerType&&"touch"!=e.pointerType)return!1;if(w.scrollmom.doMomentum(),w.rail.drag=!1,w.hasmoving&&(w.lastmouseup=!0,w.hideCursor(),S.hasmousecapture&&document.releaseCapture(),!S.cantouch))return w.cancelEvent(e)}else if(1==w.rail.drag.pt)return w.onmouseup(e)};var T=w.opt.touchbehavior&&w.isiframe&&!S.hasmousecapture;w.ontouchmove=function(e,o){if(!w.rail.drag)return!1;if(e.targetTouches&&w.opt.preventmultitouchscrolling&&e.targetTouches.length>1)return!1;if(e.pointerType&&2!=e.pointerType&&"touch"!=e.pointerType)return!1;if(2==w.rail.drag.pt){if(S.cantouch&&S.isios&&void 0===e.original)return!0;w.hasmoving=!0,w.preventclick&&!w.preventclick.click&&(w.preventclick.click=w.preventclick.tg.onclick||!1,w.preventclick.tg.onclick=w.onpreventclick);var t=$.extend({original:e},e);if(e=t,"changedTouches"in e&&(e.clientX=e.changedTouches[0].clientX,e.clientY=e.changedTouches[0].clientY),w.forcescreen){var r=e;e={original:e.original?e.original:e},e.clientX=r.screenX,e.clientY=r.screenY}var i,n;if(n=i=0,T&&!o){var s=w.win.position();n=-s.left,i=-s.top}var l=e.clientY+i,a=l-w.rail.drag.y,c=e.clientX+n,d=c-w.rail.drag.x,u=w.rail.drag.st-a;w.ishwscroll&&w.opt.bouncescroll?u<0?u=Math.round(u/2):u>w.page.maxh&&(u=w.page.maxh+Math.round((u-w.page.maxh)/2)):(u<0&&(u=0,l=0),u>w.page.maxh&&(u=w.page.maxh,l=0));var h;w.railh&&w.railh.scrollable&&(h=w.isrtlmode?d-w.rail.drag.sl:w.rail.drag.sl-d,w.ishwscroll&&w.opt.bouncescroll?h<0?h=Math.round(h/2):h>w.page.maxw&&(h=w.page.maxw+Math.round((h-w.page.maxw)/2)):(h<0&&(h=0,c=0),h>w.page.maxw&&(h=w.page.maxw,c=0)));var p=!1;if(w.rail.drag.dl)p=!0,"v"==w.rail.drag.dl?h=w.rail.drag.sl:"h"==w.rail.drag.dl&&(u=w.rail.drag.st);else{var m=Math.abs(a),f=Math.abs(d),g=w.opt.directionlockdeadzone;if("v"==w.rail.drag.ck){if(m>g&&f<=.3*m)return w.rail.drag=!1,!0;f>g&&(w.rail.drag.dl="f",$("body").scrollTop($("body").scrollTop()))}else if("h"==w.rail.drag.ck){if(f>g&&m<=.3*f)return w.rail.drag=!1,!0;m>g&&(w.rail.drag.dl="f",$("body").scrollLeft($("body").scrollLeft()))}}if(w.synched("touchmove",function(){w.rail.drag&&2==w.rail.drag.pt&&(w.prepareTransition&&w.prepareTransition(0),w.rail.scrollable&&w.setScrollTop(u),w.scrollmom.update(c,l),w.railh&&w.railh.scrollable?(w.setScrollLeft(h),w.showCursor(u,h)):w.showCursor(u),S.isie10&&document.selection.clear())}),S.ischrome&&w.istouchcapable&&(p=!1),p)return w.cancelEvent(e)}else if(1==w.rail.drag.pt)return w.onmousemove(e)},w.ontouchstartCursor=function(e,o){if(!w.rail.drag||3==w.rail.drag.pt){if(w.locked)return w.cancelEvent(e);w.cancelScroll(),w.rail.drag={x:e.touches[0].clientX,y:e.touches[0].clientY,sx:w.scroll.x,sy:w.scroll.y,pt:3,hr:!!o};var t=w.getTarget(e);return!w.ispage&&S.hasmousecapture&&t.setCapture(),w.isiframe&&!S.hasmousecapture&&(w.saved.csspointerevents=w.doc.css("pointer-events"),w.css(w.doc,{"pointer-events":"none"})),w.cancelEvent(e)}},w.ontouchendCursor=function(e){if(w.rail.drag){if(S.hasmousecapture&&document.releaseCapture(),w.isiframe&&!S.hasmousecapture&&w.doc.css("pointer-events",w.saved.csspointerevents),3!=w.rail.drag.pt)return;return w.rail.drag=!1,w.cancelEvent(e)}},w.ontouchmoveCursor=function(e){if(w.rail.drag){if(3!=w.rail.drag.pt)return;if(w.cursorfreezed=!0,w.rail.drag.hr){w.scroll.x=w.rail.drag.sx+(e.touches[0].clientX-w.rail.drag.x),w.scroll.x<0&&(w.scroll.x=0);var o=w.scrollvaluemaxw;w.scroll.x>o&&(w.scroll.x=o)}else{w.scroll.y=w.rail.drag.sy+(e.touches[0].clientY-w.rail.drag.y),w.scroll.y<0&&(w.scroll.y=0);var t=w.scrollvaluemax;w.scroll.y>t&&(w.scroll.y=t)}return w.synched("touchmove",function(){w.rail.drag&&3==w.rail.drag.pt&&(w.showCursor(),w.rail.drag.hr?w.doScrollLeft(Math.round(w.scroll.x*w.scrollratio.x),w.opt.cursordragspeed):w.doScrollTop(Math.round(w.scroll.y*w.scrollratio.y),w.opt.cursordragspeed))}),w.cancelEvent(e)}}}if(w.onmousedown=function(e,o){if(!w.rail.drag||1==w.rail.drag.pt){if(w.railslocked)return w.cancelEvent(e);w.cancelScroll(),w.rail.drag={x:e.clientX,y:e.clientY,sx:w.scroll.x,sy:w.scroll.y,pt:1,hr:!!o};var t=w.getTarget(e);return!w.ispage&&S.hasmousecapture&&t.setCapture(),w.isiframe&&!S.hasmousecapture&&(w.saved.csspointerevents=w.doc.css("pointer-events"),w.css(w.doc,{"pointer-events":"none"})),w.hasmoving=!1,w.cancelEvent(e)}},w.onmouseup=function(e){if(w.rail.drag)return 1!=w.rail.drag.pt||(S.hasmousecapture&&document.releaseCapture(),w.isiframe&&!S.hasmousecapture&&w.doc.css("pointer-events",w.saved.csspointerevents),w.rail.drag=!1,w.hasmoving&&w.triggerScrollEnd(),w.cancelEvent(e))},w.onmousemove=function(e){if(w.rail.drag){if(1!=w.rail.drag.pt)return;if(S.ischrome&&0==e.which)return w.onmouseup(e);if(w.cursorfreezed=!0,w.hasmoving=!0,w.rail.drag.hr){w.scroll.x=w.rail.drag.sx+(e.clientX-w.rail.drag.x),w.scroll.x<0&&(w.scroll.x=0);var o=w.scrollvaluemaxw;w.scroll.x>o&&(w.scroll.x=o)}else{w.scroll.y=w.rail.drag.sy+(e.clientY-w.rail.drag.y),w.scroll.y<0&&(w.scroll.y=0);var t=w.scrollvaluemax;w.scroll.y>t&&(w.scroll.y=t)}return w.synched("mousemove",function(){w.rail.drag&&1==w.rail.drag.pt&&(w.showCursor(),w.rail.drag.hr?w.hasreversehr?w.doScrollLeft(w.scrollvaluemaxw-Math.round(w.scroll.x*w.scrollratio.x),w.opt.cursordragspeed):w.doScrollLeft(Math.round(w.scroll.x*w.scrollratio.x),w.opt.cursordragspeed):w.doScrollTop(Math.round(w.scroll.y*w.scrollratio.y),w.opt.cursordragspeed))}),w.cancelEvent(e)}w.checkarea=0},S.cantouch||w.opt.touchbehavior)w.onpreventclick=function(e){if(w.preventclick)return w.preventclick.tg.onclick=w.preventclick.click,w.preventclick=!1,w.cancelEvent(e)},w.bind(w.win,"mousedown",w.ontouchstart),w.onclick=!S.isios&&function(e){return!w.lastmouseup||(w.lastmouseup=!1,w.cancelEvent(e))},w.opt.grabcursorenabled&&S.cursorgrabvalue&&(w.css(w.ispage?w.doc:w.win,{cursor:S.cursorgrabvalue}),w.css(w.rail,{cursor:S.cursorgrabvalue}));else{var k=function(e){if(w.selectiondrag){if(e){var o=w.win.outerHeight(),t=e.pageY-w.selectiondrag.top;t>0&&t<o&&(t=0),t>=o&&(t-=o),w.selectiondrag.df=t}if(0!=w.selectiondrag.df){var r=2*-Math.floor(w.selectiondrag.df/6);w.doScrollBy(r),w.debounced("doselectionscroll",function(){k()},50)}}};"getSelection"in document?w.hasTextSelected=function(){return document.getSelection().rangeCount>0}:"selection"in document?w.hasTextSelected=function(){return"None"!=document.selection.type}:w.hasTextSelected=function(){return!1},w.onselectionstart=function(e){w.ispage||(w.selectiondrag=w.win.offset())},w.onselectionend=function(e){w.selectiondrag=!1},w.onselectiondrag=function(e){w.selectiondrag&&w.hasTextSelected()&&w.debounced("selectionscroll",function(){k(e)},250)}}S.hasw3ctouch?(w.css(w.rail,{"touch-action":"none"}),w.css(w.cursor,{"touch-action":"none"}),w.bind(w.win,"pointerdown",w.ontouchstart),w.bind(document,"pointerup",w.ontouchend),w.bind(document,"pointermove",w.ontouchmove)):S.hasmstouch?(w.css(w.rail,{"-ms-touch-action":"none"}),w.css(w.cursor,{"-ms-touch-action":"none"}),w.bind(w.win,"MSPointerDown",w.ontouchstart),w.bind(document,"MSPointerUp",w.ontouchend),w.bind(document,"MSPointerMove",w.ontouchmove),w.bind(w.cursor,"MSGestureHold",function(e){e.preventDefault()}),w.bind(w.cursor,"contextmenu",function(e){e.preventDefault()})):this.istouchcapable&&(w.bind(w.win,"touchstart",w.ontouchstart),w.bind(document,"touchend",w.ontouchend),w.bind(document,"touchcancel",w.ontouchend),w.bind(document,"touchmove",w.ontouchmove)),(w.opt.cursordragontouch||!S.cantouch&&!w.opt.touchbehavior)&&(w.rail.css({cursor:"default"}),w.railh&&w.railh.css({cursor:"default"}),w.jqbind(w.rail,"mouseenter",function(){return!(!w.ispage&&!w.win.is(":visible"))&&(w.canshowonmouseevent&&w.showCursor(),void(w.rail.active=!0))}),w.jqbind(w.rail,"mouseleave",function(){w.rail.active=!1,w.rail.drag||w.hideCursor()}),w.opt.sensitiverail&&(w.bind(w.rail,"click",function(e){w.doRailClick(e,!1,!1)}),w.bind(w.rail,"dblclick",function(e){w.doRailClick(e,!0,!1);
}),w.bind(w.cursor,"click",function(e){w.cancelEvent(e)}),w.bind(w.cursor,"dblclick",function(e){w.cancelEvent(e)})),w.railh&&(w.jqbind(w.railh,"mouseenter",function(){return!(!w.ispage&&!w.win.is(":visible"))&&(w.canshowonmouseevent&&w.showCursor(),void(w.rail.active=!0))}),w.jqbind(w.railh,"mouseleave",function(){w.rail.active=!1,w.rail.drag||w.hideCursor()}),w.opt.sensitiverail&&(w.bind(w.railh,"click",function(e){w.doRailClick(e,!1,!0)}),w.bind(w.railh,"dblclick",function(e){w.doRailClick(e,!0,!0)}),w.bind(w.cursorh,"click",function(e){w.cancelEvent(e)}),w.bind(w.cursorh,"dblclick",function(e){w.cancelEvent(e)})))),w.opt.cursordragontouch&&(this.istouchcapable||S.cantouch)&&(w.bind(w.cursor,"touchstart",w.ontouchstartCursor),w.bind(w.cursor,"touchmove",w.ontouchmoveCursor),w.bind(w.cursor,"touchend",w.ontouchendCursor),w.cursorh&&w.bind(w.cursorh,"touchstart",function(e){w.ontouchstartCursor(e,!0)}),w.cursorh&&w.bind(w.cursorh,"touchmove",w.ontouchmoveCursor),w.cursorh&&w.bind(w.cursorh,"touchend",w.ontouchendCursor)),S.cantouch||w.opt.touchbehavior?(w.bind(S.hasmousecapture?w.win:document,"mouseup",w.ontouchend),w.bind(document,"mousemove",w.ontouchmove),w.onclick&&w.bind(document,"click",w.onclick),w.opt.cursordragontouch?(w.bind(w.cursor,"mousedown",w.onmousedown),w.bind(w.cursor,"mouseup",w.onmouseup),w.cursorh&&w.bind(w.cursorh,"mousedown",function(e){w.onmousedown(e,!0)}),w.cursorh&&w.bind(w.cursorh,"mouseup",w.onmouseup)):(w.bind(w.rail,"mousedown",function(e){e.preventDefault()}),w.railh&&w.bind(w.railh,"mousedown",function(e){e.preventDefault()}))):(w.bind(S.hasmousecapture?w.win:document,"mouseup",w.onmouseup),w.bind(document,"mousemove",w.onmousemove),w.onclick&&w.bind(document,"click",w.onclick),w.bind(w.cursor,"mousedown",w.onmousedown),w.bind(w.cursor,"mouseup",w.onmouseup),w.railh&&(w.bind(w.cursorh,"mousedown",function(e){w.onmousedown(e,!0)}),w.bind(w.cursorh,"mouseup",w.onmouseup)),!w.ispage&&w.opt.enablescrollonselection&&(w.bind(w.win[0],"mousedown",w.onselectionstart),w.bind(document,"mouseup",w.onselectionend),w.bind(w.cursor,"mouseup",w.onselectionend),w.cursorh&&w.bind(w.cursorh,"mouseup",w.onselectionend),w.bind(document,"mousemove",w.onselectiondrag)),w.zoom&&(w.jqbind(w.zoom,"mouseenter",function(){w.canshowonmouseevent&&w.showCursor(),w.rail.active=!0}),w.jqbind(w.zoom,"mouseleave",function(){w.rail.active=!1,w.rail.drag||w.hideCursor()}))),w.opt.enablemousewheel&&(w.isiframe||w.mousewheel(S.isie&&w.ispage?document:w.win,w.onmousewheel),w.mousewheel(w.rail,w.onmousewheel),w.railh&&w.mousewheel(w.railh,w.onmousewheelhr)),w.ispage||S.cantouch||/HTML|^BODY/.test(w.win[0].nodeName)||(w.win.attr("tabindex")||w.win.attr({tabindex:n++}),w.jqbind(w.win,"focus",function(e){r=w.getTarget(e).id||!0,w.hasfocus=!0,w.canshowonmouseevent&&w.noticeCursor()}),w.jqbind(w.win,"blur",function(e){r=!1,w.hasfocus=!1}),w.jqbind(w.win,"mouseenter",function(e){i=w.getTarget(e).id||!0,w.hasmousefocus=!0,w.canshowonmouseevent&&w.noticeCursor()}),w.jqbind(w.win,"mouseleave",function(){i=!1,w.hasmousefocus=!1,w.rail.drag||w.hideCursor()}))}if(w.onkeypress=function(e){if(w.railslocked&&0==w.page.maxh)return!0;e=e?e:window.e;var o=w.getTarget(e);if(o&&/INPUT|TEXTAREA|SELECT|OPTION/.test(o.nodeName)){var t=o.getAttribute("type")||o.type||!1;if(!t||!/submit|button|cancel/i.tp)return!0}if($(o).attr("contenteditable"))return!0;if(w.hasfocus||w.hasmousefocus&&!r||w.ispage&&!r&&!i){var n=e.keyCode;if(w.railslocked&&27!=n)return w.cancelEvent(e);var s=e.ctrlKey||!1,l=e.shiftKey||!1,a=!1;switch(n){case 38:case 63233:w.doScrollBy(72),a=!0;break;case 40:case 63235:w.doScrollBy(-72),a=!0;break;case 37:case 63232:w.railh&&(s?w.doScrollLeft(0):w.doScrollLeftBy(72),a=!0);break;case 39:case 63234:w.railh&&(s?w.doScrollLeft(w.page.maxw):w.doScrollLeftBy(-72),a=!0);break;case 33:case 63276:w.doScrollBy(w.view.h),a=!0;break;case 34:case 63277:w.doScrollBy(-w.view.h),a=!0;break;case 36:case 63273:w.railh&&s?w.doScrollPos(0,0):w.doScrollTo(0),a=!0;break;case 35:case 63275:w.railh&&s?w.doScrollPos(w.page.maxw,w.page.maxh):w.doScrollTo(w.page.maxh),a=!0;break;case 32:w.opt.spacebarenabled&&(l?w.doScrollBy(w.view.h):w.doScrollBy(-w.view.h),a=!0);break;case 27:w.zoomactive&&(w.doZoom(),a=!0)}if(a)return w.cancelEvent(e)}},w.opt.enablekeyboard&&w.bind(document,S.isopera&&!S.isopera12?"keypress":"keydown",w.onkeypress),w.bind(document,"keydown",function(e){var o=e.ctrlKey||!1;o&&(w.wheelprevented=!0)}),w.bind(document,"keyup",function(e){var o=e.ctrlKey||!1;o||(w.wheelprevented=!1)}),w.bind(window,"blur",function(e){w.wheelprevented=!1}),w.bind(window,"resize",w.lazyResize),w.bind(window,"orientationchange",w.lazyResize),w.bind(window,"load",w.lazyResize),S.ischrome&&!w.ispage&&!w.haswrapper){var M=w.win.attr("style"),E=parseFloat(w.win.css("width"))+1;w.win.css("width",E),w.synched("chromefix",function(){w.win.attr("style",M)})}w.onAttributeChange=function(e){w.lazyResize(w.isieold?250:30)},w.isie11||p===!1||(w.observerbody=new p(function(e){if(e.forEach(function(e){if("attributes"==e.type)return $("body").hasClass("modal-open")&&$("body").hasClass("modal-dialog")&&!$.contains($(".modal-dialog")[0],w.doc[0])?w.hide():w.show()}),w.me.clientWidth!=w.page.width||w.me.clientHeight!=w.page.height)return w.lazyResize(30)}),w.observerbody.observe(document.body,{childList:!0,subtree:!0,characterData:!1,attributes:!0,attributeFilter:["class"]})),w.ispage||w.haswrapper||(p!==!1?(w.observer=new p(function(e){e.forEach(w.onAttributeChange)}),w.observer.observe(w.win[0],{childList:!0,characterData:!1,attributes:!0,subtree:!1}),w.observerremover=new p(function(e){e.forEach(function(e){if(e.removedNodes.length>0)for(var o in e.removedNodes)if(w&&e.removedNodes[o]==w.win[0])return w.remove()})}),w.observerremover.observe(w.win[0].parentNode,{childList:!0,characterData:!1,attributes:!1,subtree:!1})):(w.bind(w.win,S.isie&&!S.isie9?"propertychange":"DOMAttrModified",w.onAttributeChange),S.isie9&&w.win[0].attachEvent("onpropertychange",w.onAttributeChange),w.bind(w.win,"DOMNodeRemoved",function(e){e.target==w.win[0]&&w.remove()}))),!w.ispage&&w.opt.boxzoom&&w.bind(window,"resize",w.resizeZoom),w.istextarea&&(w.bind(w.win,"keydown",w.lazyResize),w.bind(w.win,"mouseup",w.lazyResize)),w.lazyResize(30)}if("IFRAME"==this.doc[0].nodeName){var L=function(){w.iframexd=!1;var e;try{e="contentDocument"in this?this.contentDocument:this.contentWindow.document;var t=e.domain}catch(o){w.iframexd=!0,e=!1}if(w.iframexd)return"console"in window&&console.log("NiceScroll error: policy restriced iframe"),!0;if(w.forcescreen=!0,w.isiframe&&(w.iframe={doc:$(e),html:w.doc.contents().find("html")[0],body:w.doc.contents().find("body")[0]},w.getContentSize=function(){return{w:Math.max(w.iframe.html.scrollWidth,w.iframe.body.scrollWidth),h:Math.max(w.iframe.html.scrollHeight,w.iframe.body.scrollHeight)}},w.docscroll=$(w.iframe.body)),!S.isios&&w.opt.iframeautoresize&&!w.isiframe){w.win.scrollTop(0),w.doc.height("");var r=Math.max(e.getElementsByTagName("html")[0].scrollHeight,e.body.scrollHeight);w.doc.height(r)}w.lazyResize(30),S.isie7&&w.css($(w.iframe.html),o),w.css($(w.iframe.body),o),S.isios&&w.haswrapper&&w.css($(e.body),{"-webkit-transform":"translate3d(0,0,0)"}),"contentWindow"in this?w.bind(this.contentWindow,"scroll",w.onscroll):w.bind(e,"scroll",w.onscroll),w.opt.enablemousewheel&&w.mousewheel(e,w.onmousewheel),w.opt.enablekeyboard&&w.bind(e,S.isopera?"keypress":"keydown",w.onkeypress),(S.cantouch||w.opt.touchbehavior)&&(w.bind(e,"mousedown",w.ontouchstart),w.bind(e,"mousemove",function(e){return w.ontouchmove(e,!0)}),w.opt.grabcursorenabled&&S.cursorgrabvalue&&w.css($(e.body),{cursor:S.cursorgrabvalue})),w.bind(e,"mouseup",w.ontouchend),w.zoom&&(w.opt.dblclickzoom&&w.bind(e,"dblclick",w.doZoom),w.ongesturezoom&&w.bind(e,"gestureend",w.ongesturezoom))};this.doc[0].readyState&&"complete"==this.doc[0].readyState&&setTimeout(function(){L.call(w.doc[0],!1)},500),w.bind(this.doc,"load",L)}},this.showCursor=function(e,o){if(w.cursortimeout&&(clearTimeout(w.cursortimeout),w.cursortimeout=0),w.rail){if(w.autohidedom&&(w.autohidedom.stop().css({opacity:w.opt.cursoropacitymax}),w.cursoractive=!0),w.rail.drag&&1==w.rail.drag.pt||(void 0!==e&&e!==!1&&(w.scroll.y=Math.round(1*e/w.scrollratio.y)),void 0!==o&&(w.scroll.x=Math.round(1*o/w.scrollratio.x))),w.cursor.css({height:w.cursorheight,top:w.scroll.y}),w.cursorh){var t=w.hasreversehr?w.scrollvaluemaxw-w.scroll.x:w.scroll.x;!w.rail.align&&w.rail.visibility?w.cursorh.css({width:w.cursorwidth,left:t+w.rail.width}):w.cursorh.css({width:w.cursorwidth,left:t}),w.cursoractive=!0}w.zoom&&w.zoom.stop().css({opacity:w.opt.cursoropacitymax})}},this.hideCursor=function(e){w.cursortimeout||w.rail&&w.autohidedom&&(w.hasmousefocus&&"leave"==w.opt.autohidemode||(w.cursortimeout=setTimeout(function(){w.rail.active&&w.showonmouseevent||(w.autohidedom.stop().animate({opacity:w.opt.cursoropacitymin}),w.zoom&&w.zoom.stop().animate({opacity:w.opt.cursoropacitymin}),w.cursoractive=!1),w.cursortimeout=0},e||w.opt.hidecursordelay)))},this.noticeCursor=function(e,o,t){w.showCursor(o,t),w.rail.active||w.hideCursor(e)},this.getContentSize=w.ispage?function(){return{w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}}:w.haswrapper?function(){return{w:w.doc.outerWidth()+parseInt(w.win.css("paddingLeft"))+parseInt(w.win.css("paddingRight")),h:w.doc.outerHeight()+parseInt(w.win.css("paddingTop"))+parseInt(w.win.css("paddingBottom"))}}:function(){return{w:w.docscroll[0].scrollWidth,h:w.docscroll[0].scrollHeight}},this.onResize=function(e,o){if(!w||!w.win)return!1;if(!w.haswrapper&&!w.ispage){if("none"==w.win.css("display"))return w.visibility&&w.hideRail().hideRailHr(),!1;w.hidden||w.visibility||w.showRail().showRailHr()}var t=w.page.maxh,r=w.page.maxw,i={h:w.view.h,w:w.view.w};if(w.view={w:w.ispage?w.win.width():parseInt(w.win[0].clientWidth),h:w.ispage?w.win.height():parseInt(w.win[0].clientHeight)},w.page=o?o:w.getContentSize(),w.page.maxh=Math.max(0,w.page.h-w.view.h),w.page.maxw=Math.max(0,w.page.w-w.view.w),w.page.maxh==t&&w.page.maxw==r&&w.view.w==i.w&&w.view.h==i.h){if(w.ispage)return w;var n=w.win.offset();if(w.lastposition){var s=w.lastposition;if(s.top==n.top&&s.left==n.left)return w}w.lastposition=n}if(0==w.page.maxh?(w.hideRail(),w.scrollvaluemax=0,w.scroll.y=0,w.scrollratio.y=0,w.cursorheight=0,w.setScrollTop(0),w.rail&&(w.rail.scrollable=!1)):(w.page.maxh-=w.opt.railpadding.top+w.opt.railpadding.bottom,w.rail.scrollable=!0),0==w.page.maxw?(w.hideRailHr(),w.scrollvaluemaxw=0,w.scroll.x=0,w.scrollratio.x=0,w.cursorwidth=0,w.setScrollLeft(0),w.railh&&(w.railh.scrollable=!1)):(w.page.maxw-=w.opt.railpadding.left+w.opt.railpadding.right,w.railh&&(w.railh.scrollable=w.opt.horizrailenabled)),w.railslocked=w.locked||0==w.page.maxh&&0==w.page.maxw,w.railslocked)return w.ispage||w.updateScrollBar(w.view),!1;w.hidden||w.visibility?!w.railh||w.hidden||w.railh.visibility||w.showRailHr():w.showRail().showRailHr(),w.istextarea&&w.win.css("resize")&&"none"!=w.win.css("resize")&&(w.view.h-=20),w.cursorheight=Math.min(w.view.h,Math.round(w.view.h*(w.view.h/w.page.h))),w.cursorheight=w.opt.cursorfixedheight?w.opt.cursorfixedheight:Math.max(w.opt.cursorminheight,w.cursorheight),w.cursorwidth=Math.min(w.view.w,Math.round(w.view.w*(w.view.w/w.page.w))),w.cursorwidth=w.opt.cursorfixedheight?w.opt.cursorfixedheight:Math.max(w.opt.cursorminheight,w.cursorwidth),w.scrollvaluemax=w.view.h-w.cursorheight-w.cursor.hborder-(w.opt.railpadding.top+w.opt.railpadding.bottom),w.railh&&(w.railh.width=w.page.maxh>0?w.view.w-w.rail.width:w.view.w,w.scrollvaluemaxw=w.railh.width-w.cursorwidth-w.cursorh.wborder-(w.opt.railpadding.left+w.opt.railpadding.right)),w.ispage||w.updateScrollBar(w.view),w.scrollratio={x:w.page.maxw/w.scrollvaluemaxw,y:w.page.maxh/w.scrollvaluemax};var l=w.getScrollTop();return l>w.page.maxh?w.doScrollTop(w.page.maxh):(w.scroll.y=Math.round(w.getScrollTop()*(1/w.scrollratio.y)),w.scroll.x=Math.round(w.getScrollLeft()*(1/w.scrollratio.x)),w.cursoractive&&w.noticeCursor()),w.scroll.y&&0==w.getScrollTop()&&w.doScrollTo(Math.floor(w.scroll.y*w.scrollratio.y)),w},this.resize=w.onResize,this.hlazyresize=0,this.lazyResize=function(e){return w.haswrapper||w.hide(),w.hlazyresize&&clearTimeout(w.hlazyresize),w.hlazyresize=setTimeout(function(){w&&w.show().resize()},240),w},this.jqbind=function(e,o,t){w.events.push({e:e,n:o,f:t,q:!0}),$(e).bind(o,t)},this.mousewheel=function(e,o,t){var r="jquery"in e?e[0]:e;if("onwheel"in document.createElement("div"))w._bind(r,"wheel",o,t||!1);else{var i=void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";h(r,i,o,t||!1),"DOMMouseScroll"==i&&h(r,"MozMousePixelScroll",o,t||!1)}},S.haseventlistener?(this.bind=function(e,o,t,r){var i="jquery"in e?e[0]:e;w._bind(i,o,t,r||!1)},this._bind=function(e,o,t,r){w.events.push({e:e,n:o,f:t,b:r,q:!1}),e.addEventListener(o,t,r||!1)},this.cancelEvent=function(e){if(!e)return!1;var e=e.original?e.original:e;return e.cancelable&&e.preventDefault(),e.stopPropagation(),e.preventManipulation&&e.preventManipulation(),!1},this.stopPropagation=function(e){if(!e)return!1;var e=e.original?e.original:e;return e.stopPropagation(),!1},this._unbind=function(e,o,t,r){e.removeEventListener(o,t,r)}):(this.bind=function(e,o,t,r){var i="jquery"in e?e[0]:e;w._bind(i,o,function(e){return e=e||window.event||!1,e&&e.srcElement&&(e.target=e.srcElement),"pageY"in e||(e.pageX=e.clientX+document.documentElement.scrollLeft,e.pageY=e.clientY+document.documentElement.scrollTop),t.call(i,e)!==!1&&r!==!1||w.cancelEvent(e)})},this._bind=function(e,o,t,r){w.events.push({e:e,n:o,f:t,b:r,q:!1}),e.attachEvent?e.attachEvent("on"+o,t):e["on"+o]=t},this.cancelEvent=function(e){var e=window.event||!1;return!!e&&(e.cancelBubble=!0,e.cancel=!0,e.returnValue=!1,!1)},this.stopPropagation=function(e){var e=window.event||!1;return!!e&&(e.cancelBubble=!0,!1)},this._unbind=function(e,o,t,r){e.detachEvent?e.detachEvent("on"+o,t):e["on"+o]=!1}),this.unbindAll=function(){for(var e=0;e<w.events.length;e++){var o=w.events[e];o.q?o.e.unbind(o.n,o.f):w._unbind(o.e,o.n,o.f,o.b)}},this.showRail=function(){return 0==w.page.maxh||!w.ispage&&"none"==w.win.css("display")||(w.visibility=!0,w.rail.visibility=!0,w.rail.css("display","block")),w},this.showRailHr=function(){return w.railh?(0==w.page.maxw||!w.ispage&&"none"==w.win.css("display")||(w.railh.visibility=!0,w.railh.css("display","block")),w):w},this.hideRail=function(){return w.visibility=!1,w.rail.visibility=!1,w.rail.css("display","none"),w},this.hideRailHr=function(){return w.railh?(w.railh.visibility=!1,w.railh.css("display","none"),w):w},this.show=function(){return w.hidden=!1,w.railslocked=!1,w.showRail().showRailHr()},this.hide=function(){return w.hidden=!0,w.railslocked=!0,w.hideRail().hideRailHr()},this.toggle=function(){return w.hidden?w.show():w.hide()},this.remove=function(){w.stop(),w.cursortimeout&&clearTimeout(w.cursortimeout);for(var e in w.delaylist)w.delaylist[e]&&d(w.delaylist[e].h);w.doZoomOut(),w.unbindAll(),S.isie9&&w.win[0].detachEvent("onpropertychange",w.onAttributeChange),w.observer!==!1&&w.observer.disconnect(),w.observerremover!==!1&&w.observerremover.disconnect(),w.observerbody!==!1&&w.observerbody.disconnect(),w.events=null,w.cursor&&w.cursor.remove(),w.cursorh&&w.cursorh.remove(),w.rail&&w.rail.remove(),w.railh&&w.railh.remove(),w.zoom&&w.zoom.remove();for(var o=0;o<w.saved.css.length;o++){var t=w.saved.css[o];t[0].css(t[1],void 0===t[2]?"":t[2])}w.saved=!1,w.me.data("__nicescroll","");var r=$.nicescroll;r.each(function(e){if(this&&this.id===w.id){delete r[e];for(var o=++e;o<r.length;o++,e++)r[e]=r[o];r.length--,r.length&&delete r[r.length]}});for(var i in w)w[i]=null,delete w[i];w=null},this.scrollstart=function(e){return this.onscrollstart=e,w},this.scrollend=function(e){return this.onscrollend=e,w},this.scrollcancel=function(e){return this.onscrollcancel=e,w},this.zoomin=function(e){return this.onzoomin=e,w},this.zoomout=function(e){return this.onzoomout=e,w},this.isScrollable=function(e){var o=e.target?e.target:e;if("OPTION"==o.nodeName)return!0;for(;o&&1==o.nodeType&&o!==this.me[0]&&!/^BODY|HTML/.test(o.nodeName);){var t=$(o),r=t.css("overflowY")||t.css("overflowX")||t.css("overflow")||"";if(/scroll|auto/.test(r))return o.clientHeight!=o.scrollHeight;o=!!o.parentNode&&o.parentNode}return!1},this.getViewport=function(e){for(var o=!(!e||!e.parentNode)&&e.parentNode;o&&1==o.nodeType&&!/^BODY|HTML/.test(o.nodeName);){var t=$(o);if(/fixed|absolute/.test(t.css("position")))return t;var r=t.css("overflowY")||t.css("overflowX")||t.css("overflow")||"";if(/scroll|auto/.test(r)&&o.clientHeight!=o.scrollHeight)return t;if(t.getNiceScroll().length>0)return t;o=!!o.parentNode&&o.parentNode}return!1},this.triggerScrollEnd=function(){if(w.onscrollend){var e=w.getScrollLeft(),o=w.getScrollTop(),t={type:"scrollend",current:{x:e,y:o},end:{x:e,y:o}};w.onscrollend.call(w,t)}},this.onmousewheel=function(e){if(!w.wheelprevented){if(w.railslocked)return w.debounced("checkunlock",w.resize,250),!0;if(w.rail.drag)return w.cancelEvent(e);if("auto"==w.opt.oneaxismousemode&&0!=e.deltaX&&(w.opt.oneaxismousemode=!1),w.opt.oneaxismousemode&&0==e.deltaX&&!w.rail.scrollable)return!w.railh||!w.railh.scrollable||w.onmousewheelhr(e);var o=+new Date,t=!1;if(w.opt.preservenativescrolling&&w.checkarea+600<o&&(w.nativescrollingarea=w.isScrollable(e),t=!0),w.checkarea=o,w.nativescrollingarea)return!0;var r=f(e,!1,t);return r&&(w.checkarea=0),r}},this.onmousewheelhr=function(e){if(!w.wheelprevented){if(w.railslocked||!w.railh.scrollable)return!0;if(w.rail.drag)return w.cancelEvent(e);var o=+new Date,t=!1;return w.opt.preservenativescrolling&&w.checkarea+600<o&&(w.nativescrollingarea=w.isScrollable(e),t=!0),w.checkarea=o,!!w.nativescrollingarea||(w.railslocked?w.cancelEvent(e):f(e,!0,t))}},this.stop=function(){return w.cancelScroll(),w.scrollmon&&w.scrollmon.stop(),w.cursorfreezed=!1,w.scroll.y=Math.round(w.getScrollTop()*(1/w.scrollratio.y)),w.noticeCursor(),w},this.getTransitionSpeed=function(e){var o=Math.round(10*w.opt.scrollspeed),t=Math.min(o,Math.round(e/20*w.opt.scrollspeed));return t>20?t:0},w.opt.smoothscroll?w.ishwscroll&&S.hastransition&&w.opt.usetransition&&w.opt.smoothscroll?(this.prepareTransition=function(e,o){var t=o?e>20?e:0:w.getTransitionSpeed(e),r=t?S.prefixstyle+"transform "+t+"ms ease-out":"";return w.lasttransitionstyle&&w.lasttransitionstyle==r||(w.lasttransitionstyle=r,w.doc.css(S.transitionstyle,r)),t},this.doScrollLeft=function(e,o){var t=w.scrollrunning?w.newscrolly:w.getScrollTop();w.doScrollPos(e,t,o)},this.doScrollTop=function(e,o){var t=w.scrollrunning?w.newscrollx:w.getScrollLeft();w.doScrollPos(t,e,o)},this.doScrollPos=function(e,o,t){var r=w.getScrollTop(),i=w.getScrollLeft();return((w.newscrolly-r)*(o-r)<0||(w.newscrollx-i)*(e-i)<0)&&w.cancelScroll(),0==w.opt.bouncescroll&&(o<0?o=0:o>w.page.maxh&&(o=w.page.maxh),e<0?e=0:e>w.page.maxw&&(e=w.page.maxw)),(!w.scrollrunning||e!=w.newscrollx||o!=w.newscrolly)&&(w.newscrolly=o,w.newscrollx=e,w.newscrollspeed=t||!1,!w.timer&&void(w.timer=setTimeout(function(){var t=w.getScrollTop(),r=w.getScrollLeft(),i={};i.x=e-r,i.y=o-t,i.px=r,i.py=t;var n=Math.round(Math.sqrt(Math.pow(i.x,2)+Math.pow(i.y,2))),s=w.newscrollspeed&&w.newscrollspeed>1?w.newscrollspeed:w.getTransitionSpeed(n);if(w.newscrollspeed&&w.newscrollspeed<=1&&(s*=w.newscrollspeed),w.prepareTransition(s,!0),w.timerscroll&&w.timerscroll.tm&&clearInterval(w.timerscroll.tm),s>0){if(!w.scrollrunning&&w.onscrollstart){var l={type:"scrollstart",current:{x:r,y:t},request:{x:e,y:o},end:{x:w.newscrollx,y:w.newscrolly},speed:s};w.onscrollstart.call(w,l)}S.transitionend?w.scrollendtrapped||(w.scrollendtrapped=!0,w.bind(w.doc,S.transitionend,w.onScrollTransitionEnd,!1)):(w.scrollendtrapped&&clearTimeout(w.scrollendtrapped),w.scrollendtrapped=setTimeout(w.onScrollTransitionEnd,s));var a=t,c=r;w.timerscroll={bz:new T(a,w.newscrolly,s,0,0,.58,1),bh:new T(c,w.newscrollx,s,0,0,.58,1)},w.cursorfreezed||(w.timerscroll.tm=setInterval(function(){w.showCursor(w.getScrollTop(),w.getScrollLeft())},60))}w.synched("doScroll-set",function(){w.timer=0,w.scrollendtrapped&&(w.scrollrunning=!0),w.setScrollTop(w.newscrolly),w.setScrollLeft(w.newscrollx),w.scrollendtrapped||w.onScrollTransitionEnd()})},50)))},this.cancelScroll=function(){if(!w.scrollendtrapped)return!0;var e=w.getScrollTop(),o=w.getScrollLeft();return w.scrollrunning=!1,S.transitionend||clearTimeout(S.transitionend),w.scrollendtrapped=!1,w._unbind(w.doc[0],S.transitionend,w.onScrollTransitionEnd),w.prepareTransition(0),w.setScrollTop(e),w.railh&&w.setScrollLeft(o),w.timerscroll&&w.timerscroll.tm&&clearInterval(w.timerscroll.tm),w.timerscroll=!1,w.cursorfreezed=!1,w.showCursor(e,o),w},this.onScrollTransitionEnd=function(){w.scrollendtrapped&&w._unbind(w.doc[0],S.transitionend,w.onScrollTransitionEnd),w.scrollendtrapped=!1,w.prepareTransition(0),w.timerscroll&&w.timerscroll.tm&&clearInterval(w.timerscroll.tm),w.timerscroll=!1;var e=w.getScrollTop(),o=w.getScrollLeft();return w.setScrollTop(e),w.railh&&w.setScrollLeft(o),w.noticeCursor(!1,e,o),w.cursorfreezed=!1,e<0?e=0:e>w.page.maxh&&(e=w.page.maxh),o<0?o=0:o>w.page.maxw&&(o=w.page.maxw),e!=w.newscrolly||o!=w.newscrollx?w.doScrollPos(o,e,w.opt.snapbackspeed):(w.onscrollend&&w.scrollrunning&&w.triggerScrollEnd(),void(w.scrollrunning=!1))}):(this.doScrollLeft=function(e,o){var t=w.scrollrunning?w.newscrolly:w.getScrollTop();w.doScrollPos(e,t,o)},this.doScrollTop=function(e,o){var t=w.scrollrunning?w.newscrollx:w.getScrollLeft();w.doScrollPos(t,e,o)},this.doScrollPos=function(e,o,t){function r(){if(w.cancelAnimationFrame)return!0;if(w.scrollrunning=!0,h=1-h)return w.timer=c(r)||1;var e=0,o,t,i=t=w.getScrollTop();if(w.dst.ay){i=w.bzscroll?w.dst.py+w.bzscroll.getNow()*w.dst.ay:w.newscrolly;var n=i-t;(n<0&&i<w.newscrolly||n>0&&i>w.newscrolly)&&(i=w.newscrolly),w.setScrollTop(i),i==w.newscrolly&&(e=1)}else e=1;var s=o=w.getScrollLeft();if(w.dst.ax){s=w.bzscroll?w.dst.px+w.bzscroll.getNow()*w.dst.ax:w.newscrollx;var n=s-o;(n<0&&s<w.newscrollx||n>0&&s>w.newscrollx)&&(s=w.newscrollx),w.setScrollLeft(s),s==w.newscrollx&&(e+=1)}else e+=1;2==e?(w.timer=0,w.cursorfreezed=!1,w.bzscroll=!1,w.scrollrunning=!1,i<0?i=0:i>w.page.maxh&&(i=Math.max(0,w.page.maxh)),s<0?s=0:s>w.page.maxw&&(s=w.page.maxw),s!=w.newscrollx||i!=w.newscrolly?w.doScrollPos(s,i):w.onscrollend&&w.triggerScrollEnd()):w.timer=c(r)||1}var o=void 0===o||o===!1?w.getScrollTop(!0):o;if(w.timer&&w.newscrolly==o&&w.newscrollx==e)return!0;w.timer&&d(w.timer),w.timer=0;var i=w.getScrollTop(),n=w.getScrollLeft();((w.newscrolly-i)*(o-i)<0||(w.newscrollx-n)*(e-n)<0)&&w.cancelScroll(),w.newscrolly=o,w.newscrollx=e,w.bouncescroll&&w.rail.visibility||(w.newscrolly<0?w.newscrolly=0:w.newscrolly>w.page.maxh&&(w.newscrolly=w.page.maxh)),w.bouncescroll&&w.railh.visibility||(w.newscrollx<0?w.newscrollx=0:w.newscrollx>w.page.maxw&&(w.newscrollx=w.page.maxw)),w.dst={},w.dst.x=e-n,w.dst.y=o-i,w.dst.px=n,w.dst.py=i;var s=Math.round(Math.sqrt(Math.pow(w.dst.x,2)+Math.pow(w.dst.y,2)));w.dst.ax=w.dst.x/s,w.dst.ay=w.dst.y/s;var l=0,a=s;0==w.dst.x?(l=i,a=o,w.dst.ay=1,w.dst.py=0):0==w.dst.y&&(l=n,a=e,w.dst.ax=1,w.dst.px=0);var u=w.getTransitionSpeed(s);if(t&&t<=1&&(u*=t),u>0?w.bzscroll=w.bzscroll?w.bzscroll.update(a,u):new T(l,a,u,0,1,0,1):w.bzscroll=!1,!w.timer){(i==w.page.maxh&&o>=w.page.maxh||n==w.page.maxw&&e>=w.page.maxw)&&w.checkContentSize();var h=1;if(w.cancelAnimationFrame=!1,w.timer=1,w.onscrollstart&&!w.scrollrunning){var p={type:"scrollstart",current:{x:n,y:i},request:{x:e,y:o},end:{x:w.newscrollx,y:w.newscrolly},speed:u};w.onscrollstart.call(w,p)}r(),(i==w.page.maxh&&o>=i||n==w.page.maxw&&e>=n)&&w.checkContentSize(),w.noticeCursor()}},this.cancelScroll=function(){return w.timer&&d(w.timer),w.timer=0,w.bzscroll=!1,w.scrollrunning=!1,w}):(this.doScrollLeft=function(e,o){var t=w.getScrollTop();w.doScrollPos(e,t,o)},this.doScrollTop=function(e,o){var t=w.getScrollLeft();w.doScrollPos(t,e,o)},this.doScrollPos=function(e,o,t){var r=e>w.page.maxw?w.page.maxw:e;r<0&&(r=0);var i=o>w.page.maxh?w.page.maxh:o;i<0&&(i=0),w.synched("scroll",function(){w.setScrollTop(i),w.setScrollLeft(r)})},this.cancelScroll=function(){}),this.doScrollBy=function(e,o){var t=0;if(o)t=Math.floor((w.scroll.y-e)*w.scrollratio.y);else{var r=w.timer?w.newscrolly:w.getScrollTop(!0);t=r-e}if(w.bouncescroll){var i=Math.round(w.view.h/2);t<-i?t=-i:t>w.page.maxh+i&&(t=w.page.maxh+i)}w.cursorfreezed=!1;var n=w.getScrollTop(!0);return t<0&&n<=0?w.noticeCursor():t>w.page.maxh&&n>=w.page.maxh?(w.checkContentSize(),w.noticeCursor()):void w.doScrollTop(t)},this.doScrollLeftBy=function(e,o){var t=0;if(o)t=Math.floor((w.scroll.x-e)*w.scrollratio.x);else{var r=w.timer?w.newscrollx:w.getScrollLeft(!0);t=r-e}if(w.bouncescroll){var i=Math.round(w.view.w/2);t<-i?t=-i:t>w.page.maxw+i&&(t=w.page.maxw+i)}w.cursorfreezed=!1;var n=w.getScrollLeft(!0);return t<0&&n<=0?w.noticeCursor():t>w.page.maxw&&n>=w.page.maxw?w.noticeCursor():void w.doScrollLeft(t)},this.doScrollTo=function(e,o){var t=o?Math.round(e*w.scrollratio.y):e;t<0?t=0:t>w.page.maxh&&(t=w.page.maxh),w.cursorfreezed=!1,w.doScrollTop(e)},this.checkContentSize=function(){var e=w.getContentSize();e.h==w.page.h&&e.w==w.page.w||w.resize(!1,e)},w.onscroll=function(e){w.rail.drag||w.cursorfreezed||w.synched("scroll",function(){w.scroll.y=Math.round(w.getScrollTop()*(1/w.scrollratio.y)),w.railh&&(w.scroll.x=Math.round(w.getScrollLeft()*(1/w.scrollratio.x))),w.noticeCursor()})},w.bind(w.docscroll,"scroll",w.onscroll),this.doZoomIn=function(e){if(!w.zoomactive){w.zoomactive=!0,w.zoomrestore={style:{}};var o=["position","top","left","zIndex","backgroundColor","marginTop","marginBottom","marginLeft","marginRight"],t=w.win[0].style;for(var r in o){var i=o[r];w.zoomrestore.style[i]=void 0!==t[i]?t[i]:""}w.zoomrestore.style.width=w.win.css("width"),w.zoomrestore.style.height=w.win.css("height"),w.zoomrestore.padding={w:w.win.outerWidth()-w.win.width(),h:w.win.outerHeight()-w.win.height()},S.isios4&&(w.zoomrestore.scrollTop=$(window).scrollTop(),$(window).scrollTop(0)),w.win.css({position:S.isios4?"absolute":"fixed",top:0,left:0,zIndex:l+100,margin:0});var n=w.win.css("backgroundColor");return(""==n||/transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(n))&&w.win.css("backgroundColor","#fff"),w.rail.css({zIndex:l+101}),w.zoom.css({zIndex:l+102}),w.zoom.css("backgroundPosition","0px -18px"),w.resizeZoom(),w.onzoomin&&w.onzoomin.call(w),w.cancelEvent(e)}},this.doZoomOut=function(e){if(w.zoomactive)return w.zoomactive=!1,w.win.css("margin",""),w.win.css(w.zoomrestore.style),S.isios4&&$(window).scrollTop(w.zoomrestore.scrollTop),w.rail.css({"z-index":w.zindex}),w.zoom.css({"z-index":w.zindex}),w.zoomrestore=!1,w.zoom.css("backgroundPosition","0px 0px"),w.onResize(),w.onzoomout&&w.onzoomout.call(w),w.cancelEvent(e)},this.doZoom=function(e){return w.zoomactive?w.doZoomOut(e):w.doZoomIn(e)},this.resizeZoom=function(){if(w.zoomactive){var e=w.getScrollTop();w.win.css({width:$(window).width()-w.zoomrestore.padding.w+"px",height:$(window).height()-w.zoomrestore.padding.h+"px"}),w.onResize(),w.setScrollTop(Math.min(w.page.maxh,e))}},this.init(),$.nicescroll.push(this)},v=function(e){var o=this;this.nc=e,this.lastx=0,this.lasty=0,this.speedx=0,this.speedy=0,this.lasttime=0,this.steptime=0,this.snapx=!1,this.snapy=!1,this.demulx=0,this.demuly=0,this.lastscrollx=-1,this.lastscrolly=-1,this.chkx=0,this.chky=0,this.timer=0,this.time=function(){return+new Date},this.reset=function(e,t){o.stop();var r=o.time();o.steptime=0,o.lasttime=r,o.speedx=0,o.speedy=0,o.lastx=e,o.lasty=t,o.lastscrollx=-1,o.lastscrolly=-1},this.update=function(e,t){var r=o.time();o.steptime=r-o.lasttime,o.lasttime=r;var i=t-o.lasty,n=e-o.lastx,s=o.nc.getScrollTop(),l=o.nc.getScrollLeft(),a=s+i,c=l+n;o.snapx=c<0||c>o.nc.page.maxw,o.snapy=a<0||a>o.nc.page.maxh,o.speedx=n,o.speedy=i,o.lastx=e,o.lasty=t},this.stop=function(){o.nc.unsynched("domomentum2d"),o.timer&&clearTimeout(o.timer),o.timer=0,o.lastscrollx=-1,o.lastscrolly=-1},this.doSnapy=function(e,t){var r=!1;t<0?(t=0,r=!0):t>o.nc.page.maxh&&(t=o.nc.page.maxh,r=!0),e<0?(e=0,r=!0):e>o.nc.page.maxw&&(e=o.nc.page.maxw,r=!0),r?o.nc.doScrollPos(e,t,o.nc.opt.snapbackspeed):o.nc.triggerScrollEnd()},this.doMomentum=function(e){var t=o.time(),r=e?t+e:o.lasttime,i=o.nc.getScrollLeft(),n=o.nc.getScrollTop(),s=o.nc.page.maxh,l=o.nc.page.maxw;o.speedx=l>0?Math.min(60,o.speedx):0,o.speedy=s>0?Math.min(60,o.speedy):0;var a=r&&t-r<=60;(n<0||n>s||i<0||i>l)&&(a=!1);var c=!(!o.speedy||!a)&&o.speedy,d=!(!o.speedx||!a)&&o.speedx;if(c||d){var u=Math.max(16,o.steptime);if(u>50){var h=u/50;o.speedx*=h,o.speedy*=h,u=50}o.demulxy=0,o.lastscrollx=o.nc.getScrollLeft(),o.chkx=o.lastscrollx,o.lastscrolly=o.nc.getScrollTop(),o.chky=o.lastscrolly;var p=o.lastscrollx,m=o.lastscrolly,f=function(){var e=o.time()-t>600?.04:.02;o.speedx&&(p=Math.floor(o.lastscrollx-o.speedx*(1-o.demulxy)),o.lastscrollx=p,(p<0||p>l)&&(e=.1)),o.speedy&&(m=Math.floor(o.lastscrolly-o.speedy*(1-o.demulxy)),o.lastscrolly=m,(m<0||m>s)&&(e=.1)),o.demulxy=Math.min(1,o.demulxy+e),o.nc.synched("domomentum2d",function(){if(o.speedx){var e=o.nc.getScrollLeft();o.chkx=p,o.nc.setScrollLeft(p)}if(o.speedy){var t=o.nc.getScrollTop();o.chky=m,o.nc.setScrollTop(m)}o.timer||(o.nc.hideCursor(),o.doSnapy(p,m))}),o.demulxy<1?o.timer=setTimeout(f,u):(o.stop(),o.nc.hideCursor(),o.doSnapy(p,m))};f()}else o.doSnapy(o.nc.getScrollLeft(),o.nc.getScrollTop())}},b=e.fn.scrollTop;e.cssHooks.pageYOffset={get:function(e,o,t){var r=$.data(e,"__nicescroll")||!1;return r&&r.ishwscroll?r.getScrollTop():b.call(e)},set:function(e,o){var t=$.data(e,"__nicescroll")||!1;return t&&t.ishwscroll?t.setScrollTop(parseInt(o)):b.call(e,o),this}},e.fn.scrollTop=function(e){if(void 0===e){var o=!!this[0]&&($.data(this[0],"__nicescroll")||!1);return o&&o.ishwscroll?o.getScrollTop():b.call(this)}return this.each(function(){var o=$.data(this,"__nicescroll")||!1;o&&o.ishwscroll?o.setScrollTop(parseInt(e)):b.call($(this),e)})};var y=e.fn.scrollLeft;$.cssHooks.pageXOffset={get:function(e,o,t){var r=$.data(e,"__nicescroll")||!1;return r&&r.ishwscroll?r.getScrollLeft():y.call(e)},set:function(e,o){var t=$.data(e,"__nicescroll")||!1;return t&&t.ishwscroll?t.setScrollLeft(parseInt(o)):y.call(e,o),this}},e.fn.scrollLeft=function(e){if(void 0===e){var o=!!this[0]&&($.data(this[0],"__nicescroll")||!1);return o&&o.ishwscroll?o.getScrollLeft():y.call(this)}return this.each(function(){var o=$.data(this,"__nicescroll")||!1;o&&o.ishwscroll?o.setScrollLeft(parseInt(e)):y.call($(this),e)})};var x=function(e){var o=this;if(this.length=0,this.name="nicescrollarray",this.each=function(e){return $.each(o,e),o},this.push=function(e){o[o.length]=e,o.length++},this.eq=function(e){return o[e]},e)for(var t=0;t<e.length;t++){var r=$.data(e[t],"__nicescroll")||!1;r&&(this[this.length]=r,this.length++)}return this};t(x.prototype,["show","hide","toggle","onResize","resize","remove","stop","doScrollPos"],function(e,o){e[o]=function(){var e=arguments;return this.each(function(){this[o].apply(this,e)})}}),e.fn.getNiceScroll=function(e){return void 0===e?new x(this):this[e]&&$.data(this[e],"__nicescroll")||!1},e.expr[":"].nicescroll=function(e){return void 0!==$.data(e,"__nicescroll")},$.fn.niceScroll=function(e,o){void 0!==o||"object"!=typeof e||"jquery"in e||(o=e,e=!1),o=$.extend({},o);var t=new x;void 0===o&&(o={}),e&&(o.doc=$(e),o.win=$(this));var r=!("doc"in o);return r||"win"in o||(o.win=$(this)),this.each(function(){var e=$(this).data("__nicescroll")||!1;e||(o.doc=r?$(this):o.doc,e=new w(o,$(this)),$(this).data("__nicescroll",e)),t.push(e)}),1==t.length?t[0]:t},window.NiceScroll={getjQuery:function(){return e}},$.nicescroll||($.nicescroll=new x,$.nicescroll.options=m)}),jQuery(document).ready(function($){function e(){var e=$("body").attr("data-smooth-scrolling-hide");1==e?$("html").niceScroll({
scrollspeed:60,mousescrollstep:40,cursorwidth:12,cursorborder:0,cursorcolor:"#313131",cursorborderradius:6,autohidemode:!0,horizrailenabled:!1}):$("html").niceScroll({scrollspeed:60,mousescrollstep:40,cursorwidth:12,cursorborder:0,cursorcolor:"#313131",cursorborderradius:6,autohidemode:!1,horizrailenabled:!1}),$("html").addClass("no-overflow-y")}var o=$("body").attr("data-smooth-scrolling");1==o&&!kt_isMobile.any()&&$(window).width()>690&&$("body").outerHeight(!0)>$(window).height()?(e(),$("a[rel^='lightbox']").on("mfpAfterClose",function(e){$("html").css("overflow","hidden")})):$("body").attr("data-smooth-scrolling","0")});;
