package MyFlickr;

use strict;
use File::Slurp  qw( read_file );
use Flickr::API;
use JSON;

my ( $API, $INFO );

sub API {
  unless ( $API ) {
    my $creds = read_file( 'credentials.json' );
    $INFO = JSON->new->allow_nonref->decode( $creds );
    $API  = Flickr::API->new( $INFO );
  }
  return $API;
}

sub get_token {
  my $api = API();
  my $response = $api->execute_method('flickr.auth.getToken', {
    frob => $INFO->{frob}
  });
  return $response;
}

sub get_untagged {
  my $api = API();
  my $request = Flickr::API::Request->new({
    method => 'flickr.photos.getUntagged',
    args   => { auth_token => $INFO->{token} },
  });
  my $response = $api->execute_request( $request );
  return $response;
}

sub request_auth_url {
  my $api = API();
  my $uri = $api->request_auth_url( 'read', $INFO->{frob} );
  return $uri;
}

sub request_frob {
  my $response = API()->execute_method('flickr.auth.getFrob', {} );
  return $response;
}

1;
