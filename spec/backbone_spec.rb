require 'spec_helper'
require 'backbone.rb'

describe Backbone do
  let(:work_folder) {ROOT('tmp/backbone')}
  let(:js_file) {TEST_DIR + 'backbone/map.js'}
  let(:model_file) {TEST_DIR + 'backbone/model.js'}
  let(:collection_file) {TEST_DIR + 'backbone/collection.js'}
  let(:template_file) {TEST_DIR + 'backbone/template.js'}
  let(:view_file) {TEST_DIR + 'backbone/view.js'}

  subject do
    Backbone.new file_name: js_file, work_folder: work_folder
  end

  it "should create subject" do
    ap subject
  end

  it "should iterate each_function" do
    subject.params[:func_limit] = 10
    count = 0
    subject.each_function do |func_body, i|
      print i, ' '
      #ap func_body
      func_body.should_not be_empty
      count += 1
    end
    count.should == 10
  end

  it "should return has_line" do
    b = Backbone.new file_name: model_file
    b.each_function do |func_body, i|
      rx_mark = /Backbone.Model/
      b.has_line(func_body, rx_mark).should == true

      str_mark = "(function() {\n"
      b.has_line(func_body, str_mark).should == true
    end
  end

  it "should match_line" do
    b = Backbone.new file_name: model_file
    b.each_function do |func_body, i|
      rx_mark = /rt\.([\w\.]+)/
      ap b.match_line(func_body, rx_mark)
    end
  end

  it "should detect is_model?" do
    b = Backbone.new file_name: model_file
    b.each_function do |func_body, i|
      puts i
      ok = b.is_model?(func_body)
      ok.should == true
    end
  end

  it "should detect is_collection?" do
    b = Backbone.new file_name: collection_file
    b.each_function do |func_body, i|
      puts i
      ok = b.is_collection?(func_body)
      ok.should == true
    end
  end

  it "should detect is_view?" do
    b = Backbone.new file_name: view_file
    b.each_function do |func_body, i|
      puts i
      ok = b.is_view?(func_body)
      ok.should == true
    end
  end

  it "should detect is_template?" do
    b = Backbone.new file_name: template_file
    b.each_function do |func_body, i|
      puts i
      ok = b.is_template?(func_body)
      ok.should == true
    end
  end

  it "should get model_name" do
    b = Backbone.new file_name: model_file
    b.each_function do |func_body, i|
      puts i
      model_name = b.class_name(func_body)
      puts model_name

      case i
        when 0
          model_name.should == "rt.blog.models.Post"
        when 1
          model_name.should == "rt.guide.models.Guide"
        when 2
          model_name.should == "rt.models.pois.PoisQuery"
      end
    end
  end

  it "should get view_name" do
    b = Backbone.new file_name: view_file
    b.each_function do |func_body, i|
      puts i
      view_name = b.class_name(func_body)
      puts view_name

      case i
        when 0
          view_name.should == "rt.blog.views.Sidebar"
        when 1
          view_name.should == "rt.views.map.PlacesSearchMarkersView"
        when 2
          view_name.should == "rt.views.overlay.OverlayView"
        when 3
          view_name.should == "rt.views.DomlessCollectionView"
        when 4
          view_name.should == "rt.views.pois.DeletePlaceOverlaySidebarActionView"
      end
    end
  end
  
  it "should get template_path" do
    b = Backbone.new file_name: template_file
    b.each_function do |func_body, i|
      puts i
      template_path = b.template_path(func_body)
      puts template_path

      case i
        when 0
          template_path.should == "partials/blog/templates/sidebar"
        when 1
          template_path.should == "partials/trip_planner/templates/new_trip_confirmation"
        when 1
          template_path.should == "templates/notifications/notification"
      end
    end
  end

  describe "Work" do
    before :each do
      work_folder.rmtree if work_folder.exist?
    end

    it "should run" do
      subject.run
    end
  end
end
