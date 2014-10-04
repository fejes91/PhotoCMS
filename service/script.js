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
    initPortfolio2();
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
        //$("#contentPanel #thumbnails").css("maxWidth", (window.innerWidth ) * 0.3);
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

initPortfolio2 = function() {
    populatePhotos2();
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
            showSlide($("#thumbnails .horizontalSeparator.active .thumbnail2:first img"));
            //showSlide($("#thumbnails .horizontalSeparator.active .thumbnail:first img"));

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
        }, 300);
    });

    $(".thumbnail.active").on('mouseout', function() {
        $(this).find("img").stop().animate({
            width: "250%",
        }, 300);
    });


};

populatePhotos = function() {
    var numberOfPhotos = 0;
    var numberOfLoadedPhotos = 0;
    var photoPerRow = 3;
    if(window.innerWidth < 1025){
        photoPerRow = 2;
    }
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
            var nr = 1;
            for (var i = 0; i < 10; ++i) { //extra sok kép legyen TODO kivenni innen
                for (var photoKey in album.photos) {
                    var photo = album.photos[photoKey];
                    thumbnailsStr += '<div class="thumbnail" album="' + album.id + '" photo="' + photo.id + '"><img src="../img/thumbnails/' + photo.url + '"/></div>';
                    if(nr % photoPerRow === 0){
                        thumbnailsStr += "<br>";
                    }
                    nr++;
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


populatePhotos2 = function() {
    var numberOfPhotos = 0;
    var numberOfLoadedPhotos = 0;
    
    cms.oneTwoSwitcher = true;
    cms.thumbnailsWidth = 350;
    $("#thumbnails").width(cms.thumbnailsWidth + 20); //margins
    //$(".thumbnail").hide();

    var thumbnailsStr = "";
    for (var albumKey in cms.albums) {
        var album = cms.albums[albumKey];

        if (album.photos.length > 0) {
            var bgUrl = album.photos[parseInt(Math.random() * album.photos.length)].url;
            $("#albumPanel ul").append('<li id="' + album.id + '" class="album"><img src="../img/thumbnails/' + bgUrl + '"><span>' + album.name + '</span></li>');
            
            var thumbnailsStr = "";
            thumbnailsStr += '<div id="album-' + album.id + '" class="horizontalSeparator" albumName="' + album.name + '" albumId="' + album.id + '">';
            landscapes = [];
            portraits = [];
            for (var photoKey in album.photos) {
                var photo = album.photos[photoKey];
                parseInt(photo.naturalWidth) > parseInt(photo.naturalHeight) ? landscapes.push(photo) : portraits.push(photo);                    
            }
            
            
            //thumbnailsStr += generateThree(album.id, portraits[0], portraits[1], portraits[2]);
            thumbnailsStr += generateOneTwo(album.id, portraits[2], landscapes[4], landscapes[5]);
            thumbnailsStr += generateOneTwo(album.id, portraits[3], landscapes[2], landscapes[3]);
            thumbnailsStr += generateTwo(album.id, landscapes[0], landscapes[1]);
            thumbnailsStr += generateOneTwo(album.id, portraits[4], landscapes[6], landscapes[7]);
        }
    }
    $("#thumbnails").prepend(thumbnailsStr);
    $("#contentPanel .thumbnail2 img").click(function() {
                showSlide($(this));
            });

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
            $("#contentPanel .thumbnail2 img").click(function() {
                showSlide($(this));
            });
            for (var albumkey in cms.albums) {
                animateAlbumThumbnails(cms.albums[albumkey].id, Math.round(Math.random() * 3));
            }
        }
    });

    $("#contentPanel #thumbnails .horizontalSeparator").last().css("marginBottom", (window.innerHeight - $("#contentPanel #thumbnails .horizontalSeparator").last().height()) * 0.8);

};

