<?php

include "../classes/DBManager.php";
include "../classes/Album.php";
include "../classes/Photo.php";
include "../classes/Story.php";

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
                "photos" => $album->getPublicPhotos()
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

?>
