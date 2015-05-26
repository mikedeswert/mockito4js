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