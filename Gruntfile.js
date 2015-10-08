module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            js: {
                src: "js/*.js",
                dest: "js/main.js"
            }
        },
        uglify: {
            Gen: {
                src: "js/main.js",
                dest: "js/main.min.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["concat", "uglify"]);
};
