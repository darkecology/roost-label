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
    $and_clause = <<<EOF
	  AND seq.sequence_id = '$sequence_id'
	  AND u.userID = seq.user_id
EOF;
}
else
{
    $and_clause = <<<EOF
	AND seq.station = '$station'
	AND seq.scan_date = '$year-$month-$day'
	AND u.userID = seq.user_id
EOF;
	
}

$circle_sql = <<<EOF
    SELECT seq.sequence_id, seq.comments, s.scan_id, c.x, c.y, c.r, seq.score, seq.user_id, u.username, seq.valid_flag
    FROM sequences seq, circles2 c, users u, scans2 s
    WHERE seq.sequence_id = c.sequence_id
    AND s.scan_id = c.scan_id
    $and_clause
    ORDER BY seq.sequence_id, s.scan_time
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
    $sequences[$sid]['score'] = $row['score'];
    $sequences[$sid]['valid_flag'] = $row['valid_flag'];
    
    $circle = array();
    $circle['scan_id'] = $row['scan_id'];
    $circle['x'] = $row['x'];
    $circle['y'] = $row['y'];
    $circle['r'] = $row['r'];
    $sequences[$sid]['circles'][] = $circle;
}

mysql_close($con);
print json_encode(array_values($sequences));

?>
