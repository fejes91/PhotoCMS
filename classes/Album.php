<?

class Album {

    public $id;
    public $name;
    public $caption;
    public $isPublic;
    private $photos = array();

    public function __construct($row) {
        $this->id = $row['id'];
        $this->name = $row['name'];
        $this->caption = $row['caption'];
        $this->isPublic = $row['public'];
    }

    public function show() {
        $str = '<a href="?album=' . $this->id . '">' . $this->name . '</a>';
        if(!$this->isPublic){
            $str = $str . '<div class="right error"> (Private)</div>';
        }
        return $str;
    }

    public function getPhotos() {
        if (count($this->photos) == 0) {
            $this->photos = DbManager::Instance()->getPhotosOfAlbum($this->id);
        }
        return $this->photos;
    }
    
    public function getPublicPhotos(){
        if (count($this->photos) == 0) {
            $this->photos = DbManager::Instance()->getPublicPhotosOfAlbum($this->id);
        }
        return $this->photos;
    }

    public function showPicturesEditor() {
        $str = '<div class="album">';
        $str .= "<h2>Photos of " . $this->show() . "</h2>";
        
        $photos = $this->getPhotos();
        foreach ($photos as $photo) {
            $str = $str . $photo->showEditor();
        }
        $str .= '</div>';
        return $str;
    }


}

?>