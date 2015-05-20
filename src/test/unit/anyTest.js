"use strict";

describe('Any module', function() {
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
});