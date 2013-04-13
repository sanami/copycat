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
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, d = {}.hasOwnProperty,
    e = rt.guide.models,
    a = function() {
      this.replaceState = c(this.replaceState, this);
      this.setHistoryStateData = c(this.setHistoryStateData, this);
      this.initialize = c(this.initialize, this);
      return b = a.__super__.constructor.apply(this, arguments)
    }, f = a,
    h = Backbone.Model,
    j = function() {
      this.constructor = f
    }, k;
  for (k in h) d.call(h, k) && (f[k] = h[k]);
  j.prototype = h.prototype;
  f.prototype = new j;
  f.__super__ = h.prototype;
  a.prototype.initialize = function(a, b) {
    var c, d = this;
    if (null != (null != b ? b.guide : void 0)) c = b.guide, _("username tagline website image_mini_url image_thumb_url banner_image guide_name guide_title guide_description".split(" ")).each(function(a) {
      return d.set(a, c.get(a))
    }), this.set({
      all_collection: new rt.guide.collections.GuideItemCollection(null, {
        bucketListCollection: c.get("bucket_lists"),
        tripCollection: c.get("trips"),
        parentClass: "all"
      })
    }), this.set({
      bucket_list_collection: new rt.guide.collections.GuideItemCollection(null, {
        bucketListCollection: c.get("bucket_lists"),
        parentClass: "bucket-lists"
      })
    }), this.set({
      trip_collection: new rt.guide.collections.GuideItemCollection(null, {
        tripCollection: c.get("trips"),
        parentClass: "trips"
      })
    }), this.set({
      active_tab: "all"
    });
    this.on("change:active_tab", this.replaceState, this);
    this.get("all_collection").on("change:active", this.replaceState, this);
    this.get("trip_collection").on("change:active", this.replaceState, this);
    return this.get("bucket_list_collection").on("change:active", this.replaceState, this)
  };
  a.prototype.setHistoryStateData = function(a) {
    var b;
    this.set("active_tab", a.active_tab);
    b = function(a, b) {
      var c;
      c = (c = a.find(function(a) {
        return a.id === b
      })) ? c.set("active", !0) : void 0;
      return c
    };
    b(this.get("all_collection"), a.active_all_item);
    b(this.get("trip_collection"), a.active_trip_item);
    return b(this.get("bucket_list_collection"), a.active_bucket_list_item)
  };
  a.prototype.replaceState = function() {
    var a;
    a = function(a) {
      return (a = a.find(function(a) {
        return a.get("active")
      })) ? a.id : null
    };
    a = {
      active_tab: this.get("active_tab"),
      active_all_item: a(this.get("all_collection")),
      active_trip_item: a(this.get("trip_collection")),
      active_bucket_list_item: a(this.get("bucket_list_collection"))
    };
    return rt.app.router.replaceStateData(a)
  };
  e.Guide = a
}).call(this);
(function() {
  var b, c, d = {}.hasOwnProperty;
  (b = rt.models).pois || (b.pois = {});
  b = rt.models.pois;
  var e = function() {
    var a = this.fetch,
      b = this;
    this.fetch = function() {
      return a.apply(b, arguments)
    };
    return c = e.__super__.constructor.apply(this, arguments)
  }, a = e,
    f = Backbone.Model,
    h = function() {
      this.constructor = a
    }, j;
  for (j in f) d.call(f, j) && (a[j] = f[j]);
  h.prototype = f.prototype;
  a.prototype = new h;
  a.__super__ = f.prototype;
  e.prototype.url = "/api/v1/pois";
  e.prototype.defaults = {
    query_params: null,
    pois: null
  };
  e.prototype.fetch = function(a) {
    !a.data && this.has("query_params") && (a.data = this.get("query_params"));
    return e.__super__.fetch.call(this, a)
  };
  b.PoisQuery = e
}).call(this);
