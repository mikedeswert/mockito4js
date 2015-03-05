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
            '../dist/mockito4.js',
            'test/unit/**/*.js'
        ],
        reporters: ['progress'],
        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        port: 9010,
        colors: true,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false
    });
};
