<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php
function report_error($text) { 
	# add other stuff you may want here 
	$str1 = 'Error:'; //example of addon to beginning 
	$str2 = '; filename:get_years.php'; //example of addon to end 
	die($str1.'<br />'.$text.'<br />'.$str2); 
} 

if(isset($_GET["station"])){
	$station = $_GET["station"];
}else {
	report_error("missing station parameter");
	}



	$conn = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
	$db = mysql_select_db('roostdb',$conn);
	$sql = "SELECT  `year` FROM  `roost_table` WHERE  `station` =  \"$station\" GROUP BY  `year` ";
	$all_years = mysql_query($sql,$conn);
	
	#echo "hello world";

?>

<option value="null"></option>

<?php

	//POPULATE DROP DOWN MENU WITH yearS
	
	
	while($row = mysql_fetch_array($all_years))
	{        
		echo ("<option value=\"$row[year]\" " . ">$row[year]</option>");        
	}

	mysql_close($conn);
?>


