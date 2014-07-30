<?
if ($_POST) {
    if (isset($_POST['save'])) {
        $success = DbManager::Instance()->updateStory($_GET['story'], $_POST['story_title'], $_POST['story_text']);
        if ($success) {
            echo "Story updated!";
        } else {
            echo $success;
        }
    } else if (isset($_POST['delete'])) {
        $success = DbManager::Instance()->deleteStory($_GET['story']);
        if ($success) {
            echo "Story deleted!";
        } else {
            echo $success;
        }
    }

    // Redirect to this page.
    header("Location: " . $_SERVER['REQUEST_URI']);
    exit();
}



$story = DbManager::Instance()->getStory($_GET['story']);
if ($story->id == null || !isset($story->id)) {
    header("Location: ?page=stories");
}
?>

<script src="//tinymce.cachefly.net/4.1/tinymce.min.js"></script>
<script>
    tinymce.init({selector: 'textarea'});
</script>



<form method="post"
      enctype="multipart/form-data">
    <label for="story_title">Cím:</label>
    <input type="text" name="story_title" value="<? echo $story->getTitle(); ?>"><br>
    <label for="story_text">Szöveg:</label>
    <textarea name="story_text"><? echo $story->getText(); ?></textarea><br>
    <input type="submit" name="save" value="Save">
    <input type="submit" name="delete" class="confirm" confirmText="Biztos törlöd ezt a bejegyzést?" value="Delete">
</form>

