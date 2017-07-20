window.Flipcat = window.Flipcat || {};
/** @class Выбор города для мобильной версии сайта */
window.Flipcat.mCitySwitcher = {
	/** @property {String} HTML_POPUP_SELECT_ID Идентификатор селекта в всплывающем окне (оно само всплывает при неопределенном городе, не путать с всплывающим при нажатии на кнопку с именем города в мобильной версии) */
	HTML_POPUP_SELECT_ID : '#mCityId',
	
	/** @property {String} HTML_POPUP_BTN_ID Идентификатор кнопки в всплывающем окне*/
	HTML_POPUP_BTN_ID : '#mConfirmCity',
	
	/** @property HTML_POPUP_FORM_ID {String} Идентификатор формы всплывающего окна со списком выбора городов */
	HTML_POPUP_FORM_ID: '#mSelectCityForm',
	
	/** @property HTML_LEFT_SELECT_ID {String} Идентификатор селекта в левом меню */
	HTML_LEFT_SELECT_ID: '#mleftSideCitySelect',
	
	/** @property HTML_POPUP_CITY_SELECT_MODAL_ID {String} Идентификатор всплывающего окна в мобюильной версии сайта */
	HTML_POPUP_CITY_SELECT_MODAL_ID: '#cityModal',
	
	/** @property HTML_MOBILE_MENU_ {String} Идентификатор кнопки смобильного меню */
	HTML_MOBILE_MENU_ID: '#c-button--slide-left',
	
	/** @property {String} HTML_CITY_MOBILE_INPUT_ID id Выбранный город если первый уровень используется как список городов - мобильная версия  */
	HTML_CITY_MOBILE_SELECT_ID: '#mLocationFormCitySelect',	
	
	/** @property {} */
	
	init:function() {
		this.setListeners();
		this.setupDropDowns();
	},
	setListeners:function() {
		var o = this;
		$(o.HTML_POPUP_FORM_ID).bind('submit', function(){ return false;} );
		$(o.HTML_POPUP_BTN_ID).bind('click', o.onPopupSelectCityConfirm);
		$(o.HTML_LEFT_SELECT_ID).bind('change', o.onPopupSelectCityConfirm);
		
		if ($(o.HTML_MOBILE_MENU_ID).width()) {
			$(o.HTML_POPUP_CITY_SELECT_MODAL_ID).modal('show');
		}
	},
	onPopupSelectCityConfirm:function(evt) {
		var o = Flipcat.mCitySwitcher, s, Geo = Flipcat.GoogleMapDialogAdapter,
			agregateCategoryId,	cityName, event;
		if (evt.type == 'change') {
			agregateCategoryId = $(o.HTML_LEFT_SELECT_ID).val();
			event = {target: $('<a data-value="' + agregateCategoryId + '"></a>')[0]};
			Geo.switchFirstLevelCategory(event);
		} else {
			s = '/sr/' + $(o.HTML_POPUP_SELECT_ID).val();
			window.location.href = s;
		};
	},
	/**
	 * @description @see _selectSelectedItem
	*/
	setupDropDowns:function() {
		var o = Flipcat.mCitySwitcher, a = $(o.HTML_CITY_MOBILE_SELECT_ID)[0], b = $(o.HTML_LEFT_SELECT_ID)[0];
		a = a && a.options ? o._selectSelectedItem(a.options) : a;
		b = b && b.options ? o._selectSelectedItem(b.options) : b;
	},
	/**
	 * @description В chromium и firefox for linux не всегда правильно работает атрибут selected="selected", помогаем
	*/
	_selectSelectedItem:function(opts) {
		for (var i = 0; i < opts.length; i++) {
			if (opts[i].hasAttribute('selected')) {
				opts[i].selected = true;
				break;
			}
		}
	}
};
