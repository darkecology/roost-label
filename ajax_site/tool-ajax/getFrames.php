<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php
function report_error($text) { 
     # add other stuff you may want here 
     $str1 = 'Error:'; //example of addon to beginning 
     $str2 = '; filename:data.php'; //example of addon to end 
     die($str1.'<br />'.$text.'<br />'.$str2); 
} 

	if(isset($_GET["station"]))
	{
	$station = $_GET["station"];
	}else {report_error("missing station parameter");}
	
	if(isset($_GET["year"]) )
	{
	$year = $_GET["year"];
	}else {report_error("missing year parameter");}
	
	if(isset($_GET["month"]) )
	{
	$month = $_GET["month"];
	}else {report_error("missing month parameter");}
	
	if(isset($_GET["day"]) )
	{
	$day = $_GET["day"];	
	}else {report_error("missing day parameter");}

$con = mysql_connect('oniddb.cws.oregonstate.edu', 'almuallj-db', 'R87kFXtxi9pJo8ri');
if (!$con)
  {
    die('Could not connect: ' . mysql_error());
  }

mysql_select_db('almuallj-db', $con);

$sql="SELECT `time` FROM  `roost_table` WHERE station = \"$station\" AND year = \"$year\" AND month = \"$month\" AND day = \"$day\" AND type = 'DZ'   ";

//echo $sql;

$result = mysql_query($sql);

$frames_time_array = array();
								  


while($row = mysql_fetch_array($result)){
	//echo "test1.1";
	//echo $row['time'] . "\n";
	$frames_time_array[] = $row['time'];

} 






echo json_encode($frames_time_array);

?>

