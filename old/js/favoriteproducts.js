'use strict'
/** @class Cписок избранных продуктов при нажатии на кнопку Избранное*/
window.Flipcat = window.Flipcat || {};

var ShopFavorite = {
	/** @property {String} id списка категорий в левом меню*/
	HTML_SHOP_CATEGORIES_CSS : '.left-shop-categories',
	
	/** @property {String} id списка категорий в мобильном*/
	HTML_SHOP_CATEGORIES_MOBILE_ID : '#shopcategories',

	/** @property {String} класс активной ссылки в левом меню */
	HTML_ACTIVE_LINK_CSS : '.left-menu-active-link',

	/** @property {String} класс - признак ссылки сортировки в блоке сортировки товаров*/
	HTML_PRODUCT_SORT_CSS : '.product-sort-link',

	/** @property {String} id блока товаров*/
	HTML_PRODUCT_BLOCK_CSS : '#products',

	/** @property {String} */
	HTML_PRODUCT_SORT_BLOCK_ID : '#sortProductsBlock',
	
	/** @property {String} */
	HTML_PRODUCT_SORT_UP_ARROW_CSS : 'arrow_down_mirror',
	
	/** @property {Boolean} HISTORY_API false || true */
	HISTORY_API :!!(window.history && window.history.pushState),
	
	/** @property {Object} Данные категорий магазина */
	categoriesProducts : {},

	/** @property {String} id кнопки Избранное*/
	HTML_SHOP_FAVORITE_CSS : '#favorite-products',

	/** @property {String} href кнопки Избранное в личном кабинете*/
	HTML_SHOP_PROFILE_FAVORITE_CSS : '#favorite_product',

	/** @property {String} id кнопки Избранное*/
	HTML_SHOP_COUNT_FAVORITE_CSS : '#favorite-count',

	/** @property {String} id блока Избранное*/
	HTML_SHOP_SECTION_FAVORITE_CSS : '#favorite-section',

	/** @property {String} класс - ссылка добавления товар в избранное*/
	HTML_SHOP_ADD_TO_FAVORITE_CSS : '.favorite-add',

	/** @property {String} класс - ссылка удаления товара из избранного*/
	HTML_SHOP_REMOVE_FROM_FAVORITE_CSS : '.favorite-remove',
	
	/** @property {String} Стиль css-иконки добавления в избранное*/
	HTML_FAVORITE_PRODUCT_SIGN_FAVORITE :  '.fa-star',
	
	/** @property {String} Стиль css-иконки удаления из избранного*/
	HTML_FAVORITE_PRODUCT_SIGN_UNFAVORITE :  '.fa-star-o',
	
	/**
	 * 
	*/
	init:function(functions) {
		this.lib = window.FlipcatWebAppLibrary;
		this._get = functions._get;
		this.messageFail = functions.messageFail;
		this.initCartLink = functions.initCartLink;
		this.setOnShopItemPopupListener = functions.setOnShopItemPopupListener;

		if ( $(this.HTML_SHOP_FAVORITE_CSS) ) {
			this.block = $(this.HTML_SHOP_FAVORITE_CSS);
			this.setListeners();
		}
	},
	setListeners:function() {
		var o = this;
		if (o.HISTORY_API) {
			o.block.click(function () {
				ShopFavorite.onClick($(this));
				return false;
			});

			$(o.HTML_PRODUCT_BLOCK_CSS).on("click",o.HTML_SHOP_ADD_TO_FAVORITE_CSS, function(){
				ShopFavorite.addToFavorite($(this));
				return false;
			});
			$(o.HTML_PRODUCT_BLOCK_CSS).on("click",o.HTML_SHOP_REMOVE_FROM_FAVORITE_CSS, function(){
				ShopFavorite.removeFromFavorite($(this));
				return false;
			});

		}
	},

	/**
	 * @description Клик на ссылке - Избранное
	 * @param {$Object} link
	*/
	onClick:function(link) {
		var am = $.cookie(Flipcat.AuthMarker.COOKIE_NAME);
		var o = this, h = link.attr('href');

		if (h == o.HTML_SHOP_PROFILE_FAVORITE_CSS) {
			h = '/getFavorite';
		}
		h = h + '/' + am;
		if ( h == '#' ) {
			return;
		}
		Flipcat.ShopCatNavigator.isFavoriteProductPage = true;
		o.getUrl(o.onLoadData, h + '.json', o.onFailLoadData);
	},

	/**
	 * @description Клик на ссылке - Добавить в избранное
	 * @param {$Object} link
	 */
	addToFavorite:function(link) {
		var am = $.cookie(Flipcat.AuthMarker.COOKIE_NAME);
		var id = link.data('id');
		var o = this, h = link.attr('href') + '/' + am + '/' + id;

		FlipcatWebAppLibrary.lock(o.HTML_SHOP_ADD_TO_FAVORITE_CSS);

		o._get(o.onAdded, h, o.onFailAdded);
	},

	/**
	 * @description Клик на ссылке - Удалить из избранного
	 * @param {$Object} link
	 */
	removeFromFavorite:function(link) {
		var am = $.cookie(Flipcat.AuthMarker.COOKIE_NAME);
		var id = link.data('id');
		var o = this, h = link.attr('href') + '/' + am + '/' + id;

		FlipcatWebAppLibrary.lock(o.HTML_SHOP_REMOVE_FROM_FAVORITE_CSS);

		o._get(o.onRemove, h, o.onFailRemove);
	},

	/**
	 * @description Клик на ссылке - Избранное
	 * @param {Object} data
	*/
	onLoadData:function(data) {
		var o = Flipcat.ShopFavorite;
		if (data.errorMessage || data.remoteErrorInfo) {
			o.onFailLoadData(data.errorMessage + ( data.remoteErrorInfo ? data.remoteErrorInfo : '' ) );
			return;
		}
		FlipcatWebAppLibrary.unlock('.desktop-right-col');
		o.renderProducts(data.list);
		if (data.breadCrumbs) {
			Flipcat.ShopCatNavigator.renderBreadCrumbs(data.breadCrumbs);
		}
		o.mobileAction();
	},

	/**
	 * @description Клик на ссылке - Добавить в избранное
	 * @param {Object} data
	 */
	onAdded:function(data) {
		var o = Flipcat.ShopFavorite;
		var id = data.id;
		var link = $(o.HTML_PRODUCT_BLOCK_CSS).find("[data-id='" + id + "']");
		FlipcatWebAppLibrary.unlock(o.HTML_SHOP_ADD_TO_FAVORITE_CSS);
		link.attr('href', '/removeFavorite');
		//link.find('img').attr('src', '/img/in_favorite.png');
		link.removeClass('favorite-add').addClass('favorite-remove');
		link.find('i').first().removeClass(o.HTML_FAVORITE_PRODUCT_SIGN_UNFAVORITE.replace('.', ''))
			.addClass( o.HTML_FAVORITE_PRODUCT_SIGN_FAVORITE.replace('.', '') );
		var count = parseInt($(o.HTML_SHOP_COUNT_FAVORITE_CSS).text()) + 1;
		$(o.HTML_SHOP_COUNT_FAVORITE_CSS).html(count);
		if (count > 0) {
			$(o.HTML_SHOP_SECTION_FAVORITE_CSS).removeClass('hide');
		}

	},

	onFailAdded:function(s) {
		o.messageFail(__('messages.Fail_add_to_fav'));
	},

	/**
	 * @description Клик на ссылке - Добавить в избранное
	 * @param {Object} data
	 */
	onRemove:function(data) {
		var o = Flipcat.ShopFavorite;
		var id = data.id;
		var link = $(o.HTML_PRODUCT_BLOCK_CSS).find("[data-id='" + id + "']");
		FlipcatWebAppLibrary.unlock(o.HTML_SHOP_REMOVE_FROM_FAVORITE_CSS);
		link.attr('href', '/addFavorite');
		//link.find('img').attr('src', '/img/add_favorite.png');
		link.find('i').first().removeClass(o.HTML_FAVORITE_PRODUCT_SIGN_FAVORITE.replace('.', ''))
			.addClass( o.HTML_FAVORITE_PRODUCT_SIGN_UNFAVORITE.replace('.', '') );
		link.removeClass('favorite-remove').addClass('favorite-add');
		var count = parseInt($(o.HTML_SHOP_COUNT_FAVORITE_CSS).text()) - 1;
		$(o.HTML_SHOP_COUNT_FAVORITE_CSS).html(count);
		if (count <= 0) {
			$(o.HTML_SHOP_SECTION_FAVORITE_CSS).addClass('hide');
		}

	},

	onFailRemove:function(s) {
		o.messageFail(__('messages.Fail_remove_from_fav'));
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
		if (currencies[item.currency]) {
			s += ' ' + currencies[item.currency];
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
		sMergeParams = Flipcat.ShopFavorite.renderMergeParams(item.merge_params);
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
			s = s.replace('[options]', Flipcat.ShopFavorite.renderMultiproductParamOptions(list[i].values));
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
	renderProducts:function(data) {
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
		];
		FlipcatWebAppLibrary.render($('#projects-container'), 'article', replace, data);
		o.initCartLink();
		o.setOnShopItemPopupListener();
		o.setActiveLink();
		Flipcat.Desktop.setProductTitlesFontSize();
		//Flipcat.MultiproductManager.safeParamId = true;
		Flipcat.MultiproductManager.init();
	},

	setFavorite:function(item) {
		var s;
		s = '<a href="/removeFavorite" class="project-favorite favorite-remove" data-id="'+item.id+'">';
		s += '<i class="fa fa-2x fa-star" aria-hidden="true"></i>';
		s += '</a>';

		return s;
	},
	/**
	 * @description Устанавливает класс активной ссылки в левом меню
	*/
	setActiveLink:function() {
		var o = this, css = o.HTML_ACTIVE_LINK_CSS.replace('.', '');
		$(o.HTML_ACTIVE_LINK_CSS).removeClass(css);
		$(o.HTML_SHOP_FAVORITE_CSS).addClass(css);

		$('#profileSection').find('.in').removeClass('in');
		$('#profileSection').find('.active').removeClass('active');

		$('#profileSection').find(o.HTML_SHOP_FAVORITE_CSS).removeClass(css);
		$('#profileSection').find('#favorite_product').addClass('in');
		$('#profileSection').find('#favorite_product').addClass('active');
		$('#profileSection').find('#favorite-products').closest('li').addClass('active');
	},
	onFailLoadData:function(s) {
		FlipcatWebAppLibrary.unlock('.desktop-right-col');
		var o = Flipcat.ShopFavorite;
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
		o.lastRequest = url;

		o._get(onLoadData, url, onFailLoadData);
	},
	
	/**
	 * @description Дополнительные действия при загрузке избранных товаров для мобильной версии сайта
	*/
	mobileAction:function(){
		if (Flipcat.Desktop.isMobile()) {
			var o = this, s;
			$(o.HTML_PRODUCT_BLOCK_CSS).removeClass('hidden-xs');
			$(o.HTML_SHOP_CATEGORIES_MOBILE_ID).addClass('hide');
			$(o.HTML_SHOP_SECTION_FAVORITE_CSS).addClass('hide');
			if (o.HISTORY_API) {
				s = window.location.href.replace(window.location.hash, '');
				history.pushState(null, null, window.location.href);
			}
		} else {
			o = Flipcat.ShopCatNavigator;
			var bmCatalog = $(o.HTML_CATALOG_BM_ID)[0]
			if (bmCatalog) {
				o.onClickBookmark({target:bmCatalog});
			}
		}
	}
};
window.Flipcat.ShopFavorite = ShopFavorite;
