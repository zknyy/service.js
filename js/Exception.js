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
    "js/util"
], function (
    util
) {
    "use strict";

    function Exception(message, parent) {
        this.message = message;
        this.parent = parent;
    }

    util.inherit(Exception).from(Error);

    util.extend(Exception.prototype, {
        getMessage: function () {
            var exception = this,
                message = this.message,
                parent = this.parent;

            if (parent) {
                message += " << " + (parent instanceof Exception ? parent.getMessage() : parent.toString());
            }

            return message;
        },

        name: "Exception"
    });

    return Exception;
});
