<?php

require 'common.php';

$con = roostdb_connect();

$runs = array();

$run_id = get_param('run_id');
$user_id = get_param('user_id');
$thres = get_param('thres');

$runs_sql = <<<EOF
  SELECT rr.runs_roosts_id, rr.scan_id, rr.x, rr.y, rr.r, s.station, year(s.scan_date) as year,month(s.scan_date) as month ,day(s.scan_date) as day FROM runs_roosts rr, `runs` r, scans2 s
    WHERE rr.run_id = r.run_id
    AND rr.scan_id = s.scan_id
    AND rr.run_id = $run_id
    AND rr.score > $thres
  ORDER BY station, year, month, day, scan_id
EOF;

$result = mysql_query($runs_sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

while($row = mysql_fetch_array($result))
{
    $station = $row['station'];
    $year = $row['year'];
    $month = $row['month'];
    $day = $row['day'];
    $stationDate = $station . $year . $month . $day;
	//echo $stationDate;
	$evalSet[$stationDate]['station'] = $station;
	$evalSet[$stationDate]['year'] = $year;
	$evalSet[$stationDate]['month'] = $month;
	$evalSet[$stationDate]['day'] = $day;
	$seq = array();
	$seq['runs_roosts_id'] = $row['runs_roosts_id'];
	$seq['score_value'] = 0;
	$circle = array();
	$circle['scan_id'] = $row['scan_id'];
	$circle['x'] = $row['x'];
	$circle['y'] = $row['y'];
    $circle['r'] = $row['r'];
	$seq['circles'][] = $circle;
    $evalSet[$stationDate]['sequences'][] = $seq;

	
}


$runs_sql = <<<EOF
  SELECT rr.runs_roosts_id, rr.scan_id, rr.x, rr.y, rr.r, s.station, year(s.scan_date) as year,month(s.scan_date) as month ,day(s.scan_date) as day, us.score_value FROM runs_roosts rr, `runs` r, scans2 s, `runs_roosts-users` rru, user_scores us
    WHERE rr.run_id = r.run_id
    AND rr.runs_roosts_id = rru.runs_roosts_id
    AND rr.scan_id = s.scan_id
    AND us.score_id = rru.score_id
    AND rru.userID = $user_id
    AND rr.run_id = $run_id
    AND rr.score > $thres
  ORDER BY station, year, month, day, scan_id
EOF;

$result = mysql_query($runs_sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

while($row = mysql_fetch_array($result))
{
    $station = $row['station'];
    $year = $row['year'];
    $month = $row['month'];
    $day = $row['day'];
    $stationDate = $station . $year . $month . $day;
	//echo $stationDate;
	//$evalSet[$stationDate]['station'] = $station;
	//$evalSet[$stationDate]['year'] = $year;
	//$evalSet[$stationDate]['month'] = $month;
	//$evalSet[$stationDate]['day'] = $day;
	$seq = array();
	$seq['runs_roosts_id'] = $row['runs_roosts_id'];
	$seq['score_value'] = 0;
	$circle = array();
	$circle['scan_id'] = $row['scan_id'];
	$circle['x'] = $row['x'];
	$circle['y'] = $row['y'];
    $circle['r'] = $row['r'];
	$seq['circles'][] = $circle;
    //$evalSet[$stationDate]['sequences'][] = $seq;
	$tmp_arr = array_searchRecursive($seq, $evalSet[$stationDate]);
	$evalSet[$stationDate][$tmp_arr[0]][$tmp_arr[1]]['score_value'] = $row['score_value'];
}





//echo $evalSet[$stationDate];
//var_dump($seq);
//print_r(array_searchRecursive($seq, $evalSet[$stationDate]));
//echo "hello";
function array_searchRecursive( $needle, $haystack, $strict=false, $path=array() ) 
{ 
  if( !is_array($haystack) ) { 
	return false; 
  } 

  foreach( $haystack as $key => $val ) { 
	if( is_array($val) && $subPath = array_searchRecursive($needle, $val, $strict, $path) ) { 
	  $path = array_merge($path, array($key), $subPath); 
	  return $path; 
	} elseif( (!$strict && $val == $needle) || ($strict && $val === $needle) ) { 
	  $path[] = $key; 
	  return $path; 
	} 
  } 
  return false; 
} 

/*
    $rid = $row['runs_roosts_id'];
    $runs[$rid]['runs_roosts_id'] = $rid;
    $runs[$rid]['scan_id'] = $row['scan_id'];
    $runs[$rid]['x'] = $row['x'];
    $runs[$rid]['y'] = $row['y'];
    $runs[$rid]['r'] = $row['r'];
}




while($row = mysql_fetch_array($result))
  {
    $sid = $row['sequence_id'];
    $sequences[$sid]['sequence_id'] = $sid;
    $sequences[$sid]['comments'] = $row['comments'];
    $sequences[$sid]['user_id'] = $row['user_id'];
    $sequences[$sid]['username'] = $row['username'];
    $sequences[$sid]['score'] = $row['score'];
    
    $circle = array();
    $circle['scan_id'] = $row['scan_id'];
    $circle['x'] = $row['x'];
    $circle['y'] = $row['y'];
    $circle['r'] = $row['r'];

  }















$scores_sql = <<<EOF
    SELECT ru.runs_roosts_id, s.score_value, u.username
    FROM runs_roosts r, `runs_roosts-users` ru, scores s, users u
    WHERE r.run_id = $run_id
    AND ru.runs_roosts_id = r.runs_roosts_id
    AND ru.score_id = s.score_id
    AND ru.userID = u.userID
    ORDER BY r.run_id
EOF;

$result = mysql_query($scores_sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

while($row = mysql_fetch_array($result))
{
    $rid = $row['runs_roosts_id'];
    $runs[$rid]['score_value'] = $row['score_value'];
    $runs[$rid]['username'] = $row['username'];
}
*/
print json_encode(array_values($evalSet));

mysql_close($con);
?>