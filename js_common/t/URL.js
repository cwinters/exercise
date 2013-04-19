ok_load( 'Common.js', 'Strings.js', 'URL.js' );

// PARSING

var basicUrl = 'http://www.cwinters.com/';
var basic = new Common.URL( basicUrl );

is( "Basic toString same as given",
    basicUrl, basic.toString() );
is( "Basic provides base", 
    basicUrl, basic.base() );
is_null( "Basic has null fragment", basic.fragment() );
is( "Basic has empty fragment to string", 
    '', basic.fragmentToString() );
is( "Basic has no query params",
    0, _.size( basic.queryParams() ) );
is( "Basic has blank query params as string",
    '', basic.queryParamsToString() );

var querySingleUrl = 'http://www.google.com/?q=singing+elephants';
var querySingle = new Common.URL( querySingleUrl );

is( "Query single toString close to given (space encoding)",
    querySingleUrl.replace( /\+/, '%20' ), querySingle.toString() );
is( "Query single provides base",
    "http://www.google.com/", querySingle.base() );
is_null( "Query single has null fragment", querySingle.fragment() );
is( "Query single has blank fragment to string", 
    '', querySingle.fragmentToString() );
is( "Query single has one query param",
    1, _.size( querySingle.queryParams() ) );
is( "Query single param matches (not encoded)",
    'singing elephants', querySingle.queryParams()['q'] );
is( "Query single query params as string",
    '?q=singing%20elephants', querySingle.queryParamsToString() );

var queryMultipleWithFragmentUrl = 'http://www.amazon.com/gp/video/help/survey?streaming_session_id=15361-f398a1f9-80cc-448e-9397-4cd47f30a7b7&customer_rating=5&ref_=pe_69220_22347510#lazy%20bones';
var queryMultipleWithFragment = new Common.URL( queryMultipleWithFragmentUrl );
is( "Query multiple with fragment toString matches self",
    queryMultipleWithFragmentUrl, queryMultipleWithFragment.toString() );
var queryMultipleParams = queryMultipleWithFragment.queryParams();
is( "Query multiple with fragment param count",
    3, _.size( queryMultipleParams ) );
is( "Query multiple with fragment first query param",
    '15361-f398a1f9-80cc-448e-9397-4cd47f30a7b7', queryMultipleParams['streaming_session_id'] );
is( "Query multiple with fragment second query param",
    '5', queryMultipleParams['customer_rating'] );
is( "Query multiple with fragment third query param",
    'pe_69220_22347510', queryMultipleParams['ref_'] );
is( "Query multiple with fragment has fragment",
    'lazy bones', queryMultipleWithFragment.fragment() );
is( "Query multiple with fragment has fragment stringified",
    '#lazy%20bones', queryMultipleWithFragment.fragmentToString() );

var fragmentOnlyUrl = 'https://twitter.com/#!/kidsruby/statuses/160077711367344129';
var fragmentOnly = new Common.URL( fragmentOnlyUrl );
is( "Fragment only stringifies to self",
    fragmentOnlyUrl, fragmentOnly.toString() );
is( "Fragment only has fragment",
    '!/kidsruby/statuses/160077711367344129', fragmentOnly.fragment() );
is( "Fragment only has stringified fragment",
    '#!/kidsruby/statuses/160077711367344129', fragmentOnly.fragmentToString() );

// BUILDING

var a = new Common.URL( 'http://www.cwinters.com' ).q( "first", "second" );
is( "Build with one query string strigifies",
    "http://www.cwinters.com?first=second", a.toString() );
is( "Build with one query string has right query param",
    1, _.size( a.queryParams() ) );
is( "Build with one query string has right query param",
    "second", a.queryParams()["first"] );

var b = new Common.URL( '/search' )
                .q( 'query', 'simple' )
                .q( 'query', 'complicated' );
is( "Build with one query and two values stringifies",
    "/search?query=simple&query=complicated", b.toString() );
is( "Build with two values for one query has right count",
    2, _.size( b.queryParams()['query'] ) );
is( "Build with two values for one query has right values",
    [ 'simple', 'complicated' ], b.queryParams()['query'] );
