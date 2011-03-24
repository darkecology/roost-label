<?php

require '../ajax/common.php';

/*----------------------------------------
 * Set the correct content-type header
 *----------------------------------------*/
header("Content-type: text/plain");

/*----------------------------------------
 * Get data from DB
 *----------------------------------------*/
$con = roostdb_connect();

$sql =<<<EOF
    SELECT st.utm_x, st.utm_y, st.utm_zone, s.sequence_id, s.station, scan_date, scan_time, x, y, r
    FROM sequences s, circles c, stations st
    WHERE s.sequence_id = c.sequence_id
    AND s.station = st.station
    ORDER BY station, scan_date, s.sequence_id, scan_time
EOF;

$result = mysql_query($sql, $con);

/*----------------------------------------
 * Output header
 *----------------------------------------*/

$names = array("sequence_id", "station", "scan_date", "scan_time", "lat", "lon", "r");
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

while($row = mysql_fetch_array($result, MYSQL_ASSOC))
{
    // convert from images coordinates to UTM and then lat/long
    $station_x = $row['utm_x'];
    $station_y = $row['utm_y'];
    $zone = $row['utm_zone'];

    list($lon, $lat) = utm_to_lonlat($station_x, $station_y, $zone);    
    
    $pixel_x = $row['x'];
    $pixel_y = $row['y'];

    $x = $station_x + ($pixel_x-$CENTER)*$M_PER_PIXEL;
    $y = $station_y - ($pixel_y-$CENTER)*$M_PER_PIXEL;

    list($lon, $lat) = utm_to_lonlat($x, $y, $zone);
    
    // Convert radius from pixel units to meters
    $r_km = sprintf("%.0f", $row['r']*$M_PER_PIXEL);

    $sequence_id = $row['sequence_id'];
    $station = $row['station'];
    $scan_date = $row['scan_date'];
    $scan_time = $row['scan_time'];
    print(implode(",", array($sequence_id, $station, $scan_date, $scan_time, $lat, $lon, $r_km)));
    print "\n";
}

?>