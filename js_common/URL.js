// Simple URL parsing and generation

Common.URL = function( url ) {
    // protocol, domain, and path
    this._base = null;

    // does not include leading '#'
    this._fragment = null;

    // key => array-of-values
    this._query = {};

    if ( Common.isNotBlank( url ) ) {
        // http://www.abc.com/def/ghi.html?jkl=mno&pqr=stu#vwx
        var pieces = url.match(/([^\\?#]+)(\?[^#]*)?(#.*)?/);

        // TODO: truncate the fragment

        // http://www.abc.com/def/ghi.html
        this.assignBase( pieces[1] );

        if ( Common.isNotBlank( pieces[2] ) ) {
            var queryPairs = pieces[2].substr(1).split( /[\&;]/ );
            for ( var i = 0; i < queryPairs.length; i++ ) {
                var pair = queryPairs[i].split( "=" );
                // jkl, mno
                // pqr, stu
                this.q( Common.URL._decode( pair[0] ), Common.URL._decode( pair[1] ) );
            }
        }

        // #vwx
        if ( Common.isNotBlank( pieces[3] ) ) {
            this.assignFragment( pieces[3] );
        }
    }
};

/**
 * Add a query param
 * @param key key of param
 * @param value value of param
 * @return this
 */
Common.URL.prototype.q = function( key, value ) {
    if ( ! this._query[ key ] ) {
        this._query[ key ] = [];
    }
    this._query[ key ].push( value );
    return this;
};

Common.URL.prototype.assignBase = function( base ) {
    // given nothing/null, remove base
    if ( Common.isBlank( base ) ) {
        this._base = null;
    }
    else {
        this._base = base;
    }
    return this;
};

Common.URL.prototype.assignFragment = function( fragment ) {
    // given nothing/null, remove fragment
    if ( Common.isBlank( fragment ) ) {
        this._fragment = null;
    }
    else {
        // strip off a leading hashtag and decode
        this._fragment = Common.URL._decode( fragment.replace( /^#/, '' ) );
    }
    return this;
};

Common.URL.prototype.base = function() {
    return this._base;
};

/**
 * @return the actual fragment, not url-encoded
 */
Common.URL.prototype.fragment = function() {
    return this._fragment;
};

/**
 * @return the fragment with a leading '#' and url-encoded
 */
Common.URL.prototype.fragmentToString = function() {
    return Common.isBlank( this._fragment ) ? '' : '#' + Common.URL._encode( this._fragment );
};

/**
 * @return all query parameters with keys as the parameter names and values as arrays; note
 * that neither are URI-encoded
 */
Common.URL.prototype.queryParams = function() {
    return this._query;
};

/**
 * @return string you can append to a URL with the query params in this object; encodes
 * all key/value pairs and includes the leading '?'. For example, given:
 *
 * <pre>
 *    var u = new Common.URL().q( 'foo', 'bar' ).q( 'foo', 'baz' ).q( 'coffee', 'cuppa joe' );
 *    var q = u.queryParamsToString();
 * </pre>
 *
 * 'q' should be something like:
 *
 * <pre>
 *     ?foo=bar&foo=baz&coffee=cuppa%20joe
 * </pre>
 */
Common.URL.prototype.queryParamsToString = function() {
    var me = this;
    if ( _.size( me._query ) == 0 ) {
        return '';
    }
    // generate an array per query key of key/value pairs; so given:
    //     new Common.URL().q( 'foo', 'bar' ).q( 'foo', 'baz' ).q( 'coffee', 'cuppa joe' );
    // this would be:
    // [
    //    [ 'foo=bar', 'foo=baz' ],
    //    [ 'coffee=cuppa%20joe' ]
    // ]
    var arraysPerKey = _.map( _.keys( me._query ), function( key ) {
        return _.map( me._query[ key ], function( value ) {
            return Common.URL._encode( key ) + "=" + Common.URL._encode( value );
        });
    });
    return '?' + _.flatten( arraysPerKey ).join( '&' );
};

Common.URL.prototype.toString = function() {
    return this.base() + this.queryParamsToString() + this.fragmentToString();
};

Common.URL._decode = function( str ) {    
    return decodeURI( str ).replace( /\+/g, ' ' );
};

Common.URL._encode = function( str ) {
    return encodeURIComponent( str ).replace( /%2F/g, '/' );
};

/**
 * Assign base host + port information from the window, then append the path
 * @param path path to append (can have query string, whatever)
 * @param locationContainer something that has a 'location' property with the keys 'protocol', 
 * 'hostname', and 'port'; if not given we'll try to use 'window.location'
 * @return string with new URL
 */
Common.URL.fullyQualify = function( path, locationContainer ) {
    var location;
    if ( locationContainer ) {
        location = locationContainer.location;
    }
    else if ( typeof( window ) != 'undefined' && window.location ) {
        location = window.location;
    }
    
    if ( location ) {
        var url = new Common.URL();
        var protocol = location.protocol || 'http:'; 
        var host = protocol + '//' + location.hostname;
        var port = location.port && location.port > 0 ? location.port : 80;
        host = host + ':' + port;
        url.assignBase( host + path );
        return url.toString();
    }
    else {
        return path;
    }
};

