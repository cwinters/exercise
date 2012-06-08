require 'bundler/setup'
require 'sinatra'

get '/' do
  "Hello world! It's currently #{Time.now}"
end
