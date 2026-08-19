import { spawnSync } from 'node:child_process';

const paths = ['data/machine', 'version.json', 'llms.txt', 'ai.txt'];
const result = spawnSync('git', ['status', '--porcelain', '--untracked-files=all', '--', ...paths], {
  encoding: 'utf8'
});

if (result.status !== 0) {
  console.error(result.stderr || 'Unable to inspect tracked machine output');
  process.exit(result.status ?? 1);
}

const drift = result.stdout.trim();
if (drift) {
  console.error('Machine-data tracked-output validation failed:');
  console.error(drift);
  console.error('Run npm run generate:machine and commit the exact generated output.');
  process.exit(1);
}

console.log('Machine-data tracked-output validation passed');
