module Convert
  extend self

  def convert_js
    tool = "#{ENV['HOME']}/tools/js-beautify/python/js-beautify"
    tool_options = "--indent-size=2"

    Pathname.glob('**/*.{js,json}').sort.each do |file|
      puts "#{file.size}\t#{file}"

      cmd_line = "#{tool} #{tool_options} #{file}"
      result = `#{cmd_line}`
      puts result.size

      open(file, 'wb') {|f| f.write result }
    end
  end

  def convert_css
    tool = "csstidy"
    tool_options = "--preserve_css=true --remove_bslash=false --merge_selectors=0 --optimise_shorthands=0 --compress_colors=false --compress_font-weight=false --silent=true"

    Pathname.glob('**/*.css').sort.each do |file|
      puts "#{file.size}\t#{file}"

      cmd_line = "#{tool} #{file} #{file} #{tool_options}"
      puts cmd_line
      result = `#{cmd_line}`
      #puts result
    end
  end

  def convert_xml
    tool = "xmlindent"
    #tool_options = "-i 2 -w"
    tool_options = "-i 2 -w -f -nbe"

    Pathname.glob('**/*.xml').sort.each do |file|
      puts "#{file.size}\t#{file}"

      cmd_line = "#{tool} #{tool_options} \"#{file}\""
      puts cmd_line
      result = `#{cmd_line}`
      #puts result
    end
  end
end
