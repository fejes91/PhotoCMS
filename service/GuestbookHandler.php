<?php
include "../classes/DBManager.php";
include "../classes/GuestBookEntry.php";

if($_POST['name'] == null|| $_POST['mail'] == null || $_POST['message'] == null){
    echo "MISSING DATA";
}
else if (!filter_var($_POST['mail'], FILTER_VALIDATE_EMAIL)) {
  echo "INVALID MAIL"; 
}
elseif(($_POST["captcha"] != "hat" && $_POST["captcha"] != "Hat" && $_POST["captcha"] != "6")){
    echo 'CAPTHCA';
}
else{
    $ip = $_SERVER['REMOTE_ADDR'];
    $lastEntry = DbManager::Instance()->getGuestbookEntryForIp($ip);
    $troll = (strtotime($lastEntry->date . "+15 minutes") > strtotime("now"));
    
    if($troll){
        echo 'TROLL';
    }
    else{
        $success = DbManager::Instance()->insertGuestbookEntry($_POST['name'], $ip, $_POST['mail'], $_POST['message']);
        if($success > 0){
            echo "SUCCESS";
        }
        else{
            echo "DB ERROR";
        }
    }
    
}
?>
