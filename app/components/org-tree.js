import Ember from 'ember';
import d3 from 'd3';

var get = Ember.get;
var set = Ember.set;

var width = 630;
var height = width;
var radius = (width - 8) / 2;
var padding = 5;
var duration = 500;
var x = d3.scale.linear().range([0, 2 * Math.PI]);
var y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]);


export default Ember.Component.extend({
  classNames: ['org-tree'],
  content: null,


    path: null,
    text: null,
    currPath: null,

    partition: d3.layout.partition()
        .sort(null)
        .value(function(d) { return 15.8 - d.depth; }),

    arc: d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),

  setup: Ember.on('didInsertElement', function() {
    var $container = $(
        '<svg id="svg" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">' +
        '<defs>' +
        '<pattern id="img1" patternUnits="userSpaceOnUse">' +
        '<image xlink:href="http://www.oddysee.org/wp-content/plugins/orgtool-wordpress-plugin/oddysee-tool/app/assets/oddysee-logo-glow.svg" width="106px" height="106px" x="0" y="0"></image>' +
        '</pattern>' +
        '</defs>' +
        '</svg>');
    
    this.$().append($container);
    Ember.run.next(this, this._renderStruc);
  }),

    isParentOf: function (p, c) {
  if (p === c) {
//       if (p.id !== c.id) {
//           console.debug("found NOT parent:", p.id === c.id);
//       }
      return true;
  }
  if (p.children) {
    return p.children.some(function(d) {
      return isParentOf(d, c);
    });
  }
  return false;
},

 color: function(d) {
    if (d && d.depth === 0) {
        return "url(#img1)";
    }

      if (d.children) {
        var idx = d.children.length > 1 ? 1 : 0;
        var colors = d.children.map(color),
                a = d3.hsl(colors[0]),
                b = d3.hsl(colors[idx]);

        // L*a*b* might be better here...
        return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
      }

      return d.color || "#fff";
},

// Interpolate the scales!
arcTween: function(d) {
  var my = maxY(d),
      xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, my]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
//     console.debug("arc", xd, '|', yd, '-', yr, '  -   ', my);
//     console.debug("arc", my);
  return function(d) {
    return function(t) { 
        x.domain(xd(t));
        y.domain(yd(t)).range(yr(t));
        var ret = arc(d);
//         return arc(d);

//         console.debug("RET", d, '-', t);
        return ret;
    };
  };
},

maxY: function(d) {
    ret = d.children ? Math.max.apply(Math, d.children.map(maxY)) : d.y + d.dy;
    return ret;
},

// http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
brightness: function(rgb) {
  return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
},

click: function(d) {
/*
    currPath = [ d ];

    var temp = d;
    while (temp.parent) {
        currPath.push(temp.parent);
        temp = temp.parent;
    }


    setInfo(d);
    */

/***** ANIMATION *******/
/*  
    path.transition()
    .duration(duration)
    .attrTween("d", arcTween(d));

    // Somewhat of a hack as we rely on arcTween updating the scales.
    text.style("visibility", function(e) {
        return isParentOf(d, e) ? null : d3.select(this).style("visibility");
    })
    .transition()
    .duration(duration)
    .attrTween("text-anchor", function(d) {
        return function() {
            return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
        };
    })
    .attrTween("transform", function(d) {
        var multiline = (d.name || "").split(" ").length > 1;
        return function() {
            var angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
            rotate = angle + (multiline ? - 0.5 : 0);
            return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
        };
    })
    .style("fill-opacity", function(e) { return isParentOf(d, e) ? 1 : 1e-6; })
    .each("end", function(e) {
        if (currPath === d.name) {
            return;
        }

        d3.select(this).style("visibility", isParentOf(d, e) ? null : "hidden");
    });
*/
},

    _renderStruc: function() {
        console.debug("go go go");
        var svg = d3.select("#svg");
//         console.debug("serialized:", get(this, 'content').serialize());

        var pojso = {};
        get(this, 'content').forEach(function(s) {
            console.debug("wf", s.serialize());
        });

        var nodes = this.partition.nodes(get(this, 'content'));
        console.debug(">>>>>", nodes);

        console.debug(">>>>>", radius + padding, radius + padding );


        $("#org_group").remove();

        var vis = svg.append("g")
                .attr("id", "org_group")
                .attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

        this.path = vis.selectAll("path").data(nodes);
        this.path.enter().append("path")
                .attr("id", function(d, i) { return "path-" + d.id; })
                .attr("d", this.arc)
                .attr("fill-rule", "evenodd")
                .style("fill", this.color)
                .on("click", this.click);


        
        var iw = 106;
        var ih = 106;
        var xoffset = 2.0;
        var yoffset = xoffset;


        $("#img1")
            .attr('x', radius + padding - iw / 2 + xoffset)
            .attr('y', radius + padding - ih / 2 + yoffset)
            .attr('width', iw)
            .attr('height', ih);



        var self = this;
        this.text = vis.selectAll("text").data(nodes);
        var textEnter = this.text.enter().append("text")
                .style("fill-opacity", 1)
                .style("fill", function(d) {
                    return self.brightness(d3.rgb(self.color(d))) < 125 ? "#eee" : "#000";
                })
                .attr("text-anchor", function(d) {
                    return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
                })
                .attr("dy", ".2em")
                .attr("transform", function(d) {
    //                 console.debug("WTF", d);
                    var multiline = (d.name || "").split(" ").length > 1,
                    angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                    rotate = angle + (multiline ? - 0.5 : 0);
                    return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
                })
                .on("click", this.click);

        textEnter.append("tspan")
            .attr("x", 0)
            .text(function(d) { return d.depth ? d.name.split(" ")[0] : ""; });

        textEnter.append("tspan")
            .attr("x", 0)
            .attr("dy", "1em")
            .text(function(d) { return d.depth ? d.name.split(" ")[1] || "" : ""; });

    }
});
