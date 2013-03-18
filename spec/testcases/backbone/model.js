rt = {};
rt.blog = {};
rt.blog.models = {};

(function() {
  var b = {}.hasOwnProperty,
    c = rt.blog.models,
    e = function() {
      var a = this.titleImageUrl,
        b = this;
      this.titleImageUrl = function() {
        return a.apply(b, arguments)
      };
      return e.__super__.constructor.apply(this, arguments)
    }, a = e,
    d = Backbone.Model,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) b.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.authorName = function() {
    var a;
    a = this.get("author");
    return a.first_name + " " + a.last_name
  };
  e.prototype.titleImageUrl = function() {
    return this.get("thumbnail") ? this.get("thumbnail").replace(/\-\d{2,}x\d{2,}/, "-800x400") : null
  };
  e.prototype.thumbnailImageUrl = function() {
    return this.get("large_thumbnail") ? this.get("large_thumbnail") : this.get("thumbnail") ? this.get("thumbnail").replace(/\-\d{2,}x\d{2,}/, "-200x150") : null
  };
  e.fetchBySlug = function(a, b) {
    return $.ajax(rt.blog.api_url + "/" + a, {
      dataType: "json",
      success: function(a) {
        a = new rt.blog.models.Post(a);
        return b.success(a)
      }
    })
  };
  c.Post = e
}).call(this);
