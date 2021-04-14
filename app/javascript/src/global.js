function updateCoords(c) {
  const elements = $('#tag_image');
  const iw = $(elements[0]).width();
  const ih = $(elements[0]).height();

  $('#form_x').val((c.x * 1000) / iw);
  $('#form_y').val((c.y * 1000) / ih);
  $('#form_w').val((c.w * 1000) / iw);
  $('#form_h').val((c.h * 1000) / ih);
}

function showTree() {
  this.style.border = 'black solid 1px';
  for (let i = 0; i < this.children.length; i += 1) {
    this.children[i].style.display = 'block';
  }
}

function hideTree() {
  this.style.border = 'none';
  for (let i = 0; i < this.children.length; i += 1) {
    this.children[i].style.display = 'none';
  }
}

function initWhenImagesLoaded() {
  function initTaggedImages() {
    const imgs = $.merge($('#tagged_image'), $('#tag_image'));

    for (let i = 0; i < imgs.length; i += 1) {
      const factor = 0.7;
      let iw = $(imgs[i]).width();
      let ih = $(imgs[i]).height();
      const ww = $(window).width();
      const wh = $(window).height();

      const scalew = iw / ww;
      const scaleh = ih / wh;
      const scale = Math.max(scalew, scaleh);
      if (scale > factor) {
        iw = (iw * factor) / scale;
        ih = (ih * factor) / scale;
        $(imgs[i]).width(iw);
        $(imgs[i]).height(ih);
      }
    }
  }
  initTaggedImages();

  function initHoverTags() {
    const imgs = $('#tagged_image');
    const iw = $(imgs[0]).width();
    const ih = $(imgs[0]).height();

    const elements = $('*[data-hover]');

    for (let i = 0; i < elements.length; i += 1) {
      const x = (($(elements[i]).attr('data-x') * iw) / 1000) | 0;
      const y = (($(elements[i]).attr('data-y') * ih) / 1000) | 0;
      const w = (($(elements[i]).attr('data-w') * iw) / 1000) | 0;
      const h = (($(elements[i]).attr('data-h') * ih) / 1000) | 0;
      $(elements[i]).css('left', `${x.toString()}px`);
      $(elements[i]).css('top', `${y.toString()}px`);
      $(elements[i]).css('width', `${w.toString()}px`);
      $(elements[i]).css('height', `${h.toString()}px`);
      $(elements[i]).hover(showTree, hideTree);
    }
  }
  initHoverTags();

  $('#tabs').tabs({ heightStyle: 'fill' });
  $('*[data-tagable]').Jcrop({ onChange: updateCoords });
}

function initAutocompleters() {
  const elements = $('.filter');

  function makeSource(ignoreName, searchModel, url) {
    function source(request, response) {
      const data = {
        q: request.term,
        ignoreName,
        searchModel,
      };

      function success(data1) {
        response(data1);
      }

      $.ajax({
        url,
        dataType: 'jsonp',
        data,
        success,
      });
    }
    return source;
  }

  function select(event, ui) {
    const connect2Id = $(this).siblings('#form_connect2Id')[0];
    const form = $(this.form);
    $(connect2Id).val(ui.item.value);
    $(form).submit();
  }

  function open() {
    $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
    $(this).autocomplete('widget').css('z-index', 999);
  }

  function close() {
    $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
  }

  function renderItem(ul, item) {
    return $('<li>')
      .append(item.label)
      .appendTo(ul);
  }

  for (let i = 0; i < elements.length; i += 1) {
    const url = $(elements[i]).attr('data-url');
    const ignoreName = $(elements[i]).attr('data-ignore-name');
    const searchModel = $(elements[i]).attr('data-search-model');

    $(elements[i]).autocomplete({
      source: makeSource(ignoreName, searchModel, url),
      minLength: 3,
      select,
      open,
      close,
    }).autocomplete('instance')._renderItem = renderItem;
  }
}

function initPage() {
  $('.dropdownmenu').dropdownmenu();
  initAutocompleters();
  $('#dialog').dialog({
    modal: true,
    appendTo: '#modal_dialog',
    width: 'auto',
    resizable: false,
  });
  $('#tabs').tabs({ heightStyle: 'fill' });

  $('#tag_image, #tagged_image').imagesLoaded(initWhenImagesLoaded);
}
window.initPage = initPage;

function ready() {
  initPage();

  function onClick(event) {
    event.preventDefault();
    const id = `#${$(this).attr('data-toggleid')}`;
    $(id).toggle();
  }

  $(document).on('click', '.toggler', onClick);

  let globalTimeout = null;

  function onKeyup() {
    const form = $(this).parent();

    function onTimeout() {
      globalTimeout = null;

      form.submit();
    }

    if (globalTimeout != null) {
      clearTimeout(globalTimeout);
    }
    globalTimeout = setTimeout(onTimeout, 200);
  }

  $(document).on('keyup', '*[data-submitform]', onKeyup);

  function onChange(event) {
    event.stopImmediatePropagation(); // Avoid multiple submits
    const form = $(this).parent();
    $(form).submit();
  }

  $(document).on('change', '*[data-submitonchange]', onChange);

  function handleEvent(e) {
    const data = JSON.parse(e.data);

    function handleElem(elem) {
      if (Object.prototype.hasOwnProperty.call(data, elem)) {
        const edata = data[elem];
        if (Object.prototype.hasOwnProperty.call(edata, 'append')) {
          $(`#${elem}`).append(edata.append);
        }
        if (Object.prototype.hasOwnProperty.call(edata, 'replace')) {
          $(`#${elem}`).text(edata.replace);
        }
      }
    }

    Object.keys(data).forEach(handleElem);
  }

  const elements = $('*[data-eventsource]');

  for (let i = 0; i < elements.length; i += 1) {
    const url = $(elements[i]).attr('data-eventsource');
    const source = new EventSource(url);

    source.addEventListener('update', handleEvent);
  }
}

$(document).ready(ready);
$(document).on('page:load', ready);
