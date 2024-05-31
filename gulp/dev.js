import gulp from 'gulp';

//HTML
import fileinclude from 'gulp-file-include';

//SCSS
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

//JS
import webpack from 'webpack-stream';
import { config } from './../webpack.config.js';
const cfg = { config }
import changed, { compareContents } from 'gulp-changed';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';


import server from 'gulp-server-livereload';
import clean from 'gulp-clean';
import fs from 'fs';





const plumberConfig = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}

//TASKS
gulp.task('html:dev', function () {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(plumber(plumberConfig('HTML')))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/'))
})


gulp.task('sass:dev', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber(plumberConfig('SCSS')))
        .pipe(sass())
        .pipe(gulp.dest('./build/css/'))
});

gulp.task('js:dev', function () {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(plumber(plumberConfig('JS')))
        .pipe(webpack(cfg))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('images:dev', function (none) {
    if (fs.existsSync("./src/img/"))
        return gulp.src('./src/img/**/*', { encoding: false })
        .pipe(gulp.dest('./build/img/'))
    none()
});

gulp.task('fonts:dev', function (none) {
    if (fs.existsSync("./src/fonts/"))
        return gulp.src('./src/fonts/**/*')
            .pipe(changed('./build/fonts/'))
            .pipe(gulp.dest('./build/fonts/'))
    none()
});

const serverSettings = { livereload: true, open: true }

gulp.task('server:dev', function () {
    return gulp.src('./build/')
        .pipe(server(serverSettings));
});

gulp.task('clean:dev', function (none) {
    if (fs.existsSync('./build/')) {
        return gulp.src('./build/', { read: false })
            .pipe(clean({ forse: true }))
    }
    none();
});

gulp.task('watch:dev', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'))
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'))
    gulp.watch('./src/img/**/*.*', gulp.parallel('images:dev'))
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'))
    gulp.watch('./src/js/**/*', gulp.parallel('js:dev'))
});

