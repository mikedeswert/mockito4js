"use strict";

module.exports = {
    gitadd: {
        dist: {
            files: {
                src: ['./dist/mockito4.js', './dist/mockito4.min.js', './dist/mockito4.min.js.map']
            }
        }
    },
    gitcommit: {
        dist: {
            options: {
                message: 'Staging and committing dist files prior to release v<%= pkg.version %>.'
            },
            files: {
                src: ['./dist/mockito4.js', './dist/mockito4.min.js', './dist/mockito4.min.js.map']
            }
        }
    }
};