<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php
function report_error($text) { 
     # add other stuff you may want here 
     $str1 = 'Error:'; //example of addon to beginning 
     $str2 = '; filename:frames_list.php'; //example of addon to end 
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

$sql_DZ="SELECT `file_name`, `time` 
			FROM  `roost_table` 
			WHERE station = \"$station\" 
				AND year = \"$year\" 
				AND month = \"$month\" 
				AND day = \"$day\" 
				AND type = 'DZ' 
			ORDER BY 'time'";
$sql_VR="SELECT `file_name`, `time` 
			FROM  `roost_table` 
			WHERE station = \"$station\" 
				AND year = \"$year\" 
				AND month = \"$month\" 
				AND day = \"$day\" 
				AND type = 'VR' 
			ORDER BY 'time'";
$sql_SW="SELECT `file_name`, `time` 
			FROM  `roost_table` 
			WHERE station = \"$station\" 
				AND year = \"$year\" 
				AND month = \"$month\" 
				AND day = \"$day\" 
				AND type = 'SW' 
			ORDER BY 'time'";






$frames_array = array();
$frames_DZ_array = array();
$frames_VR_array = array();
$frames_SW_array = array();


$result = mysql_query($sql_DZ);


while($row = mysql_fetch_array($result)){
	$frames_DZ_array[] = $row['file_name'];
} 



$result = mysql_query($sql_VR);

while($row = mysql_fetch_array($result)){
	$frames_VR_array[] = $row['file_name'];
} 


$result = mysql_query($sql_SW);

while($row = mysql_fetch_array($result)){
	$frames_SW_array[] = $row['file_name'];
} 



$frames_array = implode('~', $frames_DZ_array); 
$frames_array .= "&&";
$frames_array .= implode('~', $frames_VR_array); 
$frames_array .= "&&";
$frames_array .= implode('~', $frames_SW_array); 



echo ($frames_array);

?>

