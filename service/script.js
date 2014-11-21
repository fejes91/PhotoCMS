cms = {};
cms.albums = {};
cms.activeAlbum;

cms.VIEW;
cms.THUMBNAIL_VIEW = 1;
//cms.SLIDE_VIEW = 2;
cms.ME_VIEW = 3;
cms.GUESTBOOK_VIEW = 4;

cms.numberOfPhotos = 0;
cms.numberOfLoadedPhotos = -1;

cms.VIEW_LOCK;
cms.resizeTimer;

setHash = function(hash){
    if(window.location.hash !== hash && window.location.hash !== "#" + hash){
        window.location.hash = hash;
        cms.lastHash = hash;
    }
};

if(window.location.hash === ""){
    setHash("p");
}


$(document).ready(function() {
    document.onkeydown = checkKeycode;
    
    window.onhashchange = function(){
        handleHashChange();
    };

    initPortfolio2();
    initGuestbook();
    
    $("#menuPanel #portfolio").click(function() {
        //showPortfolio();
        setHash("p");
    });
    $("#menuPanel #meMenu").click(function() {
        //showMe();
        setHash("m");
    });
    $("#menuPanel #guestbookMenu").click(function() {
        //showMe();
        setHash("g");
    });

    handleHashChange();
});

$(window).resize(function() {
    adjustSizes();
});



handleHashChange = function(){
    if(window.location.hash === "#m"){
        showMe();
    }
    else if(window.location.hash === "#g"){
        showGuestbook();
    }
    else if(window.location.hash === "#p"){
        showPortfolio();
    }
};

checkKeycode = function(e) {
    //Kódok:
    //Balra:37
    //Jobbra:39
    //Fel:38
    //Le:40
    var keycode;
    if (window.event)
        keycode = window.event.keyCode;
    else if (e)
        keycode = e.which;

    if (keycode === 37) {
        showPrevSlide();
    }
    else if (keycode === 39) {
        showNextSlide();
    }
    else if (keycode === 38) {
        setPrevAlbum();
    }
    else if (keycode === 40) {
        setNextAlbum();
    }
};

adjustSizes = function() {
    if (cms.VIEW === cms.THUMBNAIL_VIEW) {
        //$("#contentPanel #thumbnails").css("maxWidth", (window.innerWidth ) * 0.3);
        alignSlide($(".thumbnail.shown img"));
        $("#contentPanel").height(window.innerHeight - $("#menuPanel").height());
    }
    else if (cms.VIEW === cms.ME_VIEW) {
        $("#contentPanel").height(window.innerHeight - $("#menuPanel").height() - 10);
    }

    
};

initPortfolio2 = function() {
    populatePhotos2();
    $("#contentPanel").scroll(function() {
        manageThumbnailScroll();
    });
};

initPortfolio = function() {
    populatePhotos();
    $("#contentPanel").scroll(function() {
        
        manageThumbnailScroll();
    });
};

initGuestbook = function(){
    console.log("initguestbook ");
 
    for(var entryKey in cms.guestbook){
        var entry = cms.guestbook[entryKey];
        $("#guestbookEntries").append('<div class="entry">\"' + entry.text + "\"<div class='author'><i>" + entry.author + "</i></div></div>");
    }

    $("#guestbook #submitGBook").on('click', function(e){
        e.preventDefault();
        
        var data = {
            name: $("#guestbook #name").val(),
            mail: $("#guestbook #mail").val(),
            captcha: $("#guestbook #captcha").val(),
            message: $("#guestbook #message").val()            
        };
        console.log(JSON.stringify(data));
        $.ajax({
            type: "POST",
            url: "GuestbookHandler.php",
            data: data,
            success: handleGuestbookResponse,
            dataType: "text"
        });
    });
    
    $("#guestbook input, #guestbook textarea").focus(function(){$(this).removeClass("error");});
};

