<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php

	$conn = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
	$db = mysql_select_db('roostdb',$conn);
	$sql = "SELECT `station` FROM  `roost_table` GROUP BY `station`";
	$all_stations = mysql_query($sql,$conn);
	
	#echo "hello world";

?>

<option value="null"></option>

<?php

	//POPULATE DROP DOWN MENU WITH STATIONS
	
	
	while($row = mysql_fetch_array($all_stations))
	{        
		echo ("<option value=\"$row[station]\" " . ">$row[station]</option>");        
	}

	mysql_close($conn);
?>


