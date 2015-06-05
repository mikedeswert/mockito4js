"use strict";

module.exports = {
    js: {
        files: ['./src/main/**/*.js'],
        tasks: ['build']
    },
    test: {
        files: ['./src/test/unit/**/*.js'],
        tasks: ['karma:normal', 'karma:uglified']
    }
};