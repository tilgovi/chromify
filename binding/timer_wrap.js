exports.Timer = Timer;


function Timer() {
  var self = this
  , _active = false
  , _repeat = -1
  , _timeout = 0
  , _timer = null
  , _interval = null
  ;

  function _onTimeout() {
    if (_timer) {
      _timer = null;
    }

    if (_interval) {
      // Do nothing -- already set
    } else if(_repeat > 0) {
      _interval = setInterval(_onTimeout.bind(this), _repeat);
    } else {
      _active = false;
    }
  }

  this.close = function () {
    // not necessary without an underlying libuv timer
  }

  this.start = function (timeout, repeat) {
    _timeout = timeout;
    _repeat = repeat;

    _active = setTimeout(_onTimeout.bind(this), _timeout);
  };

  this.stop = function () {
    if (_timer) {
      cancelTimeout(_timer);
      _timer = null;
    }

    if (_interval) {
      cancelInterval(_interval);
      _interval = null;
    }

    _active = false;
  };

  this.again = function () {
    if (!_active) {
      return false;
    }

    this.stop();

    _interval = setInterval(_onTimeout.bind(this), _repeat);
    _active = true;
  };

  this.setRepeat = function (repeat) {
    _repeat = repeat;
  };

  this.getRepeat = function () {
    return _repeat;
  }
}
