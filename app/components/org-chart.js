import Ember from 'ember';
import d3 from 'd3';

var get = Ember.get;
var set = Ember.set;

var x = 0;
var y = 0;

export default Ember.Component.extend({
  classNames: ['org-chart'],
  eventManager: Ember.inject.service('events'),
  store: Ember.inject.service(),

  radius: 0,
  padding: 6,
  currPath: null,
  currSelection: null,
  currFilter: "game",
  lastSelection: null,
  showNav: Ember.computed.equal('currFilter', 'game'),
  units: null,
  orgType: null,
  unitTypes: null,

  partition: d3.layout.partition()
      .sort(null)
      .value(function(d) { return 18 - d.depth; }),

  arc: d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),

  setup: Ember.on('didInsertElement', function() {
    this.get('eventManager').on('rerender', this._renderStruc.bind(this));
    $(window).bind('resize', this.get('_renderStruc').bind(this));
  }),

  willDestroy: function() {
    $(window).unbind('resize', this.get('_renderStruc'));
    this.get('eventManager').off('rerender');
  },

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
      return "";
    }

    if (d.children) {
      var idx = d.children.length > 1 ? 1 : 0;
      var self = this;
      var colors = d.children.map(Ember.$.proxy(this.color, this)),
                    a = d3.hsl(colors[0]),
                    b = d3.hsl(colors[idx]);

      // L*a*b* might be better here...
      return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
    }

    return d.color || "#fff";
  },


  click: function(d) {
    var id = Ember.$(d.target).data('unitid');
    if (id !== undefined) {
      var select = false;
      if (id == 1) {
        this.get('eventManager').trigger('setDetails', undefined);
      } else if (get(this, 'currFilter') === "game") {
        set(this, 'currFilter', id);
        this._renderStruc();
        select = true;
//       } else if (get(this, 'currFilter') == id) {
//         set(this, 'currFilter', "game");
//         this._renderStruc();
//         this.get('eventManager').trigger('setDetails', undefined);
      } else {
        select = true;
      }

      if (select) {
        var $sel = this.get('currSelection');
        if ($sel) {
          $sel.attr("class", "unit-pilots-path");
        }
        var $path = Ember.$(d.target);
        $path.attr("class", "unit-pilots-path selected");
        this.set('currSelection', $path);

        this.get('eventManager').trigger('setDetails', id);
      }
    }
  },

  
  mouseover: function(d) {
  },

  mouseout: function(d) {
  },

  _serializeChildren: function(obj) {
    var self = this;
    if (obj) {
      var ret = obj.serialize();
      ret.id = get(obj, 'id');
      get(obj, 'units').forEach(function(unit) {
        var add = false;
        if (self.currFilter === "game" && unit.get('type.name') == "game") {
          add = true;
        } else if (self.currFilter !== "game") {
          add = true;
        }

        if (add) {
          if (ret.color && unit.get('color') == "") {
            unit.set('color', ret.color);
          }
          var unit_ser = unit.serialize();

          if (!ret.children) {
            ret.children = [unit_ser];
          } else {
            ret.children.push(unit_ser);
          }
          ret.children[ret.children.length - 1] = self._serializeChildren(unit);
        }
      });

      if (ret.children) {
        ret.color = "";
      }
    }
    return ret;
  },

  _transformData: function() {
    var root = null;
    var data = get(this, 'units');
    var filter = get(this, 'currFilter');

    var orgtype = get(this, 'orgType');
    if (!orgtype) {
      return root;
    }

    if (data) {
      for (var i = 0; i < get(data, 'length') && !root; i++) {
        var el = data.objectAt(i);
        if (get(el, 'type.isLoaded')) {
          if (filter === "game" && get(el, 'type.name') === get(orgtype, 'name')) {
            root = el;
          } else if (filter !== "game" && get(el, 'id') == filter) {
            root = el;
          }
        }
      }
    }

    return root; //this._serializeChildren(root);
  },

  _renderStruc: function() {
//     $('.unit-logo').attr('src', '');

    var root = this._transformData();
    var struc = this._serializeChildren(root);
    if (!struc) {
      var data = get(this, 'units');

    console.debug("render return, struc empty");
      return;
    }

//     console.debug("render ", struc);
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

    var vis = svg.append("g")
            .attr("id", "org_group")
            .attr("transform", "translate(" + center + ")");


    var path = vis.selectAll("path").data(nodes);
    path.enter().append("path")
            .attr("id", function(d, i) { return "path-" + d.id; })
            .attr("data-unitid", function(d, i) { return d.id; })
            .attr("d", this.arc)
            .attr("fill-rule", "evenodd")
            .attr("width", 10)
            .attr("height", 10)
            .attr("class", "unit-pilots-path")
            .attr("fill-opacity", function(d, i) { return (d && d.depth === 0) ? "0.0" : "1"; })
            .style("fill", Ember.$.proxy(this.color, this))
            .on("click", Ember.$.proxy(this.click, this))
            .on("mouseover", self.mouseover);
//             .on("mouseover", Ember.$.proxy(this.mouseover, this))
//             .on("mouseout", Ember.$.proxy(this.mouseout, this));
//             .on("click", self.click.bind(self));


    var box = document.getElementById("org_group").firstChild.getBBox();
    var ipos = [ center[0] - (box.width / 2), center[1] - (box.height / 2)];
    
//     Ember.$(".img-pane").empty();

//     var src = root.get('img');
//     if (!src) {
    var src = "http://www.oddysee.org/wp-content/plugins/orgtool-wordpress-plugin/oddysee-tool/app/assets/oddysee-logo-glow.svg";
//     }

    $('.unit-logo')
        .attr('src', src)
        .attr('style', "left:" + ipos[0] + "px;top:" + ipos[1] + "px")
        .attr('width', box.width)
        .attr('height', box.height);

    self = this;
    var text = vis.selectAll("text").data(nodes);
    var textEnter = text.enter().append("text")
            .style("fill-opacity", 1)
            .style("fill", function(d) {
                return self.brightness(d3.rgb(self.color(d))) < 125 ? "#bbb" : "#000";
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

    textEnter.append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(function(d) { return d.depth && d.name ? d.name.split(" ")[1] || "" : ""; });
  },

  actions: {
    goBack: function() {
      set(this, 'currFilter', "game");
      this._renderStruc();
      this.get('eventManager').trigger('setDetails', undefined);
    },
  }
});
