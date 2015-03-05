var getMockito4jsBuilder = function() {
    if(window.mockito4jsBuilder == undefined || window.mockito4jsBuilder == null) {
        window.mockito4jsBuilder = {
            build: function(mockito4jsBuilder) {
                var mockito4js = {};

                mockito4jsBuilder.Util(mockito4js);
                mockito4jsBuilder.Spy(mockito4js);
                mockito4jsBuilder.Verify(mockito4js);
                mockito4jsBuilder.Any(mockito4js);
                mockito4jsBuilder.Do(mockito4js);
                mockito4jsBuilder.Globalize(mockito4js);
//runmdnfqmsjdfmklsdf
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
getMockito4jsBuilder().Do = function(mockito4js) {
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
            fn.execution = mockito4js.util.functionFactory.createMockFunction(
                [],
                fn.execution,
                mockito4js.util.functionFactory.createInvocationCountingFunction({
                    object: fn,
                    property: 'self',
                    functionToReplace: execution
                })
            );
        };
        this.isCalledWith = function () {
            fn.execution = mockito4js.util.functionFactory.createMockFunction(
                arguments,
                fn.execution,
                mockito4js.util.functionFactory.createInvocationCountingFunction({
                    object: fn,
                    property: 'self',
                    functionToReplace: execution
                })
            );
        };
    };

    var MockObject = function (object, execution) {
        mockito4js.util.replaceFunctions(this, object, function (functionArguments) {
            functionArguments.functionToReplace = execution;
            return function () {
                functionArguments.object[functionArguments.property] = mockito4js.util.functionFactory.createMockFunction(arguments,
                    functionArguments.object[functionArguments.property],
                    mockito4js.util.functionFactory.createInvocationCountingFunction(functionArguments));
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
            mockito4js.util.replaceFunctions(object, object,mockito4js.util.functionFactory.createInvocationCountingFunction);

            return object;
        }
    }
};
getMockito4jsBuilder().Util = function(mockito4js) {
    mockito4js.util = {};
    mockito4js.util.functionFactory = new FunctionFactory();
    mockito4js.util.array = new ArrayUtil();

    mockito4js.util.replaceFunctions = function(target, object, replacementFunction, additionalArguments) {
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
                    if (expectedArguments.length == 0 || mockito4js.util.array.containsAllArguments(invocation.actualArguments, expectedArguments)) {
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
                if (value != undefined && value != null && value.matches != undefined && value.matches(array[i])) {
                    return true
                }

                if (array[i] == value) {
                    return true;
                }
            }
            return false;
        }

    }
};
getMockito4jsBuilder().Verify = function(mockito4js) {
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
                return mockito4js.util.functionFactory.createVerifyFunction({
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
                return mockito4js.util.functionFactory.createVerifyFunction({
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
            mockito4js.util.replaceFunctions(this, spy, mockito4js.util.functionFactory.createVerifyFunction, {verifyArguments: true, verification: verification});
        }
    }
};
var mockito4js = getMockito4jsBuilder().build(getMockito4jsBuilder());