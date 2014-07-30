<form method="post"
      enctype="multipart/form-data">
    <label for="album_name">Album neve:</label>
    <input type="text" name="album_name">
    <input type="submit" name="submit" value="Add new album">
</form>

<div id="album-list">
    <ul>
        <?
        if ($_POST) {
            if (isset($_POST['album_name'])) {
                $success = DbManager::Instance()->insertAlbum($_POST['album_name']);
                if ($success) {
                    echo "Album created!";
                }
            }

            // Redirect to this page.
            header("Location: " . $_SERVER['REQUEST_URI']);
            exit();
        }


        $albums = DbManager::Instance()->getAlbums();
        foreach ($albums as $album) {
            echo '<li>';
            echo $album->show();
            echo '</li>';
        }
        ?>
    </ul>
</div>