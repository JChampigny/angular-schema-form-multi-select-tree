var gulp = require('gulp');
var webserver = require('gulp-webserver');

var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-htmlmin');
var concat = require('gulp-concat');
var streamqueue = require('streamqueue');
var uglify = require('gulp-uglify');
var jscs = require('gulp-jscs');
var umd    = require('gulp-umd');

var banner = ['/**',
    ' * <%= bower.name %> - <%= bower.description %>',
    ' * @version v<%= bower.version %>',
    ' * @link <%= bower.homepage %>',
    ' * @license <%= bower.license %>',
    ' */',
    ''].join('\n');

gulp.task('minify', function() {
    var stream = streamqueue({objectMode: true});

    stream.queue(
        gulp.src('./src/*.html')
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(templateCache({
                module: 'schemaForm',
                root: 'directives/decorators/bootstrap/tree-select/'
            }))
    );
    stream.queue(gulp.src('./src/*.js'));

    stream.done()
        .pipe(concat('angular-schema-form-multi-select-tree.min.js'))
        .pipe(umd({
            dependencies: function() {
                return [
                    {
                        name: 'schemaForm',
                        amd:"angular-schema-form",
                        cjs: 'angular-schema-form'
                    }
                ];
            },
            exports: function() {return 'angularSchemaFormMultiSelectTree';},
            namespace: function() {return 'angularSchemaFormMultiSelectTree';}
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('non-minified-dist', function() {
    var stream = streamqueue({objectMode: true});
    stream.queue(
        gulp.src('./src/*.html')
            .pipe(templateCache({
                module: 'schemaForm',
                root: 'directives/decorators/bootstrap/tree-select/'
            }))
    );
    stream.queue(gulp.src('./src/*.js'));

    stream.done()
        .pipe(concat('angular-schema-form-multi-select-tree.js'))
        .pipe(umd({
            dependencies: function() {
                return [
                    {
                        name: 'schemaForm',
                        amd:"angular-schema-form",
                        cjs: 'angular-schema-form'
                    }
                ];
            },
            exports: function() {return 'angularSchemaFormMultiSelectTree';},
            namespace: function() {return 'angularSchemaFormMultiSelectTree';}
        }))
        .pipe(gulp.dest('./dist'));

});

gulp.task('jscs', function() {
    gulp.src('./src/**/*.js')
        .pipe(jscs());
});

gulp.task('default', [
    'minify',
    'non-minified-dist'
]);

gulp.task('watch', function() {
    gulp.watch('./src/**/*', ['default']);
});

gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            port: 8001,
            open: true
        }));
});