/** @class Корзина */
window.Flipcat = window.Flipcat || {};
/**
 * @object Корзина. Сюда будут перенесены постепенно все методы касающиеся работы с корзиной из app.js
*/
Flipcat.Cart = {
	/** @property {String} SPG_TYPE тип платежа*/
	SPG_TYPE : window.location.href.indexOf('multiproduct.apideliverycity.ru') == -1 ? 'spg' : 'spg_test',
	
	/** @property {String} HTML_CART_ITEM_QUANTITY_CSS*/
	HTML_CART_ITEM_QUANTITY_CSS : '.item-quantity',
	
	/** @property {String} HTML_CART_ITEM_PRICE_CSS */
	HTML_CART_ITEM_PRICE_CSS : '.cart-item-price',
	
	/** @property {String} HTML_ORDER_FORM_ID id формы оформления заказа */
	HTML_ORDER_FORM_ID : '#orderForm',
	
	/** @property {String} HTML_SEND_ORDER_BUTTON_ID id кнопки submit формы оформления заказа*/
	HTML_SEND_ORDER_BUTTON_ID : '#sendOrderFormBtn',
	
	/** @property {jQuery(HtmlButton)} Кнопка оплаты картами */
	cardPaymentButton : $('.card_payment_form button').first(),
	
	/** @property {jQuery(HtmlForm)} Форма оплаты картами */
	cardPaymentForm : $('.card_payment_form form').first(),
	
	/** @property {jQuery(HtmlInput)} cardPaymentSumInput Инпут ввода суммы формы оплаты картами */
	cardPaymentSumInput : $('.card_payment_form form input[name=cost]').first(),
	
	/** @property {jQuery(HtmlInput)} cardPaymentOrderIdInput Инпут ввода orderId формы оплаты картами */
	cardPaymentOrderIdInput : $('.card_payment_form form input[name=order_id]').first(),
	
	/** @property {jQuery(HtmlInput)} cardPaymentEmailInput Инпут ввода email формы оплаты картами */
	cardPaymentEmailInput : $('.card_payment_form form input[name=default_email]').first(),
	
	/** @property {jQuery(HtmlInput)} cardPaymentOrderIdInput Инпут ввода Наименования заказа  формы оплаты картами */
	cardPaymentNameInput : $('.card_payment_form form input[name=name]').first(),
	
	/** @property {jQuery(HtmlInput)} cardPaymentCustomFieldsInput Инпут ввода дополнительных полей формы оплаты картами */
	//cardPaymentCustomFieldsInput : $('.card_payment_form form input[name=custom_fields]').first(),
	
	/** @property {String} id контейнера со списком отложенных товаров */
	HTML_CART_LIST_ID : '#projects-container',
	
	/** @property {String} id  контейнера с сообщением об успешной покупке */
	HTML_CART_SUCCESS_ID : '#orderSuccess',
	
	/** @property {String} id кнопки Показать форму заказа */
	HTML_ORDER_FORM_TOGGLE_ID : '#showOrderForm',
	
	/** @property {String} */
	HTML_SHOP_ID_INP_ID : '#shopId',
	
	/** @property {String} localStorage cartPrice key */
	STORAGE_PRICE_CART_PREFIX : 'price_',
	
	/** @property {String} */
	HTML_ADD_TO_CART_LINK_CSS : '.cart-add',
	
	/** @property {String}      */
	HTML_CART_HINT_ID : '#cartAnim',
	
	/** @property {String} HTML_CART_HINT_HANDLE_ID */
	HTML_CART_HINT_HANDLE_ID : '#cartAnimHandle',
	
	/** @property {String} */
	HTML_CART_TOTAL_SUM_ID : '#cartTotal',
	
	/** @property {String} localStorege cart key */
	STORAGE_ADD_CART_KEY : 'cart-',
	
	/** @property {String}  */
	HTML_CART_ITEM_PRICE_CSS : '.cart-item-price',
	
	/** @property {String}  */
	HTML_CART_QUANTITY_ID : '#itemsCountInCart',
	
	/** @property {String}  */
	HTML_CART_ID : '#itemsInCart',
	
	/** @property {String}  */
	HTML_MOBILE_CART_QUANTITY_ID : '#mItemsCountInCart',
	
	/** @property {String}  */
	HTML_CART_TOTAL_ROW_ID : '#cartTotalRow',
	
	/** @property {String} HTML_CART_LINK_ID id Ссылки на переход в корзину */
	HTML_CART_LINK_ID : '#cartLink',
	
	/** @property {String} HTML_CART_LINK_ID id Ссылки на переход в корзину для мобильной версии */
	HTML_MOBILE_CART_LINK_ID : '#mCartLink',
	
	/** @property {String}  */
	HTML_REMOVE_FROM_CART_LINK_CSS : '.cart-remove',
	
	/** @property {String}  */
	HTML_CART_ITEM_QUANTITY_INC_BUTTON_CSS : '.inc',

	/** @property {String}  */
	HTML_CART_ITEM_QUANTITY_DEC_BUTTON_CSS : '.dec',
	
	/** @property {String}  */
	HTML_CART_TOTAL_CURRENCY_ID : '#totalCurr',
	
	/** @property {String}  */
	HTML_ORDER_FORM_FIELD_BLOCK_CSS : '.input-block',
	
	/** @property {String}  */
	HTML_ORDER_FORM_FIELD_ERROR_CSS : '.field-error',
	
	/** @property {String}  */
	HTML_ORDER_FORM_REQUIRED_FIELD_CSS : '.red',
	
	/** @property {String} HTML_CART_CLEAR_BTN_CSS селектор кнопок очистки полей мобильной версии сайта */
	HTML_CART_CLEAR_BTN_CSS : '.clear-datetime',
	
	/** @property {String} Селектор для кнопки оформления заказа для мобильной версии */
	HTML_MOBILE_CREATE_ORDER_BTN_ID : '#mCreateOrder',
	
	/** @property {String} Селектор для кнопки отправки формы */
	HTML_ORDER_FORM_BTN_ID : '#sendOrderFormBtn',
	
	/** @property {String} id инптуа суммы товаров в форме оплаты картами */
	HTML_CARD_PAYMENT_TOTAL_SUM_ID : '',
	
	/** @property {String}  */
	HTML_REQUEST_DRAFT_PROCESS_SIGN_ID : '#processDraftRequestStatus',
	
	/** @property  {String} id html элемента выбора автоплатежа, который надо скрывать или показывать в зависимости от выбранного типа оплаты вместе с кнопкой отправки формы оплаты картами*/
	HTML_RECURRENT_CHB_LABEL_ID : '#recurrentInputBlock',
	
	/** @property  {String} id html инптуа "Запомнить" */
	HTML_RECURRENT_CHB_ID : '#rememberMyCard',
	
	/** @property  {String} id html элемента отказа от автоплатежей, который надо скрывать или показывать в зависимости от выбранного типа оплаты вместе с кнопкой отправки формы оплаты картами*/
	HTML_RECURRENT_OFF_CHB_LABEL_ID : '#recurrentOffInputBlock',
	
	/** @property  {String} id html инптуа "Забыть" */
	HTML_RECURRENT_OFF_CHB_ID : '#forgetMyCard',
	
	/** @property {String} имя системного поля email формы оформления заказа    */
	SYSTEM_EMAIL_FIELD_NAME : 4,	
	
	/** @property {Number} needCheckOrderStatus Определяет необходимость запросов о статусе заказов  */
	needCheckOrderStatus : 0,
	
	/** @property {Number} statusOrderIsSended 1 если запрос статуса платежа отправлен  */
	statusOrderIsSended : 0,
	
	/** @property {Number} paymentId если определено, то это  идентификатор успешного платежа */
	
	/** @description {Boolean} checkOrderWithoutSaveTimestamp 1 когда не надо записывать момент получения номера черновика заказа, это возможно в одном варианте: когда параллельно ушел запрос в РФИ */
	checkOrderWithoutSaveTimestamp : 0,
	
	/** @property  {String} lastInitDraftFailError Последняя ошибка, призошедшая при попытке получить номер черновика */
	lastInitDraftFailError : '',
	
	/** @property  {Boolean} initDraftFailed true если при попытке получить номер черновика заказа произошла ошибка */
	initDraftFailed : false,
	
	/** @param {Boolean} recurrentNextMode когда есть recurrent_order_id  пользователь может выбрать оплату не картами. В таких случаях  recurrentNextMode =  false */
	
	/**  {Boolean} rfiCancelRecurrent true когда запрашиваем черновик заказа и попутно отказываемся от рекуррентных платежей */
	rfiCancelRecurrent : 0,

	/**  {Boolean} rfiCancelRecurrentWaitResult true когда надо начать процесс запросов обнуления recurrent_order_id  */
	rfiCancelRecurrentWaitResult : 0,

	/**  {Boolean} statusCancelRecurrentIsSended true когда отправлен запрос состояния обнуления recurrent_order_id  */
	statusCancelRecurrentIsSended : 0,


	/**
	 * @description 
	*/
	init:function(lib) {
		var o = this;
		o.Lib = FlipcatWebAppLibrary;
		if (lib instanceof Object) {
			for (var i in lib) {
				if (lib[i] instanceof Function && i != '_get') {
					o.Lib[i] = lib[i];
				}
			}
		}
		
		o.setListeners();
		o.setOrderButton();
		
	},
	/**
	 * @description Возвращает список товаров в формате  [{id, count, price}]
	*/
	grabItems:function() {
		var items = [], o = this;
		$(o.HTML_CART_ITEM_QUANTITY_CSS).each(function(i, j) {
			count = +$(j).text();
			count = count ? count : 1;
			price = $(j).parent().parent().find(o.HTML_CART_ITEM_PRICE_CSS).first().data('oneitemprice') * count;
			items.push({id:$(j).data('id'), count:count, price:price});
		});
		return items;
	},
	/**
	 * @description 
	*/
	setListeners:function() {
		//Обработка установки значения выбора в календаре
		$('.datepicker').datepicker().on('changeDate', function(e) {
			Flipcat.Placeholders.setValueExists();
			Flipcat.OrderFormStorage.cacheTextValue($(e.target));
		});
		var o = Flipcat.Cart;
		if (o.Lib.REQUEST_URI(1).split('/')[1] == 'cart') {
			o.Lib.storage('lastCartUrl', window.location.href.toString());
		}
		$(o.HTML_ORDER_FORM_TOGGLE_ID).click(o.showOrderForm);
		$(o.HTML_SEND_ORDER_BUTTON_ID).click(o.sendOrder);
		$(o.HTML_CART_HINT_ID).click(o.hideCartHint);
		$(o.HTML_REMOVE_FROM_CART_LINK_CSS).click(o.removeFromCart);
		$(o.HTML_CART_ITEM_QUANTITY_INC_BUTTON_CSS).click(o.incQuantityProductInCart);
		$(o.HTML_CART_ITEM_QUANTITY_DEC_BUTTON_CSS).click(o.decQuantityProductInCart);
		$(o.HTML_ORDER_FORM_ID).find('select').bind('change', o.onChangeOrderFormParam);
		$(o.HTML_MOBILE_CREATE_ORDER_BTN_ID).click(o.onMobileCreateOrderClick);
		o.cardPaymentButton.click(o.onClickCardPaymentButton);
		
		
		o.renderCountCart();
		o.setQuantityEachProductInCart();
		$(o.HTML_CART_CLEAR_BTN_CSS).click(o.onClickClearBtn);
		o.initCartLink();
		
		o.interval = setInterval(o.onInterval, 500);
		$(o.HTML_RECURRENT_CHB_ID).change(o.onChangeRecurrentChb);
		$(o.HTML_RECURRENT_OFF_CHB_ID).change(o.onUnsubscribeRecurrentChb);
		
	},
	onClickClearBtn:function(evt) {
		$(this).parent().find('input').val('');
		$(this).parent().find('input').blur();
		evt.preventDefault();
	},
	/**
	 * @description Устанавливает в качестве кнопки оформления заказа кнопку партнеров для оплаты картами,
	 * если в форме оформления заказа существует инпут выбора способа оплаты с вариантом "Оплата кредитной картой"
	*/
	setOrderButton:function() {
		var o = Flipcat.Cart;
		o.recurrentNextMode = false;
		if (o.isFormContaintsCardPaymentVariant()) {
			//если в форме по умолчанию не установлен способ оплаты картами
			if (!o.isCardPaymentVariantActive) {
				o.showAndEnableSendOrderButton();
				o.checkValidFormFields();
			}
			if (!+Flipcat.RFI_RECURRENT_ID) {
				o.replaceOrderButton();
				o.checkOrder(o.onCheckOrderData, o.onFailCheckOrderData);
			} else {
				o.enableNativeOrderButton();
				o.setRecurrentCheckboxMode();
			}
		} else {
			o.enableNativeOrderButton();
		}
	},
	/**
	 * @description Делает кнопку "Оформить заказ" (она показывается, когда форма не содержит инпута выбора способа платежа, либо когда выбран способ не использующий партнерский диалог оплаты картами и т п) кликабельной
	*/
	enableNativeOrderButton:function() {
		$(this.HTML_SEND_ORDER_BUTTON_ID).prop('disabled', false);
	},
	/**
	 * @description Обработка ответа на запрос с аргументом check
	*/
	onCheckOrderData:function(data) {
		var o = Flipcat.Cart, ts, values, Lib = o.Lib;
		if (o.isNeedAuth(data)) {
			return false;
		}
		o.setPartnerButtonDisabled();
		if (data.check && data.sys_order_id) {
			o.initDraftFailed = false;
			data.sys_order_id = parseInt(data.sys_order_id, 10);
			ts = parseInt(o.Lib.storage('draft_order_id'), 10);
			if (!isNaN(ts) && !isNaN(data.sys_order_id) && ts != data.sys_order_id) {
				o.Lib.storage('draft_order_id', data.sys_order_id);
			}
			ts = parseInt(o.Lib.storage('draft_order_id'), 10);
			if (isNaN(ts) && !isNaN(data.sys_order_id)) {
				o.Lib.storage('draft_order_id', data.sys_order_id);
			}
			if (o.checkOrderWithoutSaveTimestamp != 1) {
				o.draftOrderCreated = o.Lib.storage('draftOrderCreated', new Date().getTime());
			}
			o.checkOrderWithoutSaveTimestamp = 0;
			o.Lib.storage('orderIdUrl', null);
			o.resetOrderIdSended = 0;
			o.setRequestDraftProcessSign(0);
			o.lastInitDraftFailError = '';
			if (o.cardPaymentOrderIdInput[0]) {
				o.cardPaymentOrderIdInput.val(data.sys_order_id);
			}
			
			if (o.cardPaymentNameInput[0] && data.sys_order_id) {
				o.cardPaymentNameInput.val('Заказ номер ' + data.sys_order_id);
			}
			
			if (o.rfiCancelRecurrent) {
				o.onRfiCancelRecurrentData();
			}
			
			//если в форме по умолчанию не установлен споcоб оплаты картами
			o.setActualOrderButton();//TODO не надо ли там что-то сделать в связи с next?
			
			/*if (data.rfi_check) {
				o.dropPartnerFormField('check');
				o.addPartnerFormField('check', data.rfi_check);
			}*/
			
		} else {
			if (data.error) {
				o.setLastInitDraftFailError(data.error);
			} else {
				if (!(+data.sys_order_id)) {
					var iv = setInterval(function(){
						if (__('messages.unable_create_order_17') != 'messages.unable_create_order_17') {
							o.setLastInitDraftFailError( __('messages.unable_create_order_17') );
							clearInterval(iv);
						}
					}, 1000);
					
				} else {
					o.setLastInitDraftFailError( __('messages.refresh_and_send_order_again') );
				}
			}
			o.setActualOrderButton();
			o.cardPaymentButton.prop('disabled', true);
			o.initDraftFailed = true;
			
			o.hideRfiForm();
			
			o.Lib.storage('draft_order_id', 0);
			var t = new Date().getTime();
			o.requestPartnerForm = t;
			o.Lib.storage('requestPartnerForm', t);//На самом деле форма партнеров не запрашивалась, но так как не удалось получить id черновика заказа нам надо попытаться получить его заново
			o.Lib.storage('partnerFormValues', o.grabPartnerFormValues());
			o.resetOrderIdSended = 0;
			o.setRequestDraftProcessSign(0);
		}
	},
	/**
	 * @description Обработка ошибки запроса с аргументом check
	*/
	onFailCheckOrderData:function() {
		var o = Flipcat.Cart;
		o.resetOrderIdSended = 0;
		o.setRequestDraftProcessSign(0);
		Flipcat.Messages.fail(__('messages.refresh_and_send_order_again'));
	},
	/**
	 * @description Устанавливает кнопку формы оплаты через кредитную карту в кликабельное состояние
	*/
	setPartnerButtonEnabled:function() {
		var o = this;
		if (o.cardPaymentButton[0]) {
			o.cardPaymentButton.prop('disabled', false);
		}
	},
	/**
	 * @return {Boolean} true если в форме оформления заказа существует инпут выбора способа оплаты с вариантом "Оплата кредитной картой"
	*/
	isFormContaintsCardPaymentVariant:function() {
		var o = this, 
			Lib = o.Lib,
			item = $(o.HTML_ORDER_FORM_ID).find('[data-fieldname=card_payment]').first();
		if (item[0]) {
			o.isCardPaymentVariantActive = false;
			if (item[0].tagName == 'OPTION') {
				var select = item.parent();
				if (select[0] && select[0].tagName == 'SELECT') {
					if (select.val() == item[0].value || $.trim(select.val()) == $.trim(item[0].text)) {
						o.isCardPaymentVariantActive = true;
					}
				}
			}
			return true;
		}
		return false;
	},
	/**
	 * @description Заменяет "родную" кнопку Оформления заказа на кнопку формы оплаты кариами партнеров (РФИ)
	*/
	replaceOrderButton:function() {
		var o = this;
		if (o.cardPaymentButton[0]) {
			o.cardPaymentButton.removeClass('hide');
			$(o.HTML_SEND_ORDER_BUTTON_ID).addClass('hide');
			
			$(o.HTML_RECURRENT_CHB_ID).prop('checked', false);
			
			if (+Flipcat.RFI_RECURRENT_ID) {
				o.setRecurrentCheckboxMode();
			} else {
				$(o.HTML_RECURRENT_CHB_LABEL_ID).removeClass('hide');
			}
		}
	},
	/**
	 * @description Отправляет запрос на возможность оформления заказа
	 * @param {Boolean} reset если true, то будет отправлен доп. параметр, в результате черновик с существующим orderId будет удален и создан новый
	*/
	checkOrder:function(onSuccess, onFail, reset) {
		var o = Flipcat.Cart, Lib = o.Lib, requiredFieldIsValid = Lib.validateRequired(o.HTML_ORDER_FORM_ID),
			data = {}, price, count, orderId;
		
			o.grabFields(o.HTML_ORDER_FORM_ID, data);
			data.items = o.grabItems();
			data.check = 1;
			if (reset) {
				data.reset = 1;
			}
			if (o.rfiCancelRecurrent) {
				data.rfiCancelRecurrent = 1;
			}
			o.setOrderId(data);
			o.setResetFieldIfUrlChanged(data);
			Flipcat.AuthMarker.restoreMarker();
			//$(window).scrollTop(0);
			Lib._post(data, onSuccess, '/cart/order', onFail);
			
		return false;
	},
	/** 
	 * @description Отправить форму отправки заказа
	*/
	sendOrder:function() {
		var o = Flipcat.Cart, Lib = o.Lib, requiredFieldIsValid = Lib.validateRequired(o.HTML_ORDER_FORM_ID),
			data = {}, price, count;
		if (requiredFieldIsValid) {
			if (Lib.validateEmailAndPhone()) {
				o.disableNativeOrderButton();
				if (+Flipcat.RFI_RECURRENT_ID && o.recurrentNextMode && $(o.HTML_RECURRENT_OFF_CHB_ID).prop('checked')) {
					data.rfiCheck = 1;
					o.initNextRecurrentPayment();
				}
				o.grabFields(o.HTML_ORDER_FORM_ID, data);
				data.items = o.grabItems();
				o.setOrderId(data);
				Flipcat.AuthMarker.restoreMarker();
				$(window).scrollTop(0);
				Lib._post(data, o.onSendOrder, '/cart/order', function(){
					o.enableNativeOrderButton();
					Lib.defaultFail();
				});
			}
		}
		return false;
	},
	/** 
	 * @description Обработка ответа на отправку заказа
	*/
	onSendOrder:function(data) {
		var o = Flipcat.Cart, Lib = o.Lib;
		o.enableNativeOrderButton();
		if (o.isNeedAuth(data)) {
			return false;
		}
		
		$('#preloader').hide();
		if (data.success) {
			Lib.storage('draft_order_id', '');
			Lib.storage(o.STORAGE_ADD_CART_KEY + $('#shopId').val(), null);
			$(o.HTML_CART_LIST_ID).html('');
			$(o.HTML_CART_SUCCESS_ID).toggleClass('hide');
			
			var navH = $('div.navbar').first().height(),
				navH2 = $('section.breadcrumbs').first().height(),
				footH = $('#main-footer').height(),
				h = navH + navH2 + footH;
			
			$(o.HTML_CART_SUCCESS_ID).css('height', (Lib.getViewport().h - h) + 'px' );
			window.scrollTo(0, 0);
			Lib.messageSuccess(data.success);
			$(o.HTML_ORDER_FORM_ID).parent().addClass('hide');
			$(o.HTML_ORDER_FORM_ID).parent().parent().addClass('hide');
			$(o.HTML_ORDER_FORM_TOGGLE_ID).hide();
			Lib.storage( o.getShopId(), {} );
			Flipcat.AuthMarker.storeMarker();
			
			$('footer').remove();
			$(window).scrollTop(0);
			window.scrollTop = 0;
			
			if (Flipcat.Userscripts && Flipcat.Userscripts.run) {
				Flipcat.Userscripts.run('onOrderSended', arguments);
			}
			setTimeout(function(){
				window.location.href = $(Flipcat.WebClientAuth.HTML_HISTORY_BTN_ID).attr('href');
			}, 3 * 1000);
		} else if(data.error){
			var s = data.error, aMessages = [], i;
			if (data.messages instanceof Array) {
				for (i = 0; i < data.messages.length; i++) {
					if (typeof(data.messages[i]) == 'string') {
						aMessages.push(data.messages[i]);
					}
				}
			} else if (data.messages instanceof Object) {
				for (i in data.messages) {
					if (typeof(data.messages[i]) == 'string') {
						aMessages.push(data.messages[i]);
					}
				}
			}
			if (aMessages.length) {
				s += '\n' + aMessages.join("\n");
			}
			Flipcat.Messages.fail(s);
		}
	},
	/**
	 * @description Собрать все поля формы в объект data
	*/
	grabFields:function(id, data) {
		var o = this, Lib = o.Lib;
		$(id).find('input,select,textarea').each(function(i, inp) {
			var v = inp.type == 'checkbox' ? inp.checked : inp.value;
			var name = inp.name;
			
			if (inp.tagName == 'SELECT' && inp.getAttribute('data-fieldType') == 'priceDropDown') {
				var option = Lib.getOptionByValue(inp, v);
				//name = option.getAttribute('data-fieldName');
				//v = {label:option.getAttribute('data-fieldName'), value:$(option).data('price')};
				v = option.getAttribute('data-fieldName');
			}
			if (inp.type != 'radio' || inp.checked) {
				data[name] = v;
			}
		});
	},
	/** 
	 * @description Показать форму отправки заказа
	*/
	showOrderForm:function() {
		var o = this, h = $(o.HTML_ORDER_FORM_ID).parent();
		h.toggleClass('hide');
		h.parent().toggleClass('hide');
	},
	/** 
	 * @description Получить идентификатор магазина
	*/
	getShopId:function() {
		var o = this, Lib = o.Lib, aUrl = Lib.REQUEST_URI(1).split('/'), id;
		if(aUrl[1] == 'all_history' && "global_sid" in window) {
			id = window.global_sid;
			id = 'cart-' + id;
			return id;
		}
		
		var id = $(o.HTML_SHOP_ID_INP_ID).val();
		id = id ? id : 0;
		if (id) {
			id = 'cart-' + id;
		}
		return id;
	},
	/** 
	 * @description Добавление товара в корзину, обработка клика
	*/
	onAddToCart:function(evt) {
		evt.stopImmediatePropagation();
		var id, fail = 0, messages = [], s, o = Flipcat.Cart, Lib = o.Lib;
		$(this).parents('.fc-product-item').first().find('select').each(function(i, j) {
			if (! (j.value > 0)) {
				fail = 1;
				s = $(j).parents('.multiproduct-option').first().find('.multiproduct-option-title').first().text();
				s = __('messages.Require_select_parameter_') + ' ' + s;
				messages.push(s);
			}
		});
		if (fail) {
			Lib.messageFail(messages.join('\n'));
			return false;
		}
		id = this.getAttribute('data-id');
		var r = o.addToCart(id);
		return r;
	},
	/** 
	 * @description Добавление товара в корзину
	*/
	addToCart:function(id, quantity) {
		var o = Flipcat.Cart, Lib = o.Lib, storageKey = o.getShopId(), priceStorageKey, cart, cart_price, price, url = Lib.REQUEST_URI(1);

		if (!storageKey) {
			Flipcat.Messages.fail(__('Unable_add_product_to_cart'));
			return false;
		}
		cart = Lib.storage(storageKey);
		if (! (cart instanceof Object) ) {
			cart = {};
		}
		cart[id] = parseInt(cart[id]) ? parseInt(cart[id]) : 0;
		cart[id]++;
		if (quantity) {
			cart[id] = quantity;
		}
		Lib.storage(storageKey, cart);

		priceStorageKey = o.STORAGE_PRICE_CART_PREFIX + storageKey;
		cart_price = Lib.storage(priceStorageKey);
		price = $(o.HTML_ADD_TO_CART_LINK_CSS + "[data-id='" + id + "']").data('price');
		cart_price = parseInt(cart_price) ? parseInt(cart_price) : 0;
		cart_price += price;
		Lib.storage(priceStorageKey, cart_price);
		o.renderCountCart(cart);
		if (!quantity) {
			$(o.HTML_CART_HINT_ID).css('display', 'block');
			$(o.HTML_CART_HINT_HANDLE_ID).css('display', 'block');
			setTimeout(o.hideCartHint, 1000);
		}
		if (Flipcat.Userscripts && Flipcat.Userscripts.run) {
			Flipcat.Userscripts.run('onAddToCart', arguments);
		}
		return false;
	},
	/**
	 * @description
	 */
	checkPrice:function() {
		var o = this, Lib = o.Lib, url = Lib.REQUEST_URI(1), total = parseInt($(o.HTML_CART_TOTAL_SUM_ID).text()),
			priceStorageKey = o.STORAGE_PRICE_CART_PREFIX + o.getShopId(), price = Lib.storage(priceStorageKey);

		if (url =='/cart' && price && price != total) {
			Flipcat.Messages.success(__('messages.Product_price_changed'));
			Lib.storage(priceStorageKey, total);
		}
	},
	/** 
	 * @description
	*/
	removeFromCart:function() {
		var o = Flipcat.Cart, Lib = o.Lib, a = $(this),
			s = $('#shopId').val(), 
			storageKey = o.STORAGE_ADD_CART_KEY + s,
			priceStorageKey = 'price_'+storageKey, cart, id = a.data('id'), i, j,
			newCart = {}, price, removedPrice;
		if (!s) {
			Flipcat.Messages.fail(__('Unable_remove_product_from_cart'));
			return false;
		}
		cart = Lib.storage(storageKey);
		if (! (cart instanceof Object) ) {
			a.parents('article').first().remove();
			return false;
		}
		for (i in cart) {
			if (i != id) {
				newCart[i] = cart[i];
			}
		} 
		Lib.storage(storageKey, newCart);

		price = Lib.storage(priceStorageKey);
		if (price) {
			removedPrice = parseInt(a.parents('article').find(o.HTML_CART_ITEM_PRICE_CSS).text());
			Lib.storage(priceStorageKey, price - removedPrice);
		}
		o.renderCountCart(cart);
		a.parents('article').first().remove();
		o.setQuantityEachProductInCart();
		return false;
	},
	/** 
	 * @description Устанавливает количество отложенных товаров и ссылку на корзину
	*/
	renderCountCart:function(cart) {
		var o = Flipcat.Cart, Lib = o.Lib;
		if (o.forceClearCart()) {
			return;
		}
		if (!$(o.HTML_CART_QUANTITY_ID)[0]) {
			return;
		}
		var storageKey = o.getShopId(), j = 0, i, p = [], s;
		if (!storageKey) {
			return;
		}
		cart = cart ? cart : Lib.storage(storageKey);
		
		if (cart instanceof Object) {;
			for (i in cart) {
				p.push(i);
				j += cart[i];
			}
			$(o.HTML_CART_QUANTITY_ID).text(j);
			$(o.HTML_MOBILE_CART_QUANTITY_ID).text(j).removeClass('hide');
			if (j) {
				$(o.HTML_CART_ID).removeClass('hide');
				s = $(o.HTML_CART_LINK_ID).attr('href').split('?')[0];
				$(o.HTML_CART_LINK_ID).attr('href', s + '?i=' + p.join(',') + '&q=' + storageKey.replace('cart-', ''));
				$(o.HTML_MOBILE_CART_LINK_ID).attr('href', s + '?i=' + p.join(',') + '&q=' + storageKey.replace('cart-', ''));
			} else {
				$(o.HTML_CART_ID).addClass('hide');
				$(o.HTML_MOBILE_CART_QUANTITY_ID).addClass('hide');
			}
		}
	},
	/** 
	 * @description Установить для каждого товара в корзине его количество
	*/
	setQuantityEachProductInCart:function() {
		var o = Flipcat.Cart, Lib = o.Lib, list = $(o.HTML_CART_ITEM_QUANTITY_CSS), vPrices =  $(o.HTML_CART_ITEM_PRICE_CSS), 
			cart, total = 0, n, currency, priceStorageKey = 'price_' + o.getShopId(), price;
		$(o.HTML_CART_TOTAL_ROW_ID).addClass('hide');
		if (list[0]) {
			storageKey = o.getShopId();
			cart = Lib.storage(storageKey);
			if (cart instanceof Object) {
				list.each(function (i, j) {
					if (cart[$(j).data('id')]) {
						$(j).text(cart[$(j).data('id')]);
					}
				});
				if (vPrices[0]) {
					vPrices.each(function (i, j) {
						if (cart[$(j).data('id')]) {
							n = cart[$(j).data('id')] * $(j).data('oneitemprice');
							total += n;
							$(j).text(round(n, 2));
							
							if(!currency) {
								n = String(round(n, 2));
								currency = $.trim( $(j).parent().html() ).replace(new RegExp(n,'g'), '');
								currency = currency.replace(o.HTML_CART_ITEM_PRICE_CSS.replace('.', ''), o.HTML_CART_ITEM_PRICE_CSS);
								currency = currency.replace(/<i[^<]+<\/i>/gi, '');
							}
						}
					});
					
					$('select[data-fieldtype=priceDropDown]').each(function(i, j){
						i =  Lib.getOptionByText(j, j.value);
						if (i && parseFloat($(i).data('price'))) {
							total += $(i).data('price');
						}
					});
					
					if (+total > 0) {
						$(o.HTML_CART_TOTAL_ROW_ID).removeClass('hide');
					}

					price = Lib.storage(priceStorageKey);
					if (!price) {
						Lib.storage(priceStorageKey, total);
					}
					if (o.cardPaymentSumInput[0]) {
						o.cardPaymentSumInput.val(parseFloat(total));
					}
					$(o.HTML_CART_TOTAL_SUM_ID).text(round(total, 2));
					$(o.HTML_CART_TOTAL_CURRENCY_ID).html(currency);
				}
			}
		}
	},
	/** 
	 * @description Увеличить количество товара в корзине
	*/
	incQuantityProductInCart:function(e) {
		var o = Flipcat.Cart, Lib = o.Lib;
		e.stopImmediatePropagation();
		var div = $(this).parent().find(o.HTML_CART_ITEM_QUANTITY_CSS).first(), n = +div.text();
		if (isNaN(n)) {
			n = 0;
		}
		n++;
		o.setQuantityProductInCart(div.data('id'), n);
		o.setQuantityEachProductInCart();
	},
	/** 
	 * @description Принудительно очищает корзину если &ccv= в сссылке на скрипт не равен сохраненному
	*/
	forceClearCart:function() {
		if (!window.localStorage) {
			return false;
		}
		var o = this, Lib = o.Lib, 
			ls = document.getElementsByTagName('script'), i, j, k,
			n = 0, cmd, store = +localStorage.getItem('ccv');
		for (i = 0; i < ls.length; i++) {
			cmd = +Lib._GET('ccv', 0, ls[i].getAttribute('src'));
			if (cmd && cmd != store ) {
				for (j = 0; j < localStorage.length; j++) {
					k = localStorage.key(j);
					if (~k.indexOf('cart')) {
						localStorage.removeItem(k);
						n++;
					}
				}
				localStorage.setItem( 'ccv',  cmd);
				break;
			}
		}
		if (n) {
			return true;
		}
		return false;
	},
	/** 
	 * @description Уменьшить количество товара в корзине
	*/
	decQuantityProductInCart:function(e) {
		e.stopImmediatePropagation();
		var o = Flipcat.Cart, Lib = o.Lib, 
			div = $(this).parent().find(o.HTML_CART_ITEM_QUANTITY_CSS).first(), n = +div.text();
		if (isNaN(n)) {
			n = 2;
		}
		n--;
		if (n < 1) {
			n = 1;
		}
		o.setQuantityProductInCart(div.data('id'), n);
		o.setQuantityEachProductInCart();
	},
	/** 
	 * @description Установка количества заказанных товаров
	 * @param {Number} id
	 * @param {Number} quantity
	*/
	setQuantityProductInCart:function(id, n) {
		var o = Flipcat.Cart, Lib = o.Lib, storageKey = o.getShopId(), priceStorageKey = 'price_' + storageKey,
			cart = Lib.storage(storageKey), cart_price = Lib.storage(priceStorageKey), price, diff;
		if ( !(cart instanceof Object ) ) {
			cart = {};
		}
		diff = n - cart[id];
		cart[id] = n;
		Lib.storage(storageKey, cart);

		if (cart_price) {
			price = parseInt($(o.HTML_CART_ITEM_PRICE_CSS + "[data-id='" + id + "']").data('oneitemprice'));
			Lib.storage(priceStorageKey , cart_price + (price * diff));
		}
	},
	/**
	 * @description В мобильной версии, если в корзине нет товаров, выводить алерт Корзина пуста 
	*/
	onMobileCreateOrderClick:function() {
		var o = Flipcat.Cart, Lib = o.Lib, storageKey = o.getShopId(),
			cart = Lib.storage(storageKey);
		if (count(cart) == 0) {
			Flipcat.Messages.fail(__('messages.Cart_empty_message'));
			return false;
		}
		return true;
	},
	/**
	 * @description Скрыть уведомление вида "В корзину добавлено  5 товаров"
	*/
	hideCartHint:function() {
		var o = this;
		$(o.HTML_CART_HINT_ID).css('display', 'none');
		$(o.HTML_CART_HINT_HANDLE_ID).css('display', 'none');
	},
	/** 
	 * @description Увеличивает стоимость, если у инпута есть поле.
	 * 				Скрывает либо показывает форму оплаты картами, если выбраный опшн имеет data-fieldname="card_payment"
	*/
	onChangeOrderFormParam:function(evt) {
		var o = Flipcat.Cart, Lib = o.Lib, sel = evt.target,
			val = sel.value, price,
			option = price = Lib.getOptionByValue(sel, val), n;
		if (!price) {
			price = Lib.getOptionByText(sel, val);
		}
		if (price) {
			price = parseFloat($(price).data('price'));
			price = price ? price : 0;
		}
		if (price !== null) {
			o.setQuantityEachProductInCart();
		}
		if (option) {
			o.showCardPaymentButton(option);
		}
	},
	/** 
	 * @description Показать или скрыть кнопку Оплатить кредитной картой в зависимости от того, выбран ли способ оплаты кредитной картой 
	*/
	showCardPaymentButton:function(option){
		var select = $(option).parent(), i, isCardPaymentSelect = 0,
			o = Flipcat.Cart, s = 'hide';
		for (i = 0; i < select[0].options.length; i++) {
			if(select[0].options[i].hasAttribute('data-fieldname') && select[0].options[i].getAttribute('data-fieldname') == 'card_payment') {
				isCardPaymentSelect = 1;
				break;
			}
		}
		if (isCardPaymentSelect) {
			if (option.hasAttribute('data-fieldname') && option.getAttribute('data-fieldname') == 'card_payment') {
				//show
				if (!+Flipcat.RFI_RECURRENT_ID) {
					o.showAndEnableCardPaymentButton();
					o.checkValidFormFields();
				} else {
					o.showAndEnableSendOrderButton();
					o.setRecurrentCheckboxMode();
				}
			} else {
				//hide
				o.showAndEnableSendOrderButton();
				o.setRecurrentCheckboxMode();
			}
		}
	},
	initCartLink:function() {
		var o = Flipcat.Cart;
		$(o.HTML_ADD_TO_CART_LINK_CSS).click(o.onAddToCart);
	},
	/**
	 * @description Делает кнопку "Оформить заказ" (она показывается, когда форма не содержит инпута выбора способа платежа, либо когда выбран способ не использующий партнерский диалог оплаты картами и т п) disabled
	*/
	disableNativeOrderButton:function() {
		$(this.HTML_SEND_ORDER_BUTTON_ID).prop('disabled', true);
	},
	/**
	 * @description Устанавливает кнопку формы оплаты через кредитную карту в состояние disabled
	*/
	setPartnerButtonDisabled:function() {
		var o = this;
		if (o.cardPaymentButton[0]) {
			o.cardPaymentButton.prop('disabled', true);
		}
	},
	/**
	 * @description Показывает и делает кликабельной кнопку Оплатить картой, соотв. скрывает и делает некликабельной кнопку Оформить заказ
	*/
	showAndEnableCardPaymentButton:function(){
		var o = this, s = 'hide';
		if (o.cardPaymentButton[0]) {
			o.cardPaymentButton.removeClass(s);
			if (!o.rememberMyDataChecked != 0) {
				$(o.HTML_RECURRENT_CHB_ID).prop('checked', false);
			}
			
			if (+Flipcat.RFI_RECURRENT_ID) {
				o.setRecurrentCheckboxMode();
			} else {
				$(o.HTML_RECURRENT_CHB_LABEL_ID).removeClass(s);
			}
		}
		$(o.HTML_SEND_ORDER_BUTTON_ID).addClass(s);
		o.disableNativeOrderButton();
		o.setPartnerButtonEnabled();
	},
	/**
	 * @description Показывает и делает кликабельной кнопку Оформить заказ, соотв. скрывает и делает некликабельной кнопку Оплатить картой
	*/
	showAndEnableSendOrderButton:function(){
		var o = this, s = 'hide';
		if (o.cardPaymentButton[0]) {
			o.cardPaymentButton.addClass(s);
			$(o.HTML_RECURRENT_CHB_LABEL_ID).addClass(s);
			o.setRecurrentCheckboxMode();
		}
		$(o.HTML_SEND_ORDER_BUTTON_ID).removeClass(s);
		o.enableNativeOrderButton();
		o.setPartnerButtonDisabled();
	},
	/**
	 * @description Устанавливает в данные о заказе идентификатор черновика заказа
	*/
	setOrderId:function(data) {
		var o = this;
		orderId = o.Lib.storage('draft_order_id');
		if (parseInt(orderId)) {
			data.orderId = orderId;
		}
	},
	/**
	 * @description Ежесекундный интервал обработка
	*/
	onInterval:function() {
		var o = Flipcat.Cart;
		if (o.isFormContaintsCardPaymentVariant()) {
			o.checkValidFormFields();
			o.checkActualOrderId();
			if (o.rfiCancelRecurrentWaitResult) {
				o.checkCancelRecurrentStatus();
			}
		}
	},
	/**
	 * @description Вызывается по onInterval Проверяет, все ли необходимые поля формы заказа оформлены, в зависмости от этого делает доступной или недоступной кнопку оплаты картами
	*/
	checkValidFormFields:function(){
		var o = Flipcat.Cart, iEmails = {}, Lib = o.Lib;
		orderFieldIsValid = Lib.validateRequired(o.HTML_ORDER_FORM_ID) && Lib.validateEmailAndPhone();
		if (orderFieldIsValid && !o.resetOrderIdSended && !o.initDraftFailed) {
			if (o.cardPaymentEmailInput[0]) {
				o.cardPaymentEmailInput.val('');
			}
			$(o.HTML_ORDER_FORM_ID).find('input[name=' + o.SYSTEM_EMAIL_FIELD_NAME + ']').each(function(i, j){
				iEmails[j.name] = j.value;
				if (o.cardPaymentEmailInput[0] && $.trim(j.value)) {
					o.cardPaymentEmailInput.val($.trim(j.value));
				}
			});
			$(o.HTML_ORDER_FORM_ID).find('input[type=email]').each(function(i, j){
				iEmails[j.name] = j.value;
				if (o.cardPaymentEmailInput[0] && $.trim(j.value)) {
					o.cardPaymentEmailInput.val($.trim(j.value));
				}
			});
			if (iEmails[o.SYSTEM_EMAIL_FIELD_NAME] && $.trim(iEmails[o.SYSTEM_EMAIL_FIELD_NAME])) {
				if (o.cardPaymentEmailInput[0]) {
					o.cardPaymentEmailInput.val($.trim(iEmails[o.SYSTEM_EMAIL_FIELD_NAME]));
				}
			}
			o.setPartnerButtonEnabled();
		} else {
			o.setPartnerButtonDisabled();
			if(orderFieldIsValid && !o.resetOrderIdSended) {
				o.resetOrderIdSended = 1;
				o.checkOrder(o.onCheckOrderData, o.onFailCheckOrderData);
			}
		}
	},
	/**
	 * @description Дополнительная обработка клика на кнопке Оформить заказ
	 *              (с целью предотвратить дубль заказа в системе РФИ и начать запросы с проверкой статуса платежа)
	*/
	onClickCardPaymentButton:function() {
		setTimeout(function() {
			var t = new Date().getTime(), o = Flipcat.Cart;
			o.requestPartnerForm = t;
			o.Lib.storage('requestPartnerForm', t);
			o.Lib.storage('partnerFormValues', o.grabPartnerFormValues());
			if (o.Lib.validateRequired() && o.Lib.validateEmailAndPhone()) {
				o.checkOrderWithoutSaveTimestamp = 1;
				o.checkOrder(o.onCheckOrderData, o.onFailCheckOrderData);
			} else {
				o.hideRfiForm();
				o.checkOrder(o.onCheckOrderData, o.onFailCheckOrderData, 1);
				setTimeout(function(){Flipcat.Messages.fail(__('messages.Fill_fields_and_press_createOrder'))}, 500);
			}
		}, 500);
	},
	/**
	 * @description Вызывается по onInterval Проверяет, не изменились ли значения в форме rfi при отправленом уже в их систему orderId, в зависимости от этого делает доступной или недоступной кнопку оплаты картами и запрашивает новый orderId удаляя неактуальный
	*/
	checkActualOrderId:function() {
		var o = o = Flipcat.Cart, sf, orderIdUrl = {};
		if (o.dbgCheckActualOrderId) {
			return;
		}
		o.dbgCheckActualOrderId = 1;
		if (!o.draftOrderCreated) {
			o.draftOrderCreated = o.Lib.storage('draftOrderCreated');
		}
		if (!o.requestPartnerForm) {
			o.requestPartnerForm = o.Lib.storage('requestPartnerForm');
		}
		o.draftOrderCreated  = parseInt(o.draftOrderCreated, 10);
		o.requestPartnerForm = parseInt(o.requestPartnerForm, 10);
		if (!isNaN(o.draftOrderCreated) && !isNaN(o.requestPartnerForm)) {
			if (o.requestPartnerForm > o.draftOrderCreated) {
				//o.needCheckOrderStatus = 1;TODO remove
				orderIdUrl[ o.Lib.storage('draft_order_id') ] = window.location.href;
				o.Lib.storage('orderIdUrl', orderIdUrl);
				sf = o.Lib.storage('partnerFormValues');
				sf = (sf instanceof Object) ? sf[o.Lib.storage('draft_order_id')] : null;
				if (sf instanceof Object) {
					if (o.partnerDataIsChanged(sf)) {
						if (!o.resetOrderIdSended) {
							o.setRequestDraftProcessSign(1);
							o.resetOrderIdSended = 1;
							o.setPartnerButtonDisabled();
							setTimeout(function(){
								o.checkOrder(o.onCheckOrderData, o.onFailCheckOrderData, 1);
							}, 5*1000);
						}
					}
				}
			}
		}
		o.dbgCheckActualOrderId = 0;
	},
	/**
	 * @see checkOrder
	 * @description если у нас есть   и текущий url не совпадает с сохраненным по этому orderId кстьанавливает в данных требование reset = 1
	*/
	setResetFieldIfUrlChanged:function(data) {
		var o = this, url = o.Lib.storage('orderIdUrl');
		if (+data.orderId) {
			url = url ? url[orderId] : null;
		} else {
			url = null;
		}
		if (+data.orderId && url && url != window.location.href) {
			data.reset = 1;
		}
	},
	/**
	 * @description Не уносить далеко от следующей.
	 * @return {Boolean} true когда данные изменились
	*/
	partnerDataIsChanged:function(sf) {
		var o = this;
		if(
			(sf.email   != o.cardPaymentEmailInput.val())
			|| (sf.name != o.cardPaymentNameInput.val())
			|| (sf.sum  != o.cardPaymentSumInput.val())
			|| (sf.recurrent != $(o.HTML_RECURRENT_CHB_ID).prop('checked'))
			|| (sf.recurrentOff != $(o.HTML_RECURRENT_OFF_CHB_ID).prop('checked'))
			) {
			return true;
		}
		return false;
	},
	/**
	 * @description Не уносить далеко от предыдущей
	*/
	grabPartnerFormValues:function() {
		var o = this, storeFields = {}, sf = {};
		storeFields.name    = o.cardPaymentNameInput.val();
		storeFields.email   = o.cardPaymentEmailInput.val();
		storeFields.sum     = o.cardPaymentSumInput.val();
		storeFields.recurrent = $(o.HTML_RECURRENT_CHB_ID).prop('checked');
		storeFields.recurrentOff = $(o.HTML_RECURRENT_OFF_CHB_ID).prop('checked');
		sf[o.Lib.storage('draft_order_id')] = storeFields;
		return sf;
	},
	/**
	 * @description Скрыть форму РФИ
	*/
	hideRfiForm:function() {
		$.colorbox.close();//Скрыть форму РФИ
	},
	isNeedAuth:function(data) {
		var o = this, Lib = o.Lib;
		if (data.needAuth) {
			Lib.messageSuccess(__('messages.Authentication_required_for_order'));
			$(Flipcat.WebClientAuth.HTML_LOGIN_MODAL_ID).modal('show');
			$.cookie('ar', window.location.href, {expires:window.Flipcat.AuthMarker.expires, path: '/'});
			return true;
		}
		return false;
	},
	/**
	 * @description Установить признак выполнения запроса для получения данных о id черновика
	*/
	setRequestDraftProcessSign:function(on) {
		var v = on, m = !v ? 'addClass' : 'removeClass', o = Flipcat.Cart, h = 'hide';
		if (o.cardPaymentButton.hasClass(h)) {
			return;
		}
		$(o.HTML_REQUEST_DRAFT_PROCESS_SIGN_ID)[m](h);
	},
	/**
	 * @description Устанавливает кнопку, в соответствии с тем, первый элемент в списке выбора оплаты Оплата картами или нет
	*/
	setActualOrderButton:function() {
		var o = this;
		o.isFormContaintsCardPaymentVariant();
		if (!o.isCardPaymentVariantActive) {
			o.showAndEnableSendOrderButton();
		} else {
			o.setPartnerButtonEnabled();
			o.checkValidFormFields();
			o.showAndEnableCardPaymentButton();
		}
	},
	/**
	 * @description Запоминает последнюю ошибку произошедшую при инициализации платежа. Если ошибка изменилась по сравнению с предыдущей, выводит её.
	*/
	setLastInitDraftFailError:function(s) {
		var o = Flipcat.Cart;
		if (o.lastInitDraftFailError != s) {
			Flipcat.Messages.fail(s);
			o.lastInitDraftFailError = s;
		}
	},
	/**
	 * @description Смена значения в чекбоксе рекуррентных платежей
	*/
	onChangeRecurrentChb:function() {
		var o = Flipcat.Cart;
		if ($(o.HTML_RECURRENT_CHB_ID).prop('checked')) {
			o.initRecurrentPayment();
			o.rememberMyDataChecked = 1;
		} else {
			o.flushRecurrentPayment();
			o.rememberMyDataChecked = 0;
		}
	},
	/**
	 * @description Добавляет в форму РФИ поля, необходимые для осуществления первого рекуррентного платежа
	*/
	initRecurrentPayment:function() {
		var o = this, i, j = o.initRecurrentPaymentFieldList();
		o.flushRecurrentPayment();
		for (i = 0; i < j.length; i++) {
			o.addPartnerFormField(j[i].name, j[i].val);
		}
	},
	/**
	 * @description 
	*/
	initNextRecurrentPayment:function() {
		var o = this, i, j = o.initRecurrentNextPaymentFieldList();
		o.flushRecurrentPayment();
		for (i = 0; i < j.length; i++) {
			o.addPartnerFormField(j[i].name, j[i].val);
		}
	},
	/**
	 * @description Удаляет из формы РФИ поля, необходимые для осуществления первого рекуррентного платежа
	*/
	flushRecurrentPayment:function() {
		var o = this, i, j = o.initRecurrentPaymentFieldList();
		for (i = 0; i < j.length; i++) {
			o.dropPartnerFormField(j[i].name);
		}
		j = o.initRecurrentNextPaymentFieldList();
		for (i = 0; i < j.length; i++) {
			o.dropPartnerFormField(j[i].name);
		}
		o.dropPartnerFormField('check');
	},
	/**
	 * @description Добавляет в форму РФИ поле с именем и id name, value = val
	*/
	addPartnerFormField:function(name, val) {
		var o = this, s = '<input type="hidden" value="{v}" id="{n}" name="{n}">';
		s = s.replace('{v}', val);
		s = s.replace(/\{n\}/gi, name);
		o.cardPaymentForm.append($(s));
	},
	/**
	 * @description Удаляет из формы РФИ поле с именем и id name
	*/
	dropPartnerFormField:function(name) {
		var o = this, i;
		i = o.cardPaymentForm.find('input[name=' + name + ']');
		i.remove();
	},
	/** @description {Array} поля которые необходимо добавить в форму РФИ для того, чтобы создать первый рекуррентный платеж */
	initRecurrentPaymentFieldList: function(){
		var id = +Flipcat.RFI_SERVICE_ID,
			link = FlipcatWebAppLibrary.HTTP_HOST() + '/info/recurrent_rules';
		return [
		{name: 'payment_type',  val: Flipcat.Cart.SPG_TYPE},
		{name: 'recurrent_type', val:'first'},
		{name: 'recurrent_comment', val:'Test'},
		{name: 'recurrent_url',  val: link},
		{name: 'recurrent_period', val:'byrequest'},
		{name: 'version', val:'2.0'},
		{name: 'service_id', val:id}
		];
	},
	initRecurrentNextPaymentFieldList:function(){
		var id = +Flipcat.RFI_SERVICE_ID, recurrentId = +Flipcat.RFI_RECURRENT_ID,
			link = FlipcatWebAppLibrary.HTTP_HOST() + '/info/recurrent_rules';
		return [
		{name: 'payment_type',  val: Flipcat.Cart.SPG_TYPE},
		{name: 'recurrent_type', val:'next'},
		{name: 'recurrent_order_id', val:recurrentId},
		{name: 'background',  val:1},
		{name: 'recurrent_period', val:'byrequest'},
		{name: 'version', val:'2.0'},
		{name: 'service_id', val:id}
		];
	},
	/**
	 * @description Показать или скрыть чекбокс отписки от рекуррентных платежей. Соответственно устанавливается поле  recurrentNextMode
	*/
	setRecurrentCheckboxMode:function() {
		var o = Flipcat.Cart, label = $(o.HTML_RECURRENT_OFF_CHB_LABEL_ID),
			chb = $(o.HTML_RECURRENT_OFF_CHB_ID);
		o.isFormContaintsCardPaymentVariant();
		if (o.isCardPaymentVariantActive && +Flipcat.RFI_RECURRENT_ID) {
			label.removeClass('hide');
			o.recurrentNextMode = true;
			if (!chb.prop('disabled')) {
				chb.prop('checked', true)
			}
		} else {
			label.addClass('hide');
			o.recurrentNextMode = false;
		}
	},
	/**
	 * @description Обработка клика на чекбоксе для отказа от рекуррентных платежей
	*/
	onUnsubscribeRecurrentChb:function() {
		var o = Flipcat.Cart;
		if ($(o.HTML_RECURRENT_OFF_CHB_ID).prop('checked') == true) {
			return;
		}
		$(o.HTML_RECURRENT_CHB_ID).prop('disabled', true);
		$(o.HTML_RECURRENT_OFF_CHB_ID).prop('disabled', true);
		o.disableNativeOrderButton();
		o.setPartnerButtonDisabled();
		Flipcat.RFI_RECURRENT_ID = 0;
		o.recurrentNextMode = false;
		o.flushRecurrentPayment();
		o.rfiCancelRecurrent = 1;
		o.checkOrder(o.onCheckOrderData, o.onFailCheckOrderData);
	},
	/**
	 * @description Запрос на отписку от рекуррентных платежей успешно отправлен на наш сервер - выполняем дополнительные действия чсвязанные с этим
	*/
	onRfiCancelRecurrentData:function() {
		var o = this;
		o.enableNativeOrderButton();
		o.setPartnerButtonEnabled();
		o.rfiCancelRecurrentWaitResult = 1;
		o.setRecurrentCheckboxMode();
		$(o.HTML_RECURRENT_CHB_ID).removeClass('hide');
	},
	/**
	 * @description Обработчик интервала, запрашивает при необходимости статус отписки от рекуррентных платежей
	*/
	checkCancelRecurrentStatus:function() {
		var o = Flipcat.Cart, data = {};
		if(o.rfiCancelRecurrentWaitResult && o.statusCancelRecurrentIsSended != 1) {
			o.statusCancelRecurrentIsSended = 1;
			o.Lib._post(data, o.onCancelRecurrentStatusData, '/cancelrecurrentstatus', o.onCancelRecurrentStatusDataFail);
		}
	},
	/**
	 * @description Обработка ответа сервера с состоянием отписки от рекуррентного платежя
	*/
	onCancelRecurrentStatusData:function(data) {
		var o = Flipcat.Cart;
		setTimeout(function(){o.statusCancelRecurrentIsSended = 0;}, 10 * 1000);
		if (+data.canceled) {
			o.rfiCancelRecurrentWaitResult = 0;
			$(o.HTML_RECURRENT_OFF_CHB_ID).prop('disabled', false);
			$(o.HTML_RECURRENT_CHB_ID).prop('disabled', false);
		}
	},
	/**
	 * @description
	*/
	onCancelRecurrentStatusDataFail:function() {
		var o = Flipcat.Cart;
		setTimeout(function(){o.statusCancelRecurrentIsSended = 0;}, 10 * 1000);
	}
};




