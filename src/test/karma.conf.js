module.exports = function (config) {
    config.set({
        basePath: '../',
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],
        frameworks: ['jasmine'],
        files: [
            '../dist/mockito4.min.js',
            '../dist/mockito4.min.js.map',
            'test/unit/**/*.js'
        ],
        reporters: ['progress'],
        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        port: 9010,
        colors: true,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
