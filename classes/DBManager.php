<?

class DbManager {

    public $con;

    public static function Instance() {
        //static $inst = null;
        if ($inst === null) {
            $inst = new DbManager();
        }
        return $inst;
    }

    private function __construct() {
        include "../db_conn.php";
        $this->con = $con;
        $this->con->query('SET NAMES utf8');
    }

    public function getAlbum($id) {
        $sql = "SELECT * FROM albums WHERE id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "id" => $id)
        );

        return new Album($stmt->fetch());
    }

    public function getPhotosOfAlbum($id) {
        $sql = "SELECT * FROM photos WHERE album_id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "id" => $id)
        );

        $array = array();
        while (($row = $stmt->fetch())) {
            $photo = new Photo($row);
            array_push($array, $photo);
        }

        return $array;
    }
    
    public function getPublicPhotosOfAlbum($id) {
        $sql = "SELECT * FROM photos WHERE album_id = :id AND public = 1";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "id" => $id)
        );

        $array = array();
        while (($row = $stmt->fetch())) {
            $photo = new Photo($row);
            array_push($array, $photo);
        }

        return $array;
    }

    public function getAlbums() {
        $sql = "SELECT * FROM albums order by weight";
        $stmt = $this->con->prepare($sql);
        $stmt->execute();

        $array = array();
        while (($row = $stmt->fetch())) {
            $album = new Album($row);
            array_push($array, $album);
        }
        return $array;
    }
    
    public function getPublicAlbums() {
        $sql = "SELECT * FROM albums WHERE public = 1 order by weight";
        $stmt = $this->con->prepare($sql);
        $stmt->execute();

        $array = array();
        while (($row = $stmt->fetch())) {
            $album = new Album($row);
            array_push($array, $album);
        }
        return $array;
    }

    public function insertPhoto($hfn, $album, $caption, $width, $height) {
        if (strcmp($album, "-1") == 0) {
            return false;
        }
        
        $sql = "INSERT INTO photos (photo_url, album_id, caption, width, height) VALUES (:hashed_file_name, :album, :caption, :width, :height)";

        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "hashed_file_name" => $hfn,
            "album" => $album,
            "caption" => $caption,
            "width" => $width,
            "height" => $height)
        );

        return $stmt->rowCount();
    }
    
    

    public function insertAlbum($name, $caption, $public) {
        if(strcmp($name, "") == 0){
            return 0;
        }
        
        $sql = "INSERT INTO albums (name, caption, public) VALUES (:album_name, :caption, :public)";

        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "album_name" => $name,
            "caption" => $caption,
            "public" => !empty($public) ? 1 : 0)
        );

        return $stmt->rowCount();
    }

    public function deleteAlbum($id) {
        $photos = $this->getPhotosOfAlbum($id);
        foreach ($photos as $photo) {
            $this->deletePhoto($photo->id);
        }

        $sql = "DELETE FROM albums WHERE id = :id";

        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "id" => $id)
        );

        return $stmt->rowCount();
    }
    
    public function moveAlbumUp($id){
        $albums;
    }

    public function updateAlbum($album) {
        error_log("DB Manager saves album...");
        $sql = "UPDATE albums SET name = :name, public = :public, caption = :caption WHERE id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "name" => $album->name,
            "public" => $album->isPublic,
            "caption" => $album->caption,
            "id" => $album->id)
        );
        error_log("DB Manager updated " . $stmt->rowCount() . " rows");
        return $stmt->rowCount();
    }

    public function deletePhoto($id) {
        unlink("../img/" . $this->getPhoto($id)->url);
        unlink("../img/thumbnails/" . $this->getPhoto($id)->url);
        $sql = "DELETE FROM photos WHERE id = :id";

        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "id" => $id)
        );

        return $stmt->rowCount();
    }

    public function deleteStory($id) {
        $sql = "DELETE FROM stories WHERE id = :id";

        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "id" => $id)
        );

        return $stmt->rowCount();
    }

    public function insertStory($title, $text) {
        $sql = "INSERT INTO stories (title) VALUES (:title)";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "title" => $title)
        );

        return $stmt->rowCount();
    }

    public function updatePhoto($photo) {
        $sql = "UPDATE photos SET caption = :caption, album_id = :album, public = :public WHERE id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "caption" => $photo->caption,
            "album" => $photo->album,
            "id" => $photo->id,
            "public" => $photo->isPublic)
        );
        return $stmt->rowCount();
    }
    
    public function updatePhoto2($id, $caption) {
        $sql = "UPDATE photos SET caption = :caption WHERE id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "caption" => $caption,
            "id" => $id
            )
        );
        return $stmt->rowCount();
    }

    public function updateStory($id, $title, $text) {
        $sql = "UPDATE stories SET title = :title, text = :text WHERE id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "title" => $title,
            "text" => $text,
            "id" => $id)
        );

        return $stmt->rowCount();
    }

    public function getStories() {
        $sql = "SELECT * FROM stories";
        $stmt = $this->con->prepare($sql);
        $stmt->execute();

        $array = array();
        while (($row = $stmt->fetch())) {
            $story = new Story($row);
            array_push($array, $story);
        }
        return $array;
    }

    public function getStory($id) {
        $sql = "SELECT * FROM stories WHERE id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "id" => $id)
        );

        return new Story($stmt->fetch());
    }

    public function getPhoto($id) {
        $sql = "SELECT * FROM photos WHERE id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "id" => $id)
        );

        return new Photo($stmt->fetch());
    }

}

?>