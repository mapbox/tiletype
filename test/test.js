var tiletype = require('..');
var assert = require('assert');
var tape = require('tape');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var cmd = path.resolve(__dirname, '..', 'bin', 'tiletype.js');

var files = {
    'jpg': fs.readFileSync(__dirname + '/fixtures/0.jpeg'),
    'png': fs.readFileSync(__dirname + '/fixtures/0.png'),
    'gif': fs.readFileSync(__dirname + '/fixtures/0.gif'),
    'webp': fs.readFileSync(__dirname + '/fixtures/0.webp'),
    'pbf': fs.readFileSync(__dirname + '/fixtures/0.vector.pbf'),
    'pbfz': fs.readFileSync(__dirname + '/fixtures/0.vector.pbfz'),
    'unknown': fs.readFileSync(__dirname + '/fixtures/unknown.txt'),
    'webpLossless': fs.readFileSync(__dirname + '/fixtures/tux.webp'),
    'webpExtended': fs.readFileSync(__dirname + '/fixtures/tux_alpha.webp')
};

tape('type', function(t) {
    t.equal('jpg', tiletype.type(files.jpg), 'jpg');
    t.equal('png', tiletype.type(files.png), 'png');
    t.equal('gif', tiletype.type(files.gif), 'gif');
    t.equal('webp', tiletype.type(files.webp), 'webp');
    t.equal('webp', tiletype.type(files.webpLossless), 'webpLossless');
    t.equal('webp', tiletype.type(files.webpExtended), 'webpExtended');
    t.equal('pbf', tiletype.type(files.pbf), 'pbf');
    t.equal('pbf', tiletype.type(files.pbfz), 'pbf');
    t.equal(false, tiletype.type(files.unknown));
    t.end();
});

tape('headers', function(t) {
    t.deepEqual({'Content-Type':'image/jpeg'}, tiletype.headers(files.jpg));
    t.deepEqual({'Content-Type':'image/png'}, tiletype.headers(files.png));
    t.deepEqual({'Content-Type':'image/gif'}, tiletype.headers(files.gif));
    t.deepEqual({'Content-Type':'image/webp'}, tiletype.headers(files.webp));
    t.deepEqual({'Content-Type':'application/x-protobuf','Content-Encoding':'deflate'}, tiletype.headers(files.pbf));
    t.deepEqual({'Content-Type':'application/x-protobuf','Content-Encoding':'gzip'}, tiletype.headers(files.pbfz));
    t.deepEqual({}, tiletype.headers(false));
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

    t.deepEqual([386,395], tiletype.dimensions(files.webpLossless));
    t.deepEqual([386,395], tiletype.dimensions(files.webpExtended));
    t.end();
});

tape('executable: success', function(t) {
    exec(cmd + ' ' + path.resolve(__dirname + '/fixtures/0.vector.pbf'), function(err, stdout, stderr) {
        t.ifError(err, 'detected');
        t.equal(stdout, 'pbf\n', 'determined type');
        t.notOk(stderr, 'no stderr');
        t.end();
    });
});

tape('executable: unknown', function(t) {
    exec(cmd + ' ' + path.resolve(__dirname + '/fixtures/unknown.txt'), function(err, stdout, stderr) {
        t.equal(err.code, 3, 'exit 3');
        t.notOk(stdout, 'no stdout');
        t.equal(stderr, 'Could not determine tile type\n', 'expected stderr');
        t.end();
    });
});

tape('executable: no file', function(t) {
    exec(cmd, function(err, stdout, stderr) {
        t.equal(err.code, 1, 'exit 1');
        t.notOk(stdout, 'no stdout');
        t.ok(stderr === 'Error: ENOENT, open \'\'\n' ||
             stderr === 'Error: ENOENT: no such file or directory, open \'\'\n', 'expected stderr');
        t.end();
    });
});
