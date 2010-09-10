<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php

function roostdb_connect()
{
    $con = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
    if (!$con)
    {
	die('Could not connect: ' . mysql_error());
    }

    if (! mysql_select_db('roostdb_dev', $con))
    {
	die('Failed to select database');
    }
    
    return $con;
}


function get_param($name, $default = NULL)
{
    return isset($_GET[$name]) ? $_GET[$name] : $default;
}
