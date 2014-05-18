module.exports = {};
module.exports.type = type;
module.exports.headers = headers;

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
    } else if (buffer[0] == 0x78 && buffer[1] == 0x9C) {
        return 'pbf';
    }
    return false;
}

function headers(ext) {
    var head = {};
    switch (ext) {
    case 'pbf':
        head['Content-Type'] = 'application/x-protobuf';
        head['Content-Encoding'] = 'deflate';
        break;
    case 'jpg':
        head['Content-Type'] = 'image/jpeg';
        break;
    case 'png':
        head['Content-Type'] = 'image/png';
        break;
    case 'gif':
        head['Content-Type'] = 'image/gif';
        break;
    }
    return head;
}

