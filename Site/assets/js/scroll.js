$(document).ready(function () {
    $(window).scroll(function () {
        if ($(document).scrollTop() > 10) {
            $('#nav').addClass('change');
            $('#button').addClass('btnchange');
            $('#logoBold').addClass('logoBold');
            $('#changeBold').addClass('logoBold');
        } else {
            $('#nav').removeClass('change');
            $('#button').removeClass('btnchange');
            $('#logoBold').removeClass('logoBold');
            $('#changeBold').removeClass('logoBold');
        }
    });
});