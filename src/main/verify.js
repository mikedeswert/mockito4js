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