<?
    include "frontEndService.php";
?>

<html>
    <head>
        <title>Fejes Ádám Fotó</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="style.css">
        <link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'>
        <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script src="script.js"></script>
    </head>
    <body>
        <script>
            cms.albums = JSON.parse('<?echo getAlbum()?>');
        </script>
        <!--div id="background"></div-->
        <div id="stat"></div>
        <div id="verticalSeparator"></div>
        <!--div id="horizontalSeparator"><span id="text"></span></div-->
        <div id="menuPanel">
            <img src="../img/build/camera.png">
            <img src="../img/build/me.png">
            <img src="../img/build/book.png">
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
            <div id="thumbnails"></div>
        </div>

    </body>
</html>
