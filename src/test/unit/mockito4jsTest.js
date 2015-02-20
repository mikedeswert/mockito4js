"use strict";

describe('mockito4js', function () {
    var object;
    beforeEach(function () {
        object = {
            functionOne: function() {},
            functionTwo: function() {}
        };
    });

    describe('spy', function() {
        it('should add an isSpy attribute to the object', function() {
            var objectSpy = mockito4js.spy(object);

            expect(objectSpy.isSpy).toBe(true);
        });

        it('should add an invocations object to the object', function() {
            var objectSpy = mockito4js.spy(object);

            expect(objectSpy.invocations instanceof Object).toBe(true);
        });

        it('should replace all functions of the object with mock functions that register invocations', function() {
            var objectSpy = mockito4js.spy(object);

            objectSpy.functionOne();
            objectSpy.functionTwo();

            expect(objectSpy.invocations['functionOne'].length).toBe(1);
            expect(objectSpy.invocations['functionTwo'].length).toBe(1);
        });
    });

    describe('verify', function() {

    });

    describe('doReturn', function() {

    });

    describe('doNothing', function() {

    });

    describe('doThrow', function() {

    });

    describe('doFire', function() {

    });
});