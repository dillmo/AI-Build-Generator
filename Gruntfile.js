module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            rawJS: {
                src: ["js/jquery.min.js",
                      "js/FileSaver.min.js",
                      "js/GenBuild.js",
                      "js/DownloadBuild.js"],
                dest: "js/main.js"
            }
        },
        uglify: {
            concatJS: {
                src: "js/main.js",
                dest: "js/main.min.js"
            }
        },
        htmlmin: {
            rawHTML: {
                files: {
                    "index.html": "index.full.html"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");

    grunt.registerTask("default", ["concat", "uglify", "htmlmin"]);
};
