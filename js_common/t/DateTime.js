ok_load( 'Common.js', 'Strings.js', 'Arrays.js', 'DateTime.js' );

// translateEpochTimes -- examples from docs

var tetOne = { foo           : 'bar',
               startedOnTime : 1234559923000,
               name          : 'Dingo' };
var tetOneResult = Common.translateEpochTimes( tetOne );
is( "Original millis not changed (obj)",
    1234559923000, tetOne.startedOnTime );
is( "Original string not changed (obj)",
    'bar', tetOne.foo );
is( "Created new date from millis (obj)",
    1234559923000, tetOne.startedOn.getTime() );

var tetTwo = { foo           : 'bar',                
               startedOnTime : 1234559923000,        
               suspectedBirthdates : [               
                   { name          : 'Fred',         
                     birthdateTime : 1234559923000 },
                   { name          : 'George',       
                     birthdateTime : 1234559923000 } 
               ],                                    
               name          : 'Dingo' };
var tetTwoResult = Common.translateEpochTimes( tetTwo );
is( "Original millis not changed (obj)",
    1234559923000, tetTwoResult.startedOnTime );
ok( "Added new time (obj)", tetTwoResult.startedOn );
not( "Child time not added (obj, 1)", tetTwoResult.suspectedBirthdates[0].birthdate );
not( "Child time not added (obj, 2)", tetTwoResult.suspectedBirthdates[1].birthdate );

var tetTwoResultChild = Common.translateEpochTimes( tetTwo, 'suspectedBirthdates' );
is( "Original millis not changed (obj)",
    1234559923000, tetTwoResultChild.startedOnTime );
ok( "Added new time (obj)", tetTwoResultChild.startedOn );
is( "Child time added (obj, 1)", 
    1234559923000, tetTwoResultChild.suspectedBirthdates[0].birthdate.getTime() );
is( "Child time added (obj, 2)", 
    1234559923000, tetTwoResultChild.suspectedBirthdates[1].birthdate.getTime() );

var tetThree = [ 
    { foo : 'one',   endedTime : 1234559923000 },
    { foo : 'two',   endedTime : 1234560923000 },
    { foo : 'three', endedTime : 1234561923000 }
];
var expected = [ 1234559923000, 1234560923000, 1234561923000 ];
var tetThreeResult = Common.translateEpochTimes( tetThree );
for ( var i = 0; i < tetThreeResult.length; i++ ) {
    is( "Original millis not changed (array " + i + ")",
        expected[i], tetThreeResult[i].endedTime );
    ok( "Generated date (array " + i + ")", tetThreeResult[i].ended );
    is( "Millis in new date match (array " + i + ")",
        expected[i], tetThreeResult[i].ended.getTime() );
}

// calculateDaysBetween

var dayOne = new Date( 2011, 11, 18, 23, 30, 0 );
var dayTwo = new Date( 2011, 11, 25, 10, 30, 0 );
is( "Six days until Christmas!",
    6, Math.floor( Common.calculateDaysBetween( dayOne, dayTwo ) ) );
is( "Seven days from Christmas! (reversed days between is negative)",
    -7, Math.floor( Common.calculateDaysBetween( dayTwo, dayOne ) ) );

var dayThree = new Date( 2011, 11, 25, 23, 45, 0 );
is( "Seven days until Christmas close to midnight!",
    7, Math.floor( Common.calculateDaysBetween( dayOne, dayThree ) ) );
is( "Eight days from Christmas close to midnight!  (reversed days between is negative)",
    -8, Math.floor( Common.calculateDaysBetween( dayThree, dayOne ) ) );


// Relative Time Specification

var validSpecs = [ '-5h', '+5h', '@5h', '-5h +30m', '-5h @30m', '@6h @45m' ];
validSpecs.forEach( function( spec ) {
  ok( "'" + spec + "' is a valid RelativeTimeSpec", Common.RelativeTimeSpec.hasSpec( spec ) );
});

var invalidSpecs = [
    [ null,  'null value'          ],
    [ ''   , 'blank value'         ],
    [ '5h' , 'leading number only' ],
    [ '#5h', 'leading hash'        ],
    [ '$5h', 'leading dollar sign' ],
    [ '!5h', 'leading exclamation' ],
    [ 'A5h', 'leading alpha'       ]
];
invalidSpecs.forEach( function( items ) {
    var specText = items[0];
    var errorPiece = items[1];
    not( "Not a spec: " + errorPiece, Common.RelativeTimeSpec.hasSpec( specText ) );
    try {
        new Common.RelativeTimeSpec( specText );
        fail( "Expected exception constructing spec '" + specText + "': " + errorPiece );
    } catch ( ignored ) {}
});

// October 1, 2008 12:00:00
var anchor = new Date( 2008, 9, 1, 12, 0, 0, 0 );

var badConstructs = [
    [ '-5y +FM',   'letter for number' ],
    [ '+5H',       'invalid period type (H)' ]
];
badConstructs.forEach( function( items ) {
    var specText = items[0];
    var errorPiece = items[1];
    try {
        new Common.RelativeTimeSpec( specText );
        fail( "Expected exception constructing spec with '" + specText + "': " + errorPiece );
    } catch ( ignored ) {}
});


var tenMinutesAgo = new Common.RelativeTimeSpec( '-10m' );
isnt_null( "apply() with null is implied now", tenMinutesAgo.apply( null ) );
isnt_null( "apply() with nothing is implied now", tenMinutesAgo.apply() );



