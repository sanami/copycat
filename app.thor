require File.dirname(__FILE__) + '/config.rb'
require 'dump.rb'

class App < Thor
  desc "dump SITE_URL FILE_PATH", "dump site resources"
  def dump_file(site_url, file_path)
    dump = Dump.new(site_url)
    # dump.process_links [file_path]
    dump.process_file(file_path)
  end
end
