module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dialogPkg: grunt.file.readJSON('node_modules/vex2-dialog/package.json'),

    browserify: {
      vex: {
        src: 'src/vex2.js',
        dest: 'dist/vex2.js',
        options: {
          browserifyOptions: {
            'standalone': 'vex'
          }
        }
      },
      combined: {
        src: 'src/vex2.combined.js',
        dest: 'dist/vex2.combined.js',
        options: {
          browserifyOptions: {
            'standalone': 'vex'
          }
        }
      }
    },

    uglify: {
      vex: {
        src: 'dist/vex2.js',
        dest: 'dist/vex2.min.js',
        options: {
          banner: '/*! vex2.js <%= pkg.version %> */\n',
          report: 'gzip'
        }
      },
      combined: {
        src: 'dist/vex2.combined.js',
        dest: 'dist/vex2.combined.min.js',
        options: {
          banner: '/*! vex2.combined.js: vex2 <%= pkg.version %>, vex2-dialog <%= dialogPkg.version %> */\n',
          report: 'gzip'
        }
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'css'
        }
      }
    },

    sass: {
      dist: {
        cwd: 'sass',
        dest: 'css',
        expand: true,
        outputStyle: 'compressed',
        src: '*.sass',
        ext: '.css'
      }
    }
  })

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-sass')

  grunt.registerTask('default', ['browserify', 'uglify', 'sass'])
}
