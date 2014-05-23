var tiletype = require('..');
var assert = require('assert');
var tape = require('tape');
var path = require('path');
var fs = require('fs');

var files = {
    'jpg': fs.readFileSync(__dirname + '/fixtures/0.jpeg'),
    'png': fs.readFileSync(__dirname + '/fixtures/0.png'),
    'gif': fs.readFileSync(__dirname + '/fixtures/0.gif'),
    'webp': fs.readFileSync(__dirname + '/fixtures/0.webp'),
    'pbf': fs.readFileSync(__dirname + '/fixtures/0.vector.pbf'),
    'unknown': fs.readFileSync(__dirname + '/fixtures/unknown.txt'),
};

tape('type', function(t) {
    t.plan(6);
    t.equal('jpg', tiletype.type(files.jpg));
    t.equal('png', tiletype.type(files.png));
    t.equal('gif', tiletype.type(files.gif));
    t.equal('webp', tiletype.type(files.webp));
    t.equal('pbf', tiletype.type(files.pbf));
    t.equal(false, tiletype.type(files.unknown));
});

tape('headers', function(t) {
    t.plan(6);
    t.deepEqual({'Content-Type':'image/jpeg'}, tiletype.headers('jpg'));
    t.deepEqual({'Content-Type':'image/png'}, tiletype.headers('png'));
    t.deepEqual({'Content-Type':'image/gif'}, tiletype.headers('gif'));
    t.deepEqual({'Content-Type':'image/webp'}, tiletype.headers('webp'));
    t.deepEqual({'Content-Type':'application/x-protobuf','Content-Encoding':'deflate'}, tiletype.headers('pbf'));
    t.deepEqual({}, tiletype.headers(false));
});

tape('dimensions', function(t) {
    t.plan(8);
    t.deepEqual([256,256], tiletype.dimensions(files.png));
    t.deepEqual([640,400], tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/png-640x400.png')));
    t.deepEqual([256,256], tiletype.dimensions(files.jpg));
    t.deepEqual([640,400], tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/jpg-640x400.jpg')));
    t.deepEqual([256,256], tiletype.dimensions(files.gif));
    t.deepEqual([990,1050], tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/gif-990x1050.gif')));
    t.deepEqual([256,256], tiletype.dimensions(files.webp));
    t.deepEqual([550,368], tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/webp-550x368.webp')));
});
