#!/usr/bin/perl -w

# one-off script to add utm coordinates to stations table

use strict;
use Data::Dumper;

use lib "$ENV{WORK}/lib/perl";
require 'wsr88d.pl';
require 'roost_util.pl';

my $dbh = roostdb_connect();


my $RANGE = 150000;		# range in m
my $DIM   = 600;		# number of pixels on a side

my $sth = $dbh->prepare(
    qq{SELECT station, lat, lon FROM stations}
    );
$sth->execute();

while (my $row = $sth->fetchrow_arrayref())
{    
    my ($station, $lat, $lon) = @$row;
    my ($x, $y, $zone) = lonlat_to_utm($lon, $lat);
    $dbh->do("UPDATE stations SET utm_x=$x, utm_y=$y, utm_zone=$zone WHERE station='$station'");
}
