var fs = require('fs');

module.exports = function (bundle) {
  bundle.require('chromify/builtins/fs', {
    target: 'fs'
  });


  bundle.alias('_linklist', '/node_modules/_linklist');
  bundle.alias('cluster', '/node_modules/cluster');
  bundle.alias('dns', '/node_modules/dns');
  bundle.alias('freelist', '/node_modules/freelist');
  bundle.alias('http', '/node_modules/http');
  bundle.alias('net', '/node_modules/net');
  bundle.alias('timers', '/node_modules/timers');

  bundle.require('chromify/builtins/_linklist', {
    target: '/node_modules/_linklist'
  });
  bundle.require('chromify/builtins/cluster', {
    target: '/node_modules/cluster'
  });
  bundle.require('chromify/builtins/dns', {
    target: '/node_modules/dns'
  });
  bundle.require('chromify/builtins/__chromify_freelist', {
    target: '/node_modules/freelist'
  });
  bundle.require('chromify/builtins/http', {
    target: '/node_modules/http'
  });
  bundle.require('chromify/builtins/net', {
    target: '/node_modules/net'
  });
  bundle.require('chromify/builtins/timers', {
    target: '/node_modules/timers'
  });

  bundle.addEntry(__dirname + '/builtins/__chromify_process.js');

  bundle.append(fs.readFileSync(__dirname + '/dtrace.js'));
  bundle.append(fs.readFileSync(__dirname + '/buffer.js'));
}
