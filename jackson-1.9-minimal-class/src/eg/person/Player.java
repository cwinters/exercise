package eg.person;

import eg.Named;
import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

public class Player extends Named {
    @JsonProperty private String position;
    @JsonProperty private int year;

    @JsonCreator
    public Player( @JsonProperty( "name" ) String name,
                   @JsonProperty( "position" ) String position,
                   @JsonProperty( "year" ) int year )
    {
        super( name );
        System.out.println( "Called creator!" );
        this.position = position;
        this.year = year;
    }

    public String getPosition() { return position; }
    public int getYear() { return year; }

    public boolean equals( Object o ) {
        Player other = (Player)o;
        return super.equals( other ) 
               && getPosition().equals( other.getPosition() )
               && getYear() == other.getYear();
    }

    public String toString() {
        return getName() + ": " + position + " @ " + year;
    }
}
