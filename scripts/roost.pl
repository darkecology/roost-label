#! /usr/bin/perl -w
use strict;
use Mysql;

my( $db, $user, $pass, $host, $query, $connect, @databases, $database, $myquery, $tablename, $execute, @files, $file);
print "HHHHHHello from perl!\n";



## mysql user database name
$db ="almuallj-db";
## mysql database user name
$user = "almuallj-db";
 
## mysql database password
$pass = "R87kFXtxi9pJo8ri";
 
## user hostname : This should be "localhost" but it can be diffrent too
$host="oniddb.cws.oregonstate.edu";
 
 
# PERL MYSQL CONNECT
$connect = Mysql->connect($host, $db, $user, $pass);


# SELECT DB
$connect->selectdb($db);

$tablename = "roost_table";

# DEFINE A MySQL QUERY
$myquery = "TRUNCATE TABLE roost_table";

# EXECUTE THE QUERY FUNCTION
$execute = $connect->query($myquery);

# create a list of all *.gif files in
# the image directory
opendir(DIR, "image");
@files = grep(/(_DZ|_VR|_SW)\.mapl\.gif$/,readdir(DIR));
closedir(DIR);

# print all the filenames in our array
foreach $file (@files) {
   print "$file\n";
   $file =~ m/([A-Z][A-Z][A-Z][A-Z])([0-9][0-9][0-9][0-9])([0-9][0-9])([0-9][0-9])_(([[0-9][0-9])([0-9][0-9])([0-9][0-9]))_(.+)_(.+).mapl/;
#print "station:     ";
#print "$1";
#print "year:";
#print "$2";
#print "month:";
#print "$3";
#print "day:";
#print "$4";

#print "1111;";
#print "$5";

#print "2222;";
#print "$6";
#print "3333;";
#print "$7";
#print "4444;";
#print "$8";


#   print "$file\n";


# DEFINE A MySQL QUERY
$myquery = "INSERT INTO $tablename (station, year, month, day, file_name, time, hour, minute, second, type) 
VALUES ('$1', '$2', '$3', '$4', '$file', '$5', '$6', '$7', '$8', '$10')";

# EXECUTE THE QUERY FUNCTION
$execute = $connect->query($myquery);
   



}
