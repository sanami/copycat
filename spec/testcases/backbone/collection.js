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
(function() {
  var b, c = {}.hasOwnProperty,
    d = rt.collections,
    e = function() {
      return b = e.__super__.constructor.apply(this, arguments)
    }, a = e,
    f = Backbone.Collection,
    h = function() {
      this.constructor = a
    }, j;
  for (j in f) c.call(f, j) && (a[j] = f[j]);
  h.prototype = f.prototype;
  a.prototype = new h;
  a.__super__ = f.prototype;
  e.prototype.url = "/api/v1/poi-change-requests";
  e.prototype.model = rt.models.PoiChangeRequest;
  d.PoiChangeRequestsCollection = e
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty,
    d = rt.guide.collections,
    e = function() {
      var a = this.initialize,
        c = this;
      this.initialize = function() {
        return a.apply(c, arguments)
      };
      return b = e.__super__.constructor.apply(this, arguments)
    }, a = e,
    f = Backbone.Collection,
    h = function() {
      this.constructor = a
    }, j;
  for (j in f) c.call(f, j) && (a[j] = f[j]);
  h.prototype = f.prototype;
  a.prototype = new h;
  a.__super__ = f.prototype;
  e.prototype.comparator = function(a, b) {
    var c, d;
    c = a.get("updated_at");
    d = b.get("updated_at");
    return c > d ? -1 : c < d ? 1 : 0
  };
  e.prototype.initialize = function(a, b) {
    var c = this;
    if (null != (null != b ? b.parentClass : void 0)) return _.each(b.tripCollection, function(a) {
      return c.add(new rt.guide.models.GuideTrip(null, {
        trip: a,
        parentClass: b.parentClass
      }))
    }), _.each(b.bucketListCollection, function(a) {
      if (c.bucketListBelongs(a)) return c.add(new rt.guide.models.GuideBucketList(null, {
        bucketList: a,
        parentClass: b.parentClass
      }))
    })
  };
  e.prototype.bucketListBelongs = function(a) {
    return null != a.name
  };
  d.GuideItemCollection = e
}).call(this);
(function() {
  var b, c, d = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty,
    a = function(a, b) {
      function c() {
        this.constructor = a
      }
      for (var d in b) e.call(b, d) && (a[d] = b[d]);
      c.prototype = b.prototype;
      a.prototype = new c;
      a.__super__ = b.prototype;
      return a
    }, f = rt.models,
    h = function() {
      this.serialize = d(this.serialize, this);
      this.changeState = d(this.changeState, this);
      return b = h.__super__.constructor.apply(this, arguments)
    };
  a(h, rt.models.Poi);
  h.prototype.defaults = {
    categoryId: null,
    bucketList: !1
  };
  h.prototype.changeState = function(a) {
    if (this.get("bucketList") !== a.bucketList || this.get("categoryId") !== a.categoryId) return this.set(a), this.trigger("change:state")
  };
  h.prototype.serialize = function() {
    return rt.utils.serializeModel(this, "rt.models.MappingPoi")
  };
  h.prototype.getCommentsList = function() {
    var a;
    a = this.has("comments") ? this.get("comments") : [];
    return new rt.collections.CommentsCollection(a, {
      commentable: this
    })
  };
  f.MappingPoi = h;
  var f = rt.collections,
    j = function() {
      this.hasPoi = d(this.hasPoi, this);
      return c = j.__super__.constructor.apply(this, arguments)
    };
  a(j, Backbone.Collection);
  j.prototype.model = rt.models.MappingPoi;
  j.prototype.url = "/api/v1/pois";
  j.prototype.hasPoi = function(a) {
    return this.any(function(b) {
      return b.id === a.id
    })
  };
  f.MappingPoisCollection = j
}).call(this);
