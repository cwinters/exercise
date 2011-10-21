echo "Testing against Jackson 1.8.5..."
rm *.class
javac -cp 'lib-1.8/*' *.java 
java -cp .:'lib-1.8/*' org.junit.runner.JUnitCore FieldBugTest

echo "Testing against Jackson 1.9.0..."
rm *.class
javac -cp 'lib-1.9/*' *.java 
java -cp .:'lib-1.9/*' org.junit.runner.JUnitCore FieldBugTest

