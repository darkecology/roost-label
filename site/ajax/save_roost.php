<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php



	#echo "jjj";
	$postXML = trim(file_get_contents('php://input'));


	$xmlObj = simplexml_load_string($postXML);
	#new SimpleXMLElement($postXML);
	#echo $postXML;
	#$postXML2 = "<profile><name>jafer</name></profile>";
	#$xmlObj2 = simplexml_load_string($postXML2);
	
	$station = $xmlObj->station;
	$year = $xmlObj->year;
	$month = $xmlObj->month;
	$day = $xmlObj->day;
	$userID = $xmlObj->userId;
	$comments = $xmlObj->comments;
	$sequenceID = $xmlObj->sequenceId;
	


	$conn = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
	$db = mysql_select_db('roostdb',$conn);
	
	if($sequenceID == 'null'){
	
		$sqlSequence="INSERT INTO `Sequence_Table` (`SequenceID`, `StationNumber`, `Year`, `Month`, `Day`, `UserID`, `Comments`)
    	       VALUES (NULL, \"$station\", \"$year\", \"$month\", \"$day\", \"$userID\", \"$comments\")";
		mysql_query($sqlSequence, $conn);   	
		$sequenceID = mysql_insert_id();

	
		foreach($xmlObj->circle as $node){
			$xcoord = $node->x;			
			$ycoord = $node->y;			
			$rcoord = $node->r;
			$frameNumber = $node->frameNumber;			
			$sqlCircles="INSERT INTO `Circle_Table` (`CircleID`, `SequenceID`, `FrameNumber`, `X`, `Y`, `R`)
           VALUES (NULL, \"$sequenceID\", \"$frameNumber\", \"$xcoord\", \"$ycoord\", \"$rcoord\")";   	
		   	mysql_query($sqlCircles);
		}	
	}else{
		$sqlDeleteCircles = "DELETE FROM Circle_Table
                           WHERE SequenceID = \"$sequenceID\"";
		mysql_query($sqlDeleteCircles);


		foreach($xmlObj->circle as $node){
			$xcoord = $node->x;			
			$ycoord = $node->y;			
			$rcoord = $node->r;
			$frameNumber = $node->frameNumber;			
			$sqlCircles="INSERT INTO `Circle_Table` (`CircleID`, `SequenceID`, `FrameNumber`, `X`, `Y`, `R`)
           VALUES (NULL, \"$sequenceID\", \"$frameNumber\", \"$xcoord\", \"$ycoord\", \"$rcoord\")";   	
		   	mysql_query($sqlCircles);
		}	

		$sqlComments = "UPDATE Sequence_Table set Comments=\"$comments\"
                           WHERE SequenceID = \"$sequenceID\"";
		mysql_query($sqlComments);

	}   	

	mysql_close($conn);

	echo $sequenceID;
?>


