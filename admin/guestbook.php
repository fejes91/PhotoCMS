<h2>Guestbook admin</h2>
<div id="guestbook">
    <form method="POST">
        <ul>
            <?php
            $unreadEntries = DbManager::Instance()->getUnreadGuestbookEntries();

            foreach ($unreadEntries as $entry) {
                echo '<li>';
                echo $entry->showAdmin();
                echo '</li>';
            }
            ?>
        </ul>
        <input type="submit">
    </form>
</div>
<?php
if ($_POST) {
    $rowCount = 0;
    foreach($_POST as $key => $value){
        $rowCount += DbManager::Instance()->updateGuestbookEntry($key, $value);
    }
    
    $_SESSION["rowCount"] = $rowCount;
    header("Location: " . $_SERVER['REQUEST_URI']);
    exit();
}
?>
