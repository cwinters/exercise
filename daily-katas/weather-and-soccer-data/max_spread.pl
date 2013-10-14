#!/usr/bin/perl

use strict;

my $filename = 'weather.dat';
open(IN, $filename);
my %track = (spread => 0, day => 0);
while (<IN>) {
    next unless (/^\s+\d+/);
    s/^\s+//;
    my ($day, $max, $min, @rest) = split(/\s+/);
    my $today_spread = $max - $min;
    if ($today_spread > $track{spread}) {
        %track = (spread => $today_spread, day => $day);
    }
}
print "Day $track{day} has spread of $track{spread}\n";
