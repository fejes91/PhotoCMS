<?php

class Captcha {
    private $question;
    private $solution;
    
    public function __construct($q, $s) {
        $this->question = $q;
        $this->solution = $s;
    }
    
    public function getHashedSolution(){
        return hash('ripemd160', $this->solution);
    }
    
    public function getQuestion(){
        return $this->question;
    }
    
    public static function checkSolution($input, $hash){
        return hash('ripemd160', $input) == $hash;
    }
}

?>
