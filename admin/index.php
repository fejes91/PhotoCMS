<html>
<head>

	<link rel="stylesheet" type="text/css" href="style.css">
</head>


<body>


<div id="wrapper">
	<div id="menu">
		<h1> CMS ADMIN </h1>
		<ul>
			<li><a href="?page=albums">Albums</a></li>
			<li><a href="?page=upload">Upload</a></li>
			<li><a href="?page=stories">Stories</a></li>
		</ul>
	</div>
	<div id="content">
		<?			
			include "../classes/dbManager.php"; 
			include "../classes/album.php";
			include "../classes/photo.php";
			include "../classes/story.php";

			if(isset($_GET['page'])){
				include $_GET['page'] . ".php";
			}
			
			if(isset($_GET['album'])){
				include "upload.php";
			}
			
			if(isset($_GET['story'])){
				include "edit_story.php";
			}
		?>
	</div>
</div>

