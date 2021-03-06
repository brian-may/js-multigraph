window.multigraph.util.namespace("window.multigraph.parser.jquery", function (ns) {
    "use strict";

    var DataValue = window.multigraph.core.DataValue;

    ns.mixin.add(function (ns, parse) {
        
        ns.core.DataVariable[parse] = function (xml, data) {
            var variable;
            if (xml && xml.attr("id")) {
                variable = new ns.core.DataVariable(xml.attr("id"));
                if (xml.attr("column")) {
                    variable.column(parseInt(xml.attr("column"), 10));
                }
                if (xml.attr("type")) {
                    variable.type(DataValue.parseType(xml.attr("type")));
                }
                if (xml.attr("missingvalue")) {
                    variable.missingvalue(DataValue.parse(variable.type(), xml.attr("missingvalue")));
                }
                if (xml.attr("missingop")) {
                    variable.missingop(DataValue.parseComparator(xml.attr("missingop")));
                }
            }
            return variable;
        };
        
    });

});
