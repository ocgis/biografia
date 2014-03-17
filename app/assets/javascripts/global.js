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
});

