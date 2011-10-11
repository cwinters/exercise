import eg.Named;
import eg.animal.Zebra;
import eg.person.Player;
import org.codehaus.jackson.annotate.JsonTypeInfo;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.io.IOException;

public class MinimalClassTest {

    private ObjectMapper mapper;

    @Before
    public void createMapper()
    {
        mapper = new ObjectMapper();

        // when we pass in 'Object.class' to readValue() it's a signal for the mapper to peek 
        // into the data to find the actual class
        mapper.enableDefaultTyping( ObjectMapper.DefaultTyping.OBJECT_AND_NON_CONCRETE, 
                                    JsonTypeInfo.As.PROPERTY );
        mapper.setSerializationConfig( 
            mapper.getSerializationConfig().with( SerializationConfig.Feature.USE_STATIC_TYPING ) );
    }

    @Test
    public void testPersonBiDirectional() throws IOException
    {
        final Player toSerialize = new Player( "Michael Jordan", "Forward", 1987 );
        final String json = mapper.writeValueAsString( toSerialize );
        assertNotNull( json );
        System.out.println( "Player (serialized without Named.class):\n" + json );
        System.out.println( "Player (serialized with Named.class):\n" + 
                            mapper.writerWithType( Named.class ).writeValueAsString( toSerialize ) );

        final Player deserialized = (Player)mapper.readValue( json, Named.class );
        System.out.println( "Player (deserialized):\n" + deserialized );
        assertEquals( toSerialize, deserialized );
    }

    @Test
    public void testZebraBiDirectional() throws IOException
    {
        final Zebra toSerialize = new Zebra( "Bouncy", 37 );
        final String json = mapper.writeValueAsString( toSerialize );
        assertNotNull( json );
        System.out.println( "Zebra (serialized without Named.class):\n" + json );
        System.out.println( "Zebra (serialized with Named.class):\n" + 
                            mapper.writerWithType( Named.class ).writeValueAsString( toSerialize ) );

        final Zebra deserialized = (Zebra)mapper.readValue( json, Named.class );
        assertEquals( deserialized, toSerialize );
    }
}