handleGuestbookResponse = function(data){
    console.log(data);
    if(data === "INVALID MAIL"){
        $("#guestbook #mail").addClass("error");
    }
    else if(data === "MISSING DATA"){
        $("#guestbook input, #guestbook textarea").filter(function() { return $(this).val() === ""; }).addClass("error");
    }
    else if(data === "CAPTHCA"){
        $("#guestbook #captcha").addClass("error");
    }
    else if(data === "TROLL"){
        $("#guestbook #responseContainer").html("Két üzenet elküldése között várj legalább 5 percet").css("opacity", 1);
    }
    else if(data === "SUCCESS"){
        $("#guestbook #formContainer").slideUp(function(){
            $(this).remove(); $("#guestbook #responseContainer").html("Köszönöm, hogy írtál. Üzenetedet megkaptam és igyekszem mihamarabb feldolgozni.").css("opacity", 1);
        });
    }
};

fadeInPortfolio = function(){
    console.log("fade in portfolio...");

    if(cms.VIEW === cms.THUMBNAIL_VIEW){
        $("#contentPanel #thumbnails, #slide").fadeIn(300, function() {
            setActiveAlbum(cms.albums[0].id, true, true);
        });
    }
};

showPortfolio = function() {
    console.log("show portfolio...");
    if (cms.VIEW === cms.THUMBNAIL_VIEW || cms.VIEW_LOCK) {
        return;
    }
    cms.VIEW = cms.THUMBNAIL_VIEW;
    $("#contentPanel>div").hide();
    $("#menuPanel img").removeClass("active");
    $("#menuPanel img#portfolio").addClass("active");
    
    $("#slide").html('');

    if(cms.numberOfLoadedPhotos > 0 && cms.numberOfLoadedPhotos === cms.numberOfPhotos){
        console.log("showportfolio calls fade portfolio");
        fadeInPortfolio();
    }
    
    $("#contentPanel").height(window.innerHeight - $("#menuPanel").height());
    setTimeout(function(){
        $("#contentPanel #thumbnails .horizontalSeparator").last().css("marginBottom", (window.innerHeight - $("#contentPanel #thumbnails .horizontalSeparator").last().height()) - $("#menuPanel").height() - 10);
    }, 1000);
};

showMe = function() {
    console.log("show me...");
    if (cms.VIEW === cms.ME_VIEW || cms.VIEW_LOCK) {
        return;
    }
    cms.VIEW = cms.ME_VIEW;
    $("#contentPanel>div").hide();

    $("#contentPanel .thumbnail, #contentPanel .horizontalSeparator").removeClass("active");
    cms.activeAlbum = null;

    $("#menuPanel img").removeClass("active");
    $("#menuPanel img#meMenu").addClass("active");

    adjustSizes();
    $("#me").fadeIn(300);
};

showGuestbook = function(){
    console.log("show guestbook...");
    if (cms.VIEW === cms.GUESTBOOK_VIEW || cms.VIEW_LOCK) {
        return;
    }
    cms.VIEW = cms.GUESTBOOK_VIEW;
    $("#contentPanel>div").hide();
    $("#contentPanel .thumbnail, #contentPanel .horizontalSeparator").removeClass("active");
    cms.activeAlbum = null;

    $("#menuPanel img").removeClass("active");
    $("#menuPanel img#guestbookMenu").addClass("active");

    $("#guestbook").fadeIn(300);
    
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
        setActiveAlbum($lowestOffset.attr("albumId"), false, true);
    }

};

scrollToAlbum = function() {
    var scroll = 0;
    scroll = $("#contentPanel .horizontalSeparator.active").offset().top;
    $("#contentPanel").animate({
        scrollTop: $("#contentPanel").scrollTop() + scroll - $("#menuPanel").height() - 10 //default margin-top for first horizontal separator
    }, 300);

};

