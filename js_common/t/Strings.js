ok_load( 'Common.js', 'Arrays.js', 'Strings.js' );

// allBlank/anyBlank

ok( "Empty array all blank", Common.allBlank( [] ) );
not( "Empty array not any blank", Common.anyBlank( [] ) );

ok( "Array of nulls all blank",
    Common.allBlank( [ null, null, null ] ) );
ok( "Array of nulls any blank",
    Common.anyBlank( [ null, null, null ] ) );

ok( "Array of empties all blank",
    Common.allBlank( [ '', '', '' ] ) );
ok( "Array of empties any blank",
    Common.anyBlank( [ '', '', '' ] ) );

ok( "Array of whitespace all blank",
    Common.allBlank( [ ' ', '    ', "\t", "\n" ] ) );
ok( "Array of whitespace any blank",
    Common.anyBlank( [ ' ', '    ', "\t", "\n" ] ) );

ok( "Array of mixed blanks all blank",
    Common.allBlank( [ '  ', '', null, '   ', null ] ) );
ok( "Array of mixed blanks any blank",
    Common.anyBlank( [ '  ', '', null, '   ', null ] ) );

not( "Array of all blanks with one number not all blank",
     Common.allBlank( [ '', null, '   ', 4, '' ] ) );
ok( "Array of all blanks with one number any blank",
     Common.anyBlank( [ '', null, '   ', 4, '' ] ) );

// isBlank/isNotBlank

ok( "Null is blank", Common.isBlank( null ) );
not( "Null is not not blank", Common.isNotBlank( null ) );

ok( "Empty is blank", Common.isBlank( '' ) );
not( "Empty is not not blank", Common.isNotBlank( '' ) );

ok( "Space only is blank", Common.isBlank( '   ' ) );
not( "Space only is not not blank", Common.isNotBlank( '   ' ) );

ok( "Tabs and spaces is blank", Common.isBlank( "   \t   " ) );
not( "Tabs and spaces is not not blank", Common.isNotBlank( "   \t   " ) );

not( "Letters are not blank", Common.isBlank( 'ABCD' ) );
ok( "Letters are not blank", Common.isNotBlank( 'ABCD' ) );

// trimLeading

is( "No leading characters found, no change", 
    'ABCD', Common.trimLeading( '0', 'ABCD' ) );

is( "Single leading character found and trimmed",
    'xKCD', Common.trimLeading( '0', '0xKCD' ) );

is( "Multiple leading characters found and trimmed",
    'xKCD', Common.trimLeading( '0', '0000xKCD' ) );

// ucFirst + rest

is( "ucfirst on blank returns blank", '', Common.ucfirst( '' ) );

is_null( "ucfirst on null returns null", Common.ucfirst( null ) );

is( "ucfirst on name", 'Zorba', Common.ucfirst( 'zorba' ) );

is_null( "ucfirst and lcrest on null", Common.upperFirstLowerRest( null ) );
is( "ucfirst and lcrest on length 1", 
    'a', Common.upperFirstLowerRest( 'a' ) );
is( "ucfirst and lcrest on length 2", 
    'Ac', Common.upperFirstLowerRest( 'AC' ) );
is( "ucfirst and lcrest on lc name", 
    'Chuck', Common.upperFirstLowerRest( 'chuck' ) );
is( "ucfirst and lcrest on uc name", 
    'Chuck', Common.upperFirstLowerRest( 'CHUCK' ) );

// leftPad

is( "leftPad doesn't need to pad (length > target)",
    'Slickee', Common.leftPad( 'Slickee', 5 ) );
is( "leftPad doesn't need to pad (length == target)",
    'Slickee', Common.leftPad( 'Slickee', 7 ) );
is( "leftPad uses default padding length 1", 
    '   A', Common.leftPad( 'A', 4 ) );
is( "leftPad uses default padding length 4", 
    ' ABC', Common.leftPad( 'ABC', 4 ) );
is( "leftPad with single-digit number and 0",
    "003", Common.leftPad( 3, 3, '0' ) );
is( "leftPad with multi-digit number and 0",
    "150", Common.leftPad( 150, 3, '0' ) );
is( "leftPad with multi-character string extending beyond length", 
    'BBBBBBAAAA', Common.leftPad( 'AAAA', 9, 'BB' ) );
is( "leftPad with multi-character string fitting into length", 
    'BBBBAAAA', Common.leftPad( 'AAAA', 8, 'BB' ) );

// generateId

matches( "generateId should have prefix",
         /^ABCD_/, Common.generateId( 'ABCD' ) );

// digitsFrom

is( "digits from blank is 0",                     0,   Common.digitsFrom( '' ) );
is( "digits from null is 0",                      0,   Common.digitsFrom( null ) );
is( "digits from nothing with digits is 0",       0,   Common.digitsFrom( "ABCD" ) );
is( "digits from item with digits at start is 0", 0,   Common.digitsFrom( "1234_ABCD" ) );
is( "digits from item with one digit at end",     8,   Common.digitsFrom( "1234_FOO8" ) );
is( "digits from item with many digits at end",   566, Common.digitsFrom( "1234_566" ) );

// cleanForId

is_null( "cleanForId: null stays as-is", Common.cleanForId( null ) );
is( "cleanForId: blank string stays as-is", '', Common.cleanForId( '' ) );
is( "cleanForId: clean string stays as-is", 'orange', Common.cleanForId( 'orange' ) );
is( "cleanForId: whitespace collapsed", '_ora_nge_', Common.cleanForId( '  ora  nge  ' ) );
is( "cleanForId: whitespace and quotes removed", '_ora_nge_', Common.cleanForId( ' "ora  nge" ' ) );
is( "cleanForId: namespace-y cleaned", '_supercalaorange_', Common.cleanForId( ' "super.cala.orange" ' ) );