<?
include "frontEndService.php";
?>

<html>
    <head>
        <title>Fejes Ádám Fotó</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="style.css">
        <!--link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'-->
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,300,400' rel='stylesheet' type='text/css'>
        <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script src="script.js"></script>
    </head>
    <body>
        <script>
            cms.albums = JSON.parse('<? echo getAlbum(null) ?>');
        </script>
        <!--div id="background"></div-->
        <div id="stat"></div>
        <div id="verticalSeparator"></div>
        <!--div id="horizontalSeparator"><span id="text"></span></div-->
        <div id="menuPanel">
            <img src="../img/build/camera.png" id="portfolio" title="Portfólió" alt="Portfólió">
            <img src="../img/build/me.png" id="meMenu" title="Rólam" alt="Rólam">
            <img src="../img/build/book.png" id="guestbook" title="Vendégkönyv" alt="Vendégkönyv">
            <a href="http://fejesadamfoto.hu/blog"><img src="../img/build/blog.png" id="blog" title="Blog" alt="Blog"></a>
        </div>
        <div id="albumPanel">
            <ul></ul>
        </div>
        <!--div id="wrapper">
            <div id="albumPanel">
                <ul></ul>
            </div>
            <div id="contentPanel">
                <div id="thumbnails"></div>
            </div>
        </div-->
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
                <p>
                    <b style="font-size: 32px;">Fejes Ádám</b> vagyok. 91-ben születtem, jelenleg fejlesztőként dolgozok és a hobbim a fotózás. Nem vagyok és nem is akarok profi fotós lenni, nekem ez mindig kikapcsolódást jelent, sosem munkát. Kérdezhetnéd, hogy akkor minek a portfólió és a saját domain? Csak! Mert nem csak fotózni szeretek, hanem weboldalakkal is szívesen molyolok, ez az oldal nem csak fotós, hanem webfejlesztői portfólió is.
                </p>
                <p>
                    <img src="http://fejesadamfoto.hu/en.jpg" width="30%" style="float: right; margin-left: 10px; max-width:350px;">
                    Minden eddigi fotós tudásom könyvekből, cikkekből és fórumokról jött, nem jártam soha fotós képzésre, de egyszer ha sok időm lesz (létezik ilyen?) akkor elképzelhető, hogy beiratkozok valahova. Mint szinte mindenki én is természet fotózással kezdtem. Megtanultam az alapfogalmakat, alapvető technikákat. Amikor már a kert minden fűszáláról készült kép és már a kutyám is inkább elmenekült, nehogy még egy átkozott fotó készüljön róla, akkor elkezdtem a városban fényképezni. Ekkor éreztem úgy, hogy nem lenne teljesen pénzkidobás egy komolyabb gépbe befektetni és megvettem az első tükrös gépem, amit most is nagy örömmel használok. Időközben beszereztem pár vakut, elkezdtem ismerkedni a strobist stílussal. Jelenleg ezzel foglalkozom a legszívesebben. Szeretek kísérletezni a fényekkel, árnyékokkal, hátterekkel. Tetszik, hogy ilyen sok lehetőségem van kreatívkodni.
                </p>
                <p>
                    A fotóimat be szoktam küldeni a Dreamstime fotóügynökséghez, ahol meglepően sok be is kerül a katalógusba. Egyelőre még nem sikerült a képeimmel megkeresni a kisebb vagyont se, de ahogy írtam fentebb, ez nem is célom. Viszont jól esik a tudat, hogy néhány képem megugorja azt a bizonyos lécet. A portfóliómban zöld csíkkal jelöltem azokat a képeket amelyek Dreamstimeon is elérhetőek, sőt megvásárolhatóak.
                </p>	
            </div>
        </div>

    </div>

</body>
</html>
