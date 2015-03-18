getMockito4jsBuilder().Spy = function(mockito4js) {
    var spyFactory = new SpyFactory();

    mockito4js.spy = function (object) {
        return spyFactory.createSpy(object);
    };

    mockito4js.reset = function(spy) {
        if(spy.isSpy) {
            for(var property in spy.invocations) {
                if(spy.invocations.hasOwnProperty(property)) {
                    spy.invocations[property] = [];
                }
            }
            return;
        }

        throw new Error('Object or function passed to reset is not a spy. Use mockito4js.spy() to create one.');
    };

    function SpyFactory() {
        this.createSpy = function(object) {
            if(typeof object == 'function') {
                return createFunctionSpy(object);
            }

            return createObjectSpy(object);
        };

        function createFunctionSpy(fn) {
            var spyFunction;
            spyFunction = function () {
                if (spyFunction.invocations['self'] == undefined) {
                    spyFunction.invocations['self'] = [];
                }
                spyFunction.invocations['self'].push({actualArguments: arguments});
                return spyFunction.execution.apply(this, arguments);
            };
            spyFunction.invocations = {};
            spyFunction.isSpy = true;
            spyFunction.execution = fn;

            return spyFunction;
        }

        function createObjectSpy(object) {
            object.invocations = {};
            object.isSpy = true;
            mockito4js.util.replaceFunctions(object, object,mockito4js.util.functionFactory.createInvocationCountingFunction);

            return object;
        }
    }
};