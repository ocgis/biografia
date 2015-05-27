(function($){
	$.fn.dropdownmenu = function(){
		return this.each(function(){
			var obj = $(this)
			obj.find('.selector').click(function() { //onclick event, 'list' fadein
			obj.find('.list').fadeIn(400);
			
			$(document).keyup(function(event) { //keypress event, fadeout on 'escape'
				if(event.keyCode == 27) {
				obj.find('.list').fadeOut(400);
				}
			});
			
			obj.find('.list').hover(function(){ },
				function(){
					$(this).fadeOut(400);
				});
			});
			
			obj.find('.list li').click(function() { //onclick event, fadeout 'list'
			obj.find('.list').fadeOut(400);
			});
		});
	};
})(jQuery);
