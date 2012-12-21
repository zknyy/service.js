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

    function Service(name) {
        this.loaded = false;
        this.name = name;
        this.value = null;
    }

    util.extend(Service.prototype, {
        define: function (evaluator) {
            this.evaluator = evaluator;
        },

        get: function () {
            var service = this,
                evaluator = service.evaluator,
                promise = new Promise(service);

            if (service.loaded) {
                return promise.resolve(service.value);
            }

            evaluator.get()
                .done(function (value) {
                    service.loaded = true;
                    service.value = value;
                    promise.resolve(value);
                })
                .fail(promise);

            return promise;
        },

        getName: function () {
            return this.name;
        }
    });

    return Service;
});
