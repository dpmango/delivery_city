/** @class MultiproductManager при загрузке / смене страницы инициализует контролы мультипродукта */
Flipcat.MultiproductManager = {
	/** @property css блока с контролами */
	HTML_CONTROLS_CSS : '.multiproduct-options',
	/** @property {Object} хэш экземпляров объектов класса Multiproduct,  связанных с мультиипродуктами*/
	multiproducts : {},
		
	init:function() {
		var o = this, data = null, select;
		$(this.HTML_CONTROLS_CSS).each(function(i, j){
			try {
				j = $(j);
				data = JSON.parse(j.find('textarea').first().val());
				select = j.find('select');
				select.each(function(k, m){
					m.controller = o.getMultiproduct(j.data('multiproductid'), data, j);
				});
				select.bind('change', function(evt){
					evt.target.controller.onChange(evt);
				});
			} catch(e) {console.log(e);}
		});
	},
	
	getMultiproduct:function(multiproductId, data, view) {
		var o = this;
		if (!o.multiproducts[multiproductId]) {
			o.multiproducts[multiproductId] = new Multiproduct(multiproductId, data, view);
		} else if(view){
			o.multiproducts[multiproductId].selects = [];
			o.multiproducts[multiproductId].setView(view);
		}
		return o.multiproducts[multiproductId];
	}
	
};
/** @class Multiproduct сущность мультипродукта */
function Multiproduct(id, data, view) {
	this.id = id;
	this.parameters = [];
	/** @property {Array} selects массив объектов {control, parameterId, changed, defaultValue} где control - элемент ввода с событием onChange, parameterId - id характеристики, changed равно true если пользователь уже менял значние этого контрола, defaultValue содержит предыдущее значение контролд*/
	this.selects = [];
	/** @property {$(HtmlLinkElement)} productIdDOMElement элемент, из атрибута data-id которого при нажатии кнопки "в корзину" получается id продукта */
	/** @property {$(HtmlImage)}productPhotoDOMElement  элемент, в котором будет заменена фотография**/
	/** @property {$(HtmlImage)} productPopupPhotoDOMElement  элемент, в котором будет заменена фотография**/
	/** @property {$(HtmlDiv)} productPopupFirstParameterValueElement  элемент, в котором будет заменено значение первого атрибута**/
	/** @property {$(HtmlDiv)} productPopupSecondParameterValueElement  элемент, в котором будет заменено значение первого атрибута**/
	/** @property {$(HtmlSpan)} productPriceDOMElement  элемент, в котором будет заменено значение стоимости **/
	this.initalize(id, data, view);
}
Multiproduct.prototype = {
	initalize:function(id, data, view) {
		//console.log(data);
		this.items = data.merge_items;
		var map = {}, i, j, deleteIndexes = [];
		for (i = 0; i < this.items.length; i++) {
			deleteIndexes = [];
			map = {};
			for (j = 0; j < this.items[i].params.length; j++) {
				if (!map[ this.items[i].params[j].value_id ]) {
					map[ this.items[i].params[j].value_id ] = 1;
				} else {
					deleteIndexes.push(j);
				}
			}
			for (j = deleteIndexes.length - 1; j > -1; j--) {
				this.items[i].params.splice(deleteIndexes[j], 1);
			}
			
		}
		this.setMergeParams(this.items);
		this.setView(view);
	},
	
	onChange:function(evt) {
		var target = evt.target, o = this, selects = o.selects, i, targetValue = $(target).val(),
			targetParameterId = $(target).data('param_id'), confirmed, prevTargetValue = null;
		
		for (i = 0; i < selects.length; i++) {
			if (selects[i].parameterId == targetParameterId) {
				selects[i].changed = 1;
				prevTargetValue = selects[i].defaultValue;
				if (targetValue > 0) {
					//alert('set Default Value = ' + targetValue);
					selects[i].defaultValue = targetValue;
				}
				o.setProductViewData();
				//console.log('select was value with paramId = ' + selects[i].parameterId);
				//этот не трогаем, остальные перезаписываем
			} else {
				//берет из итемс только те, которые содержат параметр  targetParameterId, у котрого в значениях есть targetValue
				confirmed = o.rebuildSelect(selects[i].control, targetParameterId, targetValue, selects[i].changed);
				if (!confirmed) {
					console.log('!confirmed!');
					//alert('ptv = ' + prevTargetValue);
					prevTargetValue = o.getPrevTargetValue(prevTargetValue, target);
					//alert('after reset ptv = ' + prevTargetValue);
					if (prevTargetValue) {
						FlipcatWebAppLibrary.selectByValue(target, prevTargetValue);
						
						var x = o.getSelectObjectByTargetParameterId(targetParameterId);
						if (x) {
							x.defaultValue = prevTargetValue;
						} else {
							alert('Error 2');
						}
					} else {
						alert('Error 1');
					}
				}
			}
		}
		o.setProductViewData();
	},
	
	/** @param {jQueryObject} view*/
	setView:function(view) {
		var obj, o = this, safeParamId = Flipcat.MultiproductManager.safeParamId ? Flipcat.MultiproductManager.safeParamId : false;
		view.find('select').each(function(i, j) {
			obj = {};
			obj.control = j;
			obj.changed = 0;
			obj.defaultValue = j.value;
			obj.parameterId = j.getAttribute('data-param_id');
			i = o.getSelectIndex(o.selects, obj.parameterId);
			if (i == -1) {
				o.selects.push(obj);
			} else if (safeParamId) {
				//Заменить контрол на соответствующий
				o.selects[i].control = j;
				//Установить его значение
				//o.selectItem();
				alert(obj.defaultValue);
				FlipcatWebAppLibrary.selectByValue(j, obj.defaultValue);
				//Пункты ниже попробовать заменить на вызов onChange
				//Удалить
				//установить id на кнопке корзину знаение фотографий и прочего
			}
		});
		view.find('select').each(function(i, j) {
			o.selectFirstItem(j);
		});
		
		//Получить контрол, в котором будет записан id товара
		o.productIdDOMElement = view.parents('.fc-product-item').first().find('a.cart-add').first();
		//Получить элемент, в котором будет заменена фотография
		o.productPhotoDOMElement = view.parents('.fc-product-item').first().find('.fc-product img').first();
		
		//Получить элемент, в котором будет заменена стоимость
		o.productPriceDOMElement = view.parents('.fc-product-item').first().find('.desk-pricebox span').first();
		
		//для всплывавющей подсказки то же самое
		//Получить элемент, в котором будет заменена фотография
		o.productPopupPhotoDOMElement = view.parents('.course').first().find('.sc-item-popup-image img').first();
		//Получить элемент со значением первого атрибута
		o.productPopupFirstParameterValueElement = view.parents('.course').first().find('.sc-item-param-value')[0];
		//Получить элемент со значением второго атрибута
		o.productPopupSecondParameterValueElement = view.parents('.course').first().find('.sc-item-param-value')[1];
		if ($(o.productPopupFirstParameterValueElement).hasClass('tpl')) {
			o.productPopupFirstParameterValueElement = view.parents('.course').first().find('.sc-item-param-value')[1];
			o.productPopupSecondParameterValueElement = view.parents('.course').first().find('.sc-item-param-value')[2];
		}
		o.productPopupSecondParameterValueElement = o.productPopupSecondParameterValueElement ? $(o.productPopupSecondParameterValueElement) : null;
		o.productPopupFirstParameterValueElement  = o.productPopupFirstParameterValueElement ? $(o.productPopupFirstParameterValueElement) : null;
		
		if (safeParamId) {
			view.find('select').each(function(i, j) {
				if (i == 0) {
					o.onChange({target:j});
				}
			});
		}
		if (view.find('select').length == 1) {
			view.find('select').each(function(i, j) {
				if (j.options[0].text == __('Any')) {
					$(j.options[0]).remove();
				}
			});
		}
	},
	setMergeParams:function(data) {
		for (var i = 0; i < data.length; i++) {
			this.parameters.push(data[i].param);
		}
	},
	/**
	 * @description берет из итемс только те, которые содержат параметр  targetParameterId, у котрого в значениях есть targetValue
	 * @param {HtmlSelect} select
	 * @param {Number} targetParameterId
	 * @param {Number} targetValue
	 * @param {Number} changed undefined если пользователь не менял еще значение этого контрола, 1 если менял
	 * @return {Boolean} false если пользователь отказался от поиска подходящих
	*/
	rebuildSelect:function(select, targetParameterId, targetValue, changed) {
		var selected = select.value, i, j, o = this, hashParams, mapValues = {},
			selectParamId = select.getAttribute('data-param_id'), opt, k = 1,
			foundSelected = false, prevContent = $(select).html(),
			targetParameterTitle = '?', otherParameterTitle = '?', targetParameterDisplayValue = '?', isAnyValue = 0,
			otherParameterDisplayValue = '?', alreadySelected = 0;
		if (selected == 0) {
			selected = o.getPrevTargetValue(null, select);
			isAnyValue = 1;
		}
		select.options.length = 0;
		select.options[0] = new Option(__('messages.Any'), 0);
		
		for (i = 0; i < o.items.length; i++) {
			hashParams = o.getHashParams(o.items[i]);
			if (hashParams[targetParameterId].value == targetValue || targetValue == 0) {
				targetParameterTitle = hashParams[targetParameterId].parameterTitle;
				targetParameterDisplayValue = hashParams[targetParameterId].text;
				for (j in hashParams) {
					if (j == selectParamId) {
						otherParameterTitle = hashParams[j].parameterTitle;
						if (!mapValues[ hashParams[j].value ]) {
							//addItem
							mapValues[ hashParams[j].value ] = 1;
							opt = new Option(hashParams[j].text, hashParams[j].value);
							select.options[k] = opt;
							if (hashParams[j].value == selected) {
								o.selectItem(opt);
								alreadySelected = 1;
								foundSelected = true;
							}
							k++;
						}
					}
				}
			}
			if (alreadySelected == 0) {
				o.selectFirstItem(select);
			}
		}
		
		//TODO если параметров станет более двух, вынести confirm в onchange
		if (!foundSelected && changed && selected > 0) {
			otherParameterDisplayValue = o.getPrevTargetDisplayValue(select, selectParamId);
			if (!confirm(__('messages.Sorry_product_with_param_') + ' "' + otherParameterTitle + ': ' + otherParameterDisplayValue + ', ' + targetParameterTitle + ': ' + targetParameterDisplayValue +  '" ' +  __('messages._no_exists') + '.\n' + __('messages.Do_search_products_with_other_parameter_') + ' "' + otherParameterTitle  + '" ' + __('messages._for_selected_your_') + ' "' + targetParameterTitle + ': ' + targetParameterDisplayValue + '"?' )) {
				$(select).html(prevContent);
				if (isAnyValue) {
					selected = '0';
				}
				FlipcatWebAppLibrary.selectByValue(select, selected);
				return false;
			} else {
				var selectInfo =  o.getSelectObjectByTargetParameterId(selectParamId);
				if (selectInfo && select.options[1]) {
					selectInfo.defaultValue = select.options[1].value;
				}
			}
		}
		return true;
	},
	/**
	 * @description Преобразует массив params элемента merged_items (@see api doc) в объект
	 * @return {original_param_id:{text:original_value, value:original_value_id, parameterTitle:original_param}, ...}
	*/
	getHashParams:function(productItem) {
		var o = productItem.params, i, j, result = {}, k;
		for (i = 0; i < o.length; i++) {
			k = o[i];
			result[k.param_id] = {text:k.value, value:k.value_id, parameterTitle:$.trim(k.param)};
		}
		return result;
	},
	/** 
	 * @description Если prevTargetValue равно null ищет в selects target  и возвращает его defaultValue
	 * 
	*/
	getPrevTargetValue:function(prevTargetValue, target) {
		if (prevTargetValue === null) {
			var i, o = this;
			for (i = 0; i < o.selects.length; i++) {
				if (o.selects[i].control == target) {
					return o.selects[i].defaultValue;
				}
			} 
		}
		return prevTargetValue;
	},
	/**
	 * @return {Boolean} true если select с таким parameterId уже существует в массиве контролов
	*/
	selectExists:function(selects, parameterId) {
		for (var i = 0; i < selects.length; i++) {
			if (selects[i].parameterId == parameterId) {
				return true;
			}
		}
		return false;
	},
	/**
	 * @return {Number} -1 если select с таким parameterId не найден в массиве контролов иначе его индекс
	*/
	getSelectIndex:function(selects, parameterId) {
		for (var i = 0; i < selects.length; i++) {
			if (selects[i].parameterId == parameterId) {
				return i;
			}
		}
		return -1;
	},
	selectFirstItem:function(j) {
		if (j.options[1]) {
			if (this.selects.length > 1) {
				this.selectItem(j.options[1]);
			}
		}
	},
	/**
	 * 
	*/
	getPrevTargetDisplayValue:function(select, parameterId) {
		var i, j, k, o = this, selected, p;
		for (i = 0; i < o.selects.length; i++) {
			if (o.selects[i].control == select) {
				 selected = o.selects[i].defaultValue;
				 for (j = 0; j < o.items.length; j++) {
					 for (k = 0; k < o.items[j].params.length; k++) {
						 p = o.items[j].params[k];
						 if (p.param_id == parameterId && p.value_id == selected) {
							 return p.value;
						 }
					 }
				 }
				 return '';
			}
		}
		return '';
	},
	getSelectObjectByTargetParameterId:function(targetParameterId) {
		var i, o = this;
		for (i = 0; i < o.selects.length; i++) {
			if (o.selects[i].parameterId == targetParameterId) {
				return o.selects[i];
			}
		}
		return null;
	},
	selectItem:function(option, dbg) {
		option.setAttribute('selected', true);
		if (option.parentNode && option.parentNode.tagName == 'SELECT' && option.parentNode.options) {
			for (var i = 0; i < option.parentNode.options.length; i++) {
				if (option.parentNode.options[i].value == option.value) {
					option.parentNode.selectedIndex = i;
					break;
				}
			}
		}
	},
	/**
	 * @description Заменяет фотографии и id товара в представлении
	*/
	setProductViewData:function() {
		var o = this, j, k, ss = o.selects, firstParameterId, secondParameterId,
			firstParameterValue, secondParameterValue, p, success = 0,
			firstParameterDisplayValue,
			secondParameterDisplayValue, price, currency, photos, productId, productsIds = {}, max;
		if (ss[0]) {
			firstParameterId     = ss[0].parameterId;
			firstParameterValue  = ss[0].control.value;
		}
		if (ss[1]) {
			secondParameterId    = ss[1].parameterId;
			secondParameterValue = ss[1].control.value;
		}
		for (j = 0; j < o.items.length; j++) {
			success = 0;
			for (k = 0; k < o.items[j].params.length; k++) {
				p = o.items[j].params[k];
				if (p.param_id == firstParameterId && p.value_id == firstParameterValue) {
					firstParameterDisplayValue = p.value;
					price = o.items[j].price;
					currency = Flipcat.ShopCatNavigator.currency ? Flipcat.ShopCatNavigator.currency : o.items[j].currency;
					photos = o.items[j].photos;
					productId = o.items[j].id;
					if (!productsIds[productId]) {
						productsIds[productId] = 1;
					} else {
						productsIds[productId]++;
					}
					success++;
				}
				if (p.param_id == secondParameterId && p.value_id == secondParameterValue) {
					secondParameterDisplayValue = p.value;
					price = o.items[j].price;
					currency = Flipcat.ShopCatNavigator.currency ? Flipcat.ShopCatNavigator.currency : o.items[j].currency;
					photos = o.items[j].photos;
					productId = o.items[j].id;
					if (!productsIds[productId]) {
						productsIds[productId] = 1;
					} else {
						productsIds[productId]++;
					}
					success++;
				}
			}
			if (success == 2) {
				o.setDisplayValues(photos, productId, firstParameterDisplayValue, secondParameterDisplayValue, price, currency);
				return;
			}
		}
		
		/*console.log(productsIds);
			console.log(o.items);
			max = 0;
			for (j in productsIds) {
				if (productsIds[i] > max) {
					productId = j;
					max = productsIds[i];
				}
			}*/
		
		if (o.selects.length == 1) {
			o.setDisplayValues(photos, productId, firstParameterDisplayValue, secondParameterDisplayValue, price, currency);
		}
	},
	setDisplayValues:function(photos, productId, firstParameterDisplayValue, secondParameterDisplayValue, price, currency) {
		var o = this;
		if (photos && photos[0]) {
			o.setPhotos(photos[0]);
		}
		o.productIdDOMElement.attr('data-id', productId);
		if (firstParameterDisplayValue) {
			o.productPopupFirstParameterValueElement.text(firstParameterDisplayValue);
		}
		if (secondParameterDisplayValue) {
			o.productPopupSecondParameterValueElement.text(secondParameterDisplayValue);
		}
		if (price) {
			o.productPriceDOMElement.html(price + ' ' + (Flipcat.currenciesMap[currency] ? Flipcat.currenciesMap[currency] : currency));
		}
	},
	/** @description переустанавливает фото при смене товара*/
	setPhotos:function(photo) {
		var url = photo.preview_url, o = this;
		url = url ? url : photo.small_url;
		url = url ? url : photo.thumbnail_url;
		url = url ? url : photo.big_url;
		if (url) {
			o.productPhotoDOMElement.attr('src', url);
			o.productPopupPhotoDOMElement.attr('src', url);
		} else {
			alert('WTF');
		}
		
	}
};
