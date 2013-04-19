/**
 * @return true if all flattened arguments are null/blank, false if any is non-blank
 */
Common.allBlank = function( blanks ) {
    return _.all(
              Common.flatten( blanks ),
              function( x ) { return Common.isBlank( x ); } );
};

/**
 * @return true if any flattened argument is null/blank, false if all are non-blank
 */
Common.anyBlank = function( blanks ) {
    return _.any(
              Common.flatten( blanks ),
              function( x ) { return Common.isBlank( x ); } );
};

/**
 * @param str JS string to check;
 * @return true if string is null or comprised only of whitespace; false if not
 * or if given object is not a string
 */
Common.isBlank = function ( str ) {
    if ( str === null || str === undefined ) {
        return true;
    }
    return typeof( str ) == 'string'
           && str.match( /^\s*$/ ) !== null;
};

/**
 * @param string string to check
 * @return true if string is not null and has any non-whitespace character
 */
Common.isNotBlank = function ( string ) {
    return ! this.isBlank( string );
};

/**
 * @param string string to trim
 * @return new string with leading and trailing whitespace removed
 */
Common.trim = function( string ) {
    return string.replace( /^\s+|\s+$/g, '' );
};

/**
 * @param string string to trim
 * @return new string with leading character(s) removed
 */
Common.trimLeading = function( toRemove, string ) {
    var pat = new RegExp( '^' + toRemove + '+' );
    return string.replace( pat, '' );
};

/**
 * @param string string to modify
 * @return new string with first character upper-cased and the remainder
 * of the string untouched; if the string is blank this will return what was given
 */
Common.ucfirst = function( string ) {
    return Common.isBlank( string )
           ? string
           : string.charAt(0).toUpperCase() + string.substr(1);
};

/**
 * @param string string to modify
 * @return new string with first character upper-cased and the
 * remainder lower-cased; if the string is null or fewer than 2
 * characters this will return what was given
 */
Common.upperFirstLowerRest = function( string ) {
    return string == null || string.length < 2
           ? string
           : string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
};

/**
 * Pad a string to a particular length with characters on the left.
 *
 * <pre>
 *     Common.leftPad( 1, 2, '0' ) => '01'
 *     Common.leftPad( 'Stu', 6  ) => '   Stu'
 * </pre>
 * 
 * @param toPad string (or object that gets stringified) to pad;
 * @param targetLength how long should it be?
 * @param padWith (optional, defaults to ' ') string to pad with until we reach the target length
 * @return padded string
 */
Common.leftPad = function( toPad, targetLength, padWith ) {
    var string = toPad + '';
    var diff = targetLength - string.length;
    if ( diff <= 0 ) {
        return string;
    }

    padWith = Common.isBlank( padWith ) || padWith.length == 0 ? ' ' : padWith;
    var count = Math.floor( diff / padWith.length ) + Math.min( diff % padWith.length, 1 );
    var padded = '';
    for ( var i = 0; i < count; i++ ) {
        padded = padded + padWith;
    }
    return padded + string;
};

/**
 * Generate a random ID beginning with the given prefix.
 *
 * @param prefix prefix, may be undefined/blank/null, but you should define
 * so the output will be classifiable
 * @return ID that should be random.
 */
Common.generateId = function( prefix ) {
    var suffix = Math.floor( Math.random() * 100000 );
    return prefix
           ? prefix + '_' + suffix
           : suffix;
};

/**
 * Useful stringification on various objects; the return value is
 * not eval'able -- if you want to do that use a JSON library.
 *
 * @param item item to dump
 * @return item stringified
 */
Common.dump = function( item ) {
    if ( item === null || item === undefined ) {
        return "NULL";
    }
    else if ( Common.isArray( item ) ) {
        return '[' + item.join( '; ' ) + ']';
    }
    else {
        var out = 'Type ' + typeof( item ) + '; ';
        for ( var key in item ) {
            out += key + " := " + item[ key ] + "; ";
        }
        return '{' + out + '}';
    }
};

/**
 * @param str string to check for digits 
 * @return digits from the end of the given string, or 0 if given a blank
 * string or no digits found at the end
 */
Common.digitsFrom = function( str ) {
    if ( Common.isBlank( str ) ) {
        return 0;
    }
    else {
        var matches = str.match( /(\d+)$/ );
        return matches == null ? 0 : matches[1];    
    }
};

/**
 * @param str string to cleanup
 * @return string suitable for use as a DOM ID (no spaces or quotes)
 */
Common.cleanForId = function( str ) {
    if ( Common.isBlank( str ) ) {
        return str;
    }
    return str.toLowerCase()
        .replace( /\s+/g, '_' )
        .replace( /['".:;]/g, '' );
};
