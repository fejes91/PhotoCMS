<form method="post"
      enctype="multipart/form-data">
    <label for="file">Feltöltendő fotó:</label>
    <input type="file" name="file" id="file">
    <?
    $albums = DbManager::Instance()->getAlbums();
    if (!isset($_GET['album'])) {
        echo '<select name="album">';
        echo '<option value="-1">Válassz albumot!</option>';
        foreach ($albums as $album) {
            echo '<option value="' . $album->id . '">' . $album->name . '</option>';
        }
        echo '</select>';
    }
    ?>

    <label for="caption">Leírás:</label>
    <textarea name="caption"></textarea>
    <br>
    <input type="submit" name="submit" value="Submit">
</form>



<div id="upload-result">
    <?
    echo handleUploadedFile() . "<br>";
    ?>
</div>
<hr>
<div id="photo-container">
    <?
    if (isset($_GET['album'])) {
        $album = DbManager::Instance()->getAlbum($_GET['album']);
        echo $album->showPictures();
    } else {
        $albums = DbManager::Instance()->getAlbums();
        foreach ($albums as $album) {
            echo $album->showPictures() . "<br>";
        }
    }
    ?>
</div>
<?

function handleUploadedFile() {
    $allowedExts = array("gif", "jpeg", "jpg", "png");
    $temp = explode(".", $_FILES["file"]["name"]);
    $extension = end($temp);

    if (isset($_FILES["file"])) {
        if ((($_FILES["file"]["type"] == "image/gif") || ($_FILES["file"]["type"] == "image/jpeg") || ($_FILES["file"]["type"] == "image/jpg") || ($_FILES["file"]["type"] == "image/pjpeg") || ($_FILES["file"]["type"] == "image/x-png") || ($_FILES["file"]["type"] == "image/png")) && in_array($extension, $allowedExts)) {
            if ($_FILES["file"]["error"] > 0) {
                return "Return Code: " . $_FILES["file"]["error"] . "<br>";
            } else {
                $hashed_file_name = hash("ripemd160", $_FILES["file"]["name"] . time()) . "." . $extension;
                if (file_exists("../img/" . $hashed_file_name)) {
                    return $hashed_file_name . " already exists. ";
                } else {
                    move_uploaded_file($_FILES["file"]["tmp_name"], "../img/" . $hashed_file_name);
                    if (isset($_GET['album'])) {
                        $album = $_GET['album'];
                    } else if (isset($_POST['album'])) {
                        $album = $_POST['album'];
                    }
                    $success = DbManager::Instance()->insertPhoto($hashed_file_name, $album, $_POST['caption']);
                    if ($success) {
                        return "Kép feltöltve";
                    } else {
                        unlink("../img/" . $hashed_file_name);
                        return "Kép feltöltése nem sikerült :(";
                    }
                }
            }
        } else {
            return "Invalid file";
        }
    }
}
?>

</body>
</html>