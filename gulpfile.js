"use strict";

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    opn = require('opn'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade');

//Очистка
gulp.task('clean', function(){
    return gulp.src('dist').pipe(clean());
})

//Сборка проекта
gulp.task('dist', function () {
    var assets = useref.assets();

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist')),
    gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts')),
    gulp.src('app/img/*')
        .pipe(gulp.dest('dist/img'));
})

//Компиляция scss в css
gulp.task('sass', function () {
    gulp.src('app/_sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/_sass/'));
})

//Компиляция jade в html
gulp.task('jade', function () {
    gulp.src(['app/_jade/_pages/*.jade', '!app/_jade/_pages/_*.jade'])
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('app/_jade/_pages/'));
})

//Минификация изображений
gulp.task('images', function() {
      gulp.src('app/img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/img'))
})

//Добавление библиотек Bower
gulp.task('wiredep', function () {
  gulp.src('app/_jade/_layouts/*.jade')
    .pipe(wiredep({
      directory: 'app/bower_components'}))
    .pipe(gulp.dest('app/_jade/_layouts/'));
})

//Сервер
gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true
    });
    opn('http://localhost:8080/');
})


//html 
gulp.task('html', function() {
    gulp.src('app/*.html')
    .pipe(connect.reload());
})

//js
gulp.task('js', function() {
    gulp.src('app/_scripts/*.js')
    .pipe(connect.reload());
})

//css 
gulp.task('css', function() {
    gulp.src('app/css/*.css')
    .pipe(connect.reload());
})

//Слежка
gulp.task('watch', function() {
    gulp.watch(['app/*.html'], ['html']);
    gulp.watch(['app/_scripts/*.js'], ['js']);
    gulp.watch(['app/css/*.css'], ['css']);
    gulp.watch(['bower.json'], ['wiredep']);
    gulp.watch('app/img/*', ['images']);
    gulp.watch('app/_sass/*.scss', ['sass']);
})

//Default
gulp.task('default', ['connect', 'watch']);