echo "Testing against Jackson 1.9.0..."
rm -rf classes/ ; mkdir classes/
echo "  OK: cleaned classes"

javac -cp 'lib/*' JsonToExcel.java
echo "  OK: compiled"

java -cp .:'lib/*' JsonToExcel test.json

