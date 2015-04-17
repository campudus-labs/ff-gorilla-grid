var gulp = require('gulp');
var Path = require('path');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var gutil = require('gulp-util');
var del = require('del');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var karma = require('gulp-karma');
var source = require('vinyl-source-stream');

gulp.task('sass', sassCompile);
gulp.task('assets', assetCopy);
gulp.task('scripts', scriptCompile);
gulp.task('clean', clean);

gulp.task('reloader', ['build'], reload);
gulp.task('dev', ['build'], server);
gulp.task('test', ['build'], test);

gulp.task('build', ['sass', 'assets', 'scripts']);
gulp.task('default', ['build']);

var components = ['gridlayout', 'image-loader'];

function sassCompile() {
  return components.map(function (name) {
    return gulp.src('src/main/' + name + '/scss/main.scss')
      .pipe(plumber({
        errorHandler : function (error) {
          gutil.log(error.message);
          this.emit('end');
        }
      }))
      .pipe(compass({
        project : Path.join(__dirname),
        css : 'out/' + name + '/css',
        sass : 'src/main/' + name + '/scss',
        image : 'src/main/' + name + '/img'
      }))
      .pipe(minifyCss())
      .pipe(gulp.dest('out/' + name + '/css/'));
  });
}

function assetCopy() {
  return gulp.src(['src/main/**', '!src/main/*/js/**', '!src/main/js/**', '!src/main/*/scss', '!src/main/*/scss/**'])
    .pipe(gulp.dest('out/'));
}

function scriptCompile() {
  return components.map(function (name) {
    return browserify('./src/main/' + name + '/js/app.js')
      .transform('browserify-shim')
      .bundle()
      .on('error', function (err) {
        gutil.log('error', err);
        this.emit('end');
      })
      .pipe(source('app.js'))
      .pipe(gulp.dest('out/' + name + '/js/'))
  });
}

function test() {
  return gulp.src('src/test/**/*Spec.js')
    .pipe(karma({
      configFile : 'karma.conf.js',
      action : 'run'
    }))
    .on('error', function (err) {
      throw err;
    });
}

function server() {
  browserSync({
    server : {
      baseDir : 'out'
    }
  });

  gulp.watch(['src/main/**', 'src/main/js/**', 'src/main/scss/**/*.scss'], {}, ['reloader']);

  gulp.src('src/test/**/*Spec.js').pipe(karma({
    configFile : 'karma.conf.js',
    action : 'watch'
  }));
}

function clean(cb) {
  del(['out/'], cb);
}
