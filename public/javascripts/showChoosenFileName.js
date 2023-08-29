$('.custom-file-input').on('change', function () {
    let fileName = $('#fileInput')[0].files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});