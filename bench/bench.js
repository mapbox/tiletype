var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var assert = require('assert');
var tiletype = require('..');
var fs = require('fs');
var data = fs.readFileSync(__dirname + '/../test/fixtures/0.vector.pbf');

suite.add('tiletype.type', function() {
    assert.equal('pbf', tiletype.type(data));
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.run();
