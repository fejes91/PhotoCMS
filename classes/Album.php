<?

class Album {

    public $id;
    public $name;
    private $photos = array();

    public function __construct($row) {
        $this->id = $row['id'];
        $this->name = $row['name'];
    }

    public function show() {
        return '<a href="?album=' . $this->id . '">' . $this->name . '</a>';
    }

    public function getPhotos() {
        if (count($this->photos) == 0) {
            $this->photos = DbManager::Instance()->getPhotosOfAlbum($this->id);
        }
        return $this->photos;
    }

    public function showPictures() {
        $str = '<div class="album">';
        $str .= "<h2>" . $this->show() . " képei:</h2>";
        
        $photos = $this->getPhotos();
        foreach ($photos as $photo) {
            $str = $str . $photo->showEditor();
        }
        $str .= '</div>';
        return $str;
    }

}

?>