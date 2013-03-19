require 'spec_helper'
require 'dump.rb'

describe Dump do
  subject do
    Dump.new 'http://google.com'
  end

  it "should use agent 1" do
    url = 'http://www.kayak.ru/hotels/#/Antalya,Turcija-c1669/2guests'
    subject.agent.get url
    subject.agent.get_cached?(url).should == true
  end

  it "should use agent 2" do
    url = 'https://roadtrippers.com/welcome?mode=explore'
    subject.agent.get url
    subject.agent.get_cached?(url).should == true
  end
end
