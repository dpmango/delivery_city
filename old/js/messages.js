window.Flipcat = window.Flipcat ? window.Flipcat : {};
/**
 * @class Попапы с сообщениями об успехе и об ошибках
*/
var Messages = Flipcat.Messages = {
	
	/** @property HTML_INFO_MODAL_ID Идентификатор popup диалога с информационным сообщением */
	HTML_INFO_MODAL_ID : '#infoModal',
	
	/** @property HTML_ERROR_MODAL_ID Идентификатор popup диалога с сообщением об ошибке */
	HTML_ERROR_MODAL_ID : '#errorModal',
	
	success:function(s) {
		if (!(s instanceof Object)) {
			//alert(s);//попапов все еще нет
			$(Messages.HTML_INFO_MODAL_ID + ' .bg-success').first().html(this.wrap(s));
			$(Messages.HTML_INFO_MODAL_ID).modal('show');
		}
	},
	fail:function(s) {
		if (!(s instanceof Object)) {
			//alert(s);//попапов все еще нет
			$(Messages.HTML_ERROR_MODAL_ID + ' .bg-danger').first().html(this.wrap(s));
			$(Messages.HTML_ERROR_MODAL_ID).modal('show');
		}
	},
	wrap:function(s) {
		var a = String(s).split('\n'), i;
		if (a.length > 1) {
			/*for (i = 0; i < a.length; i++) {
				a[i] = '<p>' + a[i] + '</p>';
			}*/
			s = a.join('<br>');
		}
		return s;
	}
};
