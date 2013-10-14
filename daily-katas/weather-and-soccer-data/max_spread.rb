#!/usr/bin/env ruby

filename = 'weather.dat'

track = {spread: -1, day: 0};
File.readlines(filename).each do |line|
  next unless (line =~ /^\s+\d+/)
  (day, max, min) = line.gsub(/^\s+/, '').split(/\s+/)
  spread = max.to_i - min.to_i
  if spread > track[:spread]
    track = {spread: spread, day: day}
  end
end
puts "Day #{track[:day]} has spread of #{track[:spread]}"
