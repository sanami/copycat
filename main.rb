require 'pp'
require 'uri'
require 'open-uri'
require 'fileutils'
require './tools.rb'

$site_url = URI.parse('http://bar.drincash.com')
$processed_links = []

def get_uri(str)
	uri = URI.parse(str)
	unless uri.host
		uri = $site_url.merge(str)
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
	if file_name.end_with? '.css'
		links = get_links_from_css dat
	elsif file_name.end_with? '.js'
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
		next if $processed_links.include? uri
		$processed_links << uri
		puts "#{uri}"

		if uri.host == $site_url.host
			file_name = "tmp/#{uri.host}" + uri.path
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

# process_links ['http://bar.drincash.com/ru/about']

process_file '/home/sa/projects/copycat/tmp/bar.drincash.com/index.html'
