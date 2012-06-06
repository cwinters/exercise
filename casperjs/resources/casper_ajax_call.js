$(document).ready( function() {
  $( '#generate_list' ).click( Page.fetchLists.click );
});

var Page = {
    lists : {},
    fetchLists : {
        click : function() {
            console.log( "Fetching lists..." );
            $.ajax({
                dataType : 'json',
                type     : 'POST',
                url      : 'casper_ajax_call_list.json'
            })
            .done( Page.fetchLists.success )
            .fail( Page.fetchLists.failure );
        },
        success : function( data ) {
            console.log( "SUCCESS! List results: " + JSON.stringify( data ) );
            var content = [ '<div id="lists">' ];
            _.each( data, function( listItem ) {
                content.push( '<div id="list_' + listItem.id + '">' + listItem.name + '</div>' );
                Page.lists[ listItem.id ] = listItem;
            });
            content.push( '</div>' );
            $( '#generate_list' ).after( content.join( "\n" ) );
            $( '#lists div' ).click( Page.fetchResults.click );
        }
    },
    fetchResults : {
        click : function() {
            var itemId = $(this).attr( 'id' ).split( '_' )[1];
            var item = Page.lists[ itemId ];
            console.log( "Fetching query results..." );
            $.ajax({
                dataType : 'json',
                type     : 'POST',
                url      : item.url
            })
            .done( Page.fetchResults.success )
            .fail( Page.fetchResults.failure );
        },
        success : function( data ) {
            console.log( "SUCCESS! Query results: " + JSON.stringify( data ) );
            var content = [ '<p>List: ' + data.name + ' @ ' + new Date( data.created ) + '</p>' ];
            content.push( '<ul>' );
            _.each( data.members, function( member ) {
                content.push( '<li><a href="#" id="' + member.id + '">' + member.name + '</a></li>' );
            });
            content.push( '</ul>' );
            var listSel = '#list_' + data.id;
            $( listSel ).empty().html( content.join( "\n" ) );
            $( listSel + ' ul li a' ).click( Page.decorateResults.click );
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

