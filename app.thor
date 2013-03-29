#!/usr/bin/env ruby
require File.dirname(File.absolute_path(__FILE__)) + '/lib/config.rb'
require 'dump.rb'
require 'form.rb'
require 'convert.rb'

class App < Thor
  desc "dump_file SITE_URL FILE_PATH", "dump site resources"
  def dump_file(site_url, file_path)
    dump = Dump.new(site_url, debug: false)
    # dump.process_links [file_path]
    dump.process_file(file_path)
  end

  desc "dump_site SITE_URL RX_GOOD DEEP_LEVEL", "dump all site resources"
  def dump_site(site_url, rx_good = nil, deep_level = -1)
    pp site_url, rx_good, deep_level
    dump = Dump.new(site_url, rx_url: rx_good, debug: false)
    dump.process_site(nil, deep_level.to_i)
    dump.save_cookies
  end

  desc "parse_form FILE_PATH", "generate scaffold scheme from form"
  def parse_form(file_path)
    Form.parse_file(file_path)
  end

  desc 'convert_js', "Convert all JS files"
  method_option :pretend, :aliases => "-p", :desc => "List found JS files"
  def convert_js(pretend)
    Convert.convert_js(pretend: pretend)
  end

  desc 'convert_css', "Convert all CSS files"
  def convert_css
    Convert.convert_css
  end

  desc 'convert_xml', "Convert all XML files"
  def convert_xml
    Convert.convert_xml
  end
end

if __FILE__ == $0
  App.start
end
