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