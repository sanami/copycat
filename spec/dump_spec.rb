require 'spec_helper'
require 'dump.rb'

describe Dump do
  describe 'general' do
    let(:css_file) { TEST_DIR + 'rea/editor.css?3'}

    subject do
      Dump.new rx_url: '/assets/i'
    end

    it "should detect good_resource" do
      subject.good_resource?('assets').should == true
      subject.good_resource?('asset').should == false
    end

    it "should build_uri" do
      base_uri = URI('http://google.com/css/')

      # same
      subject.build_uri(base_uri, '1.css').to_s.should == 'http://google.com/css/1.css'
      subject.build_uri(base_uri, './1.css').to_s.should == 'http://google.com/css/1.css'

      # root
      subject.build_uri(base_uri, '/1.html').to_s.should == 'http://google.com/1.html'

      # relative
      subject.build_uri(base_uri, '../1.html').to_s.should == 'http://google.com/1.html'
      subject.build_uri(base_uri, '../js/1.js').to_s.should == 'http://google.com/js/1.js'
      subject.build_uri(base_uri, '/../js/1.js').to_s.should == 'http://google.com/js/1.js'

      # other
      subject.build_uri(base_uri, 'http://ya.ru/1.css').to_s.should == 'http://ya.ru/1.css'

      # bad
      subject.build_uri(base_uri, '([^').should == nil
    end

    it "should process_data" do
      base_uri = URI('http://google.com/editor.css?3')

      all = subject.process_data(base_uri, css_file)
      all.should_not be_empty
      ap all
    end
  end

  describe "eat.fi" do
    subject do
      Dump.new 'http://eat.fi/css/packed/'
    end

    it "should process_data css" do
      links = subject.process_data(TEST_DIR + 'eat.fi/global.css')
      pp links
      links.should_not be_empty
    end

    it "should process_file css" do
      subject.process_file(TEST_DIR + 'eat.fi/global.css')
    end
  end

  describe "roadtrippers.com" do
    subject do
      Dump.new 'https://roadtrippers.com/welcome?mode=explore', rx_url: '/assets/i', skip_errors: false
    end

    it 'should process_data' do
      links = subject.process_data(TEST_DIR + 'roadtrippers.com/roadtrippers-index.html')
      pp links
      links.should_not be_empty

      # Only matches
      links.each do |url|
        subject.good_resource?(url).should == true
      end
    end

    it "should process_site level 0" do
      subject.process_site(nil, 0)
      subject.processed_links.count.should == 1
    end

    it "should process_site level 1" do
      subject.process_site(nil, 1) # assets
      subject.processed_links.count.should be > 1
    end

    #it "should process_site level 2" do
    #  subject.process_site(nil, 2) # images in assets
    #  subject.processed_links.count.should be > 1
    #end
  end

  describe "kayak.ru" do
    subject do
      Dump.new 'http://www.kayak.ru/hotels/#/Antalya,Turcija-c1669/2guests', rx_url: '/\bv\d+/i', skip_errors: true
      #Dump.new 'http://www.kayak.ru/flights/', rx_url: '/\bv\d+/i', skip_errors: false
      #Dump.new 'http://www.kayak.ru/hotels/Antalya,Turciya-c1669/2013-04-02/2013-04-05/2guests;map', rx_url: '/\bv\d+/i', skip_errors: true
    end

    it "should process_site level 0" do
      subject.process_site(nil, 0)
      subject.processed_links.count.should == 1

      subject.save_cookies
    end

    it "should process_site level 1" do
      subject.process_site(nil, 1) # assets
      subject.processed_links.count.should be > 1
    end

    it "should process_site level 2" do
      subject.process_site(nil, 2) # images in css
      subject.processed_links.count.should be > 1
    end
  end

  describe "report2011.rosenergoatom.ru" do
    let(:url) { 'http://report2011.rosenergoatom.ru/' }

    subject do
      Dump.new skip_errors: false
    end

    it "should process_site level 0" do
      subject.process_site(url, 0)
      subject.processed_links.count.should == 1

      subject.save_cookies
    end

    it "should process_site level 1" do
      subject.process_site(url, 1) # assets
      subject.processed_links.count.should be > 1
    end

    it "should process_site level 2" do
      subject.process_site(url, 2) # images in css
      subject.processed_links.count.should be > 1
    end
  end
end
