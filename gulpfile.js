/* global require:false */
'use strict';

var gulp = require('gulp');

var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var less = require('gulp-less');
var fileInclude = require('gulp-file-include');
var htmlmin = require('gulp-htmlmin');
var zip = require('gulp-zip');
var connect = require('gulp-connect');
var open = require('gulp-open');
var prettify = require('gulp-jsbeautifier');
var babel = require('gulp-babel');
var del = require('del');
var runSequence = require('run-sequence');
var proxy = require('http-proxy-middleware');

var path = require('path');
var fs = require('fs');

var source = require('./source.json');

var sourceSize = Object.getOwnPropertyNames(source).length;

var paths = {
	root: './',
	source: {
		root: 'src/'
	},
	dist: {
		root: 'dist/',
		css: 'dist/css/',
		js: 'dist/js/'
	},
	release: {
		root: 'release/'
	}
};

/*
 * ================================= 代理配置 =================================
 */
var proxyConfig = require('./.proxy.default.json');
if (fs.existsSync('./.proxy.json')) {
	proxyConfig = require('./.proxy.json');
}


/*
 * ================================= data:替换变量数据 =================================
 */
var dataJson;
gulp.task('data-dev', function(cb) {
	dataJson = {};
	for (var item in source) {
		dataJson[item + '-version'] = '';
	}
	cb();
});

gulp.task('data', function(cb) {
	dataJson = {};
	for (var item in source) {
		dataJson[item + '-version'] = '.min-' + source[item].version;
	}
	cb();
});


/*
 * ================================= js =================================
 */
/**
 * 合并js文件
 */
gulp.task('js:concat', function(cb) {
	var cbs = 0;
	var callback = function() {
		cbs++;
		if (cbs === sourceSize) {
			cb();
		}
	};

	for (var item in source) {
		gulp.src(source[item].jsFiles).pipe(concat(item + '.js')).pipe(gulp.dest(paths.dist.js)).on('end', callback);
	}
});

/**
 * Babel
 */
gulp.task('js:babel', function(cb) {
	gulp.src(['js/app*.js'], {
		cwd: paths.dist.root,
		base: paths.dist.root
	}).pipe(babel()).pipe(gulp.dest(paths.dist.root)).on('end', cb);
});

/**
 * 替换js文件中的变量
 */
gulp.task('js:replace', function(cb) {
	gulp.src(['js/app*.js'], {
		cwd: paths.dist.root,
		base: paths.dist.root
	}).pipe(fileInclude({
		context: dataJson
	})).pipe(gulp.dest(paths.dist.root)).on('end', cb);
});

/**
 * 压缩js文件
 *
 * 1. uglify<br>
 * 2. rename .min-版本号
 */
gulp.task('js:min', function(cb) {
	var cbs = 0;
	var callback = function() {
		cbs++;
		if (cbs === sourceSize) {
			cb();
		}
	};

	// js压缩选项
	var options = {
		compress: {
			drop_console: true,
			drop_debugger: true
		}
	};

	var process = function(item, source) {
		gulp.src([paths.dist.js + item + '.js']).pipe(uglify(options)).pipe(rename(function(path) {
			path.basename = path.basename + '.min-' + source[item].version;
		})).pipe(gulp.dest(paths.dist.js)).on('end', callback);
	};

	for (var item in source) {
		process(item, source);
	}
});

gulp.task('js-dev', function(cb) {
	runSequence('data-dev', 'js:concat', 'js:replace', cb);
});
gulp.task('js', function(cb) {
	runSequence('data', 'js:concat', 'js:babel', 'js:replace', 'js:min', cb);
});


/*
 * ================================= css =================================
 */
/**
 * less文件处理
 */
gulp.task('less', function(cb) {
	var cbs = 0;
	var callback = function() {
		cbs++;
		if (cbs === sourceSize) {
			cb();
		}
	};

	var process = function(item, source) {
		if (source[item].lessFiles && source[item].lessFiles.length) {
			gulp.src(source[item].lessFiles).pipe(less({
				paths: [path.join(__dirname, 'less', 'includes')]
			})).pipe(rename(function(path) {
				path.basename = item + '.less.' + path.basename;
			})).pipe(gulp.dest(paths.dist.css)).on('end', callback);
		} else {
			callback();
		}
	};

	for (var item in source) {
		process(item, source);
	}
});

/**
 * 合并css文件
 */
gulp.task('css:concat', function(cb) {
	var cbs = 0;

	var callback = function() {
		cbs++;
		if (cbs === sourceSize) {
			cb();
		}
	};

	var process = function(item, source) {
		var cssFiles = [];
		if (source[item].cssFiles && source[item].cssFiles.length) {
			cssFiles = cssFiles.concat(source[item].cssFiles);
		}
		cssFiles.push(paths.dist.css + item + '.less.*.css');
		gulp.src(cssFiles).pipe(concat(item + '.css')).pipe(gulp.dest(paths.dist.css)).on('end', callback);
	};

	for (var item in source) {
		process(item, source);
	}
});

/**
 * 压缩css文件
 *
 * 1. uglify<br>
 * 2. rename .min-版本号
 */
