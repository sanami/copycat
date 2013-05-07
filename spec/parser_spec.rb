require 'spec_helper'
require 'parser.rb'

describe Parser do
  let(:css_file) { TEST_DIR + 'rea/editor.css?3'}
  let(:html_file) { TEST_DIR + 'rea/index'}

  subject do
    Parser.new
  end

  it 'should create subject' do
    subject.should_not == nil
  end

  it "should get_extension" do
    subject.get_extension(URI("http://google.com/normalize.css")).should == ".css"
    subject.get_extension(URI("http://google.com/normalize.css?4")).should == ".css"
    subject.get_extension(URI("http://google.com/normalize.css?4#aaa")).should == ".css"
  end

  it 'should get_links_from_css' do
    all = subject.get_links_from_css(css_file)
    ap all
    all.should include "../img/i-link.icon_line.png"
    all.should include "normalize.css?4"
  end

  it 'should get_links_from_html' do
    all = subject.get_links_from_html(html_file)
    ap all
  end

end
