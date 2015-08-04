<?php

require 'common.php';

/*----------------------------------------
 * Initialization
 *----------------------------------------*/

$station = get_param("station");
$year    = get_param("year");
$month   = get_param("month");
$day     = get_param("day");

if (!(isset($station) && isset($year) && isset($month) && isset($day)))
{
    die("station, year, month and day parameters are required");
}

$con = roostdb_connect();

/*----------------------------------------
 * Get product information
 *----------------------------------------*/

$sql = <<<EOF
    SELECT product, description 
    FROM   products
EOF;

$result = mysqli_query($con, $sql);

if (!$result) {
    die('Invalid query: ' . mysqli_error($con));
}

$products = array();

while($row = mysqli_fetch_array($result))
{
    $products[$row['product']] = $row['description'];
}

/*----------------------------------------
 * Get station information
 *----------------------------------------*/

$sql = <<<EOF
    SELECT *
    FROM stations 
    WHERE station = '$station'
EOF;

$result = mysqli_query($con, $sql);

if (!$result) {
    die('Invalid query: ' . mysqli_error($con));
}

// only one row
$stationInfo = array();
while($row = mysqli_fetch_array($result))
{
    $stationInfo = $row;
}

/*----------------------------------------
 * Get frame information
 *----------------------------------------*/

$frames_array = array();

$frames_sql = <<<EOF
    SELECT scan_id, scan_time, sunrise_time, minutes_from_sunrise, vcp, filename
    FROM   scans2
    WHERE  station = '$station'
    AND    scan_date = '$year-$month-$day'
    ORDER BY scan_time
EOF;

$result = mysqli_query($con, $frames_sql);

if (!$result) {
    die('Invalid query: ' . mysqli_error($con));
}

while($row = mysqli_fetch_array($result))
{
    $id = $row['scan_id'];
    $frames_array[$id]['scan_id'] = $id;
    $frames_array[$id]['scan_time'] = $row['scan_time'];
    $frames_array[$id]['vcp'] = $row['vcp'];
    $frames_array[$id]['minutes_from_sunrise'] = $row['minutes_from_sunrise'];
    $frames_array[$id]['filename'] = $row['filename'];
}

$inventory_sql = <<<EOF
    SELECT s.scan_id, product, i.filename
    FROM  inventory2 i, scans2 s
    WHERE i.scan_id = s.scan_id
    AND   i.station = '$station'
    AND   s.scan_date = '$year-$month-$day'
EOF;

$result = mysqli_query($con, $inventory_sql);

if (!$result) {
    die('Invalid query: ' . mysqli_error($con));
}

while($row = mysqli_fetch_array($result))
{
    $id = $row['scan_id'];
    
    $url = sprintf("images/%s/%04d/%02d/%02d/vis/%s", $station, $year, $month, $day, $row['filename']);
    
    $frames_array[$id]['products'][$row['product']] = $url;
}

/*----------------------------------------
 * Build the return data structure
 *----------------------------------------*/

$ret = array('frames' => array_values($frames_array),
	     'products' => $products,
	     'stationInfo' => $stationInfo);

mysqli_close($con);
print json_encode($ret);

?>
