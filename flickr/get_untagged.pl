#!/usr/bin/perl

use strict;
use Data::Dumper qw( Dumper );

my $response = MyFlickr::get_untagged();
unless ( $response->{success} ) {
    print "FAIL: $response->{error_code} => $response->{error_message}\n";
    print Dumper( $response );
    exit(1);
}

my $tree = $response->{tree};
foreach my $child ( @{ $tree->{children} } ) {
    next unless ( $child->{name} eq 'photos' );
    foreach my $photo_child ( @{ $child->{children} } ) {
        next unless ( $photo_child->{name} eq 'photo' );
        my $a = $photo_child->{attributes};
        printf( qq{<a href="http://flickr.com/photos/cwinters/%s">%s</a><br />\n}, $a->{id}, $a->{title} );
    }
} 
