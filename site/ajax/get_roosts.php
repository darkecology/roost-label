<?php

require 'common.php';

$station = get_param('station');
$year    = get_param('year');
$month   = get_param('month');
$day     = get_param('day');
$sequence_id = get_param('sequence_id');

if (! ( (isset($station) && isset($year) && isset($month) && isset($day)) || isset($sequence_id) ))
{
    die("Either (station, year, month, day) or (sequence_id) are required");
}

$con = roostdb_connect();

if (isset($sequence_id))
{
    $and_clause = "AND s.sequence_id = $sequence_id\n";
}
else
{
    $and_clause = <<<EOF
	AND s.station = '$station'
	AND s.scan_date = '$year-$month-$day'
	AND u.userID = s.user_id
EOF;
	
}

$circle_sql = <<<EOF
    SELECT s.sequence_id, s.comments, c.scan_time, c.x, c.y, c.r, s.user_id, u.username
    FROM sequences s, circles c, users u
    WHERE s.sequence_id = c.sequence_id
    $and_clause
    ORDER BY s.sequence_id, c.scan_time
EOF;

$sequences = array();

$result = mysql_query($circle_sql);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}

//$username_sql = "Select username From users where userID = '$row['user_id']'";


while($row = mysql_fetch_array($result))
{
    $sid = $row['sequence_id'];
    $sequences[$sid]['sequence_id'] = $sid;
    $sequences[$sid]['comments'] = $row['comments'];
    $sequences[$sid]['user_id'] = $row['user_id'];
	$sequences[$sid]['username'] = $row['username'];

    $circle = array();
    $circle['scan_time'] = $row['scan_time'];
    $circle['x'] = $row['x'];
    $circle['y'] = $row['y'];
    $circle['r'] = $row['r'];
    $sequences[$sid]['circles'][] = $circle;
}

mysql_close($con);
print json_encode(array_values($sequences));

?>
