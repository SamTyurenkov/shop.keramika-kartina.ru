if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(t){"use strict";var e=t.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1||e[0]>3)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(jQuery),function(t){"use strict";function e(e,o){return this.each(function(){var s=t(this),n=s.data("bs.modal"),r=t.extend({},i.DEFAULTS,s.data(),"object"==typeof e&&e);n||s.data("bs.modal",n=new i(this,r)),"string"==typeof e?n[e](o):r.show&&n.show(o)})}var i=function(e,i){this.options=i,this.$body=t(document.body),this.$element=t(e),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,t.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};i.VERSION="3.3.7",i.TRANSITION_DURATION=300,i.BACKDROP_TRANSITION_DURATION=150,i.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},i.prototype.toggle=function(t){return this.isShown?this.hide():this.show(t)},i.prototype.show=function(e){var o=this,s=t.Event("show.bs.modal",{relatedTarget:e});this.$element.trigger(s),this.isShown||s.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',t.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){o.$element.one("mouseup.dismiss.bs.modal",function(e){t(e.target).is(o.$element)&&(o.ignoreBackdropClick=!0)})}),this.backdrop(function(){var s=t.support.transition&&o.$element.hasClass("fade");o.$element.parent().length||o.$element.appendTo(o.$body),o.$element.show().scrollTop(0),o.adjustDialog(),s&&o.$element[0].offsetWidth,o.$element.addClass("in"),o.enforceFocus();var n=t.Event("shown.bs.modal",{relatedTarget:e});s?o.$dialog.one("bsTransitionEnd",function(){o.$element.trigger("focus").trigger(n)}).emulateTransitionEnd(i.TRANSITION_DURATION):o.$element.trigger("focus").trigger(n)}))},i.prototype.hide=function(e){e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",t.proxy(this.hideModal,this)).emulateTransitionEnd(i.TRANSITION_DURATION):this.hideModal())},i.prototype.enforceFocus=function(){t(document).off("focusin.bs.modal").on("focusin.bs.modal",t.proxy(function(t){document===t.target||this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.trigger("focus")},this))},i.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",t.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},i.prototype.resize=function(){this.isShown?t(window).on("resize.bs.modal",t.proxy(this.handleUpdate,this)):t(window).off("resize.bs.modal")},i.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.$body.removeClass("modal-open"),t.resetAdjustments(),t.resetScrollbar(),t.$element.trigger("hidden.bs.modal")})},i.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},i.prototype.backdrop=function(e){var o=this,s=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var n=t.support.transition&&s;if(this.$backdrop=t(document.createElement("div")).addClass("modal-backdrop "+s).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",t.proxy(function(t){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),n&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!e)return;n?this.$backdrop.one("bsTransitionEnd",e).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION):e()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var r=function(){o.removeBackdrop(),e&&e()};t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",r).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION):r()}else e&&e()},i.prototype.handleUpdate=function(){this.adjustDialog()},i.prototype.adjustDialog=function(){var t=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&t?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!t?this.scrollbarWidth:""})},i.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},i.prototype.checkScrollbar=function(){var t=window.innerWidth;if(!t){var e=document.documentElement.getBoundingClientRect();t=e.right-Math.abs(e.left)}this.bodyIsOverflowing=document.body.clientWidth<t,this.scrollbarWidth=this.measureScrollbar()},i.prototype.setScrollbar=function(){var t=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",t+this.scrollbarWidth)},i.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},i.prototype.measureScrollbar=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",this.$body.append(t);var e=t.offsetWidth-t.clientWidth;return this.$body[0].removeChild(t),e};var o=t.fn.modal;t.fn.modal=e,t.fn.modal.Constructor=i,t.fn.modal.noConflict=function(){return t.fn.modal=o,this},t(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(i){var o=t(this),s=o.attr("href"),n=t(o.attr("data-target")||s&&s.replace(/.*(?=#[^\s]+$)/,"")),r=n.data("bs.modal")?"toggle":t.extend({remote:!/#/.test(s)&&s},n.data(),o.data());o.is("a")&&i.preventDefault(),n.one("show.bs.modal",function(t){t.isDefaultPrevented()||n.one("hidden.bs.modal",function(){o.is(":visible")&&o.trigger("focus")})}),e.call(n,r,this)})}(jQuery),function(t){"use strict";function e(e){return this.each(function(){var o=t(this),s=o.data("bs.tooltip"),n="object"==typeof e&&e;!s&&/destroy|hide/.test(e)||(s||o.data("bs.tooltip",s=new i(this,n)),"string"==typeof e&&s[e]())})}var i=function(t,e){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",t,e)};i.VERSION="3.3.7",i.TRANSITION_DURATION=150,i.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},i.prototype.init=function(e,i,o){if(this.enabled=!0,this.type=e,this.$element=t(i),this.options=this.getOptions(o),this.$viewport=this.options.viewport&&t(t.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var s=this.options.trigger.split(" "),n=s.length;n--;){var r=s[n];if("click"==r)this.$element.on("click."+this.type,this.options.selector,t.proxy(this.toggle,this));else if("manual"!=r){var a="hover"==r?"mouseenter":"focusin",l="hover"==r?"mouseleave":"focusout";this.$element.on(a+"."+this.type,this.options.selector,t.proxy(this.enter,this)),this.$element.on(l+"."+this.type,this.options.selector,t.proxy(this.leave,this))}}this.options.selector?this._options=t.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},i.prototype.getDefaults=function(){return i.DEFAULTS},i.prototype.getOptions=function(e){return e=t.extend({},this.getDefaults(),this.$element.data(),e),e.delay&&"number"==typeof e.delay&&(e.delay={show:e.delay,hide:e.delay}),e},i.prototype.getDelegateOptions=function(){var e={},i=this.getDefaults();return this._options&&t.each(this._options,function(t,o){i[t]!=o&&(e[t]=o)}),e},i.prototype.enter=function(e){var i=e instanceof this.constructor?e:t(e.currentTarget).data("bs."+this.type);return i||(i=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,i)),e instanceof t.Event&&(i.inState["focusin"==e.type?"focus":"hover"]=!0),i.tip().hasClass("in")||"in"==i.hoverState?void(i.hoverState="in"):(clearTimeout(i.timeout),i.hoverState="in",i.options.delay&&i.options.delay.show?void(i.timeout=setTimeout(function(){"in"==i.hoverState&&i.show()},i.options.delay.show)):i.show())},i.prototype.isInStateTrue=function(){for(var t in this.inState)if(this.inState[t])return!0;return!1},i.prototype.leave=function(e){var i=e instanceof this.constructor?e:t(e.currentTarget).data("bs."+this.type);return i||(i=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,i)),e instanceof t.Event&&(i.inState["focusout"==e.type?"focus":"hover"]=!1),i.isInStateTrue()?void 0:(clearTimeout(i.timeout),i.hoverState="out",i.options.delay&&i.options.delay.hide?void(i.timeout=setTimeout(function(){"out"==i.hoverState&&i.hide()},i.options.delay.hide)):i.hide())},i.prototype.show=function(){var e=t.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(e);var o=t.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(e.isDefaultPrevented()||!o)return;var s=this,n=this.tip(),r=this.getUID(this.type);this.setContent(),n.attr("id",r),this.$element.attr("aria-describedby",r),this.options.animation&&n.addClass("fade");var a="function"==typeof this.options.placement?this.options.placement.call(this,n[0],this.$element[0]):this.options.placement,l=/\s?auto?\s?/i,h=l.test(a);h&&(a=a.replace(l,"")||"top"),n.detach().css({top:0,left:0,display:"block"}).addClass(a).data("bs."+this.type,this),this.options.container?n.appendTo(this.options.container):n.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var p=this.getPosition(),d=n[0].offsetWidth,c=n[0].offsetHeight;if(h){var f=a,u=this.getPosition(this.$viewport);a="bottom"==a&&p.bottom+c>u.bottom?"top":"top"==a&&p.top-c<u.top?"bottom":"right"==a&&p.right+d>u.width?"left":"left"==a&&p.left-d<u.left?"right":a,n.removeClass(f).addClass(a)}var g=this.getCalculatedOffset(a,p,d,c);this.applyPlacement(g,a);var m=function(){var t=s.hoverState;s.$element.trigger("shown.bs."+s.type),s.hoverState=null,"out"==t&&s.leave(s)};t.support.transition&&this.$tip.hasClass("fade")?n.one("bsTransitionEnd",m).emulateTransitionEnd(i.TRANSITION_DURATION):m()}},i.prototype.applyPlacement=function(e,i){var o=this.tip(),s=o[0].offsetWidth,n=o[0].offsetHeight,r=parseInt(o.css("margin-top"),10),a=parseInt(o.css("margin-left"),10);isNaN(r)&&(r=0),isNaN(a)&&(a=0),e.top+=r,e.left+=a,t.offset.setOffset(o[0],t.extend({using:function(t){o.css({top:Math.round(t.top),left:Math.round(t.left)})}},e),0),o.addClass("in");var l=o[0].offsetWidth,h=o[0].offsetHeight;"top"==i&&h!=n&&(e.top=e.top+n-h);var p=this.getViewportAdjustedDelta(i,e,l,h);p.left?e.left+=p.left:e.top+=p.top;var d=/top|bottom/.test(i),c=d?2*p.left-s+l:2*p.top-n+h,f=d?"offsetWidth":"offsetHeight";o.offset(e),this.replaceArrow(c,o[0][f],d)},i.prototype.replaceArrow=function(t,e,i){this.arrow().css(i?"left":"top",50*(1-t/e)+"%").css(i?"top":"left","")},i.prototype.setContent=function(){var t=this.tip(),e=this.getTitle();t.find(".tooltip-inner")[this.options.html?"html":"text"](e),t.removeClass("fade in top bottom left right")},i.prototype.hide=function(e){function o(){"in"!=s.hoverState&&n.detach(),s.$element&&s.$element.removeAttr("aria-describedby").trigger("hidden.bs."+s.type),e&&e()}var s=this,n=t(this.$tip),r=t.Event("hide.bs."+this.type);return this.$element.trigger(r),r.isDefaultPrevented()?void 0:(n.removeClass("in"),t.support.transition&&n.hasClass("fade")?n.one("bsTransitionEnd",o).emulateTransitionEnd(i.TRANSITION_DURATION):o(),this.hoverState=null,this)},i.prototype.fixTitle=function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("data-original-title"))&&t.attr("data-original-title",t.attr("title")||"").attr("title","")},i.prototype.hasContent=function(){return this.getTitle()},i.prototype.getPosition=function(e){e=e||this.$element;var i=e[0],o="BODY"==i.tagName,s=i.getBoundingClientRect();null==s.width&&(s=t.extend({},s,{width:s.right-s.left,height:s.bottom-s.top}));var n=window.SVGElement&&i instanceof window.SVGElement,r=o?{top:0,left:0}:n?null:e.offset(),a={scroll:o?document.documentElement.scrollTop||document.body.scrollTop:e.scrollTop()},l=o?{width:t(window).width(),height:t(window).height()}:null;return t.extend({},s,a,l,r)},i.prototype.getCalculatedOffset=function(t,e,i,o){return"bottom"==t?{top:e.top+e.height,left:e.left+e.width/2-i/2}:"top"==t?{top:e.top-o,left:e.left+e.width/2-i/2}:"left"==t?{top:e.top+e.height/2-o/2,left:e.left-i}:{top:e.top+e.height/2-o/2,left:e.left+e.width}},i.prototype.getViewportAdjustedDelta=function(t,e,i,o){var s={top:0,left:0};if(!this.$viewport)return s;var n=this.options.viewport&&this.options.viewport.padding||0,r=this.getPosition(this.$viewport);if(/right|left/.test(t)){var a=e.top-n-r.scroll,l=e.top+n-r.scroll+o;a<r.top?s.top=r.top-a:l>r.top+r.height&&(s.top=r.top+r.height-l)}else{var h=e.left-n,p=e.left+n+i;h<r.left?s.left=r.left-h:p>r.right&&(s.left=r.left+r.width-p)}return s},i.prototype.getTitle=function(){var t,e=this.$element,i=this.options;return t=e.attr("data-original-title")||("function"==typeof i.title?i.title.call(e[0]):i.title)},i.prototype.getUID=function(t){do{t+=~~(1e6*Math.random())}while(document.getElementById(t));return t},i.prototype.tip=function(){if(!this.$tip&&(this.$tip=t(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},i.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},i.prototype.enable=function(){this.enabled=!0},i.prototype.disable=function(){this.enabled=!1},i.prototype.toggleEnabled=function(){this.enabled=!this.enabled},i.prototype.toggle=function(e){var i=this;e&&((i=t(e.currentTarget).data("bs."+this.type))||(i=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,i))),e?(i.inState.click=!i.inState.click,i.isInStateTrue()?i.enter(i):i.leave(i)):i.tip().hasClass("in")?i.leave(i):i.enter(i)},i.prototype.destroy=function(){var t=this;clearTimeout(this.timeout),this.hide(function(){t.$element.off("."+t.type).removeData("bs."+t.type),t.$tip&&t.$tip.detach(),t.$tip=null,t.$arrow=null,t.$viewport=null,t.$element=null})};var o=t.fn.tooltip;t.fn.tooltip=e,t.fn.tooltip.Constructor=i,t.fn.tooltip.noConflict=function(){return t.fn.tooltip=o,this}}(jQuery),function(t){"use strict";function e(e){return this.each(function(){var o=t(this),s=o.data("bs.popover"),n="object"==typeof e&&e;!s&&/destroy|hide/.test(e)||(s||o.data("bs.popover",s=new i(this,n)),"string"==typeof e&&s[e]())})}var i=function(t,e){this.init("popover",t,e)};if(!t.fn.tooltip)throw new Error("Popover requires tooltip.js");i.VERSION="3.3.7",i.DEFAULTS=t.extend({},t.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),i.prototype=t.extend({},t.fn.tooltip.Constructor.prototype),i.prototype.constructor=i,i.prototype.getDefaults=function(){return i.DEFAULTS},i.prototype.setContent=function(){var t=this.tip(),e=this.getTitle(),i=this.getContent();t.find(".popover-title")[this.options.html?"html":"text"](e),t.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof i?"html":"append":"text"](i),t.removeClass("fade top bottom left right in"),t.find(".popover-title").html()||t.find(".popover-title").hide()},i.prototype.hasContent=function(){return this.getTitle()||this.getContent()},i.prototype.getContent=function(){var t=this.$element,e=this.options;return t.attr("data-content")||("function"==typeof e.content?e.content.call(t[0]):e.content)},i.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var o=t.fn.popover;t.fn.popover=e,t.fn.popover.Constructor=i,t.fn.popover.noConflict=function(){return t.fn.popover=o,this}}(jQuery),function(t){"use strict";function e(e){return this.each(function(){var o=t(this),s=o.data("bs.tab");s||o.data("bs.tab",s=new i(this)),"string"==typeof e&&s[e]()})}var i=function(e){this.element=t(e)};i.VERSION="3.3.7",i.TRANSITION_DURATION=150,i.prototype.show=function(){var e=this.element,i=e.closest("ul:not(.dropdown-menu)"),o=e.data("target");if(o||(o=e.attr("href"),o=o&&o.replace(/.*(?=#[^\s]*$)/,"")),!e.parent("li").hasClass("active")){var s=i.find(".active:last a"),n=t.Event("hide.bs.tab",{relatedTarget:e[0]}),r=t.Event("show.bs.tab",{relatedTarget:s[0]});if(s.trigger(n),e.trigger(r),!r.isDefaultPrevented()&&!n.isDefaultPrevented()){var a=t(o);this.activate(e.closest("li"),i),this.activate(a,a.parent(),function(){s.trigger({type:"hidden.bs.tab",relatedTarget:e[0]}),e.trigger({type:"shown.bs.tab",relatedTarget:s[0]})})}}},i.prototype.activate=function(e,o,s){function n(){r.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),e.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),a?(e[0].offsetWidth,e.addClass("in")):e.removeClass("fade"),e.parent(".dropdown-menu").length&&e.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),s&&s()}var r=o.find("> .active"),a=s&&t.support.transition&&(r.length&&r.hasClass("fade")||!!o.find("> .fade").length);r.length&&a?r.one("bsTransitionEnd",n).emulateTransitionEnd(i.TRANSITION_DURATION):n(),r.removeClass("in")};var o=t.fn.tab;t.fn.tab=e,t.fn.tab.Constructor=i,t.fn.tab.noConflict=function(){return t.fn.tab=o,this};var s=function(i){i.preventDefault(),e.call(t(this),"show")};t(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',s).on("click.bs.tab.data-api",'[data-toggle="pill"]',s)}(jQuery),function(t){"use strict";function e(e){return this.each(function(){var o=t(this),s=o.data("bs.affix"),n="object"==typeof e&&e;s||o.data("bs.affix",s=new i(this,n)),"string"==typeof e&&s[e]()})}var i=function(e,o){this.options=t.extend({},i.DEFAULTS,o),this.$target=t(this.options.target).on("scroll.bs.affix.data-api",t.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",t.proxy(this.checkPositionWithEventLoop,this)),this.$element=t(e),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};i.VERSION="3.3.7",i.RESET="affix affix-top affix-bottom",i.DEFAULTS={offset:0,target:window},i.prototype.getState=function(t,e,i,o){var s=this.$target.scrollTop(),n=this.$element.offset(),r=this.$target.height();if(null!=i&&"top"==this.affixed)return i>s&&"top";if("bottom"==this.affixed)return null!=i?!(s+this.unpin<=n.top)&&"bottom":!(t-o>=s+r)&&"bottom";var a=null==this.affixed,l=a?s:n.top,h=a?r:e;return null!=i&&i>=s?"top":null!=o&&l+h>=t-o&&"bottom"},i.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(i.RESET).addClass("affix");var t=this.$target.scrollTop(),e=this.$element.offset();return this.pinnedOffset=e.top-t},i.prototype.checkPositionWithEventLoop=function(){setTimeout(t.proxy(this.checkPosition,this),1)},i.prototype.checkPosition=function(){if(this.$element.is(":visible")){var e=this.$element.height(),o=this.options.offset,s=o.top,n=o.bottom,r=Math.max(t(document).height(),t(document.body).height());"object"!=typeof o&&(n=s=o),"function"==typeof s&&(s=o.top(this.$element)),"function"==typeof n&&(n=o.bottom(this.$element));var a=this.getState(r,e,s,n);if(this.affixed!=a){null!=this.unpin&&this.$element.css("top","");var l="affix"+(a?"-"+a:""),h=t.Event(l+".bs.affix");if(this.$element.trigger(h),h.isDefaultPrevented())return;this.affixed=a,this.unpin="bottom"==a?this.getPinnedOffset():null,this.$element.removeClass(i.RESET).addClass(l).trigger(l.replace("affix","affixed")+".bs.affix")}"bottom"==a&&this.$element.offset({top:r-e-n})}};var o=t.fn.affix;t.fn.affix=e,t.fn.affix.Constructor=i,t.fn.affix.noConflict=function(){return t.fn.affix=o,this},t(window).on("load",function(){t('[data-spy="affix"]').each(function(){var i=t(this),o=i.data();o.offset=o.offset||{},null!=o.offsetBottom&&(o.offset.bottom=o.offsetBottom),null!=o.offsetTop&&(o.offset.top=o.offsetTop),e.call(i,o)})})}(jQuery),function(t){"use strict";function e(e){var i,o=e.attr("data-target")||(i=e.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,"");return t(o)}function i(e){return this.each(function(){var i=t(this),s=i.data("bs.collapse"),n=t.extend({},o.DEFAULTS,i.data(),"object"==typeof e&&e);!s&&n.toggle&&/show|hide/.test(e)&&(n.toggle=!1),s||i.data("bs.collapse",s=new o(this,n)),"string"==typeof e&&s[e]()})}var o=function(e,i){this.$element=t(e),this.options=t.extend({},o.DEFAULTS,i),this.$trigger=t('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};o.VERSION="3.3.7",o.TRANSITION_DURATION=350,o.DEFAULTS={toggle:!0},o.prototype.dimension=function(){return this.$element.hasClass("width")?"width":"height"},o.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var e,s=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(s&&s.length&&(e=s.data("bs.collapse"))&&e.transitioning)){var n=t.Event("show.bs.collapse");if(this.$element.trigger(n),!n.isDefaultPrevented()){s&&s.length&&(i.call(s,"hide"),e||s.data("bs.collapse",null));var r=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[r](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var a=function(){this.$element.removeClass("collapsing").addClass("collapse in")[r](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!t.support.transition)return a.call(this);var l=t.camelCase(["scroll",r].join("-"));this.$element.one("bsTransitionEnd",t.proxy(a,this)).emulateTransitionEnd(o.TRANSITION_DURATION)[r](this.$element[0][l])}}}},o.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var e=t.Event("hide.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){var i=this.dimension();this.$element[i](this.$element[i]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var s=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return t.support.transition?void this.$element[i](0).one("bsTransitionEnd",t.proxy(s,this)).emulateTransitionEnd(o.TRANSITION_DURATION):s.call(this)}}},o.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},o.prototype.getParent=function(){return t(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(t.proxy(function(i,o){var s=t(o);this.addAriaAndCollapsedClass(e(s),s)},this)).end()},o.prototype.addAriaAndCollapsedClass=function(t,e){var i=t.hasClass("in");t.attr("aria-expanded",i),e.toggleClass("collapsed",!i).attr("aria-expanded",i)};var s=t.fn.collapse;t.fn.collapse=i,t.fn.collapse.Constructor=o,t.fn.collapse.noConflict=function(){return t.fn.collapse=s,this},t(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(o){var s=t(this);s.attr("data-target")||o.preventDefault();var n=e(s),r=n.data("bs.collapse"),a=r?"toggle":s.data();i.call(n,a)})}(jQuery),function(t){"use strict";function e(i,o){this.$body=t(document.body),this.$scrollElement=t(t(i).is(document.body)?window:i),this.options=t.extend({},e.DEFAULTS,o),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",t.proxy(this.process,this)),this.refresh(),this.process()}function i(i){return this.each(function(){var o=t(this),s=o.data("bs.scrollspy"),n="object"==typeof i&&i;s||o.data("bs.scrollspy",s=new e(this,n)),"string"==typeof i&&s[i]()})}e.VERSION="3.3.7",e.DEFAULTS={offset:10},e.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},e.prototype.refresh=function(){var e=this,i="offset",o=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),t.isWindow(this.$scrollElement[0])||(i="position",o=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var e=t(this),s=e.data("target")||e.attr("href"),n=/^#./.test(s)&&t(s);return n&&n.length&&n.is(":visible")&&[[n[i]().top+o,s]]||null}).sort(function(t,e){return t[0]-e[0]}).each(function(){e.offsets.push(this[0]),e.targets.push(this[1])})},e.prototype.process=function(){var t,e=this.$scrollElement.scrollTop()+this.options.offset,i=this.getScrollHeight(),o=this.options.offset+i-this.$scrollElement.height(),s=this.offsets,n=this.targets,r=this.activeTarget;if(this.scrollHeight!=i&&this.refresh(),e>=o)return r!=(t=n[n.length-1])&&this.activate(t);if(r&&e<s[0])return this.activeTarget=null,this.clear();for(t=s.length;t--;)r!=n[t]&&e>=s[t]&&(void 0===s[t+1]||e<s[t+1])&&this.activate(n[t])},e.prototype.activate=function(e){this.activeTarget=e,this.clear();var i=this.selector+'[data-target="'+e+'"],'+this.selector+'[href="'+e+'"]',o=t(i).parents("li").addClass("active");o.parent(".dropdown-menu").length&&(o=o.closest("li.dropdown").addClass("active")),o.trigger("activate.bs.scrollspy")},e.prototype.clear=function(){t(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var o=t.fn.scrollspy;t.fn.scrollspy=i,t.fn.scrollspy.Constructor=e,t.fn.scrollspy.noConflict=function(){return t.fn.scrollspy=o,this},t(window).on("load.bs.scrollspy.data-api",function(){t('[data-spy="scroll"]').each(function(){var e=t(this);i.call(e,e.data())})})}(jQuery),function(t){"use strict";function e(){var t=document.createElement("bootstrap"),e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var i in e)if(void 0!==t.style[i])return{end:e[i]};return!1}t.fn.emulateTransitionEnd=function(e){var i=!1,o=this;t(this).one("bsTransitionEnd",function(){i=!0});var s=function(){i||t(o).trigger(t.support.transition.end)};return setTimeout(s,e),this},t(function(){t.support.transition=e(),t.support.transition&&(t.event.special.bsTransitionEnd={bindType:t.support.transition.end,delegateType:t.support.transition.end,handle:function(e){return t(e.target).is(this)?e.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery);;
/* 
 * Slick Slider
 * Licensed under MIT
 */
!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof exports?module.exports=t(require("jquery")):t(jQuery)}(function(p){"use strict";var a=window.Slick||{};(a=function(){function t(t,e){var i,o=this;o.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:p(t),appendDots:p(t),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(t,e){return p('<button type="button" data-role="none" role="button" tabindex="0" />').text(e+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},o.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},p.extend(o,o.initials),o.activeBreakpoint=null,o.animType=null,o.animProp=null,o.breakpoints=[],o.breakpointSettings=[],o.cssTransitions=!1,o.focussed=!1,o.interrupted=!1,o.hidden="hidden",o.paused=!0,o.positionProp=null,o.respondTo=null,o.rowCount=1,o.shouldClick=!0,o.$slider=p(t),o.$slidesCache=null,o.transformType=null,o.transitionType=null,o.visibilityChange="visibilitychange",o.windowWidth=0,o.windowTimer=null,i=p(t).data("slick")||{},o.options=p.extend({},o.defaults,e,i),o.currentSlide=o.options.initialSlide,o.originalSettings=o.options,void 0!==document.mozHidden?(o.hidden="mozHidden",o.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(o.hidden="webkitHidden",o.visibilityChange="webkitvisibilitychange"),o.autoPlay=p.proxy(o.autoPlay,o),o.autoPlayClear=p.proxy(o.autoPlayClear,o),o.autoPlayIterator=p.proxy(o.autoPlayIterator,o),o.changeSlide=p.proxy(o.changeSlide,o),o.clickHandler=p.proxy(o.clickHandler,o),o.selectHandler=p.proxy(o.selectHandler,o),o.setPosition=p.proxy(o.setPosition,o),o.swipeHandler=p.proxy(o.swipeHandler,o),o.dragHandler=p.proxy(o.dragHandler,o),o.keyHandler=p.proxy(o.keyHandler,o),o.instanceUid=n++,o.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,o.registerBreakpoints(),o.init(!0)}var n=0;return t}()).prototype.activateADA=function(){var t;this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},a.prototype.addSlide=a.prototype.slickAdd=function(t,e,i){var o=this;if("boolean"==typeof e)i=e,e=null;else if(e<0||e>=o.slideCount)return!1;o.unload(),"number"==typeof e?0===e&&0===o.$slides.length?p(t).appendTo(o.$slideTrack):i?p(t).insertBefore(o.$slides.eq(e)):p(t).insertAfter(o.$slides.eq(e)):!0===i?p(t).prependTo(o.$slideTrack):p(t).appendTo(o.$slideTrack),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slides.each(function(t,e){p(e).attr("data-slick-index",t)}),o.$slidesCache=o.$slides,o.reinit()},a.prototype.animateHeight=function(){var t=this;if(1===t.options.slidesToShow&&!0===t.options.adaptiveHeight&&!1===t.options.vertical){var e=t.$slides.eq(t.currentSlide).outerHeight(!0);t.$list.animate({height:e},t.options.speed)}},a.prototype.animateSlide=function(t,e){var i={},o=this;o.animateHeight(),!0===o.options.rtl&&!1===o.options.vertical&&(t=-t),!1===o.transformsEnabled?!1===o.options.vertical?o.$slideTrack.animate({left:t},o.options.speed,o.options.easing,e):o.$slideTrack.animate({top:t},o.options.speed,o.options.easing,e):!1===o.cssTransitions?(!0===o.options.rtl&&(o.currentLeft=-o.currentLeft),p({animStart:o.currentLeft}).animate({animStart:t},{duration:o.options.speed,easing:o.options.easing,step:function(t){t=Math.ceil(t),!1===o.options.vertical?i[o.animType]="translate("+t+"px, 0px)":i[o.animType]="translate(0px,"+t+"px)",o.$slideTrack.css(i)},complete:function(){e&&e.call()}})):(o.applyTransition(),t=Math.ceil(t),!1===o.options.vertical?i[o.animType]="translate3d("+t+"px, 0px, 0px)":i[o.animType]="translate3d(0px,"+t+"px, 0px)",o.$slideTrack.css(i),e&&setTimeout(function(){o.disableTransition(),e.call()},o.options.speed))},a.prototype.getNavTarget=function(){var t=this,e=t.options.asNavFor;return e&&null!==e&&(e=p(e).not(t.$slider)),e},a.prototype.asNavFor=function(e){var t,i=this.getNavTarget();null!==i&&"object"==typeof i&&i.each(function(){var t=p(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},a.prototype.applyTransition=function(t){var e=this,i={};!1===e.options.fade?i[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:i[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(i):e.$slides.eq(t).css(i)},a.prototype.autoPlay=function(){var t=this;t.autoPlayClear(),t.slideCount>t.options.slidesToShow&&(t.autoPlayTimer=setInterval(t.autoPlayIterator,t.options.autoplaySpeed))},a.prototype.autoPlayClear=function(){var t=this;t.autoPlayTimer&&clearInterval(t.autoPlayTimer)},a.prototype.autoPlayIterator=function(){var t=this,e=t.currentSlide+t.options.slidesToScroll;t.paused||t.interrupted||t.focussed||(!1===t.options.infinite&&(1===t.direction&&t.currentSlide+1===t.slideCount-1?t.direction=0:0===t.direction&&(e=t.currentSlide-t.options.slidesToScroll,t.currentSlide-1==0&&(t.direction=1))),t.slideHandler(e))},a.prototype.buildArrows=function(){var t=this;!0===t.options.arrows&&(t.$prevArrow=p(t.options.prevArrow).addClass("slick-arrow"),t.$nextArrow=p(t.options.nextArrow).addClass("slick-arrow"),t.slideCount>t.options.slidesToShow?(t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.prependTo(t.options.appendArrows),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.appendTo(t.options.appendArrows),!0!==t.options.infinite&&t.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},a.prototype.buildDots=function(){var t,e,i=this;if(!0===i.options.dots&&i.slideCount>i.options.slidesToShow){for(i.$slider.addClass("slick-dotted"),e=p("<ul />").addClass(i.options.dotsClass),t=0;t<=i.getDotCount();t+=1)e.append(p("<li />").append(i.options.customPaging.call(this,i,t)));i.$dots=e.appendTo(i.options.appendDots),i.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},a.prototype.buildOut=function(){var t=this;t.$slides=t.$slider.children(t.options.slide+":not(.slick-cloned)").addClass("slick-slide"),t.slideCount=t.$slides.length,t.$slides.each(function(t,e){p(e).attr("data-slick-index",t).data("originalStyling",p(e).attr("style")||"")}),t.$slider.addClass("slick-slider"),t.$slideTrack=0===t.slideCount?p('<div class="slick-track"/>').appendTo(t.$slider):t.$slides.wrapAll('<div class="slick-track"/>').parent(),t.$list=t.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),t.$slideTrack.css("opacity",0),(!0===t.options.centerMode||!0===t.options.swipeToSlide)&&(t.options.slidesToScroll=1),p("img[data-lazy]",t.$slider).not("[src]").addClass("slick-loading"),t.setupInfinite(),t.buildArrows(),t.buildDots(),t.updateDots(),t.setSlideClasses("number"==typeof t.currentSlide?t.currentSlide:0),!0===t.options.draggable&&t.$list.addClass("draggable")},a.prototype.buildRows=function(){var t,e,i,o,n,s,r,a=this;if(o=document.createDocumentFragment(),s=a.$slider.children(),1<a.options.rows){for(r=a.options.slidesPerRow*a.options.rows,n=Math.ceil(s.length/r),t=0;t<n;t++){var l=document.createElement("div");for(e=0;e<a.options.rows;e++){var d=document.createElement("div");for(i=0;i<a.options.slidesPerRow;i++){var p=t*r+(e*a.options.slidesPerRow+i);s.get(p)&&d.appendChild(s.get(p))}l.appendChild(d)}o.appendChild(l)}a.$slider.empty().append(o),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},a.prototype.checkResponsive=function(t,e){var i,o,n,s=this,r=!1,a=s.$slider.width(),l=window.innerWidth||p(window).width();if("window"===s.respondTo?n=l:"slider"===s.respondTo?n=a:"min"===s.respondTo&&(n=Math.min(l,a)),s.options.responsive&&s.options.responsive.length&&null!==s.options.responsive){for(i in o=null,s.breakpoints)s.breakpoints.hasOwnProperty(i)&&(!1===s.originalSettings.mobileFirst?n<s.breakpoints[i]&&(o=s.breakpoints[i]):n>s.breakpoints[i]&&(o=s.breakpoints[i]));null!==o?null!==s.activeBreakpoint?(o!==s.activeBreakpoint||e)&&(s.activeBreakpoint=o,"unslick"===s.breakpointSettings[o]?s.unslick(o):(s.options=p.extend({},s.originalSettings,s.breakpointSettings[o]),!0===t&&(s.currentSlide=s.options.initialSlide),s.refresh(t)),r=o):(s.activeBreakpoint=o,"unslick"===s.breakpointSettings[o]?s.unslick(o):(s.options=p.extend({},s.originalSettings,s.breakpointSettings[o]),!0===t&&(s.currentSlide=s.options.initialSlide),s.refresh(t)),r=o):null!==s.activeBreakpoint&&(s.activeBreakpoint=null,s.options=s.originalSettings,!0===t&&(s.currentSlide=s.options.initialSlide),s.refresh(t),r=o),t||!1===r||s.$slider.trigger("breakpoint",[s,r])}},a.prototype.changeSlide=function(t,e){var i,o,n,s=this,r=p(t.currentTarget);switch(r.is("a")&&t.preventDefault(),r.is("li")||(r=r.closest("li")),i=(n=s.slideCount%s.options.slidesToScroll!=0)?0:(s.slideCount-s.currentSlide)%s.options.slidesToScroll,t.data.message){case"previous":o=0===i?s.options.slidesToScroll:s.options.slidesToShow-i,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide-o,!1,e);break;case"next":o=0===i?s.options.slidesToScroll:i,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide+o,!1,e);break;case"index":var a=0===t.data.index?0:t.data.index||r.index()*s.options.slidesToScroll;s.slideHandler(s.checkNavigable(a),!1,e),r.children().trigger("focus");break;default:return}},a.prototype.checkNavigable=function(t){var e,i,o;if(i=0,t>(e=this.getNavigableIndexes())[e.length-1])t=e[e.length-1];else for(var n in e){if(t<e[n]){t=i;break}i=e[n]}return t},a.prototype.cleanUpEvents=function(){var t=this;t.options.dots&&null!==t.$dots&&p("li",t.$dots).off("click.slick",t.changeSlide).off("mouseenter.slick",p.proxy(t.interrupt,t,!0)).off("mouseleave.slick",p.proxy(t.interrupt,t,!1)),t.$slider.off("focus.slick blur.slick"),!0===t.options.arrows&&t.slideCount>t.options.slidesToShow&&(t.$prevArrow&&t.$prevArrow.off("click.slick",t.changeSlide),t.$nextArrow&&t.$nextArrow.off("click.slick",t.changeSlide)),t.$list.off("touchstart.slick mousedown.slick",t.swipeHandler),t.$list.off("touchmove.slick mousemove.slick",t.swipeHandler),t.$list.off("touchend.slick mouseup.slick",t.swipeHandler),t.$list.off("touchcancel.slick mouseleave.slick",t.swipeHandler),t.$list.off("click.slick",t.clickHandler),p(document).off(t.visibilityChange,t.visibility),t.cleanUpSlideEvents(),!0===t.options.accessibility&&t.$list.off("keydown.slick",t.keyHandler),!0===t.options.focusOnSelect&&p(t.$slideTrack).children().off("click.slick",t.selectHandler),p(window).off("orientationchange.slick.slick-"+t.instanceUid,t.orientationChange),p(window).off("resize.slick.slick-"+t.instanceUid,t.resize),p("[draggable!=true]",t.$slideTrack).off("dragstart",t.preventDefault),p(window).off("load.slick.slick-"+t.instanceUid,t.setPosition),p(document).off("ready.slick.slick-"+t.instanceUid,t.setPosition)},a.prototype.cleanUpSlideEvents=function(){var t=this;t.$list.off("mouseenter.slick",p.proxy(t.interrupt,t,!0)),t.$list.off("mouseleave.slick",p.proxy(t.interrupt,t,!1))},a.prototype.cleanUpRows=function(){var t,e=this;1<e.options.rows&&((t=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(t))},a.prototype.clickHandler=function(t){var e;!1===this.shouldClick&&(t.stopImmediatePropagation(),t.stopPropagation(),t.preventDefault())},a.prototype.destroy=function(t){var e=this;e.autoPlayClear(),e.touchObject={},e.cleanUpEvents(),p(".slick-cloned",e.$slider).detach(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.$prevArrow.length&&(e.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove()),e.$nextArrow&&e.$nextArrow.length&&(e.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove()),e.$slides&&(e.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){p(this).attr("style",p(this).data("originalStyling"))}),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.detach(),e.$list.detach(),e.$slider.append(e.$slides)),e.cleanUpRows(),e.$slider.removeClass("slick-slider"),e.$slider.removeClass("slick-initialized"),e.$slider.removeClass("slick-dotted"),e.unslicked=!0,t||e.$slider.trigger("destroy",[e])},a.prototype.disableTransition=function(t){var e=this,i={};i[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(i):e.$slides.eq(t).css(i)},a.prototype.fadeSlide=function(t,e){var i=this;!1===i.cssTransitions?(i.$slides.eq(t).css({zIndex:i.options.zIndex}),i.$slides.eq(t).animate({opacity:1},i.options.speed,i.options.easing,e)):(i.applyTransition(t),i.$slides.eq(t).css({opacity:1,zIndex:i.options.zIndex}),e&&setTimeout(function(){i.disableTransition(t),e.call()},i.options.speed))},a.prototype.fadeSlideOut=function(t){var e=this;!1===e.cssTransitions?e.$slides.eq(t).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(t),e.$slides.eq(t).css({opacity:0,zIndex:e.options.zIndex-2}))},a.prototype.filterSlides=a.prototype.slickFilter=function(t){var e=this;null!==t&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(t).appendTo(e.$slideTrack),e.reinit())},a.prototype.focusHandler=function(){var i=this;i.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*:not(.slick-arrow)",function(t){t.stopImmediatePropagation();var e=p(this);setTimeout(function(){i.options.pauseOnFocus&&(i.focussed=e.is(":focus"),i.autoPlay())},0)})},a.prototype.getCurrent=a.prototype.slickCurrentSlide=function(){var t;return this.currentSlide},a.prototype.getDotCount=function(){var t=this,e=0,i=0,o=0;if(!0===t.options.infinite)for(;e<t.slideCount;)++o,e=i+t.options.slidesToScroll,i+=t.options.slidesToScroll<=t.options.slidesToShow?t.options.slidesToScroll:t.options.slidesToShow;else if(!0===t.options.centerMode)o=t.slideCount;else if(t.options.asNavFor)for(;e<t.slideCount;)++o,e=i+t.options.slidesToScroll,i+=t.options.slidesToScroll<=t.options.slidesToShow?t.options.slidesToScroll:t.options.slidesToShow;else o=1+Math.ceil((t.slideCount-t.options.slidesToShow)/t.options.slidesToScroll);return o-1},a.prototype.getLeft=function(t){var e,i,o,n=this,s=0;return n.slideOffset=0,i=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=i*n.options.slidesToShow*-1),n.slideCount%n.options.slidesToScroll!=0&&t+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(s=t>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(t-n.slideCount))*n.slideWidth*-1,(n.options.slidesToShow-(t-n.slideCount))*i*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,n.slideCount%n.options.slidesToScroll*i*-1))):t+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(t+n.options.slidesToShow-n.slideCount)*n.slideWidth,s=(t+n.options.slidesToShow-n.slideCount)*i),n.slideCount<=n.options.slidesToShow&&(s=n.slideOffset=0),!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?t*n.slideWidth*-1+n.slideOffset:t*i*-1+s,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(t):n.$slideTrack.children(".slick-slide").eq(t+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(t):n.$slideTrack.children(".slick-slide").eq(t+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},a.prototype.getOption=a.prototype.slickGetOption=function(t){var e;return this.options[t]},a.prototype.getNavigableIndexes=function(){var t,e=this,i=0,o=0,n=[];for(t=!1===e.options.infinite?e.slideCount:(i=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,2*e.slideCount);i<t;)n.push(i),i=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return n},a.prototype.getSlick=function(){return this},a.prototype.getSlideCount=function(){var t,i,o,n=this;return o=!0===n.options.centerMode?n.slideWidth*Math.floor(n.options.slidesToShow/2):0,!0===n.options.swipeToSlide?(n.$slideTrack.find(".slick-slide").each(function(t,e){return e.offsetLeft-o+p(e).outerWidth()/2>-1*n.swipeLeft?(i=e,!1):void 0}),t=Math.abs(p(i).attr("data-slick-index")-n.currentSlide)||1):n.options.slidesToScroll},a.prototype.goTo=a.prototype.slickGoTo=function(t,e){var i;this.changeSlide({data:{message:"index",index:parseInt(t)}},e)},a.prototype.init=function(t){var e=this;p(e.$slider).hasClass("slick-initialized")||(p(e.$slider).addClass("slick-initialized"),e.buildRows(),e.buildOut(),e.setProps(),e.startLoad(),e.loadSlider(),e.initializeEvents(),e.updateArrows(),e.updateDots(),e.checkResponsive(!0),e.focusHandler()),t&&e.$slider.trigger("init",[e]),!0===e.options.accessibility&&e.initADA(),e.options.autoplay&&(e.paused=!1,e.autoPlay())},a.prototype.initADA=function(){var e=this;e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),e.$slideTrack.attr("role","listbox"),e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){p(this).attr({role:"option","aria-describedby":"slick-slide"+e.instanceUid+t})}),null!==e.$dots&&e.$dots.attr("role","tablist").find("li").each(function(t){p(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+e.instanceUid+t,id:"slick-slide"+e.instanceUid+t})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),e.activateADA()},a.prototype.initArrowEvents=function(){var t=this;!0===t.options.arrows&&t.slideCount>t.options.slidesToShow&&(t.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},t.changeSlide),t.$nextArrow.off("click.slick").on("click.slick",{message:"next"},t.changeSlide))},a.prototype.initDotEvents=function(){var t=this;!0===t.options.dots&&t.slideCount>t.options.slidesToShow&&p("li",t.$dots).on("click.slick",{message:"index"},t.changeSlide),!0===t.options.dots&&!0===t.options.pauseOnDotsHover&&p("li",t.$dots).on("mouseenter.slick",p.proxy(t.interrupt,t,!0)).on("mouseleave.slick",p.proxy(t.interrupt,t,!1))},a.prototype.initSlideEvents=function(){var t=this;t.options.pauseOnHover&&(t.$list.on("mouseenter.slick",p.proxy(t.interrupt,t,!0)),t.$list.on("mouseleave.slick",p.proxy(t.interrupt,t,!1)))},a.prototype.initializeEvents=function(){var t=this;t.initArrowEvents(),t.initDotEvents(),t.initSlideEvents(),t.$list.on("touchstart.slick mousedown.slick",{action:"start"},t.swipeHandler),t.$list.on("touchmove.slick mousemove.slick",{action:"move"},t.swipeHandler),t.$list.on("touchend.slick mouseup.slick",{action:"end"},t.swipeHandler),t.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},t.swipeHandler),t.$list.on("click.slick",t.clickHandler),p(document).on(t.visibilityChange,p.proxy(t.visibility,t)),!0===t.options.accessibility&&t.$list.on("keydown.slick",t.keyHandler),!0===t.options.focusOnSelect&&p(t.$slideTrack).children().on("click.slick",t.selectHandler),p(window).on("orientationchange.slick.slick-"+t.instanceUid,p.proxy(t.orientationChange,t)),p(window).on("resize.slick.slick-"+t.instanceUid,p.proxy(t.resize,t)),p("[draggable!=true]",t.$slideTrack).on("dragstart",t.preventDefault),p(window).on("load.slick.slick-"+t.instanceUid,t.setPosition),p(document).on("ready.slick.slick-"+t.instanceUid,t.setPosition)},a.prototype.initUI=function(){var t=this;!0===t.options.arrows&&t.slideCount>t.options.slidesToShow&&(t.$prevArrow.show(),t.$nextArrow.show()),!0===t.options.dots&&t.slideCount>t.options.slidesToShow&&t.$dots.show()},a.prototype.keyHandler=function(t){var e=this;t.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===t.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===t.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},a.prototype.lazyLoad=function(){function t(t){p("img[data-lazy]",t).each(function(){var t=p(this),e=p(this).attr("data-lazy"),i=document.createElement("img");i.onload=function(){t.animate({opacity:0},100,function(){t.attr("src",e).animate({opacity:1},200,function(){t.removeAttr("data-lazy").removeClass("slick-loading")}),s.$slider.trigger("lazyLoaded",[s,t,e])})},i.onerror=function(){t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),s.$slider.trigger("lazyLoadError",[s,t,e])},i.src=e})}var e,i,o,n,s=this;!0===s.options.centerMode?n=!0===s.options.infinite?(o=s.currentSlide+(s.options.slidesToShow/2+1))+s.options.slidesToShow+2:(o=Math.max(0,s.currentSlide-(s.options.slidesToShow/2+1)),s.options.slidesToShow/2+1+2+s.currentSlide):(o=s.options.infinite?s.options.slidesToShow+s.currentSlide:s.currentSlide,n=Math.ceil(o+s.options.slidesToShow),!0===s.options.fade&&(0<o&&o--,n<=s.slideCount&&n++)),t(e=s.$slider.find(".slick-slide").slice(o,n)),s.slideCount<=s.options.slidesToShow?t(i=s.$slider.find(".slick-slide")):s.currentSlide>=s.slideCount-s.options.slidesToShow?t(i=s.$slider.find(".slick-cloned").slice(0,s.options.slidesToShow)):0===s.currentSlide&&t(i=s.$slider.find(".slick-cloned").slice(-1*s.options.slidesToShow))},a.prototype.loadSlider=function(){var t=this;t.setPosition(),t.$slideTrack.css({opacity:1}),t.$slider.removeClass("slick-loading"),t.initUI(),"progressive"===t.options.lazyLoad&&t.progressiveLazyLoad()},a.prototype.next=a.prototype.slickNext=function(){var t;this.changeSlide({data:{message:"next"}})},a.prototype.orientationChange=function(){var t=this;t.checkResponsive(),t.setPosition()},a.prototype.pause=a.prototype.slickPause=function(){var t=this;t.autoPlayClear(),t.paused=!0},a.prototype.play=a.prototype.slickPlay=function(){var t=this;t.autoPlay(),t.options.autoplay=!0,t.paused=!1,t.focussed=!1,t.interrupted=!1},a.prototype.postSlide=function(t){var e=this;e.unslicked||(e.$slider.trigger("afterChange",[e,t]),e.animating=!1,e.setPosition(),e.swipeLeft=null,e.options.autoplay&&e.autoPlay(),!0===e.options.accessibility&&e.initADA())},a.prototype.prev=a.prototype.slickPrev=function(){var t;this.changeSlide({data:{message:"previous"}})},a.prototype.preventDefault=function(t){t.preventDefault()},a.prototype.progressiveLazyLoad=function(t){t=t||1;var e,i,o,n=this,s=p("img[data-lazy]",n.$slider);s.length?(e=s.first(),i=e.attr("data-lazy"),(o=document.createElement("img")).onload=function(){e.attr("src",i).removeAttr("data-lazy").removeClass("slick-loading"),!0===n.options.adaptiveHeight&&n.setPosition(),n.$slider.trigger("lazyLoaded",[n,e,i]),n.progressiveLazyLoad()},o.onerror=function(){t<3?setTimeout(function(){n.progressiveLazyLoad(t+1)},500):(e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,i]),n.progressiveLazyLoad())},o.src=i):n.$slider.trigger("allImagesLoaded",[n])},a.prototype.refresh=function(t){var e,i,o=this;i=o.slideCount-o.options.slidesToShow,!o.options.infinite&&o.currentSlide>i&&(o.currentSlide=i),o.slideCount<=o.options.slidesToShow&&(o.currentSlide=0),e=o.currentSlide,o.destroy(!0),p.extend(o,o.initials,{currentSlide:e}),o.init(),t||o.changeSlide({data:{message:"index",index:e}},!1)},a.prototype.registerBreakpoints=function(){var t,e,i,o=this,n=o.options.responsive||null;if("array"===p.type(n)&&n.length){for(t in o.respondTo=o.options.respondTo||"window",n)if(i=o.breakpoints.length-1,e=n[t].breakpoint,n.hasOwnProperty(t)){for(;0<=i;)o.breakpoints[i]&&o.breakpoints[i]===e&&o.breakpoints.splice(i,1),i--;o.breakpoints.push(e),o.breakpointSettings[e]=n[t].settings}o.breakpoints.sort(function(t,e){return o.options.mobileFirst?t-e:e-t})}},a.prototype.reinit=function(){var t=this;t.$slides=t.$slideTrack.children(t.options.slide).addClass("slick-slide"),t.slideCount=t.$slides.length,t.currentSlide>=t.slideCount&&0!==t.currentSlide&&(t.currentSlide=t.currentSlide-t.options.slidesToScroll),t.slideCount<=t.options.slidesToShow&&(t.currentSlide=0),t.registerBreakpoints(),t.setProps(),t.setupInfinite(),t.buildArrows(),t.updateArrows(),t.initArrowEvents(),t.buildDots(),t.updateDots(),t.initDotEvents(),t.cleanUpSlideEvents(),t.initSlideEvents(),t.checkResponsive(!1,!0),!0===t.options.focusOnSelect&&p(t.$slideTrack).children().on("click.slick",t.selectHandler),t.setSlideClasses("number"==typeof t.currentSlide?t.currentSlide:0),t.setPosition(),t.focusHandler(),t.paused=!t.options.autoplay,t.autoPlay(),t.$slider.trigger("reInit",[t])},a.prototype.resize=function(){var t=this;p(window).width()!==t.windowWidth&&(clearTimeout(t.windowDelay),t.windowDelay=window.setTimeout(function(){t.windowWidth=p(window).width(),t.checkResponsive(),t.unslicked||t.setPosition()},50))},a.prototype.removeSlide=a.prototype.slickRemove=function(t,e,i){var o=this;return t="boolean"==typeof t?!0===(e=t)?0:o.slideCount-1:!0===e?--t:t,!(o.slideCount<1||t<0||t>o.slideCount-1)&&(o.unload(),!0===i?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(t).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,void o.reinit())},a.prototype.setCSS=function(t){var e,i,o=this,n={};!0===o.options.rtl&&(t=-t),e="left"==o.positionProp?Math.ceil(t)+"px":"0px",i="top"==o.positionProp?Math.ceil(t)+"px":"0px",n[o.positionProp]=t,!1===o.transformsEnabled||(!(n={})===o.cssTransitions?n[o.animType]="translate("+e+", "+i+")":n[o.animType]="translate3d("+e+", "+i+", 0px)"),o.$slideTrack.css(n)},a.prototype.setDimensions=function(){var t=this;!1===t.options.vertical?!0===t.options.centerMode&&t.$list.css({padding:"0px "+t.options.centerPadding}):(t.$list.height(t.$slides.first().outerHeight(!0)*t.options.slidesToShow),!0===t.options.centerMode&&t.$list.css({padding:t.options.centerPadding+" 0px"})),t.listWidth=t.$list.width(),t.listHeight=t.$list.height(),!1===t.options.vertical&&!1===t.options.variableWidth?(t.slideWidth=Math.ceil(t.listWidth/t.options.slidesToShow),t.$slideTrack.width(Math.ceil(t.slideWidth*t.$slideTrack.children(".slick-slide").length))):!0===t.options.variableWidth?t.$slideTrack.width(5e3*t.slideCount):(t.slideWidth=Math.ceil(t.listWidth),t.$slideTrack.height(Math.ceil(t.$slides.first().outerHeight(!0)*t.$slideTrack.children(".slick-slide").length)));var e=t.$slides.first().outerWidth(!0)-t.$slides.first().width();!1===t.options.variableWidth&&t.$slideTrack.children(".slick-slide").width(t.slideWidth-e)},a.prototype.setFade=function(){var i,o=this;o.$slides.each(function(t,e){i=o.slideWidth*t*-1,!0===o.options.rtl?p(e).css({position:"relative",right:i,top:0,zIndex:o.options.zIndex-2,opacity:0}):p(e).css({position:"relative",left:i,top:0,zIndex:o.options.zIndex-2,opacity:0})}),o.$slides.eq(o.currentSlide).css({zIndex:o.options.zIndex-1,opacity:1})},a.prototype.setHeight=function(){var t=this;if(1===t.options.slidesToShow&&!0===t.options.adaptiveHeight&&!1===t.options.vertical){var e=t.$slides.eq(t.currentSlide).outerHeight(!0);t.$list.css("height",e)}},a.prototype.setOption=a.prototype.slickSetOption=function(t,e,i){var o,n,s,r,a,l=this,d=!1;if("object"===p.type(t)?(s=t,d=e,a="multiple"):"string"===p.type(t)&&(r=e,d=i,"responsive"===(s=t)&&"array"===p.type(e)?a="responsive":void 0!==e&&(a="single")),"single"===a)l.options[s]=r;else if("multiple"===a)p.each(s,function(t,e){l.options[t]=e});else if("responsive"===a)for(n in r)if("array"!==p.type(l.options.responsive))l.options.responsive=[r[n]];else{for(o=l.options.responsive.length-1;0<=o;)l.options.responsive[o].breakpoint===r[n].breakpoint&&l.options.responsive.splice(o,1),o--;l.options.responsive.push(r[n])}d&&(l.unload(),l.reinit())},a.prototype.setPosition=function(){var t=this;t.setDimensions(),t.setHeight(),!1===t.options.fade?t.setCSS(t.getLeft(t.currentSlide)):t.setFade(),t.$slider.trigger("setPosition",[t])},a.prototype.setProps=function(){var t=this,e=document.body.style;t.positionProp=!0===t.options.vertical?"top":"left","top"===t.positionProp?t.$slider.addClass("slick-vertical"):t.$slider.removeClass("slick-vertical"),(void 0!==e.WebkitTransition||void 0!==e.MozTransition||void 0!==e.msTransition)&&!0===t.options.useCSS&&(t.cssTransitions=!0),t.options.fade&&("number"==typeof t.options.zIndex?t.options.zIndex<3&&(t.options.zIndex=3):t.options.zIndex=t.defaults.zIndex),void 0!==e.OTransform&&(t.animType="OTransform",t.transformType="-o-transform",t.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(t.animType=!1)),void 0!==e.MozTransform&&(t.animType="MozTransform",t.transformType="-moz-transform",t.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(t.animType=!1)),void 0!==e.webkitTransform&&(t.animType="webkitTransform",t.transformType="-webkit-transform",t.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(t.animType=!1)),void 0!==e.msTransform&&(t.animType="msTransform",t.transformType="-ms-transform",t.transitionType="msTransition",void 0===e.msTransform&&(t.animType=!1)),void 0!==e.transform&&!1!==t.animType&&(t.animType="transform",t.transformType="transform",t.transitionType="transition"),t.transformsEnabled=t.options.useTransform&&null!==t.animType&&!1!==t.animType},a.prototype.setSlideClasses=function(t){var e,i,o,n,s=this;i=s.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),s.$slides.eq(t).addClass("slick-current"),!0===s.options.centerMode?(e=Math.floor(s.options.slidesToShow/2),!0===s.options.infinite&&(e<=t&&t<=s.slideCount-1-e?s.$slides.slice(t-e,t+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=s.options.slidesToShow+t,i.slice(o-e+1,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===t?i.eq(i.length-1-s.options.slidesToShow).addClass("slick-center"):t===s.slideCount-1&&i.eq(
s.options.slidesToShow).addClass("slick-center")),s.$slides.eq(t).addClass("slick-center")):0<=t&&t<=s.slideCount-s.options.slidesToShow?s.$slides.slice(t,t+s.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):i.length<=s.options.slidesToShow?i.addClass("slick-active").attr("aria-hidden","false"):(n=s.slideCount%s.options.slidesToShow,o=!0===s.options.infinite?s.options.slidesToShow+t:t,s.options.slidesToShow==s.options.slidesToScroll&&s.slideCount-t<s.options.slidesToShow?i.slice(o-(s.options.slidesToShow-n),o+n).addClass("slick-active").attr("aria-hidden","false"):i.slice(o,o+s.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===s.options.lazyLoad&&s.lazyLoad()},a.prototype.setupInfinite=function(){var t,e,i,o=this;if(!0===o.options.fade&&(o.options.centerMode=!1),!0===o.options.infinite&&!1===o.options.fade&&(e=null,o.slideCount>o.options.slidesToShow)){for(i=!0===o.options.centerMode?o.options.slidesToShow+1:o.options.slidesToShow,t=o.slideCount;t>o.slideCount-i;t-=1)e=t-1,p(o.$slides[e]).clone(!0).attr("id","").attr("data-slick-index",e-o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");for(t=0;t<i;t+=1)e=t,p(o.$slides[e]).clone(!0).attr("id","").attr("data-slick-index",e+o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");o.$slideTrack.find(".slick-cloned").find("[id]").each(function(){p(this).attr("id","")})}},a.prototype.interrupt=function(t){var e=this;t||e.autoPlay(),e.interrupted=t},a.prototype.selectHandler=function(t){var e=this,i=p(t.target).is(".slick-slide")?p(t.target):p(t.target).parents(".slick-slide"),o=parseInt(i.attr("data-slick-index"));return o||(o=0),e.slideCount<=e.options.slidesToShow?(e.setSlideClasses(o),void e.asNavFor(o)):void e.slideHandler(o)},a.prototype.slideHandler=function(t,e,i){var o,n,s,r,a,l=null,d=this;return e=e||!1,!0===d.animating&&!0===d.options.waitForAnimate||!0===d.options.fade&&d.currentSlide===t||d.slideCount<=d.options.slidesToShow?void 0:(!1===e&&d.asNavFor(t),o=t,l=d.getLeft(o),r=d.getLeft(d.currentSlide),d.currentLeft=null===d.swipeLeft?r:d.swipeLeft,!1===d.options.infinite&&!1===d.options.centerMode&&(t<0||t>d.getDotCount()*d.options.slidesToScroll)?void(!1===d.options.fade&&(o=d.currentSlide,!0!==i?d.animateSlide(r,function(){d.postSlide(o)}):d.postSlide(o))):!1===d.options.infinite&&!0===d.options.centerMode&&(t<0||t>d.slideCount-d.options.slidesToScroll)?void(!1===d.options.fade&&(o=d.currentSlide,!0!==i?d.animateSlide(r,function(){d.postSlide(o)}):d.postSlide(o))):(d.options.autoplay&&clearInterval(d.autoPlayTimer),n=o<0?d.slideCount%d.options.slidesToScroll!=0?d.slideCount-d.slideCount%d.options.slidesToScroll:d.slideCount+o:o>=d.slideCount?d.slideCount%d.options.slidesToScroll!=0?0:o-d.slideCount:o,d.animating=!0,d.$slider.trigger("beforeChange",[d,d.currentSlide,n]),s=d.currentSlide,d.currentSlide=n,d.setSlideClasses(d.currentSlide),d.options.asNavFor&&((a=(a=d.getNavTarget()).slick("getSlick")).slideCount<=a.options.slidesToShow&&a.setSlideClasses(d.currentSlide)),d.updateDots(),d.updateArrows(),!0===d.options.fade?(!0!==i?(d.fadeSlideOut(s),d.fadeSlide(n,function(){d.postSlide(n)})):d.postSlide(n),void d.animateHeight()):void(!0!==i?d.animateSlide(l,function(){d.postSlide(n)}):d.postSlide(n))))},a.prototype.startLoad=function(){var t=this;!0===t.options.arrows&&t.slideCount>t.options.slidesToShow&&(t.$prevArrow.hide(),t.$nextArrow.hide()),!0===t.options.dots&&t.slideCount>t.options.slidesToShow&&t.$dots.hide(),t.$slider.addClass("slick-loading")},a.prototype.swipeDirection=function(){var t,e,i,o,n=this;return t=n.touchObject.startX-n.touchObject.curX,e=n.touchObject.startY-n.touchObject.curY,i=Math.atan2(e,t),(o=Math.round(180*i/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&0<=o?!1===n.options.rtl?"left":"right":o<=360&&315<=o?!1===n.options.rtl?"left":"right":135<=o&&o<=225?!1===n.options.rtl?"right":"left":!0===n.options.verticalSwiping?35<=o&&o<=135?"down":"up":"vertical"},a.prototype.swipeEnd=function(t){var e,i,o=this;if(o.dragging=!1,o.interrupted=!1,o.shouldClick=!(10<o.touchObject.swipeLength),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(i=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=i&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,i]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},a.prototype.swipeHandler=function(t){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==t.type.indexOf("mouse")))switch(e.touchObject.fingerCount=t.originalEvent&&void 0!==t.originalEvent.touches?t.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),t.data.action){case"start":e.swipeStart(t);break;case"move":e.swipeMove(t);break;case"end":e.swipeEnd(t)}},a.prototype.swipeMove=function(t){var e,i,o,n,s,r=this;return s=void 0!==t.originalEvent?t.originalEvent.touches:null,!(!r.dragging||s&&1!==s.length)&&(e=r.getLeft(r.currentSlide),r.touchObject.curX=void 0!==s?s[0].pageX:t.clientX,r.touchObject.curY=void 0!==s?s[0].pageY:t.clientY,r.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(r.touchObject.curX-r.touchObject.startX,2))),!0===r.options.verticalSwiping&&(r.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(r.touchObject.curY-r.touchObject.startY,2)))),"vertical"!==(i=r.swipeDirection())?(void 0!==t.originalEvent&&4<r.touchObject.swipeLength&&t.preventDefault(),n=(!1===r.options.rtl?1:-1)*(r.touchObject.curX>r.touchObject.startX?1:-1),!0===r.options.verticalSwiping&&(n=r.touchObject.curY>r.touchObject.startY?1:-1),o=r.touchObject.swipeLength,(r.touchObject.edgeHit=!1)===r.options.infinite&&(0===r.currentSlide&&"right"===i||r.currentSlide>=r.getDotCount()&&"left"===i)&&(o=r.touchObject.swipeLength*r.options.edgeFriction,r.touchObject.edgeHit=!0),!1===r.options.vertical?r.swipeLeft=e+o*n:r.swipeLeft=e+o*(r.$list.height()/r.listWidth)*n,!0===r.options.verticalSwiping&&(r.swipeLeft=e+o*n),!0!==r.options.fade&&!1!==r.options.touchMove&&(!0===r.animating?(r.swipeLeft=null,!1):void r.setCSS(r.swipeLeft))):void 0)},a.prototype.swipeStart=function(t){var e,i=this;return i.interrupted=!0,1!==i.touchObject.fingerCount||i.slideCount<=i.options.slidesToShow?!(i.touchObject={}):(void 0!==t.originalEvent&&void 0!==t.originalEvent.touches&&(e=t.originalEvent.touches[0]),i.touchObject.startX=i.touchObject.curX=void 0!==e?e.pageX:t.clientX,i.touchObject.startY=i.touchObject.curY=void 0!==e?e.pageY:t.clientY,void(i.dragging=!0))},a.prototype.unfilterSlides=a.prototype.slickUnfilter=function(){var t=this;null!==t.$slidesCache&&(t.unload(),t.$slideTrack.children(this.options.slide).detach(),t.$slidesCache.appendTo(t.$slideTrack),t.reinit())},a.prototype.unload=function(){var t=this;p(".slick-cloned",t.$slider).remove(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove(),t.$nextArrow&&t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove(),t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},a.prototype.unslick=function(t){var e=this;e.$slider.trigger("unslick",[e,t]),e.destroy()},a.prototype.updateArrows=function(){var t,e=this;t=Math.floor(e.options.slidesToShow/2),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&!e.options.infinite&&(e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===e.currentSlide?(e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-e.options.slidesToShow&&!1===e.options.centerMode?(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-1&&!0===e.options.centerMode&&(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},a.prototype.updateDots=function(){var t=this;null!==t.$dots&&(t.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),t.$dots.find("li").eq(Math.floor(t.currentSlide/t.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},a.prototype.visibility=function(){var t=this;t.options.autoplay&&(document[t.hidden]?t.interrupted=!0:t.interrupted=!1)},p.fn.slick=function(t){var e,i,o=this,n=t,s=Array.prototype.slice.call(arguments,1),r=o.length;for(e=0;e<r;e++)if("object"==typeof n||void 0===n?o[e].slick=new a(o[e],n):i=o[e].slick[n].apply(o[e].slick,s),void 0!==i)return i;return o}}),function(g){g.fn.superfish=function(o){var n=g.fn.superfish,s=n.c,e=g('<span class="'+s.arrowClass+'"> &#187;</span>'),r=function(){var t=g(this),e=d(t);clearTimeout(e.sfTimer),t.showSuperfishUl().siblings().hideSuperfishUl()},a=function(t){var e=g(this),i=d(e);"click"===t.type||n.ios?g.proxy(l,e,i)():(clearTimeout(i.sfTimer),i.sfTimer=setTimeout(g.proxy(l,e,i),i.delay))},l=function(t){t.retainPath=-1<g.inArray(this[0],t.$path),this.hideSuperfishUl(),this.parents("."+t.hoverClass).length||(t.onIdle.call(i(this)),t.$path.length&&g.proxy(r,t.$path)())},i=function(t){return t.closest("."+s.menuClass)},d=function(t){return i(t).data("sf-options")},p=function(t){
// needed by MS pointer events
t.css("ms-touch-action","none")},c=function(t,e){var i="li:has(ul)";e.useClick||(g.fn.hoverIntent&&!e.disableHI?t.hoverIntent(r,a,i):t.on("mouseenter",i,r).on("mouseleave",i,a));var o="MSPointerDown";n.ios||(o+=" touchstart"),n.wp7&&(o+=" mousedown"),t.on("focusin","li",r).on("focusout","li",a).on("click","a",e,h).on(o,"a",u)},u=function(t){var e=g(this),i=e.siblings("ul");if(0<i.length&&i.is(":hidden")&&(e.data("follow",!1),"MSPointerDown"===t.type))return e.trigger("focus"),!1},h=function(t){var e=g(this),i=t.data,o=e.siblings("ul"),n=!1!==e.data("follow");!o.length||!i.useClick&&n||(t.preventDefault(),o.is(":hidden")?g.proxy(r,e.parent("li"))():i.useClick&&n&&g.proxy(a,e.parent("li"),t)())},f=function(t,e){return t.find("li."+e.pathClass).slice(0,e.pathLevels).addClass(e.hoverClass+" "+s.bcClass).filter(function(){return g(this).children("ul").hide().show().length}).removeClass(e.pathClass)},y=function(t,e){e.autoArrows&&t.children("a").each(function(){m(g(this))})},m=function(t){t.addClass(s.anchorClass).append(e.clone())};return n.getOptions=d,this.addClass(s.menuClass).each(function(){var t=g(this),e=g.extend({},n.defaults,o),i=t.find("li:has(ul)");e.$path=f(t,e),t.data("sf-options",e),y(i,e),p(t),c(t,e),i.not("."+s.bcClass).hideSuperfishUl(!0),e.onInit.call(this)})};var r=g.fn.superfish,t;r.o=[],r.op={},r.c={bcClass:"sf-breadcrumb",menuClass:"sf-js-enabled",anchorClass:"sf-with-ul",arrowClass:"sf-sub-indicator"},r.defaults={hoverClass:"sfHover",pathClass:"overrideThisToUse",pathLevels:1,delay:800,animation:{opacity:"show"},animationOut:{opacity:"hide"},speed:"normal",speedOut:"fast",autoArrows:!0,disableHI:!1,// true disables hoverIntent detection
useClick:!1,onInit:g.noop,// callback functions
onBeforeShow:g.noop,onShow:g.noop,onBeforeHide:g.noop,onHide:g.noop,onIdle:g.noop},r.ios=/iPhone|iPad|iPod/i.test(navigator.userAgent),r.wp7="behavior"in(t=document.documentElement.style)&&"fill"in t&&/iemobile/i.test(navigator.userAgent),g.fn.extend({hideSuperfishUl:function(t){if(this.length){var e=this,i=r.getOptions(e),o=!0===i.retainPath?i.$path:"",n=e.find("li."+i.hoverClass).add(this).not(o).removeClass(i.hoverClass).children("ul"),s=i.speedOut;t&&(n.show(),s=0),i.retainPath=!1,i.onBeforeHide.call(n),n.stop(!0,!0).animate(i.animationOut,s,function(){i.onHide.call(g(this)),i.useClick&&e.children("a").data("follow",!1)})}return this},showSuperfishUl:function(){var t=r.getOptions(this),e=this.addClass(t.hoverClass),i=e.children("ul");return t.onBeforeShow.call(i),i.stop(!0,!0).animate(t.animation,t.speed,function(){t.onShow.call(i),e.children("a").data("follow",!0)}),this}}),r.ios&&
// iOS click won't bubble to body, attach to closest possible
g(window).load(function(){g("body").children().on("click",g.noop)})}(jQuery),function(a){"use strict";a.fn.fitVids=function(t){var i={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){
// appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
var e=document.head||document.getElementsByTagName("head")[0],o=".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",n=document.createElement("div");n.innerHTML='<p>x</p><style id="fit-vids-style">'+o+"</style>",e.appendChild(n.childNodes[1])}return t&&a.extend(i,t),this.each(function(){var t=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"];i.customSelector&&t.push(i.customSelector);var r=".fitvidsignore";i.ignore&&(r=r+", "+i.ignore);var e=a(this).find(t.join(","));// Disable FitVids on this video.
(// SwfObj conflict patch
e=(e=e.not("object object")).not(r)).each(function(t){var e=a(this);if(!(0<e.parents(r).length||"embed"===this.tagName.toLowerCase()&&e.parent("object").length||e.parent(".fluid-width-video-wrapper").length)){e.css("height")||e.css("width")||!isNaN(e.attr("height"))&&!isNaN(e.attr("width"))||(e.attr("height",9),e.attr("width",16));var i,o,n=("object"===this.tagName.toLowerCase()||e.attr("height")&&!isNaN(parseInt(e.attr("height"),10))?parseInt(e.attr("height"),10):e.height())/(isNaN(parseInt(e.attr("width"),10))?e.width():parseInt(e.attr("width"),10));if(!e.attr("id")){var s="fitvid"+t;e.attr("id",s)}e.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*n+"%"),e.removeAttr("height").removeAttr("width")}})})}}(window.jQuery||window.Zepto),function(t){function e(){}function i(d){function i(t){t.prototype.option||(t.prototype.option=function(t){d.isPlainObject(t)&&(this.options=d.extend(!0,this.options,t))})}function o(a,l){d.fn[a]=function(e){if("string"!=typeof e)return this.each(function(){var t=d.data(this,a);t?(t.option(e),t._init()):(t=new l(this,e),d.data(this,a,t))});for(var t=c.call(arguments,1),i=0,o=this.length;i<o;i++){var n=this[i],s=d.data(n,a);if(s)if(d.isFunction(s[e])&&"_"!==e.charAt(0)){var r=s[e].apply(s,t);if(void 0!==r)return r}else p("no such method '"+e+"' for "+a+" instance");else p("cannot call methods on "+a+" prior to initialization; attempted to call '"+e+"'")}return this}}if(d){var p="undefined"==typeof console?e:function(t){console.error(t)};return d.bridget=function(t,e){i(e),o(t,e)},d.bridget}}var c=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],i):i("object"==typeof exports?require("jquery"):t.jQuery)}(window),function(i){function o(t){var e=i.event;return e.target=e.target||e.srcElement||t,e}var t=document.documentElement,e=function(){};t.addEventListener?e=function(t,e,i){t.addEventListener(e,i,!1)}:t.attachEvent&&(e=function(e,t,i){e[t+i]=i.handleEvent?function(){var t=o(e);i.handleEvent.call(i,t)}:function(){var t=o(e);i.call(e,t)},e.attachEvent("on"+t,e[t+i])});var n=function(){};t.removeEventListener?n=function(t,e,i){t.removeEventListener(e,i,!1)}:t.detachEvent&&(n=function(e,i,o){e.detachEvent("on"+i,e[i+o]);try{delete e[i+o]}catch(t){e[i+o]=void 0}});var s={bind:e,unbind:n};"function"==typeof define&&define.amd?define("eventie/eventie",s):"object"==typeof exports?module.exports=s:i.eventie=s}(window),function(){"use strict";function e(){}function r(t,e){for(var i=t.length;i--;)if(t[i].listener===e)return i;return-1}function t(e){return function t(){return this[e].apply(this,arguments)}}var i=e.prototype,o=this,n=o.EventEmitter;i.getListeners=function t(e){var i=this._getEvents(),o,n;if(e instanceof RegExp)for(n in o={},i)i.hasOwnProperty(n)&&e.test(n)&&(o[n]=i[n]);else o=i[e]||(i[e]=[]);return o},i.flattenListeners=function t(e){var i=[],o;for(o=0;o<e.length;o+=1)i.push(e[o].listener);return i},i.getListenersAsObject=function t(e){var i=this.getListeners(e),o;return i instanceof Array&&((o={})[e]=i),o||i},i.addListener=function t(e,i){var o=this.getListenersAsObject(e),n="object"==typeof i,s;for(s in o)o.hasOwnProperty(s)&&-1===r(o[s],i)&&o[s].push(n?i:{listener:i,once:!1});return this},i.on=t("addListener"),i.addOnceListener=function t(e,i){return this.addListener(e,{listener:i,once:!0})},i.once=t("addOnceListener"),i.defineEvent=function t(e){return this.getListeners(e),this},i.defineEvents=function t(e){for(var i=0;i<e.length;i+=1)this.defineEvent(e[i]);return this},i.removeListener=function t(e,i){var o=this.getListenersAsObject(e),n,s;for(s in o)o.hasOwnProperty(s)&&(-1!==(n=r(o[s],i))&&o[s].splice(n,1));return this},i.off=t("removeListener"),i.addListeners=function t(e,i){return this.manipulateListeners(!1,e,i)},i.removeListeners=function t(e,i){return this.manipulateListeners(!0,e,i)},i.manipulateListeners=function t(e,i,o){var n,s,r=e?this.removeListener:this.addListener,a=e?this.removeListeners:this.addListeners;if("object"!=typeof i||i instanceof RegExp)for(n=o.length;n--;)r.call(this,i,o[n]);else for(n in i)i.hasOwnProperty(n)&&(s=i[n])&&("function"==typeof s?r.call(this,n,s):a.call(this,n,s));return this},i.removeEvent=function t(e){var i=typeof e,o=this._getEvents(),n;if("string"===i)delete o[e];else if(e instanceof RegExp)for(n in o)o.hasOwnProperty(n)&&e.test(n)&&delete o[n];else delete this._events;return this},i.removeAllListeners=t("removeEvent"),i.emitEvent=function t(e,i){var o=this.getListenersAsObject(e),n,s,r,a;for(r in o)if(o.hasOwnProperty(r))for(s=o[r].length;s--;)!0===(n=o[r][s]).once&&this.removeListener(e,n.listener),(a=n.listener.apply(this,i||[]))===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=t("emitEvent"),i.emit=function t(e){var i=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,i)},i.setOnceReturnValue=function t(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function t(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},i._getEvents=function t(){return this._events||(this._events={})},e.noConflict=function t(){return o.EventEmitter=n,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:o.EventEmitter=e}.call(this),function(t){function e(t){if(t){if("string"==typeof s[t])return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e,i=0,o=n.length;i<o;i++)if(e=n[i]+t,"string"==typeof s[e])return e}}var n="Webkit Moz ms Ms O".split(" "),s=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return e}):"object"==typeof exports?module.exports=e:t.getStyleProperty=e}(window),function(a,t){function T(t){var e=parseFloat(t),i;return-1===t.indexOf("%")&&!isNaN(e)&&e}function e(){}function x(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,i=C.length;e<i;e++){var o;t[C[e]]=0}return t}function i(s){function v(){if(!r){r=!0;var e=a.getComputedStyle;if(n=e?function(t){return e(t,null)}:function(t){return t.currentStyle},b=function t(e){var i=n(e);return i||l("Style returned "+i+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),i},k=s("boxSizing")){var t=document.createElement("div");t.style.width="200px",t.style.padding="1px 2px 3px 4px",t.style.borderStyle="solid",t.style.borderWidth="1px 2px 3px 4px",t.style[k]="border-box";var i=document.body||document.documentElement;i.appendChild(t);var o=b(t);S=200===T(o.width),i.removeChild(t)}}var n}function t(t){if(v(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var e=b(t);if("none"===e.display)return x();var i={};i.width=t.offsetWidth,i.height=t.offsetHeight;for(var o=i.isBorderBox=!(!k||!e[k]||"border-box"!==e[k]),n=0,s=C.length;n<s;n++){var r=C[n],a=e[r];a=w(t,a);var l=parseFloat(a);i[r]=isNaN(l)?0:l}var d=i.paddingLeft+i.paddingRight,p=i.paddingTop+i.paddingBottom,c=i.marginLeft+i.marginRight,u=i.marginTop+i.marginBottom,h=i.borderLeftWidth+i.borderRightWidth,f=i.borderTopWidth+i.borderBottomWidth,y=o&&S,m=T(e.width);!1!==m&&(i.width=m+(y?0:d+h));var g=T(e.height);return!1!==g&&(i.height=g+(y?0:p+f)),i.innerWidth=i.width-(d+h),i.innerHeight=i.height-(p+f),i.outerWidth=i.width+c,i.outerHeight=i.height+u,i}}function w(t,e){if(a.getComputedStyle||-1===e.indexOf("%"))return e;var i=t.style,o=i.left,n=t.runtimeStyle,s=n&&n.left;return s&&(n.left=t.currentStyle.left),i.left=e,e=i.pixelLeft,i.left=o,s&&(n.left=s),e}var r=!1,b,k,S;return t}var l="undefined"==typeof console?e:function(t){console.error(t)},C=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],i):"object"==typeof exports?module.exports=i(require("desandro-get-style-property")):a.getSize=i(a.getStyleProperty)}(window),function(e){function o(t){"function"==typeof t&&(o.isReady?t():r.push(t))}function i(t){var e="readystatechange"===t.type&&"complete"!==s.readyState;o.isReady||e||n()}function n(){o.isReady=!0;for(var t=0,e=r.length;t<e;t++){var i;(0,r[t])()}}function t(t){return"complete"===s.readyState?n():(t.bind(s,"DOMContentLoaded",i),t.bind(s,"readystatechange",i),t.bind(e,"load",i)),o}var s=e.document,r=[];o.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],t):"object"==typeof exports?module.exports=t(require("eventie")):e.docReady=t(e.eventie)}(window),function(s){"use strict";function i(t,e){return t[o](e)}function r(t){var e;t.parentNode||document.createDocumentFragment().appendChild(t)}function t(t,e){r(t);for(var i=t.parentNode.querySelectorAll(e),o=0,n=i.length;o<n;o++)if(i[o]===t)return!0;return!1}function e(t,e){return r(t),i(t,e)}var o=function(){if(s.matches)return"matches";if(s.matchesSelector)return"matchesSelector";for(var t=["webkit","moz","ms","o"],e=0,i=t.length;e<i;e++){var o,n=t[e]+"MatchesSelector";if(s[n])return n}}(),n;if(o){var a,l=i(document.createElement("div"),"div");n=l?i:e}else n=t;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return n}):"object"==typeof exports?module.exports=n:window.matchesSelector=n}(Element.prototype),function(i,o){"use strict";"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(t,e){return o(i,t,e)}):"object"==typeof exports?module.exports=o(i,require("doc-ready"),require("desandro-matches-selector")):i.fizzyUIUtils=o(i,i.docReady,i.matchesSelector)}(window,function t(u,e,d){var h={extend:function(t,e){for(var i in e)t[i]=e[i];return t},modulo:function(t,e){return(t%e+e)%e}},i=Object.prototype.toString;h.isArray=function(t){return"[object Array]"==i.call(t)},h.makeArray=function(t){var e=[];if(h.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0,o=t.length;i<o;i++)e.push(t[i]);else e.push(t);return e},h.indexOf=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;i<o;i++)if(t[i]===e)return i;return-1},h.removeFrom=function(t,e){var i=h.indexOf(t,e);-1!=i&&t.splice(i,1)},h.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function t(e){return e instanceof HTMLElement}:function t(e){return e&&"object"==typeof e&&1==e.nodeType&&"string"==typeof e.nodeName},h.setText=function(){function t(t,e){t[i=i||(void 0!==document.documentElement.textContent?"textContent":"innerText")]=e}var i;return t}(),h.getParent=function(t,e){for(;t!=document.body;)if(t=t.parentNode,d(t,e))return t},h.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},h.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},h.filterFindElements=function(t,e){for(var i=[],o=0,n=(t=h.makeArray(t)).length;o<n;o++){var s=t[o];if(h.isElement(s))if(e){d(s,e)&&i.push(s);for(var r=s.querySelectorAll(e),a=0,l=r.length;a<l;a++)i.push(r[a])}else i.push(s)}return i},h.debounceMethod=function(t,e,o){var n=t.prototype[e],s=e+"Timeout";t.prototype[e]=function(){var t=this[s];t&&clearTimeout(t);var e=arguments,i=this;this[s]=setTimeout(function(){n.apply(i,e),delete i[s]},o||100)}},h.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var f=u.console;return h.htmlInit=function(p,c){e(function(){for(var t=h.toDashed(c),e=document.querySelectorAll(".js-"+t),i="data-"+t+"-options",o=0,n=e.length;o<n;o++){var s=e[o],r=s.getAttribute(i),a;try{a=r&&JSON.parse(r)}catch(t){f&&f.error("Error parsing "+i+" on "+s.nodeName.toLowerCase()+(s.id?"#"+s.id:"")+": "+t);continue}var l=new p(s,a),d=u.jQuery;d&&d.data(s,c,l)}})},h}),function(n,s){"use strict";"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property","fizzy-ui-utils/utils"],function(t,e,i,o){return s(n,t,e,i,o)}):"object"==typeof exports?module.exports=s(n,require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property"),require("fizzy-ui-utils")):(n.Outlayer={},n.Outlayer.Item=s(n,n.EventEmitter,n.getSize,n.getStyleProperty,n.fizzyUIUtils))}(window,function t(e,i,o,s,n){"use strict";function r(t){for(var e in t)return!1;return!(e=null)}function a(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function l(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var d=e.getComputedStyle,p=d?function(t){return d(t,null)}:function(t){return t.currentStyle},c=s("transition"),u=s("transform"),h=c&&u,f=!!s("perspective"),y={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[c],m=["transform","transition","transitionDuration","transitionProperty"],g=function(){for(var t={},e=0,i=m.length;e<i;e++){var o=m[e],n=s(o);n&&n!==o&&(t[o]=n)}return t}();n.extend(a.prototype,i.prototype),a.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},a.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},a.prototype.getSize=function(){this.size=o(this.element)},a.prototype.css=function(t){var e=this.element.style;for(var i in t){var o;e[g[i]||i]=t[i]}},a.prototype.getPosition=function(){var t=p(this.element),e=this.layout.options,i=e.isOriginLeft,o=e.isOriginTop,n=t[i?"left":"right"],s=t[o?"top":"bottom"],r=this.layout.size,a=-1!=n.indexOf("%")?parseFloat(n)/100*r.width:parseInt(n,10),l=-1!=s.indexOf("%")?parseFloat(s)/100*r.height:parseInt(s,10);a=isNaN(a)?0:a,l=isNaN(l)?0:l,a-=i?r.paddingLeft:r.paddingRight,l-=o?r.paddingTop:r.paddingBottom,this.position.x=a,this.position.y=l},a.prototype.layoutPosition=function(){var t=this.layout.size,e=this.layout.options,i={},o=e.isOriginLeft?"paddingLeft":"paddingRight",n=e.isOriginLeft?"left":"right",s=e.isOriginLeft?"right":"left",r=this.position.x+t[o];i[n]=this.getXValue(r),i[s]="";var a=e.isOriginTop?"paddingTop":"paddingBottom",l=e.isOriginTop?"top":"bottom",d=e.isOriginTop?"bottom":"top",p=this.position.y+t[a];i[l]=this.getYValue(p),i[d]="",this.css(i),this.emitEvent("layout",[this])},a.prototype.getXValue=function(t){var e=this.layout.options;return e.percentPosition&&!e.isHorizontal?t/this.layout.size.width*100+"%":t+"px"},a.prototype.getYValue=function(t){var e=this.layout.options;return e.percentPosition&&e.isHorizontal?t/this.layout.size.height*100+"%":t+"px"},a.prototype._transitionTo=function(t,e){this.getPosition();var i=this.position.x,o=this.position.y,n=parseInt(t,10),s=parseInt(e,10),r=n===this.position.x&&s===this.position.y;if(this.setPosition(t,e),!r||this.isTransitioning){var a=t-i,l=e-o,d={};d.transform=this.getTranslate(a,l),this.transition({to:d,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})}else this.layoutPosition()},a.prototype.getTranslate=function(t,e){var i=this.layout.options;return t=i.isOriginLeft?t:-t,e=i.isOriginTop?e:-e,f?"translate3d("+t+"px, "+e+"px, 0)":"translate("+t+"px, "+e+"px)"},a.prototype.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},a.prototype.moveTo=h?a.prototype._transitionTo:a.prototype.goTo,a.prototype.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},a.prototype._nonTransition=function(t){for(var e in this.css(t.to),t.isCleaning&&this._removeStyles(t.to),t.onTransitionEnd)t.onTransitionEnd[e].call(this)},a.prototype._transition=function(t){if(parseFloat(this.layout.options.transitionDuration)){var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var o=this.element.offsetHeight;o=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0}else this._nonTransition(t)};var v="opacity,"+l(g.transform||"transform");a.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:v,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(y,this,!1))},a.prototype.transition=a.prototype[c?"_transition":"_nonTransition"],a.prototype.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},a.prototype.onotransitionend=function(t){this.ontransitionend(t)};var w={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};a.prototype.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,i=w[t.propertyName]||t.propertyName,o;if(delete e.ingProperties[i],r(e.ingProperties)&&this.disableTransition(),i in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[i]),i in e.onEnd)e.onEnd[i].call(this),delete e.onEnd[i];this.emitEvent("transitionEnd",[this])}},a.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(y,this,!1),this.isTransitioning=!1},a.prototype._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var b={transitionProperty:"",transitionDuration:""};return a.prototype.removeTransitionStyles=function(){this.css(b)},a.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},a.prototype.remove=function(){if(c&&parseFloat(this.layout.options.transitionDuration)){var t=this;this.once("transitionEnd",function(){t.removeElem()}),this.hide()}else this.removeElem()},a.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i;e[this.getHideRevealTransitionEndProperty("visibleStyle")]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},a.prototype.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},a.prototype.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},a.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i;e[this.getHideRevealTransitionEndProperty("hiddenStyle")]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},a.prototype.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},a.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},a}),function(s,r){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","eventEmitter/EventEmitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(t,e,i,o,n){return r(s,t,e,i,o,n)}):"object"==typeof exports?module.exports=r(s,require("eventie"),require("wolfy87-eventemitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):s.Outlayer=r(s,s.eventie,s.EventEmitter,s.getSize,s.fizzyUIUtils,s.Outlayer.Item)}(window,function t(e,i,o,s,r,n){"use strict";function a(t,e){var i=r.getQueryElement(t);if(i){this.element=i,d&&(this.$element=d(this.element)),this.options=r.extend({},this.constructor.defaults),this.option(e);var o=++c;this.element.outlayerGUID=o,(u[o]=this)._create(),this.options.isInitLayout&&this.layout()}else l&&l.error("Bad element for "+this.constructor.namespace+": "+(i||t))}var l=e.console,d=e.jQuery,p=function(){},c=0,u={};return a.namespace="outlayer",a.Item=n,a.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},r.extend(a.prototype,o.prototype),a.prototype.option=function(t){r.extend(this.options,t)},a.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),r.extend(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},a.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},a.prototype._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,o=[],n=0,s=e.length;n<s;n++){var r,a=new i(e[n],this);o.push(a)}return o},a.prototype._filterFindItemElements=function(t){return r.filterFindElements(t,this.options.itemSelector)},a.prototype.getItemElements=function(){for(var t=[],e=0,i=this.items.length;e<i;e++)t.push(this.items[e].element);return t},a.prototype.layout=function(){this._resetLayout(),this._manageStamps();var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,t),this._isLayoutInited=!0},a.prototype._init=a.prototype.layout,a.prototype._resetLayout=function(){this.getSize()},a.prototype.getSize=function(){this.size=s(this.element)},a.prototype._getMeasurement=function(t,e){var i=this.options[t],o;this[t]=i?("string"==typeof i?o=this.element.querySelector(i):r.isElement(i)&&(o=i),o?s(o)[e]:i):0},a.prototype.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},a.prototype._getItemsForLayout=function(t){for(var e=[],i=0,o=t.length;i<o;i++){var n=t[i];n.isIgnored||e.push(n)}return e},a.prototype._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){for(var i=[],o=0,n=t.length;o<n;o++){var s=t[o],r=this._getItemLayoutPosition(s);r.item=s,r.isInstant=e||s.isLayoutInstant,i.push(r)}this._processLayoutQueue(i)}},a.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},a.prototype._processLayoutQueue=function(t){for(var e=0,i=t.length;e<i;e++){var o=t[e];this._positionItem(o.item,o.x,o.y,o.isInstant)}},a.prototype._positionItem=function(t,e,i,o){o?t.goTo(e,i):t.moveTo(e,i)},a.prototype._postLayout=function(){this.resizeContainer()},a.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},a.prototype._getContainerSize=p,a.prototype._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},a.prototype._emitCompleteOnItems=function(t,e){function i(){n.dispatchEvent(t+"Complete",null,[e])}function o(){++r===s&&i()}var n=this,s=e.length;if(e&&s)for(var r=0,a=0,l=e.length;a<l;a++){var d;e[a].once(t,o)}else i()},a.prototype.dispatchEvent=function(t,e,i){var o=e?[e].concat(i):i;if(this.emitEvent(t,o),d)if(this.$element=this.$element||d(this.element),e){var n=d.Event(e);n.type=t,this.$element.trigger(n,i)}else this.$element.trigger(t,i)},a.prototype.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},a.prototype.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},a.prototype.stamp=function(t){if(t=this._find(t)){this.stamps=this.stamps.concat(t);for(var e=0,i=t.length;e<i;e++){var o=t[e];this.ignore(o)}}},a.prototype.unstamp=function(t){if(t=this._find(t))for(var e=0,i=t.length;e<i;e++){var o=t[e];r.removeFrom(this.stamps,o),this.unignore(o)}},a.prototype._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=r.makeArray(t)):void 0},a.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var t=0,e=this.stamps.length;t<e;t++){var i=this.stamps[t];this._manageStamp(i)}}},a.prototype._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},a.prototype._manageStamp=p,a.prototype._getElementOffset=function(t){var e=t.getBoundingClientRect(),i=this._boundingRect,o=s(t),n;return{left:e.left-i.left-o.marginLeft,top:e.top-i.top-o.marginTop,right:i.right-e.right-o.marginRight,bottom:i.bottom-e.bottom-o.marginBottom}},a.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},a.prototype.bindResize=function(){this.isResizeBound||(i.bind(e,"resize",this),this.isResizeBound=!0)},a.prototype.unbindResize=function(){this.isResizeBound&&i.unbind(e,"resize",this),this.isResizeBound=!1},a.prototype.onresize=function(){function t(){e.resize(),delete e.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var e=this;this.resizeTimeout=setTimeout(t,100)},a.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},a.prototype.needsResizeLayout=function(){var t=s(this.element),e;return this.size&&t&&t.innerWidth!==this.size.innerWidth},a.prototype.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},a.prototype.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},a.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},a.prototype.reveal=function(t){this._emitCompleteOnItems("reveal",t);for(var e=t&&t.length,i=0;e&&i<e;i++){var o;t[i].reveal()}},a.prototype.hide=function(t){this._emitCompleteOnItems("hide",t);for(var e=t&&t.length,i=0;e&&i<e;i++){var o;t[i].hide()}},a.prototype.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},a.prototype.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},a.prototype.getItem=function(t){for(var e=0,i=this.items.length;e<i;e++){var o=this.items[e];if(o.element===t)return o}},a.prototype.getItems=function(t){for(var e=[],i=0,o=(t=r.makeArray(t)).length;i<o;i++){var n=t[i],s=this.getItem(n);s&&e.push(s)}return e},a.prototype.remove=function(t){var e=this.getItems(t);if(this._emitCompleteOnItems("remove",e),e&&e.length)for(var i=0,o=e.length;i<o;i++){var n=e[i];n.remove(),r.removeFrom(this.items,n)}},a.prototype.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="";for(var e=0,i=this.items.length;e<i;e++){var o;this.items[e].destroy()}this.unbindResize();var n=this.element.outlayerGUID;delete u[n],delete this.element.outlayerGUID,d&&d.removeData(this.element,this.constructor.namespace)},a.data=function(t){var e=(t=r.getQueryElement(t))&&t.outlayerGUID;return e&&u[e]},a.create=function(t,e){function i(){a.apply(this,arguments)}return Object.create?i.prototype=Object.create(a.prototype):r.extend(i.prototype,a.prototype),(i.prototype.constructor=i).defaults=r.extend({},a.defaults),r.extend(i.defaults,e),i.prototype.settings={},i.namespace=t,i.data=a.data,i.Item=function t(){n.apply(this,arguments)},i.Item.prototype=new n,r.htmlInit(i,t),d&&d.bridget&&d.bridget(t,i),i},a.Item=n,a}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("isotopeb/js/item",["outlayer/outlayer"],e):"object"==typeof exports?module.exports=e(require("outlayer")):(t.Isotopeb=t.Isotopeb||{},t.Isotopeb.Item=e(t.Outlayer))}(window,function t(e){"use strict";function i(){e.Item.apply(this,arguments)}i.prototype=new e.Item,i.prototype._create=function(){this.id=this.layout.itemGUID++,e.Item.prototype._create.call(this),this.sortData={}},i.prototype.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var o=e[i];this.sortData[i]=o(this.element,this)}}};var o=i.prototype.destroy;return i.prototype.destroy=function(){o.apply(this,arguments),this.css({display:""})},i}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("isotopeb/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):"object"==typeof exports?module.exports=e(require("get-size"),require("outlayer")):(t.Isotopeb=t.Isotopeb||{},t.Isotopeb.LayoutMode=e(t.getSize,t.Outlayer))}(window,function t(i,s){"use strict";function r(t){(this.isotopeb=t)&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}return function(){function t(t){return function(){return s.prototype[t].apply(this.isotopeb,arguments)}}for(var e=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout"],i=0,o=e.length;i<o;i++){var n=e[i];r.prototype[n]=t(n)}}(),r.prototype.needsVerticalResizeLayout=function(){var t=i(this.isotopeb.element),e;return this.isotopeb.size&&t&&t.innerHeight!=this.isotopeb.size.innerHeight},r.prototype._getMeasurement=function(){this.isotopeb._getMeasurement.apply(this,arguments)},r.prototype.getColumnWidth=function(){this.getSegmentSize("column","Width")},r.prototype.getRowHeight=function(){this.getSegmentSize("row","Height")},r.prototype.getSegmentSize=function(t,e){var i=t+e,o="outer"+e;if(this._getMeasurement(i,o),!this[i]){var n=this.getFirstItemSize();this[i]=n&&n[o]||this.isotopeb.size["inner"+e]}},r.prototype.getFirstItemSize=function(){var t=this.isotopeb.filteredItems[0];return t&&t.element&&i(t.element)},r.prototype.layout=function(){this.isotopeb.layout.apply(this.isotopeb,arguments)},r.prototype.getSize=function(){this.isotopeb.getSize(),this.size=this.isotopeb.size},r.modes={},r.create=function(t,e){function i(){r.apply(this,arguments)}return i.prototype=new r,e&&(i.options=e),i.prototype.namespace=t,r.modes[t]=i},r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("masonry/masonry",["outlayer/outlayer","get-size/get-size","fizzy-ui-utils/utils"],e):"object"==typeof exports?module.exports=e(require("outlayer"),require("get-size"),require("fizzy-ui-utils")):t.Masonry=e(t.Outlayer,t.getSize,t.fizzyUIUtils)}(window,function t(e,d,c){var i=e.create("masonry");return i.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var t=this.cols;for(this.colYs=[];t--;)this.colYs.push(0);this.maxY=0},i.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],e=t&&t.element;this.columnWidth=e&&d(e).outerWidth||this.containerWidth}var i=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,n=o/i,s=i-o%i,r;n=Math[s&&s<1?"round":"floor"](n),this.cols=Math.max(n,1)},i.prototype.getContainerWidth=function(){var t=this.options.isFitWidth?this.element.parentNode:this.element,e=d(t);this.containerWidth=e&&e.innerWidth},i.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i,o=Math[e&&e<1?"round":"ceil"](t.size.outerWidth/this.columnWidth);o=Math.min(o,this.cols);for(var n=this._getColGroup(o),s=Math.min.apply(Math,n),r=c.indexOf(n,s),a={x:this.columnWidth*r,y:s},l=s+t.size.outerHeight,d=this.cols+1-n.length,p=0;p<d;p++)this.colYs[r+p]=l;return a},i.prototype._getColGroup=function(t){if(t<2)return this.colYs;for(var e=[],i=this.cols+1-t,o=0;o<i;o++){var n=this.colYs.slice(o,o+t);e[o]=Math.max.apply(Math,n)}return e},i.prototype._manageStamp=function(t){var e=d(t),i=this._getElementOffset(t),o=this.options.isOriginLeft?i.left:i.right,n=o+e.outerWidth,s=Math.floor(o/this.columnWidth);s=Math.max(0,s);var r=Math.floor(n/this.columnWidth);r-=n%this.columnWidth?0:1,r=Math.min(this.cols-1,r);for(var a=(this.options.isOriginTop?i.top:i.bottom)+e.outerHeight,l=s;l<=r;l++)this.colYs[l]=Math.max(a,this.colYs[l])},i.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this.options.isFitWidth&&(
t.width=this._getContainerFitWidth()),t},i.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},i.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!==this.containerWidth},i}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("isotopeb/js/layout-modes/masonry",["../layout-mode","masonry/masonry"],e):"object"==typeof exports?module.exports=e(require("../layout-mode"),require("masonry-layout")):e(t.Isotopeb.LayoutMode,t.Masonry)}(window,function t(e,i){"use strict";function o(t,e){for(var i in e)t[i]=e[i];return t}var n=e.create("masonry"),s=n.prototype._getElementOffset,r=n.prototype.layout,t=n.prototype._getMeasurement;o(n.prototype,i.prototype),n.prototype._getElementOffset=s,n.prototype.layout=r,n.prototype._getMeasurement=t;var a=n.prototype.measureColumns;n.prototype.measureColumns=function(){this.items=this.isotopeb.filteredItems,a.call(this)};var l=n.prototype._manageStamp;return n.prototype._manageStamp=function(){this.options.isOriginLeft=this.isotopeb.options.isOriginLeft,this.options.isOriginTop=this.isotopeb.options.isOriginTop,l.apply(this,arguments)},n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("isotopeb/js/layout-modes/fit-rows",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotopeb.LayoutMode)}(window,function t(e){"use strict";var i=e.create("fitRows");return i.prototype._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},i.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth+this.gutter,i=this.isotopeb.size.innerWidth+this.gutter;0!==this.x&&e+this.x>i&&(this.x=0,this.y=this.maxY);var o={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=e,o},i.prototype._getContainerSize=function(){return{height:this.maxY}},i}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("isotopeb/js/layout-modes/vertical",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotopeb.LayoutMode)}(window,function t(e){"use strict";var i=e.create("vertical",{horizontalAlignment:0});return i.prototype._resetLayout=function(){this.y=0},i.prototype._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotopeb.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},i.prototype._getContainerSize=function(){return{height:this.y}},i}),function(r,a){"use strict";"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","matches-selector/matches-selector","fizzy-ui-utils/utils","isotopeb/js/item","isotopeb/js/layout-mode","isotopeb/js/layout-modes/masonry","isotopeb/js/layout-modes/fit-rows","isotopeb/js/layout-modes/vertical"],function(t,e,i,o,n,s){return a(r,t,e,i,o,n,s)}):"object"==typeof exports?module.exports=a(r,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("./item"),require("./layout-mode"),require("./layout-modes/masonry"),require("./layout-modes/fit-rows"),require("./layout-modes/vertical")):r.Isotopeb=a(r,r.Outlayer,r.getSize,r.matchesSelector,r.fizzyUIUtils,r.Isotopeb.Item,r.Isotopeb.LayoutMode)}(window,function l(t,n,e,i,s,o,r){function a(p,c){return function t(e,i){for(var o=0,n=p.length;o<n;o++){var s=p[o],r=e.sortData[s],a=i.sortData[s],l,d;if(a<r||r<a)return(a<r?1:-1)*((void 0!==c[s]?c[s]:c)?1:-1)}return 0}}var d=t.jQuery,l=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},p,c=document.documentElement.textContent?function(t){return t.textContent}:function(t){return t.innerText},u=n.create("isotopeb",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});u.Item=o,u.LayoutMode=r,u.prototype._create=function(){for(var t in this.itemGUID=0,this._sorters={},this._getSorters(),n.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"],r.modes)this._initLayoutMode(t)},u.prototype.reloadItems=function(){this.itemGUID=0,n.prototype.reloadItems.call(this)},u.prototype._itemize=function(){for(var t=n.prototype._itemize.apply(this,arguments),e=0,i=t.length;e<i;e++){var o;t[e].id=this.itemGUID++}return this._updateItemsSortData(t),t},u.prototype._initLayoutMode=function(t){var e=r.modes[t],i=this.options[t]||{};this.options[t]=e.options?s.extend(e.options,i):i,this.modes[t]=new e(this)},u.prototype.layout=function(){return!this._isLayoutInited&&this.options.isInitLayout?void this.arrange():void this._layout()},u.prototype._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},u.prototype.arrange=function(t){function e(){o.reveal(i.needReveal),o.hide(i.needHide)}this.option(t),this._getIsInstant();var i=this._filter(this.items);this.filteredItems=i.matches;var o=this;this._bindArrangeComplete(),this._isInstant?this._noTransition(e):e(),this._sort(),this._layout()},u.prototype._init=u.prototype.arrange,u.prototype._getIsInstant=function(){var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;return this._isInstant=t},u.prototype._bindArrangeComplete=function(){function t(){e&&i&&o&&n.dispatchEvent("arrangeComplete",null,[n.filteredItems])}var e,i,o,n=this;this.once("layoutComplete",function(){e=!0,t()}),this.once("hideComplete",function(){i=!0,t()}),this.once("revealComplete",function(){o=!0,t()})},u.prototype._filter=function(t){var e=this.options.filter;e=e||"*";for(var i=[],o=[],n=[],s=this._getFilterTest(e),r=0,a=t.length;r<a;r++){var l=t[r];if(!l.isIgnored){var d=s(l);d&&i.push(l),d&&l.isHidden?o.push(l):d||l.isHidden||n.push(l)}}return{matches:i,needReveal:o,needHide:n}},u.prototype._getFilterTest=function(e){return d&&this.options.isJQueryFiltering?function(t){return d(t.element).is(e)}:"function"==typeof e?function(t){return e(t.element)}:function(t){return i(t.element,e)}},u.prototype.updateSortData=function(t){var e;e=t?(t=s.makeArray(t),this.getItems(t)):this.items,this._getSorters(),this._updateItemsSortData(e)},u.prototype._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=h(i)}},u.prototype._updateItemsSortData=function(t){for(var e=t&&t.length,i=0;e&&i<e;i++){var o;t[i].updateSortData()}};var h=function(){function t(t){if("string"!=typeof t)return t;var e=l(t).split(" "),i=e[0],o=i.match(/^\[(.+)\]$/),n,s=a(o&&o[1],i),r=u.sortDataParsers[e[1]];return t=r?function(t){return t&&r(s(t))}:function(t){return t&&s(t)}}function a(e,i){var t;return t=e?function(t){return t.getAttribute(e)}:function(t){var e=t.querySelector(i);return e&&c(e)}}return t}();u.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},u.prototype._sort=function(){var t=this.options.sortBy;if(t){var e,i=a([].concat.apply(t,this.sortHistory),this.options.sortAscending);this.filteredItems.sort(i),t!=this.sortHistory[0]&&this.sortHistory.unshift(t)}},u.prototype._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw new Error("No layout mode: "+t);return e.options=this.options[t],e},u.prototype._resetLayout=function(){n.prototype._resetLayout.call(this),this._mode()._resetLayout()},u.prototype._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},u.prototype._manageStamp=function(t){this._mode()._manageStamp(t)},u.prototype._getContainerSize=function(){return this._mode()._getContainerSize()},u.prototype.needsResizeLayout=function(){return this._mode().needsResizeLayout()},u.prototype.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},u.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){this._resetLayout(),this._manageStamps();var i=this._filterRevealAdded(e);this.layoutItems(this.filteredItems),this.filteredItems=i.concat(this.filteredItems),this.items=e.concat(this.items)}},u.prototype._filterRevealAdded=function(t){var e=this._filter(t);return this.hide(e.needHide),this.reveal(e.matches),this.layoutItems(e.matches,!0),e.matches},u.prototype.insert=function(t){var e=this.addItems(t);if(e.length){var i,o,n=e.length;for(i=0;i<n;i++)o=e[i],this.element.appendChild(o.element);var s=this._filter(e).matches;for(i=0;i<n;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;i<n;i++)delete e[i].isLayoutInstant;this.reveal(s)}};var f=u.prototype.remove;return u.prototype.remove=function(t){t=s.makeArray(t);var e=this.getItems(t);f.call(this,t);var i=e&&e.length;if(i)for(var o=0;o<i;o++){var n=e[o];s.removeFrom(this.filteredItems,n)}},u.prototype.shuffle=function(){for(var t=0,e=this.items.length;t<e;t++){var i;this.items[t].sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},u.prototype._noTransition=function(t){var e=this.options.transitionDuration;this.options.transitionDuration=0;var i=t.call(this);return this.options.transitionDuration=e,i},u.prototype.getFilteredItemElements=function(){for(var t=[],e=0,i=this.filteredItems.length;e<i;e++)t.push(this.filteredItems[e].element);return t},u}),function(t){function i(t){return new RegExp("(^|\\s+)"+t+"(\\s+|$)")}function e(t,e){var i;(o(t,e)?s:n)(t,e)}var o,n,s;s="classList"in document.documentElement?(o=function(t,e){return t.classList.contains(e)},n=function(t,e){t.classList.add(e)},function(t,e){t.classList.remove(e)}):(o=function(t,e){return i(e).test(t.className)},n=function(t,e){o(t,e)||(t.className=t.className+" "+e)},function(t,e){t.className=t.className.replace(i(e)," ")});var r={hasClass:o,addClass:n,removeClass:s,toggleClass:e,has:o,add:n,remove:s,toggle:e};"function"==typeof define&&define.amd?define("classie/classie",r):"object"==typeof exports?module.exports=r:t.classie=r}(window),function(t,e){"function"==typeof define&&define.amd?define("packery/js/rect",e):"object"==typeof exports?module.exports=e():(t.Packery=t.Packery||{},t.Packery.Rect=e())}(window,function a(){function a(t){for(var e in a.defaults)this[e]=a.defaults[e];for(e in t)this[e]=t[e]}var t;return((window.Packery=function(){}).Rect=a).defaults={x:0,y:0,width:0,height:0},a.prototype.contains=function(t){var e=t.width||0,i=t.height||0;return this.x<=t.x&&this.y<=t.y&&this.x+this.width>=t.x+e&&this.y+this.height>=t.y+i},a.prototype.overlaps=function(t){var e=this.x+this.width,i=this.y+this.height,o=t.x+t.width,n=t.y+t.height;return this.x<o&&e>t.x&&this.y<n&&i>t.y},a.prototype.getMaximalFreeRects=function(t){if(!this.overlaps(t))return!1;var e=[],i,o=this.x+this.width,n=this.y+this.height,s=t.x+t.width,r=t.y+t.height;return this.y<t.y&&(i=new a({x:this.x,y:this.y,width:this.width,height:t.y-this.y}),e.push(i)),s<o&&(i=new a({x:s,y:this.y,width:o-s,height:this.height}),e.push(i)),r<n&&(i=new a({x:this.x,y:r,width:this.width,height:n-r}),e.push(i)),this.x<t.x&&(i=new a({x:this.x,y:this.y,width:t.x-this.x,height:this.height}),e.push(i)),e},a.prototype.canFit=function(t){return this.width>=t.width&&this.height>=t.height},a}),function(t,e){if("function"==typeof define&&define.amd)define("packery/js/packer",["./rect"],e);else if("object"==typeof exports)module.exports=e(require("./rect"));else{var i=t.Packery=t.Packery||{};i.Packer=e(i.Rect)}}(window,function t(e){function t(t,e,i){this.width=t||0,this.height=e||0,this.sortDirection=i||"downwardLeftToRight",this.reset()}t.prototype.reset=function(){this.spaces=[],this.newSpaces=[];var t=new e({x:0,y:0,width:this.width,height:this.height});this.spaces.push(t),this.sorter=i[this.sortDirection]||i.downwardLeftToRight},t.prototype.pack=function(t){for(var e=0,i=this.spaces.length;e<i;e++){var o=this.spaces[e];if(o.canFit(t)){this.placeInSpace(t,o);break}}},t.prototype.placeInSpace=function(t,e){t.x=e.x,t.y=e.y,this.placed(t)},t.prototype.placed=function(t){for(var e=[],i=0,o=this.spaces.length;i<o;i++){var n=this.spaces[i],s=n.getMaximalFreeRects(t);s?e.push.apply(e,s):e.push(n)}this.spaces=e,this.mergeSortSpaces()},t.prototype.mergeSortSpaces=function(){t.mergeRects(this.spaces),this.spaces.sort(this.sorter)},t.prototype.addSpace=function(t){this.spaces.push(t),this.mergeSortSpaces()},t.mergeRects=function(t){for(var e=0,i=t.length;e<i;e++){var o=t[e];if(o){var n=t.slice(0);n.splice(e,1);for(var s=0,r=0,a=n.length;r<a;r++){var l=n[r],d=r<e?0:1;o.contains(l)&&(t.splice(r+d-s,1),s++)}}}return t};var i={downwardLeftToRight:function(t,e){return t.y-e.y||t.x-e.x},rightwardTopToBottom:function(t,e){return t.x-e.x||t.y-e.y}};return t}),function(t,e){"function"==typeof define&&define.amd?define("packery/js/item",["get-style-property/get-style-property","outlayer/outlayer","./rect"],e):"object"==typeof exports?module.exports=e(require("desandro-get-style-property"),require("outlayer"),require("./rect")):t.Packery.Item=e(t.getStyleProperty,t.Outlayer,t.Packery.Rect)}(window,function t(e,i,o){var n=e("transform"),s=function t(){i.Item.apply(this,arguments)};s.prototype=new i.Item;var r=s.prototype._create;return s.prototype._create=function(){r.call(this),this.rect=new o,this.placeRect=new o},s.prototype.dragStart=function(){this.getPosition(),this.removeTransitionStyles(),this.isTransitioning&&n&&(this.element.style[n]="none"),this.getSize(),this.isPlacing=!0,this.needsPositioning=!1,this.positionPlaceRect(this.position.x,this.position.y),this.isTransitioning=!1,this.didDrag=!1},s.prototype.dragMove=function(t,e){this.didDrag=!0;var i=this.layout.size;t-=i.paddingLeft,e-=i.paddingTop,this.positionPlaceRect(t,e)},s.prototype.dragStop=function(){this.getPosition();var t=this.position.x!=this.placeRect.x,e=this.position.y!=this.placeRect.y;this.needsPositioning=t||e,this.didDrag=!1},s.prototype.positionPlaceRect=function(t,e,i){this.placeRect.x=this.getPlaceRectCoord(t,!0),this.placeRect.y=this.getPlaceRectCoord(e,!1,i)},s.prototype.getPlaceRectCoord=function(t,e,i){var o=e?"Width":"Height",n=this.size["outer"+o],s=this.layout[e?"columnWidth":"rowHeight"],r=this.layout.size["inner"+o],a;if(e||(r=Math.max(r,this.layout.maxY),this.layout.rowHeight||(r-=this.layout.gutter)),s){var l;s+=this.layout.gutter,r+=e?this.layout.gutter:0,t=Math.round(t/s),l=this.layout.options.isHorizontal?e?"ceil":"floor":e?"floor":"ceil";var d=Math[l](r/s);a=d-=Math.ceil(n/s)}else a=r-n;return t=i?t:Math.min(t,a),t*=s||1,Math.max(0,t)},s.prototype.copyPlaceRectPosition=function(){this.rect.x=this.placeRect.x,this.rect.y=this.placeRect.y},s.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.layout.packer.addSpace(this.rect),this.emitEvent("remove",[this])},s}),function(t,e){"function"==typeof define&&define.amd?define("packery/js/packery",["classie/classie","get-size/get-size","outlayer/outlayer","./rect","./packer","./item"],e):"object"==typeof exports?module.exports=e(require("desandro-classie"),require("get-size"),require("outlayer"),require("./rect"),require("./packer"),require("./item")):t.Packery=e(t.classie,t.getSize,t.Outlayer,t.Packery.Rect,t.Packery.Packer,t.Packery.Item)}(window,function t(a,s,e,n,i,o){function r(t,e){return t.position.y-e.position.y||t.position.x-e.position.x}function l(t,e){return t.position.x-e.position.x||t.position.y-e.position.y}n.prototype.canFit=function(t){return this.width>=t.width-1&&this.height>=t.height-1};var d=e.create("packery");return d.Item=o,d.prototype._create=function(){e.prototype._create.call(this),this.packer=new i,this.stamp(this.options.stamped);var o=this;this.handleDraggabilly={dragStart:function(){o.itemDragStart(this.element)},dragMove:function(){o.itemDragMove(this.element,this.position.x,this.position.y)},dragEnd:function(){o.itemDragEnd(this.element)}},this.handleUIDraggable={start:function t(e){o.itemDragStart(e.currentTarget)},drag:function t(e,i){o.itemDragMove(e.currentTarget,i.position.left,i.position.top)},stop:function t(e){o.itemDragEnd(e.currentTarget)}}},d.prototype._resetLayout=function(){this.getSize(),this._getMeasurements();var t=this.packer;this.options.isHorizontal?(t.width=Number.POSITIVE_INFINITY,t.height=this.size.innerHeight+this.gutter,t.sortDirection="rightwardTopToBottom"):(t.width=this.size.innerWidth+this.gutter,t.height=Number.POSITIVE_INFINITY,t.sortDirection="downwardLeftToRight"),t.reset(),this.maxY=0,this.maxX=0},d.prototype._getMeasurements=function(){this._getMeasurement("columnWidth","width"),this._getMeasurement("rowHeight","height"),this._getMeasurement("gutter","width")},d.prototype._getItemLayoutPosition=function(t){return this._packItem(t),t.rect},d.prototype._packItem=function(t){this._setRectSize(t.element,t.rect),this.packer.pack(t.rect),this._setMaxXY(t.rect)},d.prototype._setMaxXY=function(t){this.maxX=Math.max(t.x+t.width,this.maxX),this.maxY=Math.max(t.y+t.height,this.maxY)},d.prototype._setRectSize=function(t,e){var i=s(t),o=i.outerWidth,n=i.outerHeight;(o||n)&&(o=this._applyGridGutter(o,this.columnWidth),n=this._applyGridGutter(n,this.rowHeight)),e.width=Math.min(o,this.packer.width),e.height=Math.min(n,this.packer.height)},d.prototype._applyGridGutter=function(t,e){if(!e)return t+this.gutter;var i=t%(e+=this.gutter),o;return t=Math[i&&i<1?"round":"ceil"](t/e)*e},d.prototype._getContainerSize=function(){return this.options.isHorizontal?{width:this.maxX-this.gutter}:{height:this.maxY-this.gutter}},d.prototype._manageStamp=function(t){var e=this.getItem(t),i;if(e&&e.isPlacing)i=e.placeRect;else{var o=this._getElementOffset(t);i=new n({x:this.options.isOriginLeft?o.left:o.right,y:this.options.isOriginTop?o.top:o.bottom})}this._setRectSize(t,i),this.packer.placed(i),this._setMaxXY(i)},d.prototype.sortItemsByPosition=function(){var t=this.options.isHorizontal?l:r;this.items.sort(t)},d.prototype.fit=function(t,e,i){var o=this.getItem(t);o&&(this._getMeasurements(),this.stamp(o.element),o.getSize(),o.isPlacing=!0,e=void 0===e?o.rect.x:e,i=void 0===i?o.rect.y:i,o.positionPlaceRect(e,i,!0),this._bindFitEvents(o),o.moveTo(o.placeRect.x,o.placeRect.y),this.layout(),this.unstamp(o.element),this.sortItemsByPosition(),o.isPlacing=!1,o.copyPlaceRectPosition())},d.prototype._bindFitEvents=function(t){function e(){2==++o&&i.emitEvent("fitComplete",[t])}var i=this,o=0;t.on("layout",function(){return e(),!0}),this.on("layoutComplete",function(){return e(),!0})},d.prototype.resize=function(){var t=s(this.element),e=this.size&&t,i=this.options.isHorizontal?"innerHeight":"innerWidth";e&&t[i]==this.size[i]||this.layout()},d.prototype.itemDragStart=function(t){this.stamp(t);var e=this.getItem(t);e&&e.dragStart()},d.prototype.itemDragMove=function(t,e,i){function o(){s.layout(),delete s.dragTimeout}var n=this.getItem(t);n&&n.dragMove(e,i);var s=this;this.clearDragTimeout(),this.dragTimeout=setTimeout(o,40)},d.prototype.clearDragTimeout=function(){this.dragTimeout&&clearTimeout(this.dragTimeout)},d.prototype.itemDragEnd=function(t){var e=this.getItem(t),i;if(e&&(i=e.didDrag,e.dragStop()),e&&(i||e.needsPositioning)){a.add(e.element,"is-positioning-post-drag");var o=this._getDragEndLayoutComplete(t,e);e.needsPositioning?(e.on("layout",o),e.moveTo(e.placeRect.x,e.placeRect.y)):e&&e.copyPlaceRectPosition(),this.clearDragTimeout(),this.on("layoutComplete",o),this.layout()}else this.unstamp(t)},d.prototype._getDragEndLayoutComplete=function(e,i){var o=i&&i.needsPositioning,n=0,s=o?2:1,r=this;return function t(){return++n!=s||(i&&(a.remove(i.element,"is-positioning-post-drag"),i.isPlacing=!1,i.copyPlaceRectPosition()),r.unstamp(e),r.sortItemsByPosition(),o&&r.emitEvent("dragItemPositioned",[i])),!0}},d.prototype.bindDraggabillyEvents=function(t){t.on("dragStart",this.handleDraggabilly.dragStart),t.on("dragMove",this.handleDraggabilly.dragMove),t.on("dragEnd",this.handleDraggabilly.dragEnd)},d.prototype.bindUIDraggableEvents=function(t){t.on("dragstart",this.handleUIDraggable.start).on("drag",this.handleUIDraggable.drag).on("dragstop",this.handleUIDraggable.stop)},d.Rect=n,d.Packer=i,d}),function(t,e){"function"==typeof define&&define.amd?define(["isotopeb/js/layout-mode","packery/js/packery","get-size/get-size"],e):"object"==typeof exports?module.exports=e(require("isotopeb-layout/js/layout-mode"),require("packery"),require("get-size")):e(t.Isotopeb.LayoutMode,t.Packery,t.getSize)}(window,function t(e,i,o){function n(t,e){for(var i in e)t[i]=e[i];return t}var t=e.create("packery"),s=t.prototype._getElementOffset,r=t.prototype._getMeasurement;n(t.prototype,i.prototype),t.prototype._getElementOffset=s,t.prototype._getMeasurement=r;var a=t.prototype._resetLayout;t.prototype._resetLayout=function(){this.packer=this.packer||new i.Packer,a.apply(this,arguments)};var l=t.prototype._getItemLayoutPosition;t.prototype._getItemLayoutPosition=function(t){return t.rect=t.rect||new i.Rect,l.call(this,t)};var d=t.prototype._manageStamp;return t.prototype._manageStamp=function(){this.options.isOriginLeft=this.isotopeb.options.isOriginLeft,this.options.isOriginTop=this.isotopeb.options.isOriginTop,d.apply(this,arguments)},t.prototype.needsResizeLayout=function(){var t=o(this.element),e=this.size&&t,i=this.options.isHorizontal?"innerHeight":"innerWidth";return e&&t[i]!=this.size[i]},t}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},o=i[t]=i[t]||[];return-1==o.indexOf(e)&&o.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},o;return(i[t]=i[t]||{})[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var o=i.indexOf(e);return-1!=o&&i.splice(o,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var o=0,n=i[o];e=e||[];for(var s=this._onceEvents&&this._onceEvents[t];n;){var r=s&&s[n];r&&(this.off(t,n),delete s[n]),n.apply(this,e),n=i[o+=r?0:1]}return this}},e.allOff=e.removeAllListeners=function(){delete this._events,delete this._onceEvents},t}),function(e,i){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(t){return i(e,t)}):"object"==typeof module&&module.exports?module.exports=i(e,require("ev-emitter")):e.imagesLoadedn=i(e,e.EvEmitter)}("undefined"!=typeof window?window:this,function(e,t){function o(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function s(t,e,i){return this instanceof s?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=o({},this.options),"function"==typeof e?i=e:o(this.options,e),i&&this.on("always",i),this.getImages(),a&&(this.jqDeferred=new a.Deferred),void setTimeout(function(){this.check()}.bind(this))):new s(t,e,i)}function i(t){this.img=t}function r(t,e){this.url=t,this.element=e,this.img=new Image}var a=e.jQuery,l=e.console;s.prototype=Object.create(t.prototype),s.prototype.options={},s.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},s.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),!0===this.options.background&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&d[e]){for(var i=t.querySelectorAll("img"),o=0;o<i.length;o++){var n=i[o];this.addImage(n)}if("string"==typeof this.options.background){var s=t.querySelectorAll(this.options.background);for(o=0;o<s.length;o++){var r=s[o];this.addElementBackgroundImages(r)}}}};var d={1:!0,9:!0,11:!0};return s.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,o=i.exec(e.backgroundImage);null!==o;){var n=o&&o[2];n&&this.addBackground(n,t),o=i.exec(e.backgroundImage)}},s.prototype.addImage=function(t){var e=new i(t);this.images.push(e)},s.prototype.addBackground=function(t,e){var i=new r(t,e);this.images.push(i)},s.prototype.check=function(){function e(t,e,i){setTimeout(function(){o.progress(t,e,i)})}var o=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(t){t.once("progress",e),t.check()}):void this.complete()},s.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&l&&l.log("progress: "+i,t,e)},s.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},i.prototype=Object.create(t.prototype),i.prototype.check=function(){var t;return this.getIsImageComplete()?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},i.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},i.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},i.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},i.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},i.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},r.prototype=Object.create(i.prototype),r.prototype.check=function(){var t;this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},r.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},s.makeJQueryPlugin=function(t){(t=t||e.jQuery)&&((a=t).fn.imagesLoadedn=function(t,e){var i;return new s(this,t,e).jqDeferred.promise(a(this))})},s.makeJQueryPlugin(),s}),function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(l){var o=-1,n=-1,d=function(t){return parseFloat(t)||0},p=function(t){var e=1,i=l(t),o=null,n=[];return i.each(function(){var t=l(this),e=t.offset().top-d(t.css("margin-top")),i=0<n.length?n[n.length-1]:null;null===i?n.push(t):Math.floor(Math.abs(o-e))<=1?n[n.length-1]=i.add(t):n.push(t),o=e}),n},c=function(t){var e={byRow:!0,property:"height",target:null,remove:!1};return"object"==typeof t?l.extend(e,t):("boolean"==typeof t?e.byRow=t:"remove"===t&&(e.remove=!0),e)},u=l.fn.matchHeight=function(t){var e=c(t);if(e.remove){var i=this;return this.css(e.property,""),l.each(u._groups,function(t,e){e.elements=e.elements.not(i)}),this}return this.length<=1&&!e.target||(u._groups.push({elements:this,options:e}),u._apply(this,e)),this};u.version="master",u._groups=[],u._throttle=80,u._maintainScroll=!1,u._beforeUpdate=null,u._afterUpdate=null,u._rows=p,u._parse=d,u._parseOptions=c,u._apply=function(t,e){var s=c(e),i=l(t),o=[i],n=l(window).scrollTop(),r=l("html").outerHeight(!0),a=i.parents().filter(":hidden");return a.each(function(){var t=l(this);t.data("style-cache",t.attr("style"))}),a.css("display","block"),s.byRow&&!s.target&&(i.each(function(){var t=l(this),e=t.css("display");"inline-block"!==e&&"flex"!==e&&"inline-flex"!==e&&(e="block"),t.data("style-cache",t.attr("style")),t.css({display:e,"padding-top":"0","padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),o=p(i),i.each(function(){var t=l(this);t.attr("style",t.data("style-cache")||"")})),l.each(o,function(t,e){var i=l(e),n=0;if(s.target)n=s.target.outerHeight(!1);else{if(s.byRow&&i.length<=1)return void i.css(s.property,"");i.each(function(){var t=l(this),e=t.attr("style"),i=t.css("display");"inline-block"!==i&&"flex"!==i&&"inline-flex"!==i&&(i="block");var o={display:i};o[s.property]="",t.css(o),t.outerHeight(!1)>n&&(n=t.outerHeight(!1)),e?t.attr("style",e):t.css("display","")})}i.each(function(){var t=l(this),e=0;s.target&&t.is(s.target)||("border-box"!==t.css("box-sizing")&&(e+=d(t.css("border-top-width"))+d(t.css("border-bottom-width")),e+=d(t.css("padding-top"))+d(t.css("padding-bottom"))),t.css(s.property,n-e+"px"))})}),a.each(function(){var t=l(this);t.attr("style",t.data("style-cache")||null)}),u._maintainScroll&&l(window).scrollTop(n/r*l("html").outerHeight(!0)),this},u._applyDataApi=function(){var i={};l("[data-match-height], [data-mh]").each(function(){var t=l(this),e=t.attr("data-mh")||t.attr("data-match-height");i[e]=e in i?i[e].add(t):t}),l.each(i,function(){this.matchHeight(!0)})};var s=function(t){u._beforeUpdate&&u._beforeUpdate(t,u._groups),l.each(u._groups,function(){u._apply(this.elements,this.options)}),u._afterUpdate&&u._afterUpdate(t,u._groups)};u._update=function(t,e){if(e&&"resize"===e.type){var i=l(window).width();if(i===o)return;o=i}t?-1===n&&(n=setTimeout(function(){s(e),n=-1},u._throttle)):s(e)},l(u._applyDataApi),l(window).bind("load",function(t){u._update(!1,t)}),l(window).bind("resize orientationchange",function(t){u._update(!0,t)})}),function(n){"use strict";var s=function(t,e){this.el=n(t),this.options=n.extend({},n.fn.typed.defaults,e),this.isInput=this.el.is("input"),this.attr=this.options.attr,this.showCursor=!this.isInput&&this.options.showCursor,this.elContent=this.attr?this.el.attr(this.attr):this.el.text(),this.contentType=this.options.contentType,this.typeSpeed=this.options.typeSpeed,this.startDelay=this.options.startDelay,this.backSpeed=this.options.backSpeed,this.backDelay=this.options.backDelay,this.stringsElement=this.options.stringsElement,this.strings=this.options.strings,this.strPos=0,this.arrayPos=0,this.stopNum=0,this.loop=this.options.loop,this.loopCount=this.options.loopCount,this.curLoop=0,this.stop=!1,this.cursorChar=this.options.cursorChar,this.shuffle=this.options.shuffle,this.sequence=[],this.build()};s.prototype={constructor:s,init:function(){var e=this;e.timeout=setTimeout(function(){for(var t=0;t<e.strings.length;++t)e.sequence[t]=t;e.shuffle&&(e.sequence=e.shuffleArray(e.sequence)),e.typewrite(e.strings[e.sequence[e.arrayPos]],e.strPos)},e.startDelay)},build:function(){var i=this;if(!0===this.showCursor&&(this.cursor=n('<span class="typed-cursor">'+this.cursorChar+"</span>"),this.el.after(this.cursor)),this.stringsElement){i.strings=[],this.stringsElement.hide();var t=this.stringsElement.find("p");n.each(t,function(t,e){i.strings.push(n(e).html())})}this.init()},typewrite:function(r,a){if(!0!==this.stop){var t=Math.round(70*Math.random())+this.typeSpeed,l=this;l.timeout=setTimeout(function(){var t=0,e=r.substr(a);if("^"===e.charAt(0)){var i=1;/^\^\d+/.test(e)&&(i+=(e=/\d+/.exec(e)[0]).length,t=parseInt(e)),r=r.substring(0,a)+r.substring(a+i)}if("html"===l.contentType){var o=r.substr(a).charAt(0);if("<"===o||"&"===o){var n="",s="";for(s="<"===o?">":";";r.substr(a).charAt(0)!==s;)n+=r.substr(a).charAt(0),a++;a++,n+=s}}l.timeout=setTimeout(function(){if(a===r.length){if(l.options.onStringTyped(l.arrayPos),
l.arrayPos===l.strings.length-1&&(l.options.callback(),l.curLoop++,!1===l.loop||l.curLoop===l.loopCount))return;l.timeout=setTimeout(function(){l.backspace(r,a)},l.backDelay)}else{0===a&&l.options.preStringTyped(l.arrayPos);var t=r.substr(0,a+1);l.attr?l.el.attr(l.attr,t):l.isInput?l.el.val(t):"html"===l.contentType?l.el.html(t):l.el.text(t),a++,l.typewrite(r,a)}},t)},t)}},backspace:function(i,o){if(!0!==this.stop){var t=Math.round(70*Math.random())+this.backSpeed,n=this;n.timeout=setTimeout(function(){if("html"===n.contentType&&">"===i.substr(o).charAt(0)){for(var t="";"<"!==i.substr(o).charAt(0);)t-=i.substr(o).charAt(0),o--;o--,t+="<"}var e=i.substr(0,o);n.attr?n.el.attr(n.attr,e):n.isInput?n.el.val(e):"html"===n.contentType?n.el.html(e):n.el.text(e),o>n.stopNum?(o--,n.backspace(i,o)):o<=n.stopNum&&(n.arrayPos++,n.arrayPos===n.strings.length?(n.arrayPos=0,n.shuffle&&(n.sequence=n.shuffleArray(n.sequence)),n.init()):n.typewrite(n.strings[n.sequence[n.arrayPos]],o))},t)}},shuffleArray:function(t){var e,i,o=t.length;if(o)for(;--o;)e=t[i=Math.floor(Math.random()*(o+1))],t[i]=t[o],t[o]=e;return t},reset:function(){var t=this;clearInterval(t.timeout);var e=this.el.attr("id");this.el.after('<span id="'+e+'"/>'),this.el.remove(),void 0!==this.cursor&&this.cursor.remove(),t.options.resetCallback()}},n.fn.typed=function(o){return this.each(function(){var t=n(this),e=t.data("typed"),i="object"==typeof o&&o;e||t.data("typed",e=new s(this,i)),"string"==typeof o&&e[o]()})},n.fn.typed.defaults={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,shuffle:!1,backDelay:500,loop:!1,loopCount:!1,showCursor:!0,cursorChar:"|",attr:null,contentType:"html",callback:function(){},preStringTyped:function(){},onStringTyped:function(){},resetCallback:function(){}}}(window.jQuery),
/*
 * jQuery.appear
 * https://github.com/bas2k/jquery.appear/
 * http://code.google.com/p/jquery-appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
function(o){o.fn.appear=function(i,t){var h=o.extend({
//arbitrary data to pass to fn
data:void 0,
//call fn only on the first appear?
one:!0,
// X & Y accuracy
accX:0,accY:0},t);return this.each(function(){var c=o(this);
//whether the element is currently visible
if(c.appeared=!1,i){var u=o(window),e=function(){
//is the element hidden?
if(c.is(":visible")){
//is the element inside the visible window?
var t=u.scrollLeft(),e=u.scrollTop(),i=c.offset(),o=i.left,n=i.top,s=h.accX,r=h.accY,a=c.height(),l=u.height(),d=c.width(),p=u.width();e<=n+a+r&&n<=e+l+r&&t<=o+d+s&&o<=t+p+s?
//trigger the custom event
c.appeared||c.trigger("appear",h.data):
//it scrolled out of view
c.appeared=!1}else
//it became hidden
c.appeared=!1},t=function(){
//is this supposed to happen only once?
if(
//mark the element as visible
c.appeared=!0,h.one){
//remove the check
u.unbind("scroll",e);var t=o.inArray(e,o.fn.appear.checks);0<=t&&o.fn.appear.checks.splice(t,1)}
//trigger the original fn
i.apply(this,arguments)};
//fires the appear event when appropriate
//bind the modified fn to the element
h.one?c.one("appear",h.data,t):c.bind("appear",h.data,t),
//check whenever the window scrolls
u.scroll(e),
//check whenever the dom changes
o.fn.appear.checks.push(e),
//check now
e()}else
//trigger the custom event
c.trigger("appear",h.data)})},
//keep a queue of appearance checks
o.extend(o.fn.appear,{checks:[],timeout:null,
//process the queue
checkAll:function(){var t=o.fn.appear.checks.length;if(0<t)for(;t--;)o.fn.appear.checks[t]()},
//check the queue asynchronously
run:function(){o.fn.appear.timeout&&clearTimeout(o.fn.appear.timeout),o.fn.appear.timeout=setTimeout(o.fn.appear.checkAll,20)}}),
//run checks when these methods are called
o.each(["append","prepend","after","before","attr","removeAttr","addClass","removeClass","toggleClass","remove","css","show","hide"],function(t,e){var i=o.fn[e];i&&(o.fn[e]=function(){var t=i.apply(this,arguments);return o.fn.appear.run(),t})})}(jQuery),
/*
 * debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work? 
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
function(t){var s=t.event,r,a;r=s.special.debouncedresize={setup:function(){t(this).on("resize",r.handler)},teardown:function(){t(this).off("resize",r.handler)},handler:function(t,e){
// Save the context
var i=this,o=arguments,n=function(){
// set correct event type
t.type="debouncedresize",s.dispatch.apply(i,o)};a&&clearTimeout(a),e?n():a=setTimeout(n,r.threshold)},threshold:150}}(jQuery),
/*global jQuery */
/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/
function(n){n.fn.kt_fitText=function(t,e){
// Setup options
var i=t||1,o=n.extend({minFontSize:Number.NEGATIVE_INFINITY,maxFontSize:Number.POSITIVE_INFINITY,minWidth:Number.NEGATIVE_INFINITY,maxWidth:Number.POSITIVE_INFINITY},e);return this.each(function(){
// Store the object
var e=n(this),t=function(){var t=e.width();o.maxWidth>t&&o.minWidth<t?e.css("font-size",Math.max(Math.min(e.width()/(10*i),parseFloat(o.maxFontSize)),parseFloat(o.minFontSize))):o.minWidth>t?e.css("font-size",o.minFontSize):e.css("font-size",o.maxFontSize)};
// Resizer() resizes items based on the object width divided by the compressor * 10
// Call once to set.
t(),
// Call on resize. Opera debounces their resize by default.
n(window).on("resize.fittext orientationchange.fittext",t)})}}(jQuery),
// Sticky Plugin v1.0.0 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//       It will only set the 'top' and 'position' of your element, you
//       might need to adjust the width in some cases.
function(d){var e={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:""},p=d(window),c=d(document),u=[],h=p.height(),t=function(){for(var t=p.scrollTop(),e=c.height(),i=e-h,o=i<t?i-t:0,n=0;n<u.length;n++){var s=u[n],r,a;if(t<=s.stickyWrapper.offset().top-s.topSpacing-o)null!==s.currentTop&&(s.stickyElement.css("position","").css("top",""),s.stickyElement.parent().removeClass(s.className),s.currentTop=null);else{var l=e-s.stickyElement.outerHeight()-s.topSpacing-s.bottomSpacing-t-o;l<0?l+=s.topSpacing:l=s.topSpacing,s.currentTop!=l&&(s.stickyElement.css("position","fixed").css("top",l),void 0!==s.getWidthFrom&&s.stickyElement.css("width",d(s.getWidthFrom).width()),s.stickyElement.parent().addClass(s.className),s.currentTop=l)}}},i=function(){h=p.height()},o={init:function(t){var n=d.extend(e,t);return this.each(function(){var t=d(this),e=t.attr("id"),i=d("<div></div>").attr("id",e+"-sticky-wrapper").addClass(n.wrapperClassName);t.wrapAll(i),n.center&&t.parent().css({width:t.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"==t.css("float")&&t.css({float:"none"}).parent().css({float:"right"});var o=t.parent();o.css("height",t.outerHeight()),u.push({topSpacing:n.topSpacing,bottomSpacing:n.bottomSpacing,stickyElement:t,currentTop:null,stickyWrapper:o,className:n.className,getWidthFrom:n.getWidthFrom})})},update:t};
// should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
window.addEventListener?(window.addEventListener("scroll",t,!1),window.addEventListener("resize",i,!1)):window.attachEvent&&(window.attachEvent("onscroll",t),window.attachEvent("onresize",i)),d.fn.sticky=function(t){return o[t]?o[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void d.error("Method "+t+" does not exist on jQuery.sticky"):o.init.apply(this,arguments)},d(function(){setTimeout(t,0)})}(jQuery),function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(r){"use strict";function g(t){return!t.nodeName||-1!==r.inArray(t.nodeName.toLowerCase(),["iframe","#document","html","body"])}function e(t){return r.isFunction(t)||r.isPlainObject(t)?t:{top:t,left:t}}var v=r.scrollTo=function(t,e,i){return r(window).scrollTo(t,e,i)};return v.defaults={axis:"xy",duration:0,limit:!0},r.fn.scrollTo=function(t,i,y){"object"==typeof i&&(y=i,i=0),"function"==typeof y&&(y={onAfter:y}),"max"===t&&(t=9e9),y=r.extend({},v.defaults,y),i=i||y.duration;var m=y.queue&&1<y.axis.length;return m&&(i/=2),y.offset=e(y.offset),y.over=e(y.over),this.each(function(){function a(t){var e=r.extend({},y,{queue:!0,duration:i,complete:t&&function(){t.call(d,c,y)}});p.animate(u,e)}if(null!==t){var l=g(this),d=l?this.contentWindow||window:this,p=r(d),c=t,u={},h;switch(typeof c){case"number":case"string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(c)){c=e(c);break}c=l?r(c):r(c,d);case"object":if(0===c.length)return;(c.is||c.style)&&(h=(c=r(c)).offset())}var f=r.isFunction(y.offset)&&y.offset(d,c)||y.offset;r.each(y.axis.split(""),function(t,e){var i="x"===e?"Left":"Top",o=i.toLowerCase(),n="scroll"+i,s=p[n](),r=v.max(d,e);h?(u[n]=h[o]+(l?0:s-p.offset()[o]),y.margin&&(u[n]-=parseInt(c.css("margin"+i),10)||0,u[n]-=parseInt(c.css("border"+i+"Width"),10)||0),u[n]+=f[o]||0,y.over[o]&&(u[n]+=c["x"===e?"width":"height"]()*y.over[o])):(i=c[o],u[n]=i.slice&&"%"===i.slice(-1)?parseFloat(i)/100*r:i),y.limit&&/^\d+$/.test(u[n])&&(u[n]=u[n]<=0?0:Math.min(u[n],r)),!t&&1<y.axis.length&&(s===u[n]?u={}:m&&(a(y.onAfterFirst),u={}))}),a(y.onAfter)}})},v.max=function(t,e){var i,o="scroll"+(i="x"===e?"Width":"Height");if(!g(t))return t[o]-r(t)[i.toLowerCase()]();var i="client"+i,n,s=(n=t.ownerDocument||t.document).documentElement,n=n.body;return Math.max(s[o],n[o])-Math.min(s[i],n[i])},r.Tween.propHooks.scrollLeft=r.Tween.propHooks.scrollTop={get:function(t){return r(t.elem)[t.prop]()},set:function(t){var e=this.get(t);if(t.options.interrupt&&t._last&&t._last!==e)return r(t.elem).stop();var i=Math.round(t.now);e!==i&&(r(t.elem)[t.prop](i),t._last=this.get(t))}},v}),function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(l){function o(t,e,i){var o=e.hash.slice(1),n=document.getElementById(o)||document.getElementsByName(o)[0];if(n){t&&t.preventDefault();var s=l(i.target);if(!(i.lock&&s.is(":animated")||i.onBefore&&!1===i.onBefore(t,n,s))){if(i.stop&&s.stop(!0),i.hash){var r=n.id===o?"id":"name",a=l("<a> </a>").attr(r,o).css({position:"absolute",top:l(window).scrollTop(),left:l(window).scrollLeft()});n[r]="",l("body").prepend(a),location.hash=e.hash,a.remove(),n[r]=o}s.scrollTo(n,i).trigger("notify.serialScroll",[n])}}}var t=location.href.replace(/#.*/,""),n=l.localScroll=function(t){l("body").localScroll(t)};return n.defaults={duration:1e3,axis:"y",event:"click",stop:!0,target:window,autoscroll:!0},l.fn.localScroll=function(e){function i(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,"")===t&&(!e.filter||l(this).is(e.filter))}return(e=l.extend({},n.defaults,e)).autoscroll&&e.hash&&location.hash&&(e.target&&window.scrollTo(0,0),o(0,location,e)),e.lazy?this.on(e.event,"a,area",function(t){i.call(this)&&o(t,this,e)}):this.find("a,area").filter(i).bind(e.event,function(t){o(t,this,e)}).end().end()},n.hash=function(){},n});
//** jQuery Scroll to Top Control script- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com.
//** Available/ usage terms at http://www.dynamicdrive.com (March 30th, 09')
//** v1.1 (April 7th, 09'):
//** 1) Adds ability to scroll to an absolute position (from top of page) or specific element on the page instead.
//** 2) Fixes scroll animation not working in Opera. 
var scrolltotop={
//startline: Integer. Number of pixels from top of doc scrollbar is scrolled before showing control
//scrollto: Keyword (Integer, or "Scroll_to_Element_ID"). How far to scroll document up when control is clicked on (0=top).
setting:{startline:200,scrollto:0,scrollduration:1200,fadeduration:[500,100]},controlHTML:'<div class="to_the_top"><div class="icon-arrow-up"></div></div>',//HTML for control, which is auto wrapped in DIV w/ ID="topcontrol"
controlattrs:{offsetx:0,offsety:52},//offset of control relative to right/ bottom of window corner
anchorkeyword:"#top",//Enter href value of HTML anchors on the page that should also act as "Scroll Up" links
state:{isvisible:!1,shouldvisible:!1},scrollup:function(){this.cssfixedsupport||//if control is positioned using JavaScript
this.$control.css({opacity:0});//hide control immediately after clicking it
var t=isNaN(this.setting.scrollto)?this.setting.scrollto:parseInt(this.setting.scrollto);//check element set by string exists
t="string"==typeof t&&1==jQuery("#"+t).length?jQuery("#"+t).offset().top:0,this.$body.animate({scrollTop:t},this.setting.scrollduration)},keepfixed:function(){var t=jQuery(window),e=t.scrollLeft()+t.width()-this.$control.width()-this.controlattrs.offsetx,i=t.scrollTop()+t.height()-this.$control.height()-this.controlattrs.offsety;this.$control.css({left:e+"px",top:i+"px"})},togglecontrol:function(){var t=jQuery(window).scrollTop();this.cssfixedsupport||this.keepfixed(),this.state.shouldvisible=t>=this.setting.startline,this.state.shouldvisible&&!this.state.isvisible?(this.$control.stop().animate({opacity:1},this.setting.fadeduration[0]),this.state.isvisible=!0):0==this.state.shouldvisible&&this.state.isvisible&&(this.$control.stop().animate({opacity:0},this.setting.fadeduration[1]),this.state.isvisible=!1)},init:function(){jQuery(document).ready(function(t){var e=scrolltotop,i=document.all;e.cssfixedsupport=!i||i&&"CSS1Compat"==document.compatMode&&window.XMLHttpRequest,//not IE or IE7+ browsers in standards mode
e.$body=window.opera?"CSS1Compat"==document.compatMode?t("html"):t("body"):t("html,body"),e.$control=t('<div id="topcontrol">'+e.controlHTML+"</div>").css({position:e.cssfixedsupport?"fixed":"absolute",bottom:e.controlattrs.offsety,right:e.controlattrs.offsetx,opacity:0,cursor:"pointer"}).click(function(){return e.scrollup(),!1}).appendTo("body"),document.all&&!window.XMLHttpRequest&&""!=e.$control.text()&&//loose check for IE6 and below, plus whether control contains any text
e.$control.css({width:e.$control.width()}),//IE6- seems to require an explicit width on a DIV containing text
e.togglecontrol(),t('a[href="'+e.anchorkeyword+'"]').click(function(){return e.scrollup(),!1}),t(window).bind("scroll resize",function(t){e.togglecontrol()})})}};scrolltotop.init();;
/*!
 * Select2 4.0.3
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 =
(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
    var S2 = jQuery.fn.select2.amd;
  }
var S2;(function () { if (!S2 || !S2.requirejs) {
if (!S2) { S2 = {}; } else { require = S2; }
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

S2.requirejs = requirejs;S2.require = require;S2.define = define;
}
}());
S2.define("almond", function(){});

/* global jQuery:false, $:false */
S2.define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before Select2 on your ' +
      'web page.'
    );
  }

  return _$;
});

S2.define('select2/utils',[
  'jquery'
], function ($) {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
        var superMethod = superMethods[m];

        DecoratedClass.prototype[superMethod] =
          SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;
    var params = slice.call(arguments, 1);

    this.listeners = this.listeners || {};

    // Params should always come in as an array
    if (params == null) {
      params = [];
    }

    // If there are no arguments to the event, use a temporary object
    if (params.length === 0) {
      params.push({});
    }

    // Set the `_type` of the first object to the event
    params[0]._type = event;

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  Utils.escapeMarkup = function (markup) {
    var replaceMap = {
      '\\': '&#92;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
      return markup;
    }

    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
      return replaceMap[match];
    });
  };

  // Append an array of jQuery nodes to a given element.
  Utils.appendMany = function ($element, $nodes) {
    // jQuery 1.7.x does not support $.fn.append() with an array
    // Fall back to a jQuery object collection using $.fn.add()
    if ($.fn.jquery.substr(0, 3) === '1.7') {
      var $jqNodes = $();

      $.map($nodes, function (node) {
        $jqNodes = $jqNodes.add(node);
      });

      $nodes = $jqNodes;
    }

    $element.append($nodes);
  };

  return Utils;
});

S2.define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="select2-results__options" role="tree"></ul>'
    );

    if (this.options.get('multiple')) {
      $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    var escapeMarkup = this.options.get('escapeMarkup');

    this.clear();
    this.hideLoading();

    var $message = $(
      '<li role="treeitem" aria-live="assertive"' +
      ' class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.append(
      escapeMarkup(
        message(params.args)
      )
    );

    $message[0].className += ' select2-results__message';

    this.$results.append($message);
  };

  Results.prototype.hideMessages = function () {
    this.$results.find('.select2-results__message').remove();
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.$results.children().length === 0) {
        this.trigger('results:message', {
          message: 'noResults'
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.highlightFirstItem = function () {
    var $options = this.$results
      .find('.select2-results__option[aria-selected]');

    var $selected = $options.filter('[aria-selected=true]');

    // Check if there are any selected options
    if ($selected.length > 0) {
      // If there are selected options, highlight the first
      $selected.first().trigger('mouseenter');
    } else {
      // If there are no selected options, highlight the first option
      // in the dropdown
      $options.first().trigger('mouseenter');
    }

    this.ensureHighlightVisible();
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = $.map(selected, function (s) {
        return s.id.toString();
      });

      var $options = self.$results
        .find('.select2-results__option[aria-selected]');

      $options.each(function () {
        var $option = $(this);

        var item = $.data(this, 'data');

        // id needs to be converted to a string when comparing
        var id = '' + item.id;

        if ((item.element != null && item.element.selected) ||
            (item.element == null && $.inArray(id, selectedIds) > -1)) {
          $option.attr('aria-selected', 'true');
        } else {
          $option.attr('aria-selected', 'false');
        }
      });

    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.className = 'select2-results__option';

    var attrs = {
      'role': 'treeitem',
      'aria-selected': 'false'
    };

    if (data.disabled) {
      delete attrs['aria-selected'];
      attrs['aria-disabled'] = 'true';
    }

    if (data.id == null) {
      delete attrs['aria-selected'];
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.title) {
      option.title = data.title;
    }

    if (data.children) {
      attrs.role = 'group';
      attrs['aria-label'] = data.text;
      delete attrs['aria-selected'];
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var $option = $(option);

      var label = document.createElement('strong');
      label.className = 'select2-results__group';

      var $label = $(label);
      this.template(data, label);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul></ul>', {
        'class': 'select2-results__options select2-results__options--nested'
      });

      $childrenContainer.append($children);

      $option.append(label);
      $option.append($childrenContainer);
    } else {
      this.template(data, option);
    }

    $.data(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
        self.highlightFirstItem();
      }
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('query', function (params) {
      self.hideMessages();
      self.showLoading(params);
    });

    container.on('select', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
      self.highlightFirstItem();
    });

    container.on('unselect', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
      self.highlightFirstItem();
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$results.attr('aria-expanded', 'true');
      self.$results.attr('aria-hidden', 'false');

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$results.attr('aria-expanded', 'false');
      self.$results.attr('aria-hidden', 'true');
      self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:toggle', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      $highlighted.trigger('mouseup');
    });

    container.on('results:select', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      var data = $highlighted.data('data');

      if ($highlighted.attr('aria-selected') == 'true') {
        self.trigger('close', {});
      } else {
        self.trigger('select', {
          data: data
        });
      }
    });

    container.on('results:previous', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      // If we are already at te top, don't move further
      if (currentIndex === 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      // If none are highlighted, highlight the first
      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top;
      var nextTop = $next.offset().top;
      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextTop - currentOffset < 0) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:next', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      var nextIndex = currentIndex + 1;

      // If we are at the last option, stay there
      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var nextBottom = $next.offset().top + $next.outerHeight(false);
      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextBottom > currentOffset) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:focus', function (params) {
      params.element.addClass('select2-results__option--highlighted');
    });

    container.on('results:message', function (params) {
      self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
      this.$results.on('mousewheel', function (e) {
        var top = self.$results.scrollTop();

        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

        if (isAtTop) {
          self.$results.scrollTop(0);

          e.preventDefault();
          e.stopPropagation();
        } else if (isAtBottom) {
          self.$results.scrollTop(
            self.$results.get(0).scrollHeight - self.$results.height()
          );

          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.$results.on('mouseup', '.select2-results__option[aria-selected]',
      function (evt) {
      var $this = $(this);

      var data = $this.data('data');

      if ($this.attr('aria-selected') === 'true') {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        } else {
          self.trigger('close', {});
        }

        return;
      }

      self.trigger('select', {
        originalEvent: evt,
        data: data
      });
    });

    this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
      function (evt) {
      var data = $(this).data('data');

      self.getHighlightedResults()
          .removeClass('select2-results__option--highlighted');

      self.trigger('results:focus', {
        data: data,
        element: $(this)
      });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
      return;
    }

    var $options = this.$results.find('[aria-selected]');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
      this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
      this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');
    var escapeMarkup = this.options.get('escapeMarkup');

    var content = template(result, container);

    if (content == null) {
      container.style.display = 'none';
    } else if (typeof content === 'string') {
      container.innerHTML = escapeMarkup(content);
    } else {
      $(container).append(content);
    }
  };

  return Results;
});

S2.define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  return KEYS;
});

S2.define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" role="combobox" ' +
      ' aria-haspopup="true" aria-expanded="false">' +
      '</span>'
    );

    this._tabindex = 0;

    if (this.$element.data('old-tabindex') != null) {
      this._tabindex = this.$element.data('old-tabindex');
    } else if (this.$element.attr('tabindex') != null) {
      this._tabindex = this.$element.attr('tabindex');
    }

    $selection.attr('title', this.$element.attr('title'));
    $selection.attr('tabindex', this._tabindex);

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-container';
    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.on('focus', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('blur', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection.attr('aria-expanded', 'true');
      self.$selection.attr('aria-owns', resultsId);

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection.attr('aria-expanded', 'false');
      self.$selection.removeAttr('aria-activedescendant');
      self.$selection.removeAttr('aria-owns');

      self.$selection.focus();

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', self._tabindex);
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
      // Don't trigger `blur` if the focus is still in the selection
      if (
        (document.activeElement == self.$selection[0]) ||
        ($.contains(self.$selection[0], document.activeElement))
      ) {
        return;
      }

      self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {
    var self = this;

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
      var $target = $(e.target);

      var $select = $target.closest('.select2');

      var $all = $('.select2.select2-container--open');

      $all.each(function () {
        var $this = $(this);

        if (this == $select[0]) {
          return;
        }

        var $element = $this.data('element');

        $element.select2('close');
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});

S2.define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered').attr('id', id);
    this.$selection.attr('aria-labelledby', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.$selection.focus();
      }
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = this.display(selection, $rendered);

    $rendered.empty().append(formatted);
    $rendered.prop('title', selection.title || selection.text);
  };

  return SingleSelection;
});

S2.define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.options.get('disabled')) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = $selection.data('data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);

      $selection.append(formatted);
      $selection.prop('title', selection.title || selection.text);

      $selection.data('data', selection);

      $selections.push($selection);
    }

    var $rendered = this.$selection.find('.select2-selection__rendered');

    Utils.appendMany($rendered, $selections);
  };

  return MultipleSelection;
});

