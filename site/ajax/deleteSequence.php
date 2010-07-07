<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php
	function report_error($text) { 
		# add other stuff you may want here 
		$str1 = 'Error:'; //example of addon to beginning 
		$str2 = '; filename:deleteSequence.php'; //example of addon to end 
		die($str1.'<br />'.$text.'<br />'.$str2); 
	}
	if(isset($_GET["sequenceID"]) )
	{
	$sequenceID = $_GET["sequenceID"];
	}else {report_error("missing sequenceID parameter");}
	$con = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}
	
	mysql_select_db('roostdb', $con);
	$sqlDeleteCircles = "DELETE FROM Circle_Table
							WHERE SequenceID = \"$sequenceID\"";
			
	$sqlDeleteSequence = "DELETE FROM Sequence_Table
							WHERE SequenceID = \"$sequenceID\"";
	
	$resultCircle = mysql_query($sqlDeleteCircles);
	$resultSequence = mysql_query($sqlDeleteSequence);
	if ($resultCircle == 1 && $resultSequence == 1)
	{
		echo "1";
	}
?>
	