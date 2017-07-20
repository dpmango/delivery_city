/** @class PrelendingGoogleMapDialogAdapter Адаптирует диалог выбора локации на гугл карте из ЛК (файлы address.js, goolemapdialogadapter.js)  к прелендинга  */
window.Flipcat = window.Flipcat || {};
Flipcat.PrelendingGoogleMapDialogAdapter = function(){};
extend(Flipcat.CGoogleMapDialogAdapter, Flipcat.PrelendingGoogleMapDialogAdapter);
Flipcat.PrelendingGoogleMapDialogAdapter.prototype.init = function(obj) {
	Flipcat.PrelendingGoogleMapDialogAdapter.superclass.init.call(this, obj);
	this.lib = {
		messageFail:Flipcat.Messages.fail,
		messageSuccess:Flipcat.Messages.success
	};
}
/**
 * @override Смена города в списке будет работать чуть иначе, нам не нужен редирект на главную и переустановка локации при смене в инпуте
*/
Flipcat.PrelendingGoogleMapDialogAdapter.prototype.switchFirstLevelCategory = function(evt) {
	var selectedText, selectedId = $(evt.target).data('value'),
		o = Flipcat.GoogleMapDialogAdapter;
	selectedText = o.getSelectedCityById(selectedId);
	$(o.HTML_CITY_NAME_ID).text(selectedText);
	$(o.HTML_CITY_NAME_ID).attr('data-id', selectedId);
	$(o.HTML_CITY_NAME_TEXT_INPUT_ID).val(selectedText);
}
