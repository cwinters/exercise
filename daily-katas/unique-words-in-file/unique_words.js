var async = require('async');
var fs = require('fs');
var lazy = require('lazy');
var sprintf = require('sprintf');

function clean(word) {
    return word.match(/^\d+$/) ? null : word.toLowerCase().replace(/[\W_]/g, '');
}

function nonEmpty(word) {
    return word != null && word != '';
}

function toWords(line) {
    return line.split(/(\s+|\-\-)/).map(clean).filter(nonEmpty);
}

function processFile(counts, filename, callback) {
    new lazy(fs.createReadStream(filename))
        .lines
        .map(String)
        .map(toWords)
        .join(function(wordLists) {
            //console.log("File " + filename + "; " + wordLists.length + " word lists");
            wordLists.forEach(function(wordList) {
                wordList.forEach(function(word) {
                    if (counts.hasOwnProperty(word)) {
                        counts[word]++;
                    }
                    else {
                        counts[word] = 1;
                    }
                });
            });
            callback(null, counts);
        });
}

var filenames = process.argv.splice(2);
var allCounts = async.reduce(filenames, {}, processFile, function(err, allCounts) {
    Object.keys(allCounts)
          .map(function(key) { return [key, allCounts[key]] })
          .sort(function(a, b) {
              var aCount = a[1];
              var bCount = b[1];
              if (bCount > aCount) return 1;
              if (bCount < aCount) return -1;
              return a[0] < b[0];
          })
          .forEach(function(pair) {
              console.log(sprintf('%15s: %s', pair[0], pair[1]));
          });
});
;

