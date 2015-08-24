'use strict';

var nodemon = require('gulp-nodemon'),
    R       = require('ramda');

var logServerRestart = function() {
  console.log('Server restarted.');
};

var nodemonServerTask = function(config) {
  return function() {
    nodemon(config).on('restart', logServerRestart);
  };
};

var nodemonServerConfig = {
  script : './server/server.js'
};

var testServerEnv = {
  NODE_ENV : 'test'
};

var nodemonTestServerConfig = R.merge(nodemonServerConfig, {
  env : testServerEnv
});

var autoRestartServerTask     = nodemonServerTask(nodemonServerConfig);
var autoRestartTestServerTask = nodemonServerTask(nodemonTestServerConfig);

module.exports = {
  autoRestartServerTask     : autoRestartServerTask,
  autoRestartTestServerTask : autoRestartTestServerTask
};
