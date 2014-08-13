<form method="post"
      enctype="multipart/form-data">
    Title: <input type="text" name="story_title"><br>
    <input type="submit" name="submit" value="Add new story">
</form>

<?
if ($_POST) {
    if (isset($_POST['story_title'])) {
        $success = DbManager::Instance()->insertStory($_POST['story_title']);
        if ($success) {
            echo "Story created!";
        }
    } else {
        echo 'Add title for the story!';
    }
    
    // Redirect to this page.
    header("Location: " . $_SERVER['REQUEST_URI']);
    exit();
}



$stories = DbManager::Instance()->getStories();
foreach ($stories as $story) {
    echo '<li class="story">';
    echo '<a href="?story=' . $story->id . '">' . $story->getTitle() . "</a>: " . $story->getText();
    echo '</li>';
}
?>