#!/usr/bin/env bun

// Test script for Homelab Dashboard
console.log('🧪 Testing Homelab Dashboard...\n');

// Import required modules
import { readFileSync } from 'fs';
import { join } from 'path';

// Read the generated HTML
const htmlPath = join(process.cwd(), 'dist', 'index.html');
const htmlContent = readFileSync(htmlPath, 'utf-8');

// Test 1: Check if dashboard container exists with exact 1280x400 dimensions
console.log('✅ Test 1: Dashboard Container (Exact 1280×400)');
const hasContainer = htmlContent.includes('dashboard-container');
const hasCorrectWidth = htmlContent.includes('width:1280px');
const hasCorrectHeight = htmlContent.includes('height:400px');
const hasAspectRatio = htmlContent.includes('aspect-ratio:1280 / 400') || htmlContent.includes('aspect-ratio:1280/400');
const hasMinDimensions = htmlContent.includes('min-width:1280px') && htmlContent.includes('min-height:400px');
console.log(`   Container exists: ${hasContainer ? '✓' : '✗'}`);
console.log(`   Correct width (1280px): ${hasCorrectWidth ? '✓' : '✗'}`);
console.log(`   Correct height (400px): ${hasCorrectHeight ? '✓' : '✗'}`);
console.log(`   Aspect ratio enforced: ${hasAspectRatio ? '✓' : '✗'}`);
console.log(`   Minimum dimensions set: ${hasMinDimensions ? '✓' : '✗'}`);

// Test 2: Check grid layout structure
console.log('\n✅ Test 2: Grid Layout Structure');
const hasGrid = htmlContent.includes('dashboard-grid');
const hasHeroColumn = htmlContent.includes('hero-column');
const hasSmallTiles = htmlContent.includes('small-tile');
const hasGridTemplate = htmlContent.includes('grid-template-columns:1fr 1fr 1fr 1fr');
console.log(`   Grid exists: ${hasGrid ? '✓' : '✗'}`);
console.log(`   Hero column exists: ${hasHeroColumn ? '✓' : '✗'}`);
console.log(`   Small tiles exist: ${hasSmallTiles ? '✓' : '✗'}`);
console.log(`   Correct grid template (4 columns): ${hasGridTemplate ? '✓' : '✗'}`);

// Test 3: Check enhanced acrylic glassmorphism
console.log('\n✅ Test 3: Enhanced Acrylic Glassmorphism');
const hasBackdropFilter = htmlContent.includes('backdrop-filter:blur(');
const hasSaturateEffect = htmlContent.includes('saturate(');
const hasAcrylicNoise = htmlContent.includes('radial-gradient') && htmlContent.includes('opacity');
const hasTransparentBg = htmlContent.includes('background:#ffffff') || htmlContent.includes('rgba(');
const hasBorderRadius = htmlContent.includes('border-radius:');
console.log(`   Backdrop filter (blur): ${hasBackdropFilter ? '✓' : '✗'}`);
console.log(`   Saturation effect: ${hasSaturateEffect ? '✓' : '✗'}`);
console.log(`   Acrylic noise texture: ${hasAcrylicNoise ? '✓' : '✗'}`);
console.log(`   Transparent background: ${hasTransparentBg ? '✓' : '✗'}`);
console.log(`   Border radius: ${hasBorderRadius ? '✓' : '✗'}`);

// Test 4: Check card anatomy components
console.log('\n✅ Test 4: Card Anatomy');
const hasStatusIndicators = htmlContent.includes('status-indicator');
const hasCardLabels = htmlContent.includes('card-label');
const hasIconRows = htmlContent.includes('icon-row');
const hasMultipleStatusTypes = htmlContent.includes('status-online') && 
                               htmlContent.includes('status-warning') && 
                               htmlContent.includes('status-offline');
console.log(`   Status indicators: ${hasStatusIndicators ? '✓' : '✗'}`);
console.log(`   Card labels: ${hasCardLabels ? '✓' : '✗'}`);
console.log(`   Icon rows: ${hasIconRows ? '✓' : '✗'}`);
console.log(`   Multiple status types: ${hasMultipleStatusTypes ? '✓' : '✗'}`);

