'use strict';

var gulp     = require('gulp'),
    compile  = require('./gulpfiles/gulp-compile'),
    server   = require('./gulpfiles/gulp-server');

require('./gulpfiles/gulp-test');

// compile files from src/ to public/
// optionally accepts arg --production to compress and minify applicable files
gulp.task('compile',            compile.compilationTasks);
gulp.task('watch',              compile.watchForRecompilationTask);
gulp.task('clean-compiled',     compile.cleanCompilationFilesTask);

gulp.task('server',             server.autoRestartServerTask);
gulp.task('test-server',        server.autoRestartTestServerTask);

gulp.task('clean',    ['clean-compiled', 'clean-analysis']);
gulp.task('no-karma', ['compile', 'watch', 'server']);
gulp.task('default',  ['compile', 'watch', 'server', 'karma']);
