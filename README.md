### handlebars_example

Example(s) of using handlebars.js.

### jackson-1.9-bug-autodetect/

* test bug where undecorated property of parent is included in
  serialized data

Ref: http://jira.codehaus.org/browse/JACKSON-685

### jackson-1.9-bug-typeinfo/

* for classes whose parent has a @JsonTypeInfo annotation, ensure
  that not just the parent properties are included in the
  deserialization

### jackson-1.9-minimal-class/

* trying out different ways to use @JsonTypeInfo + MINIMAL_CLASS on a parent class 
  for both serialization and deserialization

Ref: http://jackson-users.ning.com/forum/topics/jsontypeinfo-with-minimal-class-expects-leading

### json-to-excel/

* naive transformation of JSON array with simple field values to a CSV file

