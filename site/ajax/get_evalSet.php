<?php

require 'common.php';
$evalTestId = get_param('evalTestId', "");
/*
$station = get_param('station', "");
$year    = get_param('year', "");
$month   = get_param('month', "");
$month   = get_param('month', "");

$con = roostdb_connect();
*/
//$inventory = array('evalTestId' => array("" => "") );

/*------------------------------------------------------------
 * stations
 *------------------------------------------------------------*/
/*
$sql =<<<EOF
    SELECT g.group_name, i.station, st.city, st.state
    FROM stations st, station_groups g, station_to_group sg,
    (SELECT DISTINCT station FROM inventory2) i
    WHERE i.station = sg.station
    AND i.station = st.station
    AND sg.group_id = g.group_id
    ORDER BY g.id, st.state
EOF;

$result = mysql_query($sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

while($row = mysql_fetch_array($result))
{
    $group = $row['group_name'];
    $thestation = $row['station'];
    $display = $thestation . " - " . $row['city'] . ", " . $row['state'];
    $inventory['station'][$group][$thestation] = $display;
}
*/
/*------------------------------------------------------------
 * years
 *------------------------------------------------------------*/
/*
if ($station != "")
{
    $sql =<<<EOF
	SELECT DISTINCT year
	FROM inventory2 i
	WHERE station = '$station'
EOF;
    $result = mysql_query($sql, $con);

    if (!$result) {
	die('Invalid query: ' . mysql_error());
    }

    while($row = mysql_fetch_array($result))
    {
	$y = $row['year'];
	$inventory['year'][$y] = $y;
    }
}
*/
/*------------------------------------------------------------
 * month
 *------------------------------------------------------------*/
/*
if ($station != "" && $year != "")
{
    $sql =<<<EOF
	SELECT DISTINCT month
	FROM inventory2 i
	WHERE station = '$station'
	AND year = $year
EOF;
    $result = mysql_query($sql, $con);

    if (!$result) {
	die('Invalid query: ' . mysql_error());
    }

    while($row = mysql_fetch_array($result))
    {
	$m = $row['month'];
	$inventory['month'][$m] = $m;
    }
}
*/
/*------------------------------------------------------------
 * day
 *------------------------------------------------------------*/
/*
if ($station != "" && $year != "" && $month != "")
{
    $sql =<<<EOF
	SELECT DISTINCT day
	FROM inventory2 i
	WHERE station = '$station'
	AND year = $year
	AND month = $month
EOF;
    $result = mysql_query($sql, $con);

    if (!$result) {
	die('Invalid query: ' . mysql_error());
    }

    while($row = mysql_fetch_array($result))
    {
	$d = $row['day'];
	$inventory['day'][$d] = $d;
    }
}
*/
$jsonTest = <<<EOF
  [{"station":"KDOX","year":"2009","month":"9","day":"4","sequences":[{"user_score":"-1","sequence_id":"92","comments":"","user_id":"30","username":"sheldon","score":"0","circles":[{"scan_id":"78","x":"180.396","y":"88.877","r":"10.006395205068"}]},{"user_score":"-1","sequence_id":"92","comments":"","user_id":"30","username":"sheldon","score":"0","circles":[{"scan_id":"79","x":"110.396","y":"88.877","r":"19.006395205068"}]}]},{"station":"KDOX","year":"2009","month":"9","day":"5","sequences":[{"user_score":"-1","sequence_id":"107","comments":"","user_id":"30","username":"sheldon","score":"0","circles":[{"scan_id":"107","x":"180.396","y":"88.877","r":"10.006395205068"}]},{"user_score":"-1","sequence_id":"92","comments":"","user_id":"30","username":"sheldon","score":"0","circles":[{"scan_id":"108","x":"100.396","y":"66.877","r":"25.006395205068"}]}]}]
EOF;
//mysql_close($con);
//print json_encode($inventory);
print $jsonTest;

?>