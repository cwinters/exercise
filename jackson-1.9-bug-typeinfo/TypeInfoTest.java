import org.codehaus.jackson.annotate.JsonTypeInfo;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.io.IOException;

public class TypeInfoTest {

    private ObjectMapper mapper;

    @Before
    public void createMapper()
    {
        mapper = new ObjectMapper();

        // when we pass in 'Object.class' to readValue() it's a signal for the mapper to peek 
        // into the data to find the actual class
        mapper.enableDefaultTyping( ObjectMapper.DefaultTyping.OBJECT_AND_NON_CONCRETE, 
                                    JsonTypeInfo.As.PROPERTY );

    }

    @Test
    public void testBasicBiDirectional() throws IOException
    {
        final Player toSerialize = new Player( "Michael Jordan", "Forward", 1987 );
        final String json = mapper.writeValueAsString( toSerialize );
        assertNotNull( json );

        final Player deserialized = (Player)mapper.readValue( json, Named.class );
        assertEquals( deserialized, toSerialize );
    }
}

