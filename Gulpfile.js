const fs = require('fs');
const gulp = require('gulp');
const clean = require('gulp-clean');
const insert = require('gulp-insert');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const mergeStream = require('merge-stream');
const rollup = require('gulp-rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const PolymerProject = require('polymer-build').PolymerProject;


const WEB_COMPONENTS_POLYFILL = require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js');
const WEB_COMPONENTS_ES5_ADAPTER = require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js');
const IE_POLYFILLS = [
    require.resolve('url-polyfill/url-polyfill.min.js'),
    require.resolve('babel-polyfill/dist/polyfill.min.js'),
];

const bundle = (options) => {
    // Bundle main sources and dependencies
    const project = new PolymerProject(JSON.parse(fs.readFileSync('./polymer.json', 'utf8')));
    const version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
    let bundleStream = mergeStream(project.sources(), project.dependencies());

    bundleStream = bundleStream
        .pipe(uglify())
        .pipe(rollup({
            allowRealFiles: true,
            input: 'mammooc-rating-widget.js',
            output: {
                format: 'iife',
            },
            plugins: [
                rollupResolve({
                    module: false,
                    jsnext: true,
                }),
            ],
        }))
        .pipe(insert.prepend(`/* mammooc-rating-widget v${version} */\r\n`));

    // Copy polyfills to output
    let polyfillsStream = gulp.src(WEB_COMPONENTS_POLYFILL);
    if(options.compile) {
        polyfillsStream = mergeStream(
            polyfillsStream,
            gulp.src(WEB_COMPONENTS_ES5_ADAPTER),
            gulp.src(IE_POLYFILLS).pipe(concat('polyfills-ie.js'))
        );
    }

    return mergeStream(bundleStream, polyfillsStream)
        .pipe(gulp.dest(options.dest));
};

const cleanDir = (dir) => gulp.src(dir, {read: false, allowEmpty: true}).pipe(clean());
gulp.task('clean-es5', () => cleanDir('build/es5'));
gulp.task('clean-es6', () => cleanDir('build/es6'));
gulp.task('clean', gulp.parallel('clean-es5', 'clean-es6'));

gulp.task('bundle-es5', () => bundle({compile: true, dest: 'build/es5'}));
gulp.task('bundle-es6', () => bundle({compile: false, dest: 'build/es6'}));
gulp.task('bundle', gulp.series('clean', gulp.parallel('bundle-es5', 'bundle-es6')));

gulp.task('default', gulp.series('bundle'));
