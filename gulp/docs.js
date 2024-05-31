import gulp from 'gulp';

//HTML
import fileinclude from 'gulp-file-include';
import htmlclean from 'gulp-htmlclean';
import webpHTML from 'gulp-webp-html';

//SCSS
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import gcmq from 'gulp-group-css-media-queries';
import webpCSS from 'gulp-webp-css';

//JS
import webpack from 'webpack-stream';
import { config } from '../webpack.config.js';
const cfg = { config }
import changed from 'gulp-changed';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import babel from 'gulp-babel';

import server from 'gulp-server-livereload';
import fs from 'fs';
import clean from 'gulp-clean';

//IMAGES
import webp from 'gulp-webp';






const plumberConfig = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}

const fileincludeConfig = {
    prefix: '@@',
    basepath: '@file'
}


//TASKS
gulp.task('html:docs', function () {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(plumber(plumberConfig('HTML')))
        .pipe(fileinclude(fileincludeConfig))
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
})


gulp.task('sass:docs', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberConfig('SCSS')))
        .pipe(autoprefixer())
        .pipe(webpCSS())
        .pipe(sass())
        .pipe(gcmq())
        .pipe(csso())
        .pipe(gulp.dest('./docs/css/'))
});

gulp.task('js:docs', function () {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(plumber(plumberConfig('JS')))
        .pipe(babel())
        .pipe(webpack(cfg))
        .pipe(gulp.dest('./docs/js'))
});

gulp.task('images:docs', function (none) {
    if (fs.existsSync("./src/fonts/"))
        return gulp.src('./src/img/**/*', { encoding: false })
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img'))

        .pipe(gulp.src('./src/img/**/*'))
        .pipe(gulp.dest('./docs/img'))
    none()
});

gulp.task('fonts:docs', function (none) {
    if (fs.existsSync("./src/fonts/"))
        return gulp.src('./src/fonts/**/*')
            .pipe(changed('./docs/fonts/'))
            .pipe(gulp.dest('./docs/fonts/'))
    none()
});

const serverSettings = { livereload: true, open: true }

gulp.task('server:docs', function () {
    return gulp.src('./docs/')
        .pipe(server(serverSettings));
});

gulp.task('clean:docs', function (none) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', { read: false })
            .pipe(clean({ forse: true }))
    }
    none();
});

