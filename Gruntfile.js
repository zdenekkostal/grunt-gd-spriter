/*
* grunt-gd-spriter
* https://github.com/gooddata/grunt-gd-spriter
*
* Copyright (c) 2013 GoodData Corporation
* Licensed under the BSD license.
*/

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
            'Gruntfile.js',
            'tasks/*.js',
            '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: "test", src: ['**'], dest: 'tmp'}
                ]
            }
        },

        // Configuration to be run (and then tested).
        spriter: {
            all: {
                src: 'tmp/fixtures/all.css',
                dest: 'tmp/styles/all-sprited.css',
                spriteDest: 'tmp/sprites'
            },

            multiple: {
                src: ['tmp/fixtures/a.css', 'tmp/fixtures/b.css'],
                dest: 'tmp/styles/multiple-sprited.css',
                spriteDest: 'tmp/sprites'
            },

            withOptions: {
                options: {
                    spaceVertical: 3,
                    spaceHorizontal: 2
                },
                src:  'tmp/fixtures/withOptions.css',
                dest: 'tmp/styles/withOptions-sprited.css',
                spriteDest: 'tmp/sprites'
            },

            repeat: {
                options: {
                    spaceVertical: 5,
                    spaceHorizontal: 5
                },
                src: 'tmp/fixtures/repeat.css',
                dest: 'tmp/styles/repeat-sprited.css',
                spriteDest: 'tmp/sprites'
            },

            version: {
                options: {
                    version: 'xxx',
                },
                src: 'tmp/fixtures/version.css',
                dest: 'tmp/styles/version-sprited.css',
                spriteDest: 'tmp/sprites'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy', 'spriter', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