S2.define('select2/selection/placeholder',[
  '../utils'
], function (Utils) {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder.addClass('select2-selection__placeholder')
                .removeClass('select2-selection__choice');

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

S2.define('select2/selection/allowClear',[
  'jquery',
  '../keys'
], function ($, KEYS) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    if (this.placeholder == null) {
      if (this.options.get('debug') && window.console && console.error) {
        console.error(
          'Select2: The `allowClear` option should be used in combination ' +
          'with the `placeholder` option.'
        );
      }
    }

    this.$selection.on('mousedown', '.select2-selection__clear',
      function (evt) {
        self._handleClear(evt);
    });

    container.on('keypress', function (evt) {
      self._handleKeyboardClear(evt, container);
    });
  };

  AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.options.get('disabled')) {
      return;
    }

    var $clear = this.$selection.find('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if ($clear.length === 0) {
      return;
    }

    evt.stopPropagation();

    var data = $clear.data('data');

    for (var d = 0; d < data.length; d++) {
      var unselectData = {
        data: data[d]
      };

      // Trigger the `unselect` event, so people can prevent it from being
      // cleared.
      this.trigger('unselect', unselectData);

      // If the event was prevented, don't clear it out.
      if (unselectData.prevented) {
        return;
      }
    }

    this.$element.val(this.placeholder.id).trigger('change');

    this.trigger('toggle', {});
  };

  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
      return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
      this._handleClear(evt);
    }
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
      return;
    }

    var $remove = $(
      '<span class="select2-selection__clear">' +
        '&times;' +
      '</span>'
    );
    $remove.data('data', data);

    this.$selection.find('.select2-selection__rendered').prepend($remove);
  };

  return AllowClear;
});

