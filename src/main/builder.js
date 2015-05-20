var getMockito4jsBuilder = function() {
    if(window.mockito4jsBuilder == undefined || window.mockito4jsBuilder == null) {
        window.mockito4jsBuilder = {
            build: function(mockito4jsBuilder) {
                var mockito4js = {};

                mockito4jsBuilder.Util(mockito4js);
                mockito4jsBuilder.Spy(mockito4js);
                mockito4jsBuilder.Verify(mockito4js);
                mockito4jsBuilder.Any(mockito4js);
                mockito4jsBuilder.Eq(mockito4js);
                mockito4jsBuilder.Do(mockito4js);
                mockito4jsBuilder.Globalize(mockito4js);

                return mockito4js;
            }
        };
    }

    return window.mockito4jsBuilder;
};