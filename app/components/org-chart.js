import Ember from 'ember';
import d3 from 'd3';

var get = Ember.get;
var set = Ember.set;

var x = 0;
var y = 0;

export default Ember.Component.extend({
  classNames: ['org-chart'],
  eventManager: Ember.inject.service('events'),

  radius: 0,
  padding: 6,
  currPath: null,
  currSelection: null,
  currFilter: 1,
  lastSelection: null,
//   units: null,

  partition: d3.layout.partition()
      .sort(null)
      .value(function(d) { return 18 - d.depth; }),

  arc: d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),


  setup: Ember.on('didInsertElement', function() {
    var self = this;
//     Ember.Logger.debug("setup chart", self.currFilter);
    this.set('boundResizeHandler', Ember.run.bind(this, this._renderStruc));
    Ember.$(window).on('resize', this.get('boundResizeHandler'));
    this.get('eventManager').on('rerender', this._renderStruc.bind(this));
    self._renderStruc();
  }),

  willDestroy: function() {
//     Ember.Logger.debug("free chart", this.currFilter, "-", this);
    Ember.$(window).off('resize', this.get('boundResizeHandler'));
    this.get('eventManager').off('rerender');
//     $('#to-remove *').unbind('click');
//     Ember.$("#org_group").remove();
  },


  changed: function() {
//     Ember.Logger.debug("filter changed", this.get('currFilter'));
    this._renderStruc();
  }.observes('currFilter'),

//   unitsChanged: function() {
//     Ember.Logger.debug("unitts changed");
//   }.observes('units.length'),

  isParentOf: function (p, c) {
    if (p === c) {
      return true;
    }
    if (p.children) {
      return p.children.some(function(d) {
        return this.isParentOf(d, c);
      });
    }
    return false;
  },


  // Interpolate the scales!
  arcTween: function(d) {
    var my = this.maxY(d),
    xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
    yd = d3.interpolate(y.domain(), [d.y, my]),
    yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d) {
      return function(t) { 
        x.domain(xd(t));
        y.domain(yd(t)).range(yr(t));
        return this.arc(d);
      };
    };
  },

  maxY: function(d) {
    return d.children ? Math.max.apply(Math, d.children.map(this.maxY)) : d.y + d.dy;
  },

  // http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
  brightness: function(rgb) {
    return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
  },

  color: function(d) {
    if (d && d.depth === 0) {
//       return `url(${window.location.href.replace(window.location.hash, "")}#img1)`;
//       return "url(./" + window.location.pathname + "#img1)";
//       return "url(#img1)";
      return "";
    }

    if (d.parent && d.parent.depth == 0) {
      Ember.Logger.log(">>> RET 1 color", d.color);
      return d.color || "#fff";
    }

    if (d.children) {
      var idx = d.children.length > 1 ? 1 : 0;
      var self = this;
      var colors = d.children.map(Ember.$.proxy(this.color, this)),
                    a = d3.hsl(colors[0]),
                    b = d3.hsl(colors[idx]);
      Ember.Logger.log(">>> RET 3 magic color");
      return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
    }

    Ember.Logger.log(">>> RET 2 color", d.color);
    return d.color || "#fff";
  },


  click: function(d) {
    var id = Ember.$(d.target).data('unitid');
    if (id !== undefined) {
      if (this.get('currFilter') == "1") {
        this.get('eventManager').trigger('setDetails', { unitid: id, extended: true, sync: true});
      } else {
        var $sel = this.get('currSelection');
        if ($sel) {
          $sel.attr("class", "unit-pilots-path");
        }
        var $path = Ember.$(d.target);
        $path.attr("class", "unit-pilots-path selected");
        this.set('currSelection', $path);

        this.get('eventManager').trigger('setDetails', { unitid: id, extended: true, sync: false});
      }
    }
  },

  
  mouseover: function(d) {
  },

  mouseout: function(d) {
  },

  _serializeUnit: function(obj) {
      var ret = {};
      ret.id = get(obj, 'id');
      ret.name = get(obj, 'name');
      ret.color = get(obj, 'color');
      return ret;
  },

  _serializeChildren: function(obj) {
    var self = this;
    if (obj) {
      var ret = self._serializeUnit(obj);
      get(obj, 'units').forEach(function(unit) {
        var add = true;
        if (self.currFilter == 1 && self.currFilter != ret.id) {
          add = false;
        }

        if (add) {
          var unit_ser = self._serializeUnit(unit);
          if (!ret.children) {
            ret.children = [unit_ser];
          } else {
            ret.children.push(unit_ser);
          }
          ret.children[ret.children.length - 1] = self._serializeChildren(unit);
        }
      });
    }
    return ret;
  },

  _transformData: function() {
    var root = null;
    var data = get(this, 'units');
    if (get(this, 'currFilter') === undefined) {
      set(this, 'currFilter', 1);
      Ember.Logger.log("fix filter");
    }
    var filter = get(this, 'currFilter');

    this.set("hideNav", filter <= 1);

//     Ember.Logger.debug(" >>> search ", filter, " in ",get(data, 'length'), ' --- ',  get(data, 'isLoaded'));

    var self = this;
    var temp = root;
    if (data) {
      for (var i = 0; i < get(data, 'length') && !root; i++) {
        var el = data.objectAt(i);
//             Ember.Logger.debug("      >  ", filter, " in ", get(el, 'isLoaded'));
          if(!el || !get(el, 'isLoaded')) {
            Ember.Logger.log("      >  ", filter, " in ", get(el, 'isLoaded'));
            return null;
          }
          if (get(el, 'id') == filter) {
            temp = el;
          }
      }
    }

    return temp;
  },

  _renderStruc: function() {
//     Ember.Logger.log("render");
    var units = get(this, 'units');
    if (!units) {
        Ember.Logger.log("no data no render");
        return;
    }

    var root = this._transformData();
    var struc = this._serializeChildren(root);
    if (!struc) {
      Ember.Logger.log("render return, struc empty");
      return;
    }

//     Ember.Logger.log("render ", struc);
    var div = Ember.$(".chart-pane");
    var width = div.width();
    var height = div.height();

    var center = [ width / 2, height / 2 ];
    var radius = (Math.min(width, height) * 0.95) / 2;
    set(this, 'radius', radius);

    x = d3.scale.linear().range([0, 2 * Math.PI]);
    y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]);

    var svg = d3.select("#svg");
    var nodes = this.partition.nodes(struc);

    Ember.$("#org_group").remove();
    Ember.$("filter").remove();
    Ember.$("rect").remove();

    var src = root.get('img') || "https://www.oddysee.org/wp-content/plugins/orgtool-wordpress-plugin/orgtool/dist/oddysee-logo-glow.png";
    var rootImg = svg.append("filter")
                           .attr('id', 'img1')
                           .attr('width', "100%")
                           .attr('height', "100%")
                           .attr('x', "0%")
                           .attr('y', "0%")
                           .append("feImage")
                           .attr("xlink:href", src);
      

    var bg = svg.append("rect").attr("id", "bgimg")
                               .attr('width', "100%")
                               .attr('height', "100%")
                               .attr('x', "1%")
                               .attr('y', "1%")
                               .attr('filter', 'url(#img1)');

    var vis = svg.append("g")
            .attr("id", "org_group")
            .attr("transform", "translate(" + center + ")");

    var self = this;

    var path = vis.selectAll("path").data(nodes);
    path.enter().append("path")
            .attr("id", function(d, i) { return "path-" + d.id; })
            .attr("data-unitid", function(d, i) { return d.id; })
            .attr("d", this.arc)
            .attr("fill-rule", "evenodd")
            .attr("width", 10)
            .attr("height", 10)
            .attr("class", "unit-pilots-path")
            .attr("fill-opacity", function(d, i) { if (d && d.depth === 0) { return "0"; } else {  return "1" } })
            .attr("fill", Ember.$.proxy(this.color, this))
            .on("click", Ember.$.proxy(this.click, this))
            .on("mouseover", self.mouseover);

