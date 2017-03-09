var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('src/assets/less/<%= pkg.title %>.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('src/assets/css/<%= pkg.title %>.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('src/assets/js/<%= pkg.title %>.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/assets/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('src/assets/vendor/vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('src/assets/vendor/vendor/jquery'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('src/assets/vendor/font-awesome'))
})

gulp.task('minify-html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('publish'));
});


gulp.task('copy-css', function() {
    gulp.src(['src/assets/css/<%= pkg.title %>.min.css'])
        .pipe(gulp.dest('publish/assets/css/'))
})

gulp.task('copy-js', function() {
    gulp.src(['src/assets/js/**/*'])
        .pipe(gulp.dest('publish/assets/js/'))
})

gulp.task('copy-images', function() {
    gulp.src(['src/assets/img/**/*'])
        .pipe(gulp.dest('publish/assets/img/'))
})

gulp.task('copy-vendor', function() {
    gulp.src(['src/assets/vendor/**/*'])
        .pipe(gulp.dest('publish/assets/vendor/'))
})


// Run everything
gulp.task(
    'default',
    [
        'less',
        'minify-css',
        'minify-js',
        'copy',
        'minify-html',
        'copy-css',
        'copy-images',
        'copy-js',
        'copy-vendor'
    ]
);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('src/assets/less/*.less', ['less']);
    gulp.watch('src/assets/css/*.css', ['minify-css']);
    gulp.watch('src/assets/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/assets/js/**/*.js', browserSync.reload);
});
