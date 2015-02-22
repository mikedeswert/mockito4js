"use strict";

describe('mockito4js', function () {
    var object;

    beforeEach(function () {
        object = {
            functionOne: function() {},
            functionTwo: function() {}
        };
    });

    describe('every do method', function() {
        it('should call the mock function if arguments passed to function call match given arguments', function() {
            mockito4js.doReturn('return value').when(object).functionOne('some argument');

            var actual = object.functionOne('some argument');

            expect(actual).toBe('return value');
        });

        it('should call the mock function arguments passed to function call is null and match given arguments', function() {
            mockito4js.doReturn('return value').when(object).functionOne(null);

            var actual = object.functionOne(null);

            expect(actual).toBe('return value');
        });


        it('should call the mock function arguments passed to function call is undefined and match given arguments', function() {
            mockito4js.doReturn('return value').when(object).functionOne(undefined);

            var actual = object.functionOne(undefined);

            expect(actual).toBe('return value');
        });

        it('should call the mock function if type of arguments passed to function call match given any', function() {
            mockito4js.doReturn('return value').when(object).functionOne(mockito4js.any('string'));

            var actual = object.functionOne('random argument');

            expect(actual).toBe('return value');
        });

        it('should not call the mock function if arguments passed to function call do not match given arguments', function() {
            mockito4js.doReturn('return value').when(object).functionOne('another argument');

            var actual = object.functionOne('some argument');

            expect(actual).toBe(undefined);
        });

    });

    describe('doReturn', function() {
        it('should return given value when function on given object is called', function() {
            mockito4js.doReturn('return value').when(object).functionOne();

            var actual = object.functionOne();

            expect(actual).toBe('return value');
        });

        it('should return given value when function on given spy is called', function() {
            var objectSpy = mockito4js.spy(object);
            mockito4js.doReturn('return value').when(objectSpy).functionOne();

            var actual = objectSpy.functionOne();

            expect(actual).toBe('return value');
        });
    });

    describe('doNothing', function() {
        beforeEach(function() {
            object.functionOne = function() {
                return 'return value';
            }
        });

        it('should do nothing when function on given object is called', function() {
            mockito4js.doNothing().when(object).functionOne();

            var actual = object.functionOne();

            expect(actual).toBe(undefined);
        });

        it('should return given value when function on given spy is called', function() {
            var objectSpy = mockito4js.spy(object);
            mockito4js.doNothing().when(objectSpy).functionOne();

            var actual = objectSpy.functionOne();

            expect(actual).toBe(undefined);
        });
    });

    describe('doThrow', function() {
        it('should throw error when function on given object is called', function() {
            mockito4js.doThrow(new Error('Some error')).when(object).functionOne();

            expect(object.functionOne).toThrow(new Error('Some error'));
        });

        it('should throw error when function on given spy is called', function() {
            var objectSpy = mockito4js.spy(object);
            mockito4js.doThrow(new Error('Some error')).when(objectSpy).functionOne();

            expect(objectSpy.functionOne).toThrow(new Error('Some error'));
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

        it('should fire an event on given DOM element error when function on given object is called', function() {
            mockito4js.doFire('click').on(domElement).when(object).functionOne();

            object.functionOne();

            expect(handlerResult).toBe('event fired');
        });

        it('should throw error when function on given spy is called', function() {
            var objectSpy = mockito4js.spy(object);
            mockito4js.doFire('click').on(domElement).when(objectSpy).functionOne();

            objectSpy.functionOne();

            expect(handlerResult).toBe('event fired');
        });
    });
});