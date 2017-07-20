'use strict'
/** @class Избранное  - магазины*/
window.Flipcat = window.Flipcat || {};
/**
 * @object Управление фильтрацией и пагинацией магазинов
*/
var ShopList = {
	/** @property {String} shops html block id */
	HTML_SHOP_LIST_ID : '#shops',
	
	/** @property {String} shops pagination html block id */
	HTML_SHOP_PAGINATION_ID : '#shopPaging',
	
	/** @property {Boolean} HISTORY_API false || true */
	HISTORY_API :!!(window.history && window.history.pushState),
	
	/** @property {String} HTML_CUISINE_FORM_FILTERS_BLOCK_ID */
	HTML_CUISINE_FORM_FILTERS_BLOCK_ID : '#cuisineFilters',
	
	/** @property {String} HTML_CUISINE_MOBILE_FORM_FILTERS_BLOCK_ID */
	HTML_CUISINE_MOBILE_FORM_FILTERS_BLOCK_ID : '#mCuisineFilters',
	
	/** @property {String} HTML_CUISINE_FORM_SEND_BUTTON_ID */
	HTML_CUISINE_FORM_SEND_BUTTON_ID : '#cuisineSendButton',
	
	/** @property {String} HTML_SORT_VARIANTS_SHOW_ID */
	HTML_SORT_VARIANTS_SHOW_ID : '#displaySortLink',
	
	/** @property {String} HTML_SORT_VARIANTS_BLOCK_ID */
	HTML_SORT_VARIANTS_BLOCK_ID : '#shopSortPopup',
	
	/** @property {String} HTML_DELIVERY_OBJECTS_DATA_ID id инпута с данными о магазинах или ресторанах для которых задан тип Доставка */
	HTML_DELIVERY_OBJECTS_DATA_ID          : '#catalogDelivery',
	
	/** @property {String} HTML_DELIVERY_OBJECTS_COUNT_INP_ID id инпута с количеством магазинов или ресторанов для которых задан тип Доставка */
	HTML_DELIVERY_OBJECTS_COUNT_INP_ID : '#catalogDeliveryCount',
	
	/** @property {String} HTML_PICKUP_OBJECTS_DATA_ID id инпута с данными о магазинах или ресторанах для которых задан тип Самовывоз */
	HTML_PICKUP_OBJECTS_DATA_ID              :  '#catalogPickup',
	
	/** @property {String} HTML_PICKUP_OBJECTS_DATA_ID id инпута с количеством магазинов или ресторанов для которых задан тип Самовывоз */
	HTML_PICKUP_OBJECTS_COUNT_INP_ID     : '#catalogPickupCount',
	
	/** @property {String} HTML_INPUT_DEFAULT_SORT_VALUE_ID */
	HTML_INPUT_DEFAULT_SORT_VALUE_ID : '#defaultSort',
	
	/** @property {String} HTML_SHIPPING_TYPE_ACTIVE_CSS селектор метки выбранного типа доставки */
	HTML_SHIPPING_TYPE_ACTIVE_CSS     : '.choose-shipping-active',

	/** @property {String} HTML_IS_SHOPS_PAGE_INP_ID */
	HTML_IS_SHOPS_PAGE_INP_ID : '#isShopsPage',
	
	/** @property {String} HTML_IS_HFU_ENABLED_INP_ID */
	HTML_IS_HFU_ENABLED_INP_ID : '#isHfuEnabled',
	
	/** @property этот класс существует у  HTML_LEFT_SIDEBAR_ID когда на странице есть список магазинов*/
	HTML_SHOP_LIST_SIDEBAR_PADDING_CSS : '.shops-sidebar-padding',

	/** @property идентификатор сайдбара в левой (или правой) колонке */
	HTML_SIDEBAR_ID : '#vspacer',
	
	/** @property array shopOptionsOrderTitles порядок вывода свойств магазина */
	shopOptionsOrderTitles : ['messages.Min_order', 'messages.Delivery', 'messages.Delivery_time', 'messages.Time_work', 'messages.Distance'],
	
	/** @property array shopOptionsOrderIcons порядок вывода иконок свойств магазина */
	shopOptionsOrderIcons : ['sprite-ico-stack', 'sprite-ico-rocket-w', 'sprite sprite-ico-timer-2', 'sprite sprite-ico-timer-2', ''],
	
	/** @property {String} allCuisinesId Идентификатор фильтра "Все" */
	allCuisinesId : '#cuisineSendButton',
	
	/** @property {String} Сортировка по популярности */
	SORT_BY_POPULAR : 'popular',
	
	/** @property {String} Сортировка по времени доставки */
	SORT_BY_TIME_DELIVERY : 'timeDelivery',
	
	/** @property {String} Сортировка по удаленности от локации покупателя */
	SORT_BY_DISTANCE : 'distance',
	
	/** @property {String} Сортировка по стоимости доставки */
	SORT_BY_PRICE_DELIVERY : 'priceDelivery',
	
	/** @property {String} Сортировка по минимальной сумме заказа */
	SORT_BY_MIN_ORDER : 'minOrder',


	/** @property {String} HTML_MOBILE_SORT_VARIANTS_LABEL_CSS css метки выбора кртерия сортировки в мобильной версии */
	HTML_MOBILE_SORT_VARIANTS_LABEL_CSS : '.mSortItem',
	
	/** @property {String} HTML_MOBILE_SORT_FORM_ID id формы с фильтрами по кухням для мобильной версии */
	HTML_MOBILE_SORT_FORM_ID : '#mobileCuisinesFilter',

	/** @property {String} HTML_MOBILE_SORT_FORM_ID id инпута с текущей категорией */
	HTML_CURRENT_CATEGORY_INP_ID : '#currentCategoryId',
	
	/** @property {String} HTML_INFOMESSAGE_PLACE_CSS селектор блока, в котром должен показываться блок с сообщением Нет магазинов */
	HTML_INFOMESSAGE_PLACE_CSS : '.message-place',
	//HTML_INFOMESSAGE_PLACE_CSS : '.padding-top-bottom.layout',
	
	/** @property {String} HTML_INFOMESSAGE_CSS селектор блока, в котром содержится сообщение Нет магазинов */
	HTML_INFOMESSAGE_CSS : '.bg-success',

	
	
	/** @property {String} sortCriteria текущее значение сортировки */
	/** @property {Number} perPage (сколько магазинов показывать на странице) */
	/** @property {Object} data {catalogs:[], total_count:int} */
	
	
	
	
	/**
	 *@param {Object} 
	*/
	init:function(lib) {
		this.lib = lib;
		if ( this.isShopPage() === true ) {
			this.setListeners();
		}
	},
	/**
	 * @description в случае успеха инициализирует this.data, this.perpage
	 * @return {Boolean} true если это страница списка магазинов
	*/
	isShopPage:function() {
		var data, o = this;
		if ($(o.HTML_IS_SHOPS_PAGE_INP_ID).val() == 1) {
			data = $(this.HTML_SHOP_LIST_ID + ' textarea').first().text();
			try {
				data = JSON.parse(data);
				this.data = data;
			}catch(e){
				console.log(e.message);
			}
			this.perPage = $('#perPage').val();
			if (this.perPage) {
				return true;
			}
		}
	},
	setListeners:function() {
		var o = this;
		$(o.HTML_SHOP_PAGINATION_ID + ' a').click(o.onPageClick);
		$(window).bind('popstate', function() {
			o.onHistoryPopState();
		});
		o.initFormFilter();
		o.initSortForm();
		o.initChooseSeliveryTypeForm();
		$(o.HTML_MOBILE_SORT_FORM_ID).bind('submit', function(e){e.preventDefault();});
	},
	/**
	 * @description 
	*/
	initFormFilter:function() {
		$(this.HTML_CUISINE_FORM_SEND_BUTTON_ID).addClass('hide');
		$(this.HTML_CUISINE_FORM_FILTERS_BLOCK_ID + ' input[type=checkbox]').change(this.onChangeCuisine);
		$(this.HTML_CUISINE_MOBILE_FORM_FILTERS_BLOCK_ID + ' input[type=checkbox]').change(this.onChangeCuisine);
	},
	onChangeCuisine:function(event) {
		var o = window.Flipcat.ShopList, $list,
			list = [], url, c = 0, filter, firstItem, isMobile, cid;
		$list = $(o.HTML_CUISINE_FORM_FILTERS_BLOCK_ID + ' input[type=checkbox]');
		if ('#' + $(event.target).parent().attr('id') == o.HTML_CUISINE_MOBILE_FORM_FILTERS_BLOCK_ID) {
			$list = $(o.HTML_CUISINE_MOBILE_FORM_FILTERS_BLOCK_ID + ' input[type=checkbox]');
			isMobile = true;
		}
		$list.each(function(i, j){
			if (i == 0) {
				o.allCuisinesId = j.id;
				firstItem = j;
			} else if (j.checked) {
				cid = j.id;
				if (isMobile) {
					cid = cid.replace(/^m/, '');
				}
				list.push('cuisine[]=' + cid);
				c++;
			}
		});
		if (this.id == firstItem.id) {
			$list.prop('checked', false);
			c = 0;
		}
		url = FlipcatWebAppLibrary.REQUEST_URI(1);
		if (c) {
			url = url + '?' + list.join('&');
			if (window.FlipcatWebAppLibrary._GET('limit', 0)) {
				url += '&limit=' + window.FlipcatWebAppLibrary._GET('limit');
			}
			$(firstItem).prop('checked', false);
		} else {
			if (window.FlipcatWebAppLibrary._GET('limit', 0)) {
				url += '?limit=' + window.FlipcatWebAppLibrary._GET('limit');
			}
			$(firstItem).prop('checked', true);
		}
		history.pushState(null, null, url);
		filter = new ShopsFilter(new Request(), o.data.catalogs, window.FlipcatWebAppLibrary._GET('limit', o.perPage));
		//TODO first page link
		o.renderShops(filter.filter(), null, filter);
	},
	onHistoryPopState:function() {
		if ( new Date().getTime() - window.loadTime  < 800) {//fix safari popstate event
			return;
		}
		var o = window.Flipcat.ShopList;
		if ( o.isShopPage() === true ) {
			var filter, items, request = new Request(), page;
			page = o.getPageNumber(window.location.href);
			if (o.HISTORY_API && o.data) {
				filter = new ShopsFilter(request, o.data.catalogs, o.perPage);
				items = filter.filter();
				o.renderShops(items, null, filter);
			}
		}
	},
	onPageClick:function() {
		var o = window.Flipcat.ShopList, link = this, filter, items, request = new Request();
		if (o.HISTORY_API) {
			history.pushState(null, null, $(link).attr('href'));
			filter = new ShopsFilter(request, o.data.catalogs, o.perPage);
			items = filter.filter();
			o.renderShops(items, link, filter);
			return false;
		}
	},
	/**
	 * @param {Array}       items данные о магазинах
	 * @param {HtmlElement} link ссылка, по которой был произведен клик
	 * @param {ShopFilter}  filter
	*/
	renderShops: function(items, link, filter) {
		var o = this, hList = $(o.HTML_SHOP_LIST_ID),
			tpl = hList.find('article.tpl').first(), css = tpl.attr('class').replace('tpl', ''),
			html = tpl.html(), i, s, it, page, badReviews,
			currentCategory = FlipcatWebAppLibrary.REQUEST_URI(1).split('/')[2], 
			img, newItem, isHfuEnabled = $(o.HTML_IS_HFU_ENABLED_INP_ID).val(), shoplink;
		
		i = items.length ? 'addClass' : 'removeClass';
		s = o.HTML_SHOP_LIST_SIDEBAR_PADDING_CSS.replace('.', '');
		$(o.HTML_SIDEBAR_ID)[i](s);
		
		hList.find('article').each(function(i, j) {
			if (i > 0) {
				$(j).remove();
			}
		});
		
		for (i = 0; i < items.length; i++) {
			it = items[i];
			if (isHfuEnabled != 'false' && isHfuEnabled != false) {
				if (it.hfu_url) {
					shoplink = it.hfu_url;
				} else {
					shoplink = '/company/' + FlipcatWebAppLibrary.transliteUrl(it.company_name);
				}
			} else {
				shoplink = '/b/' + it.sid + '/' + $(o.HTML_CURRENT_CATEGORY_INP_ID).val() +  '/' + it.id;//TODO const!
			}
			img = it.logotype_thumbnail ? it.logotype_thumbnail : '/img/productListNoImage.png';
			badReviews = it.review_rate > 0 ? (100 - it.review_rate) : 0;
			s = html.replace(/\[shopId\]/gi, it.sid)
				.replace(/\[intShopId\]/gi, it.id)
				.replace(/data\-src="src"/m, 'src="' + img + '"')
				.replace('[companyName]', it.company_name)
				.replace(/\[snippet\]/gi, it.snippet)
				.replace(/\[review_rate\]/gi, it.review_rate)
				.replace(/\[bad_reviews\]/gi, badReviews)
				.replace(/\[LINK\]/gi, shoplink)
				.replace(/\[currentCategory\]/gi, currentCategory);
			newItem = $('<article class="' + css + '">' + s + '</article>');
			newItem = o.setShopOption(newItem, it);
			newItem = FlipcatWebAppLibrary.processTemplateLinks(newItem);
			hList.append(newItem)
		}
		Flipcat.Favorites.setAddShopLinks();
		o.lib.setProgressBarValue();
		if (!link) {
			o.renderPagination(filter);//TODO
			return;
		}
		//TODO этот код скорее всего будет работать и дальше, но проверить надо. Следить за правильностью ссылок
		//Удаляем предыдущий спан
		s = $(link).attr('href');
		page = o.getPageNumber(s);
		var spanPage = $(o.HTML_SHOP_PAGINATION_ID + ' span.linkActive').first().text();
		$(o.HTML_SHOP_PAGINATION_ID + ' span.linkActive').each(function(i, j) {
			if ( !$(j).parent().hasClass('tpl') ) {
				newItem = $(j).parent();
				spanPage = $(j).text();
			}
		});
		$(o.HTML_SHOP_PAGINATION_ID + ' li.tpl').each(function(i, j) {
			if (!$(j).hasClass('active')) {
				tpl = $(j);
			}
		});
		newItem.html('');
		html = tpl.html().replace('[N]', spanPage).replace('[LINK]', s.replace('page=' + page, 'page=' + spanPage));
		it = $(html);
		it = FlipcatWebAppLibrary.processTemplateLinks(it);
		it.click(o.onPageClick);
		newItem.append(it);
		//Заменяем ссылку на спан
		tpl = $(o.HTML_SHOP_PAGINATION_ID + ' li.tpl.active').first();
		html = tpl.html().replace('[N]', page);
		newItem = $(link).parent();
		newItem.html('');
		newItem.append($(html));
	},
	/**
	 * @param {$Object} item элемент магазина
	 * @param {Object} shop данные магазина
	 * @return {$Object} item элемент магазина с заполнеными данными
	*/
	setShopOption:function(item, shop) {
		var HTML_CSS = '.fc-shop-option', tplObject = item.find(HTML_CSS).first(),
			mTplObject = item.find(HTML_CSS)[1],
			mContainer = $(mTplObject).parent(),
			css = tplObject.attr('class'), tpl = tplObject.html(), tag = 'div', container = tplObject.parent(),
			features, i, feature, s, it;
		features = this.prepareShopFeatures(shop);
		item.find(HTML_CSS).each(function(i, j) {
			$(j).remove();
		});
		if (features) {
			this._setShopOption(container, tpl, features, tag, css);
			if (mTplObject) {
				this._setShopOption(mContainer, $(mTplObject).html(), features, tag, css);
			}
		}
		return item;
	},
	/**
	 * @description Вспомогательная функция (см. setShopOption) @see setShopOption
	 * @param {JQuery[HtmlElement]} container контейнер для добавления блоков с описаниями опции магазина
	 * @param {String} tpl шаблон html блока опции ммагазина
	 * @param {Array} features массив объектов с опциями магазина. element =  {value,icon,title}
	 * @param {String} tag имя  тега в который надо завернуть обработанный шаблон
	 * @param {String} css значение атриюута class для тега в который надо завернуть обработанный шаблон
	*/
	_setShopOption:function(container, tpl, features, tag, css) {
		var i, it, s, feature;
		for (i = 0; i < features.length; i++) {
			feature = features[i];
			if (feature) {
				if (feature.title) {
					s = tpl.replace(/\[FeatureOption.value\]/gi, feature.value);
					s = s.replace(/\[FeatureOption.icon\]/gi,    feature.icon);
					s = s.replace(/\[FeatureOption.title\]/gi,   feature.title);
					it = $('<' + tag + ' class="' + css + '">' + s + '</' + tag + '>');
					container.append(it);
				} else {
					it = $('<' + tag + ' class="fc-shop-option-spacer">&nbsp;</' + tag + '>');
					container.append(it);
				}
			}
		}
		container.append($('<div class="clearfix"></div>'));
	},
	/**
	 * @description Рендерит линию пагинации
	 * @param {ShopFilter} filter
	*/
	renderPagination:function(filter) {
		var o = this, lib = window.FlipcatWebAppLibrary,
			page =  lib._GET('page', 1),
			pagData = lib.pagination(page, filter.getTotal(), lib._GET('limit', o.perPage));
			
		var tpl, tplActive, css, cssActive, html, htmlActive, item;
		$(o.HTML_SHOP_PAGINATION_ID + ' li').each(function(i, j) {
			if ($(j).hasClass('tpl')) {
				if ($(j).hasClass('active')) {
					cssActive = $(j).attr('class').replace('tpl', '').replace('active', '');
					tplActive = $(j).html();
				} else {
					css = $(j).attr('class').replace('tpl', '').replace('active', '');
					tpl = $(j).html();
				}
			} else {
				$(j).remove();
			}
		});
		if (pagData.length > 1) {
			var s = window.location.href, sep = '&', link, q, qcss;
			if (s.indexOf('?') == -1) {
				sep = '?'
			}
			if (s.indexOf('page=') == -1) {
				s += sep + 'page=1';
			}
			$(pagData).each(function(i, j) {
				link = decodeURIComponent(s.replace(/page=\d+/, 'page=' + j.n) );
				if (j.active) {
					q = tplActive;
					qcss = cssActive;
				} else {
					q = tpl;
					qcss = css;
				}
				q = q.replace('[LINK]', link). replace('[N]', j.n);
				item = $('<li class="' + qcss + '">' + q + '</li>');
				item = FlipcatWebAppLibrary.processTemplateLinks(item);
				item.find('a').first().click(o.onPageClick);
				$(o.HTML_SHOP_PAGINATION_ID).append(item);
			});
		}
	},
	getPageNumber:function(s) {
		return s.replace(/.*\?.*&page=(\d+).*/, '$1');
	},
	/**
	 * @param  array $shop элемент массива описаний магазина, который может иметь поле params, которое может иметь элементы со свойством title равным перечисленным ниже
	 * @return false | array упорядоченный как self::shopOptionsOrderTitles  или false если не удалось найти свойств
	*/
	prepareShopFeatures: function ($shop) {
		var $result = false, $order, $map, $needCurrencies, $currencies, $count, $result, $option, $title, $it, $unit, $value, i, $i;
		if (isset($shop.params)) {
			$order = ['minorder', 'deliverycost', 'time', 'worktime'];
			if ($shop.display_distance == 1) {
				$order.push('distance');
			}
			$map = array_fill_keys($order, 1);
			$needCurrencies = {'minorder' : 1, 'deliverycost' : 1, 'worktime' : 1};
			$currencies = FlipcatWebAppLibrary.getCurrenciesArray();
			$count = 0;
			$result = [];
			for(i in $shop.params) {
				$option = $shop.params[i];
				$title = isset($option.title) ? $option.title : null;
				if (isset($title) && isset( $map[$title] ) ) {
					$it = array_search($title, $order);
					if (isset($option.value)) {
						$value = $option.value;
					}
					$unit = '';
					if (isset($needCurrencies[$title]) && isset($option.unit)) {
						$option.unit = trim($option.unit);
						$unit = ' ' + (isset($currencies[ $option.unit ]) ? $currencies[ $option.unit ] : $option.unit);
					}
					if ($title == 'time' && isset($value)) {
						var safeValue = $value;
						$value = intval($value);
						switch ($option.unit) {
							case 'hour':
								$unit = ' ' + FlipcatWebAppLibrary.pluralize($value, '',  trans('messages.oneHour'), trans('messages.twoHours'), trans('messages.fiveHours'));
								break;
							case 'month':
								$unit = ' ' + FlipcatWebAppLibrary.pluralize($value, '',  trans('messages.oneMonth'), trans('messages.twoMonths'), trans('messages.fiveMonths'));
								break;
							case 'week':
								$unit = ' ' + FlipcatWebAppLibrary.pluralize($value, '',  trans('messages.oneWeek'), trans('messages.twoWeeks'), trans('messages.fiveWeeks'));
								break;
							case 'year':
								$unit = ' ' + FlipcatWebAppLibrary.pluralize($value, '',  trans('messages.oneYear'), trans('messages.twoYears'), trans('messages.fiveYears'));
								break;
							default:
								$unit = ' ' + $option.unit;
						}
						$value = str_replace('.', ',', parseFloat(safeValue));
					}
					if ($title == 'distance' && isset($value)) {
						$value = round(floatval($value), 1);
						switch ($option.unit) {
							case 'meters':
								$unit = ' ' + FlipcatWebAppLibrary.pluralize(intval($value), '',  trans('messages.oneMeter'), trans('messages.twoMeters'), trans('messages.fiveMeters'));
								break;
							case 'kilometers':
								$unit = ' ' +  FlipcatWebAppLibrary.pluralize(intval($value), '',  trans('messages.oneKilometer'), trans('messages.twoKilometers'), trans('messages.fiveKilometers'));
								break;
							default:
								$unit = ' ' +  $option.unit;
						}
						$value = str_replace('.', ',', $value);
					}
					if (isset($value)) {
						$result[$it] = {'value' : $value + ' ' +  $unit, 'title' : trans(this.shopOptionsOrderTitles[$it]), 'icon' : this.shopOptionsOrderIcons[$it] };
						$count++;
					}
				}
			}
			if (!$count) {
				$result = false;
			}
			if ($result) {
				for ($i = 0; $i < 4; $i++) {
					if (!isset($result[$i])) {
						$result[$i] = ['empty'];
					}
				}
				//ksort($result); 
			}
		}
		return $result;
	},
	/**
	 * @description Инициализирует контролы показа вариантов сортировки
	 * @return {} 
	*/
	initSortForm:function() {
		var o = Flipcat.ShopList,
			iDefaultSort = $(o.HTML_INPUT_DEFAULT_SORT_VALUE_ID),
			defaultSort = o.SORT_BY_POPULAR;
		if (iDefaultSort[0]) {
			defaultSort = iDefaultSort.val();
		}
		o.sortCriteria = defaultSort;
		$(o.HTML_SORT_VARIANTS_SHOW_ID).click(o.toggleSortPopup);
		$(window).click(o.hideSortPopup);
		$(o.HTML_SORT_VARIANTS_BLOCK_ID + ' a').click(o.setSortCriteria);
		$(o.HTML_MOBILE_SORT_VARIANTS_LABEL_CSS).click(o.setSortCriteria);
		$(o.HTML_MOBILE_SORT_VARIANTS_LABEL_CSS).click(o.checkMobileRadioButton);
	},
	/**
	 * @description Показать / скрыть блок сортировки
	 * @return {} 
	*/
	toggleSortPopup:function() {
		var o = Flipcat.ShopList;
		$(o.HTML_SORT_VARIANTS_BLOCK_ID).toggleClass('hide');
		return false;
	},
	/**
	 * @description Скрыть блок сортировки
	 * @return {} 
	*/
	hideSortPopup:function() {
		var o = Flipcat.ShopList;
		$(o.HTML_SORT_VARIANTS_BLOCK_ID).addClass('hide');
	},
	/**
	 * @description Устанавливает критерий сортировки
	 * @return {} 
	*/
	setSortCriteria:function(evt) {
		var o = Flipcat.ShopList, target = $(evt.target), choose = target.data('by'), 
			firstLink, displayLink, filter, request = new Request();
		$(o.HTML_SORT_VARIANTS_BLOCK_ID).addClass('hide');
		if (o.sortCriteria != choose) {
			firstLink = $(o.HTML_SORT_VARIANTS_BLOCK_ID + ' a').first();
			firstLink.text(target.text());
			firstLink.attr('data-by', choose);
			o.sortCriteria = choose;
			displayLink = $(o.HTML_SORT_VARIANTS_SHOW_ID);
			displayLink.text(target.text());
			$(o.HTML_SORT_VARIANTS_BLOCK_ID + ' a').each(function(i, j){
				if (i > 0) {
					j = $(j);
					j.parent().removeClass('hide');
					if (j.data('by') == choose) {
						j.parent().addClass('hide');
					}
				}
			});
			filter = new ShopsFilter(request, o.data.catalogs, o.perPage);
			var items = filter.filter();
			o.renderShops(items, null, filter);
		}
		return false;
	},
	/*
	 * @description Хелпер, выделяет нужный инпут
	 * @return {} 
	*/
	checkMobileRadioButton:function(evt) {
		$('#' + evt.target.getAttribute('for')).prop('checked', true);
		return false;
	},
	/**
	 * @description Инициализация формы переключения типов доставки Доставка / Самовывоз
	*/
	initChooseSeliveryTypeForm:function() {
		var user = Flipcat.User, o = Flipcat.ShopList;
		$(user.HTML_INPUT_CHOOSE_SHIPPING_TYPE_DELIVERY_ID).bind('change', o.onSelectShippingTypeDelivery);
		$(user.HTML_INPUT_CHOOSE_SHIPPING_TYPE_PICKUP_ID).bind('change', o.onSelectShippingTypePickup);
		$(user.HTML_INPUT_MOBILE_CHOOSE_SHIPPING_TYPE_DELIVERY_ID).bind('change', o.onSelectShippingTypeDelivery);
		$(user.HTML_INPUT_MOBILE_CHOOSE_SHIPPING_TYPE_PICKUP_ID).bind('change', o.onSelectShippingTypePickup);
	},
	/**
	 * @description Фильтрация списка объектов при выбраном типе Доставка
	*/
	onSelectShippingTypeDelivery:function(evt) {
		if (evt.target.checked) {
			var o = Flipcat.ShopList, css= o.HTML_SHIPPING_TYPE_ACTIVE_CSS.replace('.', '');
			o.filterByShippingType(o.HTML_DELIVERY_OBJECTS_DATA_ID, o.HTML_DELIVERY_OBJECTS_COUNT_INP_ID);
			$(o.HTML_SHIPPING_TYPE_ACTIVE_CSS).removeClass(css);
			$(evt.target).parent().addClass(css);
		}
	},
	/**
	 * @description Фильтрация списка объектов при выбраном типе Самовывоз
	*/
	onSelectShippingTypePickup:function(evt) {
		if (evt.target.checked) {
			var o = Flipcat.ShopList, css= o.HTML_SHIPPING_TYPE_ACTIVE_CSS.replace('.', '');
			o.filterByShippingType(o.HTML_PICKUP_OBJECTS_DATA_ID, o.HTML_PICKUP_OBJECTS_COUNT_INP_ID);
			$(o.HTML_SHIPPING_TYPE_ACTIVE_CSS).removeClass(css);
			$(evt.target).parent().addClass(css);
		}
	},
	/**
	 * @description Фильтрация списка объектов при выбраном типе Самовывоз или Доставка
	 * @param inputDataId идентификатор инпута, содержащего JSON списка магазинов / ресторанов
	 * @param inputCountId идентификатор инпута, содержащего значение количества списка магазинов / ресторанов
	*/
	filterByShippingType:function(inputDataId, inputCountId) {
		var request = new Request(), o = Flipcat.ShopList, filter,
			items,
			deliveryList = $(inputDataId).val();
		try {
			deliveryList = JSON.parse(deliveryList);
			o.data.catalogs = deliveryList;
			o.data.total_count = $(inputCountId).val();
		} catch(e) {;}
		var messageBlock;
		$(o.HTML_INFOMESSAGE_CSS).each(function(i, j){
			j = $(j);
			if ($.trim(j.text()) == __('messages.Empty_shop_list_for_location')) {
				messageBlock = $(j).parent();
			}
		});
		if (!messageBlock) {
			messageBlock = $('<section class="padding-top-bottom layout hide"><div class="' + o.HTML_INFOMESSAGE_CSS.replace('.', '') + '">' + __('messages.Empty_shop_list_for_location') + '</div></section>');
			$(o.HTML_INFOMESSAGE_PLACE_CSS).first().after( messageBlock );
		}
		if(o.data.total_count == 0) {
			messageBlock.removeClass('hide');
			//messageBlock.parent().removeClass('hide');
		} else {
			messageBlock.addClass('hide');
			//messageBlock.parent().addClass('hide');
		}
		filter = new ShopsFilter(request, o.data.catalogs, o.perPage);
		items = filter.filter();
		o.renderShops(items, null, filter);
	}
};
window.Flipcat.ShopList = ShopList;
