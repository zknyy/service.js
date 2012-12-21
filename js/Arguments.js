/**
 * ServiceJS library v0.0.1
 * http://?.com/
 *
 * Copyright 2012 ?.com
 * Released under the MIT license
 * http://?.com/license
 */

/*global define */
define([
    "js/util",
    "js/Funnel",
    "js/Promise",
    "js/Service"
], function (
    util,
    Funnel,
    Promise,
    Service
) {
    "use strict";

    function Arguments(values) {
        this.values = values;
    }

    util.extend(Arguments.prototype, {
        get: function () {
            var args = this,
                values = args.values;

            return new Funnel(args, values, function (value) {
                if (value && (value instanceof Service)) {
                    return value.get();
                }

                return new Promise().resolve(value);
            });
        }
    });

    return Arguments;
});
