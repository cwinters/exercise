import org.codehaus.jackson.annotate.JsonAutoDetect.Visibility;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.io.IOException;

public class FieldBugTest {

    private ObjectMapper mapper;

    @Before
    public void createMapper()
    {
        mapper = new ObjectMapper();
        mapper.registerModule( new MyModule() );
        mapper.setVisibilityChecker( 
            mapper.getVisibilityChecker().withGetterVisibility( Visibility.NONE ) ) ;
    }

    @Test
    public void testBasic() throws IOException
    {
        String one = "{ \"measurementType\" : \"AMBULATION\", \"id\" : \"Walking\" }";
        SpecificationHolder holder = mapper.readValue( one, SpecificationHolder.class );
        assertEquals( holder.toString(), "Walking: AMBULATION" );
    }
}

