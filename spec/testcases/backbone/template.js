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
