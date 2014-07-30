<div id="edit-photo">
    <?
    if (isset($_POST['save'])) {
        handleUpdateFile(DbManager::Instance()->getPhoto($_GET['photo'])->url);
        $photo = new Photo(array(
            "id" => $_GET['photo'],
            "caption" => $_POST['caption'],
            "album_id" => $_POST['album']));
        $success = DbManager::Instance()->updatePhoto($photo);
        if ($success) {
            echo "Photo updated!";
        }
    } else if (isset($_POST['delete'])) {
        $success = DbManager::Instance()->deletePhoto($_GET['photo']);
        if ($success) {
            echo "Photo deleted!";
        }
    }
    $photo = DbManager::Instance()->getPhoto($_GET['photo']);

    echo '<a href="?album=' . $photo->album . '">Vissza az albumba</a>';
    ?>

    <form method="post"
          enctype="multipart/form-data">
        <label for="caption">Leírás:</label>
        <textarea name="caption" ><? echo $photo->getCaption(); ?></textarea><br>
        <label for="story_text">Szöveg:</label>
        <input type="file" name="file" id="file">
        <?
        $albums = DbManager::Instance()->getAlbums();
        echo '<select name="album">';
        foreach ($albums as $album) {
            $str = '<option value="' . $album->id . '"';
            if (strcmp($photo->album, $album->id) == 0) {
                $str .= ' selected="selected"';
            }
            $str .= '>' . $album->name . '</option>';

            echo $str;
        }
        echo '</select>';
        ?>
        <br>
        <input type="submit" name="save" value="Save">
        <input type="submit" name="delete" value="Delete">
    </form>


<?
if ($photo->id == null || !isset($photo->id)) {
    header("Location: ?album=" . $_POST['album']);
} else {
    echo $photo->show() . "<br>";
}
?>

</div>

<?

function handleUpdateFile($old) {
    $allowedExts = array("gif", "jpeg", "jpg", "png");
    $temp = explode(".", $_FILES["file"]["name"]);
    $extension = end($temp);

    if (isset($_FILES["file"])) {
        if ((($_FILES["file"]["type"] == "image/gif") || ($_FILES["file"]["type"] == "image/jpeg") || ($_FILES["file"]["type"] == "image/jpg") || ($_FILES["file"]["type"] == "image/pjpeg") || ($_FILES["file"]["type"] == "image/x-png") || ($_FILES["file"]["type"] == "image/png")) && in_array($extension, $allowedExts)) {
            if ($_FILES["file"]["error"] > 0) {
                return 0;
            } else {
                move_uploaded_file($_FILES["file"]["tmp_name"], "../img/" . $old);
                return 1;
            }
        } else {
            return 0;
        }
    }
}
?>