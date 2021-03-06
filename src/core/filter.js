window.multigraph.util.namespace("window.multigraph.core", function (ns) {
    "use strict";

    var Filter,
        defaultValues = window.multigraph.utilityFunctions.getDefaultValuesFromXSD(),
        attributes = window.multigraph.utilityFunctions.getKeys(defaultValues.plot.filter);

    Filter = new window.jermaine.Model("Filter", function () {
        this.hasMany("options").eachOfWhich.validatesWith(function (option) {
            return option instanceof ns.FilterOption;
        });
        this.hasA("type").which.validatesWith(function (type) {
            return typeof(type) === "string";
        });

        window.multigraph.utilityFunctions.insertDefaults(this, defaultValues.plot.filter, attributes);
    });

    ns.Filter = Filter;
});
