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
    "js/Container",
    "js/Loader/JSON",
    "js/Loader/Object"
], function (
    util,
    Container,
    JSONLoader,
    ObjectLoader
) {
    "use strict";

    function ServiceJS() {

    }

    util.extend(ServiceJS.prototype, {
        create: function () {
            var container = new Container(),
                objectLoader = new ObjectLoader(container),
                jsonLoader = new JSONLoader(objectLoader);

            return {
                container: container,
                objectLoader: objectLoader,
                jsonLoader: jsonLoader
            };
        }
    });

    return ServiceJS;
});
