"use strict";

describe('Verify module', function() {
    var object,
        fn;

    beforeEach(function () {
        object = {
            functionOne: function() {},
            functionTwo: function() {}
        };
        object = mockito4js.spy(object);

        fn = function() {};
        fn.functionOne = function() {};
        fn = mockito4js.spy(fn);

    });

    describe('verify', function() {
        it('should throw an error given verifier is undefined', function() {
            expect(function() {
                mockito4js.verify(object).functionOne('argumentOne');
            }).toThrow(new Error('No verifier passed to verify method. Use one of the following verifiers:\n' +
            'mockito4js.never()\n' +
            'mockito4js.once()\n' +
            'mockito4js.times()\n' +
            'mockito4js.atLeast()\n' +
            'mockito4js.atMost()\n'));
        });

        it('should throw throw an error given verifier is null', function() {
            expect(function() {
                mockito4js.verify(object, null).functionOne('argumentOne');
            }).toThrow(new Error('No verifier passed to verify method. Use one of the following verifiers:\n' +
            'mockito4js.never()\n' +
            'mockito4js.once()\n' +
            'mockito4js.times()\n' +
            'mockito4js.atLeast()\n' +
            'mockito4js.atMost()\n'));
        });

        describe('on object spy', function() {
            it("should wrap the given spy in a Verify object exposing all the objects public functions", function() {
                var actual = mockito4js.verify(object, mockito4js.once());

                expect(actual.functionOne instanceof Function).toBe(true);
                expect(actual.functionTwo instanceof Function).toBe(true);
            });

            it('should call the verifier verify method with the correct function name and actual invocation count', function() {
                var verifierSpy = mockito4js.spy(mockito4js.once());
                mockito4js.doNothing().when(verifierSpy).verify();
                object.functionOne('argumentOne');

                mockito4js.verify(object, verifierSpy).functionOne('argumentOne');

                mockito4js.verify(verifierSpy, mockito4js.once()).verify('functionOne', 1);
            });

            it('should not throw an error if arguments of function call are of given type when any is used', function() {
                var verifierSpy = mockito4js.spy(mockito4js.once());
                object.functionOne('argumentOne');

                mockito4js.verify(object, verifierSpy).functionOne(mockito4js.any('string'));
            });

            it('should throw an error if arguments of function call are not of given type when any is used', function() {
                var verifier = mockito4js.once();
                object.functionOne(0);

                expect(function() {
                    mockito4js.verify(object, verifier).functionOne(mockito4js.any('string'))
                }).toThrow(new Error('Number of invocations of "functionOne" does not match the expected amount of ' + verifier.invocationCount + '.' +
                ' Actual number of invocations is 0'));
            });

            it('should not throw an error if arguments of function call are equal when eq is used', function() {
                var verifierSpy = mockito4js.spy(mockito4js.once());
                object.functionOne({key: 'value'});

                mockito4js.verify(object, verifierSpy).functionOne(mockito4js.eq({key: 'value'}));
            });

            it('should throw an error if arguments of function call are not equal when eq is used', function() {
                var verifier = mockito4js.once();
                object.functionOne({key: 'value'});

                expect(function() {
                    mockito4js.verify(object, verifier).functionOne(mockito4js.eq({key: 'other value'}))
                }).toThrow(new Error('Number of invocations of "functionOne" does not match the expected amount of ' + verifier.invocationCount + '.' +
                ' Actual number of invocations is 0'));
            });

            it('should capture the given value when argument captor is used', function() {
                var argumentCaptor = mockito4js.createArgumentCaptor();
                var verifierSpy = mockito4js.spy(mockito4js.once());
                object.functionOne({key: 'value'});

                mockito4js.verify(object, verifierSpy).functionOne(argumentCaptor);
                expect(argumentCaptor.getValue()).toEqual({key: 'value'});
            });
        });

        describe('on function spy', function() {
            it("should wrap the given spy in a Verify object exposing a wasCalled and wasCalledWith method", function() {
                var actual = mockito4js.verify(fn, mockito4js.once());

                expect(actual.wasCalled instanceof Function).toBe(true);
                expect(actual.wasCalledWith instanceof Function).toBe(true);
            });

            it('should call the verifier verify method with the correct function name and actual invocation count given function spy', function() {
                var verifierSpy = mockito4js.spy(mockito4js.once());
                mockito4js.doNothing().when(verifierSpy).verify();
                fn('argumentOne');

                mockito4js.verify(fn, verifierSpy).wasCalledWith('argumentOne');

                mockito4js.verify(verifierSpy, mockito4js.once()).verify('self', 1);
            });

            it('should not throw an error if arguments of function spy call are of given type when any is used', function() {
                fn('argumentOne');

                mockito4js.verify(fn, mockito4js.once()).wasCalledWith(mockito4js.any('string'));
            });

            it('should throw an error if arguments of function spy call are not of given type when any is used', function() {
                var verifier = mockito4js.once();
                fn(0);

                expect(function() {
                    mockito4js.verify(fn, verifier).wasCalledWith(mockito4js.any('string'))
                }).toThrow(new Error('Number of invocations of "self" does not match the expected amount of ' + verifier.invocationCount + '.' +
                ' Actual number of invocations is 0'));
            });

            it('should not throw an error if arguments of function spy call are equal when eq is used', function() {
                fn({key: 'value'});

                mockito4js.verify(fn, mockito4js.once()).wasCalledWith(mockito4js.eq({key: 'value'}));
            });

            it('should throw an error if arguments of function spy call are not equal when eq is used', function() {
                var verifier = mockito4js.once();
                fn({key: 'value'});

                expect(function() {
                    mockito4js.verify(fn, verifier).wasCalledWith(mockito4js.eq({key: 'other value'}))
                }).toThrow(new Error('Number of invocations of "self" does not match the expected amount of ' + verifier.invocationCount + '.' +
                ' Actual number of invocations is 0'));
            });

            it('should call the verifier verify method with the correct function name and actual invocation count given function on function spy', function() {
                var verifierSpy = mockito4js.spy(mockito4js.once());
                mockito4js.doNothing().when(verifierSpy).verify();
                fn.functionOne('argumentOne');

                mockito4js.verify(fn, verifierSpy).functionOne('argumentOne');

                mockito4js.verify(verifierSpy, mockito4js.once()).verify('functionOne', 1);
            });

            it('should not throw an error if arguments of function on function spy call are of given type when any is used', function() {
                fn.functionOne('argumentOne');

                mockito4js.verify(fn, mockito4js.once()).functionOne(mockito4js.any('string'));
            });

            it('should throw an error if arguments of function on function spy call are not of given type when any is used', function() {
                var verifier = mockito4js.once();
                fn.functionOne(0);

                expect(function() {
                    mockito4js.verify(fn, verifier).functionOne(mockito4js.any('string'))
                }).toThrow(new Error('Number of invocations of "functionOne" does not match the expected amount of ' + verifier.invocationCount + '.' +
                ' Actual number of invocations is 0'));
            });

            it('should not throw an error if arguments of function on function spy call are equal when eq is used', function() {
                fn.functionOne({key: 'value'});

                mockito4js.verify(fn, mockito4js.once()).functionOne(mockito4js.eq({key: 'value'}));
            });

            it('should throw an error if arguments of function on function spy call are not equal when eq is used', function() {
                var verifier = mockito4js.once();
                fn.functionOne({key: 'value'});

                expect(function() {
                    mockito4js.verify(fn, verifier).functionOne(mockito4js.eq({key: 'other value'}))
                }).toThrow(new Error('Number of invocations of "functionOne" does not match the expected amount of ' + verifier.invocationCount + '.' +
                ' Actual number of invocations is 0'));
            });

            it('should capture the value of the given argument when argumentCaptor is used', function() {
                var argumentCaptor = mockito4js.createArgumentCaptor();
                fn.functionOne({key: 'value'});

                mockito4js.verify(fn, mockito4js.once()).functionOne(argumentCaptor);
                expect(argumentCaptor.getValue()).toEqual({key: 'value'});
            });
        });
    });

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