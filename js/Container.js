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
    "js/Exception",
    "js/Service",
    "js/Evaluator/Static"
], function (
    util,
    Exception,
    Service,
    StaticEvaluator
) {
    "use strict";

    var hasOwn = {}.hasOwnProperty;

    function Container() {
        this.parameters = {};
        this.services = {};
    }

    util.extend(Container.prototype, {
        define: function (service) {
            this.services[service.getName()] = service;
        },

        get: function (name) {
            if (!hasOwn.call(this.services, name)) {
                throw new Exception("Container.get() :: Service with name '" + name + "' not found");
            }

            return this.services[name].get();
        },

        getParameter: function (name) {
            if (!hasOwn.call(this.parameters, name)) {
                throw new Exception("Container.getParameter() :: Parameter with name '" + name + "' not found");
            }

            return this.parameters[name];
        },

        set: function (name, value) {
            if (hasOwn.call(this.services, name)) {
                throw new Exception("Container.set() :: Service already defined with name '" + name + "'");
            }

            this.services[name] = new Service(name);
            this.services[name].define(new StaticEvaluator(value));
        },

        setParameter: function (name, value) {
            this.parameters[name] = value;
        }
    });

    return Container;
});
