(function($){
	$.fn.search = function(){
		return this.each(function(){
			var obj = $(this)
			obj.find('.filter').click(function() { //onclick event, 'result' fadein
			obj.find('.result').fadeIn(400);
			
			$(document).keyup(function(event) { //keypress event, fadeout on 'escape'
				if(event.keyCode == 27) {
				obj.find('.result').fadeOut(400);
				}
			});
			
			obj.find('.result').hover(function(){ },
				function(){
					$(this).fadeOut(400);
				});
			});
			
			obj.find('.result>option').click(function() { //onclick event, fadeout 'result'
			    obj.find('.result').fadeOut(400);
			});
		});
	};
})(jQuery);
