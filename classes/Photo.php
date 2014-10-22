<?

class Photo {

    public $id;
    public $url;
    public $album;
    public $caption;
    public $isPublic;
    public $naturalWidth;
    public $naturalHeight;

    public function __construct($row) {
        $this->id = $row['id'];
        $this->url = $row['photo_url'];
        $this->album = $row['album_id'];
        $this->caption = $row['caption'];
        $this->isPublic = $row['public'];
        $this->naturalWidth = $row['width'];
        $this->naturalHeight = $row['height'];
    }

    public function show() {
        return '<img src="../img/' . $this->url . '">';
    }

    public function showEditor() {
        $str = '<div class="photo" photoId="' . $this->id . '">';
            $str .= '<img src="../img/thumbnails/' . $this->url . '?rnd=' . rand() . '">';
            $str .= '<div class="controls">';
                $caption = $this->caption;
                if (strlen($caption) > 20) {
                    $caption = substr($caption, 0, 20) . "...";
                }
                $str .= "ID: " . $this->id;
                $str .= '<br><input type="text" value="' . $caption . '" name="' . $this->id . '-caption">';
                
                $str .= '<br><a href="?photo=' . $this->id . '">Edit</a>';
                $str .= '<input style="float: right;" type="checkbox" name="' . $this->id . '-checked value="' . $this->id . '">';
                
                if(!$this->isPublic){
                    $str .= '<div class="right error"> (Private)</div>';
                }
            $str .= '</div>';
        $str .= '</div>';

        return $str;
    }

    public function getCaption() {
        return $this->caption;
    }

}

?>