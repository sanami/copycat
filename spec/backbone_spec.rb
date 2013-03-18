require 'spec_helper'
require 'backbone.rb'

describe Backbone do
  subject do
    Backbone.new
  end

  it "should create subject" do
    ap subject
  end

  it "should execute" do
    subject.execute
  end

end
