'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.spriter = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/styles/all-sprited.css');
    var expected = grunt.file.read('test/expected/all-sprited.css');
    test.equal(actual, expected, 'sprited all target');

    test.done();
  },
  multiple: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/styles/multiple-sprited.css');
    var expected = grunt.file.read('test/expected/multiple-sprited.css');
    test.equal(actual, expected, 'sprited multiple target');

    test.done();
  },
  with_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/styles/withOptions-sprited.css');
    var expected = grunt.file.read('test/expected/withOptions-sprited.css');
    test.equal(actual, expected, 'sprited with_options target');

    test.done();
  }
};
