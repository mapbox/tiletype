var tiletype = require('..');
var assert = require('assert');
var tape = require('tape');
var path = require('path');
var fs = require('fs');

var files = {
    'jpg': fs.readFileSync(__dirname + '/fixtures/0.jpeg'),
    'png': fs.readFileSync(__dirname + '/fixtures/0.png'),
    'gif': fs.readFileSync(__dirname + '/fixtures/0.gif'),
    'pbf': fs.readFileSync(__dirname + '/fixtures/0.vector.pbf'),
    'unknown': fs.readFileSync(__dirname + '/fixtures/unknown.txt'),
};

tape('type', function(t) {
    t.plan(5);
    t.equal('jpg', tiletype.type(files.jpg));
    t.equal('png', tiletype.type(files.png));
    t.equal('gif', tiletype.type(files.gif));
    t.equal('pbf', tiletype.type(files.pbf));
    t.equal(false, tiletype.type(files.unknown));
});

tape('headers', function(t) {
    t.plan(5);
    t.deepEqual({'Content-Type':'image/jpeg'}, tiletype.headers('jpg'));
    t.deepEqual({'Content-Type':'image/png'}, tiletype.headers('png'));
    t.deepEqual({'Content-Type':'image/gif'}, tiletype.headers('gif'));
    t.deepEqual({'Content-Type':'application/x-protobuf','Content-Encoding':'deflate'}, tiletype.headers('pbf'));
    t.deepEqual({}, tiletype.headers(false));
});
