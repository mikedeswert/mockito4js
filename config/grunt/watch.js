module.exports = {
    js: {
        files: ['./src/main/**/*.js'],
        tasks: ['concat', 'karma']
    },
    test: {
        files: ['./src/test/unit/**/*.js'],
        tasks: ['karma']
    }
};