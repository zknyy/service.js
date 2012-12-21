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
