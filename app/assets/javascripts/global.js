function updateCoords(c) {
    var elements = $("#tag_image");
    var iw = $(elements[0]).width();
    var ih = $(elements[0]).height();

    $('#form_x').val((c.x*1000)/iw);
    $('#form_y').val((c.y*1000)/ih);
    $('#form_w').val((c.w*1000)/iw);
    $('#form_h').val((c.h*1000)/ih);
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

function initWhenImagesLoaded() {
    function initTaggedImages() {
        var imgs = $.merge($('#tagged_image'), $('#tag_image'));

        for(var i=0; i<imgs.length; i++) {
            var factor = 0.7;
            var iw = $(imgs[i]).width();
            var ih = $(imgs[i]).height();
            var ww = $(window).width();
            var wh = $(window).height();

            var scalew = iw/ww;
            var scaleh = ih/wh;
            var scale = Math.max(scalew, scaleh);
            if(scale > factor) {
                iw = (iw * factor) / scale;
                ih = (ih * factor) / scale;
                $(imgs[i]).width(iw);
                $(imgs[i]).height(ih);
            }
        }
    }
    initTaggedImages();

    function initHoverTags() {
        var imgs = $('#tagged_image');
        var iw = $(imgs[0]).width();
        var ih = $(imgs[0]).height();

        var elements = $('*[data-hover]');
		
        for(var i=0; i<elements.length; i++) {
            var x=(($(elements[i]).attr("data-x")*iw)/1000)|0;
            var y=(($(elements[i]).attr("data-y")*ih)/1000)|0;
            var w=(($(elements[i]).attr("data-w")*iw)/1000)|0;
            var h=(($(elements[i]).attr("data-h")*ih)/1000)|0;
            $(elements[i]).css("left", x.toString() + 'px');
            $(elements[i]).css("top", y.toString() + 'px');
            $(elements[i]).css("width", w.toString() + 'px');
            $(elements[i]).css("height", h.toString() + 'px');
            $(elements[i]).hover(showTree, hideTree);
        }
    }
    initHoverTags();

    $( "#tabs" ).tabs({heightStyle: "fill"});
    $('*[data-tagable]').Jcrop({onChange: updateCoords});
}

function initAutocompleters() {
    var elements = $(".filter");

    for(var i=0; i<elements.length; i++) {
        var url = $(elements[i]).attr("data-url");
        var ignoreName = $(elements[i]).attr("data-ignore-name");
        var searchModel = $(elements[i]).attr("data-search-model");
        $(elements[i]).autocomplete({
            source: function( request, response ) {
                var data ={
                    q: request.term,
                    ignoreName: ignoreName,
                    searchModel: searchModel
                };

                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    data: data,
                    success: function( data ) {
                        response( data );
                    }
                });
            },
            minLength: 3,
            select: function( event, ui ) {
                var connect2Id = $(this).siblings("#form_connect2Id")[0];
                var form = $(this.form);
                $(connect2Id).val(ui.item.value);
                $(form).submit();
            },
            open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                $( this ).autocomplete('widget').css('z-index', 999);
            },
            close: function() {
                $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            }
        }).autocomplete( "instance" )._renderItem = function( ul, item ) {
            return $( "<li>" )
                .append( item.label )
                .appendTo( ul );
        };
    }
}

function initPage() {
    $('.dropdownmenu').dropdownmenu();
    initAutocompleters();
    $( "#dialog").dialog({modal: true,
                          appendTo: "#modal_dialog",
                          width: 'auto',
                          resizable: false });
    $( "#tabs" ).tabs({heightStyle: "fill"});

    $('#tag_image, #tagged_image').imagesLoaded(initWhenImagesLoaded);
};

var ready;
ready = function() {
    initPage();

    $(document).on('click', '.toggler', function(event){
        event.preventDefault();
        id = "#" + $(this).attr('data-toggleid')
        $(id).toggle();
    });

    var globalTimeout = null;
    $(document).on('keyup', "*[data-submitform]", function(event) {
        var form = $(this).parent();
        if (globalTimeout != null) {
            clearTimeout(globalTimeout);
        }
        globalTimeout = setTimeout(function() {
            globalTimeout = null;

            form.submit();
        }, 200);
    });

    $(document).on('change', "*[data-submitonchange]", function(event) {
        event.stopImmediatePropagation(); // Avoid multiple submits
        var form = $(this).parent();
        $(form).submit();
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
}

$(document).ready(ready);
$(document).on('page:load', ready);
