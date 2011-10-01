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

$result = mysql_query($sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

$products = array();

while($row = mysql_fetch_array($result))
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

$result = mysql_query($sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

// only one row
$stationInfo = array();
while($row = mysql_fetch_array($result))
{
    $stationInfo = $row;
}

/*----------------------------------------
 * Get frame information
 *----------------------------------------*/

$frames_array = array();

$frames_sql = <<<EOF
    SELECT scan_time, sunrise_time, minutes_from_sunrise, vcp
    FROM   scans
    WHERE  station = '$station'
    AND    scan_date = '$year-$month-$day'
    ORDER BY scan_time
EOF;

$result = mysql_query($frames_sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

while($row = mysql_fetch_array($result))
{
    $t = $row['scan_time'];
    $frames_array[$t]['scan_time'] = $t;
    $frames_array[$t]['vcp'] = $row['vcp'];
    $frames_array[$t]['minutes_from_sunrise'] = $row['minutes_from_sunrise'];
}

$inventory_sql = <<<EOF
    SELECT scan_time, product, filename
    FROM  inventory
    WHERE station = '$station'
    AND   scan_date = '$year-$month-$day'
EOF;

$result = mysql_query($inventory_sql, $con);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

while($row = mysql_fetch_array($result))
{
    $t = $row['scan_time'];
    $url = preg_replace('/\/nfs\/spectre\/u13\/d6\/sheldon\/radar\/stations/', 'images', $row['filename']);
    $url = preg_replace('/\/nfs\/spectre\/u19\/roosts\/stations/', 'images', $url);
    $url = preg_replace('/\/nfs\/phantom\/u5\/sheldon\/spectre\/radar\/stations/', 'images', $url);

    $frames_array[$t]['products'][$row['product']] = $url;
}

/*----------------------------------------
 * Build the return data structure
 *----------------------------------------*/

$ret = array('frames' => array_values($frames_array),
	     'products' => $products,
	     'stationInfo' => $stationInfo);

mysql_close($con);
print json_encode($ret);

?>
