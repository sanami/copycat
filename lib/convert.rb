module Convert
  extend self

  def convert_js(options)
    tool = "#{ENV['HOME']}/tools/js-beautify/python/js-beautify"
    tool_options = "--indent-size=2"

    Pathname.glob('**/*.js').sort.each do |file|
      puts "#{file.size}\t#{file}"

      unless options[:pretend]
        cmd_line = "#{tool} #{tool_options} #{file}"
        result = `#{cmd_line}`
        puts result.size

        open(file, 'wb') {|f| f.write result }
      end
    end
  end

  def convert_css
    tool = "csstidy"
    tool_options = "--compress_colors=false --compress_font-weight=false --lowercase_s=false --silent=true"

    Pathname.glob('**/*.css').sort.each do |file|
      puts "#{file.size}\t#{file}"

      cmd_line = "#{tool} #{file} #{file} #{tool_options}"
      puts cmd_line
      result = `#{cmd_line}`
      #puts result
    end
  end
end
