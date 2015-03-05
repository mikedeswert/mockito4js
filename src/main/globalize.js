getMockito4jsBuilder().Globalize = function(mockito4js) {
    mockito4js.globalize = function () {
        for (var property in mockito4js) {
            if (mockito4js.hasOwnProperty(property)) {
                window[property] = mockito4js[property];
            }
        }
    };
};