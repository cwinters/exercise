package eg;

import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.annotate.JsonTypeInfo;

@JsonTypeInfo( use = JsonTypeInfo.Id.MINIMAL_CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@t" )
public abstract class Named {
    private final String name;

    protected Named( String name ) {
        this.name = name;
    }

    @JsonProperty 
    public String getName() { return name; }

    public boolean equals( Object o ) {
        final Named other = (Named)o;
        return name.equals( other.name );
    }
}
