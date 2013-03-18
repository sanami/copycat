(function() {
  var b = {}.hasOwnProperty,
    c = rt.blog.collections,
    e = function() {
      return e.__super__.constructor.apply(this, arguments)
    }, a = e,
    d = Backbone.Collection,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) b.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.model = rt.blog.models.Post;
  e.prototype.current_page = 1;
  e.prototype.url = function() {
    return rt.blog.api_url
  };
  e.prototype.initialize = function(a, b) {
    e.__super__.initialize.call(this, a, b);
    return _.bindAll(this)
  };
  e.prototype.resetPosts = function(a) {
    return this.reset(a)
  };
  e.prototype.addPosts = function(a) {
    return this.add(a)
  };
  e.prototype.getNextPage = function() {
    return this.getRecent(this.current_page + 1, !1)
  };
  e.prototype.getRecent = function(a, b) {
    var c, d = this;
    null == a && (a = 1);
    null == b && (b = !0);
    c = {
      page: a
    };
    return $.ajax(this.url(), {
      data: c,
      dataType: "json",
      success: function(c) {
        0 < c.length && (d.current_page = a);
        return b ? d.resetPosts(c) : d.addPosts(c)
      }
    })
  };
  e.prototype.findBySlug = function(a) {
    var b, c = this;
    return (b = this.find(function(b) {
      return b.get("wp_slug") === a
    })) ? this.trigger("post_found", b) : rt.blog.models.Post.fetchBySlug(a, {
      success: function(a) {
        return c.trigger("post_found", a)
      }
    })
  };
  c.PostsCollection = e
}).call(this);
