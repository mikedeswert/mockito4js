module.exports = function(grunt) {
    var concat = require('./config/grunt/concat'),
        karma = require('./config/grunt/karma'),
        watch = require('./config/grunt/watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: concat,
        karma: karma,
        watch: watch
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['watch']);
};