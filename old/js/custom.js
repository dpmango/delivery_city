$(document).ready(function() {
	
	/* wow ======================================= */


	/* Hero slider ======================================= */

	/*$('#hero-slides').superslides({
		play: 4000,
		animation: 'fade'
	});*/

	/* Navbar colapse ======================================= */
	/*$(document).on('click.nav','.navbar-collapse.in',function(e) {
		if( $(e.target).is('a') || $(e.target).is('button')) {
			$(this).collapse('hide');
		}
	});*/

	/* show about more  ======================================= */
	$("#show-btn").click(function() {
		$('#showme').slideDown("slow");
		$(this).hide();
		return false;
	});

	/* testimonial ======================================= */
	$('.carousel').carousel();
	
	/* One Page Navigation Setup ======================================= */
	/*$('#main-nav').singlePageNav({
		offset: $('.navbar').height(),
		speed: 750,
		currentClass: 'active',
		filter: ':not(.external)',
		beforeStart: function() {},
		onComplete: function() {}
	});*/
	
	/* Bootstrap Affix ======================================= */		
	$('#modal-bar').affix({
		offset: {
			top: 10,
		}
	});


	/* countdown ======================================= */	
	var days = 3;
	var date = new Date();
	var res = date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	
	/*$('#countdown').countdown(res, function(event) {
	  $(this).text(
		event.strftime('%-d days %H:%M:%S')
	  );
	});*/

	/* Smooth Hash Link Scroll ======================================= */	
	$('.smooth-scroll').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				// console.log(offset());
				$('html,body').animate({
						scrollTop: target.offset().top - 60
				}, 1000);
				return false;
			}
		}
	});
		
	/* Project Preview	==============================================*/
	$('.img-box').click(function(e) {
		e.preventDefault();
		var elem = $(this).parent(),
			title = elem.find('.project-title').text(),
			price = elem.find('.project-price').text(),
			descr = elem.find('.project-description').html(),
			slidesHtml = '<div class="slides-container">',
			elemDataCont = elem.find('.project-description');
			slides = elem.find('.project-description').data('images').split(',');
		for (var i = 0; i < slides.length; ++i) {
			slidesHtml = slidesHtml + '<img src=' + slides[i] + ' alt="">';
		}
		slidesHtml = slidesHtml + '</div><nav class="slides-navigation"><a href="#" class="next"><i class="icon-arrow-right"></i></a><a href="#" class="prev"><i class="icon-arrow-left"></i></a></nav>';
		$('#project-modal').on('show.bs.modal', function() {
			$(this).find('#sdbr-title').text(title);
			$(this).find('#sdbr-price').text(price);
			$(this).find('#project-content').html(descr).append('<a id="btn-order" class="btn btn-store btn-right"  href="#">Order now</a>');
			$(this).find('.screen').addClass('slides').html(slidesHtml);
			if (elemDataCont.data('oldprice')) {
				$(this).find('#sdbr-oldprice').show().text(elemDataCont.data('oldprice'))
			} else {
				$(this).find('#sdbr-oldprice').hide();
			}
			if (elemDataCont.data('descr')) {
				$(this).find('#sdbr-descr').show().text(elemDataCont.data('descr'))
			} else {
				$(this).find('#sdbr-descr').hide();
			}
			setTimeout(function() {
				$('.slides').superslides({
					inherit_height_from: '.modal-header'
				});
				$('#project-modal .screen').addClass('done').prev('.loader').fadeOut();
			}, 1000);
		}).modal();
	});

	$('#project-modal').on('hidden.bs.modal', function() {
		$(this).find('.loader').show();
		$(this).find('.screen').removeClass('slides').removeClass('done').html('').superslides('destroy');
	});

	$('#project-modal').on( 'click', '#btn-order',function () {
		$('#project-modal').modal('hide');
		$(this).find('.loader').show();
		$(this).find('.screen').removeClass('slides').removeClass('done').html('').superslides('destroy');
		var aTag = $("section[id='orderform']");
		$('html,body').animate({scrollTop: aTag.offset().top},'slow');
	});

	/* style switch	==============================================*/
	$('#style-switcher h2 a').click(function(){
		window.Flipcat.SidebarHelper.zIndex('#style-switcher');
		$('#style-switcher').toggleClass('open');
		return false;
	});
	
	/* search-bar	==============================================*/
	$('#search-bar h2 a').click(function(){
		window.Flipcat.SidebarHelper.zIndex('#search-bar');
		$('#search-bar').toggleClass('open');
		return false;
	});
	
	/* cuisine-form	==============================================*/
	$('#cuisine-widget h2 a').click(function(){
		window.Flipcat.SidebarHelper.zIndex('#cuisine-widget');
		$('#cuisine-widget').toggleClass('open');
		return false;
	});
	
	/* shop categories 	==============================================*/
	$('#left-shop-categories h2 a').click(function(){
		window.Flipcat.SidebarHelper.zIndex('#left-shop-categories');
		$('#left-shop-categories').toggleClass('open');
		return false;
	});

	$('.text-more').click(function(){
		if (FlipcatWebAppLibrary.REQUEST_URI(1) != '/') {
			var $prevText = $(this).prev();
			$prevText.slideToggle(0);
			if($(this).text() == __('messages.more')) {
				$(this).text( __('messages.short_news') );
			} else {
				$(this).text( __('messages.more') );
			}
			return false;
		}
	});

	$('.datepicker').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: 'ru-RU'
	});
	

	
//================customize selectpicker================================
	/*if ($('.selectpicker')[0] && $('.selectpicker').selectpicker instanceof Function) {
		$('.selectpicker').addClass('sp_custom_input').selectpicker('setStyle');
		$('.bootstrap-select span.text').each(function(i, j) {
			j = $(j);
			i = j.text();
			j.html(i);
		});

		function setHtmlInSelectpicker() {
			$('.bootstrap-select').each(function(i, j){
				j = $(j).find('span.filter-option').first();
				i = j.html();
				i = i .replace(/&lt;/g, '<');
				i = i .replace(/&gt;/g, '>');
				j.html(i);
			});
		}
		setHtmlInSelectpicker();
		$('select').bind('change', function(){
			setHtmlInSelectpicker();
		});
	}*/
//==================мелкие правки для мобильной версии сайта ===========


});
