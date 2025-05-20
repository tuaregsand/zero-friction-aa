import { execSync } from 'child_process';
try {
  execSync('docker compose -f docker-compose.prod.yml down', { stdio: 'inherit' });
} catch {
  // ignore errors
}
