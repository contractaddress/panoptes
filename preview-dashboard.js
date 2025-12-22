#!/usr/bin/env bun

// Simple preview script for the Homelab Dashboard
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting Homelab Dashboard Preview...\n');

// Check if dist folder exists
const distPath = join(process.cwd(), 'dist');
if (!existsSync(distPath)) {
  console.log('🔧 Building dashboard first...');
  try {
    execSync('bun run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

console.log('📂 Dashboard built successfully!\n');

// Start the preview server
console.log('🌐 Starting preview server on http://localhost:3000');
console.log('💡 Press Ctrl+C to stop the server\n');

try {
  execSync('bun run preview', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Preview failed:', error.message);
  process.exit(1);
}