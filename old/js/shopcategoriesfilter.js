'use strict'
/** @class Фильтрация списка категоирй слева*/
window.Flipcat = window.Flipcat || {};
/**
 * @object Обработка ввода в поле поиска ктегорий
*/
var ShopCatFilter = {
	/** @property {String} id списка категорий в левом меню*/
	HTML_SHOP_CATEGORIES_ID : '#left-shop-categories',
	
	/** @property {String} класс инпута  ввода */
	HTML_INPUT_CSS : '.search',
	
	/**
	 * 
	*/
	init:function() {
		this.lib = window.FlipcatWebAppLibrary;
		if ( $(this.HTML_SHOP_CATEGORIES_ID)[0] ) {
			this.input = $(this.HTML_SHOP_CATEGORIES_ID + ' input' + this.HTML_INPUT_CSS).first();
			this.block = $(this.HTML_SHOP_CATEGORIES_ID);
			this.setListeners();
		}
	},
	onKeyDown:function() {
		var o = this, s = o.input.val().toLowerCase(), $list = o.block.find(' ul li a'),
			t;
		o.block.find('ul').each(function(i, j) {
			$(j).addClass('hide');
		});
		$list.hide();
		o.block.find('li').hide();
		
		if (!s.length) {
			o.block.find('ul').first().removeClass('hide');
			o.block.find('li').show();
			$list.show();
			return;
		}
		$list.each(function(i, j){
			t = $.trim($(j).text().replace(/\(\d+\)/, '')).toLowerCase();
			if (~t.indexOf(s)) {
				o.displayBranch($(j));
			}
		});
	},
	/**
	 * @description Показывает все ссылки до корня списка
	 * @param {Object} $a jQuery(HtmlAElement)
	*/
	displayBranch :function($a) {
		var o = this, parent = $a.parent()[0], $parent;
		while (parent && parent.tagName != 'ASIDE') {
			if (parent.tagName == 'LI') {
				$(parent).find('a').first().show();
				$(parent).show();
			}
			if (parent.tagName == 'UL') {
				$(parent).removeClass('hide');
			}
			parent = parent.parentNode;
		}
	},
	setListeners:function() {
		var o = this;
		o.input.bind('keydown', function(){
			setTimeout(function() {
				o.onKeyDown();
			}, 100);
		});
	}
};
window.Flipcat.ShopCategoryFilter = ShopCatFilter;
