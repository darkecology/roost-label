#! /usr/bin/perl -w
use strict;
use Mysql;

my( $db, $user, $pass, $host, $query, $connect, @databases, $database, $myquery, $tablename, $execute, @files, $file, $x);
print "Populating the db images data!\n";



## mysql user database name
$db ="roostdb";
## mysql database user name
$user = "roostdb";
 
## mysql database password
$pass = "swallow";
 
## user hostname : This should be "localhost" but it can be diffrent too
$host="mysql.cs.orst.edu";
 
 
# PERL MYSQL CONNECT
$connect = Mysql->connect($host, $db, $user, $pass);


# SELECT DB
$connect->selectdb($db);

$tablename = "roost_table";

# DEFINE A MySQL QUERY
$myquery = "select file_name from roost_table";

# EXECUTE THE QUERY FUNCTION
$execute = $connect->query($myquery);

# create a list of all *.gif files in
# the image directory


my $rowNumber = $execute->numrows();

print $rowNumber;


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
my @images;
while (my @results = $execute->fetchrow()){
	
    #if ($item =~ /(_DZ|_VR|_SW)\.mapl\.gif$/){
	
	my $file_size = -s $results[0];
	if ($file_size < 10000){
		push @images, $results[0];
		#print $results[0];
		#print "~";
		#print $file_size;
		#print "|||||||||||||||";
	}
	
	
	
	

	
	#$item =~ m/([A-Z][A-Z][A-Z][A-Z])([0-9][0-9][0-9][0-9])([0-9][0-9])([0-9][0-9])_(([[0-9][0-9])([0-9][0-9])([0-9][0-9]))_(.+)_(.+).mapl/;
	
	#print $item;
	
	# A MySQL QUERY
	#$myquery = "INSERT INTO $tablename (station, year, month, day, file_name, time, hour, minute, second, type, v) 
	#VALUES ('$1', '$2', '$3', '$4', '$item', '$5', '$6', '$7', '$8', '$10', '$9')";
	
	# EXECUTE THE QUERY FUNCTION
	#$execute = $connect->query($myquery); # 
}
print "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj";

for ($x = 0; $images[$x]; $x++){
	
	#$images[$x] =~ m/([A-Z][A-Z][A-Z][A-Z])([0-9][0-9][0-9][0-9])([0-9][0-9])([0-9][0-9])_(([[0-9][0-9])([0-9][0-9])([0-9][0-9]))_(.+)_(.+).mapl/;
																						   #print $item;
	print $images[$x];																					   
	# A MySQL QUERY
	$myquery = "Delete FROM `roost_table` WHERE `file_name` = '$images[$x]'";
	
	# EXECUTE THE QUERY FUNCTION
	$execute = $connect->query($myquery); 
	
					
	
}
