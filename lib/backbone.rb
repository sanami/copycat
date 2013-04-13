class Backbone
  attr_reader :params

  # Init parser
  #
  # params - Run options
  #          :file_name   - File to process
  #          :func_limit  - Limit number of function if > 0
  #          :work_folder - Where to save files
  def initialize(params = {})
    @params = params
    @params[:func_limit] ||= 0
  end

  # Run parser
  def run
    params[:work_folder].mkpath
    file = File.open(params[:work_folder].join('general.js'), 'w')

    each_function do |func_body, i|
      begin
        #is_class = is_model?(func_body) || is_collection?(func_body) || is_view?(func_body)
        #is_class &&= has_class_name?(func_body)

        is_class = has_class_name?(func_body)

        if is_class
          save_as_class(func_body)
        elsif is_template?(func_body)
          save_as_template(func_body)
        else
          puts "Skip #{i}"
          #ap func_body
          file.write func_body.join
          file.write "\n\n"
        end
      rescue => ex
        puts func_body.join
        raise ex
      end
    end
  end

  # Check for line with pattern
  def has_line(func, rx_mark)
    ok = false
    func.each do |str|
      if rx_mark.is_a? (Regexp)
        if str =~ rx_mark
          ok = true
          break
        end
      else
        if str == rx_mark
          ok = true
          break
        end
      end
    end

    ok
  end

  # Match line with pattern
  def match_line(func, rx_mark)
    match = nil
    func.each do |str|
      if (match = rx_mark.match(str))
        break
      end
    end

    match
  end

  # Detect model
  def is_model?(func)
    rx_mark = /^\s+\w = Backbone\.Model[,;]\n$/
    has_line(func, rx_mark)
  end

  # Detect collection
  def is_collection?(func)
    rx_mark = /^\s+\w = Backbone\.Collection[,;]\n$/
    rx_mark2 = /^\s+\w\(\w, Backbone\.Collection\);\n$/

    has_line(func, rx_mark) || has_line(func, rx_mark2)
  end

  # Detect view
  def is_view?(func)
    rx_mark = /^\s+\w = Backbone\.View[,;]\n$/
    rx_mark2 = /^\s+\w\(\w, Backbone\.View\);\n$/

    has_line(func, rx_mark) || has_line(func, rx_mark2)
  end

  # Detect template
  def is_template?(func)
    rx_mark = "  this.JST || (this.JST = {});\n"
    has_line(func, rx_mark)
  end

  # Detect class name
  def has_class_name?(func)
    rx_name = /^\s+([a-z])\.(\w+) = [a-z]\n$/
    !!(func[-2] =~ rx_name)
  end

  # Find class name
  def class_name(func)
    rx_name = /^\s+([a-z])\.(\w+) = [a-z]\n$/

    module_var, class_name = $1, $2 if func[-2] =~ rx_name

    # Find module
    rx_mark = /^\s*(var|\}\,)?\s*#{module_var} = (.+)[;,]\n$/
    match = match_line(func, rx_mark)
    module_name = match[2] if match

    "#{module_name}.#{class_name}"
  end

  # Find template path
  def template_path(func)
    rx_path = /this.JST\[\"(.+)\"\] = function/

    if func[2] =~ rx_path
      $1
    end
  end

  # Save class
  def save_as_class(func)
    view = class_name(func)
    raise "Bad view name" unless view
    ap view

    view.gsub! '.', '/'

    file_name = "#{view.underscore}.js"
    file_path = @params[:work_folder].join file_name

    save(file_path, func)
  end
  
  # Save template
  def save_as_template(func)
    template = template_path(func)
    raise "Bad template path" unless template

    file_path = @params[:work_folder].join "#{template}.js"

    save(file_path, func)
  end

  # Create folder and save file
  def save(file_path, func)
    pp file_path
    file_path.dirname.mkpath
    unless file_path.exist?
      File.open(file_path, 'w') {|f| f.write(func.join) }
    else
      #ap func
      #raise "File exist #{file_path}"
      puts "File exist #{file_path}"
    end
  end

  # Find each function
  def each_function
    func_count = 0
    func_body = []
    rx_func_start = "(function() {\n"
    rx_func_end = ["}).call(this);\n", "})();\n"]
    state = :outside

    File.open(params[:file_name]) do |file|
      file.each_line do |line|
        case state
          when :outside
            if rx_func_end.include? line
              raise "Bad rx_func_end outside function"
            elsif line == rx_func_start
              state = :in_func

              func_body.clear
              func_body << line
            end

          when :in_func
            func_body << line

            if rx_func_end.include? line
              state = :outside

              yield func_body, func_count if block_given?

              # Limit
              func_count += 1
              break if params[:func_limit] > 0 && func_count >= params[:func_limit]

            elsif line == rx_func_start
              raise "Bad rx_func_start inside function at line: #{file.lineno}"
            end
        end

      end

      if state == :in_func
        raise "Bad end of file inside function at line: #{file.lineno}"
      end

    end
  end
end