S2.define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var $search = $(
      '<li class="select2-search select2-search--inline">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
        ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
      '</li>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    var $rendered = decorated.call(this);

    this._transferTabIndex();

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self.$search.trigger('focus');
    });

    container.on('close', function () {
      self.$search.val('');
      self.$search.removeAttr('aria-activedescendant');
      self.$search.trigger('focus');
    });

    container.on('enable', function () {
      self.$search.prop('disabled', false);

      self._transferTabIndex();
    });

    container.on('disable', function () {
      self.$search.prop('disabled', true);
    });

    container.on('focus', function (evt) {
      self.$search.trigger('focus');
    });

    container.on('results:focus', function (params) {
      self.$search.attr('aria-activedescendant', params.id);
    });

    this.$selection.on('focusin', '.select2-search--inline', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('focusout', '.select2-search--inline', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
      evt.stopPropagation();

      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();

      var key = evt.which;

      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
        var $previousChoice = self.$searchContainer
          .prev('.select2-selection__choice');

        if ($previousChoice.length > 0) {
          var item = $previousChoice.data('data');

          self.searchRemoveChoice(item);

          evt.preventDefault();
        }
      }
    });

    // Try to detect the IE version should the `documentMode` property that
    // is stored on the document. This is only implemented in IE and is
    // slightly cleaner than doing a user agent check.
    // This property is not available in Edge, but Edge also doesn't have
    // this bug.
    var msie = document.documentMode;
    var disableInputEvents = msie && msie <= 11;

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$selection.on(
      'input.searchcheck',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents) {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        // Unbind the duplicated `keyup` event
        self.$selection.off('keyup.search');
      }
    );

    this.$selection.on(
      'keyup.search input.search',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents && evt.type === 'input') {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        var key = evt.which;

        // We can freely ignore events from modifier keys
        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
          return;
        }

        // Tabbing will be handled during the `keydown` phase
        if (key == KEYS.TAB) {
          return;
        }

        self.handleSearch(evt);
      }
    );
  };

  /**
   * This method will transfer the tabindex attribute from the rendered
   * selection to the search box. This allows for the search box to be used as
   * the primary focus instead of the selection container.
   *
   * @private
   */
  Search.prototype._transferTabIndex = function (decorated) {
    this.$search.attr('tabindex', this.$selection.attr('tabindex'));
    this.$selection.attr('tabindex', '-1');
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    var searchHadFocus = this.$search[0] == document.activeElement;

    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.$selection.find('.select2-selection__rendered')
                   .append(this.$searchContainer);

    this.resizeSearch();
    if (searchHadFocus) {
      this.$search.focus();
    }
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.$search.val(item.text);
    this.handleSearch();
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '';

    if (this.$search.attr('placeholder') !== '') {
      width = this.$selection.find('.select2-selection__rendered').innerWidth();
    } else {
      var minimumWidth = this.$search.val().length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

S2.define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting'
    ];

    var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if ($.inArray(name, relayEvents) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if ($.inArray(name, preventableEvents) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

S2.define('select2/translation',[
  'jquery',
  'require'
], function ($, require) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

S2.define('select2/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03C9': '\u03C9',
    '\u03C2': '\u03C3'
  };

  return diacritics;
});

S2.define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = container.id + '-result-';

    id += Utils.generateChars(4);

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

S2.define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(':selected').each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if ($(data.element).is('option')) {
      data.element.selected = true;

      this.$element.trigger('change');

      return;
    }

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          var id = data[d].id;

          if ($.inArray(id, val) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);
      this.$element.trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    data.selected = false;

    if ($(data.element).is('option')) {
      data.element.selected = false;

      this.$element.trigger('change');

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        var id = currentData[d].id;

        if (id !== data.id && $.inArray(id, val) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);

      self.$element.trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by Select2
      $.removeData(this, 'data');
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      var $option = $(this);

      if (!$option.is('option') && !$option.is('optgroup')) {
        return;
      }

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data
    });
  };

  SelectAdapter.prototype.addOptions = function ($options) {
    Utils.appendMany(this.$element, $options);
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement('optgroup');
      option.label = data.text;
    } else {
      option = document.createElement('option');

      if (option.textContent !== undefined) {
        option.textContent = data.text;
      } else {
        option.innerText = data.text;
      }
    }

    if (data.id) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    if (data.title) {
      option.title = data.title;
    }

    var $option = $(option);

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    $.data(option, 'data', normalizedData);

    return $option;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = $.data($option[0], 'data');

    if (data != null) {
      return data;
    }

    if ($option.is('option')) {
      data = {
        id: $option.val(),
        text: $option.text(),
        disabled: $option.prop('disabled'),
        selected: $option.prop('selected'),
        title: $option.prop('title')
      };
    } else if ($option.is('optgroup')) {
      data = {
        text: $option.prop('label'),
        children: [],
        title: $option.prop('title')
      };

      var $children = $option.children('option');
      var children = [];

      for (var c = 0; c < $children.length; c++) {
        var $child = $($children[c]);

        var child = this.item($child);

        children.push(child);
      }

      data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    $.data($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (!$.isPlainObject(item)) {
      item = {
        id: item,
        text: item
      };
    }

    item = $.extend({}, {
      text: ''
    }, item);

    var defaults = {
      selected: false,
      disabled: false
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
      item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

S2.define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    var data = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);

    this.addOptions(this.convertToOptions(data));
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option').filter(function (i, elm) {
      return elm.value == data.id.toString();
    });

    if ($option.length === 0) {
      $option = this.option(data);

      this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if ($.inArray(item.id, existingIds) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, item, existingData);

        var $newOption = this.option(newData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        Utils.appendMany($option, $children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

S2.define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return $.extend({}, params, {
          q: params.term
        });
      },
      transport: function (params, success, failure) {
        var $request = $.ajax(params);

        $request.then(success);
        $request.fail(failure);

        return $request;
      }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if ($.isFunction(this._request.abort)) {
        this._request.abort();
      }

      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data.call(this.$element, params);
    }

    function request () {
      var $request = options.transport(options, function (data) {
        var results = self.processResults(data, params);

        if (self.options.get('debug') && window.console && console.error) {
          // Check to make sure that the response included a `results` key.
          if (!results || !results.results || !$.isArray(results.results)) {
            console.error(
              'Select2: The AJAX results did not return an array in the ' +
              '`results` key of the response.'
            );
          }
        }

        callback(results);
      }, function () {
        // Attempt to detect if a request was aborted
        // Only works if the transport exposes a status property
        if ($request.status && $request.status === '0') {
          return;
        }

        self.trigger('results:message', {
          message: 'errorLoading'
        });
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

S2.define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
      this.createTag = createTag;
    }

    var insertTag = options.get('insertTag');

    if (insertTag !== undefined) {
        this.insertTag = insertTag;
    }

    decorated.call(this, $element, options);

    if ($.isArray(tags)) {
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        var item = this._normalizeItem(tag);

        var $option = this.option(item);

        this.$element.append($option);
      }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (obj, child) {
      var data = obj.results;

      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null &&
          !wrapper({
            results: option.children
          }, true)
        );

        var checkText = option.text === params.term;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          obj.data = data;
          callback(obj);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);

      if (tag != null) {
        var $option = self.option(tag);
        $option.attr('data-select2-tag', true);

        self.addOptions([$option]);

        self.insertTag(data, tag);
      }

      obj.results = data;

      callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var tag = this._lastTag;

    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
      if (this.selected) {
        return;
      }

      $(this).remove();
    });
  };

  return Tags;
});