setActiveAlbum = function(albumId, needScroll, showFirst) {
    if(cms.activeAlbum === albumId){
        return;
    }
    
    cms.activeAlbum = albumId;
    $("#contentPanel .thumbnail, #contentPanel .horizontalSeparator").removeClass("active");
    $('#contentPanel .thumbnail[album="' + albumId + '"], #contentPanel .horizontalSeparator[albumid="' + albumId + '"]').addClass("active");
    if(showFirst){
        showSlide($('.thumbnail.active'));
    }

    if (needScroll) {
        scrollToAlbum();
    }

};

populatePhotos2 = function() {
    cms.numberOfLoadedPhotos = 0;

    cms.oneTwoSwitcher = true;
    cms.thumbnailsWidth = Math.min(window.innerWidth / 3.5, 450);
    cms.$thumbnails;
    $("#thumbnails").width(cms.thumbnailsWidth + 10); //margins

    var thumbnailsStr = "";
    for (var albumKey in cms.albums) {
        var album = cms.albums[albumKey];
        //console.log("album: " + album.name);
        if (album.photos.length > 0) {
            cms.numberOfPhotos += album.photos.length;
            var bgUrl = album.photos[parseInt(Math.random() * album.photos.length)].url;

            thumbnailsStr += '<div id="album-' + album.id + '" class="horizontalSeparator" albumName="' + album.name + '" albumId="' + album.id + '" caption="' + album.caption + '"><div class="albumTitle">' + album.name + "</div>";
            var landscapes = [];
            var portraits = [];
            var nextLandscape = 0;
            var nextPortrait = 0;
            for (var photoKey in album.photos) {
                var photo = album.photos[photoKey];
                parseInt(photo.naturalWidth) > parseInt(photo.naturalHeight) ? landscapes.push(photo) : portraits.push(photo);
            }
            while (portraits.length - nextPortrait > 0 || landscapes.length - nextLandscape > 0) {
                if (portraits.length - nextPortrait > 0) {
                    if (landscapes.length - nextLandscape >= 2 && portraits.length - nextPortrait > 1) {
                        thumbnailsStr += generateOneTwo(album.id, portraits[nextPortrait++], landscapes[nextLandscape++], landscapes[nextLandscape++]);
                        if(landscapes.length - nextLandscape === 2 && portraits.length - nextPortrait === 1){
                            thumbnailsStr += generateOneTwo(album.id, portraits[nextPortrait++], landscapes[nextLandscape++], landscapes[nextLandscape++]);
                        }
                        else if (landscapes.length - nextLandscape >= 2 && landscapes.length - nextLandscape > portraits.length - nextPortrait) {
                            thumbnailsStr += generateRow(album.id, [landscapes[nextLandscape++], landscapes[nextLandscape++]]);
                        }
                    }
                    else if ((landscapes.length - nextLandscape === 1 || portraits.length - nextPortrait === 1) &&
                            landscapes.length - nextLandscape > 0 && portraits.length - nextPortrait > 0) {
                        thumbnailsStr += generateRow(album.id, [landscapes[nextLandscape++], portraits[nextPortrait++]]);
                    }
                    else {
                        if (portraits.length - nextPortrait === 1) {
                            thumbnailsStr += generateRow(album.id, [portraits[nextPortrait++]]);
                        }
                        else if ((portraits.length - nextPortrait) % 3 === 0) {
                            thumbnailsStr += generateRow(album.id, [portraits[nextPortrait++], portraits[nextPortrait++], portraits[nextPortrait++]]);
                        }
                        else {
                            thumbnailsStr += generateRow(album.id, [portraits[nextPortrait++], portraits[nextPortrait++]]);
                        }
                    }
                }
                else if (landscapes.length - nextLandscape > 0) {
                    if (landscapes.length - nextLandscape === 1) {
                        thumbnailsStr += generateRow(album.id, [landscapes[nextLandscape++]]);
                    }
                    else if ((landscapes.length - nextLandscape) % 2 === 0) {
                        thumbnailsStr += generateRow(album.id, [landscapes[nextLandscape++], landscapes[nextLandscape++]]);
                    }
                    else {
                        thumbnailsStr += generateRow(album.id, [landscapes[nextLandscape++], landscapes[nextLandscape++], landscapes[nextLandscape++]]);
                    }
                }
            }
            thumbnailsStr += "</div>";
        }
    }
    $("#thumbnails").prepend(thumbnailsStr);

    $("#contentPanel .thumbnail").click(function() {
        showSlide($(this));
    });


    $(".thumbnail").click(function() {
        var albumId = $(this).attr("album");
        setActiveAlbum(albumId, true, false);
    });
    $("#thumbnails img").load(function() {
        cms.numberOfLoadedPhotos++;
        
        //console.log(cms.numberOfLoadedPhotos / cms.numberOfPhotos * 100 + "%");
        if (cms.numberOfLoadedPhotos === cms.numberOfPhotos) {
            cms.$thumbnails = $(".thumbnail");
            $("#contentPanel .thumbnail").click(function() {
                showSlide($(this));
            });
            
            if(cms.VIEW === cms.THUMBNAIL_VIEW){
                fadeInPortfolio();
            }
            
            
        }
    });

    $("#slideContainer #nextSlide").click(function() {
        showNextSlide();
    });
    $("#slideContainer #prevSlide").click(function() {
        showPrevSlide();
    });
    
};


