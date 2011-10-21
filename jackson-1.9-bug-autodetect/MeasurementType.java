import org.codehaus.jackson.annotate.JsonCreator;
import com.google.common.collect.Maps;
import java.util.HashMap;
import java.util.Map;

public class MeasurementType extends RefreshableItem {
    private static final Map<String,MeasurementType> TYPE_BY_KEY = Maps.newHashMap();

    public static final MeasurementType AMBULATION = new MeasurementType( "AMBULATION" );
    public static final MeasurementType BATHING    = new MeasurementType( "BATHING" );

    @JsonCreator
    public static MeasurementType valueOf( final String type ) {
        return type == null
               ? null
               : TYPE_BY_KEY.get( type.toLowerCase() );
    }

    private MeasurementType( final String key )
    {
        super( key, new HashMap<String,Object>() );
        TYPE_BY_KEY.put( key.toLowerCase(), this );
    }

    public String toString()
    {
        return getKey();
    }
}
