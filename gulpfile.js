'use strict';

var gulp = require('gulp');
var config = require('./gulp.config');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var plumber = require('gulp-plumber');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Task for checking code quality.
gulp.task('code-quality', function() {
    log('Checking code quality');

    return gulp.src(config.js)
        .pipe(jscs()) // check code style
        .pipe(jshint()) // check code conventions
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jshint.reporter('fail'));
});

// Task for compiling less to CSS and adding vendor prefixes
gulp.task('styles-less', ['styles-clean'], function() {
    log('Compiling Less --> CSS');

    return gulp.src(config.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.temp));
});

// Deletes css files from temp directory
gulp.task('styles-clean', function(done) {
    log('Cleaning out styles from temp');
    var files = config.temp + '**/*.css';
    del(files);
    done();
});

// Task for injecting vendor css and js into index.html
gulp.task('wiredep', function() {
    var options = config.getWiredepDefaultOptions();
    return gulp.src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.src));
});

//Task for injecting custom css and js into index.html
gulp.task('inject', function() {
    var target = gulp.src(config.index);
    var css = gulp.src(config.css, {
        read: false
    });
    var js = gulp.src(config.js, {
        read: false
    });

    target
        .pipe(inject(css))
        .pipe(gulp.dest(config.src));

    return target
        .pipe(inject(js))
        .pipe(gulp.dest(config.src));
});

//Task for watching uncompiled less files
gulp.task('watch-less', function() {
    gulp.watch([config.less], ['styles-less']);
});

// watch files for changes and reload
gulp.task('serve-dev', function() {
    browserSync({
        server: {
            baseDir: 'src'
        }
    });

    gulp.watch(['**/*.*'], {
        cwd: 'src'
    }, reload);
});

// Utilities
function errorLogger(error) {
    log('===> Error!');
    log(error);
    log('===> End of Error');
    this.emit('end');
}

function log(msg) {
    console.log(msg);
}
