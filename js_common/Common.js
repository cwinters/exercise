// Additions to Function are from JavaScript, the Good Parts (4.7)
// see also underscore.x.x.x.js for functional programming idioms

/**
 * Add a new method to a 'class'; used here to explicitly define inheritance
 *
 * @param name name of method to add
 * @param func function to add
 */
Function.prototype.method = function( name, func ) {
    this.prototype[ name ] = func;
    return this;
};

/**
 * Define an 'inherits' method on functions so you can do:
 *
 * <pre>
 * Common.ValidationRule.Delegate = function( rule ) {
 *     this.rule = rule;
 * };
 *
 * Common.ValidationRule.Delegate.inherits( Common.ValidationRule.Base );
 * </pre>
 */
Function.method( 'inherits', function ( Parent ) {
    this.prototype = new Parent();
    this.prototype.superclass = Parent;
    return this;
});

Common = {};

Common.log = function() {
    if ( window.console && window.console.log ) {
        window.console.log.apply( window.console, arguments );
    }
};

Common.is = function ( o ) { return typeof( o ) !== 'undefined'; };

Common.isFunction = function( o ) {
        return Common.is( o ) && typeof( o ) === "function";
};

