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
            <img src="../img/build/book.png" id="guestbookMenu" title="Vendégkönyv" alt="Vendégkönyv">
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
                <img class="header" src="../img/build/me.jpg">
                <p>
                    
                    <b style="font-size: 32px;">Fejes Ádám</b> vagyok. 91-ben születtem, jelenleg fejlesztőként dolgozok és a hobbim a fotózás. 
                    Nem vagyok és nem is akarok profi fotós lenni, nekem ez mindig kikapcsolódást jelent, sosem munkát. 
                    Nem csak fotózni szeretek, hanem weboldalakkal is szívesen molyolok (egy ideje már pénzért), így 
                    ez az oldal nem csak fotós, hanem webfejlesztői portfólió is.
                    
                </p>
                <div class="logoContainer">
                    <a target="_blank" href="https://www.facebook.com/fejesadamfotoblogja"><img class="logo" src="../img/build/facebook.png"></a>
                    <a target="_blank" href="https://www.flickr.com/photos/fejes91/"><img class="logo" src="../img/build/flickr.png"></a>
                </div>
                <div class="footer">Fejes Ádám fotó - 2014<br>Az oldalon található képek használata engedélyhez kötött</div>
                
            </div>
            
            <div id="guestbook">
                <header>Vendégkönyv</header>
                <form id="gBookForm" accept-charset="UTF-8" method="POST">
			<table class="guestBook" id="GBTable" border="0" cellspacing="12" style="width: 946px; min-width: 586px;">
				<tbody><tr>
                                        
					<td valign="center" style="width: 120px;">
						Név:
					</td>
					<td style="width: 250px;">
						<input name="name" id="name" type="text" style="width: 250px;" autofocus="">
					</td>
				</tr>
				<tr>
					<td style="width: 120px;">
						Email cím:
					</td>
					<td style="width: 250px;">
						<input name="mail" id="mail" type="text" style="width: 250px;">
					</td>
					<td style="text-align: left;">
						<div style="font-size: 0.8em;">(Nem fog megjelenni az oldalon)</div>
					</td>
				</tr>
				<tr>
					<td valign="center" style="width: 120px;">
						Mennyi három meg három?
					</td>
					<td style="width: 250px;">
						<input name="captcha" id="captcha" type="text" style="width: 250px;" autofocus="">
					</td>
					<td style="text-align: left;">
						<div style="font-size: 0.8em;">(Ez az automata reklámok kivédésere van, kérlek írd ide hogy hat)</div>
					</td>
				</tr>
				<tr>
					<td valign="top">
						Üzenet:
					</td>
					<td colspan="2">
						<textarea name="message" id="message" type="text" style="width:100%; height: 200px;"></textarea>
					</td>
				</tr>
				<tr valign="center">
					<td></td>
					<td colspan="2">
						<a href="" style="color: black; text-decoration: none;">
						<div id="submitGBook" style="line-height: 50px; text-align: center; font-size: 25px; height: 50px; width: 100%; border: none; background-color: transparent;">
							Küldés
						</div>
						</a>
					</td>
				</tr>
			</tbody></table>
		</form>
            </div>
        </div>

    </div>

</body>
</html>
