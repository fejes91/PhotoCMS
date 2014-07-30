$(document).ready(function() {
    $(".confirm").click(function(e) {
        var c = confirm($(this).attr("confirmText"));
        if (!c) {
            e.preventDefault();
        }
    });
});

