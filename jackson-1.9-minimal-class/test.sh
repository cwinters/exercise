echo "Testing against Jackson 1.9.0..."
rm -rf classes/ ; mkdir classes/
echo "  OK: cleaned classes"

javac -cp 'lib/*' -sourcepath src -d classes `find src/ -name "*.java"`
echo "  OK: compiled"

java -cp 'classes/':'lib/*' org.junit.runner.JUnitCore MinimalClassTest

