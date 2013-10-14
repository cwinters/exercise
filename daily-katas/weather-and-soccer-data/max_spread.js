var fs = require('fs');
var lazy = require('lazy');

var filename = 'weather.dat';
lazy(fs.createReadStream(filename))
    .lines
    .map(String)
    .map(function(line) {
        return line.replace(/^\s+/, '');
    })
    .filter(function(line) {
        return line.match(/^\d+/);
    })
    .map(function(line) {
        var items = line.split(/\s+/);
        return {day: items[0], spread: parseInt(items[1]) - parseInt(items[2])};
    })
    .join(function(tuples) {
        var maxSpread = tuples.reduce(function(greatest, item) {return greatest.spread > item.spread ? greatest : item}, 
                                      {day: 0, spread: 0});
        console.log("Day " + maxSpread.day + " has spread of " + maxSpread.spread);
    });
