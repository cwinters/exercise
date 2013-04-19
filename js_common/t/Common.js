ok_load( 'Common.js' );

ok( "Anonymous function isa function",
    Common.isFunction( function( x ) { var a = x; } ) );

function foo( x ) { var a = x; }

ok( "Named global function isa function",
    Common.isFunction( foo ) );

ok( "Namespaced function isa function",
    Common.isFunction( Common.isFunction ) );

not( "String is-not-a function",
     Common.isFunction( "foo" ) );

not( "Number is-not-a function",
     Common.isFunction( 2 ) );

not( "Date is-not-a function",
     Common.isFunction( new Date() ) );

