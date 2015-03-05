getMockito4jsBuilder().Spy = function(mockito4js) {
    var spyFactory = new SpyFactory();

    mockito4js.spy = function (object) {
        return spyFactory.createSpy(object);
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