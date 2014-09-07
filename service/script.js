cms = {};
cms.albums = {};
cms.activeAlbum;

cms.resizeTimer;

$(document).ready(function() {
    initThumbnailView();
});

$(window).resize(function() {
    $("#contentPanel").height(window.innerHeight - 60);
});

animateAlbumThumbnails = function(id, switcher) {
    var time = (Math.random() * 3000) + 4000;
    var liWidth = $('#albumPanel ul li:not(.active)').width();
    var liHeight = $('#albumPanel ul li').height();
    var liActiveLeftPadding = 30;
    var width = $('#albumPanel ul #' + id + ' img').width();
    var height = $('#albumPanel ul #' + id + ' img').height();
    var currentLeft = parseInt($('#albumPanel ul li img').css("left"));
    var currentTop = parseInt($('#albumPanel ul li img').css("top"));

    var left;
    var top;
    if (switcher) {
        top = parseInt(Math.random() * (height - liHeight)) * (-1);

        if (currentLeft === -1 * liActiveLeftPadding) {
            left = liWidth * -1;
        }
        else {
            left = liActiveLeftPadding * -1;
        }
    }
    else {
        left = (parseInt(Math.random() * liWidth - liActiveLeftPadding) + liActiveLeftPadding) * -1;

        if (currentTop === 0) {
            top = (height - liHeight) * -1;
        }
        else {
            top = 0;
        }
    }



    $('#albumPanel ul #' + id + ' img').animate({
        top: top,
        left: left
    }, time, function() {
        animateAlbumThumbnails(id, !switcher);
    });
};

initThumbnailView = function() {
    $("#contentPanel").height(window.innerHeight - 60);
    $("#horizontalSeparator").css("left", $("#horizontalSeparator").width());

    populatePhotos();
    $("#contentPanel").scroll(function() {
        manageThumbnailScroll();
    });
};

manageThumbnailScroll = function() {
    if ($("#contentPanel:animated").length === 0) {
        var $lowestOffset = $(".horizontalSeparator").first();
        $(".horizontalSeparator").each(function() {
            var $this = $(this);
            var top = $this.offset().top;
            if (top < window.innerHeight * 0.3) {
                $lowestOffset = $this;
            }
        });
        setActiveAlbum($lowestOffset.attr("albumId"), false);
    }

};

scrollToAlbum = function() {
    var scroll = 0;
    scroll = $("#contentPanel .horizontalSeparator.active").offset().top;
    $("#contentPanel").animate({
        scrollTop: $("#contentPanel").scrollTop() + scroll - 5
    }, 300);

};

setActiveAlbum = function(albumId, needScroll) {
    cms.actualSeparator = $('.horizontalSeparator[albumId="' + albumId + '"]');

    cms.activeAlbum = albumId;
    if (!$("#albumPanel li#" + albumId).hasClass("active")) {
        $('#albumPanel ul #' + albumId + ' img').stop().animate({
            top: "-50%",
            left: "-50%"
        }, 50, function() {
            $("#contentPanel .thumbnail, #contentPanel .horizontalSeparator, #albumPanel li.album").removeClass("active");
            $("#contentPanel .thumbnail.album-" + albumId + ", #contentPanel .horizontalSeparator#album-" + albumId + ", #albumPanel li#" + albumId).addClass("active");
            
            $('#albumPanel ul li:not(.active) span').css("left", "10px").css("right", "auto");
            $('#albumPanel ul li.active span').css("left", "auto").css("right", 15);
        
            if (needScroll) {
                scrollToAlbum();
            }
            animateAlbumThumbnails($("#albumPanel ul li:not(.active) img:not(:animated)").parents("li").attr("id"));
            
            manageThumbnailSizes();
        });

        $(".horizontalSeparator.active").animate({
            right: 30
        }, 200);
        $(".horizontalSeparator:not(.active)").animate({
            right: 0
        }, 200);



        
    }
}

manageThumbnailSizes = function() {
    $(".thumbnail").unbind('mouseover');
    $(".thumbnail").unbind('mouseout');
    $(".thumbnail.active").on('mouseover', function() {
        var ratio = $(this).find("img").width() / $(this).find("img").height();
        var width = "100%";
        if (ratio > 1) {
            width = 100 * ratio + "%";
        }
        $(this).find("img").stop().animate({
            width: width,
            top: "0px",
            left: "0px"
        }, 100);
    });

    $(".thumbnail.active").on('mouseout', function() {
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

    var thumbnailsStr = "";
    for (var albumKey in cms.albums) {
        var album = cms.albums[albumKey];

        if (album.photos.length > 0) {
            var bgUrl = album.photos[parseInt(Math.random() * album.photos.length)].url;
            $("#albumPanel ul").append('<li id="' + album.id + '" class="album"><img src="../img/thumbnails/' + bgUrl + '"><span>' + album.name + '</span></li>');

            //$("#albumPanel ul li#" + album.id).css("background-image", "url(../img/" + bgUrl + ")");

            thumbnailsStr += '<div id="album-' + album.id + '" class="horizontalSeparator" albumName="' + album.name + '" albumId="' + album.id + '">';
            numberOfPhotos += album.photos.length;
            for (var photoKey in album.photos) {
                var photo = album.photos[photoKey];
                for (var i = 0; i < 20; ++i) { //extra sok kép legyen TODO kivenni innen
                    thumbnailsStr += '<div class="thumbnail album-' + album.id + '"><img src="../img/thumbnails/' + photo.url + '"/></div>';
                }
            }
            thumbnailsStr += "</div>";
        }
    }
    $("#thumbnails").html(thumbnailsStr);

    $("#albumPanel li.album").click(function() {
        var albumId = $(this).attr("id");
        setActiveAlbum(albumId, true);
    });

    $(".thumbnail").click(function() {
        var classes = $(this).attr("class").split(" ");
        var albumId;
        for (var key in classes) {
            var c = classes[key];
            if (c.indexOf("album") === 0) {
                var parts = c.split("-");
                albumId = parts[parts.length - 1];
            }
        }
        setActiveAlbum(albumId, true);
    });

    $("#contentPanel img").load(function() {
        numberOfLoadedPhotos++;
        $("#menuPanel").html(numberOfLoadedPhotos / numberOfPhotos * 100 + "%");
        if (numberOfLoadedPhotos === numberOfPhotos) {
            for (var albumkey in cms.albums) {
                animateAlbumThumbnails(cms.albums[albumkey].id, true);
            }
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

