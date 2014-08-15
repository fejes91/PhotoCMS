cms = {};
cms.albums = {};

$(document).ready(function() {
    populatePhotos();
});

$(window).resize(function() {
    manageActiveSeparators();
});

manageActiveSeparators = function() {
    $("#thumbnailPanel .horizontalSeparator").animate({left: "-15px"}, 100);
    if ($("#albumPanel li.album.active").length > 0) {
        var activeAlbumOffset = $("#albumPanel li.album.active").offset();
        var activeHSepOffset = $("#thumbnailPanel .horizontalSeparator.active").offset();
        var activeHSepHeight = $("#thumbnailPanel .horizontalSeparator.active").height();
        var activeAlbumWidth = $("#albumPanel li.album.active").width();
        var activeAlbumHeight = $("#albumPanel li.album.active").height();

        $("#thumbnailPanel .horizontalSeparator.active").animate(
                {
                    left : -1 * (activeHSepOffset.left - parseInt(activeAlbumOffset.left) - parseInt(activeAlbumWidth)) - 15/*default left*/
                }, 200);
                
        $("#thumbnails").animate({
            marginTop : parseInt($("#thumbnails").css("margin-top")) + (-1) * $(".horizontalSeparator.active").offset().top + 50
        }, 200);

        //var top = Math.min(parseInt(activeHSepOffset.top + activeHSepHeight), parseInt(activeAlbumOffset.top) + activeAlbumHeight);
        var top = 50 + activeHSepHeight;
        var left = parseInt(activeAlbumOffset.left) + parseInt(activeAlbumWidth);
        var height = Math.abs(top - parseInt(activeAlbumOffset.top) - activeAlbumHeight) + parseInt($("#albumPanel li.album.active").css("border-bottom-width"));
        $("#verticalSeparator").show().css("top", top).css("left", left).height(height);
    }
    else {
        $("#verticalSeparator").hide();
    }
    
    
};

setActiveAlbum = function(albumId){
    if(!$("#albumPanel li#" + albumId).hasClass("active")){
        $("#thumbnailPanel .thumbnail, #thumbnailPanel .horizontalSeparator, #albumPanel li.album").removeClass("active");
        $("#thumbnailPanel .thumbnail.album-" + albumId + ", #thumbnailPanel .horizontalSeparator#album-" + albumId + ", #albumPanel li#" + albumId).addClass("active");

        manageActiveSeparators();
        manageThumbnailSizes();
    }
}

manageThumbnailSizes = function(){
    $(".thumbnail").unbind('mouseover');
    $(".thumbnail").unbind('mouseout');
    $(".thumbnail.active").on('mouseover', function(){
        var ratio = $(this).find("img").width() / $(this).find("img").height();
        var width = "100%";
        if(ratio > 1){
            width = 100 * ratio + "%";
        }
        $(this).find("img").stop().animate({
            width: width,
            top: "0px",
            left: "0px"
        }, 100);
    });
    
    $(".thumbnail.active").on('mouseout', function(){
        $(this).find("img").stop().animate({
            width: "250%",
            left: "-50%",
            top: "-50%"
        }, 300);
    });
    
    
};

populatePhotos = function() {
    var numberOfPhotos = 0;
    var numberOfLoadedPhotos = 0;
    //$(".thumbnail").hide();

    for (var albumKey in cms.albums) {
        var album = cms.albums[albumKey];
        if (album.photos.length > 0) {
            $("#thumbnails").append('<div id="album-' + album.id + '" class="horizontalSeparator">' + album.name + '</div>');
            $("#albumPanel ul").append('<li id="' + album.id + '" class="album">' + album.name + '</li>')
            numberOfPhotos += album.photos.length;
            for (var photoKey in album.photos) {
                var photo = album.photos[photoKey];
                $("#thumbnails").append('<div class="thumbnail album-' + album.id + '"><img src="../img/thumbnails/' + photo.url + '"/></div>');
            }
        }
    }
    //$("#thumbnails").append('<div class="horizontalSeparator"></div>');

    $("#albumPanel li.album").click(function() {
        var albumId = $(this).attr("id");
        setActiveAlbum(albumId);
    });
    
    $(".thumbnail").click(function(){
        var classes = $(this).attr("class").split(" ");
        var albumId;
        for(var key in classes){
            var c = classes[key];
            if(c.indexOf("album") === 0){
                var parts = c.split("-");
                albumId = parts[parts.length-1];
            }
        }
        setActiveAlbum(albumId);
    });

    $("#thumbnailPanel img").load(function() {
        numberOfLoadedPhotos++;
        $("#menuPanel").html(numberOfLoadedPhotos / numberOfPhotos * 100 + "%");
        if (numberOfLoadedPhotos === numberOfPhotos) {
            //$(".thumbnail").fadeIn(1000);
            
        }
    });
    
    
};

loadAlbum = function(id) {
    $.ajax({url: 'frontEndService.php',
        data: {type: 'album', id: id},
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log("csá3");
            populatePhotos(data);
        }
    });
};

