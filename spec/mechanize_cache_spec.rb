# encoding: UTF-8
require 'spec_helper'
require 'web_tools/mechanize_cache'

# For testing
include WebTools::MechanizeCache

describe Mechanize do
  subject do
    Mechanize.new do |agent|
      #agent.user_agent_alias = 'Mechanize'
      agent.user_agent_alias = 'Windows Mozilla' # hide

      # Activate MechanizeCache
      enable_mechanize_cache agent
      agent.caching_timeout_at 30
      #agent.disable_caching_timeout_for [ /moodle2\/my/ ]
      agent.caching_debug = true
    end
  end

  it "should generate http cached_file_name" do
    url = 'http://www.kayak.ru/hotels/#/Antalya,Turcija-c1669/2guests'
    ap url
    path = subject.cached_file_name(url)
    ap path
    path.should include "www.kayak.ru/hotels/index#\\Antalya,Turcija-c1669\\2guests"
  end

  it "should generate https cached_file_name 2" do
    url = "https://roadtrippers.com/?mode=explore"
    ap url
    path = subject.cached_file_name(url)
    ap path
    path.should include "roadtrippers.com/index?mode=explore"
  end

  it "should get time from resource" do
    m = Mechanize.new
    url = "https://www.google.com/images/srpr/logo4w.png"
    page = m.get url
    #ap page
    #ap page.response
    #ap DateTime.parse(page.response["last-modified"])

    subject.get_resource_time(page).should_not == nil
    subject.get_resource_time(nil).should == nil
  end
end