S2.define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function createAndSelect (data) {
      // Normalize the data object so we can use it for checks
      var item = self._normalizeItem(data);

      // Check if the data object already exists as a tag
      // Select it if it doesn't
      var $existingOptions = self.$element.find('option').filter(function () {
        return $(this).val() === item.id;
      });

      // If an existing option wasn't found for it, create the option
      if (!$existingOptions.length) {
        var $option = self.option(item);
        $option.attr('data-select2-tag', true);

        self._removeOldTags();
        self.addOptions([$option]);
      }

      // Select the item, now that we know there is an option for it
      select(item);
    }

    function select (data) {
      self.trigger('select', {
        data: data
      });
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.focus();
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      return {
        id: params.term,
        text: params.term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if ($.inArray(termChar, separators) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      if (data == null) {
        i++;
        continue;
      }

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});

S2.define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooShort',
        args: {
          minimum: this.minimumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

S2.define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
        params.term.length > this.maximumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooLong',
        args: {
          maximum: this.maximumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

S2.define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
      var self = this;

      this.current(function (currentData) {
        var count = currentData != null ? currentData.length : 0;
        if (self.maximumSelectionLength > 0 &&
          count >= self.maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: self.maximumSelectionLength
            }
          });
          return;
        }
        decorated.call(self, params, callback);
      });
  };

  return MaximumSelectionLength;
});

