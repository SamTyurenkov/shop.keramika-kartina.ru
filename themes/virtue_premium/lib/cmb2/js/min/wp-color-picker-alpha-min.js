/**!
 * wp-color-picker-alpha
 *
 * Overwrite Automattic Iris for enabled Alpha Channel in wpColorPicker
 * Only run in input and is defined data alpha in true
 *
 * Version: 2.1.3
 * https://github.com/kallookoo/wp-color-picker-alpha
 * Licensed under the GPLv2 license.
 */
!function(p){
// Prevent double-init.
if(!p.wp.wpColorPicker.prototype._hasAlpha){
// Variable for some backgrounds ( grid )
var c="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAAHnlligAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHJJREFUeNpi+P///4EDBxiAGMgCCCAGFB5AADGCRBgYDh48CCRZIJS9vT2QBAggFBkmBiSAogxFBiCAoHogAKIKAlBUYTELAiAmEtABEECk20G6BOmuIl0CIMBQ/IEMkO0myiSSraaaBhZcbkUOs0HuBwDplz5uFJ3Z4gAAAABJRU5ErkJggg==",
// html stuff for wpColorPicker copy of the original color-picker.js
o='<div class="wp-picker-holder" />',e='<div class="wp-picker-container" />',a='<input type="button" class="button button-small" />',
// Prevent CSS issues in < WordPress 4.9
i=void 0!==wpColorPickerL10n.current;
// Declare some global variables when is deprecated or not
if(i)var n='<a tabindex="0" class="wp-color-result" />';else var n='<button type="button" class="button wp-color-result" aria-expanded="false"><span class="wp-color-result-text"></span></button>',l="<label></label>",s='<span class="screen-reader-text"></span>';
/**
	 * Overwrite Color
	 * for enable support rbga
	 */Color.fn.toString=function(){if(this._alpha<1)return this.toCSS("rgba",this._alpha).replace(/\s+/g,"");var t=parseInt(this._color,10).toString(16);return this.error?"":(t.length<6&&(t=("00000"+t).substr(-6)),"#"+t)},
/**
	 * Overwrite wpColorPicker
	 */
p.widget("wp.wpColorPicker",p.wp.wpColorPicker,{_hasAlpha:!0,
/**
		 * @summary Creates the color picker.
		 *
		 * Creates the color picker, sets default values, css classes and wraps it all in HTML.
		 *
		 * @since 3.5.0
		 *
		 * @access private
		 *
		 * @returns {void}
		 */
_create:function(){
// Return early if Iris support is missing.
if(p.support.iris){var r=this,t=r.element;
// Override default options with options bound to the element.
// Create a color picker which only allows adjustments to the hue.
if(p.extend(r.options,t.data()),"hue"===r.options.type)return r._createHueOnly();
// Bind the close event.
r.close=p.proxy(r.close,r),r.initialValue=t.val(),
// Add a CSS class to the input field.
t.addClass("wp-color-picker"),r.button=i?(t.hide().wrap(e),r.wrap=t.parent(),r.toggler=p(n).insertBefore(t).css({backgroundColor:r.initialValue}).attr("title",wpColorPickerL10n.pick).attr("data-current",wpColorPickerL10n.current),r.pickerContainer=p(o).insertAfter(t),p(a).addClass("hidden")):(
/*
				 * Check if there's already a wrapping label, e.g. in the Customizer.
				 * If there's no label, add a default one to match the Customizer template.
				 */
t.parent("label").length||(
// Wrap the input field in the default label.
t.wrap(l),
// Insert the default label text.
r.wrappingLabelText=p(s).insertBefore(t).text(wpColorPickerL10n.defaultLabel))
/*
				 * At this point, either it's the standalone version or the Customizer
				 * one, we have a wrapping label to use as hook in the DOM, let's store it.
				 */,r.wrappingLabel=t.parent(),
// Wrap the label in the main wrapper.
r.wrappingLabel.wrap(e),
// Store a reference to the main wrapper.
r.wrap=r.wrappingLabel.parent(),
// Set up the toggle button and insert it before the wrapping label.
r.toggler=p(n).insertBefore(r.wrappingLabel).css({backgroundColor:r.initialValue}),
// Set the toggle button span element text.
r.toggler.find(".wp-color-result-text").text(wpColorPickerL10n.pick),
// Set up the Iris container and insert it after the wrapping label.
r.pickerContainer=p(o).insertAfter(r.wrappingLabel),p(a)),
// Set up the Clear/Default button.
r.options.defaultColor?(r.button.addClass("wp-picker-default").val(wpColorPickerL10n.defaultString),i||r.button.attr("aria-label",wpColorPickerL10n.defaultAriaLabel)):(r.button.addClass("wp-picker-clear").val(wpColorPickerL10n.clear),i||r.button.attr("aria-label",wpColorPickerL10n.clearAriaLabel)),i?t.wrap('<span class="wp-picker-input-wrap" />').after(r.button):(
// Wrap the wrapping label in its wrapper and append the Clear/Default button.
r.wrappingLabel.wrap('<span class="wp-picker-input-wrap hidden" />').after(r.button),
/*
				 * The input wrapper now contains the label+input+Clear/Default button.
				 * Store a reference to the input wrapper: we'll use this to toggle
				 * the controls visibility.
				 */
r.inputWrapper=t.closest(".wp-picker-input-wrap")),t.iris({target:r.pickerContainer,hide:r.options.hide,width:r.options.width,mode:r.options.mode,palettes:r.options.palettes,
/**
				 * @summary Handles the onChange event if one has been defined in the options.
				 *
				 * Handles the onChange event if one has been defined in the options and additionally
				 * sets the background color for the toggler element.
				 *
				 * @since 3.5.0
				 *
				 * @param {Event} event    The event that's being called.
				 * @param {HTMLElement} ui The HTMLElement containing the color picker.
				 *
				 * @returns {void}
				 */
change:function(t,o){r.options.alpha?(r.toggler.css({"background-image":"url("+c+")"}),i?r.toggler.html('<span class="color-alpha" />'):(r.toggler.css({position:"relative"}),0==r.toggler.find("span.color-alpha").length&&r.toggler.append('<span class="color-alpha" />')),r.toggler.find("span.color-alpha").css({width:"30px",height:"24px",position:"absolute",top:0,left:0,"border-top-left-radius":"2px","border-bottom-left-radius":"2px",background:o.color.toString()})):r.toggler.css({backgroundColor:o.color.toString()}),p.isFunction(r.options.change)&&r.options.change.call(this,t,o)}}),t.val(r.initialValue),r._addListeners(),
// Force the color picker to always be closed on initial load.
r.options.hide||r.toggler.click()}},
/**
		 * @summary Binds event listeners to the color picker.
		 *
		 * @since 3.5.0
		 *
		 * @access private
		 *
		 * @returns {void}
		 */
_addListeners:function(){var o=this;
/**
			 * @summary Prevent any clicks inside this widget from leaking to the top and closing it.
			 *
			 * @since 3.5.0
			 *
			 * @param {Event} event The event that's being called.
			 *
			 * @returs {void}
			 */o.wrap.on("click.wpcolorpicker",function(t){t.stopPropagation()}),
/**
			 * @summary Open or close the color picker depending on the class.
			 *
			 * @since 3.5
			 */
o.toggler.click(function(){o.toggler.hasClass("wp-picker-open")?o.close():o.open()}),
/**
			 * @summary Checks if value is empty when changing the color in the color picker.
			 *
			 * Checks if value is empty when changing the color in the color picker.
			 * If so, the background color is cleared.
			 *
			 * @since 3.5.0
			 *
			 * @param {Event} event The event that's being called.
			 *
			 * @returns {void}
			 */
o.element.on("change",function(t){
// Empty or Error = clear
(""===p(this).val()||o.element.hasClass("iris-error"))&&(o.options.alpha?(i&&o.toggler.removeAttr("style"),o.toggler.find("span.color-alpha").css("backgroundColor","")):o.toggler.css("backgroundColor",""),
// fire clear callback if we have one
p.isFunction(o.options.clear)&&o.options.clear.call(this,t))}),
/**
			 * @summary Enables the user to clear or revert the color in the color picker.
			 *
			 * Enables the user to either clear the color in the color picker or revert back to the default color.
			 *
			 * @since 3.5.0
			 *
			 * @param {Event} event The event that's being called.
			 *
			 * @returns {void}
			 */
o.button.on("click",function(t){p(this).hasClass("wp-picker-clear")?(o.element.val(""),o.options.alpha?(i&&o.toggler.removeAttr("style"),o.toggler.find("span.color-alpha").css("backgroundColor","")):o.toggler.css("backgroundColor",""),p.isFunction(o.options.clear)&&o.options.clear.call(this,t)):p(this).hasClass("wp-picker-default")&&o.element.val(o.options.defaultColor).change()})}}),
/**
	 * Overwrite iris
	 */
p.widget("a8c.iris",p.a8c.iris,{_create:function(){if(this._super(),
// Global option for check is mode rbga is enabled
this.options.alpha=this.element.data("alpha")||!1,
// Is not input disabled
this.element.is(":input")||(this.options.alpha=!1),void 0!==this.options.alpha&&this.options.alpha){var r=this,t=r.element,o,e=p('<div class="iris-strip iris-slider iris-alpha-slider"><div class="iris-slider-offset iris-slider-offset-alpha"></div></div>').appendTo(r.picker.find(".iris-picker-inner")),a=e.find(".iris-slider-offset-alpha"),i={aContainer:e,aSlider:a};void 0!==t.data("custom-width")?r.options.customWidth=parseInt(t.data("custom-width"))||0:r.options.customWidth=100,
// Set default width for input reset
r.options.defaultWidth=t.width(),
// Update width for input
(r._color._alpha<1||-1!=r._color.toString().indexOf("rgb"))&&t.width(parseInt(r.options.defaultWidth+r.options.customWidth)),
// Push new controls
p.each(i,function(t,o){r.controls[t]=o}),
// Change size strip and add margin for sliders
r.controls.square.css({"margin-right":"0"});var n=r.picker.width()-r.controls.square.width()-20,l=n/6,s=n/2-l;p.each(["aContainer","strip"],function(t,o){r.controls[o].width(s).css({"margin-left":l+"px"})}),
// Add new slider
r._initControls(),
// For updated widget
r._change()}},_initControls:function(){if(this._super(),this.options.alpha){var r=this,t;r.controls.aSlider.slider({orientation:"vertical",min:0,max:100,step:1,value:parseInt(100*r._color._alpha),slide:function(t,o){
// Update alpha value
r._color._alpha=parseFloat(o.value/100),r._change.apply(r,arguments)}})}},_change:function(){this._super();var t=this,o=t.element,r;if(this.options.alpha){var e=t.controls,a=parseInt(100*t._color._alpha),i=t._color.toRgb(),n=["rgb("+i.r+","+i.g+","+i.b+") 0%","rgba("+i.r+","+i.g+","+i.b+", 0) 100%"],l=t.options.defaultWidth,s=t.options.customWidth,p=t.picker.closest(".wp-picker-container").find(".wp-color-result");
// Generate background slider alpha, only for CSS3 old browser fuck!! :)
e.aContainer.css({background:"linear-gradient(to bottom, "+n.join(", ")+"), url("+c+")"}),p.hasClass("wp-picker-open")&&(
// Update alpha value
e.aSlider.slider("value",a),
/**
					 * Disabled change opacity in default slider Saturation ( only is alpha enabled )
					 * and change input width for view all value
					 */
t._color._alpha<1?(e.strip.attr("style",e.strip.attr("style").replace(/rgba\(([0-9]+,)(\s+)?([0-9]+,)(\s+)?([0-9]+)(,(\s+)?[0-9\.]+)\)/g,"rgb($1$3$5)")),o.width(parseInt(l+s))):o.width(l))}(o.data("reset-alpha")||!1)&&t.picker.find(".iris-palette-container").on("click.palette",".iris-palette",function(){t._color._alpha=1,t.active="external",t._change()})},_addInputListeners:function(e){var a=this,t=100,o=function(t){var o=new Color(e.val()),r=e.val();e.removeClass("iris-error"),
// we gave a bad color
o.error?
// don't error on an empty input
""!==r&&e.addClass("iris-error"):o.toString()!==a._color.toString()&&(
// let's not do this on keyup for hex shortcodes
"keyup"===t.type&&r.match(/^[0-9a-fA-F]{3}$/)||a._setOption("color",o.toString()))};e.on("change",o).on("keyup",a._debounce(o,t)),
// If we initialized hidden, show on first focus. The rest is up to you.
a.options.hide&&e.on("focus",function(){a.show()})}})}}(jQuery),
// Auto Call plugin is class is color-picker
jQuery(document).ready(function(t){t(".color-picker").wpColorPicker()});