var gulp = require('gulp');
// var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var poststylus = require('poststylus');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var lost = require('lost');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var gcmq = require('gulp-group-css-media-queries');
var harp = require('harp');
var rupture = require('rupture');



var reload = browserSync.reload;

function refresh() {
  setTimeout(function () {
    reload();
  }, 500);
}

//Src paths
var srcPaths = {
  css: 'public/_src/styl/**/*.styl',
  styl: 'public/_src/styl/main.styl',
  js: [
      'public/_src/js/jquery.min.js',
      'public/_src/js/owlcarousel.min.js',
      'public/_src/js/slick.js',
      'public/_src/js/**/*.js'
    ],
  img: 'public/_src/img/**/*',
  harp: [
    'public/**/*.jade', 
    'public/**/*.styl',
    'public/**/*.js',
    'public/**/*.md',
    'public/**/*.json'
  ],
};

//Build patchs
var buildPaths = {
  build: 'public/assets/**/*',
  css: 'public/assets/css/',
  js: 'public/assets/js/',
  img: 'public/assets/img',
};


//compress Stylus
gulp.task('css', function () {
  gulp.src(srcPaths.styl)
    .pipe(stylus({
      use: [ rupture(), poststylus([lost(), autoprefixer()]) ],
      compress: false
    }))
    .pipe(gcmq())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(buildPaths.css));
  refresh();
});

refresh();

//Minify and concat JS
gulp.task('scripts', function() {
  return gulp.src(srcPaths.js)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(buildPaths.js))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(buildPaths.js));
});


//Minify images
gulp.task('imageMin', function() {
  gulp.src(srcPaths.img)
    .pipe(imagemin())
    .pipe(gulp.dest(buildPaths.img));
});


// Minify html
gulp.task('minify', function() {
  return gulp.src('public/_src/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('public/'));
});


//Watch for changes
gulp.task('watch', ['serve'], function() {
  gulp.watch('_src/*.html', { debounceDelay: 300 }, ['minify']);
  gulp.watch(srcPaths.styl, ['css']);
  gulp.watch(srcPaths.js, ['scripts']);
})


gulp.task('serve', function() {
  harp.server(__dirname, {
    port: 9000
  }, function () {

    browserSync({
      proxy: 'localhost:9000'
    });

    gulp.watch(srcPaths.harp, function () { reload(); });

    gulp.watch('_src/*.html', { debounceDelay: 300 }, ['minify']);
    gulp.watch(srcPaths.css, ['css']);
    gulp.watch(srcPaths.js, ['scripts']);

  });
});


// Gulp task to watch
gulp.task('default', [
  'css',
  'minify',
  'imageMin',
  'scripts',
  'watch',
  'serve'
]);


// Gulp task to build
gulp.task('build', [
  'css',
  'minify',
  'imageMin',
  'scripts',
]);

