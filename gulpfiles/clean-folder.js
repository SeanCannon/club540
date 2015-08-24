'use strict';

var gulp       = require('gulp'),
    del        = require('del'),
    vinylPaths = require('vinyl-paths');

var cleanFolder = function(folder) {
  gulp.src(folder, {read : false}).pipe(vinylPaths(del));
};

var makeCleanFolderTask = function(folder) {
  return function() {
    cleanFolder(folder);
  };
};

module.exports = {
  makeCleanFolderTask : makeCleanFolderTask
};
