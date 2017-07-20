/** @class SlideHelper*/
window.Flipcat = window.Flipcat || {};
var Slider = {
	HTML_SLIDE_BIG_IMAGE_ID : '#hero-slides',
	MAX_HEIGHT : 533,
	MAX_WIDTH  : 800,
	
	center: function(img) {
		if (img) {
			img = $(img);
			
			var y = $('div.navbar').first().height() + $('section.breadcrubms').first().height(),
				x, maxW = this.MAX_WIDTH, maxH = this.MAX_HEIGHT, imgW = img.width(), containerW = $('#hero').width(),
				paginationPos = maxH - 0, pag, o = this, Lib = FlipcatWebAppLibrary,
				leftColWidth, isDesk;
			img.css('top', 0);
			
			if (Lib.getViewport().w > Flipcat.Desktop.MOBILE_WIDTH) {
				leftColWidth = $('.desktop-right-col').first().width();
				var c = maxW / leftColWidth;
				maxH = Math.round(maxH * c);
				maxW = leftColWidth;
				isDesk = true;
			}
			
			imgW = imgW > maxW ? maxW : imgW;
			
			x = Math.round( (containerW - imgW) / 2);
			if (containerW < $(window).width()) {
				x = x < 0 ? 0 : x;
			}
			img.css('left', x  + 'px');
			pag = $(o.HTML_SLIDE_BIG_IMAGE_ID + ' .slides-pagination').first();
			if (pag[0]) {
				pag.css('top', paginationPos + 'px');
			}
			if ($(o.HTML_SLIDE_BIG_IMAGE_ID).height() > maxH) {
				console.log('Set resize!');
				$(o.HTML_SLIDE_BIG_IMAGE_ID).css('max-height', maxH + 'px');
			}
			if (isDesk) {
				img.css('width', maxW  + 'px');
				img.css('height',   + 'auto');
				img.css('top', '60px');
			}
		}
	},
	patchHeight:function(h) {
		var o = this, maxH = o.MAX_HEIGHT, Lib = FlipcatWebAppLibrary,
			leftColWidth, maxW = o.MAX_WIDTH, r;
		if (Lib.getViewport().w > Flipcat.Desktop.MOBILE_WIDTH) {
			leftColWidth = $('.desktop-right-col').first().width();
			var c = leftColWidth / maxW;
			maxH = Math.round(h * c);
			maxW = leftColWidth;
		}
		r = h > maxH ? maxH : h;
		return r;
	},
	
	needStop: function() {
		var q = $('#hero-slides .slides-container img').length;
		if (q < 2) {
			return true;
		}
		return false;
	}
	
	
};
window.Flipcat.SlideHelper = Slider;
