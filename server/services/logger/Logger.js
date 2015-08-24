/**
 * Currently using winston for logging.
 * @url https://github.com/winstonjs/winston
 *
 * LOG LEVELS FOR winston.conf.syslog:
 *    emerg   : 0,
 *    alert   : 1,
 *    crit    : 2,
 *    error   : 3,
 *    warning : 4,
 *    notice  : 5,
 *    info    : 6,
 *    debug   : 7
 */

'use strict';

var winston     = require('winston'),
    R           = require('ramda'),
    winstonConf = require('config').logging.winston;

var getTransportInstances = R.curry(function(winstonConf, transportConfig) {
  var transportConstructor = winstonConf.strategies[transportConfig.transportType];
  return new (transportConstructor)(transportConfig);
});

module.exports = new (winston.Logger)({
  transports : winstonConf.transports.map(getTransportInstances(winstonConf))
});
