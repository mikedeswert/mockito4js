describe('Spy module', function() {
    var objectSpy,
        functionSpy,
        fnResult;

    beforeEach(function () {
        var object = {
            functionOne: function() {},
            functionTwo: function() {}
        };
        objectSpy = mockito4js.spy(object);

        var fn = function() {
            fnResult = 'result';
        };
        functionSpy = mockito4js.spy(fn);

        fnResult = '';
    });

    describe('spy', function() {
        describe('on object', function() {
            it('should add an isSpy attribute to the object', function() {
                expect(objectSpy.isSpy).toBe(true);
            });

            it('should add an invocations object to the object', function() {
                expect(objectSpy.invocations instanceof Object).toBe(true);
            });

            it('should replace all functions of the object with mock functions that register invocations', function() {
                objectSpy.functionOne();
                objectSpy.functionTwo();

                expect(objectSpy.invocations['functionOne'].length).toBe(1);
                expect(objectSpy.invocations['functionTwo'].length).toBe(1);
            });

            it('should not replace all functions of the object if object is already a spy', function() {
                var mockito4jsUtilsSpy = mockito4js.spy(mockito4js.util);
                mockito4js.spy(objectSpy);

                mockito4js.verify(mockito4jsUtilsSpy, mockito4js.never()).replaceFunctions(objectSpy, objectSpy, mockito4js.any(Function));
            });
        });

        describe('on function', function() {
            it('should add an isSpy attribute to the function', function() {
                expect(functionSpy.isSpy).toBe(true);
            });

            it('should add an invocations object to the function', function() {
                expect(functionSpy.invocations instanceof Object).toBe(true);
            });

            it('should call and register the original function', function() {
                functionSpy();

                expect(fnResult).toBe('result');
                expect(functionSpy.invocations['self'].length).toBe(1);
            });
        });

    });

    describe('reset', function() {
        it('should reset all invocations of a given object spy to 0', function() {
            objectSpy.functionOne();
            mockito4js.verify(objectSpy, mockito4js.once()).functionOne();

            mockito4js.reset(objectSpy);

            mockito4js.verify(objectSpy, mockito4js.never()).functionOne();
        });

        it('should reset all invocations of a given function spy to 0', function() {
            functionSpy();
            mockito4js.verify(functionSpy, mockito4js.once()).wasCalled();

            mockito4js.reset(functionSpy);

            mockito4js.verify(functionSpy, mockito4js.never()).wasCalled();
        });

        it('should throw an error given object is not a spy', function() {
            var object = {};

            expect(function() {
                mockito4js.reset(object);
            }).toThrow(new Error('Object or function passed to reset is not a spy. Use mockito4js.spy() to create one.'))
        });
    });
});
