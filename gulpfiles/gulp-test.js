'use strict';

var gulp  = require('gulp');
var shell = require('gulp-shell');

gulp.task('jasmine', shell.task(['./node_modules/.bin/jasmine --junitreport --forceexit']));
