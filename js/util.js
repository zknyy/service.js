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
