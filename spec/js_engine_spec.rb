require 'spec_helper'
require 'js_engine.rb'

describe JsEngine do
  subject do
    JsEngine.new
  end

  it "should create subject" do
    ap subject
  end

  it "should execute" do
    subject.execute
  end
end
