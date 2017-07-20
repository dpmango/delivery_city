     $('.menuTrigger').click( function () {
    	  $('.panel').toggleClass('isOpen');
			 $('.page-content-wrapper').toggleClass('pushed');
		});

		$('.openSubPanel').click( function() {
    		$(this).next('.subPanel').addClass('isOpen');	
		});

		$('.closeSubPanel').click( function() {
    		$('.subPanel').removeClass('isOpen');
		});

		$('.closePanel').click( function() {
   	    $('.panel').removeClass('isOpen');
			  $('.page-content-wrapper').removeClass('pushed');
		});