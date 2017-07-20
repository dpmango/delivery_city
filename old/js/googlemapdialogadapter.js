/** @class GoogleMapDialogAdapter Адаптирует диалог выбора локации на гугл карте из ЛК (файл address.js)  к веб-приложению  */
window.Flipcat = window.Flipcat || {};
/**
 * @object 
*/
window.Flipcat.CGoogleMapDialogAdapter = function(){};
window.Flipcat.CGoogleMapDialogAdapter.prototype = {
	/** @property {String} HTML_FIND_BUTTON_ID id Кнопки Найти!   */
	HTML_FIND_BUTTON_ID       : '#findLocation', 
	
	/** @property {String} HTML_CITY_NAME_ID id Выбраного  города  */
	HTML_CITY_NAME_ID         : '#dropdownMenu1', 
	
	/** @property {String} HTML_STREET_INPUT_ID id Выбранная улица  */
	HTML_STREET_INPUT_ID      : '#iStreet', 
	
	/** @property {String} HTML_COUNTRY_INPUT_ID id Выбранная страна  */
	HTML_COUNTRY_INPUT_ID      : '#iCountry', 
	
	/** @property {String} HTML_HOME_INPUT_ID id Выбранный дом    */
	HTML_HOME_INPUT_ID        : '#iHome', 
	
	/** @property {String} HTML_HOME_MOBILE_INPUT_ID id Выбранный дом  - мобильная версия   */
	HTML_HOME_MOBILE_INPUT_ID        : '#mIHome',
	
	/** @property {String} HTML_CITY_MOBILE_INPUT_ID id Выбранный город  - мобильная версия   */
	HTML_CITY_MOBILE_INPUT_ID        : '#mICity',
	
	/** @property {String} HTML_CITY_MOBILE_INPUT_ID id Выбранный город если первый уровень используется как список городов - мобильная версия   */
	HTML_CITY_MOBILE_SELECT_ID        : '#mLocationFormCitySelect',
	
	/** @property {String} HTML_STREET_MOBILE_INPUT_ID id Выбранная улица  - мобильная версия   */
	HTML_STREET_MOBILE_INPUT_ID        : '#mIStreet',
	
	/** @property {String} HTML_FIND_MOBILE_BUTTON_ID id кнопки найти  - мобильная версия   */
	HTML_FIND_MOBILE_BUTTON_ID   : '#mFindLocation',
	
	/** @property {String} HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID id  инпута ввода адреса на форме из address.js   */
	HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID : '#addressTitle', 
	
	/** @property {String} HTML_GOOGLE_MAP_DIALOG_BUTTON_FIND_ID селектор кнопки поиска по адресу на форме из address.js   */
	HTML_GOOGLE_MAP_DIALOG_BUTTON_FIND_CSS : '.search-map-address.btn.btn-success',
	
	/** @property {String} HTML_CITIES_LIST_ID id выпадающего списка городов  */
	HTML_CITIES_LIST_ID : '#selectFirstLevelCategoryItem',
	
	/** @property {String}  инпут с id города(-категории-первого-уровня) в форме выбора локации*/
	HTML_CITY_ID_INPUT_ID : '#iCategoryId',
	
	/** @property {String} HTML_FORM_ID идентификатор формы с данными о геолокации */
	HTML_FORM_ID : '#setLocationForm',
	
	/** @property {String} HTML_LON_INPUT_ID идентификатор инпута широта формы с данными о геолокации */
	HTML_LON_INPUT_ID : '#iLon',
	
	/** @property {String} HTML_LAT_INPUT_ID идентификатор инпута долгота формы с данными о геолокации */
	HTML_LAT_INPUT_ID : '#iLat',
	
	/** @property {String} HTML_LAT_INPUT_ID идентификатор инпута Расстояние формы с данными о геолокации */
	HTML_DISTANCE_INPUT_ID : '#iRadius',
	
	/** @property {String} HTML_CITY_NAME_TEXT_INPUT_ID идентификатор инпута Город  формы с данными о геолокации  (существует, если не используется первый уровень списка категорий как список городов)*/
	HTML_CITY_NAME_TEXT_INPUT_ID: '#iCity',
	
	/** @property {String} HTML_CITY_NAME_HIDDEN_INPUT_ID идентификатор скрытого инпута Город  формы с данными о геолокации  (существует, если не используется первый уровень списка категорий как список городов)*/
	HTML_CITY_NAME_HIDDEN_INPUT_ID: '#ihideCity',
	
	/** @property {Boolean} allowSubmit true когда можно отправить форму */
	allowSubmit : false,
	
	/** @property {Array} streets перечень гуглосокражений для улиц в ркусскоязычной версии */
	streets: ['ул.', 'пл.', 'пер.', 'проспект', 'пр.', 'улица', 'п.', 'переулок', 'пр-д', 'проезд', 'ш.', 'шоссе', 'бульвар', 'б-р', 'наб.', 'набережная', 'тупик', 'туп.', 'парк', 'сквер', 'сад'],
	
	/** @var {String} HTML_SWITCH_FIRST_AGREGATE_SCOPES_LEVEL_ID id select с выбором элемента первого уровня категорий */
	HTML_SWITCH_FIRST_AGREGATE_SCOPES_LEVEL_ID : '#selectFirstLevelCategoryItem',
	
	
	init:function(lib) {
		this.lib = lib;
		this.setListeners();
	},
	
	/** @method  */
	setListeners:function() {
		var o = window.Flipcat.GoogleMapDialogAdapter,
			currentGoogleAddress;
		$(o.HTML_FIND_BUTTON_ID).click(o.onClickFind);
		$(o.HTML_FIND_MOBILE_BUTTON_ID).click(o.onClickFind);
		$(o.HTML_FORM_ID).bind('submit', function(e){
			if (!o.allowSubmit) {
				return false;
			}
		});
		
		currentGoogleAddress = $(o.HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID).val();
		setInterval(function(){
			if (currentGoogleAddress != $(o.HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID).val()) {
				o.parseGoogleAddress(true);
				currentGoogleAddress = $(o.HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID).val();
			}
		}, 500);
		
		$(o.HTML_SWITCH_FIRST_AGREGATE_SCOPES_LEVEL_ID + ' a').bind('click', o.switchFirstLevelCategory);
		$(o.HTML_SWITCH_FIRST_AGREGATE_SCOPES_LEVEL_ID + ' option').each(function(i, j){
			if (j.hasAttribute('selected')) {
				j.selected =  true;
			} else {
				j.selected = false;
			}
		});
		
		$(o.HTML_CITY_MOBILE_INPUT_ID).bind('change', o.onChangeMobileLocationInputValue);
		$(o.HTML_HOME_MOBILE_INPUT_ID).bind('change', o.onChangeMobileLocationInputValue);
		$(o.HTML_STREET_MOBILE_INPUT_ID).bind('change', o.onChangeMobileLocationInputValue);
		$(o.HTML_CITY_MOBILE_SELECT_ID).bind('change', o.onChangeMobileLocationInputValue);
		
		$(o.HTML_CITY_MOBILE_INPUT_ID).bind('keydown', o.onChangeMobileLocationInputValue);
		$(o.HTML_HOME_MOBILE_INPUT_ID).bind('keydown', o.onChangeMobileLocationInputValue);
		$(o.HTML_STREET_MOBILE_INPUT_ID).bind('keydown', o.onChangeMobileLocationInputValue);
		
	},
	/**
	 * @description Клик на кнопке Найти в форме геолдокации в шапке
	 * @method  onClickFind
	 * @param {Event} evt
	 * @param {Boolean} silent если true то алерты не выводятся
	 * @param {Boolean} ignoreEmptyStreetAndHome если true то даже несмотря на пустые поля Улица и номер дома настройка  "По умолчанию определять местоположения пользователя как центр города. (Внимание! Работает только при включенной геолокации) " игнорируется
	 * @param {Boolean} isChangeCityAction если true, то значит метод вызван из обработчика смены города в спике городов и после отправки данных о геолокации надо перейти в первую категорию города
	 * @param {Number}  agregateCategoryId идентификатор категории агрегатора, который надо передать методу sr (switch region). Актуально, когда isChangeCityAction == true
	*/
	onClickFind:function(evt, silent, ignoreEmptyStreetAndHome, isChangeCityAction, agregateCategoryId) {
		var o = window.Flipcat.GoogleMapDialogAdapter,
			address, currAddr,
			currentPosition, interval, s, buf = [], cityName;
		cityName = $.trim( $(o.HTML_CITY_NAME_ID).text() );
		ignoreEmptyStreetAndHome = String(ignoreEmptyStreetAndHome) == 'undefined' ? false : ignoreEmptyStreetAndHome;
		if ($(o.HTML_CITY_NAME_TEXT_INPUT_ID)[0]) {
			cityName = $.trim( $(o.HTML_CITY_NAME_TEXT_INPUT_ID).val() );
		}
		address = [o.getStreetNameFromForm(), $(o.HTML_HOME_INPUT_ID).val(), cityName];
		for (i = 0; i < address.length; i++) {
			if ($.trim(address[i])) {
				buf.push( address[i] );
			}
		}
		address = buf.join(', ', buf);
		if (address.length == 0 || !cityName) {
			Flipcat.Messages.fail(__('messages.City_required'));
			return;
		}
		if (String(parseInt(cityName, 10)) == cityName) {
			Flipcat.Messages.fail(__('messages.address.set.address'));
			return;
		}
		
		var inputStreetValue = $.trim($(o.HTML_STREET_INPUT_ID).val()),
			inputHomeValue = $.trim($(o.HTML_HOME_INPUT_ID).val());
		
		if (!Flipcat.useCoordinatesOfCityFromSelect && (!inputStreetValue || !inputHomeValue)) {
			if (ignoreEmptyStreetAndHome == false) {
				if (!silent) {
					Flipcat.Messages.fail(__('messages.address.set.street_and_home'));
				}
				return;
			}
		}
		
		currAddr = $(o.HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID).val();
		$(o.HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID).val(address);
		onClickSearchOnMap( $(o.HTML_GOOGLE_MAP_DIALOG_BUTTON_FIND_CSS), silent);
		currentPosition = $('#addressForm input[name=lng]').val() + ',' + $('#addressForm input[name=lat]').val();
		if (currAddr == address) {
			currentPosition = '';
		}
		interval = setInterval(function(){
			s = $('#addressForm input[name=lng]').val() + ',' + $('#addressForm input[name=lat]').val();
			if (s != currentPosition) {
				clearInterval(interval);
				//TODO проверить, заполняются ли уже эти поля ввода
				inputStreetValue = $.trim($(o.HTML_STREET_INPUT_ID).val()),
				inputHomeValue = $.trim($(o.HTML_HOME_INPUT_ID).val());
				if (!Flipcat.useCoordinatesOfCityFromSelect && (!inputStreetValue || !inputHomeValue)) {
					if (ignoreEmptyStreetAndHome == false) {
						if (!silent) {
							Flipcat.Messages.fail(__('messages.address.set.street_and_home')  + ' 2');
						}
						return;
					}
				}
				
				$(o.HTML_LAT_INPUT_ID).val( $('#addressForm input[name=lat]').val() );
				$(o.HTML_LON_INPUT_ID).val( $('#addressForm input[name=lng]').val() );
				$(o.HTML_DISTANCE_INPUT_ID).val( $('#addressForm input[name=radius]').val() );
				$(o.HTML_CITY_ID_INPUT_ID).val( $(o.HTML_CITY_NAME_ID).attr('data-id') );
				if (isChangeCityAction) {
					o.send(agregateCategoryId);
				} else {
					o.send();
				}
			}
		}, 100);
	},
	/** 
	 *	@method  setAddressFromGoogleMapForm 
	 *  @description Заполняет поля на форме веб-приложения значениями с формы диалога гугл карты
	 * TODO вызвать это при нажатии на Найти! диалога гуглкарты
	*/
	parseGoogleAddress:function(noAlert) {
		var o = window.Flipcat.GoogleMapDialogAdapter,
			countries = ['Абхазия','Австралия','Австрия','Азербайджан','Албания','Алжир','Ангола','Андорра','Антигуа и Барбуда','Аргентина','Армения','Афганистан','Багамские Острова','Бангладеш','Барбадос','Бахрейн','Белиз','Белоруссия','Беларусь','Бельгия','Бенин','Болгария','Боливия','Босния и Герцеговина','Ботсвана','Бразилия','Бруней','Буркина-Фасо','Бурунди','Бутан','Вануату','Ватикан','Великобритания','Венгрия','Венесуэла','Восточный Тимор','Вьетнам','Габон','Гаити','Гайана','Гамбия','Гана','Гватемала','Гвинея','Гвинея-Бисау','Германия','Гондурас','Государство Палестина','Гренада','Греция','Грузия','Дания','Джибути','Доминика','Доминиканская Республика','ДР Конго','Египет','Замбия','Зимбабве','Израиль','Индия','Индонезия','Иордания','Ирак','Иран','Ирландия','Исландия','Испания','Италия','Йемен','Кабо-Верде','Казахстан','Камбоджа','Камерун','Канада','Катар','Кения','Кипр','Киргизия','Кирибати','Китай','КНДР','Колумбия','Коморские Острова','Коста-Рика','Кот-дИвуар','Куба','Кувейт','Лаос','Латвия','Лесото','Либерия','Ливан','Ливия','Литва','Лихтенштейн','Люксембург','Маврикий','Мавритания','Мадагаскар','Македония','Малави','Малайзия','Мали','Мальдивские Острова','Мальта','Марокко','Маршалловы Острова','Мексика','Мозамбик','Молдавия','Монако','Монголия','Мьянма','Намибия','Науру','Непал','Нигер','Нигерия','Нидерланды','Никарагуа','Новая Зеландия','Норвегия','ОАЭ','Оман','Пакистан','Палау','Панама','Папуа - Новая Гвинея','Парагвай','Перу','Польша','Португалия', 'Россия', 'Республика Конго','Республика Корея','Руанда','Румыния','Сальвадор','Самоа','Сан-Марино','Сан-Томе и Принсипи','Саудовская Аравия','Свазиленд','Сейшельские Острова','Сенегал','Сент-Винсент и Гренадины','Сент-Китс и Невис','Сент-Люсия','Сербия','Сингапур','Сирия','Словакия','Словения','Соломоновы Острова','Сомали','Судан','Суринам','США','Сьерра-Леоне','Таджикистан','Таиланд','Танзания','Того','Тонга','Тринидад и Тобаго','Тувалу','Тунис','Туркмения','Турция','Уганда','Узбекистан','Украина','Уругвай','Федеративные Штаты Микронезии','Фиджи','Филиппины','Финляндия','Франция','Хорватия','ЦАР','Чад','Черногория','Чехия','Чили','Швейцария','Швеция','Шри-Ланка','Эквадор','Экваториальная Гвинея','Эритрея','Эстония','Эфиопия','ЮАР','Южная Осетия','Южный Судан','Ямайка','Япония'],
			aAddress = $(o.HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID).val().split(','),
			city, cities, done = false, nHome, country,
			street, i,
			re;
		if (aAddress.length > 1) {
			nHome = $.trim(aAddress[1]);
			street = $.trim(aAddress[0]);
			country = $.trim( aAddress[3] );
			city = $.trim( aAddress[2] );
			if (!city) {
				city = $.trim($(o.HTML_CITY_NAME_TEXT_INPUT_ID).val());
			}
			var rC = Flipcat.GoogleMapDialogAdapter.recievedCity;
			if (!city || (rC && rC != city) ) {
				city = rC;
			}
			if (aAddress.length == 6) {
				country = $.trim( aAddress[4] );
			}
			if (o.cityIsCountry(city, countries)) {
				if (aAddress.length == 3) {
					street = aAddress[0];
					re = /[0-9]*[\D]+([0-9]*)/;
					nHome = street.replace(re, '$1');
					street = street.replace(nHome, '');
					city = aAddress[1];
					country = aAddress[2];
				} else if (aAddress.length == 6){
					country = aAddress[5];
					street  = aAddress[0];
					re = /\D/g;
					nHome  = street.replace(re, '');
					street = street.replace(nHome, '');
					city   = aAddress[2];
				} else if (aAddress.length == 4){
					city   = aAddress[1];
					street   = o.getStreetNameFromForm(aAddress[0] + ' ул.');
				}
			}
			o.setAddressPieces(nHome, street, city, country);
			
			if ($(o.HTML_CITY_NAME_HIDDEN_INPUT_ID)[0] && $(o.HTML_CITY_NAME_TEXT_INPUT_ID)[0] && !parseInt(city)) {
				return true;
			}
			
			/** @var cities {id_N:value_N, ...} */
			cities = o.getCitiesFromSelect();
			for (i in cities) {
				if (FlipcatWebAppLibrary.isCmpStrings(cities[i], city) == true) {
					done = true;
					if ( ! FlipcatWebAppLibrary.isCmpStrings(cities[i], $(o.HTML_CITY_NAME_ID).text()) ) {
						o.switchCitiesInDropDown(cities[i], i);
					}
					$(o.HTML_CITY_ID_INPUT_ID).val(i);
					return true;
				}
			}
			if (!done && !noAlert /*&& !$(o.HTML_CITY_NAME_HIDDEN_INPUT_ID)[0]*/ ) {
				$(o.HTML_HOME_INPUT_ID).val('');
				$(o.HTML_STREET_INPUT_ID).val('');
				$(o.HTML_COUNTRY_INPUT_ID).val('');
				Flipcat.Messages.fail(__('messages.This_city_nt_present_on_cite'));
			}
		}
		return false;
	},
	/** 
	 * @method  getCitiesFromSelect 
	 * @description Получает хэш category_id => category_name для списка городов
	 * @return {Object} {id_N:value_N, ...}
	*/
	getCitiesFromSelect:function() {
		var o = window.Flipcat.GoogleMapDialogAdapter,
			i, options, result = {};
		if ($(o.HTML_CITIES_LIST_ID)[0] && $(o.HTML_CITIES_LIST_ID)[0].tagName == 'SELECT') {
			options = $(o.HTML_CITIES_LIST_ID)[0].options;
			for (i = 0; i < options.length; i++) {
				result[ options[i].text ] = options[i].text;
			}
		} else {
			//работаем с нашей стандартной версткой, при необходимости переписать
			$(o.HTML_CITIES_LIST_ID + ' a').each(function(i, j) {
				result[ $(j).data('value') ] = $.trim( $(j).text() );
			});
		}
		return result;
	},
	/** 
	 * @method  
	 * @description Заменить город в списке городов.
	 * @param {String} choosedCityName
	 * @param {Number} choosedCityId набранного в поле ввода города
	 * // В случае смены верстки переписать
	*/
	switchCitiesInDropDown:function(choosedCityName, choosedCityId) {
		var o = window.Flipcat.GoogleMapDialogAdapter,
			i;
		if ($(o.HTML_CITIES_LIST_ID)[0] && $(o.HTML_CITIES_LIST_ID)[0].tagName == 'SELECT') {
			FlipcatWebAppLibrary.selectByText($(o.HTML_CITIES_LIST_ID)[0], choosedCityName);
		} else {
			$(o.HTML_CITIES_LIST_ID + ' a').each(function(i, j) {
				if($(j).data('value') == choosedCityId) {
					$(j).attr('data-value', $(o.HTML_CITY_NAME_ID).data('id') );
					$(j).find('span').text(  $.trim($(o.HTML_CITY_NAME_ID).text()) );
					$(o.HTML_CITY_NAME_ID).attr('data-id', choosedCityId);
					$(o.HTML_CITY_NAME_ID).text(choosedCityName);
				}
			});
		}
		
		if ($(o.HTML_CITY_MOBILE_SELECT_ID)[0] && $(o.HTML_CITY_MOBILE_SELECT_ID)[0].tagName == 'SELECT') {
			FlipcatWebAppLibrary.selectByText($(o.HTML_CITY_MOBILE_SELECT_ID)[0], choosedCityName);
		}
	},
	/** 
	 * @method send
	 * @description Отправляет данные формы #setLocationForm
	 * @param {Number} agregateCategoryId 
	*/
	send:function(agregateCategoryId) {
		var o = window.Flipcat.GoogleMapDialogAdapter;
		o.allowSubmit = true;
		agregateCategoryId = parseInt(agregateCategoryId, 10);
		if ($(o.HTML_CITY_NAME_TEXT_INPUT_ID)[0]) {
			//console.log('Send: Set city name ' + $(o.HTML_CITY_NAME_TEXT_INPUT_ID).val());
			$(o.HTML_CITY_NAME_HIDDEN_INPUT_ID).val( $(o.HTML_CITY_NAME_TEXT_INPUT_ID).val() );
		}
		var input = $(o.HTML_FORM_ID).find('input[name=agregateCategoryId]').first();
		if (input[0]) {
			$(o.HTML_FORM_ID).remove(input);
		}
		if (agregateCategoryId) {
			$(o.HTML_FORM_ID).append($('<input type="hidden" name="agregateCategoryId" value="' +  agregateCategoryId + '">'));
		}
		$(o.HTML_FORM_ID).submit();
	},
	/**
	 * @description Смена города в списке (элемента первого уровня категорий агрегатора)
	*/
	switchFirstLevelCategory:function(evt) {
		var o = Flipcat.GoogleMapDialogAdapter;
		if ($(o.HTML_HOME_INPUT_ID)[0]) {
			var target = evt.target,
			selectedId = $(evt.target).data('value'), 
			selectedText = o.getSelectedCityById(selectedId);
			$(o.HTML_CITY_NAME_ID).text(selectedText);
			$(o.HTML_CITY_NAME_ID).attr('data-id', selectedId);

			//console.log('send id ' + selectedId + ', text = ' + selectedText + ', cityNameId = ' + $(o.HTML_CITY_NAME_ID).text() );
			
			$(o.HTML_STREET_INPUT_ID).val('');
			
			$(o.HTML_CITY_ID_INPUT_ID).val(selectedId);
			$(o.HTML_HOME_INPUT_ID).val('');
			$(o.HTML_STREET_INPUT_ID).val('');
			$(o.HTML_LON_INPUT_ID).val('');
			$(o.HTML_LAT_INPUT_ID).val('');
			$(o.HTML_DISTANCE_INPUT_ID).val('');
			try {
				//evt, silent, ignoreEmptyStreetAndHome, isChangeCityAction, agregateCategoryId
				console.log('before onClickFind');
				o.onClickFind(null, true, true, true, selectedId);
			} catch(e) {
				console.log(e.message);
				window.location.href =  '/sr/' + selectedId;
			}
		} else {
			selectedId = $(evt.target).data('value');
			window.location.href =  '/sr/' + selectedId;
		}
	},
	/**
	 * @description Получить строковое имя города по его id
	*/
	getSelectedCityById:function(id) {
		var o = this, hash = o.getCitiesFromSelect();
		return hash[id];
	},
	/***
	 * @description 
	 * @return {Boolean} true если city в списке городов
	*/
	cityIsCountry:function(city, countries) {
		var i;
		city = String(city).toLowerCase(city);
		for (i = 0; i < countries.length; i++) {
			if (countries[i].toLowerCase() == city) {
				return true;
			}
		}
		return false;
	},
	setAddressPieces:function(nHome, street, city, country) {
		var o = this, streets = o.streets,
			regions = ['респ.', 'обл.', 'край'], streetConfirm = 0;
		if (parseInt(nHome, 10)) {
			$(o.HTML_HOME_INPUT_ID).val($.trim(nHome));
			$(o.HTML_HOME_MOBILE_INPUT_ID).val($.trim(nHome));
		} else {
			$(o.HTML_HOME_INPUT_ID).val('');
			$(o.HTML_HOME_MOBILE_INPUT_ID).val('');
		}
		for (i = 0; i < streets.length; i++) {
			if (~street.indexOf( streets[i] )) {
				streetConfirm = 1;
				break;
			}
		}
		if (!streetConfirm) {
			street = '';
		}
		for (i = 0; i < regions.length; i++) {
			if (~street.toLowerCase().indexOf( regions[i] )) {
				street = '';
				break;
			}
		}	
		$(o.HTML_STREET_INPUT_ID).val(street);
		$(o.HTML_STREET_MOBILE_INPUT_ID).val(street);
		for (i = 0; i < regions.length; i++) {
			if (~city.toLowerCase().indexOf( regions[i] )) {
				city = '';
				break;
			}
		}
		country = $.trim(country);
		if (country != 'undefined') {
			$(o.HTML_COUNTRY_INPUT_ID).val(country);
		}
		if (!parseInt(city)) {
			$(o.HTML_CITY_NAME_HIDDEN_INPUT_ID).val(city);
			$(o.HTML_CITY_NAME_TEXT_INPUT_ID).val(city);
			$(o.HTML_CITY_MOBILE_INPUT_ID).val(city);
		}
	},
	/**
	 * @description Получает имя улицы из верхней формы ввода и добавляет к ней ул, пер. или пл. в завсисмости от окончания
	 * @return {Street}
	*/
	getStreetNameFromForm: function(street) {
		var o = this,
			s = $(o.HTML_STREET_INPUT_ID).val(),
			streets = o.streets, i;
		street = street ? street : s;
		for (i = 0; i < streets.length; i++) {
			if (~street.indexOf(streets[i])) {
				return street;
			}
		}
		i = street.substring(street.length - 2);
		if (i == 'ая' || i == 'го' || street[street.length - 1] == 'а') {
			street += ' ул.';
		} else if (i == 'ий') {
			street += ' пер.';
		}
		return street;
	},
	/**
	 * @description Копирует значение из мобильной формы указания геолокации в десктопную.
	*/
	onChangeMobileLocationInputValue:function(evt) {
		var o = Flipcat.GoogleMapDialogAdapter, target = evt.target;
		if (evt.target.id == o.HTML_CITY_MOBILE_SELECT_ID.replace('#','')) {
			$(o.HTML_HOME_MOBILE_INPUT_ID).val('');
			$(o.HTML_STREET_MOBILE_INPUT_ID).val('');
		}
		setTimeout(function() {
			var choosedCityName, choosedCityId;
			$(o.HTML_CITY_NAME_TEXT_INPUT_ID).val( $(o.HTML_CITY_MOBILE_INPUT_ID).val() );
			$(o.HTML_STREET_INPUT_ID).val( $(o.HTML_STREET_MOBILE_INPUT_ID).val() );
			$(o.HTML_HOME_INPUT_ID).val( $(o.HTML_HOME_MOBILE_INPUT_ID).val() );
			if ($(o.HTML_CITY_MOBILE_SELECT_ID)[0] && $(o.HTML_CITY_MOBILE_SELECT_ID).val() != $(o.HTML_CITY_ID_INPUT_ID).val()) {
				choosedCityId = $(o.HTML_CITY_MOBILE_SELECT_ID).val();
				choosedCityName = FlipcatWebAppLibrary.getOptionByValue($(o.HTML_CITY_MOBILE_SELECT_ID)[0], choosedCityId).text;
				o.switchCitiesInDropDown(choosedCityName, choosedCityId);
			}
			$(o.HTML_CITY_ID_INPUT_ID).val( $(o.HTML_CITY_MOBILE_SELECT_ID).val() );
		}, 100);
	}
}
