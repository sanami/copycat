class Parser
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

      #TODO url without '/' located at this resource folder
    end

    all
  end

end
