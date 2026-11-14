/**
 * Kids Time Khilgaon - Consolidated DevSecOps Audit Runner
 * Executes Code Quality, Security Scanning, Dependency Audits, and Unit Tests.
 * Generates an automated audit execution summary.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const results = {
  timestamp: new Date().toISOString(),
  steps: []
};

function runStep(name, command) {
  console.log(`\n>>> [AUDIT STEP] ${name}...`);
  console.log(`    Command: ${command}`);
  const startTime = Date.now();
  let status = 'PASSED';
  let output = '';
  
  try {
    output = execSync(command, { cwd: ROOT_DIR, stdio: 'pipe' }).toString();
    console.log(`    Status : PASSED (${((Date.now() - startTime) / 1000).toFixed(1)}s)`);
  } catch (error) {
    status = 'FAILED';
    output = error.stdout ? error.stdout.toString() : (error.message || '');
    console.log(`    Status : FAILED/WARNING (${((Date.now() - startTime) / 1000).toFixed(1)}s)`);
  }

  results.steps.push({
    name,
    command,
    durationMs: Date.now() - startTime,
    status,
    outputSummary: output.slice(-500).trim()
  });

  return { status, output };
}

console.log('='.repeat(75));
console.log('       KIDSTIME KHILGAON - COMPLETE DEVSECOPS FULL AUDIT');
console.log('='.repeat(75));

// 1. Quality Audit
runStep('Code Quality & TypeScript Validation', 'npm run audit:quality');

// 2. Security Audit
runStep('Static Security & RLS Policy Scan', 'npm run audit:security');

// 3. Dependency Audit
runStep('Dependency Vulnerability Audit', 'npm run audit:dependencies');

// 4. Test Suite Execution
runStep('Unit & Component Test Suite', 'npm run test');

// Generate markdown summary
const mdSummary = `# Automated DevSecOps Audit Execution Report

**Execution Timestamp:** ${results.timestamp}  
**Environment:** Next.js 16.2.7 | Node.js | React 19 | Supabase  

## Execution Summary

| Audit Stage | Command | Status | Duration |
|---|---|---|---|
${results.steps.map(s => `| ${s.name} | \`${s.command}\` | **${s.status}** | ${(s.durationMs / 1000).toFixed(1)}s |`).join('\n')}

---

## Detailed Results

${results.steps.map(s => `
### ${s.name}
- **Status:** ${s.status}
- **Command:** \`${s.command}\`
- **Duration:** ${(s.durationMs / 1000).toFixed(2)}s
\`\`\`
${s.outputSummary}
\`\`\`
`).join('\n')}
`;

const reportPath = path.join(ROOT_DIR, 'security', 'FULL_AUDIT_REPORT.md');
fs.writeFileSync(reportPath, mdSummary, 'utf8');

console.log('\n' + '='.repeat(75));
console.log(`Full Audit Complete! Report generated at: ${path.relative(ROOT_DIR, reportPath)}`);
console.log('='.repeat(75));
