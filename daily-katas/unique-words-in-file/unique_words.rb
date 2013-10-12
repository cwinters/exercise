#!/usr/bin/env/ruby

def clean(word)
  word.match(/^\d+$/) ? nil : word.downcase.gsub(/[\W_]/, '')
end

def print_as_is(counts)
  counts.each {|word, count| puts sprintf("%15s: %s", word, count)}
end

def print_sorted(counts)
  counts.to_a
    .sort {|a,  b| 
      rv = b[1] <=> a[1]
      rv == 0 ? a[0] <=> b[0] : rv 
    }
    .each {|pair|
      puts sprintf("%15s: %s", *pair)
    }
end

def process_file(sums, filename)
  File.readlines(filename).each do |line|
    line.strip.split(/(\-\-|\s+)/).each do |word|
      cleaned = clean(word)
      unless cleaned.nil? || cleaned == ''
        sums[cleaned] ||= 0
        sums[cleaned] += 1
      end
    end
  end
  sums
end

counts = ARGV.reduce({}) {|word_counts, filename| process_file(word_counts, filename)}
print_sorted(counts)
#print_as_is(counts)
