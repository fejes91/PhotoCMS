<?php 
    session_start();
    header('Content-type: text/html; charset=utf-8');
    
    
?>
<html>
    <head>
        <title>Fejes Ádám fotó</title>
        <link rel="stylesheet" type="text/css" href="style.css">
        <script src="jquery-2.1.1.min.js"></script>
        <script src="script.js"></script>
    </head>
    <body>
        <div id="wrapper">
            <div id="menu">
                <h1> CMS ADMIN </h1>
                <ul>
                    <li><a href="?page=albumList">Albums</a></li>
                    <li><a href="?page=editAlbum">Upload</a></li>
                    <li><a href="?page=guestbook">Guestbook</a></li>
                    <li><a href="?page=stories">Stories</a></li>
                </ul>
            </div>
            <div id="content">
                <?
                include "../classes/DBManager.php";
                include "../classes/Album.php";
                include "../classes/Photo.php";
                include "../classes/Story.php";
                include "../classes/GuestBookEntry.php";

                function parseRequestHeaders() {
                    $headers = array();
                    foreach ($_SERVER as $key => $value) {
                        if (substr($key, 0, 5) <> 'HTTP_') {
                            continue;
                        }
                        $header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
                        $headers[$header] = $value;
                    }
                    return $headers;
                }

                if (isset($_GET['page'])) {
                    include $_GET['page'] . ".php";
                } else if (isset($_GET['album'])) {
                    include "editAlbum.php";
                } else if (isset($_GET['story'])) {
                    include "editStory.php";
                } else if (isset($_GET['photo'])) {
                    include "editPhoto.php";
                }
                
                //phpinfo(-1);
                ?>
            </div>
        </div>
    </body>
</html>
