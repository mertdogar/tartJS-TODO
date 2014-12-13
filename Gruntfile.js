'use strict';

var fs = require('fs');

module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            before: ['www/*', '!www/.dont-delete']
        },
        mkdir: {
            all: {
                options: {
                    create: ['www/img', 'src/js/compiled']
                }
            },
            dev: {
                options: {
                    create: ['www/img', 'www/css', 'src/js/compiled']
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            lib: {
                files: {
                    'src/js/compiled/lib.js': [
                    ]
                }
            }
        },
        closureBuilder: {
            options: {
                builder: 'src/js/lib/tartJS/tools/goog/build/closurebuilder.py',
                namespaces: 'todo.Bootstrapper',
                compilerFile: 'src/js/lib/tartJS/tools/goog/compiler/compiler.jar',
                output_mode: 'compiled',
                compile: true,
                compilerOpts: {
                    output_wrapper: '(function(){%output%})()',
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    //                    compilation_level: 'WHITESPACE_ONLY',
                    warning_level: 'verbose',
                    //                    formatting: 'PRETTY_PRINT',
                    language_in: 'ECMASCRIPT5',
                    charset: 'UTF-8',
                    generate_exports: true,
                    externs: ['src/js/todo/externs.js', 'src/js/lib/tartJS/tart/externs/w3c_audio.js'],
                    jscomp_error: ['accessControls', 'checkRegExp', 'checkTypes', 'checkVars', 'invalidCasts',
                        'missingProperties', 'nonStandardJsDocs', 'strictModuleDepCheck', 'undefinedVars',
                        'unknownDefines', 'visibility'],
                    jscomp_off: ['liskov']
                },
                execOpts: {
                    maxBuffer: 999999 * 1024
                }
            },
            main: {
                src: 'src/js',
                dest: 'src/js/compiled/compiled.js'
            }
        },
        closureDepsWriter: {
            options: {
                depswriter: 'src/js/lib/tartJS/tools/goog/build/depswriter.py', // filepath to depswriter
                root_with_prefix: '"src/js/ ../../../../../"'
            },
            main: {
                dest: 'src/js/deps.js'
            }
        },
        copy: {
            prod: {
                files: [
                    { expand: true, cwd: 'src/', src: ['img/**'], dest: 'www/' },
                    { expand: true, cwd: 'src/', src: ['fonts/**'], dest: 'www/' },
                    { expand: true, cwd: 'src/', src: ['index.html'], dest: 'www/' }
                ]
            },
            dev: {
                files: [
                    { expand: true, cwd: 'src/', src: ['index.html'], dest: 'www/' }
                ]
            }
        },
        symlink: {
            all: {
                files: [
                    { expand: true, cwd: 'src', src: ['js/*'], dest: 'www' },
                    { expand: true, cwd: 'src/', src: ['fonts/**'], dest: 'www/' },
                    { expand: true, cwd: 'src', src: ['css/*'], dest: 'www' },
                    { expand: true, cwd: 'src', src: ['img/*'], dest: 'www' }
                ]
            }
        },
        concat: {
            js: {
                options: {
                    separator: ';'
                },
                src: ['src/js/compiled/lib.js', 'src/js/compiled/compiled.js'],
                dest: 'www/js/compiled.js'
            },
            css: {
                src: [
                    'src/css/reset.css',
                    'src/css/icon-fonts.css',
                    'src/css/todo.css'
                ],
                dest: 'www/css/compiled.css'
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'www/css/',
                src: ['compiled.css'],
                dest: 'www/css/',
                ext: '.css'
            }
        },
        combine: {
            dev: {
                input: 'www/index.html',
                output: 'www/index.html',
                tokens: [
                    {
                        token: '<scripts/>',
                        string: '<script type="text/javascript" src="js/lib/tartJS/third_party/goog/goog/base.js"></script>' +
                            '<script type="text/javascript" src="js/deps.js"></script>' +
                            '<script type="text/javascript" src="js/Bootstrapper.js"></script>'

                    },
                    {
                        token: '<stylesheets/>',
                        string: '<link rel="stylesheet" type="text/css" href="css/reset.css" />' +
                            '<link rel="stylesheet" type="text/css" href="css/icon-fonts.css" />' +
                            '<link rel="stylesheet" type="text/css" href="css/todo.css" />'
                    }
                ]
            },
            production: {
                input: 'www/index.html',
                output: 'www/index.html',
                tokens: [
                    {
                        token: '<scripts/>',
                        string: '<script type="text/javascript" src="js/compiled.js"></script>'
                    },
                    {
                        token: '<stylesheets/>',
                        string: '<link rel="stylesheet" type="text/css" href="css/compiled.css" />'
                    }
                ]
            }
        },
        newer: {
            'uglify': {
                src: ['src/js/lib/*.js'],
                dest: 'src/js/compiled/lib.js',
                options: {
                    tasks: ['uglify:lib']
                }
            },
            'closureBuilder': {
                src: ['src/js/**/*.js'],
                dest: 'src/js/compiled/compiled.js',
                options: {
                    tasks: ['closureBuilder']
                }
            },
            'closureDepsWriter': {
                src: ['src/js/**/*.js'],
                dest: 'src/js/deps.js',
                options: {
                    tasks: ['closureDepsWriter']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-closure-tools');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-combine');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-newer-explicit');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['clean:before', 'mkdir:all', 'newer:uglify', 'newer:closureBuilder', 'copy:prod', 'concat', 'combine:production', 'cssmin']);
    grunt.registerTask('production', ['clean:before', 'mkdir:all', 'newer:uglify', 'newer:closureBuilder', 'copy:prod', 'concat', 'combine:production', 'cssmin']);
    grunt.registerTask('dev', ['clean:before', 'mkdir:dev', 'newer:closureDepsWriter', 'symlink', 'copy:dev', 'combine:dev']);
};
