require 'spec_helper'
require 'dump.rb'

describe Dump do
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
end
