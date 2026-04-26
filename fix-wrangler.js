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

  // 3. Create _worker.js that wraps the server with ASSETS fallback
  const workerCode = `import server from './_server/server.js';

export default {
  async fetch(request, env, ctx) {
    try {
      // Let the SSR server handle the request first
      const response = await server.fetch(request, env, ctx);
      // If SSR returns a valid response, use it
      if (response && response.status !== 404) {
        return response;
      }
    } catch (e) {
      // SSR failed, fall through to static assets
    }
    // Fallback: serve static assets via the ASSETS binding
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Not Found', { status: 404 });
  }
};
`;
  fs.writeFileSync(path.join(clientDir, '_worker.js'), workerCode);
  console.log('✅ Created _worker.js with ASSETS fallback');

  // 4. Create _routes.json to optimize routing
  // Exclude static asset paths from the worker to improve performance
  const routesConfig = {
    version: 1,
    include: ['/*'],
    exclude: ['/assets/*'],
  };
  fs.writeFileSync(
    path.join(clientDir, '_routes.json'),
    JSON.stringify(routesConfig, null, 2)
  );
  console.log('✅ Created _routes.json');

  // 5. Ensure .assetsignore excludes server files from static asset serving
  const assetsIgnorePath = path.join(clientDir, '.assetsignore');
  const ignoreEntries = ['wrangler.json', '.dev.vars', '_worker.js', '_server', '_routes.json'];
  fs.writeFileSync(assetsIgnorePath, ignoreEntries.join('\n') + '\n');
  console.log('✅ Updated .assetsignore');
} else {
  console.error('❌ dist/server not found!');
  process.exit(1);
}
