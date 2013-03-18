(function() {
  window.rt = {};
  rt.helpers = {};
  rt.models = {};
  rt.collections = {};
  rt.routers = {};
  rt.staff = {};
  rt.staff.models = {};
  rt.staff.collections = {};
  rt.staff.routers = {};
  rt.views = {};
  rt.layouts = {};
  rt.app = {};
  rt.facades = {};
  rt.controllers = {};
  rt.init = function(b) {
    var c, e, a, d, f, h, g, j, n, p, q, m;
    rt.helpers.app.isIPhoneAgent() && rt.helpers.app.isMobileScreen() && (window.scrollTo(0, 1), 568 === window.screen.height && (document.querySelector("meta[name=viewport]").content = "maximum-scale=1.0, width=device-width, width=320.1, initial-scale=1.0"));
    rt.routes || (rt.routes = window.Routes);
    rt.app.Data = b;
    rt.app.helpers = {
      categories: new rt.helpers.Categories,
      mapMarker: new rt.helpers.MapMarker
    };
    rt.app.events = _.extend({}, Backbone.Events);
    rt.app.env = "production";
    rt.app.models = {};
    rt.app.collections = {};
    rt.app.models.url = q = new Backbone.Model;
    rt.app.models.navMode = g = new rt.models.NavMode;
    j = rt.app.collections.poiCollection = new rt.collections.PoisCollection((null != b ? b.pois : void 0) || []);
    m = rt.app.collections.userCollection = new rt.collections.UserCollection;
    f = new rt.collections.FeaturedUsersCollection(null, {
      navMode: g
    });
    a = null != b.current_user ? m["new"](b.current_user) : null;
    null != b.user_identities && (p = new rt.collections.UserIdentitiesCollection(b.user_identities, {}));
    rt.app.currentUser = new rt.models.CurrentUser({
      user: a,
      identities: p
    });
    rt.permissions = new rt.models.Permissions(null, {
      activeUser: rt.app.currentUser
    });
    rt.app.models.session = new Backbone.Model(b.session);
    rt.app.facades = {};
    rt.app.facades.bootstrapFacade = new rt.facades.BootstrapFacade;
    rt.app.facades.environmentFacade = new rt.facades.EnvironmentFacade;
    rt.app.facades.permissionsFacade = new rt.facades.PermissionsFacade;
    rt.app.facades.sessionFacade = new rt.facades.SessionFacade;
    rt.app.facades.browserSpecsFacade = new rt.facades.BrowserSpecsFacade;
    rt.app.facades.bucketListFacade = new rt.facades.BucketListFacade;
    a = new rt.collections.CategoriesCollection((null != b ? b.categories : void 0) || []);
    e = rt.app.facades.bucketListFacade.getBucketLists();
    rt.app.collections.tripCollection = p = new rt.collections.TripCollection([]);
    rt.app.models.activeTrip = b = new rt.models.ActiveTrip(null, {
      tripCollection: p
    });
    h = new rt.models.Map({
      categories: a,
      trip: b
    });
    rt.app.Map = new google.maps.Map(document.getElementById("mapCanvas"), h.get("mapOptions"));

    rt.app.DirectionsService = new google.maps.DirectionsService;
    rt.app.AutocompleteService = new google.maps.places.AutocompleteService;
    rt.app.PlacesService = new google.maps.places.PlacesService(rt.app.Map);
    rt.app.geocoder = new google.maps.Geocoder;
    d = new rt.models.DistanceSlider;
    n = new rt.models.RoutePolygon(null, {
      distanceSlider: d,
      activeTrip: b
    });
    c = new rt.collections.ActiveCategoriesPoisCollection(null, {
      categoriesCollection: a,
      activeTrip: b,
      distanceSlider: d
    });
    rt.context = new rt.Context({
      bucketListsCollection: e,
      categoriesCollection: a,
      distanceSlider: d,
      activeTrip: b,
      activeCategoriesPoisCollection: c
    });
    (new rt.views.side_nav.SideNavView({
      navMode: g
    })).render();
    new rt.views.notification_bar.NotificationBarView({
      activeTrip: b
    });
    (new rt.views.map.MapView({
      model: h,
      activeTrip: b
    })).render();
    (new rt.views.map.RoutePolygonOverlayView({
      model: n
    })).render();
    new rt.views.notifications.LoadingIndicator;
    rt.app.collections.blogPostsCollection = c = new rt.blog.collections.PostsCollection(rt.app.Data.blog_posts);
    (new rt.views.side_bar.SidebarView({
      categories: a,
      activeTrip: b,
      trips: p,
      bucketLists: e,
      navMode: g,
      distanceSlider: d,
      featuredUsersCollection: f,
      blogPostsCollection: c
    })).render();
    new rt.views.notifications.OverlayView;
    (new rt.views.top_nav.TopNavView).render();
    new rt.views.metrics.DefaultMetricsView;
    f = new rt.views.trips.TripSummarySidebarItineraryButtonView({
      model: b
    });
    f.render();
    $("#sidebar").after(f.el);
    f = new rt.views.trips.TripSummaryView({
      model: b
    });
    f.render();
    $("#misc-container").append(f.el);
    new rt.views.search.SearchView;
    rt.app.router = new rt.routers.MapRouter({
      navMode: g,
      activeTrip: b,
      tripCollection: p,
      userCollection: m,
      url: q,
      sessionFacade: rt.app.facades.sessionFacade,
      categories: a,
      pois: j,
      blogPostsCollection: c
    });
    rt.app.controllers = {
      analytics: new rt.controllers.AnalyticsController(rt.app.events)
    };
    rt.helpers.app.isMobileScreen() || $("a[rel=tooltip]").tooltip();
    $("body").on("click",
      ".js-route", function(a) {
      a.preventDefault();
      return rt.app.router.navigate($(a.currentTarget).attr("href"), {
        trigger: !0
      })
    });
    $("body").on("click", ".js-event", function(a) {
      a.preventDefault();
      return rt.app.events.trigger($(a.currentTarget).data("event"))
    });
    $(document).keyup(function(a) {
      if (27 === a.keyCode) return rt.app.events.trigger("key:escape")
    });
    return rt.app.router.start()
  }
}).call(this);


$.widget("custom.catcomplete", $.ui.autocomplete, {
  _renderMenu: function(b, c) {
    var e = this,
      a = "";
    $.each(c, function(c, f) {
      f.category != a && (b.append("<li class='ui-autocomplete-category'>" + f.category + "</li>"), a = f.category);
      e._renderItem(b, f)
    })
  }
});


(function() {
  var b, c, e, a;
  (b = window.rt).trip_planner || (b.trip_planner = {});
  (c = window.rt.trip_planner).models || (c.models = {});
  (e = window.rt.trip_planner).templates || (e.templates = {});
  (a = window.rt.trip_planner).views || (a.views = {})
}).call(this);


(function() {
  var b = {}.hasOwnProperty,
    c = rt.trip_planner.models,
    e = function() {
      var a = this.initialize,
        b = this;
      this.initialize = function() {
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
  e.prototype.initialize = function() {};
  c.Trip = e
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/actions"] = function(b) {
    b || (b = {});
    var c = b.safe,
      e = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    e || (e = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {}).call(b);
    b.safe = c;
    b.escape = e;
    return ""
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/control_buttons"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('\n<div class="buttons">\n  <a class="new-trip-link" href="#" tabindex="26">\n    <i class="icon-new-trip"></i>New trip\n  </a>\n  <a class="save-section-toggle" href="#" tabindex="27">\n    <i class="icon-save-trip"></i>Save trip\n  </a>\n</div>\n<div class="show-saved-trips">\n  <a class="show-saved-trips-link" href="#">\n    <i class="icon-saved-trips"></i>\n    Saved Trips\n  </a>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/default_profile_photo"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<img class="profile-photo" src="');
      c.push(this.profilePhotoUrl && this.profilePhotoUrl.ecoSafe ? this.profilePhotoUrl : "undefined" !== typeof this.profilePhotoUrl && null != this.profilePhotoUrl ? a(this.profilePhotoUrl) : "");
      c.push('">\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/itinerary_link"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a class="itinerary-link js-route" href="');
      c.push(e(rt.routes.itinerary_path(this.id)));
      c.push('">\n  <i class="icon-print icon-white"></i> Itinerary\n</a>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/leg"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="info">\n  <div class="trip-controls add-waypoint">\n    <a class="');
      this.addWaypointEnabled || c.push(e("disabled"));
      c.push('" href="#" tabindex="100" data-placement="right" data-title="Add Waypoint" rel="tooltip">\n      <i class="icon-plus-sign"></i>\n    </a>\n  </div>\n  <i class="highway-icon icon-road"></i>\n  <i class="byways-icon icon-way"></i>\n  <p class="length">\n    <i class="icon-ruler"></i>\n    <span class="value" data-bind="distance">');
      c.push(e(this.distance));
      c.push('</span>\n  </p>\n  <p class="time">\n    <i class="icon-time"></i>\n    <span class="value" data-bind="duration">');
      c.push(e(this.time));
      c.push("</span>\n  </p>\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/new_trip_confirmation"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h2>Save trip?</h2>\n<p>Sure you dont want to save this trip before starting a new one?</p>\n<a class="button primary" data-trigger-event="');
      c.push(e(this.ok_event));
      c.push('" href="#">yes, save trip</a>\n<a class="button" data-trigger-event="');
      c.push(e(this.cancel_event));
      c.push('" href="#">no, start again</a>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/path"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push("\n");
      c.push("\n");
      c.push("\n");
      c.push('\n<div class="append-waypoint">\n  <div class="info">\n    <div class="trip-controls add-waypoint">\n      <a class="');
      this.addWaypointEnabled || c.push(" disabled".ecoSafe ? " disabled" : a(" disabled"));
      c.push('" href="#" tabindex="100" data-placement="right" data-title="Add Waypoint" rel="tooltip">\n        <i class="icon-plus-sign"></i>\n      </a>\n    </div>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/share_trip"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-title="Share" data-placement="bottom" rel="tooltip"><i class="icon-share-trip"></i></a>\n<ul class="share-list dropdown-menu">\n  <li>\n    <span class=\'st_facebook\' st_url="');
      c.push(e(this.url));
      c.push('" st_title="');
      c.push(e(this.title));
      c.push('" st_summary="');
      c.push(e(this.summary));
      c.push('" st_image="/rt/trip_share_thumb.jpg"></span>\n  </li>\n  <li>\n    <span class=\'st_twitter\' st_url="');
      c.push(e(this.url));
      c.push('" st_title="');
      c.push(e(this.title));
      c.push('" st_summary="');
      c.push(e(this.summary));
      c.push('" st_via="???" st_image="/rt/trip_share_thumb.jpg"></span>\n  </li>\n  <li>\n    <span class=\'st_email\' st_url="');
      c.push(e(this.url));
      c.push('" st_title="');
      c.push(e(this.title));
      c.push('" st_summary="');
      c.push(e(this.summary));
      c.push('" st_image="/rt/trip_share_thumb.jpg"></span>\n  </li>\n</ul>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/trip_options"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="trip-user"></div>\n<a class="settings-section-toggle" href="#" data-placement="bottom" data-title="Fuel Settings" rel="tooltip"><i class="icon-cog"></i></a>\n<a href="#" class="use-highways-toggle ');
      c.push(e(this.useHighways ? "checked" : "road-type-way"));
      c.push('" data-placement="bottom" data-title="Highways or Byways?" rel="tooltip">\n  ');
      this.useHighways ? c.push('\n    <i class="icon-road"></i>\n  ') : c.push('\n    <i class="icon-way"></i>\n  ');
      c.push('\n</a>\n<a href="#" class="expand-all ');
      this.expandedMode && c.push(e("active"));
      c.push('" data-placement="bottom" data-title="Expand/Collapse" rel="tooltip"><i class="icon-plus-sign"></i></a>\n<div class="toolbar-share"></div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/trip_save"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h1>TRIP NAME</h1>\n<input id="trip_name" name="trip[name]" class="name long" value="');
      null != this.name && c.push(e(this.name));
      c.push('" placeholder="Trip Name" size="30" type="text" autocomplete="off">\n<textarea name="trip[description]" id="trip_description" placeholder="Description">');
      null != this.description && c.push(e(this.description));
      c.push('</textarea>\n<button class="save-trip button action">Save</button>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/trip_settings"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<i class="popup-ico ico-fuel"></i>\n<h1>FUEL SETTINGS</h1>\n<div class="col fuel-type-container">\n  <label>Fuel Type</label>\n  <span class="select">\n    <select class="fuel-type">\n      <option value="gasoline" ');
      this.gasolineSelected && c.push(e("selected"));
      c.push('>Gasoline</option>\n      <option value="diesel" ');
      this.dieselSelected && c.push(e("selected"));
      c.push('>Diesel</option>\n    </select>\n  </span>\n</div>\n<div class="col fuel-economy-container">\n  <label>Fuel Efficiency</label>\n  <input class="fuel-economy" type="text" value="');
      c.push(e(this.fuel_economy));
      c.push(' mpg" name="trip[fuel_economy]">\n  <div class="use-default-fuel-economy">\n    <span><i class="icon-refresh"></i></span>\n  </div>\n</div>\n<button type="button" class="update button action">Update</button>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/user_profile_photo"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<img class="profile-photo" src="');
      c.push(this.user.image_mini_url && this.user.image_mini_url.ecoSafe ? this.user.image_mini_url : "undefined" !== typeof this.user.image_mini_url && null != this.user.image_mini_url ? a(this.user.image_mini_url) : "");
      c.push('" height="25" width="25">\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/via_waypoint"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="via-waypoint-wrapper">\n  <input type="hidden" class="cid" value="');
      c.push(this.cid && this.cid.ecoSafe ? this.cid : "undefined" !== typeof this.cid && null != this.cid ? a(this.cid) : "");
      c.push('">\n  <div class="placeholder">\n    <img src="/assets/mysteryguide.png" alt="" />\n    <div class="icon"></div>\n  </div>\n  ');
      this.removeable && c.push('\n    <div class="remove"></div>\n  ');
      c.push("\n  <span>VIA</span>\n</div>\n")
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/trip_planner/templates/waypoint"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="waypoint-content ');
      this.waypointNumber && c.push(e("waypoint-" + this.waypointNumber));
      c.push('">\n  <div class="field">\n    <div class="placeholder">\n      <div class="icon"></div>\n    </div>\n    <input type="hidden" class="cid" value="');
      c.push(e(this.cid));
      c.push('">\n    <input id="');
      c.push(e(this.inputId));
      c.push('" name="waypoint" class="');
      c.push(e(this.textInputClasses.join(" ")));
      c.push('" value="');
      c.push(e(this.waypointName));
      c.push('" placeholder="');
      c.push(e(this.placeHolderText));
      c.push('" tabindex="');
      c.push(e(this.index + 1));
      c.push('" size="30" type="text">\n    <a class="remove" href="#"><span class="icon-">x</span></a>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.trip_planner.views,
    e = function() {
      var a = this.render,
        b = this;
      this.render = function() {
        return a.apply(b, arguments)
      };
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
  e.prototype.template = JST["partials/trip_planner/templates/default_profile_photo"];
  e.prototype.className = "default-profile-photo-view";
  e.prototype.tagName =
    "span";
  e.prototype.render = function() {
    return this.$el.html(this.template({
      profilePhotoUrl: "/assets/mysteryguide.png"
    }))
  };
  c.DefaultProfilePhotoView = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.trip_planner.views,
    a = function() {
      this.formattedTime = b(this.formattedTime, this);
      this.formattedDistance = b(this.formattedDistance, this);
      this.addWaypointClicked = b(this.addWaypointClicked, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/trip_planner/templates/leg"];
  a.prototype.className = "leg";
  a.prototype.events = {
    "click .add-waypoint": "addWaypointClicked"
  };
  a.prototype.initialize = function() {
    this.model.bind("change:distance", this.render, this);
    return this.model.bind("change:time", this.render, this)
  };
  a.prototype.render = function() {
    var a;
    a = {
      distance: this.formattedDistance(),
      time: this.formattedTime()
    };
    this.$el.html(this.template(a));
    rt.helpers.app.isMobileScreen() || this.$(".add-waypoint a").tooltip();
    return this
  };
  a.prototype.remove = function(b) {
    var c;
    null == b && (b = !1);
    null != (c = this.model) && c.off(null, null, this);
    $(".tooltip").remove();
    if (!b) return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.addWaypointClicked = function() {
    return this.trigger("add_waypoint", this)
  };
  a.prototype.formattedDistance = function() {
    var a;
    a = this.model.get("distance");
    return null == a ? "..." : "" + Math.round(6.21371192E-4 * a) + "mi"
  };
  a.prototype.formattedTime = function() {
    var a, b;
    b = this.model.get("time");
    if (null == b) return "...";
    a = Math.floor(b / 3600);
    b = Math.round(b % 3600 / 60);
    return "" + (0 >= a ? "0" : "" + a) + ":" + (0 >= b ? "00" : 10 <= b ? "" + b : "0" + b)
  };
  e.LegView = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.trip_planner.views,
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
  e.prototype.template = JST["partials/trip_planner/templates/new_trip_confirmation"];
  e.prototype.className = "new-trip-confirmation-view";
  e.prototype.events = {
    "click a.button": "clickButton"
  };
  e.prototype.initialize = function(a) {
    return this.options = a
  };
  e.prototype.render = function() {
    this.$el.html(this.template({
      ok_event: this.options.ok,
      cancel_event: this.options.cancel
    }));
    this.delegateEvents();
    return this
  };
  e.prototype.clickButton = function(a) {
    a = $(a.currentTarget).data("trigger-event");
    this.trigger(a);
    return this.trigger("close")
  };
  c.NewTripConfirmationView = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.trip_planner.views,
    a = function() {
      this.waypointSorted = b(this.waypointSorted, this);
      this.sortingStopped = b(this.sortingStopped, this);
      this.sortingStarted = b(this.sortingStarted, this);
      this._pushWaypointClicked = b(this._pushWaypointClicked, this);
      this.addWaypointClicked = b(this.addWaypointClicked, this);
      this._bindModel = b(this._bindModel, this);
      this.cleanup = b(this.cleanup, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/trip_planner/templates/path"];
  a.prototype.id = "waypoints";
  a.prototype.className = "path";
  a.prototype.events = {
    "click .append-waypoint a": "_pushWaypointClicked"
  };
  a.prototype.initialize = function() {
    var a = this;
    rt.app.events.on("trip_planner:expand_waypoints_bars",

    function() {
      return a.$el.addClass("expand-all-bars")
    });
    rt.app.events.on("trip_planner:collapse_waypoints_bars", function() {
      return a.$el.removeClass("expand-all-bars")
    });
    this.debouncedRender = _.debounce(this.render, 100);
    return this._bindModel()
  };
  a.prototype.render = function() {
    var a, b, c, d = this;
    this.cleanup(!0);
    $(".pac-container").remove();
    for (a = $(this.template()); 2 > this.model.vertexCount();) this.model.addVertex(new rt.models.Waypoint);
    b = a.filter(".append-waypoint")[0];
    c = document.createDocumentFragment();
    a.each(function(a, b) {
      return c.appendChild(b)
    });
    this.waypointViews = [];
    this.legViews = [];
    this.model.follow(function(a) {
      a = new rt.trip_planner.views.WaypointView({
        model: a
      });
      a.render();
      c.insertBefore(a.el, b);
      return d.waypointViews.push(a)
    }, function(a) {
      a = new rt.trip_planner.views.LegView({
        model: a
      });
      a.bind("add_waypoint", d.addWaypointClicked);
      a.render();
      c.insertBefore(a.el, b);
      return d.legViews.push(a)
    });
    this.$el.html(c);
    this.$el.sortable({
      items: ".waypoint",
      axis: "y",
      handle: ".icon",
      start: this.sortingStarted,
      stop: this.sortingStopped,
      update: this.waypointSorted,
      placeholder: "waypoint-placeholder"
    });
    rt.helpers.app.isMobileScreen() || this.$(".add-waypoint a").tooltip();
    return this
  };
  a.prototype.remove = function(b) {
    null == b && (b = !1);
    this.cleanup(b);
    if (!b) return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.cleanup = function(a) {
    null == a && (a = !1);
    $(".tooltip").remove();
    this.waypointsViews && (_(this.waypontViews).each(function(b) {
      return b.remove(a)
    }), this.waypointViews = null);
    if (this.legViews) return _(this.legViews).each(function(b) {
      b.off(null,
      null, this);
      return b.remove(a)
    }), this.legViews = null
  };
  a.prototype._bindModel = function() {
    return this.model.on("add remove reset", this.debouncedRender, this)
  };
  a.prototype.addWaypointClicked = function(a) {
    return this.model.addVertexAtEdge(new rt.models.Waypoint, a.model)
  };
  a.prototype._pushWaypointClicked = function() {
    return this.model.addVertex(new rt.models.Waypoint)
  };
  a.prototype.sortingStarted = function() {
    return this.$(".leg").hide()
  };
  a.prototype.sortingStopped = function() {
    return this.$(".leg").show()
  };
  a.prototype.waypointSorted = function(a, b) {
    var c, d, f;
    c = $(b.item).find(".cid").val();
    d = null;
    this.$(".waypoint").each(function(a, b) {
      $(b).find(".cid").val() === c && (d = a)
    });
    f = this.model.getVertexByCid(c);
    this.model.removeVertex(f);
    return this.model.addVertex(f, d)
  };
  e.PathView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.trip_planner.views,
    a = function() {
      this._toggleClickedOnce = b(this._toggleClickedOnce, this);
      this.shareSummary = b(this.shareSummary, this);
      this.shareTitle = b(this.shareTitle, this);
      this.shareUrl = b(this.shareUrl, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f,
  g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/trip_planner/templates/share_trip"];
  a.prototype.className = "share-trip-view";
  a.prototype.initialize = function() {
    return this.$el.one("click", ".dropdown-toggle", this._toggleClickedOnce)
  };
  a.prototype.render = function() {
    var a;
    a = {
      url: this.shareUrl(),
      title: this.shareTitle(),
      summary: this.shareSummary()
    };
    this.$el.html(this.template(a));
    rt.helpers.app.isMobileScreen() || this.$("a[rel=tooltip]").tooltip();
    return this
  };
  a.prototype.remove = function() {
    this.$el.off("click", ".dropdown-toggle", this._toggleClickedOnce);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.shareUrl = function() {
    return null != this.model.id ? "http://???.com/trips/" + this.model.id : null
  };
  a.prototype.shareTitle = function() {
    return null != this.model.get("name") ? "" + this.model.get("name") + " | My new trip on ???" : "My new trip on ???"
  };
  a.prototype.shareSummary = function() {
    return "Check out the trip I'm creating on ???.com"
  };
  a.prototype._toggleClickedOnce = function() {
    return stButtons.locateElements()
  };
  e.ShareTripView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.trip_planner.views,
    a = function() {
      this.saveTrip = b(this.saveTrip, this);
      this.clickSaveTrip = b(this.clickSaveTrip, this);
      this.remove = b(this.remove, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/trip_planner/templates/control_buttons"];
  a.prototype.className = "trip-actions";
  a.prototype.events = {
    "click a.new-trip-link": "clickNewTrip",
    "click a.save-section-toggle": "clickSaveTrip",
    "click a.show-saved-trips-link": "clickShowSavedTrips"
  };
  a.prototype.initialize = function(a) {
    this.trip = a.model;
    this.sessionFacade = rt.app.facades.sessionFacade;
    this.namedTripCollection = new rt.collections.NamedTripCollection;
    return rt.app.events.on("ui:open_save_trip_dialog", this.clickSaveTrip, this)
  };
  a.prototype.render = function() {
    this.$el.html(this.template({}));
    return this
  };
  a.prototype.remove = function() {
    rt.app.events.on(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.clickSaveTrip = function() {
    if (this.sessionFacade.loggedIn()) return this._showSaveTripModal();
    rt.app.events.trigger("notify:generic", {
      message: "You need to log in before you can save."
    })
  };
  a.prototype.clickNewTrip = function(a) {
    a.preventDefault();
    if (!rt.app.models.activeTrip.get("trip").isNew()) return this._showNewTripConfirmationModal()
  };
  a.prototype.clickShowSavedTrips = function(a) {
    a.preventDefault();
    return !this.sessionFacade.loggedIn() || 0 === this.namedTripCollection.length ? rt.app.events.trigger("notify:generic", {
      message: "You haven't any saved trips yet."
    }) : this.showNamedTripsModal()
  };
  a.prototype.showNamedTripsModal = function() {
    null != this.namedTripsView && this.namedTripsView.remove();
    this.namedTripsView = new rt.views.my_stuff.NamedTripsView({
      collection: this.namedTripCollection,
      model: rt.app.models.activeTrip.get("trip")
    });
    this.namedTripsView.on("selected", rt.helpers.modal.close,
    this);
    this.namedTripsView.on("cleared", rt.helpers.modal.close, this);
    return rt.helpers.modal.open({
      view: this.namedTripsView
    }).on("backdrop-click", rt.helpers.modal.close)
  };
  a.prototype._showSaveTripModal = function(a) {
    null == a && (a = {});
    null != this.tripSaveView && this.tripSaveView.remove();
    this.tripSaveView = new rt.trip_planner.views.TripSaveView({
      model: rt.app.models.activeTrip.get("trip")
    });
    this.tripSaveView.on("saved", rt.helpers.modal.close, this);
    if (a.onSuccess) this.tripSaveView.on("saved", a.onSuccess);
    return rt.helpers.modal.open({
      view: this.tripSaveView
    }).on("backdrop-click",
    rt.helpers.modal.close)
  };
  a.prototype._showNewTripConfirmationModal = function() {
    null != this.newTripConfirmationView && this.newTripConfirmationView.remove();
    this.newTripConfirmationView = new rt.trip_planner.views.NewTripConfirmationView({
      ok: "save_trip",
      cancel: "start_new_trip"
    });
    this.newTripConfirmationView.on("close", rt.helpers.modal.close, this);
    this.newTripConfirmationView.on("start_new_trip", this.startNewTrip);
    this.newTripConfirmationView.on("save_trip", this.saveTrip);
    return rt.helpers.modal.open({
      view: this.newTripConfirmationView
    }).on("backdrop-click",
    rt.helpers.modal.close)
  };
  a.prototype.startNewTrip = function() {
    return rt.app.router.navigate(rt.routes.new_trip_path(), {
      trigger: !0
    })
  };
  a.prototype.saveTrip = function() {
    var a, b = this;
    a = function() {
      return b._showSaveTripModal({
        onSuccess: b.startNewTrip
      })
    };
    return this.sessionFacade.loggedIn() ? _.delay(function() {
      return a()
    }, 300) : rt.app.events.trigger("notify:generic", {
      message: "You need to log in before you can save."
    })
  };
  e.TripControlButtonsView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.trip_planner.views,
    a = function() {
      this.clickSettingsToggle = b(this.clickSettingsToggle, this);
      this.clickExpandAllBars = b(this.clickExpandAllBars, this);
      this._cleanup = b(this._cleanup, this);
      this.shareSummary = b(this.shareSummary, this);
      this.shareTitle = b(this.shareTitle, this);
      this.shareUrl = b(this.shareUrl, this);
      this._useHighwaysToggleClicked = b(this._useHighwaysToggleClicked, this);
      this.renderDefaultProfilePhoto = b(this.renderDefaultProfilePhoto, this);
      this.renderUserProfilePhoto = b(this.renderUserProfilePhoto, this);
      this.renderShareTrip = b(this.renderShareTrip, this);
      this._updateUseHighways = b(this._updateUseHighways, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.setModel = b(this.setModel, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/trip_planner/templates/trip_options"];
  a.prototype.className = "trip-options-view";
  a.prototype.events = {
    "click .use-highways-toggle": "_useHighwaysToggleClicked",
    "click .settings-section-toggle": "clickSettingsToggle",
    "click .expand-all": "clickExpandAllBars"
  };
  a.prototype.initialize = function(a) {
    this.sessionFacade = rt.app.facades.sessionFacade;
    this.debouncedRender = _.debounce(this.render, 100);
    this._updateUseHighways = _.debounce(this._updateUseHighways, 100);
    this.model.on("change:use_highways",
    this._updateUseHighways, this);
    if (a.planner) return this.planner = a.planner
  };
  a.prototype.setModel = function(a) {
    this.model.off(null, null, this);
    this.model = a;
    return this.debouncedRender()
  };
  a.prototype.render = function() {
    var a, b = this;
    this._cleanup();
    a = {
      expandedMode: !1,
      useHighways: this.model.get("use_highways"),
      name: this.model.get("name"),
      id: this.model.id
    };
    this.planner && (a.expandedMode = this.planner.getWaypointsViewMode());
    this.$el.html(this.template(a));
    this.model.has("created_by") ? (this.model.createdByFetched() ? (a = this.model.getCreatedBy(), this.renderUserProfilePhoto(a)) : (this.renderDefaultProfilePhoto(), this.model.fetchCreatedBy(function(a) {
      return b.renderUserProfilePhoto(a)
    })), this.renderShareTrip()) : this.model.isNew() || (this.renderDefaultProfilePhoto(), this.renderShareTrip());
    rt.helpers.app.isMobileScreen() || (this.$(".settings-section-toggle").tooltip(), this.$(".use-highways-toggle").tooltip(), this.$(".expand-all").tooltip());
    this._updateUseHighways();
    return this
  };
  a.prototype.remove = function() {
    this._cleanup();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._updateUseHighways = function() {
    return this.model.get("use_highways") ? this.$(".use-highways-toggle").html('<i class="icon-road"></i>').addClass("checked").removeClass("road-type-way") : this.$(".use-highways-toggle").html('<i class="icon-way"></i>').removeClass("checked").addClass("road-type-way")
  };
  a.prototype.renderShareTrip = function() {
    this.shareTripView = new rt.trip_planner.views.ShareTripView({
      model: this.model
    });
    this.shareTripView.render();
    return this.$(".toolbar-share").html(this.shareTripView.el)
  };
  a.prototype.renderUserProfilePhoto = function(a) {
    this.profilePhotoView && (this.profilePhotoView.remove(), this.profilePhotoView = null);
    this.profilePhotoView = new rt.trip_planner.views.UserProfilePhotoView({
      model: a
    });
    this.profilePhotoView.render();
    return this.$(".trip-user").html(this.profilePhotoView.el)
  };
  a.prototype.renderDefaultProfilePhoto = function() {
    this.profilePhotoView && (this.profilePhotoView.remove(), this.profilePhotoView = null);
    this.profilePhotoView = new rt.trip_planner.views.DefaultProfilePhotoView;
    this.profilePhotoView.render();
    return this.$(".trip-user").html(this.profilePhotoView.el)
  };
  a.prototype._useHighwaysToggleClicked = function(a) {
    var b = this;
    a.preventDefault();
    a = !this.model.get("use_highways");
    this.model.set({
      use_highways: a
    });
    rt.app.models.activeTrip.calculateDirections(this.model, function() {
      return b.model.autosave()
    });
    return rt.app.events.trigger("analytics:use_highways", {
      data: {
        highways: a
      }
    })
  };
  a.prototype.shareUrl = function() {
    return null != this.model.id ? "http://???.com/trips/" + this.model.id : null
  };
  a.prototype.shareTitle = function() {
    return null != this.model.get("name") ? "" + this.model.get("name") + " | My new trip on ???" : "My new trip on ???"
  };
  a.prototype.shareSummary = function() {
    return "Check out the trip I'm creating on ???.com"
  };
  a.prototype._cleanup = function() {
    var a;
    return null != (a = this.tripSettingsView) ? a.remove() : void 0
  };
  a.prototype.clickExpandAllBars = function(a) {
    var b;
    null != a && a.preventDefault();
    $(a.currentTarget).toggleClass("active");
    return null != (b = this.planner) ? b.setWaypointsViewMode(!this.planner.getWaypointsViewMode()) : void 0
  };
  a.prototype.clickSettingsToggle = function(a) {
    var b, c, d, f, e = this;
    null != a && a.preventDefault();
    b = this.model;
    c = new Backbone.Model({
      fuel_type: b.get("fuel_type"),
      fuel_economy: b.get("fuel_economy")
    });
    d = new rt.trip_planner.views.TripSettingsView({
      model: c
    });
    f = function() {
      d.off("update", f, e);
      b.set({
        fuel_type: c.get("fuel_type"),
        fuel_economy: c.get("fuel_economy")
      });
      b.autosave();
      return rt.helpers.modal.close()
    };
    d.on("update",
    f, this);
    return rt.helpers.modal.open({
      view: d
    }).on("backdrop-click", rt.helpers.modal.close)
  };
  e.TripOptionsView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.trip_planner.views,
    a = function() {
      this._cleanup = b(this._cleanup, this);
      this._bindTrip = b(this._bindTrip, this);
      this._pathChanged = b(this._pathChanged, this);
      this._waypointAddedOrRemoved = b(this._waypointAddedOrRemoved, this);
      this._tripChanged = b(this._tripChanged, this);
      this._updateUseHighways = b(this._updateUseHighways, this);
      this._updatePath = b(this._updatePath, this);
      this._updateTripViews = b(this._updateTripViews,
      this);
      this._createPath = b(this._createPath, this);
      this._renderTripViews = b(this._renderTripViews, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.hide = b(this.hide, this);
      this.show = b(this.show, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.show = function() {
    return this.$el.show()
  };
  a.prototype.hide = function() {
    return this.$el.hide()
  };
  a.prototype.el = "#tripPlanner";
  a.prototype.initialize = function() {
    this._bindTrip(this.model.get("trip"));
    this.model.on("change:trip", this._tripChanged, this);
    this._pathChanged = _.debounce(this._pathChanged, 100);
    this._updatePathView = _.debounce(this._updatePathView, 100);
    return this._updateUseHighways = _.debounce(this._updateUseHighways, 100)
  };
  a.prototype.render = function() {
    this._cleanup();
    this._renderTripViews();
    return this
  };
  a.prototype.remove = function() {
    this._cleanup();
    return a.__super__.remove.apply(this,
    arguments)
  };
  a.prototype._expand_waypoints = !1;
  a.prototype.getWaypointsViewMode = function() {
    return this._expand_waypoints
  };
  a.prototype.setWaypointsViewMode = function(a) {
    a !== this._expand_waypoints && (this._expand_waypoints ? rt.app.events.trigger("trip_planner:collapse_waypoints_bars") : rt.app.events.trigger("trip_planner:expand_waypoints_bars"));
    return this._expand_waypoints = a
  };
  a.prototype._renderTripViews = function() {
    var a, b, c, d;
    a = this.trip;
    null != (b = this.tripOptionsView) && b.remove();
    this.tripOptionsView = new rt.trip_planner.views.TripOptionsView({
      model: a,
      planner: this
    });
    this.$(".sidebar-item-contents").prepend(this.tripOptionsView.render().el);
    null != (c = this.tripControlButtonsView) && c.remove();
    this.tripControlButtonsView = new rt.trip_planner.views.TripControlButtonsView({
      model: a
    });
    this.$(".sidebar-item-contents").prepend(this.tripControlButtonsView.render().el);
    this._createPath();
    null != (d = this.tripPathView) && d.remove();
    this.tripPathView = new rt.trip_planner.views.PathView({
      model: this.path
    });
    this.$(".scroll-container").prepend(this.tripPathView.render().el);
    return this._updateUseHighways()
  };
  a.prototype._createPath = function() {
    var a, b;
    a = this.trip;
    null != (b = this.path) && b.off(null, null, this);
    this.path = new rt.models.TripPath(a.get("waypoints"), a.get("legs"));
    this.path.on("change:location", this._pathChanged, this);
    this.path.on("add remove", this._waypointAddedOrRemoved, this);
    return this.path
  };
  a.prototype._updateTripViews = function() {
    this.tripOptionsView.setModel(this.trip);
    this._updatePath();
    return this._updateUseHighways()
  };
  a.prototype._updatePath = function() {
    var a,
    b;
    b = this.trip.get("waypoints");
    a = this.trip.get("legs");
    if (this.path.vertexCount() === b.length) return this.path.follow(function(a, c) {
      return a.set(b[c])
    }, function(b, c) {
      return b.set(a[c])
    });
    "undefined" !== typeof console && null !== console && console.log && console.log("TripPlannerView: waypoint count different when trying to _updatePath()");
    return this.path.reset(b, a)
  };
  a.prototype._updateUseHighways = function() {
    return this.trip.get("use_highways") ? this.$el.removeClass("byways").addClass("highway") : this.$el.removeClass("highway").addClass("byways")
  };
  a.prototype._tripChanged = function(a, b) {
    this._bindTrip(b);
    return this._renderTripViews()
  };
  a.prototype._waypointAddedOrRemoved = function(a) {
    if (a.has("location")) return this._pathChanged()
  };
  a.prototype._pathChanged = function() {
    var a, b, c, d = this;
    b = this.path;
    b.normalize();
    a = function(a) {
      return a.toJSON()
    };
    c = _(b.vertices).map(a);
    a = _(b.edges).map(a);
    this.trip.set({
      waypoints: c,
      legs: a
    });
    return rt.app.models.activeTrip.calculateDirections(this.trip, function() {
      return d.trip.autosave()
    })
  };
  a.prototype._bindTrip = function(a) {
    var b;
    null != (b = this.trip) && b.off(null, null, this);
    this.trip = a;
    this.trip.on("change:use_highways", this._updateUseHighways, this);
    this.trip.on("change:waypoints", this._updateTripViews, this);
    return this.trip.on("change:legs", this._updateTripViews, this)
  };
  a.prototype._cleanup = function() {
    var a, b, c, d, f;
    null != (a = this.tripOptionsView) && a.remove();
    this.tripOptionsView = null;
    null != (b = this.path) && b.off(null, null, this);
    null != (c = this.tripPathView) && c.remove();
    this.tripPathView = null;
    null != (d = this.savedTripsView) && d.remove();
    this.savedTripsView = null;
    null != (f = this.tripControlButtonsView) && f.remove();
    return this.tripControlButtonsView = null
  };
  e.TripPlannerView = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.trip_planner.views,
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
  e.prototype.template = JST["partials/trip_planner/templates/trip_save"];
  e.prototype.className = "trip-save-view";
  e.prototype.events = {
    "click .save-trip.button": "clickSaveButton"
  };
  e.prototype.initialize = function() {
    return this.trip = this.model
  };
  e.prototype.render = function() {
    var a;
    a = {
      name: this.trip.get("name"),
      description: this.trip.get("description")
    };
    this.$el.html(this.template(a));
    this.delegateEvents();
    return this
  };
  e.prototype.clickSaveButton = function(a) {
    a.preventDefault();
    this.trip.set({
      name: this.$("#trip_name").val(),
      description: this.$("#trip_description").val()
    });
    if (0 < this.trip.get("name").length && this.model.save()) return this.trigger("saved")
  };
  c.TripSaveView = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.trip_planner.views,
    a = function() {
      this.useDefaultFuelEconomyClicked = b(this.useDefaultFuelEconomyClicked, this);
      this.fuelEconomyChanged = b(this.fuelEconomyChanged, this);
      this.useDefaultFuelTypeClicked = b(this.useDefaultFuelTypeClicked, this);
      this.fuelTypeChanged = b(this.fuelTypeChanged, this);
      this.clickUpdate = b(this.clickUpdate, this);
      this.render = b(this.render, this);
      return a.__super__.constructor.apply(this,
      arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/trip_planner/templates/trip_settings"];
  a.prototype.className = "trip-settings-view";
  a.prototype.events = {
    "change .fuel-type": "fuelTypeChanged",
    "click .use-default-fuel-type": "useDefaultFuelTypeClicked",
    "change .fuel-economy": "fuelEconomyChanged",
    "click .use-default-fuel-economy": "useDefaultFuelEconomyClicked",
    "click .update": "clickUpdate"
  };
  a.prototype.initialize = function() {
    this.model.on("change:fuel_economy", this.render);
    return this.model.on("change:fuel_type", this.render)
  };
  a.prototype.render = function() {
    var a;
    a = rt.helpers.settings.fuelType(this.model.get("fuel_type"));
    a = {
      fuel_economy: rt.helpers.settings.fuelEconomy(this.model.get("fuel_economy")),
      gasolineSelected: a === rt.helpers.settings.FUEL_TYPE_GASOLINE,
      dieselSelected: a === rt.helpers.settings.FUEL_TYPE_DIESEL
    };
    this.$el.html(this.template(a));
    this.delegateEvents();
    return this
  };
  a.prototype.clickUpdate = function() {
    this.fuelEconomyChanged();
    return this.trigger("update")
  };
  a.prototype.fuelTypeChanged = function() {
    var a;
    a = this.$(".fuel-type").val();
    return this.model.set("fuel_type", a)
  };
  a.prototype.useDefaultFuelTypeClicked = function() {
    return this.model.set("fuel_type", null)
  };
  a.prototype.fuelEconomyChanged = function() {
    var a;
    parseFloat(this.$(".fuel-economy").val());
    a = parseFloat(this.$(".fuel-economy").val());
    return 0 < a ? this.model.set("fuel_economy", a) : this.render()
  };
  a.prototype.useDefaultFuelEconomyClicked = function() {
    return this.model.set("fuel_economy", null)
  };
  e.TripSettingsView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.trip_planner.views,
    a = function() {
      this.photoClicked = b(this.photoClicked, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/trip_planner/templates/user_profile_photo"];
  a.prototype.className = "user-profile-photo-view";
  a.prototype.tagName = "span";
  a.prototype.events = {
    "click a": "photoClicked"
  };
  a.prototype.initialize = function() {};
  a.prototype.render = function() {
    var a;
    a = {
      user: this.model.toJSON()
    };
    return this.$el.html(this.template(a))
  };
  a.prototype.photoClicked = function(a) {
    a.preventDefault();
    if (this.model.get("guide_name")) return rt.app.router.navigate(rt.routes.guide_path(this.model.get("guide_name")))
  };
  e.UserProfilePhotoView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = function(a, b) {
      function d() {
        this.constructor = a
      }
      for (var f in b) c.call(b, f) && (a[f] = b[f]);
      d.prototype = b.prototype;
      a.prototype = new d;
      a.__super__ = b.prototype;
      return a
    }, a = rt.trip_planner.views,
    d = function() {
      this.waypointNumber = b(this.waypointNumber, this);
      this._removable = b(this._removable, this);
      this.modelNameChanged = b(this.modelNameChanged, this);
      this.removeClicked = b(this.removeClicked, this);
      this.removeAutocompleteListeners = b(this.removeAutocompleteListeners, this);
      this._processResolvedWaypoint = b(this._processResolvedWaypoint, this);
      this.autocompleteSelected = b(this.autocompleteSelected, this);
      this.nameChanged = b(this.nameChanged, this);
      this.textInputClasses = b(this.textInputClasses, this);
      this.nameKeyup = b(this.nameKeyup, this);
      this._indicateError = b(this._indicateError, this);
      this._indicateDone = b(this._indicateDone, this);
      this._indicateEmpty = b(this._indicateEmpty, this);
      this.inputId = b(this.inputId, this);
      this.origin = b(this.origin,
      this);
      this.destination = b(this.destination, this);
      this.placeholderText = b(this.placeholderText, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      return d.__super__.constructor.apply(this, arguments)
    };
  e(d, Backbone.View);
  d.prototype.className = "waypoint";
  d.prototype.template = JST["partials/trip_planner/templates/waypoint"];
  d.prototype.events = {
    "click .remove": "removeClicked",
    "keyup .name": "nameKeyup",
    "change .name": "nameChanged"
  };
  d.prototype.initialize = function() {
    var a;
    _.bindAll(this);
    this.model.on("change:name", this.modelNameChanged, this);
    this.model.on("destroy", this.remove, this);
    this.previousAttributes = this.placeChangedListener = null;
    a = this.model === this.model.path.firstVertex() ? "origin" : this.model === this.model.path.lastVertex() ? "destination" : "middle-waypoint";
    return this.$el.addClass(a)
  };
  d.prototype.render = function() {
    var a;
    this._removable() ? this.$el.addClass("removable") : this.$el.removeClass("removable");
    a = {
      cid: this.model.cid,
      waypoint: this.model.toJSON(),
      waypointName: this.model.isVia() ? "via" : this.model.get("name"),
      waypointNumber: this.origin() || this.destination() ? "" : this.waypointNumber(),
      textInputClasses: this.textInputClasses(),
      placeHolderText: this.placeholderText(),
      inputId: this.inputId(),
      isVia: this.model.isVia(),
      isPoi: this.model.isPoi(),
      index: this.model.path.indexOfVertex(this.model)
    };
    this.$el.html(this.template(a));
    this.model.has("location") ? this._indicateDone() : this._indicateEmpty();
    a = this.$el.find(".name").get(0);
    this.removeAutocompleteListeners();
    this.autocomplete = new google.maps.places.Autocomplete(a);
    this.placeChangedListener = google.maps.event.addListener(this.autocomplete, "place_changed", this.autocompleteSelected);
    return this
  };
  d.prototype.remove = function(a) {
    null == a && (a = !1);
    this.model.off(null, null, this);
    this.model.path.off(null, null, this);
    null != this.autocomplete && google.maps.event.clearInstanceListeners(this.autocomplete);
    if (!a) return d.__super__.remove.apply(this, arguments)
  };
  d.prototype.placeholderText = function() {
    return this.model === this.model.path.firstVertex() ? "Start:" : this.model === this.model.path.lastVertex() ?
      "Destination:" : "Waypoint:"
  };
  d.prototype.destination = function() {
    return this.model === this.model.path.lastVertex()
  };
  d.prototype.origin = function() {
    return this.model === this.model.path.firstVertex()
  };
  d.prototype.inputId = function() {
    return this.model === this.model.path.firstVertex() ? "waypointOrigin" : this.model === this.model.path.lastVertex() ? "waypointDestination" : "waypoint" + this.waypointNumber()
  };
  d.prototype._indicateEmpty = function() {
    return this.$(".name").removeClass("error done")
  };
  d.prototype._indicateDone = function() {
    return this.$(".name").removeClass("error").addClass("done")
  };
  d.prototype._indicateError = function() {
    return this.$(".name").removeClass("done").addClass("error")
  };
  d.prototype.nameKeyup = function(a) {
    if (13 === a.keyCode) return this.$(".name").blur(), this.nameChanged(a)
  };
  d.prototype.textInputClasses = function() {
    var a;
    a = ["name"];
    this._removable() || a.push("long");
    return a
  };
  d.prototype.nameChanged = function() {
    var a = this;
    this.autocompleteTriggered = !1;
    return _.defer(function() {
      var b;
      if (!a.autocompleteTriggered) return b = a.$(".name").val(), "" === b ? (a.model.set({
        type: rt.models.Waypoint.TYPE_GEO,
        name: b,
        location: null
      }), a._indicateEmpty()) : rt.helpers.places.resolveWaypointFromText({
        inputText: b,
        success: a._processResolvedWaypoint,
        error: a._indicateError
      })
    })
  };
  d.prototype.autocompleteSelected = function() {
    this.autocompleteTriggered = !0;
    return rt.helpers.places.resolveWaypointFromGooglePlace({
      place: this.autocomplete.getPlace(),
      success: this._processResolvedWaypoint,
      error: this._indicateError
    })
  };
  d.prototype._processResolvedWaypoint = function(a) {
    this.model.set({
      type: a.get("type"),
      name: a.get("name"),
      location: a.get("location")
    });
    this._indicateDone();
    return this.$(".name").val(a.get("name"))
  };
  d.prototype.removeAutocompleteListeners = function() {
    if (null != this.autocomplete) return google.maps.event.clearInstanceListeners(this.autocomplete)
  };
  d.prototype.removeClicked = function() {
    return this.model.destroy()
  };
  d.prototype.modelNameChanged = function() {
    var a;
    a = this.model.get("name");
    null == a && (a = "");
    return this.$(".name").val(a)
  };
  d.prototype._removable = function() {
    return null != this.model.path ? 2 < this.model.path.vertexCount() : !1
  };
  d.prototype.waypointNumber = function() {
    var a, b, c, d;
    c = this.model.path.vertexCount();
    b = 0;
    if (c) {
      a = d = 0;
      for (c -= 1; 0 <= c ? d <= c : d >= c; a = 0 <= c ? ++d : --d) {
        if (this.model.path.vertexAt(a) === this.model) return this.model.get("type") === rt.models.Waypoint.TYPE_VIA ? "via" : a - b;
        this.model.path.vertexAt(a).get("type") === rt.models.Waypoint.TYPE_VIA && 0 !== a && b++
      }
    }
    return ""
  };
  a.WaypointView = d;
  var a = rt.trip_planner.views,
    f = function() {
      this.locationChanged = b(this.locationChanged,
      this);
      this.removeClicked = b(this.removeClicked, this);
      this.render = b(this.render, this);
      return f.__super__.constructor.apply(this, arguments)
    };
  e(f, rt.trip_planner.views.WaypointView);
  f.prototype.tagName = "div";
  f.prototype.template = JST["templates/trip_planner/via_waypoint"];
  f.prototype.events = {
    "click .remove": "removeClicked"
  };
  f.prototype.initialize = function() {
    _.bindAll(this);
    return this.model.on("change_location", this.locationChanged, this)
  };
  f.prototype.render = function() {
    var a;
    a = 2 < this.model.path.vertexCount();
    this.$el.html(this.template({
      cid: this.model.cid,
      removeable: a
    }));
    return this
  };
  f.prototype.removeClicked = function() {
    this.model.remove();
    return this.remove()
  };
  f.prototype.locationChanged = function() {
    return this.model.hasLocation() ? this.$(".name").addClass("done") : this.$(".name").removeClass("done")
  };
  a.ViaWaypointView = f
}).call(this);
(function() {
  var b, c;
  (b = window.rt).google || (b.google = {});
  (c = window.rt.google).models || (c.models = {})
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.google.models,
    a = function() {
      this.updateLegs = b(this.updateLegs, this);
      this.getTripCost = b(this.getTripCost, this);
      this.getTripTime = b(this.getTripTime, this);
      this.getTripDistance = b(this.getTripDistance, this);
      this.getEncodedPolyline = b(this.getEncodedPolyline, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.defaults = {
    directions_result: null
  };
  a.prototype.getEncodedPolyline = function() {
    var a;
    return null != (a = this.get("directions_result")) ? a.routes[0].overview_polyline.points : void 0
  };
  a.prototype.getTripDistance = function() {
    var a, b;
    a = null != (b = this.get("directions_result")) ? b.routes[0].legs : void 0;
    return _.reduce(a, function(a, b) {
      return b.distance.value + a
    }, 0)
  };
  a.prototype.getTripTime = function() {
    var a, b;
    a = null != (b = this.get("directions_result")) ? b.routes[0].legs : void 0;
    return _.reduce(a, function(a, b) {
      return b.duration.value + a
    }, 0)
  };
  a.prototype.getTripCost = function(a) {
    var b, c;
    c = rt.helpers.settings.fuelType(a.get("fuel_type"));
    c = c === rt.helpers.settings.FUEL_TYPE_GASOLINE ? rt.helpers.settings.GAS_PRICE_PER_GALLON : c === rt.helpers.settings.FUEL_TYPE_DIESEL ? rt.helpers.settings.DIESEL_PRICE_PER_GALLON : rt.helpers.settings.GAS_PRICE_PER_GALLON;
    b = rt.helpers.settings.fuelEconomy(a.get("fuel_economy"));
    a = this.getTripDistance();
    a = rt.helpers.conversions.metersToKilometers(a);
    a = rt.helpers.conversions.kilometersToMiles(a);
    return Math.round(a / b * c)
  };
  a.prototype.updateLegs = function(a) {
    var b, c;
    c = (b = null != (c = this.get("directions_result")) ? c.routes[0].legs : void 0) ? function(a, c) {
      var d;
      d = b[c];
      a.distance = d.distance.value;
      return a.time = d.duration.value
    } : function(a) {
      a.distance = null;
      return a.time = null
    };
    _(a).each(c);
    return a
  };
  e.Directions = a
}).call(this);
(function() {
  var b;
  (b = window.rt).utils || (b.utils = {});
  window.rt.utils.getClassByName = function(b) {
    b = b.split(".");
    return _.reduce(b, function(b, a) {
      return b[a]
    }, window)
  };
  window.rt.utils.serializeModel = function(b, e) {
    var a;
    a = _(b.attributes).reduce(function(a, b, c) {
      if (null != (null != b ? b.serialize : void 0)) b = b.serialize();
      else if (null != (null != b ? b.toJSON : void 0)) b = b.toJSON();
      a[c] = b;
      return a
    }, {}, b);
    return {
      type: e,
      attributes: a
    }
  };
  window.rt.utils.bindModelOnce = function(b, e, a, d) {
    var f;
    f = function() {
      b.unbind(e, f, d);
      return a.apply(d,
      arguments)
    };
    return b.bind(e, f, d)
  }
}).call(this);
(function() {
  function b(a) {
    this.message = a
  }
  b.prototype = Error();
  var c = {
    prefix: "",
    format: ""
  }, e = {
    serialize: function(a) {
      if (!a) return "";
      if (window.jQuery) return a = window.jQuery.param(a), !a ? "" : "?" + a;
      var b = [];
      for (prop in a) if (a[prop]) if (a[prop] instanceof Array) for (var c = 0; c < a[prop].length; c++) key = prop + encodeURIComponent("[]"), b.push(key + "=" + encodeURIComponent(a[prop][c].toString()));
      else b.push(prop + "=" + encodeURIComponent(a[prop].toString()));
      return 0 === b.length ? "" : "?" + b.join("&")
    },
    clean_path: function(a) {
      a = a.split("://");
      var b = a.length - 1;
      a[b] = a[b].replace(/\/+/g, "/").replace(/\/$/m, "");
      return a.join("://")
    },
    set_default_format: function(a) {
      !a.hasOwnProperty("format") && c.format && (a.format = c.format)
    },
    extract_anchor: function(a) {
      var b = a.hasOwnProperty("anchor") ? a.anchor : null;
      delete a.anchor;
      return b ? "#" + b : ""
    },
    extract_options: function(a, b) {
      return b.length > a ? "object" == typeof b[b.length - 1] ? b.pop() : {} : {}
    },
    path_identifier: function(a) {
      if (0 === a) return "0";
      if (!a) return "";
      if ("object" == typeof a) {
        var b = a.to_param || a.id || a;
        "function" == typeof b && (b = b.call(a));
        return b.toString()
      }
      return a.toString()
    },
    clone: function(a) {
      if (null == a || "object" != typeof a) return a;
      var b = a.constructor(),
        c;
      for (c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
      return b
    },
    prepare_parameters: function(a, b, c) {
      c = this.clone(c) || {};
      for (var e = 0; e < a.length; e++) c[a[e]] = b[e];
      return c
    },
    smartIndexOf: function(a, b) {
      if (Array.prototype.indexOf && a.indexOf === Array.prototype.indexOf) return a.indexOf(b);
      for (var c = 0; c < a.length; c++) if (c in a && a[c] === b) return c;
      return -1
    },
    build_path: function(a,
    b, c, h) {
      h = Array.prototype.slice.call(h);
      var g = this.extract_options(a.length, h);
      if (h.length > a.length) throw Error("Too many parameters provided for path");
      a = this.prepare_parameters(a, h, g); - 1 !== e.smartIndexOf(b, "format") && this.set_default_format(a);
      b = e.get_prefix();
      h = e.extract_anchor(a);
      b += this.visit(c, a);
      return e.clean_path(b + h) + e.serialize(a)
    },
    visit: function(a, c, f) {
      var e = a[1],
        g = a[2];
      switch (a[0]) {
        case 1:
          return this.visit(e, c, !0);
        case 5:
          return this.visit(e, c, !0);
        case 2:
          return e = this.visit(e, c, f), c = this.visit(g,
          c, f), f && (!e || !c) ? "" : e + c;
        case 6:
          return e;
        case 7:
          return e;
        case 8:
          return e;
        case 3:
          if ((g = c[e]) || 0 === g) return delete c[e], this.path_identifier(g);
          if (f) return "";
          throw new b("Route parameter missing: " + e);
        default:
          throw Error("Unknown Rails node type");
      }
    },
    get_prefix: function() {
      var a = c.prefix;
      "" !== a && (a = a.match("/$") ? a : a + "/");
      return a
    },
    namespace: function(a, b) {
      var c = b ? b.split(".") : [];
      0 < c.length && (current = c.shift(), a[current] = a[current] || {}, e.namespace(a[current], c.join(".")))
    }
  };
  e.namespace(window, "rt.routes");
  window.rt.routes = {
    about_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "about", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    about_app_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "about", !1]
      ],
        [7, "/", !1]
      ],
        [6, "app", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    about_press_kit_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "about", !1]
      ],
        [7, "/", !1]
      ],
        [6, "press-kit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    about_team_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "about", !1]
      ],
        [7, "/", !1]
      ],
        [6, "team", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    account_settings_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "settings", !1]
      ],
        [7, "/", !1]
      ],
        [6, "account", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_path: function(a, b) {
      return e.build_path(["slug"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "slug", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_autocomplete_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "autocomplete", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_blog_posts_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6,
          "blog_posts", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_bucket_list_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "bucket_lists", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_bucket_list_poi_path: function(a, b, c) {
      return e.build_path(["bucket_list_id", "id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "bucket_lists", !1]
      ],
        [7, "/", !1]
      ],
        [3, "bucket_list_id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_bucket_list_pois_path: function(a, b) {
      return e.build_path(["bucket_list_id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "bucket_lists", !1]
      ],
        [7, "/", !1]
      ],
        [3, "bucket_list_id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_bucket_lists_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "bucket_lists", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_categories_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "categories", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_current_user_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "current_user", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_guide_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "guides", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_identities_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "identities", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_identity_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "identities", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_permissions_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "permissions", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_poi_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_poi_change_request_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "poi-change-requests", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_poi_change_requests_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "poi-change-requests", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_poi_comment_path: function(a, b, c) {
      return e.build_path(["poi_id", "id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "poi_id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "comments", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_poi_comments_path: function(a, b) {
      return e.build_path(["poi_id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "poi_id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "comments", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_pois_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7,
          "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_pois_resolve_google_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [6, "resolve_google", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_pois_search_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [6, "search", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_route_polygons_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "route_polygons", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_search_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "search", !1]
      ],
        [1, [2, [8,
          ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_trip_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "trips", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_trips_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "trips", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_user_path: function(a,
    b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_user_feedbacks_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "user_feedbacks", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    api_users_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    blog_feed_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "blog", !1]
      ],
        [7, "/", !1]
      ],
        [6, "feed", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    by_slug_api_blog_posts_path: function(a, b) {
      return e.build_path(["slug"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "blog_posts", !1]
      ],
        [7, "/", !1]
      ],
        [3, "slug", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    coming_soon_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "coming_soon", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    edit_api_poi_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ],
      arguments)
    },
    edit_api_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    edit_password_reset_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "password_resets", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    edit_place_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "places", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    edit_session_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "sessions", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    edit_staff_poi_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    edit_staff_poi_import_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "poi_imports", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    edit_staff_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    edit_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "edit", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    explore_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "explore", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    featured_api_guides_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "guides", !1]
      ],
        [7, "/", !1]
      ],
        [6, "featured", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    for_approval_staff_pois_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [6, "for_approval", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    guide_path: function(a, b) {
      return e.build_path(["guide_name"], ["format"], [2, [2, [7, "/", !1],
        [3, "guide_name", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    itinerary_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "trips", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "itinerary", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    login_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "login", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    logout_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "logout", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_api_poi_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_api_user_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_password_reset_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "password_resets", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_place_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "places", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_session_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "sessions", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_staff_poi_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_staff_poi_import_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "poi_imports", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_staff_user_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_trip_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "trips", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    new_user_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [6, "new", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    oauth_callback_path: function(a, b) {
      return e.build_path(["provider"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "oauth_authentications", !1]
      ],
        [7, "/", !1]
      ],
        [3, "provider", !1]
      ],
        [7, "/", !1]
      ],
        [6, "callback", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    oauth_link_path: function(a,
    b) {
      return e.build_path(["provider"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "oauth_authentications", !1]
      ],
        [7, "/", !1]
      ],
        [3, "provider", !1]
      ],
        [7, "/", !1]
      ],
        [6, "link", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    oauth_new_path: function(a, b) {
      return e.build_path(["provider"], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "signin_with", !1]
      ],
        [7, "/", !1]
      ],
        [3, "provider", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    password_reset_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "password_resets", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    password_resets_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "password_resets", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    place_path: function(a, b, c) {
      return e.build_path(["slug", "id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "places", !1]
      ],
        [7, "/", !1]
      ],
        [3, "slug", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    place_changes_staff_users_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [6, "place-changes", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    place_id_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "places", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    plan_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "plan", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    poi_change_request_path: function(a,
    b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "poi-change-requests", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    poi_change_requests_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "poi-change-requests", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    poi_changes_api_users_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6,
          "users", !1]
      ],
        [7, "/", !1]
      ],
        [6, "poi_changes", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    register_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "register", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    remove_banner_image_api_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "remove_banner_image", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    remove_image_api_poi_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "remove_image", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    remove_image_api_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6,
          "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "remove_image", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    remove_image_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "remove_image", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    resolve_api_pois_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [6, "resolve", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    resolved_staff_pois_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [6, "resolved", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    root_path: function(a) {
      return e.build_path([], [], [7, "/", !1], arguments)
    },
    search_api_users_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [6, "search", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    session_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "sessions", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    sessions_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "sessions", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    sidekiq_web_path: function(a) {
      return e.build_path([], [], [2, [7, "/", !1],
        [6, "sidekiq", !1]
      ], arguments)
    },
    staff_dashboard_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "dashboard", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    staff_poi_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    staff_poi_import_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "poi_imports", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    staff_poi_imports_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "poi_imports", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    staff_pois_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    staff_root_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    staff_taxonomy_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "taxonomy", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    staff_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    staff_users_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    suggest_place_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "places", !1]
      ],
        [7, "/", !1]
      ],
        [6, "suggest", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    tos_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "tos", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    trip_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "trips", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    unresolved_staff_pois_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "staff", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [6, "unresolved", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    unsupported_browser_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "unsupported_browser", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    unsupported_screen_size_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "unsupported_screen_size", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    upload_banner_image_api_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "upload_banner_image", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    upload_image_api_poi_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "pois", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "upload_image", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    upload_image_api_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [2, [2, [2, [2, [7,
        "/", !1],
        [6, "api", !1]
      ],
        [7, "/", !1]
      ],
        [6, "v1", !1]
      ],
        [7, "/", !1]
      ],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "upload_image", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    upload_image_user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [2, [2, [7, "/", !1],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [7, "/", !1]
      ],
        [6, "upload_image", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    user_path: function(a, b) {
      return e.build_path(["id"], ["format"], [2, [2, [2, [2, [7, "/", !1],
        [6, "users", !1]
      ],
        [7, "/", !1]
      ],
        [3, "id", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    users_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "users", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    },
    welcome_path: function(a) {
      return e.build_path([], ["format"], [2, [2, [7, "/", !1],
        [6, "welcome", !1]
      ],
        [1, [2, [8, ".", !1],
          [3, "format", !1]
        ], !1]
      ], arguments)
    }
  };
  window.rt.routes.options = c
})();
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = rt.helpers,
    a = function() {
      this.mostRecentEvent = c(this.mostRecentEvent, this);
      this.registerEvent = c(this.registerEvent, this);
      this.mostRecentEventId = 0
    };
  a.prototype.registerEvent = function() {
    return this.mostRecentEventId += 1
  };
  a.prototype.mostRecentEvent = function() {
    return this.mostRecentEventId
  };
  e.EventTracker = a;
  (b = rt.helpers).ajax || (b.ajax = {});
  b = rt.helpers.ajax;
  e = function() {
    this.cancelPending = c(this.cancelPending, this);
    this.request = c(this.request, this);
    this.eventTracker = new rt.helpers.EventTracker
  };
  e.prototype.request = function(a, b) {
    var c, e = this;
    c = this.eventTracker.registerEvent();
    return a(function() {
      if (c === e.eventTracker.mostRecentEvent()) return b()
    })
  };
  e.prototype.cancelPending = function() {
    return this.eventTracker.registerEvent()
  };
  b.FreshRequester = e
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).app || (b.app = {});
  var c = rt.helpers.app;
  c.isMobileScreen = function() {
    return 960 >= window.screen.width && 640 >= window.screen.height || 640 >= window.screen.width && 960 >= window.screen.height
  };
  c.isIPhoneAgent = function() {
    return navigator.userAgent.match(/iPhone/i)
  };
  c.newBucketListView = null;
  c.showNewBucketListModal = function() {
    c.newBucketListView = new rt.views.side_bar.NewBucketListView;
    c.newBucketListView.on("closed", function() {
      rt.helpers.modal.close();
      return c.newBucketListView = null
    });
    rt.helpers.modal.open({
      view: c.newBucketListView
    }).on("backdrop-click", rt.helpers.modal.close);
    return c.newBucketListView.$("input[type=text]").focus()
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).async || (b.async = {});
  rt.helpers.async.series = function(b) {
    var e, a, d, f, h, g, j;
    h = b.input;
    d = b.chain;
    g = b.success || function() {};
    f = b.error || function() {};
    a = 0;
    j = d.length;
    e = function(b) {
      var c;
      return a < j ? (c = a, a++, d[c](b, e, f)) : g(b)
    };
    return e(h)
  }
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  };
  rt.helpers || (rt.helpers = {});
  var c = rt.helpers,
    e = function(a) {
      null == a && (a = {});
      this.categoryName = b(this.categoryName, this);
      this.groupName = b(this.groupName, this);
      this.group = b(this.group, this);
      this.findById = b(this.findById, this);
      this.categories = (null != a ? a.categories : void 0) || rt.app.Data.categories
    }, a;
  a = {
    attractions: "Attractions",
    accommodation: "Accommodation",
    entertainment: "Entertainment",
    food_drink: "Food & Drink",
    history: "History",
    nature: "Nature",
    services: "Services",
    shopping: "Shopping",
    sports: "Sports",
    towns: "Towns"
  };
  e.prototype.findById = function(a) {
    return _.find(this.categories, function(b) {
      return a === b._id
    })
  };
  e.prototype.group = function(a) {
    var b;
    return null != (b = this.findById(a)) ? b.group : void 0
  };
  e.prototype.groupName = function(b) {
    return a[this.group(b)]
  };
  e.prototype.categoryName = function(a) {
    var b;
    return null != (b = this.findById(a)) ? b.name : void 0
  };
  c.Categories = e
}).call(this);
(function() {
  rt.Context = function(b) {
    this.bucketListsCollection = b.bucketListsCollection;
    this.categoriesCollection = b.categoriesCollection;
    this.distanceSlider = b.distanceSlider;
    this.activeTrip = b.activeTrip;
    this.activeCategoriesPoisCollection = b.activeCategoriesPoisCollection
  }
}).call(this);
(function() {
  rt.helpers || (rt.helpers = {});
  rt.helpers.conversions = {
    mpgToKpl: function(b) {
      return 0.42832087053302403 * b
    },
    kplToMpg: function(b) {
      return b / 0.42832087053302403
    },
    metersToKilometers: function(b) {
      return b / 1E3
    },
    milesToKilometers: function(b) {
      return 1.621371192 * b
    },
    kilometersToMiles: function(b) {
      return b / 1.621371192
    },
    perGallonToPerLiter: function(b) {
      return b * GALLON_PER_LITER
    }
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).expedia || (b.expedia = {});
  var c, e, a, d, f, h, g, j;
  rt.helpers.expedia.requestBookingInfo = function(a, b) {
    return $.ajax({
      url: "http://api.ean.com/ean-services/rs/hotel/v3/list",
      cache: !1,
      data: {
        apiKey: "tns3ywkhwujzauja5kzzmabc",
        cid: "363498",
        _type: "json",
        address: a.address1,
        city: a.city,
        stateProvinceCode: a.state,
        countryCode: "us"
      },
      dataType: "jsonp",
      success: function(c) {
        var d;
        d = e(a, c);
        return b(d, c)
      }
    })
  };
  e = function(b, c) {
    var f, e, j;
    f = null != (j = c.HotelListResponse.HotelList) ? j.HotelSummary : void 0;
    if (!f) return null;
    e = d(b.address1, b.city, b.state);
    f = _(f).filter(function(b) {
      return a(e, b)
    });
    return 1 === f.length ? f[0] : null
  };
  a = function(a, b) {
    var c;
    c = d(b.address1, b.city, b.stateProvinceCode);
    return null != a && null != c && a === c
  };
  d = function(a, b, d) {
    if (_([a, b, d]).any(c)) return null;
    a = f(a);
    b = g(b);
    d = g(d);
    return "" + a + b + d
  };
  c = function(a) {
    return !(null != a && 0 < a.replace(/\s/, "").length)
  };
  g = function(a) {
    return a.replace(/\s/, "").toLowerCase()
  };
  f = function(a) {
    return a ? (a = j(a), a = _(a).map(h), a.join()) : null
  };
  j = function(a) {
    a = a.toLowerCase();
    a = a.replace(/[^a-zA-Z0-9 \t\r\n\f]/, "");
    a = a.replace(/^[ \t\r\n\f]+/, "");
    a = a.replace(/[ \t\r\n\f]+$/, "");
    return a.split(/[ \t\r\n\f]+/)
  };
  h = function(a) {
    var b;
    return (b = {
      street: "st",
      avenue: "ave",
      drive: "dr",
      north: "n",
      northeast: "ne",
      east: "e",
      southeast: "se",
      south: "s",
      southwest: "sw",
      west: "w",
      northwest: "nw"
    }[a]) ? b : a
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).facebook || (b.facebook = {});
  var c, e, a, d, f, h, g;
  rt.helpers.facebook.connect = function(a) {
    return rt.helpers.session.loggedIn() ? d(a) : h(a)
  };
  h = function(b) {
    return rt.helpers.async.series({
      input: null,
      chain: [a, g, c, e],
      success: b.success,
      error: b.error
    })
  };
  d = function(b) {
    return rt.helpers.async.series({
      input: null,
      chain: [a, g, f],
      success: b.success,
      error: b.error
    })
  };
  a = function(a, b) {
    return FB.getLoginStatus(function(a) {
      var c;
      a && ("connected" === a.status && a.authResponse) && (c = a.authResponse.accessToken);
      return b(c)
    })
  };
  g = function(a, b) {
    return a ? b(a) : FB.login(function(a) {
      if (a.authResponse) return b(a.authResponse.accessToken)
    }, {
      scope: "email"
    })
  };
  c = function(a, b, c) {
    return $.ajax({
      url: "/oauth_authentications/facebook/callback",
      success: b,
      error: c,
      data: {
        access_token: a
      },
      type: "POST",
      dataType: "json"
    })
  };
  f = function(a, b, c) {
    return $.ajax({
      url: "/oauth_authentications/facebook/link",
      success: b,
      error: c,
      data: {
        access_token: a
      },
      type: "POST",
      dataType: "json"
    })
  };
  e = function(a, b, c) {
    var d;
    a instanceof
    rt.models.CurrentUser || (a = new rt.models.CurrentUser(a));
    d = new rt.models.User({
      id: a.get("user_id")
    });
    return d.fetch({
      success: function(a) {
        rt.app.currentUser.set("user", d);
        rt.app.events.trigger("session:login");
        rt.app.events.trigger("analytics:session:login", {
          data: {
            email: a.get("email")
          }
        });
        return b()
      },
      error: c
    })
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).format || (b.format = {});
  b = rt.helpers.format;
  var c, e;
  b.phone = function(a) {
    var b, c;
    if (null == a) return "";
    c = a.replace(/\W/g, "");
    b = c.length;
    if (!(7 <= b)) return c;
    a = c.length - 4;
    c = e(c, a, "-");
    if (!(10 <= b)) return c;
    a = c.length - 8;
    c = e(c, a, ") ");
    a = c.length - 13;
    c = e(c, a, "(");
    if (!(10 < b)) return c;
    a = c.length - 14;
    c = e(c, a, " ");
    return "+" + c
  };
  b.website = function(a) {
    if (null == a || c(a)) return "";
    a.match("^http://") || (a = "http://" + a);
    return a
  };
  c = function(a) {
    return 0 < !a.replace(/\s/g,
      "").length
  };
  e = function(a, b, c) {
    return a.slice(0, b) + c + a.slice(b)
  }
}).call(this);
(function() {
  rt.helpers || (rt.helpers = {});
  var b;
  rt.helpers.calculateDirections = function(c, e) {
    var a, d, f, h;
    h = _(c.get("waypoints"));
    a = !c.get("use_highways");
    if (2 > h.size()) e && e(null);
    else return f = function(a) {
      return b(a.location)
    }, d = function(a) {
      return {
        location: b(a.location)
      }
    }, d = _(h.initial()).rest().map(d), a = {
      origin: f(h.first()),
      waypoints: d,
      destination: f(h.last()),
      travelMode: google.maps.TravelMode.DRIVING,
      avoidHighways: a
    }, rt.app.events.trigger("ui:push_loading"), rt.app.DirectionsService.route(a, function(a,
    b) {
      rt.app.events.trigger("ui:pop_loading");
      b === google.maps.DirectionsStatus.OK ? rt.app.events.trigger("analytics:trip:route", {
        data: {
          waypoints: h.size()
        }
      }) : (a = null, console.log("error in directionsService"), console.log(b), console.log(a));
      if (e) return e(a)
    })
  };
  b = function(b) {
    return b ? new google.maps.LatLng(b[1], b[0]) : null
  }
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  };
  rt.helpers || (rt.helpers = {});
  var c = rt.helpers,
    e = function() {
      this.shadow = b(this.shadow, this);
      this.forName = b(this.forName, this);
      this.forCategory = b(this.forCategory, this);
      var c, e, m, v;
      this.shadowIcon = new google.maps.MarkerImage(f, h, new google.maps.Point(0, 0), new google.maps.Point(2, 40));
      c = function(b) {
        return new google.maps.MarkerImage(d, g, new google.maps.Point(0, a * b + j + n * b))
      };
      this.mapMarkerIcons = {
        bucket_list: c(0),
        attractions: c(1),
        accommodation: c(2),
        entertainment: c(3),
        food_drink: c(6),
        history: c(7),
        nature: c(8),
        services: c(9),
        shopping: c(10),
        sports: c(11),
        deals: c(13),
        origin: c(14),
        via: c(15),
        destination: c(16),
        waypoint1: c(17),
        waypoint2: c(18),
        waypoint3: c(19),
        waypoint4: c(20),
        waypoint5: c(21),
        waypoint6: c(22),
        waypoint7: c(23),
        waypoint8: c(24),
        waypoint9: c(25),
        waypoint10: c(26),
        waypoint11: c(27),
        waypoint12: c(28),
        waypoint13: c(29),
        waypoint14: c(30),
        waypoint15: c(31),
        waypoint16: c(32),
        waypoint17: c(33),
        waypoint18: c(34),
        waypoint19: c(35),
        waypoint20: c(36),
        waypoint21: c(37),
        waypoint22: c(38),
        waypoint23: c(39),
        search: c(40)
      };
      this.categoryGroupMapping = {};
      v = rt.app.Data.categories;
      e = 0;
      for (m = v.length; e < m; e++) c = v[e], this.categoryGroupMapping[c._id] = c.group
    }, a, d, f, h, g, j, n;
  j = 6;
  a = 44;
  n = 6;
  g = new google.maps.Size(40, a);
  d = "/assets/sprite-pins-1d2a0ef0fc1bbcf50839ce0e9e158d75.png";
  f = "/assets/map-marker-shadow-6498756c11bf49108aeb8db48e4d2766.png";
  h = new google.maps.Size(39, 36);
  e.prototype.forCategory = function(a) {
    var b;
    a = null != (b = this.categoryGroupMapping) ? b[a] : void 0;
    return this.forName(a)
  };
  e.prototype.forName = function(a) {
    return this.mapMarkerIcons[a]
  };
  e.prototype.shadow = function() {
    return this.shadowIcon
  };
  c.MapMarker = e
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).modal || (b.modal = {});
  var c = rt.helpers.modal;
  c.open = function(b) {
    c.close();
    b = new rt.views.ModalView(b);
    $("body").append(b.render().el);
    return c.modalView = b
  };
  c.close = function() {
    if (null != c.modalView) return c.modalView.remove(), c.modalView = null
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).overlay || (b.overlay = {});
  var c = rt.helpers.overlay;
  c.open = function(b) {
    rt.helpers.modal.close();
    c.close();
    b.render();
    $("body").append(b.el);
    c.overlayView = b;
    if (_.isFunction(b.afterDomInsertion)) return b.afterDomInsertion()
  };
  c.close = function() {
    if (null != c.overlayView) return c.overlayView.remove(), c.overlayView = null
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).places || (b.places = {});
  b = rt.helpers.places;
  var c, e, a, d;
  b.resolveWaypointFromText = function(a) {
    return rt.helpers.async.series({
      input: a.inputText,
      chain: [e, c, d],
      success: a.success,
      error: a.error
    })
  };
  b.resolveWaypointFromGooglePlace = function(a) {
    return d(a.place, a.success)
  };
  e = function(a, b, c) {
    return rt.app.AutocompleteService.getPredictions({
      input: a
    }, function(a, d) {
      return d === google.maps.places.PlacesServiceStatus.OK && 0 < a.length ? b(a) : c()
    })
  };
  c = function(a,
  b, c) {
    return rt.app.PlacesService.getDetails({
      reference: a[0].reference
    }, function(a, d) {
      return d === google.maps.places.PlacesServiceStatus.OK ? b(a) : c()
    })
  };
  d = function(b, c) {
    var d;
    d = {
      latitude: b.geometry.location.lat(),
      longitude: b.geometry.location.lng(),
      phone: b.formatted_phone_number,
      address1: a(b),
      name: b.name
    };
    return rt.api.pois.resolve(d, function(a) {
      a ? a = new rt.models.Waypoint({
        type: rt.models.Waypoint.TYPE_POI,
        name: a.name,
        location: [a.longitude, a.latitude],
        poi_id: a.id
      }) : (a = b.formatted_address, a = new rt.models.Waypoint({
        type: rt.models.Waypoint.TYPE_GEO,
        name: a,
        location: [b.geometry.location.lng(), b.geometry.location.lat()],
        poi_id: null
      }));
      return c(a)
    })
  };
  a = function(a) {
    return _.isArray(a.address_components) && 2 <= a.address_components.length ? "" + a.address_components[0].short_name + " " + a.address_components[1].short_name : null
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).session || (b.session = {});
  var c = rt.helpers.session;
  c.loggedIn = function() {
    return null != rt.app.currentUser.get("user")
  };
  c.notLoggedIn = function() {
    return !c.loggedIn()
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).settings || (b.settings = {});
  b = rt.helpers.settings;
  var c, e;
  b.GAS_PRICE_PER_GALLON = 3.775;
  b.DIESEL_PRICE_PER_GALLON = 4.075;
  b.FUEL_TYPE_GASOLINE = "gasoline";
  b.FUEL_TYPE_DIESEL = "diesel";
  b.fuelType = function(a) {
    null === a && (a = e);
    return a
  };
  b.fuelEconomy = function(a) {
    null === a && (a = c);
    return a
  };
  e = b.FUEL_TYPE_GASOLINE;
  c = 22
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).string || (b.string = {});
  var c = rt.helpers.string;
  c.blank = function(b) {
    return !_.isString(b) || "" === b.replace(/\s/, "")
  };
  c.notBlank = function(b) {
    return !c.blank(b)
  }
}).call(this);
(function() {
  var b;
  rt.helpers || (rt.helpers = {});
  (b = rt.helpers).templates || (b.templates = {});
  rt.helpers.templates.outputArray = function(b, e) {
    return _(b).map(e).join("")
  }
}).call(this);
(function() {
  var b = window.rt.helpers,
    c, e, a, d;
  d = function(a) {
    return _.reduce(a, function(a, b, c, d) {
      b < d[a] && (a = c);
      return a
    }, 0)
  };
  a = function(a, b) {
    var c, e, n, p;
    p = [];
    e = 0;
    for (n = a.length; e < n; e++) c = a[e], p.push(google.maps.geometry.spherical.computeDistanceBetween(b, c));
    return d(p)
  };
  e = function(b, c) {
    var d, e, n, p, q;
    p = [];
    p.push(0);
    e = _.clone(b);
    var m, v;
    m = c.slice(1);
    v = [];
    q = 0;
    for (n = m.length; q < n; q++) d = m[q], v.push(d.start_location);
    d = 0;
    for (q = v.length; d < q; d++) n = v[d], n = a(e, n), p.push(n);
    p.push(b.length - 1);
    return p
  };
  c = function(b,
  c) {
    var d, j, n, p, q, m, v;
    n = c.routes[0].overview_path;
    d = c.routes[0].legs;
    j = a(n, b);
    q = e(n, d);
    d = [];
    n = m = 0;
    for (v = q.length; m < v; n = ++m) p = q[n], d.push({
      index: n,
      sub: p - j,
      pathIndex: p
    });
    j = _.min(d, function(a) {
      return Math.abs(a.sub)
    });
    if (0 >= j.sub) return j.index + 1;
    if (0 < j.sub) return j.index
  };
  b.trips = {
    addPoiToPath: function(a, b, d) {
      var e;
      a = rt.models.Waypoint.buildPoiWaypoint(a);
      b.removeBlanks();
      if (1 < b.vertexCount()) {
        if (d = c(a.mapLatLng(), d), e = b.vertexCount(), b.addVertex(a, d), e === b.vertexCount()) return
      } else b.addVertex(a);
      rt.app.events.trigger("notify:trip:waypoint_added");
      return b
    }
  }
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = function(a, b) {
      function d() {
        this.constructor = a
      }
      for (var f in b) c.call(b, f) && (a[f] = b[f]);
      d.prototype = b.prototype;
      a.prototype = new d;
      a.__super__ = b.prototype;
      return a
    }, a = [].indexOf || function(a) {
      for (var b = 0, c = this.length; b < c; b++) if (b in this && this[b] === a) return b;
      return -1
    }, d = rt.models,
    f = function() {
      this.bookable = b(this.bookable, this);
      this.mapLatLng = b(this.mapLatLng, this);
      this.removeCategory = b(this.removeCategory,
      this);
      this.addCategory = b(this.addCategory, this);
      this.geocodingAddress = b(this.geocodingAddress, this);
      this.validAddress = b(this.validAddress, this);
      this._valid = b(this._valid, this);
      this._runValidations = b(this._runValidations, this);
      this._validates_presence_of = b(this._validates_presence_of, this);
      return f.__super__.constructor.apply(this, arguments)
    }, h;
  e(f, Backbone.Model);
  f.prototype.idAttribute = "_id";
  f.prototype.urlRoot = "/api/v1/pois";
  f.prototype.countries = ["US", "CA"];
  f.prototype.defaults = {
    address1: null,
    city: null,
    state: null,
    zip_code: null,
    description: null,
    phone: null,
    website: null,
    user_rating: 3,
    categories: null,
    longitude: null,
    latitude: null,
    reference_code: null,
    selected: !1,
    image: null
  };
  h = _("hotels motels bbs-inns boutique-hotels resorts offbeat-hotels hostels".split(" "));
  f.prototype._validates_presence_of = function(a, b) {
    var c;
    return rt.helpers.string.blank(this.get(a)) ? (c = b.message ? b.message : "" + a + " cannot be blank", {
      field: a,
      message: c
    }) : null
  };
  f.prototype._runValidations = function(a) {
    var b = this;
    a = _(a).reduce(function(a,
    c) {
      var d;
      (d = b._validates_presence_of(c.field, {
        message: c.message
      })) && a.push(d);
      return a
    }, []);
    return 0 < a.length ? a : null
  };
  f.prototype._valid = function() {
    return this._runValidations([{
      field: "name",
      message: "Name cannot be blank"
    }])
  };
  f.prototype.validAddress = function() {
    return this._runValidations([{
      field: "address1",
      message: "Street address cannot be blank"
    }, {
      field: "city",
      message: "City cannot be blank"
    }, {
      field: "state",
      message: "State cannot be blank"
    }, {
      field: "zip_code",
      message: "Zip code cannot be blank"
    }, {
      field: "country",
      message: "Country cannot be blank"
    }])
  };
  f.prototype.geocodingAddress = function() {
    var a, b, c = this;
    b = _("address1 address2 city state zip_code country".split(" "));
    _(["address1", "city", "state", "zip_code", "country"]).every(function(a) {
      return rt.helpers.string.notBlank(c.get(a))
    }) ? (a = "", b.each(function(b) {
      if (c.has(b)) return a += " " + c.get(b)
    })) : a = null;
    return a
  };
  f.prototype.addCategory = function(b) {
    var c;
    c = this.get("categories") || [];
    0 > a.call(c, b) && 8 >= c.length && (c = _.map(c, _.identity), c.push(b), this.set({
      categories: c
    }));
    return this
  };
  f.prototype.removeCategory = function(a) {
    var b;
    b = this.get("categories");
    this.set({
      categories: _.without(b, a)
    });
    return this
  };
  f.prototype.mapLatLng = function() {
    return this.has("latitude") && this.has("longitude") ? new google.maps.LatLng(this.get("latitude"), this.get("longitude")) : null
  };
  f.prototype.bookable = function() {
    return _(this.get("categories")).any(function(a) {
      return h.include(a)
    })
  };
  d.Poi = f;
  var d = rt.collections,
    g = function() {
      this.merge = b(this.merge, this);
      return g.__super__.constructor.apply(this,
      arguments)
    };
  e(g, Backbone.Collection);
  g.prototype.model = rt.models.Poi;
  g.prototype.url = "/api/v1/pois";
  g.prototype.merge = function(a) {
    var b;
    b = this.get(a._id);
    null != b ? b.set(a) : (b = new rt.models.Poi(a), this.add(b));
    return b
  };
  d.PoisCollection = g
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = function(a, b) {
      function d() {
        this.constructor = a
      }
      for (var f in b) c.call(b, f) && (a[f] = b[f]);
      d.prototype = b.prototype;
      a.prototype = new d;
      a.__super__ = b.prototype;
      return a
    }, a = rt.models,
    d = function() {
      this.serialize = b(this.serialize, this);
      this.changeState = b(this.changeState, this);
      return d.__super__.constructor.apply(this, arguments)
    };
  e(d, rt.models.Poi);
  d.prototype.defaults = {
    categoryId: null,
    bucketList: !1
  };
  d.prototype.changeState = function(a) {
    if (this.get("bucketList") !== a.bucketList || this.get("categoryId") !== a.categoryId) return this.set(a), this.trigger("change:state")
  };
  d.prototype.serialize = function() {
    return rt.utils.serializeModel(this, "rt.models.MappingPoi")
  };
  d.prototype.getCommentsList = function() {
    var a;
    a = this.has("comments") ? this.get("comments") : [];
    return new rt.collections.CommentsCollection(a, {
      commentable: this
    })
  };
  a.MappingPoi = d;
  var a = rt.collections,
    f = function() {
      this.hasPoi = b(this.hasPoi, this);
      return f.__super__.constructor.apply(this,
      arguments)
    };
  e(f, Backbone.Collection);
  f.prototype.model = rt.models.MappingPoi;
  f.prototype.url = "/api/v1/pois";
  f.prototype.hasPoi = function(a) {
    return this.any(function(b) {
      return b.id === a.id
    })
  };
  a.MappingPoisCollection = f
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this.isPoi = b(this.isPoi, this);
      this.isGeo = b(this.isGeo, this);
      this.isVia = b(this.isVia, this);
      this.mapLatLng = b(this.mapLatLng, this);
      this.hasLocation = b(this.hasLocation, this);
      this.withName = b(this.withName, this);
      this.withoutName = b(this.withoutName, this);
      this.notBlank = b(this.notBlank, this);
      this.blank = b(this.blank, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.buildPoiWaypoint = function(a) {
    return new rt.models.Waypoint({
      type: rt.models.Waypoint.TYPE_POI,
      name: a.get("name"),
      location: [a.get("longitude"), a.get("latitude")],
      poi_id: a.id
    })
  };
  a.TYPE_POI = "poi";
  a.TYPE_GEO = "geo";
  a.TYPE_VIA = "via";
  a.prototype.idAttribute = "_id";
  a.prototype.defaults = {
    type: null,
    name: "",
    location: null,
    poi_id: null
  };
  a.prototype.blank = function() {
    return !this.has("name") ||
      "" === this.get("name")
  };
  a.prototype.notBlank = function() {
    return !this.blank()
  };
  a.prototype.withoutName = function() {
    return !this.has("name") || "" === this.get("name")
  };
  a.prototype.withName = function() {
    return !this.withoutName()
  };
  a.prototype.hasLocation = function() {
    return this.has("location")
  };
  a.prototype.mapLatLng = function() {
    var a;
    return this.hasLocation() ? (a = this.get("location"), new google.maps.LatLng(a[1], a[0])) : null
  };
  a.prototype.isVia = function() {
    return this.get("type") === a.TYPE_VIA
  };
  a.prototype.isGeo = function() {
    return this.get("type") === a.TYPE_GEO
  };
  a.prototype.isPoi = function() {
    return this.get("type") === a.TYPE_POI
  };
  e.Waypoint = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
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
  e.prototype.idAttribute = "_id";
  e.prototype.defaults = {
    distance: null
  };
  c.Leg = e
}).call(this);
(function() {
  var b;
  rt.api || (rt.api = {});
  (b = rt.api).pois || (b.pois = {});
  rt.api.pois.resolve = function(b, e) {
    return $.ajax({
      type: "GET",
      url: "/api/v1/pois/resolve_google",
      data: b,
      cache: !1,
      success: e
    })
  }
}).call(this);
(function() {
  var b;
  rt.api || (rt.api = {});
  (b = rt.api).states || (b.states = {});
  var c, e;
  e = [{
    id: "AL",
    abbreviation: "AL",
    name: "Alabama"
  }, {
    id: "AK",
    abbreviation: "AK",
    name: "Alaska"
  }, {
    id: "AZ",
    abbreviation: "AZ",
    name: "Arizona"
  }, {
    id: "AR",
    abbreviation: "AR",
    name: "Arkansas"
  }, {
    id: "CA",
    abbreviation: "CA",
    name: "California"
  }, {
    id: "CO",
    abbreviation: "CO",
    name: "Colorado"
  }, {
    id: "CT",
    abbreviation: "CT",
    name: "Connecticut"
  }, {
    id: "DE",
    abbreviation: "DE",
    name: "Delaware"
  }, {
    id: "DC",
    abbreviation: "DC",
    name: "Washington DC"
  }, {
    id: "FL",
    abbreviation: "FL",
    name: "Florida"
  }, {
    id: "GA",
    abbreviation: "GA",
    name: "Georgia"
  }, {
    id: "HI",
    abbreviation: "HI",
    name: "Hawaii"
  }, {
    id: "ID",
    abbreviation: "ID",
    name: "Idaho"
  }, {
    id: "IL",
    abbreviation: "IL",
    name: "Illinois"
  }, {
    id: "IN",
    abbreviation: "IN",
    name: "Indiana"
  }, {
    id: "IA",
    abbreviation: "IA",
    name: "Iowa"
  }, {
    id: "KS",
    abbreviation: "KS",
    name: "Kansas"
  }, {
    id: "KY",
    abbreviation: "KY",
    name: "Kentucky"
  }, {
    id: "LA",
    abbreviation: "LA",
    name: "Louisiana"
  }, {
    id: "ME",
    abbreviation: "ME",
    name: "Maine"
  }, {
    id: "MD",
    abbreviation: "MD",
    name: "Maryland"
  }, {
    id: "MA",
    abbreviation: "MA",
    name: "Massachusetts"
  }, {
    id: "MI",
    abbreviation: "MI",
    name: "Michigan"
  }, {
    id: "MN",
    abbreviation: "MN",
    name: "Minnesota"
  }, {
    id: "MS",
    abbreviation: "MS",
    name: "Mississippi"
  }, {
    id: "MO",
    abbreviation: "MO",
    name: "Missouri"
  }, {
    id: "MT",
    abbreviation: "MT",
    name: "Montana"
  }, {
    id: "NE",
    abbreviation: "NE",
    name: "Nebraska"
  }, {
    id: "NV",
    abbreviation: "NV",
    name: "Nevada"
  }, {
    id: "NH",
    abbreviation: "NH",
    name: "New Hampshire"
  }, {
    id: "NJ",
    abbreviation: "NJ",
    name: "New Jersey"
  }, {
    id: "NM",
    abbreviation: "NM",
    name: "New Mexico"
  }, {
    id: "NY",
    abbreviation: "NY",
    name: "New York"
  }, {
    id: "NC",
    abbreviation: "NC",
    name: "North Carolina"
  }, {
    id: "ND",
    abbreviation: "ND",
    name: "North Dakota"
  }, {
    id: "OH",
    abbreviation: "OH",
    name: "Ohio"
  }, {
    id: "OK",
    abbreviation: "OK",
    name: "Oklahoma"
  }, {
    id: "OR",
    abbreviation: "OR",
    name: "Oregon"
  }, {
    id: "PA",
    abbreviation: "PA",
    name: "Pennsylvania"
  }, {
    id: "RI",
    abbreviation: "RI",
    name: "Rhode Island"
  }, {
    id: "SC",
    abbreviation: "SC",
    name: "South Carolina"
  }, {
    id: "SD",
    abbreviation: "SD",
    name: "South Dakota"
  }, {
    id: "TN",
    abbreviation: "TN",
    name: "Tennessee"
  }, {
    id: "TX",
    abbreviation: "TX",
    name: "Texas"
  }, {
    id: "UT",
    abbreviation: "UT",
    name: "Utah"
  }, {
    id: "VT",
    abbreviation: "VT",
    name: "Vermont"
  }, {
    id: "VA",
    abbreviation: "VA",
    name: "Virginia"
  }, {
    id: "WA",
    abbreviation: "WA",
    name: "Washington"
  }, {
    id: "WV",
    abbreviation: "WV",
    name: "West Virginia"
  }, {
    id: "WI",
    abbreviation: "WI",
    name: "Wisconsin"
  }, {
    id: "WY",
    abbreviation: "WY",
    name: "Wyoming"
  }];
  c = [{
    id: "ON",
    abbreviation: "ON",
    name: "Ontario"
  }, {
    id: "QC",
    abbreviation: "QC",
    name: "Quebec"
  }, {
    id: "NS",
    abbreviation: "NS",
    name: "Nova Scotia"
  }, {
    id: "NB",
    abbreviation: "NB",
    name: "New Brunswick"
  }, {
    id: "MB",
    abbreviation: "MB",
    name: "Manitoba"
  }, {
    id: "BC",
    abbreviation: "BC",
    name: "British Columbia"
  }, {
    id: "PE",
    abbreviation: "PE",
    name: "Prince Edward Island"
  }, {
    id: "SK",
    abbreviation: "SK",
    name: "Saskatchewan"
  }, {
    id: "AB",
    abbreviation: "AB",
    name: "Alberta"
  }, {
    id: "NL",
    abbreviation: "NL",
    name: "Newfoundland and Labrador"
  }];
  rt.api.states.states = function(a) {
    return "CA" === a.country ? c : e
  }
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this._addPoiToTrip = b(this._addPoiToTrip, this);
      this.calculateDirections = b(this.calculateDirections, this);
      this._tripDestroyed = b(this._tripDestroyed, this);
      this._tripUrlChanged = b(this._tripUrlChanged, this);
      this._activeTripChanged = b(this._activeTripChanged, this);
      this.tripCollection = rt.app.collections.tripCollection;
      a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.idAttribute = "_id";
  a.prototype.defaults = {
    trip: null
  };
  a.prototype.initialize = function() {
    _.bindAll(this);
    this.on("change:trip", this._activeTripChanged);
    rt.app.events.on("ui:add_to_trip", this._addPoiToTrip, this);
    if (null == this.get("trip")) return this["new"]()
  };
  a.prototype._activeTripChanged = function() {
    var a, b;
    a = this.previous("trip");
    null != a && a.off(null, null,
    this);
    b = this.get("trip");
    a = new rt.google.models.Directions;
    this.set("directions", a);
    this.calculateDirections(b, function() {
      if (!b.isNew()) return b.autosave()
    });
    b.on("change:share_url", this._tripUrlChanged, this);
    return b.on("destroy", this._tripDestroyed, this)
  };
  a.prototype._tripUrlChanged = function(a) {
    return rt.app.router.navigate(a.get("share_url"), {
      trigger: !1
    })
  };
  a.prototype._tripDestroyed = function() {
    return rt.app.router.navigate("/trips/new", {
      trigger: !0
    })
  };
  a.prototype["new"] = function(a, b) {
    var c;
    c = this.tripCollection["new"](a,
    b);
    return this.set("trip", c)
  };
  a.prototype.calculateDirections = function(a, b) {
    var c, d = this;
    c = function(c) {
      var f, e, g, h;
      f = d.get("directions");
      f.set("directions_result", c);
      g = f.getEncodedPolyline();
      h = f.updateLegs(a.get("legs"));
      e = f.getTripDistance();
      f = f.getTripTime();
      a.set({
        distance: e,
        time: f,
        encoded_polyline: g,
        legs: h
      });
      b && b();
      if (null != c) return rt.app.events.trigger("ui:route")
    };
    return 2 > _(a.get("waypoints")).filter(function(a) {
      return null != a.location
    }).length ? c(null) : rt.helpers.calculateDirections(a, c)
  };
  a.prototype._addPoiToTrip = function(a) {
    var b, c, d;
    d = this.get("trip");
    c = new rt.models.TripPath(d.get("waypoints"), d.get("legs"));
    d.get("encoded_polyline");
    b = this.get("directions").get("directions_result");
    c = rt.helpers.trips.addPoiToPath(a, c, b);
    b = function(a) {
      return a.toJSON()
    };
    a = _(c.vertices).map(b);
    c = _(c.edges).map(b);
    d.set({
      waypoints: a,
      legs: c
    });
    return this.calculateDirections(d, function() {
      return d.autosave()
    })
  };
  e.ActiveTrip = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = function(a, b) {
      function d() {
        this.constructor = a
      }
      for (var f in b) c.call(b, f) && (a[f] = b[f]);
      d.prototype = b.prototype;
      a.prototype = new d;
      a.__super__ = b.prototype;
      return a
    }, a = rt.models,
    d = function() {
      this.removePoi = b(this.removePoi, this);
      this.addPoi = b(this.addPoi, this);
      this.disable = b(this.disable, this);
      this.enable = b(this.enable, this);
      this.toggleActiveState = b(this.toggleActiveState, this);
      this.findPoi = b(this.findPoi,
      this);
      this.hasPoi = b(this.hasPoi, this);
      this.poiIds = b(this.poiIds, this);
      return d.__super__.constructor.apply(this, arguments)
    };
  e(d, Backbone.Model);
  d.prototype.urlRoot = "/api/v1/bucket_lists";
  d.prototype.defaults = {
    name: null,
    pois: [],
    active: !1
  };
  d.prototype.initialize = function() {};
  d.prototype.poiIds = function() {
    return _.pluck(this.get("pois"), "id")
  };
  d.prototype.hasPoi = function(a) {
    return null != this.findPoi(a)
  };
  d.prototype.findPoi = function(a) {
    return _.find(this.get("pois"), function(b) {
      return a.id.toString() === b.id.toString()
    })
  };
  d.prototype.toggleActiveState = function() {
    return this.get("active") ? this.disable() : this.enable()
  };
  d.prototype.enable = function() {
    return this.set({
      active: !0
    })
  };
  d.prototype.disable = function() {
    return this.set({
      active: !1
    })
  };
  d.prototype.addPoi = function(a) {
    var b = this;
    return this.hasPoi(a) ? rt.app.events.trigger("notify:bucket_list:poi_exists") : (new rt.models.BucketListPoi({
      bucket_list_id: this.id,
      poi_id: a.id
    })).save({}, {
      success: function() {
        b.set({
          pois: _.union(b.get("pois"), [a])
        });
        return rt.app.events.trigger("notify:bucket_list:poi_added")
      },
      error: function() {
        return rt.app.events.trigger("notify:bucket_list:error")
      }
    })
  };
  d.prototype.removePoi = function(a) {
    var b = this;
    return (new rt.models.BucketListPoi({
      bucket_list_id: this.id,
      poi_id: a.id,
      id: a.id
    })).destroy({
      success: function() {
        var c;
        c = _.reject(b.get("pois"), function(b) {
          return b.id === a.id
        });
        b.set({
          pois: c
        });
        rt.app.events.trigger("notify:bucket_list:poi_removed");
        if (!b.collection.anyHasPoi(a)) return rt.app.events.trigger("removePoisById", [a.id])
      },
      error: function() {
        return rt.app.events.trigger("notify:generic", {
          message: "An error occurred removing a place from your bucket list."
        })
      }
    })
  };
  a.BucketList = d;
  var a = rt.collections,
    f = function() {
      this.getActive = b(this.getActive, this);
      this.anyHasPoi = b(this.anyHasPoi, this);
      this.addBucketList = b(this.addBucketList, this);
      this.deactivateAll = b(this.deactivateAll, this);
      this.activateAll = b(this.activateAll, this);
      this.url = b(this.url, this);
      this.poiIds = b(this.poiIds, this);
      return f.__super__.constructor.apply(this, arguments)
    };
  e(f, Backbone.Collection);
  f.prototype.model = rt.models.BucketList;
  f.prototype.urlRoot = "/api/v1/bucket_lists";
  f.prototype.initialize = function() {
    rt.app.events.on("bucket_lists:add", this.addBucketList);
    return rt.app.events.on("session:login", this.fetch, this)
  };
  f.prototype.poiIds = function() {
    return _.uniq(_.flatten(this.map(function(a) {
      return a.poiIds()
    })))
  };
  f.prototype.url = function() {
    return this.urlRoot
  };
  f.prototype.activateAll = function() {
    rt.app.events.trigger("addPoisById", this.poiIds());
    return this.each(function(a) {
      return a.enable()
    })
  };
  f.prototype.deactivateAll = function() {
    rt.app.events.trigger("removePoisById",
    this.poiIds());
    return this.each(function(a) {
      return a.disable()
    })
  };
  f.prototype.addBucketList = function(a) {
    this.add(a);
    return rt.app.events.trigger("analytics:bucket_list:new")
  };
  f.prototype.anyHasPoi = function(a) {
    return this.any(function(b) {
      return b.hasPoi(a)
    })
  };
  f.prototype.getActive = function() {
    return this.filter(function(a) {
      return !0 === a.get("active")
    })
  };
  a.BucketListsCollection = f
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
      var a = this.url,
        b = this;
      this.url = function() {
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
  e.prototype.urlRoot = "/api/v1/bucket_lists/:bucket_list_id/pois";
  e.prototype.defaults = {
    bucket_list_id: null,
    poi_id: null
  };
  e.prototype.url = function() {
    var a;
    a = this.urlRoot.replace(":bucket_list_id",
    this.get("bucket_list_id"));
    this.isNew() || (a = "" + a + "/" + this.get("poi_id"));
    return a
  };
  c.BucketListPoi = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = function(a, b) {
      function d() {
        this.constructor = a
      }
      for (var f in b) c.call(b, f) && (a[f] = b[f]);
      d.prototype = b.prototype;
      a.prototype = new d;
      a.__super__ = b.prototype;
      return a
    }, a = rt.models,
    d = function() {
      this.disable = b(this.disable, this);
      this.enable = b(this.enable, this);
      this.toggleActiveState = b(this.toggleActiveState, this);
      return d.__super__.constructor.apply(this, arguments)
    };
  e(d, Backbone.Model);
  d.prototype.idAttribute =
    "_id";
  d.prototype.defaults = {
    name: null,
    active: !1
  };
  d.prototype.toggleActiveState = function() {
    return this.get("active") ? this.disable() : this.enable()
  };
  d.prototype.enable = function() {
    return this.set({
      active: !0
    })
  };
  d.prototype.disable = function() {
    return this.set({
      active: !1
    })
  };
  a.Category = d;
  var a = rt.collections,
    f = function() {
      this.getGroup = b(this.getGroup, this);
      this.getActive = b(this.getActive, this);
      return f.__super__.constructor.apply(this, arguments)
    };
  e(f, Backbone.Collection);
  f.prototype.model = rt.models.Category;
  f.prototype.getActive = function() {
    return this.filter(function(a) {
      return !0 === a.get("active")
    })
  };
  f.prototype.getGroup = function(a) {
    return this.filter(function(b) {
      return b.get("group") === a
    })
  };
  a.CategoriesCollection = f
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = function(a, b) {
      function d() {
        this.constructor = a
      }
      for (var f in b) c.call(b, f) && (a[f] = b[f]);
      d.prototype = b.prototype;
      a.prototype = new d;
      a.__super__ = b.prototype;
      return a
    }, a = rt.models,
    d = function() {
      this.hasActiveCategory = b(this.hasActiveCategory, this);
      this.deactivateCategories = b(this.deactivateCategories, this);
      this.activateCategories = b(this.activateCategories, this);
      return d.__super__.constructor.apply(this,
      arguments)
    };
  e(d, Backbone.Model);
  d.prototype.defaults = {
    name: null,
    active: !1
  };
  d.prototype.activateCategories = function() {
    var a, b, c, d;
    d = this.get("categories");
    b = 0;
    for (c = d.length; b < c; b++) a = d[b], a.enable();
    a = _.map(this.get("categories"), function(a) {
      return a.id
    });
    return rt.app.events.trigger("addCategories", a)
  };
  d.prototype.deactivateCategories = function() {
    var a, b, c, d;
    a = _.filter(this.get("categories"), function(a) {
      return a.get("active")
    });
    c = 0;
    for (d = a.length; c < d; c++) b = a[c], b.disable();
    rt.app.events.trigger("removeCategories",
    _.map(a, function(a) {
      return a.id
    }));
    return rt.app.events.trigger("analytics:categories:clear")
  };
  d.prototype.hasActiveCategory = function() {
    return _.any(this.get("categories"), function(a) {
      return a.get("active")
    })
  };
  a.CategoryGroup = d;
  var a = rt.collections,
    f = function() {
      return f.__super__.constructor.apply(this, arguments)
    };
  e(f, Backbone.Collection);
  f.prototype.model = rt.models.CategoryGroup;
  a.CategoryGroupsCollection = f
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = function(a, b) {
      function d() {
        this.constructor = a
      }
      for (var f in b) c.call(b, f) && (a[f] = b[f]);
      d.prototype = b.prototype;
      a.prototype = new d;
      a.__super__ = b.prototype;
      return a
    }, a = rt.models,
    d = function() {
      this.commentable = b(this.commentable, this);
      this.urlRoot = b(this.urlRoot, this);
      return d.__super__.constructor.apply(this, arguments)
    };
  e(d, Backbone.Model);
  d.prototype.validate = function(a) {
    if (!a.text) return "text can't be empty"
  };
  d.prototype.urlRoot = function() {
    return "/api/v1/pois/" + this.commentable().id + "/comments"
  };
  d.prototype.commentable = function() {
    return null != this.collection ? this.collection.commentable : this.commentable
  };
  a.Comment = d;
  var a = rt.collections,
    f = function() {
      return f.__super__.constructor.apply(this, arguments)
    };
  e(f, Backbone.Collection);
  f.prototype.model = rt.models.Comment;
  f.prototype.initialize = function(a, b) {
    return this.commentable = b.commentable
  };
  f.prototype.buildComment = function() {
    var a;
    a = new rt.models.Comment;
    a.collection = this;
    return a
  };
  f.prototype.destroyComment = function(a) {
    var b, c = this;
    b = this.get(a);
    return null != b ? b.destroy({
      success: function() {
        return c.remove(b)
      }
    }) : !1
  };
  a.CommentsCollection = f
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this.identities = b(this.identities, this);
      this.isAdmin = b(this.isAdmin, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.url = "/api/v1/current_user";
  a.prototype.defaults = {
    user: null
  };
  a.prototype.isAdmin = function() {
    var a;
    return null != (a = this.get("user")) ? a.get("admin") : void 0
  };
  a.prototype.identities = function() {
    if (this._identities) return this._identities;
    this._identities = new rt.collections.UserIdentitiesCollection([], {
      user: this.get("user")
    });
    this._identities.fetch();
    return this._identities
  };
  e.CurrentUser = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this.triggerPoiRefresh = b(this.triggerPoiRefresh, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.defaults = {
    distance: 48E3,
    distanceValues: [16E3, 32E3, 48E3, 8E4,
    0]
  };
  a.prototype.initialize = function(a) {
    this.set({
      distance: (null != a ? a.distance : void 0) || 48E3
    });
    return this.bind("change", this.triggerPoiRefresh)
  };
  a.prototype.triggerPoiRefresh = function() {
    return rt.app.events.trigger("updateTripRadius", this.get("distance"))
  };
  e.DistanceSlider = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = function(a, c) {
      function d() {
        this.constructor = a
      }
      for (var e in c) b.call(c, e) && (a[e] = c[e]);
      d.prototype = c.prototype;
      a.prototype = new d;
      a.__super__ = c.prototype;
      return a
    }, e = rt.models,
    a = function() {
      return a.__super__.constructor.apply(this, arguments)
    };
  c(a, Backbone.Model);
  a.prototype.defaults = {
    name: null,
    address: null,
    category: null,
    country: "US",
    factual_id: null,
    longitude: null,
    latitude: null,
    locality: null,
    postcode: null,
    region: null,
    resolved: !1,
    similarity: null,
    status: null,
    tel: null
  };
  a.prototype.initialize = function() {
    return this
  };
  a.prototype.toPoi = function() {
    return {
      name: this.get("name"),
      address1: this.get("address"),
      city: this.get("locality"),
      state: this.get("region"),
      zip_code: this.get("postcode"),
      phone: this.get("tel"),
      longitude: this.get("longitude"),
      latitude: this.get("latitude"),
      factual_id: this.get("factual_id"),
      categories: this.get("categories")
    }
  };
  e.FactualPlace = a;
  var e = rt.collections,
    d = function() {
      return d.__super__.constructor.apply(this, arguments)
    };
  c(d, Backbone.Collection);
  d.prototype.model = rt.models.FactualPlace;
  e.FactualPlacesCollection = d
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
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
  e.prototype.urlRoot = "/api/v1/guides";
  e.prototype.idAttribute = "guide_name";
  c.Guide = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
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
  e.prototype["default"] = {
    trip: null
  };
  e.prototype.initialize = function() {
    this.set({
      centerOfMap: new google.maps.LatLng(60.16966241179892, 24.93917942047119)
    });
    this.set({
      mapOptions: {
        center: this.get("centerOfMap"),
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: !0,
        panControl: !1,
        zoomControl: !0,
        minZoom: 2,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.DEFAULT,
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl: !0,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID],
          position: google.maps.ControlPosition.BOTTOM
        },
        addressControlOptions: {
          position: google.maps.ControlPosition.BOTTOM
        },
        streetViewControl: !1
      }
    });
    return this
  };
  c.Map = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
      var a = this.validate,
        b = this;
      this.validate = function() {
        return a.apply(b, arguments)
      };
      return e.__super__.constructor.apply(this, arguments)
    }, a, d = e,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) b.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a = "plan explore guides about-us admin blogs".split(" ");
  e.prototype.defaults = {
    mode: "plan"
  };
  e.prototype.validate = function(b) {
    b = b.mode;
    if (!_(a).contains(b)) return "invalid mode: " + b
  };
  c.NavMode = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = rt.models,
    e = function(a, c) {
      this._init = b(this._init, this);
      this._removeModelReference = b(this._removeModelReference, this);
      this._onVertexModelEvent = b(this._onVertexModelEvent, this);
      this.toJSON = b(this.toJSON, this);
      this.follow = b(this.follow, this);
      this.removeVertex = b(this.removeVertex, this);
      this.addVertexAtEdge = b(this.addVertexAtEdge, this);
      this.reset = b(this.reset, this);
      this.addVertex = b(this.addVertex, this);
      this.lastVertex = b(this.lastVertex,
      this);
      this.firstVertex = b(this.firstVertex, this);
      this.edgeCount = b(this.edgeCount, this);
      this.vertexCount = b(this.vertexCount, this);
      this.indexOfVertex = b(this.indexOfVertex, this);
      this.edgeAt = b(this.edgeAt, this);
      this.vertexAt = b(this.vertexAt, this);
      this.getVertexByCid = b(this.getVertexByCid, this);
      null != a ? this._init(a, c) : (this.vertices = [], this.edges = [], this._verticesByCid = {});
      "function" === typeof this.initialize && this.initialize()
    };
  e.prototype.vertexModel = Backbone.Model;
  e.prototype.edgeModel = Backbone.Model;
  e.prototype.getVertexByCid = function(a) {
    return this._verticesByCid[a]
  };
  e.prototype.vertexAt = function(a) {
    return this.vertices[a]
  };
  e.prototype.edgeAt = function(a) {
    return this.edges[a]
  };
  e.prototype.indexOfVertex = function(a) {
    return this.vertices.indexOf(a)
  };
  e.prototype.vertexCount = function() {
    return this.vertices.length
  };
  e.prototype.edgeCount = function() {
    return this.edges.length
  };
  e.prototype.firstVertex = function() {
    if (0 < this.vertexCount()) return this.vertices[0]
  };
  e.prototype.lastVertex = function() {
    var a;
    a = this.vertexCount();
    if (0 < a) return this.vertices[a - 1]
  };
  e.prototype.addVertex = function(a, b) {
    var c;
    0 === this.vertices.length ? this.vertices.push(a) : (c = this.vertices.length, null == b && (b = c), this.vertices.splice(b, 0, a), 0 === b ? this.edges.unshift(new this.edgeModel) : b === c ? this.edges.push(new this.edgeModel) : this.edges.splice(b - 1, 1, new this.edgeModel, new this.edgeModel));
    a.path = this;
    this._verticesByCid[a.cid] = a;
    a.on("all", this._onVertexModelEvent, this);
    this.trigger("add", a, this, b);
    return this
  };
  e.prototype.reset = function(a, b, c) {
    var e = this;
    _(this.vertices).each(function(a) {
      return e._removeModelReference(a)
    });
    _(this.edges).each(function(a) {
      return e._removeModelReference(a)
    });
    this._init(a, b);
    return this.trigger("reset", this, c)
  };
  e.prototype.addVertexAtEdge = function(a, b) {
    return this.addVertex(a, this.edges.indexOf(b) + 1)
  };
  e.prototype.removeVertex = function(a) {
    var b;
    b = this.vertices.indexOf(a);
    0 === b ? (this.vertices.shift(), this.edges.shift()) : b === this.vertices.length - 1 ? (this.vertices.pop(), this.edges.pop()) : (this.vertices.splice(b,
    1), this.edges.splice(b - 1, 2, new this.edgeModel));
    this.trigger("remove", a, this, b);
    delete this._verticesByCid[a.cid];
    this._removeModelReference(a);
    return this
  };
  e.prototype.follow = function(a, b) {
    var c, e = this;
    c = this.vertices.length - 1;
    return _(this.vertices).each(function(g, j) {
      a(g, j);
      if (j !== c) return b(e.edges[j], j)
    })
  };
  e.prototype.toJSON = function() {
    var a, b;
    b = _(this.vertices).map(function(a) {
      return a.toJSON()
    });
    a = _(this.edges).map(function(a) {
      return a.toJSON()
    });
    return {
      vertices: b,
      edges: a
    }
  };
  e.prototype._onVertexModelEvent = function(a, b, c, e) {
    if (!(("add" === a || "remove" === a) && c !== this)) return "destroy" === a && this.removeVertex(b, e), this.trigger.apply(this, arguments)
  };
  e.prototype._removeModelReference = function(a) {
    this === a.path && delete a.path;
    return a.off(null, null, this)
  };
  e.prototype._init = function(a, b) {
    var c = this;
    this.vertices = _(a).map(function(a) {
      a = new c.vertexModel(a);
      a.path = c;
      a.on("all", c._onVertexModelEvent, c);
      return a
    });
    this.edges = _(b).map(function(a) {
      a = new c.edgeModel(a);
      a.path = c;
      return a
    });
    return this._verticesByCid = _(this.vertices).reduce(function(a, b) {
      a[b.cid] = b;
      return a
    }, {})
  };
  c.Path = e;
  _.extend(rt.models.Path.prototype, Backbone.Events)
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this._userChanged = b(this._userChanged, this);
      this.can = b(this.can, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.url = function() {
    return "/api/v1/permissions"
  };
  a.prototype.initialize = function(a, b) {
    this.activeUser = b.activeUser;
    this._userChanged();
    return this.activeUser.on("change:user", this._userChanged)
  };
  a.prototype.can = function(a, b) {
    var c;
    c = a;
    null != b && (c += "_" + b);
    return this.has(c)
  };
  a.prototype._userChanged = function() {
    null != this.user && this.user.off(null, null, this);
    this.user = this.activeUser.get("user");
    if (null != this.user) this.user.on("change:id", this._userChanged);
//TODO    return this.fetch()
  };
  e.Permissions = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
      var a = this.initialize,
        b = this;
      this.initialize = function() {
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
  e.prototype.defaults = {
    categories: null
  };
  e.prototype.initialize = function(a) {
    var b, c, d, f;
    this.set({
      categories: (null != a ? a.categories : void 0) || new rt.collections.CategoriesCollection
    });
    this.set({
      categoryGroups: new rt.collections.CategoryGroupsCollection
    });
    a = _.uniq(this.get("categories").pluck("group"));
    f = [];
    c = 0;
    for (d = a.length; c < d; c++) b = a[c], b = new rt.models.CategoryGroup({
      name: b,
      active: "attractions" === b,
      categories: this.get("categories").getGroup(b)
    }), f.push(this.get("categoryGroups").add(b));
    return f
  };
  c.PlacesExplorer = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
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
  e.CHANGE_TYPE_CREATE = "change";
  e.CHANGE_TYPE_UPDATE = "update";
  e.prototype.idAttribute = "_id";
  e.prototype.urlRoot = "/api/v1/poi-change-requests";
  e.prototype.defaults = {
    snapshot: null,
    created_by: null,
    created_at: null
  };
  c.PoiChangeRequest = e
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.models).pois || (b.pois = {});
  b = rt.models.pois;
  var e = function() {
    var a = this.fetch,
      b = this;
    this.fetch = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.Model,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
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
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this._updatePolygon = b(this._updatePolygon, this);
      this._bindDirections = b(this._bindDirections, this);
      this._distanceChanged = b(this._distanceChanged, this);
      this._directionsChanged = b(this._directionsChanged, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f,
  g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.url = "/api/v1/route_polygons";
  a.prototype.defaults = {
    points: null
  };
  a.prototype.initialize = function(a, b) {
    var c;
    this.distanceSlider = b.distanceSlider;
    this.distanceSlider.on("change:distance", this._distanceChanged);
    c = b.activeTrip;
    c.on("change:directions", this._directionsChanged);
    this._bindDirections(c.get("directions"));
    return this._updatePolygon()
  };
  a.prototype._directionsChanged = function(a, b) {
    this._bindDirections(b);
    return this._updatePolygon()
  };
  a.prototype._distanceChanged = function() {
    return this._updatePolygon()
  };
  a.prototype._bindDirections = function(a) {
    null != this.directions && this.directions.off(null, null, this);
    this.directions = a;
    return this.directions.on("change:directions_result", this._updatePolygon, this)
  };
  a.prototype._updatePolygon = function() {
    var a, b, c;
    b = this.directions.getEncodedPolyline();
    c = this.distanceSlider.get("distance");
    a = {
      encoded_path: b,
      radius: c
    };
    return 0 < c && 0 < (null != b ? b.length : void 0) ? this.fetch({
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(a)
    }) : this.set({
      points: null
    })
  };
  e.RoutePolygon = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.models).search || (b.search = {});
  b = rt.models.search;
  var e = function() {
    var a = this.initialize,
      b = this;
    this.initialize = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.Model,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.initialize = function(a, b) {
    return this.url = "" + rt.routes.api_autocomplete_path() + "?search_text=" + b.search_text
  };
  b.Autocomplete = e
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.models).search || (b.search = {});
  b = rt.models.search;
  var e = function() {
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.Model,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.defaults = {
    search_text: null,
    title: null,
    searchable: !1
  };
  b.AutocompleteItem = e
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.models).search || (b.search = {});
  b = rt.models.search;
  var e = function() {
    var a = this.initialize,
      b = this;
    this.initialize = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.Model,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.initialize = function(a, b) {
    return this.url = "" + rt.routes.api_search_path() + "?search_text=" + b.search_text
  };
  b.Search = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
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
  e.prototype.urlRoot = "/sessions";
  e.prototype.defaults = {
    session_id: null,
    username: null,
    email: null,
    username_or_email: null,
    password: "",
    user_id: null,
    redirect_to: null,
    remember_me: null,
    admin: !1
  };
  e.prototype.initialize = function() {};
  c.Session = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this._autosaveable = b(this._autosaveable, this);
      this._calcCost = b(this._calcCost, this);
      this.hashedSharedUrl = b(this.hashedSharedUrl, this);
      this.initialize = b(this.initialize, this);
      this.createdBy = b(this.createdBy, this);
      this.getCreatedBy = b(this.getCreatedBy, this);
      this.fetchCreatedBy = b(this.fetchCreatedBy, this);
      this.createdByFetched = b(this.createdByFetched, this);
      this.autosave = b(this.autosave,
      this);
      this.userCollection = rt.app.collections.userCollection;
      a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.autosave = function() {
    if (this._autosaveable()) return this.save(null, {
      source: this,
      error: function() {
        return rt.app.events.trigger("notify:generic", {
          message: "Oops. There was an issue trying to save your trip."
        })
      }
    })
  };
  a.prototype.createdByFetched = function() {
    return null != this.userCollection.get(this.get("created_by"))
  };
  a.prototype.fetchCreatedBy = function(a) {
    return this.userCollection.fetchById(this.get("created_by"), a)
  };
  a.prototype.getCreatedBy = function() {
    return this.userCollection.get(this.get("created_by"))
  };
  a.prototype.createdBy = function(a) {
    return this.has("created_by") ? this.userCollection.getById(this.get("created_by"), a) : a(null)
  };
  a.prototype.urlRoot = "/api/v1/trips";
  a.prototype.idAttribute = "_id";
  a.prototype.defaults = {
    name: null,
    description: null,
    use_highways: !0,
    created_by: null,
    waypoints: [],
    legs: [],
    encoded_polyline: null,
    distance: null,
    time: null,
    cost: null
  };
  a.prototype.initialize = function() {
    _.bindAll(this);
    return this.on("change:distance change:fuel_type change:fuel_economy", this._calcCost, this)
  };
  a.prototype.hashedSharedUrl = function() {
    if (this.has("share_url")) return this.get("share_url").replace("/trips", "#trips")
  };
  a.prototype._calcCost = function() {
    var a, b, c;
    a = rt.helpers.settings.fuelType(this.get("fuel_type"));
    c = a === rt.helpers.settings.FUEL_TYPE_GASOLINE ? rt.helpers.settings.GAS_PRICE_PER_GALLON : a === rt.helpers.settings.FUEL_TYPE_DIESEL ? rt.helpers.settings.DIESEL_PRICE_PER_GALLON : rt.helpers.settings.GAS_PRICE_PER_GALLON;
    b = rt.helpers.settings.fuelEconomy(this.get("fuel_economy"));
    a = this.get("distance");
    a = rt.helpers.conversions.metersToKilometers(a);
    a = rt.helpers.conversions.kilometersToMiles(a);
    a = Math.round(a / b * c);
    return this.set("cost", a)
  };
  a.prototype._autosaveable = function() {
    return this.has("created_by") ? rt.app.currentUser.has("user") ? rt.app.currentUser.get("user").id === this.get("created_by") : !1 : !0
  };
  e.Trip = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this.allowAdd = b(this.allowAdd, this);
      this.notBlankVertexCount = b(this.notBlankVertexCount, this);
      this.removeBlanks = b(this.removeBlanks, this);
      this.normalize = b(this.normalize, this);
      this.addVertexAtEdge = b(this.addVertexAtEdge, this);
      this.addVertex = b(this.addVertex, this);
      this.vertexModel = rt.models.Waypoint;
      this.edgeModel = rt.models.Leg;
      this.sessionFacade = rt.app.facades.sessionFacade;
      a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = rt.models.Path,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.WAYPOINT_MAX = 25;
  a.prototype.NO_LOGIN_WAYPOINT_MAX = 4;
  a.prototype.addVertex = function(b, c) {
    if (this.allowAdd()) return a.__super__.addVertex.call(this, b, c)
  };
  a.prototype.addVertexAtEdge = function(b, c) {
    if (this.allowAdd()) return a.__super__.addVertexAtEdge.call(this, b, c)
  };
  a.prototype.normalize = function() {
    var a, b, c = this;
    b = _(this.vertices).filter(function(a) {
      return a.has("location")
    });
    a = _(this.vertices).filter(function(a) {
      return !a.has("location")
    });
    if (2 <= b.length) return _(a).each(function(a) {
      return c.removeVertex(a)
    });
    for (b = []; 2 < this.vertexCount();) a = _(this.vertices).find(function(a) {
      return !a.has("location")
    }), b.push(this.removeVertex(a));
    return b
  };
  a.prototype.removeBlanks = function() {
    var a, b = this;
    a = _(this.vertices).filter(function(a) {
      return !a.has("location")
    });
    return _(a).each(function(a) {
      return b.removeVertex(a)
    })
  };
  a.prototype.notBlankVertexCount = function() {
    return _(this.vertices).filter(function(a) {
      return a.notBlank() && a.hasLocation()
    }).length
  };
  a.prototype.allowAdd = function() {
    var a;
    a = this.vertexCount();
    if (!this.sessionFacade.loggedIn() && a >= this.NO_LOGIN_WAYPOINT_MAX) return rt.app.events.trigger("notify:generic", {
      message: "Login to add more than " + this.NO_LOGIN_WAYPOINT_MAX + " waypoints!"
    }), !1;
    if (a >= this.WAYPOINT_MAX) return rt.app.events.trigger("notify:trip:waypoint_limit"), !1;
    rt.app.events.trigger("analytics:trip:add_waypoint");
    return !0
  };
  e.TripPath = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.models,
    a = function() {
      this.updateCost = b(this.updateCost, this);
      this.updateDuration = b(this.updateDuration, this);
      this.updateDistance = b(this.updateDistance, this);
      this.tripDirectionsChanged = b(this.tripDirectionsChanged, this);
      this.activeDirectionsChanged = b(this.activeDirectionsChanged, this);
      this.activeTripChanged = b(this.activeTripChanged, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this,
      arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.defaults = {
    duration: "0:00",
    distance: "0mi",
    cost: "$0"
  };
  a.prototype.initialize = function(a, b) {
    var c;
    c = b.activeTrip;
    this.activeTripChanged(c, c.get("trip"));
    c.on("change:trip", this.activeTripChanged, this);
    this.activeDirectionsChanged(c, c.get("directions"));
    return c.on("change:directions", this.activeDirectionsChanged, this)
  };
  a.prototype.activeTripChanged = function(a, b) {
    null != this.trip && this.trip.off(null, null, this);
    this.trip = b;
    this.trip.on("change:fuel_type", this.updateCost, this);
    return this.trip.on("change:fuel_economy", this.updateCost, this)
  };
  a.prototype.activeDirectionsChanged = function(a, b) {
    null != this.directions && this.directions.off(null, null, this);
    this.directions = b;
    this.tripDirectionsChanged();
    return this.directions.on("change:directions_result", this.tripDirectionsChanged, this)
  };
  a.prototype.tripDirectionsChanged = function() {
    this.updateDistance();
    this.updateDuration();
    return this.updateCost()
  };
  a.prototype.updateDistance = function() {
    var a;
    a = Math.round(6.21371192E-4 * this.directions.getDistance());
    return this.set({
      distance: "" + a + "mi"
    })
  };
  a.prototype.updateDuration = function() {
    var a, b;
    b = this.directions.getDuration();
    a = Math.floor(b / 3600);
    b = Math.round(b % 3600 / 60);
    return this.set({
      duration: "" + (0 >= a ? "0" : "" + a) + ":" + (0 >= b ? "00" : 10 <= b ? "" + b : "0" + b)
    })
  };
  a.prototype.updateCost = function() {
    var a, b, c;
    a = rt.helpers.settings.fuelType(this.trip.get("fuel_type"));
    b = a === rt.helpers.settings.FUEL_TYPE_GASOLINE ? 3.945 : a === rt.helpers.settings.FUEL_TYPE_DIESEL ? 4.084 : 3.945;
    c = rt.helpers.settings.fuelEconomy(this.trip.get("fuel_economy"));
    a = this.directions.getDistance();
    a = rt.helpers.conversions.metersToKilometers(a);
    a = rt.helpers.conversions.kilometersToMiles(a);
    a = Math.round(a / c * b);
    return this.set({
      cost: "$" + a
    })
  };
  e.TripStats = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
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
  e.prototype.urlRoot = "/api/v1/users";
  e.prototype.initialize = function() {};
  c.User = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
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
  e.prototype.urlRoot = "/api/v1/user_feedbacks";
  e.prototype.initialize = function() {
    return this.set({
      errors: []
    })
  };
  c.UserFeedback = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
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
  c.UserIdentity = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
      var a = this.fetch,
        b = this;
      this.fetch = function() {
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
  e.prototype.url = "/api/v1/users/poi_changes";
  e.prototype.model = rt.models.User;
  e.prototype.fetch = function(a) {
    return e.__super__.fetch.call(this, a)
  };
  c.PoiChangeUsersQuery = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.models,
    e = function() {
      var a = this.fetch,
        b = this;
      this.fetch = function() {
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
  e.prototype.url = "/api/v1/users/search";
  e.prototype.model = rt.models.User;
  e.prototype.fetch = function(a) {
    !a.data && this.has("search_text") && (a.data = {
      search_text: this.get("search_text")
    });
    return e.__super__.fetch.call(this, a)
  };
  c.UserSearch = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.collections,
    a = function() {
      this.modeChanged = b(this.modeChanged, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.url = "/api/v1/guides/featured";
  a.prototype.model = rt.models.User;
  a.prototype.initialize = function(a, b) {
    this.navMode = b.navMode;
    this.navMode.on("change:mode", this.modeChanged, this);
    return this.modeChanged(this.navMode)
  };
  a.prototype.modeChanged = function(a) {
    if ("guides" === a.get("mode")) return this.fetch()
  };
  e.FeaturedUsersCollection = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty;
  rt.collections || (rt.collections = {});
  var c = rt.collections,
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
  e.prototype.model = rt.models.Leg;
  c.LegsCollection = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.collections,
    a = function() {
      this._activeChanged = b(this._activeChanged, this);
      this._addIf = b(this._addIf, this);
      this.destroy = b(this.destroy, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function(a, b) {
    this.bucketListsCollection = b.bucketListsCollection;
    this.bucketListsCollection.each(this._addIf);
    this.bucketListsCollection.on("add", this._addIf, this);
    this.bucketListsCollection.on("remove", this.remove, this);
    return this.bucketListsCollection.on("change:active", this._activeChanged, this)
  };
  a.prototype.destroy = function() {
    return this.bucketListCollection.off(null, null, this)
  };
  a.prototype._addIf = function(a) {
    if (this._belongs(a)) return this.add(a)
  };
  a.prototype._activeChanged = function(a) {
    if (this._belongs(a)) {
      if (!this.contains(a)) return this.add(a)
    } else return this.remove(a)
  };
  a.prototype._belongs = function(a) {
    return a.get("active")
  };
  e.ActiveBucketListsCollection = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.collections,
    a = function() {
      this._updatePois = b(this._updatePois, this);
      this._fetch = b(this._fetch, this);
      this._bindTrip = b(this._bindTrip, this);
      this.destroy = b(this.destroy, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.model = rt.models.MapPoi;
  a.prototype.initialize = function(a, b) {
    this._fetch = _.debounce(this._fetch, 100);
    this.categoriesCollection = b.categoriesCollection;
    this.categoriesCollection.on("add remove change:active", this._fetch, this);
    this.categoriesCollection.on("remove", this._fetch, this);
    this.categoriesCollection.on("change:active", this._fetch, this);
    this.distanceSlider = b.distanceSlider;
    this.distanceSlider.on("change:distance", this._fetch, this);
    this.activeTrip = b.activeTrip;
    this.activeTrip.on("change:trip", this._bindTrip, this);
    this._bindTrip();
    this.poiRequester = new rt.helpers.ajax.FreshRequester;
    return this._fetch()
  };
  a.prototype.destroy = function() {
    return this.categoriesCollection.off(null, null, this)
  };
  a.prototype._bindTrip = function() {
    var a;
    null != (a = this.trip) && a.off(null, null, this);
    this.trip = this.activeTrip.get("trip");
    this.trip.on("change:encoded_polyline", this._fetch, this);
    return this._fetch()
  };
  a.prototype._fetch = function() {
    var a, b, c, d, f, e = this;
    c = {
      profile: "map",
      curated: !0
    };
    a = this.categoriesCollection.filter(function(a) {
      return a.get("active")
    });
    if (0 < a.length) return b = _(a).map(function(a) {
      return a.id
    }), c.categories = b, d = this.distanceSlider.get("distance"), b = this.trip.get("encoded_polyline"), d && b && (c.path_buffer = d, c.encoded_polyline = b), f = new Backbone.Model, b = function(a) {
      return f.fetch({
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(c),
        success: a,
        url: "/api/v1/pois/search"
      })
    }, this.poiRequester.request(b, function() {
      var b;
      b = new rt.collections.PoisCollection(f.get("response").results);
      return e._updatePois(b, a)
    });
    this.poiRequester.cancelPending();
    return this.reset([])
  };
  a.prototype._updatePois = function(a, b) {
    var c;
    c = _(b);
    a.each(function(a) {
      var b, d;
      d = _(a.get("categories"));
      b = c.reduce(function(a, b) {
        d.contains(b.id) && a.push(b.id);
        return a
      }, []);
      b = _.first(b);
      return a.set({
        categoryId: b
      })
    });
    return this.reset(a.models)
  };
  e.ActiveCategoriesPoisCollection = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.collections,
    a = function() {
      this._addModelIfPasses = b(this._addModelIfPasses, this);
      this._belongs = b(this._belongs, this);
      this._auditModel = b(this._auditModel, this);
      this._modelRemoved = b(this._modelRemoved, this);
      this._modelAdded = b(this._modelAdded, this);
      this._currentUserChanged = b(this._currentUserChanged, this);
      this.destroy = b(this.destroy, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.destroy = function() {
    return "undefined" !== typeof collection && null !== collection ? collection.off(null, null, this) : void 0
  };
  a.prototype.initialize = function() {
    var a;
    a = rt.app.collections.tripCollection;
    this.user = rt.app.currentUser.get("user");
    a.each(this._addModelIfPasses);
    rt.app.currentUser.bind("change:user", this._currentUserChanged, this);
    a.on("add", this._modelAdded);
    a.on("remove", this._modelRemoved);
    a.on("change:name", this._auditModel);
    return a.on("change:created_by", this._auditModel)
  };
  a.prototype._currentUserChanged = function(a, b) {
    var c;
    this.user = b;
    c = this.reject(this._belongs);
    return this.remove(c)
  };
  a.prototype._modelAdded = function(a) {
    return this._addModelIfPasses(a)
  };
  a.prototype._modelRemoved = function(a) {
    return this.remove(a)
  };
  a.prototype._auditModel = function(a) {
    var b, c;
    c = this.contains(a);
    b = this._belongs(a);
    if (c) {
      if (!b) return this.remove(a)
    } else if (b) return this.add(a)
  };
  a.prototype._belongs = function(a) {
    var b;
    return null != a.get("name") && a.get("created_by") === (null != (b = this.user) ? b.get("id") : void 0)
  };
  a.prototype._addModelIfPasses = function(a) {
    if (this._belongs(a)) return this.add(a)
  };
  e.NamedTripCollection = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.collections,
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
  e.prototype.url = "/api/v1/poi-change-requests";
  e.prototype.model = rt.models.PoiChangeRequest;
  c.PoiChangeRequestsCollection = e
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.collections).search || (b.search = {});
  b = rt.collections.search;
  var a = function() {
    this._findPreviousIndex = c(this._findPreviousIndex, this);
    this._findNextIndex = c(this._findNextIndex, this);
    this._selectSuccessor = c(this._selectSuccessor, this);
    this._selectIndex = c(this._selectIndex, this);
    this.selectPrevious = c(this.selectPrevious, this);
    this.selectNext = c(this.selectNext, this);
    this.setSelected = c(this.setSelected,
    this);
    this.getSelected = c(this.getSelected, this);
    this.collectionReset = c(this.collectionReset, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.model = rt.models.search.AutocompleteItem;
  a.prototype.initialize = function() {
    this.selectedIndex = null;
    return this.on("reset", this.collectionReset,
    this)
  };
  a.prototype.collectionReset = function() {
    return this.selectedIndex = null
  };
  a.prototype.getSelected = function() {
    return 0 <= this.selectedIndex ? this.at(this.selectedIndex) : null
  };
  a.prototype.setSelected = function(a) {
    a = null != a ? this.indexOf(a) : null;
    return this._selectIndex(a)
  };
  a.prototype.selectNext = function() {
    return this._selectSuccessor(this._findNextIndex)
  };
  a.prototype.selectPrevious = function() {
    return this._selectSuccessor(this._findPreviousIndex)
  };
  a.prototype._selectIndex = function(a) {
    this.selectedIndex = a;
    return this.trigger("select", this.at(a))
  };
  a.prototype._selectSuccessor = function(a) {
    if (0 < this.size()) return a = a(this.selectedIndex), this._selectIndex(a)
  };
  a.prototype._findNextIndex = function(a) {
    null != a ? (a += 1, a >= this.size() && (a = null)) : a = 0;
    return a
  };
  a.prototype._findPreviousIndex = function(a) {
    null != a ? (a -= 1, 0 > a && (a = null)) : a = this.size() - 1;
    return a
  };
  b.AutocompleteItemCollection = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.collections,
    a = function() {
      this._addModelIfPasses = b(this._addModelIfPasses, this);
      this._belongs = b(this._belongs, this);
      this._modelIdChanged = b(this._modelIdChanged, this);
      this._modelNameChanged = b(this._modelNameChanged, this);
      this._modelRemoved = b(this._modelRemoved, this);
      this._modelAdded = b(this._modelAdded, this);
      this.destroy = b(this.destroy, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.destroy = function() {
    return collection.off(null, null, this)
  };
  a.prototype.initialize = function() {
    var a;
    a = rt.app.collections.tripCollection;
    a.each(this._addModelIfPasses);
    a.on("add", this._modelAdded);
    a.on("remove", this._modelRemoved);
    a.on("change:name", this._modelNameChanged);
    return a.on("change:_id", this._modelNameChanged)
  };
  a.prototype._modelAdded = function(a) {
    return this._addModelIfPasses(a)
  };
  a.prototype._modelRemoved = function(a) {
    return this.remove(a)
  };
  a.prototype._modelNameChanged = function(a) {
    var b, c;
    c = this.contains(a);
    b = this._belongs(a);
    if (c) {
      if (!b) return this.remove(a)
    } else if (b) return this.add(a)
  };
  a.prototype._modelIdChanged = function(a) {
    var b, c;
    c = this.contains(a);
    b = this._belongs(a);
    if (c) {
      if (!b) return this.remove(a)
    } else if (b) return this.add(a)
  };
  a.prototype._belongs = function(a) {
    return a.has("_id")
  };
  a.prototype._addModelIfPasses = function(a) {
    if (this._belongs(a)) return this.add(a)
  };
  e.TripHistoryCollection = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.collections,
    a = function() {
      this.getById = b(this.getById, this);
      this["new"] = b(this["new"], this);
      this.modeChanged = b(this.modeChanged, this);
      this.currentUserChanged = b(this.currentUserChanged, this);
      this.parse = b(this.parse, this);
      this.navMode = rt.app.models.navMode;
      this.session = rt.app.models.session;
      rt.app.currentUser.bind("change:user", this.currentUserChanged, this);
      a.__super__.constructor.apply(this, arguments)
    },
    d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.url = "/api/v1/trips";
  a.prototype.model = rt.models.Trip;
  a.prototype.initialize = function() {
//TODO    return "plan" === this.navMode.get("mode") ? this.fetch({
//      add: !0,
//      data: {
//        profile: "list"
//      }
//    }) : this.navMode.on("change:mode", this.modeChanged, this)
  };
  a.prototype.parse = function(a) {
    return _.isArray(a) ? a : [a]
  };
  a.prototype.currentUserChanged = function(a, b) {
    var c = this;
    null != b && this.map(function(a) {
      if (a.has("session_id") && a.get("session_id") === c.session.get("session_id")) return a.save()
    });
    return this.fetch({
      add: !0,
      data: {
        profile: "list"
      }
    })
  };
  a.prototype.modeChanged = function(a) {
    if ("my-stuff" === a.get("mode")) return this.fetch({
      add: !0,
      data: {
        profile: "list"
      }
    }), a.off(null, null, this)
  };
  a.prototype["new"] = function(a, b) {
    var c;
    c = new this.model(a, b);
    this.add(c, b);
    return c
  };
  a.prototype.getById = function(a, b) {
    var c, d, f, e = this;
    c = function(b) {
      return b.get("_id") === a
    };
    f = this.find(c);
    if (null != f) return b(f);
    d = this.url;
    this.url = "/api/v1/trips/" + a;
    this.fetch({
      add: !0,
      success: function() {
        f = e.find(c);
        return b(f)
      },
      error: function() {
        return b(null)
      }
    });
    return this.url = d
  };
  e.TripCollection = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.collections,
    a = function() {
      this.fetchById = b(this.fetchById, this);
      this.getByUsername = b(this.getByUsername, this);
      this["new"] = b(this["new"], this);
      this.parse = b(this.parse, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.url =
    "/api/v1/users";
  a.prototype.model = rt.models.User;
  a.prototype.parse = function(a) {
    return _.isArray(a) ? a : [a]
  };
  a.prototype["new"] = function(a, b) {
    var c;
    c = new this.model(a, b);
    this.add(c, b);
    return c
  };
  a.prototype.getByUsername = function(a, b) {
    var c, d, f, e = this;
    c = function(b) {
      return b.get("username") === a
    };
    f = this.find(c);
    if (null != f) return b(f);
    d = this.url;
    this.url = "/api/v1/guides/" + a;
    this.fetch({
      add: !0,
      success: function() {
        f = e.find(c);
        return b(f)
      },
      error: function() {
        return b(null)
      }
    });
    return this.url = d
  };
  a.prototype.fetchById = function(a, b) {
    var c, d = this;
    c = this.url;
    this.url = "/api/v1/users/" + a;
    this.fetch({
      add: !0,
      success: function() {
        var c;
        c = d.get(a);
        return b(c)
      },
      error: function() {
        return b(null)
      }
    });
    return this.url = c
  };
  e.UserCollection = a
}).call(this);
(function() {
  var b = {}.hasOwnProperty,
    c = rt.collections,
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
  e.prototype.model = rt.models.UserIdentity;
  e.prototype.url = "/api/v1/identities";
  e.prototype.initialize = function(a, b) {
    e.__super__.initialize.call(this, a, b);
    b.user && (this.user = b.user);
    return _.bindAll(this)
  };
  e.prototype.for_provider = function(a) {
    return this.find(function(b) {
      return b.get("provider") === a
    })
  };
  c.UserIdentitiesCollection = e
}).call(this);
(function() {
  var b = {}.hasOwnProperty;
  rt.collections || (rt.collections = {});
  var c = rt.collections,
    e = function() {
      var a = this.routableWaypoints,
        b = this;
      this.routableWaypoints = function() {
        return a.apply(b, arguments)
      };
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
  e.prototype.model = rt.models.Waypoint;
  e.prototype.routableWaypoints = function() {
    return this.filter(function(a) {
      return a.has("location")
    })
  };
  c.WaypointsCollection = e
}).call(this);
(function() {
  rt.facades || (rt.facades = {});
  var b = rt.facades,
    c = function() {};
  c.prototype.getEnvironment = function() {
    return window.rt_bootstrap.env
  };
  c.prototype.getBucketLists = function() {
    return window.rt_bootstrap.bucket_lists
  };
  c.prototype.bootstrapJson = function(b) {
    b = $("#" + b).text();
    return $.parseJSON(b)
  };
  b.BootstrapFacade = c
}).call(this);
(function() {
  rt.facades || (rt.facades = {});
  var b = rt.facades,
    c = function() {
      var b = this.scrollbarWidth,
        a = this;
      this.scrollbarWidth = function() {
        return b.apply(a, arguments)
      };
      this.theScrollbarWidth = this._calcScrollbarWidth()
    };
  c.prototype.scrollbarWidth = function() {
    return this.theScrollbarWidth
  };
  c.prototype._calcScrollbarWidth = function() {
    var b, a;
    b = document.createElement("div");
    b.style.width = "100px";
    b.style.height = "100px";
    b.style.overflow = "scroll";
    b.style.position = "absolute";
    b.style.top = "-9999px";
    document.body.appendChild(b);
    a = b.offsetWidth - b.clientWidth;
    document.body.removeChild(b);
    return a
  };
  c.prototype._calcScrollbarWidth_broken = function() {
    var b, a, c;
    b = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
    $("body").append(b);
    a = $("div", b).innerWidth();
    b.css("overflow-y", "scroll");
    c = $("div", b).innerWidth();
    $(b).remove();
    return a - c
  };
  b.BrowserSpecsFacade = c
}).call(this);
(function() {
  rt.facades || (rt.facades = {});
  var b = rt.facades,
    c = function() {
      var b;
      b = rt.app.facades.bootstrapFacade.getBucketLists();
      this.bucketLists = new rt.collections.BucketListsCollection(b)
    };
  c.prototype.getBucketLists = function() {
    return this.bucketLists
  };
  b.BucketListFacade = c
}).call(this);
(function() {
  rt.facades || (rt.facades = {});
  var b = rt.facades,
    c = function() {
      this.properties = rt.app.facades.bootstrapFacade.getEnvironment()
    };
  c.prototype.isProduction = function() {
    return "production" === this.properties.env
  };
  b.EnvironmentFacade = c
}).call(this);
(function() {
  rt.facades || (rt.facades = {});
  var b = rt.facades,
    c = function() {
      var b = this.isAdmin,
        a = this;
      this.isAdmin = function() {
        return b.apply(a, arguments)
      };
      this.currentUser = rt.app.currentUser.get("user")
    };
  c.prototype.isAdmin = function() {
    return null != this.currentUser && this.currentUser.get("admin")
  };
  b.PermissionsFacade = c
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  };
  rt.facades || (rt.facades = {});
  var c = rt.facades,
    e = function() {
      this.user = b(this.user, this);
      this.loggedIn = b(this.loggedIn, this)
    };
  e.prototype.loggedIn = function() {
    return null != rt.app.currentUser.get("user")
  };
  e.prototype.user = function() {
    return rt.app.currentUser.get("user")
  };
  c.SessionFacade = e
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/bucket_lists/menu"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a href="#" class="dropdown-toggle bucket-list-toggle ');
      this.bucketed && c.push("bucketed".ecoSafe ? "bucketed" : a("bucketed"));
      c.push('" data-toggle="dropdown">\n  <span class="action-name">Save</span>\n  <i class="icon-pushpin"></i>\n</a>\n<ul class="dropdown-menu">\n  <li class="bucket-list-menu-item-view"><a class="add-new-bucket-list">Create New Bucket List</a></li>\n</ul>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/bucket_lists/menu_item"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a href="#" class="');
      this.bucketed && c.push(e("bucketed"));
      c.push('" data-bucket-list-id="');
      c.push(e(this.bucketList.id));
      c.push('">\n  <i class="icon-ok"></i>\n  ');
      c.push(e(this.bucketList.name));
      c.push("\n</a>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/bucket_lists/menu_on_overlay"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a href="#" class="dropdown-toggle bucket-list-toggle ');
      this.bucketed && c.push("bucketed".ecoSafe ?
        "bucketed" : a("bucketed"));
      c.push('">\n  <i class="icon-pushpin"></i>SAVE\n</a>\n<ul class="dropdown-menu">\n  <li class="bucket-list-menu-item-view"><a class="add-new-bucket-list">Create New Bucket List</a></li>\n</ul>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/comments/comment"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="comment-item ');
      null != this.comment.author_guide && c.push(e("guided"));
      c.push('" data-id="');
      c.push(e(this.comment.id));
      c.push('">\n  <img class="author-avatar" src="');
      c.push(e(this.comment.author_avatar));
      c.push('" alt="');
      c.push(e(this.comment.author_name));
      c.push('">\n  <span class="author-name">');
      c.push(e(this.comment.author_name));
      c.push('</span>\n  <div class="comment-text">\n    ');
      c.push(e(this.comment.text));
      c.push("\n    ");
      this.editable && c.push('\n      <a href="#" class="edit-note"><i class="icon-pencil"></i></a>\n    ');
      c.push("\n  </div>\n  <a href='#'>&nbsp;</a>\n  ");
      rt.permissions.can("destroy_comment") && c.push("\n    <a href='#' class=\"delete-comment\">delete comment</a>\n  ");
      c.push("\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/comments/comment_list"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a class="add-comment">Leave a Note</a>\n<strong class="comments-title">Guide Notes</strong>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/comments/new"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h1>POST A NOTE</h1>\n<textarea name="comment-text" id="commentText" placeholder="Leave a useful note here for your fellow ???..">');
      null != this.description && c.push(this.description && this.description.ecoSafe ? this.description : "undefined" !== typeof this.description && null != this.description ? a(this.description) : "");
      c.push('</textarea>\n<button class="post-comment button">post</button>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/factual_places/factual_place"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a href="#" class="span4" style="">\n  <address>\n    <strong>');
      c.push(e(this.factual_place.name));
      c.push("</strong><br>\n    ");
      c.push(e(this.factual_place.address));
      c.push("<br>\n    ");
      c.push(e(this.factual_place.locality));
      c.push(", ");
      c.push(e(this.factual_place.region));
      c.push(" ");
      c.push(e(this.factual_place.postcode));
      c.push("<br>\n    ");
      c.push(e(this.factual_place.tel));
      c.push("\n  </address>\n</a>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/factual_places/index"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="factual-places-modal modal big">\n  <div class="modal-header">\n    <a class="close" data-dismiss="modal">\u00d7</a>\n    <h2>Is This The Place?</h2>\n  </div>\n\n  <div class="modal-body">\n    <div class="row-fluid">\n      <div class="span12">\n        <div class="alerts" style="display:none"></div>\n        <ul class="places-list"></ul>\n      </div>\n    </div>\n    <div class="row">\n      <div class="well offset1 span8">\n        <input style="float: right" type="button" class="btn warn not-listed" value="My place is not listed"/>\n      </div>\n    </div>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/image_upload/image_upload"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a;
      c.push('<div class="image');
      (null !== this.imageUrl && !this.imageChanged || null !== this.imageData) && c.push(" image-uploaded");
      c.push('">\n  <label for="image">Main photo</label>\n  <div class="add-button button">\n    <input type="file" id="image" name="image">\n  </div>\n  <div class="help-tip">\n    Drag new image to replace. <span>Or click here.</span>\n  </div>\n</div>\n\n');
      this.showAttribution && (c.push('\n  <div class="image-attribution">\n    <label for="image-attribution">Image Attribution</label>\n    <input type="text" id="image_attribution" name="image-attribution" value="'),
      c.push(e(this.model.get("image_attribution"))), c.push('">\n  </div>\n'));
      c.push("\n\n");
      if (null !== this.imageUrl && !this.imageChanged || null !== this.imageData) c.push('\n<div class="current-image">\n  <span class="image-preview"></span>\n  '), a = null !== this.imageData ? this.imageData.files[0].name : null, c.push("\n  "), a && (c.push("\n    "), c.push(e(a)), c.push("\n  ")), c.push('\n  \x3c!--\n    <button class="remove-button">\n      <i class="icon-trash"></i>\n      <span>Delete</span>\n    </button>\n  --\x3e\n</div>\n');
      c.push("\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/info/app_page"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="overlay get-the-app">\n  <div class="overlay-container">\n    <div class="body">\n      <div class="app-details">\n        <div class="app-header">\n          <a href="http://itunes.apple.com/app/???/id573012550?mt=8" class="app-store" target="_blank">Available on the App Store</a>\n        </div>\n        <div class="devices">\n          <h4>??? for iPhone is here!</h4>\n\n          <p>The companion app to take your trips on the road</p>\n        </div>\n        <div class="easier">\n          <div class="shadow"></div>\n          <div class="screens"></div>\n          <h4>Easier then ever.</h4>\n\n          <p>\n            No more printing off directions,<br>\n            no more hassle. Your entire trip<br>\n            is now in your pocket, complete<br>\n            with place listings and ready for<br>\n            turn-by-turn navigation.\n          </p>\n\n          <div class="shadow bottom"></div>\n        </div>\n        <div class="features">\n          <div class="col">\n            <i class="style"></i>\n            <h4>Striking style</h4>\n\n            <p>The same great design &amp;<br>ease of use you\u2019re used<br>to from ???</p>\n            <i class="sync"></i>\n            <h4>Instant sync</h4>\n\n            <p>Instantly syncs everything<br>you saved on the website<br>ready for the road</p>\n          </div>\n          <div class="iphone"></div>\n          <div class="col right">\n            <i class="turn"></i>\n            <h4>Turn-by-turn</h4>\n\n            <p>In one click, activate turn<br>-by-turn navigation to<br>any place or waypoint</p>\n            <i class="bucket"></i>\n            <h4>Bucket lists too!</h4>\n\n            <p>View all your saved places<br>on the map to see all your<br>favorites around you</p>\n          </div>\n        </div>\n        <div class="call-to-action">\n          <a href="http://itunes.apple.com/app/???/id573012550?mt=8" target="_blank">Download App</a>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/info/info_page"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="info-page overlay">\n  <div class="overlay-container">\n    <div class="overlay-header-bg">\n      <div class="header">\n        <div class="us-travel">\n          <img src="/assets/us_travel.png" width="138" height="49" alt="U.S. Travel Association Member">\n        </div>\n        <div class="title">\n          <span class="name">???</span>\n          <span class="share"></span>\n        </div>\n        <div class="subtitle">Fuel your adventure!</div>\n        ');
      c.push('\n        \x3c!--<div class="share dropdown">--\x3e\n          \x3c!--<a data-toggle="dropdown" href="#" class="dropdown-toggle">--\x3e\n            \x3c!--<span class="action-name">SHARE</span><i class="icon-share-trip"></i>--\x3e\n          \x3c!--</a>--\x3e\n          \x3c!--<ul class="dropdown-menu">--\x3e\n            \x3c!--<li><span class=\'st_facebook\' st_url="');
      c.push(e(this.url));
      c.push('" st_title="');
      c.push(e(this.shareTitle));
      c.push('" st_summary="');
      c.push(e(this.shareSummary));
      c.push('" st_image="/rt/trip_share_thumb.jpg"></span></li>--\x3e\n            \x3c!--<li><span class=\'st_twitter\' st_url="');
      c.push(e(this.url));
      c.push('" st_title="');
      c.push(e(this.shareTitle));
      c.push('" st_summary="');
      c.push(e(this.shareSummary));
      c.push('" st_via="???" st_image="/rt/trip_share_thumb.jpg"></span></li>--\x3e\n          \x3c!--</ul>--\x3e\n        \x3c!--</div>--\x3e\n        <ul class="tabs">\n          <li class="about"><a class="js-route" href="');
      c.push(e(rt.routes.about_path()));
      c.push('">About us</a></li>\n          <li class="team"><a class="js-route" href="');
      c.push(e(rt.routes.about_team_path()));
      c.push('">Team</a></li>\n          <li class="press-kit"><a class="js-route" href="');
      c.push(e(rt.routes.about_press_kit_path()));
      c.push('">Press</a></li>\n        </ul>\n      </div>\n    </div>\n\n      <div class="body">\n        <div class="tabpane about">\n          <p>\n            ??? is a simple and intuitive road trip planner that helps you discover, plan and book the best places and experiences along your way, curated by local experts and travel writers.\n          </p>\n          <p>\n            Eccentric roadside attractions, breathtaking natural wonders, or mouthwatering foodie feasts. Whatever your interests, you\u2019ll discover your America on ???.\n          </p>\n          <p>\n            We have been in the press a whole bunch lately, including:\n          </p>\n          <ul class="press">\n            <li><a href="http://techcrunch.com/2012/06/11/???-helps-you-plan-your-summer-road-trip-lands-250k-seed-round/" target="_blank"><img src="/assets/press/tech_crunch.png" alt="Tech Crunch"></a></li>\n            <li class="travel-leisure"><a href="http://www.travelandleisure.com/travel-blog/carry-on/2012/8/9/tech-thursday-road-trip-stopovers-made-easy" target="_blank"><img src="/assets/press/travel_leisure.png" alt="Travel+Leisure"></a></li>\n            <li><a href="http://mashable.com/2012/08/05/???/" target="_blank"><img src="/assets/press/mashable.png" alt="Mashable"></a></li>\n            <li class="netted"><a href="http://netted.net/2012/07/30/hit-stops/" target="_blank"><img src="/assets/press/netted.png" alt="Netted by the Webbys"></a></li>\n            <li class="fox-news"><a href="http://video.foxnews.com/v/1839097409001/tech-take-live-9-14-2012/" target="_blank"><img src="/assets/press/fox_news.png" alt="Fox News"></a></li>\n            <li class="life-hacker"><a href="http://lifehacker.com/5917612/thoroughly-plan-your-summer-road-trip-on-???" target="_blank"><img src="/assets/press/life_hacker.png" alt="Life Hacker"></a></li>\n            <li><a href="http://www.purewow.com/entry_detail/national/2934/A-new-way-to-plan-a-car-trip.htm" target="_blank"><img src="/assets/press/pure_wow.png" alt="Pure wow"></a></li>\n            <li class="thrillist"><a href="http://www.thrillist.com/travel/nation/???_guides_planning_websites" target="_blank"><img src="/assets/press/thrillist.png" alt="Thrillist"></a></li>\n          </ul>\n        </div>\n        <div class="tabpane team">\n          <ul class="team">\n            <li class="tp">\n              <div class="photo"></div>\n              <p>\n                <strong>\n                  <a href="mailto:tatiana@???.com">TATIANA PARENT</a>\n                  <a href="http://www.linkedin.com/profile/view?id=113250130&amp;locale=en_US&amp;trk=tyah" target="_blank"><i class="icon-linkedin-sign"></i></a>\n                </strong>\n                <br>\n                Press &amp; Community\n              </p>\n            </li>\n            <li class="jf">\n              <div class="photo"></div>\n              <p>\n                <strong>\n                  <a href="mailto:james@???.com">JAMES FISHER</a>\n                  <a href="http://www.linkedin.com/profile/view?id=44737535&amp;trk=tab_pro" target="_blank"><i class="icon-linkedin-sign"></i></a>\n                </strong>\n                <br>\n                Business &amp; Creative\n              </p>\n            </li>\n            <li class="jl">\n              <div class="photo"></div>\n              <p>\n                <strong>\n                  <a href="mailto:john@???.com">JOHN LAUCK</a>\n                  <a href="http://www.linkedin.com/profile/view?id=13172248&amp;locale=en_US&amp;trk=tyah" target="_blank"><i class="icon-linkedin-sign"></i></a>\n                </strong>\n                <br>\n                Lead Developer\n              </p>\n            </li>\n            <li class="af">\n              <div class="photo"></div>\n              <p>\n                <strong>\n                  <a href="mailto:andrew@???.com">ANDREW FICKAS</a>\n                  <a href="http://www.linkedin.com/profile/view?id=26007625&amp;locale=en_US&amp;trk=tyah" target="_blank"><i class="icon-linkedin-sign"></i></a>\n                </strong>\n                <br>\n                Software Engineer\n              </p>\n            </li>\n            <li class="bh">\n              <div class="photo"></div>\n              <p>\n                <strong>\n                  <a href="mailto:brandon@???.com">BRANDON HITE</a>\n                  <a href="http://www.linkedin.com/profile/view?id=74108648&amp;locale=en_US&amp;trk=tyah" target="_blank"><i class="icon-linkedin-sign"></i></a>\n                </strong>\n                <br>\n                Marketing &amp; Outreach\n              </p>\n            </li>\n            <li></li>\n          </ul>\n        </div>\n        <div class="tabpane social">\n          <p>(john has something to put here...)</p>\n        </div>\n        <div class="tabpane press-kit">\n          <p>Hello people of the press!</p>\n          <ul>\n            Download our press kit on the following link for:\n            <li>Assets</li>\n            <li>??? History</li>\n            <li>Company stats</li>\n            <li>Market information</li>\n          </ul>\n          <p><a href="https://dl.dropbox.com/u/128250/???_Press_Kit.pdf" target="_blank">DOWNLOAD</a></p>\n        </div>\n      </div>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/map/poi_info_window"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a;
      c.push('\n<div class="poi-info-window">\n');
      null != this.poi.name && (c.push("\n  "), null != (null != (a = this.poi.image) ? a.thumb_url : void 0) ? (c.push("\n  "), a = this.poi.image.thumb_url) : (c.push("\n  "), a = "/assets/poi-modal/feature/" + this.group + ".jpg"), c.push("\n  "), c.push('\n  <a href="'), c.push(e(this.poi.path)), c.push('" class="js-route">\n    <img class="poi-image" src="'), c.push(e(a)), c.push('">\n  </a>\n  <a href="'), c.push(e(this.poi.path)), c.push('" class="js-route">\n    <h1 class="title">'), c.push(this.poi.name), c.push("</h1>\n  </a>\n  <h2>"),
      c.push(this.poi.subtitle), c.push('</h2>\n  <ul class="actions">\n    <li>\n      <a href="#" class="add-to-trip">\n        <i class="icon-trip"></i> Add to Trip\n      </a>\n    </li>\n    <li>\n      <a href="'), c.push(e(this.poi.path)), c.push('" class="read-more js-route">\n        <i class="icon-info-sign"></i>Info\n      </a>\n    </li>\n  </ul>\n'), c.push("\n"));
      c.push("\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/my_stuff/my_stuff"] = function(b) {
    b || (b = {});
    var c = b.safe,
      e = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    e || (e = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {}).call(b);
    b.safe = c;
    b.escape = e;
    return ""
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/my_stuff/named_trips"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a, b, d, j;
      c.push('<h1>MY TRIPS</h1>\n\n<ul class="saved-trips">\n  ');
      j = this.trips;
      b = 0;
      for (d = j.length; b < d; b++) a = j[b], c.push('\n    <li class="trip '), this.activeTrip.id === a.id && c.push(e("active")), c.push('" data-id="'), c.push(e(a.id)), c.push('">\n      <a href="/trips/'), c.push(e(a.id)), c.push('?mode=my-stuff" target="_blank" class="show">\n        '), c.push(e(a.name)), c.push('\n      </a>\n      <a href="#" class="remove" title="Delete trip"><i class="icon-trash"></i></a>\n    </li>\n  ');
      c.push("\n</ul>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/my_stuff/saved_trip"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<span class="icon-"></span>\n<div class="trip">\n  ');
      c.push('\n  <a href="/trips/');
      c.push(this.trip._id && this.trip._id.ecoSafe ? this.trip._id : "undefined" !== typeof this.trip._id && null != this.trip._id ? a(this.trip._id) : "");
      c.push('?mode=my-stuff" target="_blank" class="show"></a>\n  <a href="#" class="remove" title="Delete trip"><i class="icon-trash"></i></a>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/my_stuff/saved_trips"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="group">\n  <a class="saved-trips-expand-collapse" href="#" data-toggle="collapse" data-target=".saved-trips-view .collapse.');
      c.push(e(this.index));
      c.push('">\n    <div class="placeholder">\n      <span class="icon"  ></span>\n    </div>\n    <span class="title">\n      ');
      c.push(e(this.title));
      c.push('\n    </span>\n  </a>\n</div>\n<div class="saved-trips-options collapse ');
      c.push(e(this.index));
      c.push('">\n  <ul class="saved-trips nav">\n  </ul>\n  <div class="none-placeholder">\n    <div>(none)</div>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/overlay/header"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="poi-editor-header">\n  <h2 class="title">');
      c.push(this.title && this.title.ecoSafe ? this.title :
        "undefined" !== typeof this.title && null != this.title ? a(this.title) : "");
      c.push('</h2>\n  <div class="message-view"></div>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/overlay/overlay_sidebar_action"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="overlay-sidebar-action-icon">\n  <i class="');
      c.push(e(this.fontAwesomeClass));
      c.push('"></i>\n</div>\n<div class="overlay-sidebar-action-label">\n  ');
      c.push(e(this.label));
      c.push("\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/poi_change_requests/poi_change_request"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a, b, d;
      c.push("<h1>Place Change Request</h1>\n");
      c.push("\n");
      c.push("\n");
      null != this.model.snapshot._id ? (c.push('\n<a class="place_link" href="'), c.push(e(rt.routes.place_id_path(this.model.snapshot._id))), c.push('" target="_blank">Open place page</a>\n')) : c.push('\n<span class="place_link">(Sorry, no link!)</span>\n');
      c.push('\n<div class="fields">\n  <div class="column1">\n    <div class="field name">\n      <div>Place Name</div>\n      <div>');
      c.push(this.model.snapshot.name);
      c.push('</div>\n    </div>\n    <div class="field address1">\n      <div>Street Address</div>\n      <div>');
      c.push(this.model.snapshot.address1);
      c.push('</div>\n    </div>\n    <div class="field city">\n      <div>City</div>\n      <div>');
      c.push(this.model.snapshot.city);
      c.push('</div>\n    </div>\n    <div class="field zip-code">\n      <div>Zip/ Postcode</div>\n      <div>');
      c.push(e(this.model.snapshot.zip_code));
      c.push('</div>\n    </div>\n    <div class="field country">\n      <div>Country</div>\n      <div>');
      c.push(e(this.model.snapshot.country));
      c.push('</div>\n    </div>\n    <div class="field state">\n      <div>State</div>\n      <div>');
      c.push(e(this.model.snapshot.state));
      c.push('</div>\n    </div>\n    <div class="field latitude">\n      <div>Latitude</div>\n      <div>');
      c.push(e(this.model.snapshot.latitude));
      c.push('</div>\n    </div>\n    <div class="field longitude">\n      <div>Longitude</div>\n      <div>');
      c.push(e(this.model.snapshot.longitude));
      c.push('</div>\n    </div>\n    <div class="field phone">\n      <div>Phone</div>\n      <div>');
      c.push(e(this.model.snapshot.phone));
      c.push('</div>\n    </div>\n    <div class="field email">\n      <div>Email</div>\n      <div>');
      c.push(this.model.snapshot.email);
      c.push('</div>\n    </div>\n    <div class="field images">\n      <div>Image</div>\n      ');
      _.isEmpty(this.model.image) ? c.push("\n      <div>(No image change)</div>\n      ") : (c.push('\n      <div><a href="'), c.push(e(null != (a = this.model.image) ? a.url : void 0)), c.push('" target="_blank">Image Link</a></div>\n      <img src="'), c.push(e(null != (b = this.model.image) ? b.thumb_url : void 0)), c.push('">\n      '));
      c.push('\n    </div>\n    <div class="field image-attribution">\n      <div>Attribution</div>\n      <div>');
      c.push(this.model.snapshot.image_attribution);
      c.push('</div>\n    </div>\n    <div class="field approved">\n      <div>Approved</div>\n      <div>');
      c.push(this.model.snapshot.approved ? "yes" : "no");
      c.push('</div>\n    </div>\n  </div>\n  <div class="column2">\n    <div class="field website">\n      <div>Website</div>\n      <div>');
      c.push(e(this.model.snapshot.website));
      c.push('</div>\n    </div>\n    <div class="field subtitle">\n      <div>Subtitle</div>\n      <div>');
      c.push(e(this.model.snapshot.subtitle));
      c.push('</div>\n    </div>\n    <div class="field user-rating">\n      <div>Base Rating</div>\n      <div>');
      this.model.snapshot.user_rating;
      c.push('</div>\n    </div>\n    <div class="field description">\n      <div>Description</div>\n      <div>');
      c.push(this.model.snapshot.description);
      c.push('</div>\n    </div>\n    <div class="field categories">\n      <div>Categories &amp; Tags</div>\n      <div>');
      c.push(e(null != (d = this.model.snapshot.categories) ? d.join(",") : void 0));
      c.push("</div>\n    </div>\n  </div>\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/poi_change_requests/poi_change_request_row"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push("<td>");
      c.push(e(this.model.change_type));
      c.push("</td>\n<td>");
      c.push(e(this.model.name));
      c.push("</td>\n<td>");
      c.push(e(this.model.created_by_username));
      c.push("</td>\n<td>");
      c.push(e(this.model.created_at));
      c.push("</td>\n<td>\n  ");
      this.model.change_type === rt.models.PoiChangeRequest.CHANGE_TYPE_UPDATE ? (c.push('\n    <a class="js-route" href="'), c.push(e(rt.routes.poi_change_request_path(this.model._id))), c.push('">Show Change</a>\n  ')) : c.push("\n    N/A\n  ");
      c.push("\n</td>\n<td>\n  ");
      c.push("\n  ");
      c.push("\n  ");
      null != this.model.poi_id ? (c.push('\n    <a class="place-link" href="'), c.push(e(rt.routes.place_id_path(this.model.poi_id))), c.push('" target="_blank">Show Place</a>\n  ')) : c.push("\n    (Sorry, no link!)\n  ");
      c.push("\n</td>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/poi_change_requests/poi_change_requests"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h1>Poi Change Requests</h1>\n\x3c!-- TODO: <button class="refresh-button">Refresh</button>--\x3e\n<table class="table table-striped table-bordered table-condensed">\n  <thead>\n    <tr>\n      <th>Change Type</th>\n      <th>Name</th>\n      <th>Submitted By</th>\n      <th>Created At</th>\n      <th>');
      c.push("</th>\n      <th>");
      c.push("</th>\n    </tr>\n  </thead>\n  <tbody>\n    ");
      c.push("\n  </tbody>\n</table>\n")
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/booking"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      this.loading ? c.push('\n  <p class="waiting">Retrieving booking information...</p>\n') : (c.push("\n  "), null != this.bookingLink ? (c.push("\n    <h1>BOOK NOW</h1>\n    <h2>through Expedia</h2>\n    "), null != this.lowRate && (c.push('\n      <p class="price">from <span>$'), c.push(e(Math.round(this.lowRate))), c.push("</span></p>\n    ")), c.push('\n    <a href="'), c.push(e(this.bookingLink)), c.push('" class="button action" target="_blank">CLICK TO BOOK</a>\n  ')) : (c.push('\n    <div class="no-booking">\n      <h2>Sorry!</h2>\n      '), null != this.phone && this.website ? c.push("\n        <p>We don't yet have a booking link for that place, but you might try the following phone number and website:</p>\n      ") : null != this.phone ? c.push("\n        <p>We don't yet have a booking link for that place, but you might try the following phone number:</p>\n      ") : null != this.website ? c.push("\n        <p>We don't yet have a booking link for that place, but you might try the following website:</p>\n      ") : c.push("\n        <p>We don't yet have a booking link for that place.</p>\n      "), c.push('\n      <div class="phone">'), c.push(e(rt.helpers.format.phone(this.phone))), c.push("</div>\n      "), null != this.website && (c.push('\n        <a href="'), c.push(e(rt.helpers.format.website(this.website))), c.push('" class="button action" target="_blank">VISIT WEBSITE</a>\n      ')), c.push("\n    </div>\n  ")), c.push("\n"));
      c.push("\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/edit"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h1>Edit poi</h1>\n\n<form id="edit-poi" name="poi">\n\n  <div class="field">\n    <label for="name"> name:</label>\n    <input type="text" name="name" id="name" value="');
      c.push(this.poi.name && this.poi.name.ecoSafe ? this.poi.name : "undefined" !== typeof this.poi.name && null != this.poi.name ? a(this.poi.name) : "");
      c.push('" >\n  </div>\n\n  <div class="actions">\n    <input type="submit" value="Update Poi" />\n  </div>\n\n</form>\n\n<a href="#/index">Back</a>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/form"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a, b, d, j;
      c.push('<form id="new-poi" name="poi">\n  <div class="row">\n    <div class="span7">\n      <fieldset>\n        <legend>Address &amp; Location</legend>\n        <div class="clearfix">\n          <div class="input">\n            <label for="name">Name:</label>\n            <input type="text" name="name" id="name" value="');
      c.push(e(this.poi.name));
      c.push('">\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="address1">Street Address:</label>\n            <input type="text" name="address1" id="address1" value="');
      c.push(e(this.poi.address1));
      c.push('">\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="city">City:</label>\n            <input type="text" name="city" id="city" value="');
      c.push(e(this.poi.city));
      c.push('">\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="state">State:</label>\n            <select name="state" id="state" class="span4" value="');
      c.push(e(this.poi.state));
      c.push('">\n              <option value="null" selected="selected">Select a state</option>\n              ');
      d = this.us_states;
      for (a in d) b = d[a], c.push('\n                <option value="'), c.push(e(a)), c.push('">'), c.push(e(b)),
      c.push("</option>\n              ");
      c.push('\n            </select>\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="zip_code">Zip Code:</label>\n            <input type="text" name="zip_code" id="zip_code" class="span2" value="');
      c.push(e(this.poi.zip_code));
      c.push('">\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="longitude, latitude">Longitude, Latitude:</label>\n            <input type="text" name="longitude" id="longitude" class="span2" value="');
      c.push(e(this.poi.longitude));
      c.push('">\n            <input type="text" name="latitude" id="latitude" class="span2" value="');
      c.push(e(this.poi.latitude));
      c.push('">\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <input type="text" name="factual_id" id="factual_id" class="span2" value="">\n          </div>\n        </div>\n\n      </fieldset>\n    </div>\n    <div class="span7">\n      <fieldset>\n        <legend>Place Details</legend>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="description">Description:</label>\n            <textarea class="" id="description" name="description" rows="3">');
      c.push(e(this.poi.description));
      c.push('</textarea>\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="phone">Phone Number:</label>\n            <input type="text" name="phone" id="phone" value="');
      c.push(e(this.poi.phone));
      c.push('">\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="website">Website:</label>\n            <input type="text" name="website" id="website" value="');
      c.push(e(this.poi.website));
      c.push('">\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input">\n            <label for="user_rating">Rating:</label>\n            <select name="user_rating" id="user_rating" class="span2" value="');
      c.push(e(this.poi.user_rating));
      c.push('">\n              <option value="" selected="selected">No Rating</option>\n              ');
      j = [1, 2, 3, 4, 5];
      b = 0;
      for (d = j.length; b < d; b++) a = j[b], c.push('\n                <option value="'), c.push(e(a)),
      c.push('">'), c.push(e(a)), c.push("</option>\n              ");
      c.push('\n            </select>\n          </div>\n        </div>\n\n        <div class="clearfix">\n          <div class="input ">\n            <ul class="categories-display unstyled"></ul>\n            <label for="categories_selector">Categories:</label>\n            <input type="text" name="categories_selector" id="categories_selector" class="span4" />\n            <select name="categories" id="categories" style="display: none" multiple="multiple">\n              ');
      j = this.categories;
      b = 0;
      for (d = j.length; b < d; b++) a = j[b], c.push('\n                <option value="'), c.push(e(a.value)), c.push('">'), c.push(e(a.label)), c.push("</option>\n              ");
      c.push('\n            </select>\n          </div>\n        </div>\n\n      </fieldset>\n    </div>\n  </div>\n  <div class="row">\n    <div class="well offset1 span12">\n      Click next to lookup and review this location\'s details.\n      <input style="float: right" type="button" class="btn info lookup" value="Next"/>\n    </div>\n  </div>\n</form>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/new"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a, b, d, j, n;
      c.push("<h1>");
      c.push(e(null != this.poi.id ? "EDIT" : "ADD"));
      c.push(' PLACE</h1>\n<div class="message-view"></div>\n<div class="body">\n  <form id="new-poi" name="poi">\n    <div id="input-container">\n      <fieldset class="edit-deets">\n        <div class="poi-objective-fields">\n          <div class="name">\n            <label for="name">Place Name</label>\n            <input type="text" id="name" name="name" value="');
      c.push(e(this.poi.name));
      c.push('">\n          </div>\n          <div class="address1">\n            <label for="address1">Street Address</label>\n            <input type="text" name="address1" id="address1" value="');
      c.push(e(this.poi.address1));
      c.push('">\n          </div>\n          <div class="double">\n            <div class="city">\n              <label for="city">City</label>\n              <input type="text" name="city" id="city" value="');
      c.push(e(this.poi.city));
      c.push('">\n            </div>\n            <div class="zip-code">\n              <label for="zip_code">Zip/ Postcode</label>\n              <input type="text" name="zip_code" id="zip_code" value="');
      c.push(e(this.poi.zip_code));
      c.push('">\n            </div>\n            <div class="country">\n              <label for="country">Country</label>\n              <div class="select">\n                <select name="country" id="country">\n                  ');
      n = this.countries;
      d = 0;
      for (j = n.length; d < j; d++) b = n[d], c.push("\n                    "), a = b === this.poi.country ? "selected" : "", c.push('\n                    <option value="'), c.push(e(b)), c.push('" '), c.push(e(a)), c.push(">"), c.push(e(b)), c.push("</option>\n                 ");
      c.push('\n                </select>\n              </div>\n            </div>\n            <div class="state">\n              <label for="state">State/Province</label>\n              <input id="state" name="state" type="text" value="');
      c.push(e(this.poi.state));
      c.push('">\n            </div>\n          </div>\n          ');
      rt.permissions.can("enter_latlng") && (c.push('\n          <div class="triplet">\n            <button class="js-geocode geocode button">Geocode</button>\n            <div class="latitude">\n              <label for="latitude">Latitude</label>\n              <input type="text" name="latitude" id="latitude" value="'), c.push(e(this.poi.latitude)), c.push('">\n            </div>\n            <div class="longitude">\n              <label for="longitude">Longitude</label>\n              <input type="text" name="longitude" id="longitude" value="'),
      c.push(e(this.poi.longitude)), c.push('">\n            </div>\n          </div>\n          '));
      c.push('\n          <div class="double">\n            <div class="phone">\n              <label for="phone">Phone</label>\n              <input type="text" name="phone" id="phone" value="');
      c.push(e(this.poi.phone));
      c.push('">\n            </div>\n            <div class="email">\n              <label for="email">Email</label>\n              <input type="text" name="email" id="email" value="');
      c.push(e(this.poi.email));
      c.push('">\n            </div>\n          </div>\n          <div class="images">\n            <div id="image_upload_view" class="upload-image"></div>\n          </div>\n          ');
      rt.permissions.can("approve_poi") && (c.push('\n          <div class="approved">\n            <input type="checkbox" name="approved" id="approved" checked="'), c.push(e(this.poi.approved ? "checked" : void 0)), c.push('" value="1">\n            <label for="approved">Approved</label>\n            <input type="hidden" name="approved" value="0">\n          </div>\n          '));
      c.push('\n        </div>\n        <div class="poi-subjective-fields">\n          <div class="fields-wrap">\n            <div class="medium">\n              <div class="website">\n                <label for="website">Website</label>\n                <input type="text" name="website" id="website" value="');
      c.push(e(this.poi.website));
      c.push('">\n                ');
      rt.helpers.string.notBlank(this.poi.website) && (c.push('\n                <a href="'), c.push(e(this.poi.website)), c.push('" target="_blank"></a>\n                '));
      c.push('\n              </div>\n              <div class="subtitle">\n                <label for="subtitle">Subtitle</label>\n                <input type="text" id="subtitle" name="subtitle" value="');
      c.push(e(this.poi.subtitle));
      c.push('">\n              </div>\n            </div>\n            <div class="mini">\n              <div class="look-up">\n                <label for="lookup">Lookup on</label>\n                <div class="links">\n                  <a class="wikipedia-link" href="http://en.wikipedia.org" target="_blank"><i></i></a>\n                  <a class="pinterest-link" href="http://google.com" target="_blank"><i class="icon-pinterest-sign"></i></a>\n                  <a class="google-link" href="http://google.com" target="_blank"><i class="icon-google-plus-sign"></i></a>\n                </div>\n              </div>\n              ');
      if (rt.permissions.can("enter_base_rating_poi")) {
        c.push('\n              <div class="user-rating">\n                <label for="user_rating">Rating</label>\n                <div class="select">\n                  <select name="user_rating" id="user_rating" value="');
        c.push(e(this.poi.user_rating));
        c.push('">\n                    <option value="">No Rating</option>\n                    ');
        n = [1, 2, 3, 4, 5];
        d = 0;
        for (j = n.length; d < j; d++) b = n[d], c.push("\n                      "), a = b === this.poi.user_rating ? "selected" :
          "", c.push('\n                      <option value="'), c.push(e(b)), c.push('" '), c.push(e(a)), c.push(">"), c.push(e(b)), c.push("</option>\n                    ");
        c.push("\n                  </select>\n                </div>\n              </div>\n              ")
      }
      c.push('\n            </div>\n          </div>\n          <div class="description">\n            <label for="description">Description</label>\n            <textarea id="description" name="description" rows="3">');
      c.push(e(this.poi.description));
      c.push('</textarea>\n          </div>\n          <div class="categories">\n            <label for="categories_selector">Categories &amp; Tags</label>\n            <div class="categories-field">\n              <ul class="categories-display unstyled"></ul>\n              <input type="text" name="categories_selector" id="categories_selector" placeholder="Type to choose a category">\n              <select name="categories" id="categories" style="display: none" multiple="multiple">\n              ');
      j = this.categories;
      b = 0;
      for (d = j.length; b < d; b++) a = j[b], c.push('\n                <option value="'), c.push(e(a.get("_id"))), c.push('">'), c.push(e(a.get("name"))), c.push("</option>\n              ");
      c.push('\n              </select>\n            </div>\n          </div>\n          <div class="poi-buttons">\n            ');
      c.push('\n            <button type="submit" class="save button action"><i class="icon-save-place"></i>Save</button>\n            ');
      c.push('\n          </div>\n        </div>\n      </fieldset>\n    </div>\n    <input type="hidden" name="factual_id" value=""/>\n  </form>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/place_search_result"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a class="edit-place-link js-route" href="');
      c.push(e(rt.routes.edit_place_path(this.model.id)));
      c.push('">\n  <i class="ico-tools"></i>EDIT\n</a>\n<div class="name">');
      c.push(e(this.model.name));
      c.push("</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/poi"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push("<td>");
      c.push(this.poi.name);
      c.push('</td>\n\n<td><a href="#/');
      c.push(e(this._id));
      c.push('">Show</td>\n<td><a href="#/');
      c.push(e(this._id));
      c.push('/edit">Edit</td>\n<td><a href="#/');
      c.push(e(this._id));
      c.push('/destroy" class="destroy">Destroy</a></td>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/show"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a, b, d, j, n;
      c.push('<div class="overlay-container">\n  <div class="header">\n    <div class="image">\n      ');
      null != (null != (b = this.poi.image) ? b.banner_url : void 0) ? (c.push("\n        "), b = this.poi.image.banner_url) : (c.push("\n        "), b = "/assets/poi-modal/feature/" + this.group + ".jpg");
      c.push("\n      ");
      c.push('\n      <img src="');
      c.push(e(b));
      c.push('" alt="');
      c.push(e(this.categoryName));
      c.push('">\n    </div>\n    <div class="poi-contacts">\n      <address>\n        ');
      null != this.poi.address1 && (c.push("\n          "), c.push(e(this.poi.address1)), c.push("<br>\n        "));
      c.push("\n        ");
      null != this.poi.address2 && (c.push("\n          "), c.push(e(this.poi.address2)), c.push("<br>\n        "));
      c.push("\n        ");
      c.push(e(this.poi.city));
      c.push(", ");
      c.push(e(this.poi.state));
      c.push(" ");
      c.push(e(this.poi.zip_code));
      c.push("<br>\n        ");
      null != this.poi.phone && (c.push('\n          <span class="tel">\n            '), c.push(e(this.poi.phone)), c.push("\n          </span><br>\n        "));
      c.push("\n        ");
      null != this.poi.website && (c.push('\n          <span class="url">\n            <a href="'), c.push(e(this.poi.website)),
      c.push('" title="Visit Website" target="_blank">Visit Website</a>\n          </span>\n        '));
      c.push('\n      </address>\n      <div class="poi-head">\n        <div class="title" title="');
      c.push(e(null != (a = this.poi.name) ? a.toUpperCase() : void 0));
      c.push('">\n          <i class="category ');
      c.push(e(this.group));
      c.push('"></i>\n          ');
      c.push(e(null != (d = this.poi.name) ? d.toUpperCase() : void 0));
      c.push("\n        </div>\n        ");
      null != this.poi.subtitle && (c.push('\n          <div class="subtitle" title="'),
      c.push(e(null != (j = this.poi.subtitle) ? j.toLowerCase() : void 0)), c.push('">'), c.push(e(null != (n = this.poi.subtitle) ? n.toLowerCase() : void 0)), c.push("</div>\n        "));
      c.push('\n      </div>\n    </div>\n    <ul class="actions">\n      <li class="add-to-trip action">\n        <a href="#"><i class="icon-trip"></i>ADD TO TRIP</a>\n      </li>\n      <li class="share dropdown action">\n        <a data-toggle="dropdown" href="#" class="dropdown-toggle">SHARE<i class="icon-share-trip"></i></a>\n        <ul class="dropdown-menu">\n          <li><span class=\'st_facebook\' st_url="');
      c.push(e(this.shareUrl));
      c.push('" st_title="');
      c.push(e(this.shareTitle));
      c.push('" st_summary="');
      c.push(e(this.shareSummary));
      c.push('" st_image="/rt/trip_share_thumb.jpg"></span></li>\n          <li><span class=\'st_twitter\' st_url="');
      c.push(e(this.url));
      c.push('" st_title="');
      c.push(e(this.shareTitle));
      c.push('" st_summary="');
      c.push(e(this.shareSummary));
      c.push('" st_via="???" st_image="/rt/trip_share_thumb.jpg"></span></li>\n        </ul>\n      </li>\n    </ul>\n  </div>\n  <div class="body">\n    ');
      this.bookable && c.push('\n    <a class="booking">BOOK NOW</a>\n    ');
      c.push("\n\n  ");
      if (this.poi.deals.length) {
        c.push('\n    <div class="deals-booking">\n      <a href="#" class="close-notification">X</a>\n      <strong class="title"><em class="deal-alert">HOT DEAL<span> ALERT</span>!!</em> Book<span> fast</span> before it expires!</strong>\n      <ul>\n      ');
        n = this.poi.deals;
        d = 0;
        for (j = n.length; d < j; d++) a = n[d], c.push("\n        <li>\n          "), null != a.image_url && (c.push('\n            <img src="'),
        c.push(e(a.image_url)), c.push('&geometry=pixel" class="deal-tracking"/>\n          ')), c.push("\n          "), c.push(e(a.title)), c.push('\n            - <a target="_blank" href="'), c.push(e(a.url)), c.push('">Book Now</a>\n        </li>\n      ');
        c.push("\n      </ul>\n    </div>\n  ")
      }
      c.push('\n    <div class="sidebar">\n      <div class="ratings">\n        <dl class="rating">\n          <a href="#" class="like">+</a>\n          <a href="#" class="dislike">-</a>\n          <dd>\n            ');
      null != this.poi.user_rating ? (c.push('\n              <div class="rated-'), c.push(e(this.poi.user_rating)), c.push('"></div>\n            ')) : c.push('\n              <div class="not-rated"></div>\n              <span>Not Rated</span>\n            ');
      c.push('\n          </dd>\n        </dl>\n      </div>\n      <div class="sponsors-block">\n        <span class="mark">Presented by:</span>\n        <div class="sponsored">\n          <a href="mailto:info@???.com?Subject=Category Sponsorship&amp;body=Dear ???,%0A%0ALet\'s talk sponsorship, baby!" target="_blank"><img src="/assets/show_places_view/sponsor_this.png" alt=""></a>\n        </div>\n      </div>\n    </div>\n    <div class="description">\n      <strong class="block-title">DESCRIPTION</strong>\n      <p>');
      c.push(this.poi.description);
      c.push("</p>\n    </div>\n  </div>\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/staff_pois"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        var b = c;
        c = [];
        a.call(this);
        a = c.join("");
        c = b;
        return d(a)
      }, a = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? h(a) : ""
      }, d, f = b.safe,
      h = b.escape;
    d = b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    h || (h = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g,
        "&quot;")
    });
    (function() {
      c.push('<ul class="nav nav-pills">\n  <a class="js-route" href="');
      c.push(a(rt.routes.staff_pois_path()));
      c.push('">All</a>\n  <a class="js-route" href="');
      c.push(a(rt.routes.staff_pois_path({
        needs_content_review: 1
      })));
      c.push('">Needs Review</a>\n  ');
      c.push(rt.helpers.templates.outputArray(this.import_batch_names, function(b) {
        return e(function() {
          c.push('\n    <a class="js-route" href="');
          c.push(a(rt.routes.staff_pois_path({
            import_batch_name: b
          })));
          return c.push('">#{batch_name}</a>\n  ')
        })
      }));
      c.push('\n  <a class="js-route" href="');
      c.push(a(rt.routes.staff_pois_path({
        imageless_batch: "Imageless"
      })));
      c.push('">Imageless</a>\n  <a class="js-route" href="');
      c.push(a(rt.routes.staff_pois_path({
        factual_dupes: 1
      })));
      c.push('">Factual Dupes</a>\n  <a class="js-route" href="');
      c.push(a(rt.routes.staff_pois_path({
        name_dupes: 1
      })));
      c.push('">Name Dupes</a>\n  <a class="js-route" href="');
      c.push(a(rt.routes.staff_pois_path({
        loc_dupes: 1
      })));
      c.push('">Location Dupes</a>\n</ul>\n<div class="messages"></div>\n<h3>List of Places</h3>\n<div id="pois-container" class="">\n  \x3c!-- TODO: <div class="well">--\x3e\n    \x3c!--');
      c.push('--\x3e\n    \x3c!--<div class="list-summary">');
      c.push('</div>--\x3e\n  \x3c!--</div>--\x3e\n  <table class="table table-striped table-bordered table-condensed">\n    <thead>\n      <tr>\n        <th>Name</th>\n        <th>City</th>\n        <th></th>\n      </tr>\n    </thead>\n    <tbody>\n      ');
      c.push(rt.helpers.templates.outputArray(this.model.pois, function(b) {
        return e(function() {
          c.push('\n        <tr class="user-');
          c.push(a(b.id));
          c.push('">\n          <td class="name">');
          c.push(a(b.name));
          c.push('</td>\n          <td class="city">');
          c.push(a(b.city));
          c.push('</td>\n          <td><a class="edit js-route" href="');
          c.push(a(rt.routes.edit_staff_poi_path(b.id)));
          return c.push('">Edit</a></td>\n        </tr>\n      ')
        })
      }));
      c.push('\n    </tbody>\n  </table>\n  \x3c!-- TODO: <div class="well">--\x3e\n    \x3c!--');
      c.push('--\x3e\n    \x3c!--<div class="list-summary">');
      c.push("</div>--\x3e\n  \x3c!--</div>--\x3e\n</div>\n\n")
    }).call(b);
    b.safe = f;
    b.escape = h;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/pois/suggest_place"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h1>SUGGEST INFO</h1>\n<p class="step-search"><strong>1. Search</strong> if the place is already in our system...<br><em>(if so, it may still need improvement)</em>\n</p>\n<div class="place-search">\n  <input class="place-search-text" type="text" value="');
      c.push(e(this.model.search_text));
      c.push('" placeholder="Enter Place Name">\n  <button class="place-search-button"><i class="ico-search"></i></button>\n</div>\n<p class="step-select"><strong>2. Select</strong> place to edit, or add new from scratch</p>\n<div class="results-container">\n  <div class="no-search-message">(Enter the name of a place above.)</div>\n  <div class="no-results-message">(No results.)</div>\n  <div class="loading-message">Searching...</div>\n  ');
      c.push('\n</div>\n<div class="results-footer">\n  ');
      "results-found" === this.model.search_state && (c.push("\n    "), 1 !== this.model.page && c.push('\n      <button class="js-previous-page load-previous-button">Prev</button>\n    '), c.push('\n    <span class="page">Page '), c.push(e(this.model.page)), c.push(" of "), c.push(e(this.model.pages)), c.push("</span>\n    "), this.model.page !== this.model.pages && c.push('\n      <button class="js-next-page load-next-button">Next</button>\n    '), c.push("\n  "));
      c.push('\n</div>\n<div class="new-place-link-container">\n  <a class="new-place-link js-route" href="');
      c.push(e(rt.routes.new_place_path({
        name: this.model.search_text
      })));
      c.push('">\n    Not listed, add place from scratch...\n  </a>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/session/login"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h1>SIGN IN</h1>\n<div class="alert alert-error" style="display:none"></div>\n<div class="social">\n  <div class="login-button facebook-auth"></div>\n</div>\n<div class="or"><span>or</span></div>\n<form action="/sessions" data-remote="true" id="new_session" method="post">\n  <input class="required" id="username_or_email" name="username_or_email" size="50" type="text" placeholder="USERNAME">\n  <input class="required" id="password" name="password" size="50" type="password" placeholder="PASSWORD">\n  <button class="button" name="commit" type="submit">GO</button>\n  ');
      c.push("\n  ");
      c.push("\n</form>\n")
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/side_nav/admin_side_nav"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a href="#" class="nav-item" data-mode="about-us">\n  <span class="name">\n    ABOUT US\n  </span>\n</a>\n');
      rt.permissions.can("create_poi") && c.push('\n  <a href="/staff" class="nav-item" id="admin-menu" data-mode="admin">\n    <span class="name">\n      ADMIN\n    </span>\n  </a>\n');
      c.push("\n")
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/sidebar/add_place_sidebar_item"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a class="add-place js-route" href="');
      c.push(e(rt.routes.suggest_place_path()));
      c.push('">\n  <span class="icon icon-plus-sign"></span>\n  <div class="title">Suggest Place</div>\n</a>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/sidebar/admin_sidebar"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('  <div class="sidebar-item-contents">\n    <ul class="one-line-nav">\n      ');
      rt.permissions.can("create_poi") && (c.push('\n      <li>\n        <a class="add-place js-route" href="'), c.push(e(rt.routes.new_place_path())), c.push('?mode=admin">Add Place</a>\n      </li>\n      '));
      c.push("\n      ");
      rt.permissions.can("view_staff") && (c.push('\n      \x3c!--<li>--\x3e\n        \x3c!--<a href="'), c.push('">Approval Queue</a>--\x3e\n      \x3c!--</li>--\x3e\n      '));
      c.push("\n      ");
      rt.permissions.can("view_staff") && (c.push('\n      <li>\n        <a class="js-route" href="'),
      c.push(e(rt.routes.staff_pois_path())), c.push('">Place Database</a>\n      </li>\n      '));
      c.push("\n      ");
      rt.permissions.can("view_staff") && (c.push('\n      <li>\n        <a class="js-route" href="'), c.push(e(rt.routes.staff_users_path({
        mode: "admin"
      }))), c.push('">User Database</a>\n      </li>\n      '));
      c.push("\n      ");
      rt.permissions.can("view_staff") && (c.push('\n      <li>\n        <a class="js-route" href="'), c.push(e(rt.routes.staff_root_path({
        mode: "admin"
      }))), c.push('">Dashboard</a>\n      </li>\n      '));
      c.push("\n      ");
      rt.permissions.can("view_staff") && (c.push('\n      <li>\n        <a class="js-route" href="'), c.push(e(rt.routes.poi_change_requests_path({
        mode: "admin",
        review_required: !0
      }))), c.push('">Place Change Requests</a>\n      </li>\n      '));
      c.push("\n      ");
      rt.permissions.can("view_staff") && (c.push('\n      <li>\n        <a class="js-route" href="'), c.push(e(rt.routes.place_changes_staff_users_path({
        mode: "admin"
      }))), c.push('">Place Changes Per User</a>\n      </li>\n      '));
      c.push("\n    </ul>\n  </div>\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/sidebar/bucket_list"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<span class="icon-"></span>\n<div class="bucket-list" data-bucket-list-id="');
      c.push(e(this.bucket_list.id));
      c.push('">\n  <a href="#" class="show">');
      c.push(e(this.bucket_list.name));
      c.push('</a>\n  <a href="#" class="remove" title="Delete bucket list"><i class="icon-trash"></i></a>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/sidebar/distance_slider"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div>\n  <div class="slider">\n      <div id="distanceSlider"></div>\n  </div>\n\n  <p>Distance <span>from route</span></p>\n  <ul>\n      <li class="m-10"><span>|</span>10mi</li>\n      <li class="m-20"><span>|</span>20mi</li>\n      <li class="m-30"><span>|</span>30mi</li>\n      <li class="m-40"><span>|</span>40mi</li>\n      <li class="m-all"><span>|</span>show all</li>\n  </ul>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/sidebar/guide"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a href="');
      c.push(e(this.guide_path));
      c.push('">\n  <img class="image" src="');
      c.push(e(this.user.image_thumb_url));
      c.push('" width="50" height="50">\n  <h3 class="display-name">');
      c.push(e(this.user.guide_name));
      c.push("</h3>\n</a>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/sidebar/new_bucket_list"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h1>NEW LIST</h1>\n<form class="action-details">\n  <fieldset>\n    <input type="text" name="bucket_list[name]" id="bucket_list_name" placeholder="Name the list...">\n    <textarea placeholder="Describe the list... (if you wishes)" name="bucket_list[description]" id="bucket_list_description"></textarea>\n    <button class="button" type="submit">CREATE BUCKET LIST</button>\n  </fieldset>\n</form>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/sidebar/route_actions"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<ul class="route_actions">\n  <li><a href="#">Print</a></li>\n  <li><a href="#">Share</a></li>\n  <li><a href="#" class="last-child">Save</a></li>\n</ul>\x3c!-- eo .route_actions --\x3e\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/staff_dashboard/staff_dashboard"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="row">\n  <div class="span12">\n    <img class="dashboard-r" alt="???" src="/assets/r.png">\n  </div>\n</div>\n<div class="row">\n  <div class="span12">\n    <div class="thumbnail-row">\n      <ul class="thumbnails">\n        <li class="span" style="width: 180px;">\n          <div class="thumbnail">\n            <div class="dashboard-group" id="group-management">\n              <h3>Management</h3>\n              <ul>\n                <li><a href="https://app.asana.com">Asana</a></li>\n                <li><a href="https://www.pivotaltracker.com/projects/405993">Pivotal Tracker</a></li>\n                <li><a href="http://staff.lemon.com/staff">Lemon</a></li>\n                <li><a href="https://us2.admin.mailchimp.com/">Mailchimp</a></li>\n                <li><a href="http://getsatisfaction.com/???">Get Satisfaction</a></li>\n                <li><a href="https://www.intercom.io/apps/p2v5mmaw/users">Intercom</a></li>\n              </ul>\n            </div>\n          </div>\n        </li>\n        <li class="span" style="width: 180px;">\n          <div class="thumbnail">\n            <div class="dashboard-group" id="group-tools">\n              <h3>Tools</h3>\n              <ul>\n                <li><a href="https://adwords.google.com/cm/CampaignMgmt?__u=8959801268&__c=9745900628#r.ONLINE&app=cm">Adwords</a></li>\n                <li><a href="http://www.stumbleupon.com">Stumble</a></li>\n                <li><a href="http://www.google.com/trends/">Google Trends</a></li>\n                <li><a href="http://fiverr.com/">Fiverr</a></li>\n                <li><a href="http://maps.google.com">Google Maps</a></li>\n                <li><a href="http://www.yelp.com">Yelp</a></li>\n              </ul>\n            </div>\n          </div>\n        </li>\n        <li class="span" style="width: 180px;">\n          <div class="thumbnail">\n            <div class="dashboard-group" id="group-social">\n              <h3>Social</h3>\n              <ul>\n                <li><a href="http://hootsuite.com/">Hootsuite</a></li>\n                <li><a href="http://klout.com/#/???">Klout</a></li>\n                <li><a href="http://www.twitter.com/???">Twitter</a></li>\n                <li><a href="http://www.facebook.com/???HQ">Facebook</a></li>\n                <li><a href="https://plus.google.com/101053635723793509573/posts">Google +</a></li>\n              </ul>\n            </div>\n          </div>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n<div class="row">\n  <div class="span12">\n    <div class="dashboard-search-row">\n      <form method="get" action="http://www.google.com/search" target="_blank">\n        <fieldset>\n        <div class="clearfix">\n          <div class="dashboard-search-container">\n            <input type="text" name="q" size="100" class="large dashboard-search-text" maxlength="255" value=""/>\n            <input type="submit" class="btn info dashboard-search-button" value="Google Search">\n          </div>\n         </div>\n        </fieldset>\n      </form>\n    </div>\n  </div>\n</div>\n<div class="row">\n  <div class="span12">\n    <div class="thumbnail-row">\n      <ul class="thumbnails">\n        <li class="span" style="width: 180px;">\n          <div class="thumbnail">\n            <div class="dashboard-group" id="group-photos">\n              <h3>Photos</h3>\n              <ul>\n                <li><a href="http://s1068.photobucket.com">Photobucket Archive</a></li>\n                <li><a href="http://www.flickr.com/photos/road_trippers/">Flickr</a></li>\n                <li><a href="http://www.???photoblog.com">Photoblog (Tumblr)</a></li>\n                <li><a href="http://www.tumblr.com/staff">Tumblr Dashboard</a></li>\n                <li><a href="http://www.pinterest.com/???">Pinterest</a></li>\n                <li><a href="http://dribbble.com/???">Dribbble</a></li>\n              </ul>\n            </div>\n          </div>\n        </li>\n        <li class="span" style="width: 180px;">\n          <div class="thumbnail">\n            <div class="dashboard-group" id="group-our-sites">\n              <h3>Our Sites</h3>\n              <ul>\n                <li><a href="https://???.com">???.com</a></li>\n                <li><a href="http://blog.???.com">Blog</a></li>\n                <li><a href="http://blog.???.com/wp-admin">Blog Admin</a></li>\n              </ul>\n            </div>\n          </div>\n        </li>\n        <li class="span" style="width: 180px;">\n          <div class="thumbnail">\n            <div class="dashboard-group" id="group-more">\n              <h3>More...</h3>\n              <ul>\n                <li><a href="http://www.crunchbase.com/company/???">Crunchbase</a></li>\n                <li><a href="/staff/taxonomy">Taxonomy</a></li>\n                <li><a href="http://www.???hub.com">Flavours.me</a></li>\n                <li><a href="http://about.me/???">About.me</a></li>\n                <li><a href="http://angel.co/???">Angellist</a></li>\n                <li><a href="http://www.linkedin.com/company/???">Linkedin</a></li>\n              </ul>\n            </div>\n          </div>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/support/support_page"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="support-page overlay">\n  <div class="scroll-content">\n    <div class="overlay-header-bg">\n      <div class="header">\n        <div class="alert" style="display: none;"></div>\n        <div class="left">\n          <h1 class="title">ASSISTANCE</h1>\n          <div class="subtitle">We are here to help!</div>\n        </div>\n        <ul class="tabs">\n          <li class="active"><a data-target="video-guide" href="#">VIDEO GUIDES</a></li>\n          <li><a data-target="faq" href="#">FAQ</a></li>\n          <li class="ask"><a data-target="ask-us" href="#">ASK US!</a></li>\n        </ul>\n      </div>\n    </div>\n    <div class="body">\n      <div class="tabpane active" id="video-guide">\n        <p>A few videos to help you get the most out of ???. Also, kittens.</p>\n        <dl>\n          <dd class="open">Getting Started on ???</dd>\n          <dt class="open"><iframe width="560" height="340" src="http://www.youtube.com/embed/Fg39vCViIZA?rel=0" frameborder="0" allowfullscreen></iframe></dt>\n          <dd>Finding Places on ???</dd>\n          <dt><iframe width="560" height="340" src="http://www.youtube.com/embed/LvEHiQAyuaI?rel=0" frameborder="0" allowfullscreen></iframe></dt>\n          <dd>Exploring Guides on ???</dd>\n          <dt><iframe width="560" height="340" src="http://www.youtube.com/embed/r2f1nhHHuM8?rel=0" frameborder="0" allowfullscreen></iframe></dt>\n          <dd>Kitty Video!!!</dd>\n          <dt><iframe width="560" height="340" src="http://www.youtube.com/embed/SXpgvsllTgs" frameborder="0" allowfullscreen></iframe></dt>\n        </dl>\n      </div>\n      <div class="tabpane" id="faq">\n        <p>General</p>\n        <dl>\n          <dd class="open">What is ????</dd>\n          <dt class="open">\n            <p>??? is a simple and intuitive road trip planner that helps you discover, plan and book the best places and experiences along your way, curated by local experts and travel writers.</p>\n            <p>Instead of using a set of tools and websites to plan a trip, find places to visit, book your stays, make reservations, create an itinerary, and feed the cat (okay, we can&#x27;t help with that), do it all on one beautiful, easy-to-use, and really quite awesome road trip planner - ???.</p>\n          </dt>\n          <dd>Is it free?</dd>\n          <dt>\n            <p>??? is 100% free. We have no plans to charge consumers for any aspect of the service.</p>\n          </dt>\n          <dd>No, really. Is it free?</dd>\n          <dt>\n            <p>We said 100%. What more percent could it be free?</p>\n          </dt>\n          <dd>Why should I sign up?</dd>\n          <dt>\n            <p>Non-registered users have limited abilities. Sign up to gain full access to all features and abilities.</p>\n          </dt>\n          <dd>I forgot my password. What do?</dd>\n          <dt>\n            <p><a href="/password_resets/new" target="_blank" class="forgot-pass-link">Reset your password.</a></p>\n          </dt>\n          <dd>Is ??? available outside the USA?</dd>\n          <dt>\n            <p>Not yet! We&#x27;ll be expanding to Australia and Canada soon, and to the rest of the world soon after that!</p>\n          </dt>\n        </dl>\n        <p>Plan Trip Mode</p>\n        <dl>\n          <dd>How do I start planning a trip?</dd>\n          <dt><iframe width="560" height="340" src="http://www.youtube.com/embed/Fg39vCViIZA?rel=0" frameborder="0" allowfullscreen></iframe></dt>\n          <dd>I put in a Start and Destination, now what?</dd>\n          <dt>\n            <p>Start finding places!</p>\n            <iframe width="560" height="340" src="http://www.youtube.com/embed/LvEHiQAyuaI?rel=0" frameborder="0" allowfullscreen></iframe></dt>\n          <dd>Can I customize my miles per gallon for my vehicle?</dd>\n          <dt>\n            <p>Yes. There&#x27;s a gear icon in the Plan Trip menu, next to the Highway/ Byways button. Click this to customize fuel calculation, and enter in your fuel type and fuel economy.</p>\n          </dt>\n          <dd>How do I print directions?</dd>\n          <dt>\n            <p>After a trip is created (at least two waypoints), the Trip Banner will appear above the Trip Stats. Click the name of the trip or the Itinerary button. The option to print your itinerary and directions will appear.</p>\n          </dt>\n          <dd>Why did the route/purple shade disappear?</dd>\n          <dt>\n            <p>This is most likely due to a place on your trip preventing us from calculating road travel directions. The two most common places are state and national parks, and islands.</p>\n            <p>In the case of a park, turn on the State &amp; National Parks category under Find Places and add the park from there. If the park doesn&#x27;t have a pin, add a waypoint of a road or place within the park to the trip. A place can be a visitors&#x27; lodge, welcome center, restaurant, gift shop, etc. Simply zoom in on the park to find one.</p>\n          </dt>\n          <dd>How do I changed the name of my Saved Trip?</dd>\n          <dt>\n            <p>Click Save, type in a new name, and save the trip again.</p>\n          </dt>\n          <dd>How do I start finding places?</dd>\n          <dt><iframe width="560" height="340" src="http://www.youtube.com/embed/LvEHiQAyuaI?rel=0" frameborder="0" allowfullscreen></iframe></dt>\n          <dd>There aren\'t many places along my route, what gives?</dd>\n          <dt>\n            <p>\n              We are adding places to our map everyday, so please check back to see if more have been added along your route. If you would like to know if there are a few places for a specific category, feel free to share your route with us at <a href="mailto:suggestions@???.com">suggestions@???.com</a> and what categories you&#x27;re looking for. We&#x27;ll do our best to add places along your route for that category and let you know!\n            </p>\n          </dt>\n          <dd>I found a really cool place, now what?</dd>\n          <dt>\n            <p>Add it to your trip with the &ldquo;Add to Trip&rdquo; button, click Save to see your Bucket Lists, and save it to them, and share the place to Facebook or Twitter.</p>\n          </dt>\n          <dd>Can I add a place that isn&#x27;t on the map?</dd>\n          <dt>\n            <p>Suggest it to us via email. Send it to <a href="mailto:suggestions@???.com">suggestions@???.com</a> with the subject &ldquo;Suggestions!&rdquo;. Include the name, city, and state of the place, as well as a short description that we may use.</p>\n          </dt>\n          <dd>Can I add a place that only I can see?</dd>\n          <dt>\n            <p>Not yet! We are working to allow users to add their own &ldquo;personal places&rdquo; such as friends&#x27; houses, family, any other places they might want to stop by while on the road.</p>\n          </dt>\n          <dd>A place has wrong information/is closed/has been shutdown. How do you fix that?</dd>\n          <dt>\n            <p>Shoot us an email at <a href="mailto:suggestions@???.com?Subject=Suggestions!">suggestions@???.com</a> with the subject &ldquo;Suggestions!&rdquo;. Include the link to the place and the updated information in the message. You can also leave a comment on the place with the updated information. We&#x27;ll fix it as soon as possible.</p>\n          </dt>\n          <dd>What are Bucket Lists, and how do I make them?</dd>\n          <dt>\n            <p>Bucket Lists are a way to create lists of places you want to visit or save for viewing later. Some examples of bucket lists include offbeat museums, Major League baseball stadiums, all Frank Lloyd Wright buildings, etc. Create one under Find Places &lt; Bucket Lists &lt; + Create New Bucket List.</p>\n          </dt>\n        </dl>\n        <p>Guides</p>\n        <dl>\n          <dd>What are Guides?</dd>\n          <dt>\n            <p>Guides are a way to display road trips &amp; bucket lists on a beautiful page that&#x27;s unique to you. Check out the Featured Guides under the Guides menu.</p>\n          </dt>\n          <dd>How do I use Guides?</dd>\n          <dt><iframe width="560" height="340" src="http://www.youtube.com/embed/r2f1nhHHuM8?rel=0" frameborder="0" allowfullscreen></iframe></dt>\n        </dl>\n      </div>\n      <div class="tabpane" id="ask-us">\n        <p>If you didn&#x27;t find the answer you were looking for in the Video Guides or FAQ pages, drop us a line below, and we&#x27;ll get back to you fast! :)</p>\n          <form id="contact-us" action="#" class="form-lined">\n          ');
      this.loggedIn || c.push(' \n            <div class="control-group string required">\n              <label class="required" for="name">Name</label>\n              <input type="text" class="string required" id="name" name="name">\n              <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n            </div>\n            <div class="control-group email required">\n              <label for="email" class="required">Email</label>\n              <input type="email" id="email" name="email">\n              <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n            </div>\n          ');
      c.push(' \n          <div class="control-group text required">\n            <label for="message">Message</label>\n            <textarea name="message" id="message" cols="30" rows="5"></textarea>\n            <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n          </div>\n          <button class="button" type="submit">SUBMIT</button>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/top_nav/user_menu_view"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      this.loggedIn ? (c.push('\n    <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n      <span class="user-name">'),
      c.push(e(this.currentUser.username)), c.push('</span>\n      <img src="'), c.push(e(this.currentUser.image_thumb_url)), c.push('" alt="'), c.push(e(this.currentUser.username)), c.push('" width="50" height="50">\n    </a>\n    <ul class="dropdown-menu" role="menu">\n      <li><a href="#settings/account" class="account">Profile / Settings</a></li>\n      <li><a href="/logout">Logout</a></li>\n    </ul>\n\n')) : (c.push('\n  <span class="session-actions">\n    <a class="login" href="'), c.push(e(rt.routes.login_path())),
      c.push('">Login</a>\n    <span class="sep">/</span>\n    <a class="register" href="'), c.push(e(rt.routes.register_path())), c.push('">Create an account</a>\n  </span>\n  <i class="icon-users"></i>\n'));
      c.push("\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/trip_planner/print"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="overlay print-overlay">\n  <div class="overlay-header">\n      <h2 style="" class="title unprintable">Driving Directions</h2>\n      <a href="#" class="print-page hide-text unprintable">Print</a>\n      <div class="message-view"></div>\n  </div>\n  <div class="overlay-body"></div>\n        <div class="driving-directions">\n          <div id="printableDrivingDirections" class="">\n                  <div style="" class="actions">\n                    <h2 class="print-only">Driving Directions</h2>\n                  </div>\n\n                  <div class="directions">\n                    ');
      c.push(this.directions);
      c.push("\n                  </div>\n          </div>\n        </div>\n  </div>\n</div>\n")
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/trips/trip_stats"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<p class="length2"><i class="icon-ruler"></i> <span class="value">');
      c.push(e(this.distance));
      c.push('</span></p>\n<p class="time"><i class="icon-time"></i> <span class="value">');
      c.push(e(this.time));
      c.push('</span></p>\n<p class="cost"><i class="gasoline"></i> <span class="value">');
      c.push(e(this.cost));
      c.push("</span></p>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/trips/trip_summary"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h1 class="trip-name">\n  <a class="itinerary-link js-route" href="');
      c.push(e(rt.routes.itinerary_path(this.tripId)));
      c.push('">\n    ');
      c.push(e(this.tripName));
      c.push('\n  </a>\n</h1>\n<div class="trip-flag-image"></div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/users/account_settings"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="overlay-container">\n  <div class="overlay-header-bg">\n    <div class="header">\n      <h2 class="title">');
      c.push(e(this.title));
      c.push('</h2>\n      <div class="message-view"></div>\n      <div class="alert" style="display:none"></div>\n      <ul class="tabs">\n        <li class="basics active"><a href="#" data-toggle="tabs" data-target="#basics">Basics</a></li>\n        <li><a href="#" data-toggle="tabs" data-target="#connections">CONNECTIONS</a></li>\n        ');
      rt.permissions.can("update_guide_settings") && c.push('\n          <li><a href="#" data-toggle="tabs" data-target="#guide">GUIDE PAGES</a></li>\n        ');
      c.push('\n      </ul>\n    </div>\n  </div>\n\n  <div class="body">\n    <form action="/users/');
      c.push(e(this.user.id));
      c.push('" class="form-lined" data-remote="true" method="put">\n      <div class="tabpane active" id="basics">\n        <fieldset>\n          <div class="control-group string required">\n            <label class="required" for="user_username">Username</label>\n            <input value="');
      c.push(e(this.user.username));
      c.push('" class="string required" id="user_username" name="[user]username" size="50" type="text">\n            <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n          </div>\n          <div class="control-group">\n            <label for="user_email">Email</label>\n            <input id="user_email" name="[user]email" size="50" type="text" value="');
      c.push(e(this.user.email));
      c.push('">\n            <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n          </div>\n          <div class="control-group checkbox">\n            ');
      this.user.subscribed ? c.push('\n              <input id="user_subscribed" name="[user]subscribed" size="50" type="checkbox" checked="checked">\n            ') : c.push('\n              <input id="user_subscribed" name="[user]subscribed" size="50" type="checkbox">\n            ');
      c.push('\n            <label for="user_subscribed">Keep me informed of ??? updates</label>\n          </div>\n          <div class="control-group password">\n            <label for="user_password">New Password</label>\n            <input class="password" id="user_password" name="[user]password" size="50" type="password" value="');
      c.push(e(this.user.password));
      c.push('">\n            <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n          </div>\n          <div class="control-group password password_confirmation">\n            <label for="user_password_confirmation">Confirm Password</label>\n            <input class="password_confirmation" id="user_password_confirmation" name="[user]password" size="50" type="password" value="');
      c.push(e(this.user.password_confirmation));
      c.push('">\n            <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n          </div>\n          <div class="control-group photos">\n            <label class="string control-label" for="image">User Photo</label>\n            <div id="user_image_upload_view" class="upload-image"></div>\n          </div>\n        </fieldset>\n      </div>\n      ');
      rt.permissions.can("update_guide_settings") && (c.push('\n      <div class="tabpane" id="guide">\n        <fieldset>\n            <div class="col">\n              <div class="control-group string required guide-url">\n                <label class="required" for="user_guidename">\n                  Guide Page Name\n                </label>\n                URL: ???.com/<input value="'), c.push(e(this.user.guide_name)), c.push('" class="string required" id="user_guide_name" name="[user]guide_name" size="50" type="text">\n                <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n              </div>\n              <div class="control-group string required">\n                <label class="required" for="user_guidename">\n                  Display Name\n                </label>\n                <input value="'),
      c.push(e(this.user.guide_title)), c.push('" class="string required" id="user_guide_title" name="[user]guide_title" size="50" type="text">\n                <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n              </div>\n\n              <div class="control-group string required">\n                <label for="user_tagline">\n                  Tagline\n                </label>\n                <input value="'), c.push(e(this.user.tagline)), c.push('" class="string" id="user_tagline" name="[user]tagline" size="50" type="text">\n                <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n              </div>\n              <div class="control-group string required">\n                <label for="user_website">\n                  Website\n                </label>\n                <input value="'),
      c.push(e(this.user.website)), c.push('" class="string" id="user_website" name="[user]website" size="50" type="text">\n                <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n              </div>\n            </div>\n            <div class="col">\n              <div class="control-group text required">\n                <label for="user_guide_description">\n                  Guide description\n                </label>\n                <textarea id="user_guide_description" class="string" name="[user]guide_description">'),
      c.push(e(this.user.guide_description)), c.push('</textarea>\n                <span class="add-on hide"><i class="icon-exclamation-sign"></i></span>\n              </div>\n              <div class="control-group photos">\n                <label class="string control-label" for="image">Banner Image</label>\n                <div id="banner_image_upload_view" class="upload-image"></div>\n              </div>              \n            </div>\n          </fieldset>\n      </div>\n      '));
      c.push('\n      <div class="tabpane" id="emails">\n        <div class="checkboxes">\n          <p>Choose what emails you would like to recieve</p>\n          <label for="notice1">\n            <input id="notice1" type="checkbox">Product updates (reccomended)\n          </label>\n          <label for="notice2">\n            <input id="notice2" type="checkbox">Deals on places in my trips\n            <br>and bucket lists\n          </label>\n          <label for="notice3">\n            <input id="notice3" type="checkbox">??? competitions\n          </label>\n        </div>\n      </div>\n      <div class="tabpane" id="connections"></div>\n      <fieldset>\n        <button class="button update" name="[user]commit" type="submit">\n          <i class="icon-download-alt"></i> Update\n        </button>\n      </fieldset>\n    </form>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/users/facebook_notification"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="fb-notification">\n  <a href="#" class="close-notification">X</a>\n  <a href="#" class="fb-connect"><i class="ico-fb"></i>Connect with Facebook</a>\n  <p>Connect with facebook to save this<br>place to your bucket list.</p>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/users/new"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="alert alert-error" style="display:none"></div>\n<div class="signup-way">\n  <h1>CREATE ACCOUNT</h1>\n  <h3>choose your weapon..</h3>\n  <div class="login-button facebook-auth"></div>\n  <a href="#with-mail" class="show-mail-signup button">EMAIL</a>\n</div>\n<div class="email-signup">\n  <h1>EMAIL SIGNUP</h1>\n  <form action="/users" data-remote="true" id="new_user" method="post">\n    <div class="control-group string required">\n      <input class="string required" id="user_username" name="user[username]" size="50" type="text" placeholder="CHOOSE A USERNAME">\n      <span class="error-indicator add-on hide"><i class="icon-exclamation-sign"></i></span>\n    </div>\n    <div class="control-group string required">\n      <input class="string required" id="user_email" name="user[email]" size="50" type="text" placeholder="YOUR EMAIL">\n      <span class="error-indicator add-on hide"><i class="icon-exclamation-sign"></i></span>\n    </div>\n    <div class="control-group password required">\n      <input class="password required" id="user_password" name="user[password]" size="50" type="password" placeholder="PASSWORD">\n      <span class="error-indicator add-on hide"><i class="icon-exclamation-sign"></i></span>\n    </div>\n    <div class="control-group password password_confirmation required">\n      <input class="password_confirmation required password" id="user_password_confirmation" name="user[password_confirmation]" size="50" type="password" placeholder="CONFIRM PASSWORD">\n      <span class="error-indicator add-on hide"><i class="icon-exclamation-sign"></i></span>\n    </div>\n    <div class="tos">\n      By creating an account I confirm that I have read and agree to the <a href="/tos" target="_blank">terms of service</a>.\n    </div>\n    <button class="button" name="user[create_account]" type="submit">Create Account</button>\n  </form>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/users/social_connections"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="col facebook">\n  <div class="settings connected">\n    <div class="checkboxes">\n      <a href="#" class="facebook connected">facebook</a>\n    </div>\n    <a href="#" class="disconnect">Disconnect Facebook</a>\n  </div>\n  <div class="settings not_connected">\n    <a href="#" class="connect facebook" rel="tooltip" data-delay="0" data-title="Connect" title="Connect">facebook</a>\n    <div class="checkboxes">\n      <span class="connection-status">Not connected</span>\n      ');
      this.errors && (this.errors.facebook && this.errors.facebook.provider_id) && c.push('\n        <span class="error">This account has already been taken.</span>\n      ');
      c.push("\n    </div>\n  </div>\n</div>\n")
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/users/staff_users"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        var b = c;
        c = [];
        a.call(this);
        a = c.join("");
        c = b;
        return d(a)
      }, a = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? h(a) : ""
      }, d, f = b.safe,
      h = b.escape;
    d = b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    h || (h = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g,
        "&quot;")
    });
    (function() {
      c.push('<h3> Users </h3>\n\n<input class="search-text" type="text" value="');
      c.push(a(this.userSearch.search_text));
      c.push('">\n<button class="search-button">Search</button>\n\n<table class="table table-striped table-bordered table-condensed">\n  <thead>\n    <tr>\n      <th>Username</th>\n      <th>Email</th>\n      <th>Admin</th>\n      <th>Featured</th>\n      <th>Created</th>\n      <th>Updated</th>\n      \x3c!--<th colspan="2">Actions</th>--\x3e\n    </tr>\n  </thead>\n  <tbody>\n    ');
      c.push(this.outputArray(this.userSearch.users, function(b) {
        return e(function() {
          var d, e;
          c.push('\n      <tr class="user-');
          c.push(a(b.id));
          c.push('">\n        <td class="username">');
          c.push(a(b.username));
          c.push('</td>\n        <td class="email">');
          c.push(a(b.email));
          c.push('</td>\n        <td class="admin">');
          c.push(a(null != (d = null != b.admin) ? d : {
            Yes: "No"
          }));
          c.push('</td>\n        <td class="featured">');
          c.push(a(null != (e = null != b.featured) ? e : {
            Yes: "No"
          }));
          c.push('</td>\n        <td class="created-at">');
          c.push(a(b.created_at));
          c.push('</td>\n        <td class="updated-at">');
          c.push(a(b.updated_at));
          c.push('</td>\n        \x3c!--<td><a href="');
          c.push(a(rt.routes.staff_user_path(b.id)));
          c.push('">Show</a></td>--\x3e\n        \x3c!--<td><a href="');
          c.push(a(rt.routes.edit_staff_user_path(b.id)));
          return c.push('">Edit</a></td>--\x3e\n      </tr>\n    ')
        })
      }));
      c.push('\n  </tbody>\n</table>\n\n<p><a href="');
      c.push(a(rt.routes.new_staff_user_path()));
      c.push(">New Admin/User</a></p>\n")
    }).call(b);
    b.safe = f;
    b.escape = h;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/users/users_poi_changes"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        var b = c;
        c = [];
        a.call(this);
        a = c.join("");
        c = b;
        return d(a)
      }, a = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? h(a) : ""
      }, d, f = b.safe,
      h = b.escape;
    d = b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    h || (h = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,
        "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<h3>Place Changes Per User</h3>\n\n<a class="js-route" href="');
      c.push(a(rt.routes.place_changes_staff_users_path()));
      c.push('"></a>\n\x3c!--<a class="js-route" href="');
      c.push(a);
      c.push('">Weekly</a>--\x3e\n\n<table class="table table-striped table-bordered table-condensed">\n  <thead>\n    <tr>\n      <th>Username</th>\n      <th>Email</th>\n      <th>Admin</th>\n      <th># Adds/Edits</th>\n      <th>Actions</th>\n    </tr>\n  </thead>\n  <tbody>\n    ');
      c.push(rt.helpers.templates.outputArray(this.model.users, function(b) {
        return e(function() {
          c.push('\n      <tr class="user-');
          c.push(a(b.id));
          c.push('">\n        <td class="username">');
          c.push(a(b.username));
          c.push('</td>\n        <td class="email">');
          c.push(a(b.email));
          c.push('</td>\n        <td class="role">');
          c.push(a(b.role));
          c.push('</td>\n        <td class="poi-change-count">');
          c.push(a(b.poi_change_count));
          c.push('</td>\n        <td><a class="js-route" href="');
          c.push(a(rt.routes.poi_change_requests_path({
            user_id: b.id
          })));
          return c.push('">Show</a></td>\n      </tr>\n    ')
        })
      }));
      c.push("\n  </tbody>\n</table>\n")
    }).call(b);
    b.safe = f;
    b.escape = h;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/welcome/welcome"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a class="close-modal"><i class="icon-close"></i></a>\n<a class="get-app" href="http://itunes.apple.com/" target="_blank">Available on the App Store</a>\n<div class="logo"></div>\n<a class="intro-video" href="#view-video">View intro video</a>\n<fieldset>\n  <input class="origin" type="text" placeholder="Leaving from">\n  <strong class="start-your-trip">START YOUR TRIP</strong>\n  <input class="destination" type="text" placeholder="Going to">\n</fieldset>\n<span class="or">or</span>\n<div class="signup">\n  <strong class="create-an-account">CREATE AN ACCOUNT</strong>\n  <div class="login-button facebook-auth" data-provider="facebook"></div>\n  <div class="create-account-container">\n    <a class="create-account js-route" href="/register">or with email</a>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty,
    a = [].slice;
  (b = rt.views).bucket_lists || (b.bucket_lists = {});
  b = rt.views.bucket_lists;
  var d = function() {
    this.render = c(this.render, this);
    this.clickRemove = c(this.clickRemove, this);
    this.updateStatus = c(this.updateStatus, this);
    this.showBucketListPois = c(this.showBucketListPois, this);
    this.hideBucketListPois = c(this.hideBucketListPois, this);
    this.setInactive = c(this.setInactive, this);
    this.setActive = c(this.setActive,
    this);
    this.clickBucketList = c(this.clickBucketList, this);
    return d.__super__.constructor.apply(this, arguments)
  }, f = d,
    h = Backbone.View,
    g = function() {
      this.constructor = f
    }, j;
  for (j in h) e.call(h, j) && (f[j] = h[j]);
  g.prototype = h.prototype;
  f.prototype = new g;
  f.__super__ = h.prototype;
  d.prototype.template = JST["templates/sidebar/bucket_list"];
  d.prototype.tagName = "li";
  d.prototype.className = "bucket-list-view";
  d.prototype.events = {
    "click .bucket-list .show": "clickBucketList",
    "click .bucket-list .remove": "clickRemove"
  };
  d.prototype.initialize = function() {
    _.bindAll(this);
    return this.model.bind("change:active", this.updateStatus)
  };
  d.prototype.clickBucketList = function(a) {
    a.preventDefault();
    this.$el.removeClass("delete");
    this.model.get("active") ? this.hideBucketListPois() : this.showBucketListPois();
    return this.model.toggleActiveState()
  };
  d.prototype.setActive = function() {
    return this.$el.addClass("active")
  };
  d.prototype.setInactive = function() {
    return this.$el.removeClass("active")
  };
  d.prototype.hideBucketListPois = function() {
    var b, c = this;
    b = this.model.collection.getActive();
    b = _.map(b, function(a) {
      if (a !== c.model) return a.poiIds()
    });
    b = _.uniq(_.flatten(_.compact(b)));
    b = _.without.apply(_, [this.model.poiIds()].concat(a.call(b)));
    return rt.app.events.trigger("removePoisById", b)
  };
  d.prototype.showBucketListPois = function() {
    return rt.app.events.trigger("addPoisById", this.model.poiIds())
  };
  d.prototype.updateStatus = function() {
    return this.model.get("active") ? this.setActive() : this.setInactive()
  };
  d.prototype.clickRemove = function(a) {
    var b = this;
    a.preventDefault();
    if (this.$el.hasClass("delete")) return this.hideBucketListPois(),
    this.model.destroy({
      success: function() {
        return rt.app.events.trigger("notify:bucket_list:deleted")
      }
    }), this.$el.fadeOut("normal", function() {
      return b.remove()
    });
    this.$el.addClass("delete");
    return rt.app.events.trigger("notify:generic", {
      message: "Are you sure you want to delete this Bucket List?  Click again to confirm."
    })
  };
  d.prototype.render = function() {
    this.$el.html(this.template({
      bucket_list: this.model.toJSON()
    }));
    this.updateStatus();
    return this
  };
  b.BucketListView = d
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).bucket_lists || (b.bucket_lists = {});
  b = rt.views.bucket_lists;
  var a = function() {
    this.addNewBucketListClicked = c(this.addNewBucketListClicked, this);
    this.toggleBucketed = c(this.toggleBucketed, this);
    this.renderMenuItem = c(this.renderMenuItem, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f,
  g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "bucket-lists-menu-view action save dropdown";
  a.prototype.tagName = "li";
  a.prototype.events = {
    "click .dropdown-menu .add-new-bucket-list": "addNewBucketListClicked"
  };
  a.prototype.initialize = function(a) {
    this.sessionFacade = rt.app.facades.sessionFacade;
    this.bucketListFacade = rt.app.facades.bucketListFacade;
    _.bindAll(this);
    this.collection = this.bucketListFacade.getBucketLists();
    this.poi = a.poi;
    this.template = null != a.templateName ? JST[a.templateName] : JST["templates/bucket_lists/menu"];
    this.bucketed = this.collection.anyHasPoi(this.poi);
    this.collection.on("toggle_bucketed", this.toggleBucketed);
    this.collection.on("reset", this.render, this);
    return this.collection.on("add", this.render, this)
  };
  a.prototype.render = function() {
    var a, b = this;
    this.$el.html(this.template({
      bucketed: this.bucketed
    }));
    a = this.$el.find(".bucket-list-toggle");
    a.data("tooltip", null);
    this.sessionFacade.loggedIn() ? (this.collection.each(function(a) {
      a.on("change:pois",
      b.toggleBucketed);
      return b.renderMenuItem(a)
    }), this.$(".bucket-list-toggle").dropdown()) : rt.helpers.app.isMobileScreen() || a.tooltip({
      title: "Log in to save to bucket lists!",
      trigger: "hover",
      placement: "bottom"
    });
    return this
  };
  a.prototype.renderMenuItem = function(a) {
    a = new rt.views.bucket_lists.MenuItemView({
      model: a,
      poi: this.poi
    });
    return this.$(".dropdown-menu li:last").after(a.render().el)
  };
  a.prototype.toggleBucketed = function() {
    return (this.bucketed = this.collection.anyHasPoi(this.poi)) ? this.$(".bucket-list-toggle").addClass("bucketed") : this.$(".bucket-list-toggle").removeClass("bucketed")
  };
  a.prototype.addNewBucketListClicked = function(a) {
    a.preventDefault();
    a.stopPropagation();
    return this.sessionFacade.loggedIn() ? rt.helpers.app.showNewBucketListModal() : rt.app.router.navigate("#login", {
      trigger: !0
    })
  };
  b.BucketListsMenuView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).bucket_lists || (b.bucket_lists = {});
  b = rt.views.bucket_lists;
  var a = function() {
    this.updateActiveChildrenState = c(this.updateActiveChildrenState, this);
    this.addNewBucketListClicked = c(this.addNewBucketListClicked, this);
    this.activateBucketLists = c(this.activateBucketLists, this);
    this.deactivateBucketLists = c(this.deactivateBucketLists, this);
    this.preventDefault = c(this.preventDefault, this);
    this.renderBucketList = c(this.renderBucketList, this);
    this.renderTooltips = c(this.renderTooltips, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#placesExplorer #bucketLists";
  a.prototype.events = {
    "click .all-off": "deactivateBucketLists",
    "click .all-on": "activateBucketLists",
    "click .add-new-bucket-list": "addNewBucketListClicked"
  };
  a.prototype.initialize = function(a) {
    var b = this;
    _.bindAll(this);
    this.bucketLists = null != a ? a.bucketLists : void 0;
    this.bucketLists.each(function(a) {
      return a.on("change:active", b.updateActiveChildrenState)
    });
    this.bucketLists.on("add", this.renderBucketList);
    this.bucketLists.on("reset", this.render);
    this.sessionFacade = rt.app.facades.sessionFacade;
    rt.app.events.bind("session:login", this.render);
    return rt.app.events.bind("session:logout", this.render)
  };
  a.prototype.render = function() {
    var a = this;
    this.bucketLists.each(function(b) {
      return a.renderBucketList(b)
    });
    rt.helpers.app.isMobileScreen() || this.renderTooltips();
    return this
  };
  a.prototype.renderTooltips = function() {
    var a;
    a = this.$el.find(".add-new-bucket-list, .all-off, .all-on");
    a.data("tooltip", null);
    if (!this.sessionFacade.loggedIn()) return a.tooltip({
      title: '<a href="#login">Log in</a> to use bucket lists!',
      trigger: "hover"
    })
  };
  a.prototype.renderBucketList = function(a) {
    var b;
    b = new rt.views.bucket_lists.BucketListView({
      model: a
    });
    a = this.$(".start-buckets").siblings(".bucket-list-view");
    return 0 < a.length ? a.last().after(b.render().el) : this.$(".start-buckets").after(b.render().el)
  };
  a.prototype.preventDefault = function(a) {
    return a.preventDefault()
  };
  a.prototype.deactivateBucketLists = function(a) {
    a.preventDefault();
    return this.sessionFacade.loggedIn() ? this.bucketLists.deactivateAll() : rt.app.router.navigate("#login", {
      trigger: !0
    })
  };
  a.prototype.activateBucketLists = function(a) {
    a.preventDefault();
    return this.sessionFacade.loggedIn() ? this.bucketLists.activateAll() : rt.app.router.navigate("#login", {
      trigger: !0
    })
  };
  a.prototype.addNewBucketListClicked = function(a) {
    a.preventDefault();
    return this.sessionFacade.loggedIn() ? rt.helpers.app.showNewBucketListModal() : rt.app.router.navigate("#login", {
      trigger: !0
    })
  };
  a.prototype.updateActiveChildrenState = function(a) {
    if (a.get("active")) return this.$(".group").addClass("active-children");
    if (0 === this.bucketLists.getActive().length) return this.$(".group").removeClass("active-children")
  };
  b.BucketListsView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).bucket_lists || (b.bucket_lists = {});
  b = rt.views.bucket_lists;
  var a = function() {
    this.toggleBucket = c(this.toggleBucket, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/bucket_lists/menu_item"];
  a.prototype.tagName = "li";
  a.prototype.className = "bucket-list-menu-item-view";
  a.prototype.events = {
    click: "toggleBucket"
  };
  a.prototype.initialize = function(a) {
    _.bindAll(this);
    this.poi = a.poi;
    return this.model.on("change", this.render, this)
  };
  a.prototype.render = function() {
    var a;
    a = {
      bucketed: this.model.hasPoi(this.poi),
      bucketList: this.model.toJSON()
    };
    this.$el.html(this.template(a));
    return this
  };
  a.prototype.toggleBucket = function(a) {
    a.preventDefault();
    if (this.model.hasPoi(this.poi)) return this.model.removePoi(this.poi);
    this.model.addPoi(this.poi);
    return 0 < this.$el.parents(".poi-info-window").length ? rt.app.events.trigger("analytics:bucket_list:added", {
      data: {
        via: "info-window"
      }
    }) : rt.app.events.trigger("analytics:bucket_list:added", {
      data: {
        via: "overlay"
      }
    })
  };
  b.MenuItemView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).comments || (b.comments = {});
  b = rt.views.comments;
  var a = function() {
    this.addCommentClicked = c(this.addCommentClicked, this);
    this.renderCommentUpdated = c(this.renderCommentUpdated, this);
    this.renderCommentsReseted = c(this.renderCommentsReseted, this);
    this.renderCommentRemoved = c(this.renderCommentRemoved, this);
    this.renderCommentAdded = c(this.renderCommentAdded, this);
    return a.__super__.constructor.apply(this,
    arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "comments";
  a.prototype.template = JST["templates/comments/comment"];
  a.prototype.events = {
    "click .add-comment": "addCommentClicked",
    "click .delete-comment": "deleteCommentClicked",
    "click .author-avatar, .author-name": "tryNavigateToGuide",
    "click .edit-note": "editCommentClicked"
  };
  a.prototype.initialize = function() {
    this.collection.on("add",
    this.renderCommentAdded, this);
    this.collection.on("remove", this.renderCommentRemoved, this);
    return this.collection.on("reset", this.renderCommentsReseted, this)
  };
  a.prototype.isEditable = function(a) {
    return rt.helpers.session.loggedIn() && rt.app.currentUser.get("user").get("id") === a.get("author_id")
  };
  a.prototype.render = function() {
    this.$el.html('<a class="add-comment">Leave a Note</a>      <strong class="comments-title block-title">Guide Notes</strong>      <div class="comments-list"></div>');
    this.collection.each(this.renderCommentAdded);
    return this
  };
  a.prototype.renderCommentAdded = function(a) {
    return this.$el.find(".comments-list").append(this.template({
      comment: a.toJSON(),
      editable: this.isEditable(a)
    }))
  };
  a.prototype.renderCommentRemoved = function(a) {
    return this.$el.find(".comments-list .comment-item[data-id=" + a.id + "]").remove()
  };
  a.prototype.renderCommentsReseted = function() {
    return this.$el.find(".comments-list").empty()
  };
  a.prototype.renderCommentUpdated = function(a) {
    return this.$el.find(".comment-item[data-id=" + a.id + "]").replaceWith(this.template({
      comment: a.toJSON(),
      editable: this.isEditable(a)
    }))
  };
  a.prototype.tryToFocusOnSelectedComment = function() {
    var a;
    if (location.search.match(/note=(\w*)/)) return a = location.search.match(/note=(\w*)/)[1], this.$el.find(".comment-item[data-id='" + a + "'] a").focus()
  };
  a.prototype.addCommentClicked = function(a) {
    a.preventDefault();
    if (rt.app.facades.sessionFacade.loggedIn()) return this.newCommentView || (this.newCommentView = new rt.views.comments.NewCommentView({
      collection: this.collection
    }), this.newCommentView.on("saved", rt.helpers.modal.close,
    this)), a = rt.helpers.modal.open({
      view: this.newCommentView
    }), a.on("backdrop-click", rt.helpers.modal.close);
    rt.app.events.trigger("notify:generic", {
      message: "You need to log in before you can post a comment."
    })
  };
  a.prototype.deleteCommentClicked = function(a) {
    a.preventDefault();
    return this.collection.destroyComment(this.getCommentId(a))
  };
  a.prototype.tryNavigateToGuide = function(a) {
    a.preventDefault();
    if (a = this.collection.get(this.getCommentId(a)).get("author_guide")) return rt.app.router.navigate(rt.routes.guide_path(a))
  };
  a.prototype.getCommentId = function(a) {
    return $(a.currentTarget).closest(".comment-item").data("id")
  };
  a.prototype.editCommentClicked = function(a) {
    var b;
    a.preventDefault();
    b = this.collection.get(this.getCommentId(a));
    if (null != b) return a = new rt.views.comments.NewCommentView({
      model: b
    }), a.on("saved", function() {
      this.renderCommentUpdated(b);
      return rt.helpers.modal.close()
    }, this), rt.helpers.modal.open({
      view: a
    })
  };
  b.CommentsListView = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).comments || (b.comments = {});
  b = rt.views.comments;
  var e = function() {
    var a = this.isEditMode,
      b = this;
    this.isEditMode = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["templates/comments/new"];
  e.prototype.className = "new-comment-view";
  e.prototype.events = {
    "click .button": "saveCommentClicked"
  };
  e.prototype.initialize = function(a) {
    return this.collection = a.collection
  };
  e.prototype.isEditMode = function() {
    return null != this.model
  };
  e.prototype.render = function() {
    var a;
    a = {};
    this.isEditMode() && (a.description = this.model.get("text"));
    this.$el.html(this.template(a));
    this.$("textarea").placeholder();
    this.delegateEvents();
    return this
  };
  e.prototype.saveCommentClicked = function() {
    var a, b = this;
    a = $.trim(this.$("#commentText").val());
    return (this.model || this.buildComment()).save({
      text: a
    }, {
      success: function(a) {
        b.$("#commentText").empty();
        b.isEditMode() || b.collection.add(a);
        return b.trigger("saved")
      }
    })
  };
  e.prototype.buildComment = function() {
    return this.collection.buildComment ? this.collection.buildComment() : new rt.models.Comment
  };
  b.NewCommentView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).factual || (b.factual = {});
  b = rt.views.factual;
  var a = function() {
    this.render = c(this.render, this);
    this.setLocation = c(this.setLocation, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/factual_places/factual_place"];
  a.prototype.tagName = "li";
  a.prototype.events = {
    click: "setLocation"
  };
  a.prototype.initialize = function() {
    this.poi = this.options.poi;
    this.parent = this.options.parent;
    return this
  };
  a.prototype.setLocation = function() {
    this.poi.set(this.model.toPoi());
    this.parent.close();
    return !1
  };
  a.prototype.render = function() {
    !0 === this.model.get("resolved") && this.$el.addClass("resolved");
    this.$el.attr("data-factual-id", this.model.get("factual_id"));
    this.$el.attr("data-cid", this.model.cid);
    this.$el.html(this.template({
      factual_place: this.model.toJSON()
    }));
    return this
  };
  b.FactualPlaceView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).factual || (b.factual = {});
  b = rt.views.factual;
  var a = function() {
    this.close = c(this.close, this);
    this.render = c(this.render, this);
    this.addOne = c(this.addOne, this);
    this.addAll = c(this.addAll, this);
    this.setUnresolved = c(this.setUnresolved, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/factual_places/index"];
  a.prototype.id = "factual-places-window";
  a.prototype.events = {
    "click .close": "close",
    "click .not-listed": "setUnresolved"
  };
  a.prototype.initialize = function() {
    this.poi = this.options.poi;
    return this
  };
  a.prototype.setUnresolved = function() {
    this.poi.set({
      unresolved: !0
    });
    return this.close()
  };
  a.prototype.addAll = function() {
    return this.collection.each(this.addOne)
  };
  a.prototype.addOne = function(a) {
    a = new rt.views.factual.FactualPlaceView({
      model: a,
      poi: this.poi,
      parent: this
    });
    return this.$(".places-list").append(a.render().el)
  };
  a.prototype.render = function() {
    this.$el.html(this.template({
      factual_places: this.collection.toJSON()
    }));
    this.addAll();
    return this
  };
  a.prototype.close = function() {
    this.collection.reset();
    this.remove();
    return !1
  };
  b.IndexView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).image_uploads || (b.image_uploads = {});
  b = rt.views;
  var a = function() {
    this.imageAttributionChanged = c(this.imageAttributionChanged, this);
    this.removeClicked = c(this.removeClicked, this);
    this.fileChosen = c(this.fileChosen, this);
    this.update = c(this.update, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/image_upload/image_upload"];
  a.prototype.imageUrl = null;
  a.prototype.imageChanged = !1;
  a.prototype.imageData = null;
  a.prototype.resourceUrl = null;
  a.prototype.showAttribution = !0;
  a.prototype.events = {
    "click .remove-button": "removeClicked"
  };
  a.prototype.initialize = function(a) {
    var b, c;
    this.model = a.model;
    this.imageUrl = null != (b = a.imageUrl) ? b : null;
    a.hideAttribution && (this.showAttribution = !1);
    this.resourceUrl = null != (c = a.resourceUrl) ? c : null;
    this.imageAttributeName = a.imageAttributeName;
    return this.$el.fileupload({
      add: this.fileChosen
    })
  };
  a.prototype.render = function() {
    var a, b;
    b = {
      imageUrl: this.imageUrl,
      imageChanged: this.imageChanged,
      imageData: this.imageData,
      model: this.model,
      showAttribution: this.showAttribution
    };
    a = this.$el;
    a.html(this.template(b));
    b = a.find("input[type=file]");
    this.$el.fileupload({
      fileInput: b
    });
    b = null !== this.imageData ? this.imageData.files[0] : null !== this.imageUrl && !this.imageChanged ? this.imageUrl : null;
    null !== b && window.loadImage(b, function(b) {
      return a.find(".image-preview").html(b)
    }, {
      maxWidth: 125,
      maxHeight: 125
    });
    return this
  };
  a.prototype.update = function(a, b, c) {
    return null !== this.imageData ? (this.$el.fileupload("option", {
      formData: {
        id: a
      },
      url: "" + this.resourceUrl + "/" + a + "/upload_" + this.imageAttributeName
    }), this.$el.fileupload("send", {
      files: this.imageData.files,
      fileInput: this.imageData.fileInput
    }).success(function() {
      return b()
    }).error(function() {
      return c()
    })) : this.imageChanged ? $.ajax("" + this.resourceUrl + "/" + a + "/remove_" + this.imageAttributeName, {
      type: "POST",
      data: {
        id: a
      },
      success: function() {
        return b()
      },
      error: function() {
        return c()
      }
    }) : b()
  };
  a.prototype.fileChosen = function(a, b) {
    this.imageChanged = !0;
    this.imageData = b;
    this.render();
    return this.trigger("fileChosen")
  };
  a.prototype.removeClicked = function(a) {
    a.stopPropagation();
    this.imageChanged = !0;
    this.imageData = null;
    return this.render()
  };
  a.prototype.imageAttributionChanged = function() {
    var a;
    a = this.$el.find("#image-attribute").val();
    return this.model.set("image_attribution", a)
  };
  b.ImageUploadView = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).info || (b.info = {});
  b = rt.views.info;
  var e = function() {
    var a = this.close,
      b = this;
    this.close = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["templates/info/app_page"];
  e.prototype.className = "app-page-view";
  e.prototype.initialize = function() {
    return rt.app.events.on("key:escape", this.close)
  };
  e.prototype.render = function() {
    var a;
    null != (a = this.sidebarView) && a.remove();
    this.sidebarView = null;
    this.$el.html(this.template());
    this.sidebarView = new rt.views.overlay.OverlaySidebarView;
    this.sidebarView.render();
    this.$(".get-the-app").prepend(this.sidebarView.el);
    return this
  };
  e.prototype.close = function() {
    var a;
    this.remove();
    return "back" === (null != (a = this.options) ? a.restoreState : void 0) ? window.history.back() : rt.app.router.navigate("/", {
      trigger: !1
    })
  };
  b.AppPageView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).info || (b.info = {});
  b = rt.views.info;
  var a = function() {
    this._showTab = c(this._showTab, this);
    this.showTeamTab = c(this.showTeamTab, this);
    this.showPressKitTab = c(this.showPressKitTab, this);
    this.showAboutTab = c(this.showAboutTab, this);
    this.close = c(this.close, this);
    this.changeTab = c(this.changeTab, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.isInfoPageView = !0;
  a.prototype.template = JST["templates/info/info_page"];
  a.prototype.className = "info-pages-view";
  a.prototype.initialize = function() {
    return rt.app.events.on("key:escape", this.close)
  };
  a.prototype.render = function() {
    var a;
    null != (a = this.sidebarView) && a.remove();
    this.sidebarView = null;
    this.$el.html(this.template());
    this.sidebarView = new rt.views.overlay.OverlaySidebarView;
    this.sidebarView.render();
    this.$(".info-page").prepend(this.sidebarView.el);
    return this
  };
  a.prototype.changeTab = function(a) {
    a.preventDefault();
    this.$(".active").removeClass("active");
    $(a.currentTarget).parent().addClass("active");
    this.$(".tabpane.active").removeClass("active");
    a = $(a.currentTarget).attr("data-target");
    return this.$("#" + a).addClass("active")
  };
  a.prototype.close = function() {
    var a;
    this.remove();
    return "back" === (null != (a = this.options) ? a.restoreState : void 0) ? window.history.back() : rt.app.router.navigate("/", {
      trigger: !1
    })
  };
  a.prototype.showAboutTab = function() {
    return this._showTab("about")
  };
  a.prototype.showPressKitTab = function() {
    return this._showTab("press-kit")
  };
  a.prototype.showTeamTab = function() {
    return this._showTab("team")
  };
  a.prototype._showTab = function(a) {
    this.$(".active").removeClass("active");
    return this.$("." + a).addClass("active")
  };
  b.InfoPageView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this.unsetInfoWindow = c(this.unsetInfoWindow, this);
    this.closeInfoWindow = c(this.closeInfoWindow, this);
    this._icon = c(this._icon, this);
    this._ensureFullPoi = c(this._ensureFullPoi, this);
    this.bucketListChanged = c(this.bucketListChanged, this);
    this.locationChanged = c(this.locationChanged, this);
    this.markerClicked = c(this.markerClicked, this);
    this.hoverOff = c(this.hoverOff, this);
    this.hoverOn = c(this.hoverOn, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function() {
    this.model.on("change:location", this.locationChanged);
    this.model.on("change:bucketList", this.bucketListChanged);
    return this.map = rt.app.Map
  };
  a.prototype.render = function() {
    var a;
    null != this.marker && (this.marker.setMap(null), google.maps.event.clearInstanceListeners(this.marker), this.marker = null);
    a = this.model.mapLatLng();
    a = {
      icon: this._icon(),
      position: a,
      zIndex: 110,
      optimized: !0,
      shadow: rt.app.helpers.mapMarker.shadow(),
      draggable: !1,
      map: null != a ? this.map : null
    };
    "test" === rt.app.env && (a.title = this.model.id, a.optimized = !1);
    this.marker = new google.maps.Marker(a);
    google.maps.event.addListener(this.marker, "click", this.markerClicked);
    google.maps.event.addListener(this.marker,
      "mouseover", this.hoverOn);
    google.maps.event.addListener(this.marker, "mouseout", this.hoverOff);
    return this
  };
  a.prototype.remove = function() {
    this.marker.setMap(null);
    google.maps.event.clearInstanceListeners(this.marker);
    this.hoverOff();
    this.closeInfoWindow();
    return this
  };
  a.prototype.hoverOn = function() {
    if (null == this.infoWindow) return this._ensureFullPoi(), null != this.hoverWindow && (console.log("hover window not null upon mouseover event!"), this.hoverWindow.close(), this.hoverWindow = null), this.hoverWindow = new rt.views.map.PoiHoverWindowView({
      model: this.fullPoi,
      marker: this.marker
    }), this.hoverWindow.render()
  };
  a.prototype.hoverOff = function() {
    var a;
    null != (a = this.hoverWindow) && a.close();
    return this.hoverWindow = null
  };
  a.prototype.markerClicked = function() {
    var a;
    this._ensureFullPoi();
    null == this.infoWindow ? (null != (a = this.hoverWindow) && a.close(), this.infoWindow = new rt.views.map.PoiInfoWindowView({
      model: this.fullPoi,
      marker: this.marker
    }), this.infoWindow.render(), this.infoWindow.on("removed", this.unsetInfoWindow)) : rt.app.router.navigate(this.fullPoi.get("path"));
    return rt.app.events.trigger("marker:clicked", this.marker)
  };
  a.prototype.locationChanged = function() {
    var a;
    a = this.model.mapLatLng();
    null != a ? this.marker.setMap(this.map) : this.marker.setMap(null);
    return this.marker.setPosition(a)
  };
  a.prototype.bucketListChanged = function() {
    return this.marker.setIcon(this._icon())
  };
  a.prototype._ensureFullPoi = function() {
    if (null == this.fullPoi) return this.fullPoi = new rt.models.Poi({
      _id: this.model.id
    }), this.fullPoi.fetch()
  };
  a.prototype._icon = function() {
    var a;
    a = this.model;
    return a.get("bucketList") ? rt.app.helpers.mapMarker.forName("bucket_list") : a.has("categoryId") ? rt.app.helpers.mapMarker.forCategory(a.get("categoryId")) : rt.app.helpers.mapMarker.forCategory(_.first(a.get("categories")))
  };
  a.prototype.closeInfoWindow = function() {
    var a;
    null != (a = this.infoWindow) && a.close();
    return this.unsetInfoWindow()
  };
  a.prototype.unsetInfoWindow = function() {
    var a;
    null != (a = this.infoWindow) && a.off("removed");
    return this.infoWindow = null
  };
  b.BrowsePoiMarkerView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this._cleanup = c(this._cleanup, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function() {
    return this.model.on("change:pois",
    this.render, this)
  };
  a.prototype.render = function() {
    var a = this;
    this._cleanup();
    this.views = [];
    _(this.model.get("pois")).each(function(b) {
      b = new rt.models.Poi(b);
      b = new rt.views.map.BucketListPoiMarkerView({
        model: b
      });
      b.render();
      return a.views.push(b)
    });
    return this
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    this._cleanup();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._cleanup = function() {
    if (null != this.views) return _(this.views).each(function(a) {
      return a.remove()
    }), this.views = null
  };
  b.BucketListMapView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this._cleanup = c(this._cleanup, this);
    this._removeBucketListView = c(this._removeBucketListView, this);
    this._removeBucketList = c(this._removeBucketList, this);
    this._addBucketList = c(this._addBucketList, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function() {
    this.collection.on("add", this._addBucketList, this);
    return this.collection.on("remove", this._removeBucketList, this)
  };
  a.prototype.render = function() {
    this._cleanup();
    this.views = [];
    this.collection.each(this._addBucketList);
    return this
  };
  a.prototype.remove = function() {
    this._cleanup();
    this.collection.off(null, null, this);
    return a.__super__.remove.apply(this,
    arguments)
  };
  a.prototype._addBucketList = function(a) {
    var b;
    a = new rt.models.BucketList({
      id: a.id
    });
    b = new rt.views.map.BucketListMapView({
      model: a
    });
    this.views.push(b);
    return a.fetch({
      data: {
        profile: "detail"
      }
    })
  };
  a.prototype._removeBucketList = function(a) {
    var b, c;
    c = null;
    b = _(this.views).find(function(b, d) {
      c = d;
      return b.model.id === a.id
    });
    if (null != b) return this._removeBucketListView(b), this.views.splice(c, 1)
  };
  a.prototype._removeBucketListView = function(a) {
    return a.remove()
  };
  a.prototype._cleanup = function() {
    if (null != this.views) return _(this.views).each(this._removeBucketListView), this.views = null
  };
  b.BucketListsMapView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this._cleanup = c(this._cleanup, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function() {
    return this.collection.on("reset",
    this.render, this)
  };
  a.prototype.render = function() {
    var a = this;
    this._cleanup();
    this.markers = [];
    this.collection.each(function(b) {
      b = new rt.views.map.BrowsePoiMarkerView({
        model: b
      });
      b.render();
      return a.markers.push(b)
    });
    return this
  };
  a.prototype.remove = function() {
    this._cleanup();
    this.collection.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._cleanup = function() {
    if (null != this.markers) return _(this.markers).each(function(a) {
      return a.remove()
    }), this.markers = null
  };
  b.CategoriesPoisMapView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this._tripChanged = c(this._tripChanged, this);
    this._bindTrip = c(this._bindTrip, this);
    this.resizeGoogleMap = c(this.resizeGoogleMap, this);
    this.resizeShrink = c(this.resizeShrink, this);
    this.resizeGrow = c(this.resizeGrow, this);
    this.resize = c(this.resize, this);
    this.publishMapClickedEvent = c(this.publishMapClickedEvent, this);
    this.pathChanged = c(this.pathChanged,
    this);
    this.renderTripBackedViews = c(this.renderTripBackedViews, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#mapCanvas";
  a.prototype.initialize = function(a) {
    this.activeTrip = a.activeTrip;
    rt.app.events.on("map:resize", this.resize);
    this._bindTrip();
    return this.activeTrip.on("change:trip",
    this._tripChanged, this)
  };
  a.prototype.render = function() {
    var a;
    (new rt.views.map.TripView({
      model: this.activeTrip
    })).render();
    this.renderTripBackedViews();
    (new rt.views.map.PlacesSearchMarkersView({
      collection: new rt.collections.PoisCollection
    })).render();
    a = new rt.collections.ActiveCategoriesPoisCollection(null, {
      categoriesCollection: rt.context.categoriesCollection,
      activeTrip: rt.context.activeTrip,
      distanceSlider: rt.context.distanceSlider
    });
    (new rt.views.map.CategoriesPoisMapView({
      collection: a
    })).render();
    a = new rt.collections.ActiveBucketListsCollection(null, {
      bucketListsCollection: rt.context.bucketListsCollection
    });
    (new rt.views.map.BucketListsMapView({
      collection: a
    })).render();
    return this.publishMapClickedEvent()
  };
  a.prototype.renderTripBackedViews = function() {
    var a, b;
    null != this.waypointMarkersView && this.waypointMarkersView.remove();
    a = this.trip;
    null != (b = this.path) && b.off(null, null, this);
    this.path = new rt.models.TripPath(a.get("waypoints"), a.get("legs"));
    this.path.on("add remove change", this.pathChanged,
    this);
    return this.waypointMarkersView = (new rt.views.map.WaypointMarkersView({
      model: this.path
    })).render()
  };
  a.prototype.pathChanged = function() {
    var a, b, c, d = this;
    b = this.path;
    b.normalize();
    a = function(a) {
      return a.toJSON()
    };
    c = _(b.vertices).map(a);
    a = _(b.edges).map(a);
    this.trip.set({
      waypoints: c,
      legs: a
    });
    return this.activeTrip.calculateDirections(this.trip, function() {
      return d.trip.autosave()
    })
  };
  a.prototype.publishMapClickedEvent = function() {
    return google.maps.event.addListener(rt.app.Map, "click", function() {
      return rt.app.events.trigger("map:clicked")
    })
  };
  a.prototype.resize = function(a) {
    "grow" === a.method ? this.resizeGrow() : this.resizeShrink();
    this.resizeGoogleMap();
    return _.delay(this.resizeGoogleMap, 100)
  };
  a.prototype.resizeGrow = function() {
    var a, b;
    a = null != (b = rt.helpers.app.isMobileScreen()) ? b : {
      "275px": "350px"
    };
    return this.$el.css("left", a)
  };
  a.prototype.resizeShrink = function() {
    var a, b;
    a = null != (b = rt.helpers.app.isMobileScreen()) ? b : {
      "0px": "75px"
    };
    return this.$el.css("left", a)
  };
  a.prototype.resizeGoogleMap = function() {
    return google.maps.event.trigger(rt.app.Map,
      "resize")
  };
  a.prototype._bindTrip = function() {
    var a;
    null != (a = this.trip) && a.off(null, null, this);
    this.trip = this.activeTrip.get("trip");
    return this.trip.on("change:waypoints", this.renderTripBackedViews, this)
  };
  a.prototype._tripChanged = function() {
    this._bindTrip();
    return this.renderTripBackedViews()
  };
  b.MapView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this._getLatLngBoundsForPois = c(this._getLatLngBoundsForPois, this);
    this._updateMarkers = c(this._updateMarkers, this);
    this.clearPlaces = c(this.clearPlaces, this);
    this.showPlaces = c(this.showPlaces, this);
    this.removeSubviews = c(this.removeSubviews, this);
    this.renderMarkerView = c(this.renderMarkerView, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
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
  var b, c = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var e = function() {
    var a = this.initialize,
      b = this;
    this.initialize = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.initialize = function() {};
  b.PlaceView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this.close = c(this.close, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/map/poi_info_window"];
  a.prototype.initialize = function(a) {
    this.marker = null != a ? a.marker : void 0;
    this.infoBoxOptions = {
      disableAutoPan: !1,
      maxWidth: 0,
      pixelOffset: new google.maps.Size(-100, 0),
      boxStyle: {
        background: "white",
        opacity: 1,
        width: "289px",
        border: 0,
        padding: 0
      },
      zIndex: 10001,
      closeBoxURL: "",
      infoBoxClearance: new google.maps.Size(1, 1),
      disableAutoPan: !0,
      isHidden: !1,
      pane: "floatPane",
      enableEventPropagation: !1
    };
    return this.model.on("change", this.render, this)
  };
  a.prototype.render = function() {
    var a, b;
    null != (b = this.infowWindow) && b.close();
    this.$el.empty();
    this.model.has("categories") && (a = _.first(this.model.get("categories")), a = rt.app.helpers.categories.group(a));
    a = {
      poi: this.model.toJSON(),
      group: a
    };
    this.$el.html(this.template(a));
    this.$el.find(".actions").hide();
    this.infoBoxOptions.content = this.el;
    this.infoWindow = new InfoBox(this.infoBoxOptions);
    this.infoWindow.open(rt.app.Map, this.marker);
    this.$el.find("img").fadeIn("fast");
    return this
  };
  a.prototype.close = function() {
    var a;
    this.model.off(null, null, this);
    null != (a = this.infoWindow) && a.close();
    return this.$el.remove()
  };
  b.PoiHoverWindowView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this.markerClicked = c(this.markerClicked, this);
    this.mapClicked = c(this.mapClicked, this);
    this.subscribeToEvents = c(this.subscribeToEvents, this);
    this.addToTripClicked = c(this.addToTripClicked, this);
    this.close = c(this.close, this);
    this.triggerRemoved = c(this.triggerRemoved, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  },
  d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/map/poi_info_window"];
  a.prototype.events = {
    "click .add-to-trip": "addToTripClicked",
    "click .js-route": "navigate"
  };
  a.prototype.initialize = function(a) {
    _.bindAll(this);
    this.marker = null != a ? a.marker : void 0;
    this.infoBoxOptions = {
      disableAutoPan: !1,
      maxWidth: 0,
      pixelOffset: new google.maps.Size(-100, 0),
      boxStyle: {
        background: "white",
        opacity: 1,
        width: "289px",
        border: 0,
        padding: 0
      },
      zIndex: 1E4,
      closeBoxURL: "/assets/poi-modal/close.png",
      closeBoxMargin: "2px 2px 2px 2px",
      infoBoxClearance: new google.maps.Size(25, 25),
      isHidden: !1,
      pane: "floatPane",
      enableEventPropagation: !1
    };
    return this.model.on("change", this.render, this)
  };
  a.prototype.render = function() {
    var a;
    if (null != this.model) return this.infoWindow && this.infoWindow.close(), this.model.has("categories") && (a = _.first(this.model.get("categories")), a = rt.app.helpers.categories.group(a)), this.$el.html(this.template({
      poi: this.model.toJSON(),
      group: a
    })), this.model.has("name") && (a = new rt.views.bucket_lists.BucketListsMenuView({
      poi: this.model
    }), this.$(".actions li:eq(0)").after(a.render().el)), this.infoBoxOptions.content = this.el, this.infoWindow = new InfoBox(this.infoBoxOptions), this.infoWindowCloseListener = google.maps.event.addListener(this.infoWindow, "closeclick", this.triggerRemoved), this.infoWindow.open(rt.app.Map, this.marker), this.subscribeToEvents(), this.$(".actions").fadeIn("fast"), a = this.$el.find("img"), a.fadeIn("fast"), this
  };
  a.prototype.triggerRemoved = function() {
    google.maps.event.removeListener(this.infoWindowCloseListener);
    return this.trigger("removed")
  };
  a.prototype.close = function() {
    if (null != this.infoWindow) return this.triggerRemoved(), this.infoWindow.close(), this.remove(), this.model.off(null, null, this)
  };
  a.prototype.navigate = function(a) {
    a.preventDefault();
    return rt.app.router.navigate($(a.currentTarget).attr("href"))
  };
  a.prototype.addToTripClicked = function(a) {
    a.preventDefault();
    rt.app.events.trigger("ui:add_to_trip", this.model);
    return rt.app.events.trigger("analytics:trip:add", {
      data: {
        via: "info-window"
      }
    })
  };
  a.prototype.subscribeToEvents = function() {
    rt.app.events.on("map:clicked", this.mapClicked);
    return rt.app.events.on("marker:clicked", this.markerClicked)
  };
  a.prototype.mapClicked = function() {
    return this.close()
  };
  a.prototype.markerClicked = function(a) {
    if (this.marker !== a) return this.close()
  };
  b.PoiInfoWindowView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
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
    };
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var d = function() {
    this.unsetInfoWindow = c(this.unsetInfoWindow, this);
    this.closeInfoWindow = c(this.closeInfoWindow, this);
    this.markerClick = c(this.markerClick, this);
    this.hoverOff = c(this.hoverOff, this);
    this.hoverOn = c(this.hoverOn, this);
    this.updatePoiState = c(this.updatePoiState, this);
    this.changeToSearch = c(this.changeToSearch, this);
    this.changeToPoi = c(this.changeToPoi, this);
    this.changeToWaypoint = c(this.changeToWaypoint, this);
    this.changeToDestination = c(this.changeToDestination, this);
    this.changeToOrigin = c(this.changeToOrigin, this);
    this.updateZIndex = c(this.updateZIndex, this);
    this.zIndex = c(this.zIndex, this);
    this.updateMarkerIcon = c(this.updateMarkerIcon, this);
    this.markerIcon = c(this.markerIcon, this);
    this.initEventListeners = c(this.initEventListeners, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return d.__super__.constructor.apply(this, arguments)
  };
  a(d, Backbone.View);
  d.prototype.initialize = function(a) {
    this.poi = this.model || (null != a ? a.poi : void 0);
    this.map = (null != a ? a.map : void 0) || rt.app.Map;
    this.state = 1;
    this.waypointNumber = null != a ? a.waypointNumber : void 0;
    this.poi.on("change:state", this.updatePoiState);
    this.markerOptions = {
      position: new google.maps.LatLng(this.poi.get("latitude"), this.poi.get("longitude")),
      zIndex: 110,
      optimized: !0,
      shadow: rt.app.helpers.mapMarker.shadow()
    };
    "test" === rt.app.env && (this.markerOptions.title = this.poi.id, this.markerOptions.optimized = !1);
    this.marker = new google.maps.Marker(this.markerOptions);
    return this.mouseClickListener = this.mouseOutListener = this.mouseOverListener = null
  };
  d.prototype.render = function() {
    null != this.map && (this.markerOptions.icon = this.markerIcon(), this.markerOptions.map = this.map, this.marker.setOptions(this.markerOptions), this.initEventListeners());
    return this
  };
  d.prototype.remove = function() {
    this.marker.setMap(null);
    google.maps.event.clearInstanceListeners(this.marker);
    this.hoverOff();
    this.closeInfoWindow();
    return this
  };
  d.prototype.initEventListeners = function() {
    null == this.mouseOverListener && (this.mouseOverListener = google.maps.event.addListener(this.marker, "mouseover", this.hoverOn));
    null == this.mouseOutListener && (this.mouseOutListener = google.maps.event.addListener(this.marker, "mouseout", this.hoverOff));
    if (null == this.mouseClickListener) return this.mouseClickListener = google.maps.event.addListener(this.marker,
      "click", this.markerClick)
  };
  d.prototype.markerIcon = function() {
    switch (this.state) {
      case 1:
        return this.poi.get("bucketList") ? rt.app.helpers.mapMarker.forName("bucket_list") : rt.app.helpers.mapMarker.forCategory(this.poi.get("categoryId"));
      case 4:
        return rt.app.helpers.mapMarker.forName("waypoint" + this.waypointNumber);
      case 2:
        return rt.app.helpers.mapMarker.forName("origin");
      case 3:
        return rt.app.helpers.mapMarker.forName("destination");
      case 5:
        return rt.app.helpers.mapMarker.forName("search")
    }
  };
  d.prototype.updateMarkerIcon = function() {
    return this.markerOptions.icon = this.markerIcon()
  };
  d.prototype.zIndex = function() {
    switch (this.state) {
      case 2:
        return 130;
      case 4:
        return 120;
      case 3:
        return 130;
      default:
        return 110
    }
  };
  d.prototype.updateZIndex = function() {
    return this.markerOptions.zIndex = this.zIndex()
  };
  d.prototype.changeToOrigin = function() {
    this.state = 2;
    this.updateMarkerIcon();
    this.updateZIndex();
    return this.render()
  };
  d.prototype.changeToDestination = function() {
    this.state = 3;
    this.updateMarkerIcon();
    this.updateZIndex();
    return this.render()
  };
  d.prototype.changeToWaypoint = function(a) {
    this.state = 4;
    this.waypointNumber = a;
    this.updateMarkerIcon();
    this.updateZIndex();
    return this.render()
  };
  d.prototype.changeToPoi = function() {
    this.state = 1;
    this.updateMarkerIcon();
    this.updateZIndex();
    return this.render()
  };
  d.prototype.changeToSearch = function() {
    this.state = 5;
    this.updateMarkerIcon();
    this.updateZIndex();
    return this.render()
  };
  d.prototype.updatePoiState = function() {
    this.updateMarkerIcon();
    return this.render()
  };
  d.prototype.hoverOn = function() {
    var a;
    if (null == this.infoWindow) return a = new rt.models.Poi({
      _id: this.poi.id
    }), this.hoverWindow = new rt.views.map.PoiHoverWindowView({
      model: a,
      marker: this.marker
    }), this.hoverWindow.render(), this.mouseoutListener = google.maps.event.addListener(this.marker, "mouseout", this.hoverOff), a.fetch()
  };
  d.prototype.hoverOff = function() {
    var a;
    null != (a = this.hoverWindow) && a.close();
    return this.hoverWindow = null
  };
  d.prototype.markerClick = function() {
    var a, b;
    null == this.infoWindow ? (a = new rt.models.Poi({
      _id: this.poi.id
    }), null != (b = this.hoverWindow) && b.close(), this.infoWindow = new rt.views.map.PoiInfoWindowView({
      model: a,
      marker: this.marker
    }), this.infoWindow.render(), this.infoWindow.on("removed", this.unsetInfoWindow), a.fetch()) : (a = new rt.models.Poi({
      _id: this.poi.id
    }), a.fetch({
      success: function() {
        return rt.app.router.navigate(a.get("path"))
      }
    }));
    return rt.app.events.trigger("marker:clicked", this.marker)
  };
  d.prototype.closeInfoWindow = function() {
    var a;
    null != (a = this.infoWindow) && a.close();
    return this.unsetInfoWindow()
  };
  d.prototype.unsetInfoWindow = function() {
    var a;
    null != (a = this.infoWindow) && a.off("removed");
    return this.infoWindow = null
  };
  b.PoiMarkerView = d;
  b = rt.views.map;
  var f = function() {
    this.markerIcon = c(this.markerIcon, this);
    return f.__super__.constructor.apply(this, arguments)
  };
  a(f, rt.views.map.PoiMarkerView);
  f.prototype.markerIcon = function() {
    return rt.app.helpers.mapMarker.forName("bucket_list")
  };
  b.BucketListPoiMarkerView = f
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function() {
    return this.model.bind("change",
    this.render)
  };
  a.prototype.render = function() {
    var a, b, c, d;
    this.polygon_points = [];
    if (this.model.get("points")) {
      d = this.model.get("points");
      b = 0;
      for (c = d.length; b < c; b++) a = d[b], this.polygon_points.push(new google.maps.LatLng(a[1], a[0]))
    }
    this.overlay || (this.overlay = new google.maps.Polygon({
      strokeColor: "#6666FF",
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: "#6666FF",
      fillOpacity: 0.1,
      zIndex: 0
    }));
    if (0 < this.polygon_points.length) return this.overlay.setPath(this.polygon_points), this.overlay.setMap(rt.app.Map);
    this.overlay.setPath(this.polygon_points);
    return this.overlay.setMap(null)
  };
  b.RoutePolygonOverlayView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this.directionsChanged = c(this.directionsChanged, this);
    this._updatePreserveViewport = c(this._updatePreserveViewport, this);
    this._directionsResultChanged = c(this._directionsResultChanged, this);
    this.drawTrip = c(this.drawTrip, this);
    this.eraseTrip = c(this.eraseTrip, this);
    this._bindDirections = c(this._bindDirections, this);
    this._bindTrip = c(this._bindTrip,
    this);
    this._directionsChanged = c(this._directionsChanged, this);
    this._tripChanged = c(this._tripChanged, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function() {
    this.rendererOptions = {
      suppressMarkers: !0,
      draggable: !0,
      preserveViewport: !1,
      panel: null,
      polylineOptions: {
        zIndex: 100,
        strokeOpacity: 0.4,
        strokeWeight: 5,
        strokeColor: "blue"
      }
    };
    this.directionsRenderer = new google.maps.DirectionsRenderer(this.rendererOptions);
    this.directionsChangedListener = google.maps.event.addListener(this.directionsRenderer, "directions_changed", this.directionsChanged);
    this._bindTrip();
    this.model.on("change:trip", this._tripChanged, this);
    this._bindDirections();
    return this.model.on("change:directions", this._directionsChanged, this)
  };
  a.prototype.render = function() {
    null != this.model.get("directions").get("directions_result") ? ($("#directionsPanel").empty(), this.rendererOptions.panel = $("#directionsPanel").get(0), this.directionsRenderer.setOptions(this.rendererOptions), this.drawTrip()) : this.eraseTrip();
    return this
  };
  a.prototype.remove = function() {
    google.maps.event.removeListener(this.directionsChangedListener);
    this.model.off(null, null, this);
    rt.app.events.off(null, null, this);
    this.directionsRenderer.setMap(null);
    return this.directionsRenderer.setPanel(null)
  };
  a.prototype._tripChanged = function() {
    return this._bindTrip()
  };
  a.prototype._directionsChanged = function() {
    this._bindDirections();
    return this.render()
  };
  a.prototype._bindTrip = function() {
    var a;
    null != (a = this.trip) && a.off(null, null, this);
    this.trip = this.model.get("trip");
    return this.trip.on("change:waypoints", this.waypointsChanged, this)
  };
  a.prototype._bindDirections = function() {
    var a;
    null != (a = this.directions) && a.off(null, null, this);
    this.directions = this.model.get("directions");
    this.directions.on("change:directions_result", this._directionsResultChanged, this);
    return this._updatePreserveViewport(!0)
  };
  a.prototype.eraseTrip = function() {
    this.directionsRenderer.setMap(null);
    $("#directionsPanel").empty();
    return rt.app.events.trigger("tripNotShowing")
  };
  a.prototype.drawTrip = function() {
    this.directionsRenderer.setMap(rt.app.Map);
    this.directionsRenderer.setDirections(this.model.get("directions").get("directions_result"));
    return rt.app.events.trigger("tripShowing")
  };
  a.prototype._directionsResultChanged = function() {
    this._updatePreserveViewport();
    return this.render()
  };
  a.prototype._updatePreserveViewport = function(a) {
    null == a && (a = !1);
    a = a || null == this.directions.previous("directions_result") || 2 >= this.model.get("trip").get("waypoints").length;
    return this.rendererOptions.preserveViewport = !a
  };
  a.prototype.directionsChanged = function() {
    var a, b, c, d, e, f;
    f = this.directionsRenderer.getDirections().routes[0].legs;
    a = b = 0;
    for (d = f.length; b < d; a = ++b) if (c = f[a], c = c.via_waypoints, 0 < c.length) {
      b = c[0];
      d = new rt.models.Waypoint({
        name: "via",
        location: [b.lng(), b.lat()],
        type: rt.models.Waypoint.TYPE_VIA
      });
      e = this.model.get("trip");
      b = new rt.models.TripPath(e.get("waypoints"),
      e.get("legs"));
      b.addVertex(d, a + 1);
      d = function(a) {
        return a.toJSON()
      };
      a = _(b.vertices).map(d);
      b = _(b.edges).map(d);
      e.set({
        waypoints: a,
        legs: b
      });
      this.model.calculateDirections(e, function() {
        return e.autosave()
      });
      break
    }
  };
  b.TripView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this._waypointNumber = c(this._waypointNumber, this);
    this._zIndex = c(this._zIndex, this);
    this._icon = c(this._icon, this);
    this.locationChanged = c(this.locationChanged, this);
    this.nameChanged = c(this.nameChanged, this);
    this.typeChanged = c(this.typeChanged, this);
    this.infoWindowRemoved = c(this.infoWindowRemoved, this);
    this.markerClicked = c(this.markerClicked,
    this);
    this.markerMouseout = c(this.markerMouseout, this);
    this.markerMouseover = c(this.markerMouseover, this);
    this.markerPositionChanged = c(this.markerPositionChanged, this);
    this.cleanup = c(this.cleanup, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function() {
    this.markerPositionChanged = _.debounce(this.markerPositionChanged, 1E3);
    this.model.on("change:type", this.typeChanged, this);
    if ("test" === rt.app.env) this.model.on("change:name", this.nameChanged, this);
    this.model.on("change:location", this.locationChanged, this);
    this.model.on("destroy", this.remove, this);
    this.map = rt.app.Map;
    return this
  };
  a.prototype.render = function() {
    var a;
    this.cleanup();
    a = {
      optimized: "test" !== rt.app.env,
      shadow: rt.app.helpers.mapMarker.shadow(),
      map: this.map
    };
    this.marker = new google.maps.Marker(a);
    this.marker.setIcon(this._icon());
    this.marker.setPosition(this.model.mapLatLng());
    this.marker.setZIndex(this._zIndex());
    this.marker.setShadow(rt.app.helpers.mapMarker.shadow());
    this.marker.setDraggable(this.model.isVia());
    "test" === rt.app.env && this.marker.setTitle(this.model.get("name"));
    this.model.isVia() && google.maps.event.addListener(this.marker, "position_changed", this.markerPositionChanged);
    google.maps.event.addListener(this.marker, "click", this.markerClicked);
    google.maps.event.addListener(this.marker, "mouseover", this.markerMouseover);
    google.maps.event.addListener(this.marker, "mouseout", this.markerMouseout);
    return this
  };
  a.prototype.remove = function() {
    this.cleanup();
    this.model.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.cleanup = function() {
    var a, b, c;
    null != (a = this.marker) && a.setMap(null);
    null != this.marker && google.maps.event.clearInstanceListeners(this.marker);
    null != (b = this.hoverWindow) && b.close();
    return null != (c = this.infoWindow) ? c.close() : void 0
  };
  a.prototype.markerPositionChanged = function() {
    var a;
    a = this.marker.getPosition();
    a = null != a ? [a.lng(), a.lat()] : null;
    return this.model.set("location", a, {
      source: this
    })
  };
  a.prototype.markerMouseover = function() {
    var a;
    if (this.model.isPoi() && null == this.hoverWindow) return a = new rt.models.Poi({
      _id: this.model.get("poi_id")
    }), this.hoverWindow = new rt.views.map.PoiHoverWindowView({
      model: a,
      marker: this.marker
    }), this.hoverWindow.render(), a.fetch()
  };
  a.prototype.markerMouseout = function() {
    if (null != this.hoverWindow) return this.hoverWindow.close(), this.hoverWindow = null
  };
  a.prototype.markerClicked = function() {
    var a;
    null == this.infoWindow ? (null != (a = this.hoverWindow) && a.close(), this.hoverWindow = null, this.model.isPoi() && (a = new rt.models.Poi({
      _id: this.model.get("poi_id")
    }), this.infoWindow = new rt.views.map.PoiInfoWindowView({
      model: a,
      marker: this.marker
    }), this.infoWindow.render(), this.infoWindow.on("removed", this.infoWindowRemoved), a.fetch())) : this.model.isPoi() && rt.app.router.navigate(this.infoWindow.model.get("path"));
    return rt.app.events.trigger("marker:clicked", this.marker)
  };
  a.prototype.infoWindowRemoved = function() {
    return this.infoWindow = null
  };
  a.prototype.typeChanged = function() {};
  a.prototype.nameChanged = function(a, b) {
    return this.marker.setTitle(b)
  };
  a.prototype.locationChanged = function(a, b, c) {
    if (c.source !== this) return this.marker.setPosition(this.model.mapLatLng())
  };
  a.prototype._icon = function() {
    var a, b;
    a = this.model;
    if (a.isVia()) return rt.app.helpers.mapMarker.forName("via");
    b = a.path;
    return a === b.firstVertex() ? rt.app.helpers.mapMarker.forName("origin") : a === b.lastVertex() ? rt.app.helpers.mapMarker.forName("destination") : rt.app.helpers.mapMarker.forName("waypoint" + this._waypointNumber())
  };
  a.prototype._zIndex = function() {
    var a, b;
    a = this.model;
    b = a.path;
    return a === b.firstVertex() || a === b.lastVertex() ? 130 : 120
  };
  a.prototype._waypointNumber = function() {
    var a, b, c, d, e, f;
    b = this.model;
    d = b.path;
    e = d.vertexCount();
    c = 0;
    if (e) {
      a = f = 0;
      for (e -= 1; 0 <= e ? f <= e : f >= e; a = 0 <= e ? ++f : --f) {
        if (d.vertexAt(a) === b) return a - c;
        d.vertexAt(a).isVia() && 0 !== a && c++
      }
    }
  };
  b.WaypointMarkerView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).map || (b.map = {});
  b = rt.views.map;
  var a = function() {
    this.removeAllMarkers = c(this.removeAllMarkers, this);
    this._addMarker = c(this._addMarker, this);
    this.waypointsReset = c(this.waypointsReset, this);
    this.waypointRemoved = c(this.waypointRemoved, this);
    this.waypointAdded = c(this.waypointAdded, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this,
    arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function() {
    this.model.on("add", this.waypointAdded, this);
    this.model.on("remove", this.waypointRemoved, this);
    this.model.on("reset", this.waypointsReset, this);
    return this.markerViews = []
  };
  a.prototype.render = function() {
    var a = this;
    this.removeAllMarkers();
    this.model.follow(function(b, c) {
      return a._addMarker(b, c)
    }, function() {});
    return this
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    return this.removeAllMarkers()
  };
  a.prototype.waypointAdded = function(a, b, c) {
    return this._addMarker(a, c.index)
  };
  a.prototype.waypointRemoved = function(a, b, c) {
    return this.markerViews.splice(c.index, 1)[0].remove()
  };
  a.prototype.waypointsReset = function() {
    return this.render()
  };
  a.prototype._addMarker = function(a, b) {
    var c;
    c = new rt.views.map.WaypointMarkerView({
      model: a
    });
    c.render();
    return this.markerViews.splice(b, 0, c)
  };
  a.prototype.removeAllMarkers = function() {
    return _.each(this.markerViews, function(a) {
      return a.remove()
    })
  };
  b.WaypointMarkersView = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).metrics || (b.metrics = {});
  b = rt.views.metrics;
  var e = function() {
    var a = this.clickedCategory,
      b = this;
    this.clickedCategory = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.el = "body";
  e.prototype.events = {
    "click #placesExplorer .category-groups .categories .category": "clickedCategory"
  };
  e.prototype.initialize = function() {};
  e.prototype.clickedCategory = function(a) {
    if ("undefined" !== typeof window && null !== window && window._kmq && (a = $(a.currentTarget), 0 < a.parents("li.active").length)) return a = a.data("category-id"), _kmq.push(["record", "Category View", {
      category: a
    }])
  };
  b.DefaultMetricsView = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty;
  rt.views || (rt.views = {});
  var e = rt.views,
    a = function() {
      this._clicked = b(this._clicked, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.id = "rt-modal";
  a.prototype.events = {
    click: "_clicked"
  };
  a.prototype.initialize = function(a) {
    this.view = a.view;
    return this.view.$el.addClass("rt-modal-content-view")
  };
  a.prototype.render = function() {
    this.$el.html(this.view.render().el);
    return this
  };
  a.prototype.remove = function() {
    var b;
    null != (b = this.view) && b.remove();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._clicked = function(a) {
    var b;
    b = 0 < $(a.target).closest("#rt-modal").length;
    a = 0 < $(a.target).closest(".rt-modal-content-view").length;
    if (b && !a) return this.trigger("backdrop-click")
  };
  e.ModalView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).my_stuff || (b.my_stuff = {});
  b = rt.views.my_stuff;
  var a = function() {
    this.preventDefault = c(this.preventDefault, this);
    this.hide = c(this.hide, this);
    this.show = c(this.show, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#myStuff";
  a.prototype.events = {
    "click .group a": "preventDefault"
  };
  a.prototype.initialize = function(a) {
    this.bucketListsView = new rt.views.bucket_lists.BucketListsView({
      bucketLists: a.bucketLists
    });
    this.namedTripCollection = new rt.collections.NamedTripCollection;
    return this.namedTripsView = new rt.views.my_stuff.SavedTripsView({
      collection: this.namedTripCollection,
      model: a.activeTrip,
      title: "Saved Trips",
      index: 0
    })
  };
  a.prototype.render = function() {
    this.bucketListsView.render();
    this.namedTripsView.render();
    this.$(".my-stuff-groups").append(this.namedTripsView.el);
    return this
  };
  a.prototype.remove = function() {
    return namedTripCollection.destroy()
  };
  a.prototype.show = function() {
    return this.$el.show()
  };
  a.prototype.hide = function() {
    return this.$el.hide()
  };
  a.prototype.preventDefault = function(a) {
    return a.preventDefault()
  };
  b.MyStuffView = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).my_stuff || (b.my_stuff = {});
  b = rt.views.my_stuff;
  var e = function() {
    var a = this.remove,
      b = this;
    this.remove = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["templates/my_stuff/named_trips"];
  e.prototype.tagName = "div";
  e.prototype.className =
    "named-trips-view";
  e.prototype.events = {
    "click li.trip a.show": "showTrip",
    "click li.trip a.remove": "removeTrip"
  };
  e.prototype.initialize = function() {
    return _.bindAll(this)
  };
  e.prototype.render = function() {
    var a;
    a = {
      activeTrip: this.model.toJSON(),
      trips: this.collection.toJSON()
    };
    this.$el.html(this.template(a));
    return this
  };
  e.prototype.remove = function() {
    return e.__super__.remove.call(this)
  };
  e.prototype.showTrip = function(a) {
    a.preventDefault();
    a = $(a.currentTarget).closest("li.trip").data("id");
    this.trigger("selected",
    this.collection.get(a));
    return rt.app.router.navigate("/trips/" + a)
  };
  e.prototype.removeTrip = function(a) {
    var b, c = this;
    a.preventDefault();
    b = $(a.currentTarget).closest("li.trip");
    a = this.collection.get(b.data("id"));
    if (b.hasClass("delete")) return a.destroy({
      success: function() {
        rt.app.events.trigger("notify:trip:deleted");
        b.remove();
        if (0 === c.collection.length) return c.trigger("cleared")
      }
    });
    b.addClass("delete");
    return rt.app.events.trigger("notify:generic", {
      message: "Are you sure you want to delete this trip?  Click again to confirm."
    })
  };
  b.NamedTripsView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
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
    };
  (b = rt.views).bucket_lists || (b.bucket_lists = {});
  b = rt.views.my_stuff;
  var d = function() {
    this.updateActiveState = c(this.updateActiveState, this);
    this.updateName = c(this.updateName, this);
    this.nameChanged = c(this.nameChanged, this);
    this.activeTripChanged = c(this.activeTripChanged, this);
    this.cancelRemoveClicked = c(this.cancelRemoveClicked, this);
    this.confirmRemoveClicked = c(this.confirmRemoveClicked, this);
    this.removeClicked = c(this.removeClicked, this);
    this.tripClicked = c(this.tripClicked, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return d.__super__.constructor.apply(this, arguments)
  };
  a(d, Backbone.View);
  d.prototype.template = JST["templates/my_stuff/saved_trip"];
  d.prototype.tagName = "li";
  d.prototype.className = "saved-trip-view";
  d.prototype.events = {
    "click .show": "tripClicked",
    "click .remove": "removeClicked"
  };
  d.prototype.initialize = function(a) {
    _.bindAll(this);
    this.activeTrip = a.activeTrip;
    this.activeTrip.bind("change:trip", this.activeTripChanged);
    return this.model.on("change:display_name", this.nameChanged, this)
  };
  d.prototype.render = function() {
    this.$el.html(this.template({
      trip: this.model.toJSON()
    }));
    this.updateName();
    this.updateActiveState();
    return this
  };
  d.prototype.remove = function() {
    this.model.off(null, null, this);
    return d.__super__.remove.apply(this,
    arguments)
  };
  d.prototype.tripClicked = function(a) {
    a.preventDefault();
    a = this.activeTrip.get("trip");
    return this.model === a ? rt.app.router.navigate(rt.routes.new_trip_path(), {
      trigger: !0
    }) : rt.app.router.navigate(rt.routes.trip_path(this.model.id), {
      trigger: !0
    })
  };
  d.prototype.removeClicked = function(a) {
    a.preventDefault();
    if (this.$el.hasClass("delete")) return this.model.destroy({
      success: function() {
        return rt.app.events.trigger("notify:trip:deleted")
      }
    });
    this.$el.addClass("delete");
    return rt.app.events.trigger("notify:generic", {
      message: "Are you sure you want to delete this trip?  Click again to confirm."
    })
  };
  d.prototype.confirmRemoveClicked = function() {
    var a;
    a.remove();
    a = null;
    return this.model.destroy({
      success: function() {
        return rt.app.events.trigger("notify:bucket_list:deleted")
      }
    })
  };
  d.prototype.cancelRemoveClicked = function() {
    (void 0).remove();
    return null
  };
  d.prototype.activeTripChanged = function() {
    return this.updateActiveState()
  };
  d.prototype.nameChanged = function() {
    return this.updateName()
  };
  d.prototype.updateName = function() {
    var a;
    a = this.model.get("display_name");
    null == a && (a = "Auto-save");
    return this.$(".show").html(a)
  };
  d.prototype.updateActiveState = function() {
    return this.activeTrip.get("trip") === this.model ? this.$el.addClass("active") : this.$el.removeClass("active")
  };
  b.SavedTripView = d;
  var f = function() {
    this.cancelClicked = c(this.cancelClicked, this);
    this.confirmClicked = c(this.confirmClicked, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return f.__super__.constructor.apply(this, arguments)
  };
  a(f, Backbone.View);
  f.prototype.template = JST["templates/my_stuff/ConfirmCancelView"];
  f.prototype.events = {
    "click .confirm": "confirmClicked"
  };
  f.prototype.initialize = function() {};
  f.prototype.render = function() {
    return this.$el.html(this.template({
      message: this.model.get("message")
    }))
  };
  f.prototype.confirmClicked = function() {
    return this.trigger("confirm")
  };
  f.prototype.cancelClicked = function() {
    return this.trigger("cancel")
  }
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).bucket_lists || (b.bucket_lists = {});
  b = rt.views.my_stuff;
  var a = function() {
    this._addTripView = c(this._addTripView, this);
    this.tripCollectionReset = c(this.tripCollectionReset, this);
    this.tripModelRemoved = c(this.tripModelRemoved, this);
    this.tripModelAdded = c(this.tripModelAdded, this);
    this.hideNonePlaceholder = c(this.hideNonePlaceholder, this);
    this.showNonePlaceholder = c(this.showNonePlaceholder, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/my_stuff/saved_trips"];
  a.prototype.tagName = "div";
  a.prototype.className = "saved-trips-view";
  a.prototype.initialize = function(a) {
    _.bindAll(this);
    this.index = a.index;
    this.title = a.title;
    this.collection.on("add",
    this.tripModelAdded, this);
    this.collection.on("remove", this.tripModelRemoved, this);
    this.collection.on("reset", this.tripCollectionReset, this);
    this.sessionFacade = rt.app.facades.sessionFacade;
    rt.app.events.bind("session:login", this.render);
    rt.app.events.bind("session:logout", this.render);
    return this.views = []
  };
  a.prototype.render = function() {
    var a = this;
    this.$el.html(this.template({
      index: this.index,
      title: this.title
    }));
    0 === this.collection.length ? this.showNonePlaceholder() : (this.hideNonePlaceholder(), this.collection.each(function(b,
    c) {
      return a._addTripView(b, c)
    }));
    return this
  };
  a.prototype.remove = function() {
    var b;
    null != (b = this.collection) && b.off(null, null, this);
    rt.app.events.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.showNonePlaceholder = function() {
    return this.$(".none-placeholder").show()
  };
  a.prototype.hideNonePlaceholder = function() {
    return this.$(".none-placeholder").hide()
  };
  a.prototype.tripModelAdded = function(a, b, c) {
    this._addTripView(a, c.index);
    return this.hideNonePlaceholder()
  };
  a.prototype.tripModelRemoved = function(a, b, c) {
    this.views.splice(c.index, 1)[0].remove();
    if (0 === this.collection.length) return this.showNonePlaceholder()
  };
  a.prototype.tripCollectionReset = function() {
    return this.render()
  };
  a.prototype._addTripView = function(a, b) {
    var c, d;
    d = new rt.views.my_stuff.SavedTripView({
      model: a,
      activeTrip: this.model
    });
    d.render();
    this.views.splice(b, 0, d);
    c = this.$(".saved-trip-view:nth-child(" + (b + 1) + ")");
    return 1 === c.length ? c.before(d.el) : this.$(".saved-trips").append(d.el)
  };
  b.SavedTripsView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).notification_bar || (b.notification_bar = {});
  b = rt.views.notification_bar;
  var a = function() {
    this._shouldShowUnsavedTripNotification = c(this._shouldShowUnsavedTripNotification, this);
    this.toggleUnsavedTripNotification = c(this.toggleUnsavedTripNotification, this);
    this.activeTripChanged = c(this.activeTripChanged, this);
    this.hideUnsavedNotification = c(this.hideUnsavedNotification, this);
    this.showUnsavedNotification = c(this.showUnsavedNotification, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#notificationBar";
  a.prototype.initialize = function(a) {
    this.activeTrip = a.activeTrip;
    this.activeTripChanged();
    return this.activeTrip.on("change:trip", this.activeTripChanged, this)
  };
  a.prototype.showUnsavedNotification = function() {
    if (!this.$el.is(":visible")) return this.$el.slideDown(500), this.unsavedNotificationShowing = !0
  };
  a.prototype.hideUnsavedNotification = function() {
    if (this.$el.is(":visible")) return this.$el.slideUp(500)
  };
  a.prototype.activeTripChanged = function() {
    var a;
    null != (a = this.trip) && a.off(null, null, this);
    this.trip = this.activeTrip.get("trip");
    this.toggleUnsavedTripNotification();
    this.trip.on("change:name", this.toggleUnsavedTripNotification, this);
    this.trip.on("change:_id", this.toggleUnsavedTripNotification,
    this);
    return this.trip.on("change:waypoints", this.toggleUnsavedTripNotification, this)
  };
  a.prototype.toggleUnsavedTripNotification = function() {
    return this._shouldShowUnsavedTripNotification() ? this.showUnsavedNotification() : this.hideUnsavedNotification()
  };
  a.prototype._shouldShowUnsavedTripNotification = function() {
    var a;
    a = this.trip;
    return a.has("_id") ? a.has("_id") && a.has("name") ? !1 : this.$el.is(":visible") ? !0 : a.has("_id") && !a.has("name") && 7 <= a.get("waypoints").length ? !0 : !1 : !1
  };
  b.NotificationBarView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).notifications || (b.notifications = {});
  b = rt.views.notifications;
  var a = function() {
    this._showing = c(this._showing, this);
    this._update = c(this._update, this);
    this._pop = c(this._pop, this);
    this._push = c(this._push, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#loading";
  a.prototype.initialize = function() {
    var a = this;
    this.count = 0;
    this.$el.ajaxStart(function() {
      return a._push()
    });
    this.$el.ajaxStop(function() {
      return a._pop()
    });
    rt.app.events.on("ui:push_loading", this._push, this);
    return rt.app.events.on("ui:pop_loading", this._pop, this)
  };
  a.prototype._push = function() {
    this.count += 1;
    return this._update()
  };
  a.prototype._pop = function() {
    this.count -= 1;
    return this._update()
  };
  a.prototype._update = function() {
    if (0 < this.count) {
      if (!this._showing()) return this.$el.fadeIn(600)
    } else if (this.count = 0, this._showing()) return this.$el.fadeOut(600)
  };
  a.prototype._showing = function() {
    return this.$el.is(":visible")
  };
  b.LoadingIndicator = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).notifications || (b.notifications = {});
  b = rt.views.notifications;
  var a = function() {
    this.showNotification = c(this.showNotification, this);
    this.showTripDeleted = c(this.showTripDeleted, this);
    this.showWaypointLimit = c(this.showWaypointLimit, this);
    this.showWaypointAdded = c(this.showWaypointAdded, this);
    this.showBucketListDeleted = c(this.showBucketListDeleted, this);
    this.showBucketListCreated = c(this.showBucketListCreated,
    this);
    this.showBucketListError = c(this.showBucketListError, this);
    this.showBucketListPoiExists = c(this.showBucketListPoiExists, this);
    this.showBucketListPoiRemoved = c(this.showBucketListPoiRemoved, this);
    this.showBucketListPoiAdded = c(this.showBucketListPoiAdded, this);
    this.hide = c(this.hide, this);
    this.show = c(this.show, this);
    this.toggle = c(this.toggle, this);
    this.positionAnchor = c(this.positionAnchor, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this,
    arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#growl";
  a.prototype.template = '<div class="rt-popover popover"><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>';
  a.prototype.initialize = function() {
    this.display = !1;
    this.message = "";
    this.popoverOptions = {
      animation: !0,
      placement: "bottom",
      trigger: "manual",
      template: this.template,
      delay: {
        hide: 1E3,
        show: 1E3
      }
    };
    rt.app.events.on("notify:bucket_list:poi_added", this.showBucketListPoiAdded);
    rt.app.events.on("notify:bucket_list:poi_removed", this.showBucketListPoiRemoved);
    rt.app.events.on("notify:bucket_list:poi_exists", this.showBucketListPoiExists);
    rt.app.events.on("notify:bucket_list:error", this.showBucketListError);
    rt.app.events.on("notify:bucket_list:created", this.showBucketListCreated);
    rt.app.events.on("notify:bucket_list:deleted", this.showBucketListDeleted);
    rt.app.events.on("notify:trip:waypoint_limit",
    this.showWaypointLimit);
    rt.app.events.on("notify:trip:waypoint_added", this.showWaypointAdded);
    rt.app.events.on("notify:trip:deleted", this.showTripDeleted);
    return rt.app.events.on("notify:generic", this.showNotification)
  };
  a.prototype.render = function() {
    return this.display ? this.show() : this.hide()
  };
  a.prototype.positionAnchor = function() {
    return this.$el.position({
      my: "center top",
      at: "center bottom",
      of: $("#topNav"),
      offset: "170px -10px",
      collision: "fit"
    })
  };
  a.prototype.toggle = function() {
    this.display = !this.display;
    return this.render()
  };
  a.prototype.show = function() {
    this.positionAnchor();
    this.display && this.hide(!1);
    this.$el.data("popover", null).popover(this.popoverOptions);
    this.$el.popover("show");
    this.timeoutRef = setTimeout(this.hide, 4E3);
    return this.display = !0
  };
  a.prototype.hide = function(a) {
    var b, c = this;
    null == a && (a = !0);
    b = $(".rt-popover");
    0 < b.length && a ? b.fadeOut("normal", function() {
      return c.$el.popover("hide")
    }) : this.$el.popover("hide");
    this.timeoutRef && clearTimeout(this.timeoutRef);
    return this.display = !1
  };
  a.prototype.showBucketListPoiAdded = function() {
    return this.showNotification({
      message: '<i class="icon-pushpin"></i> Added to bucket list'
    })
  };
  a.prototype.showBucketListPoiRemoved = function() {
    return this.showNotification({
      message: '<i class="icon-pushpin"></i> Removed from bucket list'
    })
  };
  a.prototype.showBucketListPoiExists = function() {
    return this.showNotification({
      message: '<i class="icon-pushpin"></i> Already exists in bucket list'
    })
  };
  a.prototype.showBucketListError = function() {
    return this.showNotification({
      message: '<i class="icon-pushpin"></i> An error occured adding to bucket list'
    })
  };
  a.prototype.showBucketListCreated = function() {
    return this.showNotification({
      message: '<i class="icon-pushpin"></i> Bucket list successfully created'
    })
  };
  a.prototype.showBucketListDeleted = function() {
    return this.showNotification({
      message: '<i class="icon-pushpin"></i> Bucket list successfully deleted'
    })
  };
  a.prototype.showWaypointAdded = function() {
    return this.showNotification({
      message: '<i class="icon-road"></i> Waypoint added'
    })
  };
  a.prototype.showWaypointLimit = function() {
    return this.showNotification({
      message: '<i class="icon-road"></i> You have reached 25 waypoints, the maximum allowed'
    })
  };
  a.prototype.showTripDeleted = function() {
    return this.showNotification({
      message: '<i class="icon-road"></i> Trip successfully deleted'
    })
  };
  a.prototype.showNotification = function(a) {
    this.popoverOptions.content = a.message;
    return this.show()
  };
  b.OverlayView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
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
    };
  (b = rt.views).overlay || (b.overlay = {});
  b = rt.views.overlay;
  var d = function() {
    this.authorized = c(this.authorized, this);
    this.actionClicked = c(this.actionClicked, this);
    this.label = c(this.label, this);
    this.fontAwesomeClass = c(this.fontAwesomeClass,
    this);
    this.dynamicClassName = c(this.dynamicClassName, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return d.__super__.constructor.apply(this, arguments)
  };
  a(d, Backbone.View);
  d.prototype.template = JST["templates/overlay/overlay_sidebar_action"];
  d.prototype.events = {
    click: "actionClicked"
  };
  d.prototype.className = "overlay-sidebar-action";
  d.prototype.tagName = "a";
  d.prototype.initialize = function() {
    this.$el.addClass(this.dynamicClassName());
    return this
  };
  d.prototype.render = function() {
    return this.$el.html(this.template({
      fontAwesomeClass: this.fontAwesomeClass(),
      label: this.label()
    }))
  };
  d.prototype.dynamicClassName = function() {};
  d.prototype.fontAwesomeClass = function() {
    return "icon-"
  };
  d.prototype.label = function() {
    return "Action"
  };
  d.prototype.actionClicked = function() {
    return alert("Oops!  This action hasn't been implemented yet!")
  };
  d.prototype.authorized = function() {
    return !0
  };
  b.OverlaySidebarActionView = d;
  b = rt.views.overlay;
  var f = function() {
    this.actionClicked = c(this.actionClicked, this);
    this.label = c(this.label, this);
    this.fontAwesomeClass = c(this.fontAwesomeClass, this);
    this.dynamicClassName = c(this.dynamicClassName, this);
    return f.__super__.constructor.apply(this, arguments)
  };
  a(f, rt.views.overlay.OverlaySidebarActionView);
  f.prototype.dynamicClassName = function() {
    return "map"
  };
  f.prototype.fontAwesomeClass = function() {
    return "icon-globe"
  };
  f.prototype.label = function() {
    return "Map"
  };
  f.prototype.actionClicked = function() {
    return rt.app.events.trigger("navigate:map")
  };
  b.MapOverlaySidebarActionView = f;
  b = rt.views.overlay;
  var h = function() {
    this.actionClicked = c(this.actionClicked, this);
    this.label = c(this.label, this);
    this.fontAwesomeClass = c(this.fontAwesomeClass, this);
    this.dynamicClassName = c(this.dynamicClassName, this);
    return h.__super__.constructor.apply(this, arguments)
  };
  a(h, rt.views.overlay.OverlaySidebarActionView);
  h.prototype.dynamicClassName = function() {
    return "back"
  };
  h.prototype.fontAwesomeClass = function() {
    return "icon-play-circle"
  };
  h.prototype.label = function() {
    return "PREVIOUS"
  };
  h.prototype.actionClicked = function() {
    return rt.app.events.trigger("navigate:back")
  };
  b.BackOverlaySidebarActionView = h
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).overlay || (b.overlay = {});
  b = rt.views.overlay;
  var a = function() {
    this.renderActionView = c(this.renderActionView, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "overlay-sidebar-view";
  a.prototype.initialize = function(a) {
    var b;
    this.mapActionView = new rt.views.overlay.MapOverlaySidebarActionView;
    this.backActionView = new rt.views.overlay.BackOverlaySidebarActionView;
    null != (null != a ? a.actionViews : void 0) ? this.actionViews = a.actionViews : this.activeViews = [];
    return null != (b = rt.permissions) ? b.on("change", this.render) : void 0
  };
  a.prototype.render = function() {
    this.renderActionView(this.mapActionView);
    this.renderActionView(this.backActionView);
    _(this.actionViews).each(this.renderActionView);
    return this
  };
  a.prototype.renderActionView = function(a) {
    if (a.authorized()) return a.render(), this.$el.append(a.el)
  };
  b.OverlaySidebarView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).overlay || (b.overlay = {});
  b = rt.views.overlay;
  var a = function() {
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
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
  var b, c = {}.hasOwnProperty;
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var e = function() {
    var a = this.render,
      b = this;
    this.render = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["templates/poi_change_requests/poi_change_request_row"];
  e.prototype.className = "poi-change-request-row-view";
  e.prototype.tagName = "tr";
  e.prototype.render = function() {
    var a;
    a = this.template({
      model: this.model.toJSON()
    });
    this.$el.html(a);
    return this
  };
  b.PoiChangeRequestRowView = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty;
  rt.views || (rt.views = {});
  var e = rt.views,
    a = function() {
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/poi_change_requests/poi_change_request"];
  a.prototype.className = "poi-change-request-view";
  a.prototype.render = function() {
    var a;
    a = this.model.toJSON();
    a = $(this.template({
      model: a
    }));
    this.$el.html(a);
    return this
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  e.PoiChangeRequestView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty;
  rt.views || (rt.views = {});
  var e = rt.views,
    a = function() {
      this._cleanup = b(this._cleanup, this);
      this._refreshButtonClicked = b(this._refreshButtonClicked, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/poi_change_requests/poi_change_requests"];
  a.prototype.isPoiChangeRequestsView = !0;
  a.prototype.className = "poi-change-requests-view";
  a.prototype.events = {
    "click .refresh-button": "_refreshButtonClicked"
  };
  a.prototype.initialize = function(a) {
    this.collection.on("reset", this.render, this);
    return this.review_required = a.review_required
  };
  a.prototype.render = function() {
    var a, b;
    this._cleanup();
    b = $(this.template({
      collection: this.collection.toJSON()
    }));
    a = b.find("tbody");
    this.subviews = this.collection.map(function(b) {
      b = new rt.views.pois.PoiChangeRequestRowView({
        model: b
      });
      a.append(b.render().el);
      return b
    });
    this.$el.html(b[0].parentNode);
    this.review_required || this.$(".place-link").addClass("js-route");
    return this
  };
  a.prototype.remove = function() {
    this._cleanup();
    this.collection.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._refreshButtonClicked = function() {
    return this.collection.fetch()
  };
  a.prototype._cleanup = function() {
    if (null != this.subviews) return _(this.subviews).each(function(a) {
      return a.remove()
    }),
    this.subviews = null
  };
  e.PoiChangeRequestsView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var a = function() {
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/pois/booking"];
  a.prototype.className =
    "body booking-section";
  a.prototype.initialize = function(a) {
    var b, c = this;
    this.model = a.model;
    this.loading = !0;
    this.bookingLink = null;
    b = function(a) {
      c.loading = !1;
      a && (c.bookingLink = "http://bookings.???.com/templates/363498/hotels/" + a.hotelId + "/overview", c.lowRate = a.lowRate);
      return c.render()
    };
    return a.bookingInfo && a.bookingInfo.data ? b.call(this, a.bookingInfo.data) : rt.helpers.expedia.requestBookingInfo(this.model.toJSON(), b)
  };
  a.prototype.render = function() {
    var a;
    a = {
      loading: this.loading,
      bookingLink: this.bookingLink,
      lowRate: this.lowRate,
      website: this.model.get("website"),
      phone: this.model.get("phone")
    };
    this.$el.html(this.template(a));
    return this
  };
  b.BookingView = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var e = function() {
    var a = this.renderCommentAdded,
      b = this;
    this.renderCommentAdded = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.className = "comments";
  e.prototype.template = JST["templates/comments/comment"];
  e.prototype.events = {
    "click .add-comment": "addCommentClicked"
  };
  e.prototype.initialize = function() {
    this.collection.on("add", this.renderCommentAdded, this);
    this.collection.on("remove", this.renderCommentRemoved, this);
    return this.collection.on("reset", this.renderCommentsReseted, this)
  };
  e.prototype.render = function() {
    this.$el.html('<a class="add-comment">Leave a Note</a>      <strong class="comments-title">Guide Notes</strong>      <div class="comments-list"></div>');
    this.collection.each(this.renderCommentAdded);
    return this
  };
  e.prototype.renderCommentAdded = function() {
    return this.$el.find(".comments-list").append(this.template({
      comment: comment.toJSON()
    }))
  };
  e.prototype.renderCommentRemoved = function(a) {
    return this.$el.find(".comments-list .comment-item[data-id=" + a.id + "]").remove()
  };
  e.prototype.renderCommentsReseted = function() {
    return this.$el.find(".comments-list").empty()
  };
  e.prototype.tryToFocusOnSelectedComment = function() {
    var a;
    if (location.search.match(/note=(\w*)/)) return a = location.search.match(/note=(\w*)/)[1],
    this.$el.find(".comment-item[data-id='" + a + "'] a").focus()
  };
  e.prototype.addCommentClicked = function() {
    this.newCommentView || (this.newCommentView = new rt.views.comments.NewCommentView({
      collection: this.collection
    }), this.newCommentView.on("saved", rt.helpers.modal.close, this));
    return rt.helpers.modal.open({
      view: this.newCommentView
    }).on("backdrop-click", rt.helpers.modal.close)
  };
  e.prototype.deleteCommentClicked = function() {
    console.log("removeCommentClicked");
    if (this.user_has_admin_rights) return alert("removed")
  };
  b.CommentsListView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
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
    };
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var d = function() {
    this._hashEditableAttributes = c(this._hashEditableAttributes, this);
    this._changed = c(this._changed, this);
    this._stateAutocompleteSource = c(this._stateAutocompleteSource, this);
    this._saveImage = c(this._saveImage, this);
    this._saveModel = c(this._saveModel, this);
    this._geocode = c(this._geocode, this);
    this.geocodeClicked = c(this.geocodeClicked, this);
    this.showLookupButton = c(this.showLookupButton, this);
    this.hideLookupButton = c(this.hideLookupButton, this);
    this.removeImageClicked = c(this.removeImageClicked, this);
    this.resolve = c(this.resolve, this);
    this.websiteChanged = c(this.websiteChanged, this);
    this.toggleCategoriesSelector = c(this.toggleCategoriesSelector, this);
    this.setErrors = c(this.setErrors, this);
    this.updateCategoriesDisplay = c(this.updateCategoriesDisplay, this);
    this.setAsUnresolved = c(this.setAsUnresolved, this);
    this.setAsResolved = c(this.setAsResolved, this);
    this._countryChanged = c(this._countryChanged, this);
    this.setLookupLinks = c(this.setLookupLinks, this);
    this.renderCategorySelector = c(this.renderCategorySelector, this);
    this.render = c(this.render, this);
    this.reset = c(this.reset, this);
    this.close = c(this.close, this);
    return d.__super__.constructor.apply(this, arguments)
  };
  a(d, Backbone.View);
  d.prototype.template = JST["templates/pois/new"];
  d.prototype.resolved = !1;
  d.prototype.id = "newPlaceView";
  d.prototype.className = "new-place-view";
  d.prototype.events = {
    "submit #new-poi": "save",
    "click .lookup": "resolve",
    "click .category .remove": "removeCategory",
    "reset #new-poi": "reset",
    "click #remove_image": "removeImageClicked",
    "focus #categories_selector": "categoriesFocus",
    "blur #categories_selector": "categoriesBlur",
    "focus input:not(#categories_selector)": "categoriesBlur",
    "click .js-geocode": "geocodeClicked"
  };
  d.prototype.initialize = function(a) {
    _.bindAll(this,
      "render");
    this.originalHash = this._hashEditableAttributes();
    this.categories = a.categories;
    this.currentUser = a.currentUser;
    this.model.on("change:factual_id", this.setAsResolved, this);
    this.model.on("change:errors", this.setErrors, this);
    this.model.on("change:unresolved", this.setAsUnresolved, this);
    this.model.on("change:categories", this.updateCategoriesDisplay, this);
    this.model.on("change:website", this.websiteChanged, this);
    this.model.on("change:name", this.setLookupLinks, this);
    return this.model.on("change:country",
    this._countryChanged, this)
  };
  d.prototype.close = function() {
    this.remove();
    return rt.app.router.navigate("#")
  };
  d.prototype.reset = function() {
    this.model.fetch();
    this.showLookupButton();
    return this
  };
  d.prototype.render = function() {
    var a, b, c, d = this;
    null != (a = this.sidebarView) && a.remove();
    this.sidebarView = null;
    b = {
      poi: this.model.toJSON(),
      countries: this.model.countries,
      categories: this.categories.models,
      isNew: this.model.isNew(),
      currentUser: this.currentUser
    };
    a = this.$el;
    a.html(this.template(b));
    this.$(".state input").autocomplete({
      source: this._stateAutocompleteSource,
      select: function(a, b) {
        return d.model.set("state", b.item.value)
      }
    });
    this.renderCategorySelector();
    this.updateCategoriesDisplay();
    a.find("#description").wysihtml5({
      "font-styles": !1,
      image: !1,
      link: !0,
      lists: !1
    });
    this.imageUploadView = new rt.views.ImageUploadView({
      imageUrl: null != (c = this.model.get("image")) ? c.thumb_url : void 0,
      resourceUrl: "/api/v1/pois",
      imageAttributeName: "image",
      model: this.model
    });
    a.find("#image_upload_view").html(this.imageUploadView.render().$el);
    this.messageView = (new rt.views.MessageView).render();
    a.find(".message-view").html(this.messageView.el);
    this.imageUploadView.on("fileChosen", this.messageView.showImageUploadMessage);
    this.setLookupLinks();
    Backbone.ModelBinding.bind(this);
    this.$("#name").focus();
    return this
  };
  d.prototype.categoriesFocus = function() {
    return this.$(".categories-field").addClass("focused")
  };
  d.prototype.categoriesBlur = function() {
    return this.$(".categories-field").removeClass("focused")
  };
  d.prototype.renderCategorySelector = function() {
    var a = this;
    return this.$("#categories_selector").catcomplete({
      source: function(b,
      c) {
        var d, e;
        d = a.categories.reject(function(a) {
          return "deals" === a.get("group")
        });
        e = RegExp($.ui.autocomplete.escapeRegex(b.term), "i");
        d = d.filter(function(a) {
          return e.test(a.get("group")) || e.test(a.get("name"))
        });
        d = _.map(d, function(a) {
          return {
            label: a.get("name"),
            value: a.id,
            category: a.get("group")
          }
        });
        return c(d)
      },
      focus: function() {
        return a.categoriesFocus()
      },
      select: function(b, c) {
        a.$("#categories_selector").val("");
        a.model.addCategory(c.item.value);
        return !1
      }
    })
  };
  d.prototype.setLookupLinks = function() {
    var a,
    b;
    a = encodeURIComponent(this.model.get("name"));
    b = this.model.has("city") ? "" + a + " " + encodeURIComponent(this.model.get("city")) : a;
    this.$(".look-up .wikipedia-link").attr("href", "http://en.wikipedia.org/w/index.php?search=" + a);
    this.$(".look-up .pinterest-link").attr("href", "https://www.google.com/search?tbm=isch&q=" + b);
    return this.$(".look-up .google-link").attr("href", "https://www.google.com/search?&q=" + b)
  };
  d.prototype._countryChanged = function() {
    return this.model.set("state", null)
  };
  d.prototype.setAsResolved = function() {
    var a;
    if (36 === (null != (a = this.model.get("factual_id")) ? a.length : void 0)) this.resolved = !0, this.hideLookupButton();
    return this
  };
  d.prototype.setAsUnresolved = function() {
    this.hideLookupButton();
    return this
  };
  d.prototype.updateCategoriesDisplay = function() {
    var a, b, c, d, e;
    this.$(".categories-display").empty();
    c = this.model.get("categories") || [];
    c = _.reject(c, function(a) {
      return /^deals\-/.test(a)
    });
    d = 0;
    for (e = c.length; d < e; d++) b = c[d], a = this.categories.find(function(a) {
      return a.id === b
    }), this.$(".categories-display").append('<li data-category="' + a.id + '" class="category"><span class="label info">' + a.get("name") + '</span> <span class="remove">X</span></li>'), this.toggleCategoriesSelector(c.length);
    return this
  };
  d.prototype.setErrors = function() {
    var a, b, c;
    if (a = this.model.get("errors")) {
      c = null != a && a.base ? a.base : "There were errors adding this place.  Please correct the highlighted field below.";
      this.$(".alert-message > p").html(c);
      this.$(".alert-message").fadeIn();
      c = [];
      for (b in a) "base" !== b ? c.push(this.$("#" + b).parents("div.clearfix").addClass("error")) : c.push(void 0);
      return c
    }
    this.$(".alert-message > p").empty();
    this.$(".alert-message").fadeOut();
    return this.$("form div.error").removeClass("error")
  };
  d.prototype.toggleCategoriesSelector = function(a) {
    var b;
    b = this.$("#categories_selector");
    if (8 <= a) return b.catcomplete("option", "disabled", !0).attr("disabled", "disabled").attr("placeholder", "Maximum of 8 categories");
    if (b.catcomplete("option", "disabled")) return b.catcomplete("option", "disabled", !1).removeAttr("disabled").attr("placeholder", "Type to choose a category")
  };
  d.prototype.websiteChanged = function() {
    var a;
    a = this.model.get("website");
    return this.$el.find(".website-link").attr("href", a)
  };
  d.prototype.removeCategory = function(a) {
    a = $(a.currentTarget).parent(".category").data("category");
    this.model.removeCategory(a);
    return this
  };
  d.prototype.resolve = function() {
    var a = this;
    return $.post("/api/v1/pois/resolve.json", {
      poi: this.model.toJSON()
    }, function(b) {
      if ("error" === (null != b ? b.status : void 0)) return a.model.set({
        errors: {
          base: "There was an error searching for this place. If this happens repeatedly contact sysadmin@rt.com"
        }
      });
      a.model.unset("errors");
      b = new rt.collections.FactualPlacesCollection(b);
      b = new rt.views.factual.IndexView({
        poi: a.model,
        collection: b
      });
      return $("#pois").append(b.render().el)
    })
  };
  d.prototype.removeImageClicked = function() {
    this.$el.find("#image_filename").val("");
    return this.imageData = null
  };
  d.prototype.hideLookupButton = function() {
    return this.$("form input.lookup").hide()
  };
  d.prototype.showLookupButton = function() {
    return this.$("form input.lookup").show()
  };
  d.prototype.geocodeClicked = function(a) {
    a.preventDefault();
    return this._geocode()
  };
  d.prototype.save = function(a) {
    a.preventDefault();
    a.stopPropagation();
    a = this.$el;
    this.model.unset("errors");
    this.model.set("description", a.find("#description").val());
    if (this._changed()) return rt.permissions.can("enter_latlng") ? this._saveModel() : this._geocode(this._saveModel);
    rt.app.events.trigger("notify:generic", {
      message: "No changes detected."
    });
    rt.app.router.navigate(this.model.get("path"))
  };
  d.prototype._geocode = function(a) {
    var b, c = this;
    null == a && (a = null);
    b = this.model.validAddress();
    if (null !== b) this.messageView.validationErrors(b);
    else return b = this.model.geocodingAddress(), rt.app.geocoder.geocode({
      address: b
    }, function(b, d) {
      var e;
      return d === google.maps.GeocoderStatus.OK ? (e = b[0].geometry.location, c.model.set({
        latitude: e.lat(),
        longitude: e.lng()
      }), "function" === typeof a ? a() : void 0) : alert("Oops.  There was an issue verifying the address :(\n\nIs the address you entered correct?\n\nIf you continue having problems feel free to contact us at support@???.com!")
    })
  };
  d.prototype._saveModel = function() {
    var a, b, c = this;
    a = this.model._valid();
    if (null !== a) this.messageView.validationErrors(a);
    else return b = this.model.isNew(), this.model.save({}, {
      success: function(d) {
        a = d.get("errors");
        return _.isEmpty(a) ? c._saveImage(b) : c.messageView.saveFailed(a)
      },
      error: function() {
        return c.messageView.saveFailed()
      }
    })
  };
  d.prototype._saveImage = function(a) {
    var b = this;
    return this.imageUploadView.update(this.model.id, function() {
      var c;
      c = !a && !rt.permissions.can("update_poi") ? "Thanks! Your changes have been submitted for review." :
        "Place saved successfully :)";
      rt.app.events.trigger("notify:generic", {
        message: c
      });
      return rt.app.router.navigate(b.model.get("path"))
    }, function() {
      return b.messageView.saveFailed()
    })
  };
  d.prototype._stateAutocompleteSource = function(a, b) {
    var c, d;
    c = $.ui.autocomplete.escapeRegex(a.term.toLowerCase());
    d = RegExp("^" + c);
    c = this.model.get("country");
    c = rt.api.states.states({
      country: c
    });
    c = _(c).filter(function(a) {
      return null !== a.name.toLowerCase().match(d) || null !== a.abbreviation.toLowerCase().match(d)
    });
    c = _(c).map(function(a) {
      return {
        label: a.name,
        value: a.id
      }
    });
    return b(c)
  };
  d.prototype._changed = function() {
    var a, b;
    a = this._hashEditableAttributes();
    b = this.imageUploadView.imageChanged;
    return a !== this.originalHash || b
  };
  d.prototype._hashEditableAttributes = function() {
    var a, b, c = this;
    b = "name address1 city state country latitude longitude zip_code phone email image_attribution approved website subtitle user_rating description".split(" ").map(function(a) {
      return c.model.get(a)
    });
    this.model.has("categories") && (a = this.model.get("categories").join(""));
    b.push(a);
    return b.join("")
  };
  d.prototype.leave = function() {
    this.unbind();
    return this.remove()
  };
  b.NewView = d;
  b = rt.views;
  var f = function() {
    this.showImageUploadMessage = c(this.showImageUploadMessage, this);
    this.validationErrors = c(this.validationErrors, this);
    this.saveFailed = c(this.saveFailed, this);
    this.saveSuccessful = c(this.saveSuccessful, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return f.__super__.constructor.apply(this, arguments)
  };
  a(f, Backbone.View);
  f.prototype.initialize = function() {
    return this.html =
      ""
  };
  f.prototype.render = function() {
    this.$el.html(this.html);
    return this
  };
  f.prototype.saveSuccessful = function() {
    this.html = '<div class="save-successful-message alert-success alert">\n  Save successful :)\n</div>';
    return this.render()
  };
  f.prototype.saveFailed = function() {
    this.html = '<div class="save-failed-message alert-error alert">\n  Save failed :(\n</div>';
    return this.render()
  };
  f.prototype.validationErrors = function(a) {
    null == a && (a = []);
    this.html = '<div class="save-failed-message alert-error alert">\n' + _(a).reduce(function(a, b) {
      return a + ("<div>\n  " + b.message + "\n</div>")
    }, "") + "\n</div>";
    return this.render()
  };
  f.prototype.showImageUploadMessage = function() {
    this.html = '<div class="image-upload-message alert-info alert">\n  Image will be updated when the place is saved.\n</div>';
    return this.render()
  };
  b.MessageView = f
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var e = function() {
    var a = this.render,
      b = this;
    this.render = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["templates/pois/place_search_result"];
  e.prototype.render = function() {
    this.$el.html(this.template({
      model: this.model.toJSON()
    }));
    return this
  };
  b.PlaceSearchResultView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var a = function() {
    this._cleanup = c(this._cleanup, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "place-search-results-view";
  a.prototype.initialize = function() {
    this._debouncedRender = _.debounce(this.render, 100);
    return this.collection.on("reset", this._debouncedRender, this)
  };
  a.prototype.render = function() {
    var a;
    this._cleanup();
    a = document.createDocumentFragment();
    this.subViews = this.collection.map(function(b) {
      b = new rt.views.pois.PlaceSearchResultView({
        model: b
      });
      a.appendChild(b.render().el);
      return b
    });
    this.$el.html(a);
    return this
  };
  a.prototype.remove = function() {
    this._cleanup();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._cleanup = function() {
    if (null != this.subViews) return _(this.subViews).each(function(a) {
      return a.remove()
    }), this.subViews = null
  };
  b.PlaceSearchResultsView = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var e = function() {
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["templates/pois/poi"];
  e.prototype.events = {
    "click .destroy": "destroy"
  };
  e.prototype.tagName = "tr";
  e.prototype.destroy = function() {
    this.model.destroy();
    this.remove();
    return !1
  };
  e.prototype.render = function() {
    $(this.el).html(this.template({
      poi: this.model.toJSON()
    }));
    return this
  };
  b.PoiView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
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
    };
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var d = function() {
    this.shareSummary = c(this.shareSummary, this);
    this.shareTitle = c(this.shareTitle, this);
    this.shareUrl = c(this.shareUrl, this);
    this._changeTab = c(this._changeTab, this);
    this.bookingClicked = c(this.bookingClicked, this);
    this.descriptionTabClicked = c(this.descriptionTabClicked, this);
    this.saveClicked = c(this.saveClicked, this);
    this.addToTripClicked = c(this.addToTripClicked, this);
    this._showFacebookLander = c(this._showFacebookLander, this);
    this.close = c(this.close, this);
    this.remove = c(this.remove, this);
    this.initialize = c(this.initialize, this);
    return d.__super__.constructor.apply(this, arguments)
  };
  a(d, Backbone.View);
  d.prototype.template = JST["templates/pois/show"];
  d.prototype.events = {
    "click .close-notification": "closeNotificationClicked",
    "click .deals-booking.folded": "expandNotificationClicked",
    "click .tab.description": "descriptionTabClicked",
    "click .booking": "bookingClicked",
    "click .add-to-trip": "addToTripClicked",
    "click .save": "saveClicked"
  };
  d.prototype.className = "show-place-view overlay show-description";
  d.prototype.initialize = function(a) {
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
  d.prototype.render = function() {
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
  d.prototype.requestAndRenderBookingInfo = function() {
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
  d.prototype.renderLowRate = function(a) {
    return this.$el.find("a.booking").html("BOOK NOW (from $" + Math.round(a) + ")")
  };
  d.prototype.remove = function() {
    var a, b, c;
    null != (a = this.sidebarView) && a.remove();
    null != (b = this.bookingView) && b.remove();
    null != (c = this.fbSpecialLander) && c.remove();
    return d.__super__.remove.apply(this, arguments)
  };
  d.prototype.close = function() {
    this.remove();
    return rt.app.router.navigate("#")
  };
  d.prototype.afterDomInsertion = function() {
    this.commentsListView.tryToFocusOnSelectedComment();
    return stButtons.locateElements()
  };
  d.prototype._showFacebookLander = function() {
    var a, b, c;
    b = rt.helpers.session.notLoggedIn();
    c = null != document.referrer.match(/facebook.com/);
    a = rt.app.router.initialRoute;
    return c && b && a
  };
  d.prototype.addToTripClicked = function(a) {
    a.preventDefault();
    rt.app.events.trigger("ui:add_to_trip", this.model);
    return rt.app.events.trigger("analytics:trip:add", {
      data: {
        via: "overlay"
      }
    })
  };
  d.prototype.saveClicked = function() {};
  d.prototype.descriptionTabClicked = function() {
    return this._changeTab("description")
  };
  d.prototype.bookingClicked = function() {
    this.bookingView || (this.bookingView = new rt.views.pois.BookingView({
      model: this.model,
      bookingInfo: null
    }));
    return rt.helpers.modal.open({
      view: this.bookingView
    }).on("backdrop-click", rt.helpers.modal.close)
  };
  d.prototype._changeTab = function(a) {
    return this.$el.removeClass("show-description show-booking").addClass("show-" + a)
  };
  d.prototype.shareUrl = function() {
    return "http://???.com/places/" + this.model.id
  };
  d.prototype.shareTitle = function() {
    return null != this.model.get("name") ? null != this.model.get("subtitle") ? "" + this.model.get("name") + ", " + this.model.get("subtitle") : "" + this.model.get("name") : "A place on ???"
  };
  d.prototype.shareSummary = function() {
    return "I just found an awesome place on ???.com!"
  };
  d.prototype.closeNotificationClicked = function(a) {
    a.preventDefault();
    return $(a.target).parent(".deals-booking").addClass("folded")
  };
  d.prototype.expandNotificationClicked = function(a) {
    return $(a.currentTarget).removeClass("folded")
  };
  b.ShowView = d;
  b = rt.views.overlay;
  var f = function() {
    this.authorized = c(this.authorized, this);
    this.actionClicked = c(this.actionClicked, this);
    this.label = c(this.label, this);
    this.fontAwesomeClass = c(this.fontAwesomeClass, this);
    this.dynamicClassName = c(this.dynamicClassName, this);
    return f.__super__.constructor.apply(this, arguments)
  };
  a(f, rt.views.overlay.OverlaySidebarActionView);
  f.prototype.dynamicClassName = function() {
    return "edit-place"
  };
  f.prototype.fontAwesomeClass = function() {
    return "icon-edit"
  };
  f.prototype.label = function() {
    return "Edit"
  };
  f.prototype.actionClicked = function(a) {
    a.preventDefault();
    rt.app.router.navigate(rt.routes.edit_place_path(this.model.get("_id")));
    return !1
  };
  f.prototype.authorized = function() {
    return !0
  };
  b.EditPlaceOverlaySidebarActionView = f;
  b = rt.views.overlay;
  var h = function() {
    this.authorized = c(this.authorized, this);
    this.actionClicked = c(this.actionClicked, this);
    this.label = c(this.label, this);
    this.fontAwesomeClass = c(this.fontAwesomeClass,
    this);
    this.dynamicClassName = c(this.dynamicClassName, this);
    return h.__super__.constructor.apply(this, arguments)
  };
  a(h, rt.views.overlay.OverlaySidebarActionView);
  h.prototype.dynamicClassName = function() {
    return "delete-place"
  };
  h.prototype.fontAwesomeClass = function() {
    return "icon-trash"
  };
  h.prototype.label = function() {
    return "Delete"
  };
  h.prototype.actionClicked = function(a) {
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
  h.prototype.authorized = function() {
    return rt.permissions.can("destroy_poi")
  };
  b.DeletePlaceOverlaySidebarActionView = h
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var e = function() {
    var a = this.render,
      b = this;
    this.render = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["templates/pois/staff_pois"];
  e.prototype.className = "staff-pois";
  e.prototype.render = function() {
    this.$el.html(this.template({
      model: this.model.toJSON()
    }));
    return this
  };
  b.StaffPoisView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).pois || (b.pois = {});
  b = rt.views.pois;
  var a = function() {
    this._search = c(this._search, this);
    this._searchTextChanged = c(this._searchTextChanged, this);
    this._searchTextBlurred = c(this._searchTextBlurred, this);
    this._searchTextFocused = c(this._searchTextFocused, this);
    this._loadNextClicked = c(this._loadNextClicked, this);
    this._loadPreviousClicked = c(this._loadPreviousClicked, this);
    this._searchClicked = c(this._searchClicked,
    this);
    this._searchKeyup = c(this._searchKeyup, this);
    this._cleanup = c(this._cleanup, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/pois/suggest_place"];
  a.prototype.className = "suggest-place-view";
  a.prototype.events = {
    "click .place-search-button": "_searchClicked",
    "keyup .place-search-text": "_searchKeyup",
    "click .js-previous-page": "_loadPreviousClicked",
    "click .js-next-page": "_loadNextClicked",
    "focus .place-search-text": "_searchTextFocused",
    "blur .place-search-text": "_searchTextBlurred"
  };
  a.prototype.initialize = function() {
    this.searchFreshRequester = new rt.helpers.ajax.FreshRequester;
    this.placeSearchResults = new Backbone.Model;
    this.showNewPlaceLink = !1;
    this.model.on("change", this.render, this);
    this.model.on("change:search_text",
    this._searchTextChanged, this);
    return this._searchTextChanged()
  };
  a.prototype.render = function() {
    var a, b, c;
    this._cleanup();
    b = $(this.template({
      model: this.model.toJSON()
    }));
    this.placeholderText = b.find(".place-search-text").attr("placeholder");
    a = b.filter(".results-container");
    c = new rt.collections.PoisCollection(this.model.get("results"));
    this.searchResultsView = new rt.views.pois.PlaceSearchResultsView({
      collection: c
    });
    a.append(this.searchResultsView.render().el);
    a = this.model.get("search_state");
    this.$el.removeClass("no-search results-loading results-loading-initial results-found results-not-found");
    "results-found" === a ? this.$el.addClass("results-found") : "results-not-found" === a ? this.$el.addClass("results-not-found") : "loading-initial" === a ? this.$el.addClass("results-loading-initial") : "loading" === a ? this.$el.addClass("results-loading") : this.$el.addClass("no-search");
    this.$el.html(b[0].parentNode);
    return this
  };
  a.prototype.remove = function() {
    this._cleanup();
    this.model.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._cleanup = function() {
    if (null != this.searchResultsView) return this.searchResultsView.remove(),
    this.searchResultsView = null
  };
  a.prototype._searchKeyup = function(a) {
    if (13 === a.keyCode) return this._searchClicked()
  };
  a.prototype._searchClicked = function() {
    return this.model.set("search_text", this.$(".place-search-text").val())
  };
  a.prototype._loadPreviousClicked = function() {
    if (1 < this.model.get("page")) return this._search(this.model.get("page") - 1)
  };
  a.prototype._loadNextClicked = function() {
    if (this.model.get("page") < this.model.get("pages")) return this._search(this.model.get("page") + 1)
  };
  a.prototype._searchTextFocused = function() {
    var a;
    a = this.$(".place-search-text");
    this.placeholderText = a.attr("placeholder");
    return a.removeAttr("placeholder")
  };
  a.prototype._searchTextBlurred = function() {
    return this.$(".place-search-text").attr("placeholder", this.placeholderText)
  };
  a.prototype._searchTextChanged = function() {
    this.model.unset("search_state");
    return this._search(1)
  };
  a.prototype._search = function(a) {
    var b, c, d, e = this;
    d = this.model.get("search_text");
    if (rt.helpers.string.blank(d)) return this.searchFreshRequester.cancelPending(),
    this.model.clear(), this.render();
    b = {
      profile: "list",
      search_text: d,
      page: a,
      per_page: "6"
    };
    c = new Backbone.Model;
    return this.searchFreshRequester.request(function(a) {
      var d;
      d = e.model.has("search_state") ? "loading" : "loading-initial";
      e.model.set({
        search_state: d,
        results: null,
        total_count: null
      });
      return c.fetch({
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(b),
        success: a,
        url: "/api/v1/pois/search"
      })
    }, function() {
      var a;
      a = c.attributes.response;
      a.search_state = 0 < a.total_count ? "results-found" : "results-not-found";
      e.model.set(a);
      return e.render()
    })
  };
  b.SuggestPlaceView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).search || (b.search = {});
  b = rt.views.search;
  var a = function() {
    this.clicked = c(this.clicked, this);
    this.mouseout = c(this.mouseout, this);
    this.mouseover = c(this.mouseover, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f,
  g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "autocomplete-item";
  a.prototype.events = {
    mouseover: "mouseover",
    mouseout: "mouseout",
    click: "clicked"
  };
  a.prototype.initialize = function() {
    var a;
    this.model.collection.on("select", this.render, this);
    a = this.model.get("action").replace("_", "-");
    return this.$el.addClass("action-" + a)
  };
  a.prototype.render = function() {
    this.$el.html(this.model.get("title"));
    null != this.model.collection ? this.model.collection.getSelected() === this.model ? this.$el.addClass("selected") : this.$el.removeClass("selected") : console.log("collection is null!");
    return this
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.mouseover = function() {
    return this.$el.addClass("hover")
  };
  a.prototype.mouseout = function() {
    return this.$el.removeClass("hover")
  };
  a.prototype.clicked = function() {
    return this.trigger("click", this)
  };
  b.AutocompleteItemView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).search || (b.search = {});
  b = rt.views.search;
  var a = function() {
    this.itemClicked = c(this.itemClicked, this);
    this.removeSubviews = c(this.removeSubviews, this);
    this.renderSubViews = c(this.renderSubViews, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    this.deactivate = c(this.deactivate, this);
    this.activate = c(this.activate, this);
    return a.__super__.constructor.apply(this,
    arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.activate = function() {
    this.activated = !0;
    return this.render()
  };
  a.prototype.deactivate = function() {
    this.activated = !1;
    return this.render()
  };
  a.prototype.className = "autocomplete dropdown-menu";
  a.prototype.initialize = function() {
    this.collection.on("reset", this.render, this);
    return this.activated = !1
  };
  a.prototype.render = function() {
    this.activated && 0 < this.collection.length ? (this.removeSubviews(), this.autocompleteItemViews = this.renderSubViews(rt.views.search.AutocompleteItemView), this.$el.show()) : this.$el.hide();
    return this
  };
  a.prototype.remove = function() {
    this.collection.off(null, null, this);
    this.removeSubviews();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.renderSubViews = function(a) {
    var b, c = this;
    b = this.$el;
    return this.collection.map(function(d) {
      d = new a({
        model: d
      });
      d.on("click", c.itemClicked);
      b.append(d.render().el);
      return d
    })
  };
  a.prototype.removeSubviews = function() {
    var a = this;
    if (null != this.autocompleteItemViews) return _(this.autocompleteItemViews).each(function(b) {
      b.off(null, null, a);
      return b.remove()
    })
  };
  a.prototype.itemClicked = function(a) {
    return this.trigger("click:item", a)
  };
  b.AutocompleteView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).search || (b.search = {});
  b = rt.views.search;
  var a = function() {
    this.reduceAutocompleteToAutocompleteItems = c(this.reduceAutocompleteToAutocompleteItems, this);
    this.triggerAction = c(this.triggerAction, this);
    this.blurSearchText = c(this.blurSearchText, this);
    this.fetchAutocomplete = c(this.fetchAutocomplete, this);
    this.searchTextChanged = c(this.searchTextChanged, this);
    this.selectedAutocompleteItemChanged = c(this.selectedAutocompleteItemChanged, this);
    this.autocompleteItemClicked = c(this.autocompleteItemClicked, this);
    this.mapClicked = c(this.mapClicked, this);
    this.searchTextBlurred = c(this.searchTextBlurred, this);
    this.searchTextFocused = c(this.searchTextFocused, this);
    this.clearSearchClicked = c(this.clearSearchClicked, this);
    this.searchTextKeydown = c(this.searchTextKeydown, this);
    this.searchKeydown = c(this.searchKeydown, this);
    this.searchTextInput = c(this.searchTextInput, this);
    this.removeSubviews = c(this.removeSubviews,
    this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#search";
  a.prototype.className = "search";
  a.prototype.events = {
    "input .search-text": "searchTextInput",
    keydown: "searchKeydown",
    "keydown .search-text": "searchTextKeydown",
    "focus .search-text": "searchTextFocused",
    "blur .search-text": "searchTextBlurred",
    "click .clear-search": "clearSearchClicked"
  };
  a.prototype.initialize = function() {
    this.autocompleteRequester = new rt.helpers.ajax.FreshRequester;
    this.placeholderText = this.$(".search-text").attr("placeholder");
    this.autocompleteItems = new rt.collections.search.AutocompleteItemCollection;
    this.autocompleteView = new rt.views.search.AutocompleteView({
      collection: this.autocompleteItems
    });
    this.autocompleteView.on("click:item", this.autocompleteItemClicked,
    this);
    this.$el.append(this.autocompleteView.render().el);
    this.fetchAutocomplete = _.debounce(this.fetchAutocomplete, 300);
    this.model || (this.model = new Backbone.Model);
    this.model.on("change:search_text", this.searchTextChanged, this);
    this.autocompleteItems.on("select", this.selectedAutocompleteItemChanged, this);
    rt.app.events.on("map:clicked", this.mapClicked, this);
    return this.$("input").placeholder()
  };
  a.prototype.render = function() {
    return this
  };
  a.prototype.remove = function() {
    this.removeSubviews();
    this.model.off(null,
    null, this);
    this.autocompleteItems.off(null, null, this);
    rt.app.events.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.removeSubviews = function() {
    var a, b;
    null != (a = this.autocompleteView) && a.off(null, null, this);
    return null != (b = this.autocompleteView) ? b.remove() : void 0
  };
  a.prototype.searchTextInput = function() {
    var a;
    a = this.$(".search-text").val();
    return this.model.set("search_text", a)
  };
  a.prototype.searchKeydown = function(a) {
    if (38 === a.keyCode) return this.autocompleteItems.selectPrevious(),
    a.preventDefault();
    if (40 === a.keyCode) return this.autocompleteItems.selectNext()
  };
  a.prototype.searchTextKeydown = function(a) {
    if (13 === a.keyCode) {
      a = this.autocompleteItems.getSelected();
      if (null != a) return this.triggerAction(a);
      if (0 < this.autocompleteItems.size()) return a = this.autocompleteItems.first(), this.autocompleteItems.setSelected(a), this.triggerAction(a)
    }
  };
  a.prototype.clearSearchClicked = function() {
    this.$(".search-text").val("");
    this.model.clear();
    this.autocompleteItems.reset();
    return rt.app.events.trigger("action:clear_places_search_on_map")
  };
  a.prototype.searchTextFocused = function() {
    var a, b;
    a = this.$(".search-text");
    this.placeholderText = a.attr("placeholder");
    a.removeAttr("placeholder");
    this.model.has("searchable") ? (b = this.model.get("searchable"), this.model.unset("searchable"), a.val(b), this.autocompleteItems.reset(), this.model.set("search_text", b)) : this.model.get("restore") && (this.model.unset("restore"), this.autocompleteItems.setSelected(null), this.$("search-text").val(this.model.get("restorable")));
    this.autocompleteView.activate();
    return rt.app.events.on("key:escape",
    this.blurSearchText, this)
  };
  a.prototype.searchTextBlurred = function() {
    var a = this;
    this.$(".search-text").attr("placeholder", this.placeholderText);
    rt.app.events.off("key:escape", null, this);
    return _.delay(function() {
      return a.autocompleteView.deactivate()
    }, 100)
  };
  a.prototype.mapClicked = function() {
    return this.blurSearchText()
  };
  a.prototype.autocompleteItemClicked = function(a) {
    a = a.model;
    this.autocompleteItems.setSelected(a);
    return this.triggerAction(a)
  };
  a.prototype.selectedAutocompleteItemChanged = function(a) {
    return null != a ? this.$(".search-text").val(a.get("title")) : this.$(".search-text").val(this.model.get("search_text"))
  };
  a.prototype.searchTextChanged = function() {
    return this.fetchAutocomplete()
  };
  a.prototype.fetchAutocomplete = function() {
    var a, b, c = this;
    this.autocompleteRequester.cancelPending();
    b = this.model.get("search_text");
    if (null == b || 0 >= b.length) this.autocompleteItems.reset();
    else return a = new rt.models.search.Autocomplete(null, {
      search_text: b
    }), b = function(b) {
      return a.fetch({
        success: b
      })
    }, this.autocompleteRequester.request(b,

    function() {
      var b;
      b = c.reduceAutocompleteToAutocompleteItems(a);
      return c.autocompleteItems.reset(b)
    })
  };
  a.prototype.blurSearchText = function() {
    return this.$(".search-text").blur()
  };
  a.prototype.triggerAction = function(a) {
    var b;
    a.get("searchable") ? this.model.set("searchable", a.get("title")) : this.model.set("restore", !0);
    this.blurSearchText();
    b = null != a ? a.get("search_text") : void 0;
    if ("search_places" === a.get("action")) return rt.app.events.trigger("action:show_places_search_on_map", b);
    if ("suggest_place" === a.get("action")) return rt.app.router.navigate("" + rt.routes.suggest_place_path() + "?search_text=" + b)
  };
  a.prototype.reduceAutocompleteToAutocompleteItems = function(a) {
    var b, c;
    b = [];
    c = a.get("search_text");
    a = a.get("places");
    0 < a.length && (1 < a.length && b.push(new rt.models.search.AutocompleteItem({
      action: "search_places",
      search_text: c,
      title: "Show all for '" + c + "'...",
      searchable: !1
    })), _(a).each(function(a) {
      return b.push(new rt.models.search.AutocompleteItem({
        action: "search_places",
        search_text: a,
        title: a,
        searchable: !0
      }))
    }));
    b.push(new rt.models.search.AutocompleteItem({
      action: "suggest_place",
      search_text: c,
      title: "Suggest a place...",
      searchable: !1
    }));
    return b
  };
  b.SearchView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).session || (b.session = {});
  b = rt.views.session;
  var a = function() {
    this._navigateAfterLogin = c(this._navigateAfterLogin, this);
    this.updateErrors = c(this.updateErrors, this);
    this.submit = c(this.submit, this);
    this.formValues = c(this.formValues, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/session/login"];
  a.prototype.className = "session-view";
  a.prototype.events = {
    "click button[type=submit]": "submit",
    "click div.login-button": "oauthLogin"
  };
  a.prototype.initialize = function() {
    var a = this;
    _.bindAll(this);
    this.session = new rt.models.Session;
    this.session.on("change:errors", this.updateErrors);
    return rt.app.events.on("session:login", function() {
      return a.trigger("success")
    })
  };
  a.prototype.render = function() {
    this.$el.html(this.template());
    this.$("input").placeholder();
    return this
  };
  a.prototype.formValues = function() {
    var a, b;
    a = this.$el;
    b = {};
    _.each(["username_or_email", "password", "remember_me"], function(c) {
      return b[c] = a.find("#" + c).val()
    });
    return b
  };
  a.prototype.submit = function(a) {
    var b = this;
    a.preventDefault();
    this.session.unset("errors");
    this.session.set(this.formValues());
    return this.session.save({}, {
      success: function(a, c) {
        var d;
        a.unset("password");
        if (!_.has(c, "errors")) return d = new rt.models.User({
          id: a.get("user_id")
        }), d.fetch({
          success: function(a) {
            rt.app.currentUser.set("user", d);
            rt.app.events.trigger("session:login");
            b.trigger("success");
            rt.app.events.trigger("analytics:session:login", {
              data: {
                email: a.get("email")
              }
            });
            return b._navigateAfterLogin()
          }
        })
      },
      error: function(a) {
        return a.set({
          errors: ["There was an error validating your login.  Please try again."]
        })
      }
    })
  };
  a.prototype.updateErrors = function() {
    var a = this;
    if (this.session.has("errors")) return _.each(this.session.get("errors"),

    function(b) {
      return a.$(".alert").append(b)
    }), this.$('form input[type="text"], form input[type="password"]').parents(".control-group").addClass("error"), this.$(".alert").fadeIn();
    this.$("form .error").removeClass("error");
    return this.$(".alert").empty().hide()
  };
  a.prototype.oauthLogin = function(a) {
    var b = this;
    a.preventDefault();
    return rt.helpers.facebook.connect({
      success: function() {
        return b._navigateAfterLogin()
      },
      error: function() {
        return alert("Oops, something went wrong :(")
      }
    })
  };
  a.prototype._navigateAfterLogin = function() {
    var a;
    a = this.model.has("return_to") ? this.model.get("return_to") : rt.routes.root_path();
    return rt.app.router.navigate(a)
  };
  b.LoginView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_nav || (b.side_nav = {});
  b = rt.views.side_nav;
  var a = function() {
    this.addPlace = c(this.addPlace, this);
    this.animateExplore = c(this.animateExplore, this);
    this.removeFindPlaceHint = c(this.removeFindPlaceHint, this);
    this.addFindPlaceHint = c(this.addFindPlaceHint, this);
    this.hideSidebar = c(this.hideSidebar, this);
    this.toggleSidebarVisibility = c(this.toggleSidebarVisibility, this);
    this.updateSidebarVisibility = c(this.updateSidebarVisibility, this);
    this.clickMoreItem = c(this.clickMoreItem, this);
    this._navigateReplaceMode = c(this._navigateReplaceMode, this);
    this.clickNavItem = c(this.clickNavItem, this);
    this.changeMode = c(this.changeMode, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.adminTemplate = JST["templates/side_nav/admin_side_nav"];
  a.prototype.el = "#sideNav";
  a.prototype.events = {
    "click .nav-item": "clickNavItem",
    "click .more": "clickMoreItem"
  };
  a.prototype.initialize = function(a) {
    this.navMode = a.navMode;
    this.navMode.on("change:mode", this.changeMode);
    rt.app.events.on("ui:route", this.addFindPlaceHint);
    rt.app.events.on("sidebar:toggle", this.toggleSidebarVisibility);
    rt.app.events.on("sidebar:hide", this.hideSidebar);
    return rt.permissions.on("change", this.render)
  };
  a.prototype.render = function() {
    this.changeMode();
    this.$(".other-side-nav-container").html(this.adminTemplate());
    return this
  };
  a.prototype.changeMode = function() {
    var a;
    a = this.fake_mode || this.navMode.get("mode");
    this.$("a.nav-item").removeClass("active");
    this.$("a.nav-item[data-mode=" + a + "]").addClass("active");
    "explore" === a && this.removeFindPlaceHint();
    if (this.fake_mode) return this.hideSidebar()
  };
  a.prototype.clickNavItem = function(a) {
    var b, c;
    a.preventDefault();
    b = $(a.currentTarget);
    this.fake_mode = null;
    a = b.toggleClass("active").data("mode");
    c = a === this.navMode.get("mode");
    this.updateSidebarVisibility(c);
    if (_.contains(["support",
      "settings"], a)) return this.fake_mode = a, this.changeMode(), rt.app.router.navigate(b.attr("href"), {
      trigger: !0
    });
    c && this.changeMode();
    return this._navigateReplaceMode(a)
  };
  a.prototype._navigateReplaceMode = function(a) {
    var b;
    b = rt.app.router.uri();
    b.setSearch("mode", a);
    a = "" + b.path() + b.search();
    return rt.app.router.navigate(a, {
      replace: !0
    })
  };
  a.prototype.clickMoreItem = function(a) {
    a.preventDefault();
    return $(a.currentTarget).parent().toggleClass("second-nav")
  };
  a.prototype.updateSidebarVisibility = function(a) {
    if (a) return this.toggleSidebarVisibility();
    if ($("body").hasClass("hide-sidebar")) return $("body").removeClass("hide-sidebar"), rt.app.events.trigger("map:resize", {
      method: "grow"
    })
  };
  a.prototype.toggleSidebarVisibility = function() {
    return $("body").hasClass("hide-sidebar") ? ($("body").removeClass("hide-sidebar"), rt.app.events.trigger("map:resize", {
      method: "grow"
    })) : this.hideSidebar()
  };
  a.prototype.hideSidebar = function() {
    $("body").addClass("hide-sidebar");
    return rt.app.events.trigger("map:resize", {
      method: "shrink"
    })
  };
  a.prototype.addFindPlaceHint = function() {
    return this.$("a.nav-item[data-mode=explore] i.asterix").show()
  };
  a.prototype.removeFindPlaceHint = function() {
    rt.app.events.off("ui:route");
    return this.$("a.nav-item[data-mode=explore] i.asterix").hide()
  };
  a.prototype.animateExplore = function() {
    return this.$("a.nav-item[data-mode=explore]").pulse({
      color: "#70DBDB"
    }, {
      returnDelay: 500,
      interval: 1E3,
      pulses: 6
    }, function() {
      return this.removeAttr("style")
    })
  };
  a.prototype.addPlace = function(a) {
    a.preventDefault();
    return rt.app.router.navigate("staff/pois/new", {
      trigger: !0
    })
  };
  b.SideNavView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_bar || (b.side_bar = {});
  b = rt.views.side_bar;
  var a = function() {
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "add-place-sidebar-item-view";
  a.prototype.template = JST["templates/sidebar/add_place_sidebar_item"];
  a.prototype.render = function() {
    this.$el.html(this.template());
    return this
  };
  a.prototype.remove = function() {
    return a.__super__.remove.apply(this, arguments)
  };
  b.AddPlaceSidebarItemView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).sidebar || (b.sidebar = {});
  b = rt.views.sidebar;
  var a = function() {
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/sidebar/admin_sidebar"];
  a.prototype.el = "#admin";
  a.prototype.initialize = function() {
    _.bindAll(this);
    return rt.permissions.on("change", this.render, this)
  };
  a.prototype.render = function() {
    this.$el.html(this.template());
    return this
  };
  a.prototype.remove = function() {
    rt.permisions.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  b.AdminSidebarView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_bar || (b.side_bar = {});
  b = rt.views.side_bar;
  var a = function() {
    this.renderCategory = c(this.renderCategory, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function(a) {
    return this.categoryGroup = a.categoryGroup
  };
  a.prototype.render = function() {
    var a = this;
    _.each(this.categoryGroup.get("categories"), function(b) {
      return a.renderCategory(b)
    });
    return this
  };
  a.prototype.renderCategory = function(a) {
    return (new rt.views.side_bar.CategoryView({
      model: a,
      el: ".category[data-category-id='" + a.id + "']"
    })).render()
  };
  b.CategoriesView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_bar || (b.side_bar = {});
  b = rt.views.side_bar;
  var a = function() {
    this.activateCategories = c(this.activateCategories, this);
    this.deactivateCategories = c(this.deactivateCategories, this);
    this.clickCategoryGroup = c(this.clickCategoryGroup, this);
    this.updateActiveChildrenState = c(this.updateActiveChildrenState, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  },
  d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.events = {
    click: "clickCategoryGroup",
    "click .all-off": "deactivateCategories",
    "click .all-on": "activateCategories"
  };
  a.prototype.initialize = function(a) {
    var b, c, d, e;
    this.categoryGroup = a.categoryGroup;
    d = this.categoryGroup.get("categories");
    e = [];
    b = 0;
    for (c = d.length; b < c; b++) a = d[b], e.push(a.bind("change:active", this.updateActiveChildrenState));
    return e
  };
  a.prototype.render = function() {
    (new rt.views.side_bar.CategoriesView({
      categoryGroup: this.categoryGroup,
      el: this.$(".categories")[0]
    })).render();
    return this
  };
  a.prototype.updateActiveChildrenState = function(a) {
    if (a.get("active")) return this.$el.find(".group").addClass("active-children");
    if (!this.categoryGroup.hasActiveCategory()) return this.$el.find(".group").removeClass("active-children")
  };
  a.prototype.clickCategoryGroup = function(a) {
    a.preventDefault();
    return 0 < this.$el.find(".categories.in.collapse").length ? this.$el.find(".group a").removeClass("on") : this.$el.find(".group a").addClass("on")
  };
  a.prototype.deactivateCategories = function(a) {
    a.preventDefault();
    this.$el.find(".all-on").removeClass("activated");
    return this.categoryGroup.deactivateCategories()
  };
  a.prototype.activateCategories = function(a) {
    a.preventDefault();
    this.$el.find(".all-on").addClass("activated");
    return this.categoryGroup.activateCategories()
  };
  b.CategoryGroupView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_bar || (b.side_bar = {});
  b = rt.views.side_bar;
  var a = function() {
    this.clickCategory = c(this.clickCategory, this);
    this._poisReset = c(this._poisReset, this);
    this.updateStatus = c(this.updateStatus, this);
    this.setInactive = c(this.setInactive, this);
    this.setActive = c(this.setActive, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.events = {
    click: "clickCategory"
  };
  a.prototype.initialize = function() {
    this.model.bind("change:active", this.updateStatus, this);
    return rt.context.activeCategoriesPoisCollection.on("reset", this._poisReset, this)
  };
  a.prototype.render = function() {
    return this
  };
  a.prototype.setActive = function() {
    return this.$el.parent("li").addClass("active")
  };
  a.prototype.setInactive = function() {
    this.$el.parent("li").removeClass("active");
    return this.$(".count").hide()
  };
  a.prototype.updateStatus = function() {
    return this.model.get("active") ? this.setActive() : this.setInactive()
  };
  a.prototype._poisReset = function(a) {
    var b;
    b = this.model.get("_id");
    a = a.reduce(function(a, c) {
      _.contains(c.get("categories"), b) && (a += 1);
      return a
    }, 0);
    this.model.set("poi_count", a);
    return this.model.get("active") ? (a = this.model.get("poi_count"), this.$(".count").html(a).show()) : this.$(".count").hide()
  };
  a.prototype.clickCategory = function(a) {
    a.preventDefault();
    this.model.get("active") ? rt.app.events.trigger("removeCategory", this.model.id) : (rt.app.events.trigger("addCategory", this.model.id), rt.app.events.trigger("analytics:category:view", {
      data: {
        category: this.model.id
      }
    }));
    return this.model.toggleActiveState()
  };
  b.CategoryView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_bar || (b.side_bar = {});
  b = rt.views.side_bar;
  var a = function() {
    this.slideSlider = c(this.slideSlider, this);
    this.sliderStopped = c(this.sliderStopped, this);
    this.sliderStarted = c(this.sliderStarted, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f,
  g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.sliding = !1;
  a.prototype.el = "#slider-container";
  a.prototype.events = {
    "click .decrement": "decreaseDistance",
    "click .increment": "increaseDistance"
  };
  a.prototype.initialize = function() {
    this.distances = this.model.get("distanceValues");
    rt.app.events.on("trip:activated", this.show, this);
    return rt.app.events.on("trip:reseted", this.hide, this)
  };
  a.prototype.render = function() {
    var a;
    a = {
      range: "min",
      value: this.distances.indexOf(this.model.get("distance")),
      min: 0,
      max: this.distances.length - 1,
      step: 1,
      slide: this.slideSlider,
      start: this.sliderStarted,
      stop: this.sliderStopped
    };
    return $("#distanceSlider").hasClass("ui-slider") ? $("#distanceSlider").slider("option", a) : $("#distanceSlider").slider(a)
  };
  a.prototype.show = function() {
    return this.$el.closest(".upper").addClass("visible")
  };
  a.prototype.hide = function() {
    return this.$el.closest(".upper").removeClass("visible")
  };
  a.prototype.sliderStarted = function() {
    return this.sliding = !0
  };
  a.prototype.sliderStopped = function() {
    return this.sliding = !1
  };
  a.prototype.slideSlider = function(a, b) {
    this.model.set({
      distance: this.distances[b.value]
    });
    return rt.app.events.trigger("analytics:distance_slider:update", {
      data: {
        distance: this.distances[b.value]
      }
    })
  };
  a.prototype.decreaseDistance = function(a) {
    var b;
    a.preventDefault();
    b = this.$("#distanceSlider").slider("value");
    a = this.$("#distanceSlider").slider("option", "min");
    if (b > a) return this.$("#distanceSlider").slider("value", b - 1)
  };
  a.prototype.increaseDistance = function(a) {
    var b;
    a.preventDefault();
    b = this.$("#distanceSlider").slider("value");
    a = this.$("#distanceSlider").slider("option", "max");
    if (b < a) return this.$("#distanceSlider").slider("value", b + 1)
  };
  b.DistanceSliderView = a
}).call(this);
(function() {
  var b, c, e = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, a = {}.hasOwnProperty;
  (b = rt.views).sidebar || (b.sidebar = {});
  (c = rt.views.sidebar).guides || (c.guides = {});
  b = rt.views.sidebar.guides;
  var d = function() {
    this.active = e(this.active, this);
    this.updateActive = e(this.updateActive, this);
    this.guidesReset = e(this.guidesReset, this);
    this.imageSourceChanged = e(this.imageSourceChanged, this);
    this.guideClicked = e(this.guideClicked, this);
    this.remove = e(this.remove, this);
    this.render = e(this.render,
    this);
    this.url = rt.app.models.url;
    d.__super__.constructor.apply(this, arguments)
  }, f = d;
  c = Backbone.View;
  var h = function() {
    this.constructor = f
  }, g;
  for (g in c) a.call(c, g) && (f[g] = c[g]);
  h.prototype = c.prototype;
  f.prototype = new h;
  f.__super__ = c.prototype;
  d.prototype.template = JST["templates/sidebar/guide"];
  d.prototype.tagName = "li";
  d.prototype.className = "guide-view group";
  d.prototype.events = {
    "click a": "guideClicked"
  };
  d.prototype.initialize = function() {
    _.bindAll(this);
    this.url.on("change", this.updateActive);
    this.model.on("change:image_source",
    this.imageSourceChanged);
    return this.views = []
  };
  d.prototype.render = function() {
    var a;
    a = {
      user: this.model.toJSON(),
      guide_path: rt.routes.guide_path(this.model.get("guide_name"))
    };
    this.$el.html(this.template(a));
    this.updateActive();
    stButtons.locateElements();
    return this
  };
  d.prototype.remove = function() {
    this.model.off(null, null, this);
    return d.__super__.remove.apply(this, arguments)
  };
  d.prototype.guideClicked = function(a) {
    a.preventDefault();
    return rt.app.router.navigate(rt.routes.guide_path(this.model.get("guide_name")))
  };
  d.prototype.imageSourceChanged = function(a, b) {
    return this.$(".image").attr("src", b)
  };
  d.prototype.guidesReset = function() {
    return this.render()
  };
  d.prototype.updateActive = function() {
    return this.active() ? this.$("a").addClass("active") : this.$("a").removeClass("active")
  };
  d.prototype.active = function() {
    return "guide" === this.url.get("type") && this.url.get("id") === this.model.get("username")
  };
  b.GuideView = d
}).call(this);
(function() {
  var b, c, e = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, a = {}.hasOwnProperty;
  (b = rt.views).sidebar || (b.sidebar = {});
  (c = rt.views.sidebar).guides || (c.guides = {});
  b = rt.views.sidebar.guides;
  var d = function() {
    this._addGuideView = e(this._addGuideView, this);
    this.guidesReset = e(this.guidesReset, this);
    this.guideRemoved = e(this.guideRemoved, this);
    this.guideAdded = e(this.guideAdded, this);
    this.render = e(this.render, this);
    return d.__super__.constructor.apply(this, arguments)
  }, f = d;
  c = Backbone.View;
  var h = function() {
    this.constructor = f
  }, g;
  for (g in c) a.call(c, g) && (f[g] = c[g]);
  h.prototype = c.prototype;
  f.prototype = new h;
  f.__super__ = c.prototype;
  d.prototype.el = "#sidebar_guides_view";
  d.prototype.initialize = function() {
    _.bindAll(this);
    this.collection.on("add", this.guideAdded);
    this.collection.on("remove", this.guideRemoved);
    this.collection.on("reset", this.guidesReset);
    return this.views = []
  };
  d.prototype.render = function() {
    _(this.views).each(function(a) {
      return a.remove()
    });
    this.views = [];
    this.collection.each(this._addGuideView);
    return this
  };
  d.prototype.guideAdded = function(a, b, c) {
    return this._addGuideView(a, c.index)
  };
  d.prototype.guideRemoved = function(a, b, c) {
    return this.views.splice(c.index, 1)[0].remove()
  };
  d.prototype.guidesReset = function() {
    return this.render()
  };
  d.prototype._addGuideView = function(a, b) {
    var c, d;
    d = new rt.views.sidebar.guides.GuideView({
      model: a
    });
    d.render();
    this.views.splice(b, 0, d);
    c = this.$(".guide-view:nth-child(" + (b + 1) + ")");
    return 1 === c.length ? c.before(d.el) : this.$("ul").append(d.el)
  };
  b.GuidesView = d
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_bar || (b.side_bar = {});
  b = rt.views.side_bar;
  var a = function() {
    this.submit = c(this.submit, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/sidebar/new_bucket_list"];
  a.prototype.className = "new-bucket-list";
  a.prototype.tagName = "div";
  a.prototype.events = {
    submit: "submit"
  };
  a.prototype.initialize = function() {
    _.bindAll(this);
    this.bucketList = new rt.models.BucketList;
    return rt.app.events.on("key:escape", this.close)
  };
  a.prototype.render = function() {
    this.$el.html(this.template());
    return this
  };
  a.prototype.submit = function(a) {
    var b = this;
    a.preventDefault();
    this.bucketList.set({
      name: this.$("#bucket_list_name").val(),
      description: this.$("#bucket_list_description").val()
    });
    return this.bucketList.save({}, {
      success: function(a) {
        a.set({
          pois: a.get("pois")
        });
        rt.app.events.trigger("analytics:bucket_list:added");
        rt.app.events.trigger("bucket_lists:add", a);
        rt.app.events.trigger("notify:bucket_list:created");
        return b.trigger("closed")
      },
      error: function() {
        return rt.app.events.trigger("notify:generic", {
          message: "An error occurred creating a new bucket list!"
        })
      }
    })
  };
  b.NewBucketListView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_bar || (b.side_bar = {});
  b = rt.views.side_bar;
  var a = function() {
    this.deactivateAll = c(this.deactivateAll, this);
    this.hide = c(this.hide, this);
    this.show = c(this.show, this);
    this.renderCategoryGroup = c(this.renderCategoryGroup, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#placesExplorer";
  a.prototype.events = {
    "click .post-groups .all-off": "deactivateAll"
  };
  a.prototype.initialize = function(a) {
    this.distanceSlider = new rt.views.side_bar.DistanceSliderView({
      model: a.distanceSlider
    });
    return this.addPlaceSidebarItemView = new rt.views.side_bar.AddPlaceSidebarItemView
  };
  a.prototype.render = function() {
    this.model.get("categoryGroups").each(this.renderCategoryGroup);
    this.distanceSlider.render();
    this.$(".add-place-sidebar-item-container").html(this.addPlaceSidebarItemView.render().el);
    return this
  };
  a.prototype.remove = function() {
    this.distanceSlider.remove();
    this.addPlaceSidebarItemView.remove();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.renderCategoryGroup = function(a) {
    var b;
    b = a.get("name");
    return (new rt.views.side_bar.CategoryGroupView({
      categoryGroup: a,
      el: ".category-groups div[data-group-name='" + b + "']"
    })).render()
  };
  a.prototype.show = function() {
    return this.$el.show()
  };
  a.prototype.hide = function() {
    return this.$el.hide()
  };
  a.prototype.deactivateAll = function(a) {
    a.preventDefault();
    return this.model.get("categoryGroups").each(function(a) {
      return a.deactivateCategories()
    })
  };
  b.PlacesExplorerView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).side_bar || (b.side_bar = {});
  b = rt.views.side_bar;
  var a = function() {
    this.clickAboutApp = c(this.clickAboutApp, this);
    this.clickShowPost = c(this.clickShowPost, this);
    this.clickAboutTeam = c(this.clickAboutTeam, this);
    this.clickAbout = c(this.clickAbout, this);
    this.changeMode = c(this.changeMode, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#sidebar";
  a.prototype.events = {
    "click .app": "clickAboutApp",
    "click .about": "clickAbout",
    "click .team": "clickAboutTeam",
    "click .post": "clickShowPost"
  };
  a.prototype.initialize = function(a) {
    _.bindAll(this);
    this.placesExplorer = new rt.models.PlacesExplorer({
      categories: a.categories
    });
    this.placesExplorerView = new rt.views.side_bar.PlacesExplorerView({
      model: this.placesExplorer,
      distanceSlider: a.distanceSlider
    });
    this.tripPlannerView = new rt.trip_planner.views.TripPlannerView({
      model: a.activeTrip
    });
    this.guidesSidebarView = new rt.views.sidebar.guides.GuidesView({
      collection: a.featuredUsersCollection
    });
    this.myStuffView = new rt.views.my_stuff.MyStuffView({
      bucketLists: a.bucketLists,
      trips: a.trips,
      activeTrip: a.activeTrip
    });
    this.adminSidebarView = new rt.views.sidebar.AdminSidebarView;
    this.blogSidebarView = new rt.blog.views.Sidebar({
      posts: a.blogPostsCollection
    });
    this.navMode = a.navMode;
    return this.navMode.on("change:mode",
    this.changeMode)
  };
  a.prototype.render = function() {
    this.blogSidebarView.render();
    this.tripPlannerView.render();
    this.placesExplorerView.render();
    this.guidesSidebarView.render();
    this.myStuffView.render();
    this.adminSidebarView.render();
    this.changeMode();
    return this
  };
  a.prototype.changeMode = function() {
    var a;
    a = this.navMode.get("mode");
    this.$(".sidebar-item").removeClass("active");
    return this.$(".sidebar-item[data-mode=" + a + "]").addClass("active")
  };
  a.prototype.clickAbout = function(a) {
    a.preventDefault();
    return rt.app.router.navigate("/about", {
      trigger: !0
    })
  };
  a.prototype.clickAboutTeam = function(a) {
    a.preventDefault();
    return rt.app.router.navigate("/about/team", {
      trigger: !0
    })
  };
  a.prototype.clickShowPost = function(a) {
    a.preventDefault();
    a = $(a.target);
    a.hasClass("post") || (a = a.parent(".post"));
    return rt.app.router.navigate(a.attr("href"), {
      trigger: !0
    })
  };
  a.prototype.clickAboutApp = function(a) {
    a.preventDefault();
    return rt.app.router.navigate("/about/app", {
      trigger: !0
    })
  };
  b.SidebarView = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).staff_dashboard || (b.staff_dashboard = {});
  b = rt.views.staff_dashboard;
  var e = function() {
    var a = this.render,
      b = this;
    this.render = function() {
      return a.apply(b, arguments)
    };
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.template = JST["templates/staff_dashboard/staff_dashboard"];
  e.prototype.className =
    "staff-dashboard-view";
  e.prototype.render = function() {
    this.$el.html(this.template());
    return this
  };
  b.StaffDashboardView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).support || (b.support = {});
  b = rt.views.support;
  var a = function() {
    this.toggleElement = c(this.toggleElement, this);
    this.changeTab = c(this.changeTab, this);
    this.toggleAlert = c(this.toggleAlert, this);
    this.updateErrors = c(this.updateErrors, this);
    this.close = c(this.close, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f,
  g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.isSupportPageView = !0;
  a.prototype.template = JST["templates/support/support_page"];
  a.prototype.className = "support-pages-view";
  a.prototype.events = {
    "click .tabs a": "changeTab",
    "click dd": "toggleElement",
    "submit form#contact-us": "sendUserFeedback"
  };
  a.prototype.initialize = function() {
    rt.app.events.on("key:escape", this.close);
    this.sessionFacade = rt.app.facades.sessionFacade;
    this.feedback = new rt.models.UserFeedback;
    return this.feedback.on("change:errors", this.updateErrors)
  };
  a.prototype.render = function() {
    var a;
    null != (a = this.sidebarView) && a.remove();
    this.sidebarView = null;
    this.$el.html(this.template({
      loggedIn: this.sessionFacade.loggedIn()
    }));
    this.sidebarView = new rt.views.overlay.OverlaySidebarView;
    this.sidebarView.render();
    this.$(".support-page").prepend(this.sidebarView.el);
    this.delegateEvents();
    return this
  };
  a.prototype.close = function() {
    var a;
    this.remove();
    return "back" === (null != (a = this.options) ? a.restoreState : void 0) ? window.history.back() : rt.app.router.navigate("/", {
      trigger: !1
    })
  };
  a.prototype.sendUserFeedback = function(a) {
    var b, c, d, e = this;
    a.stopPropagation();
    a.preventDefault();
    c = $(a.target);
    b = c.find("button");
    d = {};
    c.serializeArray().forEach(function(a) {
      return d[a.name] = a.value
    });
    this.feedback.unset("errors");
    this.toggleAlert("");
    c.addClass("sending");
    b.attr("disabled", "disabled");
    return this.feedback.save(d, {
      success: function() {
        b.removeAttr("disabled");
        c.removeClass("sending");
        a.target.reset();
        e.updateErrors();
        return e.toggleAlert("Feedback sent. We will contact you soon!", !0)
      },
      error: function(a, d) {
        b.removeAttr("disabled");
        c.removeClass("sending");
        return e.feedback.set({
          errors: JSON.parse(d.responseText).errors
        })
      }
    })
  };
  a.prototype.updateErrors = function() {
    var a, b, c, d, e;
    this.$(".add-on").hide().data("tooltip", null).parents(".control-group").removeClass("error");
    a = this.feedback.get("errors");
    e = [];
    for (c in a) {
      if (0 < (null != a ? null != (d = a[c]) ? d.length : void 0 : void 0)) b = _.reduce(a[c], function(a, b) {
        return a + (b + ", ")
      },
        "").replace(/\,\ $/, ""), this.$("form#contact-us input[name=" + c + "], form#contact-us textarea[name=" + c + "]").siblings(".add-on").show().data({
        tooltip: null
      }).tooltip({
        title: b,
        placement: "right"
      }).parents(".control-group").addClass("error");
      e.push(this.toggleAlert("Feedback data is invalid."))
    }
    return e
  };
  a.prototype.toggleAlert = function(a, b) {
    var c;
    null == b && (b = !1);
    c = this.$(".alert").hide().empty().removeClass("alert-success");
    if (0 < a.length) return b && c.addClass("alert-success"), c.html(a).show()
  };
  a.prototype.changeTab = function(a) {
    a.preventDefault();
    this.$(".active").removeClass("active");
    $(a.currentTarget).parent().addClass("active");
    this.$(".tabpane.active").removeClass("active");
    a = $(a.currentTarget).attr("data-target");
    return this.$("#" + a).addClass("active")
  };
  a.prototype.toggleElement = function(a) {
    a.preventDefault();
    $(a.currentTarget).hasClass("open") || (this.$("dt.open").slideToggle().removeClass("open"), this.$("dd.open").removeClass("open"));
    return $(a.currentTarget).toggleClass("open").next().slideToggle().toggleClass("open")
  };
  b.SupportPageView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).tooltips || (b.tooltips = {});
  b = rt.views.tooltips;
  var a = function() {
    this.categoryAddedFromPlacesExplorer = c(this.categoryAddedFromPlacesExplorer, this);
    this.tripNotShown = c(this.tripNotShown, this);
    this.tripShown = c(this.tripShown, this);
    this.hideTooltip = c(this.hideTooltip, this);
    this.tooltipClicked = c(this.tooltipClicked, this);
    this.render = c(this.render, this);
    this.initialize = c(this.initialize, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#distance-slider-tooltip";
  a.prototype.events = {
    click: "tooltipClicked"
  };
  a.prototype.initialize = function() {
    this.displayTooltip = !1;
    rt.app.events.on("addCategory", this.categoryAddedFromPlacesExplorer);
    rt.app.events.on("tripShowing", this.tripShown);
    return rt.app.events.on("tripNotShowing",
    this.tripNotShown)
  };
  a.prototype.render = function() {
    return this.displayTooltip ? ($(this.el).show(300), _.delay(this.hideTooltip, 5E3)) : $(this.el).hide(300)
  };
  a.prototype.tooltipClicked = function() {
    return this.hideTooltip()
  };
  a.prototype.hideTooltip = function() {
    this.displayTooltip = !1;
    return this.render()
  };
  a.prototype.tripShown = function() {
    return this.tripShowing = !0
  };
  a.prototype.tripNotShown = function() {
    return this.tripShowing = !1
  };
  a.prototype.categoryAddedFromPlacesExplorer = function() {
    if (this.tripShowing) return this.displayTooltip = !0, this.render(), rt.app.events.off("addCategory", this.categoryAddedFromPlacesExplorer), rt.app.events.off("tripShowing", this.tripShown), rt.app.events.off("tripNotShowing", this.tripNotShown)
  };
  b.DistanceSliderTooltipView = a
}).call(this);
(function() {
  var b, c = {}.hasOwnProperty;
  (b = rt.views).top_nav || (b.top_nav = {});
  b = rt.views.top_nav;
  var e = function() {
    return e.__super__.constructor.apply(this, arguments)
  }, a = e,
    d = Backbone.View,
    f = function() {
      this.constructor = a
    }, h;
  for (h in d) c.call(d, h) && (a[h] = d[h]);
  f.prototype = d.prototype;
  a.prototype = new f;
  a.__super__ = d.prototype;
  e.prototype.el = "#sidebarHandle";
  e.prototype.events = {
    click: "toggleSidebar"
  };
  e.prototype.toggleSidebar = function(a) {
    a.preventDefault();
    return rt.app.events.trigger("sidebar:toggle")
  };
  b.SidebarHandleView = e
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).top_nav || (b.top_nav = {});
  b = rt.views.top_nav;
  var a = function() {
    this.addPlace = c(this.addPlace, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#topNav";
  a.prototype.events = {
    "click #addPlace": "addPlace"
  };
  a.prototype.initialize = function() {
    return this.userMenuView = new rt.views.top_nav.UserMenuView
  };
  a.prototype.render = function() {
    this.userMenuView.render();
    new rt.views.top_nav.SidebarHandleView;
    return this
  };
  a.prototype.addPlace = function(a) {
    var b, c;
    a.preventDefault();
    return null != (b = rt.app) ? null != (c = b.router) ? c.navigate("staff/pois/new", !0) : void 0 : void 0
  };
  b.TopNavView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).top_nav || (b.top_nav = {});
  b = rt.views.top_nav;
  var a = function() {
    this.anyThreeWaypointsWithLocation = c(this.anyThreeWaypointsWithLocation, this);
    this.updateTripBinding = c(this.updateTripBinding, this);
    this.clickAccount = c(this.clickAccount, this);
    this.tripDirectionsChanged = c(this.tripDirectionsChanged, this);
    this.tripChanged = c(this.tripChanged, this);
    this.routeToRegister = c(this.routeToRegister, this);
    this.routeToLogin = c(this.routeToLogin, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.el = "#userMenu";
  a.prototype.template = JST["templates/top_nav/user_menu_view"];
  a.prototype.events = {
    "click .account": "clickAccount",
    "click .login": "routeToLogin",
    "click .register": "routeToRegister"
  };
  a.prototype.initialize = function() {
    var a;
    _.bindAll(this);
    rt.app.events.bind("session:login", this.render);
    rt.app.events.bind("session:logout", this.render);
    this.sessionFacade = rt.app.facades.sessionFacade;
    a = rt.app.models.activeTrip;
    a.bind("change:trip", this.tripChanged, this);
    return this.updateTripBinding(a.get("trip"))
  };
  a.prototype.render = function() {
    var a, b, c;
    this.$(".login").tooltip("hide");
    b = this.sessionFacade.loggedIn();
    a = {
      loggedIn: b,
      currentUser: null != (c = this.sessionFacade.user()) ? c.toJSON() : void 0
    };
    this.$el.html(this.template(a));
    b || (a = {
      placement: "bottom",
      trigger: "manual"
    }, this.$(".login").tooltip(a).attr("data-original-title", "Don't forget to login or sign up to save your trip!"));
    return this
  };
  a.prototype.routeToLogin = function(a) {
    a.preventDefault();
    return rt.app.router.navigate(rt.routes.login_path({
      return_to: rt.app.router.currentRoute()
    }))
  };
  a.prototype.routeToRegister = function(a) {
    a.preventDefault();
    return rt.app.router.navigate(rt.routes.register_path({
      return_to: rt.app.router.currentRoute()
    }))
  };
  a.prototype.tripChanged = function(a,
  b) {
    return this.updateTripBinding(b)
  };
  a.prototype.tripDirectionsChanged = function() {
    var a, b;
    a = this.sessionFacade.loggedIn();
    b = this.trip.get("trip_directions");
    if (!a && null != b && this.anyThreeWaypointsWithLocation()) return this.$(".login").tooltip("show");
    if (a) return this.$(".login").tooltip("hide")
  };
  a.prototype.clickAccount = function(a) {
    a.preventDefault();
    return rt.app.router.navigate("/settings/account")
  };
  a.prototype.updateTripBinding = function(a) {
    null != this.trip && this.trip.off(null, null, this);
    this.trip = a;
    this.trip.on("change:trip_directions", this.tripDirectionsChanged, this);
    return this.tripDirectionsChanged()
  };
  a.prototype.anyThreeWaypointsWithLocation = function() {
    return 3 <= this.trip.get("waypoints").reduce(function(a, b) {
      b.has("location") && a++;
      return a
    }, 0)
  };
  b.UserMenuView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).trip_stats || (b.trip_stats = {});
  b = rt.views.trip_stats;
  var a = function() {
    this._formattedCost = c(this._formattedCost, this);
    this._formattedTime = c(this._formattedTime, this);
    this._formattedDistance = c(this._formattedDistance, this);
    this.costClicked = c(this.costClicked, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/trips/trip_stats"];
  a.prototype.className = "trip-info";
  a.prototype.events = {
    "click .cost": "costClicked"
  };
  a.prototype.initialize = function() {
    _.bindAll(this);
    return this.model.on("change", this.render, this)
  };
  a.prototype.render = function() {
    var a;
    a = {
      distance: this._formattedDistance(),
      time: this._formattedTime(),
      cost: this._formattedCost()
    };
    this.$el.html(this.template(a));
    return this
  };
  a.prototype.costClicked = function() {
    var a;
    a = this.model.getEffectiveFuelEconomy();
    a = rt.helpers.conversions.kplToMpg(a);
    a = prompt("What fuel economy do you want to use? (MPG):", a);
    a = rt.helpers.conversions.mpgToKpl(a);
    return this.model.set("fuel_economy", a)
  };
  a.prototype._formattedDistance = function() {
    var a;
    a = this.model.get("distance");
    return null == a ? "..." : "" + Math.round(6.21371192E-4 * a) + "mi"
  };
  a.prototype._formattedTime = function() {
    var a, b;
    b = this.model.get("time");
    if (null == b) return "...";
    a = Math.floor(b / 3600);
    b = Math.round(b % 3600 / 60);
    return "" + (0 >= a ? "0" : "" + a) + ":" + (0 >= b ? "00" : 10 <= b ? "" + b : "0" + b)
  };
  a.prototype._formattedCost = function() {
    var a;
    a = this.model.get("cost");
    return null == a ? "..." : "$" + a
  };
  b.TripStatsView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).trips || (b.trips = {});
  b = rt.views.trips;
  var a = function() {
    this.addWaypointIcons = c(this.addWaypointIcons, this);
    this.print = c(this.print, this);
    this.resizeModal = c(this.resizeModal, this);
    this.queueModalResize = c(this.queueModalResize, this);
    this.backClicked = c(this.backClicked, this);
    this.close = c(this.close, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  },
  d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/trips/print"];
  a.prototype.events = {
    "click .print-page": "print",
    "click .back": "backClicked"
  };
  a.prototype.initialize = function(a) {
    this.directions = a.directions;
    this.resizeTimer = null;
    return rt.app.events.on("key:escape", this.close)
  };
  a.prototype.render = function() {
    null != this.sidebarView && (this.sidebarView.remove(),
    this.sidebarView = null);
    this.$el.html(this.template({
      directions: this.directions
    }));
    this.addWaypointIcons();
    $("body").append(this.el);
    this.sidebarView = new rt.views.overlay.OverlaySidebarView;
    this.sidebarView.render();
    this.sidebarView.$el.addClass("unprintable");
    this.$(".overlay").prepend(this.sidebarView.el);
    return this
  };
  a.prototype.close = function() {
    return this.remove()
  };
  a.prototype.backClicked = function(a) {
    a.preventDefault();
    this.close();
    return !1
  };
  a.prototype.queueModalResize = function() {
    clearTimeout(this.resizeTimer);
    return this.resizeTimer = setTimeout(this.resizeModal, 250)
  };
  a.prototype.resizeModal = function() {
    var a, b, c;
    $(window).unbind("resize", this.queueModalResize);
    $(window).bind("resize", this.queueModalResize);
    b = this.$(".overlay-header").offset().top;
    c = $(window).height();
    a = parseInt(this.$(".overlay-body").css("min-height"));
    b = c - b - 60;
    b < a && (b = a);
    return this.$(".overlay-body").height(b)
  };
  a.prototype.print = function(a) {
    a.preventDefault();
    return window.print()
  };
  a.prototype.addWaypointIcons = function() {
    var a;
    a = this.$(".adp-placemark tbody > tr > td > img");
    a.attr("src", "/assets/icon-waypoint.png");
    a.first().attr("src", "/assets/icon-start.png");
    return a.last().attr("src", "/assets/icon-end.png")
  };
  b.PrintView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.views.trips,
    a = function() {
      this._updatePath = b(this._updatePath, this);
      this._tripChanged = b(this._tripChanged, this);
      this._bindTrip = b(this._bindTrip, this);
      this.hide = b(this.hide, this);
      this.show = b(this.show, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.tagName = "a";
  a.prototype.className = "itinerary-action";
  a.prototype.template = _.template('<div class="sidebar-action-icon"><i class="icon-list"></i></div><div class="sidebar-action-label">Itinerary</div>');
  a.prototype.initialize = function() {
    this._bindTrip();
    this.model.on("change:trip", this._tripChanged, this);
    rt.app.events.on("trip:activated", this.show, this);
    return rt.app.events.on("trip:reseted",
    this.hide, this)
  };
  a.prototype.render = function() {
    this.$el.addClass("js-route").addClass("unprintable");
    this.$el.html(this.template());
    return this.$el.hide()
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.show = function() {
    var a;
    if (a = this.trip) if (this.$el.attr("href", rt.routes.itinerary_path(a.id)), !this.$el.is(":visible")) return this.$el.show("slide", null, 500)
  };
  a.prototype.hide = function() {
    if (this.$el.is(":visible")) return this.$el.hide("slide",
    null, 500)
  };
  a.prototype._bindTrip = function() {
    var a;
    null != (a = this.trip) && a.off(null, null, this);
    this.trip = this.model.get("trip");
    return this.trip.on("change:_id", this._updatePath, this)
  };
  a.prototype._tripChanged = function() {
    this._bindTrip();
    return this._updatePath()
  };
  a.prototype._updatePath = function() {
    var a;
    a = this.trip;
    a = a.id ? rt.routes.itinerary_path(a.id) : "#";
    return this.$el.attr("href", a)
  };
  e.TripSummarySidebarItineraryButtonView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).trips || (b.trips = {});
  b = rt.views.trips;
  var a = function() {
    this.updateTripBinding = c(this.updateTripBinding, this);
    this.tripSaved = c(this.tripSaved, this);
    this.waypointsChanged = c(this.waypointsChanged, this);
    this.createdByChanged = c(this.createdByChanged, this);
    this.nameChanged = c(this.nameChanged, this);
    this.idChanged = c(this.idChanged, this);
    this.tripChanged = c(this.tripChanged, this);
    this.renderTripFlag = c(this.renderTripFlag, this);
    this.renderTripStats = c(this.renderTripStats, this);
    this.hide = c(this.hide, this);
    this.show = c(this.show, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/trips/trip_summary"];
  a.prototype.className = "trip-summary-view";
  a.prototype.initialize = function() {
    this.model.on("change:trip", this.tripChanged, this);
    return this.updateTripBinding()
  };
  a.prototype.render = function() {
    var a;
    if (this.tripSaved()) this.show();
    else return this.hide(), this;
    a = {
      tripName: this.trip.get("display_name"),
      tripId: this.trip.id
    };
    this.$el.html(this.template(a));
    this.renderTripFlag();
    this.renderTripStats();
    rt.helpers.app.isMobileScreen() || this.$("a[rel=tooltip]").tooltip();
    return this
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    return a.__super__.remove.apply(this,
    arguments)
  };
  a.prototype.show = function() {
    var a;
    a = this.$el;
    $(".dya").fadeOut(180);
    a.is(":visible") || a.fadeIn(300, function() {
      return a.addClass("visible")
    });
    return rt.app.events.trigger("trip:activated")
  };
  a.prototype.hide = function() {
    var a;
    a = this.$el;
    a.is(":visible") && (a.removeClass("visible"), a.fadeOut(180), $(".dya").fadeIn(300));
    return rt.app.events.trigger("trip:reseted")
  };
  a.prototype.renderTripStats = function() {
    var a;
    null != (a = this.tripStatsView) && a.remove();
    this.tripStatsView = new rt.views.trip_stats.TripStatsView({
      model: this.trip
    });
    return this.$el.append(this.tripStatsView.render().el)
  };
  a.prototype.renderTripFlag = function() {
    if (this.trip.has("flag_image_url")) return this.$el.find(".trip-flag-image").css("background-image", "url(" + this.trip.get("flag_image_url") + ")")
  };
  a.prototype.tripChanged = function() {
    this.updateTripBinding();
    return this.render()
  };
  a.prototype.idChanged = function() {
    return this.render()
  };
  a.prototype.nameChanged = function() {
    return this.render()
  };
  a.prototype.createdByChanged = function() {
    return this.render()
  };
  a.prototype.waypointsChanged = function() {
    if (this.tripSaved()) return this.show()
  };
  a.prototype.tripSaved = function() {
    return null != this.trip.id
  };
  a.prototype.updateTripBinding = function() {
    null != this.trip && this.trip.off(null, null, this);
    this.trip = this.model.get("trip");
    this.trip.on("change:display_name", this.nameChanged, this);
    this.trip.on("change:_id", this.idChanged, this);
    this.trip.on("change:created_by", this.createdByChanged, this);
    this.trip.on("change:waypoints", this.waypointsChanged, this);
    return this.trip.on("change:image_url", this.renderTripFlag,
    this)
  };
  b.TripSummaryView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).users || (b.users = {});
  b = rt.views.users;
  var a = function() {
    this.close = c(this.close, this);
    this.setErrorsOnField = c(this.setErrorsOnField, this);
    this.removeFieldErrors = c(this.removeFieldErrors, this);
    this.fieldHasErrors = c(this.fieldHasErrors, this);
    this.updateErrors = c(this.updateErrors, this);
    this.submit = c(this.submit, this);
    this.formAttributes = c(this.formAttributes, this);
    this.formField = c(this.formField,
    this);
    this.changeTab = c(this.changeTab, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.id = "accountSettings";
  a.prototype.className = "overlay account-settings";
  a.prototype.template = JST["templates/users/account_settings"];
  a.prototype.events = {
    "submit form": "submit",
    "click #user_gravatar": "displayGravatar",
    "click .tabs a": "changeTab"
  };
  a.prototype.formFields = "username current_password password password_confirmation email description tagline website subscribed guide_title guide_name guide_description".split(" ");
  a.prototype.initialize = function() {
    _.bindAll(this);
    this.model.on("change:errors", this.updateErrors);
    rt.app.events.on("key:escape", this.close);
    return this.$("a.js-route").click(function(a) {
      a.preventDefault();
      a = $(this).attr("href");
      return rt.app.router.navigate(a, !0)
    })
  };
  a.prototype.render = function() {
    var a;
    null != (a = this.sidebarView) && a.remove();
    this.sidebarView = null;
    a = {
      user: this.model.toJSON(),
      title: "User Profile & Settings"
    };
    this.$el.html(this.template(a));
    this.sidebarView = new rt.views.overlay.OverlaySidebarView;
    this.sidebarView.render();
    this.$el.prepend(this.sidebarView.el);
    this.userImageUploadView = new rt.views.ImageUploadView({
      imageUrl: this.model.get("image_url"),
      resourceUrl: "/api/v1/users",
      imageAttributeName: "image",
      model: this.model,
      hideAttribution: !0
    });
    this.socialSettingsView = new rt.views.users.SocialConnectionsView({
      user: this.model
    });
    this.socialSettingsView.render();
    this.$el.find(".tabpane#connections").append(this.socialSettingsView.el);
    this.$el.find("#user_image_upload_view").html(this.userImageUploadView.render().$el);
    this.bannerImageUploadView = new rt.views.ImageUploadView({
      imageUrl: this.model.get("banner_image_url"),
      resourceUrl: "/api/v1/users",
      imageAttributeName: "banner_image",
      model: this.model,
      hideAttribution: !0
    });
    this.$el.find("#banner_image_upload_view").html(this.bannerImageUploadView.render().$el);
    this.$("a[rel=tooltip]").tooltip();
    return this
  };
  a.prototype.displayGravatar = function() {
    var a = this;
    return this.model.save({
      gravatar: !this.model.get("gravatar")
    }, {
      success: function() {
        return a.render()
      }
    })
  };
  a.prototype.changeTab = function(a) {
    a.preventDefault();
    this.$(".active").removeClass("active");
    $(a.currentTarget).parent().addClass("active");
    this.$(".tabpane.active").removeClass("active");
    a = $(a.currentTarget).attr("data-target");
    return this.$(a).addClass("active")
  };
  a.prototype.formField = function(a) {
    return this.$("#user_" + a)
  };
  a.prototype.formAttributes = function() {
    var a, b = this;
    a = {};
    _.each(this.formFields, function(c) {
      var d;
      d = b.formField(c);
      return "checkbox" === d.attr("type") ? a[c] = d.is(":checked") : a[c] = d.val()
    });
    return a
  };
  a.prototype.submit = function(a) {
    var b = this;
    a.preventDefault();
    a.stopPropagation();
    this.model.unset("errors");
    this.model.set(this.formAttributes());
    return this.model.save({}, {
      success: function(a) {
        var c, d;
        if (a.has("errors")) return b.$(".alert").html("Oops!").addClass("alert-error").fadeIn();
        b.$(".alert").html("Successfully updated").addClass("alert-success").fadeIn();
        d = function() {};
        c = function() {};
        b.userImageUploadView.update(a.id, d, c);
        return b.bannerImageUploadView.update(a.id, d, c)
      },
      error: function() {
        return this.$(".alert").html("An error occurred trying to update your settings.  Try again and give us a shout if the problem persists.").addClass("alert-error")
      }
    })
  };
  a.prototype.updateErrors = function() {
    var a, b, c, d, e, f, g, h;
    this.$(".alert").removeClass("alert-success").removeClass("alert-error").fadeOut().empty();
    b = this.model.get("errors");
    f = this.formFields;
    h = [];
    d = 0;
    for (e = f.length; d < e; d++) c = f[d], a = this.formField(c), 0 < (null != b ? null != (g = b[c]) ? g.length : void 0 : void 0) ? h.push(this.setErrorsOnField(a, b[c])) : h.push(this.removeFieldErrors(a));
    return h
  };
  a.prototype.fieldHasErrors = function(a) {
    return a.parents("control-group").hasClass("error")
  };
  a.prototype.removeFieldErrors = function(a) {
    return a.siblings(".add-on").hide().data("tooltip", null).parents(".control-group").removeClass("error")
  };
  a.prototype.setErrorsOnField = function(a, b) {
    return a.siblings(".add-on").show().data("tooltip",
    null).tooltip({
      title: _.first(b),
      placement: "right"
    }).parents(".control-group").addClass("error")
  };
  a.prototype.close = function() {
    return this.remove()
  };
  b.AccountSettingsView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).users || (b.users = {});
  b = rt.views.users;
  var a = function() {
    this.closeNotificationClicked = c(this.closeNotificationClicked, this);
    this._userChanged = c(this._userChanged, this);
    this.remove = c(this.remove, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "fb-notification-view";
  a.prototype.template = JST["templates/users/facebook_notification"];
  a.prototype.events = {
    "click .fb-connect": "fbConnectClicked",
    "click .close-notification": "closeNotificationClicked"
  };
  a.prototype.initialize = function() {
    return rt.app.currentUser.on("change:user", this._userChanged, this)
  };
  a.prototype.render = function() {
    this.$el.html(this.template());
    return this
  };
  a.prototype.remove = function() {
    rt.app.currentUser.off(null, null, this);
    return a.__super__.remove.apply(this,
    arguments)
  };
  a.prototype._userChanged = function() {
    if (rt.helpers.session.loggedIn()) return this.close(), rt.app.currentUser.off(null, null, this)
  };
  a.prototype.closeNotificationClicked = function() {
    return this.close()
  };
  a.prototype.fbConnectClicked = function(a) {
    a.preventDefault();
    return rt.helpers.facebook.connect({
      success: this.close,
      error: function() {
        return alert("Oops, there was an issue connecting your facebook :(")
      }
    })
  };
  a.prototype.close = function() {
    return this.$el.slideToggle("slow", _.bind(this.remove, this))
  };
  b.FacebookNotificationView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).users || (b.users = {});
  b = rt.views.users;
  var a = function() {
    this._navigateAfterLogin = c(this._navigateAfterLogin, this);
    this.setErrorsOnField = c(this.setErrorsOnField, this);
    this.removeFieldErrors = c(this.removeFieldErrors, this);
    this.fieldHasErrors = c(this.fieldHasErrors, this);
    this.updateErrors = c(this.updateErrors, this);
    this.showMailSignUp = c(this.showMailSignUp, this);
    this.submit = c(this.submit, this);
    this.formAttributes = c(this.formAttributes, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/users/new"];
  a.prototype.className = "session-view";
  a.prototype.events = {
    "click button[type=submit]": "submit",
    "click div.login-button": "oauthLogin",
    "click .show-mail-signup": "showMailSignUp"
  };
  a.prototype.initialize = function() {
    _.bindAll(this);
    this.user = new rt.models.User;
    return this.user.on("change:errors", this.updateErrors)
  };
  a.prototype.render = function() {
    this.$el.html(this.template({
      user: this.user.toJSON()
    }));
    this.$("input").placeholder();
    return this
  };
  a.prototype.formAttributes = function() {
    var a, b;
    b = this.$("form").serializeArray();
    a = {};
    _.each(b, function(b) {
      var c;
      c = b.name.replace(/user\[(.+)\]/, "$1");
      if (!1 === _.has(a, c) || "0" === a[c]) return a[c] = b.value
    });
    return a
  };
  a.prototype.submit = function(a) {
    var b = this;
    a.preventDefault();
    this.user.unset("errors");
    this.user.set(this.formAttributes());
    return this.user.save({}, {
      success: function(a) {
        if (_.isNumber(a.id)) return rt.app.currentUser.set("user", a), rt.app.events.trigger("session:login"), b.trigger("success"), rt.app.events.trigger("analytics:session:register"), b._navigateAfterLogin()
      },
      error: function() {
        return alert("An error occurred trying to register.  Try again and give us a shout if the problem persists.")
      }
    })
  };
  a.prototype.showMailSignUp = function(a) {
    a.preventDefault();
    $(".signup-way").hide();
    return $(".email-signup").show()
  };
  a.prototype.oauthLogin = function(a) {
    var b = this;
    a.preventDefault();
    return rt.helpers.facebook.connect({
      success: function() {
        return b._navigateAfterLogin()
      },
      error: function() {
        return alert("Oops.  Something went wrong.  Try again.")
      }
    })
  };
  a.prototype.updateErrors = function() {
    var a, b = this;
    this.$(".alert").fadeOut().empty();
    a = this.user.get("errors");
    return this.$("form :input").not('[type="submit"]').not('[type="hidden"]').each(function(c, d) {
      var e, f, g,
      h;
      e = $(d);
      if (f = null != e ? null != (g = e.attr("id")) ? g.slice(5) : void 0 : void 0) return 0 < (null != a ? null != (h = a[f]) ? h.length : void 0 : void 0) ? b.setErrorsOnField(e, a[f]) : b.removeFieldErrors(e)
    })
  };
  a.prototype.fieldHasErrors = function(a) {
    return a.parents("control-group").hasClass("error")
  };
  a.prototype.removeFieldErrors = function(a) {
    return a.siblings(".error-indicator").hide().data("tooltip", null).parents(".control-group").removeClass("error")
  };
  a.prototype.setErrorsOnField = function(a, b) {
    return a.siblings(".error-indicator").show().data("tooltip",
    null).tooltip({
      title: _.first(b),
      placement: "right"
    }).parents(".control-group").addClass("error")
  };
  a.prototype._navigateAfterLogin = function() {
    var a;
    a = this.model.has("return_to") ? this.model.get("return_to") : rt.routes.root_path();
    return rt.app.router.navigate(a)
  };
  b.NewView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).users || (b.users = {});
  b = rt.views.users;
  var a = function() {
    this.facebookErrorHandler = c(this.facebookErrorHandler, this);
    this.linkUserToFacebook = c(this.linkUserToFacebook, this);
    this.updateFacebookInfo = c(this.updateFacebookInfo, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "social";
  a.prototype.template = JST["templates/users/social_connections"];
  a.prototype.events = {
    "click a.connect.facebook": "linkUserToFacebook",
    "click .col.facebook a.disconnect": "disconnectUserFromFacebook"
  };
  a.prototype.initialize = function(a) {
    _.bindAll(this);
    this.user = a.user;
    return rt.app.currentUser.get("identities") ? this.identities = rt.app.currentUser.get("identities") : this.identities = new rt.collections.UserIdentitiesCollection(null, {})
  };
  a.prototype.render = function(a) {
    null == a && (a = {});
    this.$el.html(this.template({
      connections: {},
      errors: a.errors
    }));
    a.soft ? this.renderConnectionStatus(this.identities) : this.identities.fetch({
      success: this.renderConnectionStatus
    });
    return this.$el
  };
  a.prototype.renderConnectionStatus = function(a) {
    a = a.for_provider("facebook");
    this.$(".col > .settings").hide();
    return null != a ? this.$(".col.facebook > .settings.connected").show() : this.$(".col.facebook > .settings.not_connected").show()
  };
  a.prototype.updateFacebookInfo = function(a) {
    this.identities.reset(a);
    return this.renderConnectionStatus(this.identities)
  };
  a.prototype.linkUserToFacebook = function() {
    return rt.helpers.facebook.connect({
      success: this.updateFacebookInfo,
      error: this.facebookErrorHandler
    })
  };
  a.prototype.facebookErrorHandler = function(a) {
    a = $.parseJSON(a.responseText);
    return this.render({
      soft: !0,
      errors: {
        facebook: a
      }
    })
  };
  a.prototype.disconnectUserFromFacebook = function() {
    var a, b = this;
    if (a = this.identities.for_provider("facebook")) return a.destroy({
      success: function() {
        return b.renderConnectionStatus(b.identities)
      }
    })
  };
  b.SocialConnectionsView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).users || (b.users = {});
  b = rt.views.users;
  var a = function() {
    this._searchTextChanged = c(this._searchTextChanged, this);
    this._search = c(this._search, this);
    this._searchTextKeydown = c(this._searchTextKeydown, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f,
  g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/users/staff_users"];
  a.prototype.className = "staff-users-view";
  a.prototype.events = {
    "click .search-button": "_search",
    "keydown .search-text": "_searchTextKeydown"
  };
  a.prototype.initialize = function() {
    return this.model.on("change:search_text", this._searchTextChanged, this)
  };
  a.prototype.render = function() {
    var a;
    a = {
      userSearch: this.model.toJSON(),
      outputArray: function(a, b) {
        return _(a).map(b).join("")
      }
    };
    a = this.template(a);
    this.$el.html(a);
    return this
  };
  a.prototype.remove = function() {
    _(this.views).each(function(a) {
      if (null != this.views) return a.remove()
    });
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._searchTextKeydown = function(a) {
    if (13 === a.keyCode) return this._search()
  };
  a.prototype._search = function() {
    return this.model.set("search_text", this.$(".search-text").val())
  };
  a.prototype._searchTextChanged = function() {
    var a = this;
    return this.model.fetch({
      success: function() {
        return a.render()
      }
    })
  };
  b.StaffUsersView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).users || (b.users = {});
  b = rt.views.users;
  var a = function() {
    this._searchTextChanged = c(this._searchTextChanged, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/users/users_poi_changes"];
  a.prototype.className = "users-poi-changes-view";
  a.prototype.initialize = function() {};
  a.prototype.render = function() {
    this.$el.html(this.template({
      model: this.model.toJSON()
    }));
    return this
  };
  a.prototype._searchTextChanged = function() {
    var a = this;
    return this.model.fetch({
      success: function() {
        return a.render()
      }
    })
  };
  b.UsersPoiChangesView = a
}).call(this);
(function() {
  var b, c = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, e = {}.hasOwnProperty;
  (b = rt.views).welcome || (b.welcome = {});
  b = rt.views.welcome;
  var a = function() {
    this._waypointBlurred = c(this._waypointBlurred, this);
    this._waypointFocused = c(this._waypointFocused, this);
    this._facebookButtonClicked = c(this._facebookButtonClicked, this);
    this._destinationBlurred = c(this._destinationBlurred, this);
    this._originBlurred = c(this._originBlurred, this);
    this._destinationFocused = c(this._destinationFocused,
    this);
    this._originFocused = c(this._originFocused, this);
    this._close = c(this._close, this);
    this._maybeNavigateToTrip = c(this._maybeNavigateToTrip, this);
    this._waypointChanged = c(this._waypointChanged, this);
    this._destinationChanged = c(this._destinationChanged, this);
    this._originChanged = c(this._originChanged, this);
    this.remove = c(this.remove, this);
    this.render = c(this.render, this);
    return a.__super__.constructor.apply(this, arguments)
  }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) e.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["templates/welcome/welcome"];
  a.prototype.className = "welcome-view";
  a.prototype.events = {
    "click a.close-modal": "_close",
    "focus .origin": "_originFocused",
    "focus .destination": "_destinationFocused",
    "blur .origin": "_originBlurred",
    "blur .destination": "_destinationBlurred",
    "click .login-button.facebook-auth": "_facebookButtonClicked"
  };
  a.prototype.initialize = function() {
    this.model.on("change:origin", this._originChanged,
    this);
    return this.model.on("change:destination", this._destinationChanged, this)
  };
  a.prototype.render = function() {
    this.$el.html(this.template());
    this.$("input").placeholder();
    return this
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._originChanged = function() {
    return this._waypointChanged("origin")
  };
  a.prototype._destinationChanged = function() {
    return this._waypointChanged("destination")
  };
  a.prototype._waypointChanged = function(a) {
    var b,
    c = this;
    b = this.model.get(a);
    return rt.helpers.string.blank(b) ? this[a] = null : rt.helpers.places.resolveWaypointFromText({
      inputText: b,
      success: function(b) {
        c[a] = b;
        c.$("." + a).val(b.get("name"));
        return c._maybeNavigateToTrip()
      },
      error: function() {
        return alert("Sorry! We could not find the place entered! Please try again!")
      }
    })
  };
  a.prototype._maybeNavigateToTrip = function() {
    var a;
    if (this.origin && this.destination) return a = new rt.models.Trip({
      waypoints: [this.origin, this.destination],
      legs: [new rt.models.Leg]
    }), a.save(null, {
      success: function() {
        return rt.app.router.navigate(rt.routes.trip_path(a.id))
      },
      error: function() {
        return alert("Oops.  There was a problem creating your trip :(  Try again?")
      }
    })
  };
  a.prototype._close = function() {
    return rt.app.router.navigateBackOrRoot()
  };
  a.prototype._originFocused = function() {
    return this._waypointFocused("origin")
  };
  a.prototype._destinationFocused = function() {
    return this._waypointFocused("destination")
  };
  a.prototype._originBlurred = function() {
    return this._waypointBlurred("origin")
  };
  a.prototype._destinationBlurred = function() {
    return this._waypointBlurred("destination")
  };
  a.prototype._facebookButtonClicked = function() {
    var a = this;
    return rt.helpers.facebook.connect({
      success: function() {
        var b;
        b = a.model.has("return_to") ? a.model.get("return_to") : rt.routes.root_path();
        return rt.app.router.navigate(b)
      },
      error: function() {
        return alert("Oops.  Something went wrong.  Try again?")
      }
    })
  };
  a.prototype._waypointFocused = function(a) {
    var b;
    b = this.$("." + a);
    this["" + a + "PlaceholderText"] = b.attr("placeholder");
    return b.removeAttr("placeholder")
  };
  a.prototype._waypointBlurred = function(a) {
    this.$("." + a).attr("placeholder", this["" + a + "PlaceholderText"]);
    return this.model.set(a, this.$("." + a).val())
  };
  b.WelcomeView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  };
  rt.controllers || (rt.controllers = {});
  var c = rt.controllers,
    e = function(a) {
      this.addWaypoint = b(this.addWaypoint, this);
      this.addToTrip = b(this.addToTrip, this);
      this.sessionRegister = b(this.sessionRegister, this);
      this.categoryView = b(this.categoryView, this);
      this.sessionLogin = b(this.sessionLogin, this);
      this.clearCategories = b(this.clearCategories, this);
      this.distanceSliderUpdate = b(this.distanceSliderUpdate, this);
      this.routeTrip = b(this.routeTrip,
      this);
      this.routeUseHighways = b(this.routeUseHighways, this);
      this.bucketList = b(this.bucketList, this);
      this.newBucketList = b(this.newBucketList, this);
      this.destinationEntered = b(this.destinationEntered, this);
      a.on("analytics:category:view", this.categoryView);
      a.on("analytics:session:login", this.sessionLogin);
      a.on("analytics:session:register", this.sessionRegister);
      a.on("analytics:trip:add", this.addToTrip);
      a.on("analytics:trip:add_waypoint", this.addWaypoint);
      a.on("analytics:categories:clear", this.clearCategories);
      a.on("analytics:distance_slider:update", this.distanceSliderUpdate);
      a.on("analytics:trip:route", this.routeTrip);
      a.on("analytics:use_highways", this.routeUseHighways);
      a.on("analytics:bucket_list:added", this.bucketList);
      a.on("analytics:bucket_list:new", this.newBucketList);
      a.on("analytics:destination", this.destinationEntered)
    };
  e.prototype.destinationEntered = function() {
    this.publishKiss("destination entered");
    return this.publishGoogle("destination", "entered")
  };
  e.prototype.newBucketList = function() {
    this.publishKiss("new bucket list");
    return this.publishGoogle("bucket list", "new")
  };
  e.prototype.bucketList = function(a) {
    var b;
    null == a && (a = {});
    this.publishKiss("added to bucket list", null != a ? a.data : void 0);
    return this.publishGoogle("bucket list", "added", null != a ? null != (b = a.data) ? b.category : void 0 : void 0)
  };
  e.prototype.routeUseHighways = function(a) {
    var b;
    null == a && (a = {});
    this.publishKiss("toggle highways", null != a ? a.data : void 0);
    return this.publishGoogle("trip", "toggle highways", null != a ? null != (b = a.data) ? b.highways.toString() : void 0 : void 0)
  };
  e.prototype.routeTrip = function(a) {
    var b;
    null == a && (a = {});
    this.publishKiss("route trip", null != a ? a.data : void 0);
    return this.publishGoogle("trip", "route", null != a ? null != (b = a.data) ? b.waypoints.toString() : void 0 : void 0)
  };
  e.prototype.distanceSliderUpdate = function(a) {
    var b;
    null == a && (a = {});
    this.publishKiss("update distance slider", null != a ? a.data : void 0);
    return this.publishGoogle("distance slider", "update", null != a ? null != (b = a.data) ? b.distance.toString() : void 0 : void 0)
  };
  e.prototype.clearCategories = function() {
    this.publishKiss("clear categories");
    return this.publishGoogle("categories", "clear")
  };
  e.prototype.sessionLogin = function() {
    this.publishKiss("user login");
    return this.publishGoogle("user", "login")
  };
  e.prototype.categoryView = function(a) {
    var b;
    null == a && (a = {});
    this.publishKiss("category view", null != a ? a.data : void 0);
    return this.publishGoogle("category", "view", null != a ? null != (b = a.data) ? b.category : void 0 : void 0)
  };
  e.prototype.sessionRegister = function() {
    this.publishKiss("user register");
    return this.publishGoogle("user", "register")
  };
  e.prototype.addToTrip = function(a) {
    var b;
    null == a && (a = {});
    this.publishKiss("add to trip", null != a ? a.data : void 0);
    return this.publishGoogle("trip", "add waypoint", null != a ? null != (b = a.data) ? b.via.toString() : void 0 : void 0)
  };
  e.prototype.addWaypoint = function() {
    this.publishKiss("add waypoint");
    return this.publishGoogle("trip", "add waypoint")
  };
  e.prototype.publishGoogle = function(a, b, c) {
    null == c && (c = null);
    if ("undefined" !== typeof _gaq && null !== _gaq) return _gaq.push(["_trackEvent", a, b, c])
  };
  e.prototype.publishKiss = function(a, b) {
    null == b && (b = null);
    if ("undefined" !== typeof _kmq && null !== _kmq) return _kmq.push(["record", a, b])
  };
  c.AnalyticsController = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = rt,
    e = function(a) {
      this._trackPageView = b(this._trackPageView, this);
      this._unserialize = b(this._unserialize, this);
      this._normalizedRoute = b(this._normalizedRoute, this);
      this._parseRouteParameters = b(this._parseRouteParameters, this);
      this._findRoute = b(this._findRoute, this);
      this._popstate = b(this._popstate, this);
      this._navigate = b(this._navigate, this);
      this._pathToRegExp = b(this._pathToRegExp, this);
      this._initializeHistory = b(this._initializeHistory,
      this);
      this._initializeRoutes = b(this._initializeRoutes, this);
      this.currentRoute = b(this.currentRoute, this);
      this.uri = b(this.uri, this);
      this.navigate = b(this.navigate, this);
      this.start = b(this.start, this);
      this.processPath = b(this.processPath, this);
      this._initializeRoutes();
      this._initializeHistory();
      this.initialize(a)
    }, a, d, f;
  d = /:\w+/g;
  f = /\*\w+/g;
  a = /[-[\]{}()+?.,\\^$|#\s]/g;
  e.prototype.initialRoute = !0;
  e.prototype.processPath = function(a) {
    return a
  };
  e.prototype.start = function() {
    var a;
    a = window.location.href;
    this.processPath(a);
    return this._navigate(a, this.history.replaceState)
  };
  e.prototype.navigate = function(a, b) {
    var c, d, e;
    this.initialRoute = !1;
    a = this.processPath(a);
    if (null != this.currentState || null != b && b.replace) if (c = null != (d = this.currentState) ? d.serialize() : void 0, d = this.history.getState(), e = null != b && b.replace ? a : d.url, this.history.replaceState(c, d.title, e), null != b && b.replace) return;
    return this._navigate(a, this.history.pushState)
  };
  e.prototype.uri = function() {
    return new URI(this.history.getState().url)
  };
  e.prototype.currentRoute = function() {
    var a;
    a = this.uri();
    return "" + a.path() + a.search()
  };
  e.prototype._initializeRoutes = function() {
    var a = this;
    return this.routes = _.map(this.routes, function(b, c) {
      var d;
      d = {
        path: a._pathToRegExp(c)
      };
      b = b.split(" ");
      1 < b.length ? (d.getState = a[b[0]], d.render = a[b[1]]) : d.backboneCallback = a[b[0]];
      return d
    })
  };
  e.prototype._initializeHistory = function() {
    this.history = window.History;
    return History.Adapter.bind(window, "statechange", this._popstate)
  };
  e.prototype._pathToRegExp = function(b) {
    b = b.replace(a, "\\$&").replace(d,
      "([^/]+)").replace(f, "(.*?)");
    return RegExp("^" + b + "$")
  };
  e.prototype._navigate = function(a, b) {
    var c, d, e, f, m = this;
    f = (new URI(a)).normalize();
    c = function(c, d, e) {
      null == d && (d = document.title);
      null == e && (e = a);
      return b(c, d, e)
    };
    e = this._findRoute(f);
    this._currentRoute = this._normalizedRoute(f);
    d = this._parseRouteParameters(e, f);
    d.push(f.search(!0));
    if (null != e.getState) return f = function(a) {
      var b;
      m.currentState = a;
      b = null != a ? a.serialize() : void 0;
      e.render.call(m, a);
      return c(b)
    }, d.unshift(f), e.getState.apply(this, d);
    e.backboneCallback.apply(this, d);
    return c(null)
  };
  e.prototype._popstate = function() {
    var a, b, c;
    c = this.history.getState();
    a = this._unserialize(c.data);
    c = (new URI(c.url)).normalize();
    this._trackPageView(c);
    b = this._normalizedRoute(c);
    if (this._currentRoute !== b) {
      this.currentState = a;
      this._currentRoute = b;
      b = this._findRoute(c);
      if (null != b.getState) return b.render.call(this, a);
      a = this._parseRouteParameters(b, c);
      a.push(c.search(!0));
      return b.backboneCallback.apply(this, a)
    }
  };
  e.prototype._findRoute = function(a) {
    var b;
    b = a.path().replace(/^\//, "");
    return _.find(this.routes, function(a) {
      return a.path.test(b)
    })
  };
  e.prototype._parseRouteParameters = function(a, b) {
    var c;
    c = b.path().replace(/^\//, "");
    return a.path.exec(c).slice(1)
  };
  e.prototype._normalizedRoute = function(a) {
    return "" + a.path() + a.search() + a.hash()
  };
  e.prototype._unserialize = function(a) {
    var b;
    if (null != (null != a ? a.type : void 0)) return b = a.type, a = a.attributes, new(rt.utils.getClassByName(b))(a, {
      parse: !0
    })
  };
  e.prototype._trackPageView = function(a) {
    if ("undefined" !== typeof _gaq && null !== _gaq) return _gaq.push(["_trackPageview", "" + a.path() + a.search()])
  };
  c.Router = e
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.routers,
    a = function() {
      this.myStuff = b(this.myStuff, this);
      this.explore = b(this.explore, this);
      this.plan = b(this.plan, this);
      this.showPlaceEditor = b(this.showPlaceEditor, this);
      this.showPoiChangeRequest = b(this.showPoiChangeRequest, this);
      this.showPoiChangeRequests = b(this.showPoiChangeRequests, this);
      this.showStaffPois = b(this.showStaffPois, this);
      this.editPlace = b(this.editPlace, this);
      this.newPlace = b(this.newPlace,
      this);
      this.suggestPlace = b(this.suggestPlace, this);
      this.showUsersPlaceChanges = b(this.showUsersPlaceChanges, this);
      this.showStaffUsers = b(this.showStaffUsers, this);
      this.showStaffDashboard = b(this.showStaffDashboard, this);
      this.showSupportPage = b(this.showSupportPage, this);
      this.showBlogPost = b(this.showBlogPost, this);
      this.showInfoPage = b(this.showInfoPage, this);
      this.showAboutApp = b(this.showAboutApp, this);
      this.showAboutTeam = b(this.showAboutTeam, this);
      this.showAboutPressKit = b(this.showAboutPressKit, this);
      this.showAbout = b(this.showAbout, this);
      this.accountSettings = b(this.accountSettings, this);
      this.showItinerary = b(this.showItinerary, this);
      this.showTrip = b(this.showTrip, this);
      this.newTrip = b(this.newTrip, this);
      this.showGuide = b(this.showGuide, this);
      this.getGuide = b(this.getGuide, this);
      this.showPlace = b(this.showPlace, this);
      this.getPlace = b(this.getPlace, this);
      this.getPlaceId = b(this.getPlaceId, this);
      this.welcome = b(this.welcome, this);
      this.register = b(this.register, this);
      this.login = b(this.login, this);
      this["default"] = b(this["default"],
      this);
      this.navigateBackOrRoot = b(this.navigateBackOrRoot, this);
      this.back = b(this.back, this);
      this.map = b(this.map, this);
      this._popstate = b(this._popstate, this);
      this.processPath = b(this.processPath, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = rt.Router,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.routes = {
    "places/:id/edit": "editPlace",
    "places/suggest": "suggestPlace",
    "places/new": "newPlace",
    "places/:id": "getPlaceId showPlace",
    "places/:slug/:id": "getPlace showPlace",
    "trips/new": "newTrip",
    "trips/:id": "showTrip",
    "trips/:id/itinerary": "showItinerary",
    "settings/account": "accountSettings",
    "guides/:username": "getGuide showGuide",
    login: "login",
    register: "register",
    welcome: "welcome",
    plan: "plan",
    explore: "explore",
    "my-stuff": "myStuff",
    about: "showAbout",
    "about/press-kit": "showAboutPressKit",
    "about/team": "showAboutTeam",
    "about/app": "showAboutApp",
    support: "showSupportPage",
    "blog/:slug": "showBlogPost",
    "poi-change-requests": "showPoiChangeRequests",
    "poi-change-requests/:id": "showPoiChangeRequest",
    staff: "showStaffDashboard",
    "staff/dashboard": "showStaffDashboard",
    "staff/users": "showStaffUsers",
    "staff/users/place-changes": "showUsersPlaceChanges",
    "staff/pois": "showStaffPois",
    "staff/pois/new": "newPlace",
    "staff/pois/:id/edit": "editPlace",
    "trips/:id/directions": "showItinerary",
    ":guide_name": "getGuide showGuide",
    "": "default"
  };
  a.prototype.initialize = function(a) {
    null == a && (a = {});
    this.controllers = a.controllers;
    this.url = a.url;
    this.navMode = a.navMode;
    this.activeTrip = a.activeTrip;
    this.tripCollection = a.tripCollection;
    this.userCollection = a.userCollection;
    this.sessionFacade = a.sessionFacade;
    this.categories = a.categories;
    this.pois = a.pois;
    this.blogPostsCollection = a.blogPostsCollection;
    this.blogPostsCollection.on("post_found", function(a) {
      return rt.helpers.overlay.open(new rt.blog.views.BlogView({
        model: a
      }))
    });
    rt.app.events.on("navigate:map", this.map);
    rt.app.events.on("navigate:back", this.back);
    this.navigationCounter = 0;
    return this
  };
  a.prototype.processPath = function(a) {
    var b;
    b = new URI(a);
    a = b.search(!0);
    null != a.mode ? this.navMode.set("mode", a.mode) : (a.mode = this.navMode.get("mode"), b.search(a));
    return b.toString()
  };
  a.prototype._popstate = function() {
    var b;
    b = (new URI(this.history.getState().url)).search(!0);
    null != b.mode && this.navMode.set("mode", b.mode);
    return a.__super__._popstate.apply(this, arguments)
  };
  a.prototype.map = function() {
    var a;
    rt.helpers.modal.close();
    rt.helpers.overlay.close();
    a = this.activeTrip.get("trip");
    return a.isNew() ? this.navigate("/trips/new?mode=" + this.navMode.get("mode")) : this.navigate("/trips/" + a.id + "?mode=" + this.navMode.get("mode"))
  };
  a.prototype.back = function() {
    return this.history.back()
  };
  a.prototype.navigateBackOrRoot = function() {
    return this.initialRoute ? this.navigate("/") : this.back()
  };
  a.prototype["default"] = function() {
    rt.helpers.modal.close();
    rt.helpers.overlay.close();
    return this.url.set({
      type: null,
      id: null
    })
  };
  a.prototype.login = function(a) {
    a = new Backbone.Model({
      return_to: a.return_to
    });
    a = new rt.views.session.LoginView({
      model: a
    });
    return rt.helpers.modal.open({
      view: a
    }).on("backdrop-click", this.navigateBackOrRoot, this)
  };
  a.prototype.register = function(a) {
    a = new Backbone.Model({
      return_to: a.return_to
    });
    a = new rt.views.users.NewView({
      model: a
    });
    return rt.helpers.modal.open({
      view: a
    }).on("backdrop-click", this.navigateBackOrRoot, this)
  };
  a.prototype.welcome = function(a) {
    a = new Backbone.Model({
      return_to: a.return_to
    });
    a = new rt.views.welcome.WelcomeView({
      model: a
    });
    return rt.helpers.modal.open({
      view: a
    })
  };
  a.prototype.getPlaceId = function(a, b) {
    return (new rt.models.MappingPoi({
      _id: b
    })).fetch({
      success: function(b) {
        b.has("categories") && 0 < b.get("categories").length && b.set("categoryId", b.get("categories")[0]);
        return a(b, "rt.models.MappingPoi")
      }
    })
  };
  a.prototype.getPlace = function(a, b, c) {
    return this.getPlaceId(a, c)
  };
  a.prototype.showPlace = function(a) {
    rt.helpers.app.isMobileScreen() && rt.app.events.trigger("sidebar:hide");
    return rt.helpers.overlay.open(new rt.views.pois.ShowView({
      model: a,
      activeTrip: this.activeTrip
    }))
  };
  a.prototype.getGuide = function(a, b) {
    return (new rt.models.Guide({
      guide_name: b
    })).fetch({
      success: function(b) {
        b = new rt.guide.models.Guide(null, {
          guide: b
        });
        return a(b)
      }
    })
  };
  a.prototype.showGuide = function(a) {
    rt.helpers.app.isMobileScreen() && rt.app.events.trigger("sidebar:hide");
    a = new rt.guide.views.GuideView({
      model: a
    });
    return rt.helpers.overlay.open(a)
  };
  a.prototype.newTrip = function() {
    rt.helpers.modal.close();
    rt.helpers.overlay.close();
    this.url.set({
      type: "trip",
      id: null
    });
    if (!this.activeTrip.get("trip").isNew()) return this.activeTrip.set("trip",
    this.tripCollection["new"]())
  };
  a.prototype.showTrip = function(a) {
    var b, c = this;
    null == a && (a = null);
    rt.helpers.modal.close();
    rt.helpers.overlay.close();
    this.url.set({
      type: "trip",
      id: a
    });
    b = this.activeTrip.get("trip");
    if (null == b || b.id !== a) return this.tripCollection.getById(a, function(a) {
      return c.activeTrip.set("trip", a)
    })
  };
  a.prototype.showItinerary = function(a) {
    var b, c = this;
    b = this.activeTrip.get("trip", b);
    return (null != b ? b.id : void 0) === a ? (rt.helpers.overlay.open(new rt.itinerary.views.ItineraryView({
      model: this.activeTrip
    })),
    stButtons.locateElements()) : this.tripCollection.getById(a, function(a) {
      return null != a ? (c.activeTrip.set("trip", a), rt.helpers.overlay.open(new rt.itinerary.views.ItineraryView({
        model: c.activeTrip
      })), stButtons.locateElements()) : alert("Oops, there was a problem retrieving the itinerary :(")
    })
  };
  a.prototype.accountSettings = function() {
    var a, b, c = this;
    this.url.set({
      type: "settings",
      id: "account"
    });
    b = new rt.models.User;
    a = b.url;
    b.url = "/api/v1/current_user";
    b.fetch({
      success: function(a) {
        return rt.helpers.overlay.open(new rt.views.users.AccountSettingsView({
          model: a
        }))
      },
      error: function() {
        return c.map()
      }
    });
    return b.url = a
  };
  a.prototype.showAbout = function() {
    this.url.set({
      type: "about"
    });
    this.showInfoPage();
    return rt.helpers.overlay.overlayView.showAboutTab()
  };
  a.prototype.showAboutPressKit = function() {
    this.url.set({
      type: "press_kit"
    });
    this.showInfoPage();
    return rt.helpers.overlay.overlayView.showPressKitTab()
  };
  a.prototype.showAboutTeam = function() {
    this.url.set({
      type: "team"
    });
    this.showInfoPage();
    return rt.helpers.overlay.overlayView.showTeamTab()
  };
  a.prototype.showAboutApp = function() {
    this.url.set({
      type: "app"
    });
    return rt.helpers.overlay.open(new rt.views.info.AppPageView)
  };
  a.prototype.showInfoPage = function() {
    var a;
    return null != (a = rt.helpers.overlay.overlayView) && a.isInfoPageView ? rt.helpers.modal.close() : rt.helpers.overlay.open(new rt.views.info.InfoPageView)
  };
  a.prototype.showBlogPost = function(a) {
    this.url.set({
      type: "blogs"
    });
    return this.blogPostsCollection.findBySlug(a)
  };
  a.prototype.showSupportPage = function() {
    var a;
    if (null != (a = rt.helpers.overlay.overlayView) && a.isSupportPageView) return rt.helpers.modal.close();
    this.url.set({
      type: "support"
    });
    return rt.helpers.overlay.open(new rt.views.support.SupportPageView)
  };
  a.prototype.showStaffDashboard = function() {
    var a;
    a = new rt.views.staff_dashboard.StaffDashboardView;
    a = new rt.views.overlay.OverlayView({
      view: a
    });
    return rt.helpers.overlay.open(a)
  };
  a.prototype.showStaffUsers = function(a) {
    var b;
    b = new rt.models.UserSearch({
      search_text: a.search_text
    });
    return b.fetch({
      success: function() {
        var a;
        a = new rt.views.users.StaffUsersView({
          model: b
        });
        a = new rt.views.overlay.OverlayView({
          view: a
        });
        return rt.helpers.overlay.open(a)
      }
    })
  };
  a.prototype.showUsersPlaceChanges = function(a) {
    var b;
    b = new rt.models.PoiChangeUsersQuery({
      time_period: a.time_period
    });
    return b.fetch({
      success: function() {
        var a;
        a = new rt.views.users.UsersPoiChangesView({
          model: b
        });
        a = new rt.views.overlay.OverlayView({
          view: a
        });
        return rt.helpers.overlay.open(a)
      }
    })
  };
  a.prototype.suggestPlace = function(a) {
    var b;
    null != a.search_text && (b = a.search_text);
    return rt.app.facades.sessionFacade.loggedIn() ? (a = new rt.views.pois.SuggestPlaceView({
      model: new Backbone.Model({
        search_text: b
      })
    }),
    a = rt.helpers.modal.open({
      view: a
    }), a.on("backdrop-click", this.navigateBackOrRoot, this)) : this.navigate(rt.routes.login_path())
  };
  a.prototype.newPlace = function(a) {
    var b;
    return rt.app.facades.sessionFacade.loggedIn() ? (b = {}, null != a.name && (b.name = a.name), this.showPlaceEditor(new rt.models.Poi(b))) : this.navigate(rt.routes.login_path())
  };
  a.prototype.editPlace = function(a) {
    var b = this;
    return rt.app.facades.sessionFacade.loggedIn() ? (new rt.models.Poi({
      _id: a
    })).fetch({
      success: this.showPlaceEditor,
      error: function() {
        return b.map()
      }
    }) : this.navigate(rt.routes.login_path())
  };
  a.prototype.showStaffPois = function(a) {
    var b;
    b = new rt.models.pois.PoisQuery({
      query_params: {
        import_batch_name: a.import_batch_name,
        imageless_batch: a.imageless_batch,
        factual_dupes: a.factual_dupes,
        name_dupes: a.name_dupes,
        loc_dupes: a.loc_dupes,
        needs_content_review: a.needs_content_review
      }
    });
    return b.fetch({
      success: function() {
        var a;
        a = new rt.views.pois.StaffPoisView({
          model: b
        });
        a = new rt.views.overlay.OverlayView({
          view: a
        });
        return rt.helpers.overlay.open(a)
      }
    })
  };
  a.prototype.showPoiChangeRequests = function(a) {
    var b, c;
    a = _(a).reduce(function(a, b, c) {
      _(["review_required", "user_id"]).contains(c) && (a[c] = b);
      return a
    }, {});
    if (!(null != (b = rt.helpers.overlay.overlayView) && b.isPoiChangeRequestsView)) return b = new rt.collections.PoiChangeRequestsCollection, c = new rt.views.PoiChangeRequestsView({
      collection: b,
      review_required: a.review_required
    }), c = new rt.views.overlay.OverlayView({
      view: c
    }), rt.helpers.overlay.open(c), b.fetch({
      data: a
    })
  };
  a.prototype.showPoiChangeRequest = function(a) {
    var b, c = this;
    a = new rt.models.PoiChangeRequest({
      _id: a
    });
    b = new rt.views.PoiChangeRequestView({
      model: a
    });
    return a.fetch({
      success: function() {
        return rt.helpers.modal.open({
          view: b
        }).on("backdrop-click", c.navigateBackOrRoot, c)
      }
    })
  };
  a.prototype.showPlaceEditor = function(a) {
    a = new rt.views.pois.NewView({
      model: a,
      categories: this.categories,
      currentUser: rt.app.currentUser.get("user")
    });
    return rt.helpers.modal.open({
      view: a
    }).on("backdrop-click", this.navigateBackOrRoot, this)
  };
  a.prototype.plan = function() {
    return this.navigate("/?mode=plan")
  };
  a.prototype.explore = function() {
    return this.navigate("/?mode=explore")
  };
  a.prototype.myStuff = function() {
    return this.navigate("/?mode=my-stuff")
  };
  e.MapRouter = a
}).call(this);
(function() {
  var b, c, e, a;
  (b = window.rt).guide || (b.guide = {});
  (c = window.rt.guide).collections || (c.collections = {});
  (e = window.rt.guide).models || (e.models = {});
  (a = window.rt.guide).views || (a.views = {})
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.guide.collections,
    a = function() {
      this.serialize = b(this.serialize, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Collection,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.comparator = function(a, b) {
    var c, d;
    c = a.get("updated_at");
    d = b.get("updated_at");
    return c > d ? -1 : c < d ? 1 : 0
  };
  a.prototype.initialize = function(a, b) {
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
  a.prototype.serialize = function() {
    return this.map(function(a) {
      return a.serialize()
    })
  };
  a.prototype.bucketListBelongs = function(a) {
    return null != a.name
  };
  e.GuideItemCollection = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.guide.models,
    a = function() {
      this.serialize = b(this.serialize, this);
      this.parse = b(this.parse, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.initialize = function(a, b) {
    var c, d = this;
    if (null != (null != b ? b.guide : void 0)) return c = b.guide, _("username tagline website image_mini_url image_thumb_url banner_image guide_name guide_title guide_description".split(" ")).each(function(a) {
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
    })
  };
  a.prototype.parse = function(a) {
    _(["all_collection", "bucket_list_collection", "trip_collection"]).each(function(b) {
      var c;
      c = _(a[b]).map(function(a) {
        var b;
        b = a.type;
        a = a.attributes;
        return new(rt.utils.getClassByName(b))(a, {
          parse: !0
        })
      });
      return a[b] = new rt.guide.collections.GuideItemCollection(c)
    });
    return a
  };
  a.prototype.serialize = function() {
    return rt.utils.serializeModel(this, "rt.guide.models.Guide")
  };
  e.Guide = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.guide.models,
    a = function() {
      this.serialize = b(this.serialize, this);
      this.parse = b(this.parse, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.defaults = {
    icon_class: "pushpin",
    empty_message: "Bucket list has no places"
  };
  a.prototype.initialize = function(a, b) {
    var c, d;
    if (null != (null != b ? b.bucketList : void 0)) return c = b.bucketList, this.set("updated_at", c.updated_at), this.set("title", c.name), this.set("path", null), d = _(c.poi_ids).map(function(a) {
      return {
        poi_id: a
      }
    }), this.set("poi_ids", new Backbone.Collection(d)), this.set("image_path", c.image_url), this.set("active", !1), this.set("parent_class", b.parentClass)
  };
  a.prototype.parse = function(a) {
    a.poi_ids = new Backbone.Collection(a.poi_ids);
    return a
  };
  a.prototype.serialize = function() {
    return rt.utils.serializeModel(this,
      "rt.guide.models.GuideBucketList")
  };
  e.GuideBucketList = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.guide.models,
    a = function() {
      this.serialize = b(this.serialize, this);
      this.parse = b(this.parse, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.Model,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.defaults = {
    icon_class: "road",
    empty_message: "Trip has no places"
  };
  a.prototype.initialize = function(a, b) {
    var c, d;
    if (null != (null != b ? b.trip : void 0)) return d = b.trip, this.set("updated_at", d.updated_at), this.set("title", d.display_name), this.set("path", rt.routes.trip_path(d._id)), c = _(d.waypoints).filter(function(a) {
      return null != a.poi_id
    }), c = _(c).map(function(a) {
      return {
        poi_id: a.poi_id
      }
    }), this.set("poi_ids", new Backbone.Collection(c)), this.set("image_path", d.image_url), this.set("active", !1), this.set("parent_class", b.parentClass)
  };
  a.prototype.parse = function(a) {
    a.poi_ids = new Backbone.Collection(a.poi_ids);
    return a
  };
  a.prototype.serialize = function() {
    return rt.utils.serializeModel(this, "rt.guide.models.GuideTrip")
  };
  e.GuideTrip = a
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/guide/templates/guide"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a, b, d, j, n;
      c.push('<div class="overlay-container">\n  <div class="header">\n  ');
      null != (null != (a = this.guide) ? null != (b = a.banner_image) ? b.standard_url : void 0 : void 0) ? (c.push('\n    <img src="'), c.push(e(null != (d = this.guide) ? null != (j = d.banner_image) ? j.standard_url : void 0 : void 0)), c.push('" id="user-image">\n  ')) : c.push('\n    <img src="/assets/guides_default.jpg" id="user-image">\n  ');
      c.push('\n    <div class="title">');
      c.push(e(this.guide.guide_title));
      c.push('</div>\n    <div class="subtitle">');
      c.push(e(this.guide.tagline));
      c.push('</div>\n\n    <ul class="actions">\n      <li class="dropdown">\n        <a data-toggle="dropdown" href="#" class="dropdown-toggle">Share<i class="icon-share-trip"></i></a>\n        <ul class="dropdown-menu">\n          <li><span class=\'st_facebook\' st_url="');
      c.push(e(this.url));
      c.push('" st_title="');
      c.push(e(this.shareTitle));
      c.push('" st_summary="');
      c.push(e(this.shareSummary));
      c.push('" st_image="/rt/trip_share_thumb.jpg"></span></li>\n          <li><span class=\'st_twitter\' st_url="');
      c.push(e(this.url));
      c.push('" st_title="');
      c.push(e(this.shareTitle));
      c.push('" st_summary="');
      c.push(e(this.shareSummary));
      c.push('" st_via="???" st_image="/rt/trip_share_thumb.jpg"></span></li>\n        </ul>\n      </li>\n    ');
      null != this.website && (c.push('\n      <li><a href="'), c.push(e(this.website)), c.push('" target="_blank"><i class="icon-share"></i> Website</a></li>\n    '));
      c.push('\n    </ul>\n    <div class="description">\n      ');
      c.push(e(null != (n = this.guide) ? n.guide_description : void 0));
      c.push('\n    </div>\n  </div>\n  <div class="body">\n    <div class="profile-nav">\n      <a href="" class="guide-item-list-nav all">\n        <i class="icon-certificate"></i>\n        all\n      </a>\n      <a href="" class="guide-item-list-nav bucket-lists">\n        <i class="icon-pushpin"></i>\n        lists\n      </a>\n      <a href="" class="guide-item-list-nav trips">\n        <i class="icon-road"></i>\n        trips\n      </a>\n    </div>\n  </div>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/guide/templates/guide_item"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="sub-content" data-toggle="collapse" data-target=".guide-item-list-view.');
      c.push(e(this.item.parent_class));
      c.push(" .expand-collapse.");
      c.push(e(this.index));
      c.push('" data-parent=".guide-item-list-view.');
      c.push(e(this.item.parent_class));
      c.push('">\n  ');
      null != this.item.path ? (c.push('\n  <div class="action-icons">\n    <a class="sub-content-'), c.push(e(this.item.icon_class)), c.push(' js-route view-map" href="'), c.push(e(this.item.path)), c.push('" rel="tooltip" title="view on map" data-delay="0" data-placement="right">\n      <i class="icon-globe"></i>\n    </a>\n    <i class="icon-arrow"></i>\n    <a class="sub-content-'),
      c.push(e(this.item.icon_class)), c.push(' js-route view-itinerary" href="'), c.push(e(this.item.path)), c.push('/itinerary" rel="tooltip" title="view itinerary" data-delay="0" data-placement="left">\n      <i class="icon-list"></i>\n    </a>\n  </div>\n  ')) : c.push('\n  <div class="action-icons">\n    <i class="icon-arrow"></i>\n  </div>\n  ');
      c.push('\n  <div class="sub-content-');
      c.push(e(this.item.icon_class));
      c.push('">\n    <i class="icon-');
      c.push(e(this.item.icon_class));
      c.push('"></i>\n    <div class="shadow-container">\n      <div class="sub-content-title" data-text="');
      c.push(e(this.item.title));
      c.push('">\n        ');
      c.push(e(this.item.title));
      c.push('\n      </div>\n    </div>\n  </div>\n  <div class="item-overlay"></div>\n  <img src="');
      c.push(e(this.item.image_path));
      c.push('">\n</div>\n<div class="expand-collapse ');
      c.push(e(this.index));
      c.push(' collapse"></div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/guide/templates/guide_item_list"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<ul class="column"></ul>\n<ul class="column"></ul>\n<ul class="column"></ul>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/guide/templates/poi"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      var a;
      if (null != (null != (a = this.poi.image) ? a.guide_item_url : void 0)) c.push('\n<div class="item-overlay"></div>\n<img src="'), c.push(e(this.poi.image.guide_item_url)), c.push('">\n');
      c.push('\n<div class="sub-content-expanded-info">\n  <div class="sub-content-detail-title" data-text="');
      null != this.poi.name && c.push(e(this.poi.name));
      c.push('">');
      null != this.poi.name && c.push(e(this.poi.name));
      c.push('</div>\n  <div class="sub-content-detail" data-text="');
      null != this.poi.subtitle && c.push(e(this.poi.subtitle));
      c.push('">');
      null != this.poi.subtitle && c.push(e(this.poi.subtitle));
      c.push("</div>\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.guide.views,
    a = function() {
      this.updateColumnsNum = b(this.updateColumnsNum, this);
      this.getRequiredColumnsNum = b(this.getRequiredColumnsNum, this);
      this.indexToColumn = b(this.indexToColumn, this);
      this.renderItem = b(this.renderItem, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/guide/templates/guide_item_list"];
  a.prototype.className = "guide-item-list-view";
  a.prototype.initialize = function() {
    this.numColumns = 3;
    return $(window).on("resize.guide_page", _.bind(this.updateColumnsNum, this))
  };
  a.prototype.render = function() {
    this.cleanupItemViews();
    this.$el.html(this.template());
    this.itemViews = [];
    this.collection.each(this.renderItem);
    return this
  };
  a.prototype.remove = function() {
    $(window).off("resize.guide_page");
    this.cleanupItemViews();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.renderItem = function(a, b) {
    var c;
    c = new rt.guide.views.GuideItemView({
      model: a,
      index: b
    });
    this.$el.find(".column:nth-child(" + this.indexToColumn(b) + ")").append(c.render().$el);
    return this.itemViews.push(c)
  };
  a.prototype.cleanupItemViews = function() {
    return _(this.itemViews).each(function(a) {
      return a.remove()
    })
  };
  a.prototype.indexToColumn = function(a) {
    return a % this.numColumns + 1
  };
  a.prototype.getRequiredColumnsNum = function() {
    var a;
    a = this.$el.width();
    return 875 <= a ? 3 : 500 >= a ? 1 : 2
  };
  a.prototype.updateColumnsNum = function() {
    var a;
    a = this.getRequiredColumnsNum();
    if (this.numColumns !== a) return this.numColumns = a, this.updateElementsPlacement()
  };
  a.prototype.updateElementsPlacement = function() {
    var a, b, c, d, e;
    e = [];
    b = c = 0;
    for (d = this.collection.length; c < d; b = c += 1) a = this.$el.find("li.guide-item-view.index-" + b).detach(), e.push(this.$el.find(".column:nth-child(" + this.indexToColumn(b) +
      ")").append(a));
    return e
  };
  e.GuideItemListView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.guide.views,
    a = function() {
      this.fetchPois = b(this.fetchPois, this);
      this.activeChanged = b(this.activeChanged, this);
      this.fetchPoisOnce = b(this.fetchPoisOnce, this);
      this.renderPoi = b(this.renderPoi, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.tagName = "li";
  a.prototype.className = "guide-item-view";
  a.prototype.template = JST["partials/guide/templates/guide_item"];
  a.prototype.initialize = function(a) {
    this.index = a.index;
    this.$el.addClass("index-" + this.index);
    this.$el.tooltip({
      selector: "a[rel=tooltip]"
    });
    if (this.model.get("active")) this.fetchPois();
    else this.model.on("change:active", this.fetchPoisOnce, this);
    return this.model.on("change:active",
    this.activeChanged, this)
  };
  a.prototype.render = function() {
    var a, b = this;
    a = {
      item: this.model.toJSON(),
      index: this.index
    };
    this.$el.html(this.template(a));
    a = this.model.get("poi_ids");
    0 < a.length ? this.poiViews = a.map(this.renderPoi) : this.$(".expand-collapse").html('<div class="sub-content-expanded-none">(' + this.model.get("empty_message") + ")</div>");
    this.model.get("active") && (this.$(".expand-collapse").addClass("in"), this.$el.addClass("active"));
    this.$(".expand-collapse").on("show", function() {
      return b.model.set({
        active: !0
      })
    });
    this.$(".expand-collapse").on("hide", function() {
      return b.model.set({
        active: !1
      })
    });
    return this
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    null != this.poiViews && _(this.poiViews).each(function(a) {
      return a.remove()
    });
    this.$("a[rel=tooltip]").tooltip("hide");
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.renderPoi = function(a) {
    a = new rt.guide.views.PoiView({
      model: new rt.models.Poi({
        _id: a.get("poi_id")
      })
    });
    this.$(".expand-collapse").append(a.render().$el);
    return a
  };
  a.prototype.fetchPoisOnce = function() {
    this.model.off(null, this.fetchPoisOnce, this);
    return this.fetchPois()
  };
  a.prototype.activeChanged = function(a, b) {
    return this.$el[b ? "addClass" : "removeClass"]("active")
  };
  a.prototype.fetchPois = function() {
    var a, b = this;
    a = {
      ids: this.model.get("poi_ids").pluck("poi_id").join(",")
    };
    return (new Backbone.Model).fetch({
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(a),
      url: "/api/v1/pois/search",
      success: function(a) {
        var c, d;
        d = a.get("response").results;
        c = new rt.collections.PoisCollection(d);
        return _(b.poiViews).each(function(b) {
          a = b.model;
          return a.set(c.get(a.id))
        })
      }
    })
  };
  e.GuideItemView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.guide.views,
    a = function() {
      this.truncateLongGuideTitles = b(this.truncateLongGuideTitles, this);
      this.website = b(this.website, this);
      this.shareSummary = b(this.shareSummary, this);
      this.shareTitle = b(this.shareTitle, this);
      this.shareUrl = b(this.shareUrl, this);
      this.updateActiveTab = b(this.updateActiveTab, this);
      this.activeTabChanged = b(this.activeTabChanged, this);
      this.bucketListsTabClicked = b(this.bucketListsTabClicked,
      this);
      this.tripsTabClicked = b(this.tripsTabClicked, this);
      this.allTabClicked = b(this.allTabClicked, this);
      this.cleanup = b(this.cleanup, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      this.afterDomInsertion = b(this.afterDomInsertion, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.afterDomInsertion = function() {
    this.truncateLongGuideTitles();
    return stButtons.locateElements()
  };
  a.prototype.template = JST["partials/guide/templates/guide"];
  a.prototype.events = {
    "click .guide-item-list-nav.bucket-lists": "bucketListsTabClicked",
    "click .guide-item-list-nav.trips": "tripsTabClicked",
    "click .guide-item-list-nav.all": "allTabClicked"
  };
  a.prototype.className = "guide-page-view overlay";
  a.prototype.initialize = function() {
    return this.model.on("change:active_tab", this.activeTabChanged, this)
  };
  a.prototype.render = function() {
    var a;
    this.cleanup();
    a = {
      guide: this.model.toJSON(),
      website: this.website(),
      shareTitle: this.shareTitle(),
      shareUrl: this.shareUrl(),
      shareSummary: this.shareSummary()
    };
    this.$el.html(this.template(a));
    this.updateActiveTab();
    this.allGuideItemListView = new rt.guide.views.GuideItemListView({
      collection: this.model.get("all_collection")
    });
    this.allGuideItemListView.$el.addClass("all");
    this.$(".body").append(this.allGuideItemListView.render().el);
    this.bucketListsGuideItemListView = new rt.guide.views.GuideItemListView({
      collection: this.model.get("bucket_list_collection")
    });
    this.bucketListsGuideItemListView.$el.addClass("bucket-lists");
    this.$(".body").append(this.bucketListsGuideItemListView.render().el);
    this.tripsGuideItemListView = new rt.guide.views.GuideItemListView({
      collection: this.model.get("trip_collection")
    });
    this.tripsGuideItemListView.$el.addClass("trips");
    this.$(".body").append(this.tripsGuideItemListView.render().el);
    this.sidebarView = new rt.views.overlay.OverlaySidebarView({
      actionViews: []
    });
    this.sidebarView.render();
    this.$el.prepend(this.sidebarView.el);
    return this
  };
  a.prototype.remove = function() {
    this.cleanup();
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.close = function() {
    this.remove();
    return rt.app.router.navigate("#")
  };
  a.prototype.cleanup = function() {
    var a, b, c, d;
    null != (a = this.sidebarView) && a.remove();
    null != (b = this.allGuideItemListView) && b.remove();
    null != (c = this.bucketListsGuideItemListView) && c.remove();
    return null != (d = this.tripsGuideItemListView) ? d.remove() : void 0
  };
  a.prototype.allTabClicked = function(a) {
    a.preventDefault();
    return this.model.set({
      active_tab: "all"
    })
  };
  a.prototype.tripsTabClicked = function(a) {
    a.preventDefault();
    return this.model.set({
      active_tab: "trips"
    })
  };
  a.prototype.bucketListsTabClicked = function(a) {
    a.preventDefault();
    return this.model.set({
      active_tab: "bucket_lists"
    })
  };
  a.prototype.activeTabChanged = function() {
    return this.updateActiveTab()
  };
  a.prototype.updateActiveTab = function() {
    var a;
    this.$el.removeClass("all-active trips-active bucket-lists-active");
    switch (this.model.get("active_tab")) {
      case "all":
        a = "all-active";
        break;
      case "bucket_lists":
        a = "bucket-lists-active";
        break;
      case "trips":
        a = "trips-active"
    }
    this.$el.addClass(a);
    return this.truncateLongGuideTitles()
  };
  a.prototype.shareUrl = function() {
    return "http://???.com" + rt.routes.guide_path(this.model.get("guide_name"))
  };
  a.prototype.shareTitle = function() {
    return null != this.model.get("guide_title") ? null != this.model.get("tagline") ? "" + this.model.get("guide_title") + ", " + this.model.get("tagline") : "" + this.model.get("guide_title") : "A guide on ???"
  };
  a.prototype.shareSummary = function() {
    return "I just found an awesome guide on ???.com!"
  };
  a.prototype.website = function() {
    var a;
    a = this.model.get("website");
    null != a && null == a.match("^http://") && (a = a.match("^s*$") ? null : "http://" + a);
    return a
  };
  a.prototype.truncateLongGuideTitles = function() {
    return this.$(".sub-content-title:visible").dotdotdot({
      height: 70,
      wrap: "word",
      lastCharacter: {
        remove: " ,;.!?&".split("")
      },
      callback: function(a) {
        var b;
        b = $(this);
        b.attr("data-text", b.text());
        return a || 52 < b.innerHeight() ? b.addClass("max-lines-height") : b.removeClass("max-lines-height")
      }
    })
  };
  e.GuideView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.guide.views,
    a = function() {
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/guide/templates/poi"];
  a.prototype.events = {
    click: "navigateToPlace"
  };
  a.prototype.className = "sub-content-expanded poi-detail";
  a.prototype.initialize = function() {
    return this.model.on("change", this.render, this)
  };
  a.prototype.render = function() {
    var a;
    a = {
      poi: this.model.toJSON()
    };
    this.$el.html(this.template(a));
    this.truncateContent();
    return this
  };
  a.prototype.truncateContent = function() {
    return this.$(".sub-content-expanded-info").dotdotdot({
      height: 70,
      wrap: "word",
      lastCharacter: {
        remove: " ,;.!?&".split("")
      },
      callback: function() {
        return _.each($(this).children(),

        function(a) {
          return a.setAttribute("data-text", $(a).text())
        })
      }
    })
  };
  a.prototype.remove = function() {
    this.model.off(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype.navigateToPlace = function() {
    return rt.app.router.navigate(this.placeLink(), !0)
  };
  a.prototype.placeLink = function() {
    return this.model.get("path")
  };
  e.PoiView = a
}).call(this);
(function() {
  var b, c, e, a;
  (b = window.rt).itinerary || (b.itinerary = {});
  (c = window.rt.itinerary).collections || (c.collections = {});
  (e = window.rt.itinerary).models || (e.models = {});
  (a = window.rt.itinerary).views || (a.views = {})
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/itinerary/templates/directions_section"] = function(b) {
    b || (b = {});
    var c = b.safe,
      e = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    e || (e = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {}).call(b);
    b.safe = c;
    b.escape = e;
    return ""
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/itinerary/templates/itinerary"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="overlay-container">\n  <div class="header">\n    <h1 class="trip-name title">');
      c.push(e(this.model.display_name));
      c.push('</h1>\n    <div class="trip-stats">\n      <span class="distance">\n        <i class="icon-ruler"></i>\n        <span>');
      c.push(e(this.formattedDistance));
      c.push('</span>\n      </span>\n      <span class="time">\n        <i class="icon-time"></i>\n        <span>');
      c.push(e(this.formattedTime));
      c.push('</span>\n      </span>\n      <span class="cost">\n        <i class="gasoline"></i>\n        <span>');
      c.push(e(this.formattedCost));
      c.push("</span>\n      </span>\n    </div>\n    ");
      null != this.model.image && (c.push('\n    <img src="'), c.push(e(this.model.image.banner_url)), c.push('" alt="'), c.push(e(this.model.display_name)), c.push('" class="trip-image">\n    '));
      c.push('\n    <div class="description">\n      ');
      c.push(e(this.model.description));
      c.push('\n    </div>\n  </div>\n  <div class="tabs">\n    <a href="" class="itinerary-tab">\n      <i class="icon-car"></i>\n      itinerary\n    </a>\n    <a href="" class="directions-tab">\n      <i class="icon-certificate"></i>\n      directions\n    </a>\n    <a href="" class="print-page">\n      <i class="icon-print"></i>\n      print\n    </a>\n    <ul class="actions">\n      <li class="action share dropdown">\n        <a data-toggle="dropdown" href="#" class="dropdown-toggle">\n          <span class="action-name">SHARE</span>\n          <i class="icon-share-trip"></i>\n        </a>\n        <ul class="dropdown-menu">\n          <li>\n            <span class=\'st_facebook\' st_url="');
      c.push(e(this.shareUrl));
      c.push('" st_title="');
      c.push(e(this.shareTitle));
      c.push('" st_summary="');
      c.push(e(this.shareSummary));
      c.push('" st_image="/rt/trip_share_thumb.jpg"></span>\n          </li>\n          <li>\n            <span class=\'st_twitter\' st_url="');
      c.push(e(this.shareUrl));
      c.push('" st_title="');
      c.push(e(this.shareTitle));
      c.push('" st_summary="');
      c.push(e(this.shareSummary));
      c.push('" st_via="???" st_image="/rt/trip_share_thumb.jpg"></span>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  </div>\n  <div class="body">\n  </div>\n</div>\n')
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/itinerary/templates/itinerary_geo_waypoint"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="waypoint-position"></div>\n<div class="name">');
      c.push(this.waypoint.name && this.waypoint.name.ecoSafe ? this.waypoint.name : "undefined" !== typeof this.waypoint.name && null != this.waypoint.name ? a(this.waypoint.name) : "");
      c.push("</div>\n")
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/itinerary/templates/itinerary_leg"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<span class="distance">\n  <i class="icon-ruler"></i>\n  <span>');
      c.push(e(this.distance));
      c.push('</span>\n</span>\n<span class="time">\n  <i class="icon-time"></i>\n  <span>');
      c.push(e(this.time));
      c.push("</span>\n</span>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/itinerary/templates/itinerary_poi_waypoint"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="photo">\n  <a href="');
      c.push(e(this.place.path));
      c.push('" class="js-route">\n    <img src="');
      c.push(e(this.place.image.place_page_url));
      c.push('" alt="');
      c.push(e(this.waypoint.name));
      c.push('">\n  </a>\n</div>\n<div class="waypoint-position"></div>\n<div class="place-group ');
      c.push(e(this.group));
      c.push('"></div>\n\n<div class="name"><a href="');
      c.push(e(this.place.path));
      c.push('" class="js-route">');
      c.push(e(this.waypoint.name));
      c.push('</a></div>\n<div class="subtitle"><a href="');
      c.push(e(this.place.path));
      c.push('" class="js-route">');
      c.push(e(this.place.subtitle));
      c.push('</a></div>\n<div class="address">\n  <span class="address1">');
      c.push(e(null != this.place.address1 ? this.place.address1 : "(address1 unknown)"));
      c.push('</span>,&nbsp;\n  <span class="city">');
      c.push(e(null != this.place.city ? this.place.city : "(city unknown)"));
      c.push('</span>,&nbsp;\n  <span class="state">');
      c.push(e(null != this.place.state ? this.place.state : "(state unknown)"));
      c.push('</span>\n  <span class="zip_code">');
      c.push(e(null != this.place.zip_code ? this.place.zip_code :
        "(zipcode unknown)"));
      c.push('</span>\n</div>\n<div class="phone">');
      c.push(e(this.place.phone));
      c.push("</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/itinerary/templates/itinerary_section"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="header">\n  <h1 class="trip-name">');
      c.push(this.model.name && this.model.name.ecoSafe ? this.model.name : "undefined" !== typeof this.model.name && null != this.model.name ? a(this.model.name) : "");
      c.push('</h1>\n</div>\n\n<div class="tabs">\n  <a href="" class="itinerary-tab">\n    <i class="icon-certificate"></i>\n    itinerary\n  </a>\n  <a href="" class="directions-tab">\n    <i class="icon-certificate"></i>\n    directions\n  </a>\n</div>\n\n<div class="body">\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/itinerary/templates/itinerary_via_waypoint"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="waypoint-position">\n  <i></i>\n</div>\n<div class="name">');
      c.push(this.waypoint.name && this.waypoint.name.ecoSafe ? this.waypoint.name : "undefined" !== typeof this.waypoint.name && null != this.waypoint.name ? a(this.waypoint.name) : "");
      c.push("</div>\n")
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.itinerary.views,
    a = function() {
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className = "directions-section-view";
  a.prototype.initialize = function() {
    return this.model.bind("change:directions_result", this.render, this)
  };
  a.prototype.render = function() {
    var a;
    a = this.model;
    null != a.get("directions_result") ? (this.$el.empty(), new google.maps.DirectionsRenderer({
      directions: a.get("directions_result"),
      panel: this.el
    })) : this.$el.html('<div class="message-no-trip-directions">\n  (No trip directions.)\n</div>');
    return this
  };
  a.prototype.remove = function() {
    this.model.unbind(null, null, this);
    return a.__super__.remove.apply(this, arguments)
  };
  e.DirectionsSectionView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.itinerary.views,
    a = function() {
      this.formattedTime = b(this.formattedTime, this);
      this.formattedDistance = b(this.formattedDistance, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/itinerary/templates/itinerary_leg"];
  a.prototype.className = "itinerary-leg-view";
  a.prototype.initialize = function() {};
  a.prototype.render = function() {
    var a;
    a = {
      distance: this.formattedDistance(),
      time: this.formattedTime()
    };
    this.$el.html(this.template(a));
    return this
  };
  a.prototype.formattedDistance = function() {
    var a;
    a = this.model.get("distance");
    return null == a ? "..." : "" + Math.round(6.21371192E-4 * a) + "mi"
  };
  a.prototype.formattedTime = function() {
    var a, b;
    b = this.model.get("time");
    if (null == b) return "...";
    a = Math.floor(b / 3600);
    b = Math.round(b % 3600 / 60);
    return "" + (0 >= a ? "0" : "" + a) + ":" + (0 >= b ? "00" : 10 <= b ? "" + b : "0" + b)
  };
  e.ItineraryLegView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.itinerary.views,
    a = function() {
      this._cleanup = b(this._cleanup, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.className =
    "itinerary-section-view";
  a.prototype.initialize = function() {
    this.debouncedRender = _.debounce(this.render, 100);
    return this.model.on("change", this.debouncedRender, this)
  };
  a.prototype.render = function() {
    var a, b;
    this._cleanup();
    a = document.createDocumentFragment();
    b = this.model;
    this.waypointViews = [];
    this.legViews = [];
    this.path = new rt.models.TripPath(b.get("waypoints"), b.get("legs"));
    this.path.follow(function(b) {
      b = new rt.itinerary.views.ItineraryWaypointView({
        model: b
      });
      return a.appendChild(b.render().el)
    }, function(b) {
      b = new rt.itinerary.views.ItineraryLegView({
        model: b
      });
      return a.appendChild(b.render().el)
    });
    this.$el.html(a);
    return this
  };
  a.prototype.remove = function() {
    this._cleanup;
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._cleanup = function() {
    var a;
    null != (a = this.path) && a.off(null, null, this);
    this.waypointsViews && (_(this.waypontViews).each(function() {
      return view.remove()
    }), this.waypointViews = null);
    if (this.legViews) return _(this.legViews).each(function(a) {
      a.off(null, null, this);
      return a.remove()
    }), this.legViews = null
  };
  e.ItinerarySectionView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.itinerary.views,
    a = function() {
      this.shareSummary = b(this.shareSummary, this);
      this.shareTitle = b(this.shareTitle, this);
      this.shareUrl = b(this.shareUrl, this);
      this._formattedCost = b(this._formattedCost, this);
      this._formattedTime = b(this._formattedTime, this);
      this._formattedDistance = b(this._formattedDistance, this);
      this.printPage = b(this.printPage, this);
      this.directionsTabClicked = b(this.directionsTabClicked, this);
      this.itineraryTabClicked = b(this.itineraryTabClicked, this);
      this._directionsChanged = b(this._directionsChanged, this);
      this._tripChanged = b(this._tripChanged, this);
      this.setActiveTab = b(this.setActiveTab, this);
      this.cleanup = b(this.cleanup, this);
      this._bindDirections = b(this._bindDirections, this);
      this._bindTrip = b(this._bindTrip, this);
      this.remove = b(this.remove, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/itinerary/templates/itinerary"];
  a.prototype.className = "itinerary-view overlay";
  a.prototype.events = {
    "click .itinerary-tab": "itineraryTabClicked",
    "click .directions-tab": "directionsTabClicked",
    "click .print-page": "printPage"
  };
  a.prototype.initialize = function() {
    this.debouncedRender = _.debounce(this.render, 100);
    this._bindTrip();
    this.model.on("change:trip",
    this._tripChanged, this);
    this._bindDirections();
    return this.model.on("change:directions", this._directionsChanged, this)
  };
  a.prototype.render = function() {
    var a, b, c, d;
    this.cleanup();
    d = this.model.get("trip");
    c = this.model.get("directions");
    a = {
      model: d.toJSON(),
      formattedDistance: this._formattedDistance(),
      formattedTime: this._formattedTime(),
      formattedCost: this._formattedCost(),
      shareUrl: this.shareUrl(),
      shareTitle: this.shareTitle(),
      shareSummary: this.shareSummary()
    };
    b = $(this.template(a));
    a = b.find(".body");
    this.itinerarySectionView = new rt.itinerary.views.ItinerarySectionView({
      model: d
    });
    a.append(this.itinerarySectionView.render().el);
    this.directionsSectionView = new rt.itinerary.views.DirectionsSectionView({
      model: c
    });
    a.append(this.directionsSectionView.render().el);
    this.sidebarView = new rt.views.overlay.OverlaySidebarView({
      actionViews: []
    });
    this.sidebarView.render();
    b.first().before(this.sidebarView.el);
    this.$el.html(b[0].parentNode);
    this.setActiveTab("itinerary-active");
    return this
  };
  a.prototype.remove = function() {
    var b, c;
    this.model.off(null,
    null, this);
    null != (b = this.trip) && b.off(null, null, this);
    null != (c = this.directions) && c.off(null, null, this);
    this.cleanup;
    return a.__super__.remove.apply(this, arguments)
  };
  a.prototype._bindTrip = function() {
    var a;
    null != (a = this.trip) && a.off(null, null, this);
    this.trip = this.model.get("trip");
    return this.trip.on("change", this.debouncedRender, this)
  };
  a.prototype._bindDirections = function() {
    var a;
    null != (a = this.directions) && a.off(null, null, this);
    this.directions = this.model.get("directions");
    return this.directions.on("change:directions_result",
    this.debouncedRender, this)
  };
  a.prototype.cleanup = function() {
    var a, b, c;
    null != (a = this.sidebarView) && a.remove();
    null != (b = this.itinerarySectionView) && b.remove();
    return null != (c = this.directionsSectionView) ? c.remove() : void 0
  };
  a.prototype.setActiveTab = function(a) {
    return this.$el.removeClass("itinerary-active directions-active").addClass(a)
  };
  a.prototype._tripChanged = function() {
    this._bindTrip();
    return this.debouncedRender()
  };
  a.prototype._directionsChanged = function() {
    this._bindDirections();
    return this.debouncedRender()
  };
  a.prototype.itineraryTabClicked = function(a) {
    a.preventDefault();
    return this.setActiveTab("itinerary-active")
  };
  a.prototype.directionsTabClicked = function(a) {
    a.preventDefault();
    return this.setActiveTab("directions-active")
  };
  a.prototype.printPage = function(a) {
    a.preventDefault();
    return window.print()
  };
  a.prototype._formattedDistance = function() {
    var a;
    a = this.trip.get("distance");
    return null == a ? "..." : "" + Math.round(6.21371192E-4 * a) + "mi"
  };
  a.prototype._formattedTime = function() {
    var a, b;
    b = this.trip.get("time");
    if (null == b) return "...";
    a = Math.floor(b / 3600);
    b = Math.round(b % 3600 / 60);
    return "" + (0 >= a ? "0" : "" + a) + ":" + (0 >= b ? "00" : 10 <= b ? "" + b : "0" + b)
  };
  a.prototype._formattedCost = function() {
    var a;
    a = this.trip.get("cost");
    return null == a ? "..." : "$" + a
  };
  a.prototype.shareUrl = function() {
    return null != this.trip.id ? "http://???.com/trips/" + this.trip.id : null
  };
  a.prototype.shareTitle = function() {
    return null != this.trip.get("name") ? "" + this.trip.get("name") + " | My new trip on ???" : "My new trip on ???"
  };
  a.prototype.shareSummary = function() {
    return "Check out the trip I'm creating on ???.com"
  };
  e.ItineraryView = a
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.itinerary.views,
    a = function() {
      this._waypointNumber = b(this._waypointNumber, this);
      this.render = b(this.render, this);
      this.initialize = b(this.initialize, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.poiTemplate = JST["partials/itinerary/templates/itinerary_poi_waypoint"];
  a.prototype.geoTemplate = JST["partials/itinerary/templates/itinerary_geo_waypoint"];
  a.prototype.viaTemplate = JST["partials/itinerary/templates/itinerary_via_waypoint"];
  a.prototype.className = "itinerary-waypoint-view";
  a.prototype.initialize = function() {};
  a.prototype.render = function() {
    var a, b;
    this.$el.addClass("index-" + this._waypointNumber());
    this.model.isVia() ? this.$el.addClass("via") : this.$el.removeClass("via");
    this.model.isPoi() ? (a = this.model.toJSON(), b = new rt.models.Poi(this.model.get("poi")), b = b.toJSON(),
    a = {
      waypoint: a,
      place: b,
      group: rt.app.helpers.categories.group(_.first(b.categories))
    }, a = this.poiTemplate(a)) : this.model.isGeo() ? (a = {
      waypoint: this.model.toJSON(),
      index: this.index
    }, a = this.geoTemplate(a)) : this.model.isVia() && (a = {
      waypoint: this.model.toJSON(),
      index: this.index
    }, a = this.viaTemplate(a));
    this.$el.html(a);
    return this
  };
  a.prototype._waypointNumber = function() {
    var a, b, c, d;
    c = this.model.path.vertexCount();
    b = 0;
    if (c) {
      a = d = 0;
      for (c -= 1; 0 <= c ? d <= c : d >= c; a = 0 <= c ? ++d : --d) {
        if (this.model.path.vertexAt(a) === this.model) return this.model.get("type") === rt.models.Waypoint.TYPE_VIA ? "via" : a - b;
        this.model.path.vertexAt(a).get("type") === rt.models.Waypoint.TYPE_VIA && 0 !== a && b++
      }
    }
    return ""
  };
  e.ItineraryWaypointView = a
}).call(this);
(function() {
  rt.blog = {
    api_url: "/api/v1/blog_posts",
    models: {},
    collections: {},
    views: {}
  }
}).call(this);
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
  rt.helpers || (rt.helpers = {});
  rt.helpers.blog = {
    formatDate: function(b) {
      var c;
      c = "January February March April May June July August September October November December".split(" ");
      b = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/.exec(b);
      if (7 === b.length) return b[3] + " " + c[parseInt(b[2] - 1)] + " " + b[1]
    }
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/blog/templates/blog_page"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="blog overlay">\n  <div class="overlay-container">\n    <div class="overlay-header-bg">\n      <div class="header">\n        <h1 class="title">');
      c.push(this.post.get("post_page_title"));
      c.push('</h1>\n        <img src="');
      c.push(this.post.titleImageUrl());
      c.push('" alt="');
      c.push(this.post.get("title"));
      c.push('">\n      </div>\n      <div class="tabs">\n        <ul class="actions">\n          ');
      c.push('\n          \x3c!--<li class="action share dropdown">--\x3e\n            \x3c!--<a data-toggle="dropdown" href="#" class="dropdown-toggle">--\x3e\n              \x3c!--<i class="icon-share-trip"></i>--\x3e\n              \x3c!--<span class="action-name">SHARE</span>--\x3e\n            \x3c!--</a>--\x3e\n            \x3c!--<ul class="dropdown-menu">--\x3e\n              \x3c!--<li><span class="st_facebook" st_url="http://???.com/dinerstodiefor" st_title=", " st_summary="I just found an awesome guide on ???.com!" st_image="/rt/trip_share_thumb.jpg" st_processed="yes"><span class="stButton"><span class="chicklets facebook">&nbsp;</span><img src="http://w.sharethis.com/images/check-small.png"></span></span></li>--\x3e\n              \x3c!--<li><span class="st_twitter" st_url="http://???.com/dinerstodiefor" st_title=", " st_summary="I just found an awesome guide on ???.com!" st_via="???" st_image="/rt/trip_share_thumb.jpg" st_processed="yes"><span class="stButton"><span class="chicklets twitter">&nbsp;</span><img src="http://w.sharethis.com/images/check-small.png"></span></span></li>--\x3e\n            \x3c!--</ul>--\x3e\n          \x3c!--</li>--\x3e\n        </ul>\n        <strong>');
      c.push(e(this.post.get("formatted_date")));
      c.push("</strong>\n        ");
      " " !== this.post.authorName() && (c.push("\n          by "), c.push(e(this.post.authorName())), c.push("\n        "));
      c.push('\n      </div>\n    </div>\n    <div class="body">\n      ');
      c.push(this.post.get("content"));
      c.push("\n    </div>\n  </div>\n</div>\n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/blog/templates/sidebar"] = function(b) {
    b || (b = {});
    var c = [],
      e = b.safe,
      a = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    a || (a = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<div class="sidebar-item-contents">\n  <div class="upper">\n    <h1 class="heading">RECENT POSTS</h1>\n  </div>\n  <div class="primary">\n  <ul class="one-line-nav posts"></ul>\n  </div>\n</div>\n\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["partials/blog/templates/sidebar_item"] = function(b) {
    b || (b = {});
    var c = [],
      e = function(a) {
        return a && a.ecoSafe ? a : "undefined" !== typeof a && null != a ? d(a) : ""
      }, a = b.safe,
      d = b.escape;
    b.safe = function(a) {
      if (a && a.ecoSafe) return a;
      "undefined" !== typeof a && null != a || (a = "");
      a = new String(a);
      a.ecoSafe = !0;
      return a
    };
    d || (d = b.escape = function(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    });
    (function() {
      c.push('<a href="/blog/');
      c.push(e(this.post.wp_slug));
      c.push('" class="post">\n<img alt="');
      c.push(e(this.post.title_plain));
      c.push('" src="');
      c.push(e(this.thumbnailImageUrl));
      c.push('">\n  ');
      c.push(this.post.post_title);
      c.push("\n</a>      \n")
    }).call(b);
    b.safe = a;
    b.escape = d;
    return c.join("")
  }
}).call(this);
(function() {
  var b = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  }, c = {}.hasOwnProperty,
    e = rt.blog.views,
    a = function() {
      this.close = b(this.close, this);
      this.render = b(this.render, this);
      this.linkHandler = b(this.linkHandler, this);
      return a.__super__.constructor.apply(this, arguments)
    }, d = a,
    f = Backbone.View,
    h = function() {
      this.constructor = d
    }, g;
  for (g in f) c.call(f, g) && (d[g] = f[g]);
  h.prototype = f.prototype;
  d.prototype = new h;
  d.__super__ = f.prototype;
  a.prototype.template = JST["partials/blog/templates/blog_page"];
  a.prototype.className = "blog-view";
  a.prototype.linkHandler = function(a) {
    var b;
    a.preventDefault;
    a = $(a.target);
    a.is("a") || (a = a.parent("a"));
    a && (b = a.attr("href"), _.contains(["???.com", "www.???.com"], a.prop("hostname")) ? rt.app.router.navigate(b.replace(/???.com/, document.location.host), {
      trigger: !0
    }) : window.open(b));
    return !1
  };
  a.prototype.render = function() {
    this.$el.html(this.template({
      post: this.model
    }));
    this.sidebarView = new rt.views.overlay.OverlaySidebarView({
      actionViews: []
    });
    this.sidebarView.render();
    this.$(".overlay").prepend(this.sidebarView.el);
    this.$(".body a").on("click", this.linkHandler);
    return this.$el
  };
  a.prototype.close = function() {
    var a;
    this.remove();
    return "back" === (null != (a = this.options) ? a.restoreState : void 0) ? window.history.back() : rt.app.router.navigate("/", {
      trigger: !1
    })
  };
  e.BlogView = a
}).call(this);
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
  e.prototype.template = JST["partials/blog/templates/sidebar_item"];
  e.prototype.tagName = "li";
  e.prototype.initialize = function(a) {
    _.bindAll(this);
    return e.__super__.initialize.call(this, a)
  };
  e.prototype.render = function() {
    this.$el.html(this.template({
      post: this.model.toJSON(),
      thumbnailImageUrl: this.model.thumbnailImageUrl()
    }));
    return this
  };
  c.SidebarItem = e
}).call(this);
