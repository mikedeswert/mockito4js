"use strict";

module.exports = function(grunt) {
    var concat = require('./config/grunt/concat'),
        uglify = require('./config/grunt/uglify'),
        karma = require('./config/grunt/karma'),
        watch = require('./config/grunt/watch'),
        bump = require('./config/grunt/bump'),
        git = require('./config/grunt/git'),
        release = require('./config/grunt/release');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: concat,
        uglify: uglify,
        karma: karma,
        watch: watch,
        bump: bump,
        gitadd: git.gitadd,
        gitcommit: git.gitcommit,
        release: release
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-release');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['concat', 'karma:normal', 'uglify:dist', 'karma:uglified']);
    grunt.registerTask('publish', ['publish:patch']);
    grunt.registerTask('publish:patch', ['build', 'bump:patch', 'uglify:dist', 'gitadd:dist', 'gitcommit:dist', 'release']);
    grunt.registerTask('publish:minor', ['build', 'bump:minor', 'uglify:dist', 'gitadd:dist', 'gitcommit:dist', 'release']);
    grunt.registerTask('publish:major', ['build', 'bump:major', 'uglify:dist', 'gitadd:dist', 'gitcommit:dist', 'release']);
};