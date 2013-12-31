<?php

require 'common.php';
$evalTestId = get_param('evalTestId', "");
$jsonTest = <<<EOF
  [{"station":"KDOX","year":"2009","month":"9","day":"4","sequences":[{"user_score":"-1","sequence_id":"92","comments":"","user_id":"30","username":"sheldon","score":"0","circles":[{"scan_id":"78","x":"180.396","y":"88.877","r":"10.006395205068"}]},{"user_score":"-1","sequence_id":"92","comments":"","user_id":"30","username":"sheldon","score":"0","circles":[{"scan_id":"79","x":"110.396","y":"88.877","r":"19.006395205068"}]}]},{"station":"KDOX","year":"2009","month":"9","day":"5","sequences":[{"user_score":"-1","sequence_id":"107","comments":"","user_id":"30","username":"sheldon","score":"0","circles":[{"scan_id":"107","x":"180.396","y":"88.877","r":"10.006395205068"}]},{"user_score":"-1","sequence_id":"92","comments":"","user_id":"30","username":"sheldon","score":"0","circles":[{"scan_id":"108","x":"100.396","y":"66.877","r":"25.006395205068"}]}]}]
EOF;
print $jsonTest;

?>