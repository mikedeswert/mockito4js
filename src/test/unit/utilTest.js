"use strict";

describe('Util module', function() {
    describe('array', function() {
        describe('containsAllArguments', function() {
            it('should return false given arrays do not have the same length', function() {
                var actual = mockito4js.util.array.containsAllArguments([1], [1, 2]);

                expect(actual).toBe(false);
            });

            it('should return false given array 2 does not contain element of array 1', function() {
                var actual = mockito4js.util.array.containsAllArguments([1, 3], [1, 2]);

                expect(actual).toBe(false);
            });

            it('should return true given array 2 contains elements of array 1', function() {
                var actual = mockito4js.util.array.containsAllArguments([1, 2], [1, 2]);

                expect(actual).toBe(true);
            });

            it('should return false given array 2 contains elements of array 1 in a different order', function() {
                var actual = mockito4js.util.array.containsAllArguments([1, 2], [2, 1]);

                expect(actual).toBe(false);
            });
        });

        describe('arrayContains', function() {
            it('should return true given array contains value', function() {
                var element = { key: 'value'};
                var array = [element];

                var actual = mockito4js.util.array.arrayContains(array, element);

                expect(actual).toBe(true);
            });

            it('should return true given array contains value and value is undefined', function() {
                var array = [undefined];

                var actual = mockito4js.util.array.arrayContains(array, undefined);

                expect(actual).toBe(true);
            });

            it('should return true given array contains value and value is null', function() {
                var array = [null];

                var actual = mockito4js.util.array.arrayContains(array, null);

                expect(actual).toBe(true);
            });

            it('should return false given array does not contain value', function() {
                var element = { key: 'value'};
                var array = [1];

                var actual = mockito4js.util.array.arrayContains(array, element);

                expect(actual).toBe(false);
            });

            it('should return false given array has no elements', function() {
                var element = { key: 'value'};
                var array = [];

                var actual = mockito4js.util.array.arrayContains(array, element);

                expect(actual).toBe(false);
            });

            it('should return true given value in array matches given value', function() {
                var element = {
                    key: 'value',
                    matches: function() {
                        return true;
                    }
                };
                var array = ['other element'];

                var actual = mockito4js.util.array.arrayContains(array,element);

                expect(actual).toBe(true);
            });

            it('should return false given value in array does not match given value', function() {
                var element = {
                    key: 'value',
                    matches: function() {
                        return false;
                    }
                };
                var array = ['other element'];

                var actual = mockito4js.util.array.arrayContains(array,element);

                expect(actual).toBe(false);
            });
        });

        describe('valuesMatch', function() {
            it('should return true given actual value equals expected value', function() {
                var element = {key: 'value'};
                var actual = mockito4js.util.array.valuesMatch(element, element);

                expect(actual).toBe(true);
            });

            it('should return true given actual value and expected value are undefined', function() {
                var actual = mockito4js.util.array.valuesMatch(undefined, undefined);

                expect(actual).toBe(true);
            });

            it('should return true given actual value and expected value are null', function() {
                var actual = mockito4js.util.array.valuesMatch(null, null);

                expect(actual).toBe(true);
            });

            it('should return false given actual value is not equal to expected value', function() {
                var actual = mockito4js.util.array.valuesMatch("actual value", "expected value");

                expect(actual).toBe(false);
            });

            it('should return true given expected value matches actual value', function() {
                var element = {
                    key: 'value',
                    matches: function() {
                        return true;
                    }
                };

                var actual = mockito4js.util.array.valuesMatch('other element',element);

                expect(actual).toBe(true);
            });

            it('should return false given expected value does not match actual value', function() {
                var element = {
                    key: 'value',
                    matches: function() {
                        return false;
                    }
                };

                var actual = mockito4js.util.array.arrayContains('other element',element);

                expect(actual).toBe(false);
            });
        });

        describe('getLastElement', function() {
            it('should return the last element given array has at least one element', function() {
                var element = { key: 'value'};
                var array = [element];

                var actual = mockito4js.util.array.getLastElement(array);

                expect(actual).toBe(element);
            });

            it('should return undefined given array has no elements', function() {
                var array = [];

                var actual = mockito4js.util.array.getLastElement(array);

                expect(actual).toBe(undefined);
            });

            it('should return undefined given array is undefined', function() {
                var actual = mockito4js.util.array.getLastElement(undefined);

                expect(actual).toBe(undefined);
            });

            it('should return undefined given array is null', function() {
                var actual = mockito4js.util.array.getLastElement(null);

                expect(actual).toBe(undefined);
            });
        });
    });
});