////////////////////////////////////////
// Date/time

// Map of the types of periods to the number of seconds in them
Common.PERIOD_MILLIS = {
    y : 1000 * 60 * 60 * 24 * 365,
    M : 1000 * 60 * 60 * 24 * 31,
    d : 1000 * 60 * 60 * 24,
    h : 1000 * 60 * 60,
    m : 1000 * 60
};


/**
 * Iterate through properties of the object -- or if given an array, thorough the properties
 * of each member -- and auto-translate millisecond values to JS Date objects. We identify
 * millisecond values thus: if a property ends in 'Time' and contains an integer, pass
 * that value to <tt>new Date()</tt>. We then assign this Date object to
 * the property name minus the 'Time' suffix, modifying the given object in-place.
 *
 * For instance, if given the following:
 *
 * <pre>
 *  { foo           : 'bar',
 *    startedOnTime : 1234559923000,
 *    name          : 'Dingo' }
 * </pre>
 *
 * Calling the object would result in:
 *
 * <pre>
 *  { foo           : 'bar',
 *    startedOn     : new Date( 1234559923000 ),
 *    startedOnTime : 1234559923000,
 *    name          : 'Dingo' }
 * </pre>
 *
 * Note that this is a shallow iteration -- we will NOT descend into properties
 * that are arrays and test their properties as well unless you specify sub
 * arrays/properties into which we should descend, by passing in one or more names
 * after the first argument. For example, take the object:
 *
 * <pre>
 *  { foo           : 'bar',
 *    startedOnTime : 1234559923000,
 *    suspectedBirthdates : [
 *        { name          : 'Fred',
 *          birthdateTime : 1234559923000 },
 *        { name          : 'George',
 *          birthdateTime : 1234559923000 }
 *    ],
 *    name          : 'Dingo' }             
 * </pre>
 *
 * If you invoke it by just passing in the object you'll get:
 *
 * <pre>
 * var x = Common.translateEpochTimes( o );
 * // x is now:
 * { foo           : 'bar',
 *   startedOnTime : 1234559923000,
 *   startedOn     : new Date( 1234559923000 ),
 *   suspectedBirthdates : [
 *        { name          : 'Fred',
 *          birthdateTime : 1234559923000 },
 *        { name          : 'George',
 *          birthdateTime : 1234559923000 }
 *   ],
 *   name          : 'Dingo' }
 * </pre>
 *
 * However, if you pass the property name containing the subarray those times
 * will be translated as well:
 *
 * <pre>
 * var x = Common.translateEpochTimes( o, 'suspectedBirthdates' );
 * // x is now:
 * { foo           : 'bar',
 *   startedOnTime : 1234559923000,
 *   startedOn     : new Date( 1234559923000 ),
 *   suspectedBirthdates : [
 *        { name          : 'Fred',
 *          birthdateTime : 1234559923000,
 *          birthdate     : new Date( 1234559923000 ) },
 *        { name          : 'George',
 *          birthdateTime : 1234559923000,
 *          birthdate     : new Date( 1234559923000 ) }
 *   ],
 *   name          : 'Dingo' }
 * </pre>
 *
 * @param o object or array of objects to iterate through; additional arguments
 * are optional and will be treated as subproperties of each object to
 * also translate
 * @return the same object passed in so you can chain
 */
Common.translateEpochTimes = function( o ) {
    // normalize to array
    var items = Common.asArray( o );

    // pull out the subproperties for clarity
    var subArrayNames = Common.copyArray( arguments, 1 );

    // go through each array and translate...
    for ( var i = 0; i < items.length; i++ ) {
        var item = items[i];
        for ( var prop in item ) {
            var found = prop.match( /^(.+)Time$/ );
            if ( found ) {
                var millis = parseInt( item[ prop ], 10 );
                var newProp = found[1];
                if ( ! isNaN( millis ) ) {
                    item[ newProp ] = new Date( millis );
                }
                else if (item[prop] === null && item[newProp] === undefined) {
                    // If the time was null, copy it over as null,
                    // just so that it is defined.
                    item[ newProp ] = null;
                }
            }
        }

        // then descend into the child property and translate it as well
        for ( var j = 0; j < subArrayNames.length; j++ ) {
            var fullName = subArrayNames[j];
            if ( Common.isNotBlank( fullName ) ) {
                var subArrayPieces = fullName.split( /\./, 2 );
                var childName = subArrayPieces[0];
                if ( Common.is( item[ childName ] ) ) {
                    if ( subArrayPieces.length == 2 ) {
                        Common.translateEpochTimes( item[ childName ], subArrayPieces[1] );
                    }
                    else {
                        Common.translateEpochTimes( item[ childName ] );
                    }
                }
            }
        }
    }
    return o;
};