gulp.task('css:min', function(cb) {
	var cbs = 0;
	var callback = function() {
		cbs++;
		if (cbs === sourceSize) {
			cb();
		}
	};

	// css压缩选项
	var options = {
		rebase: false,
		merging: false
	};

	var process = function(item, source) {
		gulp.src([paths.dist.css + item + '.css']).pipe(cleanCSS(options)).pipe(rename(function(path) {
			path.basename = path.basename + '.min-' + source[item].version;
		})).pipe(gulp.dest(paths.dist.css)).on('end', callback);
	};

	for (var item in source) {
		process(item, source);
	}
});

gulp.task('css-dev', function(cb) {
	runSequence(['less'], 'css:concat', cb);
});
gulp.task('css', function(cb) {
	runSequence(['less'], 'css:concat', 'css:min', cb);
});


/*
 * ================================= html =================================
 */
gulp.task('html:includereplace', function(cb) {
	gulp.src(['pages/**', 'index.html', '!**/@*.html'], {
		cwd: paths.source.root,
		base: paths.source.root
	}).pipe(fileInclude({
		context: dataJson
	})).pipe(gulp.dest(paths.dist.root)).on('end', cb);
});

gulp.task('html:min', function(cb) {
	// html压缩选项
	var options = {
		removeComments: true,
		collapseWhitespace: true
	};

	gulp.src(['**/*.html'], {
		cwd: paths.dist.root,
		base: paths.dist.root
	}).pipe(htmlmin(options)).pipe(gulp.dest(paths.dist.root)).on('end', cb);
});

gulp.task('html-dev', function(cb) {
	runSequence('data-dev', 'html:includereplace', cb);
});
gulp.task('html', function(cb) {
	runSequence('data', 'html:includereplace', 'html:min', cb);
});


/*
 * ================================= 图片，字体等其他文件 =================================
 */
gulp.task('others', function(cb) {
	var cbs = 0;
	var size = 2;
	var callback = function() {
		cbs++;
		if (cbs === size) {
			cb();
		}
	};

	gulp.src([paths.source.root + 'favicon.ico', paths.source.root + 'images/**', paths.source.root + 'iconfont/**', paths.source.root + 'umeditor/**'], {
		base: paths.source.root
	}).pipe(gulp.dest(paths.dist.root)).on('end', callback);

	gulp.src([paths.source.root + 'icomoon/fonts/**'], {
		base: paths.source.root + 'icomoon'
	}).pipe(gulp.dest(paths.dist.root)).on('end', callback);
});


/*
 * ================================= clean =================================
 */
gulp.task('clean:dist', function() {
	return del(paths.dist.root + '*');
});
gulp.task('clean:release', function() {
	return del(paths.release.root + '*');
});


/*
 * ================================= dist =================================
 */
gulp.task('dist-dev', function(cb) {
	runSequence('clean:dist', ['js-dev', 'css-dev', 'html-dev', 'others'], cb);
});
gulp.task('dist', function(cb) {
	runSequence('clean:dist', ['js', 'css', 'html', 'others'], cb);
});


/*
 * ================================= server =================================
 */
gulp.task('watch', function() {
	gulp.watch([paths.source.root + '**', 'source.json'], function() {
		runSequence('dist-dev', 'reload');
	});
});

gulp.task('connect', function() {
	connect.server({
		root: paths.dist.root,
		livereload: {
			port: 4001
		},
		port: 4000,
		middleware: function() {
			var httpProxy = proxy(['/api/', '/igs/', '/image/'], {
				target: proxyConfig.server,
				changeOrigin: true,
				logLevel: 'debug'
			});

			var wsProxy = proxy('/message/', {
				target: proxyConfig.server,
				changeOrigin: true,
				ws: true,
				logLevel: 'debug'
			});

			return [httpProxy, wsProxy];
		}
	});
});
gulp.task('reload', function() {
	gulp.src(paths.dist.root).pipe(connect.reload());
});

gulp.task('open', function() {
	return gulp.src(paths.dist.root).pipe(open({
		uri: 'http://localhost:pppp'
	}));
});

gulp.task('server', function(cb) {
	runSequence('watch', 'connect', 'open', cb);
});


/*
 * ================================= format =================================
 */
gulp.task('format', function() {
	gulp.src(['js/app/**/*.js', 'less/**/*.less', 'scss/**/*.scss'], {
		cwd: paths.source.root,
		base: paths.source.root
	}).pipe(prettify()).pipe(gulp.dest(paths.source.root));
});


/*
 * ================================= release =================================
 */
gulp.task('release:copy', function(cb) {
	gulp.src(['favicon.ico', 'fonts/**', 'images/**', 'iconfont/**', 'umeditor/**', 'pages/**', 'index.html', 'css/*.min*.css', 'js/*.min*.js'], {
		cwd: paths.dist.root,
		base: paths.dist.root
	}).pipe(gulp.dest(paths.release.root + 'xxxx/')).on('end', cb);
});

gulp.task('release:compress', function(cb) {
	gulp.src(paths.release.root + 'xxxx/**').pipe(zip('xxxx.zip')).pipe(gulp.dest(paths.release.root)).on(
		'end', cb);
});

gulp.task('release', function(cb) {
	runSequence('clean:release', 'dist', 'release:copy', 'release:compress', cb);
});


/*
 * ================================= default =================================
 */
gulp.task('default', function(cb) {
	runSequence('dist-dev', 'server', cb);
});
