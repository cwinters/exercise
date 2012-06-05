#!/usr/bin/perl

use strict;
use Data::Dumper qw( Dumper );
use MyFlickr;

my $response = MyFlickr::request_frob();
print "Response:\n", Dumper( $response ), "\n";
