$(document).ready(function() {
    $(".confirm").click(function(e) {
        var c = confirm($(this).attr("confirmText"));
        if (!c) {
            e.preventDefault();
        }
    });
    
    
    
    $(".selectAll").click(function(e){
        e.preventDefault();
        console.log("asd");
        $(this).parents("form").find('input[type="checkbox"]').prop("checked", true);
    });
    
    $(".selectNone").click(function(e){
        e.preventDefault();
        $(this).parents("form").find('input[type="checkbox"]').prop("checked", false);
    });
});



