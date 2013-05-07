require 'uri'
require 'open-uri'
require 'web_tools/agent'
require 'parser'

class Dump
  include WebTools::Agent

  attr_reader :parser
  attr_reader :processed_links
  attr_reader :rx_url

  def initialize(params = {})
    params.reverse_merge! :debug => false, :caching => true, :caching_timeout => -1, :skip_errors => true
    agent_init(params)
    load_cookies

    @parser = Parser.new
    @processed_links = Set.new

    if params[:rx_url]
      @rx_url = Regexp.compile(eval(params[:rx_url]))
    else
      @rx_url = nil
    end
  end

  # Valid link for processing
  def good_resource?(url)
    if rx_url
      !(url.to_s !~ rx_url)
    else
      true
    end
  end

  # Create full URI from partial link
  def build_uri(base_uri, url)
    uri = URI(url)
    unless uri.host
      uri = base_uri.merge(url)
    end
    uri
  rescue => ex
    nil
  end

  # Get links from local file
  def process_data(base_uri, file_name)
    puts "\tprocess_data(#{file_name})"

    links = []

    ext = parser.get_extension(base_uri)
    if ext == '.css'
      # CSS
      links = parser.get_links_from_css file_name
    elsif %w{ .gif .png .jpg .jpeg .ico }.include? ext
      # skip
    else
      # HTML
      # JS
      links = parser.get_links_from_html file_name
    end

    links.inject([]) do |memo, link|
      uri = build_uri(base_uri, link)
      memo << uri if uri
      memo
    end
  end

  # Links from page
  #   links - list of load resources
  #   level - unlimited if -1, only these links if 0, children links from links if 1, etc
  def process_links(base_uri, links, level = -1)
    links.each do |uri|
      # Good to process
      next unless good_resource?(uri)

      # Same domain
      next unless uri.host == base_uri.host

      # Already processed
      next if @processed_links.include? uri.to_s
      @processed_links << uri.to_s

      # Run
      puts uri
      begin
        page = agent.get(uri)
        puts "\tok"
        if level != 0 && agent.get_cached?(uri)
          file_name = agent.cached_file_name(uri)
          new_links = process_data(uri, file_name)
          #ap new_links
          process_links(uri, new_links, level - 1)
        end
      rescue Mechanize::ResponseCodeError
        puts "\terror"
      rescue => ex
        unless parser_params[:skip_errors]
          raise
        end
      end

    end
  end

  # Start with local file
  def process_file(file_path, url, deep_level = -1)
    base_uri = URI(url)
    links = process_data(base_uri, file_path)
    process_links(base_uri, links, deep_level)

    puts "\nProcessed links:"
    pp @processed_links
  end

  # Start with url
  def process_site(url, deep_level = -1)
    base_uri = URI(url)
    links = [ base_uri ]
    process_links(base_uri, links, deep_level)

    puts "\nProcessed links:"
    pp @processed_links.to_a.sort
  end
end