/**
 * @param date1 JS datetime
 * @param date2 JS datetime
 * @return number <b>Decimal</b> number of days between the two dates.  Will be positive if date2 is after 
 * date1. (Use <tt>Math.floor()</tt> if you want the whole number of days.)
 * 
 */
Common.calculateDaysBetween = function( date1, date2 ) {
    return (date2.getTime() - date1.getTime()) / Common.PERIOD_MILLIS.d;
};

/**
 * @param date JS datetime
 * @param formatText string representing format
 * @return string with formatted datetime
 */
Common.dateFormat = function( date, formatText ) {
    return new Common.DateFormatter( formatText ).format( Common.getDateObject( date ) );
};

Common.dateTimeFormatTimeMillis = function( millis, formatText ) {
    if ( Common.isBlank( millis ) ) {
        return "";
    }
    formatText = formatText || 'MM/dd hh:mm a';
    return new Common.DateFormatter( formatText )
            .format( new Date( parseInt( millis, 10 ) ) );
};

Common.dateFormatTimeMillis = function( millis, formatText ) {
    if ( Common.isBlank( millis ) ) {
        return "";
    }
    formatText = formatText || 'MM/dd/yyyy';
    return new Common.DateFormatter( formatText )
            .format( new Date( parseInt( millis, 10 ) ) );
};

Common.normalizeSpan = function( span ) {
    span = span || {};
    span.startDate = Common.getDateObject( span.startDateTime );
    span.endDate   = Common.getDateObject( span.endDateTime   );
    return span;
};

Common.intervalFormat = function( span ) {
    var formatText = 'MM/dd/yyyy';
    span = Common.normalizeSpan(span);
    var startText = span.startDate ? Common.dateFormat( span.startDate, formatText ) : null;
    var endText   = span.endDate   ? Common.dateFormat( span.endDate,   formatText ) : null;
    return  startText && endText
            ? startText + "-" + endText
            : startText
              ? "since " + startText + ", ongoing"
              : endText 
                ? "until " + endText
                : '';
};

Common.getDateObject = function ( possibleDate ) {
    if ( ! possibleDate ) { return null; }
    return Object.prototype.toString.call( possibleDate ) === '[object Date]'
           ? possibleDate
           : new Date( possibleDate );
};

Common.prettyTimeHover = function( localDate, utcDate, formatText ) {
    formatText = formatText || 'MM/dd/yyyy';
    var formattedDate = Common.dateFormat( localDate, formatText );
    var pretty = utcDate ? Common.prettyTime( utcDate ) : null;
    pretty = pretty || ( !utcDate ? '' : formattedDate );
    return '<span title="' + formattedDate + '">' + pretty + '</span>';
};

/**
 * Takes a date and returns a string representing how
 * long ago the date represents.
 * @param utcDate a JS date object
 * @return a string indicating how far in the past it was
 */
Common.prettyTime = function( utcDate ) {
/* JavaScript Pretty Date
 * Copyright (c) 2008 John Resig (jquery.com)
 * Licensed under the MIT license.
 * http://ejohn.org/files/pretty.js
 */
    if ( ! utcDate ) {
        return '';
    }

    var mil_diff  = new Date().getTime() - Common.getDateObject( utcDate ).getTime();
    var sec_diff  = mil_diff / 1000;
    var min_diff  = Math.floor( sec_diff / (           60 ) );

    if      ( min_diff  <  1 ) { return "just now"; }
    else if ( min_diff  <  2 ) { return "1 minute ago"; }

    var hour_diff = Math.floor( sec_diff / (      60 * 60 ) );

    if      ( hour_diff <  1 ) { return min_diff  + " minutes ago"; }
    else if ( hour_diff <  2 ) { return "1 hour ago"; }

    var day_diff  = Math.floor( sec_diff / ( 24 * 60 * 60 ) );

    if ( isNaN( day_diff ) || day_diff < 0 ) {
        return '';
    }
    else if ( day_diff === 0 ) { return hour_diff +   " hours ago"; }
    else if ( hour_diff < 24 ) { return hour_diff + " hours ago"; }
    else if ( day_diff ==  1 ) { return "Yesterday"; }
    else if ( day_diff  <  7 ) { return day_diff  + " days ago"; }
    else if ( day_diff ==  7 ) { return "1 week ago"; }
    else if ( day_diff < 31  ) { return Math.ceil( day_diff / 7 )   +    " weeks ago"; }
    else                       { return "over a month ago"; }
};

