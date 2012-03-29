<?php

require 'common.php';

$con = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow', false, 2);
    if (!$con)
	  {
		die('Could not connect: ' . mysql_error());
	  }
if (! mysql_select_db('roostdb', $con))
  {
    die('Failed to select database');
  }

//$con = roostdb_connect();

$runs_roosts_id = get_param('runs_roosts_id');
$user_id = get_param('user_id');
$score_value = get_param('score_value'); 
//echo $score_value;
$sql = <<<EOF
	select score_id From `user_scores` WHERE score_value = $score_value
EOF;
$result = mysql_query($sql);
$row = mysql_fetch_array($result);
$score_id = $row['score_id'];
//echo $score_id;

$sql = <<<EOF
  UPDATE `runs_roosts-users` SET score_id = $score_id WHERE runs_roosts_id = $runs_roosts_id AND userID = $user_id
EOF;
$result = mysql_query($sql);
echo $sql;
$numRows = mysql_affected_rows();
echo $numRows;
if( $numRows ==0){
  $sql = <<<EOF
	INSERT INTO `runs_roosts-users` SET score_id = $score_id, runs_roosts_id = $runs_roosts_id, userID = $user_id
EOF;
  $result = mysql_query($sql);

echo $sql;
}
mysql_close($con);

?>