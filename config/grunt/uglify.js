"use strict";

module.exports = {
    options: {
        mangle: {
            except: ['mockito4js']
        }
    },
    dist: {
        options: {
            sourceMap: true,
            sourceMapRoot: 'https://raw.githubusercontent.com/mikedeswert/mockito4js/v<%= pkg.version %>/dist/'
        },
        files: {
            './dist/mockito4.min.js': ['./dist/mockito4.js']
        }
    }
};