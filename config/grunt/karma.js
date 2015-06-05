"use strict";

module.exports = {
    options: {
        configFile: './src/test/karma.conf.js'
    },
    normal: {
        options: {
            files: ['../dist/mockito4.js', './test/unit/**/*.js']
        }
    },
    uglified: {
        options: {
            files: ['../dist/mockito4.min.js', './test/unit/**/*.js']
        }
    }
};