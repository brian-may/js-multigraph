window.multigraph.util.namespace("window.multigraph.core", function (ns) {
    "use strict";

    /**
     * @module multigraph
     * @submodule core
     */

    var Legend,
        defaultValues = window.multigraph.utilityFunctions.getDefaultValuesFromXSD(),
        attributes = window.multigraph.utilityFunctions.getKeys(defaultValues.legend);

    /**
     * Legend is a Jermaine model that supports the rendering of Multigraph Legends.
     * 
     * The methods for this object take a parameter called `graphicsContext`, which is a
     * driver-specific object that stores whatever state/configuration is needed by the
     * driver.  Each driver is responsible for creating its own graphicsContext object and
     * passing it to these methods, which in turn pass that object on to the driver-specific
     * methods that they call.
     * 
     * @class Legend
     * @for Legend
     * @constructor
     * @requires Point,RGBColor,Plot,Icon
    */
    Legend = new window.jermaine.Model("Legend", function () {
        /**
         * The value which determines if the legend will be rendered; a value of `true` means the Legend will
         * be drawn while `false` means that it will not.
         *
         * @property visible
         * @type {boolean}
         * @author jrfrimme
         */
        this.hasA("visible").which.validatesWith(function (visible) {
            return typeof visible === "boolean" || visible === null;
        });

        /**
         * The value which gives the location of the base point relative to the Legend's frame.
         *
         * @property base
         * @type {Point}
         * @author jrfrimme
         */
        this.hasA("base").which.validatesWith(function (base) {
            return base instanceof window.multigraph.math.Point;
        });

        /**
         * The value which gives the location of the Legend's anchor point to be attached to the base point.
         *
         * @property anchor
         * @type {Point}
         * @author jrfrimme
         */
        this.hasAn("anchor").which.validatesWith(function (anchor) {
            return anchor instanceof window.multigraph.math.Point;
        });

        /**
         * A coordinate pair of pixel offsets for the base point.
         *
         * @property position
         * @type {Point}
         * @author jrfrimme
         */
        this.hasA("position").which.validatesWith(function (position) {
            return position instanceof window.multigraph.math.Point;
        });

        /**
         * The value which determines whether the legend is positioned relative to the plot area or the padding
         * box. A value of `plot` means the Legend will be drawn relative to the plot area while `padding` means
         * that it will the padding box.
         *
         * @property frame
         * @type {String}
         * @author jrfrimme
         */
        this.hasA("frame").which.validatesWith(function (frame) {
            return frame === "plot" || frame === "padding";
        });

        /**
         * The value which determines the background color of the Legend.
         *
         * @property color
         * @type {RGBColor}
         * @author jrfrimme
         */
        this.hasA("color").which.validatesWith(function (color) {
            return color instanceof window.multigraph.math.RGBColor;
        });

        /**
         * The value which determines the bordercolor of the Legend.
         *
         * @property bordercolor
         * @type {RGBColor}
         * @author jrfrimme
         */
        this.hasA("bordercolor").which.validatesWith(function (bordercolor) {
            return bordercolor instanceof window.multigraph.math.RGBColor;
        });

        /**
         * The value which determines the opacity of the Legend; depending on where the Legend is positioned it
         * may obscure parts of the plot data.
         *
         * @property opacity
         * @type {Float}
         * @author jrfrimme
         */
        this.hasA("opacity").which.validatesWith(function (opacity) {
            return window.multigraph.utilityFunctions.validateNumberRange(opacity, 0.0, 1.0);
        });

        /**
         * The value which determines the thickness of the border drawn around the Legend; a value of `0` turns
         * the border off.
         *
         * @property border
         * @type {Integer}
         * @author jrfrimme
         */
        this.hasA("border").which.isA("integer");

        /**
         * The value which determines the number of rows to be used for Plot entries in the Legend. If left
         * unspecified then rows will be inserted to account for each Plot entry.
         *
         * @property rows
         * @type {Integer}
         * @author jrfrimme
         */
        this.hasA("rows").which.isA("integer").and.isGreaterThan(0);

        /**
         * The value which determines the number of columns to be used for Plot entries in the Legend. If rows
         * is set while columns is left unspecified then columns will be inserted to account for each Plot
         * entry.
         *
         * @property columns
         * @type {Integer}
         * @author jrfrimme
         */
        this.hasA("columns").which.isA("integer").and.isGreaterThan(0);

        /**
         * The value which determines whether the corners of the legend box are rounded when drawn. A value of
         * `0` means that the corners will be drawn square while values greater than `0` mean that the corners
         * are rounded off with circles whose radius in pixels is this value.
         *
         * @property cornerradius
         * @type {Integer}
         * @author jrfrimme
         */
        this.hasA("cornerradius").which.isA("integer");

        /**
         * The value which determines the pixel width of the padding between the Legend border and its entries.
         *
         * @property padding
         * @type {Integer}
         * @author jrfrimme
         */
        this.hasA("padding").which.isA("integer");

        /**
         * A optional sub-model which determines the appearance of the Icons for the Plot entries.
         *
         * @property icon
         * @type {Icon}
         * @author jrfrimme
         */
        this.hasAn("icon").which.validatesWith(function (icon) {
            return icon instanceof ns.Icon;
        });

        this.isBuiltWith(function () {
            this.icon( new ns.Icon() );
        });

        /**
         * Pointers to Plot models that have entries in the Legend.
         *
         * @property plots
         * @type {Plot}
         * @author jrfrimme
         */
        this.hasMany("plots").eachOfWhich.validateWith(function (plot) {
            return plot instanceof ns.Plot;
        });

        /**
         * Internal value which determines the number of pixels between an entries icon and its border.
         *
         * @property iconOffset
         * @type {Integer}
         * @default 5
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("iconOffset").which.isAn("integer").and.defaultsTo(5);

        /**
         * Internal value which determines the number of pixels between an entries label and its icon.
         *
         * @property labelOffset
         * @type {Integer}
         * @default 5
         * @private
         * @final
         * @type {}
         * @author jrfrimme
         */
        this.hasA("labelOffset").which.isAn("integer").and.defaultsTo(5);

        /**
         * Internal value which determines the number of pixels between the right end of an entries label and
         * its border
         *
         * @property labelEnding
         * @type {Integer}
         * @default 15
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("labelEnding").which.isAn("integer").defaultsTo(15);

        /**
         * Computed value of the width of the Legend.
         *
         * @property width
         * @type {Float}
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("width").which.isA("number");

        /**
         * Computed value of the height of the Legend.
         *
         * @property height
         * @type {Float}
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("height").which.isA("number");

        /**
         * Computed `x` value of the Legend's lower left corner relative to its frame.
         *
         * @property x
         * @type {Float}
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("x").which.isA("number");

        /**
         * Computed `y` value of the Legend's lower left corner relative to its frame.
         *
         * @property y
         * @type {Float}
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("y").which.isA("number");

        /**
         * Computed width of an individual plot entry.
         *
         * @property blockWidth
         * @type {Float}
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("blockWidth").which.isA("number");

        /**
         * Computed height of an individual plot entry.
         *
         * @property blockHeight
         * @type {Float}
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("blockHeight").which.isA("number");

        /**
         * Computed width of the longest label of all plot entries.
         *
         * @property maxLabelWidth
         * @type {Float}
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("maxLabelWidth").which.isA("number");

        /**
         * Maximum value of the Icon's height and the computed height of the tallest label of all plot entries.
         *
         * @property maxLabelHeight
         * @type {Float}
         * @private
         * @final
         * @author jrfrimme
         */
        this.hasA("maxLabelHeight").which.isA("number");

        this.respondsTo("determineVisibility", function () {
            switch (this.visible()) {
                case true:
                    return true;
                case false:
                    return false;
                case null:
                    if (this.plots().size() > 1) {
                        return true;
                    } else {
                        return false;
                    }
            }
        });

        /**
         * Initializes the Legend's geometry. Determines values for the internal attributes `maxLabelWidth`,
         * `maxLabelHeight`, `blockWidth`, `blockHeight`, `width`, `height`, `x` and `y`; these values
         * determine the size and position of the legend and its various internal components, and need
         * to be recomputed whenever the geometry of the containing graph changes;  this method is
         * called by Graph.initializeGeometry().
         * 
         * @method initializeGeometry
         * @chainable
         * @param {Graph} graph Jermaine Graph model
         * @param {Object} graphicsContext driver-specific graphics context object
         * @author jrfrimme
         * @todo Find out whether or not padding needs to be taken into consideration.
         */
        this.respondsTo("initializeGeometry", function (graph, graphicsContext) {
            var widths = [],
                heights = [],
                label,
                i;

            if (this.determineVisibility() === false) {
                return this;
            }

            for (i = 0; i < this.plots().size(); i++) {
                label = this.plots().at(i).legend().label();
                if (label !== undefined) {
                    label.initializeGeometry(graphicsContext);
                    widths.push(label.origWidth());
                    heights.push(label.origHeight());
                }
            }

            widths.sort(function (a, b) {
                return b - a;
            });
            heights.sort(function (a, b) {
                return b - a;
            });
            this.maxLabelWidth(widths[0]);
            this.maxLabelHeight(Math.max(heights[0], this.icon().height()));

            this.blockWidth(this.iconOffset() + this.icon().width() + this.labelOffset() + this.maxLabelWidth() + this.labelEnding());
            this.blockHeight(this.iconOffset() + this.maxLabelHeight());

// TODO: find out whether or not padding needs to be taken into consideration
            this.width((2 * this.border()) + (this.columns() * this.blockWidth()));
            this.height((2 * this.border()) + (this.rows() * this.blockHeight()) + this.iconOffset());

            if (this.frame() === "padding") {
                this.x(((this.base().x() + 1) * graph.paddingBox().width()/2) - ((this.anchor().x() + 1) * this.width()/2) + this.position().x());
                this.y(((this.base().y() + 1) * graph.paddingBox().height()/2) - ((this.anchor().y() + 1) * this.height()/2) + this.position().y());
            } else {
                this.x(((this.base().x() + 1) * graph.plotBox().width()/2) - ((this.anchor().x() + 1) * this.width()/2) + this.position().x());
                this.y(((this.base().y() + 1) * graph.plotBox().height()/2) - ((this.anchor().y() + 1) * this.height()/2) + this.position().y());
            }

            return this;
        });

        /**
         * Renders the legend; calls various driver-specific graphics functions to do the
         * actual drawing of the various parts of the legend (background, borders, icons,
         * text).
         * 
         * @method render
         * @chainable
         * 
         * @param {Object} graphicsContext driver-specific graphics context object
         * 
         * @author jrfrimme
         */
        this.respondsTo("render", function (graphicsContext) {
            var blockx, blocky,
                iconx, icony,
                labelx, labely,
                plotCount = 0,
                r, c;

            if (this.determineVisibility() === false) {
                return this;
            }

            // perform any neccesary setup
            this.begin(graphicsContext);

            // Draw the legend box
            this.renderLegend(graphicsContext);

            for (r = 0; r < this.rows(); r++) {
                if (plotCount >= this.plots().size()) {
                    break;
                }
                blocky = this.border() + ((this.rows() - r - 1) * this.blockHeight());
                icony  = blocky + this.iconOffset();
                labely = icony;
                for (c = 0; c < this.columns(); c++) {
                    if (plotCount >= this.plots().size()) {
                        break;
                    }
                    blockx = this.border() + (c * this.blockWidth());
                    iconx  = blockx + this.iconOffset();
                    labelx = iconx + this.icon().width() + this.labelOffset();

                    // Draw the icon
                    this.plots().at(plotCount).renderer().renderLegendIcon(graphicsContext, iconx, icony, this.icon(), this.opacity());
                    
                    // Draw the icon border
                    if (this.icon().border() > 0) {
                        this.icon().renderBorder(graphicsContext, iconx, icony, this.opacity());
                    }
                    
                    // Write the text
                    this.renderLabel(this.plots().at(plotCount).legend().label(), graphicsContext, labelx, labely);

                    plotCount++;
                }
            }

            // preform any neccesary steps at the end of rendering
            this.end(graphicsContext);

            return this;
        });

        window.multigraph.utilityFunctions.insertDefaults(this, defaultValues.legend, attributes);
    });

    ns.Legend = Legend;

});
