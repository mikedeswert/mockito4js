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
        var objectSpy;

        beforeEach(function() {
            objectSpy = mockito4js.spy(object);
        });

        it("should wrap the given spy in a Verify object exposing all the objects public functions", function() {
            var actual = mockito4js.verify(objectSpy, mockito4js.once());

            expect(actual.functionOne instanceof Function).toBe(true);
            expect(actual.functionTwo instanceof Function).toBe(true);
        });

        it('should call the verifier verify method with the correct function name and actual invocation count', function() {
            var verifierSpy = mockito4js.spy(mockito4js.once());
            mockito4js.doNothing().when(verifierSpy).verify();
            mockito4js.verify(objectSpy, verifierSpy).functionOne('argumentOne');

            mockito4js.verify(verifierSpy, mockito4js.once()).verify('functionOne', 0);
        });
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