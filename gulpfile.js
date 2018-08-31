/**	
*	REQUIRE
**/
	var gulp = require('gulp');
	var sass = require('gulp-sass');
	var autoprefixer = require('gulp-autoprefixer');
	var sourcemaps = require('gulp-sourcemaps');
	var browserSync = require('browser-sync');
	var useref = require('gulp-useref');
	var uglify = require('gulp-uglify');
	var gulpIf = require('gulp-if');
	var cssnano = require('gulp-cssnano');
	var imagemin = require('gulp-imagemin');
	var cache = require('gulp-cache');
	var del = require('del');
	var runSequence = require('run-sequence');
	var jsonminify = require('gulp-jsonminify');

/**
*	TASK
**/
	/* Start browserSync server */
		gulp.task('browserSync', function() {
			browserSync({
				server: {
					baseDir: 'app'
				}
			})
		})

	/* Convert SCSS to CSS */
		gulp.task('sass', function() {
			return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
				.pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
				.pipe(gulp.dest('app/css')) // Outputs it in the css folder
				.pipe(browserSync.reload({ // Reloading with Browser Sync
					stream: true
				}));
		})

	/* Watchers */
		gulp.task('watch', function() {
			gulp.watch('app/scss/**/*.scss', ['sass']);
			gulp.watch('app/*.html', browserSync.reload);
			gulp.watch('app/js/**/*.js', browserSync.reload);
		})

/**
* OPTIMIZATION TASK
**/
	/* CSS and JavaScript */
		gulp.task('useref', function() {
			return gulp.src('app/*.html')
				.pipe(useref())
				.pipe(gulpIf('*.js', uglify()))
				.pipe(gulpIf('*.css', cssnano()))
				.pipe(gulp.dest('dist'));
		});

	/* Images */
		gulp.task('images', function() {
			return gulp.src('app/assets/**/*.+(png|jpg|jpeg|gif|svg)')
				.pipe(gulp.dest('dist/assets'))
		});

	/*	Copying json language files */
		gulp.task('json', function() {
			return gulp.src('app/js/i18n/**/*')
				.pipe(jsonminify())
				.pipe(gulp.dest('dist/js/i18n'))
		})

	/* Copying fonts */
		gulp.task('fonts', function() {
			return gulp.src('app/assets/fonts/**/*')
				.pipe(gulp.dest('dist/assets/fonts'))
		})

	/* Cleaning */
		gulp.task('clean', function() {
			return del.sync('dist').then(function(cb) {
				return cache.clearAll(cb);
			});
		})
		gulp.task('clean:dist', function() {
			return del.sync(['dist/**/*', '!dist/assets/', '!dist/assets/**/*']);
		});

/**
*	BUILD SEQUENCES
**/
	gulp.task('default', function(callback) {
		runSequence(['sass', 'browserSync'], 'watch',
			callback
		)
	})

	gulp.task('build', function(callback) {
		runSequence(
			'clean:dist',
			'sass',
			['useref', 'images', 'fonts', 'json'],
			callback
		)
	})