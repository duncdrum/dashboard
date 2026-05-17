import { createWriteStream, readFileSync } from 'fs';
import { rm } from 'fs/promises';
import { join, resolve } from 'path';
import { XMLParser } from 'fast-xml-parser';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

async function parseExpathPkg() {
    const xmlPath = join(rootDir, 'expath-pkg.xml');
    const xmlContent = readFileSync(xmlPath, 'utf-8');
    
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
    });
    
    const result = parser.parse(xmlContent);
    const pkg = result.expath.package;
    
    return {
        name: pkg['@_name'],
        version: pkg['@_version'],
        abbrev: pkg['@_abbrev']
    };
}

async function cleanBuildDir() {
    const buildDir = join(rootDir, 'build');
    await rm(buildDir, { recursive: true, force: true });
}

async function createXar() {
    console.log('Creating XAR package...');
    
    const pkg = await parseExpathPkg();
    const xarName = `${pkg.abbrev || pkg.name}-${pkg.version}.xar`;
    const xarPath = join(rootDir, 'build', xarName);
    
    await cleanBuildDir();
    
    const output = createWriteStream(xarPath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });
    
    return new Promise((resolve, reject) => {
        output.on('close', () => {
            console.log(`XAR created: build/${xarName}`);
            console.log(`Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
            resolve();
        });
        
        archive.on('error', reject);
        archive.pipe(output);
        
        // Include required files
        const includePatterns = [
            '*.xml',
            '*.xql',
            '*.html',
            'icon.png',
            'icon.svg',
            'modules/**/*',
            'resources/**/*',
            'templates/**/*',
            'transforms/**/*'
        ];
        
        // Add files from root
        archive.glob('*.xml', { cwd: rootDir, ignore: ['node_modules/**', 'build/**'] });
        archive.glob('*.xql', { cwd: rootDir });
        archive.glob('*.html', { cwd: rootDir });
        archive.glob('icon.*', { cwd: rootDir });
        archive.glob('modules/**/*', { cwd: rootDir });
        archive.glob('resources/**/*', { cwd: rootDir });
        
        archive.finalize();
    });
}

createXar().catch(err => {
    console.error('Failed to create XAR:', err);
    process.exit(1);
});
