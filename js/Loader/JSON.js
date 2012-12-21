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
    "js/Exception"
], function (
    util,
    Exception
) {
    "use strict";

    var global = util.global,
        JSON = global.JSON;

    function JSONLoader(objectLoader) {
        this.objectLoader = objectLoader;
    }

    util.extend(JSONLoader.prototype, {
        load: function (json) {
            var message = "",
                object = null;

            try {
                object = JSON.parse(json);
            } catch (error) {
                message = ": " + error.toString();
            }

            if (object === null) {
                throw new Exception("JSONLoader.parse() :: Invalid JSON" + message);
            }

            this.objectLoader.load(JSON.parse(json));
        }
    });

    return JSONLoader;
});
