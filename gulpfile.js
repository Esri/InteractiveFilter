// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
	gulp.src('sasss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest(function (f) {
			return "css/*.css";
		}));
});

gulp.task('default', ['sass']);