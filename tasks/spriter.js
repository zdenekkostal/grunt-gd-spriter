/*
 * grunt-gd-spriter
 * https://github.com/gooddata/grunt-gd-spriter
 *
 * Copyright (c) 2013 GoodData Corporation
 * Licensed under the BSD license.
 */

'use strict';

module.exports = function(grunt) {
    var spriter = require('./lib/spriter').init(grunt);
    var taskName = 'spriter';

    grunt.registerMultiTask(taskName, 'Create sprites from css images according their position, repeat, and replace them in the css.', function() {
        var done = this.async();

        // merge options
        var defaultOptions = {
            spaceVertical: 0,
            spaceHorizontal: 0
        };

        var taskOpts   = grunt.config([taskName, 'options']) || defaultOptions;
        var targetOpts = grunt.config([taskName, this.target, 'options']) || defaultOptions;
        var options    = grunt.util._.merge(defaultOptions, taskOpts, targetOpts);

        this.files.forEach(function(f) {
            if (!f.src.length) {
                grunt.log.warn('Source file of "'+this.target+'" not found.');
                return false;
            }

            var valid = f.src.forEach(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });
        }, this);

        // Iterate over all src-dest file pairs.
        this.files.forEach(function(f) {
            spriter.processFile(f, options, done);
        });
    });
};
