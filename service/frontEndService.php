<?php

include "../classes/DBManager.php";
include "../classes/Album.php";
include "../classes/Photo.php";
include "../classes/Story.php";

if (isset($_GET['type']) && !empty($_GET['type'])) {
    $type = $_GET['type'];
    
    switch($type){
        case "album" : echo getAlbum($_GET['id']);
    }
    
    
}


function getAlbum($id){
    $albums = array();
    if(!empty($id)){
        $a = DbManager::Instance()->getAlbum($id);
        array_push($albums, $a);
    }
    else{
        $albums = DbManager::Instance()->getAlbums();
    }
    
    $responseArray = array();
    foreach ($albums as $album) {
        $obj = array(
            "albumId" => $album->id,
            "albumName" => $album->name,
            "photos" => $album->getPhotos()
        );
        array_push($responseArray, $obj);
    }
    return json_encode($responseArray);
}
?>
