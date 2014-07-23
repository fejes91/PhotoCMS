<?
	class Photo{
		public $id;
		public $url;
		public $album;
		public $caption;
	
		public function __construct($row){
			$this->id = $row['id'];
			$this->url = $row['photo_url'];
			$this->album = $row['album_id'];
			$this->caption = $row['caption'];
		}
		
		public function show(){
			$str = '<div class="photo">';	
				$str .= '<img src="../img/' . $this->url . '">';
				$str .= '<div class="controls">';
					$str .= $this->id . " - " . $this->caption;
				$str .= '</div>';
			$str .= '</div>';
			
			return $str;
		}
	
	}

?>