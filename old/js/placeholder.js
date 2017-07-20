/** @class Докрутка поейсхолдеров */
window.Flipcat = window.Flipcat || {};
Flipcat.Placeholders = {
	/** @property {String} HTML_CUSTOM_INPUT_CSS селектор блоков с инпутами */
	HTML_CUSTOM_INPUT_CSS : '.custom-input',
	/** @property {String} HTML_VALUE_INPUT_CSS селектор который добавляется при непустом значении инпута */
	HTML_VALUE_INPUT_CSS : '.value-exists',
	init:function() {
		var o = Flipcat.Placeholders, css = o.HTML_VALUE_INPUT_CSS.replace('.', '');
		$(o.HTML_CUSTOM_INPUT_CSS).blur(function(event) {
			var inputVal = this.value;
			if (inputVal) {
				this.classList.add(css);
			} else {
				this.classList.remove(css);
			}
		});
		o.setValueExists();
	},
	/**
	 * @description Установить всем непустым инпутам соответствующий селектор 
	*/
	setValueExists:function() {
		var o = Flipcat.Placeholders, css = o.HTML_VALUE_INPUT_CSS.replace('.', '');
		$(o.HTML_CUSTOM_INPUT_CSS).each(function(i, j) {
			var inputVal = j.value;
			if (inputVal) {
				j.classList.add(css);
			} else {
				j.classList.remove(css);
			}
		});
	}
};
