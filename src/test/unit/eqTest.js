"use strict";

describe('Eq module', function() {
    describe('eq', function() {

        it('should correctly initialize the value property', function() {
            var actual = mockito4js.eq('value');

            expect(actual.value).toBe('value');
        });

        describe('matches', function() {
            it('should return true given x and y are NaN', function() {
                var actual = mockito4js.eq(NaN).matches(NaN);

                expect(actual).toBe(true);
            });

            it('should return true given x and y are undefined', function() {
                var actual = mockito4js.eq(undefined).matches(undefined);

                expect(actual).toBe(true);
            });

            it('should return true given x and y are null', function() {
                var actual = mockito4js.eq(null).matches(null);

                expect(actual).toBe(true);
            });

            it('should return true given x and y are the same string', function() {
                var actual = mockito4js.eq('value').matches('value');

                expect(actual).toBe(true);
            });

            it('should return true given x and y are different strings with the same value', function() {
                var actual = mockito4js.eq(new String('value')).matches(new String('value'));

                expect(actual).toBe(true);
            });

            it('should return false given x and y are not the same string', function() {
                var actual = mockito4js.eq('value').matches('other value');

                expect(actual).toBe(false);
            });

            it('should return true given x and y are the same number', function() {
                var actual = mockito4js.eq(2).matches(2);

                expect(actual).toBe(true);
            });

            it('should return false given x and y are not the same number', function() {
                var actual = mockito4js.eq(2).matches(3);

                expect(actual).toBe(false);
            });

            it('should return false given x and y are different numbers with the same value', function() {
                var actual = mockito4js.eq(new Number(2)).matches(new Number(2));

                expect(actual).toBe(true);
            });

            it('should return true given x and y are the same number and y is a decimal', function() {
                var actual = mockito4js.eq(2).matches(2.0);

                expect(actual).toBe(true);
            });

            it('should return false given x and y are the same number but x is a string', function() {
                var actual = mockito4js.eq('2').matches(2);

                expect(actual).toBe(false);
            });

            it('should return true given x and y are the same object', function() {
                var object = {key: 'value'};
                var actual = mockito4js.eq(object).matches(object);

                expect(actual).toBe(true);
            });

            it('should return true given x and y are different dates with the same value', function() {
                var actual = mockito4js.eq(new Date(9999)).matches(new Date(9999));

                expect(actual).toBe(true);
            });

            it('should return false given x and y are different dates with different values', function() {
                var actual = mockito4js.eq(new Date(9999)).matches(new Date(1111));

                expect(actual).toBe(false);
            });

            it('should return true given x and y are different regular expressions with the same value', function() {
                var actual = mockito4js.eq(new RegExp("value")).matches(new RegExp("value"));

                expect(actual).toBe(true);
            });

            it('should return true given x and y are different regular expressions with the different values', function() {
                var actual = mockito4js.eq(new RegExp("value")).matches(new RegExp("other value"));

                expect(actual).toBe(false);
            });

            it('should return true given x and y are different objects with the same properties', function() {
                var actual = mockito4js.eq({key: 'value'}).matches({key: 'value'});

                expect(actual).toBe(true);
            });

            it('should return true given x and y are different objects with the same nested object', function() {
                var actual = mockito4js.eq({object: {key: 'value'}}).matches({object: {key: 'value'}});

                expect(actual).toBe(true);
            });

            it('should return true given x and y are different objects with the same properties in a different order', function() {
                var actual = mockito4js.eq({keyOne: 'valueOne', keyTwo: 'valueTwo'}).matches({keyTwo: 'valueTwo', keyOne: 'valueOne'});

                expect(actual).toBe(true);
            });

            it('should return false given x and y are different objects with different properties', function() {
                var actual = mockito4js.eq({key: 'value'}).matches({key: 'other value'});

                expect(actual).toBe(false);
            });

            it('should return true given x and y are different arrays with the same elements', function() {
                var actual = mockito4js.eq([{key: 'value'}]).matches([{key: 'value'}]);

                expect(actual).toBe(true);
            });

            it('should return true given x and y are different arrays with different elements', function() {
                var actual = mockito4js.eq([{key: 'value'}]).matches([{key: 'other value'}]);

                expect(actual).toBe(false);
            });

            it('should return true given x and y are the same function', function() {
                var fn = function(){};
                var actual = mockito4js.eq(fn).matches(fn);

                expect(actual).toBe(true);
            });

            it('should return true given x and y are different functions with the same properties', function() {
                var fn = function(){};
                var otherFn = function(){};
                var actual = mockito4js.eq(fn).matches(otherFn);

                expect(actual).toBe(true);
            });

            it('should return false given x and y are different function with different properties', function() {
                var fn = function(){
                    return true;
                };
                var otherFn = function(){
                    return false;
                };
                var actual = mockito4js.eq(fn).matches(otherFn);

                expect(actual).toBe(false);
            });
        });
    });
});