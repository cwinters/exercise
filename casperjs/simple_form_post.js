// trying to replicate behavior I'm seeing where I submit a form
// (via fill( {...}, true )) and follow with a .then(
// function...) but the original page is still loaded unless I
// wait for a second or two...

var casper = require('casper').create();

casper.start( 'http://cwinters.com/testing/form_one.html', function() {
    this.test.assertTitle( 'First form', 'Title for initial form' );
    this.fill( 'form#first', {
        exclaim : "John Henry was a steel drivin' man!"
    }, true );
});

casper.then( function() {
    this.test.assertTitle( 'Second form', 'Title for POST target (before_wait)' );    
    this.capture( 'simple_form_post_1_before_wait.png' );
    this.wait( 1000 );
    this.test.assertTitle( 'Second form', 'Title for POST target (after_wait)' );    
    this.capture( 'simple_form_post_2_after_wait.png' );
});

casper.run( function() {
    this.test.renderResults( true );
});