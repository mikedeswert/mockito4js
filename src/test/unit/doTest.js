"use strict";

describe('Do module', function () {
    var object,
        fn;

    beforeEach(function () {
        object = {
            functionOne: function() {
                return 'originalResult'
            },
            functionTwo: function() {
                return 'originalResult'
            },
            propertyOne: 'propertyValue'
        };
        object = mockito4js.spy(object);

        fn = function() {
            return 'originalResult'
        };
        fn.functionOne = function() {
            return 'originalResult'
        };
        fn = mockito4js.spy(fn);
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

            it('should call the mock function given type of arguments passed to function call match given eq', function() {
                mockito4js.doReturn('return value').when(object).functionOne(mockito4js.eq({key: 'value'}));

                var actual = object.functionOne({key: 'value'});

                expect(actual).toBe('return value');
            });

            it('should capture the given value when argument captor is used', function() {
                var argumentCaptor = mockito4js.createArgumentCaptor();
                mockito4js.doReturn('return value').when(object).functionOne(argumentCaptor);

                var actual = object.functionOne({key: 'value'});

                expect(actual).toBe('return value');
                expect(argumentCaptor.getValue()).toEqual({key: 'value'});
            });

            it('should not call the mock function given arguments passed to function call do not match given arguments', function() {
                mockito4js.doReturn('return value').when(object).functionOne('another argument');

                var actual = object.functionOne('some argument');

                expect(actual).toBe('originalResult');
            });

            it('should not call the mock function given arguments passed to function call are not in correct order', function() {
                mockito4js.doReturn('return value').when(object).functionOne('argument', 'another argument');

                var actual = object.functionOne('another argument', 'argument');

                expect(actual).toBe('originalResult');
            });

            it('should not call the mock function given arguments passed to function and no given arguments', function() {
                mockito4js.doReturn('return value').when(object).functionOne();

                var actual = object.functionOne('some argument');

                expect(actual).toBe('originalResult');
            });
        });

        describe('given function spy', function() {
            it('should call the mock function given arguments passed to function call match given arguments', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith('some argument');

                var actual = fn('some argument');

                expect(actual).toBe('return value');
            });

            it('should call the mock function given arguments passed to function call is null and match given arguments', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith(null);

                var actual = fn(null);

                expect(actual).toBe('return value');
            });

            it('should call the mock function given arguments passed to function call is undefined and match given arguments', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith(undefined);

                var actual = fn(undefined);

                expect(actual).toBe('return value');
            });

            it('should call the mock function given type of arguments passed to function call match given any', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith(mockito4js.any('string'));

                var actual = fn('random argument');

                expect(actual).toBe('return value');
            });

            it('should call the mock function given type of arguments passed to function call match given eq', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith(mockito4js.eq({key: 'value'}));

                var actual = fn({key: 'value'});

                expect(actual).toBe('return value');
            });

            it('should capture the given value when argument captor is used', function() {
                var argumentCaptor = mockito4js.createArgumentCaptor();
                mockito4js.doReturn('return value').when(fn).isCalledWith(argumentCaptor);

                var actual = fn({key: 'value'});

                expect(actual).toBe('return value');
                expect(argumentCaptor.getValue()).toEqual({key: 'value'});
            });

            it('should not call the mock function given arguments passed to function call do not match given arguments', function() {
                mockito4js.doReturn('return value').when(fn).isCalledWith('another argument');

                var actual = fn('some argument');

                expect(actual).toBe('originalResult');
            });

            it('should not call the mock function given arguments passed to function and no given arguments', function() {
                mockito4js.doReturn('return value').when(fn).isCalled();

                var actual = fn('some argument');

                expect(actual).toBe('originalResult');
            });

            it('should call the mock function given no arguments and isCalled is used', function() {
                mockito4js.doReturn('return value').when(fn).isCalled();

                var actual = fn();

                expect(actual).toBe('return value');
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

            it('should return the second given argument when function called a second time', function() {
                mockito4js.doReturn('return value', 'second return value').when(object).functionOne();

                object.functionOne();
                var actual = object.functionOne();

                expect(actual).toBe('second return value');
            });

            it('should return the second given argument when called a second time and multiple doReturns defined', function() {
                mockito4js.doReturn('return value', 'second return value').when(object).functionOne();
                mockito4js.doReturn('other return value', 'second other return value').when(object).functionTwo();

                expect(object.functionOne()).toBe('return value');
                expect(object.functionOne()).toBe('second return value');
                expect(object.functionTwo()).toBe('other return value');
                expect(object.functionTwo()).toBe('second other return value');
            });
        });

        describe('given function spy', function() {
            it('should return given value when function is called', function() {
                mockito4js.doReturn('return value').when(fn).isCalled();

                var actual = fn();

                expect(actual).toBe('return value');
            });

            it('should return given value when function on given function spy is called', function() {
                mockito4js.doReturn('return value').when(fn).functionOne();

                var actual = fn.functionOne();

                expect(actual).toBe('return value');
            });

            it('should return given value when function is called', function() {
                mockito4js.doReturn('return value').when(fn).functionOne();

                var actual = fn.functionOne();

                expect(actual).toBe('return value');
            });

            it('should return the second given argument when function called a second time', function() {
                mockito4js.doReturn('return value', 'second return value').when(fn).isCalled();

                fn();
                var actual = fn();

                expect(actual).toBe('second return value');
            });

            it('should return the second given argument when called a second time and multiple doReturns defined', function() {
                mockito4js.doReturn('return value', 'second return value').when(fn).isCalled();
                mockito4js.doReturn('other return value', 'second other return value').when(fn).functionOne();

                expect(fn()).toBe('return value');
                expect(fn()).toBe('second return value');
                expect(fn.functionOne()).toBe('other return value');
                expect(fn.functionOne()).toBe('second other return value');
            });
        });
    });

    describe('doNothing', function() {
        beforeEach(function() {
            object.functionOne = function() {
                return 'return value';
            }
        });

        it('should do nothing when given function spy is called', function() {
            mockito4js.doNothing().when(fn).isCalled();

            var actual = fn();

            expect(actual).toBe(undefined);
        });

        it('should do nothing when function on given function spy is called', function() {
            mockito4js.doNothing().when(fn).functionOne();

            var actual = fn.functionOne();

            expect(actual).toBe(undefined);
        });

        it('should do nothing given value when function on given object spy is called', function() {
            mockito4js.doNothing().when(object).functionOne();

            var actual = object.functionOne();

            expect(actual).toBe(undefined);
        });
    });

    describe('doThrow', function() {
        it('should throw error when given function spy is called', function() {
            mockito4js.doThrow(new Error('Some error')).when(fn).isCalled();

            expect(fn).toThrow(new Error('Some error'));
        });

        it('should throw error when function on given function spy is called', function() {
            mockito4js.doThrow(new Error('Some error')).when(fn).functionOne();

            expect(fn.functionOne).toThrow(new Error('Some error'));
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
        });

        it('should fire an event on given DOM element error when function on given function spy is called', function() {
            mockito4js.doFire('click').on(domElement).when(fn).functionOne();

            fn.functionOne();

            expect(handlerResult).toBe('event fired');
        });

        it('should fire an event on given DOM element error when function on given object spy is called', function() {
            mockito4js.doFire('click').on(domElement).when(object).functionOne();

            object.functionOne();

            expect(handlerResult).toBe('event fired');
        });
    });
});