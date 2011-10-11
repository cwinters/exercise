package eg.animal;

import eg.Named;
import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

public class Zebra extends Named {
    @JsonProperty private int stripes;

    @JsonCreator
    public Zebra( @JsonProperty( "name" ) String name,
                  @JsonProperty( "stripes" ) int stripes )
    {
        super( name );
        this.stripes = stripes;
    }

    public int getStripes() { return stripes; }

    public boolean equals( Object o ) {
        Zebra other = (Zebra)o;
        return super.equals( other ) 
               && stripes  == other.stripes;
    }

    public String toString() {
        return getName() + ": " + stripes + " stripes";
    }
}
