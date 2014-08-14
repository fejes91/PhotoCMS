cms = {};
cms.albums = {};

$(document).ready(function() {
    populatePhotos();
});

$(window).resize(function() {
    manageActiveSeparators();
});

manageActiveSeparators = function() {
    $("#thumbnailPanel .horizontalSeparator").css("left", "-15px");
    if ($("#albumPanel li.album.active").length > 0) {
        var activeAlbumOffset = $("#albumPanel li.album.active").offset();
        var activeHSepOffset = $("#thumbnailPanel .horizontalSeparator.active").offset();
        var activeAlbumWidth = $("#albumPanel li.album.active").width();

        $("#thumbnailPanel .horizontalSeparator.active").css("left",
                -1 *
                (activeHSepOffset.left -
                        parseInt(activeAlbumOffset.left) -
                        parseInt(activeAlbumWidth)) +
                parseInt($("#thumbnailPanel .horizontalSeparator").css("left")));


        var top = Math.min(parseInt(activeHSepOffset.top), parseInt(activeAlbumOffset.top));
        var left = parseInt(activeAlbumOffset.left) + parseInt(activeAlbumWidth);
        var height = Math.abs(parseInt(activeHSepOffset.top) - parseInt(activeAlbumOffset.top)) + 1;
        $("#verticalSeparator").show().css("top", top).css("left", left).height(height);
    }
    else {
        $("#verticalSeparator").hide();
    }
};

setActiveAlbum = function(albumId){
    $("#thumbnailPanel .thumbnail, #thumbnailPanel .horizontalSeparator, #albumPanel li.album").removeClass("active");
    $("#thumbnailPanel .thumbnail.album-" + albumId + ", #thumbnailPanel .horizontalSeparator#album-" + albumId + ", #albumPanel li#" + albumId).addClass("active");

    manageActiveSeparators();
}

populatePhotos = function() {
    var numberOfPhotos = 0;
    var numberOfLoadedPhotos = 0;
    //$(".thumbnail").hide();

    for (var albumKey in cms.albums) {
        var album = cms.albums[albumKey];
        if (album.photos.length > 0) {
            $("#thumbnails").append('<div id="album-' + album.id + '" class="horizontalSeparator"></div>');
            $("#albumPanel ul").append('<li id="' + album.id + '" class="album">' + album.name + '</li>')
            numberOfPhotos += album.photos.length;
            for (var photoKey in album.photos) {
                var photo = album.photos[photoKey];
                $("#thumbnails").append('<div class="thumbnail album-' + album.id + '"><img src="../img/thumbnails/' + photo.url + '" width="200"/></div>');
            }
        }
    }
    $("#thumbnails").append('<div class="horizontalSeparator"></div>');

    $("#albumPanel li.album").click(function() {
        var albumId = $(this).attr("id");
        setActiveAlbum(albumId);
    });
    
    $(".thumbnail:not(.active)").click(function(){
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

