#require 'iconv'
#ic = Iconv.new('UTF-8//IGNORE', 'UTF-8')
#dat = ic.iconv(dat)

def fix_encoding!(str)
	#str.force_encoding("UTF-8")
	#pp str.encoding, str.valid_encoding?
	str.encode!("UTF-16BE", :invalid=>:replace, :replace=>"?")
	str.encode!("UTF-8")
end
