var map_options = {
    zoom: 15,
    center: new google.maps.LatLng(55.752883, 37.629748),
    streetViewControl: false,
    mapTypeControl: false
};

var map, marker, circle;
var geocoder = new google.maps.Geocoder();


var $address_template = "<div class='control-group'>\
            <div class='controls'>\
                <span class='draggable'><i class='fa fa-sort'></i></span>&nbsp;\
                <div class='address-title'><a href='#'></a></div>\
                <input type='hidden' name='addresses[][id]' value='0' />\
                <input type='hidden' name='addresses[][name]' value='' />\
                <input type='hidden' name='addresses[][title]' value='' />\
                <input type='hidden' name='addresses[][lat]' value='' />\
                <input type='hidden' name='addresses[][lng]' value='' />\
                <a href='#' class='remove'><span class='fa fa-trash-o'></span></a>\
                </div>\
            </div>";

var $delivery_area_template = "<div class='control-group'>\
            <div class='controls'>\
                <span class='draggable'><i class='fa fa-sort'></i></span>&nbsp;\
                <div class='address-title'><a href='#'></a></div>\
                <input type='hidden' name='delivery_areas[][id]' value='0' />\
                <input type='hidden' name='delivery_areas[][name]' value='' />\
                <input type='hidden' name='delivery_areas[][lat]' value='' />\
                <input type='hidden' name='delivery_areas[][lng]' value='' />\
                <input type='hidden' name='delivery_areas[][delivery_cost]' value='' />\
                <input type='hidden' name='delivery_areas[][delivery_time]' value='' />\
                <input type='hidden' name='delivery_areas[][radius]' value='' />\
                <a href='#' class='remove'><span class='fa fa-trash-o'></span></a>\
                </div>\
            </div>";

function checkMarker()
{
    $("#addressForm input[name=lat]").val("");
    $("#addressForm input[name=lng]").val("");
    if (marker && marker.getVisible())
    {
        var position = marker.getPosition();
        $("#addressForm input[name=lat]").val(position.lat());
        $("#addressForm input[name=lng]").val(position.lng());
        $("#addressFormConfirm").removeAttr("disabled");
    }
    else
        $("#addressFormConfirm").attr("disabled", "disabled");
}

function checkCircle()
{return;
    // if ($("#addressForm input[name=delivery]").prop("checked"))     {
        var radius = parseInt($("#addressForm input[name=radius]").val());
        radius = Math.max(1, radius ? radius : 0);
        //$("#deliveryRadius").slider("enable").slider("setValue", radius);
        circle.setRadius(radius);
        $('#displayRadius').text(radius);
        if (marker.getVisible())
        {
            circle.setVisible(true);
            circle.bindTo('center', marker, 'position');
        }
    //}
    /*else
    {
        //$("#deliveryRadius").slider("disable").slider("setValue", 250);
        circle.setVisible(false);
    }*/
}

function setDeliveryParams()
{
    $("#addressForm input[name=delivery_cost]").val($("#form_delivery_cost").val());
    $("#addressForm input[name=delivery_time]").val($("#form_delivery_time").val());
    /*if ($(".service-delivery-time").hasClass("hide"))
        $("#addressForm input[name=delivery_time]").closest(".control-group").addClass("hide");
    else
        $("#addressForm input[name=delivery_time]").closest(".control-group").removeClass("hide");*/
}

function onClickSearchOnMap(button, silent) {
	onShown();
	
	var $address = $("#addressTitle").val(),
		zoom = 17;
	if (!$.trim($address)) {
		$address = 'Россия';
		map_options.zoom = zoom = 3;
	}
	var $button = $(button);
	$button.button("loading");
	geocoder.geocode({'address': $address}, function(results, status) {
		$button.button("reset");
		if (status == google.maps.GeocoderStatus.OK) {
			if (isset(results, '0', 'address_components', '3', 'long_name')) {
				Flipcat.GoogleMapDialogAdapter.recievedCity = results[0].address_components[3].long_name;
			} else {
				Flipcat.GoogleMapDialogAdapter.recievedCity = '';
			}
			if (!map) {
				map = new google.maps.Map(document.getElementById("map-canvas"), map_options);
				google.maps.event.addListener(map, 'click', function(event) {
					//placeMarker(event.latLng);
					marker.setPosition(event.latLng);
					marker.setVisible(true);
					map.setCenter(event.latLng);
					checkMarker();
					checkCircle();

					geocoder.geocode({location: event.latLng}, function(result) {
						if (result && result[0] && result[0].formatted_address)
							$("#addressForm input[name=title]").val(result[0].formatted_address);
					});
				});
			}
			
			map.setCenter(results[0].geometry.location);
			
			if (!marker) {
				marker = new google.maps.Marker({
					//position: location,
					//visible: false,
					map: map
					//animation: google.maps.Animation.DROP
				});
			}
			
			marker.setOptions({
				visible: true,
				title: $address,
				position: results[0].geometry.location
			});
			map.setZoom(zoom);
			checkMarker();
		} else if(silent != true){
			if ($.trim($(Flipcat.GoogleMapDialogAdapter.HTML_CITY_NAME_TEXT_INPUT_ID).val()).length) {
				show_alert( __('messages.address.Address_not_found_in_city'));
			} else {
				show_alert( __('messages.address.Address_not_found_try_again'));
			}
		}
	});
}


