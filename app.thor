#!/usr/bin/env ruby
require File.dirname(File.absolute_path(__FILE__)) + '/lib/config.rb'
require 'dump.rb'
require 'form.rb'
require 'convert.rb'

class App < Thor
  desc "dump_file FILE_PATH URL RX_GOOD DEEP_LEVEL", "dump file resources"
  def dump_file(file_path, url, rx_good = nil, deep_level = nil)
    params = { }
    params[:rx_url] = rx_good if rx_good.present?
    params[:deep_level] = deep_level.to_i if deep_level.present?
    ap params

    dump = Dump.new(params)
    dump.process_file(file_path, url, params[:deep_level])
  end

  desc "dump_site URL RX_GOOD DEEP_LEVEL", "dump all site resources"
  def dump_site(url, rx_good = nil, deep_level = -1)
    params = { }
    params[:rx_url] = rx_good if rx_good.present?
    params[:deep_level] = deep_level.to_i if deep_level.present?
    ap params

    dump = Dump.new(params)
    dump.process_site(url, params[:deep_level])
    dump.save_cookies
  end

  desc "parse_form FILE_PATH", "generate scaffold scheme from form"
  def parse_form(file_path)
    Form.parse_file(file_path)
  end

  desc 'convert_js', "Convert all JS files"
  def convert_js
    Convert.convert_js
  end

  desc 'convert_css', "Convert all CSS files"
  def convert_css
    Convert.convert_css
  end

  desc 'convert_xml', "Convert all XML files"
  def convert_xml
    Convert.convert_xml
  end

  desc 'convert_assets', "Remove MD5 hash from file name"
  def convert_assets
    Convert.convert_assets
  end
end

if __FILE__ == $0
  App.start
end
