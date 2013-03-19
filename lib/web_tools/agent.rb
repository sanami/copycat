require 'web_tools/mechanize_cache'
require 'web_tools/mechanize_socks'

module WebTools
  module Agent
    include MechanizeCache
    include MechanizeSocks

    attr_reader :agent
    attr_reader :parser_params

    COOKIE_JAR_FILE = ROOT('tmp/cookies.yaml').to_s

    # Базовая инициализация
    # parser_params[:debug] = true         # Сообщения в консоль
    # parser_params[:cache_path] = ...     # default is "tmp/parser/cache"
    # parser_params[:caching] = true       # Кеширование данных, только для разработки (иначе не будет работать 'refresh' на сайте)
    # parser_params[:caching_timeout] = 30 # В минутах, валидность кеша, [nil, <1] нет таймаута
    # parser_params[:disable_caching] = [] # Список адресов, которые нельзя кешировать
    # parser_params[:socks_addr]           # Socks proxy
    # parser_params[:socks_port]           # Socks proxy
    # parser_params[:retry_timeout] = 30   # Sleep in seconds between failed get retry
    def agent_init(parser_params = {})
      @parser_params = parser_params

      raise "Agent already initialized" if @agent

      @agent = Mechanize.new do |agent|
        #agent.user_agent_alias = 'Mechanize'
        agent.user_agent_alias = 'Windows Mozilla' # hide

        # Лог агента
        agent.log = Logger.new( ROOT('log/agent.log') )
        agent.redirect_ok = true

        # Timeouts
        agent.keep_alive = true
        agent.open_timeout = 300 # seconds
        agent.read_timeout = 300 # seconds
        agent.idle_timeout = 300 # seconds

        # Включение режима кеширования
        if @parser_params[:caching] == true
          enable_mechanize_cache agent
          agent.disable_caching_for( @parser_params[:disable_caching] || [] )
          agent.caching_timeout_at( @parser_params[:caching_timeout] || 30 )
          agent.retry_timeout = @parser_params[:retry_timeout] || 30
          agent.caching_debug = @parser_params[:debug]

          if @parser_params[:cache_path].present?
            agent.cache_path = @parser_params[:cache_path]
          end
        end

        # Enable socks proxy
        if @parser_params[:socks_addr] && @parser_params[:socks_port]
          enable_mechanize_socks agent
          agent.set_socks @parser_params[:socks_addr], @parser_params[:socks_port]
        end
      end
    end

    # Управление режимом кеширования
    def caching_enabled=(enabled)
      @agent.caching_enabled = enabled
    end

    # Вернёт false, даже если у агента нет метода caching_enabled
    def caching_enabled?
      @agent.caching_enabled? rescue false
    end

    # Настройки подключения к сайту в YAML формате
    def get_cookie_session
      YAML::dump @agent.cookie_jar
    end

    # Save all cookies
    def save_cookies(path = nil)
      @agent.cookie_jar.save_as(path || COOKIE_JAR_FILE)
    end

    # Load all cookies
    def load_cookies(path = nil)
      path ||= COOKIE_JAR_FILE
      if File.exist? path
        @agent.cookie_jar.load path
      end
    end

    # Очистить идентификацию пользователя через cookie
    def reset_cookie_session
      @agent.cookie_jar.clear!
    end

    def set_cookie(params)
      cookie = Mechanize::Cookie.new(params[:name], params[:value])
      cookie.domain = params[:domain]
      cookie.path = "/"
      @agent.cookie_jar.add!(cookie)
    end

  end
end
