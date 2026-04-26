import fs from 'fs';
import path from 'path';

const wranglerPath = path.resolve('dist/client/wrangler.json');

if (fs.existsSync(wranglerPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));
    
    // Remove invalid triggers
    delete data.triggers;
    
    // Remove invalid top-level fields
    const invalidTopLevelFields = [
      "definedEnvironments",
      "ai_search_namespaces",
      "ai_search",
      "secrets_store_secrets",
      "unsafe_hello_world",
      "flagship",
      "worker_loaders",
      "ratelimits",
      "vpc_services",
      "vpc_networks",
      "python_modules"
    ];
    for (const field of invalidTopLevelFields) {
      delete data[field];
    }
    
    // Remove invalid dev fields
    if (data.dev) {
      delete data.dev.enable_containers;
      delete data.dev.generate_types;
    }

    // Fix absolute paths which break Linux environments
    delete data.configPath;
    delete data.userConfigPath;
    if (data.pages_build_output_dir) {
      data.pages_build_output_dir = ".output";
    }

    fs.writeFileSync(wranglerPath, JSON.stringify(data, null, 2));
    console.log('✅ Sanitized dist/client/wrangler.json for Cloudflare Pages deployment.');
  } catch (error) {
    console.error('Failed to sanitize wrangler.json:', error);
  }
} else {
  console.log('⚠️ dist/client/wrangler.json not found, skipping sanitization.');
}
