<?php

require 'common.php';

$sequence_id = get_param('sequence_id');

if (!isset($sequence_id)) die("sequence_id is required");

$con = roostdb_connect();

$sql = "DELETE FROM circles2 WHERE sequence_id = $sequence_id";
$resultCircle = mysqli_query($con, $sql);
if (!$resultCircle) die('Invalid query: ' . mysqli_error());

$sql = "DELETE FROM sequences WHERE sequence_id = $sequence_id";
$resultSequence = mysqli_query($con, $sql);
if (!$resultSequence) die('Invalid query: ' . mysqli_error());

if ($resultCircle >= 1 && $resultSequence >= 1) echo "1";
?>
