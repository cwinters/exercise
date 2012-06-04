#!/usr/bin/perl

use strict;
use MyFlickr;

my $uri = MyFlickr::request_auth_url();
print "$uri\n";