//             .attr("fill-opacity", function(d, i) { if (d && d.depth === 0) { return "0"; } else {  return (d && d.color) ? "1" : "0.05"; } })
//             .attr("filter", function(d, i) { return (d && d.depth === 0) ? "url(#img1)" : ""; })
//             .on("mouseover", Ember.$.proxy(this.mouseover, this))
//             .on("mouseout", Ember.$.proxy(this.mouseout, this));
//             .on("click", self.click.bind(self));



    var box = document.getElementById("org_group").firstChild.getBBox();
    var ipos = [ center[0] - (box.width / 2), center[1] - (box.height / 2)];

    var padding = 14;
    if (!root.get('units').length) {
        padding = box.width - box.width / 2;
    }

//     Ember.Logger.debug(">> FIRST", box, ipos);
    Ember.$("#bgimg").attr('x', ipos[0] + padding / 2)
                      .attr('y', ipos[1] + padding / 2)
                      .attr('width', box.width - padding)
                      .attr('height', box.height - padding);


    var text = vis.selectAll("text").data(nodes);
    var textEnter = text.enter().append("text")
            .style("fill-opacity", 1)
            .style("fill", function(d) {
                return self.brightness(d3.rgb(self.color(d))) < 125 ? "#cccccc" : "#000000";
            })
            .attr("text-anchor", function(d) {
                return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
            })
            .attr("dy", ".2em")
            .attr("transform", function(d) {
                var multiline = (d.name || "").split(" ").length > 1,
                angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                rotate = angle + (multiline ? - 0.5 : 0);
                return "rotate(" + rotate + ")translate(" + (y(d.y) + self.padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
            });
//             .on("click", self.click.bind(self));

    textEnter.append("tspan")
        .attr("x", 0)
        .text(function(d) { return d.depth && d.name ? d.name.split(" ")[0] : ""; });

    for (var i = 1; i < 4; i++) {
      textEnter.append("tspan")
          .attr("x", 0)
          .attr("dy", "1em")
          .text(function(d) { return d.depth && d.name ? d.name.split(" ")[i] || "" : ""; });
    }

  },

  actions: {
    goBack: function() {
//       set(this, 'currFilter', 1);
//       this._renderStruc();
      this.get('eventManager').trigger('setDetails', { unitid: 1, extended: false, sync: true});
    },
  }
});
