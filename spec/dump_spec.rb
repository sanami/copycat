require 'spec_helper'
require 'dump.rb'

describe Dump do
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