showNextSlide = function() {
    var currentId = $('.thumbnail.shown').attr("photo");
    for (var i = 0; i < cms.$thumbnails.length; ++i) {
        if (currentId === $(cms.$thumbnails[i]).attr('photo')) {
            $(cms.$thumbnails[parseInt(i) + 1]).click();
        }
    }
};

showPrevSlide = function() {
    var currentId = $('.thumbnail.shown').attr("photo");
    for (var i = 0; i < cms.$thumbnails.length; ++i) {
        if (currentId === $(cms.$thumbnails[i]).attr('photo')) {
            $(cms.$thumbnails[parseInt(i) - 1]).click();
        }
    }
};

setNextAlbum = function() {
    setActiveAlbum($(".horizontalSeparator.active").next().attr("albumid"), true, true);
};

setPrevAlbum = function() {
    setActiveAlbum($(".horizontalSeparator.active").prev().attr("albumid"), true, true);
};

generateRow = function(albumId, photoArray) {
    //console.log("generate row: " + photoArray.length);
    if (photoArray.length === 1) {
        var photo = photoArray[0];
        var style;
        if (parseInt(photo.naturalWidth) > parseInt(photo.naturalHeight)) {
            var width = cms.thumbnailsWidth * 0.6;
            var height = photo.naturalHeight * width / photo.naturalWidth;
            style = "width: " + width + "px; height: " + height + "px;";
        }
        else {
            var width = cms.thumbnailsWidth * 0.4;
            var height = photo.naturalHeight * width / photo.naturalWidth;
            style = "width: " + width + "px; height: " + height + "px;";
        }

        return '<div class="thumbnail onetwo" style="' + style + '" album="' + albumId + '" photo="' + photo.id + '"><img src="../img/thumbnails/' + photo.url + '" caption="' + photo.caption + '" naturalWidth="' + photo.naturalWidth + '" naturalHeight="' + photo.naturalHeight + '"/></div>';
    }

    var HEIGHT = photoArray[0].naturalHeight;

    var widths = [];
    var completeWidth = 0;
    for (var photoKey in photoArray) {
        var photo = photoArray[photoKey];
        if (typeof photo !== "undefined") {
            var newWidth = parseInt(photo.naturalWidth) * HEIGHT / parseInt(photo.naturalHeight);
            widths.push(newWidth);
            completeWidth += newWidth;
        }
    }
    var ratio = cms.thumbnailsWidth / completeWidth;

    var str = "";
    for (var key in photoArray) {
        var photo = photoArray[key];
        if (typeof photo !== "undefined") {
            var style = "width: " + (widths[key] * ratio - (photoArray.length - 2) * 4 / photoArray.length) + "px; height: " + HEIGHT * ratio + "px;";
            str += '<div class="thumbnail onetwo landscape" style="' + style + '" album="' + albumId + '" photo="' + photo.id + '"><img src="../img/thumbnails/' + photo.url + '" caption="' + photo.caption + '" naturalWidth="' + photo.naturalWidth + '" naturalHeight="' + photo.naturalHeight + '"/></div>';
        }
    }
    return str;
};

