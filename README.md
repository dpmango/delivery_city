# Delivery City HTML/CSS
This package intended to solve common front-end development tasks.

## How to start
* `npm install` or `yarn` - install all dependencies
* `gulp` - run dev-server
* `gulp build` - build project from sources

--
## List of Gulp tasks

To run separate task type in command line `gulp [task_name]`.
Almost all tasks also have watch mode - `gulp [task_name]:watch`, but you don't need to use it directly.

### Main tasks
Task name          | Description                                                      
:------------------|:----------------------------------
`default`          | will start all tasks required by project in dev mode: initial build, watch files, run server with livereload
`build:development`| build dev version of project (without code optimizations)
`build`            | build production-ready project (with code optimizations)

### Other tasks
Task name          | Description                                                      
:------------------|:----------------------------------
`sass` 	         | compile .sass/.scss to .css. We also use [postcss](https://github.com/postcss/postcss) for [autoprefixer](https://github.com/postcss/autoprefixer)
`sprite:png`       | create png sprites
`server`           | run dev-server powered by [BrowserSync](https://www.browsersync.io/)


## Flags

We have several useful flags.

* `gulp --open` or `gulp server --open` - run dev server and then open preview in browser
* `gulp --tunnel=[name]` or `gulp server --tunnel [name]` - runs dev server and allows you to easily share a web service on your local development machine (powered by [localtunnel.me](https://localtunnel.me/)). Your local site will be available at `[name].localtunnel.me`.
* `gulp [task_name] --prod` or `gulp [task_name] --production` - run task in production mode. Some of the tasks (like, sass or js compilation) have additional settings for production mode (such as code minification), so with this flag you can force production mode. `gulp build` uses this mode by default.


### Setup + all packages
`yarn add gulp require-dir run-sequence gulp-util gulp-notify gulp-cache gulp-sass gulp-sourcemaps gulp-postcss autoprefixer cssnano postcss-inline-svg postcss-flexbugs-fixes postcss-short postcss-sorting postcss-pseudoelements gulp-rename gulp-imagemin gulp-plumber gulp-if browser-sync gulp-consolidate gulp-concat vinyl-buffer gulp-uglify gulp.spritesmith vinyl-buffer`