function onShown()
{
	var $isDeliveryArea = $("#addressForm").hasClass("delivery-area");
	var $addressName = $("#addressForm .address-name");
	$("#addressForm input[name=delivery]").prop("checked", $isDeliveryArea);

	$addressName.find("input[name=name]").attr("placeholder", $addressName.find($isDeliveryArea ? ".show-da" : ".hide-da").text());
	
	if (!map)
	{
		map = new google.maps.Map(document.getElementById("map-canvas"), map_options);
		google.maps.event.addListener(map, 'click', function(event) {
			//placeMarker(event.latLng);
			marker.setPosition(event.latLng);
			marker.setVisible(true);
			map.setCenter(event.latLng);
			checkMarker();
			checkCircle();

			geocoder.geocode({location: event.latLng}, function(result) {
				if (result && result[0] && result[0].formatted_address)
					$("#addressForm input[name=title]").val(result[0].formatted_address);
			});
		});
	}

	if (!marker)
	{
		marker = new google.maps.Marker({
			//position: location,
			//visible: false,
			map: map
			//animation: google.maps.Animation.DROP
		});
	}

	if (!circle)
	{
		circle = new google.maps.Circle({
			map: map,
			radius: 0,
			clickable: false,
			fillColor: '#51A351'
		});
	}

	marker.setVisible(false);
	circle.setVisible(false);

	var lat = parseFloat($("#addressForm input[name=lat]").val());
	var lng = parseFloat($("#addressForm input[name=lng]").val());
	if (lat && lng)
	{
		var latlng = new google.maps.LatLng(lat, lng);
		marker.setPosition(latlng);
		marker.setVisible(true);
		map.setCenter(latlng);
		if ($isDeliveryArea)
			map.setZoom(9);
	}

	//$("#deliveryRadius").slider("refresh");

	checkCircle();
	checkMarker();
}

