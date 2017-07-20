window.FlipcatTimepicker = {
	init:function() {
		if (window.navigator.userAgent.toLowerCase().indexOf('iphone') != -1 || window.navigator.userAgent.toLowerCase().indexOf('ipad') != -1) {
			return;
		}
		
		$('.timepicker').focus(FlipcatTimepicker.showWidget).each(function(i, j){
			FlipcatTimepicker.wrapInput($(j));
		});
		$(window).click(function(){
			$('.fc-timepicker-wrap').css('display', 'none');
		});
	},
	wrapInput:function($i) {
		var div = $i.parent(), template = this.template();
		div.css('position', 'relative');
		template.find('.fc-timepicker-up.fc-timepicker-hour').click(this.onHourUp);
		template.find('.fc-timepicker-down.fc-timepicker-hour').click(this.onHourDown);
		
		template.find('.fc-timepicker-up.fc-timepicker-min').click(this.onMinUp);
		template.find('.fc-timepicker-down.fc-timepicker-min').click(this.onMinDown);
		
		template.click(function() {
			return false;
		});
		$i.click(function() {
			return false;
		});
		
		template.find('input').bind('keydown', this.maskOnlyNumber);
		$i.bind('keydown', this.maskRaw);
		
		div.append(template);
	},
	maskOnlyNumber:function(e) {
		//cross
		//allow codes: 0123456789, arrowR, arrowL, home , end, shift, delete, backspace
		var codes = {8:1,37:1, 39:1, 16:1, 46:1, 36:1, 35:1, 188:1, 191:1, 108:1},
			i,
			//,-
			o2 = {189:1, 188:1, 191:1, 108:1};
		for (i = 96; i < 105; i++) {
			codes[i] = 1;
		}
		for (i = 48; i < 58; i++) {
			codes[i] = 1;
		}
		if (!codes[e.keyCode] || (e.keyCode == 191 && !e.shiftKey) ) {
			e.preventDefault();
		}
		setTimeout(function(){
			FlipcatTimepicker.setRawByWidget(e.target);
		}, 100);
	},
	maskRaw:function(e) {
		//cross
		//allow codes: 0123456789:, arrowR, arrowL, home , end, shift, delete, backspace
		var codes = {8:1,37:1, 39:1, 16:1, 46:1, 36:1, 35:1, 188:1, 191:1, 108:1},
			i,
			//,-
			o2 = {189:1, 188:1, 191:1, 108:1};
		for (i = 96; i < 105; i++) {
			codes[i] = 1;
		}
		for (i = 48; i < 58; i++) {
			codes[i] = 1;
		}
		if ( (e.keyCode == 59 || e.keyCode == 186) && e.shiftKey) {
			return true;
		}
		if (!codes[e.keyCode] || (e.keyCode == 191 && !e.shiftKey) ) {
			e.preventDefault();
		}
		setTimeout(function(){
			FlipcatTimepicker.setWidgetByRaw(e.target);
		}, 100);
	},
	/**  */
	setRawByWidget:function(inp) {
		FlipcatTimepicker.setRawValue(inp, 0, 1);
	},
	setWidgetByRaw:function(inp) {
		var ls = $(inp).parent().find('.fc-timepicker-wrap input'),
			data = $.trim(inp.value),
			pair = data.split(':'), h, m;
		if (pair.length == 2) {
			h = parseInt(pair[0], 10);
			h = h ? h : 0;
			h = h > 23 ? 23 : h;
			h = h < 10 ? '0' + h : h;
			
			m = parseInt(pair[1], 10);
			m = m ? m : 0;
			m = m > 59 ? 59 : m;
			m = m < 10 ? '0' + m : m;
			ls[0].value = h;
			ls[1].value = m;
		}
	},
	onHourUp:function(evt) {
		var self = FlipcatTimepicker, o = self._getTarget(evt), inp = o.inp, v = o.v;
		self.skipHide = 1;
		if (v == 23) {
			v = -1;
		}
		v++;
		v = v < 10 ? '0' + v : v;
		inp.val(v);
		self.setRawValue(inp, v);
		//self.skipHide = 0;
		return false;
	},
	onHourDown:function(evt) {
		var self = FlipcatTimepicker, o = self._getTarget(evt), inp = o.inp, v = o.v;
		self.skipHide = 1;
		if (v < 2) {
			v = 24;
		}
		v--;
		v = v < 10 ? '0' + v : v;
		inp.val(v);
		self.setRawValue(inp, v);
		//self.skipHide = 0;
		return false;
	},
	onMinDown:function(evt) {
		var self = FlipcatTimepicker, o = self._getTarget(evt), inp = o.inp, v = o.v, needResetHour = 0;
		self.skipHide = 1;
		if (v < 2) {
			v = 60;
			needResetHour = 1;
		}
		v--;
		v = v < 10 ? '0' + v : v;
		inp.val(v);
		//self.skipHide = 0;
		if (needResetHour) {
			self.onHourDown( {target: self.getHourInputByMinInput(evt.target)} );
			return false;
		}
		self.setRawValue(inp, v);
		return false;
	},
	onMinUp:function(evt) {
		var self = FlipcatTimepicker, o = self._getTarget(evt), inp = o.inp, v = o.v, needResetHour = 0;
		self.skipHide = 1;
		if (v == 59) {
			v = -1;
			needResetHour = 1;
		}
		v++;
		v = v < 10 ? '0' + v : v;
		inp.val(v);
		//self.skipHide = 0;
		if (needResetHour) {
			self.onHourUp( {target: self.getHourInputByMinInput(evt.target)} );
			return false;
		}
		self.setRawValue(inp, v);
		return false;
	},
	getHourInputByMinInput:function(inp) {
		return $(inp).parents('.fc-timepicker-wrap').find('input').first()[0];
	},
	_getTarget:function(evt) {
		var inp = $(evt.target).parent().find('input').first(), v = parseInt(inp.val(), 10);
		v = v ? v : 0;
		return {inp:inp,v:v};
	},
	template:function() {
		var currentdate = new Date();
		var tpl = '\
			<div class="fc-timepicker-wrap">\
				<div class="fc-timepicker-content">\
					<div class="fc-timepicker-i-block">\
						<img src="/img/ico/up.png" class="fc-timepicker-up fc-timepicker-hour">\
						<input type="text" class="fc-timepicker-inp" value="'+currentdate.getHours()+'" maxlength="2">\
						<img src="/img/ico/down.png" class="fc-timepicker-down fc-timepicker-hour">\
					</div>\
					<div class="fc-timepicker-i-block">\
						<img src="/img/ico/up.png" class="fc-timepicker-up fc-timepicker-min">\
						<input type="text" class="fc-timepicker-inp" value="'+currentdate.getMinutes()+'" maxlength="2">\
						<img src="/img/ico/down.png" class="fc-timepicker-down fc-timepicker-min">\
					</div>\
					<div class="clearfix"></div>\
				</div>\
			</div>';
		return $(tpl);
	},
	setRawValue:function(inp, v, skipSetFocus) {
		var ls = $(inp).parents('.fc-timepicker-wrap').find('input'), hInp = ls[0], mInp = ls[1],
			rawI = $(inp).parents('.fc-timepicker-wrap').first().parent().find('input.timepicker').first(),
			h = parseInt(hInp.value, 10), m = parseInt(mInp.value, 10);
		h = h ? h : 0;
		m = m ? m : 0;
		h = h < 10 ? '0' + h : h; 
		m = m < 10 ? '0' + m : m; 
		rawI.val(h + ':' + m);
		if (!skipSetFocus) {
			rawI.focus();
		}
		
	},
	showWidget:function(evt) {
		FlipcatTimepicker._getWidget(evt).css('display', 'block');
	},
	hideWidget:function(evt) {
		setTimeout(function(){
			if (FlipcatTimepicker.skipHide) {
				return;
			}
			FlipcatTimepicker._getWidget(evt).css('display', 'none');
		}, 1000);
	},
	_getWidget:function(evt) {
		return $(evt.target).parent().find('.fc-timepicker-wrap').first();
	}
};
$(FlipcatTimepicker.init);
