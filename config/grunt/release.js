"use strict";

module.exports = {
    options: {
        bump: false,
        commitMessage: 'Release v<%= version %>',
        npm: false,
        tagName: 'v<%= version %>'
    }
};