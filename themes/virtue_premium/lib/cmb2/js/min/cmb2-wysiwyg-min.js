/**
 * Used for WYSIWYG logic
 */
window.CMB2=window.CMB2||{},window.CMB2.wysiwyg=window.CMB2.wysiwyg||{},function(r,o,a,d,i){"use strict";
// Private variables
// Private functions
/**
	 * Initializes any editors that weren't initialized because they didn't exist yet.
	 *
	 * @since  2.2.3
	 *
	 * @return {void}
	 */
function n(){
// Don't initialize until they've all been destroyed.
0===f.length?l.forEach(function(i){l.splice(l.indexOf(i),1),d.init.apply(d,i)}):r.setTimeout(n,100)}
/**
	 * Destroys any editors that weren't destroyed because they didn't exist yet.
	 *
	 * @since  2.2.3
	 *
	 * @return {void}
	 */function e(){f.forEach(function(i){f.splice(f.indexOf(i),1),d.destroy(i)})}
/**
	 * Gets the option data for a group (and initializes that data if it doesn't exist).
	 *
	 * @since  2.2.3
	 *
	 * @param  {object} data The group/field data.
	 *
	 * @return {object}      Options data object for a group.
	 */function c(i){var t=i.groupid,e=i.fieldid;return u[t]&&u[t][e]||(u[t]=u[t]||{},u[t][e]={template:wp.template("cmb2-wysiwyg-"+t+"-"+e),defaults:{
// Get the data from the template-wysiwyg initiation.
mce:a.extend({},tinyMCEPreInit.mceInit["cmb2_i_"+t+e]),qt:a.extend({},tinyMCEPreInit.qtInit["cmb2_i_"+t+e])}},
// This is the template-wysiwyg data, and we do not want that to be initiated.
delete tinyMCEPreInit.mceInit["cmb2_i_"+t+e],delete tinyMCEPreInit.qtInit["cmb2_i_"+t+e]),u[t][e]}
/**
	 * Initiates the tinyMCEPreInit options for a wysiwyg editor instance.
	 *
	 * @since  2.2.3
	 *
	 * @param  {object} options Options data object for the wysiwyg editor instance.
	 *
	 * @return {void}
	 */function s(i){var t=new RegExp("cmb2_n_"+i.groupid+i.fieldid,"g"),e=new RegExp("cmb2_i_"+i.groupid+i.fieldid,"g"),n,d,r;
// If no settings for this field. Clone from placeholder.
if(void 0===tinyMCEPreInit.mceInit[i.id]){for(n in d=a.extend({},i.defaults.mce))"string"==typeof d[n]&&(d[n]=d[n].replace(e,i.id).replace(t,i.name));tinyMCEPreInit.mceInit[i.id]=d}
// If no Quicktag settings for this field. Clone from placeholder.
if(void 0===tinyMCEPreInit.qtInit[i.id]){for(n in r=a.extend({},i.defaults.qt))"string"==typeof r[n]&&(r[n]=r[n].replace(e,i.id).replace(t,i.name));tinyMCEPreInit.qtInit[i.id]=r}}
/**
	 * Initializes all group wysiwyg editors. Hooked to cmb_init.
	 *
	 * @since  2.2.3
	 *
	 * @return {void}
	 */var f=[],l=[],u=d.all={};d.initAll=function(){var i,t,e;a(".cmb2-wysiwyg-placeholder").each(function(){i=a(this),(t=i.data()).groupid&&(t.id=i.attr("id"),t.name=i.attr("name"),t.value=i.val(),d.init(i,t,!1),e=!0)}),!0===e&&(void 0!==r.QTags&&r.QTags._buttonsInit(),
// Hook in our event callbacks.
a(o).on("cmb2_add_row",d.addRow).on("cmb2_remove_group_row_start",d.destroyRowEditors).on("cmb2_shift_rows_start",d.shiftStart).on("cmb2_shift_rows_complete",d.shiftComplete))},
/**
	 * Initiates wysiwyg editors in a new group row. Hooked to cmb2_add_row.
	 *
	 * @since  2.2.3
	 *
	 * @param  {object} evt A jQuery-normalized event object.
	 * @param  {object} $row A jQuery dom element object for the group row.
	 *
	 * @return {void}
	 */
d.addRow=function(i,t){d.initRow(t)},
/**
	 * Destroys wysiwyg editors in a group row when that row is removed. Hooked to cmb2_remove_group_row_start.
	 *
	 * @since  2.2.3
	 *
	 * @param  {object} evt A jQuery-normalized event object.
	 * @param  {object} $btn A jQuery dom element object for the remove-row button.
	 *
	 * @return {void}
	 */
d.destroyRowEditors=function(i,t){d.destroy(t.parents(".cmb-repeatable-grouping").find(".wp-editor-area").attr("id"))},
/**
	 * When a row-shift starts, we need to destroy the wysiwyg editors for the group-rows being shuffled.
	 *
	 * @since  2.2.3
	 *
	 * @param  {object} evt   A jQuery-normalized event object.
	 * @param  {object} $btn  A jQuery dom element object for the remove-row button.
	 * @param  {object} $from A jQuery dom element object for the row being shifted from.
	 * @param  {object} $to   A jQuery dom element object for the row being shifted to.
	 *
	 * @return {void}
	 */
d.shiftStart=function(i,t,e,n){e.add(n).find(".wp-editor-wrap textarea").each(function(){d.destroy(a(this).attr("id"))})},
/**
	 * When a row-shift completes, we need to re-init the wysiwyg editors for the group-rows being shuffled.
	 *
	 * @since  2.2.3
	 *
	 * @param  {object} evt   A jQuery-normalized event object.
	 * @param  {object} $btn  A jQuery dom element object for the remove-row button.
	 * @param  {object} $from A jQuery dom element object for the row being shifted from.
	 * @param  {object} $to   A jQuery dom element object for the row being shifted to.
	 *
	 * @return {void}
	 */
d.shiftComplete=function(i,t,e,n){e.add(n).each(function(){d.initRow(a(this))})},
/**
	 * Initializes editors for a new CMB row.
	 *
	 * @since  2.2.3
	 *
	 * @param  {object} $row A jQuery dom element object for the group row.
	 *
	 * @return {void}
	 */
d.initRow=function(i){var t,e;i.find(".cmb2-wysiwyg-inner-wrap").each(function(){t=a(this),(e=t.data()).iterator=i.data("iterator"),e.fieldid=e.id,e.id=e.groupid+"_"+e.iterator+"_"+e.fieldid,e.name=e.groupid+"["+e.iterator+"]["+e.fieldid+"]",e.value=t.find(".wp-editor-area").length?t.find(".wp-editor-area").val():"",
// The destroys might not have happened yet.  Don't init until they have.
0===f.length?d.init(t,e):(l.push([t,e]),r.setTimeout(n,100))})},
/**
	 * Initiates a wysiwyg editor instance and replaces the passed dom element w/ the editor html.
	 *
	 * @since  2.2.3
	 *
	 * @param  {object} $toReplace A jQuery dom element which will be replaced with the wysiwyg editor.
	 * @param  {object} data        Data used to initate the editor.
	 * @param  {bool}   buttonsInit Whether to run QTags._buttonsInit()
	 *
	 * @return {void}
	 */
d.init=function(i,t,e){if(!t.groupid)return!1;var n=r.cmb2_l10.user_can_richedit&&r.tinyMCE,d="function"==typeof r.quicktags;a.extend(t,c(t)),s(t),i.replaceWith(t.template(t)),n&&r.tinyMCE.init(tinyMCEPreInit.mceInit[t.id]),d&&r.quicktags(tinyMCEPreInit.qtInit[t.id]),n&&a(o.getElementById(t.id)).parents(".wp-editor-wrap").removeClass("html-active").addClass("tmce-active"),!1!==e&&void 0!==r.QTags&&r.QTags._buttonsInit()},
/**
	 * Destroys a wysiwyg editor instance.
	 *
	 * @since  2.2.3
	 *
	 * @param  {string} id Editor id.
	 *
	 * @return {void}
	 */
d.destroy=function(i){if(r.cmb2_l10.user_can_richedit&&r.tinyMCE){
// The editor might not be initialized yet.  But we need to destroy it once it is.
var t=tinyMCE.get(i);null!=t?(t.destroy(),void 0===tinyMCEPreInit.mceInit[i]&&delete tinyMCEPreInit.mceInit[i],void 0===tinyMCEPreInit.qtInit[i]&&delete tinyMCEPreInit.qtInit[i]):-1===f.indexOf(i)&&(f.push(i),r.setTimeout(e,100))}},
// Hook in our event callbacks.
a(o).on("cmb_init",d.initAll)}(window,document,jQuery,window.CMB2.wysiwyg);