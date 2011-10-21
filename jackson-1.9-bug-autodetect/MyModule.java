import org.codehaus.jackson.Version;
import org.codehaus.jackson.map.AnnotationIntrospector;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.introspect.JacksonAnnotationIntrospector;
import org.codehaus.jackson.map.module.SimpleModule;

public class MyModule extends SimpleModule {
    public MyModule() {
        super( "MyModule", new Version( 3, 1, 4, null ) );
    }

    public void setup( final SetupContext context ) {
        super.setupModule( context );

        final SerializationConfig serializationConfig = context.getSerializationConfig();

        serializationConfig.enable( SerializationConfig.Feature.INDENT_OUTPUT );
        serializationConfig.disable( SerializationConfig.Feature.AUTO_DETECT_FIELDS );
        serializationConfig.disable( SerializationConfig.Feature.AUTO_DETECT_GETTERS );
        serializationConfig.disable( SerializationConfig.Feature.AUTO_DETECT_IS_GETTERS );
        serializationConfig.disable( SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS );

        final DeserializationConfig deserializationConfig = context.getDeserializationConfig();
        deserializationConfig.disable( DeserializationConfig.Feature.AUTO_DETECT_CREATORS );
        deserializationConfig.disable( DeserializationConfig.Feature.AUTO_DETECT_FIELDS );
        deserializationConfig.disable( DeserializationConfig.Feature.AUTO_DETECT_SETTERS );
        deserializationConfig.disable( DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES );
        deserializationConfig.disable( DeserializationConfig.Feature.USE_GETTERS_AS_SETTERS );

        final AnnotationIntrospector primary = new JacksonAnnotationIntrospector();
        serializationConfig.insertAnnotationIntrospector( primary );
        deserializationConfig.insertAnnotationIntrospector( primary );
    }
    
}