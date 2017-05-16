var gulp    = require('gulp'),
    uglify  = require('gulp-uglify'),
    rename  = require('gulp-rename'),
    header  = require('gulp-header'),
    express = require('express'),
    gutil   = require('gulp-util'),
    path    = require('path'),
    package = require('./package.json');

build = 'dist/',

banner = [
  '/*',
  '  <%= package.name %> v<%= package.version %>',
  '  <%= package.homepage %>',
  '*/',
  ''
].join('\n');

gulp.task('dist', function () {
    gulp.src('src/localstorage-countdown-timer.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(header(banner, { package: package }))
        .pipe(gulp.dest(build));
});

gulp.task('serve', function () {
    var
    app = express(),
    port = 8888;
    app.use(express.static(path.resolve('src/')));
    app.listen(port, function() {
        gutil.log('Listening on', port);
    });
});

gulp.task('default', ['dist', 'serve']);
