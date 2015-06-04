//= require jcrop

function updateCoords(c) {
    $('#form_x').val(c.x);
    $('#form_y').val(c.y);
    $('#form_w').val(c.w);
    $('#form_h').val(c.h);
}

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

function initPage() {
    $('.dropdownmenu').dropdownmenu();
    $( "#dialog").dialog({modal: true,
                          appendTo: "#modal_dialog",
                          width: 'auto',
                          resizable: false });
    $( "#tabs" ).tabs();
    $('*[data-tagable]').Jcrop({onChange: updateCoords});

    {
        var elements = $('*[data-hover]');
		
        for(i=0; i<elements.length; i++) {
            $(elements[i]).hover(showTree, hideTree);
        }
    }
}

$(function() {
    initPage();

    $(document).on('click', '.toggler', function(event){
        event.preventDefault();
        id = "#" + $(this).attr('data-toggleid')
        $(id).toggle();
    });

    $(document).on('keyup', "*[data-submitform]", function(event) {
        var form = $(this).parent();
        form.submit();
    });

    function handleEvent(e) {
        var data = JSON.parse(e.data);

        for(var elem in data) {
            if(data.hasOwnProperty(elem)) {
                edata = data[elem];
                if(edata.hasOwnProperty('append')) {
	            $("#" + elem).append(edata['append']);
                }
                if(edata.hasOwnProperty('replace')) {
	            $("#" + elem).text(edata['replace']);
                }
            }
        }
    }

    {
        var elements = $('*[data-eventsource]');

        for(i=0; i<elements.length; i++) {
            var url = $(elements[i]).attr('data-eventsource');
            var source = new EventSource(url);

            source.addEventListener('update', handleEvent);
        }
    }
});

