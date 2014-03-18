//= require jcrop

$(function() {
    $(document).on('click', '.toggler', function(event){
        event.preventDefault();
        id = "#" + $(this).attr('data-toggle-id')
        $(id).toggle();
    });

    $(document).on('keyup', "*[data_submit_form]", function(event) {
        var form = $(this).parent();
        form.submit();
    });

    function updateCoords(c) {
	$('#form_x').val(c.x);
	$('#form_y').val(c.y);
	$('#form_w').val(c.w);
	$('#form_h').val(c.h);
    }

    $(document).on('click', '*[data_tagable]',function(event) {
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
        var elements = $('*[data_hover]');
		
        for(i=0; i<elements.length; i++) {
            $(elements[i]).hover(showTree, hideTree);
        }
    }
});

