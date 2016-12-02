# tiletype

[![build status](https://secure.travis-ci.org/mapbox/tiletype.png)](http://travis-ci.org/mapbox/tiletype)
[![Coverage Status](https://coveralls.io/repos/mapbox/tiletype/badge.svg?branch=coverage&service=github)](https://coveralls.io/github/mapbox/tiletype?branch=coverage)

detect common map tile formats from a buffer


### `type(buffer)`

Given a buffer of unknown data, return either a format as an extension
string or false if the type cannot be determined.

Potential options are:

* png
* pbf
* jpg
* webp


### Parameters

| parameter | type   | description |
| --------- | ------ | ----------- |
| `buffer`  | Buffer | input       |



**Returns** `String,boolean`, identifier


### `headers(buffer)`

Return headers - Content-Type and Content-Encoding -
for a response containing this kind of image.


### Parameters

| parameter | type   | description |
| --------- | ------ | ----------- |
| `buffer`  | Buffer | input       |



**Returns** `Object`, headers


### `dimensions(buffer, dimensions)`

Determine the width and height of an image contained in a buffer,
returned as a [x, y] array.


### Parameters

| parameter    | type           | description |
| ------------ | -------------- | ----------- |
| `buffer`     | Buffer         | input       |
| `dimensions` | Array\,boolean |             |


## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install @mapbox/tiletype
```

## Tests

```sh
$ npm test
```


