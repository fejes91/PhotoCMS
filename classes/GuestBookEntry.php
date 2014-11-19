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
    
    public function showAdmin(){
        $str = '<div class="entry" entryId="' . $this->id . '">' . $this->text;
            $str .= '<div class="controls">';
                $str .= '<span>' . $this->author . '</span><span>' . $this->mail . '</span><span>' . $this->date . '</span>';
                $str .= '<input type="radio" id="allow" name="' . $this->id . '" value="allow"><label for="allow">Allow</label>';
                $str .= '<input type="radio" id="deny" name="' . $this->id . '" value="deny"><label for="deny">Deny</label>';
            $str .= '</div>';
        $str .= '</div>';
        
        return $str;
    }
    
}

?>
