import Ember from 'ember';
import d3 from 'd3';

var get = Ember.get;
var set = Ember.set;

var radius = 0;
var padding = 5;
var duration = 500;
var x = 0;
var y = 0;

        function makeSVG(tag, attrs) {
            var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
            ["id", "data-unitid", "d", "fill-rule", "width", "height", "style"].forEach(function(prop) {
                console.debug(">>>>", prop, Ember.$(attrs));
//                 console.debug(">",  Ember.$(attrs).);
            });
//                 el.setAttribute(k, attrs[k]);
//             for (var k in attrs)
//                 el.setAttribute(k, attrs[k]);
            return el;
        }

export default Ember.Component.extend({
  classNames: ['org-tree'],
  eventManager: Ember.inject.service('events'),
  store: Ember.inject.service(),

//   content: null,
//   width: 0,
//   height = 0;
  path: null,
  text: null,
  currPath: null,
  currSelection: null,

  partition: d3.layout.partition()
      .sort(null)
      .value(function(d) { return 18 - d.depth; }),

  arc: d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),

  setup: Ember.on('didInsertElement', function() {
    var $container = Ember.$(
        '<svg id="svg" preserveAspectRatio="xMinYMin" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">' +
        '<defs>' +
        '<pattern id="img1" patternUnits="userSpaceOnUse">' +
        '<image xlink:href="http://www.oddysee.org/wp-content/plugins/orgtool-wordpress-plugin/oddysee-tool/app/assets/oddysee-logo-glow.svg" width="106px" height="106px" x="0px" y="0px"></image>' +
        '</pattern>' +
        '</defs>' +
        '</svg>');
    
    this.$().append($container);
    Ember.run.next(this, this._renderStruc);

    $(window).bind('resize', this.get('_renderStruc').bind(this));
  }),

  willDestroy: function() {
    $(window).unbind('resize', this.get('_renderStruc'));
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
//       return "";
      return "url(#img1)";
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
//     this.currPath = [ d ];

//     var temp = d;
//     while (temp.parent) {
//       this.currPath.push(temp.parent);
//       temp = temp.parent;
//     }

    var id = Ember.$(d.target).data('unitid');
    if (id !== undefined) {
      var $sel = this.get('currSelection');
      if ($sel) {
        $sel.attr("class", "");
      }
      var $path = Ember.$(d.target);
      $path.attr("class", "selected");
      this.set('currSelection', $path);

      this.get('eventManager').trigger('setDetails', id);
    }
  },
  mouseover: function(d) {
//       var $path = Ember.$(d.target);
//     var id = Ember.$(d.target).data('unitid');

    var g = d3.select("#org_group");
    var marker = makeSVG('path', this);
//     var r = '' + this; // g.append( Ember.$(this));
    console.debug("copy", d, '-', g, '-',   Ember.$(this), '-', marker);
  },
  mouseout: function(d) {
    console.debug("remove copy", d);
  },

  _transformData: function() {
    var org = null;
    var data = get(this, 'units');
    for (var i = 0; i < get(data, 'length') && !org; i++) {
      var el = data.objectAt(i);
      if (get(el, 'type') === "org") {
        org = el;
      }
    };

    return this._serializeChildren(org);
  },

  _serializeChildren: function(obj) {
    var self = this;
    if (obj) {
      var ret = obj.serialize();
      ret.id = get(obj, 'id');
      get(obj, 'units').forEach(function(unit) {
        if (ret.color) {
          unit.set('color', ret.color);
        }
        var unit_ser = unit.serialize();

        if (!ret.children) {
          ret.children = [unit_ser];
        } else {
          ret.children.push(unit_ser);
        }
        ret.children[ret.children.length - 1] = self._serializeChildren(unit);
      });

      if (ret.children) {
        ret.color = "";
      }
    }
    return ret;
  },

  _renderStruc: function() {
    var struc = this._transformData();
    if (!struc) {
      return;
    }

    console.debug(">>>> ", struc);
    var div = Ember.$(".org-tree");
    var width = div.width();
    var height = div.height();

//     width = height = Math.min(width, height);
    var diff = padding;
    if (height > width) {
      diff = (height - width) / 2;
      height = width;
    } else if (width > height) {
      diff = (width - height) / 2;
      width = height;
    }
    radius = (width - 20) / 2;
//     console.debug(">>>> w", width, 'h', height, 'diff', diff);

    x = d3.scale.linear().range([0, 2 * Math.PI]);
    y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]);

    var svg = d3.select("#svg");

    var nodes = this.partition.nodes(struc);

    Ember.$("#org_group").remove();

    var vis = svg.append("g")
            .attr("id", "org_group")
            .attr("transform", "translate(" + [radius + diff, radius + diff] + ")");

    var self = this;
    this.path = vis.selectAll("path").data(nodes);
    this.path.enter().append("path")
            .attr("id", function(d, i) { return "path-" + d.id; })
            .attr("data-unitid", function(d, i) { return d.id; })
            .attr("d", this.arc)
            .attr("fill-rule", "evenodd")
            .attr("width", 100)
            .attr("height", 100)
            .style("fill", Ember.$.proxy(this.color, this))
            .on("click", Ember.$.proxy(this.click, this))
//             .on("mouseover", function(d) {
//               console.debug("fuckoin scope", this, d);
//             } );
            .on("mouseover", self.mouseover);
//             .on("mouseover", Ember.$.proxy(this.mouseover, this))
//             .on("mouseout", Ember.$.proxy(this.mouseout, this));
//             .on("click", self.click.bind(self));

    
//     var iw = 106;
//     var ih = 106;
//     var xoffset = document.getElementById("path-1").getBBox().width / 2;
//     var yoffset = xoffset;

//     console.debug(">>>", document.getElementById("path-1").getBBox().width / 2);

//     Ember.$("#img1")
//         .attr('x', radius  - iw / 2 + xoffset)
//         .attr('y', radius  - ih / 2 + yoffset)
//         .attr('width', iw)
//         .attr('height', ih);


    this.text = vis.selectAll("text").data(nodes);
    var textEnter = this.text.enter().append("text")
            .style("fill-opacity", 1)
            .style("fill", function(d) {
                return self.brightness(d3.rgb(Ember.$.proxy(this.color, this))) < 125 ? "#bbb" : "#000";
            })
            .attr("text-anchor", function(d) {
                return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
            })
            .attr("dy", ".2em")
            .attr("transform", function(d) {
                var multiline = (d.name || "").split(" ").length > 1,
                angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                rotate = angle + (multiline ? - 0.5 : 0);
                return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
            });
//             .on("click", self.click.bind(self));

    textEnter.append("tspan")
        .attr("x", 0)
        .text(function(d) { return d.depth ? d.name.split(" ")[0] : ""; });

    textEnter.append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(function(d) { return d.depth ? d.name.split(" ")[1] || "" : ""; });
  }
});
