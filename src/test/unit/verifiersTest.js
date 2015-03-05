"use strict";

describe('mockito4js', function () {
    describe('verifiers', function () {

        describe('verify', function () {
            it('should throw an error when numberOfInvocationsNotCorrect returns true', function () {
                var verifier = mockito4js.once();
                expect(
                    function () {
                        verifier.verify('Some function', 2)
                    }
                ).toThrow(new Error('Number of invocations of "Some function" does not match the expected amount of ' + verifier.invocationCount + '.' +
                    ' Actual number of invocations is 2'));
            });

            it('should not throw an error when numberOfInvocationsNotCorrect returns false', function () {
                var verifier = mockito4js.once();
                verifier.verify('Some function', 1);
            });
        });

        describe('never', function () {
            it('should return a new verifier object with an expected invocation count of 0', function () {
                var actual = mockito4js.never().invocationCount;

                expect(actual).toBe(0);
            });

            describe('numberOfInvocationsNotCorrect', function () {
                var never;

                beforeEach(function () {
                    never = mockito4js.never();
                });

                it('should return true when given invocation count is more than 0', function () {
                    var actual = never.numberOfInvocationsNotCorrect(1);

                    expect(actual).toBe(true);
                });

                it('should return false when given invocation count is 0', function () {
                    var actual = never.numberOfInvocationsNotCorrect(0);

                    expect(actual).toBe(false);
                });
            });
        });

        describe('once', function () {
            it('should return a new verifier object with an expected invocation count of 1', function () {
                var actual = mockito4js.once().invocationCount;

                expect(actual).toBe(1);
            });

            describe('numberOfInvocationsNotCorrect', function () {
                var once;

                beforeEach(function () {
                    once = mockito4js.once();
                });

                it('should return true when given invocation count is less than 1', function () {
                    var actual = once.numberOfInvocationsNotCorrect(0);

                    expect(actual).toBe(true);
                });

                it('should return true when given invocation count is more than 1', function () {
                    var actual = once.numberOfInvocationsNotCorrect(2);

                    expect(actual).toBe(true);
                });

                it('should return false when given invocation count is 1', function () {
                    var actual = once.numberOfInvocationsNotCorrect(1);

                    expect(actual).toBe(false);
                });
            });
        });

        describe('times', function () {
            it('should return a new verifier object with the given expected invocation count', function () {
                var actual = mockito4js.times(2).invocationCount;

                expect(actual).toBe(2);
            });

            describe('numberOfInvocationsNotCorrect', function () {
                var times;

                beforeEach(function () {
                    times = mockito4js.times(2);
                });

                it('should return true when given invocation count is less than expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(1);

                    expect(actual).toBe(true);
                });

                it('should return true when given invocation count is more than expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(3);

                    expect(actual).toBe(true);
                });

                it('should return false when given invocation count is equal to expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(2);

                    expect(actual).toBe(false);
                });
            });
        });

        describe('atLeast', function () {
            it('should return a new verifier object with the given expected invocation count', function () {
                var actual = mockito4js.atLeast(1).invocationCount;

                expect(actual).toBe(1);
            });

            describe('numberOfInvocationsNotCorrect', function () {
                var times;

                beforeEach(function () {
                    times = mockito4js.atLeast(1);
                });

                it('should return true when given invocation count is less than expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(0);

                    expect(actual).toBe(true);
                });

                it('should return false when given invocation count is equal to expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(1);

                    expect(actual).toBe(false);
                });

                it('should return false when given invocation count is more than expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(2);

                    expect(actual).toBe(false);
                });
            });
        });

        describe('atMost', function () {
            it('should return a new verifier object with the given expected invocation count', function () {
                var actual = mockito4js.atMost(1).invocationCount;

                expect(actual).toBe(1);
            });

            describe('numberOfInvocationsNotCorrect', function () {
                var times;

                beforeEach(function () {
                    times = mockito4js.atMost(1);
                });

                it('should return false when given invocation count is less than expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(0);

                    expect(actual).toBe(false);
                });

                it('should return false when given invocation count is equal to expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(1);

                    expect(actual).toBe(false);
                });

                it('should return true when given invocation count is more than expected invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(2);

                    expect(actual).toBe(true);
                });
            });
        });
    });
});