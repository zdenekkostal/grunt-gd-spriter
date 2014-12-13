/*
 * grunt-gd-spriter
 * https://github.com/gooddata/grunt-gd-spriter
 *
 * Copyright (c) 2013 GoodData Corporation
 * Licensed under the BSD license.
 */

'use strict';

module.exports = function(grunt) {
    var taskName = 'spriter';

    grunt.registerMultiTask(taskName, 'Create sprites from css images according their position, repeat, and replace them in the css.', function() {
        var done = this.async();
        var spriter = require('./lib/spriter').init(grunt);

        // merge options
        var defaultOptions = spriter.defaultOptions;

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
        var tasks = this.files.map(function(f) {
            return function () {
                var callback = arguments[0];
                spriter.processFile(f, options, callback);
            };
        });

        grunt.util.async.series(tasks,
            function(err, results){
                done(!err);
            }
        );
    });
};
