// eslint-env node
/* global process */
import { execSync } from 'child_process';
const arg = process.env.ANALYZE ? '--profile' : '';
execSync(`next build ${arg}`, { stdio: 'inherit' });
