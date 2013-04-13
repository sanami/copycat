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
(function() {
  var b, c, d = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this._getLatLngBoundsForPois = d(this._getLatLngBoundsForPois, this);
    this._updateMarkers = d(this._updateMarkers, this);
    this.clearPlaces = d(this.clearPlaces, this);
    this.showPlaces = d(this.showPlaces, this);
    this.removeSubviews = d(this.removeSubviews, this);
    this.renderMarkerView = d(this.renderMarkerView, this);
    this.remove = d(this.remove, this);
    this.render = d(this.render, this);
    return c = a.__super__.constructor.apply(this, arguments)
  }, f = a,
    h = Backbone.View,
    j = function() {
      this.constructor = f
    }, k;
  for (k in h) e.call(h, k) && (f[k] = h[k]);
  j.prototype = h.prototype;
  f.prototype = new j;
  f.__super__ = h.prototype;
  a.prototype.initialize = function() {
    this.collection.on("add remove reset", this.render, this);
    rt.app.events.on("action:show_places_search_on_map", this.showPlaces, this);
    rt.app.events.on("action:clear_places_search_on_map", this.clearPlaces, this);
    return this.freshRequester = new rt.helpers.ajax.FreshRequester
  };
  a.prototype.render = function() {
    this.removeSubviews();
    this.placesSearchMarkerViews = this.collection.map(this.renderMarkerView);
    return this
  };
  a.prototype.remove = function() {
    this.collection.off(null, null, this);
    this.removeSubviews();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.renderMarkerView = function(a) {
    a = new rt.views.map.PoiMarkerView({
      poi: a
    });
    a.changeToSearch();
    a.render();
    return a
  };
  a.prototype.removeSubviews = function() {
    if (null != this.placesSearchMarkerViews) return _(this.placesSearchMarkerViews).each(function(a) {
      return a.remove()
    })
  };
  a.prototype.showPlaces = function(a) {
    var b, c, d = this;
    if (a) return b = {
      profile: "map",
      search_text: a
    }, c = new Backbone.Model, a = function(a) {
      return c.fetch({
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(b),
        success: a,
        url: "/api/v1/pois/search"
      })
    }, this.freshRequester.request(a, function() {
      var a;
      a = c.get("response").results;
      return d._updateMarkers(a)
    });
    this.freshRequester.cancelPending();
    return this._updateMarkers([])
  };
  a.prototype.clearPlaces = function() {
    this.freshRequester.cancelPending();
    return this.collection.reset()
  };
  a.prototype._updateMarkers = function(a) {
    this.collection.reset(a);
    a = this._getLatLngBoundsForPois(this.collection);
    if (!a.isEmpty() && (rt.app.Map.fitBounds(a), 5 < rt.app.Map.getZoom())) return rt.app.Map.setZoom(5)
  };
  a.prototype._getLatLngBoundsForPois = function(a) {
    var b;
    b = new google.maps.LatLngBounds;
    a.each(function(a) {
      if (a.has("latitude") && a.has("longitude")) return a = new google.maps.LatLng(a.get("latitude"), a.get("longitude")), b.extend(a)
    });
    return b
  };
  b.PlacesSearchMarkersView = a
}).call(this);
(function() {
  var b, c, d = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).overlay || (b.overlay = {});
  b = rt.views.overlay;
  var a = function() {
    this.remove = d(this.remove, this);
    this.render = d(this.render, this);
    this.initialize = d(this.initialize, this);
    return c = a.__super__.constructor.apply(this, arguments)
  }, f = a,
    h = Backbone.View,
    j = function() {
      this.constructor = f
    }, k;
  for (k in h) e.call(h, k) && (f[k] = h[k]);
  j.prototype = h.prototype;
  f.prototype = new j;
  f.__super__ = h.prototype;
  a.prototype.className =
    "overlay-view";
  a.prototype.initialize = function(a) {
    return this.view = a.view
  };
  a.prototype.render = function() {
    this.$el.html(this.view.render().el);
    this.overlaySidebarView = new rt.views.overlay.OverlaySidebarView;
    $("body").append(this.overlaySidebarView.render().el);
    return this
  };
  a.prototype.remove = function() {
    var b, c;
    null != (b = this.overlaySidebarView) && b.remove();
    null != (c = this.view) && c.remove();
    return a.__super__.remove.apply(this, arguments)
  };
  b.OverlayView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, d = {}.hasOwnProperty;
  rt.views || (rt.views = {});
  var e = rt.views,
    a = function() {
      this._cleanup = c(this._cleanup, this);
      this.renderRemove = c(this.renderRemove, this);
      this.renderAdd = c(this.renderAdd, this);
      this.remove = c(this.remove, this);
      this.render = c(this.render, this);
      this.initialize = c(this.initialize, this);
      return b = a.__super__.constructor.apply(this, arguments)
    }, f = a,
    h = Backbone.View,
    j = function() {
      this.constructor = f
    }, k;
  for (k in h) d.call(h,
  k) && (f[k] = h[k]);
  j.prototype = h.prototype;
  f.prototype = new j;
  f.__super__ = h.prototype;
  a.prototype.initialize = function(a) {
    this.collection.on("reset", this.render, this);
    this.collection.on("add", this.renderAdd, this);
    this.collection.on("remove", this.renderRemove, this);
    return this.modelViewClass = a.modelViewClass
  };
  a.prototype.render = function() {
    var a = this;
    this._cleanup();
    this.modelViews = {};
    this.collection.each(function() {
      return a.renderAdd
    });
    return this
  };
  a.prototype.remove = function() {
    this._cleanup();
    this.collection.off(null,
    null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.renderAdd = function(a) {
    var b;
    b = new this.modelViewClass({
      model: a
    });
    b.render();
    return this.modelViews[a.id] = b
  };
  a.prototype.renderRemove = function(a) {
    this.modelViews[a.id].remove();
    return delete this.modelViews[a.id]
  };
  a.prototype._cleanup = function() {
    if (null != this.modelViews) return _(this.modelViews).each(function(a) {
      return a.remove()
    }), this.modelViews = null
  };
  e.DomlessCollectionView = a
}).call(this);
(function() {
  var b, c, d, e, a = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, f = {}.hasOwnProperty,
    h = function(a, b) {
      function c() {
        this.constructor = a
      }
      for (var d in b) f.call(b, d) && (a[d] = b[d]);
      c.prototype = b.prototype;
      a.prototype = new c;
      a.__super__ = b.prototype;
      return a
    };
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var j = function() {
    this.shareSummary = a(this.shareSummary, this);
    this.shareTitle = a(this.shareTitle, this);
    this.shareUrl = a(this.shareUrl, this);
    this._changeTab = a(this._changeTab, this);
    this.bookingClicked = a(this.bookingClicked, this);
    this.descriptionTabClicked = a(this.descriptionTabClicked, this);
    this.saveClicked = a(this.saveClicked, this);
    this.addToTripClicked = a(this.addToTripClicked, this);
    this._showFacebookLander = a(this._showFacebookLander, this);
    this.close = a(this.close, this);
    this.remove = a(this.remove, this);
    this.initialize = a(this.initialize, this);
    return c = j.__super__.constructor.apply(this, arguments)
  };
  h(j, Backbone.View);
  j.prototype.template = JST["templates/pois/show"];
  j.prototype.events = {
    "click .close-notification": "closeNotificationClicked",
    "click .deals-booking.folded": "expandNotificationClicked",
    "click .tab.description": "descriptionTabClicked",
    "click .booking": "bookingClicked",
    "click .add-to-trip": "addToTripClicked",
    "click .save": "saveClicked"
  };
  j.prototype.className = "show-place-view overlay show-description";
  j.prototype.initialize = function(a) {
    this.activeTrip = a.activeTrip;
    this.sessionFacade = rt.app.facades.sessionFacade;
    this.permissionsFacade = rt.app.facades.permissionsFacade;
    this.browserSpecsFacade = rt.app.facades.browserSpecsFacade;
    this.bucketListFacade = rt.app.facades.bucketListFacade;
    this.commentsListView = new rt.views.comments.CommentsListView({
      collection: this.model.getCommentsList()
    });
    return this.requestAndRenderBookingInfo()
  };
  j.prototype.render = function() {
    var a, b, c;
    null != (a = this.sidebarView) && a.remove();
    this.sidebarView = null;
    a = this.$el;
    c = this.model;
    b = c.get("categoryId") || _.first(c.get("categories"));
    b = {
      poi: c.toJSON(),
      categoryName: rt.app.helpers.categories.categoryName(b),
      group: rt.app.helpers.categories.group(b),
      shareTitle: this.shareTitle(),
      shareUrl: this.shareUrl(),
      shareSummary: this.shareSummary(),
      bookable: this.model.bookable()
    };
    a.html(this.template(b));
    b = [];
    b.push(new rt.views.overlay.EditPlaceOverlaySidebarActionView({
      model: c
    }));
    b.push(new rt.views.overlay.DeletePlaceOverlaySidebarActionView({
      model: c
    }));
    this.sidebarView = new rt.views.overlay.OverlaySidebarView({
      actionViews: b
    });
    this.sidebarView.render();
    this.$el.prepend(this.sidebarView.el);
    b = this.bucketListFacade.getBucketLists();
    c = new rt.views.bucket_lists.BucketListsMenuView({
      collection: b,
      poi: c,
      templateName: "templates/bucket_lists/menu_on_overlay"
    });
    a.find(".description").after(this.commentsListView.render().el);
    a.find(".actions .action.add-to-trip").after(c.render().el);
    this._showFacebookLander() && (this.fbSpecialLander = new rt.views.users.FacebookNotificationView, a.find(".overlay-container").prepend(this.fbSpecialLander.render().el));
    return this
  };
  j.prototype.requestAndRenderBookingInfo = function() {
    var a, b = this;
    this.bookingInfo = {
      loaded: !1,
      data: null
    };
    if (this.model.bookable()) return a = function(a) {
      b.bookingInfo.loaded = !0;
      if (b.bookingInfo.data = a) return b.renderLowRate(b.bookingInfo.data.lowRate)
    }, rt.helpers.expedia.requestBookingInfo(this.model.toJSON(), a)
  };
  j.prototype.renderLowRate = function(a) {
    return this.$el.find("a.booking").html("BOOK NOW (from $" + Math.round(a) + ")")
  };
  j.prototype.remove = function() {
    var a, b, c;
    null != (a = this.sidebarView) && a.remove();
    null != (b = this.bookingView) && b.remove();
    null != (c = this.fbSpecialLander) && c.remove();
    return j.__super__.remove.apply(this, arguments)
  };
  j.prototype.close = function() {
    this.remove();
    return rt.app.router.navigate("#")
  };
  j.prototype.afterDomInsertion = function() {
    this.commentsListView.tryToFocusOnSelectedComment();
    return stButtons.locateElements()
  };
  j.prototype._showFacebookLander = function() {
    var a, b, c;
    b = rt.helpers.session.notLoggedIn();
    c = null != document.referrer.match(/facebook.com/);
    a = rt.app.router.initialRoute;
    return c && b && a
  };
  j.prototype.addToTripClicked = function(a) {
    a.preventDefault();
    rt.app.events.trigger("ui:add_to_trip", this.model);
    return rt.app.events.trigger("analytics:trip:add", {
      data: {
        via: "overlay"
      }
    })
  };
  j.prototype.saveClicked = function() {};
  j.prototype.descriptionTabClicked = function() {
    return this._changeTab("description")
  };
  j.prototype.bookingClicked = function() {
    this.bookingView || (this.bookingView = new rt.views.pois.BookingView({
      model: this.model,
      bookingInfo: null
    }));
    return rt.helpers.modal.open({
      view: this.bookingView
    }).on("backdrop-click", rt.helpers.modal.close)
  };
  j.prototype._changeTab = function(a) {
    return this.$el.removeClass("show-description show-booking").addClass("show-" + a)
  };
  j.prototype.shareUrl = function() {
    return "http://roadtrippers.com/places/" + this.model.id
  };
  j.prototype.shareTitle = function() {
    return null != this.model.get("name") ? null != this.model.get("subtitle") ? "" + this.model.get("name") + ", " + this.model.get("subtitle") : "" + this.model.get("name") : "A place on Roadtrippers"
  };
  j.prototype.shareSummary = function() {
    return "I just found an awesome place on Roadtrippers.com!"
  };
  j.prototype.closeNotificationClicked = function(a) {
    a.preventDefault();
    return $(a.target).parent(".deals-booking").addClass("folded")
  };
  j.prototype.expandNotificationClicked = function(a) {
    return $(a.currentTarget).removeClass("folded")
  };
  b.ShowView = j;
  b = rt.views.overlay;
  var k = function() {
    this.authorized = a(this.authorized, this);
    this.actionClicked = a(this.actionClicked, this);
    this.label = a(this.label, this);
    this.fontAwesomeClass = a(this.fontAwesomeClass, this);
    this.dynamicClassName = a(this.dynamicClassName, this);
    return d = k.__super__.constructor.apply(this, arguments)
  };
  h(k, rt.views.overlay.OverlaySidebarActionView);
  k.prototype.dynamicClassName = function() {
    return "edit-place"
  };
  k.prototype.fontAwesomeClass = function() {
    return "icon-edit"
  };
  k.prototype.label = function() {
    return "Edit"
  };
  k.prototype.actionClicked = function(a) {
    a.preventDefault();
    rt.app.router.navigate(rt.routes.edit_place_path(this.model.get("_id")));
    return !1
  };
  k.prototype.authorized = function() {
    return !0
  };
  b.EditPlaceOverlaySidebarActionView = k;
  b = rt.views.overlay;
  var g = function() {
    this.authorized = a(this.authorized, this);
    this.actionClicked = a(this.actionClicked, this);
    this.label = a(this.label, this);
    this.fontAwesomeClass = a(this.fontAwesomeClass,
    this);
    this.dynamicClassName = a(this.dynamicClassName, this);
    return e = g.__super__.constructor.apply(this, arguments)
  };
  h(g, rt.views.overlay.OverlaySidebarActionView);
  g.prototype.dynamicClassName = function() {
    return "delete-place"
  };
  g.prototype.fontAwesomeClass = function() {
    return "icon-trash"
  };
  g.prototype.label = function() {
    return "Delete"
  };
  g.prototype.actionClicked = function(a) {
    var b;
    a.preventDefault();
    b = this.model.get("name");
    if (confirm('Are you sure you wish to delete "' + b + '"?')) return this.model.destroy({
      success: function() {
        return $(".messages").empty().append('<div class="alert-message">Successfully deleted "' + b + '".</div>')
      },
      error: function() {
        return $(".messages").empty().append('<div class="alert-message">Oops.  There was a problem deleting "' + b + '"!</div>')
      }
    })
  };
  g.prototype.authorized = function() {
    return rt.permissions.can("destroy_poi")
  };
  b.DeletePlaceOverlaySidebarActionView = g
}).call(this);
