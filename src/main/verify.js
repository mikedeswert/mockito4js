getMockito4jsBuilder().Verify = function (mockito4js) {
    mockito4js.verify = function (spy, verification) {
        if(verification == undefined || verification == null) {
            throw new Error('No verifier passed to verify method. Use one of the following verifiers:\n' +
                            'mockito4js.never()\n' +
                            'mockito4js.once()\n' +
                            'mockito4js.times()\n' +
                            'mockito4js.atLeast()\n' +
                            'mockito4js.atMost()\n')
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