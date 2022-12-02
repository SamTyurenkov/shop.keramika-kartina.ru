/**
 * Ajax install the Theme Plugin
 *
 */
!function(o,t,a,n){"use strict";o(function(){o(".kt-install-toolkit-btn").on("click",function(t){
/**
			 * Install a plugin
			 *
			 * @return void
			 */
function a(){o.ajax({url:i.data("install-url"),type:"GET",data:{},beforeSend:function(){e(i.data("installing-label"))},success:function(t){s(i.data("installed-label")),n()},error:function(t,a,n){
// Installation failed
l("Error")}})}
/**
			 * Activate a plugin
			 *
			 * @return void
			 */function n(){o.ajax({url:i.data("activate-url"),type:"GET",data:{},beforeSend:function(){e(i.data("activating-label"))},success:function(t){l(i.data("activated-label")),location.replace(i.data("redirect-url"))},error:function(t,a,n){
// Activation failed
console.log(t.responseText),l("Error")}})}
/**
			 * Change button status to in-progress
			 *
			 * @return void
			 */function e(t){i.addClass("updating-message").removeClass("button-disabled kt-not-installed installed").text(t)}
/**
			 * Change button status to disabled
			 *
			 * @return void
			 */function l(t){i.removeClass("updating-message kt-not-installed installed").addClass("button-disabled").text(t)}
/**
			 * Change button status to installed
			 *
			 * @return void
			 */function s(t){i.removeClass("updating-message kt-not-installed").addClass("installed").text(t)}var i=o(t.target);t.preventDefault(),
/**
			 * Keep button from running twice
			 */
i.hasClass("updating-message")||i.hasClass("button-disabled")||("install"===i.data("action")?a():"activate"===i.data("action")&&n())})})}(jQuery,window,document);