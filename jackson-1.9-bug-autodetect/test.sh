echo "Testing against Jackson 1.8.5..."
rm *.class
echo "  OK 1.8: cleaned classes"
javac -cp 'lib/*':'lib/1.8/*' *.java 
echo "  OK 1.8: compiled"
java -cp .:'lib/*':'lib/1.8/*' org.junit.runner.JUnitCore FieldBugTest

echo "Testing against Jackson 1.9.0..."
rm *.class
echo "  OK 1.9: cleaned classes"
javac -cp 'lib/*':'lib/1.9/*' *.java 
echo "  OK 1.9: compiled"
java -cp .:'lib/*':'lib/1.9/*' org.junit.runner.JUnitCore FieldBugTest

