// define the plan context
TestPlan = function( name ) {
    this.count   = 0;
    this.name    = name || '';
    this.planned = 0;
};

/**
 * Finish the plan, outputting the TAP footer if {@link TestPlan.prototype.isUnplanned()}
 * @return this
 */
TestPlan.prototype.complete = function() {
    if ( this.isValid() && this.isUnplanned() ) {
        TestPlan.TAP.plan( this.count );
    }
    return this;
};

/**
 * Is this unplanned?
 * @return true if this Plan has not had {@link TestPlan.prototype.plan( count )} 
 * called, false if it has
 */
TestPlan.prototype.isUnplanned = function() {
    return this.planned == 0;
};

/**
 * Is this a valid plan? (defined as having a name)
 * @return true if valid, false if not
 */
TestPlan.prototype.isValid = function() {
    return this.name != '';
};

/**
 * Plan the next test
 * @return the count of the current test
 */
TestPlan.prototype.next = function() {
    return ++this.count;
};

/**
 * Setup a plan
 * 
 * @param count number of tests to plan
 * @return this
 */
TestPlan.prototype.plan = function( count ) {
    this.planned = count;
    return this;
};

// The plan currently being executed
TestPlan.current = new TestPlan();



/**
 * A bag of functions to output TAP; replace 'out( msg )' to do something else with
 * the output besides print to STDOUT.
 */
TestPlan.TAP = {

    /**
     * Output a comment
     * @return the current Plan
     */
    comment : function( msg ) {
        TestPlan.TAP.out( "# " + msg );
        return TestPlan.current;
    },
    
    /**
     * Output something
     * @param msg message to output
     * @return the current Plan
     */
    out : function( msg ) {
        print( msg );
        return TestPlan.current;
    },
    
    /**
     * Output a plan count in TAP form ('1..15' for 15 tests) 
     * @return the current Plan
     */
    plan : function( count ) {
        TestPlan.TAP.out( "1.." + count );
        return TestPlan.current;
    },

    /**
     * Output a test in TAP format
     * @param condition test state (boolean)
     * @param msg message to output (always, not just on failure)
     * @param suffixFail additional data to output on failure (surrounded by parens)
     * @return the current Plan
     */
    test : function( condition, msg, suffixFail ) {
        var myCount = TestPlan.current.next();
        var state = condition ? 'ok' : 'not ok';
        var out = state + ' - ' + msg;
        if ( ! condition && suffixFail ) {
            out = out + " (" + suffixFail + ")";
        }
        return TestPlan.TAP.out( out );
    }    
};

// A suite to run

TestPlan.Suite = {
    jsFilter : new java.io.FileFilter({
        accept : function( f ) {
            return f.isFile() && f.getName().endsWith( '.js' );
        }                                                      
    }),

    /**
     * Load a JS file, executing the callbacks as appropriate
     * @param path path to JS file
     * @param beforeFile callback to execute before we load the file
     * @param afterFile callback to execute after we load the file
     */
    doLoad : function( path, beforeFile, afterFile ) {
        if ( beforeFile ) beforeFile( path );
        var loadError;
        try {
            load( path );   
        } 
        catch (x) {
            loadError = x;
        }
        if ( afterFile )  afterFile( path, loadError );
        return TestPlan.Suite;
    },
    
    /**
     * Execute a test suite
     * @param path path to execute; may be a file or a directory
     * @param beforeFile optional callback to execute before every file is loaded (library or test)
     * @param afterFile optional callback to execute after every file is loaded (lbirary or not)
     */
    execute : function( path, beforeFile, afterFile ) {
        var f = new java.io.File( path );
        if ( f.isFile() ) {
            TestPlan.Suite.doLoad( f.getPath(), beforeFile, afterFile );
        }
        else if ( f.isDirectory() ) {
            TestPlan.Suite.loadLibraries( f, beforeFile, afterFile );        
        }
        else {
            print( "# FAIL - do not know how to execute [" + path + "]" );
        }
        return TestPlan.Suite;
    },

    /**
     * Load a bunch of libraries from a directory
     * @param dir a java.io.File object expected to be a directory
     * @param beforeFile optional callback to execute before every file is loaded (library or test)
     * @param afterFile optional callback to execute after every file is loaded (lbirary or not)
     */
    loadLibraries : function( dir, beforeFile, afterFile ) {
        var files = dir.listFiles( TestPlan.Suite.jsFilter );
        for ( var i = 0; i < files.length; i++ ) {
            TestPlan.Suite.doLoad( files[i].getPath(), beforeFile, afterFile );
        }    
        return TestPlan.Suite;
    },

    /**
     * Setup the next plan, using the given path as the name; we'll trim
     * directory characters from the front ('.', './' or '/') before displaying. We'll 
     * also output the previous Plan if it's valid and hasn't been planned.
     * @param path path (a String) to the test file to execute
     * @return the newly created Plan
     */
    nextPlan : function( path ) {
        var prev = TestPlan.current;
        if ( prev.isValid() && prev.isUnplanned() ) {
            TestPlan.TAP.plan( prev.count );
        }
        var display = (path + '').replace( /^(\.\/|\.|\/)/, '' );
        TestPlan.current = new TestPlan( display );
        return TestPlan.current;
    },
    
    /**
     * Execute the full test suite, loading libraries as appropriate 
     * and executing all arguments given.
     */
    run : function() {
        var cwd = new java.io.File( '.' );
        TestPlan.TAP.comment( "CWD: " + cwd.canonicalPath );
        var libDir = new java.io.File( cwd, 'lib' );
        var libExists = libDir.isDirectory();
        TestPlan.TAP.comment( "LIB: " + libDir.canonicalPath + " - " + 
                              ( libExists ? 'exists' : 'does not exist' ) );
        if ( libExists ) {
            TestPlan.Suite.loadLibraries( 
                libDir, null, 
                function( path, loadError ) { 
                    TestPlan.TAP.comment( "LOAD: " + path + ( loadError ? " FAIL: " + loadError : " OK" ) ); 
                } );    
        }
        for ( var c = 0; c  < arguments.length; c++ ) {
            TestPlan.TAP.comment( "RUN: " + arguments[c] );
            TestPlan.Suite.execute( 
                arguments[c], 
                function( path ) { TestPlan.Suite.nextPlan( path ); },
                function( path, loadError ) {
                    if ( loadError ) {
                        var current = TestPlan.current;
                        current.plan(1);
                        fail( "Test load failed: " + loadError );
                    }
                }
            );
        }
        TestPlan.current.complete();           
    }
};

