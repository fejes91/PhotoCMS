<?
if (isset($_SESSION["rowCount"])) {
    echo '<div class="status">';
    echo "Mentett módosítások: " . $_SESSION['rowCount'];
    unset($_SESSION["rowCount"]);
    echo "</div>";
}
?>

<form method="post"
      enctype="multipart/form-data">
    <input type="file" name="file" id="file">
    <?
    if (!isset($_GET['album'])) {
        $albums = DbManager::Instance()->getAlbums();
        echo '<select name="album">';
        echo '<option value="-1">Choose album!</option>';
        foreach ($albums as $album) {
            echo '<option value="' . $album->id . '">' . $album->name . '</option>';
        }
        echo '</select>';
    }
    ?>

    <label for="caption">Caption:</label>
    <textarea name="caption"></textarea>
    <br>
    <input type="submit" name="submit" value="Upload">
</form>

<? if (isset($_GET['album'])) { 
    $album = DbManager::Instance()->getAlbum($_GET['album']);
    ?>
    <hr>
    <form method="post"
          enctype="multipart/form-data">
        <label for="name">Album name:</label>
        <input type="text" name="name" id="name" value="<?echo $album->name?>">
        <label for="caption">Caption:</label>
        <textarea name="caption"><?echo $album->caption?></textarea>
        <br>
        <label for="public">Public:</label>
        <input type="checkbox" name="public" <? if($album->isPublic){echo "checked";} ?>>
        <br>
        <input type="submit" name="save" value="Save">
        <input type="submit" name="delete" class="confirm" confirmText="Biztos törlöd ezt az albumot?" value="Delete">
    </form>
<? } ?>

<div id="upload-result">
    <?
    echo handleUploadedFile() . "<br>";
    
    if ($_POST) {
        $rowCount;
        if (isset($_POST['delete'])) {
            $rowCount = DbManager::Instance()->deleteAlbum($_GET['album']);
            if ($rowCount) {
                $_SESSION["rowCount"] = $rowCount;
                header("Location: ?page=albumList");
                exit();
            }
        }
        else if (isset($_POST['save'])) {
            $album = new Album(array(
                "id" => $_GET['album'],
                "name" => $_POST['name'],
                "caption" => $_POST['caption'],
                "public" => !empty($_POST['public']) ? 1 : 0));
            $rowCount = DbManager::Instance()->updateAlbum($album);
        }
        $_SESSION["rowCount"] = $rowCount;
        header("Location: " . $_SERVER['REQUEST_URI']);
        exit();
    }
    ?>
</div>
<hr>
<div id="photo-container">
    <?
    if (isset($_GET['album'])) {
        
        echo $album->showPicturesEditor();
    } else {
        $albums = DbManager::Instance()->getAlbums();
        foreach ($albums as $album) {
            echo $album->showPicturesEditor() . "<br>";
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
                    $rowCount = DbManager::Instance()->insertPhoto($hashed_file_name, $album, $_POST['caption']);
                    if ($rowCount) {
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