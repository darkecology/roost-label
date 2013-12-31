<?php

require 'common.php';

$con = roostdb_connect();

$runs_roosts_id = get_param('runs_roosts_id');
$user_id = get_param('user_id');
$score_value = get_param('score_value'); 
//echo $score_value;
$sql = <<<EOF
	select score_id From `user_scores` WHERE score_value = $score_value
EOF;
$result = mysqli_query($con, $sql);
$row = mysqli_fetch_array($result);
$score_id = $row['score_id'];
//echo $score_id;


// BROKEN? THE FOLLOWING QUERY WILL NOT WORK IF ROW DOES NOT EXIST...

$sql = <<<EOF
  UPDATE `runs_roosts-users` SET score_id = $score_id WHERE runs_roosts_id = $runs_roosts_id AND userID = $user_id
EOF;
$result = mysqli_query($con, $sql);

mysqli_close($con);

?>