<?php

require 'common.php';

$station = get_param('station');
$year    = get_param('year');
$month   = get_param('month');
$day     = get_param('day');

if (! (isset($station) && isset($year) && isset($month) && isset($day)))
{
    die("(station, year, month, day) are required");
}

$request = trim(file_get_contents('php://input'));

$roostobj = json_decode($request);

$userID = $roostobj->userID;

$sequence_id = $roostobj->sequence_id;
$con = roostdb_connect();

if(!isset($roostobj->score))
{
    $roostobj->score = 0;
}
// The following statement will insert or replace, as necessary
if (isset($sequence_id))
{
    $sql = <<<EOF
	REPLACE INTO sequences (sequence_id, station, scan_date, comments, user_id, score, valid_flag)
	VALUES ($sequence_id, "$station", "$year-$month-$day", "$roostobj->comments", "$userID", "$roostobj->score", "$roostobj->valid_flag")
EOF;
    $result = mysqli_query($con, $sql);
    if (!$result) die('Invalid query: ' . mysqli_error($con));

    $sql = "DELETE FROM circles2 WHERE sequence_id = $sequence_id";
    $result = mysqli_query($con, $sql);
    if (!$result) die('Invalid query: ' . mysqli_error($con));
}
else
{
    $sql = <<<EOF
	INSERT INTO sequences (sequence_id, station, scan_date, comments, user_id, score, valid_flag)
	VALUES (NULL, "$station", "$year-$month-$day", "$roostobj->comments", "$userID", "$roostobj->score", "$roostobj->valid_flag")
EOF;
    $result = mysqli_query($con, $sql);
    if (!$result) die('Invalid query: ' . mysqli_error($con));
    $sequence_id = mysqli_insert_id($con);
}

// Add new circles
foreach($roostobj->circles as $circle){
    $sql = <<<EOF
	INSERT INTO circles2 (sequence_id, scan_id, x, y, r)
	VALUES ($sequence_id, "$circle->scan_id", $circle->x, $circle->y, $circle->r)
EOF;
    $result = mysqli_query($con, $sql);
    if (!$result) die('Invalid query: ' . mysqli_error($con));
}

mysqli_close($con);

$msg = "";

$retval = array('sequence_id' => $sequence_id,
		'message' => $msg);

print(json_encode($retval));

?>
