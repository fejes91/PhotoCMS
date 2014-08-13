$(document).ready(function() {
    console.log("csá");
    loadAlbum();
});

populatePhotos = function(albums) {
    console.log(albums);
    var numberOfPhotos = 0;
    var numberOfLoadedPhotos = 0;
    $("#photos").hide();
    for (var albumKey in albums) {
        var album = albums[albumKey];
        if (album.photos.length === 0) {
            $("div").append("Nincsenek publikus képek az albumban: " + album.albumName + "<br>");
        }
        else {
            numberOfPhotos += album.photos.length;
            for (var photoKey in album.photos) {
                var photo = album.photos[photoKey];
                $("#photos").append('<img src="../img/thumbnails/' + photo.url + '" width="200"/>');
            }
            $("#photos").append("<br><br>");
        }
    }
    $("#photos img").load(function(){
        numberOfLoadedPhotos++;
        $("#stat").html(numberOfLoadedPhotos/numberOfPhotos*100 + "% loaded...");
        if(numberOfLoadedPhotos === numberOfPhotos){
            $("#photos").fadeIn(200);
        }
    });
};

loadAlbum = function(id) {
    console.log("csá2");
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

