/**
 * ServiceJS library v0.0.1
 * https://github.com/weejot/service.js
 *
 * Copyright 2012 Weejot (weejot.com)
 *
 * Released under the NCSA Open Source license
 * https://github.com/weejot/service.js/raw/master/NCSA-LICENSE.txt
 */

/*global require, define */

/*
 * NB: Named defines will be used to encapsulate the module folder structure within this one file.
 *     Ordinarily, the definitions below would be anonymous and stored in separate module files:
 *     "Parser/Flow" would point to "/Parser/Flow.js", etc.
 */

// Module /util.js
define("util", [
    "modular" // The "modular" special dependency - used here to give a few useful utilities
], function (
    modular
) {
    "use strict";

    return modular.util;
});

// Module /Console.js
define("Console", [
    "util"
], function (
    util
) {
    "use strict";

    function Console() {
        this.writer = function () {};
    }

    util.extend(Console.prototype, {
        bind: function (args) {
            if (args.write) {
                this.writer = args.write;
            }
        },

        write: function (message) {
            this.writer(message);
        }
    });

    return Console;
});

// Module /Interpreter/Flow.js
define("Interpreter/Flow", [
    "util"
], function (
    util
) {
    "use strict";

    function FlowInterpreter(console) {
        this.console = console;
    }

    util.extend(FlowInterpreter.prototype, {
        run: function (program) {
            var console = this.console,
                runner = program.compile();

            runner(function (message) {
                console.write(message);
            });
        }
    });

    return FlowInterpreter;
});

// Module /Parser/Flow.js
define("Parser/Flow", [
    "util",
    "Program/Flow"
], function (
    util,
    FlowProgram
) {
    "use strict";

    function FlowParser() {

    }

    util.extend(FlowParser.prototype, {
        parse: function (code) {
            code = code.replace(/print\s+([\d.]+|"[^"]*");/g, "print($1);");
            return new FlowProgram(code);
        }
    });

    return FlowParser;
});

// Module /Program/Flow.js
define("Program/Flow", [
    "util"
], function (
    util
) {
    "use strict";

    function FlowProgram(code) {
        this.code = code;
    }

    util.extend(FlowProgram.prototype, {
        compile: function () {
            return new Function("print", this.code);
        }
    });

    return FlowProgram;
});

// Module /VM/Flow.js
define("VM/Flow", [
    "util"
], function (
    util
) {
    "use strict";

    function FlowVM(parser, interpreter) {
        this.parser = parser;
        this.interpreter = interpreter;
    }

    util.extend(FlowVM.prototype, {
        run: function (code) {
            var program = this.parser.parse(code);
            this.interpreter.run(program);
        }
    });

    return FlowVM;
});

require([
    "../service" // Path to service.js, with ".js" auto-appended by Modular
], function (
    service
) {
    "use strict";

    var components = service.create(),
        container = components.container,
        objectLoader = components.objectLoader,
        object = {
            "services": {
                "parser": {
                    "class": "Parser/Flow"
                },
                "interpreter": {
                    "class": "Interpreter/Flow",
                    "arguments": ["@console"]
                },
                "console": {
                    "class": "Console"
                },
                "vm": {
                    "class": "VM/Flow",
                    "arguments": ["@parser", "@interpreter"]
                }
            }
        },
        console,
        vm;

    objectLoader.load(object);

    container.get("console", "vm")
        .done(function (console, vm) {
            console.bind({
                "write": function (message) {
                    var item = document.createElement("li");
                    item.appendChild(document.createTextNode(message));
                    document.getElementById("console").appendChild(item);
                }
            });

            vm.run("print \"Hello from the Flow!\";");  // Will print "Hello from the Flow!" to the console
            vm.run("print 47;");  // Will print "47" to the console
        });
});
