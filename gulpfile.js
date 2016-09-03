var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	templateCache = require('gulp-angular-templatecache'),
	del = require('del');
	useref = require('gulp-useref');
	gulpif = require('gulp-if');

	gulp.task('scripts', function() {
		return gulp.src('app/**/*.js')
	  .pipe(jshint('.jshintrc'))
	  .pipe(jshint.reporter('default'))
	  .pipe(notify({ message: 'Scripts task complete' }));
    });


	gulp.task('templates', function () {
	  return gulp.src('app/app_components/**/*.html')
		.pipe(templateCache({standalone:true}))
		.pipe(gulp.dest('dist/assets/js'));
	});

	gulp.task('useref-process',function(){
		return gulp.src('app/*.html')
			.pipe(useref())
			.pipe(gulpif('*.js', uglify()))
			.pipe(gulp.dest('dist'));
	});




gulp.task('default', function() {
	gulp.start('templates','scripts','useref-process');
});

// Watch .js files
gulp.watch('app/**/*.js', ['scripts']);

gulp.task('watch', function() {

  // Watch .js files
  // gulp.watch('app/**/*.js', ['scripts']); 

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});