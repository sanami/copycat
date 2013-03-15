require 'uri'
require 'open-uri'
require 'fileutils'

class Dump
  def initialize(site_url)
    @site_url = URI.parse(site_url)      # base url
    @processed_links = []
  end

  def get_uri(str)
    uri = URI.parse(str)
    unless uri.host
      uri = @site_url.merge(str)
    end
    uri
  end

  def get_links_from_html(dat)
    all = []
    rx_href = /(href|src)=["'](.+?)["']/

    dat.scan(rx_href) do |matches|
      #pp matches
      all << matches[1]
    end

    all
  end

  def get_links_from_css(dat)
    all = []
    #url(/images/bar/about/langs.png)
    rx_href = /url\(["']?(.+?)["']?\)/

    dat.scan(rx_href) do |matches|
      #pp matches
      all << matches[0]
    end

    all
  end

  # Get links from local file
  def process_data(file_name)
    puts "    process_data(#{file_name})"
    dat = File.read(file_name)
    fix_encoding! dat

    links = []

    ext = File.extname(file_name).downcase
    if ext == '.css'
      links = get_links_from_css dat
    elsif %w{ .js .gif .png .jpg .jpeg }.include? ext
      # skip
    else
      links = get_links_from_html dat
    end
    links
  end

  # Links from page
  def process_links(links)
    links.each do |uri|
      uri = get_uri uri
      next if @processed_links.include? uri
      @processed_links << uri

      pp uri

      if uri.host == @site_url.host
        file_name = ROOT("tmp/#{uri.host}" + uri.path)
        dir_name =  File.dirname(file_name)
        pp dir_name

        FileUtils.mkpath dir_name

        begin
          unless File.exist? file_name
            open(uri, 'rb') do |page|
              File.open(file_name, 'w') do |f|
                f.write page.read
              end
            end
          end

          new_links = process_data(file_name)
          process_links new_links
        rescue => ex
          pp ex
        end
      end

    end
  end

  # Local file
  def process_file(file_name)
    new_links = process_data(file_name)
    process_links new_links
  end
end
