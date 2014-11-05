#!/usr/bin/env python

import operator, re, sys

nonword = re.compile('[\W_]')
line_splitter = re.compile('(\s+|\-\-)')
empty = re.compile('^\s*$')
digits = re.compile('^\d+$')

def clean(word):
    if empty.match(word) or digits.match(word):
        return None
    return nonword.sub('', word.lower())

def count_words(counts, path):
    for line in file(path):
        for word in line_splitter.split(line.strip()):
            cleaned = clean(word)
            if not cleaned:
                continue
            elif cleaned in counts:
                counts[cleaned] += 1
            else:
                counts[cleaned] = 1

if __name__ == "__main__":
    print ' '.join(sys.argv[1:])
    words = {}
    for path in sys.argv[1:]:
        count_words(words, path)
    for word, count in sorted(words.items(), key=operator.itemgetter(1), reverse=True):
        print "%15s: %s" % (word, count)
