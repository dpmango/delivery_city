/**
 * @class Анимиация блока с сео контентом
*/
window.Flipcat = window.Flipcat || {};

window.Flipcat.SlideToggleAnimate  = {
	
	/** @property {String} HTML_SLIDE_TOGGLER_CSS Селектор элемента, при клике на который происходит развертывантиие или свертывание контента */
	HTML_SLIDE_TOGGLER_CSS : '.slide-toggler',
	
	/** @property {String} HTML_SLIDE_BLUR_CSS Селектор элемента создающего эффект растворения текста */
	HTML_SLIDE_BLUR_CSS : '.slide-blur',
	
	/** @property {String} HTML_SLIDE_CONTENT_CSS Селектор элемента в котором содержится сдвигаемый контент */
	HTML_SLIDE_CONTENT_CSS : '.slide-content',
	
	/** @property {String} HTML_SLIDE_BLOCK_CSS Селектор элемента в котором содержатся все остальные */
	HTML_SLIDE_BLOCK_CSS : '.slide-block',
	
	/** @property {String} Наименование атрибута, в который будет записан индекс элемента в массиве maxHeights*/
	ATTRIBUTE_NAME : 'data-slide-id',
	
	/** @property {Array of Object} maxHeights Object: {height,toggle,maxHeight} height - высота контента блока, toggle - false если элемент свернут, true если развернут, maxHeight - максимальная высота контента блока, всё определяется после вызова init */
	maxHeights: [],
	
	
	
	init:function() {
		var o = this, counter = 0, height;
		$(o.HTML_SLIDE_CONTENT_CSS).each(function(i, j){
			j = $(j);
			j.attr(o.ATTRIBUTE_NAME, counter);
			height = j.height();
			j.css('overflow', 'auto').css('height', 'auto');
			o.maxHeights[counter] = {height:height, toggle:false, maxHeight:j.height()};
			j.css('overflow', 'hidden').css('height', height + 'px');
			counter++;
		});
		this.setListeners();
	},
	setListeners:function() {
		var o = this;
		$(o.HTML_SLIDE_TOGGLER_CSS).click(o.onClick);
	},
	onClick:function(evt) {
		evt.preventDefault();
		var o = Flipcat.SlideToggleAnimate, $link = $(evt.target),
			$block   = $link.parents(o.HTML_SLIDE_BLOCK_CSS).first(),
			$content = $block.find(o.HTML_SLIDE_CONTENT_CSS).first(),
			$blur    = $block.find(o.HTML_SLIDE_BLUR_CSS).first(),
			state = o.maxHeights[ $content.attr(o.ATTRIBUTE_NAME) ];
		if (state && state.height && state.maxHeight) {
			if (state.toggle) {console.log('isToggle');
				$content.animate({
					'height': state.height + 'px',
					'duration' : 'slow'
				},
					function() {
						$blur.removeClass('hide');
						o.maxHeights[ $content.attr(o.ATTRIBUTE_NAME) ].toggle = false;
					}
				);
			} else {console.log('isNOTToggle');
				$content.animate({
					'height': state.maxHeight + 'px',
					'duration': 'slow'
				},
				function() {
						$blur.addClass('hide');
						o.maxHeights[ $content.attr(o.ATTRIBUTE_NAME) ].toggle = true;
					}
				);
			}
		}
	}
};
