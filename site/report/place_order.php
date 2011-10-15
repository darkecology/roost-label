<?php
require '../ajax/common.php';

function check_date($date)
{
    return preg_match('/\d+\/\d+$/', $date);
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

$start_year = $_GET['start_year'];
$end_year = $_GET['end_year'];
if ($start_year > $end_year)
{
    err("Start year must precede end year");
}

$start_date = $_GET['start_date'];
$end_date = $_GET['end_date'];

if (! (check_date($start_date) && check_date($end_date)))
{
    err("Start date and end date required (mm/dd)");
}

if (! check_int("start_time"))
{
    err("Start time is required");
}

if (! check_int("end_time"))
{
    err("End time is required");
}

$start_time       = $_GET['start_time'];
$start_time_units = $_GET['start_time_units'];
$end_time         = $_GET['end_time'];
$end_time_units   = $_GET['end_time_units'];

$con = roostdb_connect();

$start_arr = explode('/', $start_date);
$end_arr   = explode('/', $end_date);

$start_month = $start_arr[0];
$start_day   = $start_arr[1];
$end_month   = $end_arr[0];
$end_day     = $end_arr[1];

for ($year = $start_year; $year <= $end_year; $year++)
{
    if ($start_month <= $end_month && $start_day <= $end_day)
	$year2 = $year;
    else			/* date range spans Jan 1 */
	$year2 = $year + 1;
    
    foreach ($_GET['station'] as $station)
    {
	$sql =<<<EOF
	    INSERT INTO ncdc_orders (station, 
				     start_date, 
				     end_date,
				     start_time,
				     start_time_units,
				     end_time,
				     end_time_units)
	    VALUES ('$station', 
		    '$year/$start_date',
		    '$year2/$end_date',
		    $start_time,
		    '$start_time_units',
		    $end_time,
		    '$end_time_units');
EOF;
	
	$result = mysql_query($sql, $con);
	
	if (!$result) {
	    die('Invalid query: ' . mysql_error() . '\n' . $sql);
	}
    }
}
?>

Order placed!
</body>
</html>