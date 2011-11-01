<?php
require '../ajax/common.php';
$con = roostdb_connect();


/*----------------------------------------
 * display_orders
 *----------------------------------------*/
function display_orders($con, $status)
{
    if ($status == 'complete' || $status == 'error')
    {
	$ORDER_BY = 'ORDER BY last_updated DESC, order_id DESC';
    }
    else
    {
	$ORDER_BY = 'ORDER BY priority, order_id';	
    }
    
    $sql =<<<EOF
	SELECT order_id, station, start_date, end_date, priority, error
	FROM ncdc_orders
	WHERE status = '$status'
	$ORDER_BY
EOF;
    
    $result = mysql_query($sql, $con);
    
    if (!$result) {
	die('Invalid query: ' . mysql_error() . '\n' . $sql);
    }
    
    printf("<table class=\"$status\">\n");
    printf(" <tr>\n");
    printf("  <th>id</th>\n");
    printf("  <th>station</th>\n");
    printf("  <th>dates</th>\n");
    if ($status == 'error') printf("  <th>message</th>\n");
    printf(" </tr>\n");
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) 
    {
	printf(" <tr>\n");
	printf("  <td><a href=\"orders/%05d\">%d</a></td>\n", $row["order_id"], $row["order_id"]);
	printf("  <td>%s</td>\n", $row["station"]);
	printf("  <td>%s--%s</td>\n", $row["start_date"], $row["end_date"]);
	if ($status == 'error') printf("  <td class=\"$status\">%s</td>\n", $row["error"]);
	printf(" </tr>\n");
    }
    printf("</table>\n");
}

?>

<html>
<head>
</head>
<body>

<!-- **************************************************************** -->
<!-- ORDER FORM -->
<!-- **************************************************************** -->

<h2>Place an order</h2>
<?php
 /*----------------------------------------
  * Get data from DB
  *----------------------------------------*/
$sql =<<<EOF
    SELECT g.group_id groupid, g.group_name groupname, s.station station, city, state, lat, lon
    FROM stations s, station_groups g, station_to_group sg
    WHERE s.station = sg.station
    AND sg.group_id = g.group_id
    ORDER BY g.id, state
EOF;

$result = mysql_query($sql, $con);

$groups = array();
$stations = array();

while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) 
{
    $group = $row['groupname'];
    $station = $row['station'];
    if (!isset($groups[$group]))
    {
	$groups[$group] = array();
    }
    array_push($groups[$group], $station);

    $stations[$station] = $row;
}
?>

<form action="place_order.php" method="get">
<ol>
    <!-- ****** STATION ****** -->
    <li>
    Select station(s):<br/>
    <select name="station[]" multiple="multiple" size="10">
    <?php 
    foreach (array_keys($groups) as $group)
    {
	printf('<optgroup label="%s">\n', $group);
	foreach ($groups[$group] as $station)
	{
	    $row = $stations[$station];
	    printf('<option value="%s">%s - %s, %s</option>\n', $row['station'], $row['station'], $row['city'], $row['state']);	    
	}
	printf('</optgroup>');
    }
?>
</select>
    </li>
    
    <!-- ****** YEARS ****** -->
    <li>
	Select years <br/>
        Start:
         <select name="start_year">
        <?php
        $curyear = date("Y");
        for ($i=1991; $i < $curyear; $i++)
        {
	    printf("<option value=\"%d\">%04d</option>\n", $i, $i);
	}
        printf("<option value=\"%d\" selected=\"selected\">%04d</option>\n", $i, $i);
        ?>
        </select>

        End:
        <select name="end_year">
        <?php
        $curyear = date("Y");
        for ($i=1991; $i < $curyear; $i++)
        {
	    printf("<option value=\"%d\">%04d</option>\n", $i, $i);
	}
        printf("<option value=\"%d\" selected=\"selected\">%04d</option>\n", $i, $i);
        ?>
        </select>
    </li>


    <!-- ****** DATES ****** -->
    <li>
	Select date range (mm/dd) <br/>
	Start: <input type="text" name="start_date"/>
        End: <input type="text" name="end_date"/> 
    </li>
    
    <!-- ****** TIMES ****** -->
    <li>
    Select time range<br/>
    Start:
    <input type="text" name="start_time" />
    Units:
    <select name="start_time_units">
    <option value="hours">Time of day in hours UTC time</option>
    <option value="sunrise" selected="selected">Minutes from sunrise (e.g. -30, +60)</option>
    <option value="sunset">Minutes from sunset (e.g. -30, +60)</option>
    </select>
    <br/>

    End:
    <input type="text" name="end_time" />
    Units:
    <select name="end_time_units">
    <option value="hours">Time of day in hours UTC time</option>
    <option value="sunrise" selected="selected">Minutes from sunrise (e.g. -30, +60)</option>
    <option value="sunset">Minutes from sunset (e.g. -30, +60)</option>
    </select>
    <br/>

    </li>

    <li><button type="submit">Place order!</button> </li>
    </ol>
    
</form>


<h2>Existing orders</h2>

<style>
th.q  {
  font-size: 20px;
}
td.q  {
  width: 20%;
  border: 1px solid #ccc; 
  vertical-align: top;
}
table.list td {
}

td.error { color:red; }
</style>

<table class="q">
<tr>
  <th class="q">New</th>
  <th class="q">Ordered</th>
  <th class="q">Downloading</th>
  <th class="q">Error</th>
  <th class="q">Complete</th>
</tr>
<tr>
  <td class="q"><?php display_orders($con, 'new') ?></td>
  <td class="q"><?php display_orders($con, 'ordered') ?></td>
  <td class="q"><?php display_orders($con, 'downloading') ?></td>
  <td class="q"><?php display_orders($con, 'error') ?></td>
  <td class="q"><?php display_orders($con, 'complete') ?></td>
</tr>
</table>

</body>
</html>