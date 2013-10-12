#!/usr/bin/perl

use strict;

my %counts = ();
while (<>) {
    for my $word (split(/(\-\-|\s+)/)) {
        my $cleaned = clean($word);
        $counts{$cleaned}++ if ($cleaned);
    }
}

#print_as_is(\%counts);
print_sorted(\%counts);

sub print_as_is {
    my ($counts) = @_;
    while(my ($word, $count) = each($counts)) {
        printf("%15s: %s\n", $word, $count); 
    }
}

sub print_sorted {
    my ($counts) = @_;
    for my $word (sort { $counts->{$b} <=> $counts->{$a} || $a cmp $b } keys $counts) {
        printf("%15s: %s\n", $word, $counts->{$word}); 
    };
}

sub clean {
    my ($word) = @_;
    return undef if ($word =~ /^\d+$/);
    my $changed = lc $word;
    $changed =~ s/[\W_]//g;
    return $changed;
}
