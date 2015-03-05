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