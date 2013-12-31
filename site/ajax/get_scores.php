<?php

require 'common.php';

$con = roostdb_connect();

$runs = array();

$run_id = get_param('run_id');
$run_id = 75;
$user_id = get_param('user_id');

$runs_sql = <<<EOF
    SELECT r.runs_roosts_id, r.scan_id, r.x, r.y, r.r
    FROM runs_roosts r, `runs_roosts-users` ru, scores s, users u
    WHERE r.run_id = $run_id
    ORDER BY r.run_id
EOF;

$result = mysqli_query($con, $runs_sql);

if (!$result) {
    die('Invalid query: ' . mysqli_error($con));
}

while($row = mysqli_fetch_array($result))
{
    $rid = $row['runs_roosts_id'];
    $runs[$rid]['runs_roosts_id'] = $rid;
    $runs[$rid]['scan_id'] = $row['scan_id'];
    $runs[$rid]['x'] = $row['x'];
    $runs[$rid]['y'] = $row['y'];
    $runs[$rid]['r'] = $row['r'];
}


$scores_sql = <<<EOF
    SELECT ru.runs_roosts_id, s.score_value, u.username
    FROM runs_roosts r, `runs_roosts-users` ru, scores s, users u
    WHERE r.run_id = $run_id
    AND ru.runs_roosts_id = r.runs_roosts_id
    AND ru.score_id = s.score_id
    AND ru.userID = u.userID
    ORDER BY r.run_id
EOF;

$result = mysqli_query($con, $scores_sql);

if (!$result) {
    die('Invalid query: ' . mysqli_error($con));
}

while($row = mysqli_fetch_array($result))
{
    $rid = $row['runs_roosts_id'];
    $runs[$rid]['score_value'] = $row['score_value'];
    $runs[$rid]['username'] = $row['username'];
}

print json_encode(array_values($runs));

mysqli_close($con);
?>