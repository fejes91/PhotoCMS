<?
if (isset($_SESSION["rowCount"])) {
    echo '<div class="status">';
    echo "Mentett módosítások: " . $_SESSION['rowCount'];
    unset($_SESSION["rowCount"]);
    echo "</div>";
}
?>

<form method="post"
      enctype="multipart/form-data" id="generalUploader">
    <h2>Upload photo:</h2>
    <input type="file" name="file" id="file">
    <span id="albumSelector">
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
    </span  >
    <label for="caption">Caption:</label>
    <textarea name="caption"></textarea>
    <br>
    <input type="submit" name="submit" value="Upload">
    
    <script>
        $(function(){
            $("#generalUploader").submit(function(){
               if($("#albumSelector option:selected").val() === '-1'){
                   alert("Válassz albumot!");
                   return false;
               } 
            });
        });
    </script>
</form>

<?
if (isset($_GET['album'])) {
    $album = DbManager::Instance()->getAlbum($_GET['album']);
    ?>
    <hr>
    <form method="post"
          enctype="multipart/form-data">
        <h2>Edit album:</h2>
        <label for="name">Album name:</label>
        <input type="text" name="name" id="name" value="<? echo $album->name ?>">
        <label for="caption">Caption:</label>
        <textarea name="caption"><? echo $album->caption ?></textarea>
        <br>
        <label for="public">Public:</label>
        <input type="checkbox" name="public" <? if ($album->isPublic) {
        echo "checked";
    } ?>>
        <br>
        <input type="submit" name="save" value="Save">
        <input type="submit" name="delete" class="confirm" confirmText="Biztos törlöd ezt az albumot?" value="Delete">
    </form>
    <? } ?>

<div id="upload-result">
    <?
    

    if ($_POST) {
        echo handleUploadedFile() . "<br>";
        
        $rowCount = 0;
        if (isset($_POST['delete'])) {
            $rowCount = DbManager::Instance()->deleteAlbum($_GET['album']);
            if ($rowCount) {
                $_SESSION["rowCount"] = $rowCount;
                header("Location: ?page=albumList");
                exit();
            }
        } else if (isset($_POST['save'])) {
            $album = new Album(array(
                "id" => $_GET['album'],
                "name" => $_POST['name'],
                "caption" => $_POST['caption'],
                "public" => !empty($_POST['public']) ? 1 : 0));
            $rowCount = DbManager::Instance()->updateAlbum($album);
        } 
        else if (isset($_POST['albumAction'])) {
            error_log("Edit album's photos...");
            $photos = array();
            foreach ($_POST as $key => $val) {
                if (strcmp($key, 'albumAction') !== 0) {
                    $keys = explode("-", $key);
                    if ($keys[0] && $keys[1]) {
                        if(!$photos[$keys[0]]){
                            $photos[$keys[0]] = array();
                        }
                        $photos[$keys[0]][$keys[1]] = $val;
                    }
                }
            }
            error_log("request parsed: " . print_r($photos, true));

            foreach ($photos as $id => $photo) {
                if ($photo['caption']) {
                    $rowCount += DbManager::Instance()->updatePhotoCaption($id, $photo['caption']);
                }
                
                if($photo['checked_value=']){
                    if(strcmp($_POST['albumAction'], "delete") == 0){
                        DbManager::Instance()->deletePhoto($id);
                    }
                    else if(strcmp($_POST['albumAction'], "public") == 0){
                        DbManager::Instance()->updatePhotoVisiblity($id, 1);
                    }
                    else if(strcmp($_POST['albumAction'], "private") == 0){
                        DbManager::Instance()->updatePhotoVisiblity($id, 0);
                    }
                }
                
                
            }
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
    
    error_log("file upload with extension: " . $extension);

    if (isset($_FILES["file"])) {
        if ((($_FILES["file"]["type"] == "image/gif") || ($_FILES["file"]["type"] == "image/jpeg") || ($_FILES["file"]["type"] == "image/jpg") || ($_FILES["file"]["type"] == "image/pjpeg") || ($_FILES["file"]["type"] == "image/x-png") || ($_FILES["file"]["type"] == "image/png")) && in_array($extension, $allowedExts)) {
            if ($_FILES["file"]["error"] > 0) {
                return "Return Code: " . $_FILES["file"]["error"] . "<br>";
            } else {
                $hashed_file_name = hash("ripemd160", $_FILES["file"]["name"] . time()) . "." . $extension;
                if (file_exists(DbManager::Instance()->getAdminImageHome() . $hashed_file_name)) {
                    return $hashed_file_name . " already exists. ";
                } else {
                    $image = new Imagick($_FILES["file"]["tmp_name"]);
                    $image->setimagecompression(Imagick::COMPRESSION_JPEG);
                    $image->setimagecompressionquality(80);
                    $image->thumbnailimage(1600, 1000, true);
                    $image->writeimage(DbManager::Instance()->getAdminImageHome() . $hashed_file_name);
                    
                    if(strcmp($extension, "gif") == 0){
                        $thumb = new Imagick(DbManager::Instance()->getAdminImageHome() . $hashed_file_name);
                    }
                    else{
                        $thumb = new Imagick(DbManager::Instance()->getAdminImageHome() . $hashed_file_name);
                    }
                    
                    $naturalWidth = $thumb->getimagewidth();
                    $naturalHeight = $thumb->getimageheight();
                    $image->setimagecompression(Imagick::COMPRESSION_JPEG);
                    $image->setimagecompressionquality(80);
                    $thumb->thumbnailimage(400, 400, true);
                    $thumb->writeimage(DbManager::Instance()->getAdminImageHome() . 'thumbnails/' . $hashed_file_name);
                    
                    

                    if (isset($_GET['album'])) {
                        $album = $_GET['album'];
                    } else if (isset($_POST['album'])) {
                        $album = $_POST['album'];
                    }
                    if($album){
                        $rowCount = DbManager::Instance()->insertPhoto($hashed_file_name, $album, $_POST['caption'], $naturalWidth, $naturalHeight);
                        if ($rowCount) {
                            return "Kép feltöltve";
                        } else {
                            unlink(DbManager::Instance()->getAdminImageHome() . $hashed_file_name);
                            return "Kép feltöltése nem sikerült :(";
                        }
                    }
                    else {
                        unlink(DbManager::Instance()->getAdminImageHome() . $hashed_file_name);
                        return "Kép feltöltése nem sikerült :(";
                    }
                    
                }
            }
        } else {
            return "Invalid file";
        }
    }
}






/*
 * 
 * 
 * 
 */






?>

</body>
</html>