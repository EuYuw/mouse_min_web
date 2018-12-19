/* global module:false */
/* global require:false */
'use strict';

module.exports = function(grunt) {
	var pkg = grunt.file.readJSON('package.json');
	var source = grunt.file.readJSON('source.json');

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
	var proxy = require('http-proxy-middleware');
	var fs = require('fs');

	var proxyConfig = require('./.proxy.default.json');
	if (fs.existsSync('./.proxy.json')) {
		proxyConfig = require('./.proxy.json');
	}


	/*
	 * ================================= data:替换变量数据 =================================
	 */
	var dataJson_dev = {};
	var dataJson = {};
	for (let item in source) {
		dataJson_dev[item + '-version'] = '';
		dataJson[item + '-version'] = '.min-' + source[item].version;
	}


	var less = {
		'css': {
			files: []
		}
	};
	var concat = {
		'js': {
			files: []
		},
		'css': {
			files: []
		}
	};
	var cssmin = {
		options: {
			rebase: false,
			advanced: false,
			aggressiveMerging: false
		},
		'css': {
			files: []
		}
	};
	var uglify = {
		options: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		'js': {
			files: []
		}
	};

	for (let item in source) {
		/*
		 * ================================= js =================================
		 */
		concat['js'].files.push({
			src: source[item].jsFiles,
			dest: paths.dist.js + item + '.js'
		});
		uglify['js'].files.push({
			src: paths.dist.js + item + '.js',
			dest: paths.dist.js + item + '.min-' + source[item].version + '.js'
		});

		/*
		 * ================================= css =================================
		 */
		if (source[item].lessFiles && source[item].lessFiles.length) {
			less['css'].files.push({
				src: source[item].lessFiles,
				dest: paths.dist.css + item + '.less' + '.css'
			});
		}

		var cssFiles = [];
		if (source[item].cssFiles && source[item].cssFiles.length) {
			cssFiles = cssFiles.concat(source[item].cssFiles);
		}
		cssFiles.push(paths.dist.css + item + '.less.css');
		concat['css'].files.push({
			src: cssFiles,
			dest: paths.dist.css + item + '.css'
		});

		cssmin['css'].files.push({
			src: paths.dist.css + item + '.css',
			dest: paths.dist.css + item + '.min-' + source[item].version + '.css'
		});
	}

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: pkg,
		// Task configuration.
		less: less,
		concat: concat,
		cssmin: cssmin,
		uglify: uglify,
		includereplace: {
			'js-dev': {
				options: {
					globals: dataJson_dev
				},
				files: [{
					expand: true,
					cwd: paths.dist.root,
					src: ['js/app*.js'],
					dest: paths.dist.root
				}]
			},
			'js': {
				options: {
					globals: dataJson
				},
				files: [{
					expand: true,
					cwd: paths.dist.root,
					src: ['js/app*.js'],
					dest: paths.dist.root
				}]
			},
			'html-dev': {
				options: {
					globals: dataJson_dev
				},
				files: [{
					expand: true,
					cwd: paths.source.root,
					src: ['pages/**', 'index.html', '!**/@*.html'],
					dest: paths.dist.root
				}]
			},
			'html': {
				options: {
					globals: dataJson
				},
				files: [{
					expand: true,
					cwd: paths.source.root,
					src: ['pages/**', 'index.html', '!**/@*.html'],
					dest: paths.dist.root
				}]
			}
		},
		htmlmin: {
			html: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: paths.dist.root,
					src: ['**/*.html'],
					dest: paths.dist.root
				}]
			}
		},
		clean: {
			dist: paths.dist.root + '*',
			release: paths.release.root + '*'
		},
		copy: {
			others: {
				files: [{
					expand: true,
					cwd: paths.source.root,
					src: ['favicon.ico', 'images/**','umeditor/**','iconfont/**'],
					dest: paths.dist.root
				}, {
					expand: true,
					cwd: paths.source.root + 'icomoon/',
					src: ['fonts/**'],
					dest: paths.dist.root
				}]
			},
			release: {
				files: [{
					expand: true,
					cwd: paths.dist.root,
					src: ['favicon.ico', 'fonts/**', 'iconfont/**', 'images/**', 'pages/**', 'index.html', 'css/*.min*.css',
						'js/*.min*.js', 'umeditor/**'],
					dest: paths.release.root + 'xxxx/'
				}]
			}
		},
		compress: {
			release: {
				options: {
					archive: paths.release.root + 'xxxx.zip',
					mode: 'zip'
				},
				files: [{
					expand: true,
					cwd: paths.release.root + 'xxxx/',
					src: ['**']
				}]
			}
		},
		babel: {
			js: {
				files: [{
					expand: true,
					cwd: paths.dist.root,
					src: ['js/app*.js'],
					dest: paths.dist.root
				}]
			}
		},
		jsbeautifier: {
			js: {
				options: {
					config: '.jsbeautifyrc'
				},
				src: ['src/js/app/**/*.js']
			},
			less: {
				options: {
					config: '.jsbeautifyrc',
					css: {
						fileTypes: ['.less']
					}
				},
				src: ['src/less/**/*.less']
			}
		},
		watch: {
			src: {
				files: [paths.source.root + '**', 'source.json'],
				tasks: ['dist-dev'],
				options: {
					livereload: 4001
				}
			}
		},
		connect: {
			server: {
				options: {
					base: paths.dist.root,
					port: 4000,
					livereload: 4001,
					open: 'http://localhost:pppp',
					middleware: function(connect, options, middlewares) {
						middlewares.unshift(proxy(['/api/', '/igs/', '/image/'], {
							target: proxyConfig.server,
							changeOrigin: true,
							logLevel: 'debug'
						}));
						middlewares.unshift(proxy('/message/', {
							target: proxyConfig.server,
							changeOrigin: true,
							ws: true,
							logLevel: 'debug'
						}));

						return middlewares;
					}
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	//grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-babel');

	// Task
	grunt.registerTask('js-dev', ['concat:js', 'includereplace:js-dev']);
	grunt.registerTask('js', ['concat:js', 'babel', 'includereplace:js', 'uglify:js']);
	grunt.registerTask('css-dev', ['less', 'concat:css']);
	grunt.registerTask('css', ['less', 'concat:css', 'cssmin:css']);
	grunt.registerTask('html-dev', ['includereplace:html-dev']);
	grunt.registerTask('html', ['includereplace:html', 'htmlmin']);
	grunt.registerTask('others', ['copy:others']);

	grunt.registerTask('dist-dev', ['clean:dist', 'js-dev', 'css-dev', 'html-dev', 'others']);
	grunt.registerTask('dist', ['clean:dist', 'js', 'css', 'html', 'others']);

	grunt.registerTask('release', ['clean:release', 'dist', 'copy:release', 'compress:release']);
	grunt.registerTask('default', ['dist-dev', 'connect', 'watch']);

	grunt.registerTask('format', ['jsbeautifier']);
};
