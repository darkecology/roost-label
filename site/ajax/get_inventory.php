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
    SELECT DISTINCT i.station, st.city, st.state 
    FROM inventory2 i, stations st
    WHERE i.station = st.station
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

/*------------------------------------------------------------
 * month
 *------------------------------------------------------------*/
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

/*------------------------------------------------------------
 * day
 *------------------------------------------------------------*/
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

mysql_close($con);
print json_encode($inventory);

?>
