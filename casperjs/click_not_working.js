var casper = require('casper').create();
casper.start( 'http://cwinters.com/testing/casper_eval_context.html' );

// first click the A tag by element selector
casper.then( function() {
    console.log( "Clicking A tag by selector..." );
    this.click( 'p a' );
});

// then click the A tag by ID
casper.then( function() {
    console.log( "Page: " + this.getTitle() );
    console.log( "Clicking A tag by ID..." );
    this.click( '#next_page_link' );
});

// then click the DIV tag
casper.then( function() {
    console.log( "Page: " + this.getTitle() );
    console.log( "Clicking DIV..." );
    this.click( '#next_page_div' );
});

casper.then( function() {
    console.log( "Page: " + this.getTitle() );
});

casper.run();