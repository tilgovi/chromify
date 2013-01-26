var util = require('util')
, net = require('net')

exports.TCP = TCP;

// Initialize some globals
var socket = chrome.socket || chrome.experimental.socket;
var dns = chrome.experimental.dns;


function TCP(fd) {
  var self = this
  , _addr = '127.0.0.1'
  , _port = 0
  , _bound = false
  , _created = (typeof fd == 'number' && fd != -1)
  , _listen = false
  , bufferedReads = []
  , pendingWrites = 0
  ;

  function noop() {}

  function _onAccept(clientInfo) {
    socket.accept(fd, _onAccept.bind(this));
    this.onconnection.call(this, new TCP(clientInfo.socketId));
  }

  function _onRead(readInfo) {
    if (this.socket._paused) {
      bufferedReads.push(readInfo);
    } else if (readInfo.resultCode > 0) {
      if (typeof this.onread == 'function') {
        this.onread(new Uint8Array(readInfo.data), 0, readInfo.data.byteLength);
      }
      this.readStart();
    } else { // XXX: interpret these errors appropriately
      errno = 'EOF';  // Not necessarily
      if (typeof this.onread == 'function') {
        this.onread(0, null);
      }
    }
  }

  if (_created) {
    this.fd = fd;
  } else {
    socket.create('tcp', {}, function (createInfo) {
      if (createInfo.socketId > 0) {
        _created = true;
        this.fd = fd = createInfo.socketId;
        if (_listen) {
          self.listen();
        }
      } else {
        console.log('Unable to create socket');
      }
    });
  }

  this.bind = this.bind6 = function (addr, port) {
    if (_bound) {
      console.log('Attempted bind on already bound socket');
    }
    // XXX ignore bind address
    console.log('FIXME: ignoring bind address: using 127.0.0.1');
    _addr = '127.0.0.1';
    _port = port;
    _bound = true;
  };

  this.close = function () {
    if (fd) {
      socket.destroy(fd);
      this.fd = fd = -1;
    }
  }

  this.listen = function (backlog) {
    _listen = true;

    if (typeof backlog != 'undefined') {
      backlog = backlog;
    }

    if (_created) {
      socket.listen(fd, _addr, _port, backlog, function (resultCode) {
        if (resultCode == 0) {
          socket.accept(fd, _onAccept.bind(self));
        } else {
          console.log('Unable to listen on socket:', resultCode);
        }
      });
    }
  };

  this.readStart = function () {
    if (bufferedReads.length) {
      process.nextTick(_onRead.bind(this, bufferedReads.shift()));
    } else {
      socket.read(fd, null, _onRead.bind(this));
    }
  }

  this.readStop = noop;

  this.write = function (data) {
    var writeReq = {}
    , buf = writeReq['buffer'] = new Uint8Array(data.length);

    for (var i = 0 ; i < data.length ; i++) {
      buf[i] = data.parent[i + data.offset];
    }

    this.writeQueueSize = ++pendingWrites;
    socket.write(fd, buf.buffer, function (writeInfo) {
      this.writeQueueSize = --pendingWrites;
      if (writeInfo.bytesWritten) {
        if (typeof writeReq.oncomplete == 'function') {
          writeReq.oncomplete(0, self, writeReq, data);
        }
      }
    });

    return writeReq;
  }
};
