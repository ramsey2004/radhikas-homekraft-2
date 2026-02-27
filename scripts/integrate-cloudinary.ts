#!/usr/bin/env node

/**
 * Cloudinary Integration Orchestrator
 * Coordinates image uploads, product creation, and database synchronization
 */

import 'dotenv/config';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface IntegrationStep {
  name: string;
  command: string;
  args: string[];
  description: string;
}

const INTEGRATION_STEPS: IntegrationStep[] = [
  {
    name: 'upload-images',
    command: 'npx',
    args: ['tsx', 'scripts/upload-images-batch-v2.ts'],
    description: '📤 Uploading 30 images to Cloudinary...',
  },
  {
    name: 'create-products',
    command: 'npx',
    args: ['tsx', 'scripts/create-products-from-uploads.ts'],
    description: '🏪 Creating products from uploaded images...',
  },
  {
    name: 'sync-inventory',
    command: 'npx',
    args: ['tsx', 'scripts/sync-cloudinary.ts'],
    description: '🔄 Syncing inventory with database...',
  },
];

interface IntegrationReport {
  startedAt: Date;
  completedAt?: Date;
  steps: Array<{
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    output?: string;
    error?: string;
    duration: number;
  }>;
  overallStatus: 'in-progress' | 'completed' | 'failed';
  summary?: {
    imagesUploaded: number;
    productsCreated: number;
    totalProducts: number;
  };
}

const report: IntegrationReport = {
  startedAt: new Date(),
  steps: INTEGRATION_STEPS.map((step) => ({
    name: step.name,
    status: 'pending',
    duration: 0,
  })),
  overallStatus: 'in-progress',
};

/**
 * Run a single integration step
 */
function runStep(step: IntegrationStep): Promise<boolean> {
  return new Promise((resolve) => {
    const stepReport = report.steps.find((s) => s.name === step.name)!;
    stepReport.status = 'running';

    const startTime = Date.now();

    console.log(`\n${'='.repeat(60)}`);
    console.log(`${step.description}`);
    console.log(`${'='.repeat(60)}\n`);

    const childProcess = spawn(step.command, step.args, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    childProcess.on('close', (code) => {
      stepReport.duration = Date.now() - startTime;

      if (code === 0) {
        stepReport.status = 'completed';
        console.log(
          `\n✅ ${step.name} completed in ${(stepReport.duration / 1000).toFixed(1)}s\n`
        );
        resolve(true);
      } else {
        stepReport.status = 'failed';
        stepReport.error = `Process exited with code ${code}`;
        console.log(
          `\n❌ ${step.name} failed with exit code ${code}\n`
        );
        resolve(false);
      }
    });

    childProcess.on('error', (error) => {
      stepReport.status = 'failed';
      stepReport.error = error.message;
      console.error(`\n❌ Error running ${step.name}:`, error);
      resolve(false);
    });
  });
}

/**
 * Save integration report
 */
async function saveReport() {
  const reportPath = path.join(
    process.cwd(),
    'data',
    `integration-report-${new Date().toISOString().split('T')[0]}.json`
  );

  report.completedAt = new Date();

  const totalDuration = (report.completedAt.getTime() - report.startedAt.getTime()) / 1000;

  await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 INTEGRATION REPORT');
  console.log('='.repeat(60));
  console.log(`Started:    ${report.startedAt.toISOString()}`);
  console.log(`Completed:  ${report.completedAt?.toISOString()}`);
  console.log(`Duration:   ${totalDuration.toFixed(1)}s`);
  console.log('\nSteps:');
  report.steps.forEach((step) => {
    const icon =
      step.status === 'completed'
        ? '✅'
        : step.status === 'failed'
          ? '❌'
          : '⏳';
    console.log(
      `  ${icon} ${step.name.padEnd(20)} ${step.status.toUpperCase().padEnd(12)} (${(step.duration / 1000).toFixed(1)}s)`
    );
  });
  console.log('='.repeat(60));
  console.log(`\n📄 Report saved to: ${reportPath}\n`);
}

/**
 * Main orchestration function
 */
async function main() {
  try {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     🚀 CLOUDINARY INTEGRATION ORCHESTRATOR 🚀           ║');
    console.log('║     Uploading 30 Images & Creating Products             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📋 Integration Steps:');
    INTEGRATION_STEPS.forEach((step, idx) => {
      console.log(`   ${idx + 1}. ${step.description.split('...')[0]}...`);
    });

    // Run each step sequentially
    for (const step of INTEGRATION_STEPS) {
      const success = await runStep(step);

      if (!success) {
        report.overallStatus = 'failed';
        console.log(
          `\n⚠️  Integration stopped at step: ${step.name}`
        );
        break;
      }
    }

    // Mark overall status
    if (report.overallStatus !== 'failed') {
      report.overallStatus = 'completed';
    }

    // Save report
    await saveReport();

    if (report.overallStatus === 'completed') {
      console.log('✨ Integration complete! Your products are ready for sale.\n');
      console.log('📺 Next steps:');
      console.log('   1. Visit https://localhost:3000/products to view your catalog');
      console.log('   2. Check the admin panel for product management');
      console.log('   3. Configure shipping and payment settings\n');
      process.exit(0);
    } else {
      console.log('❌ Integration failed. Check the report for details.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Orchestration error:', error);
    report.overallStatus = 'failed';
    await saveReport();
    process.exit(1);
  }
}

main();
