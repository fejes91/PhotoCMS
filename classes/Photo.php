<?

class Photo {

    public $id;
    public $url;
    public $album;
    public $caption;

    public function __construct($row) {
        $this->id = $row['id'];
        $this->url = $row['photo_url'];
        $this->album = $row['album_id'];
        $this->caption = $row['caption'];
    }

    public function show() {
        return '<img src="../img/' . $this->url . '">';
    }

    public function showEditor() {
        $str = '<div class="photo">';
        $str .= '<img src="../img/' . $this->url . '?rnd=' . rand() . '">';
        $str .= '<div class="controls">';

        $caption = $this->caption;
        if (strlen($caption) > 20) {
            $caption = substr($caption, 0, 20) . "...";
        }
        $str .= $this->id . " - " . $caption;

        $str .= '<br><a href="?photo=' . $this->id . '">Szerk</a>';
        $str .= '</div>';
        $str .= '</div>';

        return $str;
    }

    public function getCaption() {
        return $this->caption;
    }

}

?>