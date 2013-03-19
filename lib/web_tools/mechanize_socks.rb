require 'mechanize'
require 'socksify/http'

module WebTools
  module MechanizeSocks
    def enable_mechanize_socks(mechanize)

      class << mechanize
        # https://gist.github.com/1854726
        def set_socks(addr, port)
          #@agent.set_http unless @agent.http

          class << @agent.http
            attr_accessor :socks_addr, :socks_port

            def http_class
              Net::HTTP.SOCKSProxy(socks_addr, socks_port)
            end
          end

          @agent.http.socks_addr = addr
          @agent.http.socks_port = port
        end
      end

    end
  end
end
