<form method="post"
      enctype="multipart/form-data">
    <label for="album_name">Album name:</label>
    <input type="text" name="album_name">
    <label for="caption">Caption:</label>
    <textarea name="caption"></textarea>
    <br>
    <label for="public">Public:</label>
    <input type="checkbox" name="public" checked>
    <br>
    <input type="submit" name="submit" value="Add new album">
</form>

<div id="album-list">
    <ul>
        <?
        if ($_POST) {
            if (isset($_POST['album_name'])) {
                $success = DbManager::Instance()->insertAlbum($_POST['album_name'], $_POST["caption"], $_POST["public"]);
                if ($success) {
                    echo "Album created!";
                }
            } 
            else {
                foreach ($_POST as $key => $val) {
                    $keys = explode("-", $key);
                    if ($keys[0] && $keys[1]) {
                        if(strcmp($keys[0], "moveUp") == 0){
                            DbManager::Instance()->moveAlbum("up", $keys[1]);
                        }
                        else if(strcmp($keys[0], "moveDown") == 0){
                            DbManager::Instance()->moveAlbum("down", $keys[1]);
                        }
                        else if(strcmp($keys[0], "delete") == 0){
                            DbManager::Instance()->deleteAlbum($keys[1]);
                        }
                    }
                }
            }

            // Redirect to this page.
            header("Location: " . $_SERVER['REQUEST_URI']);
            exit();
        }


        $albums = DbManager::Instance()->getAlbums();
        echo '<form method="POST">';
        foreach ($albums as $album) {
            echo '<li class="album">';
            echo $album->show();
            echo '</li>';
        }
        echo '</form>';
        ?>
    </ul>
</div>