<?php 

	require 'common.php';
	
	$con = roostdb_connect();
	
	$username = isset($_POST['username']) ? $_POST['username'] : NULL;

	$hashedPassword = isset($_POST['password']) ? sha1($_POST['password']) : NULL;

	$userID = isset($_POST['userID']) ? $_POST['userID'] : NULL;

	//check for POST valuse
	//if not both are sent along with the request; return 0 for error and a message

	if ($username == NULL && $hashedPassword == NULL && $userID != NULL) {

		if($username == NULL || $hashedPassword == NULL || $_POST['password']){
			echo "0;5;login has to provide both username and password";
			return;
		}

		$userIDSQL = "SELECT username, permission FROM users WHERE userID = '$userID'";

		$result = mysql_query($userIDSQL);
		if (!$result) {		
			echo "0; 2; Invalid query: " . mysql_error() . "";
			return;
		}elseif(!mysql_num_rows($result)){
			echo "0; 3; userID does not exist in the database";
			return;
		}else{
		
			while($row = mysql_fetch_row($result)) {
		
    		    		
				$username = $row[0];
		
				$permission = $row[1];

			}
		
			echo "1; username=$username; permission=$permission";
		}
		return;
	}elseif ($username != NULL && $hashedPassword != NULL) {

		$userLoginSQL = "SELECT userID, permission FROM users WHERE username = '$username' AND password = '$hashedPassword'";
		$result = mysql_query($userLoginSQL);
		if (!$result) {		
			echo "0;2;Invalid query: " . mysql_error() . "";
			return;
		}elseif(!mysql_num_rows($result)){
			echo "0;4; username and/or password do not match";
			return;
		}else{
		
			while($row = mysql_fetch_row($result)) {

    		
			$userID = $row[0];
			$permission = $row[1];

			}
		echo "1; userID=$userID; permission=$permission";
		}

	}
	
	mysql_close($con);
/*
*/
?>