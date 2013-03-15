require File.dirname(__FILE__) + '/lib/config.rb'
require 'dump.rb'
require 'form.rb'

class App < Thor
  desc "dump_file SITE_URL FILE_PATH", "dump site resources"
  def dump_file(site_url, file_path)
    dump = Dump.new(site_url)
    # dump.process_links [file_path]
    dump.process_file(file_path)
  end

  desc "parse_form FILE_PATH", "generate scaffold scheme from form"
  def parse_form(file_path)
    Form.parse_file(file_path)
  end
end
