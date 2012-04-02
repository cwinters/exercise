$(document).ready( function() {
    $( '#has_axe_yes' ).click( function() {
        $( '#axe_extras' ).show();
    });
    $( '#has_axe_no' ).click( function() {
        $( '#axe_extras' ).hide();
    });

    $( '#sample_form' ).submit( function() {
        var errors = [];
        var idToName = [
            { id : 'person_name', name : 'Person name' },
            { id : 'person_age',  name : 'Age' },
            { id : 'physician',   name : 'Doctor' }
        ];
        _.each( idToName, function( pair ) {
            if ( ! $( '#' + pair.id ).val() ) {
                errors.push( pair.name + ' is required.' );
            }
        });
        var hasErrors = errors.length > 0;
        if ( hasErrors ) {
            var errorList = '<ul>' + _.map( errors, function( error ) {
                return '<li>' + error + '</li>'
            }).join( "\n" ) + '</ul>';
            $( '#errors' ).empty().html( errorList ).show();
        }
        return ! hasErrors;
    });
});
