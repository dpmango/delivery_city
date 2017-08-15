//		//global variables
var magicLine;
var hoverItem;
var curremtItem;
var magicLine2;
var hoverItem2;
var curremtItem2;

function hoverMagicLine() {
	magicLine.stop().animate({
		left: hoverItem.position().left,
		width: hoverItem.innerWidth()
	});
}
function hoverMagicLine2() {
	magicLine2.stop().animate({
		left: hoverItem2.position().left,
		width: hoverItem2.innerWidth()
	});
}
function returnMagicLine() {
	magicLine.stop().animate({
		left: magicLine.data("origLeft"),
		width: magicLine.data("origWidth")
	});
}
function returnMagicLine2() {
	magicLine2.stop().animate({
		left: magicLine2.data("origLeft"),
		width: magicLine2.data("origWidth")
	});
}
function recalibrateMagicLine() {
	magicLine.width(currentItem.outerWidth())
		.css("left", currentItem.position().left)
		.data("origLeft", currentItem.position().left)
		.data("origWidth", currentItem.outerWidth());
}
function recalibrateMagicLine2() {
	magicLine2.width(currentItem2.outerWidth())
		.css("left", currentItem2.position().left)
		.data("origLeft", currentItem2.position().left)
		.data("origWidth", currentItem2.outerWidth());
}
function makeMagicLine() {
	$(".restaurant-block__tabs").append("<span class='magic-line'></span>");
	magicLine = $(".magic-line");
	currentItem = $(".restaurant-block__tab-link.active");
	recalibrateMagicLine();
}
function makeMagicLine2() {
	$(".goods-reviews__tabs").append("<span class='magic-line2'></span>");
	magicLine2 = $(".magic-line2");
	currentItem2 = $(".goods-reviews__tab.active");
	recalibrateMagicLine2();
}


$(document).ready(function () {
	setTimeout(function(){
		makeMagicLine();
		makeMagicLine2();
	}, 200)
	// on mouse hover, move magicLine
	$(".restaurant-block__tab-link").hover(function () {
		hoverItem = $(this);
		hoverMagicLine();
	}, function () {
		returnMagicLine();
	});
	$(".goods-reviews__tab").hover(function () {
		hoverItem2 = $(this);
		hoverMagicLine2();
	}, function () {
		returnMagicLine2();
	});

	$(".restaurant-block__tab-link").click(function () {
		currentItem.removeClass('active');
		$(this).addClass('active');
		currentItem = $(this);
		recalibrateMagicLine();
    if ( $(this).data('id') == 'goods-reviews' ){
      recalibrateMagicLine2();
    }
	});
	$(".goods-reviews__tab").click(function () {
		currentItem2.removeClass('active');
		$(this).addClass('active');
		currentItem2 = $(this);
		recalibrateMagicLine2();
	});
});
$(window).resize(function () {
	recalibrateMagicLine();
	recalibrateMagicLine2();
});