generateThree = function(albumId, portrait1, portrait2, portrait3){
    var portraitsWidth = cms.thumbnailsWidth / 3;
    var portrait1Height = portrait1.naturalHeight * portraitsWidth / portrait1.naturalWidth;
    var portrait2Height = portrait2.naturalHeight * portraitsWidth / portrait2.naturalWidth;
    var portrait3Height = portrait3.naturalHeight * portraitsWidth / portrait3.naturalWidth;

    var portrait1Style = "width: " + portraitsWidth + "px; height: " + portrait1Height +"px;";
    var portrait2Style = "width: " + portraitsWidth + "px; height: " + portrait2Height +"px;";
    var portrait3Style = "width: " + portraitsWidth + "px; height: " + portrait3Height +"px;";
    var str = "";        

    str += '<div class="thumbnail2 onetwo portrait" style="' + portrait1Style + '" album="' + albumId + '" photo="' + portrait1.id + '"><img src="../img/thumbnails/' + portrait1.url + '"/></div>';
    str += '<div class="thumbnail2 onetwo portrait" style="' + portrait2Style + '" album="' + albumId + '" photo="' + portrait2.id + '"><img src="../img/thumbnails/' + portrait2.url + '"/></div>';
    str += '<div class="thumbnail2 onetwo portrait" style="' + portrait3Style + '" album="' + albumId + '" photo="' + portrait3.id + '"><img src="../img/thumbnails/' + portrait3.url + '"/></div>';
    return str;
};

generateTwo = function(albumId, landscape1, landscape2){
    var landscapesWidth = cms.thumbnailsWidth / 2;
    var landScape1Height = landscape1.naturalHeight * landscapesWidth / landscape1.naturalWidth;
    var landScape2Height = landscape2.naturalHeight * landscapesWidth / landscape2.naturalWidth;

    var landscape1Style = "width: " + landscapesWidth + "px; height: " + landScape1Height +"px;";
    var landscape2Style = "width: " + landscapesWidth + "px; height: " + landScape2Height +"px;";
    var str = "";        

    str += '<div class="thumbnail2 onetwo landscape" style="' + landscape1Style + '" album="' + albumId + '" photo="' + landscape1.id + '"><img src="../img/thumbnails/' + landscape1.url + '"/></div>';
    str += '<div class="thumbnail2 onetwo landscape" style="' + landscape2Style + '" album="' + albumId + '" photo="' + landscape2.id + '"><img src="../img/thumbnails/' + landscape2.url + '"/></div>';
    return str;
};

generateOneTwo = function(albumId, portrait, landscape1, landscape2){
    var landscapesWidth = Math.max(landscape1.naturalWidth, landscape2.naturalWidth);
    var landScape1Height = landscape1.naturalHeight * landscapesWidth / landscape1.naturalWidth;
    var landScape2Height = landscape2.naturalHeight * landscapesWidth / landscape2.naturalWidth;
   
    var portraitHeight = landScape1Height + landScape2Height;
    var portraitWidth = portraitHeight * parseFloat(portrait.naturalWidth) / parseFloat(portrait.naturalHeight);
    
    var completeWidth = portraitWidth + landscapesWidth;
    var ratio = cms.thumbnailsWidth / completeWidth;
    
    portraitWidth = portraitWidth * ratio;    
    landscapesWidth = landscapesWidth * ratio;
    landScape1Height = Math.ceil(landScape1Height * ratio);
    landScape2Height = Math.ceil(landScape2Height * ratio);
    portraitHeight = landScape1Height + landScape2Height + 4;
    
    var portraitStyle = "width: " + portraitWidth + "px; height: " + portraitHeight +"px;";
    var landscape1Style = "width: " + landscapesWidth + "px; height: " + landScape1Height +"px;";
    var landscape2Style = "width: " + landscapesWidth + "px; height: " + landScape2Height +"px;";
    var landscapeWrapperStlye = "width: " + (4 + landscapesWidth)  + "px; height: " + (4 + portraitHeight) +"px;";
    var str = "";        

    if(cms.oneTwoSwitcher){
        str += '<div class="thumbnail2 onetwo portrait" style="' + portraitStyle + '" album="' + albumId + '" photo="' + portrait.id + '"><img src="../img/thumbnails/' + portrait.url + '"/></div>';
    }
    str += '<div class="landscapeWrapper" style="' + landscapeWrapperStlye + ' float: left;">';
        str += '<div class="thumbnail2 onetwo landscape" style="' + landscape1Style + '" album="' + albumId + '" photo="' + landscape1.id + '"><img src="../img/thumbnails/' + landscape1.url + '"/></div>';
        str += '<div class="thumbnail2 onetwo landscape" style="' + landscape2Style + '" album="' + albumId + '" photo="' + landscape2.id + '"><img src="../img/thumbnails/' + landscape2.url + '"/></div>'; 
    str += '</div>';
    if(!cms.oneTwoSwitcher){
        str += '<div class="thumbnail2 onetwo portrait" style="' + portraitStyle + '" album="' + albumId + '" photo="' + portrait.id + '"><img src="../img/thumbnails/' + portrait.url + '"/></div>';
    }
    
    cms.oneTwoSwitcher = !cms.oneTwoSwitcher;
    return str;
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

