"use strict";

describe('Capture module', function() {
    describe('createArgumentCaptor', function() {
        it('should return an argument captor', function() {
            var actual = mockito4js.createArgumentCaptor();

            expect(actual.matches).toBeDefined();
            expect(actual.values).toEqual([]);
            expect(actual.getValue).toBeDefined();
        });
    });

    describe('ArgumentCaptor', function() {
        var argumentCaptor;

        beforeEach(function() {
            argumentCaptor = mockito4js.createArgumentCaptor();
        });

        describe('matches', function() {
            it('should always return true', function() {
                var actual = argumentCaptor.matches('argument');

                expect(actual).toBe(true);
            });

            it('should push the given argument on the values array', function() {
                argumentCaptor.matches('argument');

                expect(argumentCaptor.values[0]).toBe('argument');
            });
        });

        describe('getValue', function() {
            it('should throw an error given no arguments were captured', function() {
                expect(function() {
                    argumentCaptor.getValue()
                }).toThrow(new Error('No arguments captured!'));
            });

            it('should return the last element of captured values', function() {
                argumentCaptor.matches('argumentOne');
                argumentCaptor.matches('argumentTwo');

                expect(argumentCaptor.getValue()).toBe('argumentTwo');
            });
        });
    });
});