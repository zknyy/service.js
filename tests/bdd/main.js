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
    "bdd/js/ContainerTest",
    "bdd/js/Loader/ObjectTest"
], function () {
    "use strict";

    mocha.run();
});