/**
 * Given either a long with epoch millis or a date object, return a date object
 *
 * @param t millis or Date object
 * @return null if the argument is null or if it's not a number or Date object,
 * a date object either given or one created from the millis
 */
Common.translateTimes = function( t ) {
    if ( t == null || ! t ) {
        return null;
    }
    var date;

    if ( isNaN( t ) ) {
        date = t;
    }
    else {
        date = new Date( parseInt( t, 10 ) );
    }
    return date;
};

/**
 * Specify a time relative to now through a series of patterns
 * that move the date or time forward or backward, or anchor them
 * to specific values.
 *
 * You pass a single string that can contain multiple space-separated
 * specifications. Each specification must be in the format:
 *
 * <pre>
 * direction ('-', '+', '@')
 * amount or time (numeric)
 * period type (single character, more below)
 * </pre>
 *
 * The allowable period types are:
 *
 * <ul>
 *   <li>y: year</li>
 *   <li>M: month</li>
 *   <li>d: day</li>
 *   <li>h: hour</li>
 *   <li>m: minute</li>
 * </ul>
 *
 * <pre>
 * Specification                Meaning
 * ============================ ===================================
 * +15m                         Fifteen minutes later than anchor
 * -5d @16h                     Five days earlier than anchor, at 4 PM
 * -1d @8h @30m                 One day earlier than anchor at 8:30 AM
 * </pre>
 *
 * This is a copy of the user interface for
 * com.vocollecthealthcare.yosemite.type.RelativeTimeSpecification
 *
 * The only difference is that we don't support ranges.
 *
 * @param specText text of specification
 */
Common.RelativeTimeSpec = function( specText ) {
    if ( Common.isBlank( specText ) || specText.length < 3 ) {
        throw "RelativeTimeSpec: expected spec at least length 3, got '" + specText + "'";
    }

    this.millisToMove = 0;
    this.exactTime    = {
        y : -1, M : -1, d : -1, h : -1, m : -1
    };
    var specs = specText.split( ' ' );
    for ( var i = 0; i < specs.length; i++ ) {
        var spec = specs[i];
        var direction = spec.charAt(0);
        if ( '-' != direction && '+' != direction && '@' != direction ) {
            throw "RelativeTimeSpec: Invalid time direction '" + direction + "'; " +
                  "expected '+', '-' or '@'";
        }
        var periodType = spec.charAt( spec.length - 1 );
        var millis = Common.PERIOD_MILLIS[ periodType ];
        if ( ! millis ) {
            throw "RelativeTimeSpec: Invalid period type '" + periodType + "'; " +
                  "expected 'y', 'M', 'd', 'h', or 'm'";
        }
        var amount = parseInt( spec.substring( 1, spec.length - 1 ), 10 );
        if ( isNaN( amount ) ) {
            throw "RelativeTimeSpec: expected numeric amount to shift time, got '" + amount + "'";
        }
        if ( '@' == direction ) {
            this.exactTime[ periodType ] = amount;
        }
        else {
            this.millisToMove += '+' == direction
                                 ? millis * amount
                                 : -1 * millis * amount;
        }
    }
};

/**
 * Apply the specification to the given date, returning a new one.
 *
 * @param date date to which we apply specification; if given null or no argument we assume 'now'
 * @return new shifted date; note that we ALWAYS set the seconds/millis to 0
 */
Common.RelativeTimeSpec.prototype.apply = function( date ) {
    date = date || new Date();

    // first move the time forward or backward
    var shifted = new Date( this.millisToMove + date.getTime() );

    // then assign the anchor time
    for ( var periodType in this.exactTime ) {
        var periodTime = this.exactTime[ periodType ];
        if ( periodTime < 0 ) {
            continue;
        }
        switch ( periodType ) {
            case 'y' : shifted.setYear( periodTime ); break;
            case 'M' : shifted.setMonth( periodTime ); break;
            case 'd' : shifted.setDate( periodTime ); break;
            case 'h' : shifted.setHours( periodTime ); break;
            case 'm' : shifted.setMinutes( periodTime ); break;
        }
    }
    shifted.setSeconds(0);
    shifted.setMilliseconds(0);
    return shifted;
};

