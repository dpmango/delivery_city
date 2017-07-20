/** @class Reviews отравка отзывов */
window.Flipcat = window.Flipcat || {};
Flipcat.Reviews = {
	/** @property {String} id модального окна */
	HTML_REVIEW_MODAL_ID           : '#modalAddReview',
	
	/** @property {String} css блока с сообщением об отсутствии отзывов */
	HTML_REVIEWS_TOTAL_0_CSS       : '.fc-no-news',
	
	/** @property {String} css блока с отзывом */
	HTML_REVIEW_ITEM_CSS           : '.fc-review-item',
	
	/** @property {String} Инпут выбора типа отзыва "Хороший"*/
	HTML_REVIEW_INPUT_TYPE_GOOD_ID : '#reviewGood',
	
	/** @property {String} Инпут выбора типа отзыва "Плохой"*/
	HTML_REVIEW_INPUT_TYPE_BAD_ID  : '#reviewBad',
	
	/** @property {String} Инпут ввода текста отзыва */
	HTML_REVIEW_INPUT_TEXT_ID      : '#reviewText',
	
	/** @property {String} Инпут отправки отзыва */
	HTML_REVIEW_INPUT_SUBMIT_ID      : '#reviewSubmitBtn',
	
	/** @property {String} Инпут для идентификатора отзыва */
	HTML_REVIEW_INPUT_ORDER_ID     : '#reviewId',
	
	/** @property {String} селектор кнопки "Добавить отзыв" */
	HTML_REVIEW_BTN_ADD_CSS        : '.add-review',
	
	/** @property {String} селектор  контейнера с отзывами*/
	HTML_REVIEWS_CONTAINER_ID      : '#fcShopReviewsList',
	
	/** @property {String} селектор  контейнера с отзывами*/
	HTML_REVIEWS_PAGING_CONTAINER_ID      : '#reviewPaging',
	
	/** @property {String} селектор  контейнера с выбором типа ссылок */
	HTML_REVIEWS_CHOOSE_TYPE_LINKS_CONTAINER_ID  : '#chooseReviewTypeLinks',
	
	/** @property {String} селектор активной ссылки в выборе типов отзывов   */
	HTML_REVIEWS_CHOOSED_TYPE_CSS  : '.reviews-types-choose-active-link',
	
	/** @property {String} селектор ссылки в выборе типов отзывов*/
	HTML_REVIEWS_CHOOSE_TYPE_CSS  : '.review-type-link',
	
	/** @property {String} селектор определяющий, что нужна авторизация*/
	HTML_REVIEW_NEED_AUTH_CSS : '.show-auth-popup',
	
	/** @property {String} HTML_USER_ID_INP_ID селектор определяющий, что нужна авторизация*/
	HTML_USER_ID_INP_ID : '#intShopId',
	
	
	
	/** @property {Object} lib - функции переданные из app.js*/
		
	init:function(lib) {
		var o = this;
		o.lib = lib;
		if ($(o.HTML_REVIEW_MODAL_ID)[0]) {
			o.setAddFormListeners();
		}
		if ($(o.HTML_REVIEWS_CONTAINER_ID)[0]) {
			o.setViewListeners();
		}
	},
	setAddFormListeners:function() {
		var o = this;
		$(o.HTML_REVIEW_INPUT_TYPE_GOOD_ID).bind('change', o.onChooseGood);
		$(o.HTML_REVIEW_INPUT_TYPE_BAD_ID).bind('change', o.onChooseBad);
		$(o.HTML_REVIEW_INPUT_SUBMIT_ID).click(o.onSubmit);
		$(o.HTML_REVIEW_BTN_ADD_CSS).click(o.onClickAddReviewButton);
	},
	setViewListeners:function() {
		var o = this, requestData = o.parseRequest(), page = requestData.page,
			type = requestData.type,
			userId = requestData.userId,
			Lib = FlipcatWebAppLibrary,
			aUrl;
		if($(o.HTML_REVIEWS_PAGING_CONTAINER_ID)[0]) {
			aUrl = window.location.hash.replace('#', '').split('/');
			if (aUrl[0] == 'reviews') {
				Flipcat.ShopCatNavigator.onClickBookmark({target:$(Flipcat.ShopCatNavigator.HTML_REVIEW_BM_ID)[0]});
			}
			
			$(o.HTML_REVIEWS_CHOOSE_TYPE_LINKS_CONTAINER_ID + ' a').click(o.onChangeReviewType);
			
			Lib.lock(o.HTML_REVIEWS_CONTAINER_ID);
			o.lib._get(o.onReviewsData, '/reviews.json?userId=' + userId + '&page=' + page + '&type=' + type, o.onFailReviewData);
			
			
			if ($(o.HTML_REVIEWS_PAGING_CONTAINER_ID)[0]) {
				o.initPagination();
			}
		}
		setInterval(o.checkAutoloadItems, 500);
	},
	initPagination: function() {
		var o = Flipcat.Reviews, aUrl, type,
			requestData = window.location.hash.replace('#', '').split('/'),
			s;
		type = String(requestData[2]);
		if (type != 'good' && type != 'bad') {
			type = '';
		}
		
		$(o.HTML_REVIEWS_PAGING_CONTAINER_ID + ' li').each(function(i, j){
			j = $(j);
			if (!j.hasClass('tpl')) {
				j.find('a').each(function(k, a){
					a = $(a);
					s = a.attr('href');
					aUrl = s.split('#')[1].split('/');
					aUrl = aUrl.splice(0, 2);
					s = s.replace(/#.+/, '#' + aUrl.join('/') + '/' + type);
					if (type) {
						a.attr('href', s);
					}
					a.click(o.onPageClick);
				});
			}
		});
		
	},
	onPageClick:function(evt) {
		var o = Flipcat.Reviews, t, chooseTypeActiveLink;
		if (evt && evt.target) {
			if ($(evt.target).hasClass(o.HTML_REVIEWS_CHOOSE_TYPE_CSS.replace('.', ''))) {
				$(o.HTML_REVIEWS_CHOOSE_TYPE_LINKS_CONTAINER_ID + ' a').each(function(i, j){
					$(j).removeClass(o.HTML_REVIEWS_CHOOSED_TYPE_CSS.replace('.', ''));
				});
				$(evt.target).addClass(o.HTML_REVIEWS_CHOOSED_TYPE_CSS.replace('.', ''));
			}
		} else {
			$(o.HTML_REVIEWS_CHOOSE_TYPE_LINKS_CONTAINER_ID + ' a').each(function(i, j){
					$(j).removeClass(o.HTML_REVIEWS_CHOOSED_TYPE_CSS.replace('.', ''));
					if ($(j).attr('href') == window.location.hash) {
						chooseTypeActiveLink = $(j);
					}
				});
			if (chooseTypeActiveLink) {
				chooseTypeActiveLink.addClass(o.HTML_REVIEWS_CHOOSED_TYPE_CSS.replace('.', ''));
			} else {
				$(o.HTML_REVIEWS_CHOOSE_TYPE_LINKS_CONTAINER_ID + ' a').first().addClass(o.HTML_REVIEWS_CHOOSED_TYPE_CSS.replace('.', ''));
			}
		}
		setTimeout(function(){
			t = o.parseRequest();
			if (o.isAutoloadResponse) {
				t.page = o.currentPage ? o.currentPage : t.page;
			}
			FlipcatWebAppLibrary.lock(o.HTML_REVIEWS_CONTAINER_ID);
			o.lib._get(o.onReviewsData, '/reviews.json?userId=' + t.userId + '&page=' + t.page + '&type=' + t.type, o.onFailReviewData);
		}, 100);
		//evt.preventDefault(); TODO если во всех браузерах  window.location.hash сменится до того как произойдет вызов, то ок
		
		
	},
	parseRequest:function() {
		var o = Flipcat.Reviews, aUrl, type, page,
			url = window.location.hash,
			Lib = FlipcatWebAppLibrary, userId, fail,
			requestData = url.replace('#', '').split('/');
		page = parseInt(requestData[1], 10);
		fail = isNaN(page) ? true :false;
		page = isNaN(page) ? 1 :page;
		type = String(requestData[2]);
		if (type != 'good' && type != 'bad') {
			type = '';
		}
		url = Lib.REQUEST_URI(true);
		aUrl = url.split('/');
		userId = $(o.HTML_USER_ID_INP_ID).val();
		/*if (aUrl[1] == 'b' && Lib._GET('text')) {
			userId  = parseInt(aUrl[3], 10);
		} else if (aUrl[1] == 'b' && aUrl[2] != 'a') {
			userId  = parseInt(aUrl[4], 10);
		} else if (aUrl[1] == 'b' && aUrl[2] == 'a') {
			userId  = parseInt(aUrl[5], 10);
		}*/
		return {userId:userId, page:page, type:type, fail:fail};
	},
	onReviewsData:function(data) {
		FlipcatWebAppLibrary.unlock(Flipcat.Reviews.HTML_REVIEWS_CONTAINER_ID);
		var o = Flipcat.Reviews, config = [
				{key: '[author]', val:'author'},
				{key: '[date]', val:'date'},
				{key: /\[type\]/gm, val:'type'},
				{key: '[typeText]', val:Flipcat.Reviews.renderTypeText},
				{key: '[text]', val:'text'}
			],
			isAutoloadResponse = (o.isAutoloadResponse ? true : false);
		setTimeout(function(){o.autoloadProcess = 0;}, 2000);
		$(o.HTML_REVIEWS_TOTAL_0_CSS).remove();
		if (data.success && data.total > 0) {
			o.total = data.total;
			FlipcatWebAppLibrary.render($(o.HTML_REVIEWS_CONTAINER_ID), 'article', config, data.list, !isAutoloadResponse);
			//o.renderPagination(data.perPage, data.total);
			if ( $(o.HTML_REVIEW_ITEM_CSS).length >=  data.total) {
				if (o.currentPage) {
					o.currentPage--;
				}
			}else if (data.list.length == 0) {
				o.currentPage--;
			}
			o.isAutoloadResponse = false;
		} else {
			if (data.total == 0) {
				o.total = data.total;
				o.currentPage--;
			}
			$(o.HTML_REVIEW_ITEM_CSS).each(function(i, j){
				j = $(j);
				if (!j.hasClass('tpl')) {
					j.remove();
				}
			});
			$(o.HTML_REVIEWS_CONTAINER_ID).append('<div class="' + o.HTML_REVIEWS_TOTAL_0_CSS.replace('.', '') + '">' + __('messages.No_reviews') + '</div>');
			//o.renderPagination(data.perPage, data.total);
		}
	},
	renderPagination:function(perPage, total) {
		var o = this, requestData = o.parseRequest(),
			pagination = FlipcatWebAppLibrary.pagination(requestData.page, total, perPage),
			$tpls = $(o.HTML_REVIEWS_PAGING_CONTAINER_ID + ' li.tpl'),
			tplActiveLink, tplLink, i, s, type, baseUrl;
		baseUrl = window.location.href.replace(window.location.hash, '') + '#reviews';
		type = requestData.type;
		if (type) {
			type = '/' + type;
		}
		$tpls.each(function(i, j){
			j = $(j);
			if (j.hasClass('active')) {
				tplActiveLink = j.html();
			} else {
				tplLink = j.html();
			}
		});
		$(o.HTML_REVIEWS_PAGING_CONTAINER_ID + ' li').each(function(i, j) {
			j = $(j);
			if (!j.hasClass('tpl')) {
				j.remove();
			}
		});
		for (i = 0; i < pagination.length; i++) {
			if (pagination[i].active) {
				s = tplActiveLink.replace('[N]', pagination[i].n);
			} else {
				s = tplLink.replace('[N]', pagination[i].n);
				s = s.replace('[LINK]', baseUrl + '/' + pagination[i].n + type);
			}
			$(o.HTML_REVIEWS_PAGING_CONTAINER_ID).append( $('<li>' + s + '</li>') );
		}
		o.initPagination();
	},
	renderTypeText:function(item, $tpl) {
		//console.log($tpl.find('span[data-goodText]').first().attr('data-goodText'));
		var s = $tpl.find('span[data-goodText]').first().attr('data-' + item.type + 'Text');
		s = s ? s : '';
		return s;
	},
	onFailReviewData:function() {
		var o = Flipcat.Reviews;
		o.autoloadProcess = 0;
		FlipcatWebAppLibrary.unlock(o.HTML_REVIEWS_CONTAINER_ID);
		o.lib.messageFail(__('messages.Unable_load_reviews'));
	},
	/*==============Методы оставления отзыва============================*/
	onSubmit:function() {
		var o = Flipcat.Reviews, type = 'default', text = $.trim($(o.HTML_REVIEW_INPUT_TEXT_ID).val()), data, uid;
		type = $(o.HTML_REVIEW_INPUT_TYPE_GOOD_ID).prop('checked') == true ? 'good' : type;
		type = $(o.HTML_REVIEW_INPUT_TYPE_BAD_ID).prop('checked') == true ? 'bad' : type;
		if (type == 'default' && text.length == 0) {
			o.lib.messageFail(__('messages.Text_review_or_type_required'));
			return;
		}
		uid = FlipcatWebAppLibrary.REQUEST_URI(true).split('/');
		uid = parseInt(uid[uid.length - 1], 10);
		data = {type:type, text:text, id: $(o.HTML_REVIEW_INPUT_ORDER_ID).val(), userId: uid};
		o.lib._post(data, o.onSuccessAddReview, '/nrvw', o.onFailAddReview);
	},
	onClickAddReviewButton:function(evt) {
		var o = Flipcat.Reviews, target = evt.target;
		if (target.tagName == 'BUTTON' || target.tagName == 'A') {
			if ($(target).hasClass(o.HTML_REVIEW_NEED_AUTH_CSS.replace('.', ''))) {
				if ($.cookie( Flipcat.AuthMarker.COOKIE_NAME) ) {
					o.lib._get(o.onSocNetIdData, '/snid?i=' + $(target).data('id'), o.onSocNetIdDataFail);
				} else {
					o.showNeedAuthMessage($(target).data('id'));
				}
			} else {
				o.showReviewPopup($(target).data('id'));
			}
		}
		return false;
	},
	onSocNetIdData:function(data) {
		var o = Flipcat.Reviews;
		if (data.userIsKnown) {
			o.showReviewPopup(data.id);
		} else {
			o.showNeedAuthMessage(data.id);
		}
	},
	showReviewPopup:function(id) {
		var o = Flipcat.Reviews;
		$(o.HTML_REVIEW_INPUT_ORDER_ID).val(id);
		$(o.HTML_REVIEW_INPUT_TYPE_GOOD_ID).prop('checked', false);
		$(o.HTML_REVIEW_INPUT_TYPE_BAD_ID).prop('checked', false);
		$(o.HTML_REVIEW_INPUT_TEXT_ID).val('');
		$(o.HTML_REVIEW_MODAL_ID).modal('show');
	},
	onSocNetIdDataFail:function() {
	},
	showNeedAuthMessage:function(id) {
		var o = this;
		$.cookie('ar', window.location.href, {path: '/'});
		o.lastTryReviewId = id;
		$(Flipcat.WebClientAuth.HTML_LOGIN_MODAL_ID).modal('show');
		o.lib.messageSuccess(__('messages.Auth_require'));
	},
	onFailAddReview:function() {
		Flipcat.Reviews.lib.messageFail(__('messages.Unable_add_review'));
	},
	onSuccessAddReview:function(data) {
		var o = Flipcat.Reviews;
		if (data.success == true) {
			o.lib.messageSuccess(data.message);
			$(o.HTML_REVIEW_MODAL_ID).modal('hide');
			$(o.HTML_REVIEW_BTN_ADD_CSS + '[data-id=' + $(o.HTML_REVIEW_INPUT_ORDER_ID).val() +  ']').remove();
		} else if (data.error && data.info == 'require_auth') {
			$(o.HTML_REVIEW_MODAL_ID).modal('hide');
			$(Flipcat.WebClientAuth.HTML_LOGIN_MODAL_ID).modal('show');
			o.lib.messageSuccess(__('messages.Auth_require'));
		}
	},
	onChooseGood:function() {
		var o = Flipcat.Reviews;
		if ($(o.HTML_REVIEW_INPUT_TYPE_GOOD_ID).prop('checked') == true) {
			$(o.HTML_REVIEW_INPUT_TYPE_BAD_ID).prop('checked', false);
		}
	},
	onChooseBad:function() {
		var o = Flipcat.Reviews;
		if ($(o.HTML_REVIEW_INPUT_TYPE_BAD_ID).prop('checked') == true) {
			$(o.HTML_REVIEW_INPUT_TYPE_GOOD_ID).prop('checked', false);
		}
	},
	createRewiewsWarningMessage:function(socNetName, authType) {
		if (socNetName) {
			return __('messages.reviewWarningMessage', {'%p':'TODO', '%s':socNetName, '%n':this.lastTryReviewId});
		} else if (authType == 'email') {
			return __('messages.reviewWarningEmailMessage', {'%p':'TODO', '%n':this.lastTryReviewId});
		}
		return '';
	},
	/**
	 * @description Автоподгрузка отзывов
	*/
	checkAutoloadItems:function() {
		var b = document.body, w = $(b), o = Flipcat.Reviews,
			L = document.getElementsByTagName('main')[0].offsetHeight;
		if (!L) {
			L = document.body.clientHeight -  FlipcatWebAppLibrary.getViewport().h;
		}
		if(window.scrollY >= L - 700) {
			//console.log('L = ' + L + ', Y = ' + window.scrollY);
			if (!o.autoloadProcess) {
				o.autoloadProcess = 1;
				setTimeout(function(){
					var t = o.parseRequest();
					o.currentPage = o.currentPage ? o.currentPage + 1 : t.page;
					o.currentPage = o.currentPage == 1 ? o.currentPage + 1 : o.currentPage;
					if (o.previousAutoloadPage && o.previousAutoloadPage == o.currentPage) {
						return;
					}
					if (o.total && $(o.HTML_REVIEW_ITEM_CSS).length >=  o.total) {
						return;
					}
					try {
						o.isAutoloadResponse = true;
						//console.log('VALL');
						o.onPageClick();
						o.previousAutoloadPage = o.currentPage;
					} catch(e) {alert(e);}
					
					//o.autoloadProcess = 0;
				}, 100);
			}
		}
	},
	onChangeReviewType:function(evt) {
		var o = Flipcat.Reviews;
		o.currentPage = 1;
		o.previousAutoloadPage = false;
		isAutoloadResponse = false;
		o.autoloadProcess = 0;
		o.onPageClick(evt);
	}
};
