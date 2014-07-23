<form method="post"
enctype="multipart/form-data">
Cím: <input type="text" name="story_title"><br>
Szöveg: <textarea name="story_text"></textarea><br>
<input type="submit" name="submit" value="Add new story">
</form>

<?
	if(isset($_POST['story_title']) && isset($_POST['story_text'])){
		$success = DbManager::Instance()->insertStory($_POST['story_title'], $_POST['story_text']);
		if($success){
			echo "Story created!";
		}
	}


	$stories = DbManager::Instance()->getStories();
	foreach($stories as $story){
		echo '<li>';
		echo '<a href="?story=' . $story->id . '">' . $story->getTitle() . "</a>: " . $story->getText();
		echo '</li>';
	}

?>