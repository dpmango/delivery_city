'use strict';
window.FlipcatWebAppLibrary = {
/**
 * @description Индексирует массив по указанному полю
 * @param {Array} data
 * @param {String} id = 'id'
*/
indexBy: function (data, id, debug) {
	if (data && data.isIndexedObject) {
		return data;
	}
	id = id ? id : 'id';
	var i = 0, r = {order:[]}, j;
	
	/*$(data).each(function(i, j){
		if (j && j[id]) {
			r[j[id]] = j;
			r.order.push(j[id]);
		}
	});*/
	
	if (data instanceof Array) {
		for (i = 0; i < data.length; i++) {
			j = data[i];
			if (j && j[id]) {
				r[j[id]] = j;
				r.order.push(j[id]);
			}
		}
	} else if (data instanceof Object) {
		for (i in data) {
			j = data[i];
			if (j && j[id]) {
				r[j[id]] = j;
				r.order.push(j[id]);
			}
		}
	}
	
	r.isIndexedObject = 1;
	return r;
},
/**
 * @description Индексирует массив по указанному полю
 * @param {Array} data
 * @param {String} id = 'id'
 * @return {Object};
*/
storage:function(key, data) {
	var L = window.localStorage;
	if (L) {
		if (data === null) {
			L.removeItem(key);
		}
		if (!(data instanceof String)) {
			data = JSON.stringify(data);
		}
		if (!data) {
			data = L.getItem(key);
			if (data) {
				try {
					data = JSON.parse(data);
				} catch(e){;}
			}
		} else {
			L.setItem(key, data);
		}
	}
	return data;
},
/**
 * @description аналог php $_SERVER[REQUEST_URI]
 * @param {Boolean} base = falseif true return only part before '?'
 * @return {String};
*/
REQUEST_URI:function(base) {
	var s = window.location.href;
	s = s.replace(this.HTTP_HOST(s), '');
	if (base) {
		s = s.split('?')[0].split('#')[0];
	}
	return s;
},
/**
 * @description аналог php $_SERVER[HTTP_HOST]
 * @return {String};
*/
HTTP_HOST:function(s, cutScheme) {
	if (!s) {
		s = window.location.href;
	}
	s = s.split('/').slice(0, 3).join('/');
	if (cutScheme) {
		if (~s.indexOf('http://')) {
			s  = s.replace('http://', '');
		}
		if (~s.indexOf('https://')) {
			s  = s.replace('https://', '');
		}
	}
	return s;
},
/**
 * @description Средство установки переменной по умолчанию в TRUE
 * @return {String};
*/
True:function(val) {
	val = String(val) === 'undefined' ? true : val;
	return val;
},
/**
 * @description Получить значение GET переменной из url
 * @return {String};
*/
_GET: function(v, def, search) {
    if (!def) def = null;
    var s = window.location.href, buf = [], val, map = {};
    s = search ? search : s;
    while (s.indexOf(v + '[]') != -1) {
		val = this._GET(v  + '[]', def, s);
		if (!map[val]) {
			buf.push( decodeURIComponent(val) );
			map[val] = 1;
		}
		s = s.replace(v + '[]=' + val, '');
	}
	if (buf.length) {
		return buf;
	}
    var st = s.indexOf("?" + v + "=");
    if (st == -1) st = s.indexOf("&" + v + "=");
    if (st == -1) return def;
    var en = s.indexOf("&", st + 1);
    if ( en == -1 ) {
        return s.substring( st + v.length + 2);
    }
    return s.substring( st + v.length + 2, en );
},
/**
 * @description Размер вьюпорта
 * @return {String};
*/
getViewport: function() {
	var W = window, D = document, w = W.innerWidth, h = W.innerHeight;
	if (!w && D.documentElement && D.documentElement.clientWidth) {
		w = D.documentElement.clientWidth;
	} else if (!w) {
		w = D.getElementsByTagName('body')[0].clientWidth;
	}
	if (!h && D.documentElement && D.documentElement.clientHeight) {
		h = D.documentElement.clientHeight;
	} else if (!h) {
		h = D.getElementsByTagName('body')[0].clientHeight;
	}
	return {w:w, h:h};
},
/**
 * 
*/
isChrome:function() {
	return (window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1);
},
pagination:function ($page, $totalItems, $perPage, $itemInLine, $prevLabel, $nextLabel) {
	
	$itemInLine = $itemInLine  ? $itemInLine : 10;
	$prevLabel = $prevLabel  ? $prevLabel : '<';
	$nextLabel = $nextLabel  ? $nextLabel : '>';
	var $p = +$page, $maxpage, $maxnum, $start, $end, $o, $data, $i,
	    $k = 0, $isFirstPage = false;

	$maxpage = $maxnum = Math.ceil($totalItems / $perPage);
	if ($maxnum <= 1) {
		return [];
	}
	$start = $p - 1;
	$start = $start < 1 ? 1 : $start;
	$end = $p + $itemInLine;
	
	if ($end > $maxnum) {
		$end = $maxnum;
		$start = $end - $itemInLine;
		$start = $start < 1 ? 1 : $start;
	}
	
	$data = [];
		
	if ($start > 2) {
		$o = {};
		$o.n = 1;
		$data[$k] = $o;
		$k++;
		$isFirstPage = true;
		$start++;
	}
	if ($start > 1) {
		$o = {};
		$o.n = $start - 1;
		$o.text = $prevLabel;
		$data[$k] = $o;
		$k++;
	}
	for ($i = $start; $i <= $end; $i++) {
		$o = {};
		$o.n = $i;
		if ($i == $p) {
			$o.active = 1;
		}
		$data[$k] = $o;
		$k++;
	}
	if ($end + 1 < $maxnum) {
		$o = {};
		$o.n = $end + 1;
		$o.text = $nextLabel;
		$data[$k] = $o;
		$k++;
	}
	if ($end != $maxnum) {
		$o = {};
		$o.n = $maxnum;
		$data[$k] = $o;
		$k++;
	}
	return $data;
},
getCurrenciesArray:function() {
	if (Flipcat && Flipcat.currenciesMap) {
		return Flipcat.currenciesMap;
	}
	return {
		'RUR'  : trans('messages.rub'),
		'rur'  : trans('messages.rub'),
		'TMM'  : trans('messages.tmmsddddd'),
		'KGS'  : trans('messages.kgs'),
		'USD'  : '$',
		'EURO' : '&euro;',
		'SOM'  : trans('messages.sum'),
		'KZT'  : trans('messages.tenge')
	};
},
pluralize:function($n, $root, $one, $less4, $more19) {
	var $m, $n, $lex, $r, $i;
	$m = strval($n);
	if (strlen($m) > 1) {
		$m =  intval( $m.charAt( strlen($m) - 2 ) + $m.charAt( strlen($m) - 1 ) );
	}
	$lex = $root + $less4;
	if ($m > 20) {
		$r = strval($n);
		$i = intval( $r.charAt( strlen($r) - 1 ) );
		if ($i == 1) {
			$lex = $root + $one;
		} else {
			if ($i == 0 || $i > 4) {
			   $lex = $root + $more19;
			}
		}
	} else if ($m > 4 || $m == '00') {
		$lex = $root + $more19;
	} else if ($m == 1) {
		$lex = $root + $one;
	}
	return $lex;
},
lock:function(xpath){
	var block = $(xpath), position = block.css('position'), html, bg, img;
	block.data('position', position);
	
	html = '<div class="prelocker" style="position:absolute;z-index:1000;top:0px; left:0px;background:rgba(255, 255, 255, 0.5)">\
		<img style="position:absolute;z-index:1001;opacity:0;" src="/img/loader.gif" >\
	</div>';
	block.css('position', 'relative');
	bg = $(html);
	bg.find('img')[0].onload = function() {
		img = bg.find('img');
		img.css('left', ( (block.width() - img.width()) / 2 )  ).
			css('top', ( (block.height() - img.height()) / 2 )  );
	};
	bg.css('width', block.width() + 'px');
	bg.css('height', block.height() + 'px');
	bg.css('opacity', 1);
	block.append(bg);
},
unlock:function(xpath){
	if ($(xpath).data('position')) {
		$(xpath).css('position', $(xpath).data('position') );
	}
	$(xpath + ' .prelocker').remove();
},
/**
 * @param {$Object} container контейнер, в который добавляют новые свойства
 * @param {String} tag имя тега - шаблона, содержащего css tpl 
 * @param {Array} config Конфигурация, что на что заменять, элемент массива - объект {key, val}, key- placeholder (можно RegExp) в шаблоне, val - имя поля в элементе массиве data  или функция, в которую будет передан элемент данных и $Object шаблона
 * @param {Array} data Массив элементов
 * @param {Boolean} clearContainer = true Флаг указывает, что надо очистить контейнер
 * @param {String} targetCss необязательный параметр, для более точного поиска элементов в контейнере. Если не передан, то вместо него используется tag
 * @param {Boolean} append необязательный параметр, для более точного поиска элементов в контейнере. Если не передан, то вместо него используется tag
*/
render:function(container, tag, config, data, clearContainer, targetCss) {
	clearContainer = this.True(clearContainer);
	targetCss = String(targetCss) == 'undefined' ? false : targetCss;
	var selector = (targetCss ? targetCss : tag), oTpl = container.find(selector + '.tpl').first(),
		css = String( oTpl.attr('class') ).replace('tpl', ''),
		tpl = oTpl.html(),
		s, i, it, j, newItem
	;
	if (!tpl) {
		return;
	}
	if (clearContainer) {
		container.find(selector).each(function(i, j){
			if (!$(j).hasClass('tpl')) {
				$(j).remove();
			}
		});
	}
	for (i in data) {
		it = data[i];
		s = tpl;
		for (j = 0; j < config.length; j++ ) {
			if (config[j].val instanceof Function) {
				s = s.replace(config[j].key, config[j].val(it, oTpl));
			} else {
				s = s.replace(config[j].key, it[ config[j].val ] );
			}
		}
		newItem = $('<' + tag + ' class="' + css + '">' + s + '</' + tag + '>');
		container.append(newItem);
	}
},
/**
 * @description	Возвращает элемент sel со значением атрибута value = val
 * @param {HTMLSelect} sel
 * @param {String} val
 * @return HTMLOptionElement | Null
*/
__getOptionByValue:function(sel, val) {
	var ls = sel.getElementsByTagName('option'), i;
	for (i = 0; i < ls.length; i++) {
		if ($(ls[i]).attr('value') == val) {
			return ls[i];
		}
	}
	return null;
},
/**
 * @description	Возвращает элемент sel со значением текстового содержимого = val
 * @param {HTMLSelect} sel
 * @param {String} val
 * @return HTMLOptionElement | Null
*/
__getOptionByText:function(sel, val) {
	var ls = sel.getElementsByTagName('option'), i;
	for (i = 0; i < ls.length; i++) {
		if ($(ls[i]).text() == val) {
			return ls[i];
		}
	}
	return null;
},

/**
 * @description Устанавливает переменную в строке link. Заменяет в строке вида base?=a=v1&b=v2&c=v3 значение переменной varName. Если переменной нет, добавляет ее. 
 *  value 
 * может иметь значение CMD_UNSET, тогда переменная будет удалена
*/
setGetVar:function(link, varName, value) {
	var sep = '&', arr = link.split('?'), base = arr[0], tail = arr[1], cmdUnset = 'CMD_UNSET';
	if (!tail) {
		sep = '';
		tail = '';
	}
	if (!~tail.indexOf(varName + '=')) {
		if (value != cmdUnset) {
			tail += sep + varName + '=' + value;
		}
	} else {
		if (value != cmdUnset) {
			tail = tail.replace(new RegExp(varName + '=[^&]*'), varName + '=' + value);
		} else {
			tail = tail.replace(new RegExp(varName + '=[^&]*'), '').replace(/&&/g, '&');
		}
	}
	link = base + '?' + tail;
	return link;
},
/**
 * @descripion Возвращает HTMLOptionElement атрибут value которого равен n
 * @param {HTMLSelectElement} select
 * @param {String} n
 * @return {HTMLOptionElement} | {Null}
*/
getOptionByValue:function(select, n) {
	var i, ls = select.getElementsByTagName('option');
	for (i = 0; i < ls.length; i++) {
		if ( ls[i].value == n ) {
			return ls[i];
		}
	}
	return null;
},
/**
 * @descripion Возвращает HTMLOptionElement текстовое содержимое которого равно n
 * @param {HTMLSelectElement} select
 * @param {String} n
 * @return {HTMLOptionElement} | {Null}
*/
getOptionByText:function(select, n) {
	n = $.trim(n);
	n = n.replace(/&gt;/g, '>');
	n = n.replace(/&lt;/g, '<');
	var i, ls = select.getElementsByTagName('option'), text;
	for (i = 0; i < ls.length; i++) {
		text = $.trim(ls[i].value );
		text = text.replace(/&gt;/g, '>');
		text = text.replace(/&lt;/g, '<');
		if ( text == n ) {
			return ls[i];
		}
	}
	return null;
},
/**
 * @description Выделяет элемент выпадающего списка по его value
 * @return {Boolean} если удалось найти такое значение и выделить, true
*/
selectByValue:function (g, v) {
	for (var i = 0; i < g.options.length; i++) {
		if (g.options[i].value == v) {
			g.options[i].selected = true;
			g.selectedIndex = i;
			return true;
		}
	}
	return false;
},
/**
 * @description Выделяет элемент выпадающего списка по его text
 * @return {Boolean} если удалось найти такое значение и выделить, true
*/
selectByText:function (g, v) {
	for (var i = 0; i < g.options.length; i++) {
		if (g.options[i].text == v) {
			g.options[i].selected = true;
			g.selectedIndex = i;
			return true;
		}
	}
	return false;
},

/**
 * @description Проверяет, не надо ли добавить еще элементов
*/
checkAutoloadItems:function() {
	var b = document.body, w = $(b), o = Flipcat.Orders,
		L = document.getElementsByTagName('main')[0].offsetHeight;
	if (!L) {
		L = document.body.clientHeight -  FlipcatWebAppLibrary.getViewport().h;
	}
	if(window.scrollY >= L - 700) {
		//console.log('L = ' + L + ', Y = ' + window.scrollY);
		if (!o.autoloadProcess) {
			o.autoloadProcess = 1;
			setTimeout(function(){
				o.currentPage = o.currentPage ? o.currentPage + 1 : +FlipcatWebAppLibrary._GET('page', 1);
				if (o.previousAutoloadPage && o.previousAutoloadPage >= o.currentPage) {
					return;
				}
				if (Flipcat.linkListener instanceof Function) {
					try {
						o.previousAutoloadPage = o.currentPage;
						Flipcat.linkListener();
					} catch(e) {;}
				}
				//o.autoloadProcess = 0;
			}, 100);
		}
	}
},
/**
 * @description Сравнивает две строки без учета дефисов, пробелов и прочих знаков препинания
*/
isCmpStrings: function($s1, $s2) {
	$s1 = this._removeDisallowSymbols($s1);
	$s2 = this._removeDisallowSymbols($s2);
	return ( strtolower($s1) ==  strtolower($s2));
},
/**
 * @description Удаляет из строк все символы не буквы и не цифры
*/
_removeDisallowSymbols:function($s) {
	var $lS, $allow, $sz, $r, $i, $ch;
	$lS = mb_strtolower($s, 'UTF-8');
	$allow = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789';
	$sz = mb_strlen($s, 'UTF-8');
	$r = '';
	for ($i = 0; $i < $sz; $i++) {
		$ch = mb_substr($lS, $i, 1, 'UTF-8');
		if(mb_strpos($allow, $ch) !== false) {
			$r += mb_substr($s, $i, 1, 'UTF-8');
		}
	}
	return $r;
},
transliteUrl:function($string) {
	$string = str_replace("ё","e",$string);
	$string = str_replace("й","i",$string);
	$string = str_replace("ю","yu",$string);
	$string = str_replace("ь","",$string);
	$string = str_replace("ч","ch",$string);
	$string = str_replace("щ","sh",$string);
	$string = str_replace("ц","c",$string);
	$string = str_replace("у","u",$string);
	$string = str_replace("к","k",$string);
	$string = str_replace("е","e",$string);
	$string = str_replace("н","n",$string);
	$string = str_replace("г","g",$string);
	$string = str_replace("ш","sh",$string);
	$string = str_replace("з","z",$string);
	$string = str_replace("х","h",$string);
	$string = str_replace("ъ","",$string);
	$string = str_replace("ф","f",$string);
	$string = str_replace("ы","i",$string);
	$string = str_replace("в","v",$string);
	$string = str_replace("а","a",$string);
	$string = str_replace("п","p",$string);
	$string = str_replace("р","r",$string);
	$string = str_replace("о","o",$string);
	$string = str_replace("л","l",$string);
	$string = str_replace("д","d",$string);
	$string = str_replace("ж","j",$string);
	$string = str_replace("э","е",$string);
	$string = str_replace("я","ya",$string);
	$string = str_replace("с","s",$string);
	$string = str_replace("м","m",$string);
	$string = str_replace("и","i",$string);
	$string = str_replace("т","t",$string);
	$string = str_replace("б","b",$string);
	$string = str_replace("Ё","E",$string);
	$string = str_replace("Й","I",$string);
	$string = str_replace("Ю","YU",$string);
	$string = str_replace("Ч","CH",$string);
	$string = str_replace("Ь","",$string);
	$string = str_replace("Щ","SH",$string);
	$string = str_replace("Ц","C",$string);
	$string = str_replace("У","U",$string);
	$string = str_replace("К","K",$string);
	$string = str_replace("Е","E",$string);
	$string = str_replace("Н","N",$string);
	$string = str_replace("Г","G",$string);
	$string = str_replace("Ш","SH",$string);
	$string = str_replace("З","Z",$string);
	$string = str_replace("Х","H",$string);
	$string = str_replace("Ъ","",$string);
	$string = str_replace("Ф","F",$string);
	$string = str_replace("Ы","I",$string);
	$string = str_replace("В","V",$string);
	$string = str_replace("А","A",$string);
	$string = str_replace("П","P",$string);
	$string = str_replace("Р","R",$string);
	$string = str_replace("О","O",$string);
	$string = str_replace("Л","L",$string);
	$string = str_replace("Д","D",$string);
	$string = str_replace("Ж","J",$string);
	$string = str_replace("Э","E",$string);
	$string = str_replace("Я","YA",$string);
	$string = str_replace("С","S",$string);
	$string = str_replace("М","M",$string);
	$string = str_replace("И","I",$string);
	$string = str_replace("Т","T",$string);
	$string = str_replace("Б","B",$string);
	$string = str_replace(" ","_",$string);
	$string = str_replace('"',"",$string);
	$string = str_replace('.',"",$string);
	$string = str_replace("'","",$string);
	$string = str_replace(",","",$string);
	$string = str_replace('\\', "", $string);
	$string = str_replace('?', "", $string);
	return strtolower($string);	
},
/**
 * @description Для каждой ссылки в jQuery объекте $nope имеющей data-href переписывает его значение в href если href="#"
 * @param {jQuery Object} $node
*/
processTemplateLinks:function($node) {
	$node.find('a').each(function(i, a){
		if (a.hasAttribute('data-href') && a.hasAttribute('href') && a.getAttribute('href') == '#') {
			a.setAttribute('href', a.getAttribute('data-href') );
		}
	});
	return $node;
},
/**
 * @description Выводит отформатированную дату 
 * @param {String} $r дата в формате Y-m-d H:i:s
 * @param {Boolean} $breakTime если true то в результате обрезается время
*/
formatDate:function($r, $breakTime) {
    var $a, $_d, $d, $t, $now;
    $breakTime = String($breakTime) == 'undefined' ? false : $breakTime;
    $a = explode(" ", $r);
    $_d = $d = $a[0];
    $t = $a[1];
    $d = explode('-', $d);
    $d = join('.', array_reverse($d));
    
    $t = explode(":", $t);
    //unset($t[2]);
    $t = $t.slice(0, 2);
    $r = $d;
    $now = explode(' ', date('Y-m-d H:i:s'));
    $now = $now[0];
    
    if ($_d == $now) {
        $r = trans('messages.today');
    }
    
    if (!$breakTime) {
        $r += ' ' + trans('messages.time_at') + ' ' + join(':', $t);
    }
    return $r;
},
restreq:function(method, data, onSuccess, url, onFail){
	$('#preloader').show();
	$('#preloader').width(screen.width);
	$('#preloader').height(screen.height);
	$('#preloader div').css('margin-top', Math.round((screen.height - 350) / 2) + 'px');
	
	if (!url) {
		url = window.location.href;
	}
	if (!onFail) {
		onFail = function(){
			Flipcat.Messages.fail(__('messages.Default_fail'));
		};
	}
	switch (method) {
		case 'put':
		case 'patch':
		case 'delete':
			break;
	}
	$.ajax({
		method: method,
		data:data,
		url:url,
		dataType:'json',
		success:onSuccess,
		error:onFail
	});
},
_get:function(onSuccess, url, onFail) {
	FlipcatWebAppLibrary.restreq('get', {}, onSuccess, url, onFail);
}
};//end Object
function extend(a,b){
	var c=new Function();
	c.prototype=a.prototype;
	b.prototype=new c();
	b.prototype.constructor=b;
	b.superclass=a.prototype;
	b.superclass.__construct = a;
}
function setAccordion() {
	var acc = document.getElementsByClassName("accordion");
	var i;
	for (i = 0; i < acc.length; i++) {
		acc[i].onclick = function(){
			this.classList.toggle("active");
			this.nextElementSibling.classList.toggle("show");
		}
	}
}