/**
 * Constant specifying a no-op time shift.
 */
Common.RelativeTimeSpec.NOOP = new Common.RelativeTimeSpec( '-0m' );

/**
 * @return true if the given string has-a Common.RelativeTimeSpec, false if not; 
 * this is a simple test, checkint to see if the first character is a leading
 * '-', '+' or '@'
 */
Common.RelativeTimeSpec.hasSpec = function( str ) {
    return Common.isNotBlank( str )
           && str.search( /^(\+|@|\-)/ ) != -1;
};

/**
 * Simple date formatter that uses many of the standard JDK formatting
 * tokens.
 *
 * Supported tokens:
 *
 * <ul>
 *   <li>yyyy: four-digit year (1999, 2011)</li>
 *   <li>yy: two-digit year (99, 11)</li>
 *   <li>M: one- or two-digit month (1, 12)</li>
 *   <li>MM: two-digit month (01, 12)</li>
 *   <li>MMM: three-character month (Jan, Dec)</li>
 *   <li>MMMM: full month name (January, December)</li>
 *   <li>d: one- or two-digit day of month (1, 28)</li>
 *   <li>dd: two-digit day of month (01, 28)</li>
 *   <li>EEE: three-character day of week (Tue, Fri)</li>
 *   <li>EEEE: full day of week (Tuesday, Friday)</li>
 *   <li>H: one- or two-digit hour of day, in 24-hour time (5, 22)</li>
 *   <li>HH: two-digit hour of day, in 24-hour time (05, 22)</li>
 *   <li>h: one- or two-digit hour of day, in 12-hour time (5, 11)</li>
 *   <li>hh: two-digit hour of day, in 12-hour time (05, 11)</li>
 *   <li>mm: two-digit minute of hour (05, 45)</li>
 *   <li>s: one- or two-digit seconds of minute (8, 58)</li>
 *   <li>ss: two-digit seconds of minute (08, 58)</li>
 *   <li>a: either 'AM' or 'PM'</li>
 *   <li>pretty (bonus!): result of running date through Common.prettyTime()</li>
 *   <li>Z: a timezone specifier like '-0500' (five hours behind GMT) or '+0200' (2 hours ahead of GMT);
 *   this may not work everywhere!</li>
 * </ul>
 *
 * Sample use:
 *
 * <pre>
 *     var now = new Date();
 *     var formatter = new Common.DateFormatter( 'yyyy-MM-dd' );
 *     var before = new Common.RelativeTimeSpec( '-30m' ).apply( now );
 *     var nowText = formatter.format( now );
 *     var beforeText = formatter.format( before );
 * </pre>
 *
 * @param format formatting string
 */
Common.DateFormatter = function( format ) {
    this.formatText = format + '';

    // cache the known formats so we don't have to scroll through all; for
    // single-use objects this isn't as useful, but for multi-use absolutely
    this.formatFunctions = [];

    var keyFinder = this.formatText;
    for ( var i = 0; i < Common.DateFormatter._formats.length; i++ ) {
        var pair = Common.DateFormatter._formats[i];
        if ( keyFinder.indexOf( pair[0] ) != -1 ) {

            // what's up with the nested functions? wacky JS scoping rules!
            // see: http://calculist.blogspot.com/2005/12/gotcha-gotcha.html
            //  or: http://nelsonslog.wordpress.com/2011/02/13/javascript-closures-gotcha-with-loop-variables/
            var kf = function() {
                var key = pair[0];
                var f   = pair[1];
                return function( s, timeArgs ) {
                    return s.replace( key, f.apply( f, timeArgs ), 'g' );
                };
            }();
            this.formatFunctions.push( kf );
        }

        // then remove the key so we don't have issues with substrings being found
        // later (e.g., 'yyyy' shouldn't also match 'yy')
        keyFinder = keyFinder.replace( pair[0], '', 'g' );
    }
};

Common.DateFormatter.prototype.format = function( date ) {
    if ( date == null ) {
        return '';
    }
    date = Common.getDateObject( date );

    if ( ! ( date instanceof Date ) || ! isFinite( date ) ) {
        Common.log( "Cannot format date -- given non-Date object (stringified: " + date + ")" );
        return '';
    }
    var timeArgs = [
        date.getFullYear(),  // 4 digit
        date.getMonth() + 1, // 0-11 originally, now 1-12
        date.getDate(),      // 1-31
        date.getHours(),     // 0-23
        date.getMinutes(),   // 0-59,
        date                 // actual date object
    ];
    var toReplace = this.formatText;
    for ( var i = 0; i < this.formatFunctions.length; i++ ) {
        toReplace = this.formatFunctions[i]( toReplace, timeArgs );
    }
    return toReplace;
};

