"use strict";

describe('mockito4js', function () {
    var object,
        fn,
        fnResult;

    beforeEach(function () {
        object = {
            functionOne: function() {},
            functionTwo: function() {},
            propertyOne: 'propertyValue'
        };
        object = mockito4js.spy(object);

        fn = function() {
            fnResult = 'result';
        };
        fn = mockito4js.spy(fn);

        fnResult = '';
    });

    describe('every do method', function() {
        describe('given object spy', function() {
            it('should call the mock function given arguments passed to function call match given arguments', function() {
                mockito4js.doReturn('return value').when(object).functionOne('some argument');

                var actual = object.functionOne('some argument');

                expect(actual).toBe('return value');
            });

            it('should call the mock function given arguments passed to function call is null and match given arguments', function() {
                mockito4js.doReturn('return value').when(object).functionOne(null);

                var actual = object.functionOne(null);

                expect(actual).toBe('return value');
            });

            it('should call the mock function given arguments passed to function call is undefined and match given arguments', function() {
                mockito4js.doReturn('return value').when(object).functionOne(undefined);

                var actual = object.functionOne(undefined);

                expect(actual).toBe('return value');
            });

            it('should call the mock function given type of arguments passed to function call match given any', function() {
                mockito4js.doReturn('return value').when(object).functionOne(mockito4js.any('string'));

                var actual = object.functionOne('random argument');

                expect(actual).toBe('return value');
            });

            it('should not call the mock function given arguments passed to function call do not match given arguments', function() {
                mockito4js.doReturn('return value').when(object).functionOne('another argument');

                var actual = object.functionOne('some argument');

                expect(actual).toBe(undefined);
            });
        });

        describe('given function spy', function() {
            it('should call the mock function given arguments passed to function call match given arguments', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith('some argument');

                var actual = fn('some argument');

                expect(actual).toBe('return value');
            });

            it('should call the mock function given arguments passed to function call is null and match given arguments', function() {
                mockito4js.doReturn('return value').when(object).functionOne(null);

                var actual = object.functionOne(null);

                expect(actual).toBe('return value');
                expect(fnResult).toBe('');
            });

            it('should call the mock function given arguments passed to function call is undefined and match given arguments', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith(undefined);

                var actual = fn(undefined);

                expect(actual).toBe('return value');
                expect(fnResult).toBe('');
            });

            it('should call the mock function given type of arguments passed to function call match given any', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith(mockito4js.any('string'));

                var actual = fn('random argument');

                expect(actual).toBe('return value');
                expect(fnResult).toBe('');
            });

            it('should not call the mock function given arguments passed to function call do not match given arguments', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith('another argument');

                var actual = fn('some argument');

                expect(actual).toBe(undefined);
                expect(fnResult).toBe('result');
            });

            it('should call the mock function given no arguments and isCalled is used', function() {
                mockito4js.doReturn('return value').when(fn).isCalled();

                var actual = fn();

                expect(actual).toBe('return value');
                expect(fnResult).toBe('');
            });
        });

        it('should throw error given argument passed to when is not a spy', function() {
            expect(
                function() {
                    mockito4js.doNothing().when({})
                }
            ).toThrow(new Error('Argument passed to when is not a spy. Use mockito4js.spy() to create one.'));
            expect(
                function() {
                    mockito4js.doReturn('return value').when({})
                }
            ).toThrow(new Error('Argument passed to when is not a spy. Use mockito4js.spy() to create one.'));
        });
    });

    describe('doReturn', function() {
        describe('given object spy', function() {
            it('should return given value when function is called', function() {
                mockito4js.doReturn('return value').when(object).functionOne();

                var actual = object.functionOne();

                expect(actual).toBe('return value');
            });

            it('should return a mock with a readsProperty method when when() method is called', function() {
                var actual = mockito4js.doReturn('return value').when(object);

                expect(actual.readsProperty).not.toBe(undefined);
                expect(typeof actual.readsProperty).toBe('function');
            });

            it('should return given value when property is accessed', function() {
                mockito4js.doReturn('return value').when(object).readsProperty('propertyOne');

                var actual = object.propertyOne;

                expect(actual).toBe('return value');
            });

            it('should throw an error when property name passed to readsProperty is name of a function', function() {
                var actual = mockito4js.doReturn('return value').when(object);

                expect(function() {
                    actual.readsProperty('functionOne');
                }).toThrow(new Error('Argument passed to readsProperty can not be the name of a function. Use when(object).nameOfFunction() instead.'));
            });
        });

        describe('given function spy', function() {
            it('should return given value when function is called', function() {
                mockito4js.doReturn('return value').when(fn).isCalled();

                var actual = fn();

                expect(actual).toBe('return value');
                expect(fnResult).toBe('');
            });

            it('should return a mock without a readsProperty method when when() method is called', function() {
                var actual = mockito4js.doReturn('return value').when(fn);

                expect(actual.readsProperty).toBe(undefined);
            });
        });
    });

    describe('doNothing', function() {
        beforeEach(function() {
            object.functionOne = function() {
                return 'return value';
            }
        });

        it('should do nothing when function on given function spy is called', function() {
            mockito4js.doNothing().when(fn).isCalled();

            var actual = fn();

            expect(actual).toBe(undefined);
            expect(fnResult).toBe('');
        });

        it('should return given value when function on given object spy is called', function() {
            mockito4js.doNothing().when(object).functionOne();

            var actual = object.functionOne();

            expect(actual).toBe(undefined);
        });
    });

    describe('doThrow', function() {
        it('should throw error when function on given function spy is called', function() {
            mockito4js.doThrow(new Error('Some error')).when(fn).isCalled();

            expect(fn).toThrow(new Error('Some error'));
            expect(fnResult).toBe('');
        });

        it('should throw error when function on given object spy is called', function() {
            mockito4js.doThrow(new Error('Some error')).when(object).functionOne();

            expect(object.functionOne).toThrow(new Error('Some error'));
        });
    });

    describe('doFire', function() {
        var domElement;
        var handlerResult;

        beforeEach(function() {
            handlerResult = '';
            domElement = document.createElement('div');
            domElement.addEventListener('click', function() {
                handlerResult = 'event fired';
            });
        });

        it('should fire an event on given DOM element error when function on given function spy is called', function() {
            mockito4js.doFire('click').on(domElement).when(fn).isCalled();

            fn();

            expect(handlerResult).toBe('event fired');
            expect(fnResult).toBe('');
        });

        it('should fire an event on given DOM element error when function on given object spy is called', function() {
            mockito4js.doFire('click').on(domElement).when(object).functionOne();

            object.functionOne();

            expect(handlerResult).toBe('event fired');
        });
    });
});