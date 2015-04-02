"use strict";

describe('mockito4js', function () {
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

            it('should throw an error if arguments of function call are of given type when any is used', function() {
                var verifier = mockito4js.once();
                object.functionOne(0);

                expect(function() {
                    mockito4js.verify(object, verifier).functionOne(mockito4js.any('string'))
                }).toThrow(new Error('Number of invocations of "functionOne" does not match the expected amount of ' + verifier.invocationCount + '.' +
                ' Actual number of invocations is 0'));
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

            it('should throw an error if arguments of function spy call are of given type when any is used', function() {
                var verifier = mockito4js.once();
                fn(0);

                expect(function() {
                    mockito4js.verify(fn, verifier).wasCalledWith(mockito4js.any('string'))
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

            it('should throw an error if arguments of function on function spy call are of given type when any is used', function() {
                var verifier = mockito4js.once();
                fn.functionOne(0);

                expect(function() {
                    mockito4js.verify(fn, verifier).functionOne(mockito4js.any('string'))
                }).toThrow(new Error('Number of invocations of "functionOne" does not match the expected amount of ' + verifier.invocationCount + '.' +
                ' Actual number of invocations is 0'));
            });
        });
    });

    describe('any', function() {
        it('should return an Any object with a type and match function', function() {
            var actual = mockito4js.any(Object);

            expect(actual.type).toBe(Object);
            expect(typeof actual.matches).toBe('function');
        });

        describe('matches', function() {
            it('should return true if given argument is Object and type of any is Object', function() {
                var any = mockito4js.any(Object);
                var argument = new Object();

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is Object and type of any is Object literal', function() {
                var any = mockito4js.any(Object);
                var argument = {};

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is Array and type of any is Array', function() {
                var any = mockito4js.any(Array);
                var argument = new Array();

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is Array and type of any is Array literal', function() {
                var any = mockito4js.any(Array);
                var argument = [];

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is Function and type of any is Function', function() {
                var any = mockito4js.any(Function);
                var argument = function() {};

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is String and type of any is String', function() {
                var any = mockito4js.any(String);
                var argument = new String('argument');

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is String and type of any is String literal', function() {
                var any = mockito4js.any('string');
                var argument = 'argument';

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is Boolean and type of any is Boolean', function() {
                var any = mockito4js.any(Boolean);
                var argument = new Boolean(true);

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is Boolean and type of any is Boolean literal', function() {
                var any = mockito4js.any('boolean');
                var argument = true;

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is Number and type of any is Number', function() {
                var any = mockito4js.any(Number);
                var argument = new Number(0);

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is Number and type of any is Number literal', function() {
                var any = mockito4js.any('number');
                var argument = 0;

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return true if given argument is of custom type and type of any is same custom type', function() {
                function CustomType() {}

                var any = mockito4js.any(CustomType);
                var argument = new CustomType();

                var actual = any.matches(argument);

                expect(actual).toBe(true);
            });

            it('should return false if given argument is not an instance of given type', function() {
                var any = mockito4js.any(Function);
                var argument = {};

                var actual = any.matches(argument);

                expect(actual).toBe(false);
            });
        });
    });

    describe('globalize', function() {
        it('should set commonly used mockito4js functions as global functions on window', function() {
            mockito4js.globalize();

            for(var property in mockito4js) {
                if (mockito4js.hasOwnProperty(property)) {
                    expect(window[property]).toBe(mockito4js[property]);
                }
            }
        })
    })
});