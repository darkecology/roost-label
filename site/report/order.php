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
    
    <!-- ****** DATES ****** -->
    <li>
	Select begin/end dates (yyyy-mm-dd) <br/>
	Begin: <input type="text" name="begin_date"/>
        End: <input type="text" name="end_date"/> 
    </li>
    
    <!-- ****** TIMES ****** -->
    <li>
    Select begin/end times
    <input id="togglemins" type="radio" name="toggle" value="minutes" checked="checked" onchange="togglediv()"/> In minutes before/after sunrise
    <input id="togglehours" type="radio" name="toggle" value="hours" onchange="togglediv()"/> In hours UTC
    <br/>

    <!-- ****** TIMES in HOURS ****** -->
    <div style="display:none" id="hours">
    Begin:
    <select name="begin_hour">
    <option value="">--</option>
    <?php
    for ($i=0; $i<24; $i++)
    {
	printf("<option value=\"%d\">%02dZ</option>\n", $i, $i);
    }
    ?>
    </select>
    End:
    <select name="end_hour" >
     <option value="">--</option>
    <?php
    for ($i=0; $i<24; $i++)
    {
	printf("<option value=\"%d\">%02dZ</option>\n", $i, $i);
    }
    ?>
    </select>
    </div>

    <!-- ****** TIMES in OFFSET FROM SUNRISE ****** -->
    <div id="minutes">
    Begin:
    <input type="text" name="begin_mins_from_sunrise" />
    End:
    <input type="text" name="end_mins_from_sunrise" />
    </li>
    </div>

    <li><button type="submit">Place order!</button> </li>
    </ol>
    
</form>

</body>
</html>