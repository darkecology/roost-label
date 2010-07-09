<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php
function report_error($text) { 
	# add other stuff you may want here 
	$str1 = 'Error:'; //example of addon to beginning 
	$str2 = '; filename:get_months.php'; //example of addon to end 
	die($str1.'<br />'.$text.'<br />'.$str2); 
} 

if(isset($_GET["station"])){
	$station = $_GET["station"];
}else {
	report_error("missing station parameter");
	}


	
if(isset($_GET["year"]) ){
	$year = $_GET["year"];
}else {
	report_error("missing year parameter");
	}


	$conn = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
	$db = mysql_select_db('roostdb',$conn);
	$sql = "SELECT  `month` FROM  `roost_table` WHERE  `station` =  \"$station\" and `year` =  \"$year\" GROUP BY  `month`";
	$all_months = mysql_query($sql,$conn);
	
	#echo "hello world";

?>

<option value="null"></option>

<?php

	//POPULATE DROP DOWN MENU WITH monthS
	
	
	while($row = mysql_fetch_array($all_months))
	{        
		echo ("<option value=\"$row[month]\" " . ">$row[month]</option>");        
	}

	mysql_close($conn);
?>


