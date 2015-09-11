'use strict';

var winston     = require('winston'),
    loggerUtils = require('alien-node-winston-utils');

module.exports = {

  port : 3000, // TODO this isnt setup for nginx yet

  server : {
    // Ports on which to run node instances. Should be n-1 instances, where n is the number of cores.
    enabledPorts : [3000]
  },

  mysql : {
    connectionLimit : 10,
    host            : 'localhost',
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASS,
    database        : 'club540'
  },

  //    // Email configuration
  //    email        : {
  //        smtp : {
  //            host     : "smtp.mailgun.org",
  //            port     : 465,
  //            sender   : "noreply@playlist.com",
  //            username : "postmaster@playlist.com",
  //            password : "Playlist123"
  //        }
  //    },

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
        // TODO: allow parallel logging strategies
        // using this strategy will disable console logging of errors
        // {
        //   name             : 'file',
        //   level            : 'debug',
        //   timestamp        : loggerUtils.getTimestamp,
        //   colorize         : true,
        //   transportType    : 'file',
        //   filename         : 'logs/activity.log',
        //   json             : false, // required for formatter to work
        //   formatter        : loggerUtils.getFormatter,
        //   handleExceptions : true,
        //   datePattern      : '.yyyy-MM-dd' // dictates how logs are rotated - more specific pattern rotates more often
        // }
      ],
      strategies : {
        console : winston.transports.Console,
        file    : winston.transports.DailyRotateFile
      }
    }
  },

  errors : {
    db : {
      NO_RESULTS : {
        code    : 6000,
        message : 'No results'
      }
    }
  }
};
