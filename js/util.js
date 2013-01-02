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
    "modular"
], function (
    modular
) {
    "use strict";

    var util = modular.util.extend({}, modular.util, {
        inherit: function (To) {
            return {
                from: function (From) {
                    To.prototype = Object.create(From.prototype);
                    To.prototype.constructor = To;
                }
            };
        },

        regex: {
            escape: function (string) {
                return string;
            }
        },

        string: {
            replace: function (string, find, replace) {
                var pattern;

                find = "" + find;
                replace = "" + replace;
                string = "" + string;

                pattern = new RegExp(util.regex.escape(find), "g");
                replace = replace.replace(/\$/, "\\$");

                return string.replace(pattern, replace);
            }
        }
    });

    return util;
});
