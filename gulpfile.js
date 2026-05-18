'use strict';

import gulp from 'gulp';
import { createClient } from '@existdb/gulp-exist';
import zip from 'gulp-zip';
import { promises as fs, existsSync, readFileSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';

const PRODUCTION = process.env.NODE_ENV === 'production';

console.log('Production? %s', PRODUCTION);

const exClient = createClient({
  host: 'localhost',
  port: '8080',
  path: '/exist/xmlrpc',
  secure: false,
  basic_auth: { user: 'admin', pass: '' },
});

const html5TargetConfiguration = {
  target: '/db/apps/existdb-dashboard',
  html5AsBinary: true,
};

const targetConfiguration = {
  target: '/db/apps/existdb-dashboard',
};

function getPackageInfo() {
  const xmlContent = readFileSync('./expath-pkg.xml', 'utf-8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    removeNSPrefix: true,
  });
  const result = parser.parse(xmlContent);
  const pkg = result.package;
  return {
    name: pkg['@_name'],
    version: pkg['@_version'],
    abbrev: pkg['@_abbrev'],
  };
}

const packageInfo = getPackageInfo();
const xarName = `${packageInfo.abbrev || packageInfo.name}-${packageInfo.version}.xar`;

gulp.task('clean', async function () {
  await fs.rm('build', { recursive: true, force: true });
});

function copyPackageDist(packagePath, distSubpath = 'dist') {
  return gulp
    .src(`node_modules/${packagePath}/${distSubpath}/**/*`, {
      base: `node_modules/${packagePath}/${distSubpath}`,
      encoding: false,
    })
    .pipe(gulp.dest('build/resources/scripts/dist'));
}

gulp.task(
  'copy:components',
  gulp.parallel(
    () => copyPackageDist('existdb-launcher'),
    () => copyPackageDist('existdb-packagemanager'),
    () => copyPackageDist('@existdb/usermanager'),
    () => copyPackageDist('existdb-backup'),
    function copyRepoElements() {
      return gulp
        .src('node_modules/@existdb/repo-elements/dist/**/*', {
          base: 'node_modules/@existdb/repo-elements/dist',
          encoding: false,
        })
        .pipe(gulp.dest('build/resources/scripts/@existdb/repo-elements/dist'));
    }
  )
);

gulp.task('copy:deps', function () {
  return gulp
    .src(
      [
        'node_modules/lit/**/*.js',
        'node_modules/@lit/**/*.js',
        'node_modules/lit-html/**/*.js',
        'node_modules/lit-element/**/*.js',
        'node_modules/@awesome.me/webawesome/dist/**/*',
      ],
      { base: 'node_modules' }
    )
    .pipe(gulp.dest('build/resources/scripts'));
});

gulp.task('copy:project', function () {
  const projectFiles = [
    '*.xml',
    '*.xql',
    '*.html',
    '*.js',
    '!gulpfile.js',
    '!prettier.config.js',
    '!cypress.config.js',
    'icon.png',
    'icon.svg',
    'modules/**/*',
    'resources/**/*',
    'src/**/*.js',
    'demo/*.html',
    'cypress/**/*',
  ];

  if (existsSync('templates')) {
    projectFiles.push('templates/**/*');
  }
  if (existsSync('transforms')) {
    projectFiles.push('transforms/**/*');
  }

  return gulp.src(projectFiles, { base: '.' }).pipe(gulp.dest('build'));
});

gulp.task(
  'build',
  gulp.series('clean', 'copy:components', 'copy:deps', 'copy:project')
);

const oddPath = 'resources/odd/**/*';

gulp.task('odd:deploy', function () {
  return gulp
    .src(oddPath, { base: './' })
    .pipe(exClient.newer(targetConfiguration))
    .pipe(exClient.dest(targetConfiguration));
});

gulp.task('odd:watch', function () {
  gulp.watch(oddPath, gulp.series('odd:deploy'));
});

const componentPaths = [
  '*.html',
  'existdb-dashboard.js',
  'src/**/*.js',
];

gulp.task('deploy:components', function () {
  return gulp
    .src(componentPaths, { base: './' })
    .pipe(exClient.newer(html5TargetConfiguration))
    .pipe(exClient.dest(html5TargetConfiguration));
});

const otherPaths = ['*.xql', 'resources/**/*', 'modules/**/*'];

if (existsSync('templates')) {
  otherPaths.push('templates/**/*');
}
if (existsSync('transforms')) {
  otherPaths.push('transforms/**/*');
}

gulp.task('deploy:other', function () {
  return gulp
    .src(otherPaths, { base: './' })
    .pipe(exClient.newer(targetConfiguration))
    .pipe(exClient.dest(targetConfiguration));
});

gulp.task('deploy', gulp.parallel('deploy:other', 'deploy:components'));

gulp.task('xar', gulp.series('build', function () {
  return gulp.src('build/**/*', { base: 'build' }).pipe(zip(xarName)).pipe(gulp.dest('build'));
}));

gulp.task(
  'install',
  gulp.series('xar', function () {
    return gulp.src(`build/${xarName}`, { encoding: false }).pipe(exClient.install());
  })
);

gulp.task('watch', function () {
  gulp.watch(otherPaths, gulp.series('deploy:other'));
  gulp.watch(componentPaths, gulp.series('deploy:components'));
});

gulp.task('default', gulp.series('watch'));
