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
  this.JST["partials/trip_planner/templates/new_trip_confirmation"] = function(b) {
    b || (b = {});
    var c = [],
      d = function(b) {
        return b && b.ecoSafe ? b : "undefined" !== typeof b && null != b ? a(b) : ""
      }, e = b.safe,
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
      c.push('<h2>Save trip?</h2>\n<p>Sure you dont want to save this trip before starting a new one?</p>\n<a class="button primary" data-trigger-event="');
      c.push(d(this.ok_event));
      c.push('" href="#">yes, save trip</a>\n<a class="button" data-trigger-event="');
      c.push(d(this.cancel_event));
      c.push('" href="#">no, start again</a>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/notifications/notification"] = function(b) {
    b || (b = {});
    var c = [],
      d = function(b) {
        return b && b.ecoSafe ? b : "undefined" !== typeof b && null != b ? a(b) : ""
      }, e = b.safe,
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
      c.push('<div class="rt-popover-content ');
      c.push(d(this.type));
      c.push('">\n  <p>\n    ');
      c.push(d(this.message));
      c.push('\n  </p>\n  <a href="#" class="close-notification">x</a>\n</div>\n')
    }).call(b);
    b.safe = e;
    b.escape = a;
    return c.join("")
  }
}).call(this);
