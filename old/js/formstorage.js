/** @class Избранное  - магазины*/
window.Flipcat = window.Flipcat || {};
/**
 * @object Управление меткой авторизации
*/
window.Flipcat.OrderFormStorage = {
	/** @property {String} HTML_FORM_ID */
	HTML_FORM_ID : '#orderForm',
	/** @property {String} DEL */
	DEL : '!~0+----+0~!',
	/**
	 *@param {Object} 
	*/
	init:function(lib) {
		this.lib = lib;
		this.setListeners();
		this.restore();
	},
	setListeners:function() {
		var o = this;
		//inputText Textarrea
		$(this.HTML_FORM_ID + ' input,textarea').bind('keydown', function(evt){
			setTimeout(function(){
				o.cacheTextValue($(evt.target));
			}, 100);
		});
		//inputRadio, inputCheckbox, select
		$(this.HTML_FORM_ID + ' input[type=checkbox],input[type=radio],select').bind('change', function(evt){
			o.cacheChangedValue($(evt.target));
		});
		//при загрузке запрашиваем данные с сервера
	},
	cacheChangedValue: function(input) {
		var o = window.Flipcat.OrderFormStorage, data = o.data(),
			val = null;
		if (input[0].tagName == 'INPUT' && input[0].type == 'radio') {
			val = o.getCheckedRadio(input[0].name);
		}
		if (input[0].tagName == 'INPUT' && input[0].type == 'checkbox') {
			val = input.prop('checked');
		}
		if (input[0].tagName == 'SELECT') {
			val = input.val();
		}
		if (val !== null && data[o.key(input)] != val ) {
			data[o.key(input)] = val;
			o.storeData(data);
		}
	},
	/**
	 * @param {jQueryObject} input
	*/
	cacheTextValue: function(input) {
		var o = window.Flipcat.OrderFormStorage, data = o.data(), val = input.val();
		if (input[0].hasAttribute('data-placeholder') && input[0].getAttribute('data-placeholder') == input.val()
					&& input.hasClass(Flipcat.Placeholders.HTML_PSEUDOPLACEHOLDER_CSS.replace('.', ''))) {
			val = '';
		}
		if ( data && data[o.key(input)] != val ) {
			data[o.key(input)] = val;
			o.storeData(data);
		}
	},
	data:function() {
		var o = this, key;
		if (!o.memdata) {
			o.memdata = localStorage.getItem(o.getGroupKey());
			try {
				o.memdata = JSON.parse(o.memdata);
			}catch(e) {}
		}
		if (!o.memdata || !(o.memdata instanceof Object)) {
			o.memdata = {};
		}
		return o.memdata;
	},
	getGroupKey:function() {
		//FlipcatWebAppLibrary.setGetVar(window.location.href, 'i', '0')
		var k = FlipcatWebAppLibrary.REQUEST_URI(1) + this.HTML_FORM_ID, v = $.cookie(Flipcat.AuthMarker.COOKIE_NAME);
		return k;
	},
	key:function(input) {
		var r = input[0].id ? input[0].id : '';
		r += this.DEL + (input[0].name ? input[0].name : '');
		return r;
	},
	storeData:function(data) {
		var o = this, key;
		o.memdata = data;
		localStorage.setItem(o.getGroupKey(), JSON.stringify(data));
		//TODO на сервер
	},
	/**
	 * @param {String} name
	 * @return {String} value значение выделенного переключателя в группе радио
	*/
	getCheckedRadio:function(name) {
		var o = this, r = false;
		$(o.HTML_FORM_ID + ' input[name=' + name + ']').each(function(i, j){
			if (j.type == 'radio' && j.checked) {//TODO !! test
				r = j.value;
			}
		});
		return r;
	},
	restore:function() {
		var o = this, data = o.data(), i, j, val, input;
		for (i in data) {
			input = o.getInputByKey(i);//в случае типа радио вернет RadioNodeList со свойством type == radio
			if (!input) {
				continue;
			}
			val = data[i];
			
			if (input.tagName == 'INPUT') {
				if (input.type == 'checkbox') {
					$(input).prop('checked', val);
				} else if (input.type == 'radio') {
					if (input instanceof RadioNodeList) {
						for (j = 0; j < input.length; j++) {
							if (input[j].value != val) {
								input[j].checked = false;
							} else {
								input[j].checked = true;
							}
						}
					} else {
						input.checked = false;
					}
				} else {
					input.value = val;
				}
			}
			if (input.tagName == 'TEXTAREA') {
				input.value = val;
			}
			if (input.tagName == 'SELECT') {
				if(!FlipcatWebAppLibrary.selectByValue(input, val)) {
					FlipcatWebAppLibrary.selectByText(input, val);
				}
			}
		}
	},
	/***
	 * @description
	 * @param {String} key слева от DEL id, справа name
	 * @return {HtmlInputElement}|{HtmlTextareaElement}|{HtmlSelectElement}|{RadioNodeList}
	*/
	getInputByKey:function(key) {
		var o = this, arr = key.split(o.DEL), id = arr[0], name = arr[1], input;
		if (id) {
			input = $('#' + id)[0];
			if (input && input.type == 'radio') {
				input = document.getElementById(o.HTML_FORM_ID.replace('#', ''));

				if (input && input[input.name]) {
					input = input[input.name];
					input.type = 'radio';
					input.tagName = 'INPUT';
				}
			}
			return input;
		}
		if (name) {
			input = document.getElementById(o.HTML_FORM_ID.replace('#', ''))[name];
			input.type = 'radio';
			input.tagName = 'INPUT';
			return input;
		}
	},
	
};
