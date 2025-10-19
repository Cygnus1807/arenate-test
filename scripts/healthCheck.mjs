#!/usr/bin/env node

/**
 * Health check script for the application
 * Verifies configuration and dependencies
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
};

const log = {
  success: (msg) => console.log(`${COLORS.GREEN}✓${COLORS.RESET} ${msg}`),
  error: (msg) => console.log(`${COLORS.RED}✖${COLORS.RESET} ${msg}`),
  warning: (msg) => console.log(`${COLORS.YELLOW}!${COLORS.RESET} ${msg}`),
  info: (msg) => console.log(`${COLORS.BLUE}ℹ${COLORS.RESET} ${msg}`),
};

async function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0], 10);
  
  if (major >= 20) {
    log.success(`Node version ${version} is compatible`);
    return true;
  } else {
    log.error(`Node version ${version} is too old. Requires >= 20.19.0`);
    return false;
  }
}

function checkPackageJson() {
  const pkgPath = resolve(process.cwd(), 'package.json');
  
  if (!existsSync(pkgPath)) {
    log.error('package.json not found');
    return false;
  }
  
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    log.success('package.json is valid');
    
    if (pkg.dependencies && pkg.devDependencies) {
      log.info(`Dependencies: ${Object.keys(pkg.dependencies).length} production, ${Object.keys(pkg.devDependencies).length} dev`);
    }
    
    return true;
  } catch (error) {
    log.error('package.json is invalid JSON');
    return false;
  }
}

function checkNodeModules() {
  const nodeModulesPath = resolve(process.cwd(), 'node_modules');
  
  if (!existsSync(nodeModulesPath)) {
    log.error('node_modules not found. Run: npm install');
    return false;
  }
  
  log.success('node_modules exists');
  return true;
}

function checkEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  const envExamplePath = resolve(process.cwd(), '.env.example');
  
  if (!existsSync(envExamplePath)) {
    log.warning('.env.example not found');
  } else {
    log.success('.env.example exists');
  }
  
  if (!existsSync(envPath)) {
    log.warning('.env.local not found. Copy .env.example and fill in values');
    return false;
  }
  
  try {
    const envContent = readFileSync(envPath, 'utf8');
    const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=');
    const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY=');
    
    if (hasSupabaseUrl && hasSupabaseKey) {
      log.success('.env.local is configured');
      return true;
    } else {
      log.warning('.env.local exists but may be incomplete');
      return false;
    }
  } catch {
    log.error('Could not read .env.local');
    return false;
  }
}

function checkRequiredFiles() {
  const requiredFiles = [
    'index.html',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    'src/main.jsx',
    'src/App.jsx',
  ];
  
  let allExist = true;
  
  for (const file of requiredFiles) {
    const filePath = resolve(process.cwd(), file);
    if (existsSync(filePath)) {
      log.success(`${file} exists`);
    } else {
      log.error(`${file} is missing`);
      allExist = false;
    }
  }
  
  return allExist;
}

async function main() {
  console.log('\n🏥 Running health check...\n');
  
  const checks = [
    { name: 'Node Version', fn: checkNodeVersion },
    { name: 'package.json', fn: checkPackageJson },
    { name: 'node_modules', fn: checkNodeModules },
    { name: 'Environment', fn: checkEnvFile },
    { name: 'Required Files', fn: checkRequiredFiles },
  ];
  
  const results = [];
  
  for (const check of checks) {
    console.log(`\n📋 Checking ${check.name}...`);
    const result = await check.fn();
    results.push({ name: check.name, passed: result });
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:\n');
  
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  
  results.forEach((result) => {
    if (result.passed) {
      log.success(result.name);
    } else {
      log.error(result.name);
    }
  });
  
  console.log(`\n${passed}/${total} checks passed\n`);
  
  if (passed === total) {
    log.success('All checks passed! You\'re ready to develop.');
    process.exit(0);
  } else {
    log.error('Some checks failed. Please fix the issues above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Health check failed:', error);
  process.exit(1);
});
