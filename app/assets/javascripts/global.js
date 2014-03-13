//= require prototype
//= require prototype_ujs
//= require effects
//= require dragdrop
//= require controls

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
(function() {
	
	function showTree(parent) {
		parent.style.border = 'black solid 1px';
		for(i = 0; i < parent.children.length; i++) {
			parent.children[i].style.display='block';
		}	
	}
	
  function hideTree(parent) {
		parent.style.border = 'none';
    for(i = 0; i < parent.children.length; i++) {
      parent.children[i].style.display='none';
    } 
  }
  
  function onEndCrop( coords, dimensions ) {
		$('form_x').writeAttribute('value', coords.x1);
    $('form_y').writeAttribute('value', coords.y1);
    $('form_w').writeAttribute('value', coords.x2-coords.x1+1);
    $('form_h').writeAttribute('value', coords.y2-coords.y1+1);
  }
  
  document.observe("dom:loaded", function() {
    var elements = $$('*[data_hover]');
		
    for(i=0; i<elements.length; i++) {
      elements[i].observe('mouseover', function(event) { showTree(this) } )
      elements[i].observe('mouseout', function(event) { hideTree(this) } )
    }

    var elements = $$('*[data_tagable]');
    
    for(i=0; i<elements.length; i++) {
      new Cropper.Img( 
              elements[i].id,
              {
                      onEndCrop: onEndCrop 
              }
      );
    }
  });

  function findPosX(obj)
  {
    var curleft = 0;
    if(obj.offsetParent)
        while(1) 
        {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    return curleft;
  }

  function findPosY(obj)
  {
    var curtop = 0;
    if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y)
        curtop += obj.y;
    return curtop;
  }

//  document.on("click", "*[data_tagable]", function(event, element) {
//		var posX = document.documentElement.scrollLeft + event.clientX - findPosX(element);
//		var posY = document.documentElement.scrollTop + event.clientY - findPosY(element);
//
//		alert("Tagable: " + posX + "x" + posY);
//	});
			
  document.on("click", "*[data_hide_element]", function(event, element) {
    var element = element.readAttribute('data_hide_element');
    var obj = document.getElementById(element);
    obj.style.visibility = 'hidden';
  });

  document.on("click", "*[data_show_element]", function(event, element) {
    var element = element.readAttribute('data_show_element');
    var obj = document.getElementById(element);
    obj.style.visibility = 'visible';
  });

  document.on("keyup", "*[data_submit_form]", function(event, element) {
    var form = element.readAttribute('data_submit_form');
    $(form).request();
  });
})();
