<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php
function report_error($text) { 
     # add other stuff you may want here 
     $str1 = 'Error:'; //example of addon to beginning 
     $str2 = '; filename:get_roosts.php'; //example of addon to end 
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

	$con = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}
	
	mysql_select_db('roostdb', $con);
	
	$sql = "SELECT `Sequence_Table`.SequenceID, UserID, Comments, FrameNumber, X, Y, R
			FROM `Sequence_Table` LEFT JOIN `Circle_Table` 
			ON `Sequence_Table`.SequenceID = `Circle_Table`.SequenceID
			WHERE StationNumber = \"$station\" 
			AND Year = \"$year\"
			AND Month = \"$month\"
			AND Day = \"$day\"";
			
	$result = mysql_query($sql);
	$xmlstr = "<?xml version='1.0' ?>\n".
		  // optionally you can specify a xml-stylesheet for presenting the results. just uncoment the following line and change the stylesheet name.
		  /* "<?xml-stylesheet type='text/xsl' href='xml_style.xsl' ?>\n". */
		  "<RoostSequences></RoostSequences>";
		  
	$xml = new SimpleXMLElement($xmlstr);
	$currentSequenceID = -1;
	$newSequence = null;
	while($row = mysql_fetch_array($result))
	{
		if($currentSequenceID==-1 || $row['SequenceID'] != $currentSequenceID)
		{
			$currentSequenceID = $row['SequenceID'];
			$newSequence = $xml->addChild("Sequence" . $currentSequenceID);
			$newSequence->addChild("SequenceID", $row['SequenceID']);
			$newSequence->addChild("UserID", $row['UserID']);
			$newSequence->addChild("Comments", $row['Comments']);
		}
		$newCircle = $newSequence->addChild("Circle");
		$newCircle->addChild("FrameNumber", $row['FrameNumber']);
		$newCircle->addChild("X", $row['X']);
		$newCircle->addChild("Y", $row['Y']);
		$newCircle->addChild("R", $row['R']);
	}
	// insert the header to tell the browser how to read the document
    header("Content-type: text/xml");
    // print the SimpleXMLElement as a XML well-formed string
    echo $xml->asXML();
?>