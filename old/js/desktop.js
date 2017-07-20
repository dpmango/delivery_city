/** @class Управление меткой авторизации */
window.Flipcat = window.Flipcat || {};
/**
 * @object Управление меткой авторизации
*/
var v = {
	/** @property {Number} favorites block */
	AREA_WIDTH : 1000, //TODO 1280
	
	/** @property {Number} максимум мобильной версии */
	MOBILE_WIDTH : 767, //
	
	/** @property {Number} позиция поля поиска  */
	SEACRH_TOP_POS:270,
	SEACRH_TOP_POS_CHROME:277,
	
	
	/** @property {Number} */
	initProc : 0,
	
	/** @property {Number} Максимальная высота области текста наименования товара @see line-height, min-height from fc-product-title */
	projectTitleH: 86,
	
	/** @property {String}  fc-product-title */
	HTML_PRODUCT_ITEM_TITLE_CSS: '.autosize-p-title',
	
	/**
	 *@param {Object} 
	*/
	init:function() {
		
		var o = Flipcat.Desktop;
		o.size();
		$(window).bind('resize', o.size);
		$(window).bind('scroll', o.onScroll);
		
		o.setProductTitlesFontSize();
		
		
		if (window.WOW) new WOW().init({
			offset: 20 
		});
		
	},
	setProductTitlesFontSize:function() {
		var o = this, fontSize;
		$(o.HTML_PRODUCT_ITEM_TITLE_CSS).each(function(i, j) {
			fontSize = parseInt($(j).css('font-size')) ? parseInt($(j).css('font-size')) : 16;
			while ($(j).height() > o.projectTitleH) {
				fontSize--;
				if (fontSize < 8) {
					break;
				}
				$(j).css('font-size', fontSize + 'px');
			}
		});
	},
	/**
	 *@param {Object} 
	*/
	onScroll:function() {
		var o = Flipcat.Desktop,
			m = FlipcatWebAppLibrary.isChrome() ? o.SEACRH_TOP_POS_CHROME : o.SEACRH_TOP_POS;
		if (!o.isMobile()) {
			if (window.scrollY > m) {
				//console.log(window.scrollY);
				if ($('#search-bar')[0]) {
					Flipcat.Desktop.fixTopLeftColumn('#style-switcher');
					Flipcat.Desktop.fixTopLeftColumn('#left-shop-categories');
				}
				Flipcat.Desktop.fixTopLeftColumn('#search-bar');
				
			} else {
				if ($('#search-bar')[0]) {
					Flipcat.Desktop.unfixTopLeftColumn('#style-switcher');
				}
				Flipcat.Desktop.unfixTopLeftColumn('#search-bar');
				Flipcat.Desktop.unfixTopLeftColumn('#left-shop-categories');
			}
		}
	},	
	fixTopLeftColumn : function(id) {
		var o = $(id);
		if (!o[0]) {
			return;
		}
		var left = o[0].offsetLeft, y = o[0].offsetTop,
		    css = id.replace('#', '') + '-clone';
		if (!o.hasClass(css)) {
			o.find('h2 a').css('display', 'none');
			o.attr('id', '');
			o.addClass('open');
			o.addClass(css);
		}
	},
	unfixTopLeftColumn: function(id) {
		var css = id.replace('#', '.') + '-clone';
		var o = $(css).first();
		if (!o[0]) {
			return;
		}
		o.find('h2 a').css('display', 'block');
		o.removeClass('open');
		o.attr('id', id.replace('#', ''));
		o.removeClass(css.replace('.', ''));
	},
	size:function() {
		var o = Flipcat.Desktop, m = $('#lt')[0], 
		x = m.offsetLeft, y = m.offsetTop, Lib = FlipcatWebAppLibrary,
		footer, dy = 18;
		if (!o.initProc) {
			o.initProc = 1;
			//$('div.navbar').css('left', x);
			footer = $('#main-footer');
			footer = footer.height() + parseInt(footer.css('padding-bottom')) + parseInt(footer.css('padding-top'));
			if (!o.isMobile()) {
				$('#vspacer').css('min-height', (Lib.getViewport().h - footer - y - dy) + 'px');
			}
			
			if (!o.isMobile()) {
				Flipcat.Favorites.scrollY(0);
				Flipcat.Desktop.unfixTopLeftColumn('#style-switcher');
				Flipcat.Desktop.unfixTopLeftColumn('#search-bar');
				Flipcat.Desktop.unfixTopLeftColumn('#left-shop-categories');
				
				if (window.scrollY >= o.SEACRH_TOP_POS) {
					Flipcat.Desktop.fixTopLeftColumn('#style-switcher');
					Flipcat.Desktop.fixTopLeftColumn('#search-bar');
					Flipcat.Desktop.fixTopLeftColumn('#left-shop-categories');
				}
				
			} else {//ismobyle
				Flipcat.Desktop.unfixTopLeftColumn('#style-switcher');
				Flipcat.Desktop.unfixTopLeftColumn('#search-bar');
				Flipcat.Desktop.unfixTopLeftColumn('#left-shop-categories');
				Flipcat.Favorites.scrollY(1);
			}
			
			o.initProc = 0;
		}
	},
	isMobile: function() {
		return ($('#c-button--slide-left').width() > 0);
	}
};
window.Flipcat.Desktop = v;
