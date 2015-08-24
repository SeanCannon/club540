// This config file is pulled in when we run `npm test`
'use strict';

var winston     = require('winston'),
    loggerUtils = require('alien-node-winston-utils');

module.exports = {

  server : {
    // Ports on which to run node instances. Should be n-1 instances, where n is the number of cores.
    enabledPorts : [3000]
  },

  mysql : {
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'club540'
  },

  redis : {
    host     : 'localhost',
    port     : 6379,
    password : ''
  },

  logging : {
    winston : {
      transports : [
        {
          name          : 'console',
          level         : 'debug',
          timestamp     : loggerUtils.getDateString,
          colorize      : true,
          transportType : 'console'
        }
      ],
      strategies : {
        console : winston.transports.Console
      }
    }
  },

  errors : {}
};
