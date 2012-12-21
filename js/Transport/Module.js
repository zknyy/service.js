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

    function ModuleTransport(loader) {
        this.loader = loader;
    }

    util.extend(ModuleTransport.prototype, {
        load: function (path) {
            var promise = new Promise();

            this.loader.require([
                path
            ], function (
                moduleValue
            ) {
                promise.resolve(moduleValue);
            });

            return promise;
        }
    });

    return ModuleTransport;
});
