/**
 * Controls the behaviours of custom metabox fields.
 *
 * @author CMB2 team
 * @see    https://github.com/CMB2/CMB2
 */
/**
 * Custom jQuery for Custom Metaboxes and Fields
 */
window.CMB2=window.CMB2||{},function(a,i,s,m,e){"use strict";
// localization strings
var l=a.cmb2_l10,d=a.setTimeout,r,p=function(e){return s(i.getElementById(e))},n={idNumber:!1,repeatEls:'input:not([type="button"],[id^=filelist]),select,textarea,.cmb2-media-status',noEmpty:'input:not([type="button"]):not([type="radio"]):not([type="checkbox"]),textarea',repeatUpdate:'input:not([type="button"]),select,textarea,label',styleBreakPoint:450,mediaHandlers:{},defaults:{time_picker:l.defaults.time_picker,date_picker:l.defaults.date_picker,color_picker:l.defaults.color_picker||{}},media:{frames:{}}};m.metabox=function(){return m.$metabox||(m.$metabox=s(".cmb2-wrap > .cmb2-metabox")),m.$metabox},m.init=function(){r=s(i),
// Setup the CMB2 object defaults.
s.extend(m,n),m.trigger("cmb_pre_init");var e=m.metabox(),t=e.find(".cmb-repeatable-group");
/**
		 * Initialize time/date/color pickers
		 */
m.initPickers(e.find('input[type="text"].cmb2-timepicker'),e.find('input[type="text"].cmb2-datepicker'),e.find('input[type="text"].cmb2-colorpicker')),
// Insert toggle button into DOM wherever there is multicheck. credit: Genesis Framework
s('<p><span class="button-secondary cmb-multicheck-toggle">'+l.strings.check_toggle+"</span></p>").insertBefore(".cmb2-checkbox-list:not(.no-select-all)"),
// Make File List drag/drop sortable:
m.makeListSortable(),e.on("change",".cmb2_upload_file",function(){m.media.field=s(this).attr("id"),p(m.media.field+"_id").val("")}).on("click",".cmb-multicheck-toggle",m.toggleCheckBoxes).on("click",".cmb2-upload-button",m.handleMedia).on("click",".cmb-attach-list li, .cmb2-media-status .img-status img, .cmb2-media-status .file-status > span",m.handleFileClick).on("click",".cmb2-remove-file-button",m.handleRemoveMedia).on("click",".cmb-add-group-row",m.addGroupRow).on("click",".cmb-add-row-button",m.addAjaxRow).on("click",".cmb-remove-group-row",m.removeGroupRow).on("click",".cmb-remove-row-button",m.removeAjaxRow).on("keyup paste focusout",".cmb2-oembed",m.maybeOembed).on("cmb2_remove_row",".cmb-repeatable-group",m.resetTitlesAndIterator).on("click",".cmbhandle, .cmbhandle + .cmbhandle-title",m.toggleHandle),t.length&&t.on("cmb2_add_row",m.emptyValue).filter(".sortable").each(function(){
// Add sorting arrows
s(this).find(".cmb-remove-group-row-button").before('<a class="button-secondary cmb-shift-rows move-up alignleft" href="#"><span class="'+l.up_arrow_class+'"></span></a> <a class="button-secondary cmb-shift-rows move-down alignleft" href="#"><span class="'+l.down_arrow_class+'"></span></a>')}).on("click",".cmb-shift-rows",m.shiftRows),
// on pageload
d(m.resizeoEmbeds,500),
// and on window resize
s(a).on("resize",m.resizeoEmbeds),m.trigger("cmb_init")},m.resetTitlesAndIterator=function(e){e.group&&
// Loop repeatable group tables
s(".cmb-repeatable-group.repeatable").each(function(){var e=s(this),i=e.find(".cmb-add-group-row").data("grouptitle");
// Loop repeatable group table rows
e.find(".cmb-repeatable-grouping").each(function(e){var t=s(this),a=t.find("h3.cmb-group-title");
// Reset rows iterator
t.data("iterator",e),
// Reset rows title
a.length&&a.text(i.replace("{#}",e+1))})})},m.toggleHandle=function(e){e.preventDefault(),m.trigger("postbox-toggled",s(this).parent(".postbox").toggleClass("closed"))},m.toggleCheckBoxes=function(e){e.preventDefault();var t=s(this),a=t.closest(".cmb-td").find("input[type=checkbox]:not([disabled])");
// If the button has already been clicked once...
t.data("checked")?(
// clear the checkboxes and remove the flag
a.prop("checked",!1),t.data("checked",!1)):(a.prop("checked",!0),t.data("checked",!0))},m.handleMedia=function(e){e.preventDefault();var t=s(this);m.attach_id=!t.hasClass("cmb2-upload-list")&&t.closest(".cmb-td").find(".cmb2-upload-file-id").val(),
// Clean up default 0 value
m.attach_id="0"!==m.attach_id&&m.attach_id,m._handleMedia(t.prev("input.cmb2-upload-file").attr("id"),t.hasClass("cmb2-upload-list"))},m.handleFileClick=function(e){e.preventDefault();var t=s(this),a=t.closest(".cmb-td"),i=a.find(".cmb2-upload-button").hasClass("cmb2-upload-list");m.attach_id=i?t.find('input[type="hidden"]').data("id"):a.find(".cmb2-upload-file-id").val(),m.attach_id&&m._handleMedia(a.find("input.cmb2-upload-file").attr("id"),i,m.attach_id)},m._handleMedia=function(a,i){if(wp){var c,r;
// If this field's media frame already exists, reopen it.
if(r=m.mediaHandlers,(c=m.media).field=a,c.$field=p(c.field),c.fieldData=c.$field.data(),c.previewSize=c.fieldData.previewsize,c.sizeName=c.fieldData.sizename,c.fieldName=c.$field.attr("name"),c.isList=i,a in c.frames)return c.frames[a].open();
// Create the media frame.
c.frames[a]=wp.media({title:m.metabox().find('label[for="'+a+'"]').text(),library:c.fieldData.queryargs||{},button:{text:l.strings[i?"upload_files":"upload_file"]},multiple:!!i&&"add"}),
// Enable the additional media filters: https://github.com/CMB2/CMB2/issues/873
c.frames[a].states.first().set("filterable","all"),m.trigger("cmb_media_modal_init",c),r.list=function(e,t){
// Setup our fileGroup array
var a=[],i;if(r.list.templates||(r.list.templates={image:wp.template("cmb2-list-image"),file:wp.template("cmb2-list-file")}),
// Loop through each attachment
e.each(function(e){
// Image preview or standard generic output if it's not an image.
i=r.getAttachmentHtml(e,"list"),
// Add our file to our fileGroup array
a.push(i)}),t)return a;
// Append each item from our fileGroup array to .cmb2-media-status
c.$field.siblings(".cmb2-media-status").append(a)},r.single=function(e){r.single.templates||(r.single.templates={image:wp.template("cmb2-single-image"),file:wp.template("cmb2-single-file")});
// Only get one file from the uploader
var t=e.first();c.$field.val(t.get("url")),p(c.field+"_id").val(t.get("id"));
// Image preview or standard generic output if it's not an image.
var a=r.getAttachmentHtml(t,"single");
// add/display our output
c.$field.siblings(".cmb2-media-status").slideDown().html(a)},r.getAttachmentHtml=function(e,t){var a="image"===e.get("type"),i=r.prepareData(e,a);
// Image preview or standard generic output if it's not an image.
return r[t].templates[a?"image":"file"](i)},r.prepareData=function(e,t){return t&&
// Set the correct image size data
r.getImageData.call(e,50),(e=e.toJSON()).mediaField=c.field,e.mediaFieldName=c.fieldName,e.stringRemoveImage=l.strings.remove_image,e.stringFile=l.strings.file,e.stringDownload=l.strings.download,e.stringRemoveFile=l.strings.remove_file,e},r.getImageData=function(e){
// Preview size dimensions
var t=c.previewSize[0]||e,a=c.previewSize[1]||e,i=this.get("url"),r=this.get("width"),n=this.get("height"),o=this.get("sizes");
// Get the correct dimensions and url if a named size is set and exists
// fallback to the 'large' size
return o&&(o[c.sizeName]?(i=o[c.sizeName].url,r=o[c.sizeName].width,n=o[c.sizeName].height):o.large&&(i=o.large.url,r=o.large.width,n=o.large.height)),
// Fit the image in to the preview size, keeping the correct aspect ratio
t<r&&(n=Math.floor(t*n/r),r=t),a<n&&(r=Math.floor(a*r/n),n=a),r||(r=t),n||(n="svg"===this.get("filename").split(".").pop()?"100%":a),this.set("sizeUrl",i),this.set("sizeWidth",r),this.set("sizeHeight",n),this},r.selectFile=function(){var e=c.frames[a].state().get("selection"),t=i?"list":"single";m.attach_id&&i?s('[data-id="'+m.attach_id+'"]').parents("li").replaceWith(r.list(e,!0)):r[t](e),m.trigger("cmb_media_modal_select",e,c)},r.openModal=function(){var e=c.frames[a].state().get("selection"),t;m.attach_id?((t=wp.media.attachment(m.attach_id)).fetch(),e.set(t?[t]:[])):e.reset(),m.trigger("cmb_media_modal_open",e,c)},
// When a file is selected, run a callback.
c.frames[a].on("select",r.selectFile).on("open",r.openModal),
// Finally, open the modal
c.frames[a].open()}},m.handleRemoveMedia=function(e){e.preventDefault();var t=s(this);return t.is(".cmb-attach-list .cmb2-remove-file-button")?t.parents(".cmb2-media-item").remove():(m.media.field=t.attr("rel"),m.metabox().find(i.getElementById(m.media.field)).val(""),m.metabox().find(i.getElementById(m.media.field+"_id")).val(""),t.parents(".cmb2-media-status").html("")),!1},m.cleanRow=function(r,n,e){var t=r.find(m.repeatUpdate);if(e){var a=r.find("[id]").not(m.repeatUpdate);
// Remove extra ajaxed rows
r.find(".cmb-repeat-table .cmb-repeat-row:not(:first-child)").remove(),
// Update all elements w/ an ID
a.length&&a.each(function(){var e=s(this),t=e.attr("id"),a=t.replace("_"+n,"_"+m.idNumber),i=r.find('[data-selector="'+t+'"]');e.attr("id",a),
// Replace data-selector vars
i.length&&i.attr("data-selector",a).data("selector",a)})}return t.filter(":checked").removeAttr("checked"),t.find(":checked").removeAttr("checked"),t.filter(":selected").removeAttr("selected"),t.find(":selected").removeAttr("selected",!1),r.find("h3.cmb-group-title").length&&r.find("h3.cmb-group-title").text(r.data("title").replace("{#}",m.idNumber+1)),t.each(function(){m.elReplacements(s(this),n,e)}),m},m.elReplacements=function(e,t,a){var i=e.attr("for"),r=e.val(),n=e.prop("type"),o=("radio"===n||"checkbox"===n)&&r,c={},l,s;if(i)c={for:i.replace("_"+t,"_"+m.idNumber)};else{var d=e.attr("name"),p;s=e.attr("id"),c={id:
// Handle adding groups vs rows.
// Expect another underscore after group's index trailing underscore.
l=a?(
// Expect another bracket after group's index closing bracket.
p=d?d.replace("["+t+"][","["+m.idNumber+"]["):"",s?s.replace("_"+t+"_","_"+m.idNumber+"_"):""):(
// Row indexes are at the very end of the string.
p=d?m.replaceLast(d,"["+t+"]","["+m.idNumber+"]"):"",s?m.replaceLast(s,"_"+t,"_"+m.idNumber):""),name:p}}
// Clear out textarea values
return"TEXTAREA"===e.prop("tagName")&&e.html(""),o&&e.removeAttr("checked"),!a&&e[0].hasAttribute("data-iterator")&&(c["data-iterator"]=m.idNumber),e.removeClass("hasDatepicker").attr(c).val(o||""),e},m.newRowHousekeeping=function(e){var t=e.find(".wp-picker-container"),a=e.find(".cmb2-media-status");return t.length&&
// Need to clean-up colorpicker before appending
t.each(function(){var e=s(this).parent();e.html(e.find('input[type="text"].cmb2-colorpicker').attr("style",""))}),
// Need to clean-up colorpicker before appending
a.length&&a.empty(),m},m.afterRowInsert=function(e){
// Init pickers from new row
m.initPickers(e.find('input[type="text"].cmb2-timepicker'),e.find('input[type="text"].cmb2-datepicker'),e.find('input[type="text"].cmb2-colorpicker'))},m.updateNameAttr=function(){var e=s(this),t=e.attr("name");// get current name
// If name is defined
if(void 0!==t){var a=parseInt(e.parents(".cmb-repeatable-grouping").data("iterator"),10),i=a-1,r=t.replace("["+a+"]","["+i+"]");
// New name with replaced iterator
e.attr("name",r)}},m.emptyValue=function(e,t){s(m.noEmpty,t).val("")},m.addGroupRow=function(e){e.preventDefault();var t=s(this);
// before anything significant happens
m.triggerElement(t,"cmb2_add_group_row_start",t);var a=p(t.data("selector")),i=a.find(".cmb-repeatable-grouping").last(),r=parseInt(i.data("iterator"),10);m.idNumber=parseInt(r,10)+1;
// Make sure the next number doesn't exist.
for(var n=i.clone();0<a.find('.cmb-repeatable-grouping[data-iterator="'+m.idNumber+'"]').length;)m.idNumber++;m.newRowHousekeeping(n.data("title",t.data("grouptitle"))).cleanRow(n,r,!0),n.find(".cmb-add-row-button").prop("disabled",!1);var o=s('<div class="postbox cmb-row cmb-repeatable-grouping" data-iterator="'+m.idNumber+'">'+n.html()+"</div>");i.after(o),m.afterRowInsert(o),m.triggerElement(a,{type:"cmb2_add_row",group:!0},o)},m.addAjaxRow=function(e){e.preventDefault();var t=s(this),a=p(t.data("selector")),i=a.find(".empty-row"),r=parseInt(i.find("[data-iterator]").data("iterator"),10);m.idNumber=parseInt(r,10)+1;var n=i.clone();m.newRowHousekeeping(n).cleanRow(n,r),i.removeClass("empty-row hidden").addClass("cmb-repeat-row"),i.after(n),m.afterRowInsert(n),m.triggerElement(a,{type:"cmb2_add_row",group:!1},n)},m.removeGroupRow=function(e){e.preventDefault();var t=s(this),a=p(t.data("selector")),i=t.parents(".cmb-repeatable-grouping"),r;if(a.find(".cmb-repeatable-grouping").length<2)return m.resetRow(i.parents(".cmb-repeatable-group").find(".cmb-add-group-row"),t);m.triggerElement(a,"cmb2_remove_group_row_start",t),
// when a group is removed loop through all next groups and update fields names
i.nextAll(".cmb-repeatable-grouping").find(m.repeatEls).each(m.updateNameAttr),i.remove(),m.triggerElement(a,{type:"cmb2_remove_row",group:!0})},m.removeAjaxRow=function(e){e.preventDefault();var t=s(this);
// Check if disabled
if(!t.hasClass("button-disabled")){var a=t.parents(".cmb-row"),i=t.parents(".cmb-repeat-table"),r;if(i.find(".cmb-row").length<=2)return m.resetRow(a.find(".cmb-add-row-button"),t);a.hasClass("empty-row")&&a.prev().addClass("empty-row").removeClass("cmb-repeat-row"),t.parents(".cmb-repeat-table .cmb-row").remove(),m.triggerElement(i,{type:"cmb2_remove_row",group:!1})}},m.resetRow=function(e,t){
// Click the "add new" button followed by the "remove this" button
// in order to reset the repeat row to empty values.
e.trigger("click"),t.trigger("click")},m.shiftRows=function(e){e.preventDefault();var t=s(this),a=t.parents(".cmb-repeatable-grouping"),i=t.hasClass("move-up")?a.prev(".cmb-repeatable-grouping"):a.next(".cmb-repeatable-grouping");if(
// Before shift occurs.
m.triggerElement(t,"cmb2_shift_rows_enter",t,a,i),i.length){
// About to shift
m.triggerElement(t,"cmb2_shift_rows_start",t,a,i);var o=[];
// Loop this item's fields
a.find(m.repeatEls).each(function(){var e=s(this),t=e.attr("type"),a;
// special case for image previews
a=e.hasClass("cmb2-media-status")?e.html():"checkbox"===t||"radio"===t?e.is(":checked"):"select"===e.prop("tagName")?e.is(":selected"):e.val(),
// Get all the current values per element
o.push({val:a,$:e})}),
// And swap them all
i.find(m.repeatEls).each(function(e){var t=s(this),a=t.attr("type"),i;if(t.hasClass("cmb2-media-status")){var r=t.closest(".cmb-repeatable-grouping").attr("data-iterator"),n=o[e].$.closest(".cmb-repeatable-grouping").attr("data-iterator");
// special case for image previews
i=t.html(),t.html(o[e].val),o[e].$.html(i),o[e].$.find("input").each(function(){var e=s(this).attr("name");e=e.replace("["+r+"]","["+n+"]"),s(this).attr("name",e)}),t.find("input").each(function(){var e=s(this).attr("name");e=e.replace("["+n+"]","["+r+"]"),s(this).attr("name",e)})}
// handle checkbox swapping
else"checkbox"===a?(o[e].$.prop("checked",t.is(":checked")),t.prop("checked",o[e].val)):"radio"===a?(t.is(":checked")&&o[e].$.attr("data-checked","true"),o[e].$.is(":checked")&&t.attr("data-checked","true")):"select"===t.prop("tagName")?(o[e].$.prop("selected",t.is(":selected")),t.prop("selected",o[e].val)):(o[e].$.val(t.val()),t.val(o[e].val))}),a.find("input[data-checked=true]").prop("checked",!0).removeAttr("data-checked"),i.find("input[data-checked=true]").prop("checked",!0).removeAttr("data-checked"),
// trigger color picker change event
a.find('input[type="text"].cmb2-colorpicker').trigger("change"),i.find('input[type="text"].cmb2-colorpicker').trigger("change"),
// shift done
m.triggerElement(t,"cmb2_shift_rows_complete",t,a,i)}},m.initPickers=function(e,t,a){
// Initialize jQuery UI timepickers
m.initDateTimePickers(e,"timepicker","time_picker"),
// Initialize jQuery UI datepickers
m.initDateTimePickers(t,"datepicker","date_picker"),
// Initialize color picker
m.initColorPickers(a)},m.initDateTimePickers=function(e,i,r){e.length&&e[i]("destroy").each(function(){var e=s(this),t=e.data(i)||{},a=s.extend({},m.defaults[r],t);e[i](m.datePickerSetupOpts(t,a,i))})},m.datePickerSetupOpts=function(e,t,i){var r=s.extend({},t);return t.beforeShow=function(e,t){"timepicker"===i&&m.addTimePickerClasses(t.dpDiv),
// Wrap datepicker w/ class to narrow the scope of jQuery UI CSS and prevent conflicts
p("ui-datepicker-div").addClass("cmb2-element"),
// Let's be sure to call beforeShow if it was added
"function"==typeof r.beforeShow&&r.beforeShow(e,t)},"timepicker"===i&&(t.onChangeMonthYear=function(e,t,a,i){m.addTimePickerClasses(a.dpDiv),
// Let's be sure to call onChangeMonthYear if it was added
"function"==typeof r.onChangeMonthYear&&r.onChangeMonthYear(e,t,a,i)}),t.onClose=function(e,t){
// Remove the class when we're done with it (and hide to remove FOUC).
var a=p("ui-datepicker-div").removeClass("cmb2-element").hide();"timepicker"!==i||s(t.input).val()||
// Set the timepicker field value if it's empty.
t.input.val(a.find(".ui_tpicker_time").text()),
// Let's be sure to call onClose if it was added
"function"==typeof r.onClose&&r.onClose(e,t)},t},
// Adds classes to timepicker buttons.
m.addTimePickerClasses=function(e){var t=m.addTimePickerClasses;t.count=t.count||0,
// Wait a bit to let the timepicker render, since these are pre-render events.
d(function(){e.find(".ui-priority-secondary").length?(e.find(".ui-priority-secondary").addClass("button-secondary"),e.find(".ui-priority-primary").addClass("button-primary"),t.count=0):t.count<5&&(t.count++,t(e))},10)},m.initColorPickers=function(e){e.length&&("object"==typeof jQuery.wp&&"function"==typeof jQuery.wp.wpColorPicker?e.each(function(){var e=s(this),t=e.data("colorpicker")||{};e.wpColorPicker(s.extend({},m.defaults.color_picker,t))}):e.each(function(e){s(this).after('<div id="picker-'+e+'" style="z-index: 1000; background: #EEE; border: 1px solid #CCC; position: absolute; display: block;"></div>'),p("picker-"+e).hide().farbtastic(s(this))}).focus(function(){s(this).next().show()}).blur(function(){s(this).next().hide()}))},m.makeListSortable=function(){var e=m.metabox().find(".cmb2-media-status.cmb-attach-list");e.length&&e.sortable({cursor:"move"}).disableSelection()},m.maybeOembed=function(a){var t=s(this),e;({focusout:function(){d(function(){
// if it's been 2 seconds, hide our spinner
m.spinner(".cmb2-metabox",!0)},2e3)},keyup:function(){var e=function(e,t){return a.which<=t&&a.which>=e};
// Only Ajax on normal keystrokes
(e(48,90)||e(96,111)||e(8,9)||187===a.which||190===a.which)&&
// fire our ajax function
m.doAjax(t,a)},paste:function(){
// paste event is fired before the value is filled, so wait a bit
d(function(){m.doAjax(t)},100)}})[a.type]()},
/**
	 * Resize oEmbed videos to fit in their respective metaboxes
	 */
m.resizeoEmbeds=function(){m.metabox().each(function(){var e=s(this),t=e.parents(".inside"),a=e.parents(".inner-sidebar").length||e.parents("#side-sortables").length,n=a,i=!1;if(!t.length)return!0;// continue
// Calculate new width
var o=t.width();m.styleBreakPoint>o&&(n=!0,i=m.styleBreakPoint-62>o);var c=(o=n?o:Math.round(.82*t.width()*.97))-30;if(!n||a||i||(c-=75),639<c)return!0;// continue
var r,l=e.find(".cmb-type-oembed .embed-status").children().not(".cmb2-remove-wrapper");if(!l.length)return!0;// continue
l.each(function(){var e=s(this),t=e.width(),a=e.height(),i=c;e.parents(".cmb-repeat-row").length&&!n&&(
// Make room for our repeatable "remove" button column
i=c-91,i=o<785?i-15:i);
// Calc new height
var r=Math.round(i*a/t);e.width(i).height(r)})})},
/**
	 * Safely log things if query var is set
	 * @since  1.0.0
	 */
m.log=function(){l.script_debug&&console&&"function"==typeof console.log&&console.log.apply(console,arguments)},m.spinner=function(e,t){var a=t?"removeClass":"addClass";s(".cmb-spinner",e)[a]("is-active")},
// function for running our ajax
m.doAjax=function(e){
// get typed value
var t=e.val();
// only proceed if the field contains more than 6 characters
if(!(t.length<6)){
// get field id
var a=e.attr("id"),i=e.closest(".cmb-td"),r=i.find(".embed-status"),n=i.find(".embed_wrap"),o=r.find(":first-child"),c=r.length&&o.length?o.width():e.width();m.log("oembed_url",t,a),
// show our spinner
m.spinner(i),
// clear out previous results
n.html(""),
// and run our ajax function
d(function(){
// if they haven't typed in 500 ms
s(".cmb2-oembed:focus").val()===t&&s.ajax({type:"post",dataType:"json",url:l.ajaxurl,data:{action:"cmb2_oembed_handler",oembed_url:t,oembed_width:300<c?c:300,field_id:a,object_id:e.data("objectid"),object_type:e.data("objecttype"),cmb2_ajax_nonce:l.ajax_nonce},success:function(e){m.log(e),
// hide our spinner
m.spinner(i,!0),
// and populate our results from ajax response
n.html(e.data)}})},500)}},m.trigger=function(e){var t=Array.prototype.slice.call(arguments,1);t.push(m),r.trigger(e,t)},m.triggerElement=function(e,t){var a=Array.prototype.slice.call(arguments,2);a.push(m),e.trigger(t,a)},m.replaceLast=function(e,t,a){
// find the index of last time word was used
var i=e.lastIndexOf(t);
// slice the string in 2, one from the start to the lastIndexOf
// and then replace the word in the rest
return e.slice(0,i)+e.slice(i).replace(t,a)},s(m.init)}(window,document,jQuery,window.CMB2);