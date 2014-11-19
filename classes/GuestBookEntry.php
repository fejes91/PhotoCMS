<?php

class GuestBookEntry {
    public $id;
    public $date;
    public $author;
    public $ip;
    public $mail;
    public $text;
    public $status;
    
    public function __construct($row) {
        $this->id = $row['id'];
        $this->date = $row['date'];
        $this->author = $row['author'];
        $this->ip = $row['ip'];
        $this->mail = $row['mail'];
        $this->text = $row['text'];
        $this->status = $row['status'];
    }
    
}

?>
