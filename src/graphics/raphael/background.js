window.multigraph.util.namespace("window.multigraph.graphics.raphael", function (ns) {
    "use strict";

    ns.mixin.add(function (ns) {

        var Background = ns.Background;

        Background.hasAn("elem");

        Background.respondsTo("render", function (graph, paper, set, width, height) {
            var mb = graph.window().margin().left() + graph.window().border(),
                elem = paper.rect(mb, mb, width-2*mb, height-2*mb)
                    .attr({
                        "fill"   : this.color().getHexString("#"),
                        "stroke" : "none"
                    });

            this.elem(elem);
            set.push(elem);

            if (this.img() && this.img().src() !== undefined) {
                this.img().render(graph, paper, set, width, height);
            }
        });

        Background.respondsTo("redraw", function (graph, width, height) {
            var mb = graph.window().margin().left() + graph.window().border() * 2,
                bwidth  = width - mb,
                bheight = height - mb,
                elem = this.elem();

            if (elem.attr("width") !== bwidth) {
                elem.attr("width", bwidth);
            }
            if (elem.attr("height") !== bheight) {
                elem.attr("height", bheight);
            }

            if (this.img() && this.img().src() !== undefined) {
                this.img().redraw(graph);
            }
        });

    });

});
