<?php
require '../ajax/common.php';

function check_date($date)
{
    return preg_match('/^\d\d\d\d-\d\d-\d\d$/', $date);
}

function check_int($field)
{
    return isset($_GET[$field]) && preg_match('/^-?\d+$/', $_GET[$field]);
}

function err($msg)
{
    die("<font color=\"red\">$msg</font>");
}

?>

<html>
<head></head>

<body>

<?php
if (!isset($_GET['station']) || count($_GET['station']) == 0)
{
    err("Please select a station");
}

$begin_date = $_GET['begin_date'];
$end_date = $_GET['end_date'];

if (! (check_date($begin_date) && check_date($end_date)))
{
    err("Begin date and end date required (yyyy-mm-dd)");
}

if ($_GET['toggle'] == 'minutes')
{
    if (! (check_int("begin_mins_from_sunrise") && check_int("end_mins_from_sunrise")))
    {
	err("Begin and end offsets (in minutes from sunrise) required!");
    }
}
else
{
    if (! (check_int("begin_hour") && check_int("end_hour")))
    {
	err("Begin and end hours required!");
    }
}

$begin_hour = $_GET['begin_hour'];
$end_hour   = $_GET['end_hour'];
$begin_mins = $_GET['begin_mins_from_sunrise'];
$end_mins   = $_GET['end_mins_from_sunrise'];

$con = roostdb_connect();

foreach ($_GET['station'] as $station)
{
    if ($_GET['toggle'] == 'minutes')
    {
	$sql =<<<EOF
	    INSERT INTO ncdc_orders (station, 
				     begin_date, 
				     end_date, 
				     begin_mins_from_sunrise,
				     end_mins_from_sunrise)
	    VALUES ('$station', 
		    '$begin_date',
		    '$end_date',
		    $begin_mins,
		    $end_mins);
EOF;

    }
    else
    {
	$sql =<<<EOF
	    INSERT INTO ncdc_orders (station, 
				     begin_date, 
				     end_date, 
				     begin_hour,
				     end_hour)
	    VALUES ('$station',
		    '$begin_date',
		    '$end_date',
		    $begin_hour,
		    $end_hour)
EOF;

    }

    $result = mysql_query($sql, $con);
    
    if (!$result) {
	die('Invalid query: ' . mysql_error() . '\n' . $sql);
    }

}
?>

Order placed!
</body>
</html>