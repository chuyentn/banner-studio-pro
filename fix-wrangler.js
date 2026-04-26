import fs from 'fs';
import path from 'path';

// Sanitize the auto-generated wrangler.json in dist/client
// The @cloudflare/vite-plugin dumps ALL wrangler schema fields into this file,
// including many that Cloudflare Pages validation rejects:
//   - "triggers" must have "crons" property (generated as empty {})
//   - dev.enable_containers, dev.generate_types are unknown
//   - python_modules, ai_search, secrets_store_secrets etc. are unsupported
// This script keeps ONLY the fields Cloudflare Pages actually needs.

const wranglerPath = path.resolve('dist/client/wrangler.json');

if (fs.existsSync(wranglerPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));

    // Build a clean config with only the fields Cloudflare Pages accepts
    const clean = {
      name: data.name || 'banner-studio-pro',
      compatibility_date: data.compatibility_date || '2025-09-24',
      compatibility_flags: data.compatibility_flags || [],
      assets: data.assets || { directory: '.' },
    };

    fs.writeFileSync(wranglerPath, JSON.stringify(clean, null, 2));
    console.log('✅ Sanitized dist/client/wrangler.json — kept only valid Pages fields.');
  } catch (error) {
    console.error('❌ Failed to sanitize wrangler.json:', error);
    process.exit(1);
  }
} else {
  console.log('⚠️ dist/client/wrangler.json not found, skipping.');
}
