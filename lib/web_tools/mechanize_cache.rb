require 'fileutils'

module WebTools
  module MechanizeCache
    def enable_mechanize_cache(mechanize)
      #NOTE Force Unicode support with page.encoding = 'UTF-8' / page.body.force_encoding 'UTF-8'
      #NOTE Can't do submit on cached pages

      class << mechanize
        attr_accessor :retry_timeout
        attr_writer :caching_enabled, :caching_debug

        DEFAULT_CACHE_PATH = ROOT('tmp').to_s
        MAX_FILE_NAME_BYTES = 128 # eCryptfs ~140, '.html'
        @@local_agent = Mechanize.new

        # Ensured get
        # params - Control options
        #          :binary_file - if 'true' download as binary file (name without '.html' ending)
        def get_without_fail(url, params = {})
          page = get(url, params[:binary_file])

          page
        rescue SOCKSError::ServerFailure, SOCKSError::NetworkUnreachable, SOCKSError::HostUnreachable, SOCKSError::ConnectionRefused, SOCKSError::TTLExpired,
          Mechanize::ResponseCodeError, Net::HTTP::Persistent::Error, Errno::ECONNRESET, Timeout::Error, SOCKSError => ex
          #TODO network errors without socks enabled

          puts "#{ex.class}: #{ex.message}"

          if ex.is_a?(Mechanize::ResponseCodeError) && ex.response_code == 404 # Not found
            raise
          end

          sleep(retry_timeout || 30)
          retry
        rescue => ex
          puts "#{ex.class}: #{ex.message}"
          ap ex.backtrace

          raise
        end

        alias :get_orig :get

        # Get web page or file
        def get(url, &block)
          url = url.to_s
          puts "MechanizeCache#get #{url}"
          page = nil
          if !caching_enabled? || disable_caching?(url)
            page = get_orig(url, &block)
          else
            cached_url = cached_file_name(url)

            if cached_file_exists? cached_url
              puts "\texists at #{cached_url}"
              #page = @@local_agent.get("file://#{URI.escape(cached_url)}") # Mechanize can't open local file with '?'
              #page.uri = URI.parse(url)
              page = Mechanize::Page.new(URI.parse(url), {'content-type'=>'text/html'}, ::File.read(cached_url), nil, self)

              #puts "\tas #{page.class}"
              if block_given?
                yield page
              end
            else
              puts "\tdownload"

              headers = self.request_headers
              headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
              headers['Accept-Charset'] = 'UTF-8,*;q=0.5'
              headers['Accept-Encoding'] = 'gzip,deflate,sdch'
              headers['Accept-Language'] = 'en-US,en;q=0.8,ru;q=0.6'
              headers['Cache-Control'] = 'no-cache'
              headers['Connection'] = 'keep-alive'
              #headers['Host'] = 'www.kayak.ru'
              headers['Pragma'] = 'no-cache'
              #headers['Referer'] = 'http://www.kayak.ru/hotels/'
              headers['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.160 Safari/537.22'
              #headers['Cookie'] = 'Apache=g8$yBQ-AAABPYI6vqU-c8-S1c_kQ; kayak=nQ8YDPoK5yfiUMGbfeet; hiddenParams=src%3D%26searchingagain%3Dfalse%26page_origin%3D%26po%3D%26personality%3D%26provider%3D%26r9secret%3D%26r9debug%3D%26recent%3DN%26fid%3D%26ccFeeCalcSelector%3Dundefined; p1.med.sid=13-5JOKTTDsj_OY_V5XjAyZf; p1.med._hmc=rlYBmAIu_T1EoZE1aj2T7YweU7o; p1.med.admin=false; p1.med.token=0_SoukRquslvjKpKC6VJXA; p1.med.sc=6; emos_jcsid=AAABPYI5Yw4AHmf2XUZ0UpmTdGF93jGB:38:AAABPYMejX1OL5EejIMFHgTAgvbatj3j:1363704450428; emos_jcvid=AAABPYI5Yw4AHmf2XUZ0UpmTdGF93jGB:1:AAABPYI5Yw4AHmf2XUZ0UpmTdGF93jGB:1363689431821:0:false:20; _ym_visorc=b; p1.med.searched=true; cluster=5; NSC_q5-tqbslmf=ffffffff09892a1b45525d5f4f58455e445a4a422a59'

              page = get_orig(url, &block)
              #ap page.response

              # Could be redirect
              if page.uri.to_s == url
                # Save to cache file
                FileUtils.mkdir_p ::File.dirname(cached_url)
                ::File.delete cached_url if ::File.exist? cached_url

                page.save(cached_url)

                page_time = get_resource_time(page)
                if page_time
                  ::File.utime(Time.now, page_time.to_time, cached_url)
                end

                puts "\tsaved to #{cached_url}"
              else
                puts "\tskipped, as not the same url: #{page.uri.to_s} != #{url}"
              end
            end
          end

          page
        end

        # Get time from page
        def get_resource_time(page)
          if page && page.response && page.response["last-modified"]
            DateTime.parse(page.response["last-modified"])
          end
        end

        # Check that url was cached
        def get_cached?(url)
          cached_url = cached_file_name(url)
          cached_file_exists?(cached_url)
        end

        # Caching enabled
        def caching_enabled?
          @caching_enabled
        end

        # Debug messages
        def caching_debug?
          @caching_debug
        end

        # Set caching timeout in minutes
        def caching_timeout_at(minutes)
          @caching_timeout = minutes * 60
        end

        def disable_caching?(url)
          @disable_caching_urls && @disable_caching_urls.any? { |rx| url =~ rx }
        end

        # List of regex patterns for urls without caching
        def disable_caching_for(url_patterns)
          @disable_caching_urls = url_patterns
        end

        # List of regex patterns for never timeout data
        def disable_caching_timeout_for(url_patterns)
          @disable_caching_timeout_urls = url_patterns
        end

        # Cached files folder
        def cache_path=(new_cache_path)
          @cache_path = new_cache_path.to_s
        end

        def cache_path
          @cache_path || DEFAULT_CACHE_PATH
        end

        # Handle too long file names
        def url_limit_file_name(url, limit = MAX_FILE_NAME_BYTES)
          file_name = ::File.basename(url).mb_chars
          if file_name.bytesize >= limit
            file_name = file_name.limit(limit-32) + Digest::MD5.hexdigest(file_name)
            url = ::File.dirname(url) + '/' + file_name
          end

          url
        end

        # Filepath for cached url
        def cached_file_name(url)
          # "http://www.kayak.ru/hotels/#/Antalya,Turcija-c1669/2guests"
          uri = URI.parse(url.to_s)
          file_path = "#{cache_path}/#{uri.host}#{uri.path}"
          file_path += 'index' if file_path.ends_with? '/'

          # "/home/sa/projects/copycat/tmp/www.kayak.ru/hotels"
          file_dir = ::File.dirname file_path

          # "index#/Antalya,Turcija-c1669/2guests"
          file_name = ::File.basename file_path
          if uri.query
            file_name += "?#{uri.query}"
          end
          if uri.fragment
            file_name += "##{uri.fragment}"
          end

          # "index#\\Antalya,Turcija-c1669\\2guests"
          file_name = url_limit_file_name(file_name)
          file_name.gsub!('/', '\\') # for Ext4 all chars except '/' are valid for file name

          #[file_path, file_dir, file_name]
          "#{file_dir}/#{file_name}"
        end

        # Cached file exists
        def cached_file_exists?(file_name)
          unless ::File.exists? file_name
            puts "\tnot exist #{file_name}"
            return false
          end

          if @caching_timeout && (@caching_timeout >= 0) && (!@disable_caching_timeout_urls || (@disable_caching_timeout_urls.none? { |rx| file_name =~ rx }))
            # Check for timeout
            if ::Time.now - ::File.mtime(file_name) > @caching_timeout
              puts "\ttimeout #{file_name}"
              return false
            end
          end

          true
        end

        # Delete specific cached file
        def delete_cached_file(url)
          puts "MechanizeCache#delete_cached_file #{url}"
          cached_url = cached_file_name(url)
          ::File.delete cached_url if ::File.exist? cached_url
        end

        private

        # Puts to console
        def puts(*obj)
          Kernel.puts *obj if caching_debug?
        end

      end

      mechanize.caching_enabled = true
    end

  end
end
