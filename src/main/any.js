getMockito4jsBuilder().Any = function(mockito4js) {
    mockito4js.any = function (type) {
        return new Any(type);
    };

    function Any(type) {
        this.type = type;

        this.matches = function (argument) {
            try {
                return typeof argument == type || argument instanceof type;
            } catch (error) {
                return false;
            }
        };
    }
};