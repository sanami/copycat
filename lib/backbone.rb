class Backbone

  def dump_object(obj)
    if obj.instance_of?(Hash) || obj.instance_of?(V8::Object)
      obj.each do |k, v|
        puts k
        dump_object(v)
      end
    else
      ap obj
    end
  end

  def execute
    #js_str = File.read TEST_DIR + 'backbone/template.js'
    js_str = File.read TEST_DIR + 'backbone/model.js'

    #js_str = "var a = 1;"
    #js_str = "1 + 2"
    #js_str = "(function()aaaaaaa { this.a = 1; }).call(this); var b = 2;"
    #puts js_str

    global = {}
    #cxt = V8::Context.new(with: global)
    cxt = V8::Context.new
    cxt.load(TEST_DIR + 'backbone/underscore.js')
    cxt.load(TEST_DIR + 'backbone/backbone.js')

    result = cxt.eval(js_str) #=> 42
    pp cxt.scope.keys
    #dump_object(cxt['rt']['blog']['models'])

    ap cxt['rt']['blog']['models']['Post']
    ap cxt['rt']['blog']['models']['Post'].prototype.values

    #ap global.class
    #ap global['JST'].class
    #ap global['JST'].keys
    #ap global['JST'].values
    #ap global['JST']['partials/blog/templates/sidebar']
  end

  def parse
    js_str = File.read TEST_DIR + 'backbone/template.js'
    #puts js_str
    parser = RKelly::Parser.new
    ast    = parser.parse(js_str)

    #ap ast
    ap ast.class

    ast.each do |node|
      #node.value  = 'hello' if node.value == 'i'
      #node.name   = 'hello' if node.respond_to?(:name) && node.name == 'i'


      #if node.instance_of? RKelly::Nodes::StringNode
        puts "#{node.line}\t#{node.class}"
        #pp node.class
        #pp node.value
      #end

      if node.class == RKelly::Nodes::FunctionBodyNode
        puts node.to_ecma
      end

      if node.class == RKelly::Nodes::DotAccessorNode
        puts node.accessor
      end


    end
    #puts ast.to_ecma # => awesome javascript
  end

end
