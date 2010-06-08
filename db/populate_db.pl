#! /usr/bin/perl -w
use strict;
use Mysql;

my( $db, $user, $pass, $host, $query, $connect, @databases, $database, $myquery, $tablename, $execute, @files, $file);
print "Populating the db images data!\n";



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



sub list
{
    my ($dir) = @_;
    return unless -d $dir;

    my @files;
	if (opendir my $dh, $dir)
	{
		# Capture entries first, so we don't descend with an
		# open dir handle.
		my @list;
		my $file;
		while ($file = readdir $dh)
		{
			push @list, $file;
		}
		closedir $dh;
		
		for $file (@list)
		{
			# Unix file system considerations.
			next if $file eq '.' || $file eq '..';
			
			# Swap these two lines to follow symbolic links into
			# directories.  Handles circular links by entering an
			# infinite loop.
			push @files, "$dir/$file"        if -f "$dir/$file";
			push @files, list ("$dir/$file") if -d "$dir/$file";
		}
	}
	
    return @files;
}

my @filess = list ("images");
#print $_, for @filess;

my $item;
foreach $item(@filess){
	
    if ($item =~ /(_DZ|_VR|_SW)\.mapl\.gif$/){
		$item =~ m/([A-Z][A-Z][A-Z][A-Z])([0-9][0-9][0-9][0-9])([0-9][0-9])([0-9][0-9])_(([[0-9][0-9])([0-9][0-9])([0-9][0-9]))_(.+)_(.+).mapl/;
		 
        #print $item;
        
		# A MySQL QUERY
		$myquery = "INSERT INTO $tablename (station, year, month, day, file_name, time, hour, minute, second, type, v) 
        VALUES ('$1', '$2', '$3', '$4', '$item', '$5', '$6', '$7', '$8', '$10', '$9')";
																						 
		# EXECUTE THE QUERY FUNCTION
		$execute = $connect->query($myquery); # 
																						 
     }
		
		

}