S2.define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.bind = function () {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implmented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  return Dropdown;
});

S2.define('select2/dropdown/search',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
      '<span class="select2-search select2-search--dropdown">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
        ' spellcheck="false" role="textbox" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();
    });

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$search.on('input', function (evt) {
      // Unbind the duplicated `keyup` event
      $(this).off('keyup');
    });

    this.$search.on('keyup input', function (evt) {
      self.handleSearch(evt);
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);

      self.$search.focus();

      window.setTimeout(function () {
        self.$search.focus();
      }, 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);

      self.$search.val('');
    });

    container.on('focus', function () {
      if (container.isOpen()) {
        self.$search.focus();
      }
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer.removeClass('select2-search--hide');
        } else {
          self.$searchContainer.addClass('select2-search--hide');
        }
      }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

S2.define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
      var item = data[d];

      if (this.placeholder.id === item.id) {
        modifiedData.splice(d, 1);
      }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

S2.define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.$results.append(this.$loadingMore);
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.$results.on('scroll', function () {
      var isLoadMoreVisible = $.contains(
        document.documentElement,
        self.$loadingMore[0]
      );

      if (self.loading || !isLoadMoreVisible) {
        return;
      }

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var loadingMoreOffset = self.$loadingMore.offset().top +
        self.$loadingMore.outerHeight(false);

      if (currentOffset + 50 >= loadingMoreOffset) {
        self.loadMore();
      }
    });
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
      '<li ' +
      'class="select2-results__option select2-results__option--load-more"' +
      'role="treeitem" aria-disabled="true"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

