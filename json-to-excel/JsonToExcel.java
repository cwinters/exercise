import com.vocollect.FileUtil;
import com.vocollect.Util;
import org.codehaus.jackson.map.ObjectMapper;
import java.io.InputStreamReader;
import java.util.*;

public class JsonToExcel
{
    public static void main( final String ... args ) throws Exception {
        final String json = FileUtil.slurp( new InputStreamReader( System.in ) );        
        final List<Map<String,String>> records = new ObjectMapper().readValue( json, List.class );
        final List<String> fields = readFields( records );
        System.out.println( Util.join( fields, "\t" ) );
        for ( final Map<String,String> record : records ) {
            final List<String> values = new ArrayList<String>();
            for ( final String field : fields ) {
                final String value = record.get( field );
                values.add( value == null ? "" : value );
            }
            System.out.println( Util.join( values, "\t" ) );
        }
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
}