/** @class Тесты фронтенд логики. Это "движок", сами тесты писать см например carttest.
 * запуск: ввод в браузере url вида /?test=all&starttest=1 или /?test=cart&starttest=1
 *  и смотри в консоль браузера.
 * 
 * Для добавления новой группы тестов в этом  файле добавить в _tasks  и _allow_tasks имя группы
 *  а в файле, созданом  по образцу carttest добавить функции с именами вида ИМЯ_ГРУППЫ_test****
 *  Кстати, добавить в _tasks  и _allow_tasks имя группы можно сразу в этом файле
*/
/** Внимание! все поля начинающиеся не с _  сохраняются в localStorage  и их значения восстанавливаются оттуда при загрузке страницы */
window.Flipcat = window.Flipcat || {};
/**
 * @object Тесты фронтенд логики
*/
Flipcat.Tests = {
	/** @property {Array} _tasks  копия allow_tasks баз all */
	_tasks : ['cart'], 
	
	/** @property {Array} _allow_tasks */
	_allow_tasks : {'all' : 1, 'cart':1},
	
	/** @property {String} текущая задача*/
	currentTask : '', 
	
	/** @property {Array} id категории агрегатора*/
	agregatorCategoriesIdList : [], 
	
	/** @property {Object} id категории магазинов {sid:[], ...} (элемент  - массив id категорий магазина) */
	shopCategoriesIdList : {}, 
	
	/** @property {Number} индекс в agregatorCategoriesIdList текущей категория агрегатора */
	currentAgregatorCategoryId : 0,
	
	/** @property {Number} индекс элемента со значением текущей категория магазина из currentShopSid */
	currentShopCategoryId : 0,
	
	/** @property {Number} индекс элемента со значением текущего магазина из shopList */
	currentShopId : -1,
	
	/** @property {Array} массив ссылок на магазины */
	shopList : [],
	
	/** @property {Number} sid текущего магазина из currentShopSid */
	currentSid : 0,
	
	/** @property {String} последний посещенный url */
	prevUrl : '',
	
	/** @property {Array} список тест-функций текущей задачи, например 'cart_testGrabItems', 'cart_testFoo',, 'cart_testBar', заполняется автоматически */
	taskTestsList : [],
	
	/** @property {Number} индекс текущего теста в taskTestsList */
	taskCurrentTest : 0,
	
	/** @property {Array} массив с сообщениями тестов, в том числе с сообщениями об ошибке. Сообщения об ошибке должны содержать error в тексте сообщения */
	log : [],
	
	/** @property {countError} количество ошибок */
	countError : 0,
	
	/** @property {String} _TEST_MEMENTO */
	_TEST_MEMENTO : 'testMemento',
	
	
	/**
	 * @param {Object} consts константы и функции из app.js
	*/
	init:function(consts) {
		this._consts = consts;
		
		var o = this, Lib = FlipcatWebAppLibrary, method;
		if (!Lib._GET('test', 0)) {
			return;
		}
		if (Lib._GET('starttest') == 1) {
			o.clearStorage();//TODO
			o.currentTask = Lib._GET('test', o.currentTask);
			if (o.currentTask == 'all') {
				o.currentTask = o._tasks[0];
			}
		}
		o.loadFromStorage();//TODO
		if (o.currentTask in o._allow_tasks) {
			o.setTaskTestList();//
			console.log( o.taskTestsList);
			method = o.taskTestsList[o.taskCurrentTest];
			if (o[method] instanceof Function) {
				o[method]();
			} else {
				o.addError('Попытка запустить несуществующий метод: ' + method);//TODO
			}
		} else {
			o.addError('Недопустимая задача: ' + o.currentTask);
		}
	},
	loadFromStorage:function() {
		var o = this, Lib = FlipcatWebAppLibrary, i, j, s, 
			storedData = Lib.storage(o._TEST_MEMENTO);
		for (i in o) {
			if (String(i).indexOf('_') != 0 && !(o[i] instanceof Function)) {
				if (String(storedData[i]) != 'undefined' && String(storedData[i]) != 'null') {
					//console.log('write to ' +  i + ' value: ' + storedData[i]);
					o[i] = storedData[i];
				}
			}
		}
	},
	saveToStorage:function() {
		var o = this, Lib = FlipcatWebAppLibrary, i, j, s, 
			storedData = {};
		for (i in o) {
			if (String(i).indexOf('_') != 0 && !(o[i] instanceof Function)) {
				storedData[i] = o[i];
			}
		}
		Lib.storage(o._TEST_MEMENTO, storedData);
	},
	clearStorage:function() {
		var o = this, Lib = FlipcatWebAppLibrary;
		Lib.storage(o._TEST_MEMENTO, {});
	},
	addError:function(s) {
		s = 'Error: ' + s;
		console.log(s);
		this.log.push(s);
		this.countError = this.log.length;
	},
	incrementTask:function() {
		if (this.countError > 0) {
			return;
		}
		if (this.taskCurrentTest + 1 < this.taskTestsList.length) {
			this.taskCurrentTest++;
		} else {
			this.taskCurrentTest = 0;
			var i;
			for (i = 0; i < this._tasks.length; i++) {
				if (this._tasks[i] == this.currentTask ) {
					if (i + 1 < this._tasks.length) {
						this.currentTask = this._tasks[i + 1];
						break;
					} else {
						this.log.push('Все тесты завершены, количестов ошибок  ' + this.countError);
						console.log(this.log);
						return;
					}
				}
			}
		}
		this.saveToStorage();
		window.location.href = '/?test=' + this.currentTask;
	},
	setTaskTestList:function() {
		var o = this, Lib = FlipcatWebAppLibrary, i, j;
		for (i in o) {
			if (String(i).indexOf('_') != 0 && (o[i] instanceof Function)) {
				//console.log('prepare '+ i + ', o.currentTask = ' + o.currentTask);
				if (String(i).indexOf(o.currentTask) == 0) {
					o.insert(o.taskTestsList, i);
				}
			}
		}
	},
	isMainPage:function(url) {
		return (FlipcatWebAppLibrary.REQUEST_URI(1) == '/');
	},
	isAgregatorCategoriesPage:function() {
		if ($('.t-cat-item a')[2]) {
			return true;
		}
		return false;
	},
	isShoplistPage:function() {
		if ($('.t-shop-item a')[1]) {
			return true;
		}
		if ($('.t-shop-item a')[0]) {
			return true;
		}
		return false;
	},
	isProductPage:function() {
		var id = this._consts.HTML_CART_QUANTITY_ID;
		//console.log(this._consts);
		//console.log('id = ' + id);
		if ($(id)[0]) {
			this.cartIsEmpty = parseInt($(id).text(), 10) ?  false : true;
			return true;
		}
		return false;
	},
	_cartIsEmpty:function() {
		return (this.cartIsEmpty ? true : false);
	},
	addProductInCart:function() {
		var btn , o = this._consts;
		$('a' + Flipcat.Orders.HTML_ITEM_CART_ADD_CSS).each(function(i, j){
			if ($(j).data('id') != '[id]' && !btn) {
				btn = $(j);
			}
		});
		if (btn[0]) {
			o.addToCart(btn.data('id'), 1);
			window.location.href = window.location.href;
		} else {
			this.addError('Не удалось добавить товар в корзину');
		}
	},
	gotoCartPage:function() {
		var id = this._consts.HTML_CART_LINK_ID;
		if ($(id)[0]) {
			window.location.href = $(id).attr('href') + '&test=' + this.currentTask;
		} else {
			this.addError('Не найдена ссылка на корзину  на странице ' + window.location.href);
		}
	},
	/**
	 * Находит на странице id категорий агрегатора, помещает их в список категорий, если их там нет. 
	 * Переходит на в очередную категорию, сохранив перед этим свое состояние
	*/
	gotoInNextShop:function(){
		var o = this;
		o.grabShopIds();//TODO
		//console.log( 'o.shopList.length = ' + o.shopList.length );
		if (o.currentShopId + 1 < o.shopList.length) {
			o.currentShopId++;
			o.saveToStorage();
			var br = 0;
			while (o.shopList[o.currentShopId] == '[LINK]' || o.shopList[o.currentShopId] == '#') {
				o.currentShopId++;
				o.saveToStorage();
				br++;
				if (br > 500) {
					throw new Error('Test Quit');
				}
			}
			if (o.shopList[o.currentShopId] != '[LINK]' && o.shopList[o.currentShopId] != '#') {
				window.location.href = o.shopList[o.currentShopId] + '?test=' + o.currentTask;
			}
		} else {
			o.gotoNextCategory();
		}
	},
	grabShopIds:function() {
		var o = this;
		$('.t-shop-item a').each(function(i, j) {
			if (j.getAttribute('href').indexOf('[shopId]') == -1) {
				o.insert(o.shopList, j.getAttribute('href'));
			}
		});
	},
	/**
	 * Находит на странице id категорий агрегатора, помещает их в список категорий, если их там нет. 
	 * Переходит на в очередную категорию, сохранив перед этим свое состояние
	*/
	gotoNextCategory:function(){
		var o = this;
		o.grabAgregateCategoriesIds();
		if (o.currentAgregatorCategoryId + 1 < o.agregatorCategoriesIdList.length) {
			o.currentAgregatorCategoryId++;
			o.saveToStorage();
			window.location.href = '/a/' + o.agregatorCategoriesIdList[ o.currentAgregatorCategoryId ] + '?test=' + o.currentTask;
		} else {
			o.addError("Пройдены все категории, магазинов не найдено");
		}
	},
	grabAgregateCategoriesIds:function() {
		var o = this;
		$('.t-cat-item a').each(function(i, j) {
			o.insert(o.agregatorCategoriesIdList, j.getAttribute('data-id'));
		});
	},
	/***
	 * @descriotion ПОмещает значение в массив если там такого нет
	*/
	insert:function(array, value){
		var i, found = 0;
		for (i = 0; i < array.length; i++) {
			if (array[i] == value)  {
				found = 1;
				break;
			}
		}
		if (found == 0) {
			array.push(value);
		}
	}
}
