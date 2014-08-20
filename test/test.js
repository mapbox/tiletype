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

tape('contentType', function(t) {
    t.equal('image/jpeg', tiletype.contentType(files.jpg));
    t.equal('image/png', tiletype.contentType(files.png));
    t.equal('image/gif', tiletype.contentType(files.gif));
    t.equal('image/webp', tiletype.contentType(files.webp));
    t.equal('application/x-protobuf', tiletype.contentType(files.pbf));
    t.equal(undefined, tiletype.contentType(files.unknown));
    t.end();
});

tape('dimensions', function(t) {
    t.deepEqual([256,256], tiletype.dimensions(files.png));
    t.deepEqual([640,400], tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/png-640x400.png')));
    t.deepEqual([256,256], tiletype.dimensions(files.jpg));
    t.deepEqual([640,400], tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/jpg-640x400.jpg')));
    t.deepEqual([256,256], tiletype.dimensions(files.gif));
    t.deepEqual([990,1050], tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/gif-990x1050.gif')));
    t.deepEqual([256,256], tiletype.dimensions(files.webp));
    t.deepEqual([550,368], tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/webp-550x368.webp')));
    t.end();
});