// english only for now...
Common.DateFormatter._months = [
    {}, 
    { full: 'January',   abbrev: 'Jan' },
    { full: 'February',  abbrev: 'Feb' },
    { full: 'March',     abbrev: 'Mar' },
    { full: 'April',     abbrev: 'Apr' },
    { full: 'May',       abbrev: 'May' },
    { full: 'June',      abbrev: 'Jun' },
    { full: 'July',      abbrev: 'Jul' },
    { full: 'August',    abbrev: 'Aug' },
    { full: 'September', abbrev: 'Sep' }, 
    { full: 'October',   abbrev: 'Oct' },
    { full: 'November',  abbrev: 'Nov' },
    { full: 'December',  abbrev: 'Dec' }
];
Common.DateFormatter._weekdays = [
    { full: 'Sunday',    abbrev: 'Sun' },
    { full: 'Monday',    abbrev: 'Mon' },
    { full: 'Tuesday',   abbrev: 'Tue' },
    { full: 'Wednesday', abbrev: 'Wed' },
    { full: 'Thursday',  abbrev: 'Thu' },
    { full: 'Friday',    abbrev: 'Fri' },
    { full: 'Saturday',  abbrev: 'Sat' }
];

Common.DateFormatter._formats = [
    [ 'yyyy',   function( y, m, d, h, t, full ) { return y; } ],
    [ 'yy',     function( y, m, d, h, t, full ) { return y % 100; } ],
    [ 'MMMM',   function( y, m, d, h, t, full ) { return Common.DateFormatter._months[m].full;   } ],
    [ 'MMM',    function( y, m, d, h, t, full ) { return Common.DateFormatter._months[m].abbrev; } ],
    [ 'MM',     function( y, m, d, h, t, full ) { return Common.leftPad( m, 2, '0' ); } ],
    [ 'M',      function( y, m, d, h, t, full ) { return m; } ],
    [ 'dd',     function( y, m, d, h, t, full ) { return Common.leftPad( d, 2, '0' ); } ],
    [ 'd',      function( y, m, d, h, t, full ) { return d; } ],
    [ 'HH',     function( y, m, d, h, t, full ) { return Common.leftPad( h, 2, '0' ); } ],
    [ 'H',      function( y, m, d, h, t, full ) { return h; } ],
    [ 'hh',     function( y, m, d, h, t, full ) { return Common.leftPad( ( (h > 12) ? (h % 12) : (h == 0) ? 12 : h ), 2, '0' ); } ],
    [ 'h',      function( y, m, d, h, t, full ) { return (h > 12) ? (h % 12) : (h == 0) ? 12 : h;  } ],
    [ 'mm',     function( y, m, d, h, t, full ) { return Common.leftPad( t, 2, '0' ); } ],
    [ 'ss',     function( y, m, d, h, t, full ) { return TDC.leftPad( full.getSeconds(), 2, '0' ); } ],
    [ 's',      function( y, m, d, h, t, full ) { return full.getSeconds(); } ],
    [ 'a',      function( y, m, d, h, t, full ) { return (h < 12) ? 'AM' : 'PM';   } ],
    [ 'pretty', function( y, m, d, h, t, full ) { return Common.prettyTime( full );   } ],
    [ 'EEEE',   function( y, m, d, h, t, full ) { return Common.DateFormatter._weekdays[ Common.getDateObject(full).getDay() ].full;   } ],
    [ 'EEE',    function( y, m, d, h, t, full ) { return Common.DateFormatter._weekdays[ Common.getDateObject(full).getDay() ].abbrev; } ],
    [ 'Z',      function( y, m, d, h, t, full ) {
        // See: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        var offsetMinutes = full.getTimezoneOffset();
        var absMinutes = Math.abs( offsetMinutes );
        var hours = absMinutes / 60;
        var remainingMinutes = absMinutes % 60;
        var zone = Common.leftPad( hours, 2, '0' )
                   + Common.leftPad( remainingMinutes, 2, '0' );

        // "offset is positive if the local timezone is behind UTC and negative if it is ahead"
        var direction = offsetMinutes > 0 ? '-' : '+';
        return direction + zone;
    }]
];
