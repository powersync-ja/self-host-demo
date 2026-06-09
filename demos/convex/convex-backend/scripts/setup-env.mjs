/**
 * Configures JWT_PRIVATE_KEY and JWKS for the self-hosted Convex deployment.
 */
import { spawn } from 'child_process';
import { createPublicKey, generateKeyPairSync } from 'crypto';

/**
 * Convex uses these keys to store JWT auth settings.
 */
const CONVEX_ENV_KEYS = ['JWT_PRIVATE_KEY', 'JWKS'];

// Begin script execution
try {
  await ensureConvexAuthEnv();

  console.log('Convex environment variables configured');
} catch (err) {
  console.error('Failed to set Convex environment variables:', err.message);
  process.exit(1);
}

async function ensureConvexAuthEnv() {
  const existingValues = await Promise.all(CONVEX_ENV_KEYS.map((key) => getConvexEnv(key)));
  if (existingValues.every(Boolean)) {
    console.log('Convex JWT auth is already configured');
    return;
  }

  console.log('Configuring Convex JWT auth...');
  const convexAuthEnv = generateConvexAuthEnv();
  for (const key of CONVEX_ENV_KEYS) {
    await setConvexEnv(key, convexAuthEnv[key]);
  }
  console.log('Convex JWT auth configured');
}

/**
 * Creates a new RSA keypair for auth.
 */
function generateConvexAuthEnv() {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048
  });

  const jwtPrivateKey = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
  const publicJwk = createPublicKey(privateKey).export({ format: 'jwk' });
  publicJwk.alg = 'RS256';
  publicJwk.use = 'sig';

  return {
    JWT_PRIVATE_KEY: jwtPrivateKey,
    JWKS: JSON.stringify({ keys: [publicJwk] })
  };
}

/**
 * Checks the existing Convex settings using the
 * `convex env get` CLI command.
 */
async function getConvexEnv(key) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const convexEnvProcess = spawn('npx', ['convex', 'env', 'get', key], {
      cwd: '/app',
      env: process.env,
      stdio: ['ignore', 'pipe', 'inherit']
    });

    convexEnvProcess.stdout.on('data', (chunk) => chunks.push(chunk));
    convexEnvProcess.once('error', (error) => reject(new Error(`Convex env get ${key} failed`, { cause: error })));
    convexEnvProcess.once('exit', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks).toString('utf8').trim() || undefined);
      } else {
        resolve(undefined);
      }
    });
  });
}

/**
 * Sets Convex env using the `convex env set` CLI command.
 */
async function setConvexEnv(key, value) {
  return new Promise((resolve, reject) => {
    const convexEnvProcess = spawn('npx', ['convex', 'env', 'set', key, '--', value], {
      cwd: '/app',
      env: process.env,
      stdio: 'inherit'
    });

    convexEnvProcess.once('error', (error) => reject(new Error(`Convex env set ${key} failed`, { cause: error })));
    convexEnvProcess.once('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Convex env set ${key} exited with code ${code}`));
      }
    });
  });
}
