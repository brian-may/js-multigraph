window.multigraph.util.namespace("window.multigraph.graphics.logger", function (ns) {
    "use strict";

    ns.mixin.add(function (ns) {

        window.multigraph.core.Img.hasA("image").which.defaultsTo(function () {return new Image();});
        window.multigraph.core.Img.hasA("fetched").which.defaultsTo(false);

        window.multigraph.core.Img.respondsTo("render", function (graph, width, height) {
            var that = this,
                paddingLeft,
                paddingTop,
                plotLeft,
                plotTop,
                ax,
                ay,
                bx,
                by,
                x,
                y,
                img;

            if (this.fetched()) {
                ax = window.multigraph.math.util.interp(this.anchor().x(), -1, 1, 0, this.image().width);
                ay = window.multigraph.math.util.interp(this.anchor().y(), 1, -1, 0, this.image().height);
                paddingLeft = graph.window().margin().left() + graph.window().border();
                paddingTop = graph.window().margin().top() + graph.window().border();
                plotLeft = paddingLeft + graph.window().padding().left() + graph.plotarea().margin().left() + graph.plotarea().border();
                plotTop = paddingTop + graph.window().padding().top() + graph.plotarea().margin().top() + graph.plotarea().border();
                if (this.frame() === "plot") {
                    bx = plotLeft + window.multigraph.math.util.interp(this.base().x(), -1, 1, 0, graph.plotBox().width());
                    by = plotTop + window.multigraph.math.util.interp(this.base().y(), 1, -1, 0, graph.plotBox().height());
                } else {
                    bx = paddingLeft + window.multigraph.math.util.interp(this.base().x(), -1, 1, 0, graph.paddingBox().width());
                    by = paddingTop + window.multigraph.math.util.interp(this.base().y(), 1, -1, 0, graph.paddingBox().height());
                }
                x = bx + this.position().x() - ax;
                y = by + this.position().y() - ay;

                img = {
                    "src" : this.src(),
                    "x"   : x,
                    "y"   : y
                };
                return img;
            } else {
                this.image().onload = function () {
                    that.fetched(true);
                    graph.render(width, height);
                };
                this.image().src = this.src();
            }
        });

    });

});
