// Dependencies
const gulp = require("gulp")
const nodemon = require("gulp-nodemon")
const notify = require("gulp-notify")
const livereload = require("gulp-livereload")
const eslint = require("gulp-eslint")

// Tasks
gulp.task("lint", () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  gulp.src(["**/*.js", "!node_modules/**"])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
    .on("error", () => { process.exit(1) })
})

gulp.task("server", () => {
  livereload.listen()
  nodemon({
    script: "bin/www",
    // exec: 'node-inspector & node --debug',
    // nodeArgs: ['--debug'],
    ext: "js ejs json css html",
    ignore: "public/*"
  })
  .on("restart", () => {
    gulp.src("bin/www")
    .pipe(notify({ title: "Nodemon", message: "Restarting due to changes...." }))
  })
  .on("crash", () => {
    gulp.src("bin/www")
    .pipe(notify({ title: "App Crashed!!", message: "[nodemon] app crashed - waiting for file changes before starting..." }))
  })
})

gulp.task("client", () => {
  gulp.src("public/**/*.{js,css,html}")
    .pipe(livereload())
})

gulp.task("watch", () => {
  livereload.listen()
  gulp.watch("public/**/*.{js,css,html}", ["client"])
})

gulp.task("default", ["server", "watch"])
