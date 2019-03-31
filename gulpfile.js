"use strict";

const { series, parallel, src, dest } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const cache = require('gulp-cached');
const browserSync = require('browser-sync').create();

var paths = {

    dist: './dist/',
    
    styles: {
        src: './src/**/*.scss',
        dest: './dist/css'
    },

    html: {
        src: './*.html',
        dest: './dist/'
    },

    javaScript: {
        src: './src/**/*.js',
        dest: './dist/js',
        vendor: 'vendor/*.js'
    },
};

//compile sass to css and place to destination
function style() {
    //where is my sass files
    return gulp.src(paths.styles.src)
    //compile sass files
    .pipe(sass().on('error', sass.logError))
    //where to put compiled css files
    .pipe(gulp.dest(paths.styles.dest))
    //stream changes to all browsers
    .pipe(browserSync.stream());
}

function javaScript() {
    return gulp.src(paths.javaScript.src)
    //.pipe(cache())
    .pipe(babel())
    //.pipe(src(paths.javaScript.vendor))
    .pipe(uglify())
    .pipe(gulp.dest(paths.javaScript.dest))
    .pipe(browserSync.stream());
}

function html() {
    return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

//clean up destination directory 
function cleanDir() {
    return gulp.src(paths.dist, {read: false, allowEmpty: true})
    .pipe(clean());
}

function clearCache() {
    cache.caches = {}
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp
        .watch(['./src/**/*.js', './*.html', './src/**/*.scss'])
        .on('change', function(){
            style();
            javaScript();
            html();
            browserSync.reload;
        });
}


exports.caches = clearCache;
exports.default = series(cleanDir, style, javaScript, html, watch);