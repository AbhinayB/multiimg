module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
            },
            lib: {
                src: ['./node_modules/angular/angular.js',
                    './node_modules/angular-material/angular-material.js',
                    './node_modules/angular-aria/angular-aria.js',
                    './node_modules/angular-animate/angular-animate.js',
                    './node_modules/angular-messages/angular-messages.js',
                    './node_modules/angular-route/angular-route.js'
                ],
                dest: 'public/javascripts/lib.js',
            },
            dist: {
                src: ['./frontend/app.js', './frontend/controller/*.js'],
                dest: 'public/javascripts/built.js',
            },
            libcascade: {
                src: ['./node_modules/angular-material/angular-material.css'],
                dest: 'public/stylesheets/lib.css',
            }
        },
        /*copy: {
            main: {
                files: [
                    // includes files within path
                    { src: ['./views/*.html'], dest: 'public/html/a.html' }
                ],
            },
        },*/
        /* uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n'
            },
           build: {
                src: 'public/javascripts/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
    }*/
    });

    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Default task(s).
    grunt.registerTask('default', ['concat', ]);

};