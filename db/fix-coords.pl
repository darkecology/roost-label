#!/usr/bin/perl -w

use strict;
use Data::Dumper;

use lib "$ENV{WORK}/lib/perl";
require 'wsr88d.pl';

my $RANGE = 150000;		# range in m
my $DIM   = 600;		# number of pixels on a side

my $WORK = $ENV{"WORK"};	
die "No work directory ($WORK)!" unless $WORK && -d $WORK;

my $station_file = "$WORK/third-party/rsl/install/lib/wsr88d_locations.dat";
my $stations = get_station_info($station_file);

$_ =  <STDIN>;

while(<STDIN>)
{
    chomp;
    my ($stationid, $circleid, $sequenceid, $framenumber, $x, $y, $r) = split(/\s+/, $_);
    
    # First convert x, y, and x+r to lat/long
    my $data = $$stations{$stationid};
    my $centerlat = $$data{lat};
    my $centerlon = $$data{lon};
    my $zone = int( ($centerlon + 180.0) / 6.0 ) + 1;

    # Correct for border pixels
    $x -= 2;
    $y -= 26;

    # each pixel is 1.5/600 degrees
    my $deg_per_pixel = 2*1.5/$DIM;
    my $m_per_pixel   = 2*$RANGE/$DIM;

    # 300/300 is the origin
    my $latoffset = ($y - 300)*$deg_per_pixel;
    my $lonoffset = ($x - 300)*$deg_per_pixel;
    
    my $lat = $centerlat + $latoffset;
    my $lon = $centerlon + $lonoffset;

    # convert x,y to UTM coords
    my ($xx, $yy) = lonlat_to_utm($lon, $lat, $zone);
    my ($xplusr) = lonlat_to_utm($lon + $r*$deg_per_pixel, $lat, $zone);
    my ($centerx, $centery) = lonlat_to_utm($centerlon, $centerlat, $zone);

    # get new offset in pixels
    my $newx = ($xx - $centerx)/$m_per_pixel + 300;
    my $newy = ($yy - $centery)/$m_per_pixel + 300;
    my $newr = ($xplusr - $xx)/$m_per_pixel;

    print join("\t", $circleid, $sequenceid, $framenumber, $newx, $newy, $newr), "\n";
}
