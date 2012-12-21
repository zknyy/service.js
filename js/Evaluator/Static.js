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
    "js/Promise"
], function (
    util,
    Promise
) {
    "use strict";

    function StaticEvaluator(value) {
        this.value = value;
    }

    util.extend(StaticEvaluator.prototype, {
        get: function (name) {
            return new Promise().resolve(this.value);
        }
    });

    return StaticEvaluator;
});
