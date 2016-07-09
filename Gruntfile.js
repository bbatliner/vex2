module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      Vex: {
        src: 'src/vex2.js',
        dest: 'dist/vex2.js',
        options: {
          browserifyOptions: {
            'standalone': 'Vex'
          }
        }
      }
    },

    uglify: {
      Vex: {
        src: 'dist/vex2.js',
        dest: 'dist/vex2.min.js',
        options: {
          banner: '/*! vex2.js <%= pkg.version %> */\n',
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
