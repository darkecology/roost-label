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
$conn = roostdb_connect();

// The following statement will insert or replace, as necessary
if (isset($sequence_id))
{
    $sql = <<<EOF
	REPLACE INTO sequences (sequence_id, station, scan_date, comments)
	VALUES ($sequence_id, "$station", "$year-$month-$day", "$roostobj->comments")
EOF;
    $result = mysql_query($sql);
    if (!$result) die('Invalid query: ' . mysql_error());

    $sql = "DELETE FROM circles WHERE sequence_id = $sequence_id";
    $result = mysql_query($sql);
    if (!$result) die('Invalid query: ' . mysql_error());
}
else
{
    $sql = <<<EOF
	INSERT INTO sequences (sequence_id, station, scan_date, comments, user_id)
	VALUES (NULL, "$station", "$year-$month-$day", "$roostobj->comments", "$userID")
EOF;
    $result = mysql_query($sql);
    if (!$result) die('Invalid query: ' . mysql_error());
    $sequence_id = mysql_insert_id();
}

// Add new circles
foreach($roostobj->circles as $circle){
    $sql = <<<EOF
	INSERT INTO circles (sequence_id, scan_time, x, y, r)
	VALUES ($sequence_id, "$circle->scan_time", $circle->x, $circle->y, $circle->r)
EOF;
    $result = mysql_query($sql);
    if (!$result) die('Invalid query: ' . mysql_error());
}

mysql_close($conn);

$msg = "";

$retval = array('sequence_id' => $sequence_id,
		'message' => $msg);

print(json_encode($retval));

?>
