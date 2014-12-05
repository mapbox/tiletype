#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var tiletype = require('..').type;

var args = process.argv.slice(2);
var filepath = args.shift();
filepath = filepath ? path.resolve(filepath) : '';

fs.readFile(filepath, function(err, buf) {
  if (err) {
    console.error(err.toString());
    process.exit(1);
  }
  if (!tiletype(buf)) {
    console.error('Could not determine tile type');
    process.exit(3);
  }
  console.log(tiletype(buf));
});
