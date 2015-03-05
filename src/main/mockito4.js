/**
 * @source: https://github.com/mikedeswert/mockito4js
 */

"use strict";

var mockito4js = (function mockito4js() {
    var mockito4js = {};
    var functionFactory = new FunctionFactory();
    var arrayUtil = new ArrayUtil();
    var spyFactory = new SpyFactory();

    mockito4js.globalize = function () {
        for (var property in mockito4js) {
            if (mockito4js.hasOwnProperty(property)) {
                window[property] = mockito4js[property];
            }
        }
    };

    mockito4js.doNothing = function () {
        return new MockBuilder(function () {
        });
    };

    mockito4js.doReturn = function (returnValue) {
        return new DoReturnMockBuilder(function () {
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
        return spyFactory.createSpy(object);
    };

    mockito4js.any = function (type) {
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
    };

    Verification.prototype.verify = function (functionName, actualInvocationCount) {
        if (this.numberOfInvocationsNotCorrect(actualInvocationCount)) {
            throw new Error('Number of invocations of "' + functionName + '" does not match the expected amount of ' + this.invocationCount + '.' +
            ' Actual number of invocations is ' + actualInvocationCount);
        }
    };

    var Exactly = function (invocationCount) {
        Verification.call(this, invocationCount);

        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount != this.invocationCount
        };
    };
    Exactly.prototype = Verification.prototype;

    var AtLeast = function (invocationCount) {
        Verification.call(this, invocationCount);

        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount < this.invocationCount;
        };
    };
    AtLeast.prototype = Verification.prototype;

    var AtMost = function (invocationCount) {
        Verification.call(this, invocationCount);

        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount > this.invocationCount;
        };
    };
    AtMost.prototype = Verification.prototype;

    function Verifier(spy, verification) {
        var verifier = this;

        if(typeof spy == 'function') {
            verifier.wasCalledWith = function() {
                return functionFactory.createVerifyFunction({
                    object: spy,
                    property: 'self',
                    functionToReplace: null,
                    additionalArguments: {
                        verifyArguments: true,
                        verification: verification
                    }
                }).apply(this, arguments);
            };
            verifier.wasCalled = function() {
                return functionFactory.createVerifyFunction({
                    object: spy,
                    property: 'self',
                    functionToReplace: null,
                    additionalArguments: {
                        verifyArguments: false,
                        verification: verification
                    }
                }).apply(this, arguments);
            };
        } else {
            replaceFunctions(this, spy, functionFactory.createVerifyFunction, {verifyArguments: true, verification: verification});
        }


    }

    function Any(type) {
        this.type = type;

        this.matches = function (argument) {
            try {
                return typeof argument == type || argument instanceof type;
            } catch (error) {
                return false;
            }
        };
    }

    var MockBuilder = function (execution) {
        this.when = function (object) {
            if (!object.isSpy) {
                throw new Error('Argument passed to when is not a spy. Use mockito4js.spy() to create one.');
            }

            if (typeof object == 'function') {
                return new MockFunction(object, execution);
            }

            return new MockObject(object, execution);
        }
    };

    var DoReturnMockBuilder = function (execution) {
        MockBuilder.call(this, execution);

        this.when = function (object) {
            if (!object.isSpy) {
                throw new Error('Argument passed to when is not a spy. Use mockito4js.spy() to create one.');
            }

            if (typeof object == 'function') {
                return new MockFunction(object, execution);
            }

            return new DoReturnMockObject(object, execution);
        }
    };

    var MockFunction = function (fn, execution) {
        this.isCalled = function () {
            fn.execution = functionFactory.createMockFunction(
                [],
                fn.execution,
                functionFactory.createInvocationCountingFunction({
                    object: fn,
                    property: 'self',
                    functionToReplace: execution
                })
            );
        };
        this.isCalledWith = function () {
            fn.execution = functionFactory.createMockFunction(
                arguments,
                fn.execution,
                functionFactory.createInvocationCountingFunction({
                    object: fn,
                    property: 'self',
                    functionToReplace: execution
                })
            );
        };
    };

    var MockObject = function (object, execution) {
        replaceFunctions(this, object, function (functionArguments) {
            functionArguments.functionToReplace = execution;
            return function () {
                functionArguments.object[functionArguments.property] = functionFactory.createMockFunction(arguments,
                    functionArguments.object[functionArguments.property],
                    functionFactory.createInvocationCountingFunction(functionArguments));
            };
        });
    };

    var DoReturnMockObject = function (object, execution) {
        MockObject.call(this, object, execution);

        this.readsProperty = function (propertyName) {
            if (typeof object[propertyName] == 'function') {
                throw new Error('Argument passed to readsProperty can not be the name of a function. Use when(object).nameOfFunction() instead.')
            }

            object[propertyName] = execution();
        };

    };

    DoReturnMockObject.prototype = MockObject.prototype;
    DoReturnMockObject.prototype.constructor = DoReturnMockObject;

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

    function SpyFactory() {
        this.createSpy = function(object) {
            if(typeof object == 'function') {
                return createFunctionSpy(object);
            }

            return createObjectSpy(object);
        };

        function createFunctionSpy(fn) {
            var spyFunction;
            spyFunction = function () {
                if (spyFunction.invocations['self'] == undefined) {
                    spyFunction.invocations['self'] = [];
                }
                spyFunction.invocations['self'].push({actualArguments: arguments});
                return spyFunction.execution.apply(this, arguments);
            };
            spyFunction.invocations = {};
            spyFunction.isSpy = true;
            spyFunction.execution = fn;

            return spyFunction;
        }

        function createObjectSpy(object) {
            object.invocations = {};
            object.isSpy = true;
            replaceFunctions(object, object, functionFactory.createInvocationCountingFunction);

            return object;
        }
    }

    function FunctionFactory() {
        this.createMockFunction = function(argumentsToVerify, realFunction, mockFunction) {
            return function () {
                if (arrayUtil.containsAllArguments(arguments, argumentsToVerify)) {
                    return mockFunction.apply(this, arguments);
                }

                return realFunction.apply(this, arguments);
            }
        };

        this.createInvocationCountingFunction = function(functionArguments) {
            functionArguments.object.invocations[functionArguments.property] = [];

            return function () {
                functionArguments.object.invocations[functionArguments.property].push({actualArguments: arguments});

                return functionArguments.functionToReplace.apply(this, arguments);
            }
        };

        this.createVerifyFunction = function(functionArguments) {
            function getInvocationsWithArguments(object, functionName, expectedArguments) {
                var invocations = [];

                object.invocations[functionName].forEach(function (invocation) {
                    if (expectedArguments.length == 0 || arrayUtil.containsAllArguments(invocation.actualArguments, expectedArguments)) {
                        invocations.push(invocation);
                    }
                });

                return invocations;
            }

            return function () {
                var argumentsToVerify = (functionArguments.additionalArguments.verifyArguments) ? arguments : [];
                var invocationCount = getInvocationsWithArguments(functionArguments.object, functionArguments.property, argumentsToVerify).length;
                functionArguments.additionalArguments.verification.verify(functionArguments.property, invocationCount);
            }
        };
    }

    function ArrayUtil() {
        this.containsAllArguments = function(actualArguments, expectedArguments) {
            if (actualArguments.length != expectedArguments.length) {
                return false;
            }

            for (var i = 0; i < expectedArguments.length; i++) {
                var expectedArgument = expectedArguments[i];

                if (!this.arrayContains(actualArguments, expectedArgument)) {
                    return false;
                }
            }

            return true;
        };

        this.arrayContains = function(array, value) {
            for (var i = 0; i < array.length; i++) {
                if (value instanceof Any && value.matches(array[i])) {
                    return true
                }

                if (array[i] == value) {
                    return true;
                }
            }
            return false;
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

    return mockito4js;
}());
