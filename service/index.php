<?
    include "frontEndService.php";
?>

<html>
    <head>
        <title>Fejes Ádám Fotó</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="style.css">
        <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script src="script.js"></script>
    </head>
    <body>
        <script>
            cms.albums = JSON.parse('<?echo getAlbum()?>');
        </script>
        <div id="background">
            
            
        </div>
        <div id="stat"></div>
        <div id="verticalSeparator"></div>
        <div id="horizontalSeparator"><span id="text"></span></div>
        <div id="menuPanel">menu</div>
        <div id="wrapper">
            <div id="albumPanel">
                <ul></ul>
            </div>
            <div id="thumbnailPanel">
                <div id="thumbnails"></div>
            </div>
        </div>

    </body>
</html>
