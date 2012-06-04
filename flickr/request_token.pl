#!/usr/bin/perl

use strict;
use Data::Dumper qw( Dumper );
use MyFlickr;

my $response = MyFlickr::get_token();
print "Response:\n", Dumper( $response ), "\n";
