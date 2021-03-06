/*
 * Modular - JavaScript AMD Framework
 * Copyright 2013 Dan Phillimore (asmblah)
 * http://asmblah.github.com/modular/
 *
 * Implements the AMD specification - see https://github.com/amdjs/amdjs-api/wiki/AMD
 *
 * Released under the MIT license
 * https://github.com/asmblah/modular/raw/master/MIT-LICENSE.txt
 */

/*global define */
define([
    "vendor/chai/chai",
    "vendor/sinon/sinon",
    "root/modular"
], function (
    chai,
    sinon,
    modular
) {
    "use strict";

    var expect = chai.expect;

    describe("define()/require()", function () {
        var loader;

        beforeEach(function (done) {
            modular.require([
                "Modular"
            ], function (
                Modular
            ) {
                loader = new Modular();
                done();
            });
        });

        it("should publish support for the AMD pattern", function () {
            expect(loader.createDefiner().amd).to.be.ok;
        });

        it("should publish special jQuery AMD support"/*, function () {
            expect(loader.createDefiner().amd).to.deep.equal({
                jQuery: true
            });
        }*/);

        it("should define a module with value null if just passed an id", function () {
            loader.define("hooman");

            expect(loader.getModule("hooman").getValue()).to.equal(null);
        });

        it("should do nothing when no transport defined and defining an anonymous module with just an object", function () {
            var value = { name: "Mr. Hyde" };

            expect(function () {
                loader.define(value);
            }).to.not.Throw();
        });

        it("should throw an error if attempting to define a module with an id that is already defined", function () {
            expect(function () {
                loader.define("my-mod");
                loader.define("my-mod");
            }).to.Throw(/Module '.*?' has already been defined/);
        });

        it("should throw an error if null is specified as a dependency id", function () {
            expect(function () {
                loader.define("test", [ null ], {});
            }).to.Throw(/Invalid dependency id/);
        });

        it("should make the Modular class available as the 'Modular' named dependency", function (done) {
            loader.require([
                "Modular"
            ], function (
                ModularClass
            ) {
                expect(ModularClass).to.equal(loader.constructor);
                done();
            });
        });

        it("should make the owning Modular instance available as the 'modular' named dependency", function (done) {
            loader.require([
                "modular"
            ], function (
                modularObject
            ) {
                expect(modularObject).to.equal(loader);
                done();
            });
        });

        it("should inherit properties of the config of its dependent", function (done) {
            loader.define({
                "child": "is-there"
            }, "test/Parent", [
                "module" // CommonJS "module" special dependency
            ], function (
                module
            ) {
                expect(module.config["parent"]).to.equal("is-here");
                done();
            });

            loader.require({
                "parent": "is-here"
            }, [
                "test/Parent"
            ]);
        });

        it("should override the config properties of the parent with those of the child", function (done) {
            loader.define({
                "oh set": "me"
            }, "test/Parent");

            loader.require({
                "oh set": "you"
            }, [
                "module", // CommonJS "module" special dependency
                "test/Parent"
            ], function (
                module,
                Parent
            ) {
                expect(module.config["oh set"]).to.equal("you");
                done();
            });
        });

        it("should resolve relative dependency IDs with parent term at start", function (done) {
            var value = {};

            loader.define("start/end", value);

            loader.require("start/from/here", [
                "../end"
            ], function (
                passedValue
            ) {
                expect(passedValue).to.equal(value);
                done();
            });
        });

        it("should resolve relative dependency IDs with parent term in middle", function (done) {
            var value = {};

            loader.define("module/in/here/somewhere", value);

            loader.require([
                "module/in/there/../here/somewhere"
            ], function (
                passedValue
            ) {
                expect(passedValue).to.equal(value);
                done();
            });
        });

        it("should resolve relative dependency IDs with same-directory term at start", function (done) {
            var value = {};

            loader.define("start/from/end", value);

            loader.require("start/from/here", [
                "./end"
            ], function (
                passedValue
            ) {
                expect(passedValue).to.equal(value);
                done();
            });
        });

        it("should resolve relative dependency IDs with same-directory term in middle", function (done) {
            var value = {};

            loader.define("module/in/here/somewhere", value);

            loader.require([
                "module/in/./here/somewhere"
            ], function (
                passedValue
            ) {
                expect(passedValue).to.equal(value);
                done();
            });
        });

        it("should resolve relative dependency IDs with multiple consecutive same-directory terms in middle", function (done) {
            var value = {};

            loader.define("module/in/here/somewhere", value);

            loader.require([
                "module/in/././././here/somewhere"
            ], function (
                passedValue
            ) {
                expect(passedValue).to.equal(value);
                done();
            });
        });

        it("should resolve relative dependency IDs with same-directory '//' term in middle", function (done) {
            var value = {};

            loader.define("module/in/here/somewhere", value);

            loader.require([
                "module/in//here/somewhere"
            ], function (
                passedValue
            ) {
                expect(passedValue).to.equal(value);
                done();
            });
        });

        it("should resolve relative dependency IDs with multiple consecutive same-directory '//' terms in middle", function (done) {
            var value = {};

            loader.define("module/in/here/somewhere", value);

            loader.require([
                "module/in////here/somewhere"
            ], function (
                passedValue
            ) {
                expect(passedValue).to.equal(value);
                done();
            });
        });

        it("should only evaluate a factory function for a module once", function (done) {
            var factory = function () { return {}; };

            loader.define("magic", factory);

            loader.require([
                "magic"
            ], function (
                earlyImportedMagic
            ) {
                loader.require([
                    "magic"
                ], function (
                    lateImportedMagic
                ) {
                    expect(lateImportedMagic).to.equal(earlyImportedMagic);
                    done();
                });
            });
        });

        it("should pass dependencies to closure in the order requested", function () {
            var dep1 = {},
                dep2 = {};

            loader.define("dep1", dep1);
            loader.define("dep2", dep2);
            loader.require([
                "dep1",
                "dep2"
            ], function (
                importedDep1,
                importedDep2
            ) {
                expect(importedDep1).to.equal(dep1);
                expect(importedDep2).to.equal(dep2);
            });
        });

        it("should pass factories through factoryFilter() if specified", function (done) {
            var context = {};

            loader.require({
                factoryFilter: function (args) {
                    args.callback(function () {
                        return args.factory.apply(context, arguments);
                    });
                }
            }, function () {
                expect(this).to.equal(context);
                done();
            });
        });

        describe("deferred module loading - if module.defer() is called", function () {
            var callback,
                spy;

            beforeEach(function () {
                spy = sinon.spy();

                loader.define("Future", [
                    "module"
                ], function (
                    module
                ) {
                    callback = module.defer();
                });

                // This module depends on the one above - so we can check when the one above is loaded
                loader.require([
                    "Future"
                ], spy);
            });

            it("should not treat module as loaded if callback has not yet been called", function () {
                expect(spy.called).to.not.be.ok;
            });

            it("should treat module as loaded after callback has been called", function () {
                callback();
                expect(spy.called).to.be.ok;
            });

            it("should use the value passed as first argument to the callback as the module's value", function () {
                var value = {};

                callback(value);
                expect(spy.calledWith(value)).to.be.ok;
            });

            it("should correctly handle callback being called immediately", function () {
                var spy = sinon.spy();

                loader.define("ImmediateFuture", [
                    "module"
                ], function (
                    module
                ) {
                    module.defer()();
                });

                loader.require([
                    "ImmediateFuture"
                ], spy);

                expect(spy).to.have.been.calledOnce;
            });
        });

        describe("ID mapping", function () {
            it("should support mapping of base term", function (done) {
                var earth = {};

                loader.define("earth/at/large", earth);
                loader.require({
                    paths: {
                        "world": "earth"
                    }
                }, [
                    "world/at/large"
                ], function (
                    planet
                ) {
                    expect(planet).to.equal(earth);
                    done();
                });
            });

            it("should support mapping of two terms", function (done) {
                var earth = {};

                loader.define("earth/when/large", earth);
                loader.require({
                    paths: {
                        "world/at": "earth/when"
                    }
                }, [
                    "world/at/large"
                ], function (
                    planet
                ) {
                    expect(planet).to.equal(earth);
                    done();
                });
            });

            it("should use most specific mapping available", function (done) {
                var earth = {};

                loader.define("planet/when/large", earth);
                loader.require({
                    paths: {
                        "world": "earth",
                        "world/at": "planet/when"
                    }
                }, [
                    "world/at/large"
                ], function (
                    planet
                ) {
                    expect(planet).to.equal(earth);
                    done();
                });
            });

            it("should use mapping even if it includes a trailing slash", function (done) {
                var earth = {};

                loader.define("earth/at/large", earth);
                loader.require({
                    paths: {
                        "world/": "earth"
                    }
                }, [
                    "world/at/large"
                ], function (
                    planet
                ) {
                    expect(planet).to.equal(earth);
                    done();
                });
            });

            it("should not apply mapping to IDs with same-directory term at start", function (done) {
                var value = {};

                loader.define("module/here", value);

                loader.require({
                    paths: {
                        "module": "not/here"
                    }
                }, [
                    "./module/here"
                ], function (
                    importedValue
                ) {
                    expect(importedValue).to.equal(value);
                    done();
                });
            });

            it("should support mapping a specific module ID", function (done) {
                var value = {};

                loader.define("the/library/is/here-UltiLib", value);

                loader.require({
                    paths: {
                        "UltiLib": "the/library/is/here-UltiLib"
                    }
                }, [
                    "UltiLib"
                ], function (
                    importedUltiLib
                ) {
                    expect(importedUltiLib).to.equal(value);
                    done();
                });
            });
        });

        describe("ID filtering", function () {
            it("should look up dependency after filtering", function (done) {
                var DOM = {};

                loader.define("/assets/js/Library/UI/DOM", DOM);

                loader.require({
                    idFilter: function (id, callback) {
                        callback("/assets/js/" + id.replace(/\./g, "/"));
                    }
                }, [
                    "Library.UI.DOM"
                ], function (
                    ImportedDOM
                ) {
                    expect(ImportedDOM).to.equal(DOM);
                    done();
                });
            });

            it("should pass multiple dependencies in order even if id filter callbacks are called out of order", function (done) {
                var Modal = {},
                    TextBox = {},
                    idFilters = [];

                loader.define("/assets/js/Library/UI/DOM/Modal", Modal);
                loader.define("/assets/js/Library/UI/DOM/TextBox", TextBox);

                loader.require({
                    idFilter: function (id, callback) {
                        idFilters.push({
                            callback: callback,
                            id: "/assets/js/" + id.replace(/\./g, "/")
                        });
                    }
                }, [
                    "Library.UI.DOM.Modal",
                    "Library.UI.DOM.TextBox"
                ], function (
                    ImportedDOM,
                    ImportedTextBox
                ) {
                    expect(ImportedTextBox).to.equal(TextBox);
                    done();
                });

                idFilters[1].callback(idFilters[1].id);
                idFilters[0].callback(idFilters[0].id);
            });
        });
    });
});
