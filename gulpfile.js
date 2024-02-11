const gulp = require('gulp');
const minify = require('gulp-minify');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const nodemon = require('gulp-nodemon');

const fs = require('fs');

sass.compiler = require('node-sass');

const gulpIt = () => {
    gulp
        .src('src/**/*.js')
        .pipe(minify({
            ext: {
                src: "-orig.js",
                min: ".js"
            }
        }))
        .pipe(gulp.dest('dist'));

    gulp.src('src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));

    gulp
        .src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
}

gulp.task('default', function (cb) {

    var started = false;

    return nodemon({
        script: './server/server.js',
        watch: './src',
        ext: 'js html scss'
    }).on('start', function () {
        if (!started) {
            const folders = [
                'dist',
                'dist/assets'
            ];

            folders.forEach(dir => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    console.log('📁 created:', dir);
                }
            });
            fs.cpSync('./src/assets', './dist/assets', {recursive: true});
            gulpIt();
            started = true;
            cb();
        }
        cb();
    }).on('restart', function () {
        gulpIt();
    });
});