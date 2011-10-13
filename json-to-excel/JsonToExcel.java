import com.google.common.base.Joiner;
import com.google.common.io.Files;
import org.codehaus.jackson.map.ObjectMapper;
import java.io.*;
import java.nio.charset.Charset;
import java.util.*;

public class JsonToExcel
{
    public static void main( final String ... args ) throws Exception {
        if ( args.length == 0 ) {
            out( "Usage: JsonToExcel input-file [output-file]" );
            System.exit(1);
        }

        // slurp in the json and read the fields
        final Charset cs = Charset.defaultCharset();
        final String json = Files.toString( new File( args[0] ), cs );        
        final List<Map<String,String>> records = new ObjectMapper().readValue( json, List.class );
        final List<String> fields = readFields( records );

        // open the output file and write headers
        final String filename = args.length == 1 ? "from_json.csv" : args[1];
        final Joiner tabJoiner = Joiner.on( '\t' );
        final PrintWriter writer = filename.equals( "-" ) 
                                   ? System.out 
                                   : new PrintWriter( Files.newWriter( new File( filename ), cs ) );
        writer.write( tabJoiner.join( fields ) + "\n" );

        // write data foreach record
        for ( final Map<String,String> record : records ) {
            final List<String> values = new ArrayList<String>();
            for ( final String field : fields ) {
                final String value = record.get( field );
                values.add( value == null ? "" : value );
            }
            writer.write( tabJoiner.join( values ) + "\n" );
        }
        writer.close();
        out( "OK: Wrote " + records.size() + " records to " + filename );
    }

    private static List<String> readFields( final List<Map<String,String>> records ) {
        final Set<String> unique = new HashSet<String>();
        for ( final Map<String,String> record : records ) {
            unique.addAll( record.keySet() );
        }
        final List<String> sorted = new ArrayList<String>( unique );
        Collections.sort( sorted );
        return sorted;
    }

    private static void out( String msg ) { System.out.println( msg ); }
}