/*

    public void testApplyWithNegativeMinuteSpec()
    {
        final RelativeTimeSpecification spec =
                new RelativeTimeSpecification( "-10m" );
        final DateTime result = spec.apply( anchor );
        assertDateTimeFieldsEqual( result, anchor,
                DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(),
                DateTimeFieldType.dayOfMonth() );
        assertEquals( result.getHourOfDay(), 11 );
        assertEquals( result.getMinuteOfHour(), 50 );
    }

    public void testApplyWithPositiveHourSpec()
    {
        final RelativeTimeSpecification spec =
                new RelativeTimeSpecification( "+8h" );
        final DateTime result = spec.apply( anchor );
        assertDateTimeFieldsEqual( result, anchor,
                DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(),
                DateTimeFieldType.dayOfMonth(), DateTimeFieldType.minuteOfHour() );
        assertEquals( result.getHourOfDay(), 20 );
    }

    public void testApplyWithPositiveWeekAndSpecificHourSpecs()
    {
        final RelativeTimeSpecification spec =
                new RelativeTimeSpecification( "+2w @18h" );
        final DateTime result = spec.apply( anchor );
        assertDateTimeFieldsEqual( result, anchor,
                DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(),
                DateTimeFieldType.minuteOfHour() );
        assertEquals( result.getDayOfMonth(), 15 );
        assertEquals( result.getHourOfDay(), 18 );
    }

    public void testApplyWithNegativeMonthSpecificHourRangeSpecs()
    {
        final RelativeTimeSpecification spec =
                new RelativeTimeSpecification( "-3M @8-15h" );
        final DateTime result = spec.apply( anchor );
        assertDateTimeFieldsEqual( result, anchor,
                DateTimeFieldType.year(), DateTimeFieldType.dayOfMonth(),
                DateTimeFieldType.minuteOfHour() );
        assertEquals( result.getMonthOfYear(), 7 );
        assertBetween( result.getHourOfDay(), 8, 15 );
    }

    public void testApplyWithSmorgasbord()
    {
        final RelativeTimeSpecification spec =
                new RelativeTimeSpecification( "-1y @12M @25d @2-9h -15m" );
        final DateTime result = spec.apply( anchor );
        assertEquals( result.getYear(), 2007 );
        assertEquals( result.getMonthOfYear(), 12 );
        assertEquals( result.getDayOfMonth(), 25 );

        // NOTE: hour can be 1 if we're running in DST time...
        assertBetween( result.getHourOfDay(), 1, 9 );
        assertEquals( result.getMinuteOfHour(), 45 );
    }

    public void testEqualsWithSame()
    {
        final RelativeTimeSpecification spec = new RelativeTimeSpecification( "-5y" );
        assertEquals( spec, spec );
    }

    public void testEqualsWithNull()
    {
        final RelativeTimeSpecification spec = new RelativeTimeSpecification( "-5y" );
        assertFalse( spec.equals( null ) );
    }

    public void testEqualsWithOtherClass()
    {
        final RelativeTimeSpecification spec = new RelativeTimeSpecification( "-5y" );
        assertFalse( spec.equals( "Foo" ) );
    }

    public void testEqualsWithSameSpec()
    {
        final RelativeTimeSpecification specOne = new RelativeTimeSpecification( "-5y" );
        final RelativeTimeSpecification specTwo = new RelativeTimeSpecification( "-5y" );
        assertEquals( specOne, specTwo );
    }

    public void testDescription()
    {
        final RelativeTimeSpecification specOne = new RelativeTimeSpecification( "-5y" );
        assertEquals( specOne.getDescription(), "5 years" );
    }

    public void testSpecsInSet()
    {
        final RelativeTimeSpecification specOne = new RelativeTimeSpecification( "-5y" );
        final RelativeTimeSpecification specOneP = new RelativeTimeSpecification( "-5y" );
        final RelativeTimeSpecification specTwo = new RelativeTimeSpecification( "-5M" );
        final RelativeTimeSpecification specThree = new RelativeTimeSpecification( "-5d" );
        final Set<RelativeTimeSpecification> set = new HashSet<RelativeTimeSpecification>(
                Arrays.asList( specOne, specOneP, specTwo, specThree ) );
        assertEquals( set.size(), 3 );
    }

    public void assertBetween( final int actual, final int minInclusive, final int maxExclusive )
    {
        if ( actual < minInclusive || actual >= maxExclusive ) {
            fail( "Expected value between " + minInclusive + " " +
                    "and " + maxExclusive + ", got " + actual );
        }
    }

    public void assertDateTimeFieldsEqual( final DateTime actual,
                                           final DateTime comparison,
                                           final DateTimeFieldType ... fields )
    {
        for ( final DateTimeFieldType fieldType : fields ) {
            final int actualValue = actual.get( fieldType );
            final int expectedValue = comparison.get( fieldType );
            if ( actualValue != expectedValue ) {
                fail( "Expected " + expectedValue + ", got " + actualValue + " for " +
                      "date time field type " + fieldType.getName() );
            }
        }
    }
*/


// DateFormatter
// 
// quickie -- test out the zone info

var formatterZone = new Common.DateFormatter( "yyyy-MM-ddTHH:mmZ" );
var d = new Date( 2012, 0, 13, 7, 30, 0 );
is( "Full datetime with timezone",
    "2012-01-13T07:30-0500", formatterZone.format( d ) );
