/**
 *
 * @source: https://github.com/mikedeswert/mockito4js
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2015  Mike De Swert
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 *
 * The name Mockito is copyrighted by the Mockito contributors and falls under the following license
 * https://github.com/mockito/mockito
 *
 */

"use strict";

var mockito4js = (function mockito4js() {
    var mockito4js = {};

    mockito4js.doNothing = function () {
        return new MockBuilder(function () {
        });
    };

    mockito4js.doReturn = function (returnValue) {
        return new MockBuilder(function () {
            return returnValue;
        });
    };

    mockito4js.doThrow = function (error) {
        if (!error instanceof Error) {
            throw new Error('Argument passed to doThrow is not an Error!');
        }

        return new MockBuilder(function () {
            throw error;
        });
    };

    mockito4js.doFire = function (eventName) {
        var event = new MockEvent(eventName);

        function isNoDomElement(target) {
            return !target.nodeType;
        }

        return {
            on: function (target) {
                if (isNoDomElement(target)) {
                    throw new Error('You cannot call doFire on an object that is not a DOM element!');
                }

                return new MockBuilder(function () {
                    event.fire(target);
                });
            }
        };
    };

    mockito4js.spy = function (object) {
        object.invocations = {};
        replaceFunctions(object, object, createInvocationCountingFunction);
        object.isSpy = true;

        return object;
    };

    mockito4js.any = function(type) {
        return new Any(type);
    };

    mockito4js.verify = function (spy, verification) {
        if (spy.isSpy) {
            return new Verifier(spy, verification)
        }

        throw new Error('Verify cannot be called on an object that is not a spy. Use mockito4js.spy() to create a spy object.');
    };

    mockito4js.times = function (numberOfTimes) {
        return new Exactly(numberOfTimes);
    };

    mockito4js.never = function () {
        return new Exactly(0);
    };

    mockito4js.once = function () {
        return new Exactly(1);
    };

    mockito4js.atLeast = function (numberOfTimes) {
        return new AtLeast(numberOfTimes);
    };

    mockito4js.atMost = function (numberOfTimes) {
        return new AtMost(numberOfTimes);
    };

    var Verification = function (invocationCount) {
        this.invocationCount = invocationCount;

        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount != this.invocationCount
        };
    };

    Verification.prototype.verify = function (functionName, actualInvocationCount) {
        if (this.numberOfInvocationsNotCorrect(actualInvocationCount)) {
            throw new Error('Number of invocations of "' + functionName + '" does not match the expected amount of ' + this.invocationCount + '.' +
            ' Actual number of invocations is ' + actualInvocationCount);
        }
    };

    var Exactly = function (invocationCount) {
        Verification.call(this, invocationCount);
    };

    Exactly.prototype = Verification.prototype;
    Exactly.prototype.constructor = Exactly;

    var AtLeast = function (invocationCount) {
        Verification.call(this, invocationCount);

        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount < this.invocationCount;
        };
    };

    AtLeast.prototype = Verification.prototype;
    AtLeast.prototype.constructor = AtLeast;

    var AtMost = function (invocationCount) {
        Verification.call(this, invocationCount);

        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount > this.invocationCount;
        };
    };

    AtMost.prototype = Verification.prototype;
    AtMost.prototype.constructor = AtMost;

    function Verifier(spy, verification) {
        replaceFunctions(this, spy, verifyFunction, {verification: verification});

        function verifyFunction(functionArguments) {
            return function () {
                var invocationCount = getInvocationsWithArguments(functionArguments.object, functionArguments.property, arguments).length;
                functionArguments.additionalArguments.verification.verify(functionArguments.property, invocationCount);
            }
        }

        function getInvocationsWithArguments(object, functionName, expectedArguments) {
            var invocations = [];

            object.invocations[functionName].forEach(function (invocation) {
                if (expectedArguments.length == 0 || containsAllArguments(invocation.actualArguments, expectedArguments)) {
                    invocations.push(invocation);
                }
            });

            return invocations;
        }
    }

    function Any(type) {
        this.type = type;

        this.matches = function(argument) {
            try {
                return typeof argument == type || argument instanceof type;
            } catch(error) {
                return false;
            }
        };
    }

    function MockBuilder(execution) {
        this.when = function (object) {
            return new Mock(object, execution);
        }
    }

    function Mock(object, execution) {
        if (object.isSpy) {
            replaceFunctions(this, object, function (functionArguments) {
                functionArguments.functionToReplace = execution;
                return function () {
                    functionArguments.object[functionArguments.property] = createMockFunction(arguments,
                                                                                        functionArguments.object[functionArguments.property],
                                                                                        createInvocationCountingFunction(functionArguments));
                };
            });
        } else {
            replaceFunctions(this, object, function (functionArguments) {
                return function () {
                    functionArguments.object[functionArguments.property] = createMockFunction(arguments,
                                                                                        functionArguments.object[functionArguments.property],
                                                                                        execution);
                };
            });
        }

        function createMockFunction(argumentsToVerify, realFunction, mockFunction) {
            return function() {
                if(containsAllArguments(arguments, argumentsToVerify)) {
                    return mockFunction.apply(this, arguments);
                }

                return realFunction.apply(this, arguments);

            }
        }
    }

    function MockEvent(name) {
        var event;

        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(name, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = name;
        }

        event.eventName = name;

        this.fire = function (target) {
            if (document.createEvent) {
                target.dispatchEvent(event);
            } else {
                target.fireEvent("on" + event.eventType, event);
            }
        }
    }

    function replaceFunctions(target, object, replacementFunction, additionalArguments) {
        for (var property in object) {
            //noinspection JSUnfilteredForInLoop
            if (typeof object[property] == 'function') {
                //noinspection JSUnfilteredForInLoop
                target[property] = replacementFunction({
                    object: object,
                    property: property,
                    functionToReplace: object[property],
                    additionalArguments: additionalArguments
                });
            }
        }
    }

    function createInvocationCountingFunction(functionArguments) {
        functionArguments.object.invocations[functionArguments.property] = [];

        return function () {
            functionArguments.object.invocations[functionArguments.property].push({actualArguments: arguments});

            return functionArguments.functionToReplace.apply(this, arguments);
        }
    }

    function containsAllArguments(actualArguments, expectedArguments) {
        if (actualArguments.length != expectedArguments.length) {
            return false;
        }

        for (var i = 0; i < expectedArguments.length; i++) {
            var expectedArgument = expectedArguments[i];

            if (!arrayContains(actualArguments, expectedArgument)) {
                return false;
            }
        }

        return true;
    }

    function arrayContains(array, value) {
        for (var i = 0; i < array.length; i++) {
            if(value instanceof Any && value.matches(array[i])) {
                return true
            }

            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }

    return mockito4js;
}());
