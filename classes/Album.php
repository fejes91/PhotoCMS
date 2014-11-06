<?

class Album {

    public $id;
    public $name;
    public $caption;
    public $isPublic;
    public $weight;
    private $photos = array();

    public function __construct($row) {
        $this->id = $row['id'];
        $this->name = $row['name'];
        $this->caption = $row['caption'];
        $this->isPublic = $row['public'];
        $this->weight = $row['weight'];
    }

    public function show() {
        $str = '<a href="?album=' . $this->id . '">' . $this->name . '</a>';
         
        $str .= '<button type="submit" name="delete-' . $this->id .  '" class="right btn deleteAlbum confirm" confirmText="Biztos törlöd ezt az albumot?" >Delete</button>';
        
        $str .= '<button type="submit" name="moveUp-' . $this->id .  '" class="right btn moveUp">Move up</button>';
        $str .= '<button type="submit" name="moveDown-' . $this->id .  '" class="right btn moveUp">Move down</button>';
                
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
        $photos = $this->getPhotos();
        $str = '';
        if(count($photos) > 0){
            $str .= '<form method="POST" class="photoEditor">';
            $str .= '<div class="album" albumId="' . $this->id . '">';
            $str .= "<h2>Photos of " . $this->show() . "</h2>";
            $str .= '<button class="selectAll">All</button>';
            $str .= '<button class="selectNone">None</button><br>';


            foreach ($photos as $photo) {
                $str = $str . $photo->showEditor();
            }

            $str .= '</div>';

            $str .= '<br>Set selected to: <select name="albumAction">';
                $str .= '<option value="public">public</option>';
                $str .= '<option value="private">private</option>';
                $str .= '<option value="delete">deleted</option>';
            $str .= '</select>';
            $str .= '<br><input type="submit" ></form>';   
        }
        return $str;
    }


}

?>