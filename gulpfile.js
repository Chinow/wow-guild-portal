var gulp       = require('gulp');
var less       = require('gulp-less');
var minifyCSS  = require('gulp-minify-css');
//var browserify = require('gulp-browserify');
//var handlebars = require('gulp-ember-handlebars');
//var myth       = require('gulp-myth');
//var hint       = require('gulp-jshint');
//var concat     = require('gulp-concat');
//var cache      = require('gulp-cache');
//var gif        = require('gulp-if');
//var uglify     = require('gulp-uglify');

var BUILD_DIR = 'dist';
var DEST = '/laravel/public';
var DEST_MIN = 'dist-min';
var PORTAL_DIR = 'portal';
var REST_DIR = 'rest';
var ALL_JS = '/js/**/*.js';
var ALL_LESS = '/less/**/*.less';
var ALL_TMPL = '/template/**/*.hbs';
var VENDOR = '/vendors';
var TO_COPY = [ PORTAL_DIR + '/index.html', 
                PORTAL_DIR + '/favicon.ico', 
                PORTAL_DIR + '/robots.txt',
                PORTAL_DIR + '/images/**/*', 
                PORTAL_DIR + '/fonts/*'];

var TO_COPY_LARAVEL = [REST_DIR + '/laravel/**/*'];

var VENDORS_DEPS = [
    'jquery',
    'bootstrap',
    'ember',
    'bootstrap-datepicker'
];

function handleError(err) {
    console.trace();
    console.log(err.toString());
    this.emit('end');
}

var debug = process.env.NODE_ENV !== 'production';

gulp.task('less', function() {
    return gulp.src([PORTAL_DIR + '/less/main.less'])
        .pipe(less())
        .on('error', handleError)
        .pipe(gulp.dest(BUILD_DIR + DEST + '/css'));
});

gulp.task('styles-min', ['less'], function() {
    return gulp.src([BUILD_DIR + DEST + '/css/main.css'])
        .pipe(minifyCSS())
        .pipe(gulp.dest(BUILD_DIR + DEST + '/css'));

});

gulp.task('copy', function() {
    return gulp.src(
        TO_COPY, {
            base: PORTAL_DIR
        })
    .pipe(gulp.dest(BUILD_DIR + DEST));
});
 
gulp.task('copy-laravel', function() {
    return gulp.src(
        TO_COPY_LARAVEL, {
            base: REST_DIR
        })
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('vendors-scripts', function() {
    browserify(VENDORS_DEPS)
        .transform('debowerify')
        .transform('deamdify')
        .transform('browserify-shim')
        .require(VENDORS_DEPS)
        .bundle({ debug: true })
        .on('error', handleError)
        .pipe(source('vendors.js'))
        .pipe(gulp.dest(DEST + '/js'));
});

 

gulp.task('hint', function () {
  return gulp.src('**/*.js')
    .pipe(hint());
});

 
gulp.task('scripts', ['hint', 'templates'], function () {
  var ember = debug ? 'ember.js' : 'ember.prod.js';
  return gulp.src('js/app.js')
    .pipe(browserify({
      debug: debug,
      shim: {
        jquery: {
          path: 'js/libs/jquery-1.10.2.js',
          exports: '$'
        },
        handlebars: {
          path: 'js/libs/handlebars-1.1.2.js',
          exports: 'Handlebars'
        },
        templates: {
          path: 'builds/templates.js',
          exports: 'Ember.TEMPLATES'
        },
        ember: {
          path: 'js/libs/ember-1.6.1.js',
          exports: 'ember',
          depends: {
            handlebars: 'Handlebars',
            jquery: '$'
          }
        },
      }
    }))
    .on('prebundle', function (bundle) {
      bundle.add('../../js/libs/ember-1.6.1.js');
      bundle.add('../../builds/templates.js');
    })
    .pipe(gif(!debug, uglify()))
    .pipe(gulp.dest('builds/js'));
});
 
gulp.task('templates', function () {
  return gulp.src('templates/**/*.hbs')
    .pipe(cache(handlebars({
      outputType: 'cjs',
      templateRoot: 'templates/',
      processName: function (name) {
        name = name.split('/').slice(1).join('/').replace(/\.hbs/, '');
        return name;
      }
    })))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('builds'));
});
 
gulp.task('styles', function () {
  return gulp.src('css/main.css')
    .pipe(myth())
    .pipe(gulp.dest('builds/css'));
});
 
gulp.task('default', ['styles', 'scripts'], function () { });

gulp.task('build', ['copy-laravel', 'copy', 'styles-min']);
 
gulp.task('watch', function () {
  gulp.watch('**/*.js', ['scripts']);
  gulp.watch('**/*.hbs', ['scripts']);
  gulp.watch('**/*.css', ['styles']);
});