<?php

require '../ajax/common.php';

/*----------------------------------------
 * Set the correct content-type header
 *----------------------------------------*/
header('Content-type: application/vnd.google-earth.kml+xml');

/*----------------------------------------
 * Get data from DB
 *----------------------------------------*/
$con = roostdb_connect();

$sql =<<<EOF
    SELECT st.utm_x, st.utm_y, st.utm_zone, s.sequence_id, s.station station, scan_date, scan_time, x, y, r
    FROM sequences s, circles c, stations st
    WHERE s.sequence_id = c.sequence_id
    AND s.station = st.station
    ORDER BY station, scan_date, s.sequence_id, scan_time
EOF;

$result = mysql_query($sql, $con);

/*----------------------------------------
 * Output header
 *----------------------------------------*/
print ('<?xml version="1.0" encoding="UTF-8"?>' . "\n");
?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <Folder>
    <name>Labeled Roosts</name>
<?php

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

$i = 0;
$sequences = array();
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

    $row['lon'] = $lon;
    $row['lat'] = $lat;
    $row['r_km'] = $r_km;

    $sequences[$row['sequence_id']][] = $row;

    //    if ($i++ > 50) break;
}

foreach ($sequences as $sequence_id => $rows)
{
    $row = $rows[0];
    ?>
    <Folder>
	<name>Roost <?php echo $sequence_id ?></name>
	<description>Station=<?php echo $row['station'] ?>, scan_date=<?php echo $row['scan_date'] ?></description>
	<TimeStamp>
	  <when><?php echo $row['scan_date'] ?></when>
	</TimeStamp>
	<Placemark>
	 <description>Roost <?php echo $sequence_id ?>, station=<?php echo $row['station'] ?>, scan_date=<?php echo $row['scan_date'] ?></description>
	  <Point>
	 <coordinates><?php printf("%.8f,%.8f,0", $row['lon'], $row['lat']) ?></coordinates>
	  </Point>
	</Placemark>
	<Placemark>
	 <name>Roost <?php echo $sequence_id ?> track</name>
	 <visibility>0</visibility>
	  <LineString>
	    <extrude>1</extrude>
	    <tessellate>1</tessellate>
	    <altitudeMode>absolute</altitudeMode>
	    <coordinates>
	   <?php foreach ($rows as $row) printf("%.8f,%.8f,0\n", $row['lon'], $row['lat']);  ?>
	   </coordinates>
	  </LineString>
        </Placemark>
   </Folder>
	 <?php	  
}

/*----------------------------------------
 * Output footer
 *----------------------------------------*/
?>
  </Folder>
  </Document>
</kml>
