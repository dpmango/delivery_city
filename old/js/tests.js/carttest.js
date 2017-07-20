/** @class Тест отправки данных о заказанных товарах из формы заказа */
/** Внимание! все поля начинающиеся не с _  сохраняются в localStorage  и их значения восстанавливаются оттуда при загрузке страницы */
window.Flipcat = window.Flipcat || {};
/**
 * @object Тесты фронтенд логики
*/
Flipcat.Tests = Flipcat.Tests || {};

/**
 * @description Проверяет, удается ли получить данные о товарах корзины при вызове Cart.grabItems
*/
Flipcat.Tests.cart_testGrabItems = function() {
	var url = window.location.href, Lib = FlipcatWebAppLibrary, o = this;
	if (Lib.REQUEST_URI(1) != '/cart') {
		if(o.isMainPage(url)) {
			o.gotoNextCategory();
		} else if(o.isAgregatorCategoriesPage()){
			o.gotoNextCategory();
		} else if(o.isShoplistPage()) {
			o.gotoInNextShop();
		} else if (o.isProductPage()) {
			if (o._cartIsEmpty()) {
				o.addProductInCart();
			}
			o.gotoCartPage();
		}
	} else {
		o._cartTestGrabItems();//TODO
		o.incrementTask();//TODO увеличивает taskCurrentTest, если при этом вышли за пределы длины taskTestsList увеличиваем currentTask, сохраняем и переходим на главную
	}
};


/**
 * @description Проверяет, удается ли получить данные о товарах корзины при вызове Cart.grabItems
*/
Flipcat.Tests._cartTestGrabItems = function(){
	var o = Flipcat.Cart.grabItems(), i;
	for (i  = 0; i < o.length; i++) {
		if (
			isNaN(o[i].count)
			|| isNaN(o[i].id)
			|| isNaN(o[i].price)
		) {
			this.addError('Невозможно оформить заказ, на сервер будут отправлены count = ' + o[i].count + ', id = ' + o[i].id + ', price = ' + o[i].price);
		}
	}
};
