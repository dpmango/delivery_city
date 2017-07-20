$(function() {
	$("#modal").load(
			"/tpl/modal.tpl",
			function() {
				$(".js-get-modal").on("click", function(j) {
					j.preventDefault();
					$(".modal-overlay").addClass("modal-overlay--open");
					$(".modal").removeClass("modal--open");
					$("." + $(this).attr("data-modal")).addClass("modal--open")
				});
				$(".js-close-modal").on("click", function(j) {
					j.preventDefault();
					$(this).parents(".modal").removeClass("modal--open");
					$(".modal-overlay").removeClass("modal-overlay--open")
				});
				$(window).on("keydown", function() {
					if (event.keyCode == 27) {
						$(".modal").removeClass("modal--open");
						$(".modal-overlay").removeClass("modal-overlay--open");
						$(".modal-constructor").remove()
					}
				});
				var g = getParameterByName("forgotPassword");
				if (g != "") {
					$(".modal-forgot > a").click()
				}
				var i = getParameterByName("md_email");
				var h = getParameterByName("md_id");
				if (i != "" && h != "") {
					$(".modal-unsubscribe > a").click();
					$.post("/ajax?action=unsubscribe", {
						md_email : i,
						md_id : h
					})
				}
				if ($("#org-reviews").length) {
					var f = getParameterByName("review");
					if (f != "" && !$(".main-header_user .tooltip").length) {
						$(".modal-login > a").click()
					}
				}
				if ($.cookie("zakaCityDetect") != undefined
						&& location.pathname == "/") {
					$.getScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU",
							function() {
								ymaps.ready(function() {
									ymaps.geolocation.get({
										autoGeocode : true,
										provider : "yandex"
									}).then(geodetect)
								})
							})
				}
				setImputMask()
			});
	$(".js-toggle-tooltip").on("click", function(f) {
		f.preventDefault();
		var g = $(this).parents(".tooltip");
		if (g.hasClass("tooltip--open")) {
			g.removeClass("tooltip--open")
		} else {
			$(".tooltip").removeClass("tooltip--open");
			g.addClass("tooltip--open")
		}
	});
	$(".js-close-tooltip").on("click", function(f) {
		f.preventDefault();
		$(this).parents(".tooltip").removeClass("tooltip--open")
	});
	$(document).on("click", function(f) {
		if (!$(f.target).closest(".ingredients-box").length) {
			if (!$(f.target).closest(".tooltip--open").length) {
				f.stopPropagation();
				$(".tooltip--open").removeClass("tooltip--open")
			}
			if (!$(f.target).closest(".live-search-box").length) {
				f.stopPropagation();
				$(".setip").remove()
			}
			if (!$(f.target).closest(".menu-search-box").length) {
				f.stopPropagation();
				$(".setip-menu").remove()
			}
		}
	});
	if ($(".main-header_user .tooltip").length) {
		if ($(".tooltip_title--star .notice").length && $(".cart-pane").length) {
			var a = parseInt($(".tooltip_title--star .notice").text());
			if (a > 0) {
				$(".cart-pane .tooltip .cart-pane__number").text(a);
				$(".cart-pane .tooltip_content").html(
						$(".tooltip_title--star").next(".tooltip_content")
								.html());
				$(
						".cart-pane .notice-item--empty, .cart-pane .tooltip_content button")
						.remove();
				$(".cart-pane .tooltip").show()
			}
		}
		$(
				".main-header_user .notice-item--empty, .main-header_user .btn--notice, .cart-pane .btn--notice")
				.hide();
		$(".main-header_user .list, .cart-pane .tooltip_content").each(
				function() {
					var f = $(this).find(".notice-item").length;
					$(this).find(".notice-item:gt(2)").hide();
					if (f > 3) {
						$(this).find(".btn--notice").show()
					}
					if (f == 0) {
						$(this).find(".notice-item--empty").show()
					}
				});
		$(".main-header_user .btn--notice, .cart-pane .btn--notice").on(
				"click",
				function() {
					$(this).hide();
					$(this).closest("div").find(".notice-item:gt(2)")
							.slideDown();
					return false
				});
		$(".js-delete-notice").on(
				"click",
				function(h) {
					h.preventDefault();
					var f = $(this).attr("data-type"), i = $(this).attr(
							"data-id");
					if (f == "org") {
						setFavorite(i, 0)
					} else {
						if (f == "msg") {
							var g = parseInt($(
									".tooltip_title--message .notice").text());
							if (g > 1) {
								$(".tooltip_title--message .notice")
										.text(g - 1)
							} else {
								$(".tooltip_title--message .notice").remove()
							}
							$.get("/ajax?action=noticeRemove&id=" + i + "&r="
									+ Math.random())
						}
					}
					$(this).closest(".notice-item").nextAll(
							".notice-item:hidden").first().slideDown(200);
					$(this).closest(".notice-item").slideUp(
							200,
							function() {
								if ($(this).closest(".list").find(
										".notice-item:visible").length == 0) {
									$(this).closest(".list").find(
											".notice-item--empty").slideDown()
								}
								if ($(this).closest(".notice-item").nextAll(
										".notice-item:hidden").length == 0) {
									$(this).closest(".list").find(
											".btn--notice").slideUp()
								}
								$(this).remove()
							});
					return false
				});
		canOrderBonus()
	}
	if ($(".main_bxslider").length) {
		$(".js-tab-control").on(
				"click",
				function(g) {
					g.preventDefault();
					var f = $(this).parents(".js-tab-container");
					f.find(".js-tab-control").removeClass("active");
					$(this).addClass("active");
					f.find(".js-tab").removeClass("js-tab--open");
					f.find("." + $(this).attr("data-tab")).addClass(
							"js-tab--open").css("display", "none").fadeIn(400)
				});
		$(".main_bxslider").bxSlider({
			controls : false,
			auto : true,
			pause : 7000,
			onSlideBefore : function(h, i, f) {
				var g = $(h).attr("class");
				if (g == "animation2") {
					$(".animage1").css({
						right : "-200px",
						opacity : "0"
					});
					$(".animage1").animate({
						opacity : 1,
						right : "40px"
					}, 600);
					$(".animage2").css({
						right : "100px",
						opacity : ".8"
					});
					$(".animage2").animate({
						opacity : 1,
						right : "0px"
					}, 600)
				} else {
					if (g == "animation3") {
						$(".animage3").css({
							right : "-200px",
							opacity : "0"
						});
						$(".animage3").animate({
							opacity : 1,
							right : "40px"
						}, 600);
						$(".animage4").css({
							right : "100px",
							opacity : ".8"
						});
						$(".animage4").animate({
							opacity : 1,
							right : "0px"
						}, 600)
					} else {
						if (g == "animation4") {
							$(".animage7").hide();
							$(".animage6").css("top", "-160px");
							$(".animage5").css("top", "50px")
						}
					}
				}
			},
			onSlideAfter : function(h, i, f) {
				var g = $(h).attr("class");
				if (g == "animation4") {
					$(".animage6").animate({
						top : "30px"
					}, 600, function() {
						$(".animage7").delay(500).fadeIn(400)
					});
					$(".animage5").animate({
						top : "185px"
					}, 600)
				}
			}
		});
		$(".carousel").bxSlider({
			slideWidth : 5000,
			minSlides : 3,
			maxSlides : 3,
			slideMargin : 30,
			pager : false,
			moveSlides : 1,
			infiniteLoop : true
		});
		$(".promos img").each(function() {
			var f = $(this).attr("data-src");
			if (f != "") {
				$(this).attr("src", f)
			}
		})
	}
	$(".promo_bxslider").bxSlider({
		controls : false
	});
	$("#city-select a").click(
			function(g) {
				g.preventDefault();
				var f = $(this).attr("href"), h = window.location.pathname
						.split("/");
				if (h.length > 0) {
					if (h[1] == "restaurants" || h[1] == "food") {
						f += "/" + h[1];
						if (h.length > 1 && h[2] != "comments"
								&& h[2] != "menu" && h[2] != "info") {
							f += "/" + h[2]
						}
						f += window.location.search
					}
				}
				window.location = f
			});
	$("#distr-select a")
			.click(
					function(i) {
						i.preventDefault();
						var h = $(this).attr("data-code"), j = $(this).attr(
								"data-id"), f = $("#distr-select a.selected")
								.attr("data-code"), g = window.location.href;
						if (f !== undefined) {
							g = g.replace(new RegExp(f, "g"), h)
						}
						$.cookie("zakaDistrict", j, {
							expires : 365,
							path : "/"
						});
						window.location = g
					});
	if ($(".sort-block--interactive").length) {
		$(".sort-block--interactive").find(".sort-block_header").on(
				"click",
				function(g) {
					g.preventDefault();
					var f = $(this).parents(".sort-block--interactive");
					if ($(f).hasClass("sort-block--interactive--open")) {
						$(f).find(".sort-block_content").slideUp(
								"fast",
								function() {
									$(f).removeClass(
											"sort-block--interactive--open")
								})
					} else {
						$(f).find(".sort-block_content").slideDown(
								"fast",
								function() {
									$(f).addClass(
											"sort-block--interactive--open")
								})
					}
					return false
				});
		$(".sort-block--interactive .active").closest(
				".sort-block--interactive").addClass(
				"sort-block--interactive--open")
	}
	itemButton();
	$(window).bind("load", function() {
		setTimeout(function() {
			$(window).bind("popstate", function() {
				getUrl(window.location, true)
			})
		}, 0)
	});
	if ($("#orgs").length) {
		var e = true;
		$('aside input[name!="cuisines"], .select.sort input').on("change",
				function(f) {
					f.preventDefault();
					orgFilter();
					e = true
				});
		$('aside input[name="cuisines"]')
				.on(
						"change",
						function(f) {
							if ($(this).is(":checked")
									&& $('aside input[name="cuisine"]:checked').length > 0) {
								$('aside input[name="cuisine"]').prop(
										"checked", false);
								orgFilter();
								e = true
							} else {
								$(this).prop("checked", true)
							}
						});
		topButton(230);
		$(window).scroll(
				function() {
					if ($(window).scrollTop() + $(window).height() > $(
							"#contentBox").height() - 1000
							&& e) {
						e = false;
						var f = $("#infinity").attr("data-next");
						if (typeof f === "undefined") {
							return
						}
						$("#infinity").remove();
						$.get(f, function(g) {
							$(g).appendTo("#contentBox");
							e = true
						})
					}
				})
	}
	if ($("#restoran-page").length) {
		orgClosing();
		if ($("#org-info").length) {
			$.getScript("//yastatic.net/share/share.js")
		}
		topButton(410);
		if ($(".cafe-item_menu").length) {
			$(".list-org_sidebar form").submit(
					function(h) {
						h.preventDefault();
						var f = $(".list-org_sidebar form input").val(), g = $(
								".list-org_sidebar form").attr("action");
						if (f == "" || g == "") {
							return
						}
						$(".list-org_sidebar a").removeClass("active");
						getUrl(g + "?s=" + f, false)
					});
			$(".list-org_sidebar a:not(.parent)").on(
					"click",
					function(g) {
						g.preventDefault();
						$(".list-org_sidebar a").removeClass("active");
						$(this).addClass("active");
						$(this).closest(".sort-block").find(".parent")
								.addClass("active");
						$(".list-org_sidebar form input").val("");
						var f = $(this).attr("href");
						getUrl(f, false);
						$("html, body").animate({
							scrollTop : $("#contentBox").offset().top
						}, 500)
					})
		}
		if ($("#restoran-page").attr("data-work") == "0"
				&& document.referrer.indexOf(document.domain) == -1) {
			if ($(".cafe-item_menu").length) {
				$.get("/objects?action=getOrgWorkCap&id="
						+ $("#restoran-page").attr("data-id"), function(f) {
					if (f != "false") {
						$(f).appendTo("body");
						$(".modal-fix .js-close-modal").on("click",
								function(g) {
									g.preventDefault();
									$(this).parents(".modal-fix").remove();
									$(".modal-overlay-fix").remove()
								})
					}
				})
			}
		}
		$(".menu-live-search")
				.keyup(
						function() {
							if ($(this).val().length > 2) {
								var f = $(this).closest(".menu-live-box");
								$
										.post(
												"/ajax?action=menu.search",
												{
													text : $(this).val(),
													org_id : $("#restoran-page")
															.attr("data-id")
												},
												function(i) {
													var g = $.parseJSON(i), h = "";
													$
															.each(
																	g,
																	function(j,
																			k) {
																		h += '<a href="#" class="setip_menu" onclick="return menuLiveSelect(this);"><img src="'
																				+ k.image
																				+ '"><span>'
																				+ k.name
																				+ "</span></a>"
																	});
													if (h == "") {
														$(f)
																.find(
																		".setip-menu")
																.remove()
													} else {
														if ($(f).find(
																".setip-menu").length) {
															$(f)
																	.find(
																			".setip-menu")
																	.html(h)
														} else {
															$(
																	'<div class="setip-menu">'
																			+ h
																			+ "</div>")
																	.appendTo(f)
														}
													}
												})
							} else {
								$(this).closest(".menu-live-box").find(
										".setip-menu").remove()
							}
						})
	}
	$(".live-search").keyup(
			function() {
				if ($(this).val().length > 2) {
					var f = $(this).closest(".live-search-box");
					$.post("/ajax?action=org.search", {
						text : $(this).val()
					}, function(i) {
						var g = $.parseJSON(i), h = "";
						$.each(g, function(j, k) {
							h += '<a href="' + k.url
									+ '" class="setip_org"><img src="'
									+ k.image + '"><span>' + k.name
									+ "</span></a>"
						});
						if (h == "") {
							$(f).find(".setip").remove()
						} else {
							if ($(f).find(".setip").length) {
								$(f).find(".setip").html(h)
							} else {
								$('<div class="setip">' + h + "</div>")
										.appendTo(f)
							}
						}
					})
				} else {
					$(this).closest(".live-search-box").find(".setip").remove()
				}
			});
	selectInit();
	var d = getParameterByName("utm_source");
	if (document.referrer != "" || d != "") {
		var c = window.location.hostname.split(".").slice(-2).join(".");
		if (document.referrer.indexOf(c) == -1) {
			var b = {};
			b.referer = document.referrer;
			b.utm_source = d;
			b.utm_campaign = getParameterByName("utm_campaign");
			b.utm_content = getParameterByName("utm_content");
			b.uuid = $.cookie("zakaUID");
			if (b.uuid == undefined) {
				b.uuid = "xxxxxxxx-xxxx-4xxx-wxxx-xxxxxxxxxxxx".replace(
						/[xy]/g, function(h) {
							var g = Math.random() * 16 | 0, f = h == "x" ? g
									: (g & 3 | 8);
							return f.toString(16)
						})
			}
			$.cookie("zakaUID", b.uuid, {
				expires : 365,
				path : "/",
				domain : "." + c
			});
			$.post("/ajax?action=utm.add", b)
		}
	}
	if ($("#private-page").length) {
		topButton(410);
		if ($(".cafe-item_menu").length) {
			$(".list-org_sidebar a:not(.parent)").on(
					"click",
					function(g) {
						g.preventDefault();
						$(".list-org_sidebar a").removeClass("active");
						$(this).addClass("active");
						$(this).closest(".sort-block").find(".parent")
								.addClass("active");
						$(".list-org_sidebar form input").val("");
						var f = $(this).attr("href");
						getUrl(f, false);
						$("html, body").animate({
							scrollTop : $("#contentBox").offset().top
						}, 500)
					})
		}
		if ($("#private-map").length) {
			$
					.getScript(
							"https://api-maps.yandex.ru/2.1/?lang=ru_RU",
							function() {
								var g = false, k = [], j = $("#private-map"), f = $("aside"), h = $
										.Callbacks(), i = (function() {
									var l = 0;
									return function() {
										var p = 1 / (360 / ((l++ * 78) % 360)), m = 0.7, o = 0.7, r = m, q = m, t = m, n = Math
												.floor(p * 6), s = p * 6 - n;
										switch (n % 6) {
										case 5:
											q *= (1 - o);
											t *= (1 - s * o);
											break;
										case 0:
											q *= (1 - (1 - s) * o);
											t *= (1 - o);
											break;
										case 3:
											r *= (1 - o);
											q *= (1 - s * o);
											break;
										case 4:
											r *= (1 - (1 - s) * o);
											q *= (1 - o);
											break;
										case 2:
											r *= (1 - o);
											t *= (1 - (1 - s) * o);
											break;
										case 1:
											r *= (1 - s * o);
											t *= (1 - o);
											break
										}
										return "#"
												+ Math.floor(r * 255).toString(
														16)
												+ Math.floor(q * 255).toString(
														16)
												+ Math.floor(t * 255).toString(
														16) + "44"
									}
								})();
								j.on(
										"map",
										function(m, l) {
											(g) ? g.geoObjects.add(l) : h
													.add(function(n) {
														n.geoObjects.add(l)
													})
										}).on(
										"unmap",
										function(m, l) {
											(g) ? g.geoObjects.remove(l) : h
													.add(function(n) {
														n.geoObjects.remove(l)
													})
										});
								ymaps
										.ready(function() {
											f
													.find(
															".sort-block_content a")
													.each(
															function(q) {
																var u = $(this), v = u
																		.data("polygon"), r;
																if (v) {
																	var w = new ymaps.GeoObjectCollection();
																	for (r in v) {
																		var s = v[r], m = {
																			fillColor : i(),
																			geodesic : true
																		}, l = {
																			hintContent : s.name
																		}, t = false;
																		if (+s.type == 1) {
																			s.coords[1] = ymaps.coordSystem.geo
																					.getDistance(
																							s.coords[0],
																							[
																									s.coords[0][0]
																											+ s.coords[1],
																									s.coords[0][1] ]);
																			t = new ymaps.Circle(
																					s.coords,
																					l,
																					m)
																		} else {
																			if (+s.type == 2) {
																				t = new ymaps.Rectangle(
																						s.coords,
																						l,
																						m)
																			} else {
																				t = new ymaps.Polygon(
																						[
																								s.coords,
																								[] ],
																						l,
																						m)
																			}
																		}
																		w
																				.add(t)
																	}
																	u
																			.data(
																					"ygroup",
																					w)
																}
															});
											f
													.find(".sort-block_header")
													.each(
															function(p) {
																var m = $(this), o = m
																		.data("placemark");
																var l = $(this)
																		.text();
																if (o && l) {
																	j
																			.trigger(
																					"map",
																					new ymaps.Placemark(
																							o,
																							{
																								hintContent : l,
																								balloonContent : l
																							}))
																}
															});
											$("aside .h-tooltip").click(
													function() {
														if (k.length) {
															j.trigger("unmap",
																	k.shift())
														}
														var l = $(this).data(
																"ygroup");
														k.push(l);
														j.trigger("map", l);
														return false
													});
											ymaps
													.geocode(j.data("city"))
													.then(
															function(l) {
																g = new ymaps.Map(
																		j
																				.get(0),
																		{
																			center : l.geoObjects
																					.get(0).geometry
																					.getCoordinates(),
																			zoom : 10
																		});
																h.fire(g)
															})
										})
							})
		}
		if ($("#private-chart").length) {
			$
					.getScript(
							"/js/jquery.flot.js",
							function() {
								var f = $.plot("#private-chart", [ {
									data : pgraf.data,
									color : "#fe9601"
								} ], {
									series : {
										lines : {
											show : true
										},
										points : {
											show : true,
											lineWidth : 7,
											fill : true,
											fillColor : "#fe9601"
										}
									},
									grid : {
										hoverable : true,
										clickable : true,
										borderWidth : {
											top : 0,
											right : 0,
											bottom : 2,
											left : 0
										}
									},
									xaxis : {
										ticks : pgraf.ticks
									},
								});
								$("#private-chart")
										.bind(
												"plothover",
												function(i, k, h) {
													if (h) {
														var g = h.datapoint[0]
																.toFixed(2), j = h.datapoint[1]
																.toFixed(2);
														$(
																"#private-chart-tooltip")
																.html(
																		parseInt(j))
																.css(
																		{
																			top : h.pageY - 20,
																			left : h.pageX + 25
																		})
																.fadeIn(200)
													} else {
														$(
																"#private-chart-tooltip")
																.hide()
													}
												})
							})
		}
	}
});
function bonusShare(a, b) {
	if (a == "tw") {
		$(b).attr(
				"href",
				"https://twitter.com/intent/tweet?url=https://" + location.host
						+ "&text=" + $("title").text())
	}
	if (a == "fb") {
		$(b)
				.attr(
						"href",
						"https://twitter.com/intent/tweet?url=https://"
								+ location.host)
	}
	if (a == "vk") {
		$(b).attr("href",
				"http://vk.com/share.php?url=https://" + location.host)
	}
	$.post("/ajax?action=bonus.share", {
		network : a
	}, function(c) {
		if (c == "allready") {
			$(".modal-bonus-allready a").click()
		} else {
			if (c == "true") {
				$(".modal-bonus-add a").click()
			}
		}
	});
	return true
}
function orgFilter() {
	var b = "/" + $("#orgs").attr("data-type"), d, a = [], f = [], e = $('aside input[name="cuisine"]:checked').length;
	if (e > 0) {
		if (e == 1) {
			d = $('aside input[name="cuisine"]:checked').val();
			if (d !== undefined) {
				b += "/" + d
			}
		} else {
			$('aside input[name="cuisine"]:checked').each(function() {
				a.push($(this).attr("data-id"))
			});
			if (a.length > 0) {
				f.push("cuisines=" + a.join(","))
			}
		}
		$('aside input[name="cuisines"]').prop("checked", false)
	} else {
		$('aside input[name="cuisines"]').prop("checked", true)
	}
	var g = $("#distr-select a.selected").attr("data-code");
	if (g !== undefined) {
		b += (d !== undefined ? "/" : "/all/") + g
	}
	$('aside input[type="checkbox"]:checked').each(function() {
		if ($(this).attr("name") == "cuisine") {
			return
		}
		if ($(this).attr("name") == "cuisines") {
			return
		}
		if ($(this).val() == "") {
			return
		}
		f.push($(this).attr("name") + "=" + $(this).val())
	});
	var c = parseInt($(".select.sort input").val());
	if (c > 1) {
		f.push("sort=" + c)
	}
	if (f.length > 0) {
		b += "?" + f.join("&")
	}
	getUrl(b, false)
}
function menuLiveSelect(b) {
	var c = $(b).find("span").text();
	if (c == "") {
		return
	}
	var a = $(".menu-live-box");
	$(a).find("input").val(c);
	$(a).find(".setip-menu").remove();
	$(a).submit();
	return false
}
/*function geodetect(a) {
	$.removeCookie("zakaCityDetect");
	var c = {}, d;
	$("#city-select .find-list_select").each(function() {
		c[$(this).text()] = $(this).attr("href")
	});
	d = a.geoObjects.get(0).properties
			.get("metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName");
	if (d != undefined) {
		for ( var b in c) {
			if (d.indexOf(b) != -1) {
				return showCityDialog(b, c[b])
			}
		}
	}
	d = a.geoObjects.get(0).properties
			.get("metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName");
	if (d != undefined) {
		for ( var b in c) {
			if (d.indexOf(b) != -1) {
				return showCityDialog(b, c[b])
			}
		}
	}
	d = a.geoObjects.get(0).properties
			.get("metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName");
	if (d != undefined) {
		for ( var b in c) {
			if (d.indexOf(b) != -1) {
				return showCityDialog(b, c[b])
			}
		}
	}
	return true
}*/
function topButton(a) {
	$("#top").click(function() {
		$("body, html").animate({
			scrollTop : a
		}, 1000)
	});
	$(window)
			.scroll(
					function() {
						if ($(window).scrollTop() > $("aside").height() + a
								&& $(window).scrollTop() < $("#contentBox")
										.height() + 150) {
							$("#top").fadeIn()
						} else {
							$("#top").fadeOut()
						}
					})
}
function selectInit() {
	$(".select").each(
			function() {
				var a = $(this);
				$(a).find("a").on("click", function(c) {
					if ($(this).is(":focus")) {
						$(this).focus()
					}
					return false
				});
				if ($(a).find('input[type="text"]').length) {
					if ($(a).find('input[name="street"]').length) {
						var b = $(a).find("li:first").attr("data-value");
						if (b != undefined) {
							b = b.split("::");
							if (b.length > 3) {
								$('.cart-form input[name="street"]').val(b[0]);
								$('.cart-form input[name="home"]').val(b[1]);
								$('.cart-form input[name="building"]')
										.val(b[2]);
								$('.cart-form input[name="flat"]').val(b[3])
							}
						}
					} else {
						$(a).find('input[type="text"]').val(
								$(a).find("li:first").text())
					}
					$(a).find('input[type="hidden"]').val(
							$(a).find("li:first").attr("data-value"))
				}
				if ($(a).find("li").size() > 1) {
					$(a).find('input[type="text"]').addClass("combo");
					$(a).find("li").on(
							"click",
							function(d) {
								$(a).find("span").text($(this).text());
								if ($(a).find('input[name="street"]').length) {
									var c = $(this).attr("data-value");
									c = c.split("::");
									if (c.length > 3) {
										$('.cart-form input[name="street"]')
												.val(c[0]);
										$('.cart-form input[name="home"]').val(
												c[1]);
										$('.cart-form input[name="building"]')
												.val(c[2]);
										$('.cart-form input[name="flat"]').val(
												c[3])
									}
								} else {
									$(a).find('input[type="text"]').val(
											$(this).text())
								}
								$(a).find('input[type="hidden"]').val(
										$(this).attr("data-value")).change();
								$(a).find("a").blur()
							})
				}
			})
}
function itemButton() {
	if ($(".product-item").length) {
		$(".product-item button.btn--green").off("click").on("click",
				function(a) {
					a.stopPropagation();
					addToCart($(this).closest(".product-item"))
				})
	}
}
function canOrderBonus() {
	if (!$("#bonus-items").length || !$(".main-header_user .tooltip").length) {
		return
	}
	if ($(".cart-pane").attr("data-score") == "1") {
		$("#bonus-items").hide();
		return
	}
	var a = parseInt($(".main-header_user .user-info_ball").attr("data-score"));
	$("#bonus-items .notification p")
			.html(
					"В этом заведении Вы можете потратить Ваши бонусные баллы на бесплатное блюдо. Выбрать можно только одно блюдо.");
	$("#bonus-items .product-item").each(
			function() {
				var b = parseInt($(this).attr("data-work"));
				if (b) {
					var c = parseInt($(this).find(
							".product-item_bonus:first span").text());
					if (a >= c) {
						$(this).find("div.button").removeClass("h-tooltip");
						$(this).find("button").removeAttr("disabled")
								.removeClass("btn--grey")
								.addClass("btn--green")
					} else {
						$(this).find(".b-tooltip").html(
								"У вас не хватает баллов")
					}
				}
			});
	$("#bonus-items .product-item button.btn--green").click(function(b) {
		b.preventDefault();
		addToCart($(this).closest(".product-item"))
	})
}
function addToCart(f) {
	if (checkDistrict()) {
		var b = $(f).attr("data-id"), i = $(f).attr("data-type"), k = $(f)
				.attr("data-constructor");
		if (i == "item" && k == "2") {
			constructors.load(f);
			return
		}
		$.get("/ajax?action=addToCart&id=" + b + "&type=" + i + "&r="
				+ Math.random(), function(m) {
			if (m != "false") {
				data = m.split(":");
				if (data.length > 1) {
					$(".cart-pane__item > .cart-pane__number").text(data[0]);
					$(".cart-pane__sum").text(data[1] + " P")
				}
			}
		});
		$(".cart-pane").slideDown();
		var g = $(f).find("img:first").clone().addClass("move-img");
		$("body").append(g);
		var h = $(f).find("img").offset(), c = $(".cart-pane__logo").offset();
		g.css({
			position : "absolute",
			top : h.top,
			left : h.left,
			opacity : 0.8,
			"border-radius" : "0",
			"z-index" : 1000
		});
		g.animate({
			left : c.left,
			top : c.top,
			opacity : 0,
			width : 50,
			height : 50,
			borderRadius : "50%"
		}, 500, function() {
			$(".move-img").remove()
		});
		if (i == "bonus") {
			$("#bonus-items").slideUp();
			$(".cart-pane").attr("data-score", "1")
		}
		if (i == "item") {
			if (typeof __GetI === "undefined") {
				__GetI = []
			}
			var d = {
				type : "CART_ADD",
				site_id : "479",
				product_id : b,
				product_price : $(f).find(".product-item_bonus span").text()
			};
			__GetI.push(d);
			var e = (typeof __GetI_domain) == "undefined" ? "px.adhigh.net"
					: __GetI_domain;
			d.forward_tag = d.forward_tag || false;
			var a = ("https:" == document.location.protocol ? "https://"
					: "http://")
					+ e + "/p.js";
			var j = document.createElement("script");
			j.type = "text/javascript";
			j.src = a;
			var l = document.getElementsByTagName("script")[0];
			l.parentNode.insertBefore(j, l)
		}
	}
}
function checkDistrict() {
	if ($.cookie("zakaDistrict") == undefined || $.cookie("zakaDistrict") == 0) {
		$("html, body").animate({
			scrollTop : 0
		}, 400);
		$("#distr-select").closest(".tooltip").addClass("tooltip--open");
		dataLayer.push({
			event : "no_district"
		});
		return false
	}
	return true
}
function removeAddress(b, a) {
	$(a).parents(".adress-item").slideUp(200);
	$.get("/ajax?action=removeAddress&id=" + b + "&r=" + Math.random());
	return false
}
function removeCard(b, a) {
	$(a).parents(".card-item").slideUp(200);
	$.get("/ajax?action=removeCard&id=" + b + "&r=" + Math.random());
	return false
}
function addCard() {
	$.get("/ajax?action=addCard&r=" + Math.random(), function(a) {
		if (a != "false") {
			window.location = a
		}
	});
	return false
}
function rePayment(a) {
	$.get("/ajax?action=rePayment&id=" + a + "&r=" + Math.random(),
			function(b) {
				if (b != "false") {
					window.location = b
				}
			});
	return false
}
function cashPayment(a) {
	$.get("/ajax?action=cashPayment&id=" + a + "&r=" + Math.random(), function(
			b) {
		if (b != "false") {
			window.location = b
		}
	});
	return false
}
function setFavorite(e, d) {
	var b = 1;
	if (d == 1) {
		$.get("/ajax?action=favoriteAdd&id=" + e + "&r=" + Math.random());
		if ($(".favorite").length) {
			var c = parseInt($("#restoran-page").attr("data-id"));
			if (e == c) {
				$(".favorite i").removeClass("sprite-fav-off").addClass(
						"sprite-fav-on");
				$(".favorite a").text("В избранном").attr("onclick",
						"return setFavorite(" + e + ", 0);")
			}
		}
	} else {
		$.get("/ajax?action=favoriteRemove&id=" + e + "&r=" + Math.random());
		if ($(".favorite").length) {
			var c = parseInt($("#restoran-page").attr("data-id"));
			if (e == c) {
				$(".favorite i").removeClass("sprite-fav-on").addClass(
						"sprite-fav-off");
				$(".favorite a").text("В избранное").attr("onclick",
						"return setFavorite(" + e + ", 1);")
			}
		}
		b = -1
	}
	if ($(".tooltip_title--star .notice").length) {
		var a = parseInt($(".tooltip_title--star .notice").text()) + b;
		if (a > 0) {
			$(
					".tooltip_title--star .notice, .cart-pane .tooltip .cart-pane__number")
					.text(a)
		} else {
			$(".tooltip_title--star .notice").remove();
			$(".cart-pane .tooltip .cart-pane__number").text("0")
		}
	} else {
		if (b == 1) {
			$('<span class="notice">1</span>').appendTo(".tooltip_title--star");
			$(".cart-pane .tooltip .cart-pane__number").text("1")
		}
	}
	return false
}
function userLogin() {
	var a = {};
	$(".modal-login input").each(function() {
		a[$(this).attr("name")] = $(this).val()
	});
	$.post("/ajax?action=login2", a, function(b) {
		if (b == "true") {
			location.reload()
		} else {
			if (b == "sms") {
				sms.show(a.phone)
			} else {
				if (b == "false") {
					b = "Произошла ошибка, <br> попробуйте повторить запрос."
				}
				$(".modal-login > a").click();
				$(".modal-login .text-center").css("color", "red").html(b)
			}
		}
	});
	$(".modal-loader a").click();
	return false
}
var sms = {
	time : 40,
	phone : "",
	show : function(a) {
		sms.phone = a;
		$(".modal-sms .info span").html(sms.phone);
		$('.modal-sms input[name="phone"]').val(sms.phone);
		$(".modal-sms > a").click();
		sms.time = 40;
		sms.timer()
	},
	timer : function() {
		sms.time -= 1;
		if (sms.time > 0) {
			$(".modal-sms .modal-login_text span").text(
					"через "
							+ sms.time
							+ " "
							+ decOfNum(sms.time, [ "секунду", "секунды",
									"секунд" ]));
			setTimeout(sms.timer, 1000)
		} else {
			$(".modal-sms .modal-login_text span").text("")
		}
	},
	login : function() {
		var a = {};
		$(".modal-sms input").each(function() {
			a[$(this).attr("name")] = $(this).val()
		});
		a.phone = sms.phone;
		$.post("/ajax?action=login.sms", a, function(b) {
			if (b == "true") {
				location.reload()
			} else {
				if (b == "false") {
					b = "Произошла ошибка, <br> попробуйте повторить запрос."
				}
				$(".modal-sms > a").click();
				$(".modal-sms .modal_note").css("color", "red")
						.html("<br>" + b)
			}
		});
		$(".modal-loader a").click();
		return false
	},
	repeat : function() {
		if (sms.time == 0) {
			$
					.post(
							"/ajax?action=login2",
							{
								phone : sms.phone
							},
							function(a) {
								if (a == "sms") {
									sms.show(sms.phone)
								} else {
									if (a == "false") {
										a = "Произошла ошибка, <br> попробуйте повторить запрос."
									}
									$(".modal-sms > a").click();
									$(".modal-sms .modal_note").css("color",
											"red").html("<br>" + a)
								}
							});
			$(".modal-loader a").click()
		}
		return false
	},
};
function userReg() {
	var b = {};
	var a = false;
	$(".modal-registration input").each(function() {
		if ($(this).prop("required") && $(this).val() == "") {
			$(this).addClass("error");
			a = true
		} else {
			$(this).removeClass("error")
		}
		b[$(this).attr("name")] = $(this).val()
	});
	if (a) {
		return false
	}
	$.post("/ajax?action=userReg", b, function(c) {
		if (c == "true") {
			location.reload();
			dataLayer.push({
				event : "registration"
			})
		} else {
			if (c == "false") {
				c = "Произошла ошибка, <br> попробуйте повторить запрос."
			}
			$(".modal-registration > a").click();
			$(".modal-registration .text-center").css("color", "red").css(
					"padding-top", "10px").html(c)
		}
	});
	$(".modal-loader a").click();
	return false
}
function userFastReg(b) {
	var c = {};
	var a = false;
	$(b).find("input").each(function() {
		if ($(this).prop("required") && $(this).val() == "") {
			$(this).addClass("error");
			a = true
		} else {
			$(this).removeClass("error")
		}
		c[$(this).attr("name")] = $(this).val()
	});
	if (a) {
		return false
	}
	$.post("/ajax?action=userFastReg", c);
	$(b)
			.fadeOut(
					"normal",
					function() {
						$(b)
								.html(
										'<p class="ty_reg_fast">Через несколько минут Вам придет письмо с логином и паролем, для доступа в личный кабинет</p>')
								.fadeIn("normal");
						dataLayer.push({
							event : "registr_typ"
						})
					});
	return false
}
function userExit() {
	$.get("/ajax?action=userExit&r=" + Math.random(), function(a) {
		location.reload()
	});
	$(".modal-loader a").click();
	return false
}
function sendFromPrivate() {
	var a = {};
	$(".modal-private input, .modal-private textarea").each(function() {
		if ($(this).val() == "") {
			return false
		}
		a[$(this).attr("name")] = $(this).val()
	});
	$(".modal-private textarea").val("");
	$.post("/ajax?action=sendFromPrivate", a, function(b) {
		$(".modal-confirm a").click()
	});
	$(".modal-loader a").click();
	return false
}
function reviewSubscribe() {
	var a = {};
	$(".modal-reviews input").each(function() {
		if ($(this).val() == "") {
			return false
		}
		a[$(this).attr("name")] = $(this).val()
	});
	$('.modal-reviews input[name="email"]').val("");
	$.post("/ajax?action=review.subscribe.add", a, function(b) {
		location.reload()
	});
	$(".modal-loader a").click();
	return false
}
function removeReviewSubscribe(c, b) {
	var a = $(b).closest("div.mail").find("div").text();
	$.post("/ajax?action=review.subscribe.remove", {
		org_id : c,
		email : a
	});
	$(b).closest("div.mail").slideUp();
	return false
}
function sendFeedback() {
	var a = {};
	$(".modal-support input, .modal-support textarea").each(function() {
		if ($(this).val() == "") {
			return false
		}
		a[$(this).attr("name")] = $(this).val()
	});
	$(".modal-support textarea").val("");
	$.post("/ajax?action=sendFeedback", a, function(b) {
		$(".modal-confirm a").click()
	});
	$(".modal-loader a").click();
	return false
}
function getParameterByName(a) {
	a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var c = new RegExp("[\\?&]" + a + "=([^&#]*)"), b = c.exec(location.search);
	return b == null ? "" : decodeURIComponent(b[1].replace(/\+/g, " "))
}
function forgotPassword() {
	var a = {};
	$(".modal-recovery input").each(function() {
		if ($(this).val() == "") {
			return false
		}
		a[$(this).attr("name")] = $(this).val()
	});
	$.post("/ajax?action=forgotPassword", a, function(b) {
		if (b == "true") {
			$(".modal-confirm a").click()
		} else {
			if (b == "false") {
				b = "Произошла ошибка, <br> попробуйте повторить запрос."
			}
			$(".modal-recovery .info").css("color", "red").html(b);
			$(".modal-recovery > a").click()
		}
	});
	$(".modal-loader a").click();
	return false
}
function changePassword() {
	var a = {};
	a.token = getParameterByName("forgotPassword");
	$(".modal-forgot input").each(function() {
		if ($(this).val() == "") {
			return false
		}
		a[$(this).attr("name")] = $(this).val()
	});
	$.post("/ajax?action=changePassword", a, function(b) {
		if (b == "true") {
			window.location = "/"
		} else {
			if (b == "false") {
				b = "Произошла ошибка, <br> попробуйте повторить запрос."
			}
			$(".modal-forgot .info").css("color", "red").html(b);
			$(".modal-forgot > a").click()
		}
	});
	$(".modal-loader a").click();
	return false
}
function sendPartnerForm() {
	var a = {};
	$(".modal-partners input, .modal-partners textarea").each(function() {
		a[$(this).attr("name")] = $(this).val()
	});
	if (a.title == "" || a.city == "" || a.name == "" || a.phone == "") {
		return false
	}
	$(".modal-partners textarea").val("");
	$.post("/ajax?action=sendPartnerForm", a, function(b) {
		$(".modal-confirm a").click()
	});
	$(".modal-loader a").click();
	return false
}
var photoCss = {};
function previewPhoto(b) {
	if (photoCss.background == undefined) {
		photoCss.background = $(".profile-page_profile-image")
				.css("background");
		photoCss["background-size"] = $(".profile-page_profile-image").css(
				"background-size")
	}
	if (b.files && b.files[0]) {
		var a = new FileReader();
		a.onload = function(c) {
			$(".profile-page_profile-image").css("background",
					"url(" + c.target.result + ") no-repeat center").css(
					"background-size", "cover");
			$("#removePhoto").val("false")
		};
		a.readAsDataURL(b.files[0])
	} else {
		$(".profile-page_profile-image").css("background", photoCss.background)
				.css("background-size", photoCss["background-size"])
	}
}
function removePhoto() {
	$(".profile-page_profile-image").css("background",
			"url(/img/upload-photo-bg.png) no-repeat center center/50% auto")
			.css("background-size", "");
	$("#upload").val("");
	$("#removePhoto").val("true");
	return false
}
function setImputMask() {
	var a = {
		onKeyPress : function(b, d, e, c) {
			if (b.indexOf("+7 (89") != -1 || b.indexOf("+7 (79") != -1) {
				$(e).val("+7 (9")
			}
		}
	};
	$('form input[type="tel"]').focus(function() {
		if (this.value.length == 0) {
			this.value = "+7 (";
			if (this.setSelectionRange) {
				this.setSelectionRange(this.value.length, this.value.length)
			}
		}
	}).blur(function() {
		if (this.value == "+7 (") {
			this.value = ""
		}
	}).mask("+7 (000) 000-00-00", a)
}
function saveSettings() {
	var c = $("#in3").val(), b = $("#in4").val(), a = "";
	if (c.length > 0 && c.length < 3) {
		a = "Необходим пароль от 3-х символов"
	}
	if (c.length > 0 && c != b) {
		a = "Указанные пароли не совпадают"
	}
	if (a != "") {
		$("#in4").closest("div").find("p").remove();
		$("html, body").animate({
			scrollTop : $("#in1").offset().top
		}, 400);
		$("#in4").after('<p style="color:red">' + a + "</p>");
		return false
	}
	return true
}
function addReview(c) {
	var e = $(c).attr("data-id"), d = $(c).find("textarea").val(), a = parseInt($(
			c).find("input").val());
	if (a == 0) {
		$(".review-error").slideDown();
		return false
	}
	if (a > 0) {
		var b = $(c).closest(".row");
		$(b)
				.slideUp(
						"fast",
						function() {
							$(b)
									.html(
											'<div class="org-description"><b>Спасибо за отзыв!</b><br>Скоро он появится на сайте.</div>')
									.slideDown()
						});
		$.post("/ajax?action=addReview", {
			id : e,
			text : d,
			rate : a
		})
	}
	return false
}
function removeItem(b, a) {
	$.get("/cart?action=removeCartItem&ajax=1&id=" + b + "&org_id=" + a + "&r="
			+ Math.random(), function(c) {
		cartUpdate(c)
	});
	$("#item" + b).slideUp(200)
}
function removeСonstructor(b, a) {
	$.get("/cart?action=removeCartConstructor&ajax=1&id=" + b + "&org_id=" + a
			+ "&r=" + Math.random(), function(c) {
		cartUpdate(c)
	});
	$("#constructor" + b).slideUp(200)
}
function removeOrg(a) {
	$.get("/cart?action=removeCartOrg&ajax=1&id=" + a + "&r=" + Math.random(),
			function(b) {
				cartUpdate(b)
			});
	$("#org" + a).slideUp(200)
}
function incrementItem(d, b, c) {
	var a = parseInt($("#item" + d).find("input").val());
	if (c == -1 && a == 1) {
		removeItem(d, b);
		return false
	}
	$.get("/cart?action=incrementCartItem&ajax=1&id=" + d + "&org_id=" + b
			+ "&value=" + c + "&r=" + Math.random(), function(e) {
		cartUpdate(e)
	});
	$("#item" + d).find("input").val(a + c);
	return false
}
function incrementConstructor(d, b, c) {
	var a = parseInt($("#constructor" + d).find("input").val());
	if (c == -1 && a == 1) {
		removeСonstructor(d, b);
		return false
	}
	$.get("/cart?action=incrementCartConstructor&ajax=1&id=" + d + "&org_id="
			+ b + "&value=" + c + "&r=" + Math.random(), function(e) {
		cartUpdate(e)
	});
	$("#constructor" + d).find("input").val(a + c);
	return false
}
function removeBonus(b, a) {
	$.get("/cart?action=removeCartBonus&ajax=1&org_id=" + a + "&r="
			+ Math.random(), function(c) {
		cartUpdate(c)
	});
	$("#score" + b).slideUp(400);
	return false
}
function removeFromCombo(c, b, a) {
	$.get("/cart?action=removeFromCombo&ajax=1&id=" + b + "&org_id=" + a
			+ "&combo_id=" + c + "&r=" + Math.random(), function(e) {
		cartUpdate(e)
	});
	$("#combo" + b).slideUp(400);
	return false
}
function cartUpdate(c) {
	if (c.indexOf("b-empty") != -1 && document.referrer != "") {
		var b = window.location.hostname.split(".").slice(-2).join(".");
		if (document.referrer.indexOf(b) != -1) {
			window.location = document.referrer;
			return false
		}
	}
	var a = {};
	$(".cart-form input, .cart-form textarea").each(function() {
		a[$(this).attr("name")] = $(this).val()
	});
	$("#contentBox").html(c);
	selectInit();
	setImputMask();
	$(".cart-form input, .cart-form textarea").each(
			function() {
				if ($(this).attr("type") == "radio") {
					return
				}
				if (a[$(this).attr("name")] !== undefined) {
					$(this).val(a[$(this).attr("name")]);
					if ($(this).closest(".select").length) {
						var d = $(this).closest(".select"), e = $(d).find(
								'li[data-value="' + a[$(this).attr("name")]
										+ '"]').text();
						$(d).find("span").text(e)
					}
				}
			})
}
function makeOrder() {
	if (checkDistrict()) {
		var b = {};
		var a = false;
		$(".cart-form input, .cart-form textarea").each(
				function() {
					if ($(this).attr("type") == "radio"
							&& $(this).prop("checked") == false) {
						return
					}
					if ($(this).prop("required") && $(this).val() == "") {
						$(this).addClass("error");
						a = true
					} else {
						$(this).removeClass("error")
					}
					b[$(this).attr("name")] = $(this).val()
				});
		if (a) {
			return false
		}
		$.post("/ajax?action=makeOrder", b, function(e) {
			if (e == "false") {
				location.reload()
			} else {
				if (e == "ban") {
					window.location = "/ban"
				} else {
					var c = JSON.parse(e);
					if (c.payment_link == "") {
						window.location = "/accept?order=" + c.orders
					} else {
						window.location = c.payment_link
					}
				}
			}
		});
		$(".modal-loader a").click()
	}
	return false
}
/*function showCityDialog(b, a) {
	if (b == $("#current-city").text()) {
		return true
	}
	$(".modal-city form").attr("action", a);
	$(".modal-city .modal_title span").text(b + "?");
	$(".modal-city > a").click();
	$(".modal-city .btn--green").click(function(c) {
		window.location = a
	});
	$(".modal-city .btn--grey").click(function(c) {
		$(".modal-city .js-close-modal").click();
		$("html, body").animate({
			scrollTop : 0
		}, 400);
		$("#city-select").closest(".tooltip").addClass("tooltip--open");
		return false
	});
	return false
}*/
function orderReason() {
	var b = $("#reasonForm input:checked").val();
	var c = "";
	if (b == "0") {
		c = $('#reasonForm input[name="other"]').val()
	} else {
		c = $("#reasonForm input:checked").next("label").text()
	}
	if (c == "") {
		return false
	}
	var a = {};
	a.reason = b;
	a.text = c;
	a.token = $("#reasonForm").attr("data-order");
	$.post("/ajax?action=orderReason", a, function(e) {
		$(".ty_form").hide();
		$(".ty_title").text("Заказ отменен")
	});
	return false
}
function onlineAmountCorrect() {
	var a = $("#onlineAmountCorrect input").val();
	a = parseInt(a);
	var b = {};
	b.amount = a;
	b.token = $("#onlineAmountCorrect").attr("data-order");
	$
			.post(
					"/ajax?action=orderAmountCorrect",
					b,
					function(c) {
						if (c == "true") {
							$("#onlineAmountCorrect").html(
									"Информация изменена!")
						} else {
							$("#onlineAmountCorrect")
									.html(
											'<div class="error">Произошла ошибка!<br><br>Для изменения сумы заказа свяжитесь с нами по телефону.')
						}
					});
	return false
}
function orderDeliveryTime() {
	var c = $("#deliveryTimeForm input:checked").val();
	var b = $('#deliveryTimeForm input[name="custom"]').val();
	var a = {};
	a.time = c;
	a.custom = b;
	a.token = $("#deliveryTimeForm").attr("data-order");
	$.post("/ajax?action=orderTimeConfirm", a, function(e) {
		$(".ty_form").hide();
		$(".ty_title").text("Заказ подтвержден")
	});
	return false
}
function showFullText() {
	$(".seo-org .readmore").hide();
	$(".seo-org-overflow").removeClass("shadow").animate({
		"max-height" : $(".seo-org-overflow")[0].scrollHeight
	}, 500);
	return false
}
function isHhistoryApiAvailable() {
	return !!(window.history && history.pushState)
}
function getUrl(b, a) {
	if (isHhistoryApiAvailable) {
		if (b != window.location || a) {
			$.get(b, {
				ajax : 1
			}, function(c) {
				if (!a) {
					window.history.pushState(null, null, b)
				}
				$("#contentBox").html(c);
				canOrderBonus();
				itemButton()
			})
		}
	} else {
		window.location = b
	}
	return false
}
function decOfNum(a, b) {
	cases = [ 2, 0, 1, 1, 1, 2 ];
	return b[(a % 100 > 4 && a % 100 < 20) ? 2 : cases[(a % 10 < 5) ? a % 10
			: 5]]
}
function orgClosing() {
	if ($("#restoran-page").attr("data-work") == "0") {
		return false
	}
	var c = $(".before-closing").attr("data-closing");
	if (c != "" && c != undefined) {
		var f = new Date(), e = new Date(c), d = $(".before-closing").attr(
				"data-type");
		if (e < f) {
			$(".before-closing").html(
					'<i class="sprite sprite-ico-clock-orange"></i> '
							+ (d == "food" ? "Магазин" : "Ресторан")
							+ " закрылся!");
			return false
		}
		var a = new Date(e - f);
		if (a < 1800000) {
			var b = a.getUTCMinutes() + 1;
			$(".before-closing").html(
					'<i class="sprite sprite-ico-clock-orange"></i> До закрытия '
							+ (d == "food" ? "магазина" : "ресторана")
							+ " осталось " + b + " "
							+ decOfNum(b, [ "минута", "минуты", "минут" ])
							+ "!")
		}
		setTimeout(orgClosing, 60000)
	}
}
function isValidEmail(b) {
	var a = new RegExp(
			/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	return a.test(b)
}
function customerSubscribe() {
	var a = $("#subscribe input").val();
	if (a == undefined || a == "" || !isValidEmail(a)) {
		return false
	}
	$.post("/ajax?action=subscribe", {
		email : a
	});
	$("#subscribe input").val("");
	$("#subscribe .col:last")
			.html(
					'<div class="adding"><span class="title">Списибо</span><br>e-mail добавлен</div>');
	return false
}
var constructors = {
	id : 0,
	load : function(a) {
		constructors.id = $(a).closest(".product-item").attr("data-id");
		$.get("/objects?action=get.constructor&id=" + constructors.id + "&r="
				+ Math.random(), function(b) {
			if (b == "") {
				return
			}
			if (b != "false") {
				$(b).appendTo("#modal");
				$(".modal-overlay").addClass("modal-overlay--open");
				$(".modal-constructor")
						.css("top", $(window).scrollTop() + "px").addClass(
								"modal--open");
				$(".modal-constructor").find(".catalog input").change(
						constructors.select);
				constructors.select()
			}
		});
		return false
	},
	inc : function(c) {
		var a = $(".modal-constructor .item-count");
		var b = parseInt($(a).val());
		if (c == -1 && b == 1) {
			return false
		}
		$(a).val(b + c)
	},
	close : function() {
		$(".modal-constructor").remove();
		$(".modal-overlay").removeClass("modal-overlay--open");
		return false
	},
	select : function() {
		var a = parseInt($(".constructor-box").attr("data-price"));
		$(".constructor-box .catalog input:checked").each(function() {
			a += parseInt($(this).attr("data-price"))
		});
		$(".modal-constructor .footer .price").text(a)
	},
	order : function() {
		var a = {};
		a.id = constructors.id;
		a.count = $(".constructor-box .item-count").val();
		a.addons = [];
		$(".constructor-box .catalog input:checked").each(function() {
			a.addons.push($(this).val())
		});
		$.post("/ajax?action=addConstructorToCart", a, function(b) {
			if (b != "false") {
				a = b.split(":");
				if (a.length > 1) {
					$(".cart-pane__item > .cart-pane__number").text(a[0]);
					$(".cart-pane__sum").text(a[1] + " P")
				}
			}
		});
		$(".cart-pane").slideDown();
		constructors.close()
	},
};
var ingredients = {
	box : null,
	id : 0,
	item : null,
	load : function(a) {
		ingredients.item = $(a).closest(".product-item");
		ingredients.id = $(ingredients.item).attr("data-id");
		if (ingredients.box != null) {
			ingredients.close();
			if ($(ingredients.box).find(".ingredients-box").attr("data-id") == ingredients.id) {
				return false
			}
		}
		$.get("/objects?action=get.ingredients&id=" + ingredients.id + "&r="
				+ Math.random(), function(c) {
			if (c == "") {
				$(a).remove();
				return
			}
			if (c != "false") {
				ingredients.box = $(ingredients.item).closest(".items");
				var b = $(ingredients.box).find(".product-item").index(
						ingredients.item);
				$(ingredients.box).append(c);
				$(ingredients.box).find(".ingredients-box").slideDown();
				$(ingredients.box).find(".box").addClass("index" + b);
				$(ingredients.box).find(".catalog input").change(
						ingredients.select)
			}
		});
		return false
	},
	inc : function(c) {
		var a = $(ingredients.box).find(".item-count");
		var b = parseInt($(a).val());
		if (c == -1 && b == 1) {
			return false
		}
		$(a).val(b + c)
	},
	close : function() {
		$(ingredients.box).find(".ingredients-box").slideUp("slow", function() {
			this.remove()
		});
		return false
	},
	select : function() {
		var b = parseInt($(this).attr("data-price")), a = parseInt($(
				ingredients.box).find(".footer .price").text());
		if (b > 0) {
			if ($(this).is(":checked")) {
				a += b
			} else {
				a -= b
			}
			$(ingredients.box).find(".footer .price").text(a)
		}
	},
	order : function() {
		if (checkDistrict()) {
			var a = {};
			a.id = ingredients.id;
			a.count = $(ingredients.box).find(".item-count").val();
			a.addons = [];
			$(ingredients.box).find(".ingredients-box .catalog input:checked")
					.each(function() {
						a.addons.push($(this).val())
					});
			$.post("/ajax?action=addConstructorToCart", a, function(b) {
				if (b != "false") {
					a = b.split(":");
					if (a.length > 1) {
						$(".cart-pane__item > .cart-pane__number").text(a[0]);
						$(".cart-pane__sum").text(a[1] + " P")
					}
				}
			});
			$(".cart-pane").slideDown();
			ingredients.close()
		}
	},
};
