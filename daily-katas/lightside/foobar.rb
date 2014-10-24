#!/usr/bin/ruby

def foobar(a, b)
  min = [a, b].min
  max = [a, b].max
  (min..max).each do |count|
    case
    when count % 3 == 0 && count % 6 == 0 
      puts "foobar"
    when count % 3 == 0
      puts "foo"
    when count % 6 == 0 # this will never happen!
      puts "bar"
    else
      puts count
    end
  end
end

if ARGV.length != 2 || ARGV[0].to_i.nil? || ARGV[1].to_i.nil?
  puts "Expected two ints, get that other garbage out of here!"
  exit(1) 
end

foobar(ARGV[0].to_i, ARGV[1].to_i)
