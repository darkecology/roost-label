<?php 

	require 'common.php';
	
	$con = roostdb_connect();
	
	$username = isset($_POST['username']) ? $_POST['username'] : NULL;

	$hashedPassword = isset($_POST['password']) ? sha1($_POST['password']) : NULL;

	//check for POST valuse
	//if not both are sent along with the request; return 0 for error and a message

	if ($username == NULL or $hashedPassword == NULL) {
		echo "0; 0;username and password are required via(_POST)";
		return;
	}


	//check for username conflict in database

	$usernameCheckSQL = "SELECT username FROM users	WHERE username = '$username'";
		
	$result = mysqli_query($con, $usernameCheckSQL);
		
	if (!$result) {
		echo "0; 2;Invalid query: " . mysqli_error($con) . "";
		return;
	}elseif(mysqli_num_rows($result)){
		echo "0; 1; username is already used, try another username";
	}else{
		//else enter the username and hashed password in the database

		$newUsernameSQL = "INSERT INTO users(username, password, permission)  values ('$username', '$hashedPassword', '1')";
		
		$result = mysqli_query($con, $newUsernameSQL);
		
		if (!$result) {
			echo "0;2;Invalid query: " . mysqli_error($con);
		}else{
			$userID = mysqli_insert_id($con);
			echo "1; userID=$userID";
		}	
		
		mysqli_close($con);

	}
?>