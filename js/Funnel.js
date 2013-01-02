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
    "./Promise"
], function (
    util,
    Promise
) {
    "use strict";

    var hasOwn = {}.hasOwnProperty;

    /**
     * Funnel
     *
     * @class js/Funnel
     * @augments js/Promise
     * @param {Object} context
     * @param {Array} items
     * @param {Function} callback
     */
    function Funnel(context, items, callback) {
        var funnel = this,
            pending = 0,
            done = false,
            key,
            promise,
            results = util.isArray(items) ? [] : {};

        Promise.call(this, context);

        for (key in items) {
            if (hasOwn.call(items, key)) {
                promise = callback.call(items[key], items[key], key);

                if (promise && (promise instanceof Promise)) {
                    (function (key) {
                        // Wait for Promise to resolve before marking as done
                        pending += 1;

                        promise
                            .done(function (value) {
                                results[key] = value;
                                pending -= 1;
                                if (pending === 0 && done) {
                                    funnel.resolve();
                                }
                            })
                            .fail(function () {
                                funnel.reject();
                            });
                    }(key));
                }
            }
        }

        if (pending === 0) {
            funnel.resolve(results);
        }

        done = true;
    }

    util.inherit(Funnel).from(Promise);

    return Funnel;
});
