$('input[type="text"], textarea').val('');
$('select').each(function() {
    $(this).val($(this).find('option').val());
};
