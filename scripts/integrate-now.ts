#!/usr/bin/env node

/**
 * Simplified Cloudinary Integration
 * Rapidly generates 30 quality products with Cloudinary images
 */

import 'dotenv/config';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface IntegrationReport {
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed';
  productsCreated: number;
  duration: number;
  steps: {
    name: string;
    status: 'completed' | 'failed';
    duration: number;
  }[];
}

const report: IntegrationReport = {
  startedAt: new Date(),
  status: 'running',
  productsCreated: 0,
  duration: 0,
  steps: [],
};

/**
 * Run product generation
 */
function runProductGeneration(): Promise<boolean> {
  return new Promise((resolve) => {
    const stepStart = Date.now();

    console.log(`\n${'='.repeat(60)}`);
    console.log('🎨 Generating 30 Products with Cloudinary Images...');
    console.log(`${'='.repeat(60)}\n`);

    const childProcess = spawn('npx', ['tsx', 'scripts/generate-30-products.ts'], {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    childProcess.on('close', (code) => {
      const duration = Date.now() - stepStart;
      report.steps.push({
        name: 'generate-products',
        status: code === 0 ? 'completed' : 'failed',
        duration,
      });

      if (code === 0) {
        console.log(
          `\n✅ Product generation completed in ${(duration / 1000).toFixed(1)}s\n`
        );
        resolve(true);
      } else {
        console.log(`\n❌ Product generation failed with exit code ${code}\n`);
        resolve(false);
      }
    });

    childProcess.on('error', (error) => {
      const duration = Date.now() - stepStart;
      report.steps.push({
        name: 'generate-products',
        status: 'failed',
        duration,
      });
      console.error(`\n❌ Error:`, error);
      resolve(false);
    });
  });
}

/**
 * Save report
 */
async function saveReport() {
  const reportPath = path.join(
    process.cwd(),
    'data',
    `cloudinary-integration-${new Date().toISOString().split('T')[0]}.json`
  );

  report.completedAt = new Date();
  report.duration = report.completedAt.getTime() - report.startedAt.getTime();

  await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 CLOUDINARY INTEGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Started:    ${report.startedAt.toISOString()}`);
  console.log(`Completed:  ${report.completedAt?.toISOString()}`);
  console.log(`Total Time: ${(report.duration / 1000).toFixed(1)}s`);
  console.log(`Status:     ${report.status}`);
  console.log('='.repeat(60));
  console.log(`\n📄 Report: ${reportPath}\n`);
}

/**
 * Main orchestration
 */
async function main() {
  try {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     🚀 CLOUDINARY INTEGRATION - RAPID MODE 🚀           ║');
    console.log('║     Generating 30 Premium Products                      ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    // Run product generation
    const success = await runProductGeneration();

    if (success) {
      report.status = 'completed';
      console.log('✨ Cloudinary integration successful!\n');
      console.log('📦 What was created:');
      console.log('   ✅ 5 product categories (Home Decor, Tableware, Textiles, Lighting, Sculptures)');
      console.log('   ✅ 30 handcrafted products with Cloudinary images');
      console.log('   ✅ Realistic pricing, materials, and descriptions');
      console.log('   ✅ Ratings and review counts for social proof');
      console.log('   ✅ Featured products for homepage showcase');
      console.log('\n🎯 Next Steps:');
      console.log('   1. npm run dev              # Start development server');
      console.log('   2. Open http://localhost:3000/products   # Browse products');
      console.log('   3. Visit http://localhost:3000/admin      # Manage inventory');
      console.log('   4. Configure Stripe & Shipping in settings');
      console.log('   5. Deploy to Vercel when ready\n');
    } else {
      report.status = 'failed';
      console.log('❌ Integration failed. Check the logs above for details.\n');
    }

    await saveReport();

    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Orchestration error:', error);
    report.status = 'failed';
    await saveReport();
    process.exit(1);
  }
}

main();
