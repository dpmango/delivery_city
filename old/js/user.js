/** @class Управление настройками пользователя */
/** TODO js относящийся к настройкам ползователя в егог личном кабинете (/profile)  тоже логично перенести сюда*/
window.Flipcat = window.Flipcat || {};
/**
 * @object Управление настроками пользователя, завязанными на метку авторизации
*/
Flipcat.User = {
	/** @property {String}  HTML_INPUT_CHOOSE_SHIPPING_TYPE_DELIVERY_ID id инпута выбора типа доставки Доставка */
	HTML_INPUT_CHOOSE_SHIPPING_TYPE_DELIVERY_ID: '#delivery',
	
	/** @property {String}  HTML_INPUT_CHOOSE_SHIPPING_TYPE_PICKUP_ID id инпута выбора типа доставки Самовывоз */
	HTML_INPUT_CHOOSE_SHIPPING_TYPE_PICKUP_ID: '#pickup',
	
	/** @property {String}  HTML_INPUT_MOBILE_CHOOSE_SHIPPING_TYPE_DELIVERY_ID id инпута выбора типа доставки Доставка в мобилной версии */
	HTML_INPUT_MOBILE_CHOOSE_SHIPPING_TYPE_DELIVERY_ID: '#mDelivery',
	
	/** @property {String}  HTML_INPUT_MOBILE_CHOOSE_SHIPPING_TYPE_PICKUP_ID id инпута выбора типа доставки Самовывоз  в мобилной версии*/
	HTML_INPUT_MOBILE_CHOOSE_SHIPPING_TYPE_PICKUP_ID: '#mPickup',
	
	/**
	 *@param {Object} некоторые функции из app.js @see app.js initApp()
	*/
	init:function(lib) {
		var o = Flipcat.User;
		o.lib = lib;
		o.setListeners();
	},
	/****/
	setListeners:function() {
		var o = this;
		o.setChooseShippingTypeListeners();
	},
	/****/
	setChooseShippingTypeListeners:function() {
		var o = this;
		$(o.HTML_INPUT_CHOOSE_SHIPPING_TYPE_DELIVERY_ID).bind('change', o.onChooseShippingType);
		$(o.HTML_INPUT_CHOOSE_SHIPPING_TYPE_PICKUP_ID).bind('change', o.onChooseShippingType);
		
		$(o.HTML_INPUT_MOBILE_CHOOSE_SHIPPING_TYPE_DELIVERY_ID).bind('change', o.onChooseShippingType);
		$(o.HTML_INPUT_MOBILE_CHOOSE_SHIPPING_TYPE_PICKUP_ID).bind('change', o.onChooseShippingType);
	},
	/**
	 * @description
	*/
	onChooseShippingType:function(evt) {
		var o = Flipcat.User, type = evt.target.id;
		type = type.replace('mD', 'd').replace('mP', 'p');
		o.lib._post({type:type}, o.onSetShippingTypeResponse, '/profile/setshippingtype', o.onFailSetShippingTypeResponse);
	},
	/**
	 * @description Неудачный ответ от сервера при сохранении типа доставки
	*/
	onFailSetShippingTypeResponse:function(){
		Flipcat.User.lib.messageFail(__('Unierror'));
	},
	/**
	 * @description Ответ от сервера при сохранении типа доставки
	*/
	onSetShippingTypeResponse:function(data){
		if (data.error) {
			if (data.message) {
				Flipcat.User.lib.messageFail(data.message);
			} else {
				Flipcat.User.lib.messageFail(__('Unierror'));
			}
			return;
		}
		//window.location.reload();
		//FLipcat.User.lib.messageSuccess();
	}
};