S2.define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = options.get('dropdownParent') || $(document.body);

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var setupResultsEvents = false;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      if (!setupResultsEvents) {
        setupResultsEvents = true;

        container.on('results:all', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });

        container.on('results:append', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });
      }
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.$dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown.removeClass('select2');
    $dropdown.addClass('select2-container--open');

    $dropdown.css({
      position: 'absolute',
      top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._attachPositioningHandler =
      function (decorated, container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
      $(this).data('select2-scroll-position', {
        x: $(this).scrollLeft(),
        y: $(this).scrollTop()
      });
    });

    $watchers.on(scrollEvent, function (ev) {
      var position = $(this).data('select2-scroll-position');
      $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler =
      function (decorated, container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
      left: offset.left,
      top: container.bottom
    };

    // Determine what the parent element is to use for calciulating the offset
    var $offsetParent = this.$dropdownParent;

    // For statically positoned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css('position') === 'static') {
      $offsetParent = $offsetParent.offsetParent();
    }

    var parentOffset = $offsetParent.offset();

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')) {
      css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown
        .removeClass('select2-dropdown--below select2-dropdown--above')
        .addClass('select2-dropdown--' + newDirection);
      this.$container
        .removeClass('select2-container--below select2-container--above')
        .addClass('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var css = {
      width: this.$container.outerWidth(false) + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
      css.minWidth = css.width;
      css.position = 'relative';
      css.width = 'auto';
    }

    this.$dropdown.css(css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

S2.define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    var count = 0;

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      if (item.children) {
        count += countResults(item.children);
      } else {
        count++;
      }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    if (this.minimumResultsForSearch < 0) {
      this.minimumResultsForSearch = Infinity;
    }

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
      return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

S2.define('select2/dropdown/selectOnClose',[

], function () {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function (params) {
      self._handleSelectOnClose(params);
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
    if (params && params.originalSelect2Event != null) {
      var event = params.originalSelect2Event;

      // Don't select an item if the close event was triggered from a select or
      // unselect event
      if (event._type === 'select' || event._type === 'unselect') {
        return;
      }
    }

    var $highlightedResults = this.getHighlightedResults();

    // Only select highlighted results
    if ($highlightedResults.length < 1) {
      return;
    }

    var data = $highlightedResults.data('data');

    // Don't re-select already selected resulte
    if (
      (data.element != null && data.element.selected) ||
      (data.element == null && data.selected)
    ) {
      return;
    }

    this.trigger('select', {
        data: data
    });
  };

  return SelectOnClose;
});

S2.define('select2/dropdown/closeOnSelect',[

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
      self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
      self._selectTriggered(evt);
    });
  };

  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    var originalEvent = evt.originalEvent;

    // Don't close if the control key is being held
    if (originalEvent && originalEvent.ctrlKey) {
      return;
    }

    this.trigger('close', {
      originalEvent: originalEvent,
      originalSelect2Event: evt
    });
  };

  return CloseOnSelect;
});

S2.define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    }
  };
});

