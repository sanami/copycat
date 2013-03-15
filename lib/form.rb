module Form
  extend self

  def get_name(dat)
    all = []
    rx_href = /name=["'](.+?)["']/
    rx_param_name = /\[/

    dat.scan(rx_href) do |matches|
      #pp matches
      name = matches[0]

      if name =~ rx_param_name
        all << name
      end
    end

    all
  end

  def get_attribute(all, el, type)
    # "company[postal_address]"
    #rx_name = /(.+?)(\[(.+?)\])+/
    #rx_name.match(el['name']) do |m|

    rx_name = /(.+?)\[(.+?)\]/

    if el['name'] =~ rx_name
      model_name = $1
      attr = $2

      all[model_name] ||= {}
      all[model_name][attr] = type
    else
      puts "skip: #{el.name} #{el['name']}"
    end
  end

  def parse_html(dat)
    all = {} # model_name => {attr => type, ...}
    doc = Nokogiri::HTML(dat)

    (doc/'input, select, textarea').each do |el|
      #pp el
      type = case el.name
        when 'input'
          el['type']
        else
          el.name
      end
      get_attribute(all, el, type)
    end

    all
  end

  def generate_scheme(model, attrs)
    puts "rails g scaffold #{model.capitalize}"
    #name:string year:integer
    attrs.each do |name, ctrl|
      type = 'string'
      if ctrl == 'checkbox'
        type = 'boolean'
      elsif ctrl == 'textarea'
        type = 'text'
      elsif ctrl == 'select' || ctrl == 'number' || name.end_with?('_id')
        type = 'integer'
      end
      puts "\t#{name}:#{type}"

    end
  end

  def parse_file(file_path)
    dat = File.read file_path
    fix_encoding! dat

    #pp get_name(dat)
    all = parse_html(dat)
    pp all

    all.each do |model, attrs|
      generate_scheme(model, attrs)
    end
  end

end

if __FILE__ == $0
  pp ARGV
  file_path = ARGV[0]
  if file_path
    Form.parse_file(file_path)
  end
end