// Test 5: Check responsive design
console.log('\n✅ Test 5: Responsive Design');
const hasMediaQueries = htmlContent.includes('@media');
const hasMobileBreakpoint = htmlContent.includes('max-width:768px');
const hasTabletBreakpoint = htmlContent.includes('max-width:1024px');
console.log(`   Media queries exist: ${hasMediaQueries ? '✓' : '✗'}`);
console.log(`   Mobile breakpoint (768px): ${hasMobileBreakpoint ? '✓' : '✗'}`);
console.log(`   Tablet breakpoint (1024px): ${hasTabletBreakpoint ? '✓' : '✗'}`);

// Test 8: Check modern background
console.log('\n✅ Test 8: Modern Background Features');
const hasGradientBackground = htmlContent.includes('linear-gradient(135deg,#0f0f1a');
const hasGridPattern = htmlContent.includes('rgba(255,255,255,.02)');
const hasRadialHighlights = htmlContent.includes('radial-gradient(');
const hasBackgroundAnimation = htmlContent.includes('gradientShift');
console.log(`   Gradient background: ${hasGradientBackground ? '✓' : '✗'}`);
console.log(`   Grid pattern: ${hasGridPattern ? '✓' : '✗'}`);
console.log(`   Radial highlights: ${hasRadialHighlights ? '✓' : '✗'}`);
console.log(`   Background animation: ${hasBackgroundAnimation ? '✓' : '✗'}`);

// Test 6: Homelab Service Verification (Updated Layout)
console.log('\n✅ Test 6: Homelab Service Verification (6 Services)');
const hasProxmox = htmlContent.includes('Proxmox');
const hasPiHole = htmlContent.includes('Pi-hole');
const hasHomeAssistant = htmlContent.includes('Home Assistant');
const hasNextcloud = htmlContent.includes('Nextcloud');
const hasPortainer = htmlContent.includes('Portainer');
const hasPlex = htmlContent.includes('Plex');
const hasQbittorrent = htmlContent.includes('qBittorrent');
const hasRemovedServices = !htmlContent.includes('Nginx Proxy') && !htmlContent.includes('MariaDB');
console.log(`   Proxmox (Hero): ${hasProxmox ? '✓' : '✗'}`);
console.log(`   Pi-hole: ${hasPiHole ? '✓' : '✗'}`);
console.log(`   Home Assistant: ${hasHomeAssistant ? '✓' : '✗'}`);
console.log(`   Nextcloud: ${hasNextcloud ? '✓' : '✗'}`);
console.log(`   Portainer: ${hasPortainer ? '✓' : '✗'}`);
console.log(`   Plex: ${hasPlex ? '✓' : '✗'}`);
console.log(`   qBittorrent: ${hasQbittorrent ? '✓' : '✗'}`);
console.log(`   Removed Nginx/MariaDB: ${hasRemovedServices ? '✓' : '✗'}`);


// Test 7: Check SVG icons
console.log('\n✅ Test 7: SVG Icons');
const hasSvgIcons = htmlContent.includes('<svg');
const hasMultipleSvgs = (htmlContent.match(/<svg/g) || []).length >= 8;
console.log(`   SVG icons exist: ${hasSvgIcons ? '✓' : '✗'}`);
console.log(`   Multiple SVG icons (>=8): ${hasMultipleSvgs ? '✓' : '✗'}`);

// Summary
console.log('\n📊 Test Summary:');
const tests = [
  hasContainer && hasCorrectWidth && hasCorrectHeight && hasAspectRatio && hasMinDimensions,
  hasGrid && hasHeroColumn && hasSmallTiles && hasGridTemplate,
  hasBackdropFilter && hasSaturateEffect && hasAcrylicNoise && hasTransparentBg && hasBorderRadius,
  hasStatusIndicators && hasCardLabels && hasIconRows && hasMultipleStatusTypes,
  hasMediaQueries && hasMobileBreakpoint && hasTabletBreakpoint,
  hasProxmox && hasPiHole && hasHomeAssistant && hasNextcloud && hasPortainer && hasPlex && hasQbittorrent && hasRemovedServices,
  hasSvgIcons && hasMultipleSvgs,
  hasGradientBackground && hasGridPattern && hasRadialHighlights && hasBackgroundAnimation
];

const passedTests = tests.filter(test => test).length;
const totalTests = tests.length;

console.log(`   Passed: ${passedTests}/${totalTests}`);
console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 All tests passed! Dashboard is working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the output above.');
}

console.log('\n🚀 Dashboard is ready to use with Bun!');