<?
	class Story{
		public $id;
		public $title;
		public $text;
		public $created;
		
		public function __construct($row){
			$this->id = $row['id'];
			$this->text = $row['text'];
			$this->title = $row['title'];
			$this->created = $row['created'];
		}
		
		
		public function getText(){
			return $this->text;
		}
		
		public function getTitle(){
			return $this->title;
		}
		
		public function getCreated(){
			return $this->created;
		}
	}

?>