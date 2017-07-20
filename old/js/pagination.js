/**@class Pagination */
window.Flipcat = window.Flipcat || {};
/**
 * @object 
*/
window.Flipcat.Pagination = {
	/** @property {String} HTML_CONTAINER_CSS идентификатор блока с постраничной навигацией */
	HTML_CONTAINER_CSS:'ul.inline.pagination',
	
	/** @property {String} pageVar имя переменной в GET строке содержащей номер страницы */
	pageVar : 'page',
	
	/** @property {Boolean} HISTORY_API false || true */
	HISTORY_API :!!(window.history && window.history.pushState),
	
	/** @property {String} linkUrl значение href любой из ссылок пагинации, в ней будет менятся переменная pageVar */
	
	/**
	 *@param {Object} 
	*/
	init:function(lib) {
		var o = this;
		o.container = $(o.HTML_CONTAINER_CSS).first();
		if (o.container[0]) {
			o.setListeners();
		}
	},
	setListeners:function() {
		var o = this, c = o.container, a;
		c.find('li').each(function(i, j){
			j = $(j);
			if (!j.hasClass('tpl')) {
				if (o.listener) {
					j.find('a').click(o.listener);
				}
				a = j.find('a').click(o.onClick);
			}
		});
		
		if (o.HISTORY_API) {
			//o.block.find('a').click(function(){ ShopCatNavigator.onClick($(this)); return false; });
			$(window).bind('popstate', function() {
				o.onHistoryPopState();
			});
		}
	},
	/**
	 * @description установить данные для пагинации
	 * @param {Function} listener
	 * @param {Number} totalItems
	 * @param {Number} perPage
	 * @param {Number} itemInLine = 10
	 * @param {String} prevLabel = '<'
	 * @param {String} nextLabel = '>'
	*/
	setData:function(listener, totalItems, perPage, itemInLine, prevLabel, nextLabel) {
		var o = this;
		o.listener = listener;
		o.totalItems = totalItems;
		o.perPage = perPage;
		o.itemInLine = itemInLine;
		o.prevLabel = prevLabel;
		o.nextLabel = nextLabel;
	},
	
	onClick:function(evt) {
		var tag = 'li', o = Flipcat.Pagination, t = o.container.find(tag + '.tpl.active'), activeTpl = t.html(), activeCss = t.attr('class'),
			tpl, css, link, paginationData, page, i, s, itemText, wCss;
		if (!o.totalItems) {
			return;
		}
		link = $(evt.target).attr('href');
		page = FlipcatWebAppLibrary._GET('page', 1, link);
		if (o.HISTORY_API) {
			history.pushState(null, null, link);
		}
		link = '';
		t = o.container.find(tag + '.tpl').each(function(i, j){
			j = $(j);
			if (!j.hasClass('active')) {
				tpl = j.html();
				css = j.attr('class');
			}
		});
		o.container.find(tag).each(function(i, j){
			j = $(j);
			if (!j.hasClass('tpl')) {
				if (!link) {
					link = j.find('a').first().attr('href');
				}
				j.remove();
			}
		});
		paginationData = FlipcatWebAppLibrary.pagination(page, o.totalItems, o.perPage, o.itemInLine, o.prevLabel, o.nextLabel);
		activeCss = activeCss.replace('tpl', '').replace('active', '');
		css = css.replace('tpl', '');
		for(i = 0; i < paginationData.length; i++) {
			s = paginationData[i].active ? activeTpl : tpl;
			wCss = paginationData[i].active ? activeCss : css;
			pageText = paginationData[i].text ? paginationData[i].text: paginationData[i].n;
			s = s.replace('[N]', pageText);
			pageText = FlipcatWebAppLibrary.setGetVar(link, o.pageVar, paginationData[i].n);
			s = s.replace('[LINK]', pageText);
			t = $( '<' + tag + ' class="' + wCss + '">' + s + '</' + tag  + '>' );
			o.container.append(t);
		}
		o.setListeners();
		return false;
	},
	onHistoryPopState:function(evt) {
		if ( new Date().getTime() - window.loadTime  < 800) {//fix safari popstate event
			return;
		}
		var o = window.Flipcat.Pagination, href = window.location.href,
			emit = {attr:function() {return href}, isPopState:1};
		o.onClick(emit);
	}
}

