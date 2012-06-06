$(document).ready( function() {
  $( '#generate_list' ).click( Page.fetchResults.click );
});

var Page = {
    fetchResults : {
        click : function() {
            console.log( "Fetching query results..." );
            $.ajax({
                dataType : 'json',
                type     : 'POST',
                url      : 'casper_ajax_call_results_1.json'
            })
            .done( Page.fetchResults.success )
            .fail( Page.fetchResults.failure );
        },
        success : function( data ) {
            console.log( "SUCCESS! Query results: " + JSON.stringify( data ) );
            var content = [ '<div id="wishlist">', '<p>List: ' + data.name + ' @ ' + new Date( data.created ) + '</p>' ];
            content.push( '<ul>' );
            _.each( data.members, function( member ) {
                content.push( '<li><a href="#" id="' + member.id + '">' + member.name + '</a></li>' );
            });
            content.push( '</ul>', '</div>' );
            $( '#generate_list' ).after( content.join( "\n" ) );
            $( '#wishlist ul li a' ).click( Page.decorateResults.click );
        },
        failure : function( xhr, status, errorThrown ) {
            console.log( "FAIL! [Status: " + status + "] [Error: " + errorThrown + "]" );
            $( '#generate_list' ).after( "<p>Caught error! Error: " + errorThrown + "</p>" );
        }
    },
    decorateResults : {
        click : function() {
            var id = $(this).attr( 'id' );
            alert( "Clicked on ID: " + id );
        }
    }
};

