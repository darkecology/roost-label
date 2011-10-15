<?php
require '../ajax/common.php';
$con = roostdb_connect();
?>

<html>
<head>
<script>
function togglediv()
{
    var e = document.getElementById("togglehours");
    hdiv = document.getElementById("hours");
    mdiv = document.getElementById("minutes");
    if (e.checked)
    {
	hdiv.style.display = "inline";
	mdiv.style.display = "none";
    }
    else
    {
	hdiv.style.display = "none";
	mdiv.style.display = "inline";
    }
}

</script>
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
    SELECT station, city, state, lat, lon
    FROM stations
    ORDER BY station
EOF;

$result = mysql_query($sql, $con);
?>

<form action="place_order.php" method="get">
<ol>
    <!-- ****** STATION ****** -->
    <li>
    Select station(s):<br/>
    <select name="station[]" multiple="multiple" size="10">
    <?php 
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) 
    {
	printf('<option value="%s">%s - %s, %s</option>\n', $row['station'], $row['station'], $row['city'], $row['state']);
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

</body>
</html>