var gulp     = require('gulp');
var cache    = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var config   = require('../config.js');


gulp.task('images', function(){
  return gulp
    .src([
      config.src.img + '**/*.{jpg,png,jpeg,svg,gif}'
    ])
    .pipe(cache(imagemin({
        interlaced: true
      })))
    .pipe(gulp.dest(config.dest.img + '/min'))
});

gulp.task('images:watch', function() {
  gulp.watch(config.src.img + '**/*.{jpg,png,jpeg,svg,gif}', ['images']);
});
