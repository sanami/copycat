(function() {
  var b = {}.hasOwnProperty,
    c = rt.blog.views,
    e = function() {
      return e.__super__.constructor.apply(this, arguments)
    }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) b.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["partials/blog/templates/sidebar"];
  e.prototype.el = "#blogs";
  e.prototype.events = {
    "scroll .primary": "fetchPosts"
  };
  e.prototype.initialize = function(a) {
    e.__super__.initialize.call(this, a);
    _.bindAll(this);
    this.posts = a.posts;
    this.posts.on("reset", this.render);
    return this.posts.on("add", this.append)
  };
  e.prototype.append = function(a) {
    a = new rt.blog.views.SidebarItem({
      model: a
    });
    return this.$(".posts").append(a.render().el)
  };
  e.prototype.render = function() {
    var a, b, c, d;
    this.$el.html(this.template());
    d = this.posts.models;
    b = 0;
    for (c = d.length; b < c; b++) a = d[b], this.append(a);
    this.$(".primary").on("scroll", this.fetchPosts);
    return this.$el
  };
  e.prototype.fetchPosts = function(a) {
    a = $(a.target);
    if (a[0].scrollHeight - a.scrollTop() === a.outerHeight()) return this.posts.getNextPage()
  };
  c.Sidebar = e
}).call(this);
