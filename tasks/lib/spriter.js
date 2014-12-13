/*
 * grunt-gd-spriter
 * https://github.com/gooddata/grunt-gd-spriter
 *
 * Copyright (c) 2013 GoodData Corporation
 * Licensed under the BSD license.
 */

'use strict';

var fs     = require('fs');
var path   = require('path');
var gd     = require('node-gd');

exports.init = function(grunt) {

    var _log;

    var packers = {
        'regular': {
            'spriteWidth': 450,
            'spriteHeight': 4000,
            'spriter': require('binpacking').Packer
        },
        'x': {
            'spriteWidth': 10,
            'spriteHeight': 5000,
            'spriter': require('./xPacker.js').Packer
        },
        'y': {
            'spriteWidth': 5000,
            'spriteHeight': 500,
            'spriter': require('./yPacker.js').Packer
        }
    };

    var reBg = /background:\s*(transparent|black|red|white|#[0-9a-fA-F]{3,6})?\s*url\([\'"]?([^\'\"\)]+)["\']?\)\s*((?:no-repeat|repeat|repeat-x|repeat-y|center|top|bottom|left|right|scroll|fixed|-?[0-9]+%|0|-?[0-9]+px|\s+){0,9});(\s*\/\*[^*]+\*\/)?/ig;

    var target;

    var processFile = function (file, opts, done) {
        var fileContent;

        if (file.src.map) {
            fileContent = file.src.map(function(filepath) {
                // Read file source.
                return grunt.file.read(filepath);
            }).join('\n');
        }else{
            fileContent = grunt.file.read(file.src);
        }

        var matches = [],
            x = fileContent.replace(reBg, function (match, color, image, align, comment) {
                matches.push({
                    match: match,
                    color: color,
                    image: image,
                    align: align,
                    comment: comment
                });
        });

        var stylesheetPath = path.resolve(path.dirname(file.dest));
        var spriteDest = path.resolve(opts.spriteDest || file.spriteDest || './');

        var options = grunt.util._.merge({
            spriteDest: spriteDest,
            spritePath: path.relative(stylesheetPath, spriteDest) + '/',
            spriteBaseName: path.basename(file.dest).replace(path.extname(file.dest), '')
        }, opts);

        target = {
            processed: [],
            images: {},
            options: options,
            fileContent: fileContent,
            files: file,
            stylesDir: path.dirname((file.src.map && file.src[0]) || file.src),
            bgGroups: {
                'regular': [],
                'x': [],
                'y': []
            }
        };

        grunt.util.async.forEach(matches, loadImage, function (err) {
            grunt.util.async.forEach(matches, markImage, function (err) {
                grunt.util.async.forEach(Object.keys(target.bgGroups), makeSprite, function (err) {
                    if (err) {
                        grunt.fail.warn(err.msg);
                        done(false);
                    }
                    saveSprite();
                    done();
                });
            });
        });
    };

    var saveSprite = function () {
        var imgs = target.images,
            origContent = target.fileContent;

        var newContent = origContent.replace(reBg, function (match, color, image, align, comment) {
            if (imgs[image]){
                var i = imgs[image],
                    fit = i.fit;

                var background = 'background:';

                if (color) background += ' ' + color;
                background += ' url("' + i.sprite + '")';

                if (!fit.x) {
                    background += ' 0';
                }else{
                    background += ' -' + fit.x + "px";
                }

                if (!fit.y) {
                    background += ' 0';
                }else{
                    background += ' -' + fit.y + "px";
                }

                if (i.data.repeat){
                    background += ' repeat-' + i.data.repeat;
                }else{
                    background += ' no-repeat';
                }

                background += ';';

                return background;
            }else{
                return match;
            }
        });

        grunt.file.write(target.files.dest, newContent);
    };

    var makeSprite = function(groupName, cb) {

        var images = target.bgGroups[groupName],
            opts = target.options,
            version = opts.version ? '_' + opts.version : '',
            items = [];

        var spriteName = opts.spriteBaseName + version + '_' + groupName + '.png';

        for (var i = 0; i < images.length; i++) {
            var img = images[i];

            if (!img.skip){
                items.push({
                    'h': img.height + opts.spaceVertical,
                    'w': img.width + opts.spaceHorizontal,
                    'data': img
                });
            }
        }

        // nothing to sprite
        if (!items.length) {
            cb();
            return;
        }

        // Sort the items by their height
        items.sort(function (a, b) {
            if (b.h === a.h) return 0;
            return (b.h) > (a.h) ? 1 : -1;
        });

        // create packer
        var packer = packers[groupName],
            Clazz = packer.spriter;

        var sprtr = new Clazz(packer.spriteWidth, packer.spriteHeight);
        sprtr.fit(items);

        // Find the most negative x and y
        var minX = Infinity,
            minY = Infinity,
            maxY = 0,
            maxX = 0;

        items.forEach(function (item) {
            var coords = item;
            minX = Math.min(minX, coords.x);
            minY = Math.min(minY, coords.y);
        });

        // Offset each item by -minX, -minY; effectively resetting to 0, 0
        items.forEach(function (item) {
            var coords = item;
            coords.x -= minX;
            coords.y -= minY;

            if (!item.fit) return;

            maxY = Math.max(maxY, (item.fit.y + item.h));
            maxX = Math.max(maxX, (item.fit.x + item.w));
        });

        if (groupName === "x") maxX -= opts.spaceHorizontal;
        if (groupName === "y") maxY -= opts.spaceVertical;

        var _markup = '<html><body style="background: white;"><h1>'+spriteName+'</h1>'+maxX+'x'+maxY+'<h2 id="selected" style="position: absolute; top: 0px; left: 600px;"></h2><div style="position: relative; top: 40px; left: 20px;"><script>showImg = function (src, top) { var x = document.getElementById("selected"); x.innerHTML = src; x.style.top = top+"px";}</script>';

        var _imagesInfo = '<table border=1 cellspacing=0 cellpadding=3 style="float: right">';

        var _addImage = function (img) {
            _markup += '<img src="'+target.stylesDir+'/'+img.data.image+'" style="position: absolute; left: '+img.fit.x+'; top: '+img.fit.y+'; border: 1px solid red;" title="'+img.data.image+'" onclick="showImg(\''+img.data.image+'\', '+img.fit.y+');">';

            _imagesInfo += '<tr><td>' + img.data.image + '</td>' +
            '<td>' + img.data.width + '</td><td>' + img.data.height + '</td></tr>';
        };

        // create sprite
        var sprite = createSprite(packer.spriteWidth, packer.spriteHeight);

        var png;
        items.forEach(function(i, c) {
            if( i.fit ){
                var fit = i.fit;
                i.sprite = opts.spritePath + spriteName;

                png = gd.createFromPng(target.stylesDir + '/' + i.data.image);

                png.copy(sprite, fit.x, fit.y, 0, 0, png.width, png.height);

                target.images[i.data.image] = i;

                _addImage(i);
            }else{
                var errorMsg = 'Image "' + i.data.image + '" does not fit into sprite.' +
                'You will probably need to increase sprite size.';
                cb({msg: errorMsg});
            }
        });

        _markup += "</div>" + _imagesInfo + "</table></body></html>";

        if (grunt.option('debug')) grunt.file.write('_sprite_' + spriteName + '.html', _markup);

        // LOG
        _log = [];
        _log.push('height: ' + maxY);
        _log.push('width: ' + maxX);
        _log.push('TOTAL px: ' + (maxX * maxY));
        _log.push('----------');

        grunt.log.debug('\nsprite: ' + spriteName + '\n' + _log.join('\n'));

        if (opts.spriteDest) grunt.file.mkdir(opts.spriteDest);

        // create cropped sprite
        var finalSprite = createSprite(maxX,maxY);
        sprite.copy(finalSprite, 0, 0, 0, 0, maxX, maxY);
        finalSprite.savePng(opts.spriteDest + '/' + spriteName);

        cb();
    };

    var loadImage = function (item, cb) {
        gd.openPng(target.stylesDir + '/' + item.image, function(err, imageData) {
            if (err || !imageData){
                item.skip = true;
                cb();
                return;
            }

            // add size info
            item.width = imageData.width;
            item.height = imageData.height;

            cb();
        });
    };

    var markImage = function (item, cb) {
        var isIgnored = grunt.util._.contains(target.options.noSprite || target.options.skip, item.image);
        if ( isIgnored ) {
            item.skip = true;
        }

        // skip the no sprites
        if (item.comment && item.comment.match('no sprite')) {
            item.skip = true;
        }

        // skip duplicate definitions
        if (target.processed[item.image+item.comment] && !item.skip) {
            item.skip = true;
        }else{
            target.processed[item.image+item.comment] = true;
        }

        // skip positioned center or bottom
        if (item.align.match(/center|bottom/) && !item.skip) {
            item.skip = true;
        }

        // skip positioned by pxs
        if (item.align.match(/-?[0-9]+%|-?[0-9]+px/) && !item.skip) {
            item.skip = true;
            item.positioned = true;
        }

        // skip aligned right AND repeat
        if (item.align.match('repeat') && item.align.match('right') && !item.skip) {
            item.skip = true;
        }

        // skip inline images
        if (item.image.match('data:image')) {
            item.skip = true;
        }

        // skip the gifs
        if (item.image.match('gif') && !item.skip) {
            item.skip = true;
        }

        // mark right aligned images
        if (item.align.match('right') && !item.skip) {
            item.alignRight = true;
            item.skip = true;
        }

        // mark aligned images (X)
        if (item.align.match('repeat-x') && !item.skip) {
            item.repeat = 'x';
            item.marked = true;
            target.bgGroups.x.push(item);
        }

        // mark repeated images (Y)
        if (item.align.match('repeat-y') && !item.skip) {
            item.repeat = 'y';
            item.marked = true;
            target.bgGroups.y.push(item);
        }

        // group regular
        if (!item.marked && !item.skip) {
            item.marked = true;
            target.bgGroups.regular.push(item);
        }

        cb();
    };

    var createSprite = function (width, height) {
        var image = gd.createTrueColor(width, height);

        // set the transparency PNG
        image.saveAlpha(1);
        image.alphaBlending(0);
        image.colorAllocateAlpha(220, 220, 220, 127);

        // fill with transparent color
        var tlo = gd.trueColorAlpha(220, 220, 220, 127);
        image.fill(0, 0, tlo);

        return image;
    };

    var exports = {
        processFile: processFile,
        defaultOptions: {
            spaceVertical: 0,
            spaceHorizontal: 0
        }
    };

    return exports;
};