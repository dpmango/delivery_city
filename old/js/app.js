(function($, Lib){
		/** @var {String} localStorage scopes result key */
	var STORAGE_SCOPES_KEY = 'scopes',
	
		/** @var {Object} currentScopesPath путь к текущей категории*/
		currentScopesPath = [],
		
		/** @var {Object} currentScopesData текущие данные о категориях*/
		currentScopesData,
		
		/** @var {String} rawScopesData копия данных о категориях*/
		rawScopesData,
		
		/** @var {Object} shopCategoriesToggleState данные о категориях магазинов*/
		shopCategoriesToggleState = {},
		
		/** @var {Boolean} HISTORY_API false || true */
		HISTORY_API = !!(window.history && window.history.pushState),
		
		//============================DOM================================
		/** @var {String} html container for scopes categories */
		HTML_SCOPES_UL_ID = '#projects-container',
		
		/** @var {String} html container for bread crumbs */
		HTML_BREAD_CRUMBS_ID = '#breadcrumbs',
		
		/** @var {String} html outer container for bread crumbs*/
		HTML_BREAD_CRUMBS_AREA_ID = '#breadcrumbs-area',
		
		/** @var {String}  */
		HTML_SCOPE_UP_LINK_ID = '#scopeUp',
		/** @var {String}  */
		HTML_SCOPE_DATA_TAG_ID = '#scopesData',

		/** @var {String}  */
		HTML_CHANGE_PASS_FAIL_ALERT_ID = '.alert-success';

		/** @var {String}  */
		HTML_SET_NOTIFICATIONS_BLOCK_ID = '#notifications';

		/** @var {String}  */
		HTML_SET_NOTIFICATIONS_SWITCHER_ID = '.material-switch';
		
		/** @var {String}  */
		HTML_POPUP_PRODUCT_CSS = '.course-popup';
		
		/** @var {String}  */
		HTML_POPUP_PRODUCT_CONTAINER_CSS = '.course';
		
		/** @var {String} HTML_SWITCH_FIRST_AGREGATE_SCOPES_LEVEL_ID id select с выбором элемента первого уровня категорий */
		HTML_SWITCH_FIRST_AGREGATE_SCOPES_LEVEL_ID = '#selectFirstLevelCategoryItem';
		
		/** @var {String} Селектор для кнопки авторизации через VK */
		HTML_VK_LOGIN_BUTTON_CSS = '.social_link_vk';
		
		/** @var {String} Селектор для инпута хранения id текущей категории */
		HTML_CURRENT_CATEGORY_INP_ID = 'currentCategoryId';
		
		/** @var {String}  */
		HTML_MAIN_BC_TEXT_ID = '#firstBreadCrumbTitle',
		
		/** @var {String}  */
		HTML_SHOP_CATEGORY_PARENT_CSS = '.parent-shop-category',
		
		/** @var {String} скрытый инпут, содержащий 1 когда пользователь находится на странице всех категорий магазина */
		HTML_INPUT_ALL_SHOP_CATEGORIES_PAGE_ID = '#shopAllCategories',
		
		
	$(initApp);
	/**  */
	function initApp() {
		if (!window.console) {
			function f(){};
			window.console = {log:f, warn:f, error:f };
		}
		window.loadTime = new Date().getTime();
		Flipcat.Desktop.init();
		Flipcat.ShopCategoryFilter.init();
		initPersonalData();
		var lib = {
			_post:_post,
			messageFail: messageFail,
			messageSuccess: messageSuccess,
			_get:_get,
			initCartLink:Flipcat.Cart.initCartLink,
			HTML_BREAD_CRUMBS_AREA_ID: HTML_BREAD_CRUMBS_AREA_ID,
			HTML_BREAD_CRUMBS_ID: HTML_BREAD_CRUMBS_ID,
			HTML_CART_LINK_ID: Flipcat.Cart.HTML_CART_LINK_ID,
			HTML_CART_QUANTITY_ID:Flipcat.Cart.HTML_CART_QUANTITY_ID,
			validateRequired: validateRequired,
			validateEmail: validateEmail,
			validateEmailAndPhone: validateEmailAndPhone,
			defaultFail: defaultFail,
			setFormErrorByPlaceholder: setFormErrorByPlaceholder,
			setOnShopItemPopupListener: setOnShopItemPopupListener,
			addToCart:Flipcat.Cart.addToCart,
			setProgressBarValue:setProgressBarValue,
			checkPrice:Flipcat.Cart.checkPrice
		};
		LangLoader.init(lib);
		Flipcat.Favorites.init(lib);
		Flipcat.Orders.init(lib);
		Flipcat.ShopCatNavigator.init(lib);
		Flipcat.ShopFavorite.init(lib);
		Flipcat.ShopList.init(lib);
		Flipcat.BreadCrumbs.init(lib);
		Flipcat.Yamap.init(lib);
		Flipcat.WebClientAuth.init(lib);
		Flipcat.Pagination.init(lib); 
		Flipcat.OrderFormStorage.init(lib); 
		Flipcat.MultiproductManager.init();
		Flipcat.Reviews.init(lib);
		Flipcat.GoogleMapDialogAdapter = new Flipcat.CGoogleMapDialogAdapter();
		Flipcat.GoogleMapDialogAdapter.init(lib);
		Flipcat.User.init(lib);
		Flipcat.SlideToggleAnimate.init(lib);
		Flipcat.mCitySwitcher.init(lib);
		Flipcat.Placeholders.init(lib);
		Flipcat.Cart.init(lib);
		setListeners();
		setProgressBarValue();
		hideVkButton();
		
		Flipcat.Tests.init(lib);

	}
	
	/**
	 * @description Установить флаг подписки на уведомления
	 */
	function setNotifications() {
		var o = $(this), checkbox = o.find('input'), data = {};

		data['type'] = checkbox.prop('name');
		data['allow'] = checkbox.prop('checked') ? 1 : 0;

		_post(data, onSetNotifications, '/set_notifications');

		return false;
	}

	function onSetNotifications(data) {
		if (data.success) {
			$(HTML_SET_NOTIFICATIONS_BLOCK_ID).find(HTML_CHANGE_PASS_FAIL_ALERT_ID + ' p').text(data.message)
			$(HTML_SET_NOTIFICATIONS_BLOCK_ID).find(HTML_CHANGE_PASS_FAIL_ALERT_ID).removeClass('hide');
		}
	}

	/** 
	 * @description Проверка валидности email  и телефона
	 * @param {String} id идентификатор формы, в котором надо искать поля с Flicpat.Cart.HTML_ORDER_FORM_FIELD_BLOCK_CSS
	*/
	function validateEmailAndPhone(id) {
		var r = validateEmail(id);
		id = id ? id : Flipcat.Cart.HTML_ORDER_FORM_ID;
		var  re = /^\+?[0-9\s]{5,15}$/i,
			 list = $(id).find('input[data-type=number],input[name=3]'),
			 isValid = true, s, isValidFalse = 0;
		list.each(function(i, j){
			if (isValidFalse) {
				return;
			}
			s = $(j).val();
			if ( $.trim(s) ) {
				if (!re.test(s)) {
					msg = __('Incorrect_phone');
					$(j).parent().parent().find(Flipcat.Cart.HTML_ORDER_FORM_FIELD_ERROR_CSS).first().text(msg);
					isValid = false;
					isValidFalse = 1;
				} 
			}
		});
		return r && isValid;
	}
	
	/** 
	 * @description Проверка валидности email
	 * @param {String} id идентификатор формы, в котором надо искать поля с Flicpat.Cart.HTML_ORDER_FORM_FIELD_BLOCK_CSS
	*/
	function validateEmail(id) {
		id = id ? id : Flipcat.Cart.HTML_ORDER_FORM_ID;
		var  re = /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/i,
			 list = $(id).find('input[type=email],input[name=4]'),
			 isValid = true, s, isValidFalse = 0;
		list.each(function(i, j){
			if (isValidFalse) {
				return;
			}
			s = $(j).val();
			if ( $.trim(s) ) {
				if (!re.test(s)) {
					msg = __('Incorrect_email');
					$(j).parent().parent().find(Flipcat.Cart.HTML_ORDER_FORM_FIELD_ERROR_CSS).first().text(msg);
					isValid = false;
					isValidFalse = 1;
				} 
			}
		});
		return isValid;
	}
	/** 
	 * @description Проверка валидности обязательных полей формы
	 * @param {String} id идентификатор формы, в котором надо искать поля с Flipcat.Cart.HTML_ORDER_FORM_FIELD_BLOCK_CSS
	*/
	function validateRequired(id) {
		var isValid = true, required, $input;
		id = id ? id : Flipcat.Cart.HTML_ORDER_FORM_ID;
		$(id).find(Flipcat.Cart.HTML_ORDER_FORM_FIELD_ERROR_CSS).text('');
		$(id).find(Flipcat.Cart.HTML_ORDER_FORM_FIELD_BLOCK_CSS).each(function(i, j){
			required = $(j).find(Flipcat.Cart.HTML_ORDER_FORM_REQUIRED_FIELD_CSS).first()[0];
			if (required) {
				$input = $(j).find('input,select').first();
				if ( $input[0] && (!$.trim($input.val()) || ( $input[0].type == 'checkbox' && !$input[0].checked) ) ) {
					isValid = false;
					setFormErrorByPlaceholder('#' + $input.attr('id'));
				}
			}
		});
		return isValid;
	}
	/** 
	 * @description Устанавливает ошибку для поля с id, текст ошибки берется из второго аргумента или используется сообщение об обязательном заполнении поля "Значение_имени_поля_из_плейсхолдера"
	 * @param {String} id
	 * @param {String} msg = '' Сообщение об ошибке
	*/
	function setFormErrorByPlaceholder(id, msg) {
		var name = $(id).attr('placeholder'), floatPlaceholder;
		if (!name) {
			floatPlaceholder = $(id).parent().find('.floating-placeholder-text').first();
			if (floatPlaceholder[0] && floatPlaceholder.text()) {
				name = floatPlaceholder.text();
			}
		}
		msg = msg ? msg : __('Field_') + '"' + name + '"' + __('_required__for_fill');
		$(id).parents('.input-block').first().find(Flipcat.Cart.HTML_ORDER_FORM_FIELD_ERROR_CSS).first().html(msg);
		setTimeout(function() {
			$(id).parents('.input-block').first().find(Flipcat.Cart.HTML_ORDER_FORM_FIELD_ERROR_CSS).first().css('display', 'inline-block');
		},1000
		);
	}
	/** 
	 * @description 
	*/
	function messageSuccess(s) {
		Flipcat.Messages.success(s);
	}
	/** 
	 * @description 
	*/
	function messageFail(s) {
		Flipcat.Messages.fail(s);
	}
	
	/** 
	 * @description Обработчики событий
	*/
	function setListeners() {
		$(HTML_SET_NOTIFICATIONS_SWITCHER_ID).bind('change', setNotifications);
		
		//категории магазинов
		$(HTML_SHOP_CATEGORY_PARENT_CSS).click(onToggleShopCategory);
		/*$(HTML_SHOP_CATEGORY_PARENT_CSS).each(function(i, j){
			$(j).parent().click(onToggleShopCategory);
		});*/

		//попапы магазинов
		setOnShopItemPopupListener();
		
		$('#debugInfo').click(onDebugInfoClick);
		
		setScopesCategoriesHistoryApi();
		$(HTML_SWITCH_FIRST_AGREGATE_SCOPES_LEVEL_ID + ' option').each(function(i, j){
			if (j.hasAttribute('selected')) {
				j.selected =  true;
			} else {
				j.selected = false;
			}
		});
		
		//замена пагинации
		setInterval(Lib.checkAutoloadItems, 100);
	}
	
//======================CATEGORIES HISTORY API =========================
	/**
	 * TODO спрятать хк
	 * @description Данные о категориях. Вызывается при поднятии в самый верх для перезагрузки списка категорий
	 * @param {Object} data Данные о категориях
	 * @param {Boolean} doStore = true сохранить в хранилище
	*/
	function onScopesData(data, doStore) {
		$('#preloader').hide();
		var buf = [], i, j, r = {}, ch;
		for (var i in data) {
			buf.push(data[i]);
		}
		for (i = 0; i < buf.length; i++) {
			for (j = 0; j < buf.length; j++) {
				if (buf[i].sort && (buf[i].sort < buf[j].sort)) {
					ch = buf[i];
					buf[i] = buf[j];
					buf[j] = ch;
				}
			}
		}
		data = Lib.indexBy(buf);
		currentScopesData = data;
		rawScopesData = JSON.stringify(data);
		renderScopes();
	}
	/** 
	 * @description Клик на значке категории
	*/
	function  onScopeItemClick() {
		if (HISTORY_API) {
			if (history && history.pushState) {
				var o = this, t = o.tagName, id;
				if (t == 'ARTICLE') {
					o = $(o).find('a').first();
				} else if (t == 'A') {
					o = $(o);
				} else if (t) {
					o = $(o).parents('a').first();
					o = $(o);
				}
				id = o.data('id');
				if (id) {
					if (nextScopeLevel(id) ) {
						$(HTML_SCOPE_UP_LINK_ID).removeClass('hide');
						currentScopesPath.push(id);
						renderScopes();
						$(HTML_CURRENT_CATEGORY_INP_ID).val(id);
						if (t) {
							history.pushState(null, null, o.attr('href'));
						}
					} else {
						return true;
					}
					
				} else {
					Error('Empty id!');
				}
			}
			return false;
		}
	}
	/**
	 * TODO клики на хк
	 * @description Устанавливает обработку кликов на элементах дерева категорий через historyAPI, обработку кликов на элементах браузера Вперед Назад
	*/
	function setScopesCategoriesHistoryApi() {
		if ($('#isAllShops').val() == 1) {
			return;
		}
		var current = Lib.REQUEST_URI(1), 
			parentId;
		if (current == '/' || (current.indexOf('/a') == 0 && current != '/all_history')) {
			try {
				rawScopesData = $(HTML_SCOPE_DATA_TAG_ID).text();
				currentScopesData = JSON.parse(rawScopesData);
			} catch(e) {;}
			if (currentScopesData) {
				currentScopesData = Lib.indexBy(currentScopesData);
				rawScopesData = JSON.stringify(currentScopesData);
			}
		} else {
			return;
		}
		parentId = setScopesCategoriesLevelByParentId();
		
		$(HTML_SCOPES_UL_ID + ' article a').click(onScopeItemClick);
		//browser history button
		$(window).bind('popstate', function() {
			setScopesCategoriesLevelByParentId(true);
		});
		
		//link scopeCategories Back
		$(HTML_SCOPE_UP_LINK_ID).click(function(){
			var url = Lib.HTTP_HOST(), data = walkCategoriesTree();
			if (parentId && data && data.data && data.data[parentId] && data.data[parentId].children && data.data[parentId].children instanceof Array && data.data[parentId].children.length == 0) {
				return true;
			}
			if (currentScopesPath.length > 0) {
				currentScopesPath.splice(currentScopesPath.length - 1, 1);
				if (currentScopesPath.length > 0) {
					url += '/a/' + currentScopesPath[ currentScopesPath.length - 1 ];
				}
				if (HISTORY_API) {
					history.pushState(null, null, url);
				}
			}
			if (currentScopesPath.length) {
				nextScopeLevel(0);
				renderScopes();
			} else {
				$(HTML_SCOPE_UP_LINK_ID).addClass('hide');
				_get(onScopesData, '/afk');
			}
			return false;
		});
	}
	/**
	 * @description Отрисовывает уровень дерева категорий
	 * @param {Boolean} onPopState = false указывает, когда функция вызвана из обработчика window.onpopstate
	*/
	function setScopesCategoriesLevelByParentId(onPopState) {
		if ( new Date().getTime() - window.loadTime  < 800) {//fix safari popstate event
			return;
		}
		var current = Lib.REQUEST_URI(1),
			parentId,
			emitter = {};
			
		parentId = getScopeCategoryIdByHfu(current);
		
		if (isNaN(parentId)) {
			parentId = null;
		}
		if (parentId) {
			emitter.data = function(s) {
				if (s == 'id') {
					return parentId;
				}
			}
			buildCategoriesPath(parentId);
			onScopeItemClick.apply(emitter);
		} else if(onPopState) {
			var s = window.location.href;
			if (s.indexOf('#') != s.length - 1) {
				$(HTML_SCOPE_UP_LINK_ID).addClass('hide');
				_get(onScopesData, '/afk');
				currentScopesPath = [];
			}
		}
		return parentId;
	}
	/**
	 * @description Вызывается в том случае, если пользователь сразу пришел на страницу категории, например /a/10
	 * @param {Number} targetId категория, путь до которой ищем
	 * @param {Array}  data = undefined дерево категорий, если undefined то парсится rawScopesData
	 * @param {Number} parentId = undefined
	*/
	function buildCategoriesPath(targetId, data, parentId) {
		var found = 0, i, s;
		if (!data) {
			data = JSON.parse(rawScopesData);
		}
		if (data instanceof Array) {
			data = Lib.indexBy(data);
		}
		if (!parentId) {
			currentScopesPath = [];
		}
		
		if (targetId in data) {
			found = 1;
		}
		s = JSON.stringify(currentScopesPath);
		if (!found) {
			for (i in data) {
				currentScopesPath = JSON.parse(s);
				if (data[i].children) {
					currentScopesPath.push(data[i].id);
					var f = buildCategoriesPath(targetId, data[i].children, data[i].id);
					if (f) {
						found = f;
						break;
					}
				}
			}
		}
		return found;
	}
	/** 
	 * @description Переходит на следующий уровень категорий scopes. Если уровня нет устанавливает currentScopesData в null
	 * @param {Number} id
	 * @return 0 если не удалось найти след. уровень
	*/
	function  nextScopeLevel(id) {
		var data, found = true;
		data = walkCategoriesTree();
		found = data.found;
		data = data.data;
		if (!data) {
			data = currentScopesData;
		}
		if (id && data[id] && data[id].count && data[id].children && count(data[id].children)) {
			data = Lib.indexBy(data[id].children, 'id', 1);
		} else if (id) {
			found = false;
		}
		if (found) {
			currentScopesData = data;
		} else {
			return 0;
		}
		return 1;
	}
	/** 
	 * @description Проходит по дереву категорий путь, который задан в currentScopesPath
	 * @return {bool found, Object data, Array breadCrumbs} found = true если удалось пройти весь путь, data - уровень дерева категорий, на который  указывает currentScopesPath
	*/
	function walkCategoriesTree() {
		var currentId, data, i, j, found = true, 
			breadCrumbs = [{title: ('/' + $(HTML_MAIN_BC_TEXT_ID).text() ? $(HTML_MAIN_BC_TEXT_ID).text() : '/'), link: '/'}],
			link;
		try {
			data = JSON.parse(rawScopesData);
		} catch(e){;}
		if (!data) {
			Error('Debug: empty data!');
		}
		for (j = 0; j < currentScopesPath.length; j++) {
			i = currentScopesPath[j];
			if (data[i] && data[i].count && data[i].children && count(data[i].children) ) {
				link = data[i].hfu_url ? ('/' + data[i].hfu_url) : ('/a/' + data[i].id);
				link = link.replace('//', '/');
				breadCrumbs.push({link: link, title: data[i].title});
				data = Lib.indexBy(data[i].children);
			} else {
				
				found = false;
				break;
			}
		}
		currentId = +$(HTML_CURRENT_CATEGORY_INP_ID).val();
		if (!isNaN(currentId) && (currentId in data)) {
			link = data[i].hfu_url ? ('/' + data[i].hfu_url) : ('/a/' + data[i].id);
			link = link.replace('//', '/');
			breadCrumbs.push({link: link, title: data[currentId].title});
		}
		data = {data:data, found:found, breadCrumbs:breadCrumbs};
		return data;
	}
	/** 
	 * @description отрисовка текущего уровня категорий scopes
	*/
	function  renderScopes() {
		var tag = 'article', data = currentScopesData, ul = $(HTML_SCOPES_UL_ID),
		    tpl = ul.find(tag).first().html(),
		    css = ul.find(tag).first().attr('class').replace(' tpl ', ' '),
			id, s, li, i, link;
		ul.find(tag).each(function(i, j){
			if (i > 0) {
				$(j).remove();
			}
		});
		for (i = 0; i < data.order.length; i++) {
			id = data.order[i];
			if (!+id) {
				continue;
			}
			if (!data[id].image) {
				data[id].image = '/img/productListNoImage.png';
			}
			s = tpl.replace('[ID]', id);
			link = data[id].hfu_url ? ('/' + data[id].hfu_url) : ('/a/' + id);
			link = link.replace('//', '/');
			s = s.replace(/data\-src="src"/m, 'src="' + data[id].image + '"').
				replace(/\[title\]/gm, data[id].title).
				replace(/\[LINK\]/gi, link);
			li = $('<' + tag + ' class="' + css + '">' + s + '</' + tag + '>');
			li = Lib.processTemplateLinks(li);
			ul.append(li);
			li.click(onScopeItemClick);
		}
		renderBreadCrumbs();
	}
	/** 
	 * TODO здесь показать / скрыть!!! и отрисовать хк *
	 * @description отрисовка текущего уровня категорий scopes
	*/
	function  renderBreadCrumbs() {
		var data = walkCategoriesTree(),
			breadCrumbs = data.breadCrumbs;
		/*if (Flipcat.useShopCategoriesAsAgregateCategories && breadCrumbs.length > 2) {
			breadCrumbs.splice(1, 1);
		}*/
		BreadCrumbs.render(breadCrumbs, onCategoryBreadCrumbClick);
	}
	
	function onCategoryBreadCrumbClick() {
		var o = $(this);
		if (o.is('li')) {
			o = o.find('a').first();
		}
		if (HISTORY_API) {
			history.pushState(null, null, o.attr('href'));
			setScopesCategoriesLevelByParentId(true);
			return false;
		}
	}
	
	function getScopeCategoryIdByHfu(hfu, data) {
		hfu = hfu.replace('/' ,'');
		var rawScopesData = $(HTML_SCOPE_DATA_TAG_ID).text(),
			scopesData = JSON.parse(rawScopesData), i, j, r;
		if (!data) {
			data = scopesData;
		}
		if (data instanceof Array) {
			for (i = 0; i < data.length; i++) {
				j = data[i];
				if (hfu == data[i].hfu_url.replace('/' ,'')) {
					return data[i].id;
				}
				if (data[i].children) {
					r = getScopeCategoryIdByHfu(hfu, data[i].children);
					if (r) {
						return r;
					}
				}
			}
			return 0;
		} else if (data instanceof Object){
			for (i in data) {
				j = data[i];
				if (hfu == data[i].hfu_url.replace('/' ,'')) {
					return data[i].id;
				}
				if (data[i].children) {
					r = getScopeCategoryIdByHfu(hfu, data[i].children);
					if (r) {
						return r;
					}
				}
			}
			return 0;
		}
	}
	
	function onDebugInfoClick(){
		if ($('#debugInfoBlock').css('display') == 'block') {
			$('#debugInfoBlock').fadeOut();
		} else {
			$('#debugInfoBlock').removeClass('hide');
		}
		return false;
	}
	
//=================AJAX HELPERS=========================================
	function  _map(data, read) {
		var $obj, obj, i;
		for (i in data) {
			$obj = $('#' + i);
			obj = $obj[0];
			if (obj) {
				if (obj.tagName == 'INPUT' || obj.tagName == 'TEXTAREA') {
					if (!read) {
						$obj.val(data[i]);
					} else {
						data[i] = $obj.val();
					}
				} else {
					if (!read) {
						$obj.text(data[i]);
					} else {
						data[i] = $obj.text();
					}
				}
			}
		}
	}
	function _get(onSuccess, url, onFail) {
		Lib._get(onSuccess, url, onFail);
	}
	function _delete(onSuccess, url, onFail) {
		_restreq('post', {}, onSuccess, url, onFail)
	}
	function _post(data, onSuccess, url, onFail) {
		var list = document.getElementsByTagName('meta'), i, t;
		for (i = 0; i < list.length; i++) {
			if ($(list[i]).attr('name') == 'app') {
				t = $(list[i]).attr('content');
				break;
			}
		}
		if (t) {
			data._token = t;
			_restreq('post', data, onSuccess, url, onFail)
		}
	}
	function _patch(data, onSuccess, url, onFail) {
		_restreq('patch', data, onSuccess, url, onFail)
	}
	function _put(data, onSuccess, url, onFail) {
		_restreq('put', data, onSuccess, url, onFail)
	}
	function _restreq(method, data, onSuccess, url, onFail) {
		Lib.restreq(method, data, onSuccess, url, onFail);
		/*$('#preloader').show();
		$('#preloader').width(screen.width);
		$('#preloader').height(screen.height);
		$('#preloader div').css('margin-top', Math.round((screen.height - 350) / 2) + 'px');
		
		if (!url) {
			url = window.location.href;
		}
		if (!onFail) {
			onFail = defaultFail;
		}
		switch (method) {
			case 'put':
			case 'patch':
			case 'delete':
				break;
		}
		$.ajax({
			method: method,
			data:data,
			url:url,
			dataType:'json',
			success:onSuccess,
			error:onFail
		});*/
	}
	
	function defaultFail(data) {
		window.requestSended = 0;
		alert(__('messages.Default_fail'));
	}
//=================AUTHENTICATION MARKER=================================
/**
 * Все данные, которые могут быть получнеы только по stamp, 
 * такие как избранное и история должны получаться через объект AuthMarker
 * Назначение объекта - сохранить значение куки авторизации в локальном хранилище
 * и восстановить его в сессии в том случае, если его там нет.
 * 
 * При успешном восстановлении значения маркера в сессии бэкенд подгружает данные
 * и возвращает их.
 * Для отображения их без перезагрузки страницу необходимо передать в метод
 * AuthMarker.init в аргументе registredClasses объект с методом
 * onSuccess(data) который будет вызван AuthMarker.
 * AuthMarker.init вызывается в функции initPersonalData()
 * immediately функции приложения
 * 
 * Пример для избранного
 * 
 * var handlers = {Favorites: window.Flipcat.Favorites};
 * AuthMarker.init(lib, handlers);
 * 
*/
/**
 * 
*/
function initPersonalData() {
	var registredClasses = {
		Favorites: window.Flipcat.Favorites
	};
	
	var lib = {_post: _post};
	Flipcat.AuthMarker.init(lib, registredClasses);
}

//=================SHOP CATEGORIES=======================================
function onToggleShopCategory() {
	var target = this;
	target = target.tagName == 'LI' ? $(target).find('a').first()[0] : target;
	var a = $(target), id = a.data('id'), o = a.parent().find('ul').first(), isOpenCss = '.shop-category-is-open';
	if (o.hasClass('hide')) {
		shopCategoriesToggleState[id] = 0;
		o.removeClass('hide');
		o.hide();
	}
	if (shopCategoriesToggleState[id] === 0) {
		shopCategoriesToggleState[id] = 1;
		o.fadeIn();
		
		setTimeout(function(){
			a.addClass(isOpenCss.replace('.', ''));
		}, 60);
	} else {
		shopCategoriesToggleState[id] = 0;
		o.fadeOut();
		setTimeout(function(){
			a.removeClass(isOpenCss.replace('.', ''));
		}, 60);
	}
	return false;
}
//=================PRODUCT POPUP =======================================
function onShopPopupOver(evt) {
	var div = $(evt.target), 
		popup,
		w, h, x, y, $item, scrollHeight;
	if (!div.hasClass(HTML_POPUP_PRODUCT_CONTAINER_CSS)) {
		div = div.parents(HTML_POPUP_PRODUCT_CONTAINER_CSS).first();
	}
	$item = div;
	popup = div.find(HTML_POPUP_PRODUCT_CSS).first();
	if (!popup) {
		return true;
	}
	x = evt.screenX - evt.offsetX + $item.width();
	y = evt.screenY - evt.offsetY + $item.height();
	popup.css('opacity', 0);
	
	//направление 
	if (x + popup.width() > Lib.getViewport().w) {
		popup.addClass('position-left');
	} else {
		popup.removeClass('position-left');
	}
	scrollHeight = Math.max(
	  document.documentElement.scrollHeight
	);
	
	var vpH = Lib.getViewport().h, scrollTop = $(window).scrollTop();
	
	if (scrollTop >= scrollHeight - vpH - 100) {
		//popup.addClass('position-top');
	} else {
		//popup.removeClass('position-top');
	}
	popup.removeClass('position-top');
	//коррекция по вертикали
	if ($item[0]) {
		var ffdY = 22, dY = ffdY;
		var offsetTop = $item.parent()[0].offsetTop + $('main').first()[0].offsetTop;
		popup.css('top', '0px');
		popup.css('bottom', 'auto');
		//верхний предел
		var topLimit = $('#breadcrumbs-area').height() + $('.navbar').first().height();//вертикаль фиксированых сверху элементов
		if (offsetTop < scrollTop + topLimit - dY) {
			dY = (scrollTop + topLimit - dY) - offsetTop;
			popup.css('top', dY + 'px');
		}
		//нижний предел
		if (offsetTop + popup.height() > (vpH + scrollTop)) {
			dY = vpH + scrollTop - offsetTop - popup.height() - 30;
			popup.css('top', dY + 'px');
			popup.addClass('position-top');
			popup.css('bottom', '0px');
			popup.css('bottom', (popup.height() - popup.find('div').first().height() ) - 140   + 'px');
		}
	}
	popup.css('opacity', 1);
}

function setOnShopItemPopupListener() {
	$(HTML_POPUP_PRODUCT_CONTAINER_CSS).bind('mouseover', onShopPopupOver);
}


/** @description Установка значения "прогрессбара", пока не придумал, куда это по уму перенести */
function setProgressBarValue() {
	$('.progress-bar').each(function(i, j){
		j = $(j);
		var v = (100 - j.data('value')), sp = j.find('span').first();
		sp.css('width', v + '%');
		if (v == 100) {
			if (!window.Flipcat.progressBarGreenColor) {
				window.Flipcat.progressBarGreenColor = j.css('background-color');
			}
			if (!window.Flipcat.progressBarRedColor) {
				window.Flipcat.progressBarRedColor = j.find('span').first().css('background-color');
			}
			sp.css('background-color', Flipcat.progressBarGreenColor);
		} else {
			sp.css('background-color', Flipcat.progressBarRedColor);
		}
	});
}
/** @description Скрывает кнопку авторизации через ВКонтакте, если домен .рф  */
function hideVkButton() {
	var domain = Lib.HTTP_HOST();
	if (~domain.indexOf('.рф')  || ~domain.indexOf('.xn--p1ai') ) {
		$(HTML_VK_LOGIN_BUTTON_CSS).addClass('hide');
	}
}

})
(jQuery, window.FlipcatWebAppLibrary);
