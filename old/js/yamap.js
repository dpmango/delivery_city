/** @class Яндекс карты для вкладки новости*/
window.Flipcat = window.Flipcat || {};
var M = {
	/** @property {String} */
	HTML_YAMAP_CONTAINER_ID : "#yamap",
	/** @property {String} */
	HTML_YAMAP_POINTS_ID    : "#ymdata",
	
	init:function() {
		var o = this,
			data = $(o.HTML_YAMAP_POINTS_ID ).html(),
			center, points = [];
		try {
			data = JSON.parse(data);
			//console.log(data);
			ymaps.ready(function(){
				try {
					center = o.getCenter(data, points);
					var zoom = center.pop();
					o.map = new ymaps.Map(o.HTML_YAMAP_CONTAINER_ID.replace('#', ''), {
						center: center, 
						zoom: zoom
					});
					for (i = 0; i < points.length; i++) {
						o.map.geoObjects.add(points[i]);
					}
				}catch(e){}
			});
			
		} catch(e){
			//console.log(e);
			data = null;
		}
	},
	/**
	 * 
	*/
	getCenter:function(data, points) {
		var i, lats = [], lngs = [], r =[], minLat, maxLat, minLong,
			maxLong, dX, dY, maxD, corrector = 1, dx = 0;
		for (i = 0; i < data.length; i++) {
			lats.push( data[i].lat );
			lngs.push( data[i].lng );
			points.push( this.prepareItem(data[i]) );
		}
		minLat  = Math.min.apply(null, lats);
		maxLat  = Math.max.apply(null, lats);
		minLong = Math.min.apply(null, lngs);
		maxLong = Math.max.apply(null, lngs);
		
		
		dY = maxLong - minLong;
		dX = maxLat - minLat;
		maxD = (dX > dY ? dX : dY);
		var zoom = 10;
		if (maxD > 1 && maxD < 10) {
			zoom = 6;
		} else if (maxD >= 10 && maxD < 20) {
			zoom = 4;
			
		} else if (maxD < 100 && maxD > 60) {
			zoom = 5;
			corrector = -1;
		} else if (maxD < 60 && maxD > 20) {
			zoom = 3;
		} else if (maxD > 100){
			zoom = 2;
			corrector = -1;
		} else if (maxD < 1 && maxD > 0.1){
			zoom = 10;
			dx = 0.15;
		} else if (maxD < 0.1 && maxD > 0.01){
			zoom = 11;
			dx = 0.01;
		} else {
			zoom = 10;
		}
		
/*		console.log('maxD = ' + maxD);
		console.log('dY = ' + dX);
		console.log('dX = ' + dY);
		console.log('corrector = ' + corrector);*/
		
		r.push(minLat + Math.round((maxLat - minLat) / 2));
		r.push(minLong  + dx + corrector * Math.round((maxLong - minLong) / 2));
		r.push(zoom);
		return r;
	},
	/**
	 * @description Готовит элемент списка для добавления на карту
	*/
	prepareItem:function(item) {
		//console.log(item.name);
		var r = new ymaps.Placemark([item.lat, item.lng],
			{
				hintContent:item.title,
				balloonContent: item.name
			}
		);
		return r;
	}
};
window.Flipcat.Yamap = M;
