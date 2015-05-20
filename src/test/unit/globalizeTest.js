"use strict";

describe('Globalize module', function() {
    describe('globalize', function() {
        it('should set commonly used mockito4js functions as global functions on window', function() {
            mockito4js.globalize();

            for(var property in mockito4js) {
                if (mockito4js.hasOwnProperty(property)) {
                    expect(window[property]).toBe(mockito4js[property]);
                }
            }
        })
    });
});