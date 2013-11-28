/*
 * grunt-gd-spriter
 * https://github.com/gooddata/grunt-gd-spriter
 *
 * Copyright (c) 2013 GoodData Corporation
 * Licensed under the BSD license.
 */

'use strict';

var Packer = exports.Packer = function() {};

Packer.prototype = {
    fit: function(blocks) {
        var block, currentPos = 0;
        for (var n = 0; n < blocks.length; n++) {
            block = blocks[n];
            block.fit = {x: 0, y: currentPos};
            currentPos += block.h;
        }
    }
};