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
    "modular",
    "js/Container",
    "js/Loader/JSON",
    "js/Transport/Module",
    "js/Loader/Object"
], function (
    util,
    modular,
    Container,
    JSONLoader,
    ModuleTransport,
    ObjectLoader
) {
    "use strict";

    function ServiceJS() {

    }

    util.extend(ServiceJS.prototype, {
        create: function (loader) {
            var container = new Container(),
                moduleTransport = new ModuleTransport(loader || modular),
                objectLoader = new ObjectLoader(container, moduleTransport),
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
