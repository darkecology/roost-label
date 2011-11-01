<?php
require '../ajax/common.php';

function check_date($date)
{
    try {
	$d = new DateTime("2011/$date");
    }
    catch (Exception $e)
    {
	return false;
    }
    return true;
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

$utc   = new DateTimeZone("UTC");

$stations = array_unique($_GET['station']);

foreach ($stations as $station)
{
    for ($year = $start_year; $year <= $end_year; $year++)
    {
	$interval_start = new DateTime("$year/$start_date", $utc);
	$interval_end   = new DateTime("$year/$end_date", $utc);

	if (!($interval_start && $interval_end))
	{
	    err("Invalid dates");
	}
	
	if ($interval_end < $interval_start)
	{
	    $interval_end->modify("+1 year");
	}

	for ($month_start = clone $interval_start; $month_start < $interval_end; $month_start->modify("+1 month"))
	{
	    
	    $month_end = clone $month_start;
	    $month_end->modify("+1 month");
	    $month_end->modify("-1 day");

	    if ($interval_end->format('Y-m-d') < $month_end->format('Y-m-d')) {
		$month_end = $interval_end;
	    }

	    $month_start_str = $month_start->format("Y-m-d");
	    $month_end_str = $month_end->format("Y-m-d");

	    $sql =<<<EOF
		INSERT INTO ncdc_orders (station, 
					 start_date, 
					 end_date,
					 start_time,
					 start_time_units,
					 end_time,
					 end_time_units)
		VALUES ('$station', 
			'$month_start_str',
			'$month_end_str',
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
}

?>

Order placed!
</body>
</html>