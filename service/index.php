<?
include "frontEndService.php";
header('Content-type: text/html; charset=utf-8');
?>

<html>
    <head>
        <title>Fejes Ádám Fotó</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="style.css">
        <!--link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'-->
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,300,400' rel='stylesheet' type='text/css'>
        <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script src="raphael-min.js"></script>
        <script src="script.js"></script>
    </head>
    <body>
        <script>
            cms.albums = JSON.parse('<? echo getAlbum(null) ?>');
            cms.guestbook = JSON.parse('<? echo getGuestbook() ?>');
            cms.captcha = JSON.parse('<? echo getCaptcha() ?>');
        </script>
        <div id="stat"></div>
        <div id="verticalSeparator"></div>
        <div id="menuPanel">
            <img src="../img/build/camera.png" id="portfolio" title="Portfólió" alt="Portfólió">
            <img src="../img/build/me.png" id="meMenu" title="Rólam" alt="Rólam">
            <img src="../img/build/book.png" id="guestbookMenu" title="Vendégkönyv" alt="Vendégkönyv">
            <a href="http://fejesadamfoto.hu/blog"><img src="../img/build/blog.png" id="blog" title="Blog" alt="Blog"></a>
            <img id="logo" src="../img/build/f.png">
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
                <img class="header" src="../img/build/me.jpg">
                <p>
                    <b style="font-size: 32px;">Fejes Ádám</b> vagyok, 91-ben születtem, jelenleg fejlesztőként dolgozok, hobbim a fotózás.
                    Lencsevégre kapni a pillanatot, számomra mindig kikapcsolódást jelent, sosem munkát.
                    Amatőrként céltudatosan keresgélem az utat a fotózás világában, igyekszem minél több módszert, technikát kipróbálni. 
                    Élményeimet és tapasztalataimat a <a href="http://fejesadamfoto.hu/blog">blogomon</a> írom le, természetesen gazdagon illusztrálva a képeimmel.
                </p>

                <div class="logoContainer">
                    <a target="_blank" href="https://www.facebook.com/fejesadamfotoblogja"><img class="logo" src="../img/build/facebook.png"></a>
                    <a target="_blank" href="https://www.flickr.com/photos/fejes91/"><img class="logo" src="../img/build/flickr.png"></a>
                    <a target="_blank" href="https://500px.com/fejes91#"><img class="logo" src="../img/build/500px.png"></a>
                    <br>
                    <img class="logo big" src="../img/build/mail_address.png">
                </div>
                <div class="footer">Fejes Ádám fotó - 2014<br>Az oldalon található képek használata engedélyhez kötött</div>
                
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