generateOneTwo = function(albumId, portrait, landscape1, landscape2) {
    //console.log("generate onetwo");
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

    var portraitStyle = "width: " + portraitWidth + "px; height: " + portraitHeight + "px;";
    var landscape1Style = "width: " + landscapesWidth + "px; height: " + landScape1Height + "px;";
    var landscape2Style = "width: " + landscapesWidth + "px; height: " + landScape2Height + "px;";
    var landscapeWrapperStlye = "width: " + (4 + landscapesWidth) + "px; height: " + (4 + portraitHeight) + "px;";
    var str = "";

    if (cms.oneTwoSwitcher) {
        str += '<div class="thumbnail onetwo portrait" style="' + portraitStyle + '" album="' + albumId + '" photo="' + portrait.id + '"><img src="../img/thumbnails/' + portrait.url + '" caption="' + portrait.caption + '"  naturalWidth="' + portrait.naturalWidth + '" naturalHeight="' + portrait.naturalHeight + '"/></div>';
    }
    str += '<div class="landscapeWrapper" style="' + landscapeWrapperStlye + ' float: left;">';
    str += '<div class="thumbnail onetwo landscape" style="' + landscape1Style + '" album="' + albumId + '" photo="' + landscape1.id + '"><img src="../img/thumbnails/' + landscape1.url + '" caption="' + landscape1.caption + '" naturalWidth="' + landscape1.naturalWidth + '" naturalHeight="' + landscape1.naturalHeight + '"/></div>';
    str += '<div class="thumbnail onetwo landscape" style="' + landscape2Style + '" album="' + albumId + '" photo="' + landscape2.id + '"><img src="../img/thumbnails/' + landscape2.url + '" caption="' + landscape2.caption + '" naturalWidth="' + landscape2.naturalWidth + '" naturalHeight="' + landscape2.naturalHeight + '"/></div>';
    str += '</div>';
    if (!cms.oneTwoSwitcher) {
        str += '<div class="thumbnail onetwo portrait" style="' + portraitStyle + '" album="' + albumId + '" photo="' + portrait.id + '"><img src="../img/thumbnails/' + portrait.url + '" caption="' + portrait.caption + '" naturalWidth="' + portrait.naturalWidth + '" naturalHeight="' + portrait.naturalHeight + '"/></div>';
    }

    cms.oneTwoSwitcher = !cms.oneTwoSwitcher;
    return str;
};


showSlide = function($thumbnail) {
    $(".icon, #slideInfo").removeClass("visible");
    $(".thumbnail").removeClass("shown");
    $thumbnail.addClass("shown");
    var $img = $thumbnail.find("img");
    
    var url = $img.attr('src').replace("thumbnails/", "");
    /*$("#slide").fadeOut(100, function() {
        $(this).html('<img src="' + url + '">');
        $("#slide img").load(function() {
            $("#slideContainer #slideInfo #photoInfo").html($img.attr("caption"));
            $("#slideContainer #slideInfo #albumInfo").html($img.parent().parent().attr("caption"));
            alignSlide();

            $("#slide img").fadeIn(300);
        });
    });*/
    
    $("#slide")
            .css({backgroundImage: "url('" + $img.attr('src') + "')", opacity: '0.7'})
            .css("-webkit-filter", 'blur(10px)')
            .html('<img style="opacity: 0;" src="' + url + '">');
    
    $("#slideContainer #slideInfo #photoInfo").html($img.attr("caption"));
    $("#slideContainer #slideInfo #albumInfo").html($img.parent().parent().attr("caption"));
    alignSlide($img);
    
    $("#slide img").load(function() {
        $("#slide img").css("opacity", "1");
        $("#slide").css("-webkit-filter", 'blur(0px)').css("opacity", '1');
    });

};


