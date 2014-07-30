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

    public function getAlbums() {
        $sql = "SELECT * FROM albums";
        $stmt = $this->con->prepare($sql);
        $stmt->execute();

        $array = array();
        while (($row = $stmt->fetch())) {
            $album = new Album($row);
            array_push($array, $album);
        }
        return $array;
    }

    public function insertPhoto($hfn, $album, $caption) {
        if (strcmp($album, "-1") == 0) {
            return false;
        }

        $sql = "INSERT INTO photos (photo_url, album_id, caption) VALUES (:hashed_file_name, :album, :caption)";

        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "hashed_file_name" => $hfn,
            "album" => $album,
            "caption" => $caption)
        );

        return $stmt->rowCount();
    }

    public function insertAlbum($name) {
        $sql = "INSERT INTO albums (name) VALUES (:album_name)";

        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "album_name" => $name)
        );

        return $stmt->rowCount();
    }

    public function deleteAlbum($id) {
        //TODO
    }

    public function deletePhoto($id) {
        unlink("../img/" . $this->getPhoto($id)->url);
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
        $sql = "UPDATE photos SET caption = :caption, album_id = :album WHERE id = :id";
        $stmt = $this->con->prepare($sql);
        $stmt->execute(array(
            "caption" => $photo->caption,
            "album" => $photo->album,
            "id" => $photo->id)
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