import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, 'dist/client');
const serverDir = path.resolve(__dirname, 'dist/server');

// 1. Sanitize wrangler.json (whitelist only valid fields)
const wranglerPath = path.join(clientDir, 'wrangler.json');
if (fs.existsSync(wranglerPath)) {
  const data = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));
  const clean = {
    name: 'banner-studio-pro',
    main: '_worker.js',
    compatibility_date: data.compatibility_date || '2025-09-24',
    compatibility_flags: ['nodejs_compat'],
    assets: { directory: '.' },
  };
  fs.writeFileSync(wranglerPath, JSON.stringify(clean, null, 2));
  console.log('✅ Sanitized wrangler.json');
}

// 2. Copy server assets into dist/client/_server/
const serverAssetsDir = path.join(serverDir, 'assets');
const targetServerDir = path.join(clientDir, '_server');
const targetAssetsDir = path.join(targetServerDir, 'assets');

if (fs.existsSync(serverDir)) {
  fs.mkdirSync(targetAssetsDir, { recursive: true });

  // Copy server.js
  fs.copyFileSync(
    path.join(serverDir, 'server.js'),
    path.join(targetServerDir, 'server.js')
  );

  // Copy server assets
  if (fs.existsSync(serverAssetsDir)) {
    for (const file of fs.readdirSync(serverAssetsDir)) {
      fs.copyFileSync(
        path.join(serverAssetsDir, file),
        path.join(targetAssetsDir, file)
      );
    }
  }

  // 3. Create _worker.js that re-exports the server entry
  const workerCode = `export { default } from './_server/server.js';\n`;
  fs.writeFileSync(path.join(clientDir, '_worker.js'), workerCode);
  console.log('✅ Created _worker.js → _server/server.js');

  // 4. Ensure .assetsignore excludes server files from static asset serving
  const assetsIgnorePath = path.join(clientDir, '.assetsignore');
  const ignoreEntries = ['wrangler.json', '.dev.vars', '_worker.js', '_server'];
  fs.writeFileSync(assetsIgnorePath, ignoreEntries.join('\n') + '\n');
  console.log('✅ Updated .assetsignore');
} else {
  console.error('❌ dist/server not found!');
  process.exit(1);
}
