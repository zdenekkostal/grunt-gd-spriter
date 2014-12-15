/*
* grunt-gd-spriter
* https://github.com/gooddata/grunt-gd-spriter
*
* Copyright (c) 2013 GoodData Corporation
* Licensed under the BSD license.
*/

'use strict';

var config = require('./config');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig(config);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy', 'setupTests', 'mocha_istanbul']);

    grunt.registerTask('setupTests', function () {
        for (var i = 2; i < 7; i++) {
            grunt.file.copy('test/fixtures/image.png', 'tmp/fixtures/image'+i+'.png');
        }
        grunt.file.copy('test/fixtures/image.png', 'tmp/fixtures/image.gif');
    });

    // By default, lint and run all tests.
    grunt.registerTask('default', ['watch']);

};
