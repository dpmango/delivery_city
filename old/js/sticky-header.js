var a = $('#breadcrumbs-area');
		  $(window).scroll(function() {
		    if ($(window).scrollTop() > 110) {
			    a.addClass('navbar-fixed-top');
			    a.removeClass('absolute-navbar');
			}
			else {
				a.removeClass('navbar-fixed-top');
			    a.addClass('absolute-navbar');
			}

		});
