<?php

require 'common.php';

$station = get_param('station', "");
$year    = get_param('year', "");
$month   = get_param('month', "");
$month   = get_param('month', "");

$con = roostdb_connect();

$inventory = array('station' => array("" => ""),
		   'year' => array("" => ""),
		   'month' => array("" => ""),
		   'day' => array("" => "")
		   );

/*------------------------------------------------------------
 * stations
 *------------------------------------------------------------*/
$sql =<<<EOF
    SELECT DISTINCT i.station, s.city, s.state 
    FROM inventory i, stations s
    WHERE i.station = s.station
EOF;
$result = mysql_query($sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

while($row = mysql_fetch_array($result))
{
    $key = $row['station'];
    $display = $key . " - " . $row['city'] . ", " . $row['state'];
    $inventory['station'][$key] = $display;
}

/*------------------------------------------------------------
 * years
 *------------------------------------------------------------*/
if ($station != "")
{
    $sql =<<<EOF
	SELECT DISTINCT year(scan_date) year
	FROM inventory
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

/*------------------------------------------------------------
 * month
 *------------------------------------------------------------*/
if ($station != "" && $year != "")
{
    $sql =<<<EOF
	SELECT DISTINCT month(scan_date) month
	FROM inventory
	WHERE station = '$station'
	AND year(scan_date) = $year
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

/*------------------------------------------------------------
 * day
 *------------------------------------------------------------*/
if ($station != "" && $year != "" && $month != "")
{
    $sql =<<<EOF
	SELECT DISTINCT day(scan_date) day
	FROM inventory
	WHERE station = '$station'
	AND year(scan_date) = $year
	AND month(scan_date) = $month
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

mysql_close($con);
print json_encode($inventory);

?>