alignSlide = function($img) {
    $("#slideContainer")
            .width(parseInt($("#contentPanel").width()) - (parseInt($("#thumbnails").offset().left) + parseInt($("#thumbnails").width())) - 50)
            .height(window.innerHeight - parseInt($("#menuPanel").height()) - 50);
    
    var slideMaxHeight = parseInt(window.innerHeight - parseInt($("#menuPanel").height()) - 50);
    var slideMaxWidth = parseInt($("#contentPanel").width()) - (parseInt($("#thumbnails").offset().left) + parseInt($("#thumbnails").width())) - 150;
    var photoNaturalWidth = parseInt($img.attr("naturalWidth"));
    var photoNaturalHeight = parseInt($img.attr("naturalHeight"));
    
    var photoActualWidth;
    var photoActualHeight;
    if(photoNaturalWidth > photoNaturalHeight){ //fekvő
        photoActualWidth = Math.min(photoNaturalWidth, slideMaxWidth);
        photoActualHeight = photoNaturalHeight * (photoActualWidth / photoNaturalWidth);
    }
    else{ //álló
        photoActualHeight = Math.min(photoNaturalHeight, slideMaxHeight);
        photoActualWidth = photoNaturalWidth * (photoActualHeight / photoNaturalHeight);
    }
    
    $("#slide").height(photoActualHeight).width(photoActualWidth);
    $("#slide").show();
    
        
    
    //$("#slideInfo .icon").css("marginTop", $("#slide img").height() * 0.3);
    $("#slideInfo .icon").css("marginTop", photoActualHeight * 0.3);
    $("#slideInfo #infoContainer")
            .bind('mousemove', function() {
        $("#slideInfo").addClass("active");
    })
            .bind('mouseleave', function() {
        $("#slideInfo").removeClass("active");
    });
    
    var timer;
    $("#slideInfo, .slideNavigation")
            .bind('mouseenter', function() {
        $(".icon, #slideInfo").addClass("visible");
        timer = setTimeout(function(){$(".icon, #slideInfo").removeClass("visible");}, 1000);
    })
            .bind('mouseleave', function() {
        $(".icon, #slideInfo").removeClass("visible");
        clearTimeout(timer);
    });
    
    $("#slideContainer")
            .css("top", (window.innerHeight - parseInt($("#slideContainer").height()) + parseInt($("#menuPanel").height())) / 2)
            .css("right", (parseInt($("#contentPanel").width()) - (parseInt($("#thumbnails").offset().left) + parseInt($("#thumbnails").width())) - parseInt($("#slideContainer").width())) / 2);
    $("#slideWrapper")
            //.css("top", (parseInt($("#slideContainer").height()) - parseInt($("#slide img").height())) / 2)
            .css("top", (parseInt($("#slideContainer").height()) - parseInt(photoActualHeight)) / 2)
            ;//.css("left", (parseInt($("#slideContainer").width()) - parseInt($("#slide img").width())) / 2);
            
    //Hacking to hell the fuckin css transition...
    $("#slideInfo").addClass("notransition");
    $("#slideInfo")
            //.css({width: $("#slide img").css("width")})
            .css({width: photoActualWidth})
            .css({bottom: -1 * (parseInt($("#albumInfo").outerHeight()) + parseInt($("#photoInfo").outerHeight()))})
            .offset({left: $("#slide").offset().left});
    $("#slideInfo")[0].offsetHeight;
    $("#slideInfo").removeClass("notransition");
            
};

