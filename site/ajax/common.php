<?php ini_set('display_errors', 'On'); ?>
<?php ini_set('display_startup_errors', 'On'); ?>
<?php ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT); ?>
<?php

/************************************************************
 * Connect to the database
 ************************************************************/
function roostdb_connect()
{
    $con = mysqli_connect('radar.cs.umass.edu', 'roostdb', 'swallow', 'roostdb');
    if (!$con)
    {
	die('Could not connect: ' . mysqli_error($con));
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
    $zone = floor( ($lon + 180.0) / 6.0 ) + 1;
    $cmd = "/bin/echo \"$lon $lat\" | /sw/bin/proj +proj=utm +zone=$zone +datum=WGS84";
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
    $cmd = "/bin/echo \"$x $y\" | /sw/bin/proj -I -f '%.6f' +proj=utm +zone=$zone +datum=WGS84";
    
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
