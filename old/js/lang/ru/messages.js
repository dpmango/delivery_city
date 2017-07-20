var Lang = {
	'Incorrect_email' : 'Некорректный email',
	'Incorrect_phone' : 'Некорректный телефон',
	'Field_' : 'Поле ',
	'Unable_remove_product_from_cart' : 'Невозможно удалить товар из корзины',
	'Unierror' : 'Произошла ошибка, попробуйте еще раз позже.',
	'Any' : 'Не важно',
	'You_need_set_your_location'   : 'Укажите своё местоположение!',
	'messages.Empty_shop_list_for_location'   : 'К сожалению для вашего адреса отсутствуют магазины',
	'messages.Authentication_required_for_order'	: 'Для оформления заказа Вам надо авторизоваться',
	'_required__for_fill' : ' обязательно для заполнения'
};
var LangLoader = {
	init:function(lib) {
		lib._get(LangLoader.onLoadLang, '/lang', LangLoader.onFailLoadLang);
	},
	onFailLoadLang: function(){
	},
	onLoadLang    : function(data, i, j){
		for (i in data) {
			for (j in data[i].values) {
				if (data[i].scope) {
					Lang[ data[i].scope + '.' + j ] = data[i].values[j];
				}
			}
		}
		if (data.currenciesMap) {
			Flipcat.currenciesMap = data.currenciesMap;
		}
	}
};
function __(s, placeholders) {
	if (Lang[s]) {
		if (placeholders) {
			var q = Lang[s], i;
			for (var i in placeholders) {
				q = q.replace(i, placeholders[i]);
			}
			return q;
		}
		return Lang[s];
	}
	return s;
}
function trans(s) {
	return __(s);
}
