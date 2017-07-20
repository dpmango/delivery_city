/** @class Избранное  - магазины*/
window.Flipcat = window.Flipcat || {};
/**
 * @object Управление меткой авторизации
*/
var Favorites = {
	/** @property {String} favorites block */
	HTML_FAVORITES_ID : '#favorites',
	
	/** @property {String} add shop to favorites */
	HTML_ADD_SHOP_TO_FAV_CSS : '.add-shop-to-fav',
	
	/** @property {String} remove shop from favorites */
	HTML_REMOVE_SHOP_TO_FAV_CSS : '.rem',
	
	/** @property {String} id блок с избранными магазинами */
	HTML_MAIN_PAGE_FAV_SHOPS_CONTAINER_ID : '#favoritesShopMainplace',
	
	HTML_MAIN_PAGE_FAV_SHOP_ITEM_CSS      : '.favorite_shop_item',
	
	/** @property {String} css блока с магазином на странице /favorite */
	HTML_FAVORITE_PAGE_SHOP_ITEM_CSS      : '.flipcat-item',
	
	/** @property {String} HTML_FAVORITE_PAGE_EMPTY_LIST_MSG_ID id блока с сообщением о том, что нет избранных магазинов  на странице /favorite */
	HTML_FAVORITE_PAGE_EMPTY_LIST_MSG_ID  : '#favoritesIsEmpty',
	
	/** @property {String}   css Признак ссылки добавляющей магазин в избранное в шапке магазина */
	HTML_FAVORITE_SHOP_IN_TOP_BLOCK_CSS  : '.add-to-favorite-top-shop',
	
	/** @property {String}   css Признак ссылки добавляющей магазин в избранное в шапке магазина */
	HTML_AGREGATE_CATEGORY_INP_ID  : '#agregateCategoryId',
	
	
	
	
	
	/**
	 *@param {Object} 
	*/
	init:function(lib) {
		this.lib = lib;
		this.setListeners();
		this.fillMainPageFavShopsLine();
	},
	setListeners:function() {
		this.setAddShopLinks();
		this.setRemoveShopLinks();
	},
	setRemoveShopLinks:function() {
		var o = this;
		$(this.HTML_REMOVE_SHOP_TO_FAV_CSS).bind('click', o.onRemoveShopFromFavClick);
	},
	setAddShopLinks:function() {
		var o = this;
		$(o.HTML_ADD_SHOP_TO_FAV_CSS).bind('click', o.onAddShopToFavClick);
	},
	onAddShopToFavClick:function() {
		var o = Flipcat.Favorites, _post = o.lib._post;
		Flipcat.AuthMarker.restoreMarker();
		_post({id:$(this).data('id'), agregateCategoryId : $(o.HTML_AGREGATE_CATEGORY_INP_ID).val()}, o.onAddShop, '/c/aa', o.onFailAddShop);
		return false;
	},
	onRemoveShopFromFavClick:function() {
		var o = Flipcat.Favorites, _post = o.lib._post;
		Flipcat.AuthMarker.restoreMarker();
		_post({id:$(this).data('id')}, o.onRemShop, '/c/ab', o.onFailAddShop);
		return false;
	},
	/**
	 * @description 
	*/
	onRemShop: function(data) {
		if (localStorage) {
			if (!localStorage.getItem(Flipcat.AuthMarker.STORAGE_MARKER_KEY)) {
				localStorage.setItem(Flipcat.AuthMarker.STORAGE_MARKER_KEY, $.cookie('am'));
			} else {
				var marker = localStorage.getItem(Flipcat.AuthMarker.STORAGE_MARKER_KEY)
				$.cookie(Flipcat.AuthMarker.COOKIE_NAME, marker, {expires:Flipcat.AuthMarker.expires, path: '/'});
			}
		}
		Flipcat.Favorites.onSuccess(data);
		Flipcat.Favorites.removeShopOnFavoritesPage(data);
	},
	/**
	 * @description 
	*/
	onAddShop: function(data) {
		if (data.needAuth) {
			Flipcat.Favorites.lib.messageSuccess(__('messages.Authentication_required'));
			$(Flipcat.WebClientAuth.HTML_LOGIN_MODAL_ID).modal('show');
			$.cookie('ar', window.location.href, {expires:this.expires, path: '/'});
			return;
		}
		Flipcat.AuthMarker.storeMarker();
		Flipcat.Favorites.onSuccess(data);
	},
	/**
	 * @description 
	*/
	onFailAddShop: function(data) {
	},
	/**
	 * @description Отрисовка избранных магазинов
	*/
	onSuccess: function(data) {
		var self = Flipcat.Favorites, id = self.HTML_FAVORITES_ID, tpl,
		tplCss, i, s, o, j, link, $node;
		if (data.errorInfo) {
			return self.onError(data.errorInfo);
		}
		if (data.registredClasses) {
			data = Flipcat.AuthMarker.getFromRegistredData(data, 'Favorites');
			if (!data) {
				return;
			}
		}
		$(id + ' ul li').each(function(i, j){
			if (!$(j).hasClass('tpl')) {
				$(j).remove();
			} else {
				tpl = $(j).html();
				tplCss = $(j).attr('class').replace('tpl', '').replace('hide', '');
			}
		});
		j = 0;
		if (tpl) {
			for (i in data) {
				o = data[i];
				link = o.cat_id ? ('/b/' + o.sid + '/' + o.cat_id + '/' + o.id) : ('/b/' + o.sid + '/' + FlipcatWebAppLibrary.REQUEST_URI(1).split('/')[2] + '/' + o.id);
				s = tpl.replace('[ID]', o.sid).replace(/\[LINK\]/gi, link)
					.replace('[TITLE]', o.company_name);
				if (o.logotype_thumbnail) {
					s = s.replace(/data\-src="src"/m, 'src="' + o.logotype_thumbnail + '"');
				}
				$node = $('<li class="' + tplCss + '">' + s + '</li>');
				$node = FlipcatWebAppLibrary.processTemplateLinks($node);
				$(id + ' ul').append($node);
				j++;
			}
		}
		if (j) {
			self.setRemoveShopLinks();
			$(id).removeClass('hide');
			$(id).parents('section').first().removeClass('hide');
		} else {
			$(id).addClass('hide');
			$(id).parents('section').first().addClass('hide');
		}
		self.setShopHeaderFavoriteLink(data);
	},
	onError: function(errorInfo, sourceResponse) {
		if (errorInfo.messages) {
			Flipcat.Favorites.lib.messageFail(errorInfo.messages.join('\n'));
		}
	},
	/**
	 * @description Установка вертикльаной полосы прокрутки для мобильного дизайна
	 * @param {Number} on if 0 vertical scroll bar remove, if 1 scroll bar set
	*/
	scrollY: function(on) {
		var ul = $(this.HTML_FAVORITES_ID + ' ul.fav-list'), top = parseInt($(this.HTML_FAVORITES_ID).parent().css('top')),
			height;
		ul.css('max-height', 'auto').css('overflow-y', 'auto');
		if (on) {
			height = $(window).height() > screen.height ? screen.height : $(window).height();
			ul.css('max-height', (height - top - 10) + 'px').css('overflow-y', 'scroll');
		}
	},
	/**
	 * @description Добавляет Пустые клетки  в блок Избранных Магазинов на главной
	*/
	fillMainPageFavShopsLine:function() {
		var o = Flipcat.Favorites,
			cont = $(o.HTML_MAIN_PAGE_FAV_SHOPS_CONTAINER_ID),
			tpl = cont.find('.tpl').first().html(),
			i = 0;
		while (o._oneLineInFavoriteShops(cont)) {
			cont.append($(tpl));
			i++;
			if (i > 7) {
				break;
			}
		}
		if (i) {
			cont.find(o.HTML_MAIN_PAGE_FAV_SHOP_ITEM_CSS).last().parent().remove();
		}
	},
	/**
	 * @description Добавляет пустые клетки  в блок Избранных Магазинов на главной
	 * @param {jQueryObject} cont контейнер с избранными ресторанами и мангзинами на главной
	*/
	_oneLineInFavoriteShops:function(cont) {
		var o = this, firstTopOffset = 0, r = true, counter = 0;
		cont.find(o.HTML_MAIN_PAGE_FAV_SHOP_ITEM_CSS).each(function(i, j){
			if (!firstTopOffset) {
				firstTopOffset = $(j).parent()[0].offsetTop;
			}
			if ($(j).parent()[0].offsetTop > firstTopOffset) {
				r = false;
			}
			counter++;
		});
		if (counter > 7) {
			return false;
		}
		return r;
	},
	/**
	 * @description 
	 * @param {Object} data
	*/
	removeShopOnFavoritesPage:function(data) {
		var o = this, map, i,
			url = FlipcatWebAppLibrary.REQUEST_URI(true);
		if (url != '/favorites') {
			return;
		}
		map = FlipcatWebAppLibrary.indexBy(data);
		$(o.HTML_FAVORITE_PAGE_SHOP_ITEM_CSS).each(function(i, j){
			i = j.id.replace('shop', '');
			if (!map[i]) {
				$(j).remove();
			}
		});
		if ($(o.HTML_FAVORITE_PAGE_SHOP_ITEM_CSS).length == 0) {
			$(o.HTML_FAVORITE_PAGE_EMPTY_LIST_MSG_ID).removeClass('hide');
		}
	},
	/**
	 * @description Установить вид кнопки "Добавить в избранное" в шапке магазина на странице магазина
	 * @param {Object} data
	*/
	setShopHeaderFavoriteLink:function(data){
		var o = Flipcat.Favorites,
			isRemoveFromFavButtonCss = o.HTML_REMOVE_SHOP_TO_FAV_CSS.replace('.', ''),
			isAddToFavButtonCss = o.HTML_ADD_SHOP_TO_FAV_CSS.replace('.', '');
		$(o.HTML_FAVORITE_SHOP_IN_TOP_BLOCK_CSS).each(function(i, j){
			j = $(j);
			j.unbind('click', o.onAddShopToFavClick);
			j.unbind('click', o.onRemoveShopFromFavClick);
			if (j.hasClass(isRemoveFromFavButtonCss)) {
				j.removeClass(isRemoveFromFavButtonCss);
				j.addClass(isAddToFavButtonCss);
				j.bind('click', o.onAddShopToFavClick);
				if (j.find('i.fa')[0]) {
					j.find('i.fa').removeClass('fa-star');
					j.find('i.fa').addClass('fa-star-o');
				} else {
					j.text(__('messages.Add_to_fav'));
				}
			}else {
				j.addClass(isRemoveFromFavButtonCss);
				j.removeClass(isAddToFavButtonCss);
				j.bind('click', o.onRemoveShopFromFavClick);
				if (j.find('i.fa')[0]) {
					j.find('i.fa').addClass('fa-star');
					j.find('i.fa').removeClass('fa-star-o');
				} else {
					j.text(__('messages.Delete_from_fav_long'));
				}
			}
		});
	}
};
window.Flipcat.Favorites = Favorites;
