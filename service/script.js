cms = {};
cms.albums = {};
cms.activeAlbum;

cms.VIEW;
cms.THUMBNAIL_VIEW = 1;
cms.SLIDE_VIEW = 2;
cms.ME_VIEW = 3;
cms.GUESTBOOK_VIEW = 4;

cms.resizeTimer;

$(document).ready(function() {
    initPortfolio();
    
    $("#menuPanel #portfolio").click(function(){showPortfolio();});
    $("#menuPanel #me").click(function(){showMe();});
    
    $("#menuPanel #portfolio").click();
});

$(window).resize(function() {
    $("#contentPanel>div").css("maxWidth", (window.innerWidth - parseInt($("#albumPanel").width())) * 0.6);
});

animateAlbumThumbnails = function(id, switcher) {
    //console.log("switcher for: " + id + " - " + switcher);
    var time = (Math.random() * 3000) + 4000;
    var liWidth = $('#albumPanel ul li:not(.active)').width();
    var liHeight = $('#albumPanel ul li').height();
    var liActiveLeftPadding = 30;
    var height = $('#albumPanel ul #' + id + ' img').height();

    var left;
    var top;
    if (switcher % 2 === 0) {
        top = parseInt(Math.random() * (height - liHeight)) * (-1);

        //if (currentLeft === -1 * liActiveLeftPadding) {
        if ( switcher === 2 ) {
            left = liWidth * -1;
        }
        else {
            left = liActiveLeftPadding * -1;
        }
    }
    else {
        left = (parseInt(Math.random() * liWidth - liActiveLeftPadding) + liActiveLeftPadding) * -1;

        //if (currentTop === 0) {
        if (switcher === 3 ) {
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
        animateAlbumThumbnails(id, switcher === 3 ? 0 : switcher + 1);
    });
};

initPortfolio = function() {
    $("#contentPanel>div").css("maxWidth", (window.innerWidth - parseInt($("#albumPanel").width())) * 0.6);

    populatePhotos();
    $("#contentPanel").scroll(function() {
        manageThumbnailScroll();
    });
};

showPortfolio = function(){
    if(cms.VIEW === cms.THUMBNAIL_VIEW){
        return;
    }
    cms.VIEW = cms.THUMBNAIL_VIEW;
    $("#menuPanel img").removeClass("active");
    $("#menuPanel img#portfolio").addClass("active");
    
    $("#contentPanel>div").hide();
    $("#contentPanel #thumbnails").fadeIn(300);
    $("#albumPanel").show().animate({marginLeft: 0}, 300, function(){$("#albumPanel li").first().click();});
};

showMe = function(){
    if(cms.VIEW === cms.ME_VIEW){
        return;
    }
    cms.VIEW = cms.ME_VIEW;
    $("#contentPanel>div").hide();
    $("#albumPanel").hide().css("marginLeft", "-250px");
    $("#contentPanel .thumbnail, #contentPanel .horizontalSeparator, #albumPanel li.album").removeClass("active");
    $('#albumPanel ul li:not(.active) span').css("left", "10px").css("right", "auto");
    
    $("#menuPanel img").removeClass("active");
    $("#menuPanel img#me").addClass("active");
    
    $("#contentPanel div#me").fadeIn(300);
};

manageThumbnailScroll = function() {
    if (cms.VIEW === cms.THUMBNAIL_VIEW && $("#contentPanel:animated").length === 0) {
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
    //cms.actualSeparator = $('.horizontalSeparator[albumId="' + albumId + '"]');

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
            animateAlbumThumbnails($("#albumPanel ul li:not(.active) img:not(:animated)").parents("li").attr("id"), Math.round(Math.random() * 3));

            manageThumbnailSizes();
        });
    }
};

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
            for (var i = 0; i < 10; ++i) { //extra sok kép legyen TODO kivenni innen
                for (var photoKey in album.photos) {
                    var photo = album.photos[photoKey];
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
        //console.log(numberOfLoadedPhotos / numberOfPhotos * 100 + "%");
        if (numberOfLoadedPhotos === numberOfPhotos) {
            for (var albumkey in cms.albums) {
                animateAlbumThumbnails(cms.albums[albumkey].id, Math.round(Math.random() * 3));
                
            }
        }
    });

    $("#contentPanel #thumbnails .horizontalSeparator").last().css("marginBottom", (window.innerHeight - $("#contentPanel #thumbnails .horizontalSeparator").last().height()) * 0.8);



};

loadAlbum = function(id) {
    $.ajax({url: 'frontEndService.php',
        data: {type: 'album', id: id},
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            populatePhotos(data);
        }
    });
};

