<?php

include "../classes/DBManager.php";
include "../classes/Album.php";
include "../classes/Photo.php";
include "../classes/Story.php";
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

?>
