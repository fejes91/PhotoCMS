cms = {};
cms.albums = {};
cms.activeAlbum;

cms.VIEW;
cms.THUMBNAIL_VIEW = 1;
cms.SLIDE_VIEW = 2;
cms.ME_VIEW = 3;
cms.GUESTBOOK_VIEW = 4;

cms.VIEW_LOCK;
cms.resizeTimer;

$(document).ready(function() {
    initPortfolio();
    $("#menuPanel #portfolio").click(function() {
        showPortfolio();
    });
    $("#menuPanel #meMenu").click(function() {
        showMe();
    });

    showPortfolio();
});

$(window).resize(function() {
    adjustSizes();
});

adjustSizes = function() {
    if (cms.VIEW === cms.THUMBNAIL_VIEW) {
        $("#contentPanel #thumbnails").css("maxWidth", (window.innerWidth - parseInt($("#albumPanel").width())) * 0.3);
        alignSlide();
    }
    else if (cms.VIEW === cms.ME_VIEW) {
        //$("#contentPanel #me").css("maxWidth", (window.innerWidth - parseInt($("#albumPanel").width())) * 0.6);
    }
    
    $("#contentPanel").height(window.innerHeight - $("#menuPanel").height());
};

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
        if (switcher === 2) {
            left = liWidth * -1;
        }
        else {
            left = liActiveLeftPadding * -1;
        }
    }
    else {
        left = (parseInt(Math.random() * liWidth - liActiveLeftPadding) + liActiveLeftPadding) * -1;

        //if (currentTop === 0) {
        if (switcher === 3) {
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
    populatePhotos();
    $("#contentPanel").scroll(function() {
        manageThumbnailScroll();
    });
};

showPortfolio = function() {
    if (cms.VIEW === cms.THUMBNAIL_VIEW || cms.VIEW_LOCK) {
        return;
    }
    cms.VIEW = cms.THUMBNAIL_VIEW;
    $("#menuPanel img").removeClass("active");
    $("#menuPanel img#portfolio").addClass("active");
    $("#slide").html('');

    $("#contentPanel>div").hide();
    $("#albumPanel").show().animate({marginLeft: 0}, 300, function() {
        $("#contentPanel #thumbnails").fadeIn(300, function() {
            //$("#albumPanel li").first().click();
            setActiveAlbum($("#albumPanel li").first().attr("id"), true);
        });
    });
    adjustSizes();
};

showMe = function() {
    if (cms.VIEW === cms.ME_VIEW || cms.VIEW_LOCK) {
        return;
    }
    cms.VIEW = cms.ME_VIEW;
    $("#contentPanel>div").hide();
    $("#albumPanel").hide().css("marginLeft", "-250px");
    $("#contentPanel .thumbnail, #contentPanel .horizontalSeparator, #albumPanel li.album").removeClass("active");
    $('#albumPanel ul li:not(.active) span').css("left", "10px").css("right", "auto");

    $("#menuPanel img").removeClass("active");
    $("#menuPanel img#meMenu").addClass("active");

    adjustSizes();
    $("#me").fadeIn(300);
};

manageThumbnailScroll = function() {
    if (cms.VIEW === cms.THUMBNAIL_VIEW && 
            $("#contentPanel:animated").length === 0 && //ne lehessen behülyíteni
            $("#thumbnails:visible").length > 0) //másik viewból visszajőve ne zavarja a scroll állás
            {
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
        scrollTop: $("#contentPanel").scrollTop() + scroll - $("#menuPanel").height() -  5
    }, 300);

};

setActiveAlbum = function(albumId, needScroll) {
    cms.activeAlbum = albumId;
    if (!$("#albumPanel li#" + albumId).hasClass("active")) {
        $('#albumPanel ul #' + albumId + ' img').stop().animate({
            top: "-50%",
            left: "-50%"
        }, 50, function() {
            $("#contentPanel .thumbnail, #contentPanel .horizontalSeparator, #albumPanel li.album").removeClass("active");
            $('#contentPanel .thumbnail[album="' + albumId + '"], #contentPanel .horizontalSeparator[albumid="' + albumId + '"], #albumPanel li#' + albumId).addClass("active");
            //$("#thumbnails .horizontalSeparator.active .thumbnail:first img").click();
            showSlide($("#thumbnails .horizontalSeparator.active .thumbnail:first img"));

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
                    thumbnailsStr += '<div class="thumbnail" album="' + album.id + '" photo="' + photo.id + '"><img src="../img/thumbnails/' + photo.url + '"/></div>';
                }
            }
            thumbnailsStr += "</div>";
        }

    }
    $("#thumbnails").prepend(thumbnailsStr);

    $("#albumPanel li.album").click(function() {
        var albumId = $(this).attr("id");
        setActiveAlbum(albumId, true);
    });

    $(".thumbnail").click(function() {
        var albumId = $(this).attr("album");
        setActiveAlbum(albumId, true);
    });

    $("#contentPanel img").load(function() {
        numberOfLoadedPhotos++;
        //console.log(numberOfLoadedPhotos / numberOfPhotos * 100 + "%");
        if (numberOfLoadedPhotos === numberOfPhotos) {
            $("#contentPanel .thumbnail img").click(function() {
                showSlide($(this));
            });
            for (var albumkey in cms.albums) {
                animateAlbumThumbnails(cms.albums[albumkey].id, Math.round(Math.random() * 3));
            }
        }
    });

    $("#contentPanel #thumbnails .horizontalSeparator").last().css("marginBottom", (window.innerHeight - $("#contentPanel #thumbnails .horizontalSeparator").last().height()) * 0.8);

};


showSlide = function($img) {
    var url = $img.attr('src').replace("thumbnails/", "");
    $("#slide").fadeOut(100, function() {
        $(this).html('<img src="' + url + '">');
        $("#slide img").load(function() {
            alignSlide();
            $("#slide img").fadeIn(300);
        });
    });
};

alignSlide = function() {
    $("#slide").css("maxHeight", window.innerHeight - parseInt($("#menuPanel").height()) -  50).css("maxWidth", parseInt($("#contentPanel").width()) - (parseInt($("#thumbnails").offset().left) +  parseInt($("#thumbnails").width())) - 50);
    $("#slide").show().
            css("top", (window.innerHeight - parseInt($("#slide img").height()) + parseInt($("#menuPanel").height())) / 2 ).
            css("right", (parseInt($("#contentPanel").width()) - (parseInt($("#thumbnails").offset().left) +  parseInt($("#thumbnails").width())) - parseInt($("#slide img").width())) / 2);
};

