<?php

include "../classes/DBManager.php";
include "../classes/Album.php";
include "../classes/Photo.php";
include "../classes/Captcha.php";
include "../classes/GuestBookEntry.php";

if (isset($_GET['type']) && !empty($_GET['type'])) {
    $type = $_GET['type'];

    switch ($type) {
        case "album" : echo getAlbum($_GET['id']);
    }
}

function getAlbum($id) {
    $albums = array();
    if (!empty($id)) {
        $a = DbManager::Instance()->getAlbum($id);
        if ($a->isPublic) {
            array_push($albums, $a);
        }
    } else {
        $albums = DbManager::Instance()->getPublicAlbums();
    }

    $responseArray = array();
    if (!empty($albums)) {
        foreach ($albums as $album) {
            $obj = array(
                "id" => $album->id,
                "name" => $album->name,
                "photos" => $album->getPublicPhotos(),
                "weight" => $album->weight,
                "caption" => $album->caption
            );
            array_push($responseArray, $obj);
        }
    } else {
        $obj = array(
            "error" => "Private album"
        );
        return json_encode($obj);
    }
    return json_encode($responseArray);
}

function getGuestbook(){
    $entries = DbManager::Instance()->getAllowedGuestbookEntries();
    //$entries = DbManager::Instance()->getGuestbookEntries();
    
    $responseArray = array();
    foreach ($entries as $entry) {
        $obj = array(
            "id" => $entry->id,
            "date" => $entry->date,
            "author" => $entry->author,
            "text" => $entry->text
        );
        array_push($responseArray, $obj);
    }
    return json_encode($responseArray);
}

function getCaptcha(){
    $q = array(
      new Captcha("Mennyi egy meg egy?", "2"),
      new Captcha("Mennyi egy meg három?", "4"),
      new Captcha("Mennyi három meg három?", "6")
    );
    
    $captcha = $q[rand(0, count($q) - 1)];
    $obj = array(
            "question" => $captcha->getQuestion(),
            "hash" => $captcha->getHashedSolution()
        );
    return json_encode($obj);
}

?>
