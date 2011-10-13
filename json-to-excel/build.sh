echo "Testing against Jackson 1.9.0..."
rm -rf classes/ ; mkdir classes/
echo "  OK: cleaned classes"

javac -cp 'lib/*' JsonToExcel.java
echo "  OK: compiled"

zip -r json2excel.zip json2excel.bat *.class lib