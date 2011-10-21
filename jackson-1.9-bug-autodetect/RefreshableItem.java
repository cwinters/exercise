import org.codehaus.jackson.annotate.JsonValue;
import com.google.common.collect.ImmutableMap;
import java.util.Map;

public abstract class RefreshableItem {

    private String key;
    private ImmutableMap<String,Object> properties;
    
    protected RefreshableItem( String key, Map<String,Object> properties ) {
        this.key = key;
        this.properties = properties == null
                          ? ImmutableMap.<String, Object>of()
                          : ImmutableMap.copyOf( properties );
    }

    @JsonValue
    public String getKey() {
        return key;
    }

    public Map<String,Object> getProperties() {
        return properties;
    }
}