<?php

require '../ajax/common.php';

if (defined('STDIN')) {
    parse_str(implode('&', array_slice($argv, 1)), $_GET);
}

/*----------------------------------------
 * Set the correct content-type header
 *----------------------------------------*/
header("Content-type: text/plain");

/*----------------------------------------
 * Parse parameters
 *----------------------------------------*/

$station = get_param('station', "");
$year    = get_param('year', "");
$month   = get_param('month', "");

/*----------------------------------------
 * Get data from DB
 *----------------------------------------*/
$con = roostdb_connect();

$station_clause = "";
$year_clause = "";
$month_clause = "";

if ($station != "") {
    $station_clause = "AND s.station = '$station'";
}
if ($year != "") {
    $year_clause = "AND year(s.scan_date) = $year";
}
if ($month != "") {
    $month_clause = "AND month(s.scan_date) = $month";
}

$sql =<<<EOF
SELECT
  s.scan_id,
  filename,
  sequence_id,
  station,
  year(scan_date) as year,
  month(scan_date) as month,
  day(scan_date) as day,
  hour(scan_time) as hour,
  minute(scan_time) as minute,
  second(scan_time) as second,
  minutes_from_sunrise,
  x,
  y,
  r
  FROM scans s, circles c
WHERE s.scan_id = c.scan_id
$station_clause
$year_clause
$month_clause
ORDER BY station, s.scan_date, c.sequence_id, s.scan_time
EOF;

$result = mysqli_query($con, $sql);

if (!$result)
{
    die('Query failed: ' . mysqli_error($con) . "\n");
}


/*----------------------------------------
 * Output header
 *----------------------------------------*/

$names = array("scan_id", "filename", "sequence_id", "station", "year", "month", "day", "hour", "minute", "second", "minutes_from_sunrise","x", "y", "r");
printf("%s\n", implode(",", $names));

/*----------------------------------------
 * Set up conversion from image coords to lat/long
 *----------------------------------------*/

$RANGE = 150000;		/* range in m */
$DIM   = 600;			/* number of pixels on a side */
$CENTER = $DIM/2;
$M_PER_PIXEL = 2*$RANGE/$DIM;

/*----------------------------------------
 * Read the data
 *----------------------------------------*/

while($row = mysqli_fetch_array($result, MYSQL_ASSOC))
{    
    $row['x'] =   ($row['x'] - $CENTER) * $M_PER_PIXEL;
    $row['y'] = - ($row['y'] - $CENTER) * $M_PER_PIXEL;
    $row['r'] =    $row['r'] * $M_PER_PIXEL;

    print(implode(",", $row));
    print "\n";
}

?>
