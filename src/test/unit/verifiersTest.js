"use strict";

describe('mockito4js', function () {
    describe('verifiers', function () {


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

                it('should return true when a spy has more than 0 invocations', function () {
                    var actual = never.numberOfInvocationsNotCorrect(1);

                    expect(actual).toBe(true);
                });

                it('should return false when a spy has no invocations', function () {
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

                it('should return true when a spy has less than 1 invocation', function () {
                    var actual = once.numberOfInvocationsNotCorrect(0);

                    expect(actual).toBe(true);
                });

                it('should return true when a spy has more than 1 invocation', function () {
                    var actual = once.numberOfInvocationsNotCorrect(2);

                    expect(actual).toBe(true);
                });

                it('should return false when a spy has 1 invocation', function () {
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

                it('should return true when a spy has less invocations than given invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(1);

                    expect(actual).toBe(true);
                });

                it('should return true when a spy has more invocations than given invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(3);

                    expect(actual).toBe(true);
                });

                it('should return true when a spy has an invocation count that is equal to the given invocation count', function () {
                    var actual = times.numberOfInvocationsNotCorrect(2);

                    expect(actual).toBe(false);
                });
            });
        });
    });
});