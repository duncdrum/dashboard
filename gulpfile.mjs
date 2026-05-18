import gulp from 'gulp';
import { createClient } from '@existdb/gulp-exist';
import zip from 'gulp-zip';
import { promises as fs, existsSync, readFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';

const PRODUCTION = process.env.NODE_ENV === 'production';

console.log('Production? %s', PRODUCTION);

const exClient = createClient({
  host: 'localhost',
  port: '8080',
  path: '/exist/xmlrpc',
  secure: false,
  basic_auth: { user: 'admin', pass: '' }
});

const html5TargetConfiguration = {
  target: '/db/apps/existdb-dashboard',
  html5AsBinary: true
};

const targetConfiguration = {
  target: '/db/apps/existdb-dashboard'
};

function getPackageInfo() {
  const xmlContent = readFileSync('./expath-pkg.xml', 'utf8');
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

gulp.task('clean', async () => {
  await fs.rm('build', { recursive: true, force: true });
});

function copyPackageDist(packagePath, distSubpath = 'dist') {
  return gulp
    .src(`node_modules/${packagePath}/${distSubpath}/**/*`, {
      base: `node_modules/${packagePath}/${distSubpath}`,
      encoding: false
    })
    .pipe(gulp.dest('build/resources/scripts/dist'));
}

gulp.task(
  'copy:scripts',
  gulp.parallel(
    function copyDashboardBundle() {
      return gulp
        .src('dist/dashboard.js', { base: 'dist' })
        .pipe(gulp.dest('build/resources/scripts/dist'));
    },
    () => copyPackageDist('existdb-launcher'),
    () => copyPackageDist('existdb-packagemanager'),
    () => copyPackageDist('@existdb/usermanager'),
    () => copyPackageDist('existdb-backup'),
    function copyRepoElements() {
      return gulp
        .src('node_modules/@existdb/repo-elements/dist/**/*', {
          base: 'node_modules/@existdb/repo-elements/dist',
          encoding: false
        })
        .pipe(gulp.dest('build/resources/scripts/@existdb/repo-elements/dist'));
    },
    function copyLoaders() {
      return gulp
        .src('resources/loaders/*.js', { base: 'resources/loaders' })
        .pipe(gulp.dest('build/resources/scripts/dist'));
    },
    function copyRuntimeDeps() {
      return gulp
        .src(
          [
            'node_modules/lit/**/*.js',
            'node_modules/@lit/**/*.js',
            'node_modules/lit-html/**/*.js',
            'node_modules/lit-element/**/*.js',
            'node_modules/@awesome.me/webawesome/dist/**/*'
          ],
          { base: 'node_modules' }
        )
        .pipe(gulp.dest('build/resources/scripts'));
    }
  )
);

gulp.task('copy:project', () => {
  const projectFiles = [
    '*.xml',
    '*.xql',
    '*.html',
    'icon.png',
    'icon.svg',
    'modules/**/*',
    'resources/**/*',
    '!resources/scripts/dist/**',
    'demo/*.html',
    'test/cypress/**/*',
    '!gulpfile.mjs',
    '!rollup.config.mjs',
    '!vite.config.js',
    '!cypress.config.js',
    '!eslint.config.js'
  ];

  if (existsSync('templates')) {
    projectFiles.push('templates/**/*');
  }
  if (existsSync('transforms')) {
    projectFiles.push('transforms/**/*');
  }

  return gulp.src(projectFiles, { base: '.' }).pipe(gulp.dest('build'));
});

gulp.task('assemble', gulp.series('clean', 'copy:scripts', 'copy:project'));

const deployHtml = ['*.html', 'resources/loaders/*.js'];
const deployScripts = ['dist/dashboard.js', 'resources/styles/**', 'resources/images/**'];

gulp.task(
  'deploy:components',
  gulp.parallel(
    function deployHtmlTask() {
      return gulp
        .src(deployHtml, { base: './' })
        .pipe(exClient.newer(html5TargetConfiguration))
        .pipe(exClient.dest(html5TargetConfiguration));
    },
    function deployDistTask() {
      return gulp
        .src('resources/scripts/dist/**', { base: './', allowEmpty: true })
        .pipe(exClient.newer(html5TargetConfiguration))
        .pipe(exClient.dest(html5TargetConfiguration));
    },
    function deployDashboardBundle() {
      return gulp
        .src('dist/dashboard.js', { base: 'dist' })
        .pipe(exClient.newer(html5TargetConfiguration))
        .pipe(exClient.dest(`${html5TargetConfiguration.target}/resources/scripts/dist`));
    }
  )
);

const otherPaths = ['*.xql', 'modules/**/*', 'resources/images/**', 'resources/styles/**'];

if (existsSync('templates')) {
  otherPaths.push('templates/**/*');
}
if (existsSync('transforms')) {
  otherPaths.push('transforms/**/*');
}

gulp.task('deploy:other', () => {
  return gulp
    .src(otherPaths, { base: './' })
    .pipe(exClient.newer(targetConfiguration))
    .pipe(exClient.dest(targetConfiguration));
});

gulp.task('deploy', gulp.parallel('deploy:other', 'deploy:components'));

gulp.task(
  'xar',
  gulp.series('assemble', function zipXar() {
    return gulp.src('build/**/*', { base: 'build' }).pipe(zip(xarName)).pipe(gulp.dest('build'));
  })
);

gulp.task(
  'install',
  gulp.series('xar', function installXar() {
    return gulp.src(`build/${xarName}`, { encoding: false }).pipe(exClient.install());
  })
);

gulp.task('watch', () => {
  gulp.watch(otherPaths, gulp.series('deploy:other'));
  gulp.watch(
    ['*.html', 'resources/loaders/**', 'dist/dashboard.js', 'src/**'],
    gulp.series('deploy:components')
  );
});

gulp.task('default', gulp.series('watch'));
