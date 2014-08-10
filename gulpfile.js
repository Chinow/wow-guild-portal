var gulp       = require('gulp');
var less       = require('gulp-less');
var minifyCSS  = require('gulp-minify-css');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var handlebars = require('gulp-ember-handlebars');
var concat     = require('gulp-concat');


var BUILD_DIR  = 'dist';
var DEST       = '/laravel/public';
var DEST_MIN   = 'dist-min';
var PORTAL_DIR = 'portal';
var REST_DIR   = 'rest';
var ALL_JS     = '/js/**/*.js';
var ALL_LESS   = '/less/**/*.less';
var ALL_TMPL   = '/template/**/*.hbs';
var VENDOR     = '/vendors';
var TO_COPY    = [ PORTAL_DIR + '/index.html', 
                   PORTAL_DIR + '/favicon.ico', 
                   PORTAL_DIR + '/robots.txt',
                   PORTAL_DIR + '/images/**/*', 
                   PORTAL_DIR + '/fonts/*'];

var TO_COPY_LARAVEL = [REST_DIR + '/laravel/**/*'];

var VENDORS_DEPS = [
    'jquery',
    'bootstrap',
    'ember',
    'bootstrap-datepicker',
    'handlebars'
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
        .bundle()
        .on('error', handleError)
        .pipe(source('vendors.js'))
        .pipe(gulp.dest(BUILD_DIR + DEST + '/js'));
});

 
gulp.task('app-scripts', function() {
    browserify('./' + PORTAL_DIR + '/js/app.js')
        .external(VENDORS_DEPS)
        .transform('browserify-shim')
        .bundle({ debug: true })
        .on('error', handleError)
        .pipe(source('app.js'))
        .pipe(gulp.dest(BUILD_DIR + DEST + '/js'));
});

gulp.task('templates', function(){
  gulp.src(['./' + PORTAL_DIR + '/templates/*.hbs'])
    .pipe(handlebars({
      outputType: 'browser'
     }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(BUILD_DIR + DEST +'/js/'));
});
 
gulp.task('styles', function () {
  return gulp.src('css/main.css')
    .pipe(myth())
    .pipe(gulp.dest('builds/css'));
});
 
gulp.task('default', ['build'], function () { });

gulp.task('build', ['copy-laravel', 'copy', 'styles-min', 'vendors-scripts', 'app-scripts', 'templates']);

gulp.task('scripts', ['app-scripts', 'templates']);

gulp.task('styles', ['styles-min']);
 
gulp.task('watch', function () {
  gulp.watch('**/*.js', ['scripts']);
  gulp.watch('**/*.hbs', ['scripts']);
  gulp.watch('**/*.css', ['styles']);
});