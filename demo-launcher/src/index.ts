import dotenv from 'dotenv';
import * as jose from 'jose';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

dotenv.config();

// Very basic argument accepting
const outDir = process.argv[2];

const powerSyncPrivateKey = JSON.parse(
  Buffer.from(process.env.POWERSYNC_PRIVATE_KEY!, 'base64').toString()
) as jose.JWK;

// Generates a token for use in an example app.
const launchServer = async () => {
  const powerSyncKey = (await jose.importJWK(powerSyncPrivateKey)) as jose.KeyLike;

  const token = await new jose.SignJWT({})
    .setProtectedHeader({
      alg: powerSyncPrivateKey.alg!,
      kid: powerSyncPrivateKey.kid
    })
    .setSubject('anonymous')
    .setIssuedAt()
    .setIssuer('localhost')
    .setAudience('localhost')
    .setExpirationTime('86400s')
    .sign(powerSyncKey);

  fs.writeFileSync(
    path.join(outDir, '.env'),
    `
NEXT_PUBLIC_POWERSYNC_URL=http://localhost:${process.env.POWERSYNC_PORT}
NEXT_PUBLIC_POWERSYNC_TOKEN=${token}
  `
  );

  console.log('Updated the test token!');

  console.log('Running the server now:');

  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn('pnpm', ['watch'], { stdio: 'pipe', cwd: outDir });

    // Pipe stdout of the child process to the console
    childProcess.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });

    // Pipe stderr of the child process to the console
    childProcess.stderr?.on('data', (data) => {
      process.stderr.write(data);
    });

    // Handle exit of the child process
    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });

    // Handle errors
    childProcess.on('error', (err) => {
      reject(err);
    });
  });
};

launchServer();
