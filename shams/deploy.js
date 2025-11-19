// Deployment script for SHAMS application
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting SHAMS deployment...');

// Build frontend
console.log('🔨 Building frontend...');
const frontendBuild = spawn('npm', ['run', 'build'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true
});

frontendBuild.stdout.on('data', (data) => {
  process.stdout.write(data);
});

frontendBuild.stderr.on('data', (data) => {
  process.stderr.write(data);
});

frontendBuild.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Frontend build failed with code', code);
    return;
  }
  
  console.log('✅ Frontend build completed successfully');
  
  // Instructions for running in production
  console.log('\n✅ SHAMS application built successfully!');
  console.log('\nTo run in production mode:');
  console.log('1. Stop any currently running backend server (Ctrl+C in that terminal)');
  console.log('2. Navigate to the backend directory: cd backend');
  console.log('3. Set environment variable: NODE_ENV=production');
  console.log('4. Start the server: node server.js');
  console.log('\nOr on Windows PowerShell:');
  console.log('   $env:NODE_ENV="production"; node server.js');
  console.log('\nThe application will be accessible at http://localhost:5000');
});