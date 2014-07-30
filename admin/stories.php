<form method="post"
      enctype="multipart/form-data">
    Cím: <input type="text" name="story_title"><br>
    <input type="submit" name="submit" value="Add new story">
</form>

<?
if (isset($_POST['story_title'])) {
    $success = DbManager::Instance()->insertStory($_POST['story_title']);
    if ($success) {
        echo "Story created!";
    }
} else {
    echo 'Add title for the story!';
}


$stories = DbManager::Instance()->getStories();
foreach ($stories as $story) {
    echo '<li class="story">';
    echo '<a href="?story=' . $story->id . '">' . $story->getTitle() . "</a>: " . $story->getText();
    echo '</li>';
}
?>