S2.define('select2/defaults',[
  'jquery',
  'require',

  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',
  './dropdown/closeOnSelect',

  './i18n/en'
], function ($, require,

             ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend(true, {}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }

      if (options.minimumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MinimumInputLength
        );
      }

      if (options.maximumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumInputLength
        );
      }

      if (options.maximumSelectionLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumSelectionLength
        );
      }

      if (options.tags) {
        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Tokenizer
        );
      }

      if (options.query != null) {
        var Query = require(options.amdBase + 'compat/query');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Query
        );
      }

      if (options.initSelection != null) {
        var InitSelection = require(options.amdBase + 'compat/initSelection');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          InitSelection
        );
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }

      if (options.selectOnClose) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          SelectOnClose
        );
      }
    }

    if (options.dropdownAdapter == null) {
      if (options.multiple) {
        options.dropdownAdapter = Dropdown;
      } else {
        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

        options.dropdownAdapter = SearchableDropdown;
      }

      if (options.minimumResultsForSearch !== 0) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          MinimumResultsForSearch
        );
      }

      if (options.closeOnSelect) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          CloseOnSelect
        );
      }

      if (
        options.dropdownCssClass != null ||
        options.dropdownCss != null ||
        options.adaptDropdownCssClass != null
      ) {
        var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          DropdownCSS
        );
      }

      options.dropdownAdapter = Utils.Decorate(
        options.dropdownAdapter,
        AttachBody
      );
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );
      }

      if (options.allowClear) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          AllowClear
        );
      }

      if (options.multiple) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionSearch
        );
      }

      if (
        options.containerCssClass != null ||
        options.containerCss != null ||
        options.adaptContainerCssClass != null
      ) {
        var ContainerCSS = require(options.amdBase + 'compat/containerCss');

        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          ContainerCSS
        );
      }

      options.selectionAdapter = Utils.Decorate(
        options.selectionAdapter,
        EventRelay
      );
    }

    if (typeof options.language === 'string') {
      // Check if the language is specified with a region
      if (options.language.indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = options.language.split('-');
        var baseLanguage = languageParts[0];

        options.language = [options.language, baseLanguage];
      } else {
        options.language = [options.language];
      }
    }

    if ($.isArray(options.language)) {
      var languages = new Translation();
      options.language.push('en');

      var languageNames = options.language;

      for (var l = 0; l < languageNames.length; l++) {
        var name = languageNames[l];
        var language = {};

        try {
          // Try to load it with the original name
          language = Translation.loadPath(name);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            name = this.defaults.amdLanguageBase + name;
            language = Translation.loadPath(name);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files.
            if (options.debug && window.console && console.warn) {
              console.warn(
                'Select2: The language file for "' + name + '" could not be ' +
                'automatically loaded. A fallback will be used instead.'
              );
            }

            continue;
          }
        }

        languages.extend(language);
      }

      options.translations = languages;
    } else {
      var baseTranslation = Translation.loadPath(
        this.defaults.amdLanguageBase + 'en'
      );
      var customTranslation = new Translation(options.language);

      customTranslation.extend(baseTranslation);

      options.translations = customTranslation;
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdBase: './',
      amdLanguageBase: './i18n/',
      closeOnSelect: true,
      debug: false,
      dropdownAutoWidth: false,
      escapeMarkup: Utils.escapeMarkup,
      language: EnglishTranslation,
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

S2.define('select2/options',[
  'require',
  'jquery',
  './defaults',
  './utils'
], function (require, $, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    this.options = Defaults.apply(this.options);

    if ($element && $element.is('input')) {
      var InputCompat = require(this.get('amdBase') + 'compat/inputData');

      this.options.dataAdapter = Utils.Decorate(
        this.options.dataAdapter,
        InputCompat
      );
    }
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
      if ($e.prop('lang')) {
        this.options.language = $e.prop('lang').toLowerCase();
      } else if ($e.closest('[lang]').prop('lang')) {
        this.options.language = $e.closest('[lang]').prop('lang');
      }
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if ($e.data('select2Tags')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      $e.data('data', $e.data('select2Tags'));
      $e.data('tags', true);
    }

    if ($e.data('ajaxUrl')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-url` attribute has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.attr('ajax--url', $e.data('ajaxUrl'));
      $e.data('ajax--url', $e.data('ajaxUrl'));
    }

    var dataset = {};

    // Prefer the element's `dataset` attribute if it exists
    // jQuery 1.x does not correctly handle data attributes with multiple dashes
    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
      dataset = $.extend(true, {}, $e[0].dataset, $e.data());
    } else {
      dataset = $e.data();
    }

    var data = $.extend(true, {}, dataset);

    data = Utils._convertData(data);

    for (var key in data) {
      if ($.inArray(key, excludedData) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

S2.define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if ($element.data('select2') != null) {
      $element.data('select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up the tabindex

    var tabindex = $element.attr('tabindex') || 0;
    $element.data('old-tabindex', tabindex);
    $element.attr('tabindex', '-1');

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.dataAdapter = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.dataAdapter.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    // Hide the original select
    $element.addClass('select2-hidden-accessible');
    $element.attr('aria-hidden', 'true');

    // Synchronize any monitored attributes
    this._syncAttributes();

    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
      $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
      var styleWidth = this._resolveWidth($element, 'style');

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
      var elementWidth = $element.outerWidth(false);

      if (elementWidth <= 0) {
        return 'auto';
      }

      return elementWidth + 'px';
    }

    if (method == 'style') {
      var style = $element.attr('style');

      if (typeof(style) !== 'string') {
        return null;
      }

      var attrs = style.split(';');

      for (var i = 0, l = attrs.length; i < l; i = i + 1) {
        var attr = attrs[i].replace(/\s/g, '');
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.dataAdapter.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
      self.dataAdapter.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this.$element.on('focus.select2', function (evt) {
      self.trigger('focus', evt);
    });

    this._syncA = Utils.bind(this._syncAttributes, this);
    this._syncS = Utils.bind(this._syncSubtree, this);

    if (this.$element[0].attachEvent) {
      this.$element[0].attachEvent('onpropertychange', this._syncA);
    }

    var observer = window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    ;

    if (observer != null) {
      this._observer = new observer(function (mutations) {
        $.each(mutations, self._syncA);
        $.each(mutations, self._syncS);
      });
      this._observer.observe(this.$element[0], {
        attributes: true,
        childList: true,
        subtree: false
      });
    } else if (this.$element[0].addEventListener) {
      this.$element[0].addEventListener(
        'DOMAttrModified',
        self._syncA,
        false
      );
      this.$element[0].addEventListener(
        'DOMNodeInserted',
        self._syncS,
        false
      );
      this.$element[0].addEventListener(
        'DOMNodeRemoved',
        self._syncS,
        false
      );
    }
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.dataAdapter.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle', 'focus'];

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('focus', function (params) {
      self.focus(params);
    });

    this.selection.on('*', function (name, params) {
      if ($.inArray(name, nonRelayEvents) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container.addClass('select2-container--open');
    });

    this.on('close', function () {
      self.$container.removeClass('select2-container--open');
    });

    this.on('enable', function () {
      self.$container.removeClass('select2-container--disabled');
    });

    this.on('disable', function () {
      self.$container.addClass('select2-container--disabled');
    });

    this.on('blur', function () {
      self.$container.removeClass('select2-container--focus');
    });

    this.on('query', function (params) {
      if (!self.isOpen()) {
        self.trigger('open', {});
      }

      this.dataAdapter.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.on('query:append', function (params) {
      this.dataAdapter.query(params, function (data) {
        self.trigger('results:append', {
          data: data,
          query: params
        });
      });
    });

    this.on('keypress', function (evt) {
      var key = evt.which;

      if (self.isOpen()) {
        if (key === KEYS.ESC || key === KEYS.TAB ||
            (key === KEYS.UP && evt.altKey)) {
          self.close();

          evt.preventDefault();
        } else if (key === KEYS.ENTER) {
          self.trigger('results:select', {});

          evt.preventDefault();
        } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
          self.trigger('results:toggle', {});

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger('results:previous', {});

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger('results:next', {});

          evt.preventDefault();
        }
      } else {
        if (key === KEYS.ENTER || key === KEYS.SPACE ||
            (key === KEYS.DOWN && evt.altKey)) {
          self.open();

          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.options.get('disabled')) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable', {});
    } else {
      this.trigger('enable', {});
    }
  };

  Select2.prototype._syncSubtree = function (evt, mutations) {
    var changed = false;
    var self = this;

    // Ignore any mutation events raised for elements that aren't options or
    // optgroups. This handles the case when the select element is destroyed
    if (
      evt && evt.target && (
        evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP'
      )
    ) {
      return;
    }

    if (!mutations) {
      // If mutation events aren't supported, then we can only assume that the
      // change affected the selections
      changed = true;
    } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
      for (var n = 0; n < mutations.addedNodes.length; n++) {
        var node = mutations.addedNodes[n];

        if (node.selected) {
          changed = true;
        }
      }
    } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
      changed = true;
    }

    // Only re-pull the data if we think there is a change
    if (changed) {
      this.dataAdapter.current(function (currentData) {
        self.trigger('selection:update', {
          data: currentData
        });
      });
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      'open': 'opening',
      'close': 'closing',
      'select': 'selecting',
      'unselect': 'unselecting'
    };

    if (args === undefined) {
      args = {};
    }

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.options.get('disabled')) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    this.trigger('query', {});
  };

  Select2.prototype.close = function () {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close', {});
  };

  Select2.prototype.isOpen = function () {
    return this.$container.hasClass('select2-container--open');
  };

  Select2.prototype.hasFocus = function () {
    return this.$container.hasClass('select2-container--focus');
  };

  Select2.prototype.focus = function (data) {
    // No need to re-trigger focus events if we are already focused
    if (this.hasFocus()) {
      return;
    }

    this.$container.addClass('select2-container--focus');
    this.trigger('focus', {});
  };

  Select2.prototype.enable = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("enable")` method has been deprecated and will' +
        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
        ' instead.'
      );
    }

    if (args == null || args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.data = function () {
    if (this.options.get('debug') &&
        arguments.length > 0 && window.console && console.warn) {
      console.warn(
        'Select2: Data can no longer be set using `select2("data")`. You ' +
        'should consider setting the value instead using `$element.val()`.'
      );
    }

    var data = [];

    this.dataAdapter.current(function (currentData) {
      data = currentData;
    });

    return data;
  };

  Select2.prototype.val = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("val")` method has been deprecated and will be' +
        ' removed in later Select2 versions. Use $element.val() instead.'
      );
    }

    if (args == null || args.length === 0) {
      return this.$element.val();
    }

    var newVal = args[0];

    if ($.isArray(newVal)) {
      newVal = $.map(newVal, function (obj) {
        return obj.toString();
      });
    }

    this.$element.val(newVal).trigger('change');
  };

  Select2.prototype.destroy = function () {
    this.$container.remove();

    if (this.$element[0].detachEvent) {
      this.$element[0].detachEvent('onpropertychange', this._syncA);
    }

    if (this._observer != null) {
      this._observer.disconnect();
      this._observer = null;
    } else if (this.$element[0].removeEventListener) {
      this.$element[0]
        .removeEventListener('DOMAttrModified', this._syncA, false);
      this.$element[0]
        .removeEventListener('DOMNodeInserted', this._syncS, false);
      this.$element[0]
        .removeEventListener('DOMNodeRemoved', this._syncS, false);
    }

    this._syncA = null;
    this._syncS = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex', this.$element.data('old-tabindex'));

    this.$element.removeClass('select2-hidden-accessible');
    this.$element.attr('aria-hidden', 'false');
    this.$element.removeData('select2');

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.dataAdapter = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container.addClass('select2-container--' + this.options.get('theme'));

    $container.data('element', this.$element);

    return $container;
  };

  return Select2;
});

S2.define('select2/compat/utils',[
  'jquery'
], function ($) {
  function syncCssClasses ($dest, $src, adapter) {
    var classes, replacements = [], adapted;

    classes = $.trim($dest.attr('class'));

    if (classes) {
      classes = '' + classes; // for IE which returns object

      $(classes.split(/\s+/)).each(function () {
        // Save all Select2 classes
        if (this.indexOf('select2-') === 0) {
          replacements.push(this);
        }
      });
    }

    classes = $.trim($src.attr('class'));

    if (classes) {
      classes = '' + classes; // for IE which returns object

      $(classes.split(/\s+/)).each(function () {
        // Only adapt non-Select2 classes
        if (this.indexOf('select2-') !== 0) {
          adapted = adapter(this);

          if (adapted != null) {
            replacements.push(adapted);
          }
        }
      });
    }

    $dest.attr('class', replacements.join(' '));
  }

  return {
    syncCssClasses: syncCssClasses
  };
});

S2.define('select2/compat/containerCss',[
  'jquery',
  './utils'
], function ($, CompatUtils) {
  // No-op CSS adapter that discards all classes by default
  function _containerAdapter (clazz) {
    return null;
  }

  function ContainerCSS () { }

  ContainerCSS.prototype.render = function (decorated) {
    var $container = decorated.call(this);

    var containerCssClass = this.options.get('containerCssClass') || '';

    if ($.isFunction(containerCssClass)) {
      containerCssClass = containerCssClass(this.$element);
    }

    var containerCssAdapter = this.options.get('adaptContainerCssClass');
    containerCssAdapter = containerCssAdapter || _containerAdapter;

    if (containerCssClass.indexOf(':all:') !== -1) {
      containerCssClass = containerCssClass.replace(':all:', '');

      var _cssAdapter = containerCssAdapter;

      containerCssAdapter = function (clazz) {
        var adapted = _cssAdapter(clazz);

        if (adapted != null) {
          // Append the old one along with the adapted one
          return adapted + ' ' + clazz;
        }

        return clazz;
      };
    }

    var containerCss = this.options.get('containerCss') || {};

    if ($.isFunction(containerCss)) {
      containerCss = containerCss(this.$element);
    }

    CompatUtils.syncCssClasses($container, this.$element, containerCssAdapter);

    $container.css(containerCss);
    $container.addClass(containerCssClass);

    return $container;
  };

  return ContainerCSS;
});

S2.define('select2/compat/dropdownCss',[
  'jquery',
  './utils'
], function ($, CompatUtils) {
  // No-op CSS adapter that discards all classes by default
  function _dropdownAdapter (clazz) {
    return null;
  }

  function DropdownCSS () { }

  DropdownCSS.prototype.render = function (decorated) {
    var $dropdown = decorated.call(this);

    var dropdownCssClass = this.options.get('dropdownCssClass') || '';

    if ($.isFunction(dropdownCssClass)) {
      dropdownCssClass = dropdownCssClass(this.$element);
    }

    var dropdownCssAdapter = this.options.get('adaptDropdownCssClass');
    dropdownCssAdapter = dropdownCssAdapter || _dropdownAdapter;

    if (dropdownCssClass.indexOf(':all:') !== -1) {
      dropdownCssClass = dropdownCssClass.replace(':all:', '');

      var _cssAdapter = dropdownCssAdapter;

      dropdownCssAdapter = function (clazz) {
        var adapted = _cssAdapter(clazz);

        if (adapted != null) {
          // Append the old one along with the adapted one
          return adapted + ' ' + clazz;
        }

        return clazz;
      };
    }

    var dropdownCss = this.options.get('dropdownCss') || {};

    if ($.isFunction(dropdownCss)) {
      dropdownCss = dropdownCss(this.$element);
    }

    CompatUtils.syncCssClasses($dropdown, this.$element, dropdownCssAdapter);

    $dropdown.css(dropdownCss);
    $dropdown.addClass(dropdownCssClass);

    return $dropdown;
  };

  return DropdownCSS;
});

S2.define('select2/compat/initSelection',[
  'jquery'
], function ($) {
  function InitSelection (decorated, $element, options) {
    if (options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `initSelection` option has been deprecated in favor' +
        ' of a custom data adapter that overrides the `current` method. ' +
        'This method is now called multiple times instead of a single ' +
        'time when the instance is initialized. Support will be removed ' +
        'for the `initSelection` option in future versions of Select2'
      );
    }

    this.initSelection = options.get('initSelection');
    this._isInitialized = false;

    decorated.call(this, $element, options);
  }

  InitSelection.prototype.current = function (decorated, callback) {
    var self = this;

    if (this._isInitialized) {
      decorated.call(this, callback);

      return;
    }

    this.initSelection.call(null, this.$element, function (data) {
      self._isInitialized = true;

      if (!$.isArray(data)) {
        data = [data];
      }

      callback(data);
    });
  };

  return InitSelection;
});

S2.define('select2/compat/inputData',[
  'jquery'
], function ($) {
  function InputData (decorated, $element, options) {
    this._currentData = [];
    this._valueSeparator = options.get('valueSeparator') || ',';

    if ($element.prop('type') === 'hidden') {
      if (options.get('debug') && console && console.warn) {
        console.warn(
          'Select2: Using a hidden input with Select2 is no longer ' +
          'supported and may stop working in the future. It is recommended ' +
          'to use a `<select>` element instead.'
        );
      }
    }

    decorated.call(this, $element, options);
  }

  InputData.prototype.current = function (_, callback) {
    function getSelected (data, selectedIds) {
      var selected = [];

      if (data.selected || $.inArray(data.id, selectedIds) !== -1) {
        data.selected = true;
        selected.push(data);
      } else {
        data.selected = false;
      }

      if (data.children) {
        selected.push.apply(selected, getSelected(data.children, selectedIds));
      }

      return selected;
    }

    var selected = [];

    for (var d = 0; d < this._currentData.length; d++) {
      var data = this._currentData[d];

      selected.push.apply(
        selected,
        getSelected(
          data,
          this.$element.val().split(
            this._valueSeparator
          )
        )
      );
    }

    callback(selected);
  };

  InputData.prototype.select = function (_, data) {
    if (!this.options.get('multiple')) {
      this.current(function (allData) {
        $.map(allData, function (data) {
          data.selected = false;
        });
      });

      this.$element.val(data.id);
      this.$element.trigger('change');
    } else {
      var value = this.$element.val();
      value += this._valueSeparator + data.id;

      this.$element.val(value);
      this.$element.trigger('change');
    }
  };

  InputData.prototype.unselect = function (_, data) {
    var self = this;

    data.selected = false;

    this.current(function (allData) {
      var values = [];

      for (var d = 0; d < allData.length; d++) {
        var item = allData[d];

        if (data.id == item.id) {
          continue;
        }

        values.push(item.id);
      }

      self.$element.val(values.join(self._valueSeparator));
      self.$element.trigger('change');
    });
  };

  InputData.prototype.query = function (_, params, callback) {
    var results = [];

    for (var d = 0; d < this._currentData.length; d++) {
      var data = this._currentData[d];

      var matches = this.matches(params, data);

      if (matches !== null) {
        results.push(matches);
      }
    }

    callback({
      results: results
    });
  };

  InputData.prototype.addOptions = function (_, $options) {
    var options = $.map($options, function ($option) {
      return $.data($option[0], 'data');
    });

    this._currentData.push.apply(this._currentData, options);
  };

  return InputData;
});

S2.define('select2/compat/matcher',[
  'jquery'
], function ($) {
  function oldMatcher (matcher) {
    function wrappedMatcher (params, data) {
      var match = $.extend(true, {}, data);

      if (params.term == null || $.trim(params.term) === '') {
        return match;
      }

      if (data.children) {
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          // Check if the child object matches
          // The old matcher returned a boolean true or false
          var doesMatch = matcher(params.term, child.text, child);

          // If the child didn't match, pop it off
          if (!doesMatch) {
            match.children.splice(c, 1);
          }
        }

        if (match.children.length > 0) {
          return match;
        }
      }

      if (matcher(params.term, data.text, data)) {
        return match;
      }

      return null;
    }

    return wrappedMatcher;
  }

  return oldMatcher;
});

S2.define('select2/compat/query',[

], function () {
  function Query (decorated, $element, options) {
    if (options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `query` option has been deprecated in favor of a ' +
        'custom data adapter that overrides the `query` method. Support ' +
        'will be removed for the `query` option in future versions of ' +
        'Select2.'
      );
    }

    decorated.call(this, $element, options);
  }

  Query.prototype.query = function (_, params, callback) {
    params.callback = callback;

    var query = this.options.get('query');

    query.call(null, params);
  };

  return Query;
});

S2.define('select2/dropdown/attachContainer',[

], function () {
  function AttachContainer (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  AttachContainer.prototype.position =
    function (decorated, $dropdown, $container) {
    var $dropdownContainer = $container.find('.dropdown-wrapper');
    $dropdownContainer.append($dropdown);

    $dropdown.addClass('select2-dropdown--below');
    $container.addClass('select2-container--below');
  };

  return AttachContainer;
});

S2.define('select2/dropdown/stopPropagation',[

], function () {
  function StopPropagation () { }

  StopPropagation.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    var stoppedEvents = [
    'blur',
    'change',
    'click',
    'dblclick',
    'focus',
    'focusin',
    'focusout',
    'input',
    'keydown',
    'keyup',
    'keypress',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseover',
    'mouseup',
    'search',
    'touchend',
    'touchstart'
    ];

    this.$dropdown.on(stoppedEvents.join(' '), function (evt) {
      evt.stopPropagation();
    });
  };

  return StopPropagation;
});

S2.define('select2/selection/stopPropagation',[

], function () {
  function StopPropagation () { }

  StopPropagation.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    var stoppedEvents = [
      'blur',
      'change',
      'click',
      'dblclick',
      'focus',
      'focusin',
      'focusout',
      'input',
      'keydown',
      'keyup',
      'keypress',
      'mousedown',
      'mouseenter',
      'mouseleave',
      'mousemove',
      'mouseover',
      'mouseup',
      'search',
      'touchend',
      'touchstart'
    ];

    this.$selection.on(stoppedEvents.join(' '), function (evt) {
      evt.stopPropagation();
    });
  };

  return StopPropagation;
});

/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof S2.define === 'function' && S2.define.amd ) {
        // AMD. Register as an anonymous module.
        S2.define('jquery-mousewheel',['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

S2.define('jquery.select2',[
  'jquery',
  'jquery-mousewheel',

  './select2/core',
  './select2/defaults'
], function ($, _, Select2, Defaults) {
  if ($.fn.select2 == null) {
    // All methods that should return the element
    var thisMethods = ['open', 'close', 'destroy'];

    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend(true, {}, options);

          var instance = new Select2($(this), instanceOptions);
        });

        return this;
      } else if (typeof options === 'string') {
        var ret;
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var instance = $(this).data('select2');

          if (instance == null && window.console && console.error) {
            console.error(
              'The select2(\'' + options + '\') method was called on an ' +
              'element that is not using Select2.'
            );
          }

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning `this`
        if ($.inArray(options, thisMethods) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = Defaults;
  }

  return Select2;
});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));
;
// Magnific Popup v1.1.0 by Dmitry Semenov
// http://bit.ly/magnific-popup#build=inline+image+ajax+iframe+gallery+retina+imagezoom
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?e(require("jquery")):e(window.jQuery||window.Zepto)}(function(d){var l="Close",c="BeforeClose",i="AfterClose",n="BeforeAppend",p="MarkupParse",u="Open",o="Change",a="mfp",f="."+a,m="mfp-ready",r="mfp-removing",s="mfp-prevent-close",g,e=function(){},h=!!window.jQuery,v,y=d(window),b,w,C,t,x=function(e,t){g.ev.on(a+e+f,t)},I=function(e,t,i,n){var o=document.createElement("div");return o.className="mfp-"+e,i&&(o.innerHTML=i),n?t&&t.appendChild(o):(o=d(o),t&&o.appendTo(t)),o},k=function(e,t){g.ev.triggerHandler(a+e,t),g.st.callbacks&&(e=e.charAt(0).toLowerCase()+e.slice(1),g.st.callbacks[e]&&g.st.callbacks[e].apply(g,d.isArray(t)?t:[t]))},_=function(e){return e===t&&g.currTemplate.closeBtn||(g.currTemplate.closeBtn=d(g.st.closeMarkup.replace("%title%",g.st.tClose)),t=e),g.currTemplate.closeBtn},P=function(){d.magnificPopup.instance||((g=new e).init(),d.magnificPopup.instance=g)},T=function(){var e=document.createElement("p").style,t=["ms","O","Moz","Webkit"];if(void 0!==e.transition)return!0;for(;t.length;)if(t.pop()+"Transition"in e)return!0;return!1};e.prototype={constructor:e,init:function(){var e=navigator.appVersion;g.isLowIE=g.isIE8=document.all&&!document.addEventListener,g.isAndroid=/android/gi.test(e),g.isIOS=/iphone|ipad|ipod/gi.test(e),g.supportsTransition=T(),g.probablyMobile=g.isAndroid||g.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),b=d(document),g.popupsCache={}},open:function(e){var t;if(!1===e.isObj){g.items=e.items.toArray(),g.index=0;var i=e.items,n;for(t=0;t<i.length;t++)if((n=i[t]).parsed&&(n=n.el[0]),n===e.el[0]){g.index=t;break}}else g.items=d.isArray(e.items)?e.items:[e.items],g.index=e.index||0;if(!g.isOpen){g.types=[],C="",e.mainEl&&e.mainEl.length?g.ev=e.mainEl.eq(0):g.ev=b,e.key?(g.popupsCache[e.key]||(g.popupsCache[e.key]={}),g.currTemplate=g.popupsCache[e.key]):g.currTemplate={},g.st=d.extend(!0,{},d.magnificPopup.defaults,e),g.fixedContentPos="auto"===g.st.fixedContentPos?!g.probablyMobile:g.st.fixedContentPos,g.st.modal&&(g.st.closeOnContentClick=!1,g.st.closeOnBgClick=!1,g.st.showCloseBtn=!1,g.st.enableEscapeKey=!1),g.bgOverlay||(g.bgOverlay=I("bg").on("click"+f,function(){g.close()}),g.wrap=I("wrap").attr("tabindex",-1).on("click"+f,function(e){g._checkIfClose(e.target)&&g.close()}),g.container=I("container",g.wrap)),g.contentContainer=I("content"),g.st.preloader&&(g.preloader=I("preloader",g.container,g.st.tLoading));var o=d.magnificPopup.modules;for(t=0;t<o.length;t++){var a=o[t];a=a.charAt(0).toUpperCase()+a.slice(1),g["init"+a].call(g)}k("BeforeOpen"),g.st.showCloseBtn&&(g.st.closeBtnInside?(x(p,function(e,t,i,n){i.close_replaceWith=_(n.type)}),C+=" mfp-close-btn-in"):g.wrap.append(_())),g.st.alignTop&&(C+=" mfp-align-top"),g.fixedContentPos?g.wrap.css({overflow:g.st.overflowY,overflowX:"hidden",overflowY:g.st.overflowY}):g.wrap.css({top:y.scrollTop(),position:"absolute"}),(!1===g.st.fixedBgPos||"auto"===g.st.fixedBgPos&&!g.fixedContentPos)&&g.bgOverlay.css({height:b.height(),position:"absolute"}),g.st.enableEscapeKey&&b.on("keyup"+f,function(e){27===e.keyCode&&g.close()}),y.on("resize"+f,function(){g.updateSize()}),g.st.closeOnContentClick||(C+=" mfp-auto-cursor"),C&&g.wrap.addClass(C);var r=g.wH=y.height(),s={};if(g.fixedContentPos&&g._hasScrollBar(r)){var l=g._getScrollbarSize();l&&(s.marginRight=l)}g.fixedContentPos&&(g.isIE7?d("body, html").css("overflow","hidden"):s.overflow="hidden");var c=g.st.mainClass;return g.isIE7&&(c+=" mfp-ie7"),c&&g._addClassToMFP(c),g.updateItemHTML(),k("BuildControls"),d("html").css(s),g.bgOverlay.add(g.wrap).prependTo(g.st.prependTo||d(document.body)),g._lastFocusedEl=document.activeElement,setTimeout(function(){g.content?(g._addClassToMFP(m),g._setFocus()):g.bgOverlay.addClass(m),b.on("focusin"+f,g._onFocusIn)},16),g.isOpen=!0,g.updateSize(r),k(u),e}g.updateItemHTML()},close:function(){g.isOpen&&(k(c),g.isOpen=!1,g.st.removalDelay&&!g.isLowIE&&g.supportsTransition?(g._addClassToMFP(r),setTimeout(function(){g._close()},g.st.removalDelay)):g._close())},_close:function(){k(l);var e=r+" "+m+" ";if(g.bgOverlay.detach(),g.wrap.detach(),g.container.empty(),g.st.mainClass&&(e+=g.st.mainClass+" "),g._removeClassFromMFP(e),g.fixedContentPos){var t={marginRight:""};g.isIE7?d("body, html").css("overflow",""):t.overflow="",d("html").css(t)}b.off("keyup.mfp focusin"+f),g.ev.off(f),g.wrap.attr("class","mfp-wrap").removeAttr("style"),g.bgOverlay.attr("class","mfp-bg"),g.container.attr("class","mfp-container"),g.st.showCloseBtn&&(!g.st.closeBtnInside||!0===g.currTemplate[g.currItem.type])&&g.currTemplate.closeBtn&&g.currTemplate.closeBtn.detach(),g.st.autoFocusLast&&g._lastFocusedEl&&d(g._lastFocusedEl).focus(),g.currItem=null,g.content=null,g.currTemplate=null,g.prevHeight=0,k(i)},updateSize:function(e){if(g.isIOS){var t=document.documentElement.clientWidth/window.innerWidth,i=window.innerHeight*t;g.wrap.css("height",i),g.wH=i}else g.wH=e||y.height();g.fixedContentPos||g.wrap.css("height",g.wH),k("Resize")},updateItemHTML:function(){var e=g.items[g.index];g.contentContainer.detach(),g.content&&g.content.detach(),e.parsed||(e=g.parseEl(g.index));var t=e.type;if(k("BeforeChange",[g.currItem?g.currItem.type:"",t]),g.currItem=e,!g.currTemplate[t]){var i=!!g.st[t]&&g.st[t].markup;k("FirstMarkupParse",i),g.currTemplate[t]=!i||d(i)}w&&w!==e.type&&g.container.removeClass("mfp-"+w+"-holder");var n=g["get"+t.charAt(0).toUpperCase()+t.slice(1)](e,g.currTemplate[t]);g.appendContent(n,t),e.preloaded=!0,k(o,e),w=e.type,g.container.prepend(g.contentContainer),k("AfterChange")},appendContent:function(e,t){(g.content=e)?g.st.showCloseBtn&&g.st.closeBtnInside&&!0===g.currTemplate[t]?g.content.find(".mfp-close").length||g.content.append(_()):g.content=e:g.content="",k(n),g.container.addClass("mfp-"+t+"-holder"),g.contentContainer.append(g.content)},parseEl:function(e){var t=g.items[e],i;if((t=t.tagName?{el:d(t)}:(i=t.type,{data:t,src:t.src})).el){for(var n=g.types,o=0;o<n.length;o++)if(t.el.hasClass("mfp-"+n[o])){i=n[o];break}t.src=t.el.attr("data-mfp-src"),t.src||(t.src=t.el.attr("href"))}return t.type=i||g.st.type||"inline",t.index=e,t.parsed=!0,g.items[e]=t,k("ElementParse",t),g.items[e]},addGroup:function(t,i){var e=function(e){e.mfpEl=this,g._openClick(e,t,i)};i||(i={});var n="click.magnificPopup";i.mainEl=t,i.items?(i.isObj=!0,t.off(n).on(n,e)):(i.isObj=!1,i.delegate?t.off(n).on(n,i.delegate,e):(i.items=t).off(n).on(n,e))},_openClick:function(e,t,i){var n;if((void 0!==i.midClick?i.midClick:d.magnificPopup.defaults.midClick)||!(2===e.which||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)){var o=void 0!==i.disableOn?i.disableOn:d.magnificPopup.defaults.disableOn;if(o)if(d.isFunction(o)){if(!o.call(g))return!0}else if(y.width()<o)return!0;e.type&&(e.preventDefault(),g.isOpen&&e.stopPropagation()),i.el=d(e.mfpEl),i.delegate&&(i.items=t.find(i.delegate)),g.open(i)}},updateStatus:function(e,t){if(g.preloader){v!==e&&g.container.removeClass("mfp-s-"+v),!t&&"loading"===e&&(t=g.st.tLoading);var i={status:e,text:t};k("UpdateStatus",i),e=i.status,t=i.text,g.preloader.html(t),g.preloader.find("a").on("click",function(e){e.stopImmediatePropagation()}),g.container.addClass("mfp-s-"+e),v=e}},_checkIfClose:function(e){if(!d(e).hasClass(s)){var t=g.st.closeOnContentClick,i=g.st.closeOnBgClick;if(t&&i)return!0;if(!g.content||d(e).hasClass("mfp-close")||g.preloader&&e===g.preloader[0])return!0;if(e===g.content[0]||d.contains(g.content[0],e)){if(t)return!0}else if(i&&d.contains(document,e))return!0;return!1}},_addClassToMFP:function(e){g.bgOverlay.addClass(e),g.wrap.addClass(e)},_removeClassFromMFP:function(e){this.bgOverlay.removeClass(e),g.wrap.removeClass(e)},_hasScrollBar:function(e){return(g.isIE7?b.height():document.body.scrollHeight)>(e||y.height())},_setFocus:function(){(g.st.focus?g.content.find(g.st.focus).eq(0):g.wrap).focus()},_onFocusIn:function(e){if(e.target!==g.wrap[0]&&!d.contains(g.wrap[0],e.target))return g._setFocus(),!1},_parseMarkup:function(o,e,t){var a;t.data&&(e=d.extend(t.data,e)),k(p,[o,e,t]),d.each(e,function(e,t){if(void 0===t||!1===t)return!0;if(1<(a=e.split("_")).length){var i=o.find(f+"-"+a[0]);if(0<i.length){var n=a[1];"replaceWith"===n?i[0]!==t[0]&&i.replaceWith(t):"img"===n?i.is("img")?i.attr("src",t):i.replaceWith(d("<img>").attr("src",t).attr("class",i.attr("class"))):i.attr(a[1],t)}}else o.find(f+"-"+e).html(t)})},_getScrollbarSize:function(){if(void 0===g.scrollbarSize){var e=document.createElement("div");e.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(e),g.scrollbarSize=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return g.scrollbarSize}},d.magnificPopup={instance:null,proto:e.prototype,modules:[],open:function(e,t){return P(),(e=e?d.extend(!0,{},e):{}).isObj=!0,e.index=t||0,this.instance.open(e)},close:function(){return d.magnificPopup.instance&&d.magnificPopup.instance.close()},registerModule:function(e,t){t.options&&(d.magnificPopup.defaults[e]=t.options),d.extend(this.proto,t.proto),this.modules.push(e)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&#215;</button>',tClose:"Close (Esc)",tLoading:"Loading...",autoFocusLast:!0}},d.fn.magnificPopup=function(e,t){P();var i=d(this);if("string"==typeof e)if("open"===e){var n,o=h?i.data("magnificPopup"):i[0].magnificPopup,a=parseInt(t,10)||0;n=o.items?o.items[a]:(n=i,o.delegate&&(n=n.find(o.delegate)),n.eq(a)),g._openClick({mfpEl:n},i,o)}else g.isOpen&&g[e].apply(g,Array.prototype.slice.call(arguments,1));else e=d.extend(!0,{},e),h?i.data("magnificPopup",e):i[0].magnificPopup=e,g.addGroup(i,e);return i};var S="inline",E,z,O,M=function(){O&&(z.after(O.addClass(E)).detach(),O=null)};d.magnificPopup.registerModule(S,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){g.types.push(S),x(l+"."+S,function(){M()})},getInline:function(e,t){if(M(),e.src){var i=g.st.inline,n=d(e.src);if(n.length){var o=n[0].parentNode;o&&o.tagName&&(z||(E=i.hiddenClass,z=I(E),E="mfp-"+E),O=n.after(z).detach().removeClass(E)),g.updateStatus("ready")}else g.updateStatus("error",i.tNotFound),n=d("<div>");return e.inlineElement=n}return g.updateStatus("ready"),g._parseMarkup(t,{},e),t}}});var B="ajax",L,H=function(){L&&d(document.body).removeClass(L)},A=function(){H(),g.req&&g.req.abort()};d.magnificPopup.registerModule(B,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){g.types.push(B),L=g.st.ajax.cursor,x(l+"."+B,A),x("BeforeChange."+B,A)},getAjax:function(o){L&&d(document.body).addClass(L),g.updateStatus("loading");var e=d.extend({url:o.src,success:function(e,t,i){var n={data:e,xhr:i};k("ParseAjax",n),g.appendContent(d(n.data),B),o.finished=!0,H(),g._setFocus(),setTimeout(function(){g.wrap.addClass(m)},16),g.updateStatus("ready"),k("AjaxContentAdded")},error:function(){H(),o.finished=o.loadError=!0,g.updateStatus("error",g.st.ajax.tError.replace("%url%",o.src))}},g.st.ajax.settings);return g.req=d.ajax(e),""}}});var F,j=function(e){if(e.data&&void 0!==e.data.title)return e.data.title;var t=g.st.image.titleSrc;if(t){if(d.isFunction(t))return t.call(g,e);if(e.el)return e.el.attr(t)||""}return""};d.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var e=g.st.image,t=".image";g.types.push("image"),x(u+t,function(){"image"===g.currItem.type&&e.cursor&&d(document.body).addClass(e.cursor)}),x(l+t,function(){e.cursor&&d(document.body).removeClass(e.cursor),y.off("resize"+f)}),x("Resize"+t,g.resizeImage),g.isLowIE&&x("AfterChange",g.resizeImage)},resizeImage:function(){var e=g.currItem;if(e&&e.img&&g.st.image.verticalFit){var t=0;g.isLowIE&&(t=parseInt(e.img.css("padding-top"),10)+parseInt(e.img.css("padding-bottom"),10)),e.img.css("max-height",g.wH-t)}},_onImageHasSize:function(e){e.img&&(e.hasSize=!0,F&&clearInterval(F),e.isCheckingImgSize=!1,k("ImageHasSize",e),e.imgHidden&&(g.content&&g.content.removeClass("mfp-loading"),e.imgHidden=!1))},findImageSize:function(t){var i=0,n=t.img[0],o=function(e){F&&clearInterval(F),F=setInterval(function(){0<n.naturalWidth?g._onImageHasSize(t):(200<i&&clearInterval(F),3===++i?o(10):40===i?o(50):100===i&&o(500))},e)};o(1)},getImage:function(e,t){var i=0,n=function(){e&&(e.img[0].complete?(e.img.off(".mfploader"),e===g.currItem&&(g._onImageHasSize(e),g.updateStatus("ready")),e.hasSize=!0,e.loaded=!0,k("ImageLoadComplete")):++i<200?setTimeout(n,100):o())},o=function(){e&&(e.img.off(".mfploader"),e===g.currItem&&(g._onImageHasSize(e),g.updateStatus("error",a.tError.replace("%url%",e.src))),e.hasSize=!0,e.loaded=!0,e.loadError=!0)},a=g.st.image,r=t.find(".mfp-img");if(r.length){var s=document.createElement("img");s.className="mfp-img",e.el&&e.el.find("img").length&&(s.alt=e.el.find("img").attr("alt")),e.img=d(s).on("load.mfploader",n).on("error.mfploader",o),s.src=e.src,r.is("img")&&(e.img=e.img.clone()),0<(s=e.img[0]).naturalWidth?e.hasSize=!0:s.width||(e.hasSize=!1)}return g._parseMarkup(t,{title:j(e),img_replaceWith:e.img},e),g.resizeImage(),e.hasSize?(F&&clearInterval(F),e.loadError?(t.addClass("mfp-loading"),g.updateStatus("error",a.tError.replace("%url%",e.src))):(t.removeClass("mfp-loading"),g.updateStatus("ready"))):(g.updateStatus("loading"),e.loading=!0,e.hasSize||(e.imgHidden=!0,t.addClass("mfp-loading"),g.findImageSize(e))),t}}});var N,W=function(){return void 0===N&&(N=void 0!==document.createElement("p").style.MozTransform),N};d.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(e){return e.is("img")?e:e.find("img")}},proto:{initZoom:function(){var a=g.st.zoom,e=".zoom",t;if(a.enabled&&g.supportsTransition){var i=a.duration,n=function(e){var t=e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),i="all "+a.duration/1e3+"s "+a.easing,n={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},o="transition";return n["-webkit-"+o]=n["-moz-"+o]=n["-o-"+o]=n[o]=i,t.css(n),t},o=function(){g.content.css("visibility","visible")},r,s;x("BuildControls"+e,function(){if(g._allowZoom()){if(clearTimeout(r),g.content.css("visibility","hidden"),!(t=g._getItemToZoom()))return void o();(s=n(t)).css(g._getOffset()),g.wrap.append(s),r=setTimeout(function(){s.css(g._getOffset(!0)),r=setTimeout(function(){o(),setTimeout(function(){s.remove(),t=s=null,k("ZoomAnimationEnded")},16)},i)},16)}}),x(c+e,function(){if(g._allowZoom()){if(clearTimeout(r),g.st.removalDelay=i,!t){if(!(t=g._getItemToZoom()))return;s=n(t)}s.css(g._getOffset(!0)),g.wrap.append(s),g.content.css("visibility","hidden"),setTimeout(function(){s.css(g._getOffset())},16)}}),x(l+e,function(){g._allowZoom()&&(o(),s&&s.remove(),t=null)})}},_allowZoom:function(){return"image"===g.currItem.type},_getItemToZoom:function(){return!!g.currItem.hasSize&&g.currItem.img},_getOffset:function(e){var t,i=(t=e?g.currItem.img:g.st.zoom.opener(g.currItem.el||g.currItem)).offset(),n=parseInt(t.css("padding-top"),10),o=parseInt(t.css("padding-bottom"),10);i.top-=d(window).scrollTop()-n;var a={width:t.width(),height:(h?t.innerHeight():t[0].offsetHeight)-o-n};return W()?a["-moz-transform"]=a.transform="translate("+i.left+"px,"+i.top+"px)":(a.left=i.left,a.top=i.top),a}}});var Z="iframe",q="//about:blank",R=function(e){if(g.currTemplate[Z]){var t=g.currTemplate[Z].find("iframe");t.length&&(e||(t[0].src=q),g.isIE8&&t.css("display",e?"block":"none"))}};d.magnificPopup.registerModule(Z,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){g.types.push(Z),x("BeforeChange",function(e,t,i){t!==i&&(t===Z?R():i===Z&&R(!0))}),x(l+"."+Z,function(){R()})},getIframe:function(e,t){var i=e.src,n=g.st.iframe;d.each(n.patterns,function(){if(-1<i.indexOf(this.index))return this.id&&(i="string"==typeof this.id?i.substr(i.lastIndexOf(this.id)+this.id.length,i.length):this.id.call(this,i)),i=this.src.replace("%id%",i),!1});var o={};return n.srcAction&&(o[n.srcAction]=i),g._parseMarkup(t,o,e),g.updateStatus("ready"),t}}});var K=function(e){var t=g.items.length;return t-1<e?e-t:e<0?t+e:e},D=function(e,t,i){return e.replace(/%curr%/gi,t+1).replace(/%total%/gi,i)};d.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var a=g.st.gallery,e=".mfp-gallery";if(g.direction=!0,!a||!a.enabled)return!1;C+=" mfp-gallery",x(u+e,function(){a.navigateByImgClick&&g.wrap.on("click"+e,".mfp-img",function(){if(1<g.items.length)return g.next(),!1}),b.on("keydown"+e,function(e){37===e.keyCode?g.prev():39===e.keyCode&&g.next()})}),x("UpdateStatus"+e,function(e,t){t.text&&(t.text=D(t.text,g.currItem.index,g.items.length))}),x(p+e,function(e,t,i,n){var o=g.items.length;i.counter=1<o?D(a.tCounter,n.index,o):""}),x("BuildControls"+e,function(){if(1<g.items.length&&a.arrows&&!g.arrowLeft){var e=a.arrowMarkup,t=g.arrowLeft=d(e.replace(/%title%/gi,a.tPrev).replace(/%dir%/gi,"left")).addClass(s),i=g.arrowRight=d(e.replace(/%title%/gi,a.tNext).replace(/%dir%/gi,"right")).addClass(s);t.click(function(){g.prev()}),i.click(function(){g.next()}),g.container.append(t.add(i))}}),x(o+e,function(){g._preloadTimeout&&clearTimeout(g._preloadTimeout),g._preloadTimeout=setTimeout(function(){g.preloadNearbyImages(),g._preloadTimeout=null},16)}),x(l+e,function(){b.off(e),g.wrap.off("click"+e),g.arrowRight=g.arrowLeft=null})},next:function(){g.direction=!0,g.index=K(g.index+1),g.updateItemHTML()},prev:function(){g.direction=!1,g.index=K(g.index-1),g.updateItemHTML()},goTo:function(e){g.direction=e>=g.index,g.index=e,g.updateItemHTML()},preloadNearbyImages:function(){var e=g.st.gallery.preload,t=Math.min(e[0],g.items.length),i=Math.min(e[1],g.items.length),n;for(n=1;n<=(g.direction?i:t);n++)g._preloadItem(g.index+n);for(n=1;n<=(g.direction?t:i);n++)g._preloadItem(g.index-n)},_preloadItem:function(e){if(e=K(e),!g.items[e].preloaded){var t=g.items[e];t.parsed||(t=g.parseEl(e)),k("LazyLoad",t),"image"===t.type&&(t.img=d('<img class="mfp-img" />').on("load.mfploader",function(){t.hasSize=!0}).on("error.mfploader",function(){t.hasSize=!0,t.loadError=!0,k("LazyLoadError",t)}).attr("src",t.src)),t.preloaded=!0}}}});var U="retina";d.magnificPopup.registerModule(U,{options:{replaceSrc:function(e){return e.src.replace(/\.\w+$/,function(e){return"@2x"+e})},ratio:1},proto:{initRetina:function(){if(1<window.devicePixelRatio){var i=g.st.retina,n=i.ratio;1<(n=isNaN(n)?n():n)&&(x("ImageHasSize."+U,function(e,t){t.img.css({"max-width":t.img[0].naturalWidth/n,width:"100%"})}),x("ElementParse."+U,function(e,t){t.src=i.replaceSrc(t,n)}))}}}}),P()}),jQuery(document).ready(function(i){
// Lightbox
function e(e,t){return/(png|jpg|jpeg|gif|tiff|bmp)$/.test(i(t).attr("href").toLowerCase().split("?")[0].split("#")[0])}function t(){i('a[href]:not(".kt-no-lightbox")').filter(e).attr("data-rel","lightbox")}
// Theme Lightbox
function n(){i.extend(!0,i.magnificPopup.defaults,{tClose:"",tLoading:virtue_lightbox.loading,// Text that is displayed during loading. Can contain %curr% and %total% keys
gallery:{tPrev:"",// Alt text on left arrow
tNext:"",// Alt text on right arrow
tCounter:virtue_lightbox.of},image:{tError:virtue_lightbox.error,// Error message when image could not be loaded
titleSrc:function(e){return e.el.find("img").attr("alt")}}}),i("a[rel^='lightbox']:not('.kt-no-lightbox')").magnificPopup({type:"image"}),i("a[data-rel^='lightbox']:not('.kt-no-lightbox')").magnificPopup({type:"image"}),i(".kad-light-gallery").each(function(){i(this).find("a[data-rel^='lightbox']:not('.kt-no-lightbox')").magnificPopup({type:"image",gallery:{enabled:!0},image:{titleSrc:"title"}})}),i(".kad-light-wp-gallery").each(function(){i(this).find('a[data-rel^="lightbox"]:not(".kt-no-lightbox")').magnificPopup({type:"image",gallery:{enabled:!0},image:{titleSrc:function(e){return e.el.find("img").attr("data-caption")}}})}),i(".kad-light-mosaic-gallery").each(function(){i(this).find('a[data-rel^="lightbox"]:not(".kt-no-lightbox")').magnificPopup({type:"image",gallery:{enabled:!0},image:{titleSrc:function(e){return e.el.parents(".gallery_item").find("img").attr("data-caption")}}})}),
// Gutenberg Gallery
i(".wp-block-gallery").each(function(){i(this).find('a[data-rel^="lightbox"]:not(".kt-no-lightbox")').magnificPopup({type:"image",gallery:{enabled:!0},image:{titleSrc:function(e){return e.el.parents(".blocks-gallery-item").find("figcaption").length?e.el.parents(".blocks-gallery-item").find("figcaption").html():e.el.find("img").attr("alt")}}})}),i("a.pvideolight").magnificPopup({type:"iframe"}),i("a.ktvideolight").magnificPopup({type:"iframe"}),
// WooCommerce Gallery with Zoom and slider 
i(".woocommerce-product-gallery__wrapper.woo_product_slider_enabled.woo_product_zoom_enabled").each(function(){i(this).parents(".woocommerce-product-gallery").prepend('<a href="#" class="woocommerce-product-gallery__trigger"></a>'),i(this).parents(".woocommerce-product-gallery").find("a.woocommerce-product-gallery__trigger").on("click",function(e){e.preventDefault(),2<=i(this).parents(".woocommerce-product-gallery").find(".woocommerce-product-gallery__wrapper").children().length?i(this).parents(".woocommerce-product-gallery").find(".flex-active-slide a[data-rel^='lightbox']:not('.kt-no-lightbox')").magnificPopup("open",i(this).parents(".woocommerce-product-gallery").find(".flex-active-slide").index()):i(this).parents(".woocommerce-product-gallery").find("a[data-rel^='lightbox']:not('.kt-no-lightbox')").magnificPopup("open")})})}
// Find images to open in lightbx
t(),
// init the lightbox
n(),
// re init lightbox on infiniate scroll
i(window).on("infintescrollnewelements",function(e){n()})});;
/* Initialize
*/
var kt_isMobile={Android:function(){return navigator.userAgent.match(/Android/i)},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i)},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},Opera:function(){return navigator.userAgent.match(/Opera Mini/i)},Windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return kt_isMobile.Android()||kt_isMobile.BlackBerry()||kt_isMobile.iOS()||kt_isMobile.Opera()||kt_isMobile.Windows()}};kt_isMobile.any()||function(_,s,t,v){function a(t,e){this.element=t,this.options=_.extend({},i,e),this._defaults=i,this._name=o,this.init()}var o="ktstellar",i={scrollProperty:"scroll",positionProperty:"position",horizontalScrolling:!0,verticalScrolling:!0,horizontalOffset:0,verticalOffset:0,responsive:!1,parallaxBackgrounds:!0,parallaxElements:!0,hideDistantElements:!0,hideElement:function(t){t.hide()},showElement:function(t){t.show()}},r={scroll:{getLeft:function(t){return t.scrollLeft()},setLeft:function(t,e){t.scrollLeft(e)},getTop:function(t){return t.scrollTop()},setTop:function(t,e){t.scrollTop(e)}},position:{getLeft:function(t){return-1*parseInt(t.css("left"),10)},getTop:function(t){return-1*parseInt(t.css("top"),10)}},margin:{getLeft:function(t){return-1*parseInt(t.css("margin-left"),10)},getTop:function(t){return-1*parseInt(t.css("margin-top"),10)}},transform:{getLeft:function(t){var e=getComputedStyle(t[0])[n];return"none"!==e?-1*parseInt(e.match(/(-?[0-9]+)/g)[4],10):0},getTop:function(t){var e=getComputedStyle(t[0])[n];return"none"!==e?-1*parseInt(e.match(/(-?[0-9]+)/g)[5],10):0}}},l={position:{setLeft:function(t,e){t.css("left",e)},setTop:function(t,e){t.css("top",e)}},transform:{setPosition:function(t,e,i,a,s){t[0].style[n]="translate3d("+(e-i)+"px, "+(a-s)+"px, 0)"}}},e,n=function(){var t=/^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,e=_("script")[0].style,i="",a;for(a in e)if(t.test(a)){i=a.match(t)[0];break}return"WebkitOpacity"in e&&(i="Webkit"),"KhtmlOpacity"in e&&(i="Khtml"),function(t){return i+(0<i.length?t.charAt(0).toUpperCase()+t.slice(1):t)}}()("transform"),c=_("<div />",{style:"background:#fff"}).css("background-position-x")!==v,y=c?function(t,e,i){t.css({"background-position-x":e,"background-position-y":i})}:function(t,e,i){t.css("background-position",e+" "+i)},w=c?function(t){return[t.css("background-position-x"),t.css("background-position-y")]}:function(t){return t.css("background-position").split(" ")},d=s.requestAnimationFrame||s.webkitRequestAnimationFrame||s.mozRequestAnimationFrame||s.oRequestAnimationFrame||s.msRequestAnimationFrame||function(t){setTimeout(t,1e3/60)};a.prototype={init:function(){this.options.name=o+"_"+Math.floor(1e9*Math.random()),this._defineElements(),this._defineGetters(),this._defineSetters(),this._handleWindowLoadAndResize(),this._detectViewport(),this.refresh({firstLoad:!0}),"scroll"===this.options.scrollProperty?this._handleScrollEvent():this._startAnimationLoop()},_defineElements:function(){this.element===t.body&&(this.element=s),this.$scrollElement=_(this.element),this.$element=this.element===s?_("body"):this.$scrollElement,this.$viewportElement=this.options.viewportElement!==v?_(this.options.viewportElement):this.$scrollElement[0]===s||"scroll"===this.options.scrollProperty?this.$scrollElement:this.$scrollElement.parent()},_defineGetters:function(){var t=this,e=r[t.options.scrollProperty];this._getScrollLeft=function(){return e.getLeft(t.$scrollElement)},this._getScrollTop=function(){return e.getTop(t.$scrollElement)}},_defineSetters:function(){var o=this,t=r[o.options.scrollProperty],n=l[o.options.positionProperty],e=t.setLeft,i=t.setTop;this._setScrollLeft="function"==typeof e?function(t){e(o.$scrollElement,t)}:_.noop,this._setScrollTop="function"==typeof i?function(t){i(o.$scrollElement,t)}:_.noop,this._setPosition=n.setPosition||function(t,e,i,a,s){o.options.horizontalScrolling&&n.setLeft(t,e,i),o.options.verticalScrolling&&n.setTop(t,a,s)}},_handleWindowLoadAndResize:function(){var t=this,e=_(s);t.options.responsive&&e.bind("load."+this.name,function(){t.refresh()}),e.bind("resize."+this.name,function(){t._detectViewport(),t.options.responsive&&t.refresh()})},refresh:function(t){var i=this,e=i._getScrollLeft(),a=i._getScrollTop();t&&t.firstLoad||this._reset(),this._setScrollLeft(0),this._setScrollTop(0),this._setOffsets(),this._findBackgrounds(),t&&t.firstLoad&&/WebKit/.test(navigator.userAgent)&&_(s).load(function(){var t=i._getScrollLeft(),e=i._getScrollTop();i._setScrollLeft(t+1),i._setScrollTop(e+1),i._setScrollLeft(t),i._setScrollTop(e)}),this._setScrollLeft(e),this._setScrollTop(a)},_detectViewport:function(){var t=this.$viewportElement.offset(),e=null!==t&&t!==v;this.viewportWidth=this.$viewportElement.width(),this.viewportHeight=this.$viewportElement.height(),this.viewportOffsetTop=e?t.top:0,this.viewportOffsetLeft=e?t.left:0},_findBackgrounds:function(){var g=this,m=this._getScrollLeft(),k=this._getScrollTop(),t;this.backgrounds=[],this.options.parallaxBackgrounds&&(t=this.$element.find("[data-ktstellar-background-ratio]"),this.$element.data("ktstellar-background-ratio")&&(t=t.add(this.$element)),t.each(function(){var t=_(this),e=w(t),i,a,s,o,n,r,l,c,d,h=0,p=0,f=0,u=0;if(t.data("ktstellar-backgroundIsActive")){if(t.data("ktstellar-backgroundIsActive")!==this)return}else t.data("ktstellar-backgroundIsActive",this);t.data("ktstellar-backgroundStartingLeft")?y(t,t.data("ktstellar-backgroundStartingLeft"),t.data("ktstellar-backgroundStartingTop")):(t.data("ktstellar-backgroundStartingLeft",e[0]),t.data("ktstellar-backgroundStartingTop",e[1])),n="auto"===t.css("margin-left")?0:parseInt(t.css("margin-left"),10),r="auto"===t.css("margin-top")?0:parseInt(t.css("margin-top"),10),l=t.offset().left-n-m,c=t.offset().top-r-k,t.parents().each(function(){var t=_(this);return!0===t.data("ktstellar-offset-parent")?(h=f,p=u,d=t,!1):(f+=t.position().left,void(u+=t.position().top))}),i=t.data("ktstellar-horizontal-offset")!==v?t.data("ktstellar-horizontal-offset"):d!==v&&d.data("ktstellar-horizontal-offset")!==v?d.data("ktstellar-horizontal-offset"):g.horizontalOffset,a=t.data("ktstellar-vertical-offset")!==v?t.data("ktstellar-vertical-offset"):d!==v&&d.data("ktstellar-vertical-offset")!==v?d.data("ktstellar-vertical-offset"):g.verticalOffset,g.backgrounds.push({$element:t,$offsetParent:d,isFixed:"fixed"===t.css("background-attachment"),horizontalOffset:i,verticalOffset:a,startingValueLeft:e[0],startingValueTop:e[1],startingBackgroundPositionLeft:isNaN(parseInt(e[0],10))?0:parseInt(e[0],10),startingBackgroundPositionTop:isNaN(parseInt(e[1],10))?0:parseInt(e[1],10),startingPositionLeft:t.position().left,startingPositionTop:t.position().top,startingOffsetLeft:l,startingOffsetTop:c,parentOffsetLeft:h,parentOffsetTop:p,ktstellarRatio:t.data("ktstellar-background-ratio")===v?1:t.data("ktstellar-background-ratio")})}))},_reset:function(){var t,e,i,a;for(a=this.backgrounds.length-1;0<=a;a--)(i=this.backgrounds[a]).$element.data("ktstellar-backgroundStartingLeft",null).data("ktstellar-backgroundStartingTop",null),y(i.$element,i.startingValueLeft,i.startingValueTop)},destroy:function(){this._reset(),this.$scrollElement.unbind("resize."+this.name).unbind("scroll."+this.name),this._animationLoop=_.noop,_(s).unbind("load."+this.name).unbind("resize."+this.name)},_setOffsets:function(){var t=this,e=_(s);e.unbind("resize.horizontal-"+this.name).unbind("resize.vertical-"+this.name),"function"==typeof this.options.horizontalOffset?(this.horizontalOffset=this.options.horizontalOffset(),e.bind("resize.horizontal-"+this.name,function(){t.horizontalOffset=t.options.horizontalOffset()})):this.horizontalOffset=this.options.horizontalOffset,"function"==typeof this.options.verticalOffset?(this.verticalOffset=this.options.verticalOffset(),e.bind("resize.vertical-"+this.name,function(){t.verticalOffset=t.options.verticalOffset()})):this.verticalOffset=this.options.verticalOffset},_repositionElements:function(){var t=this._getScrollLeft(),e=this._getScrollTop(),i,a,s,o,n,r,l,c=!0,d=!0,h,p,f,u,g;if(this.currentScrollLeft!==t||this.currentScrollTop!==e||this.currentWidth!==this.viewportWidth||this.currentHeight!==this.viewportHeight)for(this.currentScrollLeft=t,this.currentScrollTop=e,this.currentWidth=this.viewportWidth,this.currentHeight=this.viewportHeight,g=this.backgrounds.length-1;0<=g;g--)o=(n=this.backgrounds[g]).isFixed?0:1,r=this.options.horizontalScrolling?(t+n.horizontalOffset-this.viewportOffsetLeft-n.startingOffsetLeft+n.parentOffsetLeft-n.startingBackgroundPositionLeft)*(o-n.ktstellarRatio)+"px":n.startingValueLeft,l=this.options.verticalScrolling?(e+n.verticalOffset-this.viewportOffsetTop-n.startingOffsetTop+n.parentOffsetTop-n.startingBackgroundPositionTop)*(o-n.ktstellarRatio)+"px":n.startingValueTop,y(n.$element,r,l)},_handleScrollEvent:function(){var t=this,e=!1,i=function(){t._repositionElements(),e=!1},a=function(){e||(d(i),e=!0)};this.$scrollElement.bind("scroll."+this.name,a),a()},_startAnimationLoop:function(){var t=this;this._animationLoop=function(){d(t._animationLoop),t._repositionElements()},this._animationLoop()}},_.fn[o]=function(e){var i=arguments;return e===v||"object"==typeof e?this.each(function(){_.data(this,"plugin_"+o)||_.data(this,"plugin_"+o,new a(this,e))}):"string"==typeof e&&"_"!==e[0]&&"init"!==e?this.each(function(){var t=_.data(this,"plugin_"+o);t instanceof a&&"function"==typeof t[e]&&t[e].apply(t,Array.prototype.slice.call(i,1)),"destroy"===e&&_.data(this,"plugin_"+o,null)}):void 0},_[o]=function(t){var e=_(s);return e.ktstellar.apply(e,Array.prototype.slice.call(arguments,0))},_[o].scrollProperty=r,_[o].positionProperty=l,s.Ktstellar=a}(jQuery,this,document),function(f){"use strict";var s;f.fn.kt_imagesLoaded=(s=function(t,e,i){var a,s=!1,o=f(t).parent(),n=f("<img />"),r=f(t).attr("data-lazy-src"),l=f(t).attr("data-lazy-srcset");r&&(l&&f(t).attr("srcset",l),f(t).attr("src",r));var c=f(t).attr("srcset"),d=f(t).attr("sizes")||"100vw",h=f(t).attr("src"),p=function(){n.off("load error",p),clearTimeout(a),e()};i&&(a=setTimeout(p,i)),n.on("load error",p),o.is("picture")&&((o=o.clone()).find("img").remove().end(),o.append(n),s=!0),c?(n.attr("sizes",d),n.attr("srcset",c),s||n.appendTo(document.createElement("div")),s=!0):h&&n.attr("src",h),s&&!window.HTMLPictureElement&&(window.respimage?window.respimage({elements:[n[0]]}):window.picturefill?window.picturefill({elements:[n[0]]}):h&&n.attr("src",h))},function(t){var e=0,i=f("img",this).add(this.filter("img")),a=function(){++e>=i.length&&t()};return i.length?(i.each(function(){s(this,a)}),this):t()})}(jQuery),jQuery(document).ready(function(L){function t(){var t=L(l).height(),i=L(".stickyheader #kad-banner #topbar").height();if(set_height=function(){var t=f.scrollTop(),e=0;t<0&&(t=0),t<w/1?(e=w-t/2,l.removeClass("header-scrolled")):(e=w/2,l.addClass("header-scrolled")),k.css({height:e+"px",lineHeight:e+"px"}),u.css({height:e+"px",lineHeight:e+"px"}),l.css({height:e+i+"px"}),g.css({height:e+"px",lineHeight:e+"px"}),m.css({maxHeight:e+"px"})},1==h&&1==r&&992<L(window).width())l.css({top:b+"px"}),l.sticky({topSpacing:b}),f.scroll(set_height);else if(1==r&&992<L(window).width())l.css({height:t+"px"}),l.css({top:b+"px"}),l.sticky({topSpacing:b});else if(1==h&&1==r&&1==p&&L(window).width()<992){l.css({height:"auto"}),l.sticky({topSpacing:b});var e=L(window).height(),a=w/2;v.css({maxHeight:e-a+"px"})}else l.css({position:"static"}),_.css({"padding-top":"15px"}),l.css({height:"auto"})}function e(){var t=L("#kad-mobile-banner").height(),e=L("body").hasClass("admin-bar")?32:0,i=L("#kad-mobile-banner").attr("data-mobile-header-sticky");if(L(window).width()<600&&L("body").hasClass("admin-bar")?e=0:L(window).width()<782&&L("body").hasClass("admin-bar")&&(e=46),1==i){L("#kad-mobile-banner").sticky({topSpacing:e});var a=L(window).height();L("#mg-kad-mobile-nav #mh-mobile_menu_collapse").css({maxHeight:a-t+"px"})}}function i(){L(".kt-panel-row-stretch").each(function(){L(this).css({visibility:"visible"})}),L(".kt-panel-row-full-stretch").each(function(){L(this).css({visibility:"visible"})}),L(".panel-row-style-wide-grey").each(function(){var t=L(window).width()-L(this).parent(".panel-grid").width();L(this).css({"padding-left":t/2+"px"}),L(this).css({"padding-right":t/2+"px"}),L(this).css({"margin-left":"-"+t/2+"px"}),L(this).css({"margin-right":"-"+t/2+"px"}),L(this).css({visibility:"visible"})}),L(".panel-row-style-wide-feature").each(function(){var t=L(window).width()-L(this).parent(".panel-grid").width();L(this).css({"padding-left":t/2+"px"}),L(this).css({"padding-right":t/2+"px"}),L(this).css({"margin-left":"-"+t/2+"px"}),L(this).css({"margin-right":"-"+t/2+"px"}),L(this).css({visibility:"visible"})}),L(".panel-row-style-wide-parallax").each(function(){var t=L(window).width()-L(this).parent(".panel-grid").width();L(this).css({"padding-left":t/2+"px"}),L(this).css({"padding-right":t/2+"px"}),L(this).css({"margin-left":"-"+t/2+"px"}),L(this).css({"margin-right":"-"+t/2+"px"}),L(this).css({visibility:"visible"})}),L(".kt-custom-row-full-stretch").each(function(){var t=L(window).width()-L(this).parents("#content").width();L(this).css({"margin-left":"-"+t/2+"px"}),L(this).css({"margin-right":"-"+t/2+"px"}),L(this).css({width:+L(window).width()+"px"}),L(this).css({visibility:"visible"})}),L(".kt-custom-row-full").each(function(){var t=L(window).width()-L(this).parents("#content").width();L(this).css({"padding-left":t/2+"px"}),L(this).css({"padding-right":t/2+"px"}),L(this).css({"margin-left":"-"+t/2+"px"}),L(this).css({"margin-right":"-"+t/2+"px"}),L(this).css({visibility:"visible"})})}function a(t){if(!t.is(":visible"))return!1;var e=L(window).scrollLeft(),i=L(window).scrollTop(),a=t.offset(),s=a.left,o=a.top;return o+t.height()>=i&&o-50<=i+L(window).height()&&s+t.width()>=e&&s-0<=e+L(window).width()}
//animate in
function s(){n.isotopeb({masonry:{columnWidth:E},transitionDuration:"0s"})}
/*
		*
		* Slick Slider
		*/
function C(s){var t=s.data("slider-speed"),e=s.data("slider-fade"),i=s.data("slider-anim-speed"),a=s.data("slider-arrows"),o=s.data("slider-auto"),n=s.data("slider-type"),r=s.data("slider-center-mode"),l=!1;if(1<=L("body.rtl").length&&(l=!0),s.on("init",function(t,e){s.removeClass("loading")}),"carousel"==n){var c=s.data("slides-to-show");null==c&&(c=1),s.slick({slidesToScroll:1,slidesToShow:c,centerMode:r,variableWidth:!0,arrows:a,speed:i,autoplay:o,autoplaySpeed:t,fade:e,pauseOnHover:!1,rtl:l,dots:!0})}else if("content-carousel"==n){var d=s.data("slider-xxl"),h=s.data("slider-xl"),p=s.data("slider-md"),f=s.data("slider-sm"),u=s.data("slider-xs"),g=s.data("slider-ss"),m;if(1!==s.data("slider-scroll"))var k=d,_=h,v=p,y=f,w=u,b=g;else var k=1,_=1,v=1,y=1,w=1,b=1;s.slick({slidesToScroll:k,slidesToShow:d,arrows:a,speed:i,autoplay:o,autoplaySpeed:t,fade:e,pauseOnHover:!1,dots:!1,rtl:l,responsive:[{breakpoint:1499,settings:{slidesToShow:h,slidesToScroll:_}},{breakpoint:1199,settings:{slidesToShow:p,slidesToScroll:v}},{breakpoint:991,settings:{slidesToShow:f,slidesToScroll:y}},{breakpoint:767,settings:{slidesToShow:u,slidesToScroll:w}},{breakpoint:543,settings:{slidesToShow:g,slidesToScroll:b}}]}),s.on("beforeChange",function(t,e,i,a){s.find(".kt-slickslider:not(.slick-initialized)").each(function(){C(L(this))})})}else if("thumb"==n){var S=s.data("slider-thumbid"),x=s.data("slider-thumbs-showing"),T=s.attr("id");s.slick({slidesToScroll:1,slidesToShow:1,arrows:a,speed:i,autoplay:o,autoplaySpeed:t,fade:e,pauseOnHover:!1,adaptiveHeight:!0,dots:!1,rtl:l,asNavFor:S}),L(S).slick({slidesToShow:x,slidesToScroll:1,asNavFor:"#"+T,dots:!1,rtl:l,centerMode:!1,focusOnSelect:!0})}else s.slick({slidesToShow:1,slidesToScroll:1,arrows:a,speed:i,autoplay:o,autoplaySpeed:t,fade:e,pauseOnHover:!1,rtl:l,adaptiveHeight:!0,dots:!0})}
// Bootstrap Init
kt_isMobile.any()||(L("[rel=tooltip]").tooltip(),L("[data-toggle=tooltip]").tooltip()),L("[data-toggle=popover]").popover(),L("#authorTab a").click(function(t){t.preventDefault(),L(this).tab("show")}),L(".sc_tabs a").click(function(t){t.preventDefault(),L(this).tab("show")}),L(document).mouseup(function(t){var e=L("#kad-menu-search-popup");e.is(t.target)||0!==e.has(t.target).length||L("#kad-menu-search-popup.in").collapse("hide")}),L("#kad-menu-search-popup").on("shown.bs.collapse",function(){L(".kt-search-container .search-query").focus()}),L(".kt_typed_element").each(function(){var t=L(this).data("first-sentence"),e=L(this).data("second-sentence"),i=L(this).data("third-sentence"),a=L(this).data("fourth-sentence"),s=L(this).data("loop"),o=L(this).data("speed"),n=L(this).data("start-delay"),r=L(this).data("sentence-count");if(null==n&&(n=500),"1"==r)var l={strings:[t],typeSpeed:o,startDelay:n,loop:s};else if("3"==r)var l={strings:[t,e,i],typeSpeed:o,startDelay:n,loop:s};else if("4"==r)var l={strings:[t,e,i,a],typeSpeed:o,startDelay:n,loop:s};else var l={strings:[t,e],typeSpeed:o,startDelay:n,loop:s};L(this).appear(function(){L(this).typed(l)},{accX:0,accY:-25})}),L(".videofit").fitVids(),L(".embed-youtube").fitVids(),L(".kt-m-hover").bind("touchend",function(t){L(this).toggleClass("kt-mobile-hover"),L(this).toggleClass("kt-mhover-inactive")}),L(".collapse-next").click(function(t){
//e.preventDefault();
var e=L(this).siblings(".sf-dropdown-menu");e.hasClass("in")?(e.collapse("toggle"),L(this).removeClass("toggle-active")):(e.collapse("toggle"),L(this).addClass("toggle-active"))});var o=L("body").attr("data-jsselect");if(790<L(window).width()&&!kt_isMobile.any()&&1==o&&(L("select:not(#rating):not(.kt-no-select2)").select2({minimumResultsForSearch:-1}),L("select.country_select").select2(),L("select.state_select").select2()),L(".tab-pane .kad_product_wrapper").length){var n=L(".kad_product_wrapper");L(".sc_tabs").on("shown.bs.tab",function(t){n.isotopeb({masonry:{columnWidth:".kad_product"},transitionDuration:"0.8s"})})}if(L(".panel-body .kad_product_wrapper").length){var n=L(".kad_product_wrapper");L(".panel-group").on("shown.bs.collapse",function(t){n.isotopeb({masonry:{columnWidth:".kad_product"},transitionDuration:"0.8s"})}),L(".panel-group").on("hidden.bs.collapse",function(t){n.isotopeb({masonry:{columnWidth:".kad_product"},transitionDuration:"0.8s"})})}
// anchor scroll
L(".kad_fullslider_arrow").localScroll();var r=L("body").attr("data-sticky"),l=L("#kad-banner"),c;if(1==L("body").attr("data-product-tab-scroll")&&992<L(window).width()){if(1==r)var d=L(l).height()+100;else var d=100;L(".woocommerce-tabs").localScroll({offset:-d})}
// Sticky Header Varibles
var r=L("body").attr("data-sticky"),h=L("#kad-banner").attr("data-header-shrink"),p=L("#kad-banner").attr("data-mobile-sticky"),f=L(window),l=L(".stickyheader #kad-banner"),u=L(".stickyheader #kad-banner #kad-shrinkheader"),g=L(".stickyheader #kad-banner #logo a, .stickyheader #kad-banner #logo a #thelogo"),m=L(".stickyheader #kad-banner #logo a img"),k=L(".stickyheader #kad-banner .nav-main ul.sf-menu > li > a"),_=L(".stickyheader .wrap"),v=L(".stickyheader .mobile-stickyheader .mobile_menu_collapse"),y=L(".stickyheader .sticky-wrapper"),w=L("#kad-banner").attr("data-header-base-height"),b=L("body").hasClass("admin-bar")?32:0,S,x,T,O;if(l.imagesLoadedn(function(){t()}),1==L("#kad-banner").attr("data-menu-stick")&&L("#nav-main").sticky({topSpacing:b}),L("#kad-mobile-banner").length&&e(),
//Superfish Menu
L("ul.sf-menu").superfish({delay:200,animation:{opacity:"show",height:"show"},speed:"fast"}),i(),L(window).on("debouncedresize",function(t){i()}),1==L("body").attr("data-animate")&&790<L(window).width()){
//fadein
L(".kad-animation").each(function(){L(this).appear(function(){L(this).delay(L(this).attr("data-delay")).animate({opacity:1,top:0},800,"swing")},{accX:0,accY:-25},"easeInCubic")}),L(".kt-animate-fade-in-up").each(function(){L(this).appear(function(){L(this).animate({opacity:1,top:0},900,"swing")},{accX:0,accY:-25},"easeInCubic")}),L(".kt-animate-fade-in-down").each(function(){L(this).appear(function(){L(this).animate({opacity:1,top:0},900,"swing")},{accX:0,accY:-25},"easeInCubic")}),L(".kt-animate-fade-in-left").each(function(){L(this).appear(function(){L(this).animate({opacity:1,left:0},900,"swing")},{accX:-25,accY:0},"easeInCubic")}),L(".kt-animate-fade-in-right").each(function(){L(this).appear(function(){L(this).animate({opacity:1,right:0},900,"swing")},{accX:-25,accY:0},"easeInCubic")}),L(".kt-animate-fade-in").each(function(){L(this).appear(function(){L(this).animate({opacity:1},900,"swing")})}),
// Make visible normally if off screen
L(".kad-animation").each(function(){a(L(this))||L(this).css({opacity:1,top:0})});var z=!1;L(window).on("scroll",function(){z||(z=!0,L(".kad-animation").each(function(){a(L(this))||L(this).css({opacity:"",top:""})}))})}else L(".kad-animation").each(function(){L(this).animate({opacity:1,top:0})}),L(".kt-animate-fade-in-up").each(function(){L(this).animate({opacity:1,top:0})}),L(".kt-animate-fade-in-down").each(function(){L(this).animate({opacity:1,top:0})}),L(".kt-animate-fade-in-left").each(function(){L(this).animate({opacity:1,left:0})}),L(".kt-animate-fade-in-right").each(function(){L(this).animate({opacity:1,right:0})}),L(".kt-animate-fade-in").each(function(){L(this).animate({opacity:1})});(L(".kt-pb-animation").each(function(){L(this).appear(function(){L(this).addClass("kt-pb-animate")},{accX:-25,accY:0},"easeInCubic")}),
// Responsive Text for call To action
L(".kt-ctaw .kt-call-to-action-title").length&&L(".kt-ctaw .kt-call-to-action-title").each(function(){var t=L(this).data("max-size"),e=L(this).data("min-size");L(this).kt_fitText(1.3,{minFontSize:e,maxFontSize:t,maxWidth:1140,minWidth:400})}),L(".kt-ctaw .kt-call-to-action-subtitle").length&&L(".kt-ctaw .kt-call-to-action-subtitle").each(function(){var t=L(this).data("max-size"),e=L(this).data("min-size");L(this).kt_fitText(1.5,{minFontSize:e,maxFontSize:t,maxWidth:1140,minWidth:400})}),L(".kt-ctaw .kt-call-to-action-abovetitle").length&&L(".kt-ctaw .kt-call-to-action-abovetitle").each(function(){var t=L(this).data("max-size"),e=L(this).data("min-size");L(this).kt_fitText(1.5,{minFontSize:e,maxFontSize:t,maxWidth:1140,minWidth:400})}),L(".blog_carousel").length)&&("1"==L(".blog_carousel").data("iso-match-height")&&L(".blog_carousel .blog_item").matchHeight());L(".kt-home-iconmenu-container").length&&("1"==L(".kt-home-iconmenu-container").data("equal-height")&&L(".kt-home-iconmenu-container .home-icon-item").matchHeight());
//init isotope
// Toggle 
if(L(".init-isotope").each(function(){var o=L(this),n=L(this).data("iso-selector"),r=L(this).data("iso-style"),l=L(this).data("iso-filter"),c=L(this).data("iso-match-height");if(null==r&&(r="masonry"),null==l&&(l="false"),null==c&&(c="false"),1<=L("body.rtl").length)var d=!1;else var d=!0;o.kt_imagesLoaded(function(){if("1"==c?o.find(".blog_item").matchHeight():o.isotopeb({masonry:{columnWidth:n},layoutMode:r,itemSelector:n,transitionDuration:"0.8s",isOriginLeft:d}),1==o.attr("data-fade-in")){var t=o.find(".kt_item_fade_in");t.css("opacity",0),t.each(function(t){L(this).delay(150*t).animate({opacity:1},350)})}if(1==l){var e,i=o.parents(".main").find("#filters"),a,s;if(i.length)i.on("click","a",function(t){var e=L(this).attr("data-filter");return o.isotopeb({filter:e}),!1}),L("#options .option-set").find("a").click(function(){var t=L(this),e;if(t.hasClass("selected"))return!1;t.parents(".option-set").find(".selected").removeClass("selected"),t.addClass("selected")})}})}),
//init init-isotope-intrinsic
L(".init-isotope-intrinsic").each(function(){var i=L(this),t=L(this).data("iso-selector"),e=L(this).data("iso-style"),a=L(this).data("iso-filter");if(1<=L("body.rtl").length)var s=!1;else var s=!0;if(i.isotopeb({masonry:{columnWidth:t},layoutMode:e,itemSelector:t,transitionDuration:"0.8s",isOriginLeft:s}),1==i.attr("data-fade-in")){var o=i.find(".kt_item_fade_in");o.css("opacity",0),o.each(function(t){L(this).delay(150*t).animate({opacity:1},350)})}if(1==a){var n,r=i.parents(".main").find("#filters"),l,c;if(r.length)r.on("click","a",function(t){var e=L(this).attr("data-filter");return i.isotopeb({filter:e}),i.find(".kt-slickslider").each(function(){L(this).slick("setPosition")}),!1}),L("#options .option-set").find("a").click(function(){var t=L(this),e;if(t.hasClass("selected"))return!1;t.parents(".option-set").find(".selected").removeClass("selected"),t.addClass("selected")})}}),L(".init-mosaic-isotope").each(function(){var i=L(this),t=L(this).data("iso-selector"),e=L(this).data("iso-style"),a=L(this).data("iso-filter");if(L("body.rtl").length)var s=!1;else var s=!0;
//init
// fade
if(i.isotopeb({layoutMode:e,itemSelector:t,transitionDuration:".8s",isOriginLeft:s}),1==i.attr("data-fade-in")){var o=i.find(".kt_item_fade_in");o.css("opacity",0),o.each(function(t){L(this).delay(150*t).animate({opacity:1},350)})}if(1==a){var n,r=i.parents(".main").find("#filters"),l,c;if(r.length)r.on("click","a",function(t){var e=L(this).attr("data-filter");return i.isotopeb({filter:e}),i.find(".kt-slickslider").each(function(){L(this).slick("setPosition")}),!1}),L("#options .option-set").find("a").click(function(){var t=L(this),e;if(t.hasClass("selected"))return!1;t.parents(".option-set").find(".selected").removeClass("selected"),t.addClass("selected")})}}),L(".kt_product_toggle_container").length){var W=L(".kt_product_toggle_container .toggle_list"),j=L(".kt_product_toggle_container .toggle_grid");W.click(function(){if(L(this).hasClass("toggle_active"))return!1;if(L(this).parents(".kt_product_toggle_container").find(".toggle_active").removeClass("toggle_active"),L(this).addClass("toggle_active"),L(".kad_product_wrapper").length){L(".kad_product_wrapper").addClass("shopcolumn1"),L(".kad_product_wrapper").addClass("tfsinglecolumn");var t=L(".kad_product_wrapper"),e=L(".kad_product_wrapper").data("iso-selector");t.isotopeb({masonry:{columnWidth:e},transitionDuration:".4s"})}return!1}),j.click(function(){if(L(this).hasClass("toggle_active"))return!1;if(L(this).parents(".kt_product_toggle_container").find(".toggle_active").removeClass("toggle_active"),L(this).addClass("toggle_active"),L(".kad_product_wrapper").length){L(".kad_product_wrapper").removeClass("shopcolumn1"),L(".kad_product_wrapper").removeClass("tfsinglecolumn");var t=L(".kad_product_wrapper"),e=L(".kad_product_wrapper").data("iso-selector");t.isotopeb({masonry:{columnWidth:e},transitionDuration:".4s"})}return!1})}if(L(".kt_product_toggle_container_list").length){var W=L(".kt_product_toggle_container_list .toggle_list"),j=L(".kt_product_toggle_container_list .toggle_grid");W.click(function(){if(L(this).hasClass("toggle_active"))return!1;if(L(this).parents(".kt_product_toggle_container_list").find(".toggle_active").removeClass("toggle_active"),L(this).addClass("toggle_active"),L(".kad_product_wrapper").length){L(".kad_product_wrapper").addClass("shopcolumn1"),L(".kad_product_wrapper").addClass("tfsinglecolumn"),L(".kad_product_wrapper").removeClass("kt_force_grid_three");var t=L(".kad_product_wrapper"),e=L(".kad_product_wrapper").data("iso-selector");t.isotopeb({masonry:{columnWidth:e},transitionDuration:".4s"})}return!1}),j.click(function(){if(L(this).hasClass("toggle_active"))return!1;if(L(this).parents(".kt_product_toggle_container_list").find(".toggle_active").removeClass("toggle_active"),L(this).addClass("toggle_active"),L(".kad_product_wrapper").length){L(".kad_product_wrapper").removeClass("shopcolumn1"),L(".kad_product_wrapper").removeClass("tfsinglecolumn"),L(".kad_product_wrapper").addClass("kt_force_grid_three");var t=L(".kad_product_wrapper"),e=L(".kad_product_wrapper").data("iso-selector");t.isotopeb({masonry:{columnWidth:e},transitionDuration:".4s"})}return!1})}if(L(".woocommerce-tabs .panel .reinit-isotope").length){var n=L(".reinit-isotope"),E=L(".reinit-isotope").data("iso-selector");L(".woocommerce-tabs ul.tabs li a").click(function(){setTimeout(s,50)})}
// Re init iso for streached rows.
if(L(".siteorigin-panels-stretch .reinit-isotope").length&&L(window).on("panelsStretchRows",function(t){var e=L(".reinit-isotope"),i=L(".reinit-isotope").data("iso-selector");e.isotopeb({masonry:{columnWidth:i},transitionDuration:"0s"})}),L(".panel-body .reinit-isotope").length){var n=L(".reinit-isotope"),E=L(".reinit-isotope").data("iso-selector");L(".panel-group").on("shown.bs.collapse",function(t){n.isotopeb({masonry:{columnWidth:E},transitionDuration:"0s"})})}L(".tab-pane .reinit-isotope").length&&L(".tab-pane .reinit-isotope").each(function(){var e=L(this),i=L(this).data("iso-selector");L(".sc_tabs").on("shown.bs.tab",function(t){e.isotopeb({masonry:{columnWidth:i},transitionDuration:"0s"})})}),L(".kt-slickslider").each(function(){var t=L(this),e=t.data("slider-initdelay");null==e||"0"==e?C(t):setTimeout(function(){C(t)},e)}),jQuery(".init-infinit").each(function(){var o=L(this);nextSelector=L(this).data("nextselector"),navSelector=L(this).data("navselector"),itemSelector=L(this).data("itemselector"),itemloadselector=L(this).data("itemloadselector"),matchheight=L(this).data("iso-match-height"),L(nextSelector).length&&(o.infiniteScroll({path:nextSelector,append:itemSelector,checkLastPage:!0,status:".scroller-status",scrollThreshold:400,loadOnScroll:!0,history:!1,hideNav:navSelector}),o.on("append.infiniteScroll",function(t,e,i,a){var s=jQuery(a);s.find("img").each(function(){L(this).attr("data-srcset",L(this).attr("srcset")),L(this).removeAttr("srcset")}),s.find("img").each(function(){L(this).attr("srcset",L(this).attr("data-srcset")),L(this).removeAttr("data-srcset")}),s.imagesLoadedn(function(){s.find(".kt-slickslider").each(function(){var t=L(this),e=t.data("slider-initdelay");null==e||"0"==e?C(t):setTimeout(function(){C(t)},e)}),"1"==matchheight?(o.find(".blog_item").matchHeight("remove"),o.find(".blog_item").matchHeight()):o.isotopeb("appended",s),1==o.attr("data-fade-in")&&
//fadeIn items one by one
s.each(function(t){L(this).find(itemloadselector).delay(150*t).animate({opacity:1},350)})})}))}),jQuery(".init-infinit-norm").each(function(){var t=L(this);nextSelector=L(this).data("nextselector"),navSelector=L(this).data("navselector"),itemSelector=L(this).data("itemselector"),itemloadselector=L(this).data("itemloadselector"),L(nextSelector).length&&(t.infiniteScroll({path:nextSelector,append:itemSelector,checkLastPage:!0,status:".scroller-status",scrollThreshold:400,loadOnScroll:!0,history:!1,hideNav:navSelector}),t.on("append.infiniteScroll",function(t,e,i,a){jQuery(window).trigger("infintescrollnewelements");var s=jQuery(a);
// Stupid Hack for Safari
s.find("img").each(function(){L(this).attr("data-srcset",L(this).attr("srcset")),L(this).removeAttr("srcset")}),s.find("img").each(function(){L(this).attr("srcset",L(this).attr("data-srcset")),L(this).removeAttr("data-srcset")}),"fade-in"==s.attr("data-animation")&&s.each(function(){L(this).appear(function(){L(this).delay(L(this).attr("data-delay")).animate({opacity:1,top:0},800,"swing")},{accX:0,accY:-85},"easeInCubic")})}))}),L("html").removeClass("no-js"),L("html").addClass("js-running")}),kt_isMobile.any()||jQuery(document).ready(function(t){jQuery(window).ktstellar({responsive:!1,horizontalScrolling:!1,verticalOffset:150}),jQuery(window).on("debouncedresize",function(t){jQuery(window).ktstellar("refresh")})}),jQuery(window).load(function(){jQuery("body").animate({opacity:1}),jQuery(document).on("yith-wcan-ajax-filtered",function(){var i=jQuery(".kad_product_wrapper"),t,e;i.imagesLoadedn(function(){i.isotopeb({masonry:{columnWidth:".kad_product"},layoutMode:"fitRows",transitionDuration:"0.8s"}),1==i.attr("data-fade-in")&&(jQuery(".kad_product_wrapper .kad_product_fade_in").css("opacity",0),jQuery(".kad_product_wrapper .kad_product_fade_in").each(function(t){jQuery(this).delay(150*t).animate({opacity:1},350)}))}),jQuery("#filters").on("click","a",function(t){var e=$(this).attr("data-filter");return i.isotopeb({filter:e}),!1}),jQuery("#options .option-set").find("a").click(function(){var t=jQuery(this),e;if(t.hasClass("selected"))return!1;t.parents(".option-set").find(".selected").removeClass("selected"),t.addClass("selected")})}),jQuery(document).on("post-load",function(){var t=jQuery(".kad_product_wrapper");t.isotopeb("destroy"),t.imagesLoadedn(function(){jQuery(".kad_product_wrapper").isotopeb({masonry:{columnWidth:".kad_product"},layoutMode:"fitRows",transitionDuration:"0.8s"}),1==t.attr("data-fade-in")&&(jQuery(".kad_product_wrapper .kad_product_fade_in").css("opacity",0),jQuery(".kad_product_wrapper .kad_product_fade_in").each(function(t){jQuery(this).delay(150*t).animate({opacity:1},350)}))})})});;
jQuery(document).ready(function($){var i=$(".product form.variations_form"),t=$(".variations td.product_value select"),a=i.find(".single_variation_wrap"),e=i.data("product_variations")===!1;i.on("click",".reset_variations",function(){return e&&$(".kad-select").select2({minimumResultsForSearch:-1}),!1}),i.on("reset_data",function(){i.find(".single_variation_wrap_kad").find(".quantity").hide(),i.find(".single_variation .price").hide()}),i.on("woocommerce_variation_has_changed",function(){$(".kad-select").trigger("update"),e&&$(window).width()>790&&!kt_isMobile.any()&&$(".kad-select").select2({minimumResultsForSearch:-1})}),a.on("hide_variation",function(){$(this).css("height","auto")})});;
jQuery(function($){$("div.quantity:not(.buttons_added)").addClass("buttons_added").append('<input type="button" value="+" class="plus" />').prepend('<input type="button" value="-" class="minus" />'),$(document).on("updated_cart_totals",function(){$("div.quantity:not(.buttons_added)").addClass("buttons_added").append('<input type="button" value="+" class="plus" />').prepend('<input type="button" value="-" class="minus" />')}),$(document).on("click",".plus, .minus",function(){var t=$(this).closest(".quantity").find(".qty"),a=parseFloat(t.val()),n=parseFloat(t.attr("max")),s=parseFloat(t.attr("min")),u=t.attr("step");a&&""!==a&&"NaN"!==a||(a=0),""!==n&&"NaN"!==n||(n=""),""!==s&&"NaN"!==s||(s=0),"any"!==u&&""!==u&&void 0!==u&&"NaN"!==parseFloat(u)||(u=1),$(this).is(".plus")?n&&(n==a||a>n)?t.val(n):t.val(a+parseFloat(u)):s&&(s==a||a<s)?t.val(s):a>0&&t.val(a-parseFloat(u)),t.trigger("change")})});;
/**
 * WordPress inline HTML embed
 *
 * @since 4.4.0
 *
 * This file cannot have ampersands in it. This is to ensure
 * it can be embedded in older versions of WordPress.
 * See https://core.trac.wordpress.org/changeset/35708.
 */
(function ( window, document ) {
	'use strict';

	var supportedBrowser = false,
		loaded = false;

		if ( document.querySelector ) {
			if ( window.addEventListener ) {
				supportedBrowser = true;
			}
		}

	/** @namespace wp */
	window.wp = window.wp || {};

	if ( !! window.wp.receiveEmbedMessage ) {
		return;
	}

	window.wp.receiveEmbedMessage = function( e ) {
		var data = e.data;

		if ( ! data ) {
			return;
		}

		if ( ! ( data.secret || data.message || data.value ) ) {
			return;
		}

		if ( /[^a-zA-Z0-9]/.test( data.secret ) ) {
			return;
		}

		var iframes = document.querySelectorAll( 'iframe[data-secret="' + data.secret + '"]' ),
			blockquotes = document.querySelectorAll( 'blockquote[data-secret="' + data.secret + '"]' ),
			i, source, height, sourceURL, targetURL;

		for ( i = 0; i < blockquotes.length; i++ ) {
			blockquotes[ i ].style.display = 'none';
		}

		for ( i = 0; i < iframes.length; i++ ) {
			source = iframes[ i ];

			if ( e.source !== source.contentWindow ) {
				continue;
			}

			source.removeAttribute( 'style' );

			/* Resize the iframe on request. */
			if ( 'height' === data.message ) {
				height = parseInt( data.value, 10 );
				if ( height > 1000 ) {
					height = 1000;
				} else if ( ~~height < 200 ) {
					height = 200;
				}

				source.height = height;
			}

			/* Link to a specific URL on request. */
			if ( 'link' === data.message ) {
				sourceURL = document.createElement( 'a' );
				targetURL = document.createElement( 'a' );

				sourceURL.href = source.getAttribute( 'src' );
				targetURL.href = data.value;

				/* Only continue if link hostname matches iframe's hostname. */
				if ( targetURL.host === sourceURL.host ) {
					if ( document.activeElement === source ) {
						window.top.location.href = data.value;
					}
				}
			}
		}
	};

	function onLoad() {
		if ( loaded ) {
			return;
		}

		loaded = true;

		var isIE10 = -1 !== navigator.appVersion.indexOf( 'MSIE 10' ),
			isIE11 = !!navigator.userAgent.match( /Trident.*rv:11\./ ),
			iframes = document.querySelectorAll( 'iframe.wp-embedded-content' ),
			iframeClone, i, source, secret;

		for ( i = 0; i < iframes.length; i++ ) {
			source = iframes[ i ];

			if ( ! source.getAttribute( 'data-secret' ) ) {
				/* Add secret to iframe */
				secret = Math.random().toString( 36 ).substr( 2, 10 );
				source.src += '#?secret=' + secret;
				source.setAttribute( 'data-secret', secret );
			}

			/* Remove security attribute from iframes in IE10 and IE11. */
			if ( ( isIE10 || isIE11 ) ) {
				iframeClone = source.cloneNode( true );
				iframeClone.removeAttribute( 'security' );
				source.parentNode.replaceChild( iframeClone, source );
			}
		}
	}

	if ( supportedBrowser ) {
		window.addEventListener( 'message', window.wp.receiveEmbedMessage, false );
		document.addEventListener( 'DOMContentLoaded', onLoad, false );
		window.addEventListener( 'load', onLoad, false );
	}
})( window, document );
;
