/**
 * ServiceJS library v0.0.1
 * http://?.com/
 *
 * Copyright 2012 ?.com
 * Released under the MIT license
 * http://?.com/license
 */

/*global require */
require({
    cache: false,
    paths: {
        "js": "/../../js",
        "bdd": ".",
        "vendor": "/../../vendor"
    }
}, [
    "vendor/chai/chai",
    "vendor/sinon-chai/lib/sinon-chai",
    "require"
], function (
    chai,
    sinonChai,
    require
) {
    "use strict";

    chai.use(sinonChai);

    require([
        "bdd/js/ContainerTest",
        "bdd/js/Loader/ObjectTest"
    ], function () {
        mocha.run();
    });
});
