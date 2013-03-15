require 'spec_helper'
require 'dump.rb'

describe Dump do
  subject do
    Dump.new 'http://google.com'
  end
  it "should get_file_path" do
    uri = URI.parse("https://roadtrippers.com/?mode=explore")
    pp subject.get_file_path(uri)
  end

  describe 'drincash.com' do
    subject do
      Dump.new 'http://bar.drincash.com'
    end

    it 'should process css' do
      links = subject.process_data(TEST_DIR + 'about.css')
      pp links
      links.should_not be_empty
    end

    it 'should process html' do
      links = subject.process_data(TEST_DIR + 'edit')
      pp links
      links.should_not be_empty
    end

    it 'should skip js' do
      links = subject.process_data(TEST_DIR + 'keynote.js')
      links.should be_empty
    end

    it 'should parse file' do
      subject.process_file(TEST_DIR + 'edit')
    end
  end

  describe "eat.fi" do
    subject do
      Dump.new 'http://eat.fi/css/packed/'
    end

    it "should process_data css" do
      links = subject.process_data(TEST_DIR + 'global.css')
      pp links
      links.should_not be_empty
    end

    it "should process_file css" do
      subject.process_file(TEST_DIR + 'global.css')
    end
  end

  describe "roadtrippers.com" do
    subject do
      Dump.new 'https://roadtrippers.com/?mode=explore', '/assets/i'
    end

    it "should initialize with rx_url" do
      subject.rx_url.should == /assets/i
    end

    it 'should process_data' do
      links = subject.process_data(TEST_DIR + 'roadtrippers-index.html')
      pp links
      links.should_not be_empty

      # Only rx_url matches
      links.each do |url|
        (url =~ subject.rx_url).should_not == nil
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
end
