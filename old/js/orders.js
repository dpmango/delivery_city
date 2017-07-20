/** @class Страница истории заказов */
window.Flipcat = window.Flipcat || {};
/**
 * @object 
*/
var Orders = {
	/** @property {String} контейнер истории заказов*/
	HTML_ORDERS_CONTAINER_ID : '#orders',
	
	/** @property {String} контейнер мобильной истории заказов*/
	HTML_MOBILE_ORDERS_CONTAINER_ID : '#mOrders',
	
	/** @property {String} шаблон товара */
	HTML_PRODUCT_ITEM_ID     : '#orderShopItem',
	
	/** @property {String} контейнер с данными */
	HTML_ORDERS_DATA_ID      : '#ordersData',
	
	/** @property {String} контейнер с данными о валютах*/
	HTML_CURRENCIES_DATA_ID  : '#currenciesData',
	
	/** @property {String} контейнер с элементами пагинации */
	HTML_PAGINATION_CONTAINER_ID : '#shopPaging',
	
	/** @property {String} инпут с данными сколько показывать на странице заказов */
	HTML_PERPAGE_INPUT_ID    :     '#ordersPerPage',
	
	/** @property {String} css шаблона контейнера товаров*/
	HTML_PRODUCTS_CONTAINER_CSS :  '.order-shop-item',
	
	/** @property {String} css элемента содержащего data атрибут с идентификатором товара */
	HTML_ITEM_PRICE_A_CSS :  ' .item-price a',
	
	/** @property {String} css элемента содержащего data атрибут с идентификатором товара */
	HTML_ITEM_CART_NO_EXISTS_CSS : '.cart-noexists',
	
	/** @property {String} css элемента содержащего data атрибут с идентификатором товара */
	HTML_ITEM_CART_ADD_CSS : '.cart-add',

	/** @property {String} css  кнопки Повторить заказ */
	HTML_ORDER_REPEAT_CSS : '.btn-order-repeat',
	
	/** @property {String} css  блока с заказом */
	HTML_ORDER_CONTAINER_CSS : '.order-shop-item-container',
	
	/** @property {String} id окна с сообщением об изменении в заказе */
	HTML_ORDER_CHANGES_MESSAGE_MODAL_ID : '#orderIsChangeModal',
	
	/** @property {String} css кнопок закрывающих окно с сообщением */
	HTML_ORDER_CHANGES_MESSAGE_MODAL_BUTTONS_CSS : '.order-change',
	
	/** @property {String} css кнопки показывающей модальное окно */
	HTML_ORDER_SHOW_EXT_INFO_CSS : '.show-order-ext-info',
	
	/** @property {String} css блока с контентом дополнительного содержимого */
	HTML_ORDER_EXT_INFO_CONTENT_CSS : '.order-extend-info',
	
	/** @property {String} id модального окна с дополонительно информацией по товару*/
	HTML_ORDER_EXT_INFO_MODAL_ID : '#modalOrderInfo',

	/** @property {String} id блока модального окна в который надо вставить дополонительную информациею по товару*/
    HTML_ORDER_EXT_BLOCK_IN_MODAL: '#orderInfoContent',
    
    /** @property {Number} autoloadProcess 1 когда происходит процесс автозагрузки при прокрутки страницы*/
    autoloadProcess : 0,
    
    /** @property {Number} currentPage */
    currentPage : 1,
	
	/**
	 *@param {Object} 
	*/
	init:function(lib) {
		this.lib = lib;
		this.setListeners();
	},
	setListeners:function() {
		var o = this, data = $(o.HTML_ORDERS_DATA_ID).val();
		try {
			data = JSON.parse(data);
			this.currencies = JSON.parse( $(o.HTML_CURRENCIES_DATA_ID).val() );
			this.data = data;
			if (data.orders.length) {
				$(o.HTML_PAGINATION_CONTAINER_ID + ' a').click(o.onLinkClick);
				$(o.HTML_ORDER_REPEAT_CSS).click(o.onRepeatClick);
				$(o.HTML_ORDER_SHOW_EXT_INFO_CSS).click(o.onInfoClick);
				$(o.HTML_ORDER_CHANGES_MESSAGE_MODAL_BUTTONS_CSS).click(o.addToCart);
				//setInterval(o.checkAutoloadItems, 100);
				Flipcat.linkListener = o.onNeedMoreItems;
			}
		}catch(e) {}
		$(o.HTML_ITEM_CART_NO_EXISTS_CSS).click(function(){ return false;});
	},
	/**
	 * @description Перегрузить чтобы использовать при автоподгрузке
	*/
	onLinkClick:function(evt) {
		/*console.log('L = '  +  Flipcat.Orders.data.orders.length );
		
		if (Flipcat.Orders.data.orders.length == 50 && !window.DDD) {
			console.log(Flipcat.Orders.data);
			window.DDD = 1;
		}
		if (Flipcat.Orders.data.orders.length == 100 && !window.DDDs) {
			console.log(Flipcat.Orders.data);
			window.DDDs = 1;
		}
		console.log('currentPage = '  +  Flipcat.Orders.currentPage );*/
		
		var o = Flipcat.Orders, p = (evt ? FlipcatWebAppLibrary._GET('page', 0, $(evt.target).attr('href')) : o.currentPage - 1),
			data = array_chunk(o.data.orders, $(o.HTML_PERPAGE_INPUT_ID).val()),
			nextPage = array_chunk(o.data.orders, $(o.HTML_PERPAGE_INPUT_ID).val())[p], i, j,
			config = [
				{key: '[DATE]', val: o.renderDate},
				{key: new RegExp('\\[ID\\]', 'gmi'), val: 'id'},
				{key:new RegExp('\\[ORDER_SYS_ID\\]', 'gmi'), val: 'sys_order_id'},
				{key:'[ORDER_SHOP_ITEM]', val : o.renderItems},
				{key:'[ORDER_BUYER_DATA]', val : o.renderBuyer},
				{key:new RegExp('\\[totalPrice\\]', 'gmi'), val : o.totalPrice},
				{key:new RegExp('\\[STATUS\\]', 'gmi'), val : 'status'},
				{key:new RegExp('\\[review_rating\\]', 'gmi'), val : o.showReviewButton},
				{key:new RegExp('\\[COMPANY_NAME\\]', 'gmi'), val : o.renderCompanyName},
				{key:new RegExp('\\[IMAGE\\]', 'gmi'), val : o.renderCompanyLogo},
				{key:new RegExp('\\[HFU_URL\\]', 'gmi'), val : o.renderCompanyUrl},
				{key:new RegExp('\\[totalQuantity\\]', 'gmi'), val : o.totalQuantity}
			], currentData = [];
		//console.log( array_chunk(o.data.orders, $(o.HTML_PERPAGE_INPUT_ID).val()) );
		
		if (nextPage) {
			//for (j = 0; j <= p; j++) {
				//nextPage = data[j];
				for (i = 0; i < nextPage.length; i++) {
					currentData.push( nextPage[i] );
				}
			//}
		} else if(!evt) {
			if (o.data.orders.length < o.data.total_orders) {
				if (!o.requsetSended) {
					o.requsetSended = true;
					o.currentPageStored = o.currentPage;
					o.lib._get(o.onLoadOrders, '/historyjson?offset=' + o.data.orders.length, o.onFailLoadOrders);
				}
			} else {
				o.currentPage--;
			}
			return false;
		}
		data = currentData;
		FlipcatWebAppLibrary.render($(o.HTML_ORDERS_CONTAINER_ID), 'div', config, data, false, 'div.orders-history-item');
		config[4] = {key:'[ORDER_BUYER_DATA]', val : o.renderBuyerMobile};
		config[3] = {key:'[ORDER_SHOP_ITEM]', val : o.renderItemsMobile};
		FlipcatWebAppLibrary.render($(o.HTML_MOBILE_ORDERS_CONTAINER_ID), 'div', config, data, false, 'div.mobile-hstory-item');
		$(o.HTML_ORDER_SHOW_EXT_INFO_CSS).click(o.onInfoClick);
		$(o.HTML_ORDER_REPEAT_CSS).click(o.onRepeatClick);
		$(Flipcat.Reviews.HTML_REVIEW_BTN_ADD_CSS).click(Flipcat.Reviews.onClickAddReviewButton);
		setAccordion();
		Flipcat.Pagination.setData(o.onLinkClick, o.data.orders.length, $(o.HTML_PERPAGE_INPUT_ID).val());
		return false;
	},
	/**
	 * @description Отрисовка данных о товарах в мобильной версии приложения
	*/
	renderItemsMobile:function(item, $tpl) {
		var items = item.items, pContainer, productItemTpl, productItemCss, productItemTagName,
			productTpl, $o, o = Flipcat.Orders, i, j, s, tContainer, currency, q = '';
		
		if (items.length) {
			$o = $tpl.find('.js-order-items-tpl' + '.tpl').first();
			productTpl = $o.html();
			for (i = 0; i < items.length; i++) {
				s = productTpl.replace('[TITLE]', items[i].title);
				s = s.replace('[QUANTITY]', items[i].quantity);
				s = s.replace('[ITEM_ID]', items[i].id);
				currency = items[i].currency;
				currency = (Flipcat.currenciesMap && Flipcat.currenciesMap[currency]) ? Flipcat.currenciesMap[currency] : currency;
				s = s.replace('[PRICE]', String( round(items[i].quantity * items[i].price, 2) ).replace('.', ',') + ' ' + currency );
				q += s;
			}
		}
		return q;
	},
	renderItems:function(item, $tpl) {
		var items = item.items, pContainer, productItemTpl, productItemCss, productItemTagName,
			productTpl, $o, o = Flipcat.Orders, i, j, s, tContainer, currency;
		
		if (items.length) {
			$o = $tpl.find(o.HTML_PRODUCTS_CONTAINER_CSS + '.tpl').first();
			pContainer = $o.parent();
			productItemCss = $o.attr('class').replace('tpl', '');
			productItemTagName = $o[0].tagName.toLowerCase();
			productItemTpl = $(o.HTML_PRODUCT_ITEM_ID).html();
			
			pContainer.find(productItemTagName).each(function(i, j){
				j = $(j);
				if (!j.hasClass('tpl')) {
					j.remove();
				}
			});
			tContainer = $('<ul class="hide"></ul>');
			for (i = 0; i < items.length; i++) {
				j = items[i];
				s = productItemTpl.replace('[TITLE]', j.title);
				currency = o.currencies[j.currency] ? o.currencies[j.currency] : j.currency;
				s = s.replace('[PRICE]', String(round(j.price * j.quantity, 2)).replace('.', ',') + ' ' + currency);
				s = s.replace('[QUANTITY]', j.quantity);
				s = s.replace(/\[ID\]/gm, j.id);
				
				if (j.photos && j.photos[0] && j.photos[0].thumbnail_url) {
					s = s.replace('data-src="src"', 'src="' + j.photos[0].thumbnail_url + '"');
				} else {
					s = s.replace('data-src="src"', 'src="/img/productListNoImage.png"'); //TODO config!
				}
				
				tContainer.append($('<' + productItemTagName + ' class="' + productItemCss + '" data-id="' + j.id + '">' + s + '</' + productItemTagName + '>') );
			}
			s = tContainer.html();
			tContainer.remove();
			return s;
		}
	},
	/**
	 * @description Рендеринг данных о заказе
	*/
	renderBuyerMobile:function(item, $tpl) {
		var tpl = $tpl.find('.js-mobile-order-shop-buyer.tpl').first().html(), tContainer = $('<div></div>'), i, s, map = {};
		for (i = 0; i < item.fields.length; i++) {
			if (!map[item.fields[i].title] && $.trim(item.fields[i].description)) {
				s = tpl.replace('[TITLE]', item.fields[i].title);
				s = s.replace('[DESCRIPTION]', item.fields[i].description);
				tContainer.append($(s));
				map[item.fields[i].title] = 1;
			}
		}
		s = tContainer.html();
		return s;
	},
	renderBuyer:function(item, $tpl) {
		var tpl = $tpl.find('.order-shop-buyer.tpl').first().html(), tContainer = $('<div></div>'), i, s, map = {};
		for (i = 0; i < item.fields.length; i++) {
			if (!map[item.fields[i].title] && $.trim(item.fields[i].description)) {
				s = tpl.replace('[TITLE]', item.fields[i].title);
				s = s.replace('[DESCRIPTION]', item.fields[i].description);
				tContainer.append($(s));
				map[item.fields[i].title] = 1;
			}
		}
		s = tContainer.html();
		return s;
	},
	/**
	 * @description Рендеринг кнопки Оставить отзыв
	*/
	showReviewButton:function(item, $tpl) {
		return ( (item.review && item.review.review_rating && $.trim(item.review.review_rating)) ? 'hide' : '');
	},
	/**
	 * @description Рендеринг имени компании (и ее логотипа?)
	*/
	renderDate:function(item, $tpl) {
		return FlipcatWebAppLibrary.formatDate(item.date);
	},
	/**
	 * @description Рендеринг имени компании (и ее логотипа?)
	*/
	renderCompanyName:function(item, $tpl) {
		return item.shop.company_name;
	},
	/**
	 * @description Рендеринг логотипа компании 
	*/
	renderCompanyLogo:function(item, $tpl) {
		var src = (item.shop.logotype_url ? item.shop.logotype_url : (item.shop.logotype_thumbnail ? item.shop.logotype_thumbnail : '/img/productListNoImage.png') );
		return '<img class="img-responsive project-image shop-image" width="100" alt="' + item.shop.company_name + '" src = "' + src + '">';
	},
	/**
	 * @description Рендеринг ссылку на компанию
	*/
	renderCompanyUrl:function(item, $tpl) {
		if (Flipcat.hfuEnabled) {
			return '/company/' + FlipcatWebAppLibrary.transliteUrl(item.shop.company_name);
		}
		var sh = item.shop, cid = sh.agregate_scope_ids[0] ? sh.agregate_scope_ids[0] : '0';
		return ('/b/' + sh.sid + '/' + cid + '/' + sh.id);
	},
	totalQuantity:function(item, $tpl) {
		var i, q = 0;
		for (i = 0; i < item.items.length; i++) {
			q += item.items[i].quantity;
		}
		return q;
	},
	totalPrice:function(item, $tpl) {
		var i, q = 0, cur = 0, curData = Flipcat.Orders.currencies, defCur = '';
		for (i = 0; i < item.items.length; i++) {
			if (!cur && curData[item.items[i].currency]) {
				cur = curData[item.items[i].currency];
			}
			if (!defCur) {
				defCur = item.items[i].currency;
			}
			q += item.items[i].price * item.items[i].quantity;
		}
		
		if (item.fields && (item.fields instanceof Array)) {
			for (i = 0; i < item.fields.length; i++) {
				if (item.fields[i] && +item.fields[i].price) {
					q = +q + +item.fields[i].price;
				}
			}
		}
		
		cur = item.shop.currency && Flipcat.currenciesMap[item.shop.currency] ? Flipcat.currenciesMap[item.shop.currency] : cur;
		return q + ' ' + cur;
	},
	/**
	 * @description Запрашивает актуальную информацию о товаре
	*/
	getProductsInfo:function(evt){
		var o = Flipcat.Orders, ids = [], uq = {},
			btn = $(evt.target), ls = btn.parents(o.HTML_ORDER_CONTAINER_CSS).first().find(o.HTML_PRODUCTS_CONTAINER_CSS);
		ls.each(function(i, j){
			j = $(j);
			i = j.data('id');
			if (!uq[i]) {
				uq[i] = 1;
				ids.push(i);
			}
			
		});
		o.lib._post({ids:ids, oi:btn.data('id')}, o.onProductsInfo, '/history/info', o.onFailLoadProductsInfo);
	},
	/**
	 * @description Обрабатывает ошибку запроса актуальной информации о товаре
	*/
	onFailLoadProductsInfo:function() {
		Flipcat.Orders.lib.defaultFail();
	},
	/**
	 * @description Обрабатывает актуальную информацию о товаре. Если все товары есть в наличии и стоимость их не изменилась, значит все ок, вызываем добавление в корзину	*/
	onProductsInfo:function(data) {
		var o = Flipcat.Orders, orderId = data.id, isChanges = 0, id,
			oldPriceSum, oldQ, availableProducts = [], price, sid;
		if (data.error && data.info == 'emptyList') {
			isChanges = 1;
		}
		sid = data.sid;
		data = FlipcatWebAppLibrary.indexBy(data.list);
		
		$('#modalOrderN' + orderId).first().find(o.HTML_PRODUCTS_CONTAINER_CSS).each(function(i, j){
			j = $(j);
			if (j.hasClass('tpl')) {
				return;
			}
			id = j.data('id');
			//есть ли он в ответе?
			if (!data[id]) {
				//console.log('Ch 1, id = ' + id);
				isChanges = 1;
			} else {
				//доступен ли для заказа?
				if (data[id].allow_order != 1) {
					//console.log('Ch 2');
					isChanges = 1;
				} else {
					//не изменилась ли стоимость?
					oldPriceSum = parseInt(j.find('.order-shop-item-price').first().text(), 10);
					//console.log('oldPriceSum = ' + oldPriceSum);
					oldQ = parseInt(j.find('.order-shop-item-quantity').first().text(), 10);
					//console.log('oldQ = ' + oldQ);
					price = data[id].discount_price ? data[id].discount_price : data[id].price;
					if (price * oldQ != oldPriceSum) {
						//console.log('new Price  = ' + (price * oldQ));
						isChanges = 1;
					}
					//есть в ответе, доступен для заказа, надо добавить в корзину
					availableProducts.push({id:id, q:oldQ});
					
				}
			}
		});
		o.availableProducts = availableProducts;
		window.global_sid = sid;
		if (isChanges) {
			$(o.HTML_ORDER_CHANGES_MESSAGE_MODAL_ID).modal('show');
		} else {
			o.addToCart();
		}
	},
	/**
	 * @description Проверяет, не надо ли добавить еще французских булок
	 * @param {Array} of {id,q(uantity)} availableProducts 
	*/
	addToCart:function() {
		var i, o = Flipcat.Orders, a = o.availableProducts;
		for (i = 0; i < a.length; i++) {
			o.lib.addToCart(a[i].id, a[i].q);
		}

		setTimeout(function(){
			window.location.href = $(o.lib.HTML_CART_LINK_ID).attr('href');
		}, 500);
	},
	/**
	 * @description Проверяет, не надо ли добавить еще французских булок
	*/
	onNeedMoreItems:function() {
		//console.log('Orders call onNeedMoreItems');
		var o = Flipcat.Orders;
		setTimeout(function(){
			//console.log('was CP = ' + o.currentPage);
			o.onLinkClick();
			o.autoloadProcess = 0;
		}, 500);
		
	},
	/*checkAutoloadItems:function() {
		var b = document.body, w = $(b), o = Flipcat.Orders;
		if(window.scrollY >= document.body.clientHeight - FlipcatWebAppLibrary.getViewport().h - 100) {
			if (!o.autoloadProc) {
				o.autoloadProc = 1;
				setTimeout(function(){
					console.log('I call!!!');
					o.currentPage = o.currentPage ? o.currentPage + 1 : +FlipcatWebAppLibrary._GET('page', 1);
					o.onLinkClick();
					o.autoloadProc = 0;
				}, 500);
			}
		}
	},*/
	/**
	 * @description Клик на кнопке Повторить заказ
	*/
	onRepeatClick:function(evt) {
		Flipcat.Orders.getProductsInfo(evt);
	},
	/**
	 * @description Клик на кнопке Подробнее
	*/
	onInfoClick:function(evt) {
		var o = Flipcat.Orders, html = $(evt.target).parents(o.HTML_ORDER_CONTAINER_CSS).first()
			.find(o.HTML_ORDER_EXT_INFO_CONTENT_CSS ).first().html();
		$(o.HTML_ORDER_EXT_BLOCK_IN_MODAL).html(html);
		$(o.HTML_ORDER_EXT_INFO_MODAL_ID).modal('show');
		return false;
	},
	/**
	 * @description Обработка успешной подгрузки истории заказов
	*/
	onLoadOrders:function(data) {
		var i, o = Flipcat.Orders;
		if (data.orders && data.orders.length) {
			for (i = 0; i < data.orders.length; i++) {
				o.data.orders.push( data.orders[i] );
			}
			//console.log(o.data);
			//TODO set data into textarea
			//$(o.HTML_ORDERS_DATA_ID).val(JSON.stringify(o.data));
		}
		//o.currentPage;
		o.currentPage  = o.currentPageStored;
		o.onLinkClick();
		setTimeout(function(){
			o.requsetSended = false;
		}, 2000);
	},
	/**
	 * @description Обработка успешной подгрузки истории заказов
	*/
	onFailLoadOrders:function() {
		Flipcat.Orders.requsetSended = false;
		//TODO reqSend = false;
		//Flipcat.Messages.fail(__('messages.Unable_load_old_orders'));
	}
};
window.Flipcat.Orders = Orders;
