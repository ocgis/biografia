//= require jcrop

$(function() {
    $(document).on('click', '.toggler', function(event){
        event.preventDefault();
        id = "#" + $(this).attr('data-toggleid')
        $(id).toggle();
    });

    $(document).on('keyup', "*[data-submitform]", function(event) {
        var form = $(this).parent();
        form.submit();
    });

    function updateCoords(c) {
	$('#form_x').val(c.x);
	$('#form_y').val(c.y);
	$('#form_w').val(c.w);
	$('#form_h').val(c.h);
    }

    $(document).on('click', '*[data-tagable]',function(event) {
        $(this).Jcrop({onChange: updateCoords});
    });

    function showTree(event) {
	this.style.border = 'black solid 1px';
	for(i = 0; i < this.children.length; i++) {
	    this.children[i].style.display='block';
	}	
    }
	
    function hideTree(event) {
	this.style.border = 'none';
        for(i = 0; i < this.children.length; i++) {
            this.children[i].style.display='none';
        } 
    }

    {
        var elements = $('*[data-hover]');
		
        for(i=0; i<elements.length; i++) {
            $(elements[i]).hover(showTree, hideTree);
        }
    }
});

