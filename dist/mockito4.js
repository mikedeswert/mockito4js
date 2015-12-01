var getMockito4jsBuilder = function() {
    if(window.mockito4jsBuilder == undefined || window.mockito4jsBuilder == null) {
        window.mockito4jsBuilder = {
            build: function(mockito4jsBuilder) {
                var mockito4js = {};

                mockito4jsBuilder.Util(mockito4js);
                mockito4jsBuilder.Spy(mockito4js);
                mockito4jsBuilder.Verify(mockito4js);
                mockito4jsBuilder.Any(mockito4js);
                mockito4jsBuilder.Eq(mockito4js);
                mockito4jsBuilder.Capture(mockito4js);
                mockito4jsBuilder.Do(mockito4js);
                mockito4jsBuilder.Globalize(mockito4js);

                return mockito4js;
            }
        };
    }

    return window.mockito4jsBuilder;
};
getMockito4jsBuilder().Any = function(mockito4js) {
    mockito4js.any = function (type) {
        return new Any(type);
    };

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
};
getMockito4jsBuilder().Eq = function (mockito4js) {
    mockito4js.eq = function (value) {
        return new Eq(value);
    };

    function Eq(value) {
        this.value = value;

        this.matches = function (argument) {
            return deepCompare(this.value, argument);
        };
    }

    function deepCompare(x, y) {
        var leftChain = [],
            rightChain = [];

        return compareObjects(x, y);

        function compareObjects(x, y) {
            if (areBothNaN(x, y)) return true;

            if (x === y) {
                return true;
            }

            if ((typeof x === 'function' && typeof y === 'function') ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)) {
                return x.toString() === y.toString();
            }

            if (!arePrototypesEqual(x, y)) return false;

            if(isCircularReference(x, y)) return true;

            if (!isSubset(x, y)) return false;

            return arePropertiesEqual(x, y);
        }

        function areBothNaN(x, y) {
            return isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number';
        }

        function isCircularReference(x, y) {
            return leftChain.indexOf(x) > -1 && rightChain.indexOf(y) > -1;
        }

        function isSubset(x, y) {
            for (var p in y) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }
            }

            return true;
        }

        function arePrototypesEqual(x, y) {
            if (!(x instanceof Object && y instanceof Object)) {
                return false;
            }

            if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                return false;
            }

            if (x.constructor !== y.constructor) {
                return false;
            }

            return x.prototype === y.prototype;
        }

        function arePropertiesEqual(x, y) {
            for (var p in x) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }

                switch (typeof (x[p])) {
                    case 'object':
                    case 'function':

                        leftChain.push(x);
                        rightChain.push(y);

                        if (!compareObjects(x[p], y[p])) {
                            return false;
                        }

                        leftChain.pop();
                        rightChain.pop();
                        break;

                    default:
                        if (x[p] !== y[p]) {
                            return false;
                        }
                        break;
                }
            }

            return true;
        }
    }
};
getMockito4jsBuilder().Capture = function (mockito4js) {
    mockito4js.createArgumentCaptor = function() {
        return new ArgumentCaptor();
    };

    function ArgumentCaptor() {
        this.values = [];

        this.matches = function(argument) {
            this.values.push(argument);
            return true;
        };

        this.getValue = function() {
            if(this.values.length == 0) {
                throw new Error('No arguments captured!');
            }

            return mockito4js.util.array.getLastElement(this.values);
        };
    }
};
getMockito4jsBuilder().Do = function(mockito4js) {
    mockito4js.doNothing = function () {
        return new MockBuilder(function () {
        });
    };

    mockito4js.doReturn = function (returnValue) {
        var returnValues = mockito4js.util.array.convertArgumentsToArray(arguments);
        return new MockBuilder(function () {
            if(returnValues.length < 1) {
                return undefined;
            }

            if(returnValues.length == 1) {
                return returnValues[0];
            }

            return returnValues.shift();
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

    var MockBuilder = function (execution) {
        this.execution = execution;
        this.mockObjectImplementation = MockObject;
    };
    MockBuilder.prototype.when = function(object) {
        if (!object.isSpy) {
            throw new Error('Argument passed to when is not a spy. Use mockito4js.spy() to create one.');
        }

        if (object  instanceof Function) {
            return new MockFunction(object, this.execution);
        }

        return new this.mockObjectImplementation(object, this.execution);
    };

    var MockObject = function (object, execution) {
        mockito4js.util.replaceFunctions(this, object, function (functionArguments) {
            functionArguments.functionToReplace = execution;
            return function () {
                functionArguments.source[functionArguments.property] = mockito4js.util.functionFactory.createMockFunction(arguments,
                    functionArguments.source[functionArguments.property],
                    mockito4js.util.functionFactory.createInvocationCountingFunction(functionArguments));
            };
        });
    };

    var MockFunction = function (fn, execution) {
        this.isCalled = function () {
            fn.execution = createMockFunction([]);
        };
        this.isCalledWith = function () {
            fn.execution = createMockFunction(arguments);
        };

        function createMockFunction(argumentsToVerify) {
            return mockito4js.util.functionFactory.createMockFunction(
                argumentsToVerify,
                fn.execution,
                execution
            );
        }
    };
    MockFunction = mockito4js.util.extend(MockFunction).from(MockObject);


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
};
getMockito4jsBuilder().Globalize = function(mockito4js) {
    mockito4js.globalize = function () {
        for (var property in mockito4js) {
            if (mockito4js.hasOwnProperty(property)) {
                window[property] = mockito4js[property];
            }
        }
    };
};
getMockito4jsBuilder().Spy = function(mockito4js) {
    var spyFactory = new SpyFactory();

    mockito4js.spy = function (object) {
        return spyFactory.createSpy(object);
    };

    mockito4js.reset = function(spy) {
        if(spy.isSpy) {
            for(var property in spy.invocations) {
                if(spy.invocations.hasOwnProperty(property)) {
                    spy.invocations[property] = [];
                }
            }
            return;
        }

        throw new Error('Object or function passed to reset is not a spy. Use mockito4js.spy() to create one.');
    };

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
            mockito4js.util.replaceFunctions(spyFunction, fn, mockito4js.util.functionFactory.createInvocationCountingFunction);
            spyFunction.isSpy = true;
            spyFunction.execution = fn;

            return spyFunction;
        }

        function createObjectSpy(object) {
            if(object.isSpy) {
                mockito4js.reset(object);
                return object;
            }

            object.invocations = {};
            mockito4js.util.replaceFunctions(object, object, mockito4js.util.functionFactory.createInvocationCountingFunction);
            object.isSpy = true;

            return object;
        }
    }
};
getMockito4jsBuilder().Util = function(mockito4js) {
    mockito4js.util = {};
    mockito4js.util.functionFactory = new FunctionFactory();
    mockito4js.util.array = new ArrayUtil();

    mockito4js.util.replaceFunctions = function(target, source, replacementFunction, additionalArguments) {
        for (var property in source) {
            //noinspection JSUnfilteredForInLoop
            if (typeof source[property] == 'function') {
                //noinspection JSUnfilteredForInLoop
                target[property] = replacementFunction({
                    target: target,
                    source: source,
                    property: property,
                    functionToReplace: source[property],
                    additionalArguments: additionalArguments
                });
            }
        }
    };

    mockito4js.util.extend = function(child) {
        return {
            from: function(parent) {
                var inheritedChild = function() {
                    parent.apply(this, arguments);
                    child.apply(this, arguments);
                };
                inheritedChild.prototype = parent.prototype;

                return inheritedChild;
            }
        }
    };

    function FunctionFactory() {
        this.createMockFunction = function(argumentsToVerify, realFunction, mockFunction) {
            return function () {
                if (mockito4js.util.array.containsAllArguments(arguments, argumentsToVerify)) {
                    return mockFunction.apply(this, arguments);
                }

                return realFunction.apply(this, arguments);
            }
        };

        this.createInvocationCountingFunction = function(functionArguments) {
            getInvocations(functionArguments)[functionArguments.property] = [];

            return function () {
                getInvocations(functionArguments)[functionArguments.property].push({actualArguments: arguments});

                return functionArguments.functionToReplace.apply(this, arguments);
            }
        };

        this.createVerifyFunction = function(functionArguments) {
            function getInvocationsWithArguments(object, functionName, expectedArguments) {
                var invocations = [];

                if (object.invocations[functionName] != undefined) {
                    object.invocations[functionName].forEach(function (invocation) {
                        if (expectedArguments.length == 0 || mockito4js.util.array.containsAllArguments(invocation.actualArguments, expectedArguments)) {
                            invocations.push(invocation);
                        }
                    });
                }

                return invocations;
            }

            return function () {
                var argumentsToVerify = (functionArguments.additionalArguments.verifyArguments) ? arguments : [];
                var invocationCount = getInvocationsWithArguments(functionArguments.source, functionArguments.property, argumentsToVerify).length;
                functionArguments.additionalArguments.verification.verify(functionArguments.property, invocationCount);
            }
        };

        function getInvocations(functionArguments) {
            if (functionArguments.source instanceof Function && functionArguments.target.invocations != undefined) {
                return functionArguments.target.invocations;
            } else {
                return functionArguments.source.invocations;
            }
        }
    }

    function ArrayUtil() {
        this.containsAllArguments = function(actualArguments, expectedArguments) {
            if (actualArguments.length != expectedArguments.length) {
                return false;
            }

            for (var i = 0; i < expectedArguments.length; i++) {
                var expectedArgument = expectedArguments[i];

                if (!this.valuesMatch(actualArguments[i], expectedArgument)) {
                    return false;
                }
            }

            return true;
        };

        this.arrayContains = function(array, value) {
            for (var i = 0; i < array.length; i++) {
                if (value != undefined && value != null && value.matches != undefined && value.matches(array[i])) {
                    return true
                }

                if (array[i] == value) {
                    return true;
                }
            }
            return false;
        };

        this.convertArgumentsToArray = function(argumentsObject) {
            return Array.prototype.slice.call(argumentsObject);
        };

        this.valuesMatch = function(actualValue, expectedValue) {
            if (expectedValue != undefined && expectedValue != null && expectedValue.matches != undefined && expectedValue.matches(actualValue)) {
                return true
            }

            return actualValue == expectedValue;
        };

        this.getLastElement = function(array) {
            if(isArrayValid(array)) {
                return undefined;
            }

            return array[array.length - 1];
        };

        function isArrayValid(array) {
            return array == undefined || array == null || array.length == 0;
        }
    }
};
getMockito4jsBuilder().Verify = function (mockito4js) {
    mockito4js.verify = function (spy, verification) {
        if(verification == undefined || verification == null) {
            verification = mockito4js.once();
        }

        if (!spy.isSpy) {
            throw new Error('Verify cannot be called on an object that is not a spy. Use mockito4js.spy() to create a spy object.');
        }

        if(typeof spy == 'function') {
            return new FunctionVerifier(spy, verification);
        }

        return new Verifier(spy, verification);
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

    var Exactly = function () {
        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount != this.invocationCount
        };
    };
    Exactly = mockito4js.util.extend(Exactly).from(Verification);

    var AtLeast = function () {
        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount < this.invocationCount;
        };
    };
    AtLeast = mockito4js.util.extend(AtLeast).from(Verification);

    var AtMost = function () {
        this.numberOfInvocationsNotCorrect = function (actualInvocationCount) {
            return actualInvocationCount > this.invocationCount;
        };
    };
    AtMost = mockito4js.util.extend(AtMost).from(Verification);

    var Verifier = function(spy, verification) {
        mockito4js.util.replaceFunctions(this, spy, mockito4js.util.functionFactory.createVerifyFunction, this.createAdditionalArguments(true, verification));
    };
    Verifier.prototype.createAdditionalArguments = function (verifyArguments, verification) {
        return {
            verifyArguments: verifyArguments,
            verification: verification
        }
    };
    Verifier.prototype.createVerifyFunctionArguments = function (spy, verification, verifyArguments) {
        return {
            target: spy,
            source: spy,
            property: 'self',
            functionToReplace: null,
            additionalArguments: Verifier.prototype.createAdditionalArguments(verifyArguments, verification)
        }
    };

    var FunctionVerifier = function (spy, verification) {
        this.wasCalledWith = function () {
            return mockito4js.util.functionFactory.createVerifyFunction(
                this.createVerifyFunctionArguments(spy, verification, true)
            ).apply(this, arguments);
        };
        this.wasCalled = function () {
            return mockito4js.util.functionFactory.createVerifyFunction(
                this.createVerifyFunctionArguments(spy, verification, false)
            ).apply(this, arguments);
        };
    };
    FunctionVerifier = mockito4js.util.extend(FunctionVerifier).from(Verifier);
};
"use strict";

var mockito4js = getMockito4jsBuilder().build(getMockito4jsBuilder());