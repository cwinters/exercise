echo "Testing against Jackson 1.9.0..."
rm *.class
echo "  OK: cleaned classes"

javac -cp 'lib/*' *.java 
echo "  OK: compiled"

java -cp .:'lib/*' org.junit.runner.JUnitCore TypeInfoTest

