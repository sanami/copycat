class Parser
  def get_extension(uri)
    raise "Need full URI: #{uri}" unless uri.scheme
    File.extname(uri.path).try(:downcase)
  end

  def get_links_from_html(file_name)
    dat = File.read(file_name)
    fix_encoding! dat
    all = []

    rx_href = /(href|src)=["'](.+?)["']/

    rx_bad = []
    rx_bad << /^#/ # href="#"
    rx_bad << /^javascript:/ # href="javascript:void(0)"

    dat.scan(rx_href) do |matches|
      #pp matches
      link = matches[1]

      if rx_bad.any? {|rx| link =~ rx }
        # Skip
      elsif link.start_with? '//'
        # Add scheme
        all << "http:#{link}"
      else
        all << link
      end
    end

    all
  end

  def get_links_from_js(file_name)
    dat = File.read(file_name)
    all = []

    # src=\"upload/ru/4.png\"
    rx_href = /(href|src)=[\\"']+(.+?)[\\"']+/

    rx_bad = []
    rx_bad << /^#/ # href="#"
    rx_bad << /^javascript:/ # href="javascript:void(0)"

    dat.scan(rx_href) do |matches|
      #pp matches
      link = matches[1]

      if rx_bad.any? {|rx| link =~ rx }
        # Skip
      elsif link.start_with? '//'
        # Add scheme
        all << "http:#{link}"
      elsif !link.start_with? '/'
        # Add root
        all << "/#{link}"
      else
        all << link
      end
    end

    all
  end

  def get_links_from_css(file_name)
    dat = File.read(file_name)
    all = []

    #url(/images/bar/about/langs.png)
    rx_href = []
    rx_href << /url\(["']?(.+?)["']?\)/ # url(...)
    rx_href << /@import\s*[\("'](.+?)["'\)]/ # @import "..."

    rx_href.each do |rx|
      dat.scan(rx) do |matches|
        #pp matches
        all << matches[0]

        #TODO url without '/' located at this resource folder
      end
    end

    all
  end

end
