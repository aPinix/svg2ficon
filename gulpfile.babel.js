// dependencies ---------------------------------------------------------------
// const gulp             = require('gulp');
import gulp from 'gulp';

// iconfont
import gulpIconfont from 'gulp-iconfont';
import gulpIconfontCss from 'gulp-iconfont-css';

// sass
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';

// scripts
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

// utils
import browserSync from 'browser-sync';
import del from 'del';
import rename from 'gulp-rename';
import concat from 'gulp-concat';



const server = browserSync.create();


// fonticons vars -------------------------------------------------------------

// Fonticons
let fontName = 'altaricons';
let projectName = `svg2ficon`; // ?



// paths ----------------------------------------------------------------------

// global
const FOLDER_BASE                = ''; // `${process.cwd()}`; // ?
const FOLDER_SRC                 = `${FOLDER_BASE}src`; // ?
const FOLDER_DIST                = `${FOLDER_BASE}dist`; // ?

const FOLDER_SRC_ASSETS          = `${FOLDER_SRC}/${projectName}/assets`; // ?
const FOLDER_DIST_ASSETS         = `${FOLDER_DIST}/${projectName}/assets`; // ?

const FOLDER_SRC_SASS            = `${FOLDER_SRC_ASSETS}/sass`; // ?
const FOLDER_DIST_CSS            = `${FOLDER_DIST_ASSETS}/css`; // ?

const FOLDER_SRC_JS              = `${FOLDER_SRC_ASSETS}/js`; // ?
const FOLDER_DIST_JS             = `${FOLDER_DIST_ASSETS}/js`; // ?

const FOLDER_SRC_TEMPLATES       = `${FOLDER_SRC}/${projectName}/templates`; // ?
const FOLDER_ICONFONT_SVG        = `${FOLDER_SRC}/${projectName}/svg`; // ?



// vars ----------------------------------------------------------------------

// timestamp
const runTimestamp = Math.round(Date.now()/1000);



// options ----------------------------------------------------------------------

// sass options
// let sassOptions = {
//   errLogToConsole: true,
//   outputStyle: 'expanded'
// };



// tasks ----------------------------------------------------------------------

// iconfont --------------------

// iconfont: clean
const confontClean = () => del([`${FOLDER_SRC_SASS}/*.svg`]);

// iconfont: iconfont
const iconfont = gulp.parallel(gulp.series(iconfontSass, confontClean), iconfontHtml);

// iconfont: html
function iconfontHtml() {
  return gulp.src(`${FOLDER_ICONFONT_SVG}/*.svg`)
    .pipe(gulpIconfontCss({
      fontName: fontName,
      path: `${FOLDER_SRC_TEMPLATES}/template.html`,
      targetPath: `../../../index.html`,
    }))
    .pipe(gulpIconfont({
      fontName: fontName,
      prependUnicode: true,
      normalize: true,
      centerHorizontally: true,
      fontHeight: 1001,
      formats: ['ttf', 'eot', 'svg', 'woff', 'woff2'],
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
      // .on('glyphs', function(glyphs, options) {
      //   console.log(glyphs, options);
      // })
    .pipe(gulp.dest(`${FOLDER_DIST_ASSETS}/fonts/${fontName}`));
}

// iconfont: sass
function iconfontSass() {
  return gulp.src(`${FOLDER_ICONFONT_SVG}/*.svg`)
    .pipe(gulpIconfontCss({
      fontName: fontName,
      path: `${FOLDER_SRC_TEMPLATES}/_icons.scss`,
      targetPath: `_icons.scss`,
      fontPath: '../fonts/icons/',
      // cssClass: ''
    }))
    .pipe(gulp.dest(FOLDER_SRC_SASS));
}


// sytles --------------------
function styles() {
  return gulp.src(`${FOLDER_SRC_SASS}/main.{sass,scss}`)
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(FOLDER_DIST_CSS))
    .pipe(server.stream());
}


// scripts --------------------
function scripts() {
  return gulp.src(`${FOLDER_SRC_JS}/main.js`, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(FOLDER_DIST_JS));
}







// clean --------------------

// clean: dist
const clean = () => del([`${FOLDER_DIST}`]);



// copy --------------------

// copy: task
const copy = gulp.parallel(copyJs, copyImg);

// copy: js
function copyJs() {
  return gulp.src([`${FOLDER_SRC_JS}/lib/**/*`]).pipe(gulp.dest(`${FOLDER_DIST_JS}/lib`));
}

// copy: img
function copyImg() {
  return gulp.src([`${FOLDER_SRC_ASSETS}/img/**/*`]).pipe(gulp.dest(`${FOLDER_DIST_ASSETS}/img`));
}



// browser-sync --------------------

function reload(done) {
  server.reload();
  done();
}


function serve(done) {
  server.init({
    server: {
      baseDir: `${FOLDER_DIST}/${projectName}/`
    }
  });
  done();
}



// tasks --------------------

const watch = () => {
  gulp.watch(FOLDER_SRC_JS, gulp.series(scripts, reload));
  gulp.watch(FOLDER_SRC_SASS, styles);
  gulp.watch(FOLDER_SRC_TEMPLATES, gulp.series(iconfont, reload));
};

const dev = gulp.series(clean, copy, iconfont, gulp.parallel(styles, scripts), serve, watch);
const build = gulp.series(clean, copy, iconfont, gulp.parallel(styles, scripts));


// export tasks
exports.clean = clean;
exports.copy = copy;
exports.styles = styles;
exports.scripts = scripts;
exports.iconfont = iconfont;
exports.watch = watch;

exports.dev = dev;
exports.build = build;

exports.default = dev;

// gulp.task('default', ['clean', 'sync', 'iconfont-html', 'iconfont-sass', 'iconfont-css'], () => {
// });

// watch
// gulp.task('watch', ['browser-sync', 'clean', 'iconfont-html', 'iconfont-sass', 'iconfont-css'], () => {
//   // gulp.watch(ICONFONT_SVG_FOLDER + '*.svg', {cwd: LOCAL_ENV_PATH}, ['iconfont-html', 'iconfont-sass', 'iconfont-css']);
//   // gulp.watch(ICONFONT_SASS_FOLDER + '**/*.{sass,scss}', {cwd: LOCAL_ENV_PATH}, ['iconfont-css']);
//   // gulp.watch(ICONFONT_CSS_FOLDER + '*.css', {cwd: LOCAL_ENV_PATH}).on('change', browserSync.reload).on('end', browserSync.reload);
//   // gulp.watch(FONT_VIEWER_FOLDER + '*.html', {cwd: LOCAL_ENV_PATH}).on('change', browserSync.reload).on('end', browserSync.reload);
// });
