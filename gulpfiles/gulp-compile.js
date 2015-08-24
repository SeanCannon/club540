'use strict';

var gulp        = require('gulp'),
    less        = require('gulp-less'),
    concat      = require('gulp-concat'),
    exclude     = require('gulp-ignore').exclude,
    ngHtml2Js   = require('gulp-ng-html2js'),
    argv        = require('yargs').argv,
    uglify      = require('gulp-uglify'),
    gulpif      = require('gulp-if'),
    scripts     = require('./scripts'),
    styles      = require('./styles'),
    cleanFolder = require('./clean-folder');

var sourceScripts = scripts.source;
var vendorScripts = scripts.vendor;
var vendorStyles  = styles.vendor;

var lessFiles = [
  './client/assets/less/style.less'
];

var publicDest = function(optSubdir) {
  var suffix  = optSubdir ? '/' + optSubdir : '';
  var destDir = './dist' + suffix;
  return gulp.dest(destDir);
};

var publicRootDest = function() {
  return publicDest();
};
var publicJsDest   = function() {
  return publicDest('assets/js');
};
var publicCssDest  = function() {
  return publicDest('assets/css');
};
var publicImageDest  = function() {
  return publicDest('assets/images');
};
var publicVideoDest  = function() {
  return publicDest('assets/video');
};
var ifGulpProd = function(stream, optNonProdStream) {
  return gulpif(argv.production, stream, optNonProdStream);
};

var uglifyProdJs = function() {
  return ifGulpProd(uglify({
    output : {
      beautify   : false,
      ascii_only : true
    }
  }));
};

var compressProdLess = function() {
  return ifGulpProd(less({compress : true}), less());
};

var renameTemplate = function(fileUrl) {
  return fileUrl.replace('.tpl.html', '.html');
};

var transformTemplates = function(templateModuleName) {
  return ngHtml2Js({
    moduleName : templateModuleName,
    rename     : renameTemplate
  });
};

var templateConfigs = {
  app : {
    sources      : './views/**/*.jade',
    moduleName   : 'templates-app',
    destFileName : 'templates-app.js'
  }
};

var templateCompilationTask = function(templateConfig) {
  return function() {
    return gulp.src(templateConfig.sources)
        .pipe(transformTemplates(templateConfig.moduleName))
        .pipe(concat(templateConfig.destFileName))
        .pipe(publicRootDest());
  };
};

var compilationTasks = [
  'scripts',
  'vendor-scripts',
  'vendor-styles',
  'less',
  'images',
  'video',
  //'views',
  'html2js'
];

var watchForRecompilationTask = function() {
  gulp.watch('./client/assets/**/*.less', ['less']);
  gulp.watch('./client/assets/**/*.js', ['scripts']);
  gulp.watch('./views/**/*.jade', ['views']);
  gulp.watch('./client/assets/images/**/*', ['images']);
  gulp.watch(['./views/**/*.jade'], ['html2js']);
};

var cleanCompilationFilesTask = cleanFolder.makeCleanFolderTask('./dist');

var buildScripts = function() {
  return gulp.src(sourceScripts)
      .pipe(exclude('/**/*Spec.js'))
      .pipe(concat('main.js'))
      .pipe(uglifyProdJs())
      .pipe(publicJsDest());
};

var compileVendorScriptsToPublicDirectory = function() {
  return gulp.src(vendorScripts)
      .pipe(concat('vendor.js'))
      .pipe(publicJsDest());
};

var compileVendorStylesToPublicDirectory = function() {
  return gulp.src(vendorStyles)
      .pipe(concat('vendor.css'))
      .pipe(publicCssDest());
};

var compileLessToPublicCssDirectory = function() {
  return gulp.src(lessFiles)
      .pipe(compressProdLess())
      .pipe(publicCssDest());
};

var copyAllImagesToPublicDirectory = function() {
  return gulp.src('./client/assets/images/**/*')
      .pipe(publicImageDest());
};

var copyAllVideosToPublicDirectory = function() {
  return gulp.src('./client/assets/video/**/*')
    .pipe(publicVideoDest());
};
gulp.task('scripts', buildScripts);

gulp.task('vendor-scripts', compileVendorScriptsToPublicDirectory);
gulp.task('vendor-styles', compileVendorStylesToPublicDirectory);

gulp.task('less', compileLessToPublicCssDirectory);
gulp.task('images', copyAllImagesToPublicDirectory);
gulp.task('video', copyAllVideosToPublicDirectory);
//gulp.task('views', copyViewsToPublicDirectory);

gulp.task('html2js', templateCompilationTask(templateConfigs.app));

module.exports = {
  compilationTasks          : compilationTasks,
  watchForRecompilationTask : watchForRecompilationTask,
  cleanCompilationFilesTask : cleanCompilationFilesTask
};
