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
							WHERE SequenceID = \"$sequenceID\"";
			
	$sqlSelectSequence = "select *  FROM Sequence_Table
							WHERE SequenceID = \"$sequenceID\"";

	$resultC = mysql_query($sqlSelectCircles);
	$resultS = mysql_query($sqlSelectSequence);
	$row = mysql_fetch_array($resultS);
	$comments = $row['Comments'];

	while($row = mysql_fetch_array($resultS){

	}

    $xmlstr = "<?xml version='1.0' ?>\n".
              // optionally you can specify a xml-stylesheet for presenting the results. just uncoment the following line and change the stylesheet name.
              /* "<?xml-stylesheet type='text/xsl' href='xml_style.xsl' ?>\n". */
              "<book></book>";

    // create the SimpleXMLElement object with an empty <book> element
    $xml = new SimpleXMLElement($xmlstr);

    // add some child nodes
    $xml->addChild("title", "Title of my book");
    $xml->addChild("abstract", "My book is about learning to work with SimpleXMLElement");

    // add some more child nodes
    $chapter1 = $xml->addChild("chapter_1");
	$chapter1->addChild("section", "jjjj");
    // add an attribute to child chapter_1
    $chapter1->addAttribute("chapter_title", "Introduction to my book");

    $chapter2 = $xml->addChild("chapter_2");
    $chapter2->addAttribute("chapter_title", "Development of my book");

    $chapter3 = $xml->addChild("chapter_3");
    $chapter3->addAttribute("chapter_title", "Another chapter of my book");

    $conclusion = $xml->addChild("conclusion", "The ending of my book");

    // insert the header to tell the browser how to read the document
    header("Content-type: text/xml");
    // print the SimpleXMLElement as a XML well-formed string
    echo $xml->asXML();
//	print_r($xml->asXML);

?>
	