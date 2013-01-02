/**
 * ServiceJS library v0.0.1
 * https://github.com/weejot/service.js
 *
 * Copyright 2012 Weejot (weejot.com)
 *
 * Released under the NCSA Open Source license
 * https://github.com/weejot/service.js/raw/master/NCSA-LICENSE.txt
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