$(function(){
	window.show_alert = function(s) {
		Flipcat.GoogleMapDialogAdapter.lib.messageFail(s);
	}
    $("#addressForm").on("shown", onShown);

    $("#addressForm .btn.search-map-address").click(function(){
        onClickSearchOnMap(this);
    });

    $("#addressForm").on("hidden", onHidden);
    
    function onHidden() {
        $("#addressForm input[name=name]").val("");
        $("#addressForm input[name=title]").val("");
        $("#addressForm input[name=lat]").val("");
        $("#addressForm input[name=lng]").val("");

        $("#addressForm input[name=delivery]").prop("checked", false);

        $("#addressForm input[name=radius]").val(16500);

        //$("#deliveryRadius").slider("setValue", 16500);
        marker.setVisible(false);
        circle.setVisible(false);

        $(this).data("element", null);
    }

    $("#addressFormConfirm").click(function(){
        var $isDeliveryArea = $("#addressForm").hasClass("delivery-area");
        if (!$isDeliveryArea && !$('#addressForm input[name=title]').val())
        {
            show_alert(__("messages.address.set.address"));
        }
        else if ($isDeliveryArea && !$('#addressForm input[name=name]').val())
        {
            show_alert(__("address.set.area.name"));
        }
        else
        {
            var $address_line;
            var $owner = $("body .app > .main > .content > .list > .container-fluid .shop-content .addresses").length ? $("body .app > .main > .content > .list > .container-fluid .shop-content .addresses" + ($isDeliveryArea ? ".delivery-area" : ".simple")) : $("#qualityKeywordsDialog .addresses" + ($isDeliveryArea ? ".delivery-area" : ".simple"));

            if ($("#addressForm").data("element"))
            {
                $address_line = $("#addressForm").data("element");
            }
            else
            {
                if ($isDeliveryArea)
                    $address_line = $($delivery_area_template);
                else
                    $address_line = $($address_template);
                $address_line.appendTo($owner);
            }

            var $name = $isDeliveryArea ? "delivery_areas" : "addresses";

            $address_line.find("input[name="+ $name +"\\[\\]\\[name\\]]").val($('#addressForm input[name=name]').val());
            if (!$isDeliveryArea)
                $address_line.find("input[name="+ $name +"\\[\\]\\[title\\]]").val($('#addressForm input[name=title]').val());
            $address_line.find("input[name="+ $name +"\\[\\]\\[lat\\]]").val($('#addressForm input[name=lat]').val());
            $address_line.find("input[name="+ $name +"\\[\\]\\[lng\\]]").val($('#addressForm input[name=lng]').val());
            
            //$address_line.find("input[name=addresses\\[\\]\\[delivery\\]]").val($("#addressForm input[name=delivery]").prop("checked") ? 1 : 0);
            if ($isDeliveryArea)
            {
                $address_line.find("input[name=delivery_areas\\[\\]\\[radius\\]]").val($('#addressForm input[name=radius]').val());
                $address_line.find("input[name=delivery_areas\\[\\]\\[delivery_cost\\]]").val($('#addressForm input[name=delivery_cost]').val());
                $address_line.find("input[name=delivery_areas\\[\\]\\[delivery_time\\]]").val($('#addressForm input[name=delivery_time]').val());
            }


            //$address_line.find("textarea[name=info_pages\\[\\]\\[content\\]]").val($('#addressForm textarea[name=content]').val());
            $address_line.find(".address-title a").text($('#addressForm input[name=name]').val() ? $('#addressForm input[name=name]').val() : $('#addressForm input[name=title]').val());

            if ($("#addressForm input[name=delivery]").prop("checked") && $address_line.closest("form").find("select[name=service_type]").val() == "none")
            {
                $address_line.closest("form").find("select[name=service_type]").val("local").change();
            }


            $("#addressForm").modal("hide");
            
            
            
            $('#iLat').val( $('#addressForm input[name=lat]').val() );
            $('#iLon').val( $('#addressForm input[name=lng]').val() );
            $('#iRadius').val( $('#addressForm input[name=radius]').val() );
            if(Flipcat.GoogleMapDialogAdapter.parseGoogleAddress()) {
				Flipcat.GoogleMapDialogAdapter.send(onHidden);
			}
			
        }
        return false;
    });

    $("#addressForm input[name=delivery]").click(function(){
        checkCircle();
    });

    $("#selectOnMap").bind('click', address_selectOnMap);
    $("#mSelectOnMap").bind('click', address_selectOnMap);
    
    function address_selectOnMap(){
		var o = window.Flipcat.GoogleMapDialogAdapter,
			address,
			currentPosition, interval, s, i, buf = [], cityName;
		cityName = $.trim( $(o.HTML_CITY_NAME_ID).text() );
		
		if ($(o.HTML_CITY_NAME_TEXT_INPUT_ID)[0]) {
			cityName = $.trim( $(o.HTML_CITY_NAME_TEXT_INPUT_ID).val() );
		}
		address = [o.getStreetNameFromForm(), $(o.HTML_HOME_INPUT_ID).val(), cityName];
		for (i = 0; i < address.length; i++) {
			if ($.trim(address[i])) {
				buf.push( address[i] );
			}
		}
		address = buf.join(', ', buf);
		$(o.HTML_GOOGLE_MAP_DIALOG_INPUT_ADDRESS_ID).val(address);
		onClickSearchOnMap( $(o.HTML_GOOGLE_MAP_DIALOG_BUTTON_FIND_CSS) );
		currentPosition = $('#addressForm input[name=lng]').val() + ',' + $('#addressForm input[name=lat]').val();
		interval = setInterval(function(){
			s = $('#addressForm input[name=lng]').val() + ',' + $('#addressForm input[name=lat]').val();
			if (s != currentPosition || window.initalized) {
				clearInterval(interval);
				window.initalized = true;
				$(o.HTML_LAT_INPUT_ID).val( $('#addressForm input[name=lat]').val() );
				$(o.HTML_LON_INPUT_ID).val( $('#addressForm input[name=lng]').val() );
				$(o.HTML_DISTANCE_INPUT_ID).val( $('#addressForm input[name=radius]').val() );
				
				
				map = marker = circle = null;
				var $addressForm = $("#addressForm");
				var $isDeliveryArea = $(this).hasClass("delivery-area");
				if ($(this).closest("form").find(".addresses" + ($isDeliveryArea ? ".delivery-area" : ".simple") + " > div").length > 39)
				{
					var that = $(this);
					that.popover("show");
					$("body").one("click", function(){that.popover("hide")});
					return false;
				}
				if ($isDeliveryArea) {
					$addressForm.addClass("delivery-area");
					$addressForm.find("input[name=lat]").val(55.7487738);
					$addressForm.find("input[name=lng]").val(37.6170195);
				}
				else
					$addressForm.removeClass("delivery-area");
				setDeliveryParams();
				$addressForm.modal("show");
				
				setTimeout(function(){
					onShown();
				}, 500);
				
				return false;
				
			}
		}, 100);
		//==============================================================
    }
    /*$("#deliveryRadius").slider({
        formater: function(value) {
            return __('address.radius.deliveri') + ': ' + (value ? value / 1000 : 0) + __('address.km');
        }
    }).on('slide', function(slideEvt) {
        if (typeof slideEvt.value == "number")
        {
			$('#displayRadius').text(slideEvt.value);
            $("#addressForm input[name=radius]").val(slideEvt.value);
            checkCircle();
        }
    });*/
    
});
