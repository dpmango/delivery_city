/** @class Избранное  - магазины*/
window.Flipcat = window.Flipcat || {};
/**
 * @object Управление меткой авторизации
*/
var BreadCrumbs = {
	/** @property {String} favorites block */
	HTML_FAVORITES_ID : '#favorites',
	
	/**
	 *@param {Object} 
	*/
	init:function(lib) {
		this.HTML_BREAD_CRUMBS_ID = lib.HTML_BREAD_CRUMBS_ID;
		this.HTML_BREAD_CRUMBS_AREA_ID = lib.HTML_BREAD_CRUMBS_AREA_ID;
		this.setListeners();
	},
	/**
	 *@param {Array} data. item:  {link:String, title:String}
	 *@param {Function} обработчик клика на линке в хлебных крошках
	*/
	render:function(data, clickListener) {
		var breadCrumbs = data,
			div = $(this.HTML_BREAD_CRUMBS_ID), i, L = breadCrumbs.length,
			s, tplLink = div.find('li.tpl.link').html(),
			tplSpan = div.find('li.tpl.last').html(),
			tplDivider = div.find('li.tpl.divider').html(),
			f, tplCss, dvd;
		if (breadCrumbs && L) {
			//clear
			div.text('');
			div.append( $('<li class="tpl link" style="display:none;">' + tplLink + '</li><li class="tpl span divider" style="display:none;">' + tplDivider + '</li>' + '<li class="tpl span last" style="display:none">' + tplSpan + '</li>') );
			if (breadCrumbs.length < 2) {
				//$(this.HTML_BREAD_CRUMBS_AREA_ID).addClass('hide');
				return;
			}
			$(this.HTML_BREAD_CRUMBS_AREA_ID).removeClass('hide');
			//append
			for (i = 0; i < L; i++) {
				if (i != L - 1) {
					s = tplLink;
					tplCss = 'link';
					f = 1;
					dvd = tplDivider;
				} else {
					tplCss = 'span';
					s = tplSpan;
					dvd = '';
				}
				s = s.replace('[LINK]', breadCrumbs[i].link).replace('[TITLE]', breadCrumbs[i].title);
				s = '<li class="' + tplCss + '">' + s + '</li>';
				if (dvd) {
					s += '<li class="span divider">' + dvd + '</li>';
				}
				s = $(s);
				s = FlipcatWebAppLibrary.processTemplateLinks(s);
				if (f) {
					s.click(clickListener);
				}
				div.append(s);
			}
		} else {
			Error('Debug: empty bread crumbs data!');
		}
	},
	setListeners:function() {
	}
};
window.Flipcat.BreadCrumbs = BreadCrumbs;
