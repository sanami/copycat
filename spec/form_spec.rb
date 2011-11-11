require 'spec_helper'
require 'form.rb'

describe Form do
	it 'should parse file' do
		Form.parse_file(TEST_DIR + 'edit')
	end
end
