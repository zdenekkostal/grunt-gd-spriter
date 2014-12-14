'use strict';

var grunt   = require('grunt');
var gd      = require('node-gd');
var expect  = require('expect.js');
var config  = require('../config');
var spriter = require('../tasks/lib/spriter').init(grunt);

var _sprite = function (key, cb) {
    var opts = grunt.util._.merge({}, spriter.defaultOptions, config.spriter[key].options);
    spriter.processFile(config.spriter[key], opts, cb);
};

describe('Spriter', function() {
    it('should sprite', function(done) {
        _sprite('all', function () {
            var actual = grunt.file.read('tmp/styles/all-sprited.css');
            var expected = grunt.file.read('test/expected/all-sprited.css');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should sprite from multiple sources', function(done) {
        _sprite('multiple', function () {
            var actual = grunt.file.read('tmp/styles/multiple-sprited.css');
            var expected = grunt.file.read('test/expected/multiple-sprited.css');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should sprite with correct spaces', function(done) {
        _sprite('customSpaces', function () {
            var actual = grunt.file.read('tmp/styles/withOptions-sprited.css');
            var expected = grunt.file.read('test/expected/withOptions-sprited.css');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should sprite when version is specified', function(done) {
        _sprite('version', function () {
            var actual = grunt.file.read('tmp/styles/version-sprited.css');
            var expected = grunt.file.read('test/expected/version-sprited.css');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should compute sprite size for y sprite', function(done) {
        _sprite('repeat', function () {
            gd.openPng('tmp/sprites/repeat-sprited_y.png', function(err, imageData) {
                expect(imageData.width).to.eql(33);
                expect(imageData.height).to.eql(200);
                done();
            });
        });
    });

    it('should compute sprite size for x sprite', function(done) {
        _sprite('repeat', function () {
            gd.openPng('tmp/sprites/repeat-sprited_x.png', function(err, imageData) {
                expect(imageData.width).to.eql(10);
                expect(imageData.height).to.eql(30);
                done();
            });
        });
    });

    it('should sprite when custom regEx is specified', function(done) {
        _sprite('customRegex', function () {
            var actual = grunt.file.read('tmp/styles/regex-sprited.css');
            var expected = grunt.file.read('test/expected/regex-sprited.css');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should be able to sprite minified file', function(done) {
        _sprite('minified', function () {
            var actual = grunt.file.read('tmp/styles/minified-sprited.css');
            var expected = grunt.file.read('test/expected/minified-sprited.css');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should be able to set sprite max size', function(done) {
        _sprite('spriteSize', function (returnValue) {
            expect(returnValue).to.be(false);
            done();
        });
    });
});
