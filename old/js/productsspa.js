'use strict'
/** @class Одностраничная навигация по списку продуктов при нажатии на пункты в меню слева*/
/** @depends url format для ссылки на магазин и категории магазина использует /b/ фрагмент*/
window.Flipcat = window.Flipcat || {};
/**
 * @object Обработка ввода в поле поиска ктегорий
*/
var ShopCatNavigator = {
	/** @property {String} блок с товарами магазина */
	HTML_PRODUCTS_CONTAINER_ID : '#products',
	
	/** @var {String} скрытый инпут, содержащий 1 когда пользователь находится на странице всех категорий магазина */
	HTML_INPUT_ALL_SHOP_CATEGORIES_PAGE_ID : '#shopAllCategories',

	/** @property {String} блок с новостями магазина */
	HTML_NEWS_CONTAINER_ID : '#fcShopNews',

	/** @property {String} блок с новостями магазина на главной*/
	HTML_MAIN_NEWS_CONTAINER_ID : '#fcShopNewsMain',

	/** @property {String} блок с информацией о магазине */
	HTML_INFO_CONTAINER_ID : '#fcShopInfo',

	
	/** @property {String} блок с отзывами о магазине */
	HTML_REVIEW_CONTAINER_ID : '#fcShopReviews',
	

	/** @property {String} id списка категорий в левом меню*/
	HTML_SHOP_CATEGORIES_CSS : '.left-shop-categories',

	/** @property {String} класс инпута  ввода */
	HTML_INPUT_CSS : '.search',

	/** @property {String} класс активной ссылки в левом меню */
	HTML_ACTIVE_LINK_CSS : '.left-menu-active-link',

	/** @property {String} идентификатор закладки Каталог магазина */
	HTML_CATALOG_BM_ID : '#shopCatalogLink',

	/** @property {String} идентификатор закладки Новости магазина */
	HTML_NEWS_BM_ID : '#shopNewsLink',

	/** @property {String} идентификатор закладки Information магазина */
	HTML_INFO_BM_ID : '#shopInfoLink',

	
	/** @property {String} идентификатор закладки Reviews магазина */
	HTML_REVIEW_BM_ID : '#shopReviewLink',

	/** @property {String} класс активной закладки в верхнем меню*/
	HTML_ACTIVE_BM_CSS : '.smi-active',

	/** @property {String} класс - признак закладки в верхнем меню*/
	HTML_BM_CSS : '.shop-menu-item',

	/** @property {String} класс - признак ссылки сортировки в блоке сортировки товаров*/
	HTML_PRODUCT_SORT_CSS : '.product-sort-link',

	/** @property {String} */
	HTML_PRODUCT_SORT_UP_ARROW_CSS : 'arrow_down_mirror',

	/** @property {String} */
	HTML_PRODUCT_SORT_BLOCK_ID : '#sortProductsBlock',
	
	/** @property {String} shopCurrency */
	HTML_PRODUCT_SHOP_CURRENCY_INPUT_ID : '#shopCurrency',

	/** @property {Boolean} HISTORY_API false || true */
	HISTORY_API :!!(window.history && window.history.pushState),

	/** @property {Object} Данные категорий магазина */
	categoriesProducts : {},
	
	/** @property {Boolean} true говорит о том, что запрос был на добавление данных */
	isAppendRequest    : false,
	
	/** @property {$Object} block блок содержащий ссылки на категории магазина*/
	
	/** @property {$Object} флаг указывает, когда пользователь выбрал избранные товары */
	isFavoriteProductPage : false,
	
	/** @property {String} id лоадера внизу */
	HTML_PRODUCTS_BOTTOM_LOADER_ID : '#bottomLoader',
	
	/** @property {String} id блока категорий для мобильной версии */
	HTML_MOBILE_CATEGORIES_ID : '#shopcategories',

	/**
	 *
	*/
	init:function(functions) {
		this.lib = window.FlipcatWebAppLibrary;
		this._get = functions._get;
		this.messageFail = functions.messageFail;
		this.initCartLink = functions.initCartLink;
		this.setOnShopItemPopupListener = functions.setOnShopItemPopupListener;
		if ( $(this.HTML_SHOP_CATEGORIES_CSS)[0] || FlipcatWebAppLibrary._GET('text', '-1') != -1) {
			this.block = $(this.HTML_SHOP_CATEGORIES_CSS).first();
			this.currency = $(this.HTML_PRODUCT_SHOP_CURRENCY_INPUT_ID).val();
			this.setListeners();
		}
		$(this.HTML_BM_CSS).click(this.onClickBookmark);
		this.setNewsBookmarkActive();
	},
	setListeners:function() {
		var o = this;
		if (o.HISTORY_API) {
			o.block.find('a').click(function(){ ShopCatNavigator.onClick($(this)); return false; });
			$(window).bind('popstate', function() {
				o.onHistoryPopState();
			});
		}
		Flipcat.linkListener = o.onNeedMoreItems;
	},
	onClickBookmark:function(evt) {
		var o = Flipcat.ShopCatNavigator, activeCss = o.HTML_ACTIVE_BM_CSS.replace('.', '');
		$(o.HTML_BM_CSS).removeClass(activeCss);
		$(evt.target).addClass(activeCss);
		switch('#' + $(evt.target).attr('id')) {
			case o.HTML_NEWS_BM_ID:
				$(o.HTML_PRODUCT_SORT_BLOCK_ID).addClass('hide');
				$(o.HTML_NEWS_CONTAINER_ID).removeClass('hide');
				$(o.HTML_PRODUCTS_CONTAINER_ID).addClass('hide');
				$(o.HTML_INFO_CONTAINER_ID).addClass('hide');
				$(o.HTML_MAIN_NEWS_CONTAINER_ID).addClass('hide');
				$(o.HTML_REVIEW_CONTAINER_ID).addClass('hide');
				$(o.HTML_MOBILE_CATEGORIES_ID).addClass('hide');
				if (Flipcat.Desktop.isMobile()) {
					$(Flipcat.ShopFavorite.HTML_SHOP_SECTION_FAVORITE_CSS).addClass('hide');
				}
				break;
			case o.HTML_INFO_BM_ID:
				$(o.HTML_PRODUCT_SORT_BLOCK_ID).addClass('hide');
				$(o.HTML_NEWS_CONTAINER_ID).addClass('hide');
				$(o.HTML_INFO_CONTAINER_ID).removeClass('hide');
				$(o.HTML_PRODUCTS_CONTAINER_ID).addClass('hide');
				$(o.HTML_MAIN_NEWS_CONTAINER_ID).addClass('hide');
				$(o.HTML_REVIEW_CONTAINER_ID).addClass('hide');
				$(o.HTML_MOBILE_CATEGORIES_ID).addClass('hide');
				if (Flipcat.Desktop.isMobile()) {
					$(Flipcat.ShopFavorite.HTML_SHOP_SECTION_FAVORITE_CSS).addClass('hide');
				}
				break;
			case o.HTML_REVIEW_BM_ID:
				$(o.HTML_PRODUCT_SORT_BLOCK_ID).addClass('hide');
				$(o.HTML_NEWS_CONTAINER_ID).addClass('hide');
				$(o.HTML_INFO_CONTAINER_ID).addClass('hide');
				$(o.HTML_PRODUCTS_CONTAINER_ID).addClass('hide');
				$(o.HTML_MAIN_NEWS_CONTAINER_ID).addClass('hide');
				$(o.HTML_REVIEW_CONTAINER_ID).removeClass('hide');
				$(o.HTML_MOBILE_CATEGORIES_ID).addClass('hide');
				if (Flipcat.Desktop.isMobile()) {
					$(Flipcat.ShopFavorite.HTML_SHOP_SECTION_FAVORITE_CSS).addClass('hide');
				}
				Flipcat.Reviews.onPageClick();
				break;
			case o.HTML_CATALOG_BM_ID:
				$(o.HTML_PRODUCT_SORT_BLOCK_ID).removeClass('hide');
				$(o.HTML_PRODUCTS_CONTAINER_ID).removeClass('hide');
				$(o.HTML_NEWS_CONTAINER_ID).addClass('hide');
				$(o.HTML_INFO_CONTAINER_ID).addClass('hide');
				$(o.HTML_MAIN_NEWS_CONTAINER_ID).removeClass('hide');
				$(o.HTML_REVIEW_CONTAINER_ID).addClass('hide');
				$(o.HTML_MOBILE_CATEGORIES_ID).removeClass('hide');
				if ( parseInt( $('#favorite-count').text()) > 0) {
					$(Flipcat.ShopFavorite.HTML_SHOP_SECTION_FAVORITE_CSS).removeClass('hide');
				}
				if (Flipcat.Desktop.isMobile()) {
					//$(Flipcat.ShopFavorite.HTML_SHOP_CATEGORIES_MOBILE_ID).addClass('hide');
					$(Flipcat.ShopFavorite.HTML_PRODUCT_BLOCK_CSS).addClass('hidden-xs');
					$(Flipcat.ShopFavorite.HTML_SHOP_CATEGORIES_MOBILE_ID).removeClass('hide');
					//$(Flipcat.ShopFavorite.HTML_SHOP_SECTION_FAVORITE_CSS).removeClass('hide');
				}
				break;
		}
	},
	/**
	 * @description Клик на ссылке - категории магазина в левом меню
	 * @param {$Object} link
	*/
	onHistoryPopState:function() {
		if ( new Date().getTime() - window.loadTime  < 1500) {//fix safari popstate event
			return;
		}
		var o = window.Flipcat.ShopCatNavigator, href = window.location.href,
			emit = {attr:function() {return href}, isPopState:1};
		o.onClick(emit);
	},
	/**
	 * @description Клик на ссылке - категории магазина в левом меню
	 * @param {$Object} link
	*/
	onClick:function(link) {
		if (link.attr('href').indexOf('#reviews') != -1) {
			return false;
		}
		var o = this, h = link.attr('href'), bmCatalog = $(o.HTML_CATALOG_BM_ID)[0];
		if(~link.attr('href').indexOf('getFavorite')) {
			o.isFavoriteProductPage = true;
		} else {
			o.isFavoriteProductPage = false;
		}
		if (link.isPopState) {
			o.ignorePush = true;
		} else {
			o.ignorePush = false;
		}
		if ( h == '#' ) {
			return;
		}
		o.onNeedMoreItems.requestSend = true;
		
		Flipcat.Orders.previousAutoloadPage = 0;
		Flipcat.Orders.currentPage = 1;
		
		$(o.HTML_INPUT_ALL_SHOP_CATEGORIES_PAGE_ID).val(0);
		if (bmCatalog) {
			o.onClickBookmark({target:bmCatalog});
		}
		o.setSortLinks(h);
		
		/*o.onNeedMoreItems.limit = 0;
		o.onNeedMoreItems.total = 0;
		o.onNeedMoreItems.page = 0;*/
		
		o.isAppendRequest = false;
		
		Flipcat.Orders.currentPage = 1;
		o.getUrl(o.onLoadData, h + '.json', o.onFailLoadData);
	},
	/**
	 * @description Клик на ссылке - категории магазина в левом меню
	 * @param {Object} data
	*/
	onLoadData:function(data) {
		$(Flipcat.ShopCatNavigator.HTML_PRODUCTS_BOTTOM_LOADER_ID).addClass('hide');
		Flipcat.Orders.autoloadProcess = 0;
		if (data.products && (data.products instanceof Array) && data.products.length == 0) {
			Flipcat.Orders.currentPage--;
			//return;
		}
		var o = Flipcat.ShopCatNavigator, page, s;
		o.requestSended = false;
		//setTimeout(function(){
			
			o.onNeedMoreItems.requestSend = false;
		//}, 1000);
		//o.onNeedMoreItems.total = data.totalProducts;
		//o.onNeedMoreItems.limit = data.limit;
		if (!data.products.length) {
			page = FlipcatWebAppLibrary._GET('page', 1);
			//o.onNeedMoreItems.total = page * data.limit;
			$(o.HTML_PRODUCTS_BOTTOM_LOADER_ID).addClass('hide');
			o.renderProducts(data.products, data.currency);
			
			if (o.lastRequest) {
				if (!o.ignorePush) {
					s = o.lastRequest.replace('.json', '');
					page = FlipcatWebAppLibrary._GET('page', 1, s) - 1;
					page = +page > 0 ? +page : 'CMD_UNSET';
					s = FlipcatWebAppLibrary.setGetVar(s, 'page', page);
					history.pushState(null, null, s);
				}
				o.categoriesProducts[o.lastRequest] = data;
			}
			
			return;
		}
		if (data.errorMessage || data.remoteErrorInfo) {
			o.onFailLoadData(data.errorMessage + ( data.remoteErrorInfo ? data.remoteErrorInfo : '' ) );
			$(o.HTML_PRODUCTS_BOTTOM_LOADER_ID).addClass('hide');
			return;
		}
		FlipcatWebAppLibrary.unlock('.desktop-right-col');
		if (o.lastRequest) {
			if (!o.ignorePush) {
				history.pushState(null, null, o.lastRequest.replace('.json', ''));
			}
			o.categoriesProducts[o.lastRequest] = data;
		}
		o.renderProducts(data.products, data.currency);
		if (data.breadCrumbs) {
			o.renderBreadCrumbs(data.breadCrumbs);
		}
		$(o.HTML_PRODUCTS_BOTTOM_LOADER_ID).addClass('hide');
	},
	/**
	 * @description
	 * @param {}
	*/
	renderBreadCrumbs:function(data) {
		BreadCrumbs.render(data, this.breadCrumbsClickListener);
	},
	/**
	 * @description
	 * @param {}
	*/
	breadCrumbsClickListener:function(ev) {
		var a = ev.target.tagName == 'A' ? $(ev.target) : $(ev.target).parents('a').first(), link = a.attr('href');
		if (~String(link).indexOf('/b/')) {
			ShopCatNavigator.onClick($(a));
			return false;
		}
	},
	/**
	 * @description Вспомогательная функция для вывода изображения элемента списка продуктов
	 * @param {Object} item Элемент списка продуктов
	*/
	imageUrl:function(item) {
		if (item && item.photos && item.photos[0] && item.photos[0].big_url) {
			return 'src="' + item.photos[0].big_url + '"';
		} else if (item && item.photos && item.photos[0] && item.photos[0].preview_url) {
			return 'src="' + item.photos[0].preview_url + '"';
		} else if (item && item.photos && item.photos[0] && item.photos[0].thumbnail_url) {
			return 'src="' + item.photos[0].thumbnail_url + '"';
		}
		return 'src="/img/productListNoImage.png"';
	},
	/**
	 * @description Вспомогательная функция для вывода стоимости элемента списка продуктов
	 * @param {Object} item Элемент списка продуктов
	*/
	setPrice:function(item) {
		var currencies = FlipcatWebAppLibrary.getCurrenciesArray(), s;
		s = item.price;
		if (currencies[Flipcat.ShopCatNavigator.currency]) {
			s += ' ' + currencies[Flipcat.ShopCatNavigator.currency];
		}
		return s;
	},
	/**
	 * @description отрисовка параметров продукта
	*/
	renderParams:function(item, $tpl) {
		var container = $tpl.find('.sc-item-popup-param-list').first(), tpl = container.html(),
			i, arr = item.params, L = arr.length, s, rHtml = '';
		for (i = 0; i < L; i++) {
			s = tpl.replace('[paramValue]', arr[i].value);
			s = s.replace(/tpl/gm, '');
			s = s.replace(/\[params\]/gm, '');
			if (arr[i].param) {
				s = s.replace('[paramName]', arr[i].param + ':');
			} else {
				s = s.replace('[paramName]', '');
			}
			rHtml += s;
		}
		return rHtml;
	},
	/**
	 * @description отрисовка контролов мультипродукта
	*/
	renderMultiproductControls:function(item, $tpl) {
		if (item.merge != 1) {
			return '';
		}
		var tmp = $('<div></div>'), wrapperHtml = $('#multiproductsControlsTpl').html(),
			sMergeParams;
		wrapperHtml = wrapperHtml.replace('[id]', item.id);
		wrapperHtml = wrapperHtml.replace('[multiproduct-options-css]', 'multiproduct-options');
		wrapperHtml = wrapperHtml.replace('[json]', JSON.stringify(item));
		sMergeParams = Flipcat.ShopCatNavigator.renderMergeParams(item.merge_params);
		wrapperHtml = wrapperHtml.replace('[merge_params]', sMergeParams);
		return wrapperHtml;
	},
	/**
	 * @description отрисовка одной характеристики мультипродукта
	 * @see renderMultiproductControls
	*/
	renderMergeParams:function(mergeParams) {
		var tpl = $('#multiproductsControlsMergeParamTpl').html(), s = '', i, list = mergeParams, j, k, html = '';
		for (i = 0; i < list.length; i++) {
			s = tpl.replace('[param]', list[i].param);
			s = s.replace('[param_id]', list[i].param_id);
			s = s.replace('[options]', Flipcat.ShopCatNavigator.renderMultiproductParamOptions(list[i].values));
			html += s;
		}
		return html;
	},
	/**
	 * @description отрисовка значений одной характеристики мультипродукта
	 * @see renderMultiproductControls
	*/
	renderMultiproductParamOptions:function(values) {
		var tpl = $('#multiproductsControlsMergeParamOptionTpl').html(), s, i, html = '';
		for (i = 0; i < values.length; i++) {
			s = tpl.replace('[parameter_value_value_id]', values[i].value_id);
			s = s.replace('[parameter_value_value]', values[i].value);
			html += s;
		}
		return html;
	},
	/**
	 * @description отрисовка списка продуктов
	*/
	renderProducts:function(data, currency) {
		var o = this, replace = [
			{key: /data\-src="src"/gi, val: o.imageUrl},//TODO
			{key: /\[name\]/gi, val: 'name'},
			{key: /\[id\]/gi, val: 'id'},
			{key: /\[price\]/gi, val: o.setPrice},
			{key: /\[description\]/gi, val: 'description'},
			{key: /\[params\]/gi, val: o.renderParams},
			{key: /\[multiid\]/gi, val: 'id'},
			{key: /\[multiparams\]/gi, val: o.renderMultiproductControls},
			{key: /\[favorite\]/gi, val: o.setFavorite}
		],
			messageBlock, messagePlace, $message, messageIsHide
		;
		
		messagePlace = $('.message-place');
		messageBlock = messagePlace.find('.padding-top-bottom.layout').first();
		if (!messageBlock[0] && messagePlace[0]) {
			messagePlace.append('<section class="padding-top-bottom layout" style="display:none;"><div class="bg-success"></div></section>');
			messageBlock = messagePlace.find('.padding-top-bottom.layout').first();
		}
		$message = messageBlock.find('.bg-success');
		messageIsHide = (messageBlock.css('display') == 'none');
		messageBlock.hide();
		Flipcat.ShopCatNavigator.currency = currency;
		if (!o.isAppendRequest && !data.length) {
			$message.text(__('messages.No_products'));
			messageBlock.show();
			FlipcatWebAppLibrary.render($('#projects-container'), 'article', replace, data, !o.isAppendRequest);
			return;
		}
		if (o.isAppendRequest && !data.length && !messageIsHide) {
			$message.text(__('messages.No_products'));
			messageBlock.show();
			return;
		}
		FlipcatWebAppLibrary.render($('#projects-container'), 'article', replace, data, !o.isAppendRequest);
		o.isAppendRequest = false;
		o.initCartLink();
		o.setOnShopItemPopupListener();
		o.setActiveLink();
		Flipcat.Desktop.setProductTitlesFontSize();
		//Flipcat.MultiproductManager.safeParamId = true;
		Flipcat.MultiproductManager.init();
	},
	/**
	 * @description Устанавливает класс активной ссылки в левом меню
	*/
	setActiveLink:function() {
		var o = this, links, url = FlipcatWebAppLibrary.REQUEST_URI(1), css = o.HTML_ACTIVE_LINK_CSS.replace('.', '');
		$(o.HTML_ACTIVE_LINK_CSS).removeClass(css);
		links = $(o.HTML_SHOP_CATEGORIES_CSS).first().find('a');

		links.each(function(i, j){
			if (url == $(j).attr('href')) {
				$(j).addClass(css);
			}
		});
	},
	onFailLoadData:function(s) {
		var o = Flipcat.ShopCatNavigator;
		$(o.HTML_PRODUCTS_BOTTOM_LOADER_ID).addClass('hide');
		FlipcatWebAppLibrary.unlock('.desktop-right-col');
		if (s) {
			o.messageFail(s);
		} else {
			o.messageFail(__('Unierror'));
		}
	},
	/**
	 * @description обертка вокруг _get кеширующая данные в оперативной памяти
	*/
	getUrl:function(onLoadData, url, onFailLoadData) {
		FlipcatWebAppLibrary.lock('.desktop-right-col');
		var o = this;
		o.requestSended = true;
		o.lastRequest = url;

		if (o.categoriesProducts[url]) {
			onLoadData(o.categoriesProducts[url]);
			return;
		}
		o._get(onLoadData, url, onFailLoadData);
	},
	/**
	 * @description Сбрасывает значения ссылок сортировки товаров по умолчанию, меняет ее базовый url
	 * @param {String} baseUrl
	*/
	setSortLinks:function(baseUrl) {
		var o = Flipcat.ShopCatNavigator, Lib = FlipcatWebAppLibrary, a, s, c = 'CMD_UNSET';
		$(o.HTML_PRODUCT_SORT_BLOCK_ID).removeClass('hide');
		$(o.HTML_PRODUCT_SORT_CSS).each(function(i, j){
			j = $(j);
			a = j.attr('href').split('?');
			s =  baseUrl + '?' + a[1];
			s = Lib.setGetVar(s, 'desc', c);
			j.attr('href', s);
			j.parent().find('span').removeClass(o.HTML_PRODUCT_SORT_UP_ARROW_CSS);
			if (i = 0) {
				j.attr('title', __('messages.Sort_asc_price_hint'));
			}
			if (i = 1) {
				j.attr('title', __('messages.Sort_asc_name_hint'));
			}
		});
	},
	setFavorite:function(item, favorite) {
		var s;
		if (item.favorite) {
			s = '<a href="/removeFavorite" class="project-favorite favorite-remove" data-id="'+item.id+'">';
			s += '<i class="fa fa-2x fa-star" aria-hidden="true"></i>';
		} else {
			s = '<a href="/addFavorite" class="project-favorite favorite-add" data-id="'+item.id+'">';
			s += '<i class="fa fa-2x fa-star-o" aria-hidden="true"></i>';
		}

		s += '</a>';

		return s;
	},
	onNeedMoreItems:function() {
		var o = Flipcat.ShopCatNavigator, url,
			//page = +FlipcatWebAppLibrary._GET('page', 0),
			text = FlipcatWebAppLibrary._GET('text');
		if (o.isFavoriteProductPage) {
			return;
		}
		/*if (!page) {
			page = o.onNeedMoreItems.page ? o.onNeedMoreItems.page : 1;
		}*/
		var page = Flipcat.Orders.currentPage;
		url = FlipcatWebAppLibrary.REQUEST_URI(true) + '.json?page=' + page;
		if (text) {
			url += '&text=' + text;
		}
		if (o.onNeedMoreItems.requestSend) {
			return;
		}
		if (o.requestSended) {
			return;
		}
		var limit = parseInt(o.onNeedMoreItems.limit, 10),
			total = parseInt(o.onNeedMoreItems.total, 10);
		
		o.onNeedMoreItems.requestSend = true;
		o.isAppendRequest = true;
		FlipcatWebAppLibrary.lock('.desktop-right-col');
		$(o.HTML_PRODUCTS_BOTTOM_LOADER_ID).removeClass('hide');
		o.getUrl(o.onLoadData, url, o.onFailLoadData);
	},
	/***
	 * @description Устанавливает активной вкладку Новости, если передан #news в url
	*/
	setNewsBookmarkActive:function() {
		if (window.location.hash == '#news') {
			var m = $(this.HTML_NEWS_BM_ID)[0];
			if (m) {
				this.onClickBookmark.apply(m, [{target:m}]);
			}
		}
	}
};
window.Flipcat.ShopCatNavigator = ShopCatNavigator;
