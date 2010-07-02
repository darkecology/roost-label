<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', 'E_ALL' | 'E_NOTICE' | 'E_STRICT'); ?>
<?php
	function report_error($text) { 
		# add other stuff you may want here 
		$str1 = 'Error:'; //example of addon to beginning 
		$str2 = '; filename:deleteSequence.php'; //example of addon to end 
		die($str1.'<br />'.$text.'<br />'.$str2); 
	}

	if(isset($_GET["sequenceID"]) ){
		$sequenceID = $_GET["sequenceID"];
	}else {report_error("missing sequenceID parameter");}



	$con = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}
	
	mysql_select_db('roostdb', $con);
	// echo "connected";
	$sqlSelectCircles = "select *  FROM Circle_Table
							WHERE SequenceID = \"$sequenceID\" ORDER BY FrameNumber";
			
	$sqlSelectSequence = "select *  FROM Sequence_Table
							WHERE SequenceID = \"$sequenceID\"";

	$resultC = mysql_query($sqlSelectCircles);
	$resultS = mysql_query($sqlSelectSequence);
	$row = mysql_fetch_array($resultS);


    $xmlstr = "<?xml version='1.0' ?>\n".
              // optionally you can specify a xml-stylesheet for presenting the results. just uncoment the following line and change the stylesheet name.
              /* "<?xml-stylesheet type='text/xsl' href='xml_style.xsl' ?>\n". */
              "<roost></roost>";

    // create the SimpleXMLElement object with an empty <book> element
    $xml = new SimpleXMLElement($xmlstr);

	$comments = $row['Comments'];
	$xml->addChild("comments", $comments);

	while($row = mysql_fetch_array($resultC)){
	
		$circle = $xml->addChild("circle");
	
		$circle->addChild("X", $row['X']);
		$circle->addChild("Y", $row['Y']);
		$circle->addChild("R", $row['R']);
		$circle->addChild("FrameNumber", $row['FrameNumber']);
		
	}

    // insert the header to tell the browser how to read the document
    header("Content-type: text/xml");
    // print the SimpleXMLElement as a XML well-formed string
    echo $xml->asXML();
//	print_r($xml->asXML);

?>
	