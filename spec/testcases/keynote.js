(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  this.Keynote = (function() {
    Keynote.options = {
      cover: '.keynote-cover',
      coverBackground: '.keynote-cover-img',
      header: '.keynote-header',
      container: '.container',
      navigator: '.keynote-navigator',
      marker: '.keynote-marker',
      delay: 5000,
      tooLongDelay: null
    };
    Keynote.prototype._resize = function(width) {
      var captionHeight, height;
      if (width == null) {
        width = this.el.width();
      }
      $().add(this.viewport).add(this.items).width(width);
      height = this.captions.maxHeight();
      navHeight = this.navigator.height();
      this.covers.height(height + navHeight);
      this.viewport.height(this.items.maxHeight());
      this.navigator.css({
        top: height// - this.navigator.height()
      });
      return this.show(null, true);
    };
    function Keynote(element, options) {
      if (options == null) {
        options = {};
      }
      this.play = __bind(this.play, this);
      this.next = __bind(this.next, this);
      this.to = __bind(this.to, this);
      this._resize = __bind(this._resize, this);
      this.options = options = $.extend({}, Keynote.options, options);
      this.el = $(element).addClass('keynote');
      this.header = this.el.find(options.header).addClass('keynote-header');
      this.shelf = this.el.find(options.container).addClass('keynote-shelf').wrap('<div class="keynote-viewport"></div>');
      this.items = this.shelf.children().addClass('keynote-item');
      this.viewport = this.el.find('.keynote-viewport');
      this.covers = this.items.find(options.cover).addClass('keynote-cover');
      this.photos = this.covers.find(options.coverBackground).addClass('keynote-cover-img').load(__bind(function() {
        return this._resize();
      }, this));
      this.covers.each(function() {
        return $(this).children().not(options.coverBackground).wrapAll('<div class="keynote-cover-caption"></div>');
      });
      this.captions = this.covers.find('.keynote-cover-caption');
      this.navigator = this.el.find(options.navigator).addClass('keynote-navigator');
      this.buttons = this.navigator.find('li');
      this.marker = this.navigator.find(options.marker).addClass('keynote-marker');
      this._resize();
      $(window).resize(__bind(function() {
        return this._resize();
      }, this));
      this.navigator.delegate('a', 'click', __bind(function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.pause();
        return this.to($(e.currentTarget).attr('href'));
      }, this));
      this.play();
    }
    Keynote.prototype.to = function(itemId, refresh) {
      var item, left, link;
      if (itemId == null) {
        itemId = this.selectedItemId || ("#" + (this.items.attr('id')));
      }
      if (refresh == null) {
        refresh = false;
      }
      if ((this.selectedItemId !== itemId) || refresh) {
        this.selectedItemId = itemId;
        item = this.items.filter(itemId);
        link = this.buttons.removeClass('active').find("a[href=\"" + itemId + "\"]").parent().addClass('active').end();
        left = -this.el.width() * this.items.index(item);
        this.marker.tween({
          left: link.position().left
        });
        this.shelf.tween({
          left: left
        });
        return;
      }
    };
    Keynote.prototype.show = Keynote.prototype.to;
    Keynote.prototype.next = function() {
      var item, itemId, nextIndex, nextItem, size;
      itemId = this.selectedItemId || ("#" + (this.items.attr('id')));
      item = this.items.filter(itemId);
      size = this.items.size();
      nextIndex = this.items.index(item) + 1;
      if (nextIndex === size) {
        nextIndex = 0;
      }
      nextItem = this.items.eq(nextIndex);
      return this.to("#" + (nextItem.attr('id')));
    };
    Keynote.prototype.play = function() {
      if (this._waiting) {
        clearTimeout(this._waiting);
        delete this._waiting;
      }
      if (!this._playing) {
        return this._playing = setInterval(this.next, this.options.delay);
      }
    };
    Keynote.prototype.pause = function() {
      if (this._playing != null) {
        clearInterval(this._playing);
        delete this._playing;
        if (this.options.tooLongDelay != null) {
          return this._waiting = setTimeout(this.play, this.options.tooLongDelay);
        }
      }
    };
    return Keynote;
  })();
  $.fn.maxHeight = function() {
    var maxHeight;
    maxHeight = this.eq(0).outerHeight(true);
    this.each(function() {
      var height;
      height = $(this).outerHeight(true);
      if (height > maxHeight) {
        return maxHeight = height;
      }
    });
    return maxHeight;
  };
  $.fn.tween = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = $t(this.eq(0))).tween.apply(_ref, args);
  };
}).call(this);
