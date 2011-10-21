import org.codehaus.jackson.annotate.JsonProperty;

public class SpecificationHolder {
    @JsonProperty private String id;
    @JsonProperty private String measurementType;
    private MeasurementType measurementTypeEnum;

    public SpecificationHolder() {}

    public String getId() { return id; }
    public String getMeasurementType() { return measurementType; }
    public MeasurementType getMeasurementTypeEnum() { return measurementTypeEnum; }

    public void setMeasurementType( String text ) {
        measurementType = text;
        if ( text != null ) {
            measurementTypeEnum = MeasurementType.valueOf( text );
        }
    }

    public void setMeasurementTypeEnum( MeasurementType type ) {
        measurementTypeEnum = type;
        if ( type != null ) {
            measurementType = type.getKey();
        }
    }

    public String toString() {
        return id + ": " + measurementType;
    }
}