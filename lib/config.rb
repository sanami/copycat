require 'pp'
require 'pathname'

require 'bundler'
Bundler.require

ROOT_PATH = Pathname.new File.expand_path('../..', __FILE__)

def ROOT(file)
  ROOT_PATH + file
end

# Ensure existing folders
['tmp'].each do |path|
  FileUtils.mkpath ROOT(path)
end

# Required folders
['lib'].each do |folder|
  $: << ROOT(folder)
end
#pp $:

# Common files
require 'helpers.rb'
