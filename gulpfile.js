'use strict';

import gulp from 'gulp';
import exist from '@existdb/gulp-exist';
import zip from 'gulp-zip';
import { promises as fs, existsSync } from 'fs';
import { readFileSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';

const PRODUCTION = process.env.NODE_ENV === 'production';

console.log('Production? %s', PRODUCTION);

// exist.defineMimeTypes is called automatically by @existdb/gulp-exist
// No need to define it manually

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

function getPackageInfo() {
    const xmlContent = readFileSync('./expath-pkg.xml', 'utf-8');
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        removeNSPrefix: true
    });
    const result = parser.parse(xmlContent);
    const pkg = result.package;
    return {
        name: pkg['@_name'],
        version: pkg['@_version'],
        abbrev: pkg['@_abbrev']
    };
}

const packageInfo = getPackageInfo();
const xarName = `${packageInfo.abbrev || packageInfo.name}-${packageInfo.version}.xar`;

gulp.task('clean', async function () {
    await fs.rm('build', { recursive: true, force: true });
});

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
    '*.js',
    '!gulpfile.js',
    'node_modules/@awesome.me/webawesome/dist/**/*.js',
    'bower_components/**/*.js'
];

gulp.task('deploy:components', function () {
    return gulp.src(componentPaths, {base: './'})
        .pipe(exClient.newer(html5TargetConfiguration))
        .pipe(exClient.dest(html5TargetConfiguration));
});

const otherPaths = [
    '*.html',
    '*.xql',
    'resources/**/*',
    'modules/**/*',
    'demo/*.html'
];

if (existsSync('templates')) {
    otherPaths.push('templates/**/*');
}
if (existsSync('transforms')) {
    otherPaths.push('transforms/**/*');
}

gulp.task('deploy:other', function () {
    return gulp.src(otherPaths, {base: './'})
        .pipe(exClient.newer(targetConfiguration))
        .pipe(exClient.dest(targetConfiguration));
});

gulp.task('deploy', gulp.parallel('deploy:other', 'deploy:components'));

// XAR creation //

const buildFiles = [
    '*.xml',
    '*.xql',
    '*.html',
    '*.js',
    '!gulpfile.js',
    'icon.png',
    'icon.svg',
    'modules/**/*',
    'resources/**/*',
    'demo/*.html'
];

if (existsSync('templates')) {
    buildFiles.push('templates/**/*');
}
if (existsSync('transforms')) {
    buildFiles.push('transforms/**/*');
}

gulp.task('xar', function () {
    return gulp.src(buildFiles, {base: '.'})
        .pipe(zip(xarName))
        .pipe(gulp.dest('build'));
});

gulp.task('install', gulp.series('xar', function () {
    return gulp.src(`build/${xarName}`)
        .pipe(exClient.install());
}));

gulp.task('watch', function () {
    gulp.watch(otherPaths, gulp.series('deploy:other'));
    gulp.watch('*.html', gulp.series('deploy:components'));
    gulp.watch('*.js', gulp.series('deploy:components'));
});

gulp.task('default', gulp.series('watch'));
