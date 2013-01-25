var Buffer = require('buffer').Buffer;

// MEGA HACK -- only here for PouchDB to access mime.types via emscripten
exports.readFileSync = function (path) {
  var obj = Module['FS_findObject'](path);
  if (obj.read) {
    return (new Buffer(obj.contents)).toString();
  } else {
    throw new Error('Unreadable path: ' + path);
  }
}
