cms = {};
cms.albums = {};
cms.activeAlbum;
cms.lastScroll = 0;
cms.resizeTimer;

$(document).ready(function() {
    init();
    populatePhotos();
    $("#thumbnailPanel").scroll(function(){
        manageAlbumScroll();
    });
});

$(window).resize(function() {
    $("#thumbnailPanel").height(window.innerHeight - 60);
    
    clearTimeout(cms.resizeTimer);
    cms.resizeTimer = window.setTimeout(function() {
        manageActiveSeparators(false);
    }, 500);
});



init = function() {
    $("#thumbnailPanel").height(window.innerHeight - 60);
    $("#horizontalSeparator").css("left", $("#horizontalSeparator").width());
};

manageAlbumScroll = function(){
    var down = cms.lastScroll < $("#thumbnailPanel").scrollTop();

    if(typeof cms.activeAlbum !== "undefined"){
        if(down){
            $(".horizontalSeparator:not(.active)").each(function(){
                if($(this).offset().top <= $("#horizontalSeparator").offset().top + 50 && $(this).prevAll(".horizontalSeparator.active").length !== 0){
                    setActiveAlbum($(this).attr("albumId"), false);
                }
            });
        }
        else{
            var prevAlbum = $(".horizontalSeparator.active").prevAll(".horizontalSeparator").first();
            console.log("prevalbum: " + prevAlbum.attr("albumName"));
            if($(".horizontalSeparator.active").offset().top > window.innerHeight * 0.85 || 
                    (typeof prevAlbum.offset() !== "undefined" && prevAlbum.offset().top >= $("#horizontalSeparator").offset().top)){
                setActiveAlbum(prevAlbum.attr("albumId"), false);
            }
        }
    }
    
    cms.lastScroll = $("#thumbnailPanel").scrollTop();
};

manageActiveSeparators = function(needScroll) {
    if ($("#albumPanel li.album.active").length > 0) {
        var activeAlbumOffset = $("#albumPanel li.album.active").offset();
        var activeAlbumRightPadding = $("#albumPanel li.album.active").css("paddingRight");
        //var activeHSepOffset = $("#thumbnailPanel .horizontalSeparator.active").offset();
        var activeHSepHeight = $("#thumbnailPanel .horizontalSeparator.active").height();
        var activeAlbumWidth = $("#albumPanel li.album.active").width();
        var activeAlbumHeight = $("#albumPanel li.album.active").height();

        $("#horizontalSeparator").animate({left: parseInt(activeAlbumOffset.left) + parseInt(activeAlbumWidth) + parseInt(activeAlbumRightPadding)}, 200);

        var scroll = 0;
        if(needScroll){
            scroll = $("#thumbnailPanel .horizontalSeparator.active").offset().top - $("#horizontalSeparator").offset().top;
        }
        
        $("#horizontalSeparator span").fadeOut(200);
        $("#thumbnailPanel").animate({
            scrollTop: $("#thumbnailPanel").scrollTop() + scroll - 5
        }, 500, function() {
            $("#thumbnailPanel .horizontalSeparator:not(.active)").animate({left: "-15px"}, 100);
            $("#horizontalSeparator span").html($("#thumbnailPanel .horizontalSeparator.active").attr("albumName")).fadeIn(300);
            $("#thumbnailPanel .horizontalSeparator.active").animate(
                    {
                        //marginLeft: -1 * (activeHSepOffset.left - parseInt(activeAlbumOffset.left) - parseInt(activeAlbumWidth) - parseInt(activeAlbumRightPadding))
                        left: parseInt(activeAlbumOffset.left) + parseInt(activeAlbumWidth) + parseInt(activeAlbumRightPadding)
                    }, 200, function(){
                        
                    });
        });

        var top = 50 + activeHSepHeight;
        var left = parseInt(activeAlbumOffset.left) + parseInt(activeAlbumWidth) + parseInt(activeAlbumRightPadding);
        var height = Math.abs(top - parseInt(activeAlbumOffset.top) - activeAlbumHeight) + parseInt($("#albumPanel li.album.active").css("border-bottom-width"));
        $("#verticalSeparator").show().css("top", top).css("left", left).height(height);
    }
    else {
        $("#verticalSeparator").hide();
    }
};

setActiveAlbum = function(albumId, needScroll) {
    cms.activeAlbum = albumId;
    if (!$("#albumPanel li#" + albumId).hasClass("active")) {
        $("#thumbnailPanel .thumbnail, #thumbnailPanel .horizontalSeparator, #albumPanel li.album").removeClass("active");
        $("#thumbnailPanel .thumbnail.album-" + albumId + ", #thumbnailPanel .horizontalSeparator#album-" + albumId + ", #albumPanel li#" + albumId).addClass("active");

        manageActiveSeparators(needScroll);
        manageThumbnailSizes();
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
    
    var bgAlbum = cms.albums[parseInt(Math.random() * cms.albums.length)];
    var bgUrl = bgAlbum.photos[parseInt(Math.random() * bgAlbum.photos.length)].url;
    
    $("#background").css("background-image", "url(../img/thumbnails/" + bgUrl + ")");

    for (var albumKey in cms.albums) {
        var album = cms.albums[albumKey];
        if (album.photos.length > 0) {
            $("#thumbnails").append('<div id="album-' + album.id + '" class="horizontalSeparator" albumName="' + album.name + '" albumId="' + album.id + '"></div>');
            $("#albumPanel ul").append('<li id="' + album.id + '" class="album">' + album.name + '</li>')
            numberOfPhotos += album.photos.length;
            for (var photoKey in album.photos) {
                var photo = album.photos[photoKey];
                for(var i = 0; i < 20; ++i){ //extra sok kép legyen TODO kivenni innen
                    $("#thumbnails").append('<div class="thumbnail album-' + album.id + '"><img src="../img/thumbnails/' + photo.url + '"/></div>');
                }
            }
        }
    }
    var footerHeight = window.innerHeight - ($(".thumbnail").last().offset().top + $(".thumbnail").last().height() - $(".horizontalSeparator").last().offset().top) - $("#horizontalSeparator").offset().top;
    if(footerHeight < 0){
        footerHeight = 0;
    }
    $("#thumbnails").append('<div id="thumbnailPanelFooter" style="height:' + footerHeight + '"></div>'); //TODO resizera is menjen

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

