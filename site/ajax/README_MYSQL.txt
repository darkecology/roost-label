Dec 30, 2013

* mysql is deprecated
* need to convert everything to mysqli

Mark: x

mysql_query($sql, $con) --> mysqli_query($con, $sql)
mysql_error --> mysqli_error
mysql_fetch_array --> mysqli_fetch_array

Mark: y

mysqli_error() --> mysqli_error($con)
mysqli_insert_id() --> mysqli_insert_id($con)

Here is the current status

xy common.php
xy delete_roost.php
xy get_inventory.php
xy get_roosts.php
xy new_user.php
xy save_roost.php
xy tool_init.php
xy user_login.php

xy get_evalSet.php
xy get_evalSet2.php
xy get_evalTestId.php

xy get_scores.php
xy save_scores.php
