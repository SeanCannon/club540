'use strict';

var gulp    = require('gulp');
var karma   = require('gulp-karma');
var shell   = require('gulp-shell');
var argv    = require('yargs').argv;
var scripts = require('./scripts');

var sourceScripts = scripts.source;
var testScripts   = scripts.mocks;
var vendorScripts = scripts.vendor;

gulp.task('karma', function() {
  var action = argv.singleRun ? 'run' : 'watch';

  gulp.src(vendorScripts.concat(testScripts, sourceScripts))
      .pipe(karma({
        configFile : 'karma.conf.js',
        action     : action
      }));
});

gulp.task('jasmine', shell.task(['./node_modules/.bin/jasmine --junitreport --forceexit']));