// Below here we're loading into the global namespace

/**
 * Output a failing test (opposite of {@link pass( msg )})
 * @return the current plan
 */
function fail( msg ) {
    return TestPlan.TAP.test( false, msg );
}

/**
 * Output a test depending on the expected and actual values being 
 * equal, using '=='. (Opposite of {@link isnt( msg, notExpected, actual )})
 * 
 * @param msg message to output
 * @param expected expected value
 * @param actual actual value
 * @return the current plan
 */
function is( msg, expected, actual ) {
    return TestPlan.TAP.test( _equals( expected, actual ), msg, 
                              "Expected [" + expected + "], got [" + actual + "]" );
}

/**
 * Output a test depending on the expected and actual values being not equal, using 
 * the inverse of '=='. (Opposite of {@link is( msg, expected, actual )})
 * 
 * @param msg message to output
 * @param notExpected value it's not expected to be
 * @param actual actual value
 * @return the current plan
 */
function isnt( msg, notExpected, actual ) {
    return TestPlan.TAP.test( ! _equals( notExpected, actual ), msg, 
                              "Expected not [" + notExpected + "] got [" + actual + "]" );
}

/**
 * Output a test depending on the actual value being null.
 * @param msg message to output
 * @param actual actual value
 * @return the current plan
 */
function is_null( msg, actual ) {
    return TestPlan.TAP.test( actual == null, msg, 
                              "Expected null, got [" + actual + "]" );
}


/**
 * Output a test depending on the actual value matchign the given regular expression
 * @param msg message to output
 * @param regex RegExp object the actual value is expected to match (using <tt>.search( regex )</tt>)
 * @param actual actual value
 * @return the current plan
 */
function matches( msg, regex, actual ) {
    return TestPlan.TAP.test( actual.search( regex ) != -1, msg, 
                              "Expected to match " + regex + ", got [" + actual + "]" );
}

/**
 * Output a test depending on the given condition being false (opposite of {@link ok( msg, condition )})
 * @param msg message to output
 * @param condition condition to test
 * @return the current plan
 */
function not( msg, condition ) {
    return TestPlan.TAP.test( ! condition, msg );
}

/**
 * Take zero or more arguments and pass them to Rhino's <tt>load()</tt>; a load
 * passes if it doesn't throw an exception.
 * 
 * @return the current plan
 */
function ok_load() {
    for ( var i = 0; i < arguments.length; i++ ) {
        var path = arguments[i];
        try {
            load( path );
            pass( path + ", load success" );
        } 
        catch (x) {
            fail( path + ", load fail: " + x );
        }
    }
    return TestPlan.current;
}

/**
 * Output a test depending on the given condition being true (opposite of {@link not( msg, condition )})
 * @param msg message to output
 * @param condition condition to test
 * @return the current plan
 */
function ok( msg, condition ) {
    return TestPlan.TAP.test( condition, msg );
}

/**
 * Output a passing test (opposite of {@link fail( msg )})
 * @return the current plan
 */
function pass( msg ) {
    return TestPlan.TAP.test( true, msg );
}

/**
 * Plan a number of tests; note that this is not strictly necessary, as TAP supports 
 * outputting the expected number of tests AFTER the tests have been run. But you can 
 * still use it if you want.
 * @return the current plan
 */
function plan( count ) {
    var current = TestPlan.current;
    current.plan( count );
    if ( current.isValid() ) {
        TestPlan.TAP.plan( current.planned );        
    }    
    return TestPlan.current;
}

function _equals( expected, actual )  {
    if ( Array.isArray( expected ) ) {
        return !! expected && !! actual && ! ( expected < actual ||  actual < expected );
    }
    else {
        return expected == actual;
    }
}

// go go go!
TestPlan.Suite.run.apply( TestPlan.Suite, arguments );
