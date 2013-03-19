require 'uri'
require 'open-uri'
require 'web_tools/agent'
require 'parser'

class Dump
  include WebTools::Agent

  attr_reader :parser
  attr_reader :site_url
  attr_reader :processed_links

  def initialize(site_url, params = {})
    params.reverse_merge! :debug => true, :caching => true, :caching_timeout => -1, :skip_errors => true
    agent_init(params)

    load_cookies

    @parser = Parser.new

    @site_url = URI.parse(site_url)      # base url
    @processed_links = Set.new

    if params[:rx_url]
      @rx_url = Regexp.compile(eval(params[:rx_url]))
    else
      @rx_url = nil
    end
  end

  # Valid link for processing
  def good_resource?(url)
    if @rx_url
      !!(url.to_s =~ @rx_url)
    else
      true
    end
  end

  # Create full site URI from partial link
  def build_uri(str)
    uri = URI.parse(str)
    unless uri.host
      uri = @site_url.merge(str)
    end
    uri
  end

  # Get links from local file
  def process_data(file_name)
    puts "    process_data(#{file_name})"
    dat = File.read(file_name)
    fix_encoding! dat

    links = []

    ext = File.extname(file_name).downcase
    if ext == '.css'
      links = parser.get_links_from_css dat
    elsif ext == '.js'
      #TODO
    elsif %w{ .gif .png .jpg .jpeg .ico }.include? ext
      # skip
    else
      links = parser.get_links_from_html dat
    end

    links.select {|link| good_resource?(link)}
  end

  # Links from page
  #   links - list of load resources
  #   level - unlimited if -1, only these links if 0, children links from links if 1, etc
  def process_links(links, level = -1)
    links.each do |link|
      uri = build_uri link
      next if @processed_links.include? uri.to_s
      @processed_links << uri.to_s

      if uri.host == @site_url.host
        file_name = agent.cached_file_name(uri)
        puts "#{uri} -> #{file_name}"

        begin
          page = agent.get(uri)
          if agent.get_cached?(uri)
            unless level == 0
              new_links = process_data(file_name)
              process_links(new_links, level - 1)
            end
          end
        rescue => ex
          puts "\terror"
          pp ex

          unless parser_params[:skip_errors]
            raise
          end
        end
      end

    end
  end

  # Local file
  def process_file(file_name)
    new_links = process_data(file_name)
    process_links new_links
  end

  # Get and process file from site
  def process_site(site_url = nil, deep_level = -1)
    process_links([site_url || @site_url.to_s], deep_level)

    puts "\nProcessed links:"
    pp @processed_links
  end
end
