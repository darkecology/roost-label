<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php

/************************************************************
 * Connect to the database
 ************************************************************/
function roostdb_connect()
{
    $con = mysql_connect('mysql.cs.orst.edu', 'roostdb', 'swallow');
    if (!$con)
    {
	die('Could not connect: ' . mysql_error());
    }

    if (! mysql_select_db('roostdb', $con))
    {
	die('Failed to select database');
    }
    
    return $con;
}


/************************************************************
 * Get CGI parameter w/ default
 ************************************************************/
function get_param($name, $default = NULL)
{
    return isset($_GET[$name]) ? $_GET[$name] : $default;
}

/************************************************************
 * Convert longitude and latitude to UTM coordinates using PROJ.4
 *   (UTM zone is automatically computed if not specified)
 ************************************************************/
function lonlat_to_utm($lon, $lat)
{
    $PATH = getenv('PATH') . ':/nfs/phantom/u5/sheldon/local/bin:/usr/bin';
    $zone = floor( ($lon + 180.0) / 6.0 ) + 1;
    $cmd = "PATH=$PATH echo \"$lon $lat\" | proj +proj=utm +zone=$zone +datum=WGS84";
    $xy = system($cmd, $retval);
    if ($retval)
    {
	die("Projection failed: $retval");
    }
    list($x, $y) = preg_split('/\s+/', $xy);
    
    return(array($x, $y, $zone));
}

/************************************************************
 * Convert utm coordinates to longitude and latitude using PROJ.4
 ************************************************************/
function utm_to_lonlat($x, $y, $zone)
{
    $PATH = getenv('PATH') . ':/nfs/phantom/u5/sheldon/local/bin:/usr/bin';
    
    $cmd = "PATH=$PATH echo \"$x $y\" | proj -I -f '%.6f' +proj=utm +zone=$zone +datum=WGS84";
    
    $output = array();
    $retval = 0;
    $xy = exec($cmd, $output, $retval);
    if ($retval)
    {
	die("Projection failed: $retval");
    }
    
    list($x, $y) = preg_split('/\s+/', $xy);
    
    return(array($x, $y, $zone));
}
