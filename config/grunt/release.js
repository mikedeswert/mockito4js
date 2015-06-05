"use strict";

module.exports = {
    options: {
        bump: false,
        commitMessage: 'Release <%= version %>',
        npm: false,
        tagName: 'v<%= version %>'
    }
};