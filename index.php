<?
include "frontEndService.php";
header('Content-type: text/html; charset=utf-8');
?>

<html>
    <head>
        <title>Fejes Ádám Fotó</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        
        <meta name="description" content="Fejes Ádám fotóportfólió">
	<meta name="keywords" content="
		fejes, ádám, fotó, természet, tájkép,  város, urban, utca, portré, vaku, fénykép, fényképezőgép, portfólió, hobbi, magyarország,
			   adam, photo, nature, landscape, city, street, portrait, flash, photography, camera, portfolio, hobby, picture, budapest, hungary,
			   nikon
		">
	<meta name="robots" content="index, follow">
	<meta name="revisit-after" content="1 Week">
	<meta name="author" content="Fejes Ádám">
	<meta name="copyright" content="Minden jog fenntartva">
	<meta name="distribution" content="local">
	<meta name="language" content="HU">
	<meta name="rating" content="general">
	
	<base target="_parent">

	<link rel="icon" type="image/png" href="<?echo getFrontendImagesHome()?>build/favicon.png">
        
        <link rel="stylesheet" type="text/css" href="style.css">
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,300,400' rel='stylesheet' type='text/css'>
        <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
        <!--script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script-->
        <script src="script.js"></script>

        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-35928646-1', 'auto');
            ga('send', 'pageview');

              </script>
    </head>
    <body>
        <script>
            cms.albums = JSON.parse('<? echo getAlbum(null) ?>');
            cms.guestbook = JSON.parse('<? echo getGuestbook() ?>');
            cms.captcha = JSON.parse('<? echo getCaptcha() ?>');
            cms.imagesHome = '<? echo getFrontendImagesHome() ?>'; 
        </script>
        <div id="stat"></div>
        <div id="verticalSeparator"></div>
        <div id="menuPanel">
            <img src="<?echo getFrontendImagesHome()?>build/camera.png" id="portfolio" title="Portfólió" alt="Portfólió">
            <img src="<?echo getFrontendImagesHome()?>build/me.png" id="meMenu" title="Rólam" alt="Rólam">
            <img src="<?echo getFrontendImagesHome()?>build/book.png" id="guestbookMenu" title="Vendégkönyv" alt="Vendégkönyv">
            <a href="http://fejesadamfoto.hu/blog"><img src="<?echo getFrontendImagesHome()?>build/blog.png" id="blog" title="Blog" alt="Blog"></a>
            <img id="logo" src="<?echo getFrontendImagesHome()?>build/f.png">
        </div>
        <div id="contentPanel">
            <div id="thumbnails">
                <div id="slideContainer">
                    <div id="slideWrapper">
                        <div id="slide"></div>
                        <div id="slideInfo">
                        <div id="infoContainer"> <!--sima animáció-->
                            <div class="icon"></div>
                            <div id="photoInfo" class="info"></div>
                            <div id="albumInfo" class="info "></div>
                            
                        </div>
                    </div>
                    </div>
                    
                    <div id="nextSlide" class="slideNavigation "><span class="icon"></span></div>
                    <div id="prevSlide" class="slideNavigation"><span class="icon"></span></div>

                </div>
            </div>    
            <div id="me">
                <div class="headerContaier"><img class="header" src="<?echo getFrontendImagesHome()?>build/me.jpg"></div>
                <p>
                    <b style="font-size: 32px;">Fejes Ádám</b> vagyok, 91-ben születtem, jelenleg fejlesztőként dolgozok, hobbim a fotózás.
                    Lencsevégre kapni a pillanatot, számomra mindig kikapcsolódást jelent, sosem munkát.
                    Amatőrként céltudatosan keresgélem az utat a fotózás világában, igyekszem minél több módszert, technikát kipróbálni. 
                    Élményeimet és tapasztalataimat a <a href="http://fejesadamfoto.hu/blog">blogomon</a> írom le, természetesen gazdagon illusztrálva a képeimmel.
                </p>

                <div class="logoContainer">
                    <a target="_blank" href="https://www.facebook.com/fejesadamfotoblogja"><img class="logo" src="<?echo getFrontendImagesHome()?>build/facebook.png"></a>
                    <a target="_blank" href="https://www.flickr.com/photos/fejes91/"><img class="logo" src="<?echo getFrontendImagesHome()?>build/flickr.png"></a>
                    <a target="_blank" href="https://500px.com/fejes91#"><img class="logo" src="<?echo getFrontendImagesHome()?>build/500px.png"></a>
                    <a target="_blank" href="http://instagram.com/fejesadamfoto/"><img class="logo" src="<?echo getFrontendImagesHome()?>build/instagram.png"></a>
                    <br>
                    <img class="logo big" src="<?echo getFrontendImagesHome()?>build/mail_address.png">
                </div>
                <div class="footer">Fejes Ádám fotó - 2015<br>Az oldalon található képek használata engedélyhez kötött</div>
                
            </div>
            
            <div id="guestbook">
                <header>Vendégkönyv</header>
                <div id="formContainer">
                    <form id="gBookForm" accept-charset="UTF-8" method="POST">
                        <input name="name" id="name" type="text" placeholder="Név" autofocus=""><br>
                        <input name="mail" id="mail" placeholder="Email" type="text"><br>
                        <input name="captcha" id="captcha" type="text" autofocus=""><br>
                        <textarea name="message" id="message" type="text" ></textarea><br>

                        <div id="submitGBook">
                                Küldés
                        </div>


                    </form>
                </div>
                <div id="responseContainer"></div>
                <div id="guestbookEntries"></div>
            </div>
        </div>

    </div>

</body>
</html>
