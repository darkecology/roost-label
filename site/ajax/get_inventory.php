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
    SELECT g.group_name, i.station, st.city, st.state
    FROM stations st, station_groups g, station_to_group sg,
    (SELECT DISTINCT station FROM inventory2) i
    WHERE i.station = sg.station
    AND i.station = st.station
    AND sg.group_id = g.group_id
    ORDER BY g.id, st.state
EOF;

$result = mysqli_query($con, $sql);

if (!$result) {
    die('Invalid query: ' . mysqli_error($con));
}

while($row = mysqli_fetch_array($result))
{
    $group = $row['group_name'];
    $thestation = $row['station'];
    $display = $thestation . " - " . $row['city'] . ", " . $row['state'];
    $inventory['station'][$group][$thestation] = $display;
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
    $result = mysqli_query($con, $sql);

    if (!$result) {
	die('Invalid query: ' . mysqli_error($con));
    }

    while($row = mysqli_fetch_array($result))
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
    $result = mysqli_query($con, $sql);

    if (!$result) {
	die('Invalid query: ' . mysqli_error($con));
    }

    while($row = mysqli_fetch_array($result))
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
    $result = mysqli_query($con, $sql);

    if (!$result) {
	die('Invalid query: ' . mysqli_error($con));
    }

    while($row = mysqli_fetch_array($result))
    {
	$d = $row['day'];
	$inventory['day'][$d] = $d;
    }
}

mysqli_close($con);
print json_encode($inventory);

?>
