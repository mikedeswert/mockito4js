"use strict";

describe('mockito4js', function () {
    var object;

    beforeEach(function () {
        object = {
            functionOne: function() {},
            functionTwo: function() {}
        };
    });

    describe('doReturn', function() {
        it('should return given value when function on given object is called', function() {
            mockito4js.doReturn('return value').when(object).functionOne();

            var actual = object.functionOne();

            expect(actual).toBe('return value');
        });

        it('should return given value when function on given spy is called', function() {
            mockito4js.doReturn('return value').when(mockito4js.spy(object)).functionOne();

            var actual = object.functionOne();

            expect(actual).toBe('return value');
        });
    });

    describe('doNothing', function() {

    });

    describe('doThrow', function() {

    });

    describe('doFire', function() {

    });
});