var casper = require('casper').create();

casper.start( 'http://www.cwinters.com/testing/casper_click_display.html' );

casper.then( function() {
    this.viewport( 800, 600 );
    this.click( '#generate_dom' );
    console.log( "Clicked!" );    
    this.waitUntilVisible( '#created_item', function() {
        console.log( "New DOM item is revealed! Content: " + this.evaluate( function() { return $( '#created_item' ).text(); } ) );
    }, function() {
        console.log( "Timeout hit on waiting for new DOM item." );
    });
});

casper.run();