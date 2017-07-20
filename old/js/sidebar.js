/** @class Хэлпер для выдвижных панелек*/
window.Flipcat = window.Flipcat || {};
/**
 * @object Управление выдвижными панелями, TODO referenced код из custom.js будет перенесен сюда
*/
var Sidebar = {
	/** @property {Array} HTML_PANELS_ID_LIST panels ids */
	HTML_PANELS_ID_LIST : ['#search-bar', '#style-switcher'],
	
	/** @property {Number} minZIndex */
	minZIndex : 99999,
	
	/**
	 *@param {String} id panel 
	*/
	zIndex:function(id) {
		var i, o = this, list = o.HTML_PANELS_ID_LIST, min = o.minZIndex;
		for (var i = 0; i < list.length; i++) {
			$(list[i]).css('z-index', min);
		}
		$(id).css('z-index', min + 1);
	}
};
window.Flipcat.SidebarHelper = Sidebar;
