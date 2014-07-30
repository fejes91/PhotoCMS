<html>
    <head>
        <title>Fejes Ádám fotó CMS</title>
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
                    <li><a href="?page=manageAlbum">Upload</a></li>
                    <li><a href="?page=stories">Stories</a></li>
                </ul>
            </div>
            <div id="content">
                <?
                include "../classes/DBManager.php";
                include "../classes/Album.php";
                include "../classes/Photo.php";
                include "../classes/Story.php";

                if (isset($_GET['page'])) {
                    include $_GET['page'] . ".php";
                } else if (isset($_GET['album'])) {
                    include "manageAlbum.php";
                } else if (isset($_GET['story'])) {
                    include "editStory.php";
                } else if (isset($_GET['photo'])) {
                    include "editPhoto.php";
                }
                ?>
            </div>
        </div>
    </body>
</html>
