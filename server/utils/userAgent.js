'use strict';

var getBrowserClass = function(ua) {

  var browserClass = '',
      ie = ua.indexOf('msie') !== -1;

  if (ie) {
    browserClass = 'ie';

    if (ua.indexOf('msie 7') !== -1) {
      browserClass += ' ie7';
    } else if (ua.indexOf('msie 8') !== -1) {
      browserClass += ' ie8';
    } else if (ua.indexOf('msie 9') !== -1) {
      browserClass += ' ie9';
    } else if (ua.indexOf('msie 10') !== -1) {
      browserClass += ' ie10';
    } else if (ua.indexOf('msie 11') !== -1) {
      browserClass += ' ie11';
    }

  } else {
    if (ua.indexOf('chrome') !== -1) {
      browserClass = 'chrome';
    }
    if (ua.indexOf('firefox') !== -1) {
      browserClass = 'ff';
    }
    if (ua.indexOf('safari') !== -1) {
      browserClass = 'safari';
    }
  }

  return browserClass;

};

module.exports = {
  getBrowserClass : getBrowserClass
};
