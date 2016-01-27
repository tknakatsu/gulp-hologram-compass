var gulp = require('gulp');

var fs = require('fs');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var ect = require('gulp-ect');
// var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var compass = require('gulp-compass');
var hologram = require('gulp-hologram');
var browserSync = require('browser-sync');

// ファイル追加や削除の時にwatchタスクを動かせるようにパスを改めて指定
var path = require('path');
var src = './';
var relativePath = path.relative('.', src); // 追記

// css outputスタイル
var outputStyle = 'compressed';

// ect
gulp.task('ect', function(){
// var json = JSON.parse(fs.readFileSync(relativePath + 'src/data/setting.json'))

gulp.src(['src/ect/**/*.ect', '!src/ect/**/_*.ect'], {base: 'src/ect'})
    .pipe(plumber())
    .pipe(ect({
        data: function(file, cb) {
            var dirpath = path.dirname(file);
            var category = path.relative('src/ect/', dirpath);
            var page = path.relative(dirpath, file);
            console.log(file);
            cb ({
                filename: file,
                // data: json,
                // basepath: '/'
                image_path: '/assets/img',
                category: category,
                page: page
            });
        }
    }))
    .pipe(gulp.dest('./build/'));
});


// compass
gulp.task('compass', function() {
    gulp.src('./src/sass/**/*.scss')
    .pipe(plumber())
    .pipe(compass({
        bundle_exec: true,
        config_file: 'config.rb',
        comments: false,
        style: outputStyle,
        sass: './src/sass/',
        css: './build/css/'
    }));
});

// hologram スタイルガイド
gulp.task('hologram', ['compass'], function() {
    var configGlob = './config.yml';
    var hologramOptions = {
        bundler: true
    }

    gulp.src( configGlob )
        .pipe(hologram( hologramOptions ));
});

// watch
gulp.task('watch', function() {
    // watch(relativePath + 'src/sass/**', function() {
    //     gulp.start('compass');
    // });

    watch(relativePath + 'src/**', function() {
        gulp.start('hologram');
    });

    watch(relativePath + 'src/ect/**', function() {
        gulp.start('ect');
    });
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './build/',
            index: 'index.html',
        },
        notify: true,
        ghostMode: {
            scroll: false
        }
    });
});

// Reload all browsers
gulp.task('bs-reload', function (){
    browserSync.reload();
});

// default task
gulp.task('default', ['watch', 'browser-sync'], function() {
    gulp.watch('./build/**', ['bs-reload']);
    // gulp.watch('./build/assets/css/**/*.css', ['bs-reload']);
    // gulp.watch('./build/assets/img/**/*.*', ['bs-reload']);
    // gulp.watch('./build/assets/js/*.js', ['bs-reload']);
});
