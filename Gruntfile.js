module.exports = function(grunt) {
  grunt.initConfig({
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/stylesheets',
          src: ['*.css', '!*.min.css'],
          dest: 'public/stylesheets',
          ext: '.min.css'
        },
        {
          expand: true,
          cwd: 'public/css',
          src: ['*.css', '!*.min.css'],
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
