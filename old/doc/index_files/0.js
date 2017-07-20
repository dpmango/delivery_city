$(init);
function init() {
	Search.init();
}

var Search = {
	HTML_SEARCH_F_ID : '#input-search',
	CONTAINER : '#tocify-header0',
	
	init:function() {
		var o = this;
		$(o.HTML_SEARCH_F_ID).bind('keydown', o.onkeydown);
	},
	onkeydown:function() {
		setTimeout(Search.search, 100)
	},
	search:function() {
		var o = Search;
		var s = $(o.HTML_SEARCH_F_ID).val();
		s = $.trim(s).toLowerCase();
		if (!s) {
			$(o.CONTAINER + ' li').show();
			return;
		}
		var results = [];
		$(o.CONTAINER + ' li').each(function(i, j){
			var q = $(j).find('a').first().text();
			q = $.trim(q).toLowerCase();
			if (~q.indexOf(s)) {
				results.push(j);
			}
			$(j).hide();
		});
		var coll = document.getElementById(o.CONTAINER.replace('#', '')).getElementsByTagName('li');
		for (var i = 0; i < results.length; i++) {
			for (var j = 0; j < coll.length; j++) {
				if (coll[j] == results[i]) {
					var target = results[i];
					var n = parseInt($(target).css('margin-left'));
					$(target).show();
					for (var k = j; k > -1; k--) {
						var cn = parseInt($(coll[k]).css('margin-left'));
						if (cn < n) {
							$(coll[k]).show();
							n = cn;
						}
					}
				}
			}
		}
	}
};
