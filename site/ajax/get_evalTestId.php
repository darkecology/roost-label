<?php

require 'common.php';

$inventory = array('evalTestId' => array("" => "") );

/// HACK ALERT: HARD-CODED
for($i =0;$i<5;$i++){
	$d = $i;
	$inventory['evalTestId'][$d] = "$d";
}
//mysql_close($con);
print json_encode($inventory);

?>
