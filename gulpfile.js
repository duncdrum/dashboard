'use strict';

import gulp from 'gulp';
import exist from '@existdb/gulp-exist';
import less from 'gulp-less';
import LessAutoprefix from 'less-plugin-autoprefix';
import { promises as fs } from 'fs';

const PRODUCTION = process.env.NODE_ENV === 'production';

console.log('Production? %s', PRODUCTION);

exist.defineMimeTypes({
    'application/xml': ['odd']
});

const exClient = exist.createClient({
    host: 'localhost',
    port: '8080',
    path: '/exist/xmlrpc',
    basic_auth: {user: 'admin', pass: ''}
});

const html5TargetConfiguration = {
    target: '/db/apps/existdb-dashboard',
    html5AsBinary: true
};

const targetConfiguration = {
    target: '/db/apps/existdb-dashboard'
};

gulp.task('clean', async function () {
    await fs.rm('build', { recursive: true, force: true });
});

// styles //

const lessPath = './resources/css/style.less';
const autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});

gulp.task('styles', function () {
    return gulp.src(lessPath)
        .pipe(less({plugins: [autoprefix]}))
        .pipe(gulp.dest('./resources/css'));
});

gulp.task('deploy:styles', gulp.series('styles', function () {
    return gulp.src('resources/css/*.css', {base: './'})
        .pipe(exClient.newer(targetConfiguration))
        .pipe(exClient.dest(targetConfiguration));
}));

// odd files //

const oddPath = 'resources/odd/**/*';

gulp.task('odd:deploy', function () {
    return gulp.src(oddPath, {base: './'})
        .pipe(exClient.newer(targetConfiguration))
        .pipe(exClient.dest(targetConfiguration));
});

gulp.task('odd:watch', function () {
    gulp.watch(oddPath, gulp.series('odd:deploy'));
});

// files in project root //

const componentPaths = [
    '*.html',
    '!index.html',
    'bower_components/**/*'
];

gulp.task('deploy:components', function () {
    return gulp.src(componentPaths, {base: './'})
        .pipe(exClient.newer(html5TargetConfiguration))
        .pipe(exClient.dest(html5TargetConfiguration));
});

const otherPaths = [
    '*.html',
    '*.xql',
    'templates/**/*',
    'transforms/**/*',
    'resources/**/*',
    '!resources/css/*',
    'modules/**/*',
    'demo/*.html'
];

gulp.task('deploy:other', function () {
    return gulp.src(otherPaths, {base: './'})
        .pipe(exClient.newer(targetConfiguration))
        .pipe(exClient.dest(targetConfiguration));
});

gulp.task('deploy', gulp.parallel('deploy:other', 'deploy:components', 'deploy:styles'));

gulp.task('watch', function () {
    gulp.watch('resources/css/*', gulp.series('deploy:styles'));
    gulp.watch(otherPaths, gulp.series('deploy:other'));
    gulp.watch('*.html', gulp.series('deploy:components'));
});

gulp.task('default', gulp.series('watch'));
