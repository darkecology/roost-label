<?php

require 'common.php';

$sequence_id = get_param('sequence_id');

if (!isset($sequence_id)) die("sequence_id is required");

$con = roostdb_connect();

$sql = "DELETE FROM circles2 WHERE sequence_id = $sequence_id";
$resultCircle = mysql_query($sql);
if (!$resultCircle) die('Invalid query: ' . mysql_error());

$sql = "DELETE FROM sequences WHERE sequence_id = $sequence_id";
$resultSequence = mysql_query($sql);
if (!$resultSequence) die('Invalid query: ' . mysql_error());

if ($resultCircle >= 1 && $resultSequence >= 1) echo "1";
?>
	