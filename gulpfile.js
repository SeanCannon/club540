'use strict';

var R        = require('ramda'),
    gulp     = require('gulp'),
    compile  = require('./gulpfiles/gulp-compile'),
    server   = require('./gulpfiles/gulp-server'),
    argv     = require('yargs').argv;

require('./gulpfiles/gulp-test');

// compile files from src/ to public/
// optionally accepts arg --production to compress and minify applicable files
gulp.task('compile',            compile.compilationTasks);
gulp.task('watch',              compile.watchForRecompilationTask);
gulp.task('clean-compiled',     compile.cleanCompilationFilesTask);

gulp.task('server',             server.autoRestartServerTask);
gulp.task('test-server',        server.autoRestartTestServerTask);

gulp.task('clean',    ['clean-compiled']);
gulp.task('default',  ['compile', 'watch', 'server']);
