require 'uri'
require 'open-uri'
require 'fileutils'

class Dump
  attr_reader :site_url
  attr_accessor :rx_url
  attr_reader :processed_links

  def initialize(site_url, rx_url = nil)
    @site_url = URI.parse(site_url)      # base url
    @processed_links = []

    if rx_url
      @rx_url = Regexp.compile(eval(rx_url))
    else
      @rx_url = nil
    end
  end

  def get_uri(str)
    uri = URI.parse(str)
    unless uri.host
      uri = @site_url.merge(str)
    end
    uri
  end

  # File to store URL
  def get_file_path(uri)
    path = "tmp/#{uri.host}#{uri.path}"
    if uri.query
      path += "?#{uri.query}"
    end

    ROOT(path)
  end

  def get_links_from_html(dat)
    all = []
    rx_href = /(href|src)=["'](.+?)["']/

    dat.scan(rx_href) do |matches|
      #pp matches
      link = matches[1]

      if link != '#'
        all << link
      end
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

    if rx_url
      links.select {|link| link =~ rx_url}
    else
      links
    end
  end

  # Links from page
  #   links - list of load resources
  #   level - unlimited if -1, only these links if 0, children links from links if 1, etc
  def process_links(links, level = -1)
    links.each do |uri|
      uri = get_uri uri
      next if @processed_links.include? uri
      @processed_links << uri

      if uri.host == @site_url.host
        file_name = get_file_path(uri)
        puts "#{uri} -> #{file_name}"

        # Ensure folder
        file_name.dirname.mkpath

        begin
          if File.exist? file_name
            puts "\texist"
          else
            open(uri, 'rb') do |page|
              File.open(file_name, 'w') do |f|
                f.write page.read
              end
            end
            puts "\tsaved"
          end

          unless level == 0
            new_links = process_data(file_name)
            process_links(new_links, level - 1)
          end
        rescue => ex
          puts "\terror"
          pp ex
          #raise
        end
      end

    end
  end

  # Local file
  def process_file(file_name)
    new_links = process_data(file_name)
    process_links new_links
  end

  def process_site(site_url = nil, deep_level = -1)
    process_links([site_url || @site_url.to_s], deep_level)

    puts "\nProcessed links:"
    pp @processed_links
  end
end
