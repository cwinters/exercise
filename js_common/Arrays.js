/**
 * Normalize an item into an array; if it's already an array we'll
 * just return the item, otherwise we'll return a one-item array with it.
 *
 * @param item object or array to be normalized
 * @return array
 */
Common.asArray = function( item ) {
    return Common.isArray( item ) ? item : [ item ];
};

/**
 * Determine if the given item is an array or not (just uses underscore).
 *
 * @param item object that could be array
 * @return true if item is array, false if not
 * @see http://codeblog.studiokoi.com/share/code/comments/typechecking_arrays_in_javascript/
 * @see http://blog.360.yahoo.com/blog-TBPekxc1dLNy5DOloPfzVvFIVOWMB0li?p=916#comments
 */
Common.isArray = function( item ) {
    return _.isArray( item );
};

/**
 * @param item object that could be array
 * @return inverse of Common.isArray
 */
Common.isNotArray = function( item ) {
    return ! Common.isArray( item );
};

Common.isArrayWithData = function( item ) {
    return Common.isArray( item ) && item.length > 0;
};

/**
 * Shallow copy an array
 * @param oldArray array to copy
 * @param startIndex start index to copy from, inclusive; defaults to 0
 * @param endIndex end index to copy to, exclusive; defaults to the array length
 * @return new array with same members
 */
Common.copyArray = function( oldArray, startIndex, endIndex ) {
    startIndex = startIndex ? startIndex : 0;
    endIndex   = endIndex
                 ? Math.min( endIndex, oldArray.length )
                 : oldArray.length;
    var copy = [];
    var idx = 0;
    for ( var i = startIndex; i < endIndex; i++ ) {
        copy[ idx++ ] = oldArray[i];
    }
    return copy;
};

/**
 * Create a hash (or map) from the given array: each array member becomes
 * a key with a value of true
 * @param array array from which we'll create a hash
 * @return hash
 */
Common.toHash = function( array ) {
    var o = {};
    for ( var i = 0; i < array.length; i++ ) {
        o[ array[i] ] = true;
    }
    return o;
};

/**
 * Normalize an item into either the first element of an array (if it's
 * an array) or the item itself
 * @param item object or array to be normalized
 * @return non-array object
 */
Common.asItem = function( item ) {
    return Common.isArray( item ) ? item[0] : item;
};

/**
 * Flatten all arguments to a single array; this only goes one layer deep,
 * so an array of arrays will have each item of the array as a top-level
 * item but each subitem will still be an array.
 *
 * For example:
 *
 * <pre>
 *   var x = Common.flatten( 'foo', { name : 'Donkey' }, [ 1, 2, 3 ] );
 *   // x is now:
 *   [ 'foo', { name : 'Donkey' }, 1, 2, 3 ]
 * </pre>
 *
 * Note that you can use the 'flatten()' method from Underscore.js to flatten
 * to any depth.
 */
Common.flatten = function() {
    var flattened = [];
    for ( var i = 0; i < arguments.length; i++ ) {
        Common.pushAll( flattened, arguments[i] );
    }
    return flattened;
};

/**
 *
 * @param array array to which we add add value(s)
 * @param value either a single object or an array; in the latter case
 * we push each individual object onto the target array rather than
 * pushing the array itself
 */
Common.pushAll = function( array, value ) {
    if ( Common.isArray( value ) ) {
        for ( var i = 0; i < value.length; i++ ) {
            array.push( value[i] );
        }
    }
    else {
        array.push( value );
    }
};

/**
 * Same as every other map function EXCEPT that unlike jQuery's '$.map' it
 * doesn't flatten returned array values.
 *
 * @param things things to map
 * @param callback function to map them
 * @return array the same length of things with the return values
 * of callback applied to them
 */
Common.map = function( things, callback ) {
    var rv = [];
    for ( var i = 0; i < things.length; i++ ) {
        rv.push( callback( things[i], i ) );
    }
    return rv;
};


/**
 * Generate a map, merging the given options with the given
 * defaults -- if a value exists in 'defaults' and not in 'options'
 * we use it; if a value exists in 'options' we use it.
 *
 * @param options set of options
 * @param defaults set of defaults for the options
 * @return new map of options; both arguments are untouched
 */
Common.mergeOptions = function( options, defaults ) {
    // ensure we're not dealing with nulls
    options = options || {};
    defaults = defaults || {};

    // new object for merged properties
    var merged = {};

    // keep track of the keys used in the options so we don't
    // override even if options defines null/false/0
    var existingKeys = {};
    var key;

    for ( key in options ) {
        merged[ key ] = options[ key ];
        existingKeys[ key ] = true;
    }
    for ( key in defaults ) {
        if ( ! existingKeys[ key ] ) {
            merged[ key ] = defaults[ key ];
        }
    }
    return merged;
};
