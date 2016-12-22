module.exports = {};
module.exports.type = type;
module.exports.headers = headers;
module.exports.dimensions = dimensions;

/**
 * Given a buffer of unknown data, return either a format as an extension
 * string or false if the type cannot be determined.
 *
 * Potential options are:
 *
 * * png
 * * pbf
 * * jpg
 * * webp
 *
 * @param {Buffer} buffer input
 * @returns {String|boolean} identifier
 */
function type(buffer) {
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E &&
        buffer[3] === 0x47 && buffer[4] === 0x0D && buffer[5] === 0x0A &&
        buffer[6] === 0x1A && buffer[7] === 0x0A) {
        return 'png';
    } else if (buffer[0] === 0xFF && buffer[1] === 0xD8 &&
        buffer[buffer.length - 2] === 0xFF && buffer[buffer.length - 1] === 0xD9) {
        return 'jpg';
    } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 &&
        buffer[3] === 0x38 && (buffer[4] === 0x39 || buffer[4] === 0x37) &&
        buffer[5] === 0x61) {
        return 'gif';
    } else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return 'webp';
    // deflate: recklessly assumes contents are PBF.
    } else if (buffer[0] === 0x78 && buffer[1] === 0x9C) {
        return 'pbf';
    // gzip: recklessly assumes contents are PBF.
    } else if (buffer[0] === 0x1F && buffer[1] === 0x8B) {
        return 'pbf';
    }
    return false;
}

/**
 * Return headers - Content-Type and Content-Encoding -
 * for a response containing this kind of image.
 *
 * @param {Buffer} buffer input
 * @returns {Object} headers
 */
function headers(buffer) {
    var head = {};
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E &&
        buffer[3] === 0x47 && buffer[4] === 0x0D && buffer[5] === 0x0A &&
        buffer[6] === 0x1A && buffer[7] === 0x0A) {
        head['Content-Type'] = 'image/png';
    } else if (buffer[0] === 0xFF && buffer[1] === 0xD8 &&
        buffer[buffer.length - 2] === 0xFF && buffer[buffer.length - 1] === 0xD9) {
        head['Content-Type'] = 'image/jpeg';
    } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 &&
        buffer[3] === 0x38 && (buffer[4] === 0x39 || buffer[4] === 0x37) &&
        buffer[5] === 0x61) {
        head['Content-Type'] = 'image/gif';
    } else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        head['Content-Type'] = 'image/webp';
    // deflate: recklessly assumes contents are PBF.
    } else if (buffer[0] === 0x78 && buffer[1] === 0x9C) {
        head['Content-Type'] = 'application/x-protobuf';
        head['Content-Encoding'] = 'deflate';
    // gzip: recklessly assumes contents are PBF.
    } else if (buffer[0] === 0x1F && buffer[1] === 0x8B) {
        head['Content-Type'] = 'application/x-protobuf';
        head['Content-Encoding'] = 'gzip';
    }
    return head;
}

/**
 * Determine the width and height of an image contained in a buffer,
 * returned as a [x, y] array.
 *
 * @param {Buffer} buffer input
 * @returns {Array<number>|boolean} dimensions
 */
function dimensions(buffer) {
    var mp28 = Math.pow(2,8);
    switch (type(buffer)) {
    case 'png':
        var i = 8;
        while (i < buffer.length) {
            var length = buffer.readUInt32BE(i);
            var chunktype = buffer.toString('ascii', i + 4, i + 8);
            // Invalid chunk.
            if (!(length || chunktype === 'IEND')) return false;
            // Length + type.
            i += 8;
            if (chunktype === 'IHDR') {
                var w = (buffer[i+0]*Math.pow(2,32)) + (buffer[i+1]*Math.pow(2,16)) + (buffer[i+2]*Math.pow(2,8)) + buffer[i+3];
                var h = (buffer[i+4]*Math.pow(2,32)) + (buffer[i+5]*Math.pow(2,16)) + (buffer[i+6]*Math.pow(2,8)) + buffer[i+7];
                return [w,h];
            }
            // Skip CRC.
            i += length + 4;
        }
        break;
    case 'jpg':
        var i = 2;
        while (i < buffer.length) {
            // Invalid chunk.
            if (buffer[i] !== 0xff) return false;
            var chunktype = buffer[i+1];
            var length = (buffer[i+2]*mp28) + (buffer[i+3]);
            // Entropy-encoded begins after this chunk. Bail.
            if (chunktype === 0xda) {
                return false;
            } else if (chunktype === 0xc0) {
                var h = (buffer[i+5]*Math.pow(2,8)) + buffer[i+6];
                var w = (buffer[i+7]*Math.pow(2,8)) + buffer[i+8];
                return [w,h];
            }
            i += 2 + length;
        }
        break;
    case 'gif':
        var w = (buffer[7]*Math.pow(2,8)) + buffer[6];
        var h = (buffer[9]*Math.pow(2,8)) + buffer[8];
        return [w,h];
        break;
    case 'webp':
        var chunktype = buffer.toString('ascii', 12, 16);
        if (chunktype === 'VP8 ') {
            // Invalid chunk.
            if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) return false;
            var w = buffer[26] | (buffer[27] << 8);
            var h = buffer[28] | (buffer[29] << 8);
            return [w,h];
        }
        else if (chunktype === 'VP8L') {
            var w = 1 + (buffer[21] | (buffer[22] & 0x3F) << 8);
            var h = 1 + (((buffer[22] & 0xC0) >> 6) | (buffer[23] << 2) | ((buffer[24] & 0xF) << 10));
            return [w,h];
        }
        else  if (chunktype === 'VP8X') {
            var w = 1 + (buffer[24] | buffer[25] << 8 | buffer[26] << 16);
            var h = 1 + (buffer[27] | buffer[28] << 8 | buffer[29] << 16);

            return [w,h];
        }
        return false;
        break;
    }
    return false;
}

