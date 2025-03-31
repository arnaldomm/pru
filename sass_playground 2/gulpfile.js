const fs = require("fs");
const { src, dest, series, parallel, watch } = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
// const cleanCSS = require('gulp-clean-css'); // Can also use cssnano
// const autoprefixer = require('gulp-autoprefixer');
const connect = require('gulp-connect');
const open = require('open');

async function clean() {
  if (fs.existsSync('dist'))
    await fs.promises.rm(`dist`, { recursive: true })
}

function html() {
  return src('src/index.html')
    .pipe(dest('dist/'))
    .pipe(connect.reload());
}

function css() {
  return src('src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(autoprefixer({ cascade: false }))
    // .pipe(cleanCSS())
    .pipe(rename('style.css'))
    .pipe(dest('dist/'))
    .pipe(connect.reload());
}

function fa() {
  return src('src/fa/**/*')
  .pipe(dest('dist/fa'))
  .pipe(connect.reload());
}

function watchFiles() {
  watch('src/index.html', html);
  watch('src/scss/*.scss', css);
  watch('src/fa/*.*', fa);
};

function server() {
  connect.server({
    root: 'dist/',
    livereload: true,
    port: 3000
  });
}

async function openBrowser() {
  console.log(`openBrowser()`);
  await open('http://localhost:3000', {app: {name: 'google chrome'}})
}

exports.default = series(clean, parallel(html, css, fa), parallel(server, openBrowser, watchFiles));