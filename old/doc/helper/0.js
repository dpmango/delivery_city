window.e = function(i) {return document.getElementById(i);}
window.onload = init;
function init() {
	var KEY = 'd8sfldspgj';
	var LS = window.localStorage;
	e('in').value = LS.getItem(KEY) ? LS.getItem(KEY) : '';
	e('ok').onclick = main;
	e('in').onkeydown = function() {
		setTimeout(function(){
			LS.setItem(KEY, e('in').value);
			main();
		}, 100);
	};
	e('out').onclick = function() {
		e('out').select();
	};
}
/** Драйвер класса */
function main() {
	var s = e('in').value, i, r = [];
	e('out').value = process(s);
}

function process(s) {
	var tpl = '				<li class="tocify-item" style="cursor: pointer;">\n\
					<a href="[ID]">[TEXT]</a>\n\
				</li>', i, coll = '', id, text, k;
	$('#wk').html(s);
	for (i = 1; i < 6; i++) {
		
		var ls = e('wk').getElementsByTagName('h' + i);
		console.log( 'h' + i + ', L = ' + ls.length );
		
		for (k = 0; k < ls.length; k++) {
			id = '#' + ls[k].id;
			text = ls[k].innerHTML;
			text = tpl.replace('[ID]', id).replace('[TEXT]', text);
			coll += text + "\n";
		}
		
	}
	return coll;
}
