getMockito4jsBuilder().Capture = function (mockito4js) {
    mockito4js.createArgumentCaptor = function() {
        return new ArgumentCaptor();
    };

    function ArgumentCaptor() {
        this.values = [];

        this.matches = function(argument) {
            this.values.push(argument);
            return true;
        };

        this.getValue = function() {
            if(this.values.length == 0) {
                throw new Error('No arguments captured!');
            }

            return mockito4js.util.array.getLastElement(this.values);
        };
    }
};