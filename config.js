/*
* grunt-gd-spriter
* https://github.com/gooddata/grunt-gd-spriter
*
* Copyright (c) 2013 GoodData Corporation
* Licensed under the BSD license.
*/

'use strict';

module.exports = {
    jshint: {
        all: [
            'config.js',
            'Gruntfile.js',
            'tasks/*.js',
            'tasks/**/*.js',
            'test/*_test.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    },

    watch: {
        lib: {
            files: ['tasks/**/*', 'test/*.js'],
            tasks: ['jshint', 'test']
        },
        test: {
            files: './*.js',
            tasks: ['jshint']
        }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
        tests: ['tmp']
    },

    copy: {
        tests: {
            files: [{
                expand: true,
                cwd: "test",
                src: ['**'],
                dest: 'tmp'
            }]
        }
    },

    // Configuration to be run (and then tested).
    spriter: {
        all: {
            src: 'tmp/fixtures/all.css',
            dest: 'tmp/styles/all-sprited.css',
            spriteDest: 'tmp/sprites',
            options: {
                skip: [
                    'image5.png'
                ]
            }
        },

        multiple: {
            src: ['tmp/fixtures/a.css', 'tmp/fixtures/b.css'],
            dest: 'tmp/styles/multiple-sprited.css',
            spriteDest: 'tmp/sprites'
        },

        customSpaces: {
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
                version: 'xxx'
            },
            src: 'tmp/fixtures/version.css',
            dest: 'tmp/styles/version-sprited.css',
            spriteDest: 'tmp/sprites'
        },

        customRegex: {
            options: {
                regEx: /background:\s*url\([\'"]?([^\'\"\)]+)["\']?\)\s*((?:no-repeat|repeat|repeat-x|repeat-y|center|top|bottom|left|right|scroll|fixed|\s+){0,9});(\s*\/\*[^*]+\*\/)?/ig
            },
            src: 'tmp/fixtures/regex.css',
            dest: 'tmp/styles/regex-sprited.css',
            spriteDest: 'tmp/sprites'
        },

        minified: {
            src: 'tmp/fixtures/minified.css',
            dest: 'tmp/styles/minified-sprited.css',
            spriteDest: 'tmp/sprites'
        }
    },

    mocha_istanbul: {
        coverage: {
            src: 'test',
            options: {
                root: 'tasks/lib/',
                reportFormats: ['html', 'cobertura'],
                mask: '*_test.js'
            }
        }
    }
};
