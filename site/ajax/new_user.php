<?php 

	require 'common.php';
	
	$con = roostdb_connect();
	
	$username = isset($_POST['username']) ? $_POST['username'] : NULL;

	$hashedPassword = isset($_POST['password']) ? sha1($_POST['password']) : NULL;

	//check for POST valuse
	//if not both are sent along with the request; return 0 for error and a message

	if ($username == NULL or $hashedPassword == NULL) {
		echo "0; username and password are required via(_POST)";
		return;
	}

	//check for username conflict in database

	$usernameCheckSQL = "SELECT username FROM users	WHERE username = '$username'";
		
	$result = mysql_query($usernameCheckSQL);
		
	if (!$result) {
		echo "0;Invalid query: " . mysql_error() . "";
		return;
	}elseif(mysql_num_rows($result)){
		echo "0; username is already used, try another username";
	}else{
		//else enter the username and hashed password in the database

		$newUsernameSQL = "INSERT INTO users(username, password, permission)  values ('$username', '$hashedPassword', '1')";
		
		$result = mysql_query($newUsernameSQL);
		
		if (!$result) {
			echo "0;Invalid query: " . mysql_error();
		}else{
			echo "1";
		}	
		
		mysql_close($con);

	}
?>