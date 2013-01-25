var _binding = process.binding
process.binding = function (name) {
  if (name == 'cares_wrap') {
    return require('../binding/cares_wrap');
  } else if (name == 'http_parser') {
    return require('../binding/http_parser');
  } else if (name == 'timer_wrap') {
    return require('../binding/timer_wrap');
  } else if (name == 'tcp_wrap') {
    return require('../binding/tcp_wrap');
  } else {
    return _binding(name);
  }
